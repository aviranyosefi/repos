function beforesubmit() {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = nlapiGetLineItemCount('item');
    var changeFlag = false;
    for (var i = 1; i <= count; i++) { // Loop through each of the items in the sublist

        var itype = nlapiGetLineItemValue('item', 'itemtype', i); // Get the item type
        var Id = nlapiGetLineItemValue('item', 'item', i);
        var recordtype = '';
        var clas = '';
        var income = '';

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
        if (recordtype == 'inventoryitem') {

            var item_rec = nlapiLoadRecord('inventoryitem', Id);
            income = item_rec.getFieldValue('incomeaccount');//lookupf
            clas = item_rec.getFieldValue('class');
            var vrItem = getVRItem(income, clas);
            if (vrItem != -1) {
                insertnewlineitem(vrItem, i);
                //changeFlag = true;
            }
            else {
                vrItem = createvritem(income, clas);
                nlapiLogExecution('debug', 'vrItem after create: ', vrItem);
                if (vrItem != -1) {
                    insertnewlineitem(vrItem, i);
                    //changeFlag = true;
                }
            }
        }
    }
    /*    nlapiLogExecution('debug', 'changeFlag: ', changeFlag);
        if (changeFlag == true) {
    
            var newRecId = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'insertnewlineitem: ', newRecId);
        }*/
}


function getVRItem(income, clas) {
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'NonInvtPart');
    filters[1] = new nlobjSearchFilter('account', null, 'is', income);
    filters[2] = new nlobjSearchFilter('class', null, 'is', clas);
    filters[3] = new nlobjSearchFilter('custitem_virtual_ar_trx', null, 'is', 'T');


    var search = nlapiCreateSearch('item', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;

    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s.length > 0) {
        return s[0].id;
    }
    else return -1;
}

function insertnewlineitem(vrItem, index) {
    //newRec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    nlapiLogExecution('debug', 'insertnewlineitem: ', vrItem);
    nlapiInsertLineItem('item', index);

    nlapiSetLineItemValue('item', 'item', index, vrItem);
    nlapiSetLineItemValue('item', 'custcol_orig_so_item', index, nlapiGetLineItemValue('item', 'item', index + 1));
    nlapiSetLineItemValue('item', 'description', index, nlapiGetLineItemValue('item', 'description', index + 1));
    nlapiSetLineItemValue('item', 'rate', index, nlapiGetLineItemValue('item', 'rate', index + 1));
    nlapiSetLineItemValue('item', 'amount', index, nlapiGetLineItemValue('item', 'amount', index + 1));
    nlapiSetLineItemValue('item', 'taxcode', index, nlapiGetLineItemValue('item', 'taxcode', index + 1));
    nlapiSetLineItemValue('item', 'taxrate1', index, nlapiGetLineItemValue('item', 'taxrate1', index + 1));
    nlapiSetLineItemValue('item', 'tax1amt', index, nlapiGetLineItemValue('item', 'tax1amt', index + 1));
    nlapiSetLineItemValue('item', 'grossamt', index, nlapiGetLineItemValue('item', 'grossamt', index + 1));
    nlapiSetLineItemValue('item', 'class', index, nlapiGetLineItemValue('item', 'class', index + 1));
    nlapiSetLineItemValue('item', 'custcol_site', index, nlapiGetLineItemValue('item', 'custcol_site', index + 1));
    nlapiSetLineItemValue('item', 'custcol_subscription', index, nlapiGetLineItemValue('item', 'custcol_subscription', index + 1));
    nlapiSetLineItemValue('item', 'custcol_rev_rec_start_date', index, nlapiGetLineItemValue('item', 'custcol_rev_rec_start_date', index + 1));
    nlapiSetLineItemValue('item', 'custcol_rev_rec_end_date', index, nlapiGetLineItemValue('item', 'custcol_rev_rec_end_date', index + 1));
    nlapiSetLineItemValue('item', 'custcol_gilat_so_number', index, nlapiGetLineItemValue('item', 'custcol_gilat_so_number', index + 1));
    nlapiSetLineItemValue('item', 'custcol_so_line_number', index, nlapiGetLineItemValue('item', 'custcol_so_line_number', index + 1));
    nlapiSetLineItemValue('item', 'custcol_mms_package_plan', index, nlapiGetLineItemValue('item', 'custcol_mms_package_plan', index + 1));
    nlapiSetLineItemValue('item', 'custcol_mss_service', index, nlapiGetLineItemValue('item', 'custcol_mss_service', index + 1));
    nlapiSetLineItemValue('item', 'custcol_customer_po', index, nlapiGetLineItemValue('item', 'custcol_customer_po', index + 1));
    nlapiSetLineItemValue('item', 'deferredrevenueaccount', index, nlapiGetLineItemValue('item', 'deferredrevenueaccount', index + 1));
    //***********************
    //deferredrevenueaccount


    //rec.commitLineItem('item');

    nlapiRemoveLineItem('item', index + 1);

}

function createvritem(income, clas) {
    nlapiLogExecution('debug', 'create vi item: ', income + '-' + clas);
    var item_name_str = 'Vi-';
    itemAccount = nlapiLoadRecord('account', income);
    item_name_str += itemAccount.getFieldValue('acctnumber') + '-';
    itemClass = nlapiLoadRecord('classification', clas);
    item_name_str += itemClass.getFieldValue('name');

    item = nlapiCopyRecord('noninventoryitem', 1502);
    item.setFieldValue('class', clas);
    item.setFieldValue('incomeacount', income);
    item.setFieldValue('itemid', item_name_str);
    item.setFieldValue('custitem_gilat_item_name', item_name_str);
    item.setFieldValue('taxschedule', '1');
    item.setFieldValue('revenuerecognitionrule', '4');
    item.setFieldValue('revrecforecastrule', '4');
    item.setFieldValue('createrevenueplanson', '-2');
    //item.setFieldValue('expenseaccount', '58');

    itemId = nlapiSubmitRecord(item);

    nlapiLogExecution('debug', 'create new item: ', itemId);
    if (itemId != null && itemId != '' && itemId != -1) {
        return itemId;
    }
    else {
        return -1;
    }
}
