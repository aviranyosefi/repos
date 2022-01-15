function pageInit() { 
    var count = nlapiGetLineItemCount('item');
    //alert('count = ' + count);
    for (i = 1; i <= count; i++) {
        
        nlapiSetLineItemValue('item', 'itemreceive', i, 'F');
        //alert('i = ' + i);
    }
}

function ValidateLines(type, name) {
    var count = nlapiGetLineItemCount('item');

    for (i = 1; i <= count; i++) {
        var Mdlot = nlapiGetLineItemValue(type, 'custcol_manufacturer_batch_num');
        var i = nlapiGetCurrentLineItemIndex('item');
        var item = nlapiGetLineItemValue('item', 'item', i);
        var itemtype = getItemType(item);
        if (itemtype != -1) {
            if (!isNullOrEmpty(Mdlot)) {
                alert('mdlot filled');
                return true;
            }
            else {
                alert('please enter value for Manufacturer field');
                return false;
            }
        }
    }
}

function fieldChanged(type, name) {
    var createdfrom = nlapiGetFieldValue('createdfrom');

    if (!isNullOrEmpty(createdfrom)) {
        if (name == 'itemreceive' || name == 'quantity' || name == 'custcol_manufacturer_batch_num') {

            var i = nlapiGetCurrentLineItemIndex('item');
            var item = nlapiGetLineItemValue('item', 'item', i);
            var itemtype = getItemType(item);
            if (itemtype != -1 && nlapiGetLineItemValue('item', 'itemreceive', i) == 'T') {
                if (!isNullOrEmpty(nlapiGetLineItemValue('item', 'custcol_manufacturer_batch_num', i))) {
                    setinventorydetails(nlapiGetCurrentLineItemIndex('item'));
                }
                else {
                    alert('please enter value for Manufacturer field');
                }
            }

        }
    }
}


function setinventorydetails(linenum) {

    var qtyToBuild = nlapiGetLineItemValue('item', 'quantity', linenum);
    var MedLotNumber = nlapiGetLineItemValue('item', 'custcol_manufacturer_batch_num', linenum);

    if (!isNullOrEmpty(qtyToBuild) && !isNullOrEmpty(MedLotNumber)){

        setTimeout(function () {
            subrecA = nlapiViewLineItemSubrecord('item', 'inventorydetail', linenum);
            if (subrecA != null) {
                nlapiSelectLineItem('item', linenum);
                nlapiRemoveCurrentLineItemSubrecord('item', 'inventorydetail');
            }
            //$("#inventorydetail_helper_popup").click()
            buttonId = 'inventorydetail_helper_popup_' + linenum;
            invBtn = document.getElementById(buttonId);
            //console.log('test');
            invBtn.click();


            setTimeout(function () {

                childrecordFrame = document.getElementById('childdrecord_frame');

                inhtml = childrecordFrame.contentDocument.children[0];

                last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                addButton = last_form.elements[24];

                serialLotNum = last_form.elements[23];

                serialLotNum.value = MedLotNumber;

                status1 = last_form.elements[28];

                status1.value = 'Quarantine';

                status2 = last_form.elements[29];

                status2.value = '1';

                status3 = last_form.elements[30];

                status3.value = 'Quarantine';

                //last_form.elements[30].value = lotExpDate;

                quantityTxtField = last_form.elements[33];

                quantityTxtField.value = qtyToBuild;

                quantityTxtField.nextElementSibling.value = qtyToBuild;

                addButton.click();

                pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

                pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click()
            }, 1000);
            //nlapiSetFieldValue('custbody_duedatechanged', 'F');
            //nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type, 

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
    //columns[1] = new nlobjSearchColumn('custitem_item_category');

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
        if (results == 'T') return 1;
        else return -1;
    }
    return -1;
}   

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function saveRecord(type, name) {
    var count = nlapiGetLineItemCount('item');

    for (i = 1; i <= count; i++) {
        var Mdlot = nlapiGetLineItemValue('item', 'custcol_manufacturer_batch_num',i);
       
        var item = nlapiGetLineItemValue('item', 'item', i);
        var itemtype = getItemType(item);
        if (itemtype != -1) {
            if (!isNullOrEmpty(Mdlot)) {
                //alert('mdlot filled');
                return true;
            }
            else {
                alert('please enter value for Manufacturer field line: '+ i);
                return false;
            }
        }
    }
}