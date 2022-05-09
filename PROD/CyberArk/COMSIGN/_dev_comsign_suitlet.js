/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/log', 'N/ui/serverWidget', 'N/search', './_dev_comsign_core', 'N/record'],

function(file, logger, ui, search, core, record) {
   
    onRequest =function(context) {
    	var request = context.request;
    	// Get request
    	if(request.method === "GET"){

    		var tranRecId = context.request.parameters['tranId'];
          	var tranRecType = context.request.parameters['tranType']
    		var financialOwner = context.request.parameters['employeeID'] // '3183'//Lior Kabeda '208593' //Hila Shumeli

    		
    		
    		var signDocument = signTransaction(tranRecId, financialOwner, null)

    		

				var id = record.attach({
				 record: {
				 type: 'file',
				 id: signDocument
				 },
				 to: {
				 type: tranRecType,
				 id: tranRecId
				 }
				});
    		
			record.submitFields({
				type: tranRecType,
				id: tranRecId,
				values: {
					custbody_cbr_comsign_print_original : 'F'
				}
			});

	context.response.write(JSON.stringify(signDocument));
    	}else{

    	}
    };

    return {
        onRequest: onRequest
    };
    
});


