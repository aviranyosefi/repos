var context = nlapiGetContext();
function start() {

    var CustomerList = getCustomerList();
    for (var m = 0; m < CustomerList.length; m++) {
        Context(context);
        var data = getCustomerLines(CustomerList[m]);
        if (data != null) {
            nlapiLogExecution('DEBUG', 'data : ' + data.length, JSON.stringify(data));
            try {
                var rec = nlapiCreateRecord('invoice');
                //Header Fields 
                rec.setFieldValue('entity', data[0].entity);
                rec.setFieldValue('trandate', '01/12/2020');
                for (var i = 0; i < data.length; i++) {
                    Context(context);
                    try {
                        // lines Fields
                        rec.selectNewLineItem('item');
                        rec.setCurrentLineItemValue('item', 'item', data[i].item);
                        rec.setCurrentLineItemValue('item', 'quantity', '1')
                        rec.setCurrentLineItemValue('item', 'rate', Math.abs(NumberToRate(data[i].rate)))
                        rec.setCurrentLineItemValue('item', 'custcol_cbr_start_date', data[i].startdate)
                        rec.setCurrentLineItemValue('item', 'custcol_cbr_end_date', data[i].enddate)
                        rec.setCurrentLineItemValue('item', 'custcol_original_start_date', data[i].originalStartDate)
                        rec.setCurrentLineItemValue('item', 'custcol_original_end_date', data[i].originalEndDate)
                        rec.setCurrentLineItemValue('item', 'location', data[i].location)
                        rec.setCurrentLineItemValue('item', 'class', data[i].class)
                        rec.setCurrentLineItemValue('item', 'department', data[i].department);
                        rec.setCurrentLineItemValue('item', 'custcol_original_invoice', data[i].inv);
                        rec.setCurrentLineItemValue('item', 'custcol_cbr_rrm_org_end_user', data[i].org_end_user);
                        rec.commitLineItem('item');
                    } catch (err) {
                        nlapiLogExecution('DEBUG', 'error generate invoice - lines', err);
                    }
                }
                var id = nlapiSubmitRecord(rec);
                nlapiLogExecution('ERROR', 'INVOICE id: ', id);
                if (id != -1) {
                    try {
                        var cmRec = nlapiTransformRecord('invoice', id, 'creditmemo');
                        cmRec.setFieldValue('custbody_cbr_so_cancelation_reason', '7')
                        cmRec.setFieldValue('customform', '94')// Standard Credit Memo
                        var cmRecid = nlapiSubmitRecord(cmRec);
                        updateCM(cmRecid);
                        nlapiLogExecution('ERROR', 'cmRecid id: ', cmRecid);
                        updatePlan(data);
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'error generate cmRecid ', e);
                    }

                }
            } catch (e) {
                nlapiLogExecution('ERROR', 'error generate invoice ', e);
            }
        }
    }


}

//NR handling reclass
function getCustomerList() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch467925');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results[s[i].getValue("entity", null, "GROUP")] = s[i].getValue("entity", null, "GROUP");
        }
    }
    var recKeys = Object.keys(results);
    return recKeys;

}

function getCustomerLines(id) {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch467925');
    if (!isNullOrEmpty(id)) { loadedSearch.addFilter(new nlobjSearchFilter('entity', null, 'anyof', id)); }
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
            if (checkDateBigger(s[i].getValue("revrecstartdate", "revenuePlan", "GROUP"))) {
                var startdate = '31/12/2020'
                var enddate = '31/12/2020'
            }
            else {
                var startdate = s[i].getValue("revrecstartdate", "revenuePlan", "GROUP");
                var enddate = '31/12/2020'
            }
            results.push({
                entity: id,
                revplanid: s[i].getValue("internalid", "revenuePlan", "GROUP"),
                item: s[i].getValue("item", null, "GROUP"),
                rate: s[i].getValue("remainingdeferredbalance", "revenuePlan", "MAX"),
                department: s[i].getValue("department", "sourceTransaction", "GROUP"),
                class: s[i].getValue("class", "sourceTransaction", "GROUP"),
                location: s[i].getValue("location", "sourceTransaction", "GROUP"),
                originalStartDate: s[i].getValue("revrecstartdate", "revenuePlan", "GROUP"),
                originalEndDate: s[i].getValue("revrecenddate", "revenuePlan", "GROUP"),
                inv: s[i].getValue("internalid", "sourceTransaction", "GROUP"),
                startdate: startdate,
                enddate: enddate,
                org_end_user: s[i].getValue("custcol_cbr_rrm_org_end_user", "sourceTransaction", "GROUP")

            });


        }
    }

    return results;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function NumberToRate(number) {

    return number.replace(new RegExp(",", "g"), "")
}

