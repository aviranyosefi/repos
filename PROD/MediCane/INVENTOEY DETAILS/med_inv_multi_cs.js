var trigger_once = false;
var mode = '';

if (document.getElementById('custpage_qty') != null)
    var qty = document.getElementById('custpage_qty').value;
if (document.getElementById('custpage_num') != null)
    var num = document.getElementById('custpage_num').value;
var exp = null;
var type = "inventory";

parent.beforeInventoryDetailOpen('inventory', this, -1);
parent.removeMachineSubrecord();
if (parent.nlapiGetRecordType() == "itemfulfillment") {
    parent.document.getElementById("quantity1_formattedValue").click();
    parent.document.getElementById("quantity1_formattedValue").value = qty;
    parent.document.getElementById("quantity1_formattedValue").blur();
    parent.document.getElementById("quantity1").click();
    parent.document.getElementById("quantity1").value = qty;
    parent.document.getElementById("quantity1").dispatchEvent(new Event('change'));
    parent.qtyFieldChangeinventorydetail(); parent.nlapiSetCurrentLineItemValue('item', 'isinvdetaildirty', 'T'); parent.setFulfillmentStatus();; parent.nlapiFieldChanged('item', 'quantity1');
    parent.setMachineChanged('inventory', parent.document.getElementById("quantity1"));
}
else if (parent.nlapiGetFieldValue('revisedstatus') != null && parent.nlapiGetFieldValue('revisedstatus') != '') {//change status
    parent.document.getElementById("quantity_formattedValue").click();
    parent.document.getElementById("quantity_formattedValue").value = qty;
    parent.document.getElementById("quantity_formattedValue").blur();
    parent.document.getElementById("quantity").click();
    parent.document.getElementById("quantity").value = qty;
    parent.document.getElementById("quantity").dispatchEvent(new Event('change'));
    parent.qtyFieldChangeinventorydetail(); parent.nlapiSetCurrentLineItemValue('item', 'isinvdetaildirty', 'T'); parent.setFulfillmentStatus();
    parent.setMachineChanged('inventory', parent.document.getElementById("quantity"));
}
else {
    parent.document.getElementById("adjustqtyby_formattedValue").click();
    parent.document.getElementById("adjustqtyby_formattedValue").value = qty;
    parent.document.getElementById("adjustqtyby_formattedValue").blur();
    parent.document.getElementById("adjustqtyby").click();
    parent.document.getElementById("adjustqtyby").value = qty;
    parent.document.getElementById("adjustqtyby").dispatchEvent(new Event('change'));
    parent.qtyFieldChangeinventorydetail(); parent.nlapiSetCurrentLineItemValue('inventory', 'isinvdetaildirty', 'T'); parent.setFulfillmentStatus();; parent.nlapiFieldChanged('inventory', 'adjustqtyby');
    parent.setMachineChanged('inventory', parent.document.getElementById("adjustqtyby"));
}

if (parent.nlapiGetRecordType() == "itemfulfillment")
    setTimeout(function () { parent.document.getElementById('inventorydetail_helper_popup_1').click(); }, 100);
else
    setTimeout(function () { parent.document.getElementById('inventorydetail_helper_popup').click(); }, 100);
setTimeout(function () { parent.document.getElementById('childdrecord').style.display = 'none'; try { parent.document.getElementsByClassName('ext-el-mask')[1].style.display = "none" } catch (e) { } }, 100);


//setTimeout(function () { debugger; setTimeout(function () { debugger; parent.document.getElementById('inventorydetail_helper_popup').click(); }, 110); parent.parent.childdrecord_frame.closeInventoryDetails(); }, 100);
//parent.setTimeout(function () { debugger; parent.document.getElementById('inventorydetail_helper_popup').click(); }, 500);





//parent.NLShowChildRecordPopup('inventory', 'inventoryinventorydetail', false, '/app/accounting/transactions/inventory/numbered/inventorydetail.nl', this, -1, { right: 0, width: 700, height: 700 }, 'inventory', 'inventorydetail');
setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 1500, qty, exp, num, type);
setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 3000, qty, exp, num, type);
setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 3500, qty, exp, num, type);
setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 5000, qty, exp, num, type);
//closePopup();

