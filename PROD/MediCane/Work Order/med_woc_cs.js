function checkTabPress(e) {
    if (e.which == 120) //F9
    {
        debugger;
        console.log('f9');
        document.getElementById("completedquantity_formattedValue").blur();

        $('#imulti_popup_2').click();
    }
}

try {
    if (nlapiGetRecordType() == "workordercompletion") {
        var body = document.querySelector('body');
        body.addEventListener('keyup', checkTabPress);
    }
}
catch (e) { }
function pageLoad() {
    try {
        debugger;
        if (nlapiGetRecordType() == "workordercompletion") {
            nlapiSetFieldText('startoperation', '10');
            nlapiSetFieldText('endoperation', '10');
            if (nlapiGetFieldValue('custbody_cartnumber') == "")
                try {
                    var spn = document.getElementById('inventorydetail_fs');
                    var newspan = document.createElement("SPAN");
                    newspan.innerHTML = '<span class="sp_SummaryField"><span class="always-visible field_widget_boxpos uir-summary-field-helper  "><a id="imulti_popup_2" onclick="field_changed(null,\'completedquantity\',1)"  class="smalltextul i_inventorydetailset" href="#" style="background-position:-100px -900px" ></a></span></span>';
                    spn.appendChild(newspan);
                    var cart = nlapiGetFieldValue('custbody_cart_number');
                    var search = nlapiLoadSearch(null, 'customsearch_md_cart');
                    search.addFilter(new nlobjSearchFilter('custrecord_md_cart', null, 'is', cart));
                    var maxtray = search.runSearch().getResults(0, 1)[0].getValue('custrecord_tray_number', null, 'count');
                    if (maxtray == null || maxtray == '')
                        maxtray = "0";
                    nlapiSetFieldValue('custbody_cartnumber', parseInt(maxtray) + 1);
                }
                catch (e) {
                    nlapiSetFieldValue('custbody_cartnumber', '1');

                }

        }
    }
    catch (e) { }
}

var trigger_once = false;
function save() {
    if (nlapiGetRecordType() == "workordercompletion") {
        debugger;
        try {
            var id = nlapiGetRecordId();
            if (id == "") { // type create
                if (document.getElementById('custbody_cartnumber_display') != null) {
                    var cart = nlapiGetFieldValue('custbody_cart_number');
                    var search = nlapiLoadSearch(null, 'customsearch_md_cart');
                    var tray = nlapiGetFieldValue('custbody_cartnumber');
                    search.addFilter(new nlobjSearchFilter('custrecord_md_cart', null, 'is', cart));
                    var maxtray = search.runSearch().getResults(0, 1)[0].getValue('custrecord_tray_number', 'max', 'count');
                    if (maxtray == null || maxtray == '')
                        maxtray = "0";
                    if (maxtray != null && tray > 19) {
                        confirm("You Have Completed The Last Tray, Please Create A new Cart");
                        return false;
                    }
                }


            }
        }
        catch (e) {
        }
    }
    return true;
}

function field_changed(type, name, line) {
    try {
        if (name == 'completedquantity') {
            if (nlapiGetRecordType() == "workordercompletion") {
                if (document.getElementById('completedquantity').value == "")
                    document.getElementById('completedquantity').value = document.getElementById('custbody_net_bag_weight').value;
                removeSubrecord();
                $('#inventorydetail_helper_popup').click();

                setTimeout(function () { document.getElementById('childdrecord').style.display = 'none' }, 400);
                setTimeout(function () { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv()) }, 1500);
                setTimeout(function () { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv()) }, 3500);
                setTimeout(function () { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv()) }, 5500);

            }
        }
    }
    catch (e) { console.log(e) }
}
function fieldchanged(type, name, line) {
    try {
        if (name == 'custbody_bag_weight' || name == 'custbody_bruto_bag_weight' || name == 'custbody_net_bag_weight') {
            if (nlapiGetRecordType() == "workordercompletion") {
                //  if (document.getElementById('completedquantity').value == "")
                nlapiSetFieldValue('completedquantity', document.getElementById('custbody_net_bag_weight').value);
            }
        }
    }
    catch (e) { console.log(e) }
}

