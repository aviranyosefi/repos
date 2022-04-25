var context = nlapiGetContext();
function Search() {

    //var today = new Date().getDate();
    //if (today == 1 || today == '01') {

        var filters = new Array();
        var s = [];
        var searchid = 0;
        var columns = new Array();

        // CT First Working day of the Month
        var search = nlapiLoadSearch(null, 'customsearchct_first_working_day_of_the');
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
                    id: s[i].id
                    /*name: s[i].getText('entity', null, "GROUP"),
                    balanceUsd: s[i].getValue(cols[3])*/
                })
            }
        }
        sentEmail(result);

    //}
  
}

function sentEmail(searchresults) {

    nlapiLogExecution('DEBUG', 'serach result ', JSON.stringify(searchresults));

    var emailMerger = nlapiCreateEmailMerger('46');

    for (var key in searchresults) {
        try {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }
            var emp = searchresults[key];

            emailMerger.setEntity('employee', emp.id);
            var mergeResult = emailMerger.merge();
            var msg = mergeResult.getBody();

            //var rep_id = nlapiLookupField('employee', emp.id, 'custentity_ct_tool_reporter');
            var altname = nlapiLookupField('employee', emp.id, 'altname');
            msg = msg.replace('[[Reporter_Name]]', altname);
            msg = msg.replace('[[Due_Date]]', getdate());
            var linkToSystem = nlapiResolveURL('SUITELET', 'customscript_dev_ct_su', 'customdeploy_dev_ct_su');
            var ct_guide_link = nlapiLookupField('customrecord_ct_notif_time_control', 1, 'custrecord_ct_guide_link');
            msg = msg.replace('[[Link_2_System]]', '<a href="' + linkToSystem + '"> LINK </a>');
            msg = msg.replace('[[Link_2_Guide]]','<a href="' + ct_guide_link + '"> LINK </a>' );
            var sbj = mergeResult.getSubject();

            var fromId = 33;//NetSuite Integration
            var toId = emp.id;//nlapiLookupField('employee', emp.id, 'custentity_ct_tool_reporter');

            nlapiLogExecution('DEBUG', 'emp id ', JSON.stringify(emp));
            nlapiLogExecution('DEBUG', 'toId ', toId);
            nlapiLogExecution('debug', 'send email', 'send email');

            nlapiSendEmail(fromId, toId, sbj, msg);
        } catch (e) {
            nlapiLogExecution('error', 'error: sentEmail ', e);
            continue;
        }
    }


}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getdate() {
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

    var formatdate = [auto_lock_actual, month, year].join('/')/* + ' ' + d.toTimeString().substring(0, 8)*/
    return formatdate;
}