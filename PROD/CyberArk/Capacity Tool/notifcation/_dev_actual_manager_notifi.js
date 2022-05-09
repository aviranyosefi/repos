var context = nlapiGetContext();
var managersList = [];
var managerEmailId = '50'
var linkToSystem = nlapiResolveURL('SUITELET', 'customscript_dev_ct_su', 'customdeploy_dev_ct_su');
var due_date = getdate('date'); // TODO -1 DAY
var due_date_obj = nlapiStringToDate(due_date);
var periodid = currentPeriod(due_date_obj);
var periodname = nlapiLookupField('accountingperiod', periodid, 'periodname');
var fromId = 33;//NetSuite Integration
var subjectYear = getdate('year')
var ct_guide_link = nlapiLookupField('customrecord_ct_notif_time_control', 1, 'custrecord_ct_guide_link');
var mounthList = {
    "Jan": {
        "name": "January"
    },
    "Feb": {
        "name": "February"
    },
    "Mar": {
        "name": "March"
    },
    "Apr": {
        "name": "April"
    },
    "May": {
        "name": "May"
    },
    "Jun": {
        "name": "June"
    },
    "Jul": {
        "name": "July"
    },
    "Aug": {
        "name": "August"
    },
    "Sep": {
        "name": "September"
    },
    "Oct": {
        "name": "October"
    },
    "Nov": {
        "name": "November"
    },
    "Dec": {
        "name": "December"
    }


}

function actualManagerNotifi() {
    try { 
        getReportersAssessmentsStatus('customsearch_notification_manager_2')
        getReportersOwnAssessments('customsearch_actual_notification_manager')
        sentManagerEmails();
    } catch (e) {

    }
    
}
//Reporters Assessments Status (not submitted) - manager
function getReportersAssessmentsStatus(searchId) {
    var search = nlapiLoadSearch(null, searchId);
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    for (var i = 0; i < s.length; i++) {
        var emp = s[i].getValue("custentity_ct_tool_reporter", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", "GROUP");
        var reporter=  nlapiLookupField ('employee', emp, ['custentity_ct_tool_reporter' , 'altname'])
        addReportesListName(reporter.custentity_ct_tool_reporter, reporter.altname) 
    }
    
}
//Reporters Own Assessments (not submitted) - manager
function getReportersOwnAssessments(searchId) {

    var search = nlapiLoadSearch(null, searchId);
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    for (var i = 0; i < s.length; i++) {
        var reporter = s[i].getValue("custentity_ct_tool_reporter", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", "GROUP");
        var name = s[i].getValue("altname", "CUSTRECORD_CT_REP_ENT_EMPLOYEE", "GROUP");
        addReportesListName(reporter, name) 
    }
}

function sentManagerEmails() {
    
    var keys = Object.keys(managersList)
    nlapiLogExecution('DEBUG', 'sentManagerEmails keys ' + keys.length, JSON.stringify(keys));

    for (var i = 0; i < managersList.length; i++) {
        try {
            checkContext(context)
            var emp = keys[i];
            if (isNullOrEmpty(emp)) continue;

            var manager = managersList[emp].manager;
            var names = managersList[emp].names;
            sendManagerEmail(manager, names)

        } catch (e) {
            nlapiLogExecution('error', 'emp: ' + emp, e);
            continue;
        }
    }
}
function sendManagerEmail(manager, names) {
    try {
        var manager_altname = nlapiLookupField('employee', manager, 'altname');
        var emailMerger = nlapiCreateEmailMerger(managerEmailId);
        var mergeResult = emailMerger.merge();
        var msg = mergeResult.getBody();
        msg = msg.replace('[[ReporterS_Manager_Name]]', manager_altname);
        msg = msg.replace('[[Due_Date]]', due_date);

        msg = msg.replace('[[Link_2_System]]', '<a href="' + linkToSystem + '"> LINK </a>');
        msg = msg.replace('[[Link_2_Guide]]', '<a href="' + ct_guide_link + '"> LINK </a>');

        msg = msg.replace('[[names]]', names);

        var sbj = mergeResult.getSubject();
        sbj = sbj.replace('[[Year]]', subjectYear);
        sbj = sbj.replace('[[Period]]', getFullMounth(periodname));
        nlapiSendEmail(fromId, manager, sbj, msg);

    } catch (e) {
        nlapiLogExecution('error', 'sendManagerEmail manager: ' + managere);
    }

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
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getdate(format) {
    var d = new Date();
    d.setHours(d.getHours() + 9)
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    var auto_lock_actual = nlapiLookupField('customrecord_ct_notif_time_control', 1, 'custrecord_ct_grace_days_actual_reportin');
    auto_lock_actual = auto_lock_actual - 1;

    var formatdate = [auto_lock_actual, month, year].join('/')/* + ' ' + d.toTimeString().substring(0, 8)*/
    if (format == 'date')
        return formatdate;
    if (format == 'year')
        return year;
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
function getFullMounth(periodname) {
    periodname = periodname.slice(0, 3);
    return mounthList[periodname].name
}
function addReportesListName(reporter , name) {
    if (managersList[reporter] != undefined) {
        var ListName = managersList[reporter].names
        if (ListName.indexOf(name) == -1) {
            ListName = ListName + ', ' + name
        }   
    }
    else {
        ListName =  name
    }
    managersList[reporter] = ({
        manager: reporter,
        names: ListName
    });
}
