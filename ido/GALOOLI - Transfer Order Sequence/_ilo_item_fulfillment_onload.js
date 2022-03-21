var checkCreatedFrom = '';

function getLastTransfer() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid', null, 'max');

    var s = nlapiSearchRecord('transferorder', null, null, columns);
    if (s) {
        var id = s[0].getValue(columns[0]);
        if (id) {
            var fields = ['tranid', 'trandate', 'internalid'];
            var columns = nlapiLookupField('transferorder', id, fields);
            var tranid = columns.tranid;
            var trandate = columns.trandate;
            var recid = columns.internalid;

            var transferObj = {
                lastTransfer: tranid,
                trandate: trandate,
                recID: recid
            };
        };
    };


    return transferObj;
}


function getLastJob() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid', null, 'max');

    var s = nlapiSearchRecord('customrecord_ilo_transfer_job', null, null, columns);
    if (s) {
        var id = s[0].getValue(columns[0]);
        if (id) {
            var fields = ['custrecord_ilo_transfer_recid', 'internalid'];
            var columns = nlapiLookupField('customrecord_ilo_transfer_job', id, fields);
            var tranid = columns.custrecord_ilo_transfer_recid;
            var recid = columns.internalid;

            var jobObj = {
                lastTransfer: tranid,
                recID: recid
            };
        };
    };


    return jobObj;
}

var job = getLastJob();

function itemfullfillment_onload(type) {

            checkCreatedFrom = nlapiGetFieldValue('createdfrom');
    nlapiLogExecution('debug', 'type', type)
    if (type == 'create' && checkCreatedFrom != "") {


        var lastTransfer = getLastTransfer();

        
        if(lastTransfer != undefined) {

        if (lastTransfer.recID == checkCreatedFrom) {

            nlapiSetFieldValue('shipstatus', 'C', null, null)

        }
        }//  if(lastTransfer != undefined)
    }

    if (type == 'view') {

        var lastTransfer = getLastTransfer();

        var rec = nlapiLoadRecord('itemfulfillment', nlapiGetRecordId());
        checkCreatedFrom = rec.getFieldValue('createdfrom');
        if(lastTransfer != undefined) {
        
        if (lastTransfer.recID == checkCreatedFrom) {

            if(job != undefined) {
            var jobRec = nlapiLoadRecord('customrecord_ilo_transfer_job', job.recID);

            var checkStage = jobRec.getFieldValue('custrecord_ilo_transfer_shipped');
            var checkNextStage = jobRec.getFieldValue('custrecord_ilo_transfer_recieved');

            var transferID = jobRec.getFieldValue('custrecord_ilo_transfer_recid')

            if (checkStage == 'T' && checkNextStage == 'F') {

                nlapiSetRedirectURL('RECORD', 'transferorder', transferID, false);
            }
            }//if(job != undefined)
        }
        }//if(lastTransfer != undefined)


    }
    
    

}


function afterSubmitItemFullfillment() {
                       var checkCreatedFrom = nlapiGetFieldValue('createdfrom');
           try {
                var sorec = nlapiLoadRecord('salesorder', checkCreatedFrom);

                nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_ilo_so_sales_person', sorec.getFieldValue('salesrep'));
                nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_ilo_so_terms', sorec.getFieldText('terms'));
            }
            catch (ex) {
                nlapiLogExecution('ERROR', 'afterSubmitItemFullfillment', ex.message);
            }
    if (type == 'create') {

        var jobObj = getLastJob();

        if(jobObj != undefined) {

        if (jobObj.lastTransfer == checkCreatedFrom) {

            nlapiSubmitField('customrecord_ilo_transfer_job', jobObj.recID, 'custrecord_ilo_transfer_shipped', 'T');
        }

        }// if(jobObj != undefined)
    }

}

function beforeSubmitItemFullfillment() {
    try
    {
        var lineItemCount = nlapiGetLineItemCount('item');
        nlapiLogExecution('debug', 'count', lineItemCount);
        for (var line = 1; line <= lineItemCount; line++) {
            var weight = 0;
            var itemweight = nlapiGetLineItemValue('item', 'itemweight', line);
            var quantity = nlapiGetLineItemValue('item', 'quantity', line);
            if (!(isNullOrEmpty(itemweight) || isNaN(itemweight))) {
                weight = tryParseFloat(itemweight * 0.453592);
            }
            nlapiLogExecution('debug', 'afterSubmitItemFullfillment', 'weight: ' + weight + 'line' + line);
            nlapiSetLineItemValue('item', 'custcol_ilo_item_weight_kg', line, weight);
            nlapiSetLineItemValue('item', 'custcol_ilo_item_totalweight_kg', line, tryParseFloat(weight * quantity));
        }
    }
    catch (ex) {
        nlapiLogExecution('ERROR', 'beforeSubmitItemFullfillment', ex.message);
    }
}

function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function tryParseFloat(val) {
    if (isNullOrEmpty(val) || isNaN(val)) {
       return 0.00;
    }
    else {
        return parseFloat(val).toFixed(2);
    }
}

