function sethtml() {
    try {
        document.getElementById('main_form').style.margin = "50px";
        document.getElementById('main_form').dir = "rtl"
        document.getElementById('main_form').style.float = "right";
        document.getElementById('div__header').style.padding = "10px 30% 20px 30%";
        document.getElementById('__enclosingtable').style.padding = "10px 27% 20px 10%";
        document.getElementsByClassName('table_fields')[0].cellSpacing = "10px";
        document.getElementsByClassName('pt_title')[0].style.padding = "7px"
        submitter = document.getElementById('submitter')
        submitter.value = '  שלח  '
        submitter.style.fontSize = "20px"
        document.getElementsByClassName('uir-header-buttons')[0].align = 'center'
        nlapiGetField('companyname').setDisplayType('disabled');


        var titles = document.getElementsByClassName('smalltextnolink');
        for (i = 0; i < titles.length; i++) {
            titles[i].align = "right";
            titles[i].style.fontSize = "15px";
        }

        var sele = document.getElementsByTagName('select')
        for (i = 1; i < sele.length; i++) {
            sele[i].style.height = "17px";
            sele[i].style.width = '600px'
        }

        customer_display = document.getElementById('custevent_dangot_customer_display');
        customer_display.style.height = "20.6px";
        //customer_display.style.width = "580px";

        imeg = document.getElementsByTagName('IMG');
        imeg[0].style.height = "110px";
        imeg[0].style.width = "300px";
        imeg[0].parentElement.align = "center";

        //inputStyle()


    }
    catch (e) { }
}
function fieldChange(type, name) {
    if (name == 'custevent_dangot_customer') {
        debugger;
        var val = nlapiGetFieldValue('custevent_dangot_customer');
        if (val != '') {                
            setCustomer(val);
        }
    }
}
function setCustomer(val) {
    var customer = document.getElementById('custevent_dangot_customer_display');
    var ValName = customer.value;
    customer = ValName.substring(ValName.indexOf(' '), ValName.length).trim();
    nlapiSetFieldValue('companyname', customer)
    nlapiSetFieldValue('custevent_hidden_company_ext', val)
    
}
function inputStyle() {
    var serial = document.getElementById('custevent_non_registered_serial')
    serial.style.width = '600px'
    var inputreq = document.getElementsByClassName('inputreq')
    for (i = 0; i < inputreq.length; i++) {
        inputreq[i].style.width = '600px'
    }
}