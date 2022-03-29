function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        var productType = nlapiGetFieldValue('custbody_product_category');
        if (productType == '3') {
            form.setScript('customscript_batch_num_gen_cs'); // client script id
            //form.addButton('custpage_button_print', 'create final product', 'createWorkOrder(' + nlapiGetFieldValue('assemblyitem') + ')');
            var divhtml = "<div><b>Processing.....</b></div>";
            var style = "left: 25%; top: 25%; z-index: 10001; position:absolute;width:620px;height:40px;line-height:1.5em;cursor:pointer;margin:5px;list-style-type: none;font-size:12px; padding:5px; background-color:#FFF; border: 2px solid gray;border-radius:10px;";
            var stylebg = "position: absolute; z-index: 10000; top: 0px; left: 0px; height: 100%; width: 100%; margin: 5px 0px; background-color: rgb(204, 204, 204); opacity: 0.6;";
            var function_click = "var bgdiv=document.createElement('div'); bgdiv.id='bgdiv'; bgdiv.onclick=bgdiv.style.display = 'none'; bgdiv.style.cssText='" + stylebg + "';var loadingdiv=document.createElement('div');loadingdiv.id='loadingdiv'; loadingdiv.innerHTML='" + divhtml + "'; loadingdiv.style.cssText='" + style + "'; document.body.appendChild(loadingdiv);document.body.appendChild(bgdiv);setTimeout('" + 'createWorkOrder(' + nlapiGetFieldValue('assemblyitem') + ')'+ ",200)";
            form.setScript('customscript_inventory_adj_so_cs');
            form.addButton('custpage_button_create', 'create final product', function_click);
        }
    }
}

function beforeSubmit(type) {
    if (type == 'create') {
        var productType = nlapiGetFieldValue('custbody_product_category');
        var date = new Date();
        var year = date.getFullYear().toString().substring(2, 4);
        if (productType == '3') {
            var productLine = nlapiGetFieldValue('custbody_product_line');
            if (productLine == '1') {
                var prefix = 'FLR';

                var columnLotNumber = new nlobjSearchColumn("custbody_wo_lot_number", null, "MAX");
                var workorderSearch = nlapiSearchRecord('workorder', null,
                    [['type', 'anyof', 'WorkOrd'], 'AND',
                    ['custbody_product_category', 'anyof', '3'], 'AND',
                    ['custbody_wo_lot_number', 'startswith', 'FL']],
                    [columnLotNumber.setSort(true)]
                );

                var code = workorderSearch[0].getValue(columnLotNumber);
                var prefix = code.substring(0, 3);
                var sequense = prefix + (parseInt(code.replace(prefix, '')) + 1);
                var expdate = nlapiLookupField('customrecord_lot_number_sequence', '1', 'custrecord_expiration_date');
                nlapiSetFieldValue('custbody_wo_lot_number', sequense);
                nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
                nlapiSubmitField('customrecord_lot_number_sequence', '1', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
            }
            else if (productLine == '2') {
                var prefix = 'OIL';
                var seqNum = nlapiLookupField('customrecord_lot_number_sequence', '2', 'custrecord_lot_number_sequence');
                var expdate = nlapiLookupField('customrecord_lot_number_sequence', '2', 'custrecord_expiration_date');
                var sequense = prefix + year + getZero(seqNum) + seqNum;
                nlapiSetFieldValue('custbody_wo_lot_number', sequense);
                nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
                nlapiSubmitField('customrecord_lot_number_sequence', '2', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
            }
        }
        else if (productType == '4') {
            var prefix = 'CRD';
            var seqNum = nlapiLookupField('customrecord_lot_number_sequence', '3', 'custrecord_lot_number_sequence');
            var expdate = nlapiLookupField('customrecord_lot_number_sequence', '3', 'custrecord_expiration_date');
            var sequense = prefix + year + getZero(seqNum) + seqNum;
            nlapiSetFieldValue('custbody_wo_lot_number', sequense);
            nlapiSetFieldValue('custbody_wo_lot_expiration_date', nlapiAddMonths(date, expdate));
            nlapiSubmitField('customrecord_lot_number_sequence', '3', 'custrecord_lot_number_sequence', parseInt(seqNum) + 1);
        }
    }
}

function getZero(seqNum) {
    var dif = 4 - seqNum.toString().length;
    var zero = '';
    for (var i = 1; i <= dif; i++) {

        zero += '0';
    }
    return zero;
}