function updatePlan(data) {
    for (var i = 0; i < data.length; i++) {
        try {
            //nlapiLogExecution('ERROR', 'startdate ', startdate);
            //nlapiLogExecution('ERROR', 'enddate ', enddate);
            var rec = nlapiLoadRecord('revenueplan', data[i].revplanid);
            rec.setFieldValue('revrecstartdate', data[i].startdate)
            rec.setFieldValue('revrecenddate', data[i].enddate)
            rec.setFieldValue('custrecord_original_start_date', data[i].originalStartDate)
            rec.setFieldValue('custrecord_original_end_date', data[i].originalEndDate)

            var id = nlapiSubmitRecord(rec);
            if (id != -1) {
                nlapiLogExecution('debug', 'revenueplan ', id);
            }
        } catch (e) {
            nlapiLogExecution('ERROR', 'error generate invoice ', e);
        }
    }
}

function updateCM(cmRecid) {
    try {
        var rec = nlapiLoadRecord('creditmemo', cmRecid);
        var itemCount = rec.getLineItemCount('item');
        for (var i = 1; i <= itemCount; i++) {
            rec.setLineItemValue('item', 'custcol_cbr_start_date', i, rec.getLineItemValue('item', 'custcol_original_start_date', i))
            rec.setLineItemValue('item', 'custcol_cbr_end_date', i, rec.getLineItemValue('item', 'custcol_original_end_date', i))
        }
        var id = nlapiSubmitRecord(rec);

    } catch (e) {
        nlapiLogExecution('ERROR', 'error updateCM  ', e);
    }
}

function checkDateBigger(date) {
    var date = nlapiStringToDate(date)
    if (date > new Date()) {
        return true;
    }
    else return false;
}

function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}

/////////////////////////////

function secondProccess() {
    try {
        var result = getSecondProccessList();
        if (result != null) {
            for (var m = 0; m < result.length; m++) {
                Context(context);
                try {
                    SecondProccessUpdatePlan(result[m].planId, result[m].startdate, result[m].enddate);
                } catch (e) { }
            }
        }
    } catch (e) {
    }

}

function getSecondProccessList() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch468460');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                planId: s[i].getValue("internalid", "revenuePlan", "GROUP"),
                startdate: s[i].getValue("custcol_original_start_date", "sourceTransaction", "GROUP"),
                enddate: s[i].getValue("custcol_original_end_date", "sourceTransaction", "GROUP"),

            });
        }
    }

    return results;
}

function SecondProccessUpdatePlan(planId, startdate, enddate) {

    try {
        var rec = nlapiLoadRecord('revenueplan', planId);
        rec.setFieldValue('custrecord_original_start_date', startdate)
        rec.setFieldValue('custrecord_original_end_date', enddate)
        var id = nlapiSubmitRecord(rec);
        if (id != -1) {
            nlapiLogExecution('debug', 'revenueplan ', id);
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'error SecondProccessUpdatePlan ', e);
    }

}

//////////////////
/////////////////
function updateInv() {
    try {
        var result = updateInvList();
        nlapiLogExecution('DEBUG', 'result : ' + result.length, JSON.stringify(result));
        if (result != null) {
            for (var m = 0; m < result.length; m++) {
                Context(context);
                try {
                    var rec = nlapiLoadRecord('creditmemo', result[m].invId);
                    rec.setLineItemValue('item', 'custcol_cbr_rrm_org_end_user', result[m].line, result[m].endUser);
                    //rec.setLineItemValue('item', 'class', result[m].line, result[m].class);
                    rec.setFieldValue('class', '334')
                    rec.setFieldValue('customform', '94')
                    var id = nlapiSubmitRecord(rec, { disabletriggers: true, enablesourcing: true, ignoremandatoryfields: true });
                    nlapiLogExecution('DEBUG', 'id : ', id);
                } catch (e) { }
            }
        }
    } catch (e) {
    }
}

function updateInvList() {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch526889');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {

            results.push({
                invId: s[i].getValue("internalid", null, "GROUP"),
                endUser: s[i].getValue("custcol_cbr_rrm_org_end_user", "CUSTCOL_ORIGINAL_INVOICE", "MAX"),
                class: s[i].getValue("class", "CUSTCOL_ORIGINAL_INVOICE", "MAX"),
                line: s[i].getValue("line", null, "GROUP"),
            });
        }
    }

    return results;
}



/////////////////// new level

