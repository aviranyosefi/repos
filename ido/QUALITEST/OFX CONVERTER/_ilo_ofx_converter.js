/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Apr 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function convert_to_ofx(request, response){

	if (request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Convert Bank File to OFX');
		
		
		var selectGroup = form.addFieldGroup('custpage_select_group','Select Bank & Account');
		
		var uploadGroup = form.addFieldGroup('custpage_upload_group', 'Upload File');

		var bankSelect = form.addField('custpage_bank_select','select','Select Bank', null, 'custpage_select_group');
		bankSelect.setMandatory(true)
		bankSelect.addSelectOption('','');
		bankSelect.addSelectOption('10','Leumi');
		
		var allAccounts = getAllAccounts();
		var accountSelect = form.addField('custpage_account_select','select','Select Account', null, 'custpage_select_group');
		
		accountSelect.addSelectOption('', '');
		for(var i = 0; i<allAccounts.length; i++) {
			accountSelect.addSelectOption(allAccounts[i].acc_id, allAccounts[i].acc_name);
		}
		
		var allCurrencies = getAllCurrencies();
		var currencySelect = form.addField('custpage_currency_select','select','Select Currency', null, 'custpage_select_group');
		currencySelect.addSelectOption('', '');
		for(var i = 0; i<allCurrencies.length; i++) {
			currencySelect.addSelectOption(allCurrencies[i].curr_name, allCurrencies[i].curr_name);
		}
//		currencySelect.setDefaultValue('ILS')

		
		
		var fileField = form.addField('file', 'file', 'Select File');
	   
		fileField.setMandatory(true);
		bankSelect.setMandatory(true);
		accountSelect.setMandatory(true);
		
		
		form.addSubmitButton('Convert');
		form.addResetButton();
		response.writePage(form);
	}
		
		else if(request.getParameter('custpage_currency_select') != 'ILS') { //if currency is NOT ILS
			
			var file = request.getFile("file");
			file.setEncoding('windows-1252')
			
	
			//header and file values
		var accountID = request.getParameter('custpage_account_select');
		var accountName = nlapiLookupField('account', accountID, 'name')
		var bankSelected = request.getParameter('custpage_bank_select');
		var currency = request.getParameter('custpage_currency_select')
		var bankName = getBankName(bankSelected);

			
			var fileContent = file.getValue();
			

			
			var header = "OFXHEADER:100 \n";
			header += "DATA:OFXSGML \n";
			header += "VERSION:103 \n";
			header += "SECURITY:NONE \n";
			header += "ENCODING:USASCII \n";
			header += "CHARSET:1252 \n";
			header += "COMPRESSION:NONE \n";
			header += "OLDFILEUID:NONE \n";
			header += "NEWFILEUID:NONE \n\n";


			var filedetails = "<OFX> \n";
				filedetails += "<SIGNONMSGSRSV1> \n";
				filedetails += "<SONRS> \n";
				filedetails += "<STATUS> \n";
				filedetails += "<CODE>0 \n";
				filedetails += "<SEVERITY>INFO \n";
				filedetails += "</STATUS> \n";
				filedetails += "<DTSERVER>20071015021529.000[-8:PST] \n"; //not sure yet
				filedetails += "<LANGUAGE>ENG \n";
					
				filedetails += "<DTACCTUP>19900101000000 \n"; //not sure yet
				filedetails += "<FI> \n";
				filedetails += "<ORG>"+bankName+" \n"; //bank name
				filedetails += "<FID>"+bankSelected+" \n"; //bank id
				filedetails += "</FI> \n";
				filedetails += "</SONRS> \n";
				filedetails += "</SIGNONMSGSRSV1> \n";		
				filedetails += "<BANKMSGSRSV1> \n";
				filedetails += "<STMTTRNRS> \n";
					
				filedetails += "<TRNUID>23382938 \n"; //not sure yet
				filedetails += "<STATUS> \n";
				filedetails += "<CODE>0 \n";
				filedetails += "<SEVERITY>INFO \n";
				filedetails += "</STATUS> \n";
				filedetails += "<STMTRS> \n";			
				filedetails += "<CURDEF>"+currency+" \n"; //currency ISO symbol
				filedetails += "<BANKACCTFROM> \n";
							
				filedetails += "<BANKID>"+bankSelected+" \n";
				filedetails += "<ACCTID>"+accountID+" \n";
				filedetails += "<ACCTTYPE>SAVINGS \n"; //not sure yet
				filedetails += "</BANKACCTFROM> \n";		
				filedetails += "<BANKTRANLIST> \n";
				filedetails += "<DTSTART>"+GetTodayDateYYYYMMDD()+" \n"; //start conversion
				filedetails += "<DTEND>"+GetTodayDateYYYYMMDD()+" \n\n"; //end conversion
					
					
				

				
		var data = '';
		
		if(bankSelected == '10') { //LEUMI FOREX
			
			var leumiForex = buildTransactions_LEUMI_FOREX(fileContent);
			
			data = header+filedetails+leumiForex;
			
			downloadData(data, response, null, bankName, accountName)
		}
		

	}	else if(request.getParameter('custpage_currency_select') == 'ILS') { 
		
		var file = request.getFile("file");
		file.setEncoding('windows-1252')
		
		//header and file values
		var accountID = request.getParameter('custpage_account_select');
		var accountName = nlapiLookupField('account', accountID, 'name')
		var bankSelected = request.getParameter('custpage_bank_select');
		var currency = request.getParameter('custpage_currency_select')
		var bankName = getBankName(bankSelected);

		//closing lines
//		var finalBalance = 
//		var lastDate = 
		

		
		var fileContent = file.getValue();
		

		
		
		var header = "OFXHEADER:100 \n";
		header += "DATA:OFXSGML \n";
		header += "VERSION:103 \n";
		header += "SECURITY:NONE \n";
		header += "ENCODING:USASCII \n";
		header += "CHARSET:1252 \n";
		header += "COMPRESSION:NONE \n";
		header += "OLDFILEUID:NONE \n";
		header += "NEWFILEUID:NONE \n\n";


		var filedetails = "<OFX> \n";
			filedetails += "<SIGNONMSGSRSV1> \n";
			filedetails += "<SONRS> \n";
			filedetails += "<STATUS> \n";
			filedetails += "<CODE>0 \n";
			filedetails += "<SEVERITY>INFO \n";
			filedetails += "</STATUS> \n";
			filedetails += "<DTSERVER>20071015021529.000[-8:PST] \n"; //not sure yet
			filedetails += "<LANGUAGE>ENG \n";
				
			filedetails += "<DTACCTUP>19900101000000 \n"; //not sure yet
			filedetails += "<FI> \n";
			filedetails += "<ORG>"+bankName+" \n"; //bank name
			filedetails += "<FID>"+bankSelected+" \n"; //bank id
			filedetails += "</FI> \n";
			filedetails += "</SONRS> \n";
			filedetails += "</SIGNONMSGSRSV1> \n";		
			filedetails += "<BANKMSGSRSV1> \n";
			filedetails += "<STMTTRNRS> \n";
				
			filedetails += "<TRNUID>23382938 \n"; //not sure yet
			filedetails += "<STATUS> \n";
			filedetails += "<CODE>0 \n";
			filedetails += "<SEVERITY>INFO \n";
			filedetails += "</STATUS> \n";
			filedetails += "<STMTRS> \n";			
			filedetails += "<CURDEF>"+currency+" \n"; //currency ISO symbol
			filedetails += "<BANKACCTFROM> \n";
						
			filedetails += "<BANKID>"+bankSelected+" \n";
			filedetails += "<ACCTID>"+accountID+" \n";
			filedetails += "<ACCTTYPE>SAVINGS \n"; //not sure yet
			filedetails += "</BANKACCTFROM> \n";		
			filedetails += "<BANKTRANLIST> \n";
			filedetails += "<DTSTART>"+GetTodayDateYYYYMMDD()+" \n"; //start conversion
			filedetails += "<DTEND>"+GetTodayDateYYYYMMDD()+" \n\n"; //end conversion
				
				
			var allLines = fileContent.split("\r\n");
			
			var tranArr = [];
			

			allLines.forEach(function(line) {
				
				var singleLineArr = line.split(",");
				
				
				if(singleLineArr[3] != null || undefined || '') {
					tranArr.push({
					trnamt: singleLineArr[3],
					trntype: singleLineArr[5],
					fitid: singleLineArr[0],
					dtposted: singleLineArr[1],
					name : singleLineArr[2],
					balance: singleLineArr[4]
				});
				
				
				}
			});
		
			var transactions = '';
			
			for(var i = 0; i<tranArr.length; i++) {
				
				var line = "<STMTTRN> \n"
					line += "<TRNTYPE>"+getTranType(tranArr[i].trnamt)+" \n"
					line += "<DTPOSTED>"+formatDateYYYYMMDD(tranArr[i].dtposted)+" \n"
					line += "<TRNAMT>"+removeLeadingZeros(tranArr[i].trnamt)+" \n"
					line += "<MEMO>"+ascii2utf(tranArr[i].name) +" \n"  
					line += "<NAME>"+tranArr[i].fitid+" \n" //tranlate the hebrew
					//line += "<Hebrewtest> אבג  \n" //tranlate the hebrew
					line += "</STMTTRN> \n\n"
				
						transactions += line;
			}
				

						
					var finalBalance = removeLeadingZeros(tranArr[tranArr.length-1].balance);
					var lastDay = formatDateYYYYMMDD(tranArr[tranArr.length-1].dtposted);
						
						
			var closingTags = "</BANKTRANLIST> \n";
				closingTags += "<LEDGERBAL> \n";
				closingTags += "<BALAMT>"+finalBalance+" \n"; //not sure yet - seems to be the last line in statement (final balance)
				closingTags += "<DTASOF>"+lastDay+" \n"; //not sure yet- seems to be the date of last line in statement 
				closingTags += "</LEDGERBAL> \n";
				closingTags += "<AVAILBAL> \n";
				closingTags += "<BALAMT>"+finalBalance+" \n"; //not sure yet - seems to be the last line in statement (final balance)
				closingTags += "<DTASOF>"+lastDay+" \n"; //not sure yet- seems to be the date of last line in statement 
				closingTags += "</AVAILBAL> \n";
				closingTags += "</STMTRS> \n";
				closingTags += "</STMTTRNRS> \n";
				closingTags += "</BANKMSGSRSV1> \n";
				closingTags += "</OFX> \n";
		
			
			
			
			
		
				
				
var data = header+filedetails+transactions+closingTags
	
	downloadData(data, response, null, bankName, accountName)

	}
	
}



