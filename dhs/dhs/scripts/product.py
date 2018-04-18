from xlrd import open_workbook
import pymysql.cursors


class Product(object):

    PRODUCTS_LST = []
    EXISTING_ITMS = []

    def __init__(self, group_id, item, weighing_units, weight_relationship,
                 initial_stock, price, minimum_threshhold, company):
        self._group_id = group_id
        self._item_code = item
        self._weighing_units = weighing_units
        self._weight_relationship = weight_relationship
        self._initial_stock = initial_stock
        self._cost = ""
        self._price = price
        self._minimum_threshhold = minimum_threshhold
        self._company = company

    def __str__(self):
        s = ("{} {} {} {} {} {} {} {}"
             .format(self._group_id, self._item_code,
                     self._weighing_units, self._weight_relationship,
                     self._initial_stock, self._cost, self._price,
                     self._minimum_threshhold, self._company))
        return s

    def sql_str(self):
        s = ("INSERT into products (`group_id`, `item_code`, `weighing_units`, "
             "`weight_relationship`, `quantity`, `cost`, `price`, "
             "`minimum_threshhold`, `company`) VALUES ( "
             "\"{}\", \"{}\",  \"{}\", \"{}\", "
             "\"{}\", \"{}\", \"{}\", \"{}\", \"{}\")"
             .format(self._group_id, self._item_code,
                     self._weighing_units, self._weight_relationship,
                     self._initial_stock, self._cost, self._price,
                     self._minimum_threshhold, self._company))
        return s

    @classmethod
    def create_item_in_db(cls):
        pass
        #with open('/tmp/product.sql', 'w') as db_fd:
        #    for prd in cls.PRODUCTS_LST:
        #        db_fd.write(prd.sql_str())

        # Connect to the database
        connection = pymysql.connect(host='localhost',
                                     user='root',
                                     password='cloud123',
                                     db='dhs_db',
                                     charset='utf8mb4',
                                     cursorclass=pymysql.cursors.DictCursor)

        try:
            with connection.cursor() as cursor:
                for prd in Product.PRODUCTS_LST:
                    cursor.execute(prd.sql_str())
                    connection.commit()
        finally:
            connection.close()

    @classmethod
    def read_items_from_db(cls):
        Product.EXISTING_ITMS
        # Connect to the database
        connection = pymysql.connect(host='localhost',
                                     user='root',
                                     password='cloud123',
                                     db='dhs_db',
                                     charset='utf8mb4',
                                     cursorclass=pymysql.cursors.DictCursor)

        try:
            with connection.cursor() as cursor:
                sql = "SELECT item_code FROM products"
                cursor.execute(sql)
                result = cursor.fetchall()
                for val in result:
                    Product.EXISTING_ITMS.append(val['item_code'])
        finally:
            connection.close()

    @classmethod
    def update_users (cls):
        new_prds = [ x._item_code for x in Product.PRODUCTS_LST]
        pre_created = list(set(new_prds).intersection(set(Product.EXISTING_ITMS)))
        tobe_created = list(set(new_prds) - set(Product.EXISTING_ITMS))

        with open('/tmp/product_tobe_created', 'w') as fd:
            for val in tobe_created:
                fd.write(val + '\n')

        with open('/tmp/product_already', 'w') as fd:
            for val in pre_created:
                fd.write(val + '\n')

        print ("Total number of already created Items: {}\n"
               "Total number of to be created Items: {}\n"
               "REFER: \n"
               "\t/tmp/product_already to find already created items\n"
               "\t/tmp/product_tobe_created to find new items to be created"
               .format(len(pre_created), len(tobe_created)))

        Product.PRODUCTS_LST = [ prd for prd in Product.PRODUCTS_LST
                                    if prd._item_code in tobe_created ]



def handle_create(prd_name):

    if prd_name:
        prd_name = " ".join(prd_name.split())

    wb = open_workbook('Products.xlsx')
    for ws in wb.sheets():
        prev_s = ''
        for curr_row in xrange(1, ws.nrows):
            lst = ws.row_values(curr_row)
            if len(lst) <= 0:
                continue

            if lst[0]:
                prev_s = lst[0]
            else:
                lst[0] = prev_s

            if prd_name:
                if prd_name in lst[0]:
                    prd = Product(*lst)
                    Product.PRODUCTS_LST.append(prd)
            else:
                prd = Product(*lst)
                Product.PRODUCTS_LST.append(prd)


    Product.read_items_from_db()
    Product.update_users()
    Product.create_item_in_db()
