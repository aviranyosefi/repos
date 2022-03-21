
function printBankTransfer(request, response){

var tempString =  '   <!--?xml version="1.0" ?-->  '  + 
'   <!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">  '  + 
'   <pdf>  '  + 
'   <head>  '  + 
'     <link name="sans-serif" type="font" subtype="truetype" src="  https://system.eu2.netsuite.com/c.4969978/suitebundle149431/Fonts/Heb-Regular.ttf"/>  '  + 
'     '  + 
'       <style type="text/css">  '  + 
'           b {  '  + 
'               color: #444;  '  + 
'               font-weight: bold;  '  + 
'           }  '  + 
'     '  + 
'           table {  '  + 
'               margin-top: 10px;  '  + 
'               font-family: sans-serif;  '  + 
'               font-size: 10pt;  '  + 
'               table-layout: fixed;  '  + 
'               width: 100%;  '  + 
'           }  '  + 
'           th {  '  + 
'               font-size: 8pt;  '  + 
'               vertical-align: middle;  '  + 
'               text-align: center;  '  + 
'               padding-top: 5px;  '  + 
'               padding-right: 6px;  '  + 
'               padding-left: 6px;  '  + 
'               padding-bottom: 3px;  '  + 
'               color: #333333;  '  + 
'           }  '  + 
'           td {  '  + 
'               padding-bottom: 4px;  '  + 
'               padding-top: 4px;  '  + 
'               padding-right: 6px;  '  + 
'               padding-left: 6px;  '  + 
'               text-overflow: ellipsis;  '  + 
'               word-wrap: break-word;  '  + 
'           }  '  + 
'     '  + 
'           table.body td {  '  + 
'               padding-top: 2px;  '  + 
'           }  '  + 
'           table.linetb {  '  + 
'               border: 1px solid;  '  + 
'               table-layout: fixed;  '  + 
'               border-collapse: collapse;  '  + 
'               margin-left: 10px;  '  + 
'                 margin-right: 10px;  '  + 
'           }  '  + 
'           table.header td {  '  + 
'               font-size: 7pt;  '  + 
'               padding: 0px;  '  + 
'           }  '  + 
'           table.footer td {  '  + 
'               font-size: 8pt;  '  + 
'               padding: 0px;  '  + 
'           }  '  + 
'           table.linetb th {  '  + 
'               background-color: #fff;  '  + 
'               border: 1px solid;  '  + 
'               padding-bottom: 10px;  '  + 
'               padding-top: 10px;  '  + 
'           }  '  + 
'           table.linetb td {  '  + 
'               border: 1px solid;  '  + 
'               text-overflow: ellipsis;  '  + 
'               word-wrap: break-word;  '  + 
'           }  '  + 
'           td.default {  '  + 
'               font-size: 9pt;  '  + 
'               padding-top: 0px;  '  + 
'               padding-bottom: 0px;  '  + 
'           }  '  + 
'     '  + 
'           table.linetb_Total {  '  + 
'               table-layout: fixed;  '  + 
'               border-collapse: collapse;  '  + 
'               page-break-inside: avoid;  '  + 
'               font-size: 10pt;  '  + 
'                    margin-left: 10px;  '  + 
'                 margin-right: 10px;  '  + 
'           }  '  + 
'               table.linetb_Total td {  '  + 
'                   border: 1px solid;  '  + 
'                   text-overflow: ellipsis;  '  + 
'                   word-wrap: break-word;  '  + 
'                   background-color: #edeaea;  '  + 
'               }  '  + 
'           hr {  '  + 
'               height: 1px;  '  + 
'               width: 100%;  '  + 
'                  margin-left: 10px;  '  + 
'                 margin-right: 10px;  '  + 
'               color: #d3d3d3;  '  + 
'               background-color: #d3d3d3;  '  + 
'           }  '  + 
'       </style>  '  + 
'         '  + 
'               <macrolist>        '  + 
'           <macro id="nlheader">  '  + 
'             '  + 
'     '  + 
'     '  + 
'            <table border="0" cellpadding="0" class="header" style="margin-right: 10px"><tr>  '  + 
'   <td width="700px" align="left"><img src="{{_company_logo}}"  style="float: left;" /><p style="font-size:19px; line-height: 10px;"></p></td>  '  + 
'           <td width="700px" align="right">  '  + 
'          <p style="font-size: 2em;">{{_subsidiary_legalname}} </p>  '  + 
'           <p style="font-size: 10pt;  text-align:right; ">יגיע כפיים 21 ד , קרית-אריה  '  + 
'   <br/>ת.ד. 3194  '  + 
'   <br/>פתח תקווה 4913020  '  + 
'   <br/> 03-9275005 :טלפון: 03-9275000 פקס  '  + 
'   <br/>{{_subsidiary_custrecordil_tax_payer_id_subsidary}} : עוסק מורשה<br/>{{_subsidiary_custrecordil_tiknik}} : מס. תיק ניכויים </p>   '  + 
'     '  + 
'     </td>  '  + 
'     </tr>  '  + 
'   </table>  '  + 
'   <hr/>  '  + 
'     '  + 
'           </macro>      '  + 
'                           <macro id="nlfooter">  '  + 
'               <table style="width:100%;">  '  + 
'            <tr>  '  + 
'               <td colspan="2" align="right"><img width="60px" height="60px" src="https://system.eu1.netsuite.com/core/media/media.nl?id=41775&amp;c=4619195_SB2&amp;h=10b2c3fc699b5f488170"></img></td>  '  + 
'            </tr>  '  + 
'            </table>	  '  + 
'               <table style="width: 100%; font-size: 8pt;"><tr>  '  + 
'   	            <td align="right" style="padding: 0;"><pagenumber/> of <totalpages/></td>  '  + 
'   	            </tr></table>  '  + 
'            </macro>  '  + 
'       </macrolist>  '  + 
'         '  + 
'                       </head>  '  + 
'                         '  + 
'     '  + 
'                   <body padding="0.2in 0.5in 0.05in 0.5in" size="A4" header="nlheader" header-height="180px" header-width="80%" footer="nlfooter" footer-height="120px">            '  + 
'                 '  + 
'     <table style="width: 100%; top: -4%">  '  + 
'    <tr>  '  + 
'      '  + 
'   <td>  '  + 
'       <table style="width:250px;">  '  + 
'     	<tr>  '  + 
'     	        	<td align="left">  '  + 
'          <p style="line-height: 5px;">{{_record_trandate}}</p></td>  '  + 
'     	<td align="right">  '  + 
'          <p style="line-height: 5px;">תאריך הוראה :</p></td>  '  + 
'     		</tr>  '  + 
'     		  		  	<tr>  '  + 
'           	<td align="left">  '  + 
'          <p style="line-height: 5px;">{{_now_date}}</p></td>  '  + 
'            	<td align="right">  '  + 
'          <p style="line-height: 5px;">תאריך הדפסה :</p></td>  '  + 
'     		</tr>  '  + 
'     		  		  		  	<tr>  '  + 
'           	<td align="left">  '  + 
'          <p style="line-height: 5px;">{{_now_time}}</p></td>  '  + 
'            	<td align="right">  '  + 
'          <p style="line-height: 5px;">שעת הדפסה :</p></td>  '  + 
'     		</tr>  '  + 
'   		  '  + 
'     '  + 
'     	  '  + 
'     '  + 
'     '  + 
'     		  '  + 
'   </table>  '  + 
'   </td>  '  + 
'    <td>  '  + 
'      <table style="width:320px; left:85px; top: -5%">  '  + 
'     <thead>  '  + 
'   	<tr>  '  + 
'           <th colspan="6"><p style="width: 100%; text-align:left; font-size: 10pt; left:180px;">לכבוד :</p></th>  '  + 
'             <th colspan="6"><p style="width: 100%; text-align:right; line-height: 18px; font-size: 10pt;"></p></th>  '  + 
'            <th colspan="4"><p style="width: 100%; text-align:right; line-height: 18px; font-size: 10pt;"></p></th>      '  + 
'   	</tr>  '  + 
'   </thead>  '  + 
'     '  + 
'         <tr>  '  + 
'       </tr>  '  + 
'       <tr>  '  + 
'       <td colspan="6" class="default"><p style="text-align: right; width: 220px; font-size: 10pt;">{{_billTo}}</p></td>  '  + 
'           <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br/><br/><br/></p> </td>  '  + 
'                   <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br/><br/><br/></p> </td>  '  + 
'       </tr>  '  + 
'     '  + 
'          '  + 
'   </table>  '  + 
'   </td>  '  + 
'   </tr>  '  + 
'     '  + 
'   </table>  '  + 
'     '  + 
'          <table style="width:100%; top:-2%;">  '  + 
'       <tr>  '  + 
'             <td align="center" class="default" style="text-align: center; font-size:1.2em;">  '  + 
'          <u>{{_record_transactionnumber}} :'+'הוראת העברה מס</u></td>  '  + 
'       </tr>  '  + 
'   </table>  '  + 
'     '  + 
'     '  + 
'   <table class="linetb" style="width:670px;"><!-- start items -->  '  + 
'     '  + 
'   	<tr>  '  + 
'   	<td colspan="12"><p style="width: 100%; text-align:right;">&nbsp;על פי הפרוט להלן:<b>{{_record_trandate}}</b>&nbsp;נא לבצע העברה בנקאית בתאריך</p></td>   '  + 
'   	</tr>  '  + 
'   	<tr>  '  + 
'   	<td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:right;"><span style="font-size: 1.2em"><u>חשבון לזיכוי</u></span>  '  + 
'   	<br/><br/>  '  + 
'   	  '  + 
'   	{{_receiverdetails_}}  '  + 
'   	  '  + 
'     '  + 
'   	<br/><br/>  '  + 
'   	</p></td>   '  + 
'     '  + 
'   	  '  + 
'     '  + 
'   	<td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:right;"><span style="font-size: 1.2em"><u>חשבון לחיוב</u></span>  '  + 
'   	<br/><br/>  '  + 
'   	מס. חשבון: {{_record_account_custrecord_bank_account_gl}}<br/>  '  + 
'   	על שם:  קווליטסט בע"מ <br/>  '  + 
'   	בנק: {{_record_bankname}}<br/>  '  + 
'   	סניף: {{_record_bankbranch}}<br/>  '  + 
'   	<br/><br/>  '  + 
'   	</p></td>   '  + 
'     '  + 
'   	</tr>  '  + 
'   	<tr>  '  + 
'   		<td colspan="12"><p style="width: 100%; text-align:right;">{{_record_totalamt}}<br/>  '  + 
'   		{{_record_totalamt_words}}  '  + 
'   		</p></td>   '  + 
'   	</tr>  '  + 
'     '  + 
'   </table>  '  + 
'     '  + 
'       <table class="linetb_Total" style="width:100%; text-align:right; margin-left: 100px; margin-top: 100px;"><!-- start items -->  '  + 
'     '  + 
'           	       <tr>    '  + 
'       <td rowspan="3" colspan="14" align="left" style="background-color:#fff; border: 1px solid white; ">  '  + 
'     <span style="margin-left: 40px;">  '  + 
'   חתימה:</span>  '  + 
'    <br />  '  + 
'    קווליטסט בע"מ  '  + 
'        '  + 
'     '  + 
'     </td>  '  + 
'     </tr>      '  + 
'   </table>  '  + 
'           '  + 
'               </body>  '  + 
'   </pdf>  '  + 
'    ' ; 
	
	
	
	
	var recID = request.getParameter('tid');
	nlapiLogExecution('debug', 'internalid', 'id = ' + recID);

	
	var record = nlapiLoadRecord('vendorpayment', recID); // load the record to be added
	
//////////Vendor Details Variables//////////
	var vendorID = record.getFieldValue('entity');
	var vendorName;
	var vendorAddressName;
	var vendorBankDetails;
	var vendorBankAccount;
	var vendorBankName;
	var vendorBankCode;
	var vendorBankBranch;
	var vendorAddress;
	var vendorBIC;
	var vendorABA;
	var vendorIBAN;
	var vendorLegalName;
	var vendorBankAccountName;
	
	
	var receiverDetails = '';
//////////Vendor Details Variables//////////
	
	//var temp = nlapiLoadFile('42121').getValue();
	var a = tempString
	
	
	///Subsidiary Details//
	var subsid = record.getFieldValue('subsidiary');
	var subsid_address = nlapiLookupField('subsidiary', subsid, 'custrecord_ilo_subsid_hebrew_address');
	var subsid_tiknik = nlapiLookupField('subsidiary', subsid, 'custrecordil_tiknik');
	var subsid_vatreg = nlapiLookupField('subsidiary', subsid, 'custrecordil_tax_payer_id_subsidary');
	var subsid_rec = nlapiLoadRecord('subsidiary', subsid);
	var logoFileRec = subsid_rec.getFieldValue('logo');
	var logoFileURL = nlapiLoadFile(logoFileRec).getURL();
	nlapiLogExecution('debug', 'logoFileURL', logoFileURL)
	
	
	//Header Details//
	var trandate = ' '+record.getFieldValue('trandate')+' ';
	var today = new Date();
	var printDate = nlapiDateToString(today)
	var printTime = timeNow();
	var tranid = record.getFieldValue('transactionnumber')
	
	//Qualitest Bank Details
	var accRecID = record.getFieldValue('account');
	var accRec = nlapiLoadRecord('account', accRecID);
	var ILBankDetailsRecId = accRec.getFieldValue('custrecord_il_bank_details');
	var ILBankRec = nlapiLoadRecord('customrecord_ilo_bank_details', ILBankDetailsRecId);
	var bankName = ILBankRec.getFieldValue('custrecord_ilo_bank_detail_name');
	var bankBranch = ILBankRec.getFieldValue('custrecord_ilo_bank_details_branch_num');
	var bankAccNumber = accRec.getFieldValue('custrecord_bank_account_gl');
	var billTo = bankName+'<br/> סניף : '+ bankBranch
	
	//Vendor Bank Details
	var checkIfLocal = nlapiLookupField('vendor', vendorID, 'custentityil_tax_payer_id')
	if(checkIfLocal != '999999999') { // Israeli Vendor	
		var vendRec = nlapiLoadRecord('vendor', vendorID)
	
		 vendorAddressName = nlapiLookupField('vendor', vendorID, 'billaddressee')
		 vendorBankDetails = getVendorBankDetails(vendorID, trandate);
		 //vendorBankAccountName = vendorBankDetails[0].bankAccountName;
		 vendorName = vendorBankDetails[0].bankAccountName;
		 vendorBankAccount = vendorBankDetails[0].bankAccount;
		 vendorBankName = vendorBankDetails[0].bankName;
		 vendorBankCode = vendorBankDetails[0].bankCode;
		 vendorBankBranch = vendorBankDetails[0].bankBranch;
		 vendorAddress = nlapiLookupField('vendor', vendorID, 'address').replace(vendorAddressName, '').replace('Israel', '')
		 
		 nlapiLogExecution('debug', 'vendorName', vendorName)
		 if(vendorName == '') {
			 vendorName = vendRec.getFieldValue('legalname')
		 }
		  
		 
		 receiverDetails = '	מס. חשבון: '+vendorBankAccount+'<br/>'+
							'	על שם: '+vendorName+'<br/>'+
							'	בנק: '+vendorBankName+'<br/>'+
							'	קוד בנק: '+vendorBankCode+'<br/>'+
							'	סניף: '+vendorBankBranch+'<br/>';

	}
	if(checkIfLocal == '999999999') { // Foreign Vendor	
		
		var vendorRec = nlapiLoadRecord('vendor', vendorID)
		 vendorName = vendorRec.getFieldValue('custentity_ilo_bank_account_name')
		 if(vendorName ==  null) {
			 vendorName = '' 
		 }
		 vendorAddressName = vendorRec.getFieldValue('billaddressee')
		 		 if(vendorAddressName ==  null) {
		 			vendorAddressName = '' 
		 }
		 vendorBankAccount = vendorRec.getFieldValue('custentity_ilo_bank_account_number')
		 		 if(vendorBankAccount ==  null) {
		 			vendorBankAccount = '' 
		 }
		 vendorBankName = vendorRec.getFieldValue('custentity_ilo_bank_name')
		 		 if(vendorBankName ==  null) {
		 			vendorBankName = '' 
		 }
		 vendorBIC = vendorRec.getFieldValue('custentity_ilo_bank_swift_code')
		 		 if(vendorBIC ==  null) {
		 			vendorBIC = '' 
		 }
		 vendorABA = vendorRec.getFieldValue('custentity_il_aba_number')
 		 if(vendorABA ==  null) {
 			vendorABA = '' 
 }
		 vendorIBAN = vendorRec.getFieldValue('custentity_ilo_iban')
 		 if(vendorIBAN ==  null) {
 			vendorIBAN = '' 
 }
		 vendorBankBranch = vendorRec.getFieldValue('custentity_ilo_bank_branch_number')
		 		 if(vendorBankBranch ==  null) {
		 			vendorBankBranch = '' 
		 }
		 vendorAddress = vendorRec.getFieldValue('custentity_ilo_bank_account_address')
		 		 if(vendorAddress ==  null) {
		 			vendorAddress = '' 
		 }
		 
		 var BIC_IBAN_ABA = ''
			 if(vendorBIC != '') {
				 BIC_IBAN_ABA += 	'	'+vendorBIC+' :BIC/SWIFT<br/>';		 
			 }
		 if(vendorABA != '') {
			 BIC_IBAN_ABA += 	'	'+vendorABA+' :ABA<br/>';		 
		 }
		 if(vendorIBAN != '') {
			 BIC_IBAN_ABA += 	'	'+vendorIBAN+' :IBAN<br/>';		 
		 }

		 nlapiLogExecution('debug', 'BIC_IBAN_ABA', BIC_IBAN_ABA)
		 
		 receiverDetails = '	מס. חשבון: '+vendorBankAccount+'<br/>'+
			'	 '+vendorName+' :על שם<br/>'+
			'	 '+vendorBankName+' :בנק<br/>'+
			'	'+vendorBankBranch+' :סניף<br/>'+
		BIC_IBAN_ABA;				    

	}
	


	
	//Total Amount Fields
	var totalAmt = '';
	var amt = record.getFieldValue('custbody_ilo_net_amount')
	var totalInWords = ''
	var amtWords = record.getFieldValue('custbody_ilo_total_words_2')
	var currencyID = record.getFieldValue('currency')
	var currencySymbol = getCurrencySymbol(currencyID)
	var curr_symbol = currencySymbol[0].curr_name;
	if(curr_symbol === 'ILS') {
		totalAmt = 	'סכום: ₪'+ amt;
		totalInWords = 'סכום במילים: '+amtWords
	}
	
	if( curr_symbol != 'ILS') {
		
		totalAmt = 	curr_symbol+' '+ amt +' :סכום';
		var totalNotShekels = amtWords.replace('אגורות', 'סנטים')
		totalInWords = ''
	}
	

	var pattern = /_subsidiary_legalname|_subsidiary_custrecord_ilo_subsid_hebrew_address|_subsidiary_custrecordil_tax_payer_id_subsidary|_subsidiary_custrecordil_tiknik|_record_trandate|_now_date|_now_time|_billTo|_record_transactionnumber|_record_account_custrecord_bank_account_gl|_record_bankname|_record_bankbranch|_receiverdetails_|_vendor_address|_curr_symbol|_record_totalamt|_record_totalamt_words|_company_logo/ig;

	var _subsidiary_legalname = 'קווליטסט בע"מ';
	var _subsidiary_custrecord_ilo_subsid_hebrew_address = subsid_address;
	var _subsidiary_custrecordil_tax_payer_id_subsidary = subsid_vatreg;
	var _subsidiary_custrecordil_tiknik = subsid_tiknik;
	var _record_trandate = trandate;
	var _now_date = printDate;
	var _now_time = printTime;
	var _billTo = billTo;
	var _record_transactionnumber = tranid;
	var _record_account_custrecord_bank_account_gl = bankAccNumber
	var _record_bankname = bankName
	var _record_bankbranch = bankBranch
	var _receiverdetails_ = receiverDetails
	var _curr_symbol = curr_symbol
	var _record_totalamt = totalAmt
	var _record_totalamt_words = totalInWords
	var _company_logo = 'http://content.netsuite.com'+logoFileURL.replaceAll('&', '&amp;')
	
	var mapObj = {
			_subsidiary_legalname : _subsidiary_legalname,
			_subsidiary_custrecord_ilo_subsid_hebrew_address : _subsidiary_custrecord_ilo_subsid_hebrew_address,
			_subsidiary_custrecordil_tax_payer_id_subsidary : _subsidiary_custrecordil_tax_payer_id_subsidary,
			_subsidiary_custrecordil_tiknik : _subsidiary_custrecordil_tiknik,
			_record_trandate : _record_trandate,
			_now_date : _now_date,
			_now_time : _now_time,
			_billTo : _billTo,
			_record_transactionnumber : _record_transactionnumber,
			_record_account_custrecord_bank_account_gl : _record_account_custrecord_bank_account_gl,
			_record_bankname : _record_bankname,
			_record_bankbranch: _record_bankbranch,
			_curr_symbol : _curr_symbol,
			_record_totalamt : _record_totalamt,
			_record_totalamt_words : _record_totalamt_words,
			_receiverdetails_ : _receiverdetails_,
			_company_logo: _company_logo
	
};
	

		var str = a.replace(/\{\{(.*?)\}\}/g, function(i, match) {
		    return mapObj[match];
		});
	 
	downloadDataPDF(str, response, 'test');
}



