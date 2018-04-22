from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
)

from .meta import Base


class SaleOrders(Base):
    __tablename__ = 'sale_orders'

    id = Column(Integer, primary_key=True)
    order_id = Column(Text)
    order_date = Column(Text)
    customer_name = Column(Text)
    transport_name = Column(Text)
    order_items = Column(Text)

Index('saleorders_index', SaleOrders.order_id, unique=True, mysql_length=255)
