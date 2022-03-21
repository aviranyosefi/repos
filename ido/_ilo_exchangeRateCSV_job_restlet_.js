/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Nov 2016     idor
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet_ExchangeRateCSVjob(dataIn) {
	
	
	var primaryFile = nlapiLoadFile(datain.fileId);
	var job = nlapiCreateCSVImport();
	job.setMapping('CUSTIMPORT_ilo_exRate_mapping'); // Set the mapping

	// Set File
	job.setPrimaryFile(primaryFile.getValue()); // Fetches the content of the file and sets it.
	
	nlapiSubmitCSVImport(job); // We are done
	return {};
}
