/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Mar 2018     idor
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function test_email(type) {
	
	try{
		
	
	var fromId = '616'; //Asaf's employee
	var recipient = 'idoroz25@gmail.com';
	
//	var inv = nlapiPrintRecord('TRANSACTION','5780','PDF',null);
//	var statement = nlapiLoadFile('6073');

	var sbj = 'TEST MAIL - FROM GALOOLI PROD';
	var msg = 'Dear Test, \n\r <span style="background-color:yellow;">*Please note that our banking details have been changed, as shown on the attached invoice.</span> \n\rIf you would kindly note the invoice number on the wire transfer, it would be much appreciated. \n\rPlease note that, per our agreement, all money transfer fees are to be borne by the customer, ensuring that our bank receives the net invoice amount. \n\rPlease don’t hesitate to contact me if you have any questions. \n\rThank you for your business.';
	
	nlapiSendEmail(fromId, recipient, sbj, msg, 'ido.rozen@one1up.com', null, null, null, null, null, null);

	}catch(err){
		nlapiLogExecution('debug', 'err', err);
	}
}
