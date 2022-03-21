

/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Nov 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function printForms_suitlet(request, response){
	
	if (request.getMethod() == 'GET') {
		//nlapiLogExecution('DEBUG', 'stage one', 'stage one');
	
		var form = nlapiCreateForm('Print Deposits');
		form.addSubmitButton('Print');
		form.addFieldGroup('custpage_ilo_doctype', 'Type');
		var docType = form.addField('custpage_ilo_multi_doc', 'select', 'Document Type', null, 'custpage_ilo_doctype');
		docType.addSelectOption('a', 'Deposit');
		docType.setMandatory(true);
	
		form.addFieldGroup('custpage_ilo_choose_tran', 'Type');
		var recNumber = form.addField('custpage_ilo_select_record', 'select', 'Select Transaction', null, 'custpage_ilo_choose_tran');
		recNumber.setMandatory(true);
		var allDeposits = getAllDeposits();
		recNumber.addSelectOption('', '');
		for (var i = 0; i < allDeposits.length; i++) {
			recNumber.addSelectOption(allDeposits[i].internalid, allDeposits[i].tranid);
		}
	
		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		response.writePage(form);

	} 
	

	else if(request.getParameter('custpage_ilo_select_record') != '') { 
		
		var recID = request.getParameter('custpage_ilo_select_record')
		
		var record = nlapiLoadRecord('deposit', recID); // load the record to be added
		var arr = [];
		var lineCount = record.getLineItemCount('payment');

		for(var i = 1; i<=lineCount; i++) {

		var isDeposit = record.getLineItemValue('payment', 'deposit', i);
		var isCheck = record.getLineItemValue('payment', 'paymentmethod', i);
		var isPayment = record.getLineItemValue('payment', 'type', i);
		


		if(isDeposit == 'T' && isPayment == 'CustPymt') { //check payment method internalid
			
			var pymtRecID = record.getLineItemValue('payment', 'id', i)
		
			var pymtRec = nlapiLoadRecord('customerpayment', pymtRecID);
			
			var pymt_checkNum = pymtRec.getFieldValue('checknum');
			if(pymt_checkNum == '' || pymt_checkNum == null ) {
				pymt_checkNum = record.getLineItemValue('payment', 'refnum', i);
			}
			var pymt_bankAcc = pymtRec.getFieldValue('custbody_ilo_cust_account_number');
			var pymt_bankBranch = pymtRec.getFieldValue('custbody_ilo_cust_bank_branch');
			var pymt_bankNum = pymtRec.getFieldValue('custbody_ilo_cust_bank_number');
			var pymt_date = pymtRec.getFieldValue('custbody_ilo_cust_check_date');
			if(pymt_date == '' || pymt_date == null) {
				pymt_date = pymtRec.getFieldValue('trandate');
			}
			
			
			
			
			arr.push({

		
		amount : record.getLineItemValue('payment', 'paymentamount', i),
		checknum :  pymt_checkNum,
		bankAcc : pymt_bankAcc,
		bankNum : pymt_bankNum,
		bankBranch : pymt_bankBranch,
		pymtDate : pymt_date
		
		});
		}

		}
		

		var rec_tranName = record.getFieldValue('transactionnumber');
		var currency = record.getFieldValue('currency')
		var currency_symbol = '';
		if(currency == '5') { //internal id of ILS currency
			currency = 'ù"ç';
			currency_symbol = '¤';
		}
		nlapiLogExecution('debug', 'currency_symbol',currency_symbol )
		var depositTotal = record.getFieldValue('total')
		var depositMemo = record.getFieldValue('memo')
		if(depositMemo == null) {
			depositMemo = '';
		}
		var accountID = record.getFieldValue('account');
		var accountKey = nlapiLookupField('account', accountID, 'number');
		var accountName = nlapiLookupField('account', accountID, 'name');
		var accountDetails = nlapiLookupField('account', accountID, 'custrecord_ilo_acc_bank_details');
		var accountDetailsClean = accountDetails.split("\n").join("<br/>");
		var accountNameClean = accountName.split(":");
		var accName = accountNameClean[1];
		if(accName == undefined) {
			accName = accountNameClean[0];
		}
		
		
		var temp = nlapiLoadFile('1549').getValue();
		var a = temp.toString();
		
	
		
		var startlist = a.indexOf("--startlist--") +13 ; 
		var head = a.substr(0, startlist -13) ;
	    var endlist = a.indexOf("--endlist--")  ; 
		var list = a.substr(startlist, endlist-startlist);
		
		var restOfTemplate = a.substr(endlist +11, a.length );	

		var dynList = '';
	
		var lineCounter = arr.length;
		var lineNum = 0
		arr.forEach(function(check) {
			
			if(check.pymtDate == null) {
				check.pymtDate = '';
			}
			if(check.amount == null) {
				check.amount = '';
			}
			if(check.bankNum == null) {
				check.bankNum = '';
			}
			if(check.bankBranch == null) {
				check.bankBranch = '';
			}
			if(check.bankAcc == null) {
				check.bankAcc = '';
			}
			if(check.checknum == null) {
				check.checknum = '';
			}
			
			
			lineNum++
			
			var line = '<tr>';
	
			line += '<td align="center" colspan="2">' + lineNum + '</td>';
			line += '<td align="center" colspan="3">' + check.pymtDate + '</td>';
			line += '<td align="center" colspan="6">' + formatNumber(parseFloat(check.amount).toFixed(2)) + '</td>';
			line += '<td align="center" colspan="2">' + check.bankNum + '</td>';
			line += '<td align="center" colspan="3">' + check.bankBranch + '</td>';
			line += '<td align="center" colspan="3">' + check.bankAcc + '</td>';
			line += '<td align="center" colspan="3">' + check.checknum + '</td></tr>';
		    
			dynList+= line;
		
		});

				
		var allTemplate = head+dynList+restOfTemplate.toString();
		
		var pattern = /_deposit_trannum|_time|_date|_currency|_currency_symbol|_total|_totallines|_memo|_acc_number|_acc_name|_acc_details/ig;
		
									
								//Payee Information
								var _deposit_trannum = rec_tranName;
								var _time = todayTime();
								var _date = todayDate();
								var _currency = currency;
								var _currency_symbol = currency_symbol;
								var _total = parseFloat(depositTotal).toFixed(2);
								var _totallines = lineCounter;
								var _memo = depositMemo;
								var _acc_number = accountKey;
								var _acc_name = accName;
								var _acc_details = accountDetailsClean;
	
								
								
								var mapObj = {
								_deposit_trannum : _deposit_trannum,
								_time : _time,
								_date : _date,
								_currency : _currency,
								_currency_symbol : _currency_symbol,
								_total : formatNumber(_total),
								_totallines : _totallines,
								_memo : _memo,
								_acc_number : _acc_number,
								_acc_name : _acc_name,
								_acc_details : _acc_details,
								
	
							};
								

									var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
									    return mapObj[match];
									});
						
							
									//must clean all amps
