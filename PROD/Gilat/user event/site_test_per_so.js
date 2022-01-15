function afterSubmit(type) {
    try {
        if (type != 'delete') {
            var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
            if (rec.getFieldValue('custbody7') == 'T') {
                IndicationToNO();
                IndicationToYES();
            }
        }
    } catch (e) {

    }
}

function IndicationToNO() {
    var search = nlapiLoadSearch(null, 'customsearch_site_test_checkbox_2');  
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
    } while (resultslice.length >= 1000);
    if (s != null) {
        s.forEach(function (element) {
            try { 
                nlapiSubmitField('customrecord_site', element.getValue("custcol_site", null, "GROUP"), 'custrecord_site_test', 'F')
            } catch (e) { }
        });
    }
    return results;
}
function IndicationToYES() {
    var search = nlapiLoadSearch(null, 'customsearch_site_test_checkbox_2_2');
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
    } while (resultslice.length >= 1000);
    if (s != null) {
        s.forEach(function (element) {
            try {
                nlapiSubmitField('customrecord_site', element.getValue("custcol_site", null, "GROUP"), 'custrecord_site_test', 'T')
            } catch (e) { }
        });
    }
    return results;
}