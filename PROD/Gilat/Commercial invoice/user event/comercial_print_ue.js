// JavaScript source code

function beforeLoad_addButton(type, form) {
    nlapiLogExecution('debug', 'beforeLoad_addButton in PrintPdf: ', type);
    if (type == 'view') {
        form.setScript('customscript_comercial_print_cs'); // client script id
        form.addButton('custpage_button_pmt1', 'Commercial Invoice Print', 'onclick_print()');
        
    }
    

}

function beforeSubmit(type) {
    if (type == 'create') {
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (!isNullOrEmpty(createdfrom)) {
            var ffItems = nlapiGetLineItemCount('item');
            try {
                var soRec = nlapiLoadRecord('salesorder', createdfrom);
                var soItems = soRec.getLineItemCount('item');
                for (var i = 1; i <= ffItems; i++) {
                    var item = nlapiGetLineItemValue('item', 'item', i);
                    var line = nlapiGetLineItemValue('item', 'orderline', i);
                    for (var j = 1; j <= soItems; j++) {
                        var S0_line = soRec.getLineItemValue('item', 'line', j);
                        var S0_item = soRec.getLineItemValue('item', 'item', j);
                        if (item == S0_item && S0_line == line) {
                            var soRate = soRec.getLineItemValue('item', 'rate', j);
                            nlapiSetLineItemValue('item', 'custcol_custom_price', i, soRate)
                            break;
                        }
                    } // for (var j = 1; j <= soItems; j++)
                } //for (var i = 1; i <= ffItems; i++)
            } catch (e) {
                for (var i = 1; i <= ffItems; i++) {
                    nlapiSetLineItemValue('item', 'custcol_custom_price', i, 0)
                }
            }
        } //  if (!isNullOrEmpty(createdfrom))
    } //   if (type == 'create')

    var contact = nlapiGetFieldValue('custbody_logistic_contact');
    if (contact != '' && contact != null && contact != undefined) {

        var phone = nlapiLookupField('contact', contact, 'mobilephone')
        if (phone != '' && phone != null && phone != undefined) {
            nlapiSetFieldValue('custbody_logistic_contact_phone', phone);
        }

    }
    else {
        nlapiSetFieldValue('custbody_logistic_contact_phone', '');
    }

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}


