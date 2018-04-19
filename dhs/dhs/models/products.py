from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
)

from .meta import Base


class Products(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    group_id = Column(Text)
    item_code = Column(Text)
    weighing_units = Column(Text)
    weight_relationship = Column(Text)
    quantity = Column(Text)
    cost = Column(Text)
    price = Column(Text)
    minimum_threshhold = Column(Text)
    company = Column(Text)

Index('product_index', Products.item_code, unique=True, mysql_length=255)
