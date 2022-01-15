var context = nlapiGetContext();
var results = nlapiLoadSearch(null, 'customsearch247');
var runSearch = results.runSearch();
var s = [];
var searchid = 0;
var counter = 1;

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
            var subaccount = s[i].getValue('cseg3','item');
            var line = s[i].getValue('line');
            var rec = nlapiLoadRecord('vendorbill', recId);
            var itemCount = rec.getLineItemCount('item');
            for (y = 1; y <= itemCount; y++) {
                if (rec.getLineItemValue('item', 'line', y) == line) {
                    rec.setLineItemValue('item', 'custcol_sub_account_trans', line, subaccount);
                    var submition = nlapiSubmitRecord(rec);
                    console.log(counter + '- success : tranID, line, subaccount :', s[i].id + ', ' + submition + ', ' + line + ', ' + subaccount);

                }
                //else {
                //    nlapiLogExecution('debug', 'R_arrangement id:' + recId + 'line: ' + line, 'does not match');
                //}
                if (context.getRemainingUsage() < 150) {
                    nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                    if (state.status == 'FAILURE') {
                        console.log('Error Failed to yeild script');
                    }
                    else if (state.status == 'RESUME') {
                        console.log("Resuming script due to: " + state.reason + ",  " + state.size);
                    }
                }
            }
        } catch (e) {
            console.log('error with rec: ', recId);
            console.log('exception:  ', e);
            continue;
        }
        counter++;
    }

