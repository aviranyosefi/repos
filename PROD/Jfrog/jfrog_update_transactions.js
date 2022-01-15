function update(){
    
        var searchElements = nlapiLoadSearch(null, 'customsearch2689');
        var s = [];
        var allResults = [];
        var searchid = 0;
        var resultset = searchElements.runSearch();
        var rs;

        do {
            var resultslice = resultset.getResults(searchid, searchid+ 1000);
			nlapiLogExecution('DEBUG', 'resultslice.length', resultslice.length); 
            for (rs in resultslice) {

                s.push({
						id : resultslice[rs].id,
						type : resultslice[rs].type

					});
                searchid++;
            }
        } while (resultslice.length >= 1000);

        nlapiLogExecution('DEBUG', 's.length: ' + s.length, JSON.stringify(s));
		var context = nlapiGetContext();
	   for (var i=0;i<s.length;i++){
		   try{
			   
			      if (context.getRemainingUsage() < 150) {
                        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                    }
				 
				 //nlapiDeleteRecord('customrecord_ib_service_type', s[i].id)
				 var rec =nlapiLoadRecord('invoice',s[i].id);
				 rec.setFieldValue('custbody_ilo_org_printed' , 'F');				 
				 nlapiSubmitRecord(rec);
		
			  
			 }catch(e){
			   
				  nlapiLogExecution('DEBUG', 'error id: ' +  s[i].id, e);
					}
		   
				
		   }
	} 
				
		   
			
	 
