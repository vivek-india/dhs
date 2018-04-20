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

function setSolditem(sale_val, item_code, price, data) {

    var soldTable = document.getElementById("soldTable");

    var tr = document.createElement("TR");

    var td1 = document.createElement("TD");
    td1.id = 'sold_data_' + item_code
    td1.setAttribute('data-info', data);

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
    td3.textContent = price;
    tr.append(td3);

    var td4 = document.createElement("TD");
    td4.textContent = parseInt(price) * parseInt(sale_val[0]);
    tr.append(td4);

    var last_tr = soldTable.getElementsByClassName('total_tr')["0"];
    var last_td = last_tr.getElementsByClassName('total_td')["0"];
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

    setSolditem(sale_val, item_code, price, info_val);

    saleInputElem.style.backgroundColor = "white";
    saleInputElem.value = '';
    return true;
    //console.log(sale_val)
    //console.log(price)
    //console.log(info_dict)
}
