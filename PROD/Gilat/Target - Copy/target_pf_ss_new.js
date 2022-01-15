var context = nlapiGetContext();
function getAmountPf() {
    try {
        var date = new Date()
        var year = date.getFullYear();
        var previousYear = year - 1;
        year = getYearID(year)
        previousYear = getYearID(previousYear)
        //nlapiLogExecution('debug', '1 previousYear ' + previousYear, 'year' + year);
        var years = [year, previousYear]
        nlapiLogExecution('debug', 'years ', JSON.stringify(years));
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        var NumMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        var periods = getPeriodsId();
        //nlapiLogExecution('debug', '1 periods ' + periods.length, Object.keys(periods));
        //var salesTarget = SalesRepTargets();
        //var salesList = SalesRepList(years);
        var salesList = getSalesRep(years)
        nlapiLogExecution('debug', 'salesList ' + salesList.length, JSON.stringify(salesList));
        var ProductFamilyList = getProductFamilyList();
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
                        var period = periods[months[i] + ' ' + year].id;
                        var firstDay = '1/' + NumMonths[i] + '/' + year;
                        for (var h = 0; h < ProductFamilyList.length; h++) {
                            Context(context);
                            var ProductFamilyId = ProductFamilyList[h].id
                            var ProductFamilyName = ProductFamilyList[h].name
                            var amountPerMonth = getData(period, sales, ProductFamilyId);
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
                    nlapiLogExecution('debug', 'sales ' + sales, JSON.stringify(amountData));
                    //nlapiSubmitField('customrecord_target', id, 'custrecord_data_pf', JSON.stringify(amountData))
                    var id = searchTran(sales, yearID)
                    //nlapiLogExecution('debug', 'id ', id);
                    if (isNullOrEmpty(id)) {
                        createTran(sales, yearID, amountData)
                    } else {
                        nlapiSubmitField('customrecord_sale_rep_amounts', id, 'custrecord_sr_amounts', JSON.stringify(amountData))
                    }
                }
            } catch (e) {
                nlapiLogExecution('error', 'loop lines error: ' +e, 'line: '+i);
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
        filters[1] = new nlobjSearchFilter('custrecord_gt_type', null, 'anyof', 3)

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
        var noneYearText = [];
        var noneYearID = [];
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                noneYearText.push(allSelection[i].getText("custrecord_gt_year", null, "GROUP"))
                noneYearID.push(allSelection[i].getValue("custrecord_gt_year", null, "GROUP"))
                Results.push({
                    sales_rep: allSelection[i].getValue("custrecord_gt_sales_rep", null, "GROUP"),
                    year: allSelection[i].getText("custrecord_gt_year", null, "GROUP"),
                    yearID: allSelection[i].getValue("custrecord_gt_year", null, "GROUP"),
                });
            }
        }
        for (var y = 0; y < years.length; y++) {
            if (years[y] == noneYearID[y]) {
                Results.push({
                    sales_rep: '',
                    year: noneYearText[y],
                    yearID: noneYearID[y],
                });
            }  
        }
    
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    return Results;
}
//Actual- Godel Tik (ROW DATA) ***
function getData(period, sales, ProductFamily) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_godel_tik_row_data');
        search.addFilter(new nlobjSearchFilter('postingperiod', 'revenueplan', 'anyof', period));
        search.addFilter(new nlobjSearchFilter('salesrep', 'sourceTransaction', 'anyof', sales));
        search.addFilter(new nlobjSearchFilter('custrecord_rev_rec_product_family', 'class', 'anyof', ProductFamily));
        var allSelection = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                Context(context)
                allSelection.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        var amount = 0;
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                amount += parseFloat(allSelection[i].getValue("lineamount", "revenuePlan", null))
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    //nlapiLogExecution('debug', 'amount : ' + amount, period )
    return amount;
}
function getTarget(period, sales, ProductFamily) {
    try {
        debugger
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_gt_period', null, 'on', period));
        filters.push(new nlobjSearchFilter('custrecord_gt_sales_rep', null, 'anyof', sales));
        filters.push(new nlobjSearchFilter('custrecord_gt_product_line', null, 'anyof', ProductFamily));
        filters.push(new nlobjSearchFilter('custrecord_gt_type', null, 'anyof', 3));

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
    var s = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            res[s[i].getValue('periodname')] = {
                id: s[i].getValue('internalid')
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
function getProductFamilyList() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid').setSort()

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist_rev_rec_product_family_list', null, columns);

    var resultset = search.runSearch();
    var returns = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returns.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returns != null) {
        for (var i = 0; i < returns.length; i++) {
            res.push({
                id: returns[i].getValue('internalid'),
                name: returns[i].getValue('name')
            });
        }
        res.push({
            id: "@NONE@",
            name: 'none'
        });
    }
    return res;
}
function searchTran(sales, year) {
    try {
        //nlapiLogExecution('debug', 'searchTran func', 'searchTran')
        debugger
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', sales));
        filters.push(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', year));
        filters.push(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 3));

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
    try {
        nlapiLogExecution('debug', 'createTran ', 'createTran');
        var rec = nlapiCreateRecord('customrecord_sale_rep_amounts');
        if (sales == '@NONE@') { sales = '' }
        rec.setFieldValue('custrecord_sr_sales_rep', sales);
        rec.setFieldValue('custrecord_sr_year', year);
        rec.setFieldValue('custrecord_sr_type', 3);
        rec.setFieldValue('custrecord_sr_amounts', JSON.stringify(amountData));
        nlapiSubmitRecord(rec);
    } catch (e) {
        nlapiLogExecution('error', 'createTran error:  ', e);
    }

}


