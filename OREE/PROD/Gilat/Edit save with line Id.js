function editSavewithlineid(){
    var context = nlapiGetContext();
    var results = nlapiLoadSearch(null, 'customsearch434');
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;
    var counter = 1;
    var rec = null;
    var itemCount = 0;
    var recloaded = false;

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
            var recType = s[i].getValue('type');
            if (recType == 'CustInvc') {
                var productFamily = s[i].getText('custrecord_rev_rec_product_family', 'class');
                var line = s[i].getValue('line');
                if (i == 0 || s[i - 1].id != recId) {
                    rec = nlapiLoadRecord('invoice', recId);
                    itemCount = rec.getLineItemCount('item');
                    nlapiLogExecution('debug', ' Load Record - tranID: ' + s[i].id, ' type: ' + recType);
                }
                //if (itemCount < 21) {
                for (y = 1; y <= itemCount; y++) {
                    if (rec.getLineItemValue('item', 'line', y) == line) {
                        rec.setLineItemValue('item', "custcol_rev_rec_product_family", y, productFamily);
                        if (((i + 1) == s.length) || (s[i + 1].id != recId)) {
                            var submition = nlapiSubmitRecord(rec);
                            nlapiLogExecution('debug', 'Submittion - tranID: ' + submition + ', type: ' + recType, 'line: ' + line + ', productFamily: ' + productFamily);
                            console.log(counter + ' ');
                        }
                        else {
                            nlapiLogExecution('debug', 'update- tranID: ' + recId + ', type: ' + recType, 'line: ' + line + ', productFamily: ' + productFamily);
                        }

                    }

                    if (context.getRemainingUsage() < 150) {
                        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                    }
                }
            }
                //}
            } catch (e) {
                nlapiLogExecution('ERROR', 'rec: ' + recId + ', type: ' + recType);
                nlapiLogExecution('ERROR', 'exception:  ' + e);
                continue;
            }
            counter++;
    }
}
