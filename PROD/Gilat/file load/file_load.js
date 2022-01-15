function loadFile(request, response) {

    if (request.getMethod() == 'GET') {
        var form = nlapiCreateForm('Upload File');

        var fileField = form.addField('file', 'file', 'Select File');

        fileField.setMandatory(true);

        form.addSubmitButton('Upload');
        form.addResetButton();

        response.writePage(form);

    }
    else {

        var getUserMail = nlapiGetContext().getEmail();
        var getUserID = nlapiGetContext().getUser();

        //nlapiLogExecution('debug', 'getSubsid', getSubsid)
        var sendForm = nlapiCreateForm('Uploading File');

        var htmlField1 = sendForm.addField('custpage_header1', 'inlinehtml');
        htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the summary of results will be sent to : <b> " + getUserMail + "</b> once completed.<br></span>");



        var file = request.getFile("file");
        file.setEncoding('UTF-8');
        file.setFolder(1226)
        file.setIsOnline(true)
        var FileID = nlapiSubmitFile(file)


        var content = new Array();
        var temp = new Array();
        var f = '';


        var loadedFile = nlapiLoadFile(FileID); //load the file 
        var loadedString = loadedFile.getValue(); //read its contents
        nlapiLogExecution('DEBUG', 'loadedString ', JSON.stringify(loadedString))
        var fileLines = loadedString.split('\r\n'); //split on newlines
        
        for (var i = 0; i < fileLines.length; i++) { //for each line do:
            //var cols = fileLines[i].split('\r'); //change delimeter here ...
            //for (var j = 0; j < cols.length; j++) {
               // nlapiLogExecution('DEBUG', 'cols[j]: ',  cols[j])
            var columns = fileLines[i].split(',');                   
                for (var y = 0; y <= columns.length; y++) {      
                    nlapiLogExecution('DEBUG', 'columns[y]: ', columns[y])
                    if (y == 0 && i > 0) {
                        var date = columns[y];                      
                        f +=  dateFormat(date)+',';
                    }
                    else if (y < columns.length) {
                        f += columns[y] + ',';
                    }
                    else {
                        f +=  '\n';  // end line 
                    }
                     
                   }
               
              

            //}
            //content[j] += temp;

        }
        //nlapiLogExecution('DEBUG', 'content ', JSON.stringify(content))
        //var contents = '';
        //for (var z = 0; z < content.length; z++) {
        //    contents += content[z] + '\n';
        //}

        //var f = 'aa, bb, cc \n';
        //f= f+ 'dd , ee , ff \n aa , dd ,gg'

       // nlapiLogExecution('DEBUG', 'contents ', JSON.stringify(contents))

        var file = nlapiCreateFile('test.csv', 'CSV', f);
        file.setFolder(1226);
        var FileID = nlapiSubmitFile(file);

 

        //var params = {
        //    custscript_ilo_shaam_file: FileID,
        //    custscript_ilo_shaam_email: getUserMail,
        //    custscript_ilo_shaam_sender: getUserID,
        //    custscript_ilo_shaam_subsid: getSubsid
        //};

        //nlapiScheduleScript('customscript_ilo_shaam_in_scheduled', 'customdeploy_ilo_shaam_in_scheduled', params);

       



        response.writePage(sendForm);

    }

}


function d() {


    var loadedFile = nlapiLoadFile(invoiceFileId); //load the file 
    var loadedString = loadedFile.getValue(); //read its contents
    var fileLines = loadedString.split('\n'); //split on newlines 
    for (var i = 0; i < fileLines.length; i++) { //for each line do:
        var cols = fileLines[i].split('\t'); //change delimeter here ...

    }


}

function dateFormat(date){
   
    var s = date.split('/');
    return s[1] + '/' + s[0] + '/' + s[2];

}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



//var content = new Array();
//var cells = new Array();
//var temp = new Array();
//var x = 0;

//// Looping through the search Results
//for (var i = 0; i < search.length; i++) {

//    var resultSet = search[i];
//    // Returns an array of column internal Ids
//    var columns = resultSet.getAllColumns();
//    // Looping through each column and assign it to the temp array

//    for (var y = 0; y <= columns.length; y++) {
//        temp[y] = resultSet.getValue(columns[y]);
//    }

//    // Taking the content of the temp array and assigning it to the Content Array.
//    content[x] += temp;
//    // Incrementing the index of the content array
//    x++;
//}

//// Creating a string variable that will be used as the CSV Content
//var contents;
//// Looping through the content array and assigning it to the contents string variable.
//for (var z = 0; z < content.length; z++) {
//    contents += content[z].toString() + '\n';
//}

//// Creating a csv file and passing the contents string variable. 
//var file = nlapiCreateFile('test.csv', 'CSV', contents);








//var xmlString = '<?xml version="1.0"?><?mso-application progid="CSV.Sheet"?>';
//xmlString += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
//xmlString += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
//xmlString += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
//xmlString += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
//xmlString += 'xmlns:html="http://www.w3.org/TR/REC-html40">';

//xmlString += '<Worksheet ss:Name="Sheet1">';
//xmlString += '<Table>' +
//    '<Row>' +
//    '<Cell><Data ss:Type="String"> First Header </Data></Cell>' +
//    '<Cell><Data ss:Type="String"> Second Header </Data></Cell>' +
//    '<Cell><Data ss:Type="String"> Third Header </Data></Cell>' +
//    '<Cell><Data ss:Type="String"> Fourth Header </Data></Cell>' +
//    '<Cell><Data ss:Type="String"> Fifth Header </Data></Cell>' +
//    '</Row>';

//xmlString += '<Row>' +
//    '<Cell><Data ss:Type="String">Row 1 Column 1</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 1 Column 2</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 1 Column 3</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 1 Column 4</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 1 Column 5</Data></Cell>' +
//    '</Row>';

//xmlString += '<Row>' +
//    '<Cell><Data ss:Type="String">Row 2 Column 1</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 2 Column 2</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 2 Column 3</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 2 Column 4</Data></Cell>' +
//    '<Cell><Data ss:Type="String">Row 2 Column 5</Data></Cell>' +
//    '</Row>';

//xmlString += '</Table></Worksheet></Workbook>';

////create file
//var xlsFile = nlapiCreateFile('TEST.csv', 'CSV', xmlString);

//xlsFile.setFolder(1226);

////save file 
//var fileID = nlapiSubmitFile(xlsFile);


