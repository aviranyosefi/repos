var context = nlapiGetContext();
var createdIDS = [];
var rec_type = 'customrecord_ct_reporting_entity';
function CopyActual() {
    try {
        var today = new Date(); 
        var todayStr = nlapiDateToString(today)
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        var lastDayStr = nlapiDateToString(lastDay)
        nlapiLogExecution('DEBUG', ' today: ' + todayStr, 'lastDay: ' + lastDayStr);
        if (todayStr == lastDayStr) { 
            var prevMonth =  nlapiAddMonths(today, '-1');
            nlapiLogExecution('DEBUG', ' prevMonth: ' + prevMonth, 'today: ' + today);
            var prevperiod = currentPeriod(prevMonth);
            var nextperiod =  currentPeriod(today);
            nlapiLogExecution('DEBUG', ' prevperiod: ' + prevperiod, 'nextperiod: ' + nextperiod);
            var result = getActualList(prevperiod);
            makeCopy(result, nextperiod);
            nlapiLogExecution('debug', 'createdIDS ' + createdIDS.length, createdIDS);
        }             
    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

//Copy Actual Records
function getActualList(prevperiod) {

    var search = nlapiLoadSearch(null, 'customsearch_copy_acual_records');
    search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', prevperiod));
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    var res = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    for (var i = 0; i < s.length; i++) {
            res.push(s[i].id);
    }
    return res;
}

function makeCopy(result, nextperiod) {
    nlapiLogExecution('debug', 'result ' + result.length, JSON.stringify(result));
    for (var i = 0; i < result.length; i++) {
        try {
            checkContext(context)                  
            var copyrecord = nlapiCopyRecord(rec_type, result[i]);
            copyrecord.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 2);// 2 - not submited
            copyrecord.setFieldValue('custrecord_ct_rep_ent_period', nextperiod);
            var AcualID = nlapiSubmitRecord(copyrecord, null, true); 
            //nlapiLogExecution('debug', 'NEW ACUAL ID:', AcualID);
            if (AcualID != -1) {
                createdIDS.push(AcualID)
            }
        } catch (e) {
            nlapiLogExecution('ERROR', 'LINE: ' + i + ' result[i]:' + result[i], e);
        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function currentPeriod(date) {

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'onorafter', nlapiDateToString(firstDay));
    filters[1] = new nlobjSearchFilter('isyear', null, 'is', 'F');
    filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');
    filters[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', nlapiDateToString(lastDay));


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var s = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (s != null && s.length > 0) {
        return s[0].getValue('internalid')
    }
    return '';
}
function checkContext(context) {
    if (context.getRemainingUsage() < 150) {
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
}
