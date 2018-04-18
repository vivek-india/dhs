from xlrd import open_workbook


class Product(object):

    PRODUCTS_LST = []

    def __init__(self, group_id, item, weighing_units, weight_relationship,
                 initial_stock, price, minimum_threshhold, company):
        self._group_id = group_id
        self._item = item
        self._weighing_units = weighing_units
        self._weight_relationship = weight_relationship
        self._initial_stock = initial_stock
        self._cost = ""
        self._price = price
        self._minimum_threshhold = minimum_threshhold
        self._company = company

    def __str__(self):
        s = ("{} {} {} {} {} {} {} {}"
             .format(self._group_id, self._item,
                     self._weighing_units, self._weight_relationship,
                     self._initial_stock, self._cost, self._price,
                     self._minimum_threshhold, self._company))
        return s

    def sql_str(self):
        s = ("INSERT into products (`group_id`, `item_code`, `weighing_units`, "
             "`weight_relationship`, `quantity`, `cost`, `price`, "
             "`minimum_threshhold`, `company`) VALUES ( "
             "\"{}\", \"{}\",  \"{}\", \"{}\", "
             "\"{}\", \"{}\", \"{}\", \"{}\", \"{}\")\n"
             .format(self._group_id, self._item,
                     self._weighing_units, self._weight_relationship,
                     self._initial_stock, self._cost, self._price,
                     self._minimum_threshhold, self._company))
        return s

    @classmethod
    def create_sql_instances(cls):

        with open('/tmp/product.sql', 'w') as db_fd:
            for prd in cls.PRODUCTS_LST:
                db_fd.write(prd.sql_str())

def handle_create_specific_product(prd_name):

    prd_name = " ".join(prd_name.split())

    wb = open_workbook('Products.xlsx')
    for ws in wb.sheets():
    
        prev_s = ''
        for curr_row in xrange(1, ws.nrows):
            s = ws.cell_value(curr_row, 0)
            if s:
                prev_s = s
            else:
                s = prev_s

            s = " ".join(s.split())
            if prd_name in s:
                lst = [s]
                for curr_col in xrange(1, ws.ncols):
                    lst.append(str(ws.cell_value(curr_row, curr_col)))

                prd = Product(*lst)
                Product.PRODUCTS_LST.append(prd)

    Product.create_sql_instances()


def handle_create_all():

    wb = open_workbook('Products.xlsx')
    for ws in wb.sheets():
    
        prev_s = ''
        for curr_row in xrange(1, ws.nrows):
            s = ws.cell_value(curr_row, 0)
            if s:
                prev_s = s
            else:
                s = prev_s

            s = " ".join(s.split())
            lst = [s]
            for curr_col in xrange(1, ws.ncols):
                lst.append(str(ws.cell_value(curr_row, curr_col)))

            prd = Product(*lst)
            Product.PRODUCTS_LST.append(prd)

    Product.create_sql_instances()
