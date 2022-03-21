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
  var tid = '';
  var lang = 'h';	  

function printForms_suitlet(request, response){
	
	if (request.getMethod() == 'GET') {
		//nlapiLogExecution('DEBUG', 'stage one', 'stage one');
		
		    tid = request.getParameter('tid');
		    lang = request.getParameter('l')
		    
		   
		   if(tid != null) {
			   buildPDF(tid,lang)
		   }
		   else{
	
		var form = nlapiCreateForm('Print Customer Refunds');
		form.addSubmitButton('Print');
		form.addFieldGroup('custpage_ilo_doctype', 'Type');
		var docType = form.addField('custpage_ilo_multi_doc', 'select', 'Document Type', null, 'custpage_ilo_doctype');
		docType.addSelectOption('a', 'Customer Refund');
		docType.setMandatory(true);
	
		form.addFieldGroup('custpage_ilo_choose_tran', 'Type');
		var recNumber = form.addField('custpage_ilo_select_record', 'select', 'Select Transaction', null, 'custpage_ilo_choose_tran');
		recNumber.setMandatory(true);
		var allRefunds = getAllRefunds();
		recNumber.addSelectOption('', '');
		for (var i = 0; i < allRefunds.length; i++) {
			recNumber.addSelectOption(allRefunds[i].internalid, allRefunds[i].tranid);
		}
	
		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');

		response.writePage(form);
		   }
	} 
	

	else if(request.getParameter('custpage_ilo_select_record') != '' ) { 
		
		var recid = request.getParameter('custpage_ilo_select_record');
		
		buildPDF(recid, lang)
	}

}


function downloadData(data, response, tranname) {
    // set content type, file name, and content-disposition (inline means display in browser)
	response.setEncoding('UTF-8');
    response.setContentType('PLAINTEXT', 'REFUND #'+tranname+'.txt');
    // write response to the client
    response.write(data);
}

function downloadDataPDF(data, response, tranname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	 response.setContentType('PDF', 'REFUND #'+tranname+'.pdf');
	response.write( file.getValue() ); 

}

