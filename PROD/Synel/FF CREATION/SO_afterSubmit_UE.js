var context = nlapiGetContext();
function afterSubmit(type) {
    try {
        var rectype = nlapiGetRecordType();
        if (type != 'delete') {
            if (rectype == 'salesorder') {
                var so_id = nlapiGetRecordId();
                //var newRec = nlapiGetNewRecord();
                //var oldRec = nlapiGetOldRecord();

                //if (oldRec == null)
                //    oldRec = newRec;

                var rec = nlapiLoadRecord(rectype, so_id);

                var so_count = rec.getLineItemCount('item');
                for (var i = so_count; i >= 1; i--) {
                    try {
                        var new_create_single_itf_chb = rec.getLineItemValue('item', 'custcol_create_single_itf', i);
                        var related_single_itf = rec.getLineItemValue('item', 'custcol_related_single_itf', i);
                        //var old_create_single_itf_chb = oldRec.getLineItemValue('item', 'custcol_create_single_itf', i);
                        var qty = rec.getLineItemValue('item', 'quantity', i);
                        var ffcid = '';
                        if (isNullOrEmpty(related_single_itf) && new_create_single_itf_chb == 'T' && qty == 1) {
                            var item = rec.getLineItemValue('item', 'item', i);
                            var case_indicator = nlapiLookupField('item', item, 'custitem_case_indicator')
                            if (case_indicator == 'T') {
                                var line_id = rec.getLineItemValue('item', 'line', i);
                                ffcid = ffcreation(rec, line_id, i);
                                if (!isNullOrEmpty(ffcid)) {
                                    rec.setLineItemValue('item', 'custcol_related_single_itf', i, ffcid);
                                    caseCreation(ffcid);
                                }
                            }            
                        }                    
                    } catch (e) {
                        nlapiLogExecution('error', 'line: ' + i + ' - afterSubmit error:  ', e)
                        continue;
                    }
                }
                var id = nlapiSubmitRecord(rec);
            }
            else if (rectype == 'supportcase') {
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
                }
            }
        }
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



    var ffline = itemFulfillment.findLineItemValue('item', 'orderline', solineid)

    if (ffline != -1) {

        itemFulfillment.setFieldValue('custbody_transaction_creator', user);
        itemFulfillment.setLineItemValue('item', 'quantity', ffline, 1);
        itemFulfillment.setLineItemValue('item', 'itemreceive', ffline, 'T');
        itemFulfillment.setFieldValue('custbody_delivered_by', 1);//טכנאי סינאל
        itemFulfillment.setFieldValue('shipstatus', 'B');//Packed
        itemFulfillment.setFieldValue('custbody_site', site);
        var fulfillmentId = nlapiSubmitRecord(itemFulfillment);

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

    nlapiSubmitField('itemfulfillment', ffcid, 'custbody_related_support_case', caseRecId);


    return
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