function setinv() {
    try {
        if (trigger_once || document.getElementById('childdrecord') == null || parent.childdrecord_frame.document.getElementById('inventoryassignment_addedit') == null)
            return;
        trigger_once = true;
        document.getElementById('childdrecord').style.display = 'none';
        //parent.childdrecord_frame.document.getElementById("inventoryassignment_row_1").getElementsByTagName("td")[0].click()
        parent.childdrecord_frame.document.getElementById("receiptinventorynumber").value = document.getElementById('custbody_inventory_detail_field').value
        var qty = document.getElementById('completedquantity').value;
        parent.childdrecord_frame.document.getElementById("quantity").value = qty;
        parent.childdrecord_frame.document.getElementById("quantity").click();
        parent.childdrecord_frame.document.getElementById("quantity_formattedValue").click();
        parent.childdrecord_frame.document.getElementById("quantity_formattedValue").value = qty;
        parent.childdrecord_frame.document.forms['inventoryassignment_form'].elements['quantity'].value = qty;
        var adddays = 0;
        var new_ex_date;
        try {
            var currentitem = parent.childdrecord_frame.document.getElementById("item") != null ? document.getElementById("item").value : null;
            if (currentitem != null && parent.childdrecord_frame.document.getElementById("inventoryassignment_inventorystatus_display") != null) {
                var status = nlapiLookupField('lotnumberedassemblyitem', currentitem, 'custitemdefault_location_for_manufactu');

                if (status == null || status == "") {
                    alert('There is no default status for this item. Please Update the status first');
                    parent.frames['childdrecord_frame'].closeInventoryDetails();
                    return;

                }
                adddays = nlapiLookupField('lotnumberedassemblyitem', currentitem, 'custitem_expiration_dayes');
                if (adddays != "" && adddays != null)
                    new_ex_date = nlapiDateToString(nlapiAddDays(convertDate(document.getElementById('trandate').value), adddays));
                var res = nlapiSearchRecord('inventorystatus', null, null, [new nlobjSearchColumn('name')]);
                var inv_statuses = []; res.forEach(function (item) { inv_statuses[item.id] = item.getValue('name') });

                parent.childdrecord_frame.document.getElementById("inventoryassignment_inventorystatus_display").click();
                parent.childdrecord_frame.document.getElementById("inventoryassignment_inventorystatus_display").value = inv_statuses[status];
                parent.childdrecord_frame.document.getElementById("inventoryassignment_inventorystatus_display").dispatchEvent(new Event('change'));

            }
            var lot = parent.nlapiGetFieldValue('custbody_medicane_sub_lot');
            var mdbatch = parent.nlapiGetFieldValue('custbody_medicane_lot');
            try {
                var batchid = nlapiSearchRecord('inventorynumber', null, [new nlobjSearchFilter('inventorynumber', null, 'is', document.getElementById('custbody_inventory_detail_field').value)])[0].id;
                var inventorynumber_rec = nlapiLoadRecord('inventorynumber', batchid);
                inventorynumber_rec.setFieldValue('custitemnumber_medicane_production_lot', lot);
                inventorynumber_rec.setFieldValue('expirationdate', new_ex_date);
                inventorynumber_rec.setFieldValue('custitemnumber_md_batch_number', mdbatch);
                nlapiSubmitRecord(inventorynumber_rec);
            }
            catch (e) { }

        }
        catch (e) {
            try { parent.frames['childdrecord_frame'].closeInventoryDetails() } catch (e) { };
            alert('inventory main error:' + e);
        };
        if (new_ex_date != null)
            parent.childdrecord_frame.document.forms['inventoryassignment_form'].elements['expirationdate'].value = new_ex_date;
        // parent.childdrecord_frame.document.forms['inventoryassignment_form'].elements['custitemnumber_md_batch_numbr'].value = document.getElementById('custbody_medicane_sub_lot_display').value;
        setTimeout(function (elm) { elm.click(); }, 300, parent.childdrecord_frame.document.getElementById("inventoryassignment_addedit"));
        setTimeout(function (elm) { elm.click(); parent.childdrecord_frame.saveInventoryDetails(); if (typeof (adjustQuantityOnChange) != 'undefined') { adjustQuantityOnChange(); updateUIType();; qtyFieldChangeinventorydetail(); } }, 700, parent.childdrecord_frame.document.getElementById("secondaryok"));
        setTimeout(function (type) {
            nlapiCommitLineItem(type);
            document.getElementById('inventorydetail_helper_popup_1').className = "smalltextul i_inventorydetailset";
        }, 1000, type);
        setTimeout(function (type) {
            parent.childdrecord_frame.nlFireEvent(getButton('ok'), 'click');
        }, 1200, type);

        if (document.getElementById('custbody_inventory_detail_issue').value != '') {
            setTimeout(function () { $('#componentinventorydetail_helper_popup_1').click() }, 1600);
            setTimeout(function () { document.getElementById('childdrecord').style.display = 'none' }, 1800);
            setTimeout(function () { parent.frames['childdrecord_frame'].document.addEventListener('DOMContentLoaded', setinvline()) }, 2900);
            setTimeout(function () { parent.frames['childdrecord_frame'].document.addEventListener('DOMContentLoaded', setinvline()) }, 5500);
            setTimeout(function () { parent.frames['childdrecord_frame'].document.addEventListener('DOMContentLoaded', setinvline()) }, 8500);
        }

    }
    catch (e) {
        try { parent.frames['childdrecord_frame'].closeInventoryDetails() } catch (e) { };
        alert('inventory main error:' + e);
    }
    return true;

}
var trigger_once_line = false;
function setinvline() {
    // now update the line:
    try {
        if (trigger_once_line || document.getElementById('childdrecord') == null || parent.childdrecord_frame.document.getElementById('inventoryassignment_addedit') == null)
            return;
        trigger_once_line = true;
        debugger;
        var mdbatch = parent.nlapiGetFieldValue('custbody_inventory_detail_issue');
        var qty = document.getElementById('completedquantity').value;
        parent.childdrecord_frame.document.getElementById("quantity").value = qty;
        parent.childdrecord_frame.document.getElementById("quantity").click();
        parent.childdrecord_frame.document.getElementById("quantity_formattedValue").click();
        parent.childdrecord_frame.document.getElementById("quantity_formattedValue").value = qty;
        parent.childdrecord_frame.document.forms['inventoryassignment_form'].elements['quantity'].value = qty;

        parent.childdrecord_frame.document.getElementById('quantity').value = qty;
        if (parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber2") != null) {
            parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber2").click();
            parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber2").value = mdbatch;
            var sel = parent.frames['childdrecord_frame'].getDropdown(parent.frames['childdrecord_frame'].document.getElementById('inpt_issueinventorynumber2'))
            parent.frames['childdrecord_frame'].document.getElementById("hddn_issueinventorynumber2").value = sel.getValueAtIndex(sel.getIndexForText(mdbatch));
            parent.frames['childdrecord_frame'].document.getElementById("hddn_issueinventorynumber2").dispatchEvent(new Event('change'));

        }
        else if (parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber1") != null) {
            parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber1").click();
            parent.frames['childdrecord_frame'].document.getElementById("inpt_issueinventorynumber1").value = mdbatch;
            var sel = parent.frames['childdrecord_frame'].getDropdown(parent.frames['childdrecord_frame'].document.getElementById('inpt_issueinventorynumber1'))
            parent.frames['childdrecord_frame'].document.getElementById("hddn_issueinventorynumber1").value = sel.getValueAtIndex(sel.getIndexForText(mdbatch));
            parent.frames['childdrecord_frame'].document.getElementById("hddn_issueinventorynumber1").dispatchEvent(new Event('change'));

        }
        else {
            parent.frames['childdrecord_frame'].document.getElementById("inventoryassignment_issueinventorynumber_display").click();
            parent.frames['childdrecord_frame'].document.getElementById("inventoryassignment_issueinventorynumber_display").value = mdbatch;
            parent.frames['childdrecord_frame'].document.getElementById("inventoryassignment_issueinventorynumber_display").dispatchEvent(new Event('change'));

        }
        setTimeout(function (elm) { elm.click(); }, 300, parent.childdrecord_frame.document.getElementById("inventoryassignment_addedit"));
        setTimeout(function (type) {
            nlapiCommitLineItem(type); trigger_once = false; document.getElementById('inventorydetail_helper_popup_' + line).className = "smalltextul i_inventorydetailset";
        }, 1000, type);
        setTimeout(function (elm) { updateMachineFieldStyle = function () { }; elm.click(); parent.childdrecord_frame.saveInventoryDetails(); if (typeof (adjustQuantityOnChange) != 'undefined') { adjustQuantityOnChange(); updateUIType();; qtyFieldChangeinventorydetail(); } }, 700, parent.childdrecord_frame.document.getElementById("secondaryok"));
        setTimeout(function (type) {
            parent.childdrecord_frame.closeInventoryDetails();
        }, 1200, type);

    }
    catch (e) {
        try { parent.frames['childdrecord_frame'].closeInventoryDetails() } catch (e) { };
        alert('inventory line error:' + e);
    }
}

