var getTranType;
var getSubsidiary;

var getZuoraRef;

var newTranID;
var lastTranID;

var isTicket = '';

function getLastNumbers() {

	var searchNumbers = nlapiLoadSearch(null,
			'customsearch_ilo_numbering_saved_search');

	var allnumbers = [];
	var theNumbers = [];
	var resultNumbers = [];
	var searchid = 0;
	var resultset = searchNumbers.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allnumbers
					.push(resultNumbers[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allnumbers != null) {
		allnumbers.forEach(function(line) {

			theNumbers.push({

					name : line.getValue('name'),
					type : line.getValue('custrecord_ilo_numbering_trantype'),
					last_number : line.getValue('custrecord_ilo_numbering_tranid'),
					subsidiary : line.getValue('custrecord_ilo_numbering_subsidiary')

			});

		});

	};
	
	return theNumbers;
}



function docNumbering_onLoad(type, form, request){

	//maybe to add onLoad function to show tranid to be saved
}


function docNumbering_beforeSubmit(type){
	
	if(type == 'create') {
		
		var AllNumbers = getLastNumbers();
		

		getTranType = nlapiGetRecordType();
		getSubsidiary = nlapiGetFieldValue('subsidiary');
		getZuoraRef = nlapiGetFieldValue('custbodyzuorareferencenumber');
		
		var checkItemsLicense = [];		
		var itemsArr = [];
		var itemName;
		var itemID;

			var lineCount = nlapiGetLineItemCount('item');
			if (lineCount > 0) {
				for (var i = 1; i <= lineCount; i++) {
					itemName = nlapiGetLineItemValue('item', 'name', i);
		itemsArr.push(itemName);
		itemID = nlapiGetLineItemValue('item', 'item', i);
		checkItemsLicense.push(itemID);
						}
						}
			
			var ticketID = '101'; //internal id of Tickets Item in sandbox
			
			if(checkItemsLicense.indexOf(ticketID) != -1) {
				
				isTicket = 'isTicket';
			}
		
		if(getZuoraRef != '') {
			
			if((getSubsidiary == '1') && (getTranType == 'invoice') && (getZuoraRef != '')) {
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_INV_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_INV_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '9');
				ZUO_INV_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_INV_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
			if((getSubsidiary == '2') && (getTranType == 'invoice') && (getZuoraRef != '')) {
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_INV_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_INV_INC = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '10');
				ZUO_INV_INC.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_INV_INC);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
			
			if((getSubsidiary == '4') && (getTranType == 'invoice') && (getZuoraRef != '')) {
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_INV_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_INV_SAS = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '17');
				ZUO_INV_SAS.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_INV_SAS);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
			
			if((getSubsidiary == '1') && (getTranType == 'creditmemo') && (getZuoraRef != '')) {
				

				 var newId = nlapiGetRecordId();
				 var newType = nlapiGetRecordType();
				 

				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_CM_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_CM_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '11');
				ZUO_CM_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_CM_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
			if((getSubsidiary == '2') && (getTranType == 'creditmemo') && (getZuoraRef != '')) {
				

				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_CM_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_CM_INC = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '12');
				ZUO_CM_INC.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_CM_INC);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
			if((getSubsidiary == '4') && (getTranType == 'creditmemo') && (getZuoraRef != '')) {
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'ZUO_CM_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var ZUO_CM_SAS = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '18');
				ZUO_CM_SAS.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(ZUO_CM_SAS);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}
				
			}//end of if(getZuoraRef != '')//
			
			
		
		////////////
		//INVOICES//
		////////////
			
			if((getSubsidiary == '1') && (getTranType == 'invoice') && (getZuoraRef == '')) {
				
//				var date = new Date();
				var timestamp = Date.now().toString();
				
				nlapiLogExecution("DEBUG", 'usereventBS - time', 'UE-BS ' + timestamp);
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'INV_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var inv_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '2');
				inv_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(inv_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of LTD(invoice) - Manual
			
			if((getSubsidiary == '2') && (getTranType == 'invoice') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'INV_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var inv_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '1');
				inv_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(inv_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of INC(invoice) - Manual
			
			
			
			if((getSubsidiary == '4') && (getTranType == 'invoice') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'INV_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var inv_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '3');
				inv_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(inv_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of SAS(invoice) - Manual
			
			///////////////
			//CREDIT MEMO//
			///////////////
			
			if((getSubsidiary == '1') && (getTranType == 'creditmemo') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'CM_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var CM_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '4');
				CM_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(CM_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of LTD(creditmemo) - Manual
			
			if((getSubsidiary == '2') && (getTranType == 'creditmemo') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'CM_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var CM_INC = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '5');
				CM_INC.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(CM_INC);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of INC(creditmemo) - Manual
			
			if((getSubsidiary == '4') && (getTranType == 'creditmemo') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'CM_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var CM_SAS = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '6');
				CM_SAS.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(CM_SAS);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of SAS(creditmemo) - Manual
			
			//////////////////////
			//TICKETS - INVOICE///
			//////////////////////
			
			if((getSubsidiary == '1') && (getTranType == 'invoice') && (isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '7');
				TKT_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of LTD(invoice) - Ticket
			
			if((getSubsidiary == '2') && (getTranType == 'invoice') &&(isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_INC = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '13');
				TKT_INC.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_INC);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of INC(invoice) - Ticket
			
			if((getSubsidiary == '4') && (getTranType == 'invoice') &&(isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_SAS = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '15');
				TKT_SAS.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_SAS);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of SAS(invoice) - Ticket
			
			//////////////////////
			//TICKETS - INVOICE///
			//////////////////////
			
			if((getSubsidiary == '1') && (getTranType == 'creditmemo') &&(isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_CM_LTD'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_CM_LTD = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '8');
				TKT_CM_LTD.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_CM_LTD);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of LTD(creditmemo) - Ticket
		
			if((getSubsidiary == '2') && (getTranType == 'creditmemo') &&(isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_CM_INC'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_CM_INC = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '14');
				TKT_CM_INC.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_CM_INC);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of INC(creditmemo) - Ticket
			
			if((getSubsidiary == '4') && (getTranType == 'creditmemo') &&(isTicket == 'isTicket') && (getZuoraRef == '')) {
				
				for(var i = 0; i<AllNumbers.length; i++){
					
					if(AllNumbers[i].name == 'TKT_CM_SAS'){
						
						lastTranID = AllNumbers[i].last_number;
					}
				
			}
				
				var numArr = lastTranID.split(/(\d+)/);
				
				var prefix = numArr[0];
				var docNum = numArr[1];

				var nextNum = parseInt(docNum) +1;
				var str_nextNum = nextNum.toString();
				
				var newTranID = prefix+str_nextNum;
				
				var TKT_CM_SAS = nlapiLoadRecord('customrecord_ilo_inv_cm_numbering', '16');
				TKT_CM_SAS.setFieldValue('custrecord_ilo_numbering_tranid', newTranID);
				nlapiSubmitRecord(TKT_CM_SAS);
				
				nlapiSetFieldValue('tranid', newTranID);
			
			
		}//end of SAS(creditmemo) - Ticket
			
	}//if type == create
 
}
