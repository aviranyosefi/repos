var context = nlapiGetContext();
function getAmountTargetClass() {
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
        var salesList = getSalesRep(years)
        nlapiLogExecution('debug', 'salesList ' + salesList.length, JSON.stringify(salesList));
        for (var j = 0; j < salesList.length; j++) {
            Context(context)
            var sales = salesList[j].sales_rep;
            //var EmpCRId = getEmpCRId(sales) 
            if (isNullOrEmpty(sales)) { sales = '@NONE@' }          
            var year = salesList[j].year;
            var yearID = salesList[j].yearID
            if (!isNullOrEmpty(sales)) {
                var amount = [];
                for (var i = 0; i < months.length; i++) {
                    var period = periods[months[i] + ' ' + year].id;
                    var firstDay = '1/' + NumMonths[i] + '/' + year;
                    //nlapiLogExecution('debug', 'period ', period);
                    var amountPerClass = getData(period, sales);
                    var targetPerMonth = getTarget(firstDay, sales);
                    amount.push({
                        sumOfHLS: amountPerClass[0].sumOfHLS,
                        sumOfHW: amountPerClass[0].sumOfHW,
                        sumOfIC: amountPerClass[0].sumOfIC,
                        targetOfHLS: targetPerMonth[0].targetOfHLS,
                        targetOfHW: targetPerMonth[0].targetOfHW,
                        targetOfIC: targetPerMonth[0].targetOfIC,
                    });
                }
                var id = searchTran(sales, yearID)               
                if (isNullOrEmpty(id)) {
                    id = createTran(sales, yearID, amount)
                } else {
                    nlapiSubmitField('customrecord_sale_rep_amounts', id, 'custrecord_sf_class', JSON.stringify(amount))
                }
                nlapiLogExecution('debug', 'sales ' + sales + ' id: ' + id, JSON.stringify(amount));
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'getAmountPf error ', e);
    }
}
// Sales rep targets
function getSalesRep(years) {
    Results = [];
    var gilat_targets = nlapiSearchRecord("customrecord_gilat_targets", null,
        [
            ["custrecord_gt_type", "anyof", "3"]
        ],
        [
            new nlobjSearchColumn("custrecord_gt_sales_rep", null, "GROUP")
        ]
    );
    //nlapiLogExecution('debug', 'gilat_targets  ', gilat_targets.length);
    var empList = [];
    for (var i = 0; i < gilat_targets.length; i++) {
        empList.push(gilat_targets[i].getValue("custrecord_gt_sales_rep", null, "GROUP"))
    }
    var empListTrn = getEmpFromTran();
    var s = unique(empList.concat(empListTrn));
    //s = [];
    //s.push('68')
    for (var i = 0; i < years.length; i++) {
        yID = years[i];
        yName = nlapiLookupField('customlist358', yID, 'name')
        for (var m = 0; m < s.length; m++) {
            Results.push({
                sales_rep: s[m],
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
//Actual- Godel Tik (ROW DATA) ***
function getData(period, sales) {
    try {
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
                allSelection.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)
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
function getTarget(period, sales) {
    try {
        debugger
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_gt_period', null, 'on', period));
        filters.push(new nlobjSearchFilter('custrecord_gt_sales_rep', null, 'anyof', sales));
        filters.push(new nlobjSearchFilter('custrecord_gt_type', null, 'anyof', 3));

        var columns = new Array();
        columns[0] = new nlobjSearchColumn("custrecord_gt_amount")
        columns[1] = new nlobjSearchColumn("custrecord_target_classification",'custrecord_gt_class')

        var search = nlapiCreateSearch('customrecord_gilat_targets', filters, columns);
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
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)   
        var Results = [];
        var targetOfHLS = 0;
        var targetOfHW = 0;
        var targetOfIC = 0;
        if (allSelection != null && allSelection.length > 0) {
            for (var i = 0; i < allSelection.length; i++) {
                if (allSelection[i].getValue("custrecord_target_classification",'custrecord_gt_class',null) == '1') {
                    targetOfHW += parseFloat(allSelection[i].getValue("custrecord_gt_amount"))
                }
                else if (allSelection[i].getValue("custrecord_target_classification", 'custrecord_gt_class', null) == '2') {
                    targetOfHLS += parseFloat(allSelection[i].getValue("custrecord_gt_amount"))
                }
                else if (allSelection[i].getValue("custrecord_target_classification", 'custrecord_gt_class', null) == '3') {
                    targetOfIC += parseFloat(allSelection[i].getValue("custrecord_gt_amount"))
                }

            }
        }
        Results.push({
            targetOfHLS: targetOfHLS,
            targetOfHW: targetOfHW,
            targetOfIC: targetOfIC,
        })
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
    //nlapiLogExecution('error', 'amount : ' + amount, period)
    return Results;
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

    var searchPeriod = nlapiCreateSearch('accountingperiod', null, columns);

    var resultset = searchPeriod.runSearch();
    var ss = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            ss.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    //nlapiLogExecution('debug', 'ss ', ss.length);
    if (ss != null) {
        for (var i = 0; i < ss.length; i++) {
            res[ss[i].getValue('periodname')] = {
                id: ss[i].getValue('internalid')
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
        nlapiLogExecution('debug', 'createTran ', 'sales: ' + sales + ' ,year: ' + year);
        var rec = nlapiCreateRecord('customrecord_sale_rep_amounts');
        if (sales == '@NONE@') { sales = '' }
        //rec.setFieldValue('custrecord_sr_sales_rep_id', sales);
        rec.setFieldValue('custrecord_sr_sales_rep', sales);
        //rec.setFieldValue('custrecord_sr_sales_rep_cr', EmpCRId);
        rec.setFieldValue('custrecord_sr_year', year);
        rec.setFieldValue('custrecord_sr_type', 3);
        rec.setFieldValue('custrecord_sf_class', JSON.stringify(amountData));
        var Recid = nlapiSubmitRecord(rec);
        return Recid
    } catch (e) {
        nlapiLogExecution('error', 'createTran error:  ', e);
    }

}
function getEmpFromTran() {
    var revenueelementSearch = nlapiSearchRecord("revenueelement", null,
        [
            ["accountingbook", "anyof", "1"],
            "AND",
            ["revenueplan.revenueplantype", "anyof", "ACTUAL"],
            "AND",
            ["revenueplan.lineamount", "notequalto", "0.00"],
            "AND",
            ["class.custrecord_rev_rec_product_family", "noneof", "7", "19"]
        ],
        [
            new nlobjSearchColumn("salesrep", "sourceTransaction", "GROUP").setSort(true)
        ]
    );
    var empList = [];
    for (var i = 0; i < revenueelementSearch.length; i++) {
        empList.push(revenueelementSearch[i].getValue("salesrep", "sourceTransaction", "GROUP"))
    }
    return empList
}
function unique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}
function getEmpCRId(sales) {
    try {
        if (sales != '@NONE@') {
            var filters = new Array();
            filters.push(new nlobjSearchFilter('custrecord_sales_rep_id', null, 'is', sales));
            filters.push(new nlobjSearchFilter('custrecord_sales_rep_type', null, 'anyof', 3));

            var search = nlapiCreateSearch('customrecord_sales_rep', filters, null);
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
                return allSelection[0].id;
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'searchTran func', e)
    }
    return '';
}




