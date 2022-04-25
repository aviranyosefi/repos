
var trigger_once = false;
var mode = '';
var qtychanged;

function checkTabPress(e) {
    if (e.which == 9 || e.which == 1) {
        setTimeout(function () { check_added_inv(); }, 100);
        setTimeout(function () { check_added_inv(); }, 500);
        setTimeout(function () { check_added_inv(); }, 1200);
        setTimeout(function () { check_added_inv(); }, 3200);
    }
    if (e.which == 120) //F9
    {
        debugger;
        console.log('f9');
        document.getElementById("adjustqtyby_formattedValue").blur();

        $('#imulti_popup_2').click();
    }
}

try {
    var body = document.querySelector('body');
    body.addEventListener('keyup', checkTabPress);
    body.addEventListener('click', checkTabPress);
}
catch (e) { }

function pageInit(type) {
    try {
        mode = type;
        var cform = nlapiGetFieldText('customform');
        if (cform.indexOf('Standard') >= 0)
            return;
        var rowtype = 'inventory';
        var count = nlapiGetLineItemCount(rowtype);
        for (i = 1; i <= count; i++) {
            var spn = document.getElementById('inventory_row_' + i).getElementsByClassName('smalltextul field_widget i_inventorydetailset')[0].parentElement;
            var newspan = document.createElement("SPAN");
            newspan.innerHTML = '<span class="sp_SummaryField"><span class="always-visible field_widget_boxpos uir-summary-field-helper  "><a id="imulti_popup_2" onclick="FieldChanged_adjustqtyby(null,\'adjustqtybyauto\',' + i + ')"  class="smalltextul i_inventorydetailset" href="#" style="background-position:-100px -900px" ></a></span></span>';
            spn.appendChild(newspan);

            nlapiSelectLineItem('item', i);
            removeMachineSubrecord();
        }
        inventory_machine.clearline(true);
    }
    catch (e) { }

}



function check_added_inv() {
    try {
        var rowtype = 'inventory';
        var spn;
        var count = nlapiGetLineItemCount(rowtype);
        for (i = 0; i <= count; i++) {
            var btn = 'inventorydetailset';
            if (document.getElementsByClassName('smalltextul field_widget i_inventorydetailneeded')[i])
                btn = 'inventorydetailneeded'
            if (document.getElementsByClassName('smalltextul field_widget i_' + btn)[i])
                var spn = document.getElementsByClassName('smalltextul field_widget i_' + btn)[i].parentElement;
            else if (document.getElementsByClassName('smalltextul                i_inventorydetailneeded')[i])
                var spn = document.getElementsByClassName('smalltextul                i_inventorydetailneeded')[i].parentElement;
            else
                var spn = document.getElementById('inventorydetail_helper_popup_1').parentElement;

            if (!spn)
                var spn = document.getElementById('inventorydetail_helper_popup').parentElement;
            var newspan = document.createElement("SPAN");
            newspan.innerHTML = '<span class="sp_SummaryField"><span class="always-visible field_widget_boxpos uir-summary-field-helper  "><a id="imulti_popup_2" onclick="FieldChanged_adjustqtyby(null,\'adjustqtybyauto\',1)"  class="smalltextul i_inventorydetailset" href="#" style="background-position:-100px -900px" ></a></span></span>';
            if (spn.childElementCount == 1)
                spn.appendChild(newspan);
        }
    }
    catch (e) { }


}

