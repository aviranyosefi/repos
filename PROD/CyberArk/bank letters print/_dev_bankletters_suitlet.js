function printLetters(request, response){
	
	 if ( request.getMethod() == 'GET' )  {
		 
		 
	 		var billID = request.getParameter('billid');
	 		var printType = request.getParameter('printtype');
	 		
	 		var subsidRec = nlapiLoadRecord('subsidiary', 22) //ISR Subsidiary
	 		var subsidEngAddress = subsidRec.getFieldValue('custrecord_ilo_subsid_eng_address')
	 		

	 		var subsidHebAddress = subsidRec.getFieldValue('custrecord_ilo_subsid_hebrew_address');
	 		var subsidTaxPayerId = subsidRec.getFieldValue('custrecordil_tax_payer_id_subsidary');
	 		var subsidVATRegNum = subsidRec.getFieldValue('federalidnumber');
	 		
	 		var companyLogo = subsidRec.getFieldValue('pagelogo')
	 		var logoURL = nlapiLoadFile(companyLogo).getURL()

	 		var currentRec = nlapiLoadRecord('vendorpayment', billID);
	 		var currMemo = currentRec.getFieldValue('memo')
	 		var currCurrency = currentRec.getFieldValue('currency');
	 		var currencyRec = nlapiLoadRecord('currency', currCurrency);
	 		var currencySymbol = currencyRec.getFieldValue('displaysymbol');
	 		var currPayDate = currentRec.getFieldValue('trandate');
	 		var currTranNumber = currentRec.getFieldValue('tranid');
	 		var vendorID = currentRec.getFieldValue('entity')
	 		var vendorNumber = nlapiLookupField('vendor', vendorID, 'entitynumber');
 			var vendorBankDetails = getVendorBankDetails(vendorID)
	 		var currTotal = currentRec.getFieldValue('total')
	 		var currTotalFormat = formatMoney(currTotal)
	 		//currTotalFormat = currTotalFormat.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
	 		
	 		var exRate = '';
 			var accBookDetailLineCount = currentRec.getLineItemCount('accountingbookdetail');
 			if(accBookDetailLineCount != 0) {
 				for(var i = 0; i<accBookDetailLineCount; i++) {
 					exRate = currentRec.getLineItemValue('accountingbookdetail', 'exchangerate', i+1)
 				}
 			}
	 		
	 		var totalInWords_hebrew = currentRec.getFieldValue('custbody_ilo_total_words')
	 		
	 		var vendorVATNumber = nlapiLookupField('vendor', vendorID, 'vatregnumber');
 			var printLang = 'hebrew';
 			if(vendorVATNumber == '999999999' || vendorVATNumber == '' || vendorVATNumber == null || vendorVATNumber == undefined) {
 				printLang = 'english'
 			}
	 		
	 		var accountRec = nlapiLoadRecord('account', currentRec.getFieldValue('account'));
	 		
	 		var accountName = accountRec.getFieldValue('acctname')
            var accountDetails = accountRec.getFieldValue('custrecord_dev_bank_acc_details')
            if(accountDetails == '' || accountDetails == null || accountDetails == undefined) {
              accountDetails = ''
            }
            var accountBranch = accountRec.getFieldValue('description')
	 		
	 		if(printType == 'forbank') {
	 			
	 	
	 		var forBankString =  '   <!--?xml version="1.0" ?-->  '  + 
	 		 '   <!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">  '  + 
	 		 '   <pdf>  '  + 
	 		 '   <head>  '  + 
	 		 '     <link name="sans-serif" type="font" subtype="truetype" src="https://4678143-sb2.app.netsuite.com/c.4678143_SB2/suitebundle46541/Localization-IL/Fonts/Heb-Regular.ttf"/>  '  + 
	 		 '       <style type="text/css">  '  + 
	 		 '           b {  '  + 
	 		 '               color: #444;  '  + 
	 		 '               font-weight: bold;  '  + 
	 		 '           }  '  + 
	 		 '           table {  '  + 
	 		 '               margin-top: 10px;  '  + 
	 		 '               font-family: sans-serif;  '  + 
	 		 '               font-size: 9pt;  '  + 
	 		 '               table-layout: fixed;  '  + 
	 		 '               width: 100%;  '  + 
	 		 '           }  '  + 
	 		 '           th {            '  + 
	 		 '               font-size: 8pt;  '  + 
	 		 '               vertical-align: middle;  '  + 
	 		 '               text-align : center;  '  + 
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
	 		 '                 word-wrap:break-word;  '  + 
	 		 '           }  '  + 
	 		 '           table.body td {  '  + 
	 		 '               padding-top: 2px;      '  + 
	 		 '           }  '  + 
	 		 '           table.linetb {  '  + 
	 		 '               border: 1px solid;  '  + 
	 		 '               table-layout: fixed;  '  + 
	 		 '               border-collapse: collapse;  '  + 
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
	 		 '               padding-top: 10px;              '  + 
	 		 '           }  '  + 
	 		 '           table.linetb td {  '  + 
	 		 '               border: 1px solid;  '  + 
	 		 '               text-overflow: ellipsis;  '  + 
	 		 '                  word-wrap:break-word;  '  + 
	 		 '           }  '  + 
	 		 '           td.default {  '  + 
	 		 '               font-size: 9pt;  '  + 
	 		 '               padding-top: 0px;  '  + 
	 		 '               padding-bottom: 0px;  '  + 
	 		 '           }  '  + 
	 		 '           table.total {  '  + 
	 		 '               page-break-inside: avoid;  '  + 
	 		 '               font-size: 10pt;  '  + 
	 		 '               width: 35%;        '  + 
	 		 '           }      '  + 
	 		 '           table.linetb_Total {  '  + 
	 		 '           table-layout: fixed;  '  + 
	 		 '           border-collapse: collapse;  '  + 
	 		 '           page-break-inside: avoid;  '  + 
	 		 '           font-size: 10pt;  '  + 
	 		 '           }  '  + 
	 		 '           table.linetb_Total td {  '  + 
	 		 '           border: 1px solid;  '  + 
	 		 '           text-overflow: ellipsis;  '  + 
	 		 '           word-wrap: break-word;  '  + 
	 		 '           }          '  + 
	 		 '           table.linetb_Total td.totalLabel {  '  + 
	 		 '           text-overflow: ellipsis;  '  + 
	 		 '           word-wrap: break-word;  '  + 
	 		 '           }  '  + 
	 		 '           hr {  '  + 
	 		 '               height: 1px;  '  + 
	 		 '               width: 100%;  '  + 
	 		 '               color: #d3d3d3;  '  + 
	 		 '               background-color: #d3d3d3;  '  + 
	 		 '           }                  '  + 
	 		 '       </style>         '  + 
	 		 '           <macrolist>        '  + 
	 		 '           <macro id="nlheader">  '  + 
	 		 '            <table border="0" cellpadding="0" class="header"><tr>  '  + 
	 		 '               <td width="700px" align="left"><img src="{{subsid_logo}}" style="width:200px; height:40px" /><p style="font-size:19px; line-height: 10px;"></p></td>  '  + 
	 		 '           <td width="700px" align="right">  '  + 
	 		 '          <p style="font-size: 2em;">CyberArk Software Ltd.</p>  '  + 
	 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_english_address}}  '  + 
	 		 '          <br></br>www.cyberark.com  '  + 
	 		 '          <br></br>Tax Payer ID : {{subsid_taxpayerid}}              '  + 
	 		 '          <br></br>VAT Reg No: {{subsidVATRegNum}}<br></br> </p>          '  + 
	 		 '     </td>  '  + 
	 		 '           <td width="700px" align="right">  '  + 
	 		 '          <p style="font-size: 2em;">סייברארק תוכנה בע״מ</p>  '  + 
	 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_hebrew_address}}  '  + 
	 		 '          <br></br>www.cyberark.com  '  + 
	 		 '           <br></br>{{subsid_taxpayerid}} :עוסק מורשה          '  + 
	 		 '           <br></br>{{subsidVATRegNum}} :מורשה במע״מ<br></br></p>              '  + 
	 		 '     </td>  '  + 
	 		 '     </tr>  '  + 
	 		 '   </table>  '  + 
	 		 '   <hr/>  '  + 
	 		 '           </macro>      '  + 
	 		 '                   <macro id="nlfooter">  '  + 
	 		 '                   <table style="width:100%; border: 0px solid white; height: 10px;">  '  + 
	 		 '                               <tr>  '  + 
	 		 '               <td align="left" style="text-align:justify;"><p style="width: 25%; text-align:right; border-bottom:1px solid black">חתימה</p></td>  '  + 
	 		 '       </tr>  '  + 
	 		 '           <tr>          '  + 
	 		 '       </tr>  '  + 
	 		 '          <tr>  '  + 
	 		 '               <td style="text-align:justify; border:0px solid black"><p style="width: 100%; text-align:right;">{{record_message}}</p></td>  '  + 
	 		 '       </tr>  '  + 
	 		 '   </table>  '  + 
	 		 '   <hr/>  '  + 
	 		 '            <table border="0" cellpadding="0" class="header"><tr>  '  + 
	 		 '            <td width="700px" align="left"><p class="default"></p></td>  '  + 
	 		 '   		 <td width="700px" align="center"><p class="default">-סוף הדוח-</p></td>  '  + 
	 		 '   		  <td width="700px" align="right"><p class="default">{{document_number}} : אסמכתא <br></br>{{vendor_number}} : מספר ספק</p></td>  '  + 
	 		 '     </tr>  '  + 
	 		 '   </table>  '  + 
	 		 '           </macro>   '  + 
	 		 '       </macrolist>  '  + 
	 		 '                       </head>  '  + 
	 		 '   <body padding="0.2in 0.5in 0.1in 0.5in" size="A4" header="nlheader" header-height="180px" footer="nlfooter" footer-height="140px">  '  + 
	 		 '     <table style="width: 100%;">  '  + 
	 		 '   <tr>  '  + 
	 		 '   <td>  '  + 
	 		 '       <table style="width:200px; padding:3px">  '  + 
	 		 '         <tr>  '  + 
	 		 '                     <td align="left">  '  + 
	 		 '          <p style="line-height: 5px;">{{print_date}}</p></td>  '  + 
	 		 '         <td align="right">  '  + 
	 		 '          <p style="line-height: 5px;"> : תאריך הדפסה </p></td>  '  + 
	 		 '               </tr>     '  + 
	 		 '   </table>  '  + 
	 		 '   </td>  '  + 
	 		 '   <td>  '  + 
	 		 '      <table style="width:320px; left:90px; top: -9px">  '  + 
	 		 '     <thead>  '  + 
	 		 '         <tr>  '  + 
	 		 '           <th colspan="6"><p style="width: 100%; text-align:left; font-size: 1.4em; left:180px;" > : לכבוד</p></th>  '  + 
	 		 '             <th colspan="6"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>  '  + 
	 		 '            <th colspan="4"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>      '  + 
	 		 '         </tr>  '  + 
	 		 '   </thead>  '  + 
	 		 '       <tr>  '  + 
	 		 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;">{{billTo}}</p> </td>  '  + 
	 		 '           <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br><br></br></p> </td>  '  + 
	 		 '                   <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br><br></br></p> </td>  '  + 
	 		 '       </tr>  '  + 
	 		 '   </table>  '  + 
	 		 '   </td>  '  + 
	 		 '   </tr>  '  + 
	 		 '   </table>  '  + 
	 		 '      <table style="width:100%;">  '  + 
	 		 '       <tr>  '  + 
	 		 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br><br></br></p> </td>  '  + 
	 		 '       <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br><br></br></p> </td>  '  + 
	 		 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px; left:18px;">,.א.ג.נ<br></br></p>  '  + 
	 		 '    </td>  '  + 
	 		 '       </tr>  '  + 
	 		 '   </table>  '  + 		 
	 		'          <table style="width:100%; top:-2%;">  '  + 
	 		'       <tr>  '  + 
	 		'             <td align="center" class="default" style="text-align: center; font-size:1.2em;">  '  + 
	 		'          <u>{{document_number}} :'+'הוראת העברה מס</u></td>  '  + 
	 		'       </tr>  '  + 
	 		'   </table>  '  + 
	 		'     '  + 
	 		'     '  + 
	 		'   <table class="linetb" style="width:670px;"><!-- start items -->  '  + 
	 		'     '  + 
	 		'     <tr>  '  + 
	 		'     <td colspan="12"><p style="width: 100%; text-align:right;"><span>{{for_date}}</span> בתאריך <span>{{currency_symbol}}{{total_sum}}</span > נבקשכם להעביר סכום של</p></td>   '  + 
	 		'     </tr>  '  + 
	 		'     <tr>  '  + 
	 		'     <td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:right;"><span style="font-size: 1.2em"><u>חשבון לזיכוי</u></span>  '  + 
	 		'     <br/><br/>  '  + 
	 		'       '  + 
	 		'     {{vendor_bank_details}}  '  + 
	 		'       '  + 
	 		'     '  + 
	 		'     <br/><br/>  '  + 
	 		'     </p></td>   '  + 
	 		'     '  + 
	 		'       '  + 
	 		'     '  + 
	 		'     <td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:right;"><span style="font-size: 1.2em"><u>חשבון לחיוב</u></span>  '  + 
	 		'     <br/><br/>  '  + 
	 		'     {{bank_details}} '  + 
	 		'     <br/><br/>  '  + 
	 		'     </p></td>   '  + 
	 		'     '  + 
	 		'     </tr>  '  + 
	 		'     <tr>  '  + 
	 		'           <td colspan="12"><p style="width: 100%; text-align:right;" dir="rtl">{{currency_symbol}}{{total_sum}} <span>: סכום</span><br/>  '  + 
	 		'          {{totalInWords_hebrew}} <span>: סכום במילים</span>'  + 
	 		'           </p></td>   '  + 
	 		'     </tr>  '  + 
	 		'     '  + 
	 		'   </table>  '  +

	 		 '   </body>  '  + 
	 		 '   </pdf>  '  + 
	 		 '    ' ; 
	 		
	 		var pattern = /subsid_logo|subsid_english_address|subsid_hebrew_address|subsid_taxpayerid|record_message|document_number|vendor_number|print_date|billTo|total_sum|for_date|vendor_bank_details|currency_symbol|totalInWords_hebrew|subsidVATRegNum|bank_details/ig
	 		
	 			

	 		//Variables to swap
	 			var subsid_logo = logoURL;
	 			var subsid_english_address = subsidEngAddress.replaceAll('\n', '<br></br>');
	 			var subsid_hebrew_address = subsidHebAddress.replaceAll('\n', '<br></br>');
	 			var subsid_taxpayerid = subsidTaxPayerId;
	 			var subsid_vatRegNum = subsidVATRegNum;
	 			var record_message = currMemo == null ? '' : currMemo;
	 			var document_number = currTranNumber;
	 			var vendor_number = vendorNumber;
	 			var print_date = nlapiDateToString(new Date());
	 			var billTo = accountName + '<br></br>' + accountBranch;
	 			var total_sum = currTotalFormat;
	 			var for_date = currPayDate;
	 			var currency_symbol = currencySymbol;
	 			var totalInWords_hebrew = totalInWords_hebrew
                var bank_details = accountDetails.replaceAll('\n', '<br></br>');
	 			
	 			
	 			if(currencySymbol == '$') {
	 				totalInWords_hebrew = numToText(currTotal)
	 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('שקלים', 'דולר')
	 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('אגורות', 'סנט')
	 			}
	 			if(currencySymbol == '£') {
	 				totalInWords_hebrew = numToText(currTotal)
		 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('שקלים', 'פאונד')
		 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('אגורות', 'סנט')
		 			}
	 			if(currencySymbol == '€') {
	 				totalInWords_hebrew = numToText(currTotal)
		 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('שקלים', 'אירו')
		 			totalInWords_hebrew	= totalInWords_hebrew.replaceAll('אגורות', 'סנט')
		 			}
	 			
	 			var receiverDetails = '';
	 			var vendor_bank_details = ''
	 		
	 		//Local Vendor Bank Details variables and build table
	 			if(printLang == 'hebrew') {
		 			
		 		
	 	        var LOCAL_vendorBankAccount = vendorBankDetails[0].bankAccount;
	            var LOCAL_vendorName = vendorBankDetails[0].bankAccountName;
	            var LOCAL_vendorBankName = vendorBankDetails[0].bankName;
	            var LOCAL_vendorBankCode = vendorBankDetails[0].bankCode;
	            var LOCAL_vendorBankBranch = vendorBankDetails[0].bankBranch;	            

	            if(LOCAL_vendorName == '') {
	            	LOCAL_vendorName =  nlapiLookupField('vendor', vendorID, 'legalname');
	            }
	              
	            
	            
	            if(LOCAL_vendorBankAccount == null || LOCAL_vendorBankAccount == undefined  || LOCAL_vendorBankAccount == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails = receiverDetails + 'מס. חשבון: '+LOCAL_vendorBankAccount+'<br></br>'
	            }
	            if(LOCAL_vendorName == null || LOCAL_vendorName == undefined  || LOCAL_vendorName == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= '     על שם: '+LOCAL_vendorName+'<br></br>'
	            }
	            if(LOCAL_vendorBankName == null || LOCAL_vendorBankName == undefined  || LOCAL_vendorBankName == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= '     בנק: '+LOCAL_vendorBankName+'<br></br>'
	            }
	            if(LOCAL_vendorBankCode == null || LOCAL_vendorBankCode == undefined  || LOCAL_vendorBankCode == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= '     קוד בנק: '+LOCAL_vendorBankCode+'<br></br>'
	            }
	            if(LOCAL_vendorBankBranch == null || LOCAL_vendorBankBranch == undefined  || LOCAL_vendorBankBranch == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= '     סניף: '+LOCAL_vendorBankBranch+'<br></br>'
	            }

	 			var bankDetailsStr =  receiverDetails;
	 			
	 			vendor_bank_details = bankDetailsStr;
	 			}
	 			
	 			
	 			//Foreign Vendor Bank Details variables and build table
	 			if(printLang != 'hebrew') {
		 			
	 			var vendorRec = nlapiLoadRecord('vendor', vendorID)
		 		
	 	        var FOREIGN_bankname = vendorRec.getFieldValue('custentity_ilo_bank_name')
	 	        var FOREIGN_branchname = vendorRec.getFieldValue('custentity_ilo_bank_branch_number')
	 	        var FOREIGN_bankaddress = vendorRec.getFieldValue('custentity_ilo_bank_account_address')
	 	        var FOREIGN_bankaccountname = vendorRec.getFieldValue('custentity_ilo_bank_account_name')
	 	        var FOREIGN_bankaccountnumber = vendorRec.getFieldValue('custentity_ilo_bank_account_number')    
	 	        var FOREIGN_bankswiftcodce = vendorRec.getFieldValue('custentity_ilo_bank_swift_code') 
	 	        var FOREIGN_bankIBAN = vendorRec.getFieldValue('custentity_il_aba_number') 
	 	        var FOREIGN_bankABA = vendorRec.getFieldValue('custentity_ilo_iban')    
	              	            

	 	    	 var FOREIGN_vendorName = vendorRec.getFieldValue('legalname')
	            
	            
	            if(FOREIGN_bankaccountnumber == null || FOREIGN_bankaccountnumber == undefined  || FOREIGN_bankaccountnumber == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails = receiverDetails + 'Account No : '+FOREIGN_bankaccountnumber+'<br></br>'
	            }
	            if(FOREIGN_vendorName == null || FOREIGN_vendorName == undefined  || FOREIGN_vendorName == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'For : '+FOREIGN_vendorName+'<br></br>'
	            }
	            if(FOREIGN_bankname == null || FOREIGN_bankname == undefined  || FOREIGN_bankname == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'Bank : '+FOREIGN_bankname+'<br></br>'
	            }
	            if(FOREIGN_branchname == null || FOREIGN_branchname == undefined  || FOREIGN_branchname == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'Bank Branch : '+FOREIGN_branchname+'<br></br>'
	            }
	            if(FOREIGN_bankaccountname == null || FOREIGN_bankaccountname == undefined  || FOREIGN_bankaccountname == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'Account Name : '+FOREIGN_bankaccountname+'<br></br>'
	            }
	            if(FOREIGN_bankswiftcodce == null || FOREIGN_bankswiftcodce == undefined  || FOREIGN_bankswiftcodce == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'SWIFT : '+FOREIGN_bankswiftcodce+'<br></br>'
	            }
	            if(FOREIGN_bankIBAN == null || FOREIGN_bankIBAN == undefined  || FOREIGN_bankIBAN == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'IBAN : '+FOREIGN_bankIBAN+'<br></br>'
	            }
	            if(FOREIGN_bankABA == null || FOREIGN_bankABA == undefined  || FOREIGN_bankABA == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'ABA : '+FOREIGN_bankABA+'<br></br>'
	            }
	            
	            if(FOREIGN_bankaddress == null || FOREIGN_bankaddress == undefined  || FOREIGN_bankaddress == '' ) {
	            	receiverDetails = receiverDetails + ''
	            }else{
	            	receiverDetails+= 'Bank Address : '+FOREIGN_bankaddress+'<br></br>'
	            }

	 			var bankDetailsStr = receiverDetails	 			
	 			vendor_bank_details = bankDetailsStr;
	 			
	 			}
	 			
	 		//Map variable to template
	 			var mapObj = {
	 					
	 					subsid_logo : subsid_logo,
	 					subsid_english_address : subsid_english_address,
	 					subsid_hebrew_address : subsid_hebrew_address,
	 					subsid_taxpayerid : subsid_taxpayerid,
	 					subsidVATRegNum: subsidVATRegNum,
	 					record_message : record_message,
	 					document_number : document_number,
	 					vendor_number : vendor_number,
	 					print_date : print_date,
	 					billTo : billTo,
	 					total_sum : total_sum,
	 					for_date : for_date,
	 					vendor_bank_details : vendor_bank_details,
	 					currency_symbol : currency_symbol,
	 					totalInWords_hebrew: totalInWords_hebrew,
                  		bank_details : bank_details
	
	 			}
	 			
	 			var str = forBankString.replace(/\{\{(.*?)\}\}/g, function(i, match) {
	 				return mapObj[match];
	 			})
	 			
	 			var clean = str.replaceAll('&', '&amp;')

			 
		    //response.write(str)
		    downloadDataPDF(clean, response, 'stam')
	 		}
	 		
	 
	 		if(printType == 'forvendor' && printLang == 'hebrew') {
	 			
	 			
	 			
		 		var forVendorString =  '   <!--?xml version="1.0" ?-->  '  + 
		 		 '   <!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">  '  + 
		 		 '   <pdf>  '  + 
		 		 '   <head>  '  + 
		 		 '     <link name="sans-serif" type="font" subtype="truetype" src="https://system.na2.netsuite.com/c.1166108/suitebundle149431/Fonts/Heb-Regular.ttf"/>  '  + 
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
		 		 '               font-size: 9pt;  '  + 
		 		 '               table-layout: fixed;  '  + 
		 		 '               width: 100%;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           th {  '  + 
		 		 '                '  + 
		 		 '               font-size: 8pt;  '  + 
		 		 '               vertical-align: middle;  '  + 
		 		 '               text-align : center;  '  + 
		 		 '               padding-top: 5px;  '  + 
		 		 '               padding-right: 6px;  '  + 
		 		 '               padding-left: 6px;  '  + 
		 		 '               padding-bottom: 3px;  '  + 
		 		 '               color: #333333;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           td {  '  + 
		 		 '               padding-bottom: 4px;  '  + 
		 		 '               padding-top: 4px;  '  + 
		 		 '               padding-right: 6px;  '  + 
		 		 '               padding-left: 6px;  '  + 
		 		 '                 word-wrap:break-word;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           table.body td {  '  + 
		 		 '               padding-top: 2px;  '  + 
		 		 '              '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '           table.linetb {  '  + 
		 		 '               border: 1px solid;  '  + 
		 		 '               table-layout: fixed;  '  + 
		 		 '               border-collapse: collapse;  '  + 
		 		 '     '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           table.header td {  '  + 
		 		 '               font-size: 7pt;  '  + 
		 		 '               padding: 0px;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           table.footer td {  '  + 
		 		 '               font-size: 8pt;  '  + 
		 		 '               padding: 0px;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '           table.linetb th {  '  + 
		 		 '               background-color: #fff;  '  + 
		 		 '               border: 1px solid;  '  + 
		 		 '               padding-bottom: 10px;  '  + 
		 		 '               padding-top: 10px;  '  + 
		 		 '                 '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           table.linetb td {  '  + 
		 		 '               border: 1px solid;  '  + 
		 		 '               text-overflow: ellipsis;  '  + 
		 		 '                  word-wrap:break-word;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           td.default {  '  + 
		 		 '               font-size: 9pt;  '  + 
		 		 '               padding-top: 0px;  '  + 
		 		 '               padding-bottom: 0px;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '           table.total {  '  + 
		 		 '               page-break-inside: avoid;  '  + 
		 		 '               font-size: 10pt;  '  + 
		 		 '               width: 35%;  '  + 
		 		 '                 '  + 
		 		 '           }  '  + 
		 		 '             '  + 
		 		 '           table.linetb_Total {  '  + 
		 		 '           table-layout: fixed;  '  + 
		 		 '           border-collapse: collapse;  '  + 
		 		 '           page-break-inside: avoid;  '  + 
		 		 '           font-size: 9pt;  '  + 
		 		 '           }  '  + 
		 		 '             '  + 
		 		 '           table.linetb_Total td {  '  + 
		 		 '           border: 1px solid;  '  + 
		 		 '           text-overflow: ellipsis;  '  + 
		 		 '           word-wrap: break-word;  '  + 
		 		 '           }  '  + 
		 		 '             '  + 
		 		 '           table.linetb_Total td.totalLabel {  '  + 
		 		 '           text-overflow: ellipsis;  '  + 
		 		 '           word-wrap: break-word;  '  + 
		 		 '           }  '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '           hr {  '  + 
		 		 '               height: 1px;  '  + 
		 		 '               width: 100%;  '  + 
		 		 '               color: #d3d3d3;  '  + 
		 		 '               background-color: #d3d3d3;  '  + 
		 		 '           }  '  + 
		 		 '             '  + 
		 		 '             '  + 
		 		 '       </style>             '  + 
		 		 '           <macrolist>        '  + 
		 		 '           <macro id="nlheader">  '  + 
		 		 '            <table border="0" cellpadding="0" class="header"><tr>  '  + 
		 		 '               <td width="700px" align="left"><img src="{{subsid_logo}}" style="width:200px; height:40px" /><p style="font-size:19px; line-height: 10px;"></p></td>  '  + 
		 		 '           <td width="700px" align="right">  '  + 
		 		 '          <p style="font-size: 2em;">CyberArk Software Ltd.</p>  '  + 
		 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_english_address}}  '  + 
		 		 '          <br></br>www.cyberark.com  '  + 
		 		 '          <br></br>Tax Payer ID : {{subsid_taxpayerid}}              '  + 
		 		 '          <br></br>VAT Reg No: {{subsidVATRegNum}}<br></br> </p>          '  + 
		 		 '     </td>  '  + 
		 		 '           <td width="700px" align="right">  '  + 
		 		 '          <p style="font-size: 2em;">סייברארק תוכנה בע״מ</p>  '  + 
		 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_hebrew_address}}  '  + 
		 		 '          <br></br>www.cyberark.com  '  + 
		 		 '           <br></br>{{subsid_taxpayerid}} :עוסק מורשה          '  + 
		 		 '           <br></br>{{subsidVATRegNum}} :מורשה במע״מ<br></br></p>              '  + 
		 		 '     </td>  '  + 
		 		 '     </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '   <hr/>  '  + 
		 		 '           </macro> ' +
		 		 '         <macro id="nlfooter">  '  + 
		 		 '        <table style="width:100%; border: 0px solid white; height: 10px;">  '  + 
		 		 '                               <tr>  '  + 
		 		 '        <td align="left" style="text-align:justify;"><p style="width: 25%; text-align:right; border-bottom:1px solid black">חתימה</p></td>  '  + 
		 		 '       </tr>   '  + 
		 		 '           <tr>     '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '   <hr/>  '  + 
		 		 '           </macro>   '  + 
		 		 '       </macrolist>  '  + 

		 		 '                       </head>  '  + 
		 		 '    <body padding="0.2in 0.5in 0.1in 0.5in" size="A4" header="nlheader" header-height="180px" footer="nlfooter" footer-height="140px">   '  + 
		 		 '     <table style="width: 100%;">  '  + 
		 		 '   <tr>  '  + 
		 		 '     '  + 
		 		 '   <td>  '  + 
		 		 '       <table style="width:180px; border:1px solid black; padding:3px">  '  + 
		 		 '         <tr>  '  + 
		 		 '                     <td align="left">  '  + 
		 		 '          <p style="line-height: 5px;">{{for_date}}</p></td>  '  + 
		 		 '         <td align="right">  '  + 
		 		 '          <p style="line-height: 5px;">:תאריך </p></td>  '  + 
		 		 '               </tr>    '  + 
		 		 '                     <tr>  '  + 
		 		 '                     <td align="left">  '  + 
		 		 '          <p style="line-height: 5px;">{{vendor_vatregnum}}</p></td>  '  + 
		 		 '         <td align="right">  '  + 
		 		 '          <p style="line-height: 5px;">:ע.מ./ח.פ</p></td>  '  + 
		 		 '               </tr>           '  + 
		 		 '   </table>  '  + 
		 		 '   </td>  '  + 
		 		 '   <td>  '  + 
		 		 '      <table style="width:320px; left:90px; top: -9px">  '  + 
		 		 '     <thead>  '  + 
		 		 '         <tr>  '  + 
		 		 '           <th colspan="6"><p style="width: 100%; text-align:left; font-size: 1.4em; left:180px;" > : לכבוד</p></th>  '  + 
		 		 '             <th colspan="6"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>  '  + 
		 		 '            <th colspan="4"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>      '  + 
		 		 '         </tr>  '  + 
		 		 '   </thead>  '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '       <tr>  '  + 
		 		 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;">{{billTo}}</p> </td>  '  + 
		 		 '           <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 		 '                   <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 		 '       </tr>  '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '     '  + 
		 		 '   </table>  '  + 
		 		 '   </td>  '  + 
		 		 '   </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '      <table style="width:100%;border-top:1px solid red;border-bottom:1px solid red; height: 25px; font-size: 10pt">  '  + 
		 		 '       <tr>  '  + 
		 		 '       <td colspan="4" align="left"><p></p></td>  '  + 
		 		 '       <td colspan="4" align="center"><p>{{document_number}} : מספר</p></td>  '  + 
		 		 '       <td colspan="4" align="right"><p>העברה בנקאית</p></td>  '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '     '  + 
		 		 '      <table style="width:100%;">  '  + 
		 		 '       <tr>  '  + 
		 		 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 		 '       <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 		 '           <td colspan="6" class="default"><p style="text-align: right; width: 220px; left:18px;">,.א.ג.נ<br></br>  '  + 
		 		 '   הרינו להודיעך, כי זיכינו את חשבונך לפי הפירוט הרצ״ב<br></br>  '  + 
		 		 '    </p></td>  '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '     '  + 
		 		 '   {{vendor_bank_details}}  '  + 
		 		 '     '  + 
		 		 '   <table class="linetb" style="width:100%;">  '  + 
		 		 '   <thead>  '  + 
		 		 '         <tr>  '  + 
		 		 '           <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:right;">סכום לתשלום</p></th>  '  + 
		 		 '           <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:right;">.נ.ב</p></th>   '  + 
		 		 '           <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:right;">סכום מקורי</p></th>   '  + 
		 		 '           <th colspan="10" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:right;">חשבונית</p></th>   '  + 
		 		 '           <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:right;">תאריך</p></th>  '  + 
		 		 '         </tr>  '  + 
		 		 '   </thead>  '  + 
		 		 '                  '  + 
		 		 '   {{bill_lines}}    '  + 
		 		 '     '  + 
		 		 '   </table>  '  + 
		 		 '       <table class="linetb_Total" style="width:670px">  '  + 
		 		 '                      <tr>  '  + 
		 		 '       <td  colspan="4" align="right" style="height:30px; vertical-align: middle; border-top: 1px solid white">{{payment_subtotal}}</td>  '  + 
		 		 '         <td class="totalLabel" colspan="4" align="left" style="height:30px; vertical-align: middle; border: 1px solid white">תשלום<br></br></td>  '  + 
		 		 '       <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white">  '  + 
		 		 '       </td>  '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '       <table class="linetb_Total" style="width:670px">  '  + 
		 		 '                      <tr>  '  + 
		 		 '       <td  colspan="4" align="right" style="height:30px; vertical-align: middle; border-top: 1px solid white">{{payment_whttotal}}</td>  '  + 
		 		 '         <td class="totalLabel" colspan="4" align="left" style="height:30px; vertical-align: middle; border: 1px solid white">ניכוי במקור<br></br></td>  '  + 
		 		 '       <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white">  '  + 
		 		 '       </td>  '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '       <table class="linetb_Total" style="width:670px">  '  + 
		 		 '                      <tr>  '  + 
		 		 '       <td  colspan="4" align="right" style="height:30px; vertical-align: middle; border-top: 1px solid white">{{payment_total}}</td>  '  + 
		 		 '         <td class="totalLabel" colspan="4" align="left" style="height:30px; vertical-align: middle; border: 1px solid white">סה״כ<br></br></td>  '  + 
		 		 '       <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white">  '  + 
		 		 '       </td>  '  + 
		 		 '       </tr>  '  + 
		 		 '   </table>  '  +  
		 		 '   </body>  '  +
		 		 '   </pdf>  ';  
		 		
		 		
		 		var pattern = /subsid_logo|subsid_english_address|subsid_hebrew_address|subsid_taxpayerid|record_message|document_number|vendor_number|vendor_vatregnum|print_date|billTo|total_sum|for_date|vendor_bank_details|currency_symbol|bill_lines|payment_subtotal|payment_whttotal|payment_total|subsidVATRegNum/ig
			 		
	 			

		 		//Variables to swap
		 			var subsid_logo = logoURL;
		 			var subsid_english_address = subsidEngAddress.replaceAll('\n', '<br></br>');
		 			var subsid_hebrew_address = subsidHebAddress.replaceAll('\n', '<br></br>');
		 			var subsid_taxpayerid = subsidTaxPayerId;
		 			var subsid_vatRegNum = subsidVATRegNum;
		 			var record_message = currMemo == null ? '' : currMemo;
		 			var document_number = currTranNumber == '' ? currentRec.getFieldValue('transactionnumber') : currTranNumber;
		 			var vendor_number = vendorNumber;
		 			var vendor_vatregnum = nlapiLookupField('vendor', vendorID, 'vatregnumber');
		 			var print_date = nlapiDateToString(new Date());
		 			var billTo = currentRec.getFieldValue('address');
		 			billTo = billTo.replaceAll('\n', '<br></br>')
		 			var total_sum = currTotalFormat;
		 			var for_date = currPayDate;
		 			var currency_symbol = currencySymbol;
		 			
		 			var subTotal = currentRec.getFieldValue('custbody_ilo_gross_amount');
		 			var whtTotal = currentRec.getFieldValue('custbody_ilo_wht_amount');
		 			var total = currentRec.getFieldValue('custbody_ilo_net_amount');
		 			
		 			if(currency_symbol == '$') {
		 				
		 				 subTotal = currentRec.getFieldValue('total');
			 			 whtTotal = '0.00';
			 			 total = currentRec.getFieldValue('total');
		 				
		 				
		 			}
		 			
		 		//Creating transaction Lines
		 			var lineCount = currentRec.getLineItemCount('apply');
		 			var lines = '';
		 			
		 			for(var i = 0; i<lineCount; i++) {
		 				
		 				var checkIfApplied = currentRec.getLineItemValue('apply', 'apply', i+1);
		 				if(checkIfApplied === 'T') {
		 					
		 					var lineDate = currentRec.getLineItemValue('apply', 'applydate', i+1);
		 					var linedocNum = currentRec.getLineItemValue('apply', 'refnum', i+1);
		 					var lineOGAmt = currentRec.getLineItemValue('apply', 'total', i+1);
		 					var lineTotalDue = currentRec.getLineItemValue('apply', 'due', i+1);
		 					var lineWHT = parseFloat(lineOGAmt - lineTotalDue).toFixed(2)

		 					lines += '<tr>'+
		 					 '<td colspan="4"><p style="width: 100%; text-align:right;">'+formatMoney(lineTotalDue)+'</p></td>  '  + 
		 					'<td colspan="4"><p style="width: 100%; text-align:right;">'+formatMoney(lineWHT)+'</p></td>  '  + 
		 					'<td colspan="4"><p style="width: 100%; text-align:right;">'+formatMoney(lineOGAmt)+'</p></td>  '  + 
		 					'<td colspan="10"><p style="width: 100%; text-align:right;">'+linedocNum+'</p></td>  '  + 
		 					'<td colspan="4"><p style="width: 100%; text-align:right;">'+lineDate+'</p></td>  '  + 	
		 						'</tr>'
		 				}
		 				
		 			}
		 			
		 			//Vendor Bank Details variables and build table
		 			
		 	        var LOCAL_vendorBankAccount = vendorBankDetails[0].bankAccount;
		            var LOCAL_vendorName = vendorBankDetails[0].bankAccountName;
		            var LOCAL_vendorBankName = vendorBankDetails[0].bankName;
		            var LOCAL_vendorBankCode = vendorBankDetails[0].bankCode;
		            var LOCAL_vendorBankBranch = vendorBankDetails[0].bankBranch;	            

		            if(LOCAL_vendorName == '') {
		            	LOCAL_vendorName =  nlapiLookupField('vendor', vendorID, 'legalname');
		            }
		              
		            var receiverDetails = '';
		            
		            if(LOCAL_vendorBankAccount == null || LOCAL_vendorBankAccount == undefined  || LOCAL_vendorBankAccount == '' ) {
		            	receiverDetails = receiverDetails + ''
		            }else{
		            	receiverDetails = receiverDetails + '<br></br>מס. חשבון: '+LOCAL_vendorBankAccount+'<br></br>'
		            }
		            if(LOCAL_vendorName == null || LOCAL_vendorName == undefined  || LOCAL_vendorName == '' ) {
		            	receiverDetails = receiverDetails + ''
		            }else{
		            	receiverDetails+= '     על שם: '+LOCAL_vendorName+'<br></br>'
		            }
		            if(LOCAL_vendorBankName == null || LOCAL_vendorBankName == undefined  || LOCAL_vendorBankName == '' ) {
		            	receiverDetails = receiverDetails + ''
		            }else{
		            	receiverDetails+= '     בנק: '+LOCAL_vendorBankName+'<br></br>'
		            }
		            if(LOCAL_vendorBankCode == null || LOCAL_vendorBankCode == undefined  || LOCAL_vendorBankCode == '' ) {
		            	receiverDetails = receiverDetails + ''
		            }else{
		            	receiverDetails+= '     קוד בנק: '+LOCAL_vendorBankCode+'<br></br>'
		            }
		            if(LOCAL_vendorBankBranch == null || LOCAL_vendorBankBranch == undefined  || LOCAL_vendorBankBranch == '' ) {
		            	receiverDetails = receiverDetails + ''
		            }else{
		            	receiverDetails+= '     סניף: '+LOCAL_vendorBankBranch+'<br></br>'
		            }
		            
		            receiverDetails += '<br></br>תאריך זיכוי: '+for_date+'<br></br>'

		 			var bankDetailsStr =  '<table style="width:100%;">'  + 
		 			 '       <tr>  '  + 
		 			 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 			 '       <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br></br><br></br></p> </td>  '  + 
		 			 '       <td colspan="6" class="default"><p style="text-align: right; width: 220px;">'+receiverDetails+'<br></br></p>  '  + 
		 			 '    </td>  '  + 
		 			 '       </tr>  '  + 
		 			 '  </table>  ' ; 
		 			
		 			var vendor_bank_details = bankDetailsStr;
		 			

		 			
			 		//Map variable to template
		 			var mapObj = {
		 					
		 					subsid_logo : subsid_logo,
		 					subsid_english_address : subsid_english_address,
		 					subsid_hebrew_address : subsid_hebrew_address,
		 					subsid_taxpayerid : subsid_taxpayerid,
		 					subsidVATRegNum : subsidVATRegNum,
		 					record_message : record_message,
		 					document_number : document_number,
		 					vendor_number : vendor_number,
		 					vendor_vatregnum : vendor_vatregnum,
		 					print_date : print_date,
		 					billTo : billTo,
		 					total_sum : total_sum,
		 					for_date : for_date,
		 					vendor_bank_details : vendor_bank_details,
		 					currency_symbol : currency_symbol,
		 					bill_lines : lines,
		 					payment_subtotal : currency_symbol+formatMoney(subTotal),
		 					payment_whttotal : currency_symbol+formatMoney(whtTotal),
		 					payment_total : currency_symbol+formatMoney(total)
		
		 			}
		 			
		 			var str = forVendorString.replace(/\{\{(.*?)\}\}/g, function(i, match) {
		 				return mapObj[match];
		 			})
		 			
		 			var clean = str.replaceAll('&', '&amp;')
				 
			    //response.write(str)
			    downloadDataPDF(clean, response, 'stam')
		 		
		 		}
	 		
	 		
	 		if(printType == 'forvendor' && printLang != 'hebrew') {
	 			
	 			var forVendorString =  '   <!--?xml version="1.0" ?-->  '  + 
	 			 '   <!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">  '  + 
	 			 '   <pdf>  '  + 
	 			 '   <head>  '  + 
	 			 '     <link name="sans-serif" type="font" subtype="truetype" src="https://system.na2.netsuite.com/c.1166108/suitebundle149431/Fonts/Heb-Regular.ttf"/>  '  + 
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
	 			 '               font-size: 9pt;  '  + 
	 			 '               table-layout: fixed;  '  + 
	 			 '               width: 100%;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           th {  '  + 
	 			 '                '  + 
	 			 '               font-size: 8pt;  '  + 
	 			 '               vertical-align: middle;  '  + 
	 			 '               text-align : center;  '  + 
	 			 '               padding-top: 5px;  '  + 
	 			 '               padding-right: 6px;  '  + 
	 			 '               padding-left: 6px;  '  + 
	 			 '               padding-bottom: 3px;  '  + 
	 			 '               color: #333333;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           td {  '  + 
	 			 '               padding-bottom: 4px;  '  + 
	 			 '               padding-top: 4px;  '  + 
	 			 '               padding-right: 6px;  '  + 
	 			 '               padding-left: 6px;  '  + 
	 			 '                 word-wrap:break-word;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           table.body td {  '  + 
	 			 '               padding-top: 2px;  '  + 
	 			 '              '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '     '  + 
	 			 '           table.linetb {  '  + 
	 			 '               border: 1px solid;  '  + 
	 			 '               table-layout: fixed;  '  + 
	 			 '               border-collapse: collapse;  '  + 
	 			 '     '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           table.header td {  '  + 
	 			 '               font-size: 7pt;  '  + 
	 			 '               padding: 0px;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           table.footer td {  '  + 
	 			 '               font-size: 8pt;  '  + 
	 			 '               padding: 0px;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '     '  + 
	 			 '           table.linetb th {  '  + 
	 			 '               background-color: #fff;  '  + 
	 			 '               border: 1px solid;  '  + 
	 			 '               padding-bottom: 10px;  '  + 
	 			 '               padding-top: 10px;  '  + 
	 			 '                 '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           table.linetb td {  '  + 
	 			 '               border: 1px solid;  '  + 
	 			 '               text-overflow: ellipsis;  '  + 
	 			 '                  word-wrap:break-word;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           td.default {  '  + 
	 			 '               font-size: 9pt;  '  + 
	 			 '               padding-top: 0px;  '  + 
	 			 '               padding-bottom: 0px;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '           table.total {  '  + 
	 			 '               page-break-inside: avoid;  '  + 
	 			 '               font-size: 10pt;  '  + 
	 			 '               width: 35%;  '  + 
	 			 '                 '  + 
	 			 '           }  '  + 
	 			 '             '  + 
	 			 '           table.linetb_Total {  '  + 
	 			 '           table-layout: fixed;  '  + 
	 			 '           border-collapse: collapse;  '  + 
	 			 '           page-break-inside: avoid;  '  + 
	 			 '           font-size: 9pt;  '  + 
	 			 '           }  '  + 
	 			 '             '  + 
	 			 '           table.linetb_Total td {  '  + 
	 			 '           border: 1px solid;  '  + 
	 			 '           text-overflow: ellipsis;  '  + 
	 			 '           word-wrap: break-word;  '  + 
	 			 '           }  '  + 
	 			 '             '  + 
	 			 '           table.linetb_Total td.totalLabel {  '  + 
	 			 '           text-overflow: ellipsis;  '  + 
	 			 '           word-wrap: break-word;  '  + 
	 			 '           }  '  + 
	 			 '     '  + 
	 			 '     '  + 
	 			 '           hr {  '  + 
	 			 '               height: 1px;  '  + 
	 			 '               width: 100%;  '  + 
	 			 '               color: #d3d3d3;  '  + 
	 			 '               background-color: #d3d3d3;  '  + 
	 			 '           }  '  + 
	 			 '             '  + 
	 			 '       </style>             '  + 
	 			 '           <macrolist>        '  + 
		 		 '           <macro id="nlheader">  '  + 
		 		 '            <table border="0" cellpadding="0" class="header"><tr>  '  + 
		 		 '               <td width="700px" align="left"><img src="{{subsid_logo}}" style="width:200px; height:40px" /><p style="font-size:19px; line-height: 10px;"></p></td>  '  + 
		 		 '           <td width="700px" align="right">  '  + 
		 		 '          <p style="font-size: 2em;">CyberArk Software Ltd.</p>  '  + 
		 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_english_address}}  '  + 
		 		 '          <br></br>www.cyberark.com  '  + 
		 		 '          <br></br>Tax Payer ID : {{subsid_taxpayerid}}              '  + 
		 		 '          <br></br>VAT Reg No: {{subsidVATRegNum}}<br></br> </p>          '  + 
		 		 '     </td>  '  + 
		 		 '           <td width="700px" align="right">  '  + 
		 		 '          <p style="font-size: 2em;">סייברארק תוכנה בע״מ</p>  '  + 
		 		 '          <p style="font-size: 1.6em; text-align:right">{{subsid_hebrew_address}}  '  + 
		 		 '          <br></br>www.cyberark.com  '  + 
		 		 '           <br></br>{{subsid_taxpayerid}} :עוסק מורשה          '  + 
		 		 '           <br></br>{{subsidVATRegNum}} :מורשה במע״מ<br></br></p>              '  + 
		 		 '     </td>  '  + 
		 		 '     </tr>  '  + 
		 		 '   </table>  '  + 
		 		 '   <hr/>  '  + 
		 		 '           </macro> ' +
	 			 '         <macro id="nlfooter">  '  + 
	 			 '        <table style="width:100%; border: 0px solid white; height: 10px;">  '  + 
	 			 '                               <tr>  '  + 
	 			 '        <td align="left" style="text-align:justify;"><p style="width: 25%; text-align:left; border-bottom:1px solid black">Signature</p></td>  '  + 
	 			 '       </tr>   '  + 
	 			 '           <tr>     '  + 
	 			 '       </tr>  '  + 
	 			 '          <tr>  '  + 
	 			 '         <td style="text-align:justify; border:0px solid black"><p style="width: 100%; text-align:right;">{{record_message}}</p></td>  '  + 
	 			 '       </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '   <hr/>  '  + 
	 			 '           </macro>   '  + 
	 			 '       </macrolist>  '  + 
	 			 '                      '  + 
	 			 '                       </head>  '  + 
	 			 '   <body padding="0.2in 0.5in 0.1in 0.5in" size="A4" header="nlheader" header-height="180px" footer="nlfooter" footer-height="140px">  '  + 
	 			 '     <table style="width: 100%;">  '  + 
	 			 '   <tr>  '  + 
	 			 '   <td>  '  + 
	 			 '      <table style="width:320px; ">  '  + 
	 			 '     <thead>  '  + 
	 			 '         <tr>  '  + 
	 			 '           <th colspan="6"><p style="width: 100%; text-align:left; font-size: 1.4em;" > To : </p></th>  '  + 
	 			 '             <th colspan="6"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>  '  + 
	 			 '            <th colspan="4"><p style="width: 100%; text-align:right; font-size: 1.4em;"></p></th>      '  + 
	 			 '         </tr>  '  + 
	 			 '   </thead>  '  + 
	 			 '     '  + 
	 			 '       <tr>  '  + 
	 			 '       <td colspan="6" class="default"><p style="text-align: left; width: 220px;">{{billTo}}</p> </td>  '  + 
	 			 '           <td colspan="6" class="default"><p style="text-align: left; width: 220px;"><br/><br/><br/></p> </td>  '  + 
	 			 '                   <td colspan="4" class="default"><p style="text-align: left; width: 220px;"><br/><br/><br/></p> </td>  '  + 
	 			 '       </tr>  '  + 
	 			 '     '  + 
	 			 '   </table>  '  + 
	 			 '   </td>  '  + 
	 			 '     '  + 
	 			 '   <td>  '  + 
	 			 '       <table style="width:220px; border:1px solid black; padding:3px; left:95px">  '  + 
	 			 '         <tr>  '  + 
	 			 '                     <td align="left">  '  + 
	 			 '         <p style="line-height: 5px;">Date : </p></td>  '  + 
	 			 '         <td align="right">  '  + 
	 			 '           '  + 
	 			 '            <p style="line-height: 5px;">{{for_date}}</p></td>  '  + 
	 			 '               </tr>    '  + 
	 			 '                     <tr>  '  + 
	 			 '                     <td align="left">  '  + 
	 			 '                      <p style="line-height: 5px;">VAT Reg No.</p></td>  '  + 
	 			 '         <td align="right">  '  + 
	 			 '         <p style="line-height: 5px;">{{vendor_vatregnum}}</p></td>  '  + 
	 			 '               </tr>           '  + 
	 			 '   </table>  '  + 
	 			 '   </td>  '  + 
	 			 '   </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '      <table style="width:100%;border-top:1px solid red;border-bottom:1px solid red; height: 25px; font-size: 10pt">  '  + 
	 			 '       <tr>  '  + 
	 			 '        <td colspan="4" align="left"><p>Bank Transfer</p></td>  '  + 
	 			 '       <td colspan="4" align="center"><p>Number : {{document_number}}</p></td>  '  + 
	 			 '       <td colspan="4" align="right"><p></p></td>  '  + 
	 			 '       </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '     '  + 
	 			 '      <table style="width:100%;">  '  + 
	 			 '       <tr>  '  + 
	 			 '       <td colspan="6" class="default"><p style="text-align: left;">To Whom It May Concern, <br/><br/><br/><br/>  '  + 
	 			 '   We have credited your account as follows :<br/></p>  '  + 
	 			 '    </td>  '  + 
	 			 '       <td colspan="4" class="default"><p style="text-align: right; width: 220px;"><br/><br/><br/></p> </td>  '  + 
	 			 '   <td colspan="6" class="default"><p style="text-align: right; width: 220px;"><br/><br/><br/></p> </td>  '  + 
	 			 '       </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '   {{vendor_bank_details}} '  + 
	 			 '     '  + 
	 			 '   <table class="linetb" style="width:100%;">  '  + 
	 			 '   <thead>  '  + 
	 			 '         <tr>  '  + 
	 			 '         <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:left;">Date</p></th>  '  + 
	 			 '           <th colspan="10" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:left;">Ref. Number</p></th>   '  + 
	 			 '            <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:left;">Original Amount</p></th>   '  + 
	 			 '            <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:left;">WHT Amount</p></th>  '  + 
	 			 '           <th colspan="4" style="background-color:#D3D3D3;"><p style="width: 100%; text-align:left;">Amount Due</p></th>  '  + 
	 			 '         </tr>  '  + 
	 			 '   </thead>  '  + 
	 			 '   {{bill_lines}}    '  + 
	 			 '   </table>  '  + 
	 			 '       <table class="linetb_Total" style="width:100%">  '  + 
	 			 '       <tr>  '  + 
	 			 '        <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white"> </td>     '  + 
	 			 '   	  <td class="totalLabel" colspan="4" align="left"  style="height:30px; vertical-align: middle; border: 1px solid white">Sub Total<br /></td>  '  + 
	 			 '         <td colspan="4" align="center" style="height:30px; vertical-align: middle;">{{payment_subtotal}}</td>  '  + 
	 			 '          '  + 
	 			 '       </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '       <table class="linetb_Total" style="width:100%">  '  + 
	 			 '       <tr>  '  + 
	 			 '        <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white"></td>  '  + 
	 			 '         <td class="totalLabel" colspan="4" align="left" style="height:30px; vertical-align: middle; border: 1px solid white">WHT Amount<br /></td>  '  + 
	 			 '         <td colspan="4" align="center" style="height:30px; vertical-align: middle; border-top: 1px solid white">{{payment_whttotal}}</td>  '  + 
	 			 '          '  + 
	 			 '       </tr>  '  + 
	 			 '   	</table>  '  + 
	 			 '       <table class="linetb_Total" style="width:100%">  '  + 
	 			 '       <tr>  '  + 
	 			 '       <td rowspan="4" colspan="18" align="right" style="background-color:#fff; border: 1px solid white"></td>  '  + 
	 			 '        <td class="totalLabel" colspan="4" align="left" style="height:30px; vertical-align: middle; border: 1px solid white">Total<br /></td>  '  + 
	 			 '        <td colspan="4" align="center" style="height:30px; vertical-align: middle; border-top: 1px solid white">{{payment_total}}</td>  '  + 
	 			 '       </tr>  '  + 
	 			 '   </table>  '  + 
	 			 '   </body>  '  + 
	 			 '   </pdf>  '  + 
	 			 '    ' ; 


		 		var pattern = /subsid_logo|subsid_english_address|subsid_hebrew_address|subsid_taxpayerid|record_message|document_number|vendor_number|vendor_vatregnum|print_date|billTo|total_sum|for_date|vendor_bank_details|currency_symbol|bill_lines|payment_subtotal|payment_whttotal|payment_total|rec_exrate/ig
			 		
		 			

			 		//Variables to swap
			 			var subsid_logo = logoURL;
			 			var subsid_english_address = subsidEngAddress.replaceAll('\n', '<br></br>');
			 			var subsid_hebrew_address = subsidHebAddress.replaceAll('\n', '<br></br>');
			 			var subsid_taxpayerid = subsidTaxPayerId;
			 			var subsid_vatRegNum = subsidVATRegNum;
			 			var record_message = currMemo == null ? '' : currMemo;
			 			var document_number = currTranNumber == '' ? currentRec.getFieldValue('transactionnumber') : currTranNumber;
			 			var vendor_number = vendorNumber;
			 			var vendor_vatregnum = nlapiLookupField('vendor', vendorID, 'vatregnumber');
			 			var print_date = nlapiDateToString(new Date());
			 			var billTo = currentRec.getFieldValue('address');
			 			billTo = billTo.replaceAll('\n', '<br></br>')
			 			var total_sum = currTotalFormat;
			 			var for_date = currPayDate;
			 			var currency_symbol = currencySymbol;
			 			var rec_exrate = exRate
			 			
			 			//var subTotal = currentRec.getFieldValue('total');
			 			//var whtTotal = currentRec.getFieldValue('custbody_ilo_wht_amount');
			 			var total = currentRec.getFieldValue('total');
			 			
			 		//Creating transaction Lines
			 			var lineCount = currentRec.getLineItemCount('apply');
			 			var lines = '';
			 			
			 			for(var i = 0; i<lineCount; i++) {
			 				
			 				var checkIfApplied = currentRec.getLineItemValue('apply', 'apply', i+1);
			 				if(checkIfApplied === 'T') {
			 					
			 					var lineDate = currentRec.getLineItemValue('apply', 'applydate', i+1);
			 					var linedocNum = currentRec.getLineItemValue('apply', 'refnum', i+1);
			 					var lineOGAmt = currentRec.getLineItemValue('apply', 'total', i+1);
			 					var lineTotalDue = currentRec.getLineItemValue('apply', 'due', i+1);
			 					var lineWHT = parseFloat(lineOGAmt - lineTotalDue).toFixed(2)

			 					lines += '<tr>'+
			 					'<td colspan="4"><p style="width: 100%; text-align:left;">'+lineDate+'</p></td>  '  + 	
			 					'<td colspan="10"><p style="width: 100%; text-align:left;">'+linedocNum+'</p></td>  '  + 
			 					'<td colspan="4"><p style="width: 100%; text-align:left;">'+formatMoney(lineOGAmt)+'</p></td>  '  + 
			 					'<td colspan="4"><p style="width: 100%; text-align:left;">'+formatMoney(lineWHT)+'</p></td>  '  + 
			 					 '<td colspan="4"><p style="width: 100%; text-align:left;">'+formatMoney(lineTotalDue)+'</p></td>  '  + 
			 						'</tr>'
			 				}
			 				
			 			}
			 			
			 			var vendorRec = nlapiLoadRecord('vendor', vendorID)
				 		
			 	        var FOREIGN_bankname = vendorRec.getFieldValue('custentity_ilo_bank_name')
			 	        var FOREIGN_branchname = vendorRec.getFieldValue('custentity_ilo_bank_branch_number')
			 	        var FOREIGN_bankaddress = vendorRec.getFieldValue('custentity_ilo_bank_account_address')
			 	        var FOREIGN_bankaccountname = vendorRec.getFieldValue('custentity_ilo_bank_account_name')
			 	        var FOREIGN_bankaccountnumber = vendorRec.getFieldValue('custentity_ilo_bank_account_number')    
			 	        var FOREIGN_bankswiftcodce = vendorRec.getFieldValue('custentity_ilo_bank_swift_code') 
			 	        var FOREIGN_bankIBAN = vendorRec.getFieldValue('custentity_il_aba_number') 
			 	        var FOREIGN_bankABA = vendorRec.getFieldValue('custentity_ilo_iban')    
			              	            

			 	    	 var FOREIGN_vendorName = vendorRec.getFieldValue('legalname')
			            
			                        var receiverDetails = '';
			 			
			            if(FOREIGN_bankaccountnumber == null || FOREIGN_bankaccountnumber == undefined  || FOREIGN_bankaccountnumber == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails = receiverDetails + 'Account No : '+FOREIGN_bankaccountnumber+'<br></br>'
			            }
			            if(FOREIGN_vendorName == null || FOREIGN_vendorName == undefined  || FOREIGN_vendorName == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'For : '+FOREIGN_vendorName+'<br></br>'
			            }
			            if(FOREIGN_bankname == null || FOREIGN_bankname == undefined  || FOREIGN_bankname == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'Bank : '+FOREIGN_bankname+'<br></br>'
			            }
			            if(FOREIGN_branchname == null || FOREIGN_branchname == undefined  || FOREIGN_branchname == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'Bank Branch : '+FOREIGN_branchname+'<br></br>'
			            }
			            if(FOREIGN_bankaccountname == null || FOREIGN_bankaccountname == undefined  || FOREIGN_bankaccountname == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'Account Name : '+FOREIGN_bankaccountname+'<br></br>'
			            }
			            if(FOREIGN_bankswiftcodce == null || FOREIGN_bankswiftcodce == undefined  || FOREIGN_bankswiftcodce == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'SWIFT : '+FOREIGN_bankswiftcodce+'<br></br>'
			            }
			            if(FOREIGN_bankIBAN == null || FOREIGN_bankIBAN == undefined  || FOREIGN_bankIBAN == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'IBAN : '+FOREIGN_bankIBAN+'<br></br>'
			            }
			            if(FOREIGN_bankABA == null || FOREIGN_bankABA == undefined  || FOREIGN_bankABA == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'ABA : '+FOREIGN_bankABA+'<br></br>'
			            }
			            
			            if(FOREIGN_bankaddress == null || FOREIGN_bankaddress == undefined  || FOREIGN_bankaddress == '' ) {
			            	receiverDetails = receiverDetails + ''
			            }else{
			            	receiverDetails+= 'Bank Address : '+FOREIGN_bankaddress+'<br></br>'
			            }
			            
			            receiverDetails += '<br></br>Date Credited: '+for_date+'<br></br>'
						 		 			
			 			var bankDetailsStr =  '<table style="width:100%;">'  + 
			 			 '       <tr>  '  + 
			 			 '       <td colspan="6" class="default"><p style="text-align: left;">'+receiverDetails+'<br></br><br></br></p> </td>  '  + 
			 			 '       <td colspan="4" class="default"><p style="text-align: left;"><br></br><br></br></p> </td>  '  + 
			 			 '       <td colspan="6" class="default"><p style="text-align: left;"><br></br></p>  '  + 
			 			 '    </td>  '  + 
			 			 '       </tr>  '  + 
			 			 '  </table>  ' ; 

			        	vendor_bank_details = bankDetailsStr;
				 		//Map variable to template
			 			var mapObj = {
			 					
			 					subsid_logo : subsid_logo,
			 					subsid_english_address : subsid_english_address,
			 					subsid_hebrew_address : subsid_hebrew_address,
			 					subsid_taxpayerid : subsid_taxpayerid,
			 					subsidVATRegNum: subsidVATRegNum,
			 					record_message : record_message,
			 					document_number : document_number,
			 					vendor_number : vendor_number,
			 					vendor_vatregnum : vendor_vatregnum,
			 					print_date : print_date,
			 					billTo : billTo,
			 					total_sum : total_sum,
			 					for_date : for_date,
			 					vendor_bank_details : vendor_bank_details,
			 					currency_symbol : currency_symbol,
			 					bill_lines : lines,
			 					payment_subtotal : currency_symbol+formatMoney(total),
			 					payment_whttotal : currency_symbol+formatMoney(0),
			 					payment_total : currency_symbol+formatMoney(total),
			 					rec_exrate : rec_exrate
			
			 			}
			 			
			 			var str = forVendorString.replace(/\{\{(.*?)\}\}/g, function(i, match) {
			 				return mapObj[match];
			 			})
			 			
			 			var clean = str.replaceAll('&', '&amp;')
					 
				    //response.write(str)
				    downloadDataPDF(clean, response, 'stam')

	 			
	 		}
	 }
	
	
}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement)
}



