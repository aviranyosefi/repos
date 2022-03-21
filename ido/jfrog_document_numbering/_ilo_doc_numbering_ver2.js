var getTranType;
var getSubsidiary;
var getInvoiceType;

var getZuoraRef;

var newTranID;
var lastTranID;

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



function docNumbering_beforeSubmit(type){
	
		
//		var AllNumbers = getLastNumbers();
//		
//		
//		if((getSubsidiary == '2') && (getTranType == 'creditmemo')) {
			
			 var newId = nlapiGetRecordId();
			 var newType = nlapiGetRecordType();
			 
			 nlapiLogExecution('DEBUG','<Before Submit Script> type:'+type+', RecordType: '+newType+', Id :'+newId);
			
			 
			
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
					
					nlapiLogExecution('DEBUG', 'items ID', JSON.stringify(checkItemsLicense));
		
	
	
	
	
	
}
