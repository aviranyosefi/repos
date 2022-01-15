var context = nlapiGetContext();

function beforeLoad_addButton(type, form) {
   
    if (type == 'view' && (cotext.role == '1019' || cotext.role == '3') && nlapiGetFieldValue('status') != '5' && !isNullOrEmpty(nlapiGetFieldValue('item')) ) {

            form.setScript('customscript_assembly_item_client'); // client script id
            form.addButton('custpage_button_print', 'דיווח חלקי חילוף', 'printButton()');
       
    }            
}


        //custevent_internal_case_type mapping= {13-'הרכבת מכלול'
        // 
        //}