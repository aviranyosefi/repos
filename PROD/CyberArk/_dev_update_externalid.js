function updateExternalID(type) {
    nlapiLogExecution('debug', 'type: ' + type,'');
    if (type != 'delete') {
        try {
            var so_id = nlapiGetRecordId();
            var rec = nlapiLoadRecord('salesorder', so_id);
            var new_status = rec.getFieldValue('origstatus');           
            nlapiLogExecution('debug', 'new_status: '  , new_status );
            if (new_status == 'H' || new_status == 'C') {
                var externalid = rec.getFieldValue('externalid');
                if (!isNullOrEmpty(externalid)) {
                    if (externalid.indexOf('OLD') == -1) {
                        externalid += 'OLD';
                        rec.setFieldValue('externalid', externalid);
                        nlapiSubmitRecord(rec);
                    }                    
                } 
                var project = rec.getFieldValue('custbody_cbr_so_project');
                if (!isNullOrEmpty(project)) { updateProject(project) }
            }
        } catch (e) {
            nlapiLogExecution('debug', 'error: ' , e);
        }
    }

}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function updateProject(id) {
    var Projectrec = nlapiLoadRecord('job', id);
    var entityid = Projectrec.getFieldValue('entityid');
    entityid += 'OLD';
    Projectrec.setFieldValue('entityid', entityid);
    Projectrec.setFieldValue('entitystatus', '1');//CLOSED
    nlapiSubmitRecord(Projectrec);
}