// JavaScript source code

function beforeLoad_addButton(type, form) {
    if (type != 'create') {
        var typeRec = nlapiGetRecordType();
        var hideBtn = nlapiLookupField('role', nlapiGetRole(), 'custrecord_hide_buttons_customer_portal')
        if (typeRec != 'supportcase' || (typeRec == 'supportcase' && hideBtn == 'F')) {
            form.setScript('customscript_update_serial_detail_cs'); // client script id
            form.addButton('custpage_button_pmt1', 'Update Version', 'Update()');
        }  
        if (typeRec == 'supportcase' && hideBtn == 'T') { hideTransaction(form)}
    }
}
function hideTransaction(form) {
    var html = '<SCRIPT language="JavaScript" type="text/javascript">';
    html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
    html += 'bindEvent(window, "load", function(){';
    html += 'function grayOut_loading_hijack_save(){try{var btn=document.getElementById("custpage_rac_search_button"); btn.style.display ="none";}catch(t){console.log(t)}}grayOut_loading_hijack_save();';
    html += '});';
    html += '</SCRIPT>';
    var field0 = form.addField('custpage_hide_btn', 'inlinehtml', '', null, null);
    field0.setDefaultValue(html);

}



