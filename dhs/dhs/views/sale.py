from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from ..models import MyModel
from ..models import Products


# @view_config(route_name='products', renderer='json')
@view_config(route_name='sale', renderer='../templates/sale.jinja2')
def sale(request):

    product_list = []
    err_msg = None

    try:
        query = request.dbsession.query(Products)
        for x in query.all():
            d = {'item_code': x.item_code,
                 'price': x.price,
                 'data': {"wu": x.weighing_units,
                          "wr": x.weight_relationship,
                          "quantity": x.quantity}
                }

            product_list.append(d)

    except Exception as err:
        err_msg = str(err)


    return {'result': product_list, 'error': err_msg }
