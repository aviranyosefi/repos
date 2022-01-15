function beforeLoad_addButton(type, form) { 
    if (type == 'view' && nlapiGetFieldValue('custbody_package_type') != null && nlapiGetFieldValue('custbody_package_type') != '') {   
        form.setScript('customscript_prmy_pack_stkr_prt_cs'); // client script id
        form.addButton('custpage_button_prmy_print', 'Print Preliminary Packing sticker', 'printPrmyButton()');
        }
}
