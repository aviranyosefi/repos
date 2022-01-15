/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Jan 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function setPOFields_afterSubmit(type, form, request){
  
  try{
    

		
	nlapiLogExecution('debug', 'in the script', 'true')
	var rec = nlapiLoadRecord('purchaseorder', nlapiGetRecordId());
	
	var getReqs = findReqs(nlapiGetRecordId());
	
	//if(getReqs.length > 1) { //checking if multiple requesitions
		
		//get buyer from first requesition	
		var og_Buyer = nlapiLookupField('purchaserequisition', getReqs[0], 'custbody5');
		nlapiLogExecution('debug', 'og_Buyer', og_Buyer)
		//get attachments from requesitions
		var req_Attachments = getAttachments(getReqs);
		
		nlapiLogExecution('debug', 'req_Attachments', JSON.stringify(req_Attachments))
		
		for(var i = 0; i<req_Attachments.length; i++) {
	
			nlapiAttachRecord('file', req_Attachments[i], 'purchaseorder', nlapiGetRecordId());			
		}
		rec.setFieldValue('custbody5', og_Buyer)
		nlapiSubmitRecord(rec)
	//}
	  }catch(err) {
    nlapiLogExecution('error', 'err', err)
  }
}


function findReqs(PO_internalid) {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('appliedtotransaction');
	
	var fils = new Array();
	fils[0] = new nlobjSearchFilter('internalid', null, 'anyof', [PO_internalid])

	var s = nlapiSearchRecord('purchaseorder', null, fils, cols);
	if (s != null) {

		for (var i = 0; i < s.length; i++) {
			
			if(s[i].getValue('appliedtotransaction') != "") {
				
				resultsArr.push(s[i].getValue('appliedtotransaction'));		
			}
		}
	}


	
	return resultsArr;
}


function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}


function getAttachments(REQ_internalid) {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid', 'file');
	
	var fils = new Array();
	fils[0] = new nlobjSearchFilter('internalid', null, 'anyof', REQ_internalid)
	fils[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')

	var s = nlapiSearchRecord('purchaserequisition', null, fils, cols);
	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push(s[i].getValue('internalid', 'file'));
		}
	}
return resultsArr;
}
