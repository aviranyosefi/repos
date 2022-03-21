/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Oct 2016     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function generate_shaam_file(request, response) {

    var currentContext = nlapiGetContext();
    //Create the form and add fields to it 
    var form = nlapiCreateForm("Generate Shaam Out File");
    form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');
    form.addField('currency', 'select', 'Currency', 'CURRENCY');

    form.addSubmitButton('Generate File');

    if (request.getMethod() == 'GET') {
        response.writePage(form);
    }
    else {


        
        var Currency = request.getParameterValues('currency');
        var Subsidiary = request.getParameterValues('subsidiary');

        var headers = request.getAllHeaders();
        var body = request.getBody();

        var all = request.getAllParameters();

        }
        response.write(JSON.stringify(Currency));
	//response.write(all.inpt_currency);
}


