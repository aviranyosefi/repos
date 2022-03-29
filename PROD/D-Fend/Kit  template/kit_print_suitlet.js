function suitelet_print(request, response) {
    try {
        var id = request.getParameter('Recid');
        var type = request.getParameter('RecType');
        var ci = request.getParameter('ci');
        nlapiLogExecution('debug', 'id: ' + id, 'type: ' + type + ' , ci: ' + ci)
        var record = nlapiLoadRecord(type, id);
        if (type == 'estimate') {
            var attachment = nlapiPrintRecord('TRANSACTION', id, 'PDF', null);
            attachment.setFolder('-15');
            attachment.setIsOnline(true);
            var fileID = nlapiSubmitFile(attachment);
            var fileURL = nlapiLoadFile(fileID).getURL();
            var pdf_fileURL = nlapiEscapeXML(fileURL);
            var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xml += "<pdfset>";
            xml += "<pdf src='" + pdf_fileURL + "'/>";
            var terms_of_sale = record.getFieldValue('custbody_terms_of_sale');
            if (!isNullOrEmpty(terms_of_sale)) {
                var terms_fileURL = getFileByName(terms_of_sale)
                if (!isNullOrEmpty(terms_fileURL)) {
                    xml += "<pdf src='" + terms_fileURL + "'/>";
                }
            }
            xml += "</pdfset>";
            var pdf = nlapiXMLToPDF(xml);
            //save pdf in filecabinet
            response.setContentType('PDF', 'itemlabel.pdf', 'inline');
            response.write(pdf.getValue());
        }
        else {

            var renderer = nlapiCreateTemplateRenderer();
            if (type == 'invoice') {
                var template = nlapiLoadFile(42965);
            }
            else if (type == 'itemfulfillment') {
                if (ci == 'T') {
                    //var template = nlapiLoadFile(43578);// SANDBOX
                    var template = nlapiLoadFile(60910);// PROD
                }
                else {
                    //var template = nlapiLoadFile(42950); // SANDBOX
                    var template = nlapiLoadFile(50652); // PROD
                }

            }
            else if (type == 'salesorder') {
                if (ci == 'T') {
                    //var template = nlapiLoadFile(68309); //sandbox
                    var template = nlapiLoadFile(137462); //production
                }
                else {
                    //var template = nlapiLoadFile(68255);//sandbox
                    var template = nlapiLoadFile(137461);//production
                }
            }
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            xml = xml.replace('/Bank Details/', getBankDetails(record));

            var pdf = nlapiXMLToPDF(xml);
            //nlapiLogExecution('debug', 'pdf', pdf);
            response.setContentType('PDF', 'itemlabel.pdf', 'inline');
            response.write(pdf.getValue());
        }

    } catch (e) {
        nlapiLogExecution('DEBUG', 'error suitelet_print', e)
    }

}



function getFileByName(terms_of_sale) {

    var templateName = getTermsOfSalepdf(terms_of_sale)
    if (templateName != '') {

        var cols = new Array();
        cols[0] = new nlobjSearchColumn('name', 'file');
        cols[1] = new nlobjSearchColumn('internalid', 'file');

        var fils = new Array();
        fils[0] = new nlobjSearchFilter('name', null, 'is', 'Terms of Sales')
        fils[1] = new nlobjSearchFilter('name', 'file', 'is', templateName + '.pdf')


        var s = nlapiSearchRecord('folder', null, fils, cols);

        if (s != null) {
            file_id = s[0].getValue('internalid', 'file')
            var fileURL = nlapiLoadFile(file_id).getURL();
            var pdf_fileURL = nlapiEscapeXML(fileURL);
            return pdf_fileURL;
        }
    }
    return '';
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getTermsOfSalepdf(id) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist_terms_of_sale', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        return returnSearchResults[0].getValue('name')

    }
    else { return ''; }

}

function getBankDetails(record) {

    var currencysymbol = record.getFieldValue('currencysymbol');
    var symbol;
    if (currencysymbol == 'USD')
        symbol = '$'
    else if (currencysymbol == 'GBP')
        symbol = '£'
    else if (currencysymbol == 'EUR')
        symbol = '€'
    else symbol = '₪'


    var subId = record.getFieldValue('subsidiary');

    var bankDetails;
    var SubRec = nlapiLoadRecord('subsidiary', subId);
    var entity = nlapiLoadRecord('customer', record.getFieldValue('entity')); // customer id
    //var country = entity.getFieldValue('billcountry');
    var geo_country = entity.getFieldValue('custentity_geo_country');
    //var billattention = entity.getFieldValue('billattention');
    //if (billattention == '' || billattention == null || billattention == undefined) billattention = "";
    nlapiLogExecution('debug', 'geo_country', geo_country);

    if (geo_country == 'IL' || (geo_country != 'IL' && symbol != '$')) { bankDetails = SubRec.getFieldValue('custrecord_bankils') }//103 - israel
    //if (country == 'IL' || (country != 'IL' && symbol != '$')) { bankDetails = SubRec.getFieldValue('custrecord_bankils') }
    else bankDetails = SubRec.getFieldValue('custrecord_bankfrn')

    if (bankDetails != null) {
        bankDetails = bankDetails.replace(/\n/ig, '<br />');
        bankDetails = bankDetails.replace(/&/ig, '&amp;');

        var banktTable = "<table style='font-size:12px;padding-left:5px' align='left' width='100%'>";
        banktTable += "<tr> <td>Bank Details: <br /> " + bankDetails + "</td></tr>";
        banktTable += "</table>"
    }


    nlapiLogExecution('debug', 'bankDetails', banktTable);

    return bankDetails
}
