

function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        form.setScript('customscript_inv_transfer_print_cs'); // client script id
        form.addButton('custpage_button_print_it', 'Print ', 'printIT()');
    }
}


