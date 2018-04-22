from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
import transaction
from ..models import MyModel
from ..models import Products
from ..models import SaleOrders


# @view_config(route_name='products', renderer='json')
@view_config(route_name='sale', renderer='../templates/sale.jinja2')
def sale(request):

    product_list = []
    err_msg = None

    try:
        query = request.dbsession.query(Products)
        for x in query.all():
            price_str = "".join(x.price.split());
            p = price_str.split(',')[0].split('=')
            p = p[1] + ' /' + p[0]

            d = {'item_code': x.item_code,
                 'price': p,
                 'data': {"wr": x.weight_relationship,
                          "quantity": x.quantity,
                          "prices": price_str}
                }

            product_list.append(d)

    except Exception as err:
        err_msg = str(err)


    return {'result': product_list, 'error': err_msg }

@view_config(route_name='sale_create', renderer='json', request_method='POST')
def sale_create(request):

    ret = {'result': "", 'error': False}
    try:
        payload = request.json
        oh = eval(payload["order_header"])
        oi = payload["order_items"]


        soObj = SaleOrders()
        soObj.order_id = oh["order_id"]
        soObj.customer_name = oh["customer_name"]
        soObj.transport_name = oh["transport_name"]
        soObj.order_date = oh["order_date"]
        soObj.order_items = str(oi)

        request.dbsession.add(soObj)
        request.dbsession.flush()
        request.dbsession.commit()
    except Exception as err:
        ret['result'] = str(err)
        ret['error'] = True

    return ret
