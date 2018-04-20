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
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function handleSoldItemEvent(item_code) {
    console.log(item_code);
}

function handleSoldItemPriceChangeEvent(sold_row, item_code, finalTotalElem) {

    var info_val = sold_row.getAttribute("data-info");
    var info_dict = JSON.parse(info_val);
    console.log(info_dict['price']);

    var orig_price = parseInt(info_dict['price']);
    var new_price = sold_row.getElementsByClassName("sold_price_input_" + item_code)["0"].value;
    var quantity = sold_row.getElementsByClassName("sold_quantity_input_" + item_code)["0"].value
    var totalRowElem = sold_row.getElementsByClassName("sold_total_" + item_code)["0"];

    origTotal = parseInt(quantity) * parseInt(orig_price);
    newTotal = parseInt(quantity) * parseInt(new_price);
    totalRowElem.textContent = newTotal

    sold_row.removeAttribute("data-info");
    info_dict['price'] = new_price;
    info_val = JSON.stringify(info_dict);
    sold_row.setAttribute('data-info', info_val);


    var origFinalTotal = parseInt(finalTotalElem.textContent)
    var newFinalTotal = origFinalTotal - origTotal + newTotal
    finalTotalElem.textContent = newFinalTotal
}


function setSolditem(sale_val, item_code, price, data) {


    var soldTable = document.getElementById("soldTable");
    var last_tr = soldTable.getElementsByClassName('total_tr')["0"];
    var last_td = last_tr.getElementsByClassName('total_td')["0"];


    var itemAlreadyAdded = soldTable.getElementsByClassName('sold_tr_' + item_code);
    if (itemAlreadyAdded.length > 0) {
        return true;
    }

    var tr = document.createElement("TR");
    data['price'] = price;
    data = JSON.stringify(data);
    tr.setAttribute('data-info', data);
    tr.className = 'sold_tr_' + item_code;

    var td1 = document.createElement("TD");

    var sold_input = document.createElement("INPUT");
    sold_input.setAttribute("type", "text");
    sold_input.className = 'sold_quantity_input_' + item_code;
    sold_input.size = 7;
    sold_input.onfocusout = handleSoldItemEvent;
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
    sold_price_input.size = 7;
    //sold_price_input.onfocusout = handleSoldItemPriceChangeEvent;
    sold_price_input.addEventListener('focusout', function () {
        handleSoldItemPriceChangeEvent(tr, item_code, last_td);
    });
    sold_price_input.value = parseInt(price);
    sold_price_input.style.textAlign = "left";
    td3.append(sold_price_input);
    tr.append(td3);


    var td4 = document.createElement("TD");
    td4.className = 'sold_total_' + item_code;
    td4.textContent = parseInt(price) * parseInt(sale_val[0]);
    tr.append(td4);

    last_td.textContent = parseInt(last_td.textContent) + parseInt(td4.textContent);

    last_tr.before(tr);

}

function saleItemSelected(item_code) {
    var tdElem = document.getElementById(item_code);

    var saleInputElem = tdElem.getElementsByClassName("quantity_input_" + item_code)["0"]
    var sale_val = saleInputElem.value

    if (sale_val == '') {
        saleInputElem.style.backgroundColor = "white";
        return true;
    }

    sale_val = sale_val.replace(/\s+/g, " ");
    sale_val = sale_val.split(" ");

    var price = tdElem.getElementsByClassName("price_" + item_code)["0"].textContent

    var data = tdElem.getElementsByClassName("data_" + item_code)
    var info_val = data["0"].attributes["data-info"].nodeValue
    info_val = info_val.replace(/'/g,'"');
    var info_dict = JSON.parse(info_val);

    var valid_units = info_dict['wu'].split(',');
    var stock_quantity = parseInt(info_dict['quantity'], 10);
    var ret = '2 ' + valid_units;
    var valid_input = false;

    if (sale_val.length == 2) {

        if (isInt(sale_val[0])) {

            var sale_quantity = parseInt(sale_val[0], 10);
            if (sale_quantity <= 0) {
                ret = saleInputElem.value;

            } else if (sale_quantity > stock_quantity) {
                // Validate sale_val quantity not less than in stock.
                ret = 'MAX: ' + info_dict['quantity'];
            }else {

                // Validate sale_val unit
                for (var i = 0; i < valid_units.length; i++) {
                    if (valid_units[i].trim().toUpperCase() == sale_val[1].toUpperCase()) {
                        valid_input = true;
                        break;
                    }
                }
            }
        }
    }

    if (valid_input == false) {
        saleInputElem.style.backgroundColor = "yellow"
        saleInputElem.value = ret;
        saleInputElem.focus();
        return false;
    }

    setSolditem(sale_val, item_code, price, info_dict);

    saleInputElem.style.backgroundColor = "white";
    saleInputElem.value = '';
    return true;
    //console.log(sale_val)
    //console.log(price)
    //console.log(info_dict)
}