function downloadData(data, response, form, bank, account) {

	var todayDate = GetTodayDateYYYYMMDD();
	
	var cleanAccount = '';
	if(account.indexOf(':') != -1) {
		cleanAccount = account.substr(account.lastIndexOf(':')+2, account.length-1)
	}else{
		cleanAccount = account;
	}
	
	var filename = todayDate+'_'+'_'+cleanAccount;
	var cleanName = filename.replace("&", "and");
	var length = 18;
	var trimmedString = cleanName.substring(0, length);
    response.setContentType('PLAINTEXT', trimmedString+'.ofx');
    // write response to the client
    response.write(data);
}
function removeLeadingZeros(num) {

    var prefix = '';
    if (num.charAt(0) == '-') {
        prefix = '-'
    }

    var s = num.substring(1);
    if (s.charAt(0) == '.') {
        s = '0'+s
    }


    var res1 = s.replace(/^0+/, '');
	
	if(res1.charAt(0) == '.') {
	res1 = '0'+res1;
	}

    return prefix + res1;

}

function getTranType(num) {
	
	var trantype = 'CREDIT';
	
    if (num.charAt(0) == '-') {
    	trantype = 'DEBIT';
    }
	
	return trantype;
}

function formatDateYYYYMMDD(str)
{
    var arr = new Array;
    for (var i = 0; i < str.length; i += 2)
    {
        arr.push(str.substr(i, 2));
    }
    
	arr[2] = '20'+arr[2];
	
	var res = arr[2]+arr[1]+arr[0];
	return res
}

