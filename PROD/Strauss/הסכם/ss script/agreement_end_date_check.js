var context = nlapiGetContext();

function checkEndDateAgreement() {

    var OldAgreement = getOldAgreements();
    nlapiLogExecution('debug', 'OldAgreement ', JSON.stringify(OldAgreement))
    for (var j = 0; j < OldAgreement.length; j++) {
        Context(context)   
        var customer = OldAgreement[j].customer;
        var id = OldAgreement[j].id;
        getAgreementsTrans(id , customer);                       
    }
}

function getOldAgreements() {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_agreement_customer');
    //columns[1] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agreement_end_date', null, 'on', 'yesterday')

    var search = nlapiCreateSearch('customrecord_agreement', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,  
                customer: s[i].getValue('custrecord_agreement_customer'),
            });

        }
        return results;
    }

}

function getAgreementsTrans(id , customer) {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_df_ff_dril_down');
    loadedSearch.addFilter(new nlobjSearchFilter('custbody_agreement', null, 'anyof', id));

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

    if (s.length > 0) {
        var newAgreement = getNewAgreement(customer);
        if (newAgreement != '-1') {
            for (var i = 0; i < s.length; i++) {
                nlapiSubmitField('itemfulfillment', s[i].getValue("internalid", null, "GROUP"), 'custbody_agreement', newAgreement);
            }    
            nlapiSubmitField('customrecord_agreement', id, 'isinactive', 'T');
        }
    }    
}

function getNewAgreement(customer) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agreement_start_date', null, 'on', 'today')
    filters[1] = new nlobjSearchFilter('custrecord_agreement_customer', null, 'anyof', customer)

    var search = nlapiCreateSearch('customrecord_agreement', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results ='-1';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        results = s[0].id;   
    }
    return results;
}

function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 250) {
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

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}




