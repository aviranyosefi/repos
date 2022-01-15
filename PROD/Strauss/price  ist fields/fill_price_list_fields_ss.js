var context = nlapiGetContext();
function ssRun() {
    try { 
        var getResult = searchLoad();
        nlapiLogExecution('DEBUG', 'getResult: ' + getResult.length, JSON.stringify(getResult));
        for (var i = 0; i < getResult.length; i++) {
            try { 
                var PLrec = nlapiLoadRecord('customrecord_customer_price_list', getResult[i].id)
                var QUOTErec = nlapiLoadRecord('estimate', getResult[i].quote);
                PLrec.setFieldValue('custrecord_pl_customer', QUOTErec.getFieldValue('entity'))
                PLrec.setFieldValue('custrecord_pl_agreement', QUOTErec.getFieldValue('custbody_agreement'))
                nlapiSubmitRecord(PLrec)
            } catch (e) {
                nlapiLogExecution('DEBUG', 'nlapiLoadRecord Customer Price List', getResult[i].id);
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'ssRun ', getResult[i].id);
    }

}

function searchLoad() {
    var result = [];
    var listSearch = nlapiSearchRecord("customrecord_customer_price_list", null,
        [
            ["custrecord_pl_quote", "noneof", "@NONE@"],
            "AND",
            ["custrecord_pl_quote.mainline", "is", "T"],
            "AND",
            ["custrecord_pl_quote.custbody_agreement", "noneof", "@NONE@"],
            "AND",
            ["custrecord_pl_customer", "anyof", "@NONE@"],
            "AND",
            ["custrecord_pl_agreement", "anyof", "@NONE@"]
        ],
        [
            new nlobjSearchColumn("internalid", "CUSTRECORD_PL_QUOTE", null),            
        ]
    );
    if (listSearch != null) {

        for (var i = 0; i < listSearch.length; i++) {
            result.push({
                id: listSearch[i].id,
                quote: listSearch[i].getValue("internalid", "CUSTRECORD_PL_QUOTE", null)
            })
        }
    }
    return result
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}