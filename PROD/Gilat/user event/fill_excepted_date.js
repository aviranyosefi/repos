var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function fill_excepted_date() {
    try {
        var soRec = null;
        nlapiLogExecution('debug', 'nlapiGetRecordId()', nlapiGetRecordId())
        var bd_succeeded = nlapiGetFieldValue('custbody_bd_succeeded');
        if (bd_succeeded == 'T') {
            var itemsLineCount = nlapiGetLineItemCount('item');
            var createdfrom = nlapiGetFieldValue('createdfrom');
            if (!isNullOrEmpty(createdfrom)) {
                soRec = nlapiLoadRecord('salesorder', createdfrom);
                var SoitemsLineCount = soRec.getLineItemCount('item');
            }
            var expected_date_calc = null;
            for (var line = 1; line <= itemsLineCount; line++) {
                var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', line)
                if (itemreceive == 'T') {
                    var ff_orderline = nlapiGetLineItemValue('item', 'orderline', line);
                    for (var soLine = 1; soLine <= SoitemsLineCount; soLine++) {
                        var so_line = soRec.getLineItemValue('item', 'line', soLine);
                        if (ff_orderline == so_line) {
                            var expected_date = soRec.getLineItemValue('item', 'custcol_billing_date_rev_rec', soLine);
                            if (isNullOrEmpty(expected_date)) {
                                var billing_date = soRec.getLineItemValue('item', 'custcol_billing_date', soLine);
                                if (!isNullOrEmpty(billing_date)) {
                                    var arlocked = getAccountingPeriodByName(getPeriod(billing_date));
                                    if (arlocked == 'F') {
                                        expected_date_calc = billing_date
                                    }
                                    else {
                                        expected_date_calc = getAccountingPeriodsArOpen();
                                    }
                                    nlapiSetLineItemValue('item', 'custcol_billing_date_rev_rec', line, expected_date_calc);
                                    soRec.setLineItemValue('item', 'custcol_billing_date_rev_rec', soLine, expected_date_calc);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (soRec != null) {
            nlapiSubmitRecord(soRec);
        }
   
    } catch (e) {
        nlapiLogExecution('error', 'fill_excepted_date id: ' + nlapiGetRecordId, e)
    }
}
function getPeriod(date) {

    date = nlapiStringToDate(date);
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    return months[mm] + ' ' + yyyy;

}
function getAccountingPeriodByName(name) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('periodname', null, 'is', name );

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('arlocked');
    columns[1] = new nlobjSearchColumn('internalid');

    var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (searchresults != null) {

        return searchresults[0].getValue('arlocked')
    }

    return '';
}
function getAccountingPeriodsArOpen() {
   
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('arlocked', null, 'is', 'F');
    filters[1] = new nlobjSearchFilter('isyear', null, 'is', 'F');
    filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');
    

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('startdate').setSort();

    var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (searchresults != null) {
        return searchresults[0].getValue('startdate')
    }
    return '';
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}