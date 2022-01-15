var CurrStatus = nlapiGetFieldValue('approvalstatus');
function printButton() {
    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_proforma_print_suitlet', 'customdeploy_proforma_print_suitlet_dep', false);
            createdPdfUrl += '&id=' + nlapiGetRecordId();
           
            window.open(createdPdfUrl);
   
}

function pageLoad() {
    var cb = nlapiGetFieldValue('custbody_unv_proforma_invoice_');
    if (cb == 'T') {
        nlapiDisableField('approvalstatus', true);
    }
}

function fieldChange(type, name) {
    if (name == 'custbody_unv_proforma_invoice_') {
        var cb = nlapiGetFieldValue('custbody_unv_proforma_invoice_');
        if (cb == 'F') {
            nlapiDisableField('approvalstatus', false);
        }
        else {
            nlapiDisableField('approvalstatus', true);
        }
    }  
    return true;              
}

function saveRecord() {

    var status = nlapiGetFieldValue('approvalstatus');
    var proforma_invoice = nlapiGetFieldValue('custbody_unv_proforma_invoice_');
    if (status == 2 && proforma_invoice == 'T' && status != CurrStatus) {
        alert("Can't approved the invoice"); return false;
    }
    return true;
}
