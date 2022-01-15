function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var recType = nlapiGetRecordType();
        form.setScript('customscript_foreign_currencies_client'); // client script id
        if (recType == 'customerpayment') {
            var scenario_type = nlapiGetFieldValue('custbody_scenario_type');                 
            if (isNullOrEmpty(scenario_type)) {
                form.addButton('custpage_button_print', 'Sort Payment', 'sort()');
                form.addButton('custpage_button_print', 'Storno', 'storno()');
  
            }
        }
        //else if (recType == 'vendorpayment') {
        //    var status = nlapiGetFieldValue('status')
        //    if (status != 'Voided' && !Checkapply()) {
        //        form.addButton('custpage_button_print', 'Invoice in different currency', 'Currency()');

        //    }
            
        //}
    }  
}

function Checkapply() {
    try {
       
        var Count = nlapiGetLineItemCount('apply')
        for (var j = 1; j <= Count; j++) {
            if (nlapiGetLineItemValue('apply', 'apply', j) == 'T') {
                return true;
            }
        }
        return false;

    } catch (e) {
        nlapiLogExecution('DEBUG', 'error Checkapply', e);
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

