function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var typeRec = nlapiGetRecordType();
        //nlapiLogExecution('debug', 'typeRec', typeRec);
        var idRec = nlapiGetRecordId();
        //nlapiLogExecution('debug', 'idRec', idRec);

        try {
            var rec = nlapiLoadRecord(typeRec, idRec);
            //nlapiLogExecution('debug', 'rec', JSON.stringify(rec));
        } catch (e) {
            nlapiLogExecution('debug', 'error details', e);
        }

        var orderType = rec.getFieldValue('ordertype');
        nlapiLogExecution('debug', 'orderType', orderType);

        if (orderType == 'SalesOrd') {
            var flag = rec.getFieldValue('custbody_inventoryadjustment');
            nlapiLogExecution('debug', 'flag', flag);

            if (isNullOrEmpty(flag)) {
                var soRecID = rec.getFieldValue('createdfrom');
                //nlapiLogExecution('debug', 'soRecID', soRecID);
                try {
                    var soRec = nlapiLoadRecord('salesOrder', soRecID);
                    nlapiLogExecution('debug', 'soRec', JSON.stringify(soRec));
                } catch (e) {
                    nlapiLogExecution('debug', 'error details', e);
                }
                if (soRec.getFieldValue('custbody_storage_services') == 'T') {
                    var divhtml = "<div><b>Processing.....</b></div>";
                    var style = "left: 25%; top: 25%; z-index: 10001; position:absolute;width:620px;height:40px;line-height:1.5em;cursor:pointer;margin:5px;list-style-type: none;font-size:12px; padding:5px; background-color:#FFF; border: 2px solid gray;border-radius:10px;";
                    var stylebg = "position: absolute; z-index: 10000; top: 0px; left: 0px; height: 100%; width: 100%; margin: 5px 0px; background-color: rgb(204, 204, 204); opacity: 0.6;";
                    var function_click = "var bgdiv=document.createElement('div'); bgdiv.id='bgdiv'; bgdiv.onclick=bgdiv.style.display = 'none'; bgdiv.style.cssText='" + stylebg + "';var loadingdiv=document.createElement('div');loadingdiv.id='loadingdiv'; loadingdiv.innerHTML='" + divhtml + "'; loadingdiv.style.cssText='" + style + "'; document.body.appendChild(loadingdiv);document.body.appendChild(bgdiv);setTimeout(CreateTrn,200)";
                    form.setScript('customscript_inventory_adj_so_cs');
                    form.addButton('custpage_button_create', 'Create Trn', function_click);
                }
            }
        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}


