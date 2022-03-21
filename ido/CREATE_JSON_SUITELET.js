/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Mar 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function make_json(request, response){
	
	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('JSONIFY');
		
		var fileField = form.addField('file', 'file', 'Select File');
		var subsidSelect = form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');

	   
		fileField.setMandatory(true);
		subsidSelect.setMandatory(true);

		form.addSubmitButton();
		form.addResetButton();
		response.writePage(form);
		
		
		
	}
	else{
		
		var jsonObj = [];
		
		var file = request.getFile("file");
		file.setEncoding('UTF-8');
		var fileContent = file.getValue();

       var arrLines = fileContent.split(/\r?\n/)
       
       for(var i = 0; i<arrLines.length; i++) {
    	   
    	   var curr = arrLines[i].split(",");;
    	   var internalid = curr[0];
    	   var enddate = curr[1];
    	   
    	   
    	   jsonObj.push({
    		 internalid : internalid,  
    		 enddate : enddate,  
    	   })
    	   
       }
       
       response.write(JSON.stringify(jsonObj))
	}

}
