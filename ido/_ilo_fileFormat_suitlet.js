/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jan 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

var id_rec;
function fileFormat(request, response){
	
    //Create the form and add fields to it 
    var form = nlapiCreateForm("Generate Shaam Out File");
    form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');


    form.addSubmitButton('Generate File');

    if (request.getMethod() == 'GET') {
        response.writePage(form);
    }
    else {

var strData = 'hrllo';     
var fileToLoad = saveData();

if(fileToLoad != null || undefined) {
	var data = nlapiLoadFile(fileToLoad);
	 var content = data.getValue();
	downloadData(strData, response, form);
	
}
    }

}


function saveData(data, response, form) {
	
	var newFile = nlapiCreateFile('testing.txt', 'PLAINTEXT', 'this is just data. test');


	newFile.setFolder(-15);
	newFile.setEncoding('windows-1252');
	id_rec = nlapiSubmitFile(newFile);
	
	return id_rec;

}

function downloadData(content, response, form) {
	
	response.setEncoding('windows-1252');
    response.setContentType('PLAINTEXT', 'testing.txt');
    // write response to the client
   
    response.write(content);
}


function GetTodayDate() {
    var now = new Date();
    var nowDate = now.getFullYear().toString() + PadLeftWithZero((now.getMonth() + 1), 2) + PadLeftWithZero((now.getDate()), 2);
    return nowDate;
}

function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    return res;
}