function GetTodayDateYYYYMMDD() {
    var now = new Date();
	
	var month = now.getMonth() + 1;
	var day = now.getDate();
	
	if(month <= 9) {
	month = '0'+month
	}
		if(day <= 9) {
	day = '0'+month
	}
	
    var nowDate = now.getFullYear().toString() + month + day;
    
    var fixed = nowDate.replace('00', '0')

    return fixed;
}

function getBankName(bank) {

	var bankName = '';
	if (bank == '10') {
		bankName = 'Leumi'
	}
	return bankName;

}
function getAllAccounts() {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('type', null, 'anyof', 'Bank');
	filters[1] = new nlobjSearchFilter('name', null, 'contains', 'Leumi');

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid').setSort(false);
	cols[1] = new nlobjSearchColumn('name');
	cols[2] = new nlobjSearchColumn('description');



	var search = nlapiSearchRecord('account', null, filters, cols);
	var results = [];
		
	if (search != null) {
		search.forEach(function(line) {
			
			results.push({
			
			acc_id : line.getValue('internalid'),
			acc_name : line.getValue('name'),
			});
		});

	};
	
	return results;
}

function getAllCurrencies() {

	var sysExRates = [];
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('symbol', null, null);
	columns[1] = new nlobjSearchColumn('internalid', null, null);
	var search = nlapiSearchRecord('currency', null, null, columns);
	for (var i = 0; i < search.length; i++) {
		sysExRates.push({
			curr_name : search[i].getValue(columns[0]),
			curr_id : search[i].getValue(columns[1]),

		});
	}
	return sysExRates;
}