function downloadDataPDF(data, response, tranname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	 response.setContentType('PDF', 'DEPOSIT #'+tranname+'.pdf', 'inline');
	response.write(file.getValue()); 
}


function getVendorBankDetails(vendorID, trandate) {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ilo_vendor_bank_vendor', null, 'anyof', vendorID);

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('custrecord_ilo_bank_details_account')
	cols[1] = new nlobjSearchColumn('custrecord_ilo_bank_detail_name', 'custrecord_ilo_vendor_bank_bank');
	cols[2] = new nlobjSearchColumn('custrecord_ilo_bank_details_number', 'custrecord_ilo_vendor_bank_bank');
	cols[3] = new nlobjSearchColumn('custrecord_ilo_bank_details_branch_num', 'custrecord_ilo_vendor_bank_bank');
	cols[4] = new nlobjSearchColumn('custrecord_ilo_bank_account_name');
	cols[5] = new nlobjSearchColumn('custrecord_ilo_vendor_bank_from');
	cols[6] = new nlobjSearchColumn('custrecord_ilo_vendor_bank_to');


	var search = nlapiSearchRecord('customrecord_ilo_vendor_bank', null, filters, cols);
	var results = [];
		
	if (search != null) {
		search.forEach(function(line) {
		
		var fromDate = nlapiStringToDate(line.getValue('custrecord_ilo_vendor_bank_from'))
		var toDate = nlapiStringToDate(line.getValue('custrecord_ilo_vendor_bank_to'))
		
		
		var tranDate = nlapiStringToDate(trandate)
			
			if(tranDate >= fromDate && (tranDate <= toDate || toDate == null)) {
			
			
						results.push({
			
			bankName : line.getValue('custrecord_ilo_bank_detail_name', 'custrecord_ilo_vendor_bank_bank'),
			bankCode : line.getValue('custrecord_ilo_bank_details_number', 'custrecord_ilo_vendor_bank_bank'),
			bankBranch : line.getValue('custrecord_ilo_bank_details_branch_num', 'custrecord_ilo_vendor_bank_bank'),
			bankAccount :  line.getValue('custrecord_ilo_bank_details_account'),
			bankAccountName : line.getValue('custrecord_ilo_bank_account_name'),
			fromDate : line.getValue('custrecord_ilo_vendor_bank_from'),
			toDate : line.getValue('custrecord_ilo_vendor_bank_to'),
			});
			
			
			
			}
			

		});

	};
	
	return results;
}

function getCurrencySymbol(currency) {

	var sysExRates = [];
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', currency);
	
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('symbol', null, null);

	var search = nlapiSearchRecord('currency', null, filters, columns);
	for (var i = 0; i < search.length; i++) {
		sysExRates.push({
			curr_name : search[i].getValue(columns[0]),
		});
	}
	return sysExRates;
}

function timeNow() {
	  var d = new Date();
	  d.addHours(10);
	    h = (d.getHours()<10?'0':'') + d.getHours();
	    m = (d.getMinutes()<10?'0':'') + d.getMinutes();
	  return h + ':' + m;
	}
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
