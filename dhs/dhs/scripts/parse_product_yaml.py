import glob
import yaml
import json
import jinja2


class ProductParser(object):

    def __init__(self, yaml_dict):
        self._name = yaml_dict['name']
        self._nickname = yaml_dict['nick_name']
        self._props_dict = yaml_dict['properties']
        self._properties = []
        for ky, val in yaml_dict['properties'].iteritems():
            self._properties.insert(val['position'], ky)
            
        self._instances = yaml_dict['instances']

    def parse_instances(self):
        self.validate_instances()
        self.set_id()
        #self.show_instances()
        self.generate_excel()
        self.generate_pyramid_model()
        self.generate_pyramid_view()
        self.create_instances()

    def validate_instances(self):

        for v in self._instances:
            # print ("{}".format(v.keys()))
            if set(v.keys()) != set(self._properties):
                raise ValueError("keys in instance: {} is different than "
                                 "keys in properties: {}"
                                 .format(v.keys(), self._properties))

    def set_id(self):
        # Set key
        for v in self._instances:
            _id = v['key']['value']

            s = ''
            if _id == 'auto':
                s += self._nickname
                for k in self._properties[1:]:
                    s += '-' + k + v[k]['value']
                v['key']['value'] = s
                v['key']['display_name'] = s

    def show_instances(self):

        for v in self._instances:
            s = ''
            for ky, val in v.iteritems():
                s += ky + ": " + str(val)
            print ("{}".format(s))

    def generate_excel(self):
        import xlsxwriter
        # Create a workbook and add a worksheet.
        workbook = xlsxwriter.Workbook('Products.xlsx')
        worksheet = workbook.add_worksheet()

        ROW = 0

        for v in self._instances:
            COL = 0
            for ky in self._properties:
                # print ("{}".format(v[ky]['display_name']))
                worksheet.write(ROW, COL,     v[ky]['display_name'])
                COL += 1
            ROW += 1

        workbook.close()

    def generate_pyramid_model(self):
        # Check if Model already Created
        print self._name
        props = []
        for v in self._properties:
            props.append({'name': v, 'type': self._props_dict[v]['type']})
            props.append({'name': v + '_display_name', 'type': 'Text'})

        s = '''from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    String,
    Float,
)

from .meta import Base


class {{class_name}}_cls(Base):
    __tablename__ = '{{class_name}}'

    id = Column(Integer, primary_key=True)
    {% for p in props %}
    {{p.name}} = Column({{p.type}})
    {% endfor %}

Index('{{class_name}}_index', {{class_name}}_cls.key, unique=True, mysql_length=255)
		'''
        t = jinja2.Template(s)
        config = t.render(class_name=self._name, props=props)
        # print config
        with open('../models/' + self._name + '.py', 'w') as fd:
		    fd.write(config)



    def generate_pyramid_view(self):

        s = '''from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError

from ..models import {{class_name}}

import jsonpickle


@view_config(route_name='{{class_name}}_view', renderer='json')
def {{class_name}}_view(request):

    query = request.dbsession.query({{class_name}}.{{class_name}}_cls)
    print query.all()

    return {'result': [{'A': 1}, {'B': 2}], 'error': None }
        '''

        t = jinja2.Template(s)
        config = t.render(class_name=self._name)
        #print config

        with open('../views/' + self._name + '.py', 'w') as fd:
		    fd.write(config)

    def create_instances(self):

        with open('/tmp/' + self._name + '.sql', 'w') as db_fd:
            for inst in self._instances:
                value_lst = []


                s = 'INSERT into ' + self._name + ' ('
                for v in self._properties:
                    s += '`' + v + '`, `' + v + '_display_name`, '

                    if self._props_dict[v]['type'].lower() == 'text':
                        value_lst.append('"' + inst[v]['value'] + '"')
                    else:
                        value_lst.append(inst[v]['value'])

                    value_lst.append('"' + inst[v]['display_name'] + '"')
                s = s[:-2] + ') VALUES ('

                for val in value_lst:
                    s += val + ', '

                s = s[:-2] + ');\n'
                # print s
                db_fd.write(s)
        print ("Execute below from command line to create instances of {}\n"
               "\tcat /tmp/{}.sql | while read line; do mysql -uroot "
               "-pcloud123 dhs_db -e  \"$line\"; done\n"
               "\t-----------------------------------------------------\n"
               .format(self._name, self._name))




def generate_pyramid_route():

    s = '''def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('products', '/products')
    {% for rt in route_views %}
    config.add_route('{{rt}}_view', '/{{rt}}_view')
    {% endfor %}
    '''

    route_views = [ f[:-5] for f in glob.glob('products/*.yaml')]
    route_views = [ rv.split('/')[1] for rv in route_views ]
    # print route_views

    t = jinja2.Template(s)
    config = t.render(route_views=route_views)
    # print config

    with open('../routes.py', 'w') as rt_fd:
        rt_fd.write(config)
    
if __name__ == "__main__":
    # Generate import list
    with open('../models/lst_products.py', 'w') as lst_fd:
        for filename in glob.glob('products/*.yaml'):

            with open(filename, 'r') as fd:
                try:
                    d = yaml.load(fd)
                    # json_string = json.dumps(d)
                    # print json_string
                    pp = ProductParser(d)

                    pp.parse_instances()
                    lst_fd.write('from ..models.' + pp._name + ' import ' + pp._name + '_cls\n')
                except yaml.YAMLError as exc:
                    print(exc)
    generate_pyramid_route()

    # Create Tables
    from subprocess import call
    call(["../../venv/bin/initialize_dhs_db", "../../development.ini"])
