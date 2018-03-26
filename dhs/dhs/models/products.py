from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
)

from .meta import Base


class Product(Base):
    __tablename__ = 'product'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    vendor_name = Column(Text)
    min_threshhold = Column(Integer)
    max_threshhold = Column(Integer)
    property_count = Column(Integer)
    property_1_name = Column(Text)
    property_1_value = Column(Text)
    property_1_unit = Column(Text)

    property_2_name = Column(Text)
    property_2_value = Column(Text)
    property_2_unit = Column(Text)

    property_3_name = Column(Text)
    property_3_value = Column(Text)
    property_3_unit = Column(Text)

    property_4_name = Column(Text)
    property_4_value = Column(Text)
    property_4_unit = Column(Text)

    property_5_name = Column(Text)
    property_5_value = Column(Text)
    property_5_unit = Column(Text)

    property_6_name = Column(Text)
    property_6_value = Column(Text)
    property_6_unit = Column(Text)

    property_7_name = Column(Text)
    property_7_value = Column(Text)
    property_7_unit = Column(Text)

    property_8_name = Column(Text)
    property_8_value = Column(Text)
    property_8_unit = Column(Text)

    property_9_name = Column(Text)
    property_9_value = Column(Text)
    property_9_unit = Column(Text)

Index('product_index', Product.name, unique=True, mysql_length=255)
