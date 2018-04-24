function product_search() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("purchaseInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("purchaseTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function purchased_product_search() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("purchasedInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("purchasedTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}



/*
  #No parameters
  returns a date with this format DD-MM-YYYY
*/
function now()
{
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();

  var output = (day<10 ? '0' : '') + day + "/"
              + (month<10 ? '0' : '') + month + '/'
              + d.getFullYear();

  return output;
}

document.getElementById('today_date').innerHTML = now();

function isInt(value) {
  return !isNaN(value) &&
         parseFloat(Number(value)) == value &&
         !isNaN(parseFloat(value, 10));
}


function removepurchasedRow(purchased_row, finalTotalElem) {

    var purchasedTable = document.getElementById("purchasedTable");
    purchasedTable.deleteRow(purchased_row.rowIndex);


    var finalTotal = 0;
    var r = 0, row;
    while(row = purchasedTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('purchased_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;
}

function handlepurchasedItemChangeEvent(purchased_row, item_code, finalTotalElem) {

    var new_priceElem = purchased_row.getElementsByClassName("purchased_price_input_" + item_code)["0"]
    var new_price = new_priceElem.value;
    var quantityElem = purchased_row.getElementsByClassName("purchased_quantity_input_" + item_code)["0"]
    var quantity = quantityElem.value
    var totalRowElem = purchased_row.getElementsByClassName("purchased_total_" + item_code)["0"];


    quantity = quantity.replace(/\s+/g, " ");
    quantity = quantity.split(" ");


    // User can set 0 to say, I want to remove this item.
    if (quantity[0] == 0) {
        removepurchasedRow(purchased_row, finalTotalElem);
        return true;
    }

    if (quantity.length != 2) {
        quantityElem.style.backgroundColor = "yellow";
        quantityElem.focus();
        return false;
    }

    new_price = new_price.replace(/\s+/g, " ");
    new_price = new_price.split(" ");
    if (new_price.length != 2) {
        new_priceElem.style.backgroundColor = "yellow";
        new_priceElem.focus();
        return false;
    }

    quantity[1] = quantity[1].toUpperCase();
    new_price[1] = new_price[1].toUpperCase();


    if (new_price[1].slice(1) != quantity[1]) { // Unit should be same
        new_priceElem.style.backgroundColor = "yellow";
        new_priceElem.focus();
        return false;
    }
    new_priceElem.style.backgroundColor = "white";

    var newTotal = parseFloat(quantity) * parseFloat(new_price);
    totalRowElem.textContent = newTotal


    var finalTotal = 0;
    var purchasedTable = document.getElementById("purchasedTable");
    var r = 0, row;
    while(row = purchasedTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('purchased_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;
}

function handlepurchaseItemQuantityReEntered(purchased_row, item_code, finalTotalElem, new_purchase_val) {

    var info_val = purchased_row.getAttribute("data-info");
    var info_dict = JSON.parse(info_val);

    purchased_row.removeAttribute("data-info");
    info_dict['quantity'] = new_purchase_val.join(" ");
    info_val = JSON.stringify(info_dict);
    purchased_row.setAttribute('data-info', info_val);

    old_purchase_val = info_dict['quantity'];

    var totalRowElem = purchased_row.getElementsByClassName("purchased_total_" + item_code)["0"];
    var priceElem = purchased_row.getElementsByClassName("purchased_price_input_" + item_code)["0"];
    var price = getPriceAsperUnit(new_purchase_val, "", info_val);
    priceElem.value = price;


    var newTotal = parseFloat(new_purchase_val[0]) * parseFloat(price);
    totalRowElem.textContent = newTotal


    var purchased_inputElem = purchased_row.getElementsByClassName('purchased_quantity_input_' + item_code)["0"];
    purchased_inputElem.value = new_purchase_val.join("  ");

    var finalTotal = 0;
    var purchasedTable = document.getElementById("purchasedTable");
    var r = 0, row;
    while(row = purchasedTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('purchased_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;


}


function getPriceAsperUnit(purchase_val, price, data) {
    var info_dict = JSON.parse(data);
    price_list = info_dict['prices']
    price_list = price_list.split(',');
    var i = 0;
    for (i = 0; i < price_list.length; i++) {
        var p = price_list[i].split('=');
        p[0] = p[0].toUpperCase();
        if (p[0] == purchase_val[1]) {
            return p[1] + " /" + p[0];
        }
    }
    return 100000; // Setting it very hight to get notice the issue.
}

function setpurchaseditem(purchase_val, item_code, price, data) {


    var purchasedTable = document.getElementById("purchasedTable");
    var last_tr = purchasedTable.getElementsByClassName('total_tr')["0"];
    var last_td = last_tr.getElementsByClassName('total_td')["0"];


    var itemAlreadyAdded = purchasedTable.getElementsByClassName('purchased_tr_' + item_code);
    if (itemAlreadyAdded.length > 0) {
        handlepurchaseItemQuantityReEntered(itemAlreadyAdded["0"] , item_code, last_td, purchase_val);
        return true;
    }

    var tr = document.createElement("TR");
    data['quantity'] = purchase_val.join("  ");
    data = JSON.stringify(data);
    tr.setAttribute('data-info', data);
    tr.className = 'purchased_tr_' + item_code;

    var td1 = document.createElement("TD");

    var purchased_input = document.createElement("INPUT");
    purchased_input.setAttribute("type", "text");
    purchased_input.className = 'purchased_quantity_input_' + item_code;
    purchased_input.size = 7;
    purchased_input.addEventListener('focusout', function () {
        handlepurchasedItemChangeEvent(tr, item_code, last_td);
    });


    purchased_input.value = purchase_val.join("  ");
    purchased_input.style.textAlign = "right";
    td1.append(purchased_input);
    tr.append(td1);

    var td2 = document.createElement("TD");
    td2.textContent = item_code;
    tr.append(td2);

    var td3 = document.createElement("TD");
    // td3.textContent = price;
    //tr.append(td3);
    var purchased_price_input = document.createElement("INPUT");
    purchased_price_input.setAttribute("type", "text");
    purchased_price_input.className = 'purchased_price_input_' + item_code;
    purchased_price_input.size = 8;
    purchased_price_input.addEventListener('focusout', function () {
        handlepurchasedItemChangeEvent(tr, item_code, last_td);
    });
    purchased_price_input.value = getPriceAsperUnit(purchase_val, price, data);
    purchased_price_input.style.textAlign = "left";
    td3.append(purchased_price_input);
    tr.append(td3);


    var td4 = document.createElement("TD");
    td4.className = 'purchased_total_' + item_code;
    //td4.textContent = parseFloat(price) * parseFloat(purchase_val[0]);
    td4.textContent = parseFloat(purchased_price_input.value) * parseFloat(purchase_val[0]);
    tr.append(td4);

    last_td.textContent = parseFloat(last_td.textContent) + parseFloat(td4.textContent);

    last_tr.before(tr);

}

function purchaseItemSelected(item_code) {
    var tdElem = document.getElementById(item_code);
    var purchaseInputElem = tdElem.getElementsByClassName("quantity_input_" + item_code)["0"]
    var purchase_val = purchaseInputElem.value
    var price = tdElem.getElementsByClassName("price_" + item_code)["0"].textContent
    var data = tdElem.getElementsByClassName("data_" + item_code)
    var info_val = data["0"].attributes["data-info"].nodeValue
    info_val = info_val.replace(/'/g,'"');
    var info_dict = JSON.parse(info_val);

    var valid_units = [];
    price_list = info_dict['prices'].split(',');
    var i = 0;
    for (i = 0; i < price_list.length; i++) {
        valid_units.push(price_list[i].split('=')[0]);
    }
    //console.log(valid_units);
    var valid_input = false;
    var ret = '2 ' + valid_units;

    if (purchase_val == '') {
        purchaseInputElem.style.backgroundColor = "white";
        return true;
    }

    purchase_val = purchase_val.replace(/\s+/g, " ");
    purchase_val = purchase_val.split(" ");


    if (purchase_val.length == 2) {
        purchase_val[1] = purchase_val[1].toUpperCase();

        var stock_quantity = parseFloat(info_dict['quantity'], 10);


        if (isInt(purchase_val[0])) {

            var purchase_quantity = parseFloat(purchase_val[0], 10);
            if (purchase_quantity <= 0) {
                ret = purchaseInputElem.value;
            }else {

                // Validate purchase_val unit
                for (var i = 0; i < valid_units.length; i++) {
                    if (valid_units[i].trim().toUpperCase() == purchase_val[1]) {
                        valid_input = true;
                        break;
                    }
                }
            }
        }
    }

    if (valid_input == false) {
        purchaseInputElem.style.backgroundColor = "yellow";
        purchaseInputElem.value = ret;
        purchaseInputElem.focus();
        return false;
    }

    setpurchaseditem(purchase_val, item_code, price, info_dict);

    purchaseInputElem.style.backgroundColor = "white";
    purchaseInputElem.value = '';


    var objDiv = document.getElementById("purchasedTableDiv");
    objDiv.scrollTop = objDiv.scrollHeight;

    return true;
    //console.log(purchase_val)
    //console.log(price)
    //console.log(info_dict)
}

function OrderHeader() {

    var customerNameElem = document.getElementById("customer_name");
    this.customerName = customerNameElem.value;

    var orderIdElem = document.getElementById("order_id");
    this.orderId = orderIdElem.value;

    var transportNameElem = document.getElementById("transport_name");
    this.transportName = transportNameElem.value;

    var todayDateElem = document.getElementById("today_date");
    this.todayDate = todayDateElem.textContent;

    this.serialize = function() {
        ret = {"customer_name": this.customerName,
               "order_id": this.orderId,
               "transport_name": this.transportName,
               "order_date": this.todayDate};
        return (JSON.stringify(ret));
    };
}


function OrderItem(purchased_quantity, item_code,
                   purchased_unit_price, purchased_unit_total) {

    this.purchased_quantity = purchased_quantity;
    this.item_code = item_code;
    this.purchased_unit_price = purchased_unit_price;
    this.purchased_unit_total = purchased_unit_total;

    this.serialize = function() {
        ret = {"purchased_quantity": this.purchased_quantity,
               "item_code": this.item_code,
               "purchased_unit_price": this.purchased_unit_price,
               "purchased_unit_total": this.purchased_unit_total};
        return (JSON.stringify(ret));
    };
}

function processOrderForm() {
    var oh = new OrderHeader();
    var orderedItems = [];


    var purchasedTableElem = document.getElementById("purchasedTable");
    tr = purchasedTableElem.getElementsByTagName("tr");
    for (i = 1; i < tr.length-1; i++) {
        td = tr[i].getElementsByTagName("td");

        var purchased_quantity = td["0"].childNodes["0"].value;
        var item_code = td[1].textContent;
        var purchased_unit_price = td[2].childNodes["0"].value;
        var purchased_unit_total = td[3].textContent;

        var oi = new OrderItem(purchased_quantity, item_code,
                               purchased_unit_price, purchased_unit_total);
        orderedItems.push(oi.serialize());
    }

    var orderForm = {"order_header": oh.serialize(),
                     "order_items": orderedItems};

    //console.log(orderForm);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            if (resp["error"] == true) {
                console.log(resp["result"]);
                alert("purchase Order Creation FAILED!!!. Please do manual billing");
            } else {
                alert(resp["result"]);

                var j = tr.length-1;
                for (i = 1; i < j; i++) {
                    tr[1].parentNode.removeChild(tr[1]);
                }
                var last_tr = purchasedTableElem.getElementsByClassName('total_tr')["0"];
                var last_td = last_tr.getElementsByClassName('total_td')["0"];
                last_td.textContent = 0;
            }

            printBill(orderForm);
        }
    };

    xhttp.open("POST", "purchase/create?t=" + Math.random(), true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(orderForm));
}

function printBill(orderForm) {

    var oh = JSON.parse(orderForm["order_header"]);
    var oi = orderForm["order_items"];

    var tbl = document.createElement("TABLE");
    tbl.className = 'printTableStyle';

    var tr = document.createElement("TR");

    var td1 = document.createElement("TD");
    td1.textContent = oh["customer_name"];
    tr.append(td1);

    var td2 = document.createElement("TD");
    td2.textContent = oh["order_id"];
    tr.append(td2);

    var td3 = document.createElement("TD");
    td3.textContent = oh["order_date"];
    tr.append(td3);

    var td4 = document.createElement("TD");
    td4.textContent = oh["transport_name"];
    tr.append(td4);

    tbl.append(tr);

    var i = 0;
    for (i = 0; i < oi.length; i++) {
        var item = JSON.parse(oi[i]);

        var tr = document.createElement("TR");

        var td1 = document.createElement("TD");
        td1.textContent = item["purchased_quantity"];
        tr.append(td1);

        var td2 = document.createElement("TD");
        td2.textContent = item["item_code"];
        tr.append(td2);

        var td3 = document.createElement("TD");
        td3.textContent = item["purchased_unit_price"];
        tr.append(td3);

        var td4 = document.createElement("TD");
        td4.textContent = item["purchased_unit_total"];
        tr.append(td4);

        tbl.append(tr);
    }

    var dv = document.createElement("DIV");
    dv.append(tbl);

    var originalContents = document.body.innerHTML;
    document.body.innerHTML = dv.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
}
