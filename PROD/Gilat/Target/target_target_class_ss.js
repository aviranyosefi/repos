
var context = nlapiGetContext();

function getAmountTargetClass() {

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var periods = getPeriodsId();
    var salesTarget = SalesRepTargets();
    nlapiLogExecution('debug', 'salesTarget ', JSON.stringify(salesTarget))
    for (var j = 0; j < salesTarget.length; j++) {
        Context(context)
        var sales = salesTarget[j].sales_rep;
        if (isNullOrEmpty(sales)) { sales = '@NONE@' }
        var id = salesTarget[j].id;
        var year = salesTarget[j].year;
        var yearName = getYearName(year)
        if (!isNullOrEmpty(id)) {
            var amount = [];
            for (var i = 0; i < months.length; i++) {
                var period = periods[months[i] + ' ' + yearName].id;
                nlapiLogExecution('debug', 'period ', period);           
                var amountPerClass = getData(period, sales);
                    //amount[ProductFamilyId] = amountPerMonth;
                    amount.push({
                        sumOfHLS: amountPerClass[0].sumOfHLS,
                        sumOfHW: amountPerClass[0].sumOfHW,
                        sumOfIC: amountPerClass[0].sumOfIC,
                    });                                              
            }
            nlapiSubmitField('customrecord_target', id, 'custrecord_target_class_data', JSON.stringify(amount))
        }
    }  
}
// Sales rep targets
function SalesRepTargets() {
    try {
        
        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {           
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)

        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {

         
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getValue("custrecord_target_sales_rep"),
                    year: allSelection[i].getValue("custrecord_target_year") ,
                });

            }       
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    return Results;
}

//Target godel tik row data
function getData(period, sales) {
    try {
        debugger;
        var search = nlapiLoadSearch(null, 'customsearch_godel_tik_row_data');
        search.addFilter(new nlobjSearchFilter('postingperiod', 'revenueplan', 'anyof', period));
        search.addFilter(new nlobjSearchFilter('salesrep', 'sourceTransaction', 'anyof', sales));
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
           
            for (var rs in resultslice) {
                Context(context)
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)
        var sumOfHLS = 0;
        var sumOfHW = 0;
        var sumOfIC = 0;
        if (allSelection != null) {
           
            for (var i = 0; i < allSelection.length; i++) {
                if (allSelection[i].getValue("custrecord_target_classification", "class", null) == '1') {
                    sumOfHW += parseFloat(allSelection[i].getValue("lineamount", "revenuePlan", null))       
                }
                else if (allSelection[i].getValue("custrecord_target_classification", "class", null) == '2') {
                    sumOfHLS += parseFloat(allSelection[i].getValue("lineamount", "revenuePlan", null))       
                }
                else if (allSelection[i].getValue("custrecord_target_classification", "class", null) == '3') {
                    sumOfIC += parseFloat(allSelection[i].getValue("lineamount", "revenuePlan", null))       
                }
                                                             
            }                             
        }

        Results.push({
            sumOfHLS: sumOfHLS,
            sumOfHW: sumOfHW,
            sumOfIC: sumOfIC,
        })
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    return Results;
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

function getPeriodsId() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('periodname');

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('periodname', null, 'is', name)

    var search = nlapiCreateSearch('accountingperiod', null, columns);

    var resultset = search.runSearch();
    var SearchResults = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            SearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (SearchResults != null) {

        for (var i = 0; i < SearchResults.length; i++) {
            res[SearchResults[i].getValue('periodname')] = {
                id: SearchResults[i].getValue('internalid')
            }
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

function getYearName(id) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist358', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var res = '';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        res = returnSearchResults[0].getValue('name');
    }

    return res;
}

function getProductFamilyList() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist_rev_rec_product_family_list', null, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            res.push({
                id: returnSearchResults[i].getValue('internalid'),
                name: returnSearchResults[i].getValue('name')
            });
        }        
    }

    return res;
}


