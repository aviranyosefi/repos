// JavaScript source code
var count = 0;
var locationFlag = false;
function createWorkOrder(item) {
    debugger;
    var pItem = findParentItem(item);
    if (pItem == -1) {
        pItem = item;
    }
    var sourceRec = nlapiLoadRecord('workorder', nlapiGetRecordId());
    var rec = nlapiCreateRecord('workorder');
    rec.setFieldValue('custbody_wo_lot_number', sourceRec.getFieldValue('custbody_wo_lot_number'));
    rec.setFieldValue('custbody_wo_lot_expiration_date', sourceRec.getFieldValue('custbody_wo_lot_expiration_date'));
    rec.setFieldValue('custbody_source_in_process_wo', nlapiGetRecordId());
    rec.setFieldValue('assemblyitem', pItem);
    rec.setFieldValue('quantity', sourceRec.getFieldValue('quantity'));
    rec.setFieldValue('subsidiary', sourceRec.getFieldValue('subsidiary'));
    rec.setFieldValue('custbody_product_category','2');
    var Id = nlapiSubmitRecord(rec);
    if (Id != -1) {
        var Url = 'https://5455345-sb2.app.netsuite.com/app/accounting/transactions/workord.nl?id=' + Id + '&whence=&e=T'; //nlapiSetRedirectURL('record', 'workorder', Id, 'edit', null);
        window.open(Url);
    }
    //https://5455345-sb2.app.netsuite.com/app/accounting/transactions/workord.nl?id=8892&whence=&e=T
    //var Url = 'https://5455345-sb2.app.netsuite.com/app/accounting/transactions/workord.nl';
    ////var rec = nlapiCreateRecord('customrecord_last_created_from');
    ////rec.setFeildValue('custrecord_last_work_order_id', nlapiGetRecordId());
    //window.open(Url);
    //alert('1');

}

function inventoryDetailsFill(type, name) {
    var itemcount = nlapiGetLineItemCount('component');
    temp = (count + 1) % itemcount;
    if (name == 'location' || name == 'quantity') { //fire only on a specific field change.
        console.log('name= ' + name);
        console.log('count= ' + count);
        console.log('temp= ' + temp);
        if (name == 'quantity') {
            count += 1;
            if (locationFlag == false && (count == 0 || temp == 1)) {
                var locationField = nlapiGetFieldValue('location');
                //console.log('first location = ' + locationField);
                setTimeout(function () {
                    if (locationField != '' && locationField != null && locationField != undefined) {
                        //console.log('location = ' + locationField);

                        subrecA = nlapiViewSubrecord('inventorydetail');
                        if (subrecA != null) {
                            nlapiRemoveSubrecord('inventorydetail');
                        }

                        qtyToBuild = nlapiGetFieldValue('quantity');
                        lotNum = nlapiGetFieldValue('custbody_wo_lot_number');
                        lotExpDate = nlapiGetFieldValue('custbody_wo_lot_expiration_date');

                        //$("#inventorydetail_helper_popup").click()
                        invBtn = document.getElementById('inventorydetail_helper_popup');
                        console.log('test');
                        invBtn.click();

                        setTimeout(function () {

                            childrecordFrame = document.getElementById('childdrecord_frame');

                            inhtml = childrecordFrame.contentDocument.children[0];

                            last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                            addButton = last_form.elements[26];

                            last_form.elements[25].value = lotNum;

                            last_form.elements[30].value = lotExpDate;

                            quantityTxtField = last_form.elements[31];

                            quantityTxtField.value = qtyToBuild;

                            quantityTxtField.nextElementSibling.value = qtyToBuild;

                            addButton.click();

                            pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

                            pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click();
 
                        }, 1000);
                        //nlapiSetFieldValue('custbody_duedatechanged', 'F');

                        //nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type, 
                    }
                }, 1000);
            }
        }

        if (name == 'location') {
            locationFlag = true;
            var locationField = nlapiGetFieldValue('location');
            //console.log('first location = ' + locationField);
            setTimeout(function () {
                if (locationField != '' && locationField != null && locationField != undefined) {
                    //console.log('location = ' + locationField);

                    subrecA = nlapiViewSubrecord('inventorydetail');
                    if (subrecA != null) {
                        nlapiRemoveSubrecord('inventorydetail');
                    }

                    qtyToBuild = nlapiGetFieldValue('quantity');
                    lotNum = nlapiGetFieldValue('custbody_wo_lot_number');
                    lotExpDate = nlapiGetFieldValue('custbody_wo_lot_expiration_date');

                    //$("#inventorydetail_helper_popup").click()
                    invBtn = document.getElementById('inventorydetail_helper_popup');
                    console.log('test');
                    invBtn.click();

                    setTimeout(function () {

                        childrecordFrame = document.getElementById('childdrecord_frame');

                        inhtml = childrecordFrame.contentDocument.children[0];

                        last_form = inhtml.children[1].children[0].children[0].children[3].children[1].children[0].children[1].children[0].children[0].children[7].children[0].children[1];

                        addButton = last_form.elements[26];

                        last_form.elements[25].value = lotNum;

                        last_form.elements[30].value = lotExpDate;

                        quantityTxtField = last_form.elements[31];

                        quantityTxtField.value = qtyToBuild;

                        quantityTxtField.nextElementSibling.value = qtyToBuild;

                        addButton.click();

                        pDiv = last_form.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

                        pDiv.children[2].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].click();

                        locationFlag = false;
                    }, 1000);
                    //nlapiSetFieldValue('custbody_duedatechanged', 'F');

                    //nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type, 
                }
            }, 1000);
        }
    }        
}

function findParentItem(item) {
    var results = nlapiLoadSearch(null, 'customsearch_parent_item_search');
    results.addFilter(new nlobjSearchFilter('internalid', 'memberitem', 'is', item));

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
    else { return -1; }




}