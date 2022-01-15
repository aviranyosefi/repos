function suitelet_print(request, response) {

    var ff_for_print = nlapiLookupField('customrecord_ff_for_ship_print', 1, 'custrecord_ff_for_print');
    ff_for_print = ff_for_print.split(',');

    if (!isNullOrEmpty(ff_for_print)) {
        var mainPdf = printPacks(ff_for_print)
        response.setContentType('PDF', 'itemlabel.pdf', 'inline');
        response.write(mainPdf);
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function printPacks(ff_for_print) {
    var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";

    xml += "<pdfset>";

    for (var i = 0; i < ff_for_print.length; i++) {
        try { 

            var record = nlapiLoadRecord('itemfulfillment', ff_for_print[i]);
            var renderer = nlapiCreateTemplateRenderer();
            //var template = nlapiLoadFile(215577);   // sendbox
            var template = nlapiLoadFile(2878);   // prod
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);

            var xml_file = renderer.renderToString();
            nlapiLogExecution('DEBUG', 'xml: ', xml_file);
            var pdf_file = nlapiXMLToPDF(xml_file);
            //response.setContentType('PDF', 'itemlabel.pdf', 'inline');
            //response.write(pdf.getValue());


            var attachment = nlapiCreateFile('Print'+i+'.pdf', 'PDF', pdf_file.getValue());
            nlapiLogExecution('DEBUG', 'attachment: ', attachment);
            attachment.setFolder('-15');
            //Set Available without login to true
            attachment.setIsOnline(true);

            //store file in cabinet
            var fileID = nlapiSubmitFile(attachment);

            // load the file to get its URL
            var fileURL = nlapiLoadFile(fileID).getURL();
            var pdf_fileURL = nlapiEscapeXML(fileURL);
            xml += "<pdf src='" + pdf_fileURL + "'/>";

            var context = nlapiGetContext();
            var usageRemaining = context.getRemainingUsage();

            if (usageRemaining < 50) {
                alert('There are too many results for this search, therefore some Packing slips have been ommitted. For a more precise result, please narrow your date range');
                break;
            }
            
        }
        catch (e) {
            nlapiLogExecution('ERROR', 'error pdfbuild - fulfillment:' + ff_for_print[i] + ' ', e);
        }
    };
    xml += "</pdfset>";
    var pdf = nlapiXMLToPDF(xml);

    var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', pdf.getValue());
    multipleINV_pdf.setFolder('-15');
    var printFileID = nlapiSubmitFile(multipleINV_pdf);
    mainPDF = nlapiLoadFile(printFileID).getValue(); //get url of pdf from filecabinet

    return mainPDF;
}