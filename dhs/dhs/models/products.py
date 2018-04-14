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

    product_table = Column(Text)



Index('product_index', Products.product_table, unique=True, mysql_length=255)
