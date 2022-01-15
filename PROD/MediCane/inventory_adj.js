var trigger_once = false;
function FieldChanged_adjustqtyby(type, name, linenum) {
    try
    {
        debugger;
        if (name == 'adjustqtyby') {
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
            var exp = document.getElementById("custcol_experation_date").value;
            beforeInventoryDetailOpen('inventory', this, -1);
            removeMachineSubrecord();
            NLShowChildRecordPopup('inventory', 'inventoryinventorydetail', false, '/app/accounting/transactions/inventory/numbered/inventorydetail.nl', this, -1, { right: 0, width: 700, height: 700 }, 'inventory', 'inventorydetail');
            setTimeout(function (qty, exp, num, type) { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv(qty, exp, num, type)) }, 100, qty, exp, num, type);
            setTimeout(function (qty, exp, num, type) { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv(qty, exp, num, type)) }, 400, qty, exp, num, type);
            setTimeout(function (qty, exp, num, type) { parent.childdrecord_frame.document.addEventListener('DOMContentLoaded', setinv(qty, exp, num, type)) }, 1100, qty, exp, num, type);
        }
    }
    catch (e)
    { }
}


function setinv(qty, exp, num, type) {
    if ( trigger_once || document.getElementById('childdrecord') == null || parent.childdrecord_frame.document.getElementById('inventoryassignment_expressentry') == null)
        return;
    trigger_once = true;
    document.getElementById('childdrecord').style.display = 'none';
    confirm("You are about to update the inventory. Please confirm");
    parent.childdrecord_frame.document.getElementById("quantity").click(); parent.childdrecord_frame.document.getElementById("quantity").value = qty;
    parent.childdrecord_frame.document.getElementById("receiptinventorynumber").value = num;
    parent.childdrecord_frame.document.getElementById("expirationdate").click(); parent.childdrecord_frame.document.getElementById("expirationdate").value = exp;
    parent.childdrecord_frame.document.getElementById("quantity").click();
    parent.childdrecord_frame.document.getElementById("quantity_formattedValue").click();
    parent.childdrecord_frame.document.getElementById("quantity_formattedValue").value = qty;
    parent.childdrecord_frame.document.forms['inventoryassignment_form'].elements['quantity'].value = qty;
    //this.checkvalid=false;this.isvalid=validate_field(this,'float',true,false,null,null,false, null ,8); if(this.isvalid) {document.forms['inventoryassignment_form'].elements['quantity'].value = NLStringToNormalizedNumberString(this.value);}if (this.isvalid) {;setMachineChanged('inventoryassignment',this)}if (!this.isvalid) { selectAndFocusField(this);}return this.isvalid;
    setTimeout(function (elm) { elm.click(); }, 300, parent.childdrecord_frame.document.getElementById("inventoryassignment_addedit"));
    setTimeout(function (elm) { elm.click(); adjustQuantityOnChange();; updateUIType();; qtyFieldChangeinventorydetail(); }, 700, parent.childdrecord_frame.document.getElementById("secondaryok"));
    setTimeout(function (type) {
        nlapiCommitLineItem(type); trigger_once = false;
    }, 1000, type);
  
}
