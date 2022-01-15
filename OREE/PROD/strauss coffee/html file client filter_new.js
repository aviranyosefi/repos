function sethtml() {
    try {

        //document.getElementById("companyname").disabled = "true";
        document.getElementById("custevent_customer_list").onchange = setclient;
        document.getElementById('main_form').style.margin = "50px";
        document.getElementById('main_form').dir = "rtl"
        document.getElementById('main_form').style.float = "right";
        document.getElementById('div__header').style.padding = "10px 30% 20px 30%";
        document.getElementById('__enclosingtable').style.padding = "10px 27% 20px 10%";
        document.getElementsByClassName('table_fields')[0].cellSpacing = "7px";
        document.getElementsByClassName('pt_title')[0].style.padding = "7px"
        document.getElementById("email").value = "general@gmail.com";
        document.getElementById("email").style.visibility = "hidden";
        document.getElementById("email_fs_lbl").style.visibility = "hidden";
        //document.getElementById("resetter").style.visibility = "hidden";
        submitter = document.getElementById('submitter')
        submitter.value = '  בצע  '
        submitter.style.fontSize = "22px"


        var titles = document.getElementsByClassName('smalltextnolink');
        for (i = 0; i < titles.length; i++) {
            titles[i].align = "right";
            titles[i].style.fontSize = "15px";
        }

        select = document.getElementById('custevent_customer_list')

        elem = document.createElement("input")
        elem.placeholder = "חפש..";
        elem.id = 'myinput';


        elem.onkeyup = function () {
            var input, filter, ul, li, a, i;
            input = document.getElementById("myinput");
            filter = input.value;
            div = document.getElementById("custevent_customer_list");
            a = div.getElementsByTagName("option");
            for (i = 0; i < a.length; i++) {
                txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.indexOf(filter) > -1) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            }
        };

        select.insertAdjacentElement('beforeBegin', elem);


        intp = document.getElementsByTagName('INPUT');

        for (i = 1; i < 6; i++) {
            intp[i].style.height = "17px";
            intp[i].size = 55;
        }

        intp[0].style.height = "16.5px";

        x = document.getElementById('custevent_customer_list');

        x.style.height = "20.6px";

        imeg = document.getElementsByTagName('IMG');
        imeg[0].style.height = "150px";
        imeg[0].style.width = "300px";
        imeg[0].parentElement.align = "center";


    }
    catch (e) { }

}

function setclient() {
    if ((document.getElementById("custevent_customer_list").options[document.getElementById("custevent_customer_list").selectedIndex].text.indexOf(':')) > -1) {
        cust = document.getElementById("custevent_customer_list").options[document.getElementById("custevent_customer_list").selectedIndex].text;
        custNum = cust.substring(0, cust.indexOf(' '));
        custson = cust.substring(cust.indexOf(':') + 1, cust.length);
        newcust = custNum + custson;
        document.getElementById("companyname").value = newcust;
    }
    else {
        document.getElementById("companyname").value = document.getElementById("custevent_customer_list").options[document.getElementById("custevent_customer_list").selectedIndex].text;
    }

}


function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myinput");
    filter = input.value;
    div = document.getElementById("custevent_customer_list");
    a = div.getElementsByTagName("option");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}