/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 May 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function download_folder(request, response){
	
	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Backup SuiteScripts');
		
		 var fileLink = form.addField('custpage_new_req_link','inlinehtml', null, null, null);
		 fileLink.setDefaultValue('<font size="2"><b>Click  <a href="https://system.eu2.netsuite.com/core/media/downloadfolder.nl?id=-15&_xt=&_xd=T&e=T">here</a> to download.</b>');


		response.writePage(form);

	}
};

