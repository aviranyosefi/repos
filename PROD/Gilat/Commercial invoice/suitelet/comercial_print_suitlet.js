// JavaScript source code

function printPaymentRequest(request, response) {

  
    var id = request.getParameter('custparam_recid');
    nlapiLogExecution('debug', 'id', id);
        //get full template and convert to string
    var temp = nlapiLoadFile('3685').getValue();
    //var temp = nlapiLoadFile('3916').getValue();// prod

        var a = temp.toString();
        //get head tag 
        var first_headTag = a.indexOf("head") - 1;
        var end_headTag = a.indexOf("/head") + 14;
        var head_tag = a.substr(first_headTag, end_headTag - first_headTag);
        //get table tag (actual template of invoice)
        var first_tableTag = a.indexOf("cellpadding") - 7;
        var end_tableTag = a.indexOf("/body") - 11;
        var inv_template = a.substr(first_tableTag, end_tableTag - first_tableTag);
   
      

        //concatenate all parts of xml file	
        var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xml += "<pdf>";

        xml += head_tag + '<body padding="0.2in 0.5in 0.1in 0.5in" size="A4">';


            try {
                
                
                var invoice = nlapiLoadRecord('itemfulfillment', id);
                var renderer = nlapiCreateTemplateRenderer();
                renderer.setTemplate(inv_template);
                renderer.addRecord('record', invoice);

                var rend = renderer.renderToString();                
                xml = xml + rend;

               
            }
            catch (e) {
                nlapiLogExecution('ERROR', 'error' , e);
            }
        
        xml = xml.replace("</pdf>", "");
        xml = xml += '</body></pdf>';
  
    var file = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'Print.pdf ', 'inline');

    response.write(file.getValue());
    

}








