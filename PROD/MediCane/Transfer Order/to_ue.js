function beforeLoad_addButton(type, form) {

    if (type == 'view' && nlapiGetFieldValue('ordertype') == "TrnfrOrd" && nlapiGetFieldValue('custbody_receipt_press') == 'F') {
        form.setScript('customscript_to_client');
        form.addButton('custpage_button_itf', 'Receipt', 'TrasferITR()');
    }
    if (type == 'view' && nlapiGetFieldValue('ordertype') == "TrnfrOrd" && nlapiGetFieldValue('custbody_receipt_press') == 'T') {
        try {
            var transId = nlapiGetFieldValue('createdfrom');
            var itrRec = nlapiTransformRecord('transferorder', transId, 'itemreceipt');
            var id = nlapiSubmitRecord(itrRec);
            if (id == -1) {
                setFlagToFalse()
            }
        } catch (e) {
            setFlagToFalse()
        }

    }


}

function setFlagToFalse() {
    var recID = nlapiGetRecordId();
    var rec = nlapiLoadRecord('itemfulfillment', recID);
    rec.setFieldValue('custbody_receipt_press', 'F');
    nlapiSubmitRecord(rec, null, true);
    var html = '<SCRIPT language="JavaScript" type="text/javascript">';
    html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){';
    html += 'function grayOut_loading_hijack_save(){try{document.getElementById("custpage_button_itr").click()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; html += '});';
    html += '</SCRIPT>';
    var field0 = form.addField('custpage_alertmode', 'inlinehtml', '', null, null); field0.setDefaultValue(html);

}



//function beforeLoad_addButton(type, form) {

//    if (type == 'view') { 
//        var recID = nlapiGetRecordId();
//        if (nlapiGetFieldValue('status') == 'Pending Fulfillment') {          
//            var rec = nlapiLoadRecord('transferorder', recID, { recordmode: 'dynamic' });
//            subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', 1); 
//            if (subrecord != null) {
//                form.setScript('customscript_to_client');
//                form.addButton('custpage_button_itf', 'Transfer', 'TrasferITF()');
//            }

//        }
//        if (nlapiGetFieldValue('status') == 'Pending Receipt') {

//            if (getJob(recID) > 0) {
//                form.setScript('customscript_to_client');
//                form.addButton('custpage_button_itr', 'Trasfer', 'TrasferITR()');
//                var html = '<SCRIPT language="JavaScript" type="text/javascript">';
//                html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){';
//                html += 'function grayOut_loading_hijack_save(){try{document.getElementById("custpage_button_itr").click()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; html += '});';
//                html += '</SCRIPT>';
//                var field0 = form.addField('custpage_alertmode', 'inlinehtml', '', null, null); field0.setDefaultValue(html);
//            }                    
//        }      
//    }
//}

//function getJob(id) {
//    try {
//        var filters = new Array();
//        filters[0] = new nlobjSearchFilter('custrecord_ilo_transfer_recid', null, 'is', id)

//        var search = nlapiCreateSearch('customrecord_ilo_transfer_job', filters, null);

//        var resultset = search.runSearch();
//        var s = [];
//        var searchid = 0;

//        do {
//            var resultslice = resultset.getResults(searchid, searchid + 1000);
//            for (var rs in resultslice) {
//                s.push(resultslice[rs]);
//                searchid++;
//            }
//        } while (resultslice != null && resultslice.length >= 1000);

//        if (s != null && s.length >0) {
//            return s[0].id;          
//        }
//            return 0;
//    } catch (e) { return 0;}
//}
















