from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from ..models import MyModel
from ..models import Product

#from dhs.yang import product
import jsonpickle


@view_config(route_name='products', renderer='json')
# @view_config(route_name='products', renderer='../templates/products.jinja2')
def products(request):
    # p = product.product()
    # p.name = 'productt'
    # p.vendor_name = 'vendorr'

    query = request.dbsession.query(Product)
    print query.all()
    # one = query.filter(MyModel.name == 'test').first()

    return {'result': [{'A': 1}, {'B': 2}], 'error': None }
