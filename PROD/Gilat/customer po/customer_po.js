
function UpdateIb() {
    try {
        var res = getAllCusPo();
        if (res.length > 0) {
            nlapiLogExecution('debug',  'getAllCusPo res.length: ' + res.length, JSON.stringify(res));
            var context = nlapiGetContext();
            for (var i = 0; i < res.length; i++) {
                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }
                var IBarr = [];
                IBarr = getAllIB(res[i].replacing_po)
                nlapiLogExecution('debug', ' getAllIB IBarr.length: ' + IBarr.length, res[i].replacing_po + ' data :'+JSON.stringify(IBarr));
                if (IBarr.length > 0) {
                    for (var j = 0; j < IBarr.length; j++) {
                        nlapiSubmitField('customrecord_ib_service_type', IBarr[j].IBid, 'custrecord_ib_customer_po', res[i].id)
                    }
                }
            } // end for loop
        }
    } catch (err) {
        nlapiLogExecution('error', 'UpdateRevenue()', err)
    }

}

function getAllCusPo() {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_cpo_end_date', null, 'onorafter', nlapiDateToString(new Date()))
    filters[1] = new nlobjSearchFilter('custrecord_cpo_start_date', null, 'onorbefore', nlapiDateToString(new Date()))
    filters[2] = new nlobjSearchFilter('custrecord_cpo_replacing_po', null, 'noneof', '@NONE@')

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_cpo_replacing_po');
   
   
    var res = [];

    var search = nlapiCreateSearch('customrecord_custom_po', filters, columns);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != []) {

        for (var i = 0; i < s.length; i++) {

            res.push({
                id: s[i].id,
                replacing_po: s[i].getValue('custrecord_cpo_replacing_po')
            });
        }

    }


    return res;
}

function getAllIB(customer_po) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_charging_method', null, 'anyof', '2');
    filters[1] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'anyof', '1');
    filters[2] = new nlobjSearchFilter('custrecord_ib_customer_po', null, 'anyof', customer_po);
   
    var search = nlapiCreateSearch('customrecord_ib_service_type', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    var res = [];
   
    if (s != []) {
        
        for (var i = 0; i < s.length; i++) {

            res.push({
                IBid: s[i].id,               
            });
        }
    }

    return res;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

/////////////////////////////////////////////////////


   


