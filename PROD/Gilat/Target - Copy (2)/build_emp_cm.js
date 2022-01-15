var context = nlapiGetContext();
function buildEmp() {
    try {  
        var salesList = getSalesRep()
        nlapiLogExecution('debug', 'salesList ' + salesList.length, salesList);
        //nlapiLogExecution('debug', 'ProductFamilyList ', JSON.stringify(ProductFamilyList));
        for (var j = 0; j < salesList.length; j++) {
            try {
                Context(context)  
                sales = salesList[j];
                if (!isNullOrEmpty(sales)) {
                    var id = searchTran(sales)
                    if (isNullOrEmpty(id)) {
                        id = createTran(sales)
                    }
                    nlapiLogExecution('debug', 'sales ' + sales + ' id: ' + id, '');      
                }                        
            } catch (e) {
                nlapiLogExecution('error', 'loop lines error: ' +e, 'line: '+j);
            }            
        }
    }
    catch (e) {
        nlapiLogExecution('error', 'getAmountPf error ', e);
    }
}
function getSalesRep() {
    var gilat_targets = nlapiSearchRecord("customrecord_gilat_targets", null,
        [
            ["custrecord_gt_type", "anyof", "3"]
        ],
        [
            new nlobjSearchColumn("custrecord_gt_sales_rep", null, "GROUP")
        ]
    );
    nlapiLogExecution('debug', 'gilat_targets  ', gilat_targets.length);
    var empList = [];
    for (var i = 0; i < gilat_targets.length; i++) {
        empList.push(gilat_targets[i].getValue("custrecord_gt_sales_rep", null, "GROUP"))
    }
    var empListTrn = getEmpFromTran();
    var s = unique(empList.concat(empListTrn));
    return s;
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
            new nlobjSearchColumn("salesrep", "sourceTransaction", "GROUP").setSort(true),
            new nlobjSearchColumn("salesrep", "sourceTransaction", "GROUP").setSort(true)
        ]
    );
    var empList = [];
    for (var i = 0; i < revenueelementSearch.length; i++) {
        empList.push(revenueelementSearch[i].getValue("salesrep", "sourceTransaction", "GROUP"))
    }
    return empList
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
function searchTran(sales) {
    try {
        //nlapiLogExecution('debug', 'searchTran func', 'searchTran')
        debugger
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
            return allSelection[0].id
        }
    } catch (e) {
        nlapiLogExecution('error', 'searchTran func', e)
    }
    return '';
}
function createTran(sales) {
    try {
        nlapiLogExecution('debug', 'createTran ', 'sales: ' + sales);
        var rec = nlapiCreateRecord('customrecord_sales_rep');    
        rec.setFieldValue('custrecord_sales_rep_id', sales);
        var name = nlapiLookupField('employee', sales, ["firstname", "lastname", "entityid"])
        var firstname = name.firstname
        var lastname = name.lastname
        rec.setFieldValue('custrecord_sales_rep_fname', firstname);
        rec.setFieldValue('custrecord_sales_rep_lname', lastname );
        rec.setFieldValue('name', name.entityid + ' ' + firstname + ' ' + lastname);
        rec.setFieldValue('custrecord_sales_rep_type', 3);
        var recid = nlapiSubmitRecord(rec);
        return recid;
    } catch (e) {
        nlapiLogExecution('error', 'createTran error:  ', e);
    }
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


