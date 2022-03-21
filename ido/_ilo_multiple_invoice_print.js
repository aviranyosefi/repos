/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Dec 2016     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function multiple_print_suitelet(request, response){
	
	
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Print Multiple Invoices');
		form.addSubmitButton();
		response.writePage(form);

	} else {
		var xml;

		function multiplePrint(invoiceArr) {
			//get full template and convert to string
				var temp = nlapiLoadFile('2048').getValue();
				var a = temp.toString();
			//get head tag 
				var first_headTag = a.indexOf("head") -1 ; 
			    var end_headTag = a.indexOf("/head") +6 ; 
				var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
			//get table tag (actual template of invoice)
				var first_tableTag = a.indexOf("cellpadding") -18 ;
				var end_tableTag = a.indexOf("/body") -6 ;
				var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);

				
			//concatenate all parts of xml file	
				xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
				xml += "<pdf>";
									
				xml += head_tag + '<body>';
						
				var invoices = invoiceArr;                      

				for(var i = 0; i < invoices.length; i++){
					try
					{
				var invoice = nlapiLoadRecord('invoice', invoices[i]);
				var renderer = nlapiCreateTemplateRenderer();
				renderer.setTemplate(inv_template);
				renderer.addRecord('record', invoice);
				xml = xml +  renderer.renderToString();
				if(i < invoices.length - 1){
				xml = xml + '<pbr/>';
				} 
				
				var context = nlapiGetContext();
				var usageRemaining = context.getRemainingUsage();
				if(usageRemaining < 50) {
					alert('There are too many results for this search, therefore some invoices have been ommitted. For a more precise result, please narrow your date range');
					break;
				}
					}
					catch(e) {
						nlapiLogExecution('ERROR', 'error pdfbuild - invoice id:'+invoices[i]+ ' ', e);
					}
				} 
				
				xml = xml += '</body></pdf>';

			//convert xml file back to pdf
				var pdf = nlapiXMLToPDF(xml);
			
			//save pdf in filecabinet
				var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
				multipleINV_pdf.setFolder('-15');
		        var printFileID = nlapiSubmitFile(multipleINV_pdf);
		         mainPDF = nlapiLoadFile(printFileID).getURL(); //get url of pdf from filecabinet	 

			} 
			
			multiplePrint(['1727']);
	};
	response.setContentType('PDF', 'Print.pdf ', 'inline');
	// write response to the client
	
	//var str = JSON.stringify(head);
	//response.write(xml);
};


