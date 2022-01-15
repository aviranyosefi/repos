
function setCorrectDepartment(type) {

var recType = nlapiGetRecordType();
var recID = nlapiGetRecordId();
	
if(recType == 'expensereport') {
	
	var rec = nlapiLoadRecord('expensereport', recID)
	
	var checkURLfield = rec.getFieldValue('custbody_createdfrom_expensify')
	var checkStatus = rec.getFieldValue('status')
	
    if ((checkStatus == 'In Progress' || checkStatus == 'Pending Accounting Approval' || checkStatus == 'Paid In Full') && checkURLfield != null) {
		
	    var allExpenseCategories = getAllExpCategories();
	    var accDeptResults = getAll_Dept_Accounts(recType);

	    var lineCount = rec.getLineItemCount('expense');
	
	    var lineObj = [];
	    var objReady = false;
	
	    for(var i = 0; i<lineCount; i++) {
		
		    lineObj.push({
			
			    lineNum : i+1,
			    expCategory : rec.getLineItemValue('expense', 'category', i+1),
			    expAccount : '',
			    department : ''
		    })
	    }
	
	    if(lineObj != []) {

			    lineObj.forEach(function(line) {
				
				    for(var x = 0; x<allExpenseCategories.length; x++) {
					
					    if(line.expCategory == allExpenseCategories[x].internalID) {

						    line.expAccount = allExpenseCategories[x].expAccount
					    }

				    }
				
								    for(var y = 0; y<accDeptResults.length; y++) {
					
					    if(line.expAccount == accDeptResults[y].account) {

						    line.department = accDeptResults[y].department
					    }

				    }
  

		    });

		    objReady = true;
	
	    }
	
	    if(objReady) {
		
		    try{

					    lineObj.forEach(function(objLine) {
						    if(objLine.department != '') {
						
					    rec.setLineItemValue('expense', 'department', objLine.lineNum, objLine.department);
					    }
					
					    });

				    }catch(err) {
					    nlapiLogExecution('error', 'err on populate department', err)
					    return true;
				    }	
			    }// end of if(objReady)
			
		    try{
		        nlapiSubmitRecord(rec);
		    }catch(err){
			    nlapiLogExecution('error', 'err on submit', err)
			    return true;
		    }
			
	}// end of if(checkStatus == 'In Progress' && checkURLfield != null)
}// end of if(recType == 'expensereport') 
			
		
if (recType == 'journalentry') {
	
			var rec = nlapiLoadRecord('journalentry', recID);
			
			var isFromAmortization = rec.getFieldValue('isfromamortization');
			var isFromExpAllocation = rec.getFieldValue('isfromexpensealloc');
			var isFromRevRec = rec.getFieldValue('isfromrevrec');
			
			var checkSource = rec.getFieldValue('source')


		if(isFromAmortization == 'T' || isFromExpAllocation == 'T' || isFromRevRec == 'T') { //checking whether or not this journal entry was created automatically
			
		
		
			var accDeptResults = getAll_Dept_Accounts(recType);
			var lineCount = rec.getLineItemCount('line');

			var lineObj = [];
			var objReady = false;
	
			for(var i = 0; i<lineCount; i++) {
				
				lineObj.push({
					
					lineNum : i+1,
					lineAccount : rec.getLineItemValue('line', 'account', i+1),
					department : ''
				})
			}
			
				if(lineObj != []) {

			lineObj.forEach(function(line) {
				
			
					for(var y = 0; y<accDeptResults.length; y++) {
					
					if(line.lineAccount == accDeptResults[y].account) {

						line.department = accDeptResults[y].department
					}

				}
  

		});

		objReady = true;
	
	}
	
		if(objReady) {
		
		try{

					lineObj.forEach(function(objLine) {
						if(objLine.department != '') {
						
					rec.setLineItemValue('line', 'department', objLine.lineNum, objLine.department);
					}
					
					});

				}catch(err) {
					nlapiLogExecution('error', 'err on populate department', err)
					return true;
				}	
			}// end of if(objReady)
			
					try{
		nlapiSubmitRecord(rec, {disabletriggers:true, enablesourcing:false, ignoremandatoryfields:true});
		}catch(err){
			nlapiLogExecution('error', 'err on submit', err)
			return true;
		}	
	
	
	} //end of if(isFromAmortization == 'T' || isFromExpAllocation == 'T' || isFromRevRec == 'T')
	
} //end of if(recType == 'journalentry')
	

if(recType == 'vendorbill') {
	
		var rec = nlapiLoadRecord('vendorbill', recID)
		var checkStatus = rec.getFieldValue('status');
		var checkDraftCheckbox = rec.getFieldValue('custbody_nc_po_draft');
		var checkCreatedFromPO = rec.getFieldValue('custbody_nc_vbtol_is_bill_from_po');
	
	
	if(checkDraftCheckbox == 'F' || checkCreatedFromPO == 'T') { //draft check box is un-ticked the moment user clicks 'submit for approval' / checkCreatedFromPO checks if bill was created through PO
		
			var accDeptResults = getAll_Dept_Accounts(recType);
			var itemLineCount = rec.getLineItemCount('item');
			var expenseLineCount = rec.getLineItemCount('expense');

			if(itemLineCount != 0) {
				
			var lineObj = [];
			var objReady = false;
	
			for(var i = 0; i<itemLineCount; i++) {
				
				lineObj.push({
					
					lineNum : i+1,
					itemAccount : nlapiLookupField('item', rec.getLineItemValue('item', 'item', i+1), 'expenseaccount', null),
					department : ''
				})
			}
			
				if(lineObj != []) {

			lineObj.forEach(function(line) {
				
			
					for(var y = 0; y<accDeptResults.length; y++) {
					
					if(line.itemAccount == accDeptResults[y].account) {

						line.department = accDeptResults[y].department
					}

				}
  

		});

		objReady = true;
	
	}
	
		if(objReady) {
		
		try{

					lineObj.forEach(function(objLine) {
						if(objLine.department != '') {
						
					rec.setLineItemValue('item', 'department', objLine.lineNum, objLine.department);
					}
					
					});

				}catch(err) {
					nlapiLogExecution('error', 'err on populate department', err)
					return true;
				}	
			}// end of if(objReady)
			
					try{
		nlapiSubmitRecord(rec, {disabletriggers:true, enablesourcing:false, ignoremandatoryfields:true});
		}catch(err){
			nlapiLogExecution('error', 'err on submit', err)
			return true;
		}

		}//end of if if(itemLineCount != 0)
			
					if(expenseLineCount != 0) {
			var lineObj = [];
			var objReady = false;
	
			for(var i = 0; i<expenseLineCount; i++) {
				
				lineObj.push({
					
					lineNum : i+1,
					expenseAccount : rec.getLineItemValue('expense', 'account', i+1),
					department : ''
				})
			}
			
				if(lineObj != []) {

			lineObj.forEach(function(line) {
				
			
					for(var y = 0; y<accDeptResults.length; y++) {
					
					if(line.expenseAccount == accDeptResults[y].account) {

						line.department = accDeptResults[y].department
					}

				}
  

		});

		objReady = true;
	
	}
	
		if(objReady) {
		
		try{

					lineObj.forEach(function(objLine) {
						if(objLine.department != '') {
						
					rec.setLineItemValue('expense', 'department', objLine.lineNum, objLine.department);
					}
					
					});

				}catch(err) {
					nlapiLogExecution('error', 'err on populate department', err)
					return true;
				}	
			}// end of if(objReady)
			
					try{
		nlapiSubmitRecord(rec, {disabletriggers:true, enablesourcing:false, ignoremandatoryfields:true});
		}catch(err){
			nlapiLogExecution('error', 'err on submit', err)
			return true;
		}

		}//end of if if(itemLineCount != 0)

	} //end of if(checkDraftCheckbox == 'F')
} //end of if(recType == 'vendorbill') 
	
if(recType == 'invoice') {
	
	
			var rec = nlapiLoadRecord('invoice', recID)

		
			var accDeptResults = getAll_Dept_Accounts(recType);
			var lineCount = rec.getLineItemCount('item');

			var lineObj = [];
			var objReady = false;
	
			for(var i = 0; i<lineCount; i++) {
				
				lineObj.push({
					
					lineNum : i+1,
					itemAccount : nlapiLookupField('item', rec.getLineItemValue('item', 'item', i+1), 'incomeaccount', null),
					department : ''
				})
			}
			
				if(lineObj != []) {

			lineObj.forEach(function(line) {
				
			
					for(var y = 0; y<accDeptResults.length; y++) {
					
					if(line.itemAccount == accDeptResults[y].account) {

						line.department = accDeptResults[y].department
					}

				}
  

		});

		objReady = true;
	
	}
	
		if(objReady) {
		
		try{

					lineObj.forEach(function(objLine) {
						if(objLine.department != '') {
						
					rec.setLineItemValue('item', 'department', objLine.lineNum, objLine.department);
					}
					
					});

				}catch(err) {
					nlapiLogExecution('error', 'err on populate department', err)
					return true;
				}	
			}// end of if(objReady)
			
					try{
		nlapiSubmitRecord(rec, {disabletriggers:true, enablesourcing:false, ignoremandatoryfields:true});
		}catch(err){
			nlapiLogExecution('error', 'err on submit', err)
			return true;
		}
	
}//end of if(recType == 'invoice') 
		
		
		
		
		}