//									var clean = str.replaceAll("&", "&amp;");
								
								
				
				
			nlapiLogExecution('debug', 'lineCount', lineCount)	
				
				
				
		//downloadData(allTemplate, response, rec_tranName);
		downloadDataPDF(str, response, rec_tranName)
		
	}

}


function downloadData(data, response, tranname) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'DEPOSIT #'+tranname+'.txt');
    // write response to the client
    response.write(data);
}

function downloadDataPDF(data, response, tranname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	 response.setContentType('PDF', 'DEPOSIT #'+tranname+'.pdf');
	response.write( file.getValue() ); 

}

function getAllDeposits() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('tranid');
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');

	var s = nlapiSearchRecord('deposit', null, filters, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				tranid : s[i].getValue('tranid'),
				internalid : s[i].id

			});

		}

	}

	return resultsArr;

}

function todayDate() { 
	var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; // January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		today = dd + '/' + mm + '/' + yyyy;
	  
	  return today;
	}	

	function todayTime() {
	  	var currentTime = new Date(),
	      hours = currentTime.getHours(),
	      minutes = currentTime.getMinutes();

		if (minutes < 10) {
		 minutes = "0" + minutes;
	  }

	var time = hours + ":" + minutes

	return time;
	  
	  
	}
	
	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.replace(new RegExp(search, 'g'), replacement);
	};
	
	function formatNumber (num) {
	    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
	}