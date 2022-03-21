/**c
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Nov 2016     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
var contents;
var a = a;
function jfrog_budget_exportCSV(request, response){
	
    if (request.getMethod() == 'GET') {
        a = a;
    }
    else {
    	

    var rec = nlapiSearchRecord('customrecord_ilo_budget_control_record', null, null, null);    // Get the search result
      
       
       //Get all values of search result and append all those values in an another variable 'contents'
     contents = rec;
 
        //Create a CSV file
        var objFile = nlapiCreateFile('CSV_File.csv', 'CSV', contents);
     
        downloadData(objFile, response);

}
    
}

function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('jfrog_budget.csv', 'CSV');
    // write response to the client
    response.write(data);
};