function NewProccess() {
    try {
        var result = getNewList();
        nlapiLogExecution('debug', 'result ' + result.length, JSON.stringify(result));
        if (result != null) {
            for (var m = 0; m < result.length; m++) {
                Context(context);
                try {
                    var type = 'invoice';
                    if (result[m].type == 'CustCred') { type = 'creditmemo' };
                    var rec = nlapiLoadRecord(type, result[m].internalid);
                    rec.setLineItemValue('item', 'custcol_cbr_rr_order_type1', result[m].line, result[m].custcol_cbr_rr_order_type1)
                    rec.setLineItemValue('item', 'custcol_idaptive_quote_num', result[m].line, result[m].custcol_idaptive_quote_num)
                    rec.setLineItemValue('item', 'location', result[m].line, result[m].location)
                    rec.setLineItemValue('item', 'custcol_cbr_rrm_so_num', result[m].line, result[m].custcol_cbr_rrm_so_num)
                    rec.setLineItemValue('item', 'custcol_cbr_rrm_org_end_user', result[m].line, result[m].custcol_cbr_rrm_org_end_user)
                    rec.setLineItemValue('item', 'class', result[m].line, result[m].class)
                    rec.setLineItemValue('item', 'department', result[m].line, result[m].department)
                    var id = nlapiSubmitRecord(rec);
                    nlapiLogExecution('debug', 'id ', id);
                } catch (e) { }
            }
        }
    } catch (e) {
    }

}

function getNewList() {
    var loadedSearch = nlapiLoadSearch(null, 'customsearch542408');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {

            results.push({
                type: s[i].getValue("type", null, "GROUP"),
                internalid: s[i].getValue("internalid", null, "GROUP"),
                custcol_cbr_rr_order_type1: s[i].getValue("custcol_cbr_rr_order_type1", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                custcol_idaptive_quote_num: s[i].getValue("custcol_idaptive_quote_num", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                location: s[i].getValue("location", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                custcol_cbr_rrm_so_num: s[i].getValue("custcol_cbr_rrm_so_num", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                custcol_cbr_rrm_org_end_user: s[i].getValue("custcol_cbr_rrm_org_end_user", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                class: s[i].getValue("class", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                department: s[i].getValue("department", "CUSTCOL_ORIGINAL_INVOICE", "GROUP"),
                line: s[i].getValue("line", null, "GROUP"),
            });
        }
    }

    return results;
}


////


function ARRNewProccess() {
    try {
        var result = ARRgetNewList();
        nlapiLogExecution('debug', 'result ' + result.length, JSON.stringify(result));
        if (result != null) {
            var curr = '';            
            for (var m = 0; m < result.length; m++) {
                Context(context);
                if (curr != result[m].internalid) {
                    if (m != 0) {
                        var id = nlapiSubmitRecord(rec);
                        nlapiLogExecution('debug', 'id ', id);
                        //var type = 'creditmemo'
                        //if (result[m].type == 'CustInvc') { type = 'invoice' }
                        var rec = nlapiLoadRecord('revenuearrangement', result[m].internalid);
                        curr = result[m].internalid;
                    }
                    else {
                        //var type = 'creditmemo'
                        //if (result[m].type == 'CustInvc') { type = 'invoice' }
                        var rec = nlapiLoadRecord('revenuearrangement', result[m].internalid);
                        curr = result[m].internalid;
                    }
                } 
                try {                    
                    rec.setLineItemValue('revenueelement', 'custcol_idaptive_pre_acq', result[m].line, 'T')
                    //rec.setLineItemValue('revenueelement', 'custcol_idaptive_quote_num', result[m].line, result[m].custcol_idaptive_quote_num)                  
                    //rec.setLineItemValue('revenueelement', 'custcol_cbr_rrm_so_num', result[m].line, result[m].custcol_cbr_rrm_so_num)
                    //rec.setLineItemValue('revenueelement', 'custcol_cbr_rrm_org_end_user', result[m].line, result[m].custcol_cbr_rrm_org_end_user)
                    //rec.setLineItemValue('item', 'location', result[m].line, result[m].location)
                    //rec.setLineItemValue('item', 'class', result[m].line, result[m].class)
                    //rec.setLineItemValue('item', 'department', result[m].line, result[m].department)
                    //rec.setLineItemValue('item', 'custcol_idaptive_pre_acq', result[m].line, result[m].custcol_idaptive_pre_acq)
                   
                } catch (e) { }
            }  
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'id ', id);
        }
    } catch (e) {
    }

}

function ARRgetNewList() {
    var loadedSearch = nlapiLoadSearch(null, 'customsearch542911');
    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);
    var results = [];
    if (s.length > 0) {
        for (var i = 0; i < s.length; i++) {

            results.push({
                internalid: s[i].getValue("internalid", "revenueArrangement", null),
                line: s[i].getValue("line", "revenueArrangement", null),                           
            });
        }
    }

    return results;
}



