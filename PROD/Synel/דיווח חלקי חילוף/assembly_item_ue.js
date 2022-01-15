var context = nlapiGetContext();

function beforeLoad_addButton(type, form) {
   
    if (type == 'view' && (context.role == '1019' || context.role == '3') && nlapiGetFieldValue('status') != '5') {

            form.setScript('customscript_assembly_item_client'); // client script id
            form.addButton('custpage_button_print', 'דיווח חלקי חילוף', 'printButton()');
       
    }            
}


        //custevent_internal_case_type mapping= {13-'הרכבת מכלול'
        // 
        //}