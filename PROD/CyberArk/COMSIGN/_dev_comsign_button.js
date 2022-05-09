/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['require', 'N/ui/serverWidget', 'N/log','N/record','N/error', 'N/search', 'N/record'],
function(require, serverWidget, logger, record, error, search, record ) {
    function beforeLoad(context) {
    	
    	var recType = context.newRecord.type
    	
    	var currentRecord = context.newRecord;
    	
    	var checkSubsid = currentRecord.getValue({
    		fieldId : 'subsidiary'
    	})

    	
  if(context.type == 'create' && recType == 'creditmemo' && checkSubsid == '22') {
	  
	  logger.debug({
		  title: 'israeli new credit memo',
		  details: 'check checkSubsid : '+checkSubsid
	  })
	  
	  currentRecord.setValue({
          fieldId: "custbody_cbr_comsign_doc_record",
          value: "",
      });
	  currentRecord.setValue({
          fieldId: "custbody_cbr_comsign_doc_signed",
          value: "F"
      });
	currentRecord.setValue({
	    fieldId: "custbody_cbr_comsign_print_original",
	    value: "F"
	});
	  
  }
    		
      if(context.type == "view") {
    	  
    	  var currRecID = context.request.parameters.id
    	  
			var transactionData = search.lookupFields({
				type: search.Type.TRANSACTION,
				id: currRecID,
				columns: [
					'custbody_cbr_comsign_doc_signed',
					'subsidiary.country'
				]
			});
    	  
    	  var checkSubsidCountry = transactionData['subsidiary.country'][0].value
    	  var checkIfSigned = transactionData['custbody_cbr_comsign_doc_signed']
    	  logger.debug({
    		  title: 'search results',
    		  details: 'check if signed : '+checkIfSigned + ' ---------- ' + 'subsidcountry : '+checkSubsidCountry
    	  })
    	  
    	 if(checkSubsidCountry == 'IL') {
    		 
    	        context.form.clientScriptFileId = 542668;
    	        var btn = context.form.addButton({
    	           id: 'custpage_signbtn',
    	           label: 'Digitally Sign Invoice',
    	           functionName: 'callSigningSuitlet'
    	         });
    	        if(checkIfSigned == true) {
    	        	btn.isDisabled = true;
    	        }  
    	 } 
    	  
      }

    }
    function beforeSubmit(context) {
    	
        if(context.type == "edit") {
      	  var currRecID = context.newRecord.id
      	  
  			var transactionData = search.lookupFields({
  				type: search.Type.TRANSACTION,
  				id: currRecID,
  				columns: [
  					'custbody_cbr_comsign_doc_signed',
  					'subsidiary.country'
  				]
  			});
    	  
    	  var checkSubsidCountry = transactionData['subsidiary.country'][0].value
    	  var checkIfSigned = transactionData['custbody_cbr_comsign_doc_signed']
   	  
    	 if(checkSubsidCountry == 'IL') {
    	        if(checkIfSigned == true) {
    	        	
    	        	var errorText = 'This document has been digitally signed and cannot be edited.';
    	        	var msg = '<style>' 
    	              + '.text {display: none;}' 
    	              + '.bglt td:first-child:not(.textboldnolink):after {'
    	              + 'color:black;'
    	              + 'content: \''
    	              +  errorText 
    	              + '\'}' 
    	              + '.textboldnolink {display: none;}' 
    	              + '</style>';
    	          err = error.create({
    	          name: 'NO_JSON',
    	          message: msg,
    	          notifyOff: true
    	      });
    	        	
    	        	throw err;
    	        	
    	        }
   	        
    	 } 
        }
    	
    }
    

    
    
    return {
      beforeLoad: beforeLoad,
      beforeSubmit: beforeSubmit
    };
  }
);