/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Feb 2019     idor
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
function expReport_zero_out(type){

	var rec = nlapiLoadRecord('expensereport', nlapiGetRecordId());
	var subsid = rec.getFieldValue('subsidiary');
	var toRun = false
	var isApproved = rec.getFieldValue('accountingapproval');
	var lineCount = rec.getLineItemCount('expense');
	var hasBeenProcessed = false;
	
	var checkifToRun = nlapiLookupField('subsidiary', subsid, 'custrecord_expense_rep_solution_excep')
	if(checkifToRun == 'F') { // if checkbox is false - run the script
		toRun = true;
	}
	
	
	if(toRun == true) {
		
		for(var i = 0; i<lineCount; i++) {
			
			var checkItem = nlapiGetLineItemText('expense', 'category', i+1)
			if(checkItem === 'Closing Expense Report By Salary') {
				hasBeenProcessed = true;
			}

		}
		
		if(hasBeenProcessed == false && isApproved == 'T') {
			
			
			try{
				
			
			var totalReimbursable = parseFloat(rec.getFieldValue('reimbursable'));
			var negativeReimbursable = pos_to_neg(totalReimbursable)
			var returnAmt = rec.getFieldValue('custbody_return_amount_expensify_polic')
			nlapiLogExecution('debug', 'totalReimbursable', negativeReimbursable)
			
			rec.selectNewLineItem('expense');
			rec.setCurrentLineItemValue('expense', 'category', 19); // Closing Expense Report By Salary
			rec.setCurrentLineItemValue('expense', 'currency', 1); //USD
			rec.setCurrentLineItemValue('expense', 'amount', negativeReimbursable); //USD
			rec.commitLineItem('expense');
			
			if(returnAmt != null ) {
				var imposedExRate = parseFloat(returnAmt) / totalReimbursable
				rec.setLineItemValue('accountingbookdetail', 'exchangerate', 1, imposedExRate.toFixed(2))
			}
			
	        
	       nlapiSubmitRecord(rec);
			}catch(err){
				nlapiLogExecution('debug', 'err', err)
			}
		}
	
		
		
		
	}


	
}

function pos_to_neg(num)
{
return -Math.abs(num);
}