function convertDate(odate) { // Convert to  date format - from 28/04/2016 to date
    console.log("argument entered in convertDate: " + odate);
    if (odate == undefined)
        return '';
    var newDate = '';
    var arr = odate.split("/");
    newDate = new Date(arr[2], arr[1] - 1, arr[0]);
    return newDate;
}

function ReportCompletion() {
    debugger;
    var wo = nlapiLoadRecord('workorder', nlapiGetFieldValue('createdfrom'));
    nlapiSubmitRecord(wo);
    var isbackflush = nlapiLookupField('workordercompletion', nlapiGetRecordId(), 'isbackflush');

    if (isbackflush == 'T') {
        var createdPdfUrl = 'https://6400853.app.netsuite.com/app/accounting/transactions/wocompl.nl?id=' + nlapiGetFieldValue('createdfrom') + '&e=T&transform=workord&isbackflush=T&memdoc=0&whence='
    }
    else {
        var createdPdfUrl = 'https://6400853.app.netsuite.com/app/accounting/transactions/wocompl.nl?id=' + nlapiGetFieldValue('createdfrom') + '&e=T&transform=workord&memdoc=0&whence='

    }
    setTimeout(function () { window.open(createdPdfUrl, '_top') }, 1000);

}



function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    return res;
}

function GetTodayDate() {
    var now = new Date();
    now.setTime(now.getTime() + (10 * 60 * 60 * 1000));
    var nowDate = now.getFullYear().toString() + PadLeftWithZero((now.getMonth() + 1), 2) + PadLeftWithZero((now.getDate() + 1), 2);
    return nowDate;
}