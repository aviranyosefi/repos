function beforeLoad(type, form) {
    var rectype = nlapiGetRecordType()
    form.setScript('customscript_invcount_callinvcount_cs'); // id of client script
    if (rectype == 'inventorycount') {       
        if (type == 'create') {
           form.addButton('custpage_set_inv_count', 'Set Inventory Count File', 'callInvCount()');            
        }
        else if (type == 'view') {
            var status = nlapiGetFieldValue('status');
            nlapiLogExecution("DEBUG", "status", status);
            if (status == 'Open') {
                var html = '<SCRIPT language="JavaScript" type="text/javascript">';
                html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){';
                html += 'function grayOut_loading_hijack_save(){try{document.getElementById("startcount").click()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; html += '});';
                html += '</SCRIPT>';
                var field0 = form.addField('custpage_alertmode', 'inlinehtml', '', null, null);
                field0.setDefaultValue(html);
            }
            else if (status == 'Started' && nlapiGetFieldValue('custbody_already_started') == 'F') {
                form.addButton('custpage_edit_save', 'Edit Save', 'EditSave()')
                var html = '<SCRIPT language="JavaScript" type="text/javascript">';
                html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){';
                html += 'function grayOut_loading_hijack_save(){try{document.getElementById("custpage_edit_save").style.display ="none";  document.getElementById("custpage_edit_save").click()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; html += '});';
                html += '</SCRIPT>';
                var field0 = form.addField('custpage_alertmode', 'inlinehtml', '', null, null);
                field0.setDefaultValue(html);
            }
        }
    }
    else if (rectype == 'customrecord_inventory_count_file_up') {
        if (type == 'create') {
            form.addButton('custpage_check_file', 'Check File', 'checkFile()');
        }
        else if (type == 'view' && nlapiGetFieldValue('custrecord_first_view') == 'F') {
            var rec = nlapiLoadRecord('customrecord_inventory_count_file_up', nlapiGetRecordId());
            rec.setFieldValue('custrecord_first_view', 'T');
            var id = nlapiSubmitRecord(rec);
            var html = '<SCRIPT language="JavaScript" type="text/javascript">';
            html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){';
            html += 'function grayOut_loading_hijack_save(){try{window.close()}catch(t){console.log(t)}}grayOut_loading_hijack_save();'; 
            html += '});';
            html += '</SCRIPT>';
            var field0 = form.addField('custpage_alertmode', 'inlinehtml', '', null, null);
            field0.setDefaultValue(html);

        }
    }
}
function afterSubmit(type) {
    try {
        if (type != 'delete') {
            var rectype = nlapiGetRecordType()
            if (rectype == 'inventorycount') {
                var rec = nlapiLoadRecord(rectype, nlapiGetRecordId());
                var status = rec.getFieldValue('status');
                nlapiLogExecution('debug', 'record status', status);

                var FileID = rec.getFieldValue('custbody_file_id');

                if (!isNullOrEmpty(FileID) && status == 'Open') {
                    var rec_countlines = rec.getLineItemCount('item');
                    removeLines(rec, rec_countlines);
                    var jsondata = getfileData(FileID);
                    nlapiLogExecution('debug', 'jsondata', JSON.stringify(jsondata));
                    rec.setFieldValue('custbody_json', JSON.stringify(jsondata));
                    insertlines(rec, jsondata);              
                }
                else if (!isNullOrEmpty(FileID) && status == 'Started' && rec.getFieldValue('custbody_load_data') == 'F') {
                    var jsondata = rec.getFieldValue('custbody_json');
                    if (!isNullOrEmpty(jsondata)) {
                        jsondata = JSON.parse(jsondata);
                        insertlinesdata(rec, jsondata);
                        rec.setFieldValue('custbody_load_data', 'T')
                    }
                }
                var id = nlapiSubmitRecord(rec);
                nlapiLogExecution("DEBUG", "record saved", id);
            }
        }       
    } catch (e) {
        nlapiLogExecution("error", "e", e);
    }
}

