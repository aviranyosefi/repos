function GenerateFulfillment() {
    try {
        var context = nlapiGetContext();
        var so_id = context.getSetting('SCRIPT', 'custscript_so_id');
        nlapiLogExecution('debug', 'salesorder id:  ', so_id)
        var itfRec = nlapiTransformRecord('salesorder', so_id, 'itemfulfillment');
        itfRec.setFieldValue('shipstatus', 'C');
        var id = nlapiSubmitRecord(itfRec);
        nlapiLogExecution('debug', 'itemfulfillment id:  ', id)
    } catch (e) {

        nlapiLogExecution('debug', 'GenerateFulfillment error:  ', e)
    }
}


//function GenerateFulfillment() {
//    try {
//        var context = nlapiGetContext();
//        var itf_id = context.getSetting('SCRIPT', 'custscript_so_id');
//        nlapiLogExecution('debug', 'itemfulfillment id:  ', itf_id)
//        var itfRec = nlapiLoadRecord('itemfulfillment', itf_id);     
//        itfRec.setFieldValue('shipstatus', 'C');	
//        var id = nlapiSubmitRecord(itfRec);
//        if (id != '-1') {
//            try { nlapiScheduleScript('customscript_create_install_base_ss', null, { custscript_obj_for_bi: id }) } catch (e) { }
//        }
//        nlapiLogExecution('debug', 'itemfulfillment id:  ', id)
//    } catch (e) {

//        nlapiLogExecution('debug', 'GenerateFulfillment error:  ', e)
//    }
//}