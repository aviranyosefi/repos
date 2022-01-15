function beforeLoad_addButton(type, form) { 
    if (type == 'view') {   
        form.setScript('customscript_bal_cel_stic_print_cs'); // client script id
            form.addButton('custpage_button_print', 'Print Cell sticker', 'printButton()');
        }
}
