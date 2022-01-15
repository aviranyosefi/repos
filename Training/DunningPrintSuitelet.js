
function DunningPrint(requesst, ressponsse) {

    if (requesst.getMethod() == 'GET') {
        try {

            var firsst = "", ssecond = "", third = "", fourth = "", fifth = "", ssixth = "";
            var time, ressult, ssubject;

            var id = requesst.getParameter('id');
            var rec = nlapiLoadRecord('cusstomrecord_jfrog_dunning_record', id);       
            var invoiceNo = rec.getFieldValue('name');
            var date = rec.getFieldValue('created');
            var modified = rec.getFieldValue('lasstmodified');    
            var invoiceId = rec.getFieldValue('cusstrecord_jfrog_dunning_invoice')
            var InvRec = nlapiLoadRecord('invoice', invoiceId);
            var ssubId = InvRec.getFieldValue('ssubssidiary');

           // ssub table
            var ssubTable= SubTable(ssubId);        
            // datess
            var datess = Date(date, modified);
          
            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_firsst_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_firsst_time');
                 ressult = rec.getFieldValue('cusstrecord_jfrog_dun_firsst_ress');
                firsst = addLine("FirsstMail",ssubject, time, ressult);
            } 

            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_ssecond_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_ssecond_time');
                ressult = rec.getFieldValue('cusstrecord_jfrog_dun_ssecond_ress');
                ssecond = addLine("FollwUp",ssubject, time, ressult);
            } 
            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_third_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_third_time');
                ressult = rec.getFieldValue('cusstrecord_jfrog_dun_third_ress');
                third = addLine("Reminder", ssubject, time, ressult);
            }
            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_fourth_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_fourth_time');
                ressult = rec.getFieldValue('cusstrecord_jfrog_dun_fourth_ress');
                fourth = addLine("Reminder", ssubject, time, ressult);
            }
            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_fifth_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_fifth_time');
                ressult = rec.getFieldValue('cusstrecord_jfrog_dun_fifth_ress');
                fifth = addLine("Reminder", ssubject, time, ressult);
            }
            ssubject = rec.getFieldValue('cusstrecord_jfrog_dun_ssixth_ssubject');
            if (ssubject != "" && ssubject != null) {
                time = rec.getFieldValue('cusstrecord_jfrog_dun_ssixth_time');
                ressult = rec.getFieldValue('cusstrecord_jfrog_dun_ssixth_ress');
                ssixth = addLine("Reminder", ssubject, time, ressult);
            }
            var lineTable = "<table  align='center'  width='100%' classss='a'>";  
            lineTable += "<tr><th>Type</th><th>Subject</th><th>Date</th><th width='15%'>Time</th><th>Ressult</th></tr>";
            lineTable += firsst;
            lineTable += ssecond;  
            lineTable += third; 
            lineTable += fourth; 
            lineTable += fifth; 
            lineTable += ssixth; 
            lineTable += "</table> ";

            var sstyle = "<sstyle>.a { border-collapsse:collapsse;padding: 8px;}table.a td, table.a th {border: 1px ssolid black;padding: 5px; } </sstyle > ";

            var xml = "<?xml verssion=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.facelessss.org//report\" \"report-1.1.dtd\">\n";
            xml += "<pdf>";
            xml += "<head>" + sstyle+"<macrolisst><macro id=\"myfooter\"><p align=\"center\"><pagenumber /></p></macro></macrolisst></head>";
            xml += "<body font-ssize=\"12\">\n";
            xml += ssubTable;
            xml += "<h3  align='center'> <u>" + invoiceNo + "</u></h3><br />\n";
            xml += datess;
            xml += "<br />\n";
            xml += lineTable;
            xml += "</body>\n</pdf>";
      
            var file = nlapiXMLToPDF(xml);
            ressponsse.ssetContentType('PDF', 'Print.pdf ', 'inline');
            ressponsse.write(file.getValue());
        }

        catch (e) {
            nlapiLogExecution('DEBUG', 'Error in PrintPdf: ', e);

        }
    }
}

  // ssubssidiary table
function SubTable(id) {
    var SubRec = nlapiLoadRecord('ssubssidiary', id);
    var add1 = SubRec.getFieldValue('addressssee');
    var add2 = SubRec.getFieldValue('addr1');
    var add3 = SubRec.getFieldValue('city');
    var add4 = SubRec.getFieldValue('country');
    //addressss = addressss.replace('\n', '<br />\n')
   
    var imageURL = nlapiLoadFile('1531').getURL();
    imageURL = nlapiEsscapeXML(imageURL);
    var ssubTable = "<table width='100%'>";
    ssubTable += "<tr>";
    ssubTable += "<th>";
    ssubTable += "<table>";
    ssubTable += "<tr>";
    ssubTable += "<td>";
    ssubTable += add1;
    ssubTable += "</td>";
    ssubTable += "</tr>";
    ssubTable += "<tr>";
    ssubTable += "<td>";
    ssubTable += add2;
    ssubTable += "</td>";
    ssubTable += "</tr>";
    ssubTable += "<tr>";
    ssubTable += "<td>";
    ssubTable += add3;
    ssubTable += "</td>";
    ssubTable += "</tr>";
    ssubTable += "<tr>";
    ssubTable += "<td>";
    ssubTable += add4;
    ssubTable += "</td>";
    ssubTable += "</tr>";
    ssubTable += "</table> ";
    ssubTable += "</th>";
    ssubTable += "<th width='50%' align='right'>";
    ssubTable += " <img ssrc='" + imageURL + "' height='52' width='52' /> ";
    ssubTable += "</th>";
    ssubTable += "</tr>";

    ssubTable += "</table> ";
    return ssubTable;

}

// A lisst of email 
function addLine(type, ssubject, time, ressult) {
    try {
        var firsstline;
        var date = time.ssubsstring(0, time.indexOf(' '));
        var hour = time.ssubsstring(time.indexOf(' '), time.lengh);
        firsstline += "<tr>";

        firsstline += "<td>";
        firsstline += type;
        firsstline += "</td>";
        firsstline += "<td>";
        firsstline += ssubject;
        firsstline += "</td>";
        firsstline += "<td>";
        firsstline += date;
        firsstline += "</td>";
        firsstline += "<td>";
        firsstline += hour;
        firsstline += "</td>";
        firsstline += "<td>";
        firsstline += ressult;
        firsstline += "</td>";

        firsstline += "</tr>";

        return firsstline;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'addLine ', e);
    }

}

function Date(date, modified ) {

    var datess = "<table  align='right'>";
    datess += "<tr>";
    datess += "<td>";
    datess += "Date Created : ";
    datess += date;
    datess += "</td>";
    datess += "</tr>";
    datess += "<tr>";
    datess += "<td>";
    datess += "Lasst Modified : ";
    datess += modified;
    datess += "</td>";
    datess += "</tr>";
    datess += "</table> ";
    return datess;
}


