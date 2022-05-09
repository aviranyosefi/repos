/**
* @NApiVersion 2.x
* @NScriptType ClientScript
*/
define(['N/record','N/currentRecord','N/log', 'N/runtime', 'N/url', 'N/http', 'N/https', 'N/ui/message'],
function (record, currentRecord, log, runtime, url, http, https, message) {

// Scripts have to implement at least one action

function pageInit(context) {}
function callSigningSuitlet(context) {
	
	try{
		

	var employeeID = runtime.getCurrentUser().id;
	var tranId = currentRecord.get().id
    var tranType = currentRecord.get().type

	
	 var signingInProcess = message.create({
		 title: "Signing Document\n",
		 message: 'Please wait while this document is currently being signed...',
		 type: message.Type.INFORMATION
			 });
	signingInProcess.show() 
	
	var bodyDiv = document.getElementById('div__body');
	bodyDiv.style.opacity = '0.4'
	bodyDiv.style.position = 'absolute'
	bodyDiv.style.width = '100%'
	bodyDiv.style.height = '100%'
	bodyDiv.style.zIndex = '998'
		
	var iDiv = document.createElement('div');
	iDiv.id = 'comsignLoading'
	iDiv.style.position = 'absolute'
	iDiv.style.display = 'inline-block'
	iDiv.style.width = '200px'
	iDiv.style.height = '200px'
	iDiv.style.margin = 'auto';
	iDiv.style.left = '40%';
	iDiv.style.top = '200px'
	iDiv.style.zIndex = '999'
	
	var pageDiv =  document.getElementById('pageContainer');
	pageDiv.appendChild(iDiv);

	console.log('button clicked')


	setTimeout(function(){
		
		try{
			

		
		//call suitelet
		var suiteUrl = url.resolveScript({
		scriptId: 'customscript_dev_comsign_suitelet',
		deploymentId: 'customdeploy_dev_comsign_suitelet_dep',
		returnExternalUrl: false,
		params: {'employeeID':employeeID,
				'tranId':tranId,
                 'tranType' : tranType
					}
		});

			var response = https.get({
				url: suiteUrl
				});
	     
		var signedDocID = response.body
		
		
		signingInProcess.hide() 

		
		var signComplete = message.create({
		 title: "Document Signed\n",
		 message: 'This document has been succesfully signed via ComSign.\nThe signed document can be viewed in the Communications Tab under `Files`.',
		 type: message.Type.CONFIRMATION
			 });
		signComplete.show(); 
		var bodyDiv = document.getElementById('div__body');
		bodyDiv.style.opacity = '1'
		bodyDiv.style.position = ''
		bodyDiv.style.width = ''
		bodyDiv.style.height = ''
		bodyDiv.style.zIndex = ''
			
			
			var element = document.getElementById("comsignLoading");
			element.parentNode.removeChild(element);
		try {
			//undocumented netsuite native function
			previewMedia(signedDocID,false,true)	
		}catch(err) {
			
			console.log(err)
		}
		
	        console.log('Document Signed');
	  //      bodyDiv.style.opacity = '1'
		
		
		}catch(err) {
			
			console.log(err)
			
		var bodyDiv = document.getElementById('div__body');
		bodyDiv.style.opacity = '1'
		bodyDiv.style.position = ''
		bodyDiv.style.width = ''
		bodyDiv.style.height = ''
		bodyDiv.style.zIndex = ''
			
			
		var element = document.getElementById("comsignLoading");
		element.parentNode.removeChild(element);
			
				signingInProcess.hide() 	
			var errorObj = JSON.parse(err.cause.message)
			
			 var myMsg = message.create({
			 title: "ComSign Error\n",
			 message: errorObj.message,
			 type: message.Type.ERROR
				 });
			 	myMsg.show({
				 duration: 10000
				 }); 
	
		}
	        
	        
	
	}, 400);
	
	

	}catch(err) {
		
		console.log(err)
		
		var bodyDiv = document.getElementById('div__body');
		bodyDiv.style.opacity = '1'
			signingInProcess.hide() 	
		var errorObj = JSON.parse(err.cause.message)
		
		 var myMsg = message.create({
		 title: "ComSign Error\n",
		 message: errorObj.message,
		 type: message.Type.ERROR
			 });
		 	myMsg.show({
			 duration: 10000
			 }); 

		
	}
    }

return {
pageInit: pageInit,
callSigningSuitlet: callSigningSuitlet
};
});
