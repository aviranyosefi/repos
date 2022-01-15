function aftersubmit() {

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

                    var item_rec = nlapiLoadRecord(recordtype, Id);
                    var CSTFlag = item_rec.getFieldValue('custitem_no_cst_charge');

                    if (recordtype == 'noninventoryitem' && CSTFlag != 'T') {
                        //var item_rec = nlapiLoadRecord(recordtype, Id);
                        var VI = item_rec.getFieldValue('custitem_virtual_ar_trx')//lookupf
                        if (VI != 'T') {
                            //taxcode for ghana subsi &  ghana country & non-inventory = VAT (12.5%) GH on Sales
                            rec.setLineItemValue('item', 'taxcode', y, nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_cst_group_code'));
                            nlapiLogExecution('debug', 'ghana country & non-inventory :', nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_cst_group_code'));
                            changeFlag = true;

                        }
                        else {
                            //taxcode for ghana subsi &  ghana country & (non-inventory & VI) = VAT (12.5%) GH on Sales (CST 0%)
                            rec.setLineItemValue('item', 'taxcode', y, nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_no_cst_group_code'));
                            nlapiLogExecution('debug', 'ghana country & (non-inventory & VI) :', nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_no_cst_group_code'));
                            changeFlag = true;

                        }
                    }
                    else {
                        //taxcode for ghana subsi &  ghana country & inventory VAT = (12.5%) GH on Sales (CST 0%)
                        rec.setLineItemValue('item', 'taxcode', y, nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_no_cst_group_code'));
                        nlapiLogExecution('debug', 'ghana country & inventory :', nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_no_cst_group_code'));
                        changeFlag = true;
                    }
                }
                else {
                    //taxcode for ghana subsi & no ghana country = Zero rate GH
                    rec.setLineItemValue('item', 'taxcode', y, nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_tax_code_zero'));
                    nlapiLogExecution('debug', 'no ghana country TaxCode 0% :', nlapiLookupField('customrecord_cst_tax_item', '1', 'custrecord_tax_code_zero'));
                    changeFlag = true;
                }
            }
            else {
                if (country == 'BE') {
                    //taxcode for belgium subsi & belgium country = S-BE - Standard rate
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
                        //taxcode for belgium subsi &  no belgium country & ecCode != 'T' = Z-BE - Zero rated sales
                        rec.setLineItemValue('item', 'taxcode', y, '24');
                        nlapiLogExecution('debug', 'no Belgium country & no eccode:', '24');
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
                                //taxcode for belgium subsi &  no belgium country & ecCode != 'F' & logisticH != 'T' = ESSS-BE - EC Sales (services)
                                rec.setLineItemValue('item', 'taxcode', y, '27');
                                nlapiLogExecution('debug', 'no Belgium country &  eccode & no logistic:', '27');
                                changeFlag = true;
                            }
                            else {
                                //taxcode for belgium subsi &  no belgium country & ecCode != 'F' & logisticH != 'F' = ES-BE - EC sales and purchases (goods)
                                rec.setLineItemValue('item', 'taxcode', y, '22');
                                nlapiLogExecution('debug', 'no Belgium country &  eccode & no logistic:', '27');
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
}