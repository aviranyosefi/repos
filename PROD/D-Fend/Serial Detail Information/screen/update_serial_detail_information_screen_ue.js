// JavaScript source code

function beforeLoad_addButton(type, form) {
    nlapiLogExecution('error', 'beforeLoad_addButton in PrintPdf: ', type);
    if (type != 'create') {
        form.setScript('customscript_update_serial_detail_cs'); // client script id
        form.addButton('custpage_button_pmt1', 'Update Version', 'Update()');
      
    }


}