function downloadDataPDF(data, response, tranname) {
	
	var file = nlapiXMLToPDF( data );
	response.setEncoding('UTF-8');
	response.setContentType('PDF', 'Bank Transfer Letter.pdf', 'inline');
	response.write(file.getValue())
	
}



function getVendorBankDetails(vendorID) {
    
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
               
                results.push({
                
                bankName : line.getValue('custrecord_ilo_bank_detail_name', 'custrecord_ilo_vendor_bank_bank'),
                bankCode : line.getValue('custrecord_ilo_bank_details_number', 'custrecord_ilo_vendor_bank_bank'),
                bankBranch : line.getValue('custrecord_ilo_bank_details_branch_num', 'custrecord_ilo_vendor_bank_bank'),
                bankAccount :  line.getValue('custrecord_ilo_bank_details_account'),
                bankAccountName : line.getValue('custrecord_ilo_bank_account_name'),
                fromDate : line.getValue('custrecord_ilo_vendor_bank_from'),
                toDate : line.getValue('custrecord_ilo_vendor_bank_to'),
                });


          });

    };
    
    return results;
}

function formatMoney(data){
	
	var formatted = Number(data)
 	formatted = formatted.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")	
	var toReturn = formatted;	
	var arr = formatted.split('.');
	if(arr.length === 2) {	
	if(arr[1].length ===1) {
	toReturn = toReturn+'0'
	}
	}
	else{
	toReturn = toReturn+'.00'
	}
	
 	return toReturn
}



