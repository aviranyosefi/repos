/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Aug 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	
	var rec = nlapiLoadRecord('customer', 1002);
	
	var taxPayerID = rec.getFieldValue('custentityil_tax_payer_id');
	
	
	var str = 'encrypted : '+taxPayerID + '\n\n ' + 'decrypted : '+ decryptValue(taxPayerID)
	response.write(str)

}
