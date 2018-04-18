from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from ..models import MyModel
from ..models import Products

# @view_config(route_name='products', renderer='json')
@view_config(route_name='products', renderer='../templates/products.jinja2')
def products(request):

    product_list = []
    err_msg = None

    try:
        query = request.dbsession.query(Products)
        for x in query.all():
            product_list.append(x.item_code)

    except Exception as err:
        err_msg = str(err)


    return {'result': product_list, 'error': err_msg }
