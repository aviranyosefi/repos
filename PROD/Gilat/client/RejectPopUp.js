
//function rejectPopUp() {

//    do {
//        input = prompt("Please enter the cause of rejection");
//    } while (input == null || input == "");

//    nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_rejected_reason', input);


//    }




function rejectPopUp() {
    try {
        nlapiLogExecution('debug', 'test', 'test')
        var res = prompt("Please enter the cause of rejection: ");
        if (res == null || res == "") {
            return false;


        } else {
            nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_rejected_reason', res);
            nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'approvalstatus', 3);
            location.reload();
            //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
            //rec.setFieldValue('custbody_rejected_reason', res);
            //nlapiSubmitRecord(rec);
            return true;
        }
    } catch (err) {
        nlapiLogExecution('debug', 'err', err)
    }

}

function beforeLoad_addButton(type, form) {
    
    //custpageworkflow55
    var script = "<script>function popup_reg(){rejectPopUp()};var a = document.getElementById('workflowactionreject');" +
        "a.addEventListener('click',popup_reg);</script>";
    var newInlineHtmlField = form.addField('custpage_myinline', 'inlinehtml', '', null, null);
    newInlineHtmlField.setDefaultValue(script);
    form.setScript('customscript_rejectpopup'); // client script id
 
}