function ascii2utf(str) {

    var obj = new Array();
    obj['€'] = 'א';
    obj['']	= 'ב';
    obj['‚'] = 'ג';
    obj['ƒ'] = 'ד';
    obj['„'] = 'ה';
    obj['…'] = 'ו';
    obj['†'] = 'ז'; 
    obj['‡'] = 'ח';
    obj['ˆ'] = 'ט';
    obj['‰'] = 'י';
    obj['Š'] = 'ך';
    obj['‹'] = 'כ';
    obj['Œ'] = 'ל';
    obj[''] = 'ם';
    obj['Ž'] = 'מ';
    obj[' '] = 'ן';
    obj['�']	= 'ב';
    obj['‘'] = 'ס';
    obj['’'] = 'ע';
    obj['“'] = 'ף';
    obj['”'] = 'פ';
    obj['•'] = 'ץ';
    obj['–'] = 'צ';
    obj['—'] = 'ק';
    obj['˜'] = 'ר';
    obj['™'] = 'ש';
    obj['š'] = 'ת';
    obj['"'] = '"';
    obj[' '] = ' ';
    obj['0'] = '0'
    obj['1'] = '1'
    obj['2'] = '2'
    obj['3'] = '3'
    obj['4'] = '4'
    obj['5'] = '5'
    obj['6'] = '6'
    obj['7'] = '7'
    obj['8'] = '8'
    obj['9'] = '9'

  


var res = str.split("");
var arrCodes = [];
res.forEach(function (element) {
	
    arrCodes.push(obj[element]);
});

var arrReversed = arrCodes.reverse();

var result = arrReversed.join('');

if(result.indexOf("בבקבוט") != -1) {
	result = result.replace("בבקבוט", "בנקנוט")
}

if(result.indexOf("כספיב") != -1) {
	result = result.replace("כספיב", "כספים")
}

if(result.indexOf("המרהאיבטרבט") != -1) { 
	result = result.replace("המרהאיבטרבט", "המרה-אינטרנט")
}

if(result.indexOf("ביבלאומיי") != -1) { 
	result = result.replace("ביבלאומיי", "בינלאומי-י")
}

if(result.indexOf("דבח עסקמטח") != -1) { 
	result = result.replace("דבח עסקמטח", "דנח עס.ק.מטח")
}

if(result.indexOf("סוחריב דייברס") != -1) { 
	result = result.replace("סוחריב דייברס", "סוחרים דיינרס")
}

if(result.indexOf("עמהעבקובץ") != -1) { 
	result = result.replace("עמהעבקובץ", "עמ.העב.קובץ")
}

if(result.indexOf("עמהעברה גל") != -1) { 
	result = result.replace("עמהעברה גל", "עמ.העברה גל")
}

if(result.indexOf("הע איבטרבט") != -1) { 
	result = result.replace("הע איבטרבט", "הע. אינטרנט")
}

if(result.indexOf("מלא שיק") != -1) { 
	result = result.replace("מלא שיק", "מ.לא שיק")
}

if(result.indexOf("הפקמזומב") != -1) { 
	result = result.replace("הפקמזומב", "הפק.מזומן")
}

if(result.indexOf("דביהול קבועיב") != -1) { 
	result = result.replace("דביהול קבועיב", "ד.ניהול קבועים")
}

if(result.indexOf("עמהקצאת") != -1) { 
	result = result.replace("עמהקצאת", "עמ.הקצאת")
}

if(result.indexOf("ירוחב") != -1) { 
	result = result.replace("ירוחב", "ירוחם")
}

if(result.indexOf("סלקוב") != -1) { 
	result = result.replace("סלקוב", "סלקום")
}

if(result.indexOf("פקדוב") != -1) { 
	result = result.replace("פקדוב", "פקדון")
}

if(result.indexOf("פרעוב") != -1) { 
	result = result.replace("פרעוב", "פרעון")
}

if(result.indexOf("פדיוב") != -1) { 
	result = result.replace("פדיוב", "פדיום")
}

if(result.indexOf("העברהפקדה") != -1) { 
	result = result.replace("העברהפקדה", "העברה\הפקדה")
}

if(result.indexOf("אמריקב") != -1) { 
	result = result.replace("אמריקב", "אמריקן")
}


var danakh = 'דב"ח';
var danakhGood = 'דנ"ח'
if(result.indexOf(danakh) != -1) { 
	result = result.replace(danakh, danakhGood)
}

var amGal = 'עמגל"י ל';
var amGalGood = 'עמ.גל"י ל'
	if(result.indexOf(amGal) != -1) { 
		result = result.replace(amGal, amGalGood)
	}

return result;

}


