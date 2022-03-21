/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 May 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function tmptst_vendpymt_aftersubmit(type){
  
	
    var recordType = nlapiGetRecordType();
    var recordId = nlapiGetRecordId();
    var paymentrec = nlapiLoadRecord(recordType, recordId);

    var totalLines = 0;
    for (var i = 1; i <= paymentrec.getLineItemCount('apply') ; i++) {
        var lineNum = i;
        if (paymentrec.getLineItemValue('apply', 'apply', lineNum) == 'T') {
            var billid = paymentrec.getLineItemValue('apply', 'internalid', lineNum);
          nlapiLogExecution('debug', 'billid', billid)
          
			var recbill = nlapiLoadRecord('vendorbill', billid)
          nlapiSubmitRecord(recbill);
        }
    }
}
