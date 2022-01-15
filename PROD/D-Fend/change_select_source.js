function PageLoad() {
    var custbody6 = nlapiGetFieldValue('custbody6')
    if (!isNullOrEmpty(custbody6)) {
        setSelectList(custbody6)
    }
}
function fieldChange(type, name) {
    if (name == 'custbody6') {
        var custbody6 = nlapiGetFieldValue('custbody6')
        var recType = nlapiGetRecordType();
        if (!isNullOrEmpty(custbody6) && recType != 'itemfulfillment') {
            nlapiSetFieldValue('custbody_end_customer_address', '');
            setSelectList(custbody6);
        }
    }
}
function SaveRecord() {
    if (isNullOrEmpty(nlapiGetFieldValue('custbody_endcustomer_address_select'))){
        nlapiSetFieldValue('custbody_end_customer_address', '');
    }
    return true;
}
function setSelectList(customer) {
    debugger;
    var list = [];
    var rec = nlapiLoadRecord('customer', customer);
    var count = rec.getLineItemCount('addressbook');
    if (count > 0) {
        for (var i = 1; i <= count; i++) {
            var label = rec.getLineItemValue('addressbook', 'label', i)
            var addrtext = rec.getLineItemValue('addressbook', 'addrtext', i);
            var id = rec.getLineItemValue('addressbook', 'id', i);
            list[id] = {
                label: label,
                addrtext: addrtext,
            }
        }
    }
    var dest = document.getElementById('custbody_endcustomer_address_select_fs');
    var NewBtn = document.getElementById('custbody_endcustomer_address_select_fs_tooltipMenu')
    NewBtn.innerHTML = '';
      
    newList = document.getElementById('newList');
    if (newList != null) {
        newList.innerText = '';
        nlapiSetFieldValue('custbody_endcustomer_address_select', '')
    }
    else {
        var newList = document.createElement('ul');
        newList.id = 'newList';
        newList.style.cssText = style = "overflow:auto;background:white;width:280px;height:100px;line-height:1.5em;cursor:pointer;list-style-type: none;border:1px solid lightgrey; margin:0;";
        var toAdd = document.createDocumentFragment();
    }
    
    var toAdd = document.createDocumentFragment();
    var keys = Object.keys(list)
    for (var i = 0; i < keys.length; i++) {
        var newItem = document.createElement('li');
        newItem.id = keys[i];
        newItem.innerHTML = list[keys[i]].label;
        newItem.addEventListener("mouseover", mouseOver, false);
        newItem.addEventListener("mouseout", mouseOut, false);
        newList.appendChild(newItem);
        toAdd.appendChild(newList);
        dest.appendChild(toAdd);
    }


    document.addEventListener('click', function (e) {
        var value = nlapiGetFieldValue('custbody_endcustomer_address_select');

        e.stopPropagation();
        e = e || window.event;

        selectedBudgetClassification = e.target.id;

        if (selectedBudgetClassification == '') {

            nlapiSetFieldValue('custbody_end_customer_address', list[value].addrtext);
            nlapiSetFieldValue('custbody_endcustomer_address_select', value)
        }
        else {
            nlapiSetFieldValue('custbody_end_customer_address', list[selectedBudgetClassification].addrtext);
            nlapiSetFieldValue('custbody_endcustomer_address_select', selectedBudgetClassification)
        }

    }, false);	

}
function mouseOver() {

    this.style.cssText = 'background:#607799;color:white';
}
function mouseOut() {

    this.style.cssText = 'background:white; color: black;';
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}



