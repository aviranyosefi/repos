function contact(){
    
    var searchElements = nlapiLoadSearch(null, 'customsearch1470');
        var s = [];
        var searchid = 0;
        var resultset = searchElements.runSearch();
        var rs;

        //var resultslice = resultset.getResults(0, 1000);
        //for (rs in resultslice) {
        //    s.push(resultslice[rs])
        //    searchid++;
        //}
        do {
            var resultslice = resultset.getResults(searchid, searchid+ 1000);
            for (rs in resultslice) {
                s.push(resultslice[rs])
                searchid++;
            }
        } while (resultslice.length >= 1000);
         nlapiLogExecution('DEBUG', 's.length', s.length);
    var context = nlapiGetContext();
    for (var i = 0; i < s.length; i++){
		   try{			   
			      if (context.getRemainingUsage() < 150) {
                      nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
                      var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                  }
               var rec = nlapiLoadRecord('customer', s[i].getValue('company'));
               var count = rec.getLineItemCount('contactroles');
				 for(var m=1 ; m<=count;m++){					
                     var giveaccess = rec.getLineItemValue('contactroles', 'giveaccess', m)
                     var contact = rec.getLineItemValue('contactroles', 'contact', m)
                     if (giveaccess == 'F' && contact == s[i].id) {
                         rec.setLineItemValue('contactroles', 'giveaccess', m, 'T')
                         rec.setLineItemValue('contactroles', 'sendemail', m, 'T')    
                         nlapiSubmitRecord(rec);
                         break;
                     }											 
               }         
			 }catch(e){	   
				  nlapiLogExecution('DEBUG', 'id: ' +  s[i].id, e);
					}		   			
		   }
} 

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
				
		   
			
	 
