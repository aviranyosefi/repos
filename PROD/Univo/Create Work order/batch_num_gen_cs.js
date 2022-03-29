// JavaScript source code
var count = 0;
var locationFlag = false;
function createWorkOrder() {
    try { 
        openLoadingdiv();
        var sourceRec = nlapiLoadRecord('workorder', nlapiGetRecordId());
        var pItem = sourceRec.getFieldValue('assemblyitem');
        var Materials = getItem(pItem);
        if (!isNullOrEmpty(Materials)) {
            billofmaterials = nlapiLookupField('bomrevision', Materials, 'billofmaterials');
            if (!isNullOrEmpty(billofmaterials)) {
                legacybomforassembly = nlapiLookupField('bom', billofmaterials, 'legacybomforassembly');
                if (!isNullOrEmpty(legacybomforassembly)) {
                    pItem = legacybomforassembly;
                }
            }
        }   
        var rec = nlapiCreateRecord('workorder');
        rec.setFieldValue('custbody_wo_lot_number', sourceRec.getFieldValue('custbody_wo_lot_number'));
        rec.setFieldValue('custbody_wo_lot_expiration_date', sourceRec.getFieldValue('custbody_wo_lot_expiration_date'));
        rec.setFieldValue('custbody_source_in_process_wo', nlapiGetRecordId());
        rec.setFieldValue('assemblyitem', pItem);
        rec.setFieldValue('quantity', sourceRec.getFieldValue('quantity'));
        rec.setFieldValue('subsidiary', sourceRec.getFieldValue('subsidiary'));
        rec.setFieldValue('custbody_product_category', '2');
        var Id = nlapiSubmitRecord(rec);
        closeLoadingdiv();
        if (Id != -1) {  
            var url = "https://system.netsuite.com" + nlapiResolveURL('RECORD', 'workorder', Id) 
            window.open(url);
        }
    } catch (e) { closeLoadingdiv();; alert(e) }


}
function inventoryDetailsFill(type, name) {
    var itemcount = nlapiGetLineItemCount('component');
    temp = (count) % (itemcount + 1);
    if (name == 'location' || name == 'quantity') { //fire only on a specific field change.
        console.log('type= ' + type);
        console.log('name= ' + name);
        console.log('count= ' + count);
        console.log('temp= ' + temp);
        console.log('locationFlag= ' + locationFlag);
        if (name == 'quantity') {
            count += 1;
            if (locationFlag == false && (type == null)) {

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

                            //addButton = last_form.elements[26];
                            addButton = last_form.elements[27];

                            //last_form.elements[25].value = lotNum;
                            last_form.elements[26].value = lotNum;

                            //last_form.elements[30].value = lotExpDate;
                            last_form.elements[31].value = lotExpDate;

                            //quantityTxtField = last_form.elements[31];
                            quantityTxtField = last_form.elements[32];

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

                        //addButton = last_form.elements[26];
                        addButton = last_form.elements[27];

                        //last_form.elements[25].value = lotNum;
                        last_form.elements[26].value = lotNum;

                        //last_form.elements[30].value = lotExpDate;
                        last_form.elements[31].value = lotExpDate;

                        //quantityTxtField = last_form.elements[31];
                        quantityTxtField = last_form.elements[32];

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

function findParentItem(itemName) {

    var filterExpression = [
        [["effectivestartdate", "onorbefore", "today"], "OR", ["effectivestartdate", "isempty", ""]],
        "AND",
        ["effectiveenddate", "isempty", ""]
    ];

    var columns = [
        new nlobjSearchColumn("item", "component", null),
        new nlobjSearchColumn("billofmaterials"),
        new nlobjSearchColumn("name"),
        new nlobjSearchColumn("effectivestartdate"),
        new nlobjSearchColumn("effectiveenddate"),
        new nlobjSearchColumn("legacybomforassembly", "billOfMaterials", null),
        new nlobjSearchColumn("restricttoassemblies", "billOfMaterials", null)
    ];

    var search = nlapiCreateSearch('bomrevision', filterExpression, columns);

    var runSearch = search.runSearch();
    var searchid = 0;

    do {
        var linesNextBatch = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in linesNextBatch) {

            var bomId = linesNextBatch[rs].getValue('billofmaterials');

            if (linesNextBatch[rs].getText('component_item') == itemName
                    && linesNextBatch[rs].getText('billofmaterials_legacybomforassembly').startsWith('FP')) {

                var loadedBom = nlapiLoadRecord('bom', bomId);

                return loadedBom.getFieldValue("legacybomforassembly");
            }

            searchid++;
        }
    } while (linesNextBatch != null && linesNextBatch.length >= 1000);

    return -1;
}

function getItem(item) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_unv_fp_item_retrieval');
        search.addFilter(new nlobjSearchFilter('item', 'component', 'anyof', item));
        var runSearch = search.runSearch();
        var s = [];
        var searchid = 0;
        var res = '';
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s.length > 0) { res = s[0].id }
        return res

    } catch (e) {

    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function openLoadingdiv() {
    debugger;
    var bd = document.getElementById('bgdiv');
    var loadingdiv = document.getElementById('loadingdiv');
    bd.style.display = 'block'
    loadingdiv.style.display = 'block'
}
function closeLoadingdiv() {
    document.getElementById("bgdiv").style.display = 'none';
    document.getElementById("loadingdiv").style.display = 'none';
}