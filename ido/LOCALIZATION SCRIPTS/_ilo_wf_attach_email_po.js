/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Nov 2018     idor
 *
 */

/**
 * @returns {Void} Any or no return value
 */
function sendAndAttachEmailPO() {
	try{
		
	var recID = nlapiGetRecordId();
	
	var fromId = 2438; //Ido Employee
	var sendTo = 23018 //Asaf Employee
	//var attachment = nlapiPrintRecord('TRANSACTION',recID,'PDF',null);

	var sbj = 'PO Attached to Record';
	var msg = 'test test test';
	var attachRec = new Object(); 
	attachRec['transaction']=recID; //attach email to PO record

		
	nlapiSendEmail(fromId,sendTo, sbj, msg, null, null, attachRec, null);
	
	}catch(err){
		//nlapiLogExecution('debug', 'err', err)
		console.log(err)
	}
	
}
