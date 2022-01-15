function aftersubmit() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = rec.getLineItemCount('item');
    var changeFlag = false;
    var ghanaFlag = false;
    var vrItem = -1;
    ghanaFlag = checkforghana();
    for (var i = 1; i <= count; i++) {        // Loop through each of the items in the sublist
        vrItem = -1;
        var itype = rec.getLineItemValue('item', 'itemtype', i); // Get the item type
        var Id = rec.getLineItemValue('item', 'item', i);
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
                insertnewlineitem(vrItem, i, rec);
                changeFlag = true;
            }
            else {
                vrItem = createvritem(income, clas);
                nlapiLogExecution('debug', 'vrItem after create: ', vrItem);
                if (vrItem != -1) {
                    insertnewlineitem(vrItem, i, rec);
                    changeFlag = true;
                }
            }
        }
        else if (recordtype == 'noninventoryitem' && ghanaFlag && vrItem == -1) {
            //to bo completed acording to nitai
            //rec.setLineItemValue('item', 'taxcode', index, someValue);
            nlapiLogExecution('debug', 'GH tax: ', 'non inv no VI');

        }
    }
    nlapiLogExecution('debug', 'changeFlag: ', changeFlag);
    if (changeFlag == true) {

        var newRecId = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'insertnewlineitem: ', newRecId);
    }
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

function insertnewlineitem(vrItem, index, newRec, ghanaFlag) {
    //newRec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    nlapiLogExecution('debug', 'insertnewlineitem: ', vrItem);
    newRec.insertLineItem('item', index);

    newRec.setLineItemValue('item', 'item', index, vrItem);
    newRec.setLineItemValue('item', 'custcol_orig_so_item', index, newRec.getLineItemValue('item', 'item', index + 1));
    newRec.setLineItemValue('item', 'description', index, newRec.getLineItemValue('item', 'description', index + 1));
    newRec.setLineItemValue('item', 'rate', index, newRec.getLineItemValue('item', 'rate', index + 1));
    newRec.setLineItemValue('item', 'amount', index, newRec.getLineItemValue('item', 'amount', index + 1));
    if (ghanaFlag) {
        //
        //to be completed according to nitai 
        //newRec.setLineItemValue('item', 'taxcode', index, someValue);
        nlapiLogExecution('debug', 'GH tax: ', 'inv or VI');
    }
    else {
        newRec.setLineItemValue('item', 'taxcode', index, newRec.getLineItemValue('item', 'taxcode', index + 1));
    }
    

    newRec.setLineItemValue('item', 'taxrate1', index, newRec.getLineItemValue('item', 'taxrate1', index + 1));
    newRec.setLineItemValue('item', 'tax1amt', index, newRec.getLineItemValue('item', 'tax1amt', index + 1));
    newRec.setLineItemValue('item', 'grossamt', index, newRec.getLineItemValue('item', 'grossamt', index + 1));
    newRec.setLineItemValue('item', 'class', index, newRec.getLineItemValue('item', 'class', index + 1));
    newRec.setLineItemValue('item', 'custcol_site', index, newRec.getLineItemValue('item', 'custcol_site', index + 1));
    newRec.setLineItemValue('item', 'custcol_subscription', index, newRec.getLineItemValue('item', 'custcol_subscription', index + 1));
    newRec.setLineItemValue('item', 'custcol_rev_rec_start_date', index, newRec.getLineItemValue('item', 'custcol_rev_rec_start_date', index + 1));
    newRec.setLineItemValue('item', 'custcol_rev_rec_end_date', index, newRec.getLineItemValue('item', 'custcol_rev_rec_end_date', index + 1));
    newRec.setLineItemValue('item', 'custcol_gilat_so_number', index, newRec.getLineItemValue('item', 'custcol_gilat_so_number', index + 1));
    newRec.setLineItemValue('item', 'custcol_so_line_number', index, newRec.getLineItemValue('item', 'custcol_so_line_number', index + 1));
    newRec.setLineItemValue('item', 'custcol_mms_package_plan', index, newRec.getLineItemValue('item', 'custcol_mms_package_plan', index + 1));
    newRec.setLineItemValue('item', 'custcol_mss_service', index, newRec.getLineItemValue('item', 'custcol_mss_service', index + 1));
    newRec.setLineItemValue('item', 'custcol_customer_po', index, newRec.getLineItemValue('item', 'custcol_customer_po', index + 1));
    newRec.setLineItemValue('item', 'deferredrevenueaccount', index, newRec.getLineItemValue('item', 'deferredrevenueaccount', index + 1));
    //***********************
    //deferredrevenueaccount


    //rec.commitLineItem('item');

    newRec.removeLineItem('item', index + 1);

}

function createvritem(income, clas) {
    nlapiLogExecution('debug', 'create vi item: ', income + '-' + clas);
    var item_name_str = 'Vi-';
    itemAccount = nlapiLoadRecord('account', income);
    item_name_str += itemAccount.getFieldValue('acctnumber') + '-';
    itemClass = nlapiLoadRecord('classification', clas);
    item_name_str += itemClass.getFieldValue('name');

    item = nlapiCopyRecord('noninventoryitem', 1101);
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

function checkforghana() {
    //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    //var ghFlag = false;
    custumer = rec.getFieldValue('entity');
    customerRec = nlapiLoadRecord('customer', custumer);
    count = customerRec.getLineItemCount('addressbook');
    for (i = 0; i <= count; i++) {
        var dufault = customerRec.getLineItemValue('addressbook', 'defaultbilling', i); 
        if (dufault == 'T') {
            var country =customerRec.getLineItemValue('addressbook', 'country', i);
            if (country == 'GH') {
                 return true;
            }
        }
    }
    return false;
}