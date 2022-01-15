function beforeLoad_addButton(type, form) { 
    if (type == 'view') {   
        form.setScript('customscript_drying_crt_stic_print_cs'); // client script id
            form.addButton('custpage_button_print', 'Print Cart sticker', 'printButton()');
        }
}