function setinv(qty, exp, num, type) {
    try {
        if (trigger_once)
            return;
        trigger_once = true;
        var serialarr = num.split(';');
        parent.frames[3].document.getElementById("quantity").click(); parent.frames[3].document.getElementById("quantity").value = qty;
        var res = nlapiSearchRecord('inventorystatus', null, null, [new nlobjSearchColumn('name')]);
        var inv_statuses = []; res.forEach(function (item) { inv_statuses[item.id] = item.getValue('name') });

        for (var i = 0; i < serialarr.length; i++) {
            var serialobj = JSON.parse(serialarr[i]);
            setTimeout(function (serialobj) {
                var serial = serialobj.serial;
                var serialqty = serialobj.quantity;

                //confirm("You are about to update the inventory. Please confirm");
                debugger;
                var invfield = parent.frames[3].document.getElementById("inpt_issueinventorynumber") != null ? 'issueinventorynumber' : 'issueinventorynumber1';

                if (parent.frames[3].document.getElementById("inpt_" + invfield) != null) {
                    parent.frames[3].document.getElementById("inpt_" + invfield).click();
                    parent.frames[3].document.getElementById("inpt_" + invfield).value = serial;
                    var sel = parent.frames[3].getDropdown(parent.frames[3].document.getElementById('inpt_' + invfield))
                    parent.frames[3].document.getElementById("hddn_" + invfield).value = sel.getValueAtIndex(sel.getIndexForText(serial));
                    parent.frames[3].document.getElementById("hddn_" + invfield).dispatchEvent(new Event('change'));

                }
                else {
                    parent.frames[3].document.getElementById("inventoryassignment_issueinventorynumber_display").click();
                    parent.frames[3].document.getElementById("inventoryassignment_issueinventorynumber_display").value = serial;
                    parent.frames[3].document.getElementById("inventoryassignment_issueinventorynumber_display").dispatchEvent(new Event('change'));

                }

                if (parent.nlapiGetRecordType() != "itemfulfillment") {
                    parent.frames[3].document.getElementById("expirationdate").click();
                    parent.frames[3].document.getElementById("expirationdate").value = exp;
                }
                parent.frames[3].document.getElementById("quantity").click();
                parent.frames[3].document.getElementById("quantity_formattedValue").click();
                parent.frames[3].document.getElementById("quantity_formattedValue").value = serialqty;
                parent.frames[3].document.forms['inventoryassignment_form'].elements['quantity'].value = serialqty;

                try {
                    if (parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display") != null) {
                        if (parent.nlapiGetRecordType() == "itemfulfillment")
                            status = 8; // release
                        else if (parent.nlapiGetFieldValue('revisedstatus') != null && parent.nlapiGetFieldValue('revisedstatus') != '')
                            status = parent.nlapiGetFieldValue('revisedstatus');
                        else
                            status = inv_statuses.indexOf(serialobj.status);

                        if (status == null || status == "") {
                            alert('There is no default status for this item. Please Update the status first');
                            parent.frames[3].closeInventoryDetails();
                            return;

                        }
                        setTimeout(function (status) {
                            parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display").click();
                            parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display").value = status;
                            parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display").dispatchEvent(new Event('change'));
                            parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display").haschanged = true;
                            parent.frames[3].Searchinventorystatus(parent.frames[3].document.getElementById("inventoryassignment_inventorystatus_display").value);
                        }, 250, inv_statuses[status]);

                    }
                }
                catch (e) {
                    console.log(e);
                    try { setTimeout(function () { closePopup(true); }, 0); } catch (e) { };
                };
                //this.checkvalid=false;this.isvalid=validate_field(this,'float',true,false,null,null,false, null ,8); if(this.isvalid) {document.forms['inventoryassignment_form'].elements['quantity'].value = NLStringToNormalizedNumberString(this.value);}if (this.isvalid) {;setMachineChanged('inventoryassignment',this)}if (!this.isvalid) { selectAndFocusField(this);}return this.isvalid;
                setTimeout(function (elm) { elm.doAddEdit(); }, 700, parent.frames[3].inventoryassignment_machine);
            }, (1250 * (i+1)), serialobj);
        }
        setTimeout(function (elm, form) { elm.click(); form.adjustQuantityOnChange();; form.updateUIType(); form.qtyFieldChangeinventorydetail(); }, 1250 * (serialarr.length + 1), parent.frames[3].document.getElementById("secondaryok"), parent.frames[3]);
        setTimeout(function (type) {
            nlapiCommitLineItem(type); trigger_once = false; setTimeout(function () { closePopup(true); }, 150); setTimeout(function () { closePopup(true); }, 150);
        }, 1500 * (serialarr.length + 1), type);
    }
    catch (e) {
        console.log(e);
        try { setTimeout(function () { closePopup(true); }, 0); } catch (e) { };
    }

    // setTimeout(function () { closePopup(true); }, 0);

}
