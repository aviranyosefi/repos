
function beforeLoad_addButton(type, form) {  
    if (type == 'create' || type == 'edit' ) {
        form.setScript('customscript_add_kit_item_cs'); // client script id
        var list = form.getSubList("item");
        list.addButton('custpage_test', 'Add Kit', 'AddKit()');
        //list.addButton('custpage_test', 'Remove', 'Remove()');
    }         
}










