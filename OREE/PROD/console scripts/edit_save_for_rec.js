function validatenudgetfields() {
    updatebudgetunits('customrecord_control_budgeting_unit');
    updatebudgetunits('customrecord_annual_budgeting_unit');
}

function updatebudgetunits(recType) {
    try {
        var results = nlapiCreateSearch(recType, null, null);
        var runSearch = results.runSearch();
        var s = [];
        var searchid = 0;
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        for (i = 0; i < s.length; i++) {
            var rec = nlapiLoadRecord(recType, s[i].getId());
            var verification = nlapiSubmitRecord(rec);
            console.log('s.index = ' + i +' verification ID= ' + verification);
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
        }
    } catch (e) {
        console.error(e);
    }
}

function editSaveByLoadSearch() {

    var results = nlapiLoadSearch(null, 'customsearch623');
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    for (i = 0; i < s.length; i++) {
        try {
            type = s[i].getValue("type", null, "GROUP")
            if (type == "VendBill") { type = "vendorbill"; }
            else if (type == "VendCred") { type = "vendorcredit"; }
            else if (type == "Journal") { type = "journalentry"; }
            else if (type == "PurchOrd") { type = "purchaseorder"; }

            var rec = nlapiLoadRecord(type, s[i].getValue("internalid", null, "GROUP"));
            var verification = nlapiSubmitRecord(rec,null,true);
            console.log('s = ' + i + ' - record:' + verification);
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
        } catch (e) {
            console.log('error: s = ' + i + ' - record:' + verification);
            console.log('detail: ' + e);
            continue;
        }
    }
}

//Selina
function editSaveByLoadSearch_account() {

    var results = nlapiLoadSearch(null, 'customsearch_accounts_missing_classifica');
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    for (i = 0; i < s.length; i++) {
        try {
            id = s[i].getValue("internalid")

            var rec = nlapiLoadRecord('account', id);
            var verification = nlapiSubmitRecord(rec, null, true);
            //console.log('s = ' + i + ' - account:' + verification);
            nlapiLogExecution('debug', 's = ' + i , 'account:' + verification);
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
        } catch (e) {
            //console.log('error: s = ' + i + ' - record:' + verification);
            //console.log('detail: ' + e);
            nlapiLogExecution('debug', 'error with rec: ', id);
            nlapiLogExecution('debug', 'exception:  ', e);
            continue;
        }
    }
}