function getAllExpCategories() {
	
	var res = [];
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('name');
	columns[1] = new nlobjSearchColumn('account');
	columns[2] = new nlobjSearchColumn('internalid');

	//Create the saved search
	var search = nlapiCreateSearch('expensecategory', null, columns);
	var runSearch = search.runSearch();
	var results = runSearch.getResults(0, 1000);
	
	if(results != null) {
		
		results.forEach(function(element) {
  
	res.push({
				name: element.getValue('name'),
				expAccount : element.getValue('account'),
				internalID : element.getValue('internalid')
		})
		});
	}
	return res;
}

function getAll_Dept_Accounts(recType) {
	
    var savedSearch = nlapiLoadSearch(null, 'customsearch_cbr_acc_dpt_cntrl_search');
	//filter results by record type
	if(recType == 'expensereport') {
		savedSearch.addFilter(new nlobjSearchFilter('custrecord_cbr_acc_dpt_apply_er', null, 'is', 'T'));
	}
		if(recType == 'journalentry') {
		savedSearch.addFilter(new nlobjSearchFilter('custrecord_cbr_acc_dpt_apply_je', null, 'is', 'T'));
	}
			if(recType == 'vendorbill') {
		savedSearch.addFilter(new nlobjSearchFilter('custrecord_cbr_acc_dpt_apply_vb', null, 'is', 'T'));
	}
				if(recType == 'invoice') {
		savedSearch.addFilter(new nlobjSearchFilter('custrecord_cbr_acc_dpt_apply_si', null, 'is', 'T'));
	}
	
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
	var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

	if(returnSearchResults != null) {
	returnSearchResults.forEach(function(element) {

			results.push({
		
		account: element.getValue('custrecord_cbr_acc_dpt_account'),
		department : element.getValue('custrecord_cbr_acc_dpt_department'),
        expensereport : element.getValue('custrecord_cbr_acc_dpt_apply_er'),
		vendorbill : element.getValue('custrecord_cbr_acc_dpt_apply_vb'),
		journalentry : element.getValue('custrecord_cbr_acc_dpt_apply_je'),
		salesinvoice : element.getValue('custrecord_cbr_acc_dpt_apply_si')


		})
		});

	}
    return results;
}