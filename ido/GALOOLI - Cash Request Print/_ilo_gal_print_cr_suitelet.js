/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Nov 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function printCashRequest(request, response) 
{
    var funcName = 'parameters';
	
    var id = request.getParameter('crid');
    nlapiLogExecution('debug', funcName, 'id = ' + id);
    
    var rec  = nlapiLoadRecord('customrecord_cash_request', id);    


    nlapiLogExecution('debug', 'redirecting', 'Submitted the Cash Request now redirecting...');
  
    var temp = nlapiLoadFile('1050').getValue();
    nlapiLogExecution('debug', 'loaded template', 'maybe')
    var tranNum = rec.getFieldValue('name');
    var docName = rec.getFieldValue('altname')
    if(docName == null) {
    	docName = '';
    }
    nlapiLogExecution('debug', 'tranName+docName', 'maybe')
    var created = rec.getFieldValue('created');
    var employee = '';
    var employeeid = rec.getFieldValue('custrecord_gal_cr_requester');
    if(employeeid != '' || employeeid != null) {
    	try{
    		employee = nlapiLookupField('employee', employeeid, 'altname');
    	}
    	catch(err) {
    		employee = '';
    	}
    
    }
    nlapiLogExecution('debug', 'requestor', 'maybe')
    var amount = rec.getFieldValue('custrecord_gal_cr_amount');
    var commentField = rec.getFieldValue('custrecord_gal_cr_comment');
    if(commentField == null) {
    	commentField = '';
    }
    nlapiLogExecution('debug', 'rest of fields', 'maybe')
    var approver = '';
    var approverid = rec.getFieldValue('custrecord_gal_cr_approver');
    if(approverid != '' || approverid != null) {
    	try{
    	    approver = nlapiLookupField('employee', approverid, 'altname');
    	}
    	catch(err) {
    		approver = '';
    	}
 
    }
    nlapiLogExecution('debug', 'approver', 'maybe')
    var emp_signature = rec.getFieldValue('custrecord_gal_cr_emp_sign');
    if(emp_signature == null) {
    	emp_signature = '';
    }
    nlapiLogExecution('debug', 'emp_signature', 'maybe')
    
    var creator = '';
    var creatorid = rec.getFieldValue('custrecord_gal_creator');
    if(creatorid != null || creatorid != "") {
    	try{
    		creator = nlapiLookupField('employee', creatorid, 'altname');
    	}
    	catch(err) {
    		creator = '';
    	}
    
       }
  
    nlapiLogExecution('debug', 'creator', 'maybe');
    
    var status = rec.getFieldText('custrecord_gal_cr_status');
    if(status == null) {
    	status = '';
    }

    
    nlapiLogExecution('debug', 'built template', 'built template');
    
	var pattern = /_tran_num|_tran_id|_doc_name|_created|_employee|_amount|_comment|_approve_signature|_emp_signature|_creator|_status/ig;
	
	
	//Payee Information
	var _tran_num = tranNum;
	var _doc_name = docName;
	var _created = created;
	var _employee = employee;
	var _amount = formatNumber(amount);
	var _comment = commentField;
	var _approve_signature = approver;
	var _emp_signature = emp_signature;
	var _creator = creator;
	var _status = status;
	

	
	
	var mapObj = {
			_tran_num : _tran_num,
			_doc_name : _doc_name,
			_created : _created,
			_employee : _employee,
			_amount : _amount,
			_comment : _comment,
			_approve_signature : _approve_signature,
			_emp_signature : _emp_signature,
			_creator : _creator,
			_status : _status

};
	

		var str = temp.replace(/\{\{(.*?)\}\}/g, function(i, match) {
		    return mapObj[match];
		});


		//must clean all amps
		var clean = str.replaceAll("&", "&amp;");
	
	
		 nlapiLogExecution('debug', 'about to download', 'about to download');
    downloadDataPDF(clean, response,tranNum)
//    nlapiSetRedirectURL('RECORD', 'customrecord_cash_request', id, false);
}



function downloadDataPDF(data, response, tranNum) {
	
	var file = nlapiXMLToPDF( data );
//	response.setEncoding('windows-1252');
	response.setContentType('PDF','Cash Request: #'+tranNum+'.pdf');
	response.write( file.getValue() ); 

}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
