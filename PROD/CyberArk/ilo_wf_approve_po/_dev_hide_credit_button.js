function hideCreditButton(type , form) {

    if (type == 'view') {
        var recID = nlapiGetRecordId();
        var rec = nlapiLoadRecord('vendorbill', recID);
        var cb = rec.getFieldValue('paymenthold');
        if (cb == 'T') {
            var html = "<html><body><script type='text/javascript'>document.getElementById('tbl_credit').style.visibility='hidden';</script></body></html>";
            var field = form.addField('custpage_alertmode', 'inlinehtml', '', null, null);
            field.setDefaultValue(html);
        }
    }
}