function buildTransactions_LEUMI_FOREX(fileContent) {
	
	
	var allLines = fileContent.split("\r\n");
	
	var tranArr = [];
	

	allLines.forEach(function(line) {
		
		var singleLineArr = line.split(",");
		
		
		if(singleLineArr[3] != null || undefined || '') {
			tranArr.push({
			trnamt: singleLineArr[5],
			trntype: singleLineArr[10],
			fitid: singleLineArr[0],
			dtposted: singleLineArr[1],
			name : singleLineArr[4],
			balance: singleLineArr[6]
		});
		
		
		}
	});

	var transactions = '';
	
	for(var i = 0; i<tranArr.length; i++) {
		
		var memo = ascii2utf(tranArr[i].name);
		
		var line = "<STMTTRN> \n"
			line += "<TRNTYPE>"+getTranType(tranArr[i].trnamt)+" \n"
			line += "<DTPOSTED>"+formatDateYYYYMMDD(tranArr[i].dtposted)+" \n"
			line += "<TRNAMT>"+removeLeadingZeros(tranArr[i].trnamt)+" \n"
			line += "<MEMO>"+memo+" \n"  
			line += "<NAME>"+tranArr[i].fitid+" \n" //tranlate the hebrew
			//line += "<Hebrewtest> אבג  \n" //tranlate the hebrew
			line += "</STMTTRN> \n\n"
				

		
				transactions += line;
	}
		

				
			var finalBalance = removeLeadingZeros(tranArr[tranArr.length-1].balance);
			var lastDay = formatDateYYYYMMDD(tranArr[tranArr.length-1].dtposted);
				
				
	var closingTags = "</BANKTRANLIST> \n";
		closingTags += "<LEDGERBAL> \n";
		closingTags += "<BALAMT>"+finalBalance+" \n"; //not sure yet - seems to be the last line in statement (final balance)
		closingTags += "<DTASOF>"+lastDay+" \n"; //not sure yet- seems to be the date of last line in statement 
		closingTags += "</LEDGERBAL> \n";
		closingTags += "<AVAILBAL> \n";
		closingTags += "<BALAMT>"+finalBalance+" \n"; //not sure yet - seems to be the last line in statement (final balance)
		closingTags += "<DTASOF>"+lastDay+" \n"; //not sure yet- seems to be the date of last line in statement 
		closingTags += "</AVAILBAL> \n";
		closingTags += "</STMTRS> \n";
		closingTags += "</STMTTRNRS> \n";
		closingTags += "</BANKMSGSRSV1> \n";
		closingTags += "</OFX> \n";

		
		return transactions+closingTags;
	}

