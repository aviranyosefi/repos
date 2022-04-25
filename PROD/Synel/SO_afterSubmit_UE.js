var context = nlapiGetContext();
function afterSubmit(type) {
    try {
        var rectype = nlapiGetRecordType();
        nlapiLogExecution('debug', 'SCRIPT', 'START - ' + rectype);
        if (type != 'delete') {
            if (rectype == 'salesorder') {
                var so_id = nlapiGetRecordId();
                var newRec = nlapiGetNewRecord();
                var oldRec = nlapiGetOldRecord();

                if (oldRec == null)
                    oldRec = newRec;

                var rec = nlapiLoadRecord(rectype, so_id);

                var so_count = newRec.getLineItemCount('item');
                for (var i = so_count; i >= 1; i--) {
                    try {

                        var new_create_single_itf_chb = newRec.getLineItemValue('item', 'custcol_create_single_itf', i);
                        var old_create_single_itf_chb = oldRec.getLineItemValue('item', 'custcol_create_single_itf', i);
                        var qty = newRec.getLineItemValue('item', 'quantity', i);

                        var ffcid = '';

                        if (new_create_single_itf_chb != old_create_single_itf_chb && new_create_single_itf_chb == 'T' && qty == 1) {

                            var line_id = rec.getLineItemValue('item', 'line', i);
                            nlapiLogExecution('debug', 'line: ' + i, line_id);
                            ffcid = ffcreation(rec, line_id, i);

                        }
                        nlapiLogExecution('debug', 'ffcid:  ', ffcid);

                        if (!isNullOrEmpty(ffcid)) {
                            rec.setLineItemValue('item', 'custcol_related_single_itf', i, ffcid);
                            caseCreation(ffcid);
                        }
                    } catch (e) {
                        nlapiLogExecution('error', 'line: ' + i + ' - afterSubmit error:  ', e)
                        continue;
                    }
                }
                var id = nlapiSubmitRecord(rec);
                nlapiLogExecution('debug', 'so saved id:  ', id);
            }
            if (rectype == 'supportcase') {
                var newRec = nlapiGetNewRecord();
                var oldRec = nlapiGetOldRecord();

                var newsite = newRec.getFieldValue('custevent_site');
                var oldsite = oldRec.getFieldValue('custevent_site');
                var status = newRec.getFieldValue('status');
                var related_fulfillmentid = newRec.getFieldValue('custevent_related_fulfillment');

                if (newsite != oldsite && !isNullOrEmpty(related_fulfillmentid) && status != 5) {//5 - סגורה

                    var related_fulfillment = nlapiLoadRecord('itemfulfillment', related_fulfillmentid);
                    related_fulfillment.setFieldValue('custbody_site', newsite);
                    related_fulfillment.setLineItemValue('item', 'custcol_site', 1, newsite);

                    var fulfillmentId = nlapiSubmitRecord(related_fulfillment);
                    nlapiLogExecution('debug', 'fulfillmentId', fulfillmentId);

                }
            }
        }
        return true;

    } catch (e) {
        nlapiLogExecution('error', 'afterSubmit error:  ', e)
    }
}

function ffcreation(soRec, solineid, line_i) {

    var itemFulfillment = nlapiTransformRecord('salesorder', soRec.id, 'itemfulfillment');
    //var soline = itemFulfillment.findLineItemValue('item', 'line', solineid);
    var site = soRec.getLineItemValue('item', 'custcol_site', line_i);

    var user = context.user;
    itemFulfillment.setFieldValue('custbody_transaction_creator', user);


    nlapiLogExecution('debug', 'soline: ' + line_i, 'solineid: ' + solineid);

    var ffline = itemFulfillment.findLineItemValue('item', 'orderline', solineid)
    nlapiLogExecution('debug', 'ffline: ', ffline);

    if (ffline != -1) {

        itemFulfillment.setFieldValue('custbody_transaction_creator', user);
        itemFulfillment.setLineItemValue('item', 'quantity', ffline, 1);
        itemFulfillment.setLineItemValue('item', 'itemreceive', ffline, 'T');
        itemFulfillment.setFieldValue('custbody_delivered_by', 1);//טכנאי סינאל
        itemFulfillment.setFieldValue('shipstatus', 'B');//Packed
        itemFulfillment.setFieldValue('custbody_site', site);
        var fulfillmentId = nlapiSubmitRecord(itemFulfillment);
        nlapiLogExecution('debug', 'fulfillmentId', fulfillmentId);

    }


    return fulfillmentId;
}

/*
function ffcreation(soRec, soline) {

    var itemFulfillment = nlapiTransformRecord('salesorder', soRec.id, 'itemfulfillment');
    var site = soRec.getLineItemValue('item', 'custcol_site', soline);
    var ff_count = itemFulfillment.getLineItemCount('item');
    for (var j = ff_count; j >= 1; j--) {

        nlapiLogExecution('debug', 'soline ' + soline, 'ff line: ' + j + ' of ' + ff_count);

        var ffline = itemFulfillment.getLineItemValue('item', 'orderline', j);
        if (ffline == soline) {
            itemFulfillment.setLineItemValue('item', 'itemreceive', ffline, 'T');
            itemFulfillment.setFieldValue('custbody_delivered_by', 1);//טכנאי סינאל
            itemFulfillment.setFieldValue('shipstatus', 'B');//Packed
            itemFulfillment.setFieldValue('custbody_site', site);
        }

    }
    var fulfillmentId = nlapiSubmitRecord(itemFulfillment);
    nlapiLogExecution('debug', 'fulfillmentId', fulfillmentId);
    return fulfillmentId;
}
*/

function caseCreation(ffcid) {

    nlapiLogExecution('debug', 'case', 'created');
    //var ffRec = nlapiLoadRecord('itemfulfillment', ffcid);

    var custid = nlapiLookupField('itemfulfillment', ffcid, 'entity');
    var siteid = nlapiLookupField('itemfulfillment', ffcid, 'custbody_site');

    var caseRec = nlapiCreateRecord('supportcase');

    caseRec.setFieldValue('customform', 89);//Synel Technician Case Form
    caseRec.setFieldValue('origin', 6);
    caseRec.setFieldValue('company', custid);
    caseRec.setFieldValue('custevent_site', siteid);
    caseRec.setFieldValue('custevent_related_fulfillment', ffcid);
    caseRec.setFieldValue('category', 5);//קריאת התקנה
    caseRec.setFieldValue('title', 'קריאת התקנה');
    caseRec.setFieldValue('assigned', 1442);//מנהל צוות טכנאי שטח

    var caseRecId = nlapiSubmitRecord(caseRec);
    nlapiLogExecution('debug', 'caseRecId', caseRecId);

    nlapiSubmitField('itemfulfillment', ffcid, 'custbody_related_support_case', caseRecId);


    return
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
