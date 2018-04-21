function product_search() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("saleInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("saleTable");
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

document.getElementById('datetime').innerHTML = now();

function isInt(value) {
  return !isNaN(value) &&
         parseFloat(Number(value)) == value &&
         !isNaN(parseFloat(value, 10));
}


function removeSoldRow(sold_row, finalTotalElem) {

    var soldTable = document.getElementById("soldTable");
    soldTable.deleteRow(sold_row.rowIndex);


    var finalTotal = 0;
    var r = 0, row;
    while(row = soldTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('sold_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;
}

function handleSoldItemChangeEvent(sold_row, item_code, finalTotalElem) {

    var new_priceElem = sold_row.getElementsByClassName("sold_price_input_" + item_code)["0"]
    var new_price = new_priceElem.value;
    var quantityElem = sold_row.getElementsByClassName("sold_quantity_input_" + item_code)["0"]
    var quantity = quantityElem.value
    var totalRowElem = sold_row.getElementsByClassName("sold_total_" + item_code)["0"];


    quantity = quantity.replace(/\s+/g, " ");
    quantity = quantity.split(" ");


    // User can set 0 to say, I want to remove this item.
    if (quantity[0] == 0) {
        removeSoldRow(sold_row, finalTotalElem);
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
    var soldTable = document.getElementById("soldTable");
    var r = 0, row;
    while(row = soldTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('sold_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;
}

function handlesaleItemQuantityReEntered(sold_row, item_code, finalTotalElem, new_sale_val) {

    var info_val = sold_row.getAttribute("data-info");
    var info_dict = JSON.parse(info_val);

    sold_row.removeAttribute("data-info");
    info_dict['quantity'] = new_sale_val.join(" ");
    info_val = JSON.stringify(info_dict);
    sold_row.setAttribute('data-info', info_val);

    old_sale_val = info_dict['quantity'];

    var totalRowElem = sold_row.getElementsByClassName("sold_total_" + item_code)["0"];
    var price = sold_row.getElementsByClassName("sold_price_input_" + item_code)["0"].value;
    var newTotal = parseFloat(new_sale_val[0]) * parseFloat(price);
    totalRowElem.textContent = newTotal


    var sold_inputElem = sold_row.getElementsByClassName('sold_quantity_input_' + item_code)["0"];
    sold_inputElem.value = new_sale_val.join("  ");

    var finalTotal = 0;
    var soldTable = document.getElementById("soldTable");
    var r = 0, row;
    while(row = soldTable.rows[r++]) {
        var c = 0, cell;
        while(cell = row.cells[c++]) {
            if (cell.className.startsWith('sold_total_')) {
                finalTotal += parseFloat(cell.textContent);
            }
        }
    }
    console.log(finalTotal);
    finalTotalElem.textContent = finalTotal;


}


function getPriceAsperUnit(sale_val, price, data) {
    var info_dict = JSON.parse(data);
    price_list = info_dict['prices']
    price_list = price_list.split(',');
    var i = 0;
    for (i = 0; i < price_list.length; i++) {
        var p = price_list[i].split('=');
        p[0] = p[0].toUpperCase();
        if (p[0] == sale_val[1]) {
            return p[1] + " /" + p[0];
        }
    }
    return 100000; // Setting it very hight to get notice the issue.
}

function setSolditem(sale_val, item_code, price, data) {


    var soldTable = document.getElementById("soldTable");
    var last_tr = soldTable.getElementsByClassName('total_tr')["0"];
    var last_td = last_tr.getElementsByClassName('total_td')["0"];


    //var itemAlreadyAdded = soldTable.getElementsByClassName('sold_tr_' + item_code);
    //if (itemAlreadyAdded.length > 0) {
    //    handlesaleItemQuantityReEntered(itemAlreadyAdded["0"] , item_code, last_td, sale_val);
    //    return true;
    //}

    var tr = document.createElement("TR");
    data['quantity'] = sale_val.join("  ");
    data = JSON.stringify(data);
    tr.setAttribute('data-info', data);
    tr.className = 'sold_tr_' + item_code;

    var td1 = document.createElement("TD");

    var sold_input = document.createElement("INPUT");
    sold_input.setAttribute("type", "text");
    sold_input.className = 'sold_quantity_input_' + item_code;
    sold_input.size = 7;
    sold_input.addEventListener('focusout', function () {
        handleSoldItemChangeEvent(tr, item_code, last_td);
    });


    sold_input.value = sale_val.join("  ");
    sold_input.style.textAlign = "right";
    td1.append(sold_input);
    tr.append(td1);

    var td2 = document.createElement("TD");
    td2.textContent = item_code;
    tr.append(td2);

    var td3 = document.createElement("TD");
    // td3.textContent = price;
    //tr.append(td3);
    var sold_price_input = document.createElement("INPUT");
    sold_price_input.setAttribute("type", "text");
    sold_price_input.className = 'sold_price_input_' + item_code;
    sold_price_input.size = 8;
    sold_price_input.addEventListener('focusout', function () {
        handleSoldItemChangeEvent(tr, item_code, last_td);
    });
    sold_price_input.value = getPriceAsperUnit(sale_val, price, data);
    sold_price_input.style.textAlign = "left";
    td3.append(sold_price_input);
    tr.append(td3);


    var td4 = document.createElement("TD");
    td4.className = 'sold_total_' + item_code;
    //td4.textContent = parseFloat(price) * parseFloat(sale_val[0]);
    td4.textContent = parseFloat(sold_price_input.value) * parseFloat(sale_val[0]);
    tr.append(td4);

    last_td.textContent = parseFloat(last_td.textContent) + parseFloat(td4.textContent);

    last_tr.before(tr);

}

function saleItemSelected(item_code) {
    var tdElem = document.getElementById(item_code);
    var saleInputElem = tdElem.getElementsByClassName("quantity_input_" + item_code)["0"]
    var sale_val = saleInputElem.value
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

    if (sale_val == '') {
        saleInputElem.style.backgroundColor = "white";
        return true;
    }

    sale_val = sale_val.replace(/\s+/g, " ");
    sale_val = sale_val.split(" ");


    if (sale_val.length == 2) {
        sale_val[1] = sale_val[1].toUpperCase();

        var stock_quantity = parseFloat(info_dict['quantity'], 10);


        if (isInt(sale_val[0])) {

            var sale_quantity = parseFloat(sale_val[0], 10);
            if (sale_quantity <= 0) {
                ret = saleInputElem.value;

            } else if (sale_quantity > stock_quantity) {
                // Validate sale_val quantity not less than in stock.
                ret = 'MAX: ' + info_dict['quantity'];
            }else {

                // Validate sale_val unit
                for (var i = 0; i < valid_units.length; i++) {
                    if (valid_units[i].trim().toUpperCase() == sale_val[1]) {
                        valid_input = true;
                        break;
                    }
                }
            }
        }
    }

    if (valid_input == false) {
        saleInputElem.style.backgroundColor = "yellow";
        saleInputElem.value = ret;
        saleInputElem.focus();
        return false;
    }

    setSolditem(sale_val, item_code, price, info_dict);

    saleInputElem.style.backgroundColor = "white";
    saleInputElem.value = '';


    var objDiv = document.getElementById("soldTableDiv");
    objDiv.scrollTop = objDiv.scrollHeight;

    return true;
    //console.log(sale_val)
    //console.log(price)
    //console.log(info_dict)
}