function numToText(bodyTotal) {
  
           var agurot = '';
           var res_agurot = '';
	
    var lineTotal = getTotalOGAmt();
    var check = bodyTotal
    var res = check.split(".");
    var current = getResult(res[0]);
    
    if(res[1] != '00') {
          agurot = num_to_text_hundreds(res[1])
          res_agurot = 'ו'+agurot[0].tens[0];
    }

    if(res_agurot == '') {
          current = current + 'שקלים';
    }
    if(res_agurot != '') {
          current = current + 'שקלים ' + res_agurot + ' אגורות';
    }
    
    return current
}




function num_to_text_hundreds(num) {


    /* Array of units as words */
    var units = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת-עשרה', 'שתיים-עשרה', 'שלוש-עשרה', 'ארבע-עשרה', 'חמש-עשרה', 'שש-עשרה', 'שבע-עשרה', 'שמונה-עשרה', 'תשע-עשרה'];

    /* Array of tens as words */
    var tens = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמשים', 'ששים', 'שבעים', 'שמונים', 'תשעים'];

    var num = num;
    var hundreds;
    var _tens;
    var single;


    if (num.length == 3) {

         hundreds = num.split('');

        if (hundreds[0] == '1') {
            hundreds[0] = 'מאה';
        }
        if (hundreds[0] == '2') {
            hundreds[0] = 'מאתיים';
        }
        if ((hundreds[0] == '3') || (hundreds[0] == '4') || (hundreds[0] == '5') || (hundreds[0] == '6') || (hundreds[0] == '7') || (hundreds[0] == '8') || (hundreds[0] == '9')) {
            hundreds[0] = units[hundreds[0]] + ' מאות';
        }

        if (hundreds[1] == '1') {
            if (hundreds[2] == '0') {
                hundreds[1] = 'ועשרה';
            }
            if (hundreds[2] != '0') {

                var overTenUnderTwenty = parseInt(hundreds[1] + hundreds[2])
                hundreds[1] = 'ו' + units[overTenUnderTwenty];
            }
        }

        if (hundreds[1] == '0') {

            hundreds[1] = '';

            if (hundreds[2] != '0') {

                hundreds[2] = 'ו' + units[hundreds[2]];
            }

        }

        if ((hundreds[1] == '2') || (hundreds[1] == '3') || (hundreds[1] == '4') || (hundreds[1] == '5') || (hundreds[1] == '6') || (hundreds[1] == '7') || (hundreds[1] == '8') || (hundreds[1] == '9')) {
            if (hundreds[2] == '0') {
                var twenty = tens[hundreds[1]];
                hundreds[1] = 'ו' + twenty;
            }
        }

        if ((hundreds[1] == '2') || (hundreds[1] == '3') || (hundreds[1] == '4') || (hundreds[1] == '5') || (hundreds[1] == '6') || (hundreds[1] == '7') || (hundreds[1] == '8') || (hundreds[1] == '9')) {
            if (hundreds[2] != '0') {
                var twenty = tens[hundreds[1]];
                var underTenUnderTwenty = parseInt(hundreds[2])
                hundreds[1] = twenty + ' ו' + units[underTenUnderTwenty];
            }
        }

    }



    if (num.length == 2) {
        _tens = num.split('');

              if (_tens[0] == '1') {
            if (_tens[1] == '0') {
                _tens[0] = 'ועשרה';
            }
            if (_tens[1] != '0') {

                var overTenUnderTwenty = parseInt(_tens[0] + _tens[1])
                _tens[0] = 'ו' + units[overTenUnderTwenty];
            }
        }


        if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
            if (_tens[1] == '0') {
                var twenty = tens[_tens[0]];
                _tens[0] = twenty;
            }
        }

        if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
            if (_tens[1] != '0') {
                var twenty = tens[_tens[0]];
                var underTenUnderTwenty = parseInt(_tens[1])
                _tens[0] = twenty + ' ו' + units[underTenUnderTwenty];
            }
        }
       
    }

    if (num.length == 1) {
         single = num.split('');
        var _single = parseInt(single[0])
        single[0] = units[_single];
    }



