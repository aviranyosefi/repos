//var endDate = '30/6/2019';   // TO DO 31/12/2019
//var setPeriod = 128; // Jun 2019  // TO DO  136  // DEC 2019 

var endDate = '31/12/2019';   // TO DO 31/12/2019
var setPeriod = 136;   // TO DO  136  // DEC 2019 


function UpdateRevenue() {

    try {
        /*
        var res = getAllRevenue();
        if (res.length > 0) {
            nlapiLogExecution('debug', 'res.length', res.length);
            var context = nlapiGetContext();

            for (var i = 0; i < res.length; i++) {
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


                    var rec = nlapiLoadRecord('revenueplan', res[i].id);
                    rec.setFieldValue('revrecenddate', endDate);
                    rec.setFieldValue('catchupperiod', setPeriod);

                    var itemCount = rec.getLineItemCount('plannedrevenue');
                    if (itemCount > 0) {
                        for (var m = 0; m < itemCount; m++) {
                            var period = rec.getLineItemValue('plannedrevenue', 'postingperiod', m + 1);
                            if (period == null) {
                                rec.setLineItemValue('plannedrevenue', 'plannedperiod', m + 1, setPeriod);
                            }
                        }
                    }
                   var id =  nlapiSubmitRecord(rec);
                    nlapiLogExecution('debug', 'id success', id);
                } catch (e) {
                    nlapiLogExecution('error', 'loop search' + ' id: ' + res[i].id, e)

                }
            } // end for loop

        }
        */
        UpdateRevenue_second();
    } catch (err) {
        nlapiLogExecution('error', 'UpdateRevenue()', err)
    }

}

function getAllRevenue() {


    var search = nlapiLoadSearch(null, 'customsearch_jfrog_dc_606');


    var allSelection = [];
    var allResults = [];

    var searchid = 0;
    var resultset = search.runSearch();

    var rs;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (rs in resultslice) {
            var columns = resultslice[0].getAllColumns();

            allSelection
                .push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allSelection != null) {
        for (var i = 0; i < allSelection.length; i++) {
            if (allSelection[i].getValue(columns[19]) != 'COMPLETED' && allSelection[i].getValue(columns[20]) == 'ACTUAL') {

                allResults.push({

                    id: allSelection[i].getValue(columns[18]),

                });
            }
        }
    }


    return allResults;
}


/////////////////////////////////////////////////////


function UpdateRevenue_second() {
    try {
        var res = getAllRevenue();
        if (res.length > 0) {
            nlapiLogExecution('debug', 'res.length', res.length);
            var context = nlapiGetContext();

            for (var i = 0; i < res.length; i++) {
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


                    var rec = nlapiLoadRecord('revenueplan', res[i].id);
                    rec.setFieldValue('revrecenddate', endDate);
                    rec.setFieldValue('revrecstartdate', endDate);
                    rec.setFieldValue('catchupperiod', setPeriod);

                    var itemCount = rec.getLineItemCount('plannedrevenue');
                    if (itemCount > 0) {
                        for (var m = 0; m < itemCount; m++) {
                            var period = rec.getLineItemValue('plannedrevenue', 'postingperiod', m + 1);
                            if (period == null) {
                                rec.setLineItemValue('plannedrevenue', 'plannedperiod', m + 1, setPeriod);
                            }
                        }
                    }
                    nlapiSubmitRecord(rec);
                } catch (e) {
                    nlapiLogExecution('error', 'loop search', e)

                }
            } // end for loop

        }
    } catch (err) {
        nlapiLogExecution('error', 'UpdateRevenue()', err)
    }

}

