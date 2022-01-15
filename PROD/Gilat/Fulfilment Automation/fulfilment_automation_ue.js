function soAprroval(type) {

    if (type != 'delete') {
        try {
            var so_id = nlapiGetRecordId();
            var rec = nlapiLoadRecord('salesorder', so_id);
            var new_status = rec.getFieldValue('origstatus');
            if (type != 'create') {
                var oldRec = nlapiGetOldRecord();
                var old_status = oldRec.getFieldValue('origstatus')
            }
            else {
                var old_status = '';
            }
            var topic = rec.getFieldValue('custbody_topic');
            nlapiLogExecution('debug', 'so: ' + so_id+ ' type: ' + type + ' ,topic: ' + topic, 'new_status: ' + new_status + ' ,old_status: ' + old_status)
            if (new_status == 'B' && (old_status != new_status) && topicValidation(topic)) {              
                try { nlapiScheduleScript('customscript_fulfilment_automation_ss', null, { custscript_so_id: so_id }) } catch (e) { nlapiLogExecution('debug', 'nlapiScheduleScript error:  ', e) }          
            }
        }
        catch (e) {
            nlapiLogExecution('debug', 'soAprroval error:  ', e)
        }
    }// if (type != 'delete')
}

//function soAprroval(type) {

//    if (type != 'delete') {
//        try {
//            var so_id = nlapiGetRecordId();
//            var rec = nlapiLoadRecord('salesorder', so_id );
//            var new_status = rec.getFieldValue('origstatus');
//            if (type != 'create') {          
//                var oldRec = nlapiGetOldRecord();           
//                var old_status = oldRec.getFieldValue('origstatus')                          
//            }
//            else {    
//                var old_status = '';              
//            }
//            var topic = rec.getFieldValue('custbody_topic');
//            nlapiLogExecution('debug', 'type: ' + type +' ,topic: ' + topic, 'new_status: ' + new_status + ' ,old_status: ' + old_status)  
//            if (new_status == 'B' && (old_status != new_status) && topicValidation(topic)) {
//                var itfRec = nlapiTransformRecord('salesorder', so_id, 'itemfulfillment');
//                itfRec.setFieldValue('shipstatus', 'C');
//                var id = nlapiSubmitRecord(itfRec);
//                nlapiLogExecution('debug', 'itemfulfillment id:  ', id)
//                if (id != '-1') {
//                    try { nlapiScheduleScript('customscript_fulfilment_automation_ss', null, { custscript_so_id: id }) } catch (e) { nlapiLogExecution('debug', 'nlapiScheduleScript error:  ', e) }
//                }
//            }           
//        }
//        catch (e) {
//            nlapiLogExecution('debug', 'soAprroval error:  ', e)
//        }
//    }// if (type != 'delete')
//}

function topicValidation(topic) {

    if (topic == '24' || topic == '26' || topic == '27' || topic == '28' || topic == '29' || topic == '30') { return true }
    else return false; 
}