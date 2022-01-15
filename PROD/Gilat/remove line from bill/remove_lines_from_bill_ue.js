
function beforeLoad_addButton(type, form) {  
    if (type == 'create' || type == 'edit' ) {
        form.setScript('customscript_remove_lines_from_bill_cs'); // client script id
        var list = form.getSubList("item");
        list.addButton('custpage_test', 'Mark all lines', 'Markalllines()');
        list.addButton('custpage_test', 'Remove', 'Remove()');
    }         
}










