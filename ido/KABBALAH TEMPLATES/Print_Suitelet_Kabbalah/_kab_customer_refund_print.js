	function buildRefundPDF(internalid) {
	 
	
		var record = nlapiLoadRecord('customerrefund', internalid); // load the record to be added
  
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
		var rec_total = record.getFieldValue('total')
		
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
		for(var i = 0; i<allSubs.length; i++) {
			
			if(subsid == allSubs[i].internalid) {
				
				 subsidName = allSubs[i].name;
				 subsidAddress = allSubs[i].address;
				 subsidTaxpayerId = allSubs[i].taxpayer;
			}
			
		}

				
		var temp = nlapiLoadFile('613').getValue();
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
			
			var row = '<tr>';
	
			row += '<td align="center" colspan="4">' + line.payment + '</td>';
			row += '<td align="center" colspan="3">' + line.currency + '</td>';
			row += '<td align="center" colspan="4">' + line.amtRemaining + '</td>';
			row += '<td align="center" colspan="4">' + line.ogAmt + '</td>';
			row += '<td align="center" colspan="4">' + line.refnum + '</td>';
			row += '<td align="center" colspan="4">' + line.type + '</td>';
			row += '<td align="center" colspan="4">' + line.date + '</td></tr>';
		    
			dynList+= row;
		
		});

				
		var allTemplate = head+dynList+restOfTemplate.toString();
		
		var pattern = /_subsidiary_name|_subsidiary_address|_subsidiary_taxpayerid|_rec_tranid|_rec_date|_rec_address|_curr_symbol|_rec_total|_rec_memo/ig;
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
					
								
	
							};
								

									var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function(i, match) {
									    return mapObj[match];
									});
						

		return str;
		
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