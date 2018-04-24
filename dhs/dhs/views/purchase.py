from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from dhs.utils import unit_utils as ut
from ..models import MyModel
from ..models import Products
from ..models import PurchaseOrders


# @view_config(route_name='products', renderer='json')
@view_config(route_name='purchase', renderer='../templates/purchase.jinja2')
def purchase(request):

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

@view_config(route_name='purchase_create', renderer='json', request_method='POST')
def purchase_create(request):

    ret = {'result': "", 'error': False}
    payload = request.json
    oh = eval(payload["order_header"])
    oi = payload["order_items"]

    try:
        soObj = PurchaseOrders()
        soObj.order_id = oh["order_id"]
        soObj.customer_name = oh["customer_name"]
        soObj.transport_name = oh["transport_name"]
        soObj.order_date = oh["order_date"]
        soObj.order_items = str(oi)

        request.dbsession.add(soObj)
    except Exception as err:
        ret['result'] = str(err)
        ret['error'] = True
        return ret

    # Order is saved now update invetory

    try:
        for item in oi:
            item = eval(item)
            rcvd_item_code = item["item_code"]
            purchased_quantity = item["purchased_quantity"]

            query = request.dbsession.query(Products)
            prd = query.filter(Products.item_code == rcvd_item_code).first()
            utObj = ut.UnitUtils(prd.weight_relationship)
            prd.quantity = utObj.add(prd.quantity, purchased_quantity)

    except Exception as err:
        ret['result'] = str(err)
        ret['error'] = True
        return ret

    ret['result'] = "Order-ID: " + oh["order_id"] + " SUCCESSFUL"
    return ret
