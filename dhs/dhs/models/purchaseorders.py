from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
)

from .meta import Base


class PurchaseOrders(Base):
    __tablename__ = 'purchase_orders'

    id = Column(Integer, primary_key=True)
    order_id = Column(Text)
    order_date = Column(Text)
    customer_name = Column(Text)
    transport_name = Column(Text)
    order_items = Column(Text)

Index('purchaseorders_index', PurchaseOrders.order_id, unique=True, mysql_length=255)
