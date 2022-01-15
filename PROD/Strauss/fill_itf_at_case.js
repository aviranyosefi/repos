function afterSUbmit(type) {
    try {
        if (type != 'delete') {
            var itfId = nlapiGetRecordId();               
            var rec = nlapiLoadRecord('itemfulfillment', itfId)
            var ordertype = rec.getFieldValue('ordertype');
            var createdfrom = rec.getFieldValue('createdfrom');
            nlapiLogExecution('debug', 'itf: ' + itfId, 'ordertype: ' + ordertype);
            if (!isNullOrEmpty(createdfrom) && ordertype == 'SalesOrd') {                          
                updateItfAtCase(createdfrom, itfId);
            }                 
        }
    } catch (e) {
        nlapiLogExecution('debug', 'error: ', e);
    }
}

function updateItfAtCase(createdfrom, itfId) {
    try { 
        var supportcaseSearch = [];
        supportcaseSearch = nlapiSearchRecord("supportcase", null,
            [
                ["custevent_source_transaction", "anyof", createdfrom],
                "AND",
                ["custevent_source_transaction.type", "anyof", "SalesOrd"],
                "AND",
                ["custevent_source_transaction.mainline", "is", "T"],
                "AND",
                ["custevent_related_fulfillment", "anyof", "@NONE@"]
            ],
            [
                new nlobjSearchColumn("casenumber").setSort(false),
            ]
        );
        nlapiLogExecution('debug', 'supportcaseSearch: ', supportcaseSearch.length);
        if (supportcaseSearch != null) {
            for (var i = 0; i < supportcaseSearch.length; i++) {
                if (!isNullOrEmpty(supportcaseSearch[i].id)){
                    nlapiSubmitField('supportcase', supportcaseSearch[i].id, 'custevent_related_fulfillment', itfId);
                }
            }      
            }
    } catch (e) {
        nlapiLogExecution('debug', 'updateItfAtCase error: ', e);}
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}