function FieldChanged_adjustqtyby(type, name, linenum) {
    try {
        type = 'inventory';
        setTimeout(function () { check_added_inv(); }, 0);

        if (name == 'adjustqtybyauto') {
            debugger;
            document.getElementById("adjustqtyby").click();
            var qty = document.getElementById("adjustqtyby").value;
            if (qty == null || parseFloat(qty) < 0) {
                document.getElementById("custcol_experation_date").disabled = true;
                document.getElementById("inventory_custcol_medicane_lot_display").disabled = true;
                return true;
            }
            else {
                document.getElementById("custcol_experation_date").disabled = false;
                document.getElementById("inventory_custcol_medicane_lot_display").disabled = false;
                if (nlapiGetCurrentLineItemValue(type, "custcol_medicane_lot") == '')
                    nlapiSetCurrentLineItemValue(type, "custcol_medicane_lot", nlapiGetFieldValue('custbody_medicane_lot'));
            }
            var num = nlapiGetCurrentLineItemText(type, "custcol_medicane_lot");
            if (num == '' || num == null)
                num = nlapiGetCurrentLineItemText(type, "custcol_medicane_production_lot");
            var exp = document.getElementById("custcol_experation_date").value;
            beforeInventoryDetailOpen('inventory', this, -1);
            removeMachineSubrecord();
            NLShowChildRecordPopup('inventory', 'inventoryinventorydetail', false, '/app/accounting/transactions/inventory/numbered/inventorydetail.nl', this, -1, { right: 0, width: 700, height: 700 }, 'inventory', 'inventorydetail');
            try { document.getElementById('childdrecord').style.display = 'none'; document.getElementById('ext-gen23').style.display = 'none' } catch (e) { };
            trigger_once = false;
            setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 150, qty, exp, num, type);
            setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 1500, qty, exp, num, type);
            setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 3000, qty, exp, num, type);
            setTimeout(function (qty, exp, num, type) { setinv(qty, exp, num, type) }, 5000, qty, exp, num, type);
        }
    }
    catch (e) {
        console.log(e)
        parent[4].closeInventoryDetails();
    }
}


function setinv(qty, exp, num, type) {
    try {
        if (trigger_once || document.getElementById('childdrecord') == null || parent[4].document.getElementById('inventoryassignment_expressentry') == null)
            return;
        debugger;
        trigger_once = true;
        document.getElementById('childdrecord').style.display = 'none';
        //confirm("You are about to update the inventory. Please confirm");
        parent[4].document.getElementById("quantity").click(); parent[4].document.getElementById("quantity").value = qty;
        parent[4].document.getElementById("receiptinventorynumber").value = num;
        parent[4].document.getElementById("expirationdate").click(); parent[4].document.getElementById("expirationdate").value = exp;
        parent[4].document.getElementById("quantity").click();
        parent[4].document.getElementById("quantity_formattedValue").click();
        parent[4].document.getElementById("quantity_formattedValue").value = qty;
        parent[4].document.forms['inventoryassignment_form'].elements['quantity'].value = qty;

        try {
            var currentitem = parent[4].document.getElementById("item") != null ? parent[4].document.getElementById("item").value : null;
            var status = nlapiLookupField('lotnumberedassemblyitem', currentitem, 'custitemdefault_location_for_adjustmen');
            if (status == null)
                status = nlapiLookupField('inventoryitem', currentitem, 'custitemdefault_location_for_adjustmen');

            if (status == null || status == "") {
                alert('There is no default status for this item. Please Update the status first');
                parent[4].closeInventoryDetails();
                return;

            }
            var res = nlapiSearchRecord('inventorystatus', null, null, [new nlobjSearchColumn('name')]);
            var inv_statuses = []; res.forEach(function (item) { inv_statuses[item.id] = item.getValue('name') });
            var invstatusfield = parent[4].document.getElementById("inventoryassignment_inventorystatus_display");
            if (invstatusfield == null)
                invstatusfield = parent[4].document.getElementById("inpt_inventorystatus1");
            invstatusfield.click();
            invstatusfield.value = inv_statuses[status];
            invstatusfield.dispatchEvent(new Event('change'));
        }
        catch (e) {
            console.log(e)
            parent[4].closeInventoryDetails();
        };


        //this.checkvalid=false;this.isvalid=validate_field(this,'float',true,false,null,null,false, null ,8); if(this.isvalid) {document.forms['inventoryassignment_form'].elements['quantity'].value = NLStringToNormalizedNumberString(this.value);}if (this.isvalid) {;setMachineChanged('inventoryassignment',this)}if (!this.isvalid) { selectAndFocusField(this);}return this.isvalid;
        setTimeout(function (elm) { elm.click(); }, 300, parent[4].document.getElementById("inventoryassignment_addedit"));
        setTimeout(function (elm) { elm.click(); adjustQuantityOnChange();; updateUIType();; qtyFieldChangeinventorydetail(); }, 700, parent[4].document.getElementById("secondaryok"));
        setTimeout(function (type) {
            nlapiCommitLineItem(type); trigger_once = false;
        }, 1000, type);
    }
    catch (e) {
        console.log(e)
        parent[4].closeInventoryDetails();
    }
}