function getAllRefunds() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('tranid').setSort(true);
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');

	var s = nlapiSearchRecord('customerrefund', null, filters, cols);

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
	
	function allCurrencies() {

		var sysExRates = [];
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('symbol', null, null);
		columns[1] = new nlobjSearchColumn('internalid', null, null);
		var search = nlapiSearchRecord('currency', null, null, columns);
		for (var i = 0; i < search.length; i++) {
			sysExRates.push({
				name : search[i].getValue(columns[0]),
				internalid : search[i].getValue(columns[1]),

			});
		}
		return sysExRates;
	}
	
	
	function allSubsids() {

		var subsids = [];
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('legalname', null, null);
		columns[1] = new nlobjSearchColumn('internalid', null, null);
		columns[2] = new nlobjSearchColumn('custrecord_kab_address_forms', null, null);
		columns[3] = new nlobjSearchColumn('custrecordil_tax_payer_id_subsidary', null, null);


		var search = nlapiSearchRecord('subsidiary', null, null, columns);
		for (var i = 0; i < search.length; i++) {
			subsids.push({
				name : search[i].getValue(columns[0]),
				internalid : search[i].getValue(columns[1]),
				address : search[i].getValue(columns[2]),
				taxpayer: search[i].getValue(columns[3])

			});
		}
		return subsids;
	}
	
	
	function buildPDF(recid, lang) {

		var temp;
		var record = nlapiLoadRecord('customerrefund', recid); // load the record to be added
 		var arr = [];
 		var lineCount = record.getLineItemCount('apply');
 
 		for(var i = 1; i<=lineCount; i++) {
 

 			var apply_date = record.getLineItemValue('apply', 'applydate', i)
 			var apply_type = record.getLineItemValue('apply', 'type', i)
			var apply_ref = record.getLineItemValue('apply', 'refnum', i)
			var apply_ogAmt = record.getLineItemValue('apply', 'total', i)
			var apply_amtRemain = record.getLineItemValue('apply', 'due', i)
			var apply_currency = record.getLineItemValue('apply', 'currency', i)
			var apply_payment = record.getLineItemValue('apply', 'amount', i)
 			
 			arr.push({

				date : apply_date,
				type : apply_type,
				refnum : apply_ref,
				ogAmt : formatNumber(apply_ogAmt),
				amtRemaining : formatNumber(apply_amtRemain),
				currency : apply_currency,
				payment : formatNumber(apply_payment)

			});

		}

		var rec_tranName = record.getFieldValue('tranid');
		var rec_date = record.getFieldValue('trandate')
		var currency = record.getFieldValue('currency')
		var customerid = record.getFieldValue('customer');
		var rec_address = record.getFieldValue('address')
		nlapiLogExecution('debug', 'rec_address', rec_address)
		var rec_total = record.getFieldValue('total')
		var paymentMethod = record.getFieldText('paymentmethod')
		var subsid = record.getFieldValue('subsidiary');
		var subsidLogo = '';
		if(subsid == "10" || subsid == "11") {
			subsidLogo = "https://system.eu2.netsuite.com/core/media/media.nl?id=706&amp;c=4947798&amp;h=bd2743cfafd2830662df";
		}
		if(subsid == "2" || subsid == "3") {
			
			subsidLogo = "https://system.eu2.netsuite.com/core/media/media.nl?id=705&amp;c=4947798&amp;h=1e923238efd30671c32b";
		}
		
		var allCurrencyArr = allCurrencies();
		var curr_symbol = ''
			for(var i = 0; i<allCurrencyArr.length; i++) {
				if(currency == allCurrencyArr[i].internalid) {
					curr_symbol = allCurrencyArr[i].name;
				}
			}


		var refundTotal = record.getFieldValue('total')
		var refundMemo = record.getFieldValue('memo')
		if(refundMemo == null) {
			refundMemo = '';
		}
		
		var subsid = record.getFieldValue('subsidiary');
		var allSubs = allSubsids();
		
		var subsidName = '';
		var subsidAddress = '';
		var subsidTaxpayerId = ''
		var subsidName_eng = '';
		var subsidAddress_eng = '';
		for(var i = 0; i<allSubs.length; i++) {
			
			if(subsid == allSubs[i].internalid) {
				
				 subsidName = allSubs[i].name;
				 subsidAddress = allSubs[i].address;
				 subsidTaxpayerId = allSubs[i].taxpayer;
			}
			
		}
	
		if(lang == null || lang == 'h') {
			 temp = nlapiLoadFile('701').getValue();
			 if(subsid == 11) {
				 subsidName = 'המכון לחקר הקבלה';
				 subsidAddress = '14 בן עמי';
				 subsidName_eng = 'Hamachon Leheker Hakabbalah';
				 subsidAddress_eng = 'Ben Ami 14';
			 }
			 if(subsid == 10) {
				 subsidName = '(1994) הוצאת המרכז ללימוד קבלה בע"מ';
				 subsidAddress = '14 בן עמי';
				 subsidName_eng = 'KABBALAH LEARNING CENTER PUBLICATIONS (1994) LTD.';
				 subsidAddress_eng = 'Ben Ami 14';
			 }
		}
		if(lang == 'e') {
			 temp = nlapiLoadFile('750').getValue();
		}
		var a = temp.toString();
		
	
		
		var startlist = a.indexOf("--startlist--") +13 ; 
		var head = a.substr(0, startlist -13) ;
	    var endlist = a.indexOf("--endlist--")  ; 
		var list = a.substr(startlist, endlist-startlist);
		
		var restOfTemplate = a.substr(endlist +11, a.length );	
		var allTemplate = head+restOfTemplate.toString();
		var dynList = '';

		var lineCounter = arr.length;
		var lineNum = 0
		var row;
		
		if(lang == null || lang == 'h') {
		arr.forEach(function(line) {
			
			if(line.date == null) {
				line.date = '';
			}
			if(line.type == null) {
				line.type = '';
			}
			if(line.refnum == null) {
				line.refnum = '';
			}
			if(line.ogAmt == null) {
				line.ogAmt = '';
			}
			if(line.amtRemaining == null) {
				line.amtRemaining = '';
			}
			if(line.currency == null) {
				line.currency = '';
			}
			if(line.payment == null) {
				line.payment = '';
			}
			
			
			lineNum++
			
			 row = '<tr>';
	
		
			row += '<td align="center" colspan="4">' + line.payment + '</td>';
			row += '<td align="center" colspan="3">' + line.currency + '</td>';
			row += '<td align="center" colspan="4">' + line.amtRemaining + '</td>';
			row += '<td align="center" colspan="4">' + line.ogAmt + '</td>';
			row += '<td align="center" colspan="4">' + line.refnum + '</td>';
			row += '<td align="center" colspan="4">' + line.type + '</td>';
			row += '<td align="center" colspan="4">' + line.date + '</td></tr>';
			
		
			dynList+= row;
		
		});
		}
		
		if(lang == 'e') {
			
			nlapiLogExecution('debug', 'lang=e arr', JSON.stringify(arr))
			arr.forEach(function(line) {
				
				if(line.date == null) {
					line.date = '';
				}
				if(line.type == null) {
					line.type = '';
				}
				if(line.refnum == null) {
					line.refnum = '';
				}
				if(line.ogAmt == null) {
					line.ogAmt = '';
				}
				if(line.amtRemaining == null) {
					line.amtRemaining = '';
				}
				if(line.currency == null) {
					line.currency = '';
				}
				if(line.payment == null) {
					line.payment = '';
				}
				
				
				lineNum++
				
				 row = '<tr>';
		
			
				row += '<td align="center" colspan="4">' + line.date + '</td>';
				row += '<td align="center" colspan="4">' + line.type + '</td>';
				row += '<td align="center" colspan="4">' + line.refnum + '</td>';
				row += '<td align="center" colspan="4">' + line.ogAmt + '</td>';
				row += '<td align="center" colspan="4">' + line.amtRemaining + '</td>';
				row += '<td align="center" colspan="3">' + line.currency + '</td>';
				row += '<td align="right" colspan="4">' + line.payment + '</td></tr>';
				
			
				dynList+= row;
			
			});
			}
				
		var allTemplate = head+dynList+restOfTemplate.toString();
		
		var pattern = /_subsidiary_name|_subsidiary_address|_subsidiary_taxpayerid|_rec_tranid|_rec_date|_rec_address|_curr_symbol|_rec_total|_rec_memo|_subsidiary_logo|_payment_method|_subsidiary_name_eng|_subsidiary_address_eng/ig;
//		
//									
//								//Header Information
								var _subsidiary_name = subsidName;
								var _subsidiary_address = subsidAddress;
								var _subsidiary_taxpayerid = subsidTaxpayerId;
								var _rec_tranid = rec_tranName;
								var _rec_date = rec_date;
								var _rec_address = rec_address;
								
								var _curr_symbol = curr_symbol;
								var _rec_total = formatNumber(rec_total);
								var _rec_memo = refundMemo;
								var _subsidiary_logo = subsidLogo;
								var _payment_method = paymentMethod;
								var _subsidiary_address_eng = subsidAddress_eng;
								var _subsidiary_name_eng = subsidName_eng;
	
								
								
								var mapObj = {
										_subsidiary_name : _subsidiary_name,
										_subsidiary_address : _subsidiary_address,
										_subsidiary_taxpayerid : _subsidiary_taxpayerid,
										_rec_tranid : _rec_tranid,
										_rec_date : _rec_date,
										_rec_address : _rec_address,
										_curr_symbol : _curr_symbol,
										_rec_total : _rec_total,
										_rec_memo : _rec_memo,
										_subsidiary_logo: _subsidiary_logo,
										_payment_method: _payment_method,
										_subsidiary_address_eng : _subsidiary_address_eng,
										_subsidiary_name_eng : _subsidiary_name_eng
										
					
								
	
							};
								

									var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
									    return mapObj[match];
									});
						
							
									//must clean all amps
//									var clean = str.replaceAll("&", "&amp;");
								

		downloadDataPDF(str, response, rec_tranName);
		}//end of buildPDF