var all = [];

all.push({
      hundreds : hundreds,
      tens : _tens,
      singles : single
})


return all;
}

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}


function result_hundreds(query) {

var clean;

var a = num_to_text_hundreds(query);

var results = a[0];

if(results.hundreds != undefined) {

clean = cleanArray(results.hundreds)

}
if(results.tens != undefined) {

clean = results.tens
}
if(results.singles != undefined) {

clean = results.singles
}

var sentence = clean.join(' '); 
var res =  sentence.replace(/[0-9]/g, '');
return res;
}

function num_to_text_thousands(num) {


    /* Array of units as words */
    var units = ['', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת-עשרה', 'שתיים-עשרה', 'שלוש-עשרה', 'ארבע-עשרה', 'חמש-עשרה', 'שש-עשרה', 'שבע-עשרה', 'שמונה-עשרה', 'תשע-עשרה'];

    /* Array of tens as words */
    var tens = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמשים', 'ששים', 'שבעים', 'שמונים', 'תשעים'];

    var num = num;
    var thousands;
    var _tens;
    var single;


    if (num.length == 3) {

         thousands = num.split('');
        
         if((thousands[0] == '0') && (thousands[1] == '0') && (thousands[2] == '1')) {
             thousands[2] = 'אלף '
         }
                  if((thousands[0] != '0') && (thousands[1] == '0') && (thousands[2] == '0')) {
             thousands[2] = 'אלף '
         }

        if (thousands[0] == '1') {
            thousands[0] = 'מאה';
        }
        if (thousands[0] == '2') {
            thousands[0] = 'מאתיים';
        }
        if ((thousands[0] == '3') || (thousands[0] == '4') || (thousands[0] == '5') || (thousands[0] == '6') || (thousands[0] == '7') || (thousands[0] == '8') || (thousands[0] == '9')) {
            thousands[0] = units[thousands[0]] + ' מאות';
        }

        if (thousands[1] == '1') {
            if (thousands[2] == '0') {
                thousands[1] = 'ועשרה';
            }
            if (thousands[2] != '0') {

                var overTenUnderTwenty = parseInt(thousands[1] + thousands[2])
                thousands[1] = units[overTenUnderTwenty]+' אלף ';
               
            }

        }

        if ((thousands[1] == '0') && (thousands[0] == '0')) {

            thousands[1] = '';

            if (thousands[2] != '0') {

           
                if(thousands[2] == '2') {
                    thousands[2] = 'אלפיים '
                    
                }

                if ((thousands[2] == '3') || (thousands[2] == '4') || (thousands[2] == '5') || (thousands[2] == '6') || (thousands[2] == '7') || (thousands[2] == '9')) {
                    thousands[2] = units[thousands[2]]+'ת אלפים ';
                 
}
if (thousands[2] == '8') {
                        var eight = units[thousands[2]].slice(0, -1);
                    thousands[2] = eight+'ת אלפים ';
                   
}


            }

        }

        if ((thousands[1] == '2') || (thousands[1] == '3') || (thousands[1] == '4') || (thousands[1] == '5') || (thousands[1] == '6') || (thousands[1] == '7') || (thousands[1] == '8') || (thousands[1] == '9')) {
            if (thousands[2] == '0') {
                var twenty = tens[thousands[1]];
                thousands[1] = 'ו' + twenty+' אלפים';

            }

        }

        if ((thousands[1] == '2') || (thousands[1] == '3') || (thousands[1] == '4') || (thousands[1] == '5') || (thousands[1] == '6') || (thousands[1] == '7') || (thousands[1] == '8') || (thousands[1] == '9')) {
            if (thousands[2] != '0') {
                var twenty = tens[thousands[1]];
                var underTenUnderTwenty = parseInt(thousands[2])
                thousands[1] = twenty + ' ו' + units[underTenUnderTwenty]+' אלף';

            }

        }

    }





    if (num.length == 2) {
        _tens = num.split('');

              if (_tens[0] == '1') {
            if (_tens[1] == '0') {
                _tens[0] = 'עשרת';
            }
            if (_tens[1] != '0') {

                var overTenUnderTwenty = parseInt(_tens[0] + _tens[1])
                _tens[0] = 'ו' + units[overTenUnderTwenty];
            }
        }


        if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
            if (_tens[1] == '0') {
                var twenty = tens[_tens[0]];
          
                _tens[0] = twenty;
            }
        }

        if ((_tens[0] == '2') || (_tens[0] == '3') || (_tens[0] == '4') || (_tens[0] == '5') || (_tens[0] == '6') || (_tens[0] == '7') || (_tens[0] == '8') || (_tens[0] == '9')) {
            if (_tens[1] != '0') {
                var twenty = tens[_tens[0]];
                var underTenUnderTwenty = parseInt(_tens[1])
                _tens[0] = twenty + ' ו' + units[underTenUnderTwenty];
            }
        }
  
    }

    if (num.length == 1) {
         single = num.split('');
        var _single = parseInt(single[0])
                if(_single == 1) {
            single[0] = 'אלף'
        }
                 if(_single == 2) {
            single[0] = 'אלפיים'
        }
                 if(_single == 3 || _single == 4 || _single == 5 || _single == 6 || _single == 7 || _single == 8 || _single == 9) {
            single[0] = units[_single]+'ת אלפים '

        }

    }


var all = [];

all.push({
      thousands : thousands,
      tens : _tens,
      singles : single
})


return all;
}

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}


