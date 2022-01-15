

function dd() {
    rejectPopUp();
}


function rejectPopUp() {

    try {
     
     
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_qoute_print_suitlet', 'customdeploy_qoute_print_suitlet_dep', false);     
        createdPdfUrl += '&id=' + nlapiGetRecordId();
        //window.open(createdPdfUrl,   'win', 'resizable=0,scrollbars=0,width=450,height=300');
        document.location = createdPdfUrl;

    } catch (err) {
        nlapiLogExecution('debug', 'err', err)
    }

}

function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {
        var rec = nlapiLoadRecord('customrecord_quote', nlapiGetRecordId());
        var type = rec.getFieldValue('custrecord_quote_printout_type');
        if (type == '1') { // Proposal

            form.setScript('customscript_qoute_print_client'); // client script id
            form.addButton('custpage_button_print', 'Print With Ts&Cs', 'printButton()');
        }
       
        //var script = "<script>function popup_reg(){dd()};var a = document.getElementById('custpageworkflow574');" +
        //    "a.addEventListener('click',popup_reg);</script>";
        //var newInlineHtmlField = form.addField('custpage_myinline', 'inlinehtml', '', null, null);
        //newInlineHtmlField.setDefaultValue(script);
        //form.setScript('customscript_qoute_print_cs'); // client script id
      

    }

}