function insertlinesdata(rec, jsondata) {

    nlapiLogExecution("DEBUG", "insertlinesdata", "insertlinesdata");

    var keys = Object.keys(jsondata)
    for (var i = 0; i < keys.length; i++) {
        var fieldval = jsondata[keys[i]];
        nlapiLogExecution("DEBUG", keys[i] + " - fieldval", JSON.stringify(fieldval));

        var line_num = rec.findLineItemValue('item', 'item', keys[i]);
        var count_quantity = get_count_quantity(fieldval);
        rec.selectLineItem('item', line_num);
        rec.setCurrentLineItemValue('item', 'countquantity', count_quantity);
        for (var j = 0; j < fieldval.length; j++) {

            var obj = fieldval[j];
            nlapiLogExecution("DEBUG", "obj", JSON.stringify(obj));
            if (!isNullOrEmpty(obj.serialLot)) {
                if (j == 0) {
                    rec.removeCurrentLineItemSubrecord('item', 'countdetail');
                    inventoryDetail = rec.createCurrentLineItemSubrecord('item', 'countdetail');
                }
                else {
                    inventoryDetail = rec.editCurrentLineItemSubrecord('item', 'countdetail');
                }
                assign_count = inventoryDetail.getLineItemCount('inventorydetail')
                nlapiLogExecution('debug', 'inventorydetail', JSON.stringify(assign_count));
                inventoryDetail.selectNewLineItem('inventorydetail');
                inventoryDetail.setCurrentLineItemValue('inventorydetail', 'inventorynumber', obj.serialLot);
                inventoryDetail.setCurrentLineItemValue('inventorydetail', 'quantity', obj.quantity);
                inventoryDetail.commitLineItem('inventorydetail');
                inventoryDetail.commit();
            }
        }
        rec.commitLineItem('item');
    }
}
function get_count_quantity(fieldval) {
    var qty = 0;
    for (var key in fieldval) {
        var obj = fieldval[key];
        qty += Number(obj.quantity);

    }

    return qty;
}
function insertlines(rec, jsondata) {


    var linenum = 1;
    for (var key in jsondata) {
        var fieldval = jsondata[key];
        if (isNullOrEmpty(key))
            continue;
        nlapiLogExecution("debug", 'key: ' + key, JSON.stringify(fieldval));
        rec.setLineItemValue('item', 'item', linenum, key);
        linenum++;
    }

    return
}
function removeLines(rec, removeLines) {

    for (var i = removeLines; i > 0; i--) {
        rec.removeLineItem('item', i);
    }
    return
}
function getfileData(FileID) {
    var dataToReturn = {};
    var loadedFile = nlapiLoadFile(FileID);
    loadedFile.setEncoding('UTF-8')
    var loadedString = loadedFile.getValue();   
    var fileLines = loadedString.split('\r\n');
    for (var i = 1; i <= fileLines.length; i++) {
        if (!isNullOrEmpty(fileLines[i])) {
            var itemob = {};
            var prevline = fileLines[i - 1].split(',');
            var lines = fileLines[i].split(',');

            if (i == 1 || lines[0] != prevline[0])
                var items = [];

            var item = lines[0];
            var bin = lines[1];
            var quantity = lines[2];
            var serialLot = lines[3];
            var itemob = {
                'item': item,
                'bin': bin,
                'quantity': quantity,
                'serialLot': serialLot
            }
            var ItemId = getItemId(item);
            items.push(itemob);
            dataToReturn[ItemId] = items;  
        }
    }

    return dataToReturn;

}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getItemId(itemName) {

    var itemSearch = nlapiSearchRecord("item", null,
        [
            ["name", "is", itemName],
            "AND",
            ["isinactive", "is", "F"]
        ],
        [
            new nlobjSearchColumn("internalid"),
            new nlobjSearchColumn("type"),
            new nlobjSearchColumn("subtype")
        ]
    );

    if (itemSearch != null && itemSearch.length > 0) {
        return itemSearch[0].getValue('internalid')
    }
    return '';


}