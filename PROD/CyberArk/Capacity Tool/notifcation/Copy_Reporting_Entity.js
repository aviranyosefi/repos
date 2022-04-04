var context = nlapiGetContext();
var start_date = '28/11/2021';//MM/DD/YYYY

function Search() {
    try {
        var filters = new Array();
        var s = [];
        var searchid = 0;
        var columns = new Array();

        //var search = nlapiLoadSearch(null, 'customsearch_reporter_alert_missing_for');

        var date = new Date();
        nlapiLogExecution('DEBUG', ' date ', date);
        var formated_start_date = nlapiStringToDate(start_date);
        nlapiLogExecution('DEBUG', 'formated_start_date', formated_start_date);
        if (date >= formated_start_date) {

            var monthAgo = nlapiAddMonths(date, '-1');
            var nextMonth = nlapiAddMonths(date, '1');
            nlapiLogExecution('DEBUG', ' monthAgo: ' + monthAgo, 'nextMonth: ' + nextMonth);
            var prevperiod = currentPeriod(monthAgo);
            var nextperiod = currentPeriod(nextMonth);
            nlapiLogExecution('DEBUG', ' prevperiod: ' + prevperiod, 'nextperiod: ' + nextperiod);

            /*
                    var currentDate = getdate();
                    var currentP = currentPeriod(currentDate);
                    nlapiLogExecution('debug', 'currentDate', currentDate);
                    nlapiLogExecution('debug', 'currentP', currentP);*/


            columns[0] = new nlobjSearchColumn('internalid');
            columns[0].setSort(true);


            filters[0] = new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', prevperiod);
            filters[1] = new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', '2');//2 - forcast
            filters[2] = new nlobjSearchFilter('custrecord_ct_rep_ent_submit_checkbox', null, 'anyof', '1');//1 - submited
            filters[3] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            filters[4] = new nlobjSearchFilter('employeestatus', 'custrecord_ct_rep_ent_employee', 'anyof', '1');//1- active

            var search = nlapiCreateSearch('customrecord_ct_reporting_entity', filters, columns);
            var runSearch = search.runSearch();
            var cols = search.getColumns();

            do {
                var resultslice = runSearch.getResults(searchid, searchid + 1000);
                for (var rs in resultslice) {
                    s.push(resultslice[rs]);
                    searchid++;
                }
            } while (resultslice != null && resultslice.length >= 1000);

            if (s.length > 0) {
                var result = [];
                for (var i = 0; i < s.length; i++) {
                    if (context.getRemainingUsage() < 150) {
                        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                    }
                    result.push({
                        id: s[i].getId(),
                    })
                }

                makeCopy(result, nextMonth, nextperiod);
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function makeCopy(result, nextMonth, nextperiod) {
    nlapiLogExecution('debug', 'results', JSON.stringify(result));
    var formatedDate = nlapiDateToString(nextMonth);
    nlapiLogExecution('debug', formatedDate, nextperiod);

    for (var i = 0; i < result.length; i++) {
        if (context.getRemainingUsage() < 150) {
            nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
        var rec_type = 'customrecord_ct_reporting_entity';
        var copyrecord = nlapiCopyRecord(rec_type, result[i].id);
        copyrecord.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 2);// 2 - not submited
        copyrecord.setFieldValue('custrecord_ct_rep_ent_period', nextperiod);
        copyrecord.setFieldValue('custrecord_ct_acual_id', '');


        var checked = checkCopy(rec_type, result[i].id, nextperiod);
        if (isNullOrEmpty(checked)) {
            var copiedId = nlapiSubmitRecord(copyrecord);
            nlapiLogExecution('debug', 'original record Id: ' + result[i].id, 'copied Id:' + copiedId);
        }
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function toUniqueArray(a) {
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
    return newArr;
}

function getdate() {
    var d = new Date();
    nlapiLogExecution('debug', 'd' + d.typeof(), d);
    d.setHours(d.getHours() + 9)
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    //var auto_lock_actual = nlapiLookupField('customrecord_ct_notif_time_control', 1, 'custrecord_ct_grace_days_actual_reportin');

    var formatdate = [day, month, year].join('/')/* + ' ' + d.toTimeString().substring(0, 8)*/
    return formatdate;
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


function checkCopy(rectype, id, nextperiod) {
    nlapiLogExecution('debug', 'checkCopy', rectype + ' & ' + id);

    var ct_entity_rec = nlapiLoadRecord(rectype, id/*, { recordmode: 'dynamic' }*/);
    var ct_type = ct_entity_rec.getFieldValue('custrecord_ct_rep_ent_type');
    var ct_empl = ct_entity_rec.getFieldValue('custrecord_ct_rep_ent_employee');
    var ct_period = ct_entity_rec.getFieldValue('custrecord_ct_rep_ent_period');

    nlapiLogExecution('debug', 'ct_type ' + ct_type, 'ct_empl ' + ct_empl + ' & ' + ' ct_period ' + ct_period);

    var filters = new Array();
    var s = [];
    var searchid = 0;
    var columns = new Array();

    //var search = nlapiLoadSearch(null, 'customsearch_reporter_alert_missing_for');

    columns[0] = new nlobjSearchColumn('internalid');
    columns[0].setSort(true);


    filters[0] = new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', nextperiod);
    filters[1] = new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', ct_type);
    filters[2] = new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', ct_empl);
    filters[3] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

    var search = nlapiCreateSearch(rectype, filters, columns);
    var runSearch = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s.length > 0) {
        var result = [];
        for (var i = 0; i < s.length; i++) {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }
            result.push({
                id: s[i].getId(),
            })
        }

        nlapiLogExecution('debug', result.length + ' - checkCopy ' + id, JSON.stringify(result));

        return result;
    }
}