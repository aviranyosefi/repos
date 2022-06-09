var context = nlapiGetContext();
function revenue_element_SRC_line_creation() {
    try {
        nlapiLogExecution('DEBUG', 'SCRIPT', 'RUN');

        var filters = new Array();
        var s = [];
        var searchid = 0;
        var columns = new Array();

        var search = nlapiLoadSearch(null, 'customsearch_rev_element_script');

        //search.addFilter(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', prevperiod));

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
                var id = s[i].getValue('custentity_ct_tool_reporter', 'CUSTRECORD_CT_REP_ENT_EMPLOYEE', "GROUP")
                //result[id] = id;



                result.push({
                    id: s[i].getId(),
                    number: s[i].getValue(cols[0]),
                    src_trx_internalid: s[i].getValue(cols[1]),
                    line_id: s[i].getValue(cols[2]),
                    site: s[i].getValue(cols[5]),

                    //id: s[i].getValue('custentity_ct_tool_reporter', 'CUSTRECORD_CT_REP_ENT_EMPLOYEE', "GROUP"),
                    // balanceUsd: s[i].getValue(cols[3])
                })
            }


            create_record(result);

        }
        nlapiLogExecution('DEBUG', 'SCRIPT', 'END');
    }
    catch (e) {
        nlapiLogExecution('ERROR', 'e', e);
    }

}

function create_record(data) {

    for (var i = 0; i < data.length; i++) {
        if (context.getRemainingUsage() < 150) {
            nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
        try {

            var rec = nlapiCreateRecord('customrecord_rev_elem_src_line_conect');
            rec.setFieldValue('externalid', data[i].number);
            rec.setFieldValue('custrecord_rec_rev_element', data[i].id);

            rec.setFieldValue('custrecord_rec_source_transaction', data[i].src_trx_internalid);
            rec.setFieldValue('custrecord_rec_trx_line_id', data[i].line_id);
            if (!isEmpty(data[i].site))
                rec.setFieldValue('custrecord_rec_site', data[i].site);

            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('DEBUG', 'RECORD SAVED', id);
        } catch (e) {
            nlapiLogExecution('ERROR', 'e' + e, data[i]);
            continue;
        }
    }
}

function isEmpty(val) {
    return (val == undefined || val == null || val == '');
}