
function create_coffee_machine_equ(type) {
    //nlapiLogExecution('debug', 'type', type)
    if (type != 'delete') {
        try {
            var ssRun = true;
            var id = nlapiGetRecordId();
            var trantype = nlapiGetRecordType()
            nlapiLogExecution('debug', 'id: ' + id, 'trantype: ' + trantype );
            if (trantype == 'supportcase') {
                var rec = nlapiLoadRecord('supportcase', id);
                if (type != 'create') {
                    var newRec = nlapiGetNewRecord();
                    var oldRec = nlapiGetOldRecord();
                    var new_status = newRec.getFieldValue('status');
                    var old_status = oldRec.getFieldValue('status');
                }
                else {
                    var new_status = rec.getFieldValue('status');
                    var old_status = '';
                }
                var category = rec.getFieldValue('category');
                var internal_case_type = rec.getFieldValue('custevent_internal_case_type');
                var telemetry_serial_number = rec.getFieldValue('custevent_telemetry_serial_number');
                if (new_status == '2' && old_status == '9' && category == '5' && (internal_case_type == '6' || internal_case_type == '10')) { } //4.4
                else if (new_status == '6' && new_status != old_status && category == '5' && (internal_case_type == '6' || internal_case_type == '10')) { }//4.5
                else if ((category == '5') && internal_case_type == '12' && new_status == '6' && new_status != old_status) { } // 4.6          
                else if ((category == '3') && (internal_case_type == '1' || internal_case_type == '8' || internal_case_type == '9')&& new_status == '6' && new_status != old_status) { } // 4.8
                else if ((category == '1' || category == '3') && internal_case_type != '2' && new_status == '6' && new_status != old_status) { } // 4.9
                else { ssRun = false; }
                
            }// if (trantype == 'supportcase')
            nlapiLogExecution('debug', 'ssRun', ssRun);
            if (ssRun) {
                try { nlapiScheduleScript('customscript_create_coffee_machine_equ_s', null, { custscript_tran_id: id, custscript_tran_type: trantype }) } catch (e) { }
            }
            if (trantype == 'supportcase' && new_status == '6' && new_status != old_status) {
                var machine = rec.getFieldValue('custevent_machine');
                var machinerec = nlapiLoadRecord('customrecord_coffee_machine_equip', machine);
                if (!isNullOrEmpty(telemetry_serial_number)) {
                    machinerec.setFieldValue('custrecord_telemetry', 'T')
                    machinerec.setFieldValue('custrecord_telemetry_serial_number', telemetry_serial_number)
                    nlapiSubmitRecord(machinerec)
                } 
            }         
        }
        catch (e) {
            nlapiLogExecution('debug', 'error ' , e);
        }
    }// if (type != 'delete')
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
