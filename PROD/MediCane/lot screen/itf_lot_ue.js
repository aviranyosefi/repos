
function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {   
        form.setScript('customscript_itf_lot_cs'); // client script id
        form.addButton('custpage_button_print', 'Enter Lot', 'enterLot()');    
    }
}









