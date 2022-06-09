function updateIB() {
    try {
        //var context = nlapiGetContext();
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var caseId = rec.getFieldValue('custrecord_sp_related_case')


        var res = getSparParts(caseId)
        nlapiLogExecution('debug', 'res ' + res.length, JSON.stringify(res));
        updateIBList(res);

    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}
function updateIBList(res) {
    //nlapiLogExecution('debug', 'res res ' + res.length, JSON.stringify(res));
    for (var m = 0; m < res.length; m++) {
        try { 
            var ibRec = nlapiLoadRecord('customrecord_ib', res[m].ib);
            ibRec.setFieldValue('custrecord_ib_item', res[m].item);
            var serial_not_found = res[m].serial_not_found
            var serial_s_val = res[m].registered_serial
            if (serial_not_found == 'F') {
                serial_s_val = res[m].serial;
                ibRec.setFieldValue('custrecord_ib_serial_number', res[m].serial_id); // list
            }
            ibRec.setFieldValue('custrecord_ib_serial_number_s', serial_s_val); // text
            nlapiSubmitRecord(ibRec, null, true);
            nlapiLogExecution('debug', ' ibId: ' + res[m].ib, 'serial_s_val: ' + serial_s_val);
        } catch (e) {
            nlapiLogExecution('error', 'error to update IB: ' + res[m].ib, e);
        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getSparParts(caseID) {

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_issued_item'));
    columns.push(new nlobjSearchColumn('custrecord_sp_ib_to_replace'));
    columns.push(new nlobjSearchColumn('custrecord_sp_serial_number'));
    columns.push(new nlobjSearchColumn('custrecord_sp_serial_not_found'));
    columns.push(new nlobjSearchColumn('custrecord_sp_non_registered_serial'));
    
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sp_related_case', null, 'anyof', caseID)
    filters[1] = new nlobjSearchFilter('custrecord_sp_action_type', null, 'anyof', ["2", "3"])
    filters[2] = new nlobjSearchFilter('custrecord_sp_ib_to_replace', null, 'noneof', ["@NONE@"])

    //filters[2] = new nlobjSearchFilter('custrecord_sp_incorrect_reporting', null, 'is', 'F')

    var search = nlapiCreateSearch('customrecord_spare_parts', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    for (var i = 0; i < s.length; i++) {
        results.push({
            item: s[i].getValue('custrecord_issued_item'),
            ib: s[i].getValue('custrecord_sp_ib_to_replace'),
            serial: s[i].getText('custrecord_sp_serial_number'),
            serial_id: s[i].getValue('custrecord_sp_serial_number'),
            serial_not_found: s[i].getValue('custrecord_sp_serial_not_found'),
            registered_serial: s[i].getValue('custrecord_sp_non_registered_serial'),
        });
    }
    //nlapiLogExecution('debug', 'results ' + results.length, JSON.stringify(results));
    return results;

}
