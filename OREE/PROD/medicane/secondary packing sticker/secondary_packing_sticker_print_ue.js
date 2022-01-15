function beforeLoad_addButton(type, form) { 
    if (type == 'view') {   
        form.setScript('customscript_scdy_pack_stkr_prt_cs'); // client script id
        form.addButton('custpage_button_scdy_print', 'Generate secondary sticker', 'printScdyButton()');
        }
}
