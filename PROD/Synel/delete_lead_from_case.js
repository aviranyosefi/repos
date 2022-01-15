function afterSubmitCase() {
    try {

        var recID = nlapiGetRecordId();
        var rec = nlapiLoadRecord('supportcase', recID);      
        var origin = rec.getFieldValue('origin')
        if (origin == "5") {
            var email = rec.getFieldValue('email')
            var empId = getEmp(email);
            var lead = getLead(email)
            if (empId != 0 && empId != -1) {             
                rec.setFieldValue('company', empId);
            }
            else {
                rec.setFieldValue('company', 40203);
            }
            nlapiSubmitRecord(rec, null, true);
            nlapiLogExecution('debug', 'lead', lead);
            if (lead != 0 && lead != -1) {
                var leadRec = nlapiLoadRecord('lead', lead);
                leadRec.setFieldValue('isinactive', 'T');
                leadRec.setFieldValue('firstname', 'לא');
                leadRec.setFieldValue('lastname', 'רלוונטי');
                nlapiSubmitRecord(leadRec, null, true);
            }    
        }
     
    } catch (e) {
        nlapiLogExecution('ERROR', 'error', e);
    }
}

function getEmp(email) {
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('email', null, 'is', email)

    var search = nlapiCreateSearch('employee', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length >0) {
        return s[0].id
    }
    return 0;
}
function getLead(email) {
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('email', null, 'is', email)

    var search = nlapiCreateSearch('lead', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null && s.length > 0) {
        return s[0].id
    }
    return 0;
}