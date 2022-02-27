var context = nlapiGetContext();
function createLog() {
    try {
        var logsList = getDataLogs();
        nlapiLogExecution('debug', 'logsList ' + logsList.length, JSON.stringify(logsList));
        for (var i = 0; i < logsList.length; i++) {
            try {
                Context(context)
                createTran(logsList[i])
            } catch (e) {
                nlapiLogExecution('error', 'createLog createTran  error ', e);
            }
        }
        
    }
    catch (e) {
        nlapiLogExecution('error', 'createLog error ', e);
    }
}
function getDataLogs() {
    try {
        var filters = new Array();
        filters.push(new nlobjSearchFilter('field', 'systemnotes', 'anyof', ['TRANDOC.KENTITYSTATUS', 'TRANDOC.RPROBABILITY']));
        filters.push(new nlobjSearchFilter('date', 'systemnotes', 'on', 'yesterday'));
   

        var columns = new Array();
        columns.push(new nlobjSearchColumn('internalid'));
        columns.push(new nlobjSearchColumn("context", "systemNotes", null));
        columns.push(new nlobjSearchColumn("date", "systemNotes", null).setSort(false));
        columns.push(new nlobjSearchColumn("type", "systemNotes", null));
        columns.push(new nlobjSearchColumn("field", "systemNotes", null));
        columns.push(new nlobjSearchColumn("oldvalue", "systemNotes", null));
        columns.push(new nlobjSearchColumn("newvalue","systemNotes",null));
        columns.push(new nlobjSearchColumn("name", "systemNotes", null));

        var search = nlapiCreateSearch('opportunity', filters, columns);
        var allSelection = [];
        var searchid = 0;
        var resultset = search.runSearch();
        var res = [];
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)         
        if (allSelection != null && allSelection.length > 0) {
            for (var j = 0; j < allSelection.length; j++) {
                res.push({
                    oppId: allSelection[j].getValue("internalid"),
                    context: allSelection[j].getValue("context", "systemNotes", null),
                    date: DateFormat(allSelection[j].getValue("date", "systemNotes", null)),
                    type: allSelection[j].getValue("type", "systemNotes", null),
                    field: allSelection[j].getText("field", "systemNotes", null),
                    oldvalue: allSelection[j].getValue("oldvalue", "systemNotes", null),
                    newvalue: allSelection[j].getValue("newvalue", "systemNotes", null),
                    name: allSelection[j].getValue("name", "systemNotes", null),    
                });
             
            }          
        }
    } catch (e) {
        nlapiLogExecution('error', 'getDataLogs func', e)
    }
    return res;
}
function DateFormat(dateStr) {
    // --> 17/12/2020 10:38 am
    dateStr = dateStr.split(' ');
    var dateAfterFormat = dateStr[0] + ' ' + dateStr[1] + ':00'
    return dateAfterFormat
    
}
function Context(context) {

    if (context.getRemainingUsage() < 1250) {
        var state = nlapiYieldScript();
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
function createTran(dataLine) {
    try {
        nlapiLogExecution('debug', 'dataLine ', JSON.stringify(dataLine));  
        var rec = nlapiCreateRecord('customrecord_opp_changes_log');
        rec.setFieldValue('custrecord_opportunity', dataLine.oppId);
        rec.setFieldValue('custrecord_context', dataLine.context);
        rec.setFieldValue('custrecord_date_modified', dataLine.date);
        rec.setFieldValue('custrecord_field', dataLine.field);
        rec.setFieldValue('custrecord_field_old_value', dataLine.oldvalue);
        rec.setFieldValue('custrecord_field_new_value', dataLine.newvalue);
        rec.setFieldValue('custrecord_set_by', dataLine.name);
        var recid = nlapiSubmitRecord(rec);
        return recid;
    } catch (e) {
        nlapiLogExecution('error', 'createTran error:  ', e);
    }

}



