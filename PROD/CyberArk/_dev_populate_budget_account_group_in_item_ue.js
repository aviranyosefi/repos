var budgetArr = BAG_Search()




function Populate_budget_account_group_in_item() {

    var recType = nlapiGetRecordType();
    if (recType == 'vendorbill') {
    } // if(recType == 'vendorbill')
    else {
        var count = nlapiGetLineItemCount('expense')
        if (count) {
            for (var i = 1; i <= count; i++) {

                var category = nlapiGetLineItemValue('expense', 'category', i)
                if (category != null && category != "" && id != category) {
                    var rec = nlapiLoadRecord('expensecategory', category)
                    var id = rec.getFieldValue('expenseacct')
                    if (id != null && id != "" && id != undefined) {

                        var Budget = budgetArr[id].budget
                        if (Budget != null) {

                            nlapiSetLineItemValue('expense', 'custcol_cbr_budget_account_group', i, Budget)

                        }
                    }

                } // if(category != null && category != "" && id != category  ) - end

                //var customer = nlapiGetLineItemValue('expense', 'customer', i)
                //if (customer != null && customer != "" && customer != undefined) {
                //    var projectNamae = nlapiLookupField('job', customer, 'altname')
                //    if (projectNamae == 'N/A') {
                //        nlapiSetLineItemValue('expense', 'customer', i, '')
                //    }
                //}
            } // for(var i=1 ; i<= count ; i++) - end
        }
    }
}


function afterSubmit(type){	
    nlapiLogExecution('DEBUG', 'type', type);
    if (type != 'delete') {
			var recType = nlapiGetRecordType();
			if(recType == 'vendorbill'){
				var rec=nlapiLoadRecord('vendorbill',nlapiGetRecordId())		
				var count =  rec.getLineItemCount('expense')
				if(count > 0){
					for(var i=1 ; i<= count ; i++){																					
							var customer = rec.getLineItemValue( 'expense' , 'customer' , i )
							if ( customer != null && customer != "" && customer != undefined){
								var projectNamae =  nlapiLookupField ( 'job' , customer , 'altname'  )
								if (projectNamae == 'N/A'){
									 nlapiLogExecution('DEBUG', 'Start getActual' , projectNamae);   
									rec.setLineItemValue ( 'expense' , 'customer' , i ,'' )
								}
							}																				
					} // for(var i=1 ; i<= count ; i++) - end
				}	
				nlapiSubmitRecord(rec)				
            } // if(recType == 'vendorbill')	
            else {
                var rec = nlapiLoadRecord('expensereport', nlapiGetRecordId())
                var count = rec.getLineItemCount('expense')
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        //var category = rec.getLineItemValue('expense', 'category', i)
                        //if (category != null && category != "" && id != category) {
                        //    var expensRec = nlapiLoadRecord('expensecategory', category)
                        //    var id = expensRec.getFieldValue('expenseacct')
                        //    if (id != null && id != "" && id != undefined) {

                        //        var Budget = budgetArr[id].budget
                        //        if (Budget != null) {

                        //            rec.setLineItemValue('expense', 'custcol_cbr_budget_account_group', i, Budget)
                        //        }
                        //    }

                        //} // if(category != null && category != "" && id != category  ) - end

                        var customer = rec.getLineItemValue('expense', 'customer', i)
                        if (customer != null && customer != "" && customer != undefined) {
                            var projectNamae = nlapiLookupField('job', customer, 'altname')
                            if (projectNamae == 'N/A') {
                                rec.setLineItemValue('expense', 'customer', i, '')
                            }
                        }
                    } // for(var i=1 ; i<= count ; i++) - end
                }
                nlapiSubmitRecord(rec)	
        }
    }
}


function BAG_Search(){
	
	
        var columnsInvoice = new Array();
        columnsInvoice[0] = new nlobjSearchColumn('custrecord_cbr_budget_account_group')
      
 
 
        var search = nlapiCreateSearch('account', null, columnsInvoice);
        var runSearch = search.runSearch();
        var s = [];
        var searchid = 0;
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);
 
    
	var  budgetArr = [];
    if (s != null) {
 
        for (var i = 0; i < s.length; i++) {
 
            
            budgetArr[s[i].id] = {
				
				budget: s[i].getValue('custrecord_cbr_budget_account_group'),
				
			}
                
 
        }
       
    }
 
 
 return budgetArr;
    
	
}


