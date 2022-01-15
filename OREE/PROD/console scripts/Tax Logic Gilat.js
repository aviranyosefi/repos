
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var changeFlag = false;
    //var ghFlag = false;
    var subsidiary = rec.getFieldValue('subsidiary');
    if (subsidiary == '24' || subsidiary == '23') {
        nlapiLogExecution('debug', 'subsidiary :', subsidiary);
        var custumer = rec.getFieldValue('entity');
        var customerRec = nlapiLoadRecord('customer', custumer);
        var count = customerRec.getLineItemCount('addressbook');
        var itemsCount = rec.getLineItemCount('item');
        for (i = 1; i <= count; i++) {
            var dufault = customerRec.getLineItemValue('addressbook', 'defaultbilling', i);
            if (dufault == 'T') {
                var country = customerRec.getLineItemValue('addressbook', 'country', i);
                nlapiLogExecution('debug', 'country :', country);
            }
        }
        for (y = 1; y <= itemsCount; y++) {
            if (subsidiary == '24') {
                if (country == 'GH') {
                    var itype = rec.getLineItemValue('item', 'itemtype', y); // Get the item type
                    var Id = rec.getLineItemValue('item', 'item', y);
                    var recordtype = '';

                    switch (itype) {   // Compare item type to its record type counterpart
                        case 'InvtPart':
                            recordtype = 'inventoryitem';
                            break;
                        case 'NonInvtPart':
                            recordtype = 'noninventoryitem';
                            break;
                        case 'Service':
                            recordtype = 'serviceitem';
                            break;
                        case 'Assembly':
                            recordtype = 'assemblyitem';
                            break;
                        case 'GiftCert':
                            recordtype = 'giftcertificateitem';
                            break;
                        default:
                    }
                    if (recordtype == 'noninventoryitem') {
                        var item_rec = nlapiLoadRecord(recordtype, Id);
                        var VI = item_rec.getFieldValue('custitem_virtual_ar_trx')//lookupf

                        if (VI != 'T') {
                            //taxcode for ghana subsi &  ghana country & non-inventory
                            rec.setLineItemValue('item', 'taxcode', y, '795');
                            nlapiLogExecution('debug', 'ghana country & non-inventory :', '795');
                            changeFlag = true;

                        }
                        else {
                            //taxcode for ghana subsi &  ghana country & (non-inventory & VI)
                            rec.setLineItemValue('item', 'taxcode', y, '1103');
                            nlapiLogExecution('debug', 'ghana country & (non-inventory & VI) :', '1103');
                            changeFlag = true;

                        }
                    }
                    else {
                        //taxcode for ghana subsi &  ghana country & inventory 
                        rec.setLineItemValue('item', 'taxcode', y, '1103');
                        nlapiLogExecution('debug', 'ghana country & inventory :', '1103');
                        changeFlag = true;
                    }
                }
                else {
                    rec.setLineItemValue('item', 'taxcode', y, '1118');//taxcode for ghana subsi & no ghana country TaxCode 0%
                    nlapiLogExecution('debug', 'no ghana country TaxCode 0% :', '1118');
                    changeFlag = true;
                }
            }
            else {
                if (country == 'BE') {
                    rec.setLineItemValue('item', 'taxcode', y, '13');
                    nlapiLogExecution('debug', 'Belgium country :', '13');
                    changeFlag = true;
                }
                else {
                    //get eccode from tax code
                    var taxcode = rec.getLineItemValue('item', 'taxcode', y);
                    var taxCodeRec = nlapiLoadRecord('salestaxitem', taxcode);
                    var ecCode = taxCodeRec.getFieldValue('eccode');
                    if (ecCode != 'T') {
                        rec.setLineItemValue('item', 'taxcode', y, '20');
                        nlapiLogExecution('debug', 'no Belgium country & no eccode:', '13');
                        changeFlag = true;
                    }
                    else {
                        var itype = rec.getLineItemValue('item', 'itemtype', y); // Get the item type
                        var Id = rec.getLineItemValue('item', 'item', y);
                        var recordtype = '';

                        switch (itype) {   // Compare item type to its record type counterpart
                            case 'InvtPart':
                                recordtype = 'inventoryitem';
                                break;
                            case 'NonInvtPart':
                                recordtype = 'noninventoryitem';
                                break;
                            case 'Service':
                                recordtype = 'serviceitem';
                                break;
                            case 'Assembly':
                                recordtype = 'assemblyitem';
                                break;

                            case 'GiftCert':
                                recordtype = 'giftcertificateitem';
                                break;
                            default:
                        }
                        if (recordtype != '') {
                            var item_rec = nlapiLoadRecord(recordtype, Id);
                            var logisticH = item_rec.getFieldValue('custitem_logistic_handling');//lookupf

                            if (logisticH != 'T') {
                                rec.setLineItemValue('item', 'taxcode', y, '27');
                                nlapiLogExecution('debug', 'no Belgium country &  eccode & no logistic:', '27');
                                changeFlag = true;
                            }
                            else {
                                rec.setLineItemValue('item', 'taxcode', y, '22');
                                nlapiLogExecution('debug', 'no Belgium country &  eccode & logistic:', '22');
                                changeFlag = true;
                            }
                        }

                    }

                }
            }
        }
        if (changeFlag == true) {

            var newRecId = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'Record submited: ', newRecId);
        }

    }
