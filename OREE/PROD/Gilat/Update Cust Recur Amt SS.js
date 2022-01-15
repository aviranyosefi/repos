function updateSumFileds() {
    var context = nlapiGetContext();
    var results = nlapiLoadSearch(null, 'customsearch_update_cust_rec');
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
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            var recId = s[i].getValue('internalid', 'CUSTRECORD_IB_CUSTOMER', 'group');
            var rec = nlapiLoadRecord('customer', recId);
            nlapiLogExecution('debug', ' Load Record ', 'customerID: ' + recId);

            var originalCurrAmt = parseFloat(s[i].getValue('formulanumeric', null, 'SUM'));
            var OrigCurr = s[i].getText('custrecord_ib_orig_trx_currency', null, 'GROUP');

            if (OrigCurr != 'USD') {
                var exchangeR = parseFloat(nlapiExchangeRate(OrigCurr, 'USD'));


                var usdSummary = originalCurrAmt * exchangeR;
                usdSummary = parseFloat(usdSummary.toFixed(2));

                rec.setFieldValue('custentity_customer_monthly_billing_usd', usdSummary);

                var submition = nlapiSubmitRecord(rec);
                nlapiLogExecution('AUDIT', 'Submittion - customerID: ' + submition , 'USDSum: ' + usdSummary + ', Currency: ' + OrigCurr);

            }
            else {
                rec.setFieldValue('custentity_customer_monthly_billing_usd', originalCurrAmt);

                var submition = nlapiSubmitRecord(rec);
                nlapiLogExecution('AUDIT', 'Submittion - customerID: ' + submition , 'USDSum: ' + usdSummary + ', Currency: USD');
            }
        } catch (e) {
            nlapiLogExecution('ERROR', 'rec: ' + recId, e);
            continue;
        }
    }
}