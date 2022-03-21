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
function tmptst_vendbill_aftersubmit(type){
	
    var rec_type = nlapiGetRecordType();
    nlapiLogExecution('debug', 'billrectype', rec_type)
    var rec_id = nlapiGetRecordId();
    nlapiLogExecution('debug', 'billrecid', rec_id)
    
//          nlapiLogExecution('debug', 'nlapiGetContext().subsidiary', nlapiGetContext().subsidiary)
//                nlapiLogExecution('debug', 'nlapiGetContext().environment', nlapiGetContext().environment)
//                      nlapiLogExecution('debug', 'nlapiGetContext().company', nlapiGetContext().company)
  

}
