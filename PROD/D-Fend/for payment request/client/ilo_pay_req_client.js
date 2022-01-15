// JavaScript source code
function onclick_payment_request(number) {
    try {
      
        var pmt;
        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        if (number == 1) pmt = rec.getFieldValue('custbody_pmt1')
        else if (number == 2) pmt = rec.getFieldValue('custbody_pmt2')
        else pmt = rec.getFieldValue('custbody_pmt3')

        if (pmt == '' || pmt == null || pmt == undefined) {
            alert("ERROR -  Empty PMT precent field ")
            return false;
        }
        else {
            nlapiLogExecution('debug', 'onclick_payment_request().', 'number: ' + number);
            var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_ilo_pay_req_suitlet', 'customdeployilo_pay_req_suitlet_dep', false);
            createdPdfUrl += '&soid=' + nlapiGetRecordId();
            createdPdfUrl += '&pmt=' + number;
            newWindow = window.open(createdPdfUrl);
        }

    }
    catch (e) {
        nlapiLogExecution('error', 'onclick_payment_request().', e);
    }
}