function case_online(type) {

    if (type == 'create') {
        if (nlapiGetContext().getExecutionContext() == '') 
            nlapiLogExecution('debug', 'nlobjContext.getExecutionContext()', nlapiGetContext().getExecutionContext());
        rec = nlapiLoadRecord('supportcase', nlapiGetRecordId())
        var email = rec.getFieldValue('email');
        if (email != '') {
            var emp = getEmpByEmail(email)
            if (emp != '') {
                rec.setFieldValue('company', emp)
                rec.setFieldValue('form', 101)
                nlapiSubmitRecord(rec)
            }
        }
    }
}
function getEmpByEmail(email) {

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
    return ''

}