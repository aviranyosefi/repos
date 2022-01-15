function beforeLoad_addButton(type, form) { 
    if (type == 'view') {   
        form.setScript('customscript_md_lot_sticker_print_cs'); // client script id
            form.addButton('custpage_button_print', 'Print sticker', 'printButton()');
        }
}










