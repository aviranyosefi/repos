var context = nlapiGetContext();
var results = nlapiLoadSearch(null, 'customsearch364');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;
var counter = 1;
var rec = null;
var itemCount = 0;

do {
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
        s.push(resultslice[rs]);
        searchid++;
    }
} while (resultslice != null && resultslice.length >= 1000);

for (i = 0; i < s.length; i++) {
    try {
        var recId = s[i].id;
        var recType = s[i].type;
        var supNumber = s[i].getValue("custrecord_site_sap_customer_number", "CUSTCOL_SITE");
        var country = s[i].getText("custrecord_site_country", "CUSTCOL_SITE");
        var line = s[i].getValue('line');
        if (i == 0 || s[i - 1].id != recId) {
            rec = nlapiLoadRecord(recType, recId);
            itemCount = rec.getLineItemCount('item');
            console.log(counter + '- Load Record - tranID: ' + s[i].id + ', type: ' + recType);
        }
        for (y = 1; y <= itemCount; y++) {
            if (rec.getLineItemValue('item', 'line', y) == line) {
                rec.setLineItemValue('item', "custcol_site_sap_customer_number", y, supNumber);
                rec.setLineItemValue('item', "custcol_site_country", y, country);
                //var submition = nlapiSubmitRecord(rec);
                if (((i + 1) == s.length) || (s[i + 1].id != recId)) {
                    var submition = nlapiSubmitRecord(rec);
                    console.log(counter + '- Submition- tranID: ' + submition + ', type: ' + recType + ', line: ' + line + ', supNumber: ' + supNumber + ', country: ' + country);
                }
                else {
                    console.log(counter + '*********** Update- tranID: ' + recId + ', type: ' + recType + ', line: ' + line + ', supNumber: ' + supNumber + ', country: ' + country);
                }
            }
            //else {
            //    nlapiLogExecution('debug', 'R_arrangement id:' + recId + 'line: ' + line, 'does not match');
            //}
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
        }
    } catch (e) {
        console.log('error with rec: ' + recId + ', type: ' + recType);
        console.log('exception:  ' + e);
        continue;
    }
    counter++;
}


/*

        var context = nlapiGetContext();
    var results = nlapiLoadSearch(null, 'customsearch364');
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;
    var counter = 1;
    var rec = null;
    var itemCount = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    for (i = 0; i < s.length; i++) {
        try {
            nlapiGetContext().getRemainingUsage = function () { return 1000; }
debugger;
            var recId = s[i].id;
                var supNumber = s[i].getValue("custrecord_site_sap_customer_number", "CUSTCOL_SITE");
                var country = s[i].getText("custrecord_site_country", "CUSTCOL_SITE");
                var line = s[i].getValue('line');
                if (i == 0 || s[i - 1].id != recId) {
                    rec = nlapiLoadRecord(s[i].type, recId);
                    itemCount = rec.getLineItemCount('item');
                    console.log( ' Load Record - tranID: ' + s[i].id, ' type: ' + s[i].type);
                }
                for (y = 1; y <= itemCount; y++) {
                    if (rec.getLineItemValue('item', 'line', y) == line) {
                        rec.setLineItemValue('item', "custcol_site_sap_customer_number", y, supNumber);
                        rec.setLineItemValue('item', "custcol_site_country", y, country);
                        if (((i + 1) == s.length) || (s[i + 1].id != recId)) {
                            var submition = nlapiSubmitRecord(rec);
                            console.log( 'Submittion - tranID: ' + submition + ', type: ' + s[i].type + 'line: ' + line + ', supNumber: ' + supNumber + ', country: ' + country);
                        }
                        else {
                            console.log( 'update- tranID: ' + recId + ', type: ' + s[i].type + 'line: ' + line + ', supNumber: ' + supNumber + ', country: ' + country);
                        }
                    }
                }

        } catch (e) {
            console.log(  'error rec: ' + recId + ', type: ' + s[i].type);
            console.log( 'exception:  ' + e);
            continue;
        }
        counter++;
    }

 */