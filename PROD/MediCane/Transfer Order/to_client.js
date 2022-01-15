function TrasferITF() {

    debugger;
    try { 
        var recID = nlapiGetRecordId();
        var job = nlapiCreateRecord('customrecord_ilo_transfer_job');
        job.setFieldValue('custrecord_ilo_transfer_recid', recID);
        nlapiSubmitRecord(job);      
        var itfRec = nlapiTransformRecord('transferorder', recID, 'itemfulfillment');
        itfRec.setFieldValue('shipstatus', 'C');
        nlapiSubmitRecord(itfRec);
        window.location.reload();
    } catch (e) { alert(JSON.stringify(e)) }
   
}
function TrasferITR() {

    debugger;
    var recID = nlapiGetRecordId();  
    var rec = nlapiLoadRecord('itemfulfillment', recID);
    rec.setFieldValue('custbody_receipt_press', 'T');
    nlapiSubmitRecord(rec, null, true);
    window.location.reload();

    //}

}
