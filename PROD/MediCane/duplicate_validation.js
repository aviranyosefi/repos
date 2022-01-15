function ValidateRec(type,name) {
    var typeRec = nlapiGetRecordType();
    var RecId = nlapiGetRecordId();
    nlapiLogExecution('DEBUG', 'typeRec ', typeRec)
    if (name == 'name') {
        var name = nlapiGetFieldValue('name');
        if (typeRec == "customrecord_medicane_lot") {          
            var block = true;
            if (!isNullOrEmpty(name)) {
                var MedicanelotList = getMedicanelot(name);
                if (RecId == "" && MedicanelotList.length > 0) { block = false } // type create
                else if (RecId != "") {
                    if (MedicanelotList.length > 1) { block = false }
                    else if (MedicanelotList.length == 1) {
                        if (RecId != MedicanelotList[0].id) { block = false }
                    }
                }
            }
            if (block) { return true }
            else {
                alert('MD Batch whit: ' + name + ' Name alredy exist.\nID: ' + MedicanelotList[0].id);
                nlapiSetFieldValue('name','')
                return false;
            }
        }
        else if (typeRec == "customrecord_md_sub_lot") {
            var block = true;         
            if (!isNullOrEmpty(name)) {
                var MDProductionLotList = getMDProductionLot(name);
                if (RecId == "" && MDProductionLotList.length > 0) { block = false } // type create
                else if (RecId != "") {
                    if (MDProductionLotList.length > 1) { block = false }
                    else if (MDProductionLotList.length == 1) {
                        if (RecId != MDProductionLotList[0].id) { block = false }
                    }
                }
            }
            if (block) { return true }
            else {
                alert('MD Production Lot whit: ' + name + ' Name alredy exist.\nID: ' + MDProductionLotList[0].id);
                nlapiSetFieldValue('name', '')
                return false;
            }
        }
    }
    return true
}


function getMedicanelot(name) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', name)

    var search = nlapiCreateSearch('customrecord_medicane_lot', filters, null);

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
            });  
        }    
    }
    return results;
}
function getMDProductionLot(name) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', name)

    var search = nlapiCreateSearch('customrecord_md_sub_lot', filters, null);

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
            });
        }

    }
    return results;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}