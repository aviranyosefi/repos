
function editSave() {
    try { 

        var context = nlapiGetContext();
        var type = context.getSetting('SCRIPT', 'custscript_type'); 
		var id = context.getSetting('SCRIPT', 'custscript_id');

        var rec = nlapiLoadRecord(type, id);
        nlapiSubmitRecord(rec)
        

            
             
    } catch (err) {
        nlapiLogExecution('error', 'editSave()', err)
    }
    
}