function result_thousands(query) {

var clean;

var a = num_to_text_thousands(query);

var results = a[0];

if(results.thousands != undefined) {

clean = cleanArray(results.thousands)

}
if(results.tens != undefined) {

clean = results.tens
}
if(results.singles != undefined) {

clean = results.singles
}

var sentence = clean.join(' '); 
var res =  sentence.replace(/[0-9]/g, '');
//res = res+ ' אלף'

var end = res.replace(/\s{2,}/g, ' ');
return end;
}




function getResult(check) {
var result = '';
var result_a = ''
var result_b = ''

if(check.length == 4) {
      check = '00'+check;
}
      if(check.length == 5) {
      check = '0'+check;
}

var chunks = getChunks(check);

if(chunks.length == 1) {
var chunk_hundreds = chunks[0];
var b = result_hundreds(chunk_hundreds);
result_b = b;
}

if(chunks.length == 2) {
var chunk_thousands = chunks[0];
var chunk_hundreds = chunks[1];

result_a = result_thousands(chunk_thousands);
result_b = result_hundreds(chunk_hundreds);


}

result = result_a+result_b;

if(result_a == "") {
result = result_b;
}

var res =  result.replace(/[0-9]/g, '');
var end = res.replace(/\s{2,}/g, ' ');
return end;
}


function getChunks(num) {

var chunks = splitString(num, 3);
return chunks;
}

function splitString (string, size) {
var re = new RegExp('.{1,' + size + '}', 'g');
return string.match(re);
}



function getTotalOGAmt() {
try {

      var rec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId());
      var lineCount = nlapiGetLineItemCount('apply');

      var totalOgamt = 0;
      var totOGAmtArr = [];

      for (var i = 0; i < lineCount; i++) {
            var lineOGAmt = rec.getLineItemValue('apply', 'total', i + 1)
            totOGAmtArr.push(lineOGAmt);
      }

      totalOgamt = totOGAmtArr.reduce(add, 0);
      function add(a, b) {
            return parseFloat(a) + parseFloat(b);
      }
      return totalOgamt.toFixed(2);

} catch (err) {

      var err = 'err';
      return err;
}
}


function reverse(s) {
return s.split("").reverse().join("");
}

function reverse_a_number(n)
{
n = n + "";
return n.split("").reverse().join("");
}


