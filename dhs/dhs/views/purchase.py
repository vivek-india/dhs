from pyramid.response import Response
from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from ..models import MyModel
from ..models import Products
from ..models.kabja_lory import kabja_lory_cls
from ..models.kabja_isi import kabja_isi_cls
from ..models.kabja_premium import kabja_premium_cls
from ..models.kabja_ss_size import kabja_ss_size_cls
from ..models.roofing_bolt import roofing_bolt_cls
from ..models.kabja_langada import kabja_langada_cls
from ..models.kanti_jaradi import kanti_jaradi_cls
from ..models.kabja_ss import kabja_ss_cls
from ..models.kabja_dilli import kabja_dilli_cls
from ..models.kanti_moti import kanti_moti_cls
from ..models.kanti_agra import kanti_agra_cls
from ..models.kanti_china import kanti_china_cls
from ..models.kabja_patthar import kabja_patthar_cls
from ..models.carriage_bolt import carriage_bolt_cls
from ..models.hex_bolt import hex_bolt_cls
from ..models.chaukor_nut import chaukor_nut_cls
from ..models.kabja_six_feet import kabja_six_feet_cls
from ..models.j_bolt import j_bolt_cls
from ..models.bolt_pipe import bolt_pipe_cls
from ..models.kabja_non_isi import kabja_non_isi_cls
from ..models.kanti_number import kanti_number_cls
from ..models.nut import nut_cls
from ..models.mota_nut import mota_nut_cls
from ..models.kabja_bolt import kabja_bolt_cls
from ..models.kanti_button import kanti_button_cls
from ..models.cheera_bolt import cheera_bolt_cls


@view_config(route_name='purchase', renderer='../templates/purchase.jinja2')
def purchase(request):

    product_list = []
    err_msg = None

    try:
        query = request.dbsession.query(Products)
        for x in query.all():
            pt = x.product_table.replace("_", "-")

            prd = eval(x.product_table+'_cls')
            prd_query = request.dbsession.query(prd)

            for y in prd_query.all():
                product_list.append(y.key)

            #product_list.append(pt)

    except Exception as err:
        err_msg = str(err)


    return {'result': product_list, 'error': err_msg }
