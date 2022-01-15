function updateSumFileds() {
    var context = nlapiGetContext();
    var results = nlapiLoadSearch(null, 'customsearch_update_site_recurring');
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

            var recId = s[i].getValue('internalid', 'CUSTRECORD_IB_SITE', 'group');
            var rec = nlapiLoadRecord('customrecord_site', recId);
            nlapiLogExecution('debug', ' Load Record ', 'siteID: ' + recId);

            var originalCurrAmt = parseFloat(s[i].getValue('formulanumeric', null, 'SUM'));
            var OrigCurr = s[i].getText('custrecord_ib_orig_trx_currency', null, 'GROUP');
            var OrigCurrency = s[i].getValue('custrecord_ib_orig_trx_currency', null, 'GROUP');

            if (OrigCurr != 'USD') {
                var exchangeR = parseFloat(nlapiExchangeRate(OrigCurr, 'USD'));
                

                var usdSummary = originalCurrAmt * exchangeR;
                usdSummary = parseFloat(usdSummary.toFixed(2));

                rec.setFieldValue('custrecord_site_monthly_billing_usd', usdSummary);
                rec.setFieldValue('custrecord_monthly_billing_orig_curr', originalCurrAmt);
                rec.setFieldValue('custrecord_recurring_serv_curr', OrigCurrency);

                var submition = nlapiSubmitRecord(rec);
                nlapiLogExecution('AUDIT', 'Submittion - siteID: ' + submition + ', USDSum: ' + usdSummary, 'origSum: ' + originalCurrAmt + ', Currency: ' + OrigCurr);

            }
            else {
                rec.setFieldValue('custrecord_site_monthly_billing_usd', originalCurrAmt);
                rec.setFieldValue('custrecordmonthly_billing_orig_curr', originalCurrAmt);
                rec.setFieldValue('custrecord_recurring_serv_curr', OrigCurrency);

                var submition = nlapiSubmitRecord(rec);
                nlapiLogExecution('AUDIT', 'Submittion - siteID: ' + submition + ', USDSum: ' + usdSummary, 'origSum: ' + originalCurrAmt + ', Currency: USD');
            }
        } catch (e) {
            nlapiLogExecution('ERROR', 'rec: ' + recId, e);
            continue;
        }
    }
}