var context = nlapiGetContext();

// JavaScript source code
function fieldchangeFun(type, name) {
    console.log('name= ' + name);
    console.log('type= ' + type);
    adminflag = true;

    if (context.roleid != 'administrator') { adminflag = false; }

    if (name == 'itemreceive') {
        var createdfrom = nlapiGetFieldValue('createdfrom');

        if (!isNullOrEmpty(createdfrom)) {
            //var count = nlapiGetLineItemCount('item');
            var i = nlapiGetCurrentLineItemIndex('item');
            var item = nlapiGetLineItemValue('item', 'item', i);
            var itemtype = getItemType(item);
            if (itemtype != -1 && nlapiGetLineItemValue('item', 'itemreceive', i) == 'T') {
                var LotNumRec = getSequence(itemtype);
                if (LotNumRec != -1) {
                    var date = new Date();
                    var year = date.getFullYear().toString().substring(2, 4);
                    var month = date.getMonth() + 1;
                    if (month.toString().length < 2) { month = '0' + month.toString(); }
                    var prefix = nlapiLookupField('customrecord_lot_number_sequence', LotNumRec, 'custrecord_lot_number_prefix');
                    var seqNum = nlapiLookupField('customrecord_lot_number_sequence', LotNumRec, 'custrecord_lot_number_sequence');
                    var sequense = prefix + month + year + getZero(seqNum) + seqNum;
                    nlapiSetLineItemValue('item', 'custcol_unv_lot_number', i, sequense);
                    if (adminflag == false) {
                        nlapiSetLineItemDisabled('item', 'custcol_unv_lot_number', true, i);
                    }
                    nlapiSubmitField('customrecord_lot_number_sequence', LotNumRec, 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
                    setinventorydetails(i);
                }
            }
            else {
                var LotNumRec = getSequence(itemtype);
                if (LotNumRec != -1) {
                    nlapiSetLineItemValue('item', 'custcol_unv_lot_number', i, '');
                    subrecA = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
                    if (subrecA != null) {
                        nlapiSelectLineItem('item', i);
                        nlapiRemoveCurrentLineItemSubrecord('item', 'inventorydetail');
                    }
                }
            }
        }
    }
    else if (name == 'quantity' || name == 'custcol_vendor_lot_exp_date') {
        setinventorydetails(nlapiGetCurrentLineItemIndex('item'));
    }
}

function setinventorydetails(linenum) {

    qtyToBuild = nlapiGetLineItemValue('item', 'quantity', linenum);
    UnvLotNumber = nlapiGetLineItemValue('item', 'custcol_unv_lot_number', linenum);
    lotExpDate = nlapiGetLineItemValue('item', 'custcol_vendor_lot_exp_date', linenum);
    var old_inv_flag = false;
    if (!isNullOrEmpty(qtyToBuild) && !isNullOrEmpty(UnvLotNumber) && !isNullOrEmpty(lotExpDate)) {

        setTimeout(function () {
            subrecA = nlapiViewLineItemSubrecord('item', 'inventorydetail', linenum);
            if (subrecA != null) {
                nlapiSelectLineItem('item', linenum);
                nlapiRemoveCurrentLineItemSubrecord('item', 'inventorydetail');
                old_inv_flag = true;
            }
            //$("#inventorydetail_helper_popup").click()
            buttonId = 'inventorydetail_helper_popup_' + linenum;
            invBtn = document.getElementById(buttonId);
            console.log('test');
            invBtn.click();

            if (old_inv_flag) {
                setTimeout(function () {

                    childrecordFrame = document.getElementById('childdrecord_frame')

                    inhtml = childrecordFrame.contentDocument.children[0];

                    last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                    temp = last_form.elements[26]
                    temp.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].click()

                    addButton = last_form.elements[27];

                    last_form.elements[26].value = UnvLotNumber;

                    last_form.elements[31].value = lotExpDate;

                    quantityTxtField = last_form.elements[32];

                    quantityTxtField.value = qtyToBuild;

                    quantityTxtField.nextElementSibling.value = qtyToBuild;

                    addButton.click();

                    pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

                    pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click()
                }, 1000);
            }
            else {
                setTimeout(function () {

                    childrecordFrame = document.getElementById('childdrecord_frame')

                    inhtml = childrecordFrame.contentDocument.children[0];

                    last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                    //temp = last_form.elements[26]
                    //temp.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].click()

                    addButton = last_form.elements[26];

                    last_form.elements[25].value = UnvLotNumber;

                    last_form.elements[30].value = lotExpDate;

                    quantityTxtField = last_form.elements[31];

                    quantityTxtField.value = qtyToBuild;

                    quantityTxtField.nextElementSibling.value = qtyToBuild;

                    addButton.click();

                    pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

                    pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click()
                }, 1000);
            }
            

        }, 1000);
    }
    else {
        //alert('Please enter values for Quantity, Vendor Lot Exp. Date, Unv Lot # to auto fill inventory details');
    }
}

function getItemType(item) {

    var results;

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('islotitem');
    columns[1] = new nlobjSearchColumn('custitem_item_category');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', item)

    var search = nlapiCreateSearch('item', filters, columns);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (returnSearchResults != null) {
        results = returnSearchResults[0].getValue('islotitem');
        if (results == 'T') return returnSearchResults[0].getValue('custitem_item_category');
        else return -1

    }
    return -1
}               


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getZero(seqNum) {
    var dif = 4 - seqNum.toString().length;
    var zero = '';
    for (var i = 1; i <= dif; i++) {

        zero += '0';
    }
    return zero;
}

function getSequence(category) {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custrecord_category');
    columns[2] = new nlobjSearchColumn('custrecord_tran_type');
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_category', null, 'is', category);
    filters[1] = new nlobjSearchFilter('custrecord_tran_type', null, 'anyof', '1');


    var results = nlapiCreateSearch('customrecord_lot_number_sequence', filters, columns);
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

    if (s != null && s.length > 0) {
        return s[0].getValue('internalid');
    }
    else { return -1;}

}

/*              old form elems func
 *             setTimeout(function () {

                childrecordFrame = document.getElementById('childdrecord_frame')

                inhtml = childrecordFrame.contentDocument.children[0];

                last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                addButton = last_form.elements[21];

                last_form.elements[20].value = UnvLotNumber;

                last_form.elements[25].value = lotExpDate;

                quantityTxtField = last_form.elements[26];

                quantityTxtField.value = qtyToBuild;

                quantityTxtField.nextElementSibling.value = qtyToBuild;

                addButton.click();

                pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

                pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click()
            }, 1000);
            //nlapiSetFieldValue('custbody_duedatechanged', 'F');
            //nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type,

        }, 1000);*/