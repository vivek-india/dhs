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

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

//function setSolditem(sale_quantity, item_code, price, data) {
function setSolditem(tdElem) {


    //s = '<tr id="sold_' + item_code +'">';
    //s += '<td class="sold_data_' + item_code + '" data-info="' + data + '" align="left">';
    //s += '<input class="sold_quantity_input_' + item_code + '" type="text" size="7" onfocusout="soldItemSelected("' + item_code + '")"> </td>';
    //s += '<td align="left"> ' + item_code + '</td>';
    //s += '<td class="sold_price_' + item_code + '" align="left">' + price + '</td> </tr>';
    var soldTable = document.getElementById("soldTable");
    var cln = tdElem.cloneNode(true);

    soldTable.append(cln);
}

function saleItemSelected(item_code) {
    var tdElem = document.getElementById(item_code);

    var saleInputElem = tdElem.getElementsByClassName("quantity_input_" + item_code)["0"]
    var sale_val = saleInputElem.value
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

            // Validate sale_val quantity is a number and less than in stock.
            if (sale_quantity > stock_quantity) {
                ret = 'MAX: ' + info_dict['quantity'];
            }else {

                // Validate sale_val unit
                for (var i = 0; i < valid_units.length; i++) {
                    if (valid_units[i].trim().toUpperCase()[0] == sale_val[1].toUpperCase()[0]) {
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

    saleInputElem.style.backgroundColor = "white";
    //setSolditem(sale_quantity, item_code, price, info_val);
    setSolditem(tdElem);
    return true;
    //console.log(sale_val)
    //console.log(price)
    //console.log(info_dict)
}