function aftersubmit(type) {
    try {

        var count = nlapiGetLineItemCount('inventory')
        for (i = 1; i <= count; i++) {
            var itemtype = nlapiLookupField('item', nlapiGetLineItemValue('inventory', 'item', i), 'type');
            if (itemtype == 'Assembly' || itemtype == 'InvtPart') {
                var batch = nlapiGetLineItemText('inventory', 'custcol_medicane_lot', i);
                var batch_val = nlapiGetLineItemValue('inventory', 'custcol_medicane_lot', i);
                var md_batch = nlapiGetLineItemText('inventory', 'custcol_medicane_production_lot', i);
                var md_batch_value = nlapiGetLineItemValue('inventory', 'custcol_medicane_production_lot', i);
                //update inventory number details:
                var batch_to_search = batch == "" ? md_batch : batch;
                nlapiLogExecution('debug', 'batch_to_search', batch_to_search);

                var obj = nlapiSearchRecord('inventorynumber', null, [new nlobjSearchFilter('inventorynumber', null, 'is', batch_to_search)])
                var batchid = obj[0].id;
                var inventorynumber_rec = nlapiLoadRecord('inventorynumber', batchid);
                inventorynumber_rec.setFieldValue('custitemnumber_medicane_production_lot', md_batch_value);
                inventorynumber_rec.setFieldValue('custitemnumber_md_batch_number', batch_val);
                nlapiSubmitRecord(inventorynumber_rec);
            }
        }
    }
    catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function validateInventoryDetail() {
    if (getInventoryMachValue('inventorydetailavail') != 'T') return true;
    var invDetail = nlapiViewCurrentLineItemSubrecord('inventory', 'inventorydetail');
    var isSerial = nlapiGetCurrentLineItemValue('inventory', 'isserial');
    if (!validateLineInventoryDetailQty(invDetail, isSerial)) {
        // alert('You still need to reconfigure the inventory detail record after changing the quantity.');
        return false;
    }
    if (nlapiViewCurrentLineItemSubrecord('inventory', 'inventorydetail') != null) return true;
    //if (parseFloat(getInventoryMachValue('adjustqtyby')) != 0) {
    //    if (getInventoryMachValue('adjustqtybytype') == 'LOH_NEGATIVE_QUANITY_INPUT') {
    //       // alert('Please configure the inventory detail for this line.');
    //        return false;
    //    }
    //    if (getInventoryMachValue('isnumbered') == 'T' || false) {
    //      //  alert('Please configure the inventory detail for this line.');
    //        return false;
    //    }
    //}
    return false;
}

function qtyFieldChangeinventorydetail() {
    if (nlapiGetCurrentLineItemValue('inventory', 'inventorydetailavail') == 'F') return;
    var invDetail = nlapiViewCurrentLineItemSubrecord('inventory', 'inventorydetail');
    if (invDetail != null) {
        var qty = parseFloat(nlapiGetCurrentLineItemValue('inventory', 'adjustqtyby'));
        invDetail.recordmanager.handleParentActiveRowChange(invDetail.sysId);
        invDetail.recordmanager.setFieldValue('quantity', qty);
        if (isNaN(parseFloat(invDetail.getFieldValue('conversionrate'))))
            invDetail.recordmanager.setFieldValue('baseunitquantity', qty);
        else
            invDetail.recordmanager.setFieldValue('baseunitquantity', qty * parseFloat(invDetail.getFieldValue('conversionrate')));
        try {
            invDetail.recordmanager.saveRow();
        }
        catch (e) { }
        var fld = (nlapiGetCurrentLineItemValue('inventory', 'isserial') == 'T') ? 'baseunitquantity' : 'quantity';
        var qty = parseFloat(invDetail.getFieldValue(fld));
        var invDetailQty = parseFloat(invDetail.getFieldValue('totalquantity'));
        if (qty != invDetailQty) {
            //    //alert('The total inventory detail quantity must be {1}.'.replace('{1}', qty));
            changeCurrentLineToNeededStyle();
        }
    }
}