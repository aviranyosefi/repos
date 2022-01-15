function beforeLoad_addButton(type, form) {

    if (type == 'view') {
        form.setScript('customscript_agreement_print_client'); // client script id
        form.addButton('custpage_button_print', 'הדפס', 'printButton()');
        var Contact = nlapiLookupField('customrecord_agreement', nlapiGetRecordId(), 'custrecord_agr_contact')
        if (Contact.length > 0) { form.addButton('custpage_button_print', 'Email', 'emailButton()') };
        if (nlapiLookupField('customrecord_agreement', nlapiGetRecordId(), 'custrecord_agr_status') == 3) {
            form.addButton('custpage_button_print', 'צירוף שורת', 'addLines()')
            form.addButton('custpage_button_print_edit', 'עריכת ההסכם', 'EditAgr()')
        };
        if (nlapiLookupField('customrecord_agreement', nlapiGetRecordId(), 'custrecord_agr_status') == 1) { form.addButton('custpage_button_print', 'צפייה בכל שורות ההסכם', 'gotoscreen()') };
        if (nlapiLookupField('customrecord_agreement', nlapiGetRecordId(), 'custrecord_agr_status') == 3) { form.addButton('custpage_button_print', 'צפייה בכל שורות ההסכם', 'gotoNextscreen()') };
    }
}











