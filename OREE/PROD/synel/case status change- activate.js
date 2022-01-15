// JavaScript source code
function scheduleStatusChange() {
    var today = new Date();
    today.setHours(today.getHours() + 10)
    nlapiLogExecution('DEBUG', 'today = ' + today, '');
    var hour = today.getHours();
    todayStr = nlapiDateToString(today);

    var res = specialDaysSearch(today)
    if (res != -1) {
        if (res.type == '3') {
            nlapiLogExecution('DEBUG', today + '- holiday no status change needed ', '');
        }
        else {
            /*if (res[0].startTime.indexOf('pm') > 0) {
               hourforcheck = parseFloat(res[0].endTime) + 12;
           }
           else {
               hourforcheck = parseFloat(res[0].endTime);
           }*/
            hourforcheck = parseFloat(res[0].endTime);
            if (hour == hourforcheck) {
                casesRes = casesSearch();
                if (casesRes != -1) {
                    for (i = 0; i < casesRes.length; i++) {
                        try {
                            nlapiSubmitField('supportcase', casesRes[i].Id, 'status', casesRes[i].oldstatus);
                            nlapiSubmitField('supportcase', casesRes[i].Id, 'custevent_old_status', casesRes[i].status);
                            nlapiLogExecution('DEBUG', today + '- case: ' + casesRes[i].caseNumber + ' old status: ' + casesRes[i].statusName, 'new status: ' + casesRes[i].oldstatusName);
                        }
                        catch (e) {
                            nlapiLogExecution('debug', 'error with rec: ', casesRes[i].caseNumber);
                            nlapiLogExecution('debug', 'exception:  ', e);
                            continue;
                        }
                    }
                }
                else {
                    nlapiLogExecution('DEBUG', today + '- there is no cases for status change  ', '');
                }
            }
            else {
                nlapiLogExecution('DEBUG', today + '-special day ', hour + ' - is not the start time');
            }
        }
    }
    else {
        nlapiLogExecution('DEBUG', 'no special day ', '');
        casesRes = casesSearch();
        if (casesRes != -1) {
            for (i = 0; i < casesRes.length; i++) {
                try {
                    nlapiSubmitField('supportcase', casesRes[i].Id, 'status', casesRes[i].oldstatus);
                    nlapiSubmitField('supportcase', casesRes[i].Id, 'custevent_old_status', casesRes[i].status);
                    nlapiLogExecution('DEBUG', today + '- case: ' + casesRes[i].casesNumber + ' old status: ' + casesRes[i].statusName, 'new status: ' + casesRes[i].oldstatusName);
                }
                catch (e) {
                    nlapiLogExecution('debug', 'error with rec: ', casesRes[i].casesNumber);
                    nlapiLogExecution('debug', 'exception:  ', e);
                    continue;
                }
            }
        }
        else {
            nlapiLogExecution('DEBUG', today + '- there is no cases for status change  ', '');
        }
    }
}


function specialDaysSearch(today) {
    var search = nlapiLoadSearch(null, 'customsearch_special_days_search');
    var s = [];
    var Results = [];

    search.addFilter(new nlobjSearchFilter('custrecord_sd_date', null, 'on', today));
    var searchid = 0;
    var resultset = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                Id: s[i].getValue("internalid"),
                type: s[i].getValue("custrecord_sd_type"),
                startTime: s[i].getValue('custrecord_sd_start_time'),
                endTime: s[i].getValue('custrecord_sd_end_time'),
            }
        }
    }
    if (Results.length > 0) {
        return Results;
    }
    else {
        return -1;
    }
}

function casesSearch() {
    var search = nlapiLoadSearch(null, 'customsearch_cases_to_reopen');
    var s = [];
    var Results = [];

    var searchid = 0;
    var resultset = search.runSearch();
    var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                caseNumber: s[i].getValue("casenumber"),
                Id: s[i].getValue("internalid"),
                status: s[i].getValue('status'),
                statusName: s[i].getText('status'),
                oldstatus: s[i].getValue('custevent_old_status'),
                oldstatusName: s[i].getText('custevent_old_status'),
            }
        }
    }
    if (Results.length > 0) {
        return Results;
    }
    else {
        return -1;
    }
}