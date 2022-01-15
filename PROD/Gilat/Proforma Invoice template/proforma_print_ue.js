
function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {
               
        form.setScript('customscript_proforma_print_client'); // client script id
        form.addButton('custpage_button_print', 'Proforma Invoice ', 'printButton()');

    }
     
}










