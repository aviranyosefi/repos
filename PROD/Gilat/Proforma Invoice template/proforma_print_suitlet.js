function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    var record = nlapiLoadRecord('estimate', id);
    var currency = record.getFieldValue('currency');
    var subsidiary = record.getFieldValue('subsidiary');
    var data = getAccount(subsidiary, currency);
    var subRec = nlapiLoadRecord('subsidiary', subsidiary)
    var address = subRec.getFieldValue('mainaddress_text');
    //var email = subRec.getFieldValue('email');
    var renderer = nlapiCreateTemplateRenderer(); 
    var template = nlapiLoadFile(4122); // prod 4122 
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    xml = xml.replace('*a*d', address);
    xml = xml.replace('data', data);
    nlapiLogExecution('debug', 'xml', xml);
    var pdf = nlapiXMLToPDF(xml);
    //nlapiLogExecution('debug', 'pdf', pdf);
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}


function getAccount(subsidiary, currency) {

    debugger
    try { 
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('custrecord_account_number');
        columns[1] = new nlobjSearchColumn('custrecord_account_bank_name');
        columns[2] = new nlobjSearchColumn('custrecord_swift');
        columns[3] = new nlobjSearchColumn('custrecord_via');
        columns[4] = new nlobjSearchColumn('custrecord_bic_aba');
        columns[5] = new nlobjSearchColumn('custrecord_iban');
        columns[6] = new nlobjSearchColumn('custrecord_account_address');
        //columns[7] = new nlobjSearchColumn('currency');
    
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiary)
        //filters[1] = new nlobjSearchFilter('currency', null, 'anyof', currency)
        filters[1] = new nlobjSearchFilter('custrecord_bank_account_for_proforma', null, 'is', 'T')


        var search = nlapiCreateSearch('account', filters, columns);

        var resultset = search.runSearch();
        var returnSearchResults = [];
        var searchid = 0;     
        var data = '';

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                returnSearchResults.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (returnSearchResults != null && returnSearchResults.length > 0) {


            for (var i = 0; i < returnSearchResults.length; i++) {

                var id = returnSearchResults[i].id;
                var account = nlapiLoadRecord('account', id);
                var account_currency = account.getFieldValue('currency');
                if (currency == account_currency) {

                    var custrecord_account_number = returnSearchResults[i].getValue('custrecord_account_number')
                    var custrecord_account_bank_name = returnSearchResults[i].getValue('custrecord_account_bank_name')
                    var custrecord_swift = returnSearchResults[i].getValue('custrecord_swift')
                    var custrecord_via = returnSearchResults[i].getValue('custrecord_via')
                    var custrecord_bic_aba = returnSearchResults[i].getValue('custrecord_bic_aba')
                    var custrecord_iban = returnSearchResults[i].getValue('custrecord_iban')
                    var custrecord_account_address = returnSearchResults[i].getValue('custrecord_account_address');

                    //nlapiLogExecution('debug', 'custrecord_account_address', custrecord_account_address.replace(/\n/ig, '<br /> '));
                    //var currency = returnSearchResults[0].getValue('currency');

                    data += 'Account#: '  + custrecord_account_number + '<br />';
                    data += 'Bank: ' + custrecord_account_bank_name + '<br />'
                    data += 'Swift: ' + custrecord_swift + '<br />'
                    data += 'Via: ' + custrecord_via + '<br />'
                    data += 'BIC/ABA: ' + custrecord_bic_aba + '<br />'
                    data += 'IBAN: ' + custrecord_iban + '<br />'
                    data += 'Address: ' + custrecord_account_address.replace(/\n/ig, '<br /> '); + '<br />';

                    return data;
                }

            }
        }

    } catch (e) {

        nlapiLogExecution('debug', 'error', e);
    }



}