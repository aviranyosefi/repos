var context = nlapiGetContext();
function getAmountPf() {
    try {     
        var date = new Date()
        var year = date.getFullYear();
        var previousYear = year - 1;
        year = getYearID(year)
        previousYear = getYearID(previousYear)
        var years = [year, previousYear]
        var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        //var salesList = SalesRepList(years);
        var salesList =getSalesRep(years)
        var ProductFamilyList =  getProductFamilyList();       
        for (var j = 0; j < salesList.length; j++) {
            try {
                Context(context)
                var sales = salesList[j].sales_rep;
                if (isNullOrEmpty(sales)) { sales = '@NONE@' }
                var year = salesList[j].year;   
                var yearID = salesList[j].yearID
                if (!isNullOrEmpty(sales)) {
                    var amountData = [];
                    for (var i = 0; i < months.length; i++) {
                        var amount = [];  
                        var firstDay = '1/' + months[i] + '/' + year;
                        var lastDay = nlapiDateToString(nlapiStringToDate(firstDay).lastDayOfCurrentMonth());
                        for (var h = 0; h < ProductFamilyList.length; h++) {
                            Context(context);
                            var ProductFamilyId = ProductFamilyList[h].id 
                            var ProductFamilyName = ProductFamilyList[h].name
                            var amountPerMonth = getData(firstDay, lastDay, sales, ProductFamilyId);
                            var targetPerMonth = getTarget(firstDay, sales, ProductFamilyId);
                            amount.push({
                                sum: amountPerMonth,
                                id: ProductFamilyId,
                                name: ProductFamilyName,
                                target: targetPerMonth,
                            });                   
                        }                   
                        amountData.push({
                            data: amount
                        });               
                    }
                    nlapiLogExecution('debug', 'sales rep: ' + sales, JSON.stringify(amountData));
                    var id = searchTran(sales, yearID)
                    nlapiLogExecution('debug', 'id ', id);
                    if (isNullOrEmpty(id)) {
                        createTran(sales, yearID, amountData)
                    } else {
                        nlapiSubmitField('customrecord_sale_rep_amounts', id, 'custrecord_sr_amounts', JSON.stringify(amountData))
                    }
                }
            } catch (e) {
                nlapiLogExecution('error', 'loop lines error: ' + e, 'line: ' + j);
            } 
        }  
    }
    catch (e) {
        nlapiLogExecution('error', 'getAmountPf error ', e);
    }
}
function getSalesRep(years) {
    Results = [];
    var s = nlapiSearchRecord("employee", null,
        [
            ["salesrep", "is", "T"],
            "AND",
            ["isinactive", "is", "F"]
        ],
        [
        ]
    );
    for (var i = 0; i < years.length; i++) {
        yID = years[i];
        yName = nlapiLookupField('customlist358', yID, 'name')
        for (var m = 0; m < s.length; m++) {
            Results.push({
                sales_rep: s[m].id,
                year: yName,
                yearID: yID,
            })
        }
        Results.push({
            sales_rep: '',
            year: yName,
            yearID: yID,
        });

    }
    return Results;

}
function SalesRepList(years) {
    try {
        var columns = new Array();
        columns[0] = new nlobjSearchColumn("custrecord_gt_sales_rep", null, "GROUP").setSort(false);
        columns[1] = new nlobjSearchColumn("custrecord_gt_year", null, "GROUP")

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_gt_year', null, 'anyof', years)
        filters[1] = new nlobjSearchFilter('custrecord_gt_type', null, 'anyof', 1)

        var search = nlapiCreateSearch('customrecord_gilat_targets', filters, columns);

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
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)

        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                Results.push({
                    sales_rep: allSelection[i].getValue("custrecord_gt_sales_rep", null, "GROUP"),
                    year: allSelection[i].getText("custrecord_gt_year", null, "GROUP"),
                    yearID: allSelection[i].getValue("custrecord_gt_year", null, "GROUP"),
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    return Results;
}
//New Money (Recurrent) - Row Data
function getData(fromDate, toDate, sales, ProductFamily) {
    try {  
        var search = nlapiLoadSearch(null, 'customsearch_new_money_recurrent_actual');        
        search.addFilter(new nlobjSearchFilter('custcol_billing_date_rev_rec', null, 'onorafter', fromDate));
        search.addFilter(new nlobjSearchFilter('custcol_billing_date_rev_rec', null, 'onorbefore', toDate));
        search.addFilter(new nlobjSearchFilter('salesrep', null, 'anyof', sales));
        search.addFilter(new nlobjSearchFilter('custrecord_rev_rec_product_family', 'class', 'anyof', ProductFamily));
        var allSelection = [];
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
        var amount = 0;
        if (allSelection != null) {          
            for (var i = 0; i < allSelection.length; i++) {           
                amount += parseFloat(allSelection[i].getValue("formulacurrency"))                                                
            }                             
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    //nlapiLogExecution('DEBUG', 'amount : ' + amount, '' )
    return amount;
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
function getProductFamilyList() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid').setSort()

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
        res.push({
            id: "@NONE@",
            name: 'none'
        });
    }

    return res;
}
Date.prototype.lastDayOfCurrentMonth = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0);
};
function searchTran(sales, year) {
    try {
        nlapiLogExecution('debug', 'searchTran func', 'searchTran')
        debugger
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', sales));
        filters.push(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', year));
        filters.push(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));

        var search = nlapiCreateSearch('customrecord_sale_rep_amounts', filters, null);
        var allSelection = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                allSelection.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        if (allSelection != null && allSelection.length > 0) {
            return allSelection[0].id
        }
    } catch (e) {
        nlapiLogExecution('error', 'searchTran func', e)
    }
    return '';
}
function createTran(sales, year, amountData) {
    nlapiLogExecution('debug', 'createTran ', createTran);
    var rec = nlapiCreateRecord('customrecord_sale_rep_amounts');
    if (sales == '@NONE@') { sales = '' }
    rec.setFieldValue('custrecord_sr_sales_rep', sales);
    rec.setFieldValue('custrecord_sr_year', year);
    rec.setFieldValue('custrecord_sr_type', 1);
    rec.setFieldValue('custrecord_sr_amounts', JSON.stringify(amountData));
    var id = nlapiSubmitRecord(rec);
}
function getYearID(name) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', name.toString())

    var search = nlapiCreateSearch('customlist358', filters, columns);

    var resultset = search.runSearch();
    var returns = [];
    var searchid = 0;
    var res = '';

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returns.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returns != null && returns.length > 0) {
        res = returns[0].getValue('internalid');
    }

    return res;
}
function getTarget(period, sales, ProductFamily) {
    try {
        debugger
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_gt_period', null, 'on', period));
        filters.push(new nlobjSearchFilter('custrecord_gt_sales_rep', null, 'anyof', sales));
        filters.push(new nlobjSearchFilter('custrecord_gt_product_line', null, 'anyof', ProductFamily));
        filters.push(new nlobjSearchFilter('custrecord_gt_type', null, 'anyof', 1));

        var columns = new Array();
        columns[0] = new nlobjSearchColumn("custrecord_gt_amount")

        var search = nlapiCreateSearch('customrecord_gilat_targets', filters, columns);
        var allSelection = [];
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
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)      
        var amount = 0;
        if (allSelection != null && allSelection.length > 0) {
            amount = parseFloat(allSelection[0].getValue("custrecord_gt_amount"))
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    //nlapiLogExecution('error', 'amount : ' + amount, period)
    return amount;
}

