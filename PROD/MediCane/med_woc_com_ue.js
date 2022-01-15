function beforeLoad_addButton(type, form) {

    if (type == 'view') {
        
            form.setScript('customscript_med_woc_cs'); // client script id
            form.addButton('custpage_button_print', 'Report Completion', 'ReportCompletion()');
        
    }
}