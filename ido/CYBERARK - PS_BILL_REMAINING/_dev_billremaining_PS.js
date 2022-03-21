function execute_billRemaining() {
	
	var res = getSearch();
	
	var resKeys = res[0];
	var results = res[1];
	
	nlapiLogExecution('debug', 'resKeys', JSON.stringify(res[0], null, 2));
	nlapiLogExecution('debug', 'results', JSON.stringify(res[1], null, 2));

		if(res != null || res != [] || res != '' || res != null) {
		

var resKeys = res[0];
var results = res[1];

//nlapiLogExecution('debug', 'results', JSON.stringify(results, null , 2))
			
resKeys.forEach(function(SO_id) {
	
	try{
		
	  var currObj = results[SO_id];
	 

	  var billRecord = nlapiTransformRecord('salesorder', SO_id, 'invoice');
	  var subsid = billRecord.getFieldValue('subsidiary');
	  var billCountry = billRecord.getFieldValue('billcountry');
	  var taxcodeToInsert = getTaxCode(subsid);

	  var fixAva = false;
	  
	  var initalLineCount = billRecord.getLineItemCount('item');

		for (var a = initalLineCount; a >= 1; a--) {
		  
		  	var initiallineId = billRecord.getLineItemValue('item', 'custcol_ps_conv_line_id', a);
		  	
		  	if(billCountry != 'CA') {
			  	var setTaxCode = billRecord.setLineItemValue('item', 'taxcode', a, taxcodeToInsert);	
		  	}
		  	if(billCountry == 'CA') {
		  		 var CA_taxcode = getTaxCode('23') //Canadian Subsid
		  		 billRecord.setLineItemValue('item', 'taxcode', a, '2468');	//CA-UNDEF
		  	}
	

		  	
		  	var checkTaxable = billRecord.getLineItemValue('item', 'istaxable', a)
			
		  	if(checkTaxable == 'T') {
		  		
		  		billRecord.setLineItemValue('item', 'istaxable', a, 'F');
		  		fixAva = true;

		  		
		  	}
		  	
		  	
		  	if(initiallineId == null || initiallineId == '') {
				
				billRecord.removeLineItem('item', a);
				
				}
	  }
		
		nlapiLogExecution('debug', 'fixAva', fixAva)
		if(fixAva == true) {
	  		billRecord.setFieldValue('taxitem', "");
	  		billRecord.setFieldValue('istaxable', 'F');
			
		}
	  
	  var initialSumCheck = billRecord.getFieldValue('total');

	  if(initialSumCheck == '0.00'){
		  
		  billRecord.setFieldValue('custbody_ps_billremained_executed', 'T');
		  billRecord.setFieldValue('custbody_ps_conversion_invoice', 'T');
			if(fixAva == true) {
		  		billRecord.setFieldValue('taxitem', " ");
		  		billRecord.setFieldValue('istaxable', 'F');
				
			}
	    	var initialZeroInv = nlapiSubmitRecord(billRecord);
	    	nlapiLogExecution('debug', 'initialSumCheck', initialSumCheck);
			nlapiLogExecution('debug', 'submittedInv', initialZeroInv);
			
			nlapiSubmitField('salesorder', SO_id, 'custbody_ps_billremained_executed', 'T')
			
			var context = nlapiGetContext();
			var usageRemaining = context.getRemainingUsage();
			nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
			nlapiLogExecution('debug', 'fulfillQtyChange', fulfillQtyChange)
	  }
	  else{
	  	  
	  var lineCount = billRecord.getLineItemCount('item');
	  
	  for(var x = 0; x<lineCount; x++) {
		  			  
	
					var lineItem = billRecord.getLineItemValue('item', 'item', x+1); 
					var lineType = billRecord.getLineItemValue('item', 'custcol_ps_conv_line_type', x+1);
					var lineId = billRecord.getLineItemValue('item', 'custcol_ps_conv_line_id', x+1);
					
					var searchLineQty = getQtyValue(currObj, lineId)
					
					nlapiLogExecution('debug', 'checkLine at : ' + x+1, 'lineId = ' + lineId)
				
					if(lineType == '3' && searchLineQty == '0') {						
						billRecord.removeLineItem('item', x+1);
					}


	  }//loop over billRecord lines
	  

	  //second and final check that the total amount is '0'
	  var newLineCount = billRecord.getLineItemCount('item');
	  var totalSum = 0;
	  for(var j = 0; j<newLineCount; j++) {

	  totalSum += parseFloat(billRecord.getLineItemValue('item', 'amount', j+1));

	  }

	    //only if the total amount of the invoice being created is '0'(integer) then submit
	    if(totalSum === 0) {	 
	    	  billRecord.setFieldValue('custbody_ps_billremained_executed', 'T');
	    	  billRecord.setFieldValue('custbody_ps_conversion_invoice', 'T');
	    	var submittedInv = nlapiSubmitRecord(billRecord)
	    	nlapiLogExecution('debug', 'totalSum', totalSum)	
			nlapiLogExecution('debug', 'submittedInv', submittedInv)	
			
			nlapiSubmitField('salesorder', SO_id, 'custbody_ps_billremained_executed', 'T')
			 	var context = nlapiGetContext();
		var usageRemaining = context.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
	    }
	    if(totalSum !== 0) {
	    	nlapiLogExecution('debug', 'not zero total sum', totalSum)
	    		 	
	  var lastLineCount = billRecord.getLineItemCount('item');
	  for(var j = 0; j<newLineCount; j++) {
		  
			var lineItem = billRecord.getLineItemValue('item', 'item', j+1); 
			var lineType = billRecord.getLineItemValue('item', 'custcol_ps_conv_line_type', j+1);
			var lineId = billRecord.getLineItemValue('item', 'custcol_ps_conv_line_id', j+1);
			
			var searchLineQty = getQtyValue(currObj, lineId) 
			
	nlapiLogExecution('debug', 'theLines' , 'lineNumber : '+ (j+1) + ' lineType : ' + lineType +' lineId : ' + lineId +' searchLineQty : ' + searchLineQty)
					

					
			 if(lineType == '3' && searchLineQty != '0') {
				nlapiLogExecution('debug', 'Math.abs(searchLineQty).toString()', Math.abs(searchLineQty).toString())
				nlapiLogExecution('debug', 'QTY NOT ZERO - lineNumber : '+ (j+1), ' lineType : ' + lineType +' lineId : ' + lineId +' searchLineQty : ' + searchLineQty)
				billRecord.setLineItemValue('item', 'quantity', j+1, Math.abs(searchLineQty).toString())
			}
			

			

	  }
	  
	  billRecord.setFieldValue('custbody_ps_billremained_executed', 'T');
	  billRecord.setFieldValue('custbody_ps_conversion_invoice', 'T');
	  	var fulfillQtyChange = nlapiSubmitRecord(billRecord);
		nlapiSubmitField('salesorder', SO_id, 'custbody_ps_billremained_executed', 'T')
	  	var context = nlapiGetContext();
		var usageRemaining = context.getRemainingUsage();
		nlapiLogExecution('debug', 'usageRemaining', usageRemaining)
		nlapiLogExecution('debug', 'fulfillQtyChange', fulfillQtyChange)
	  }
	}

	}catch(err){
		nlapiLogExecution('debug', 'err', err)
	}
	
	});


		
	}// end of 	if(res != null || res != [] || res != '' || res != null) 

		//approx 45 governance units per salesorder
}

function getQtyValue(arr, value) {

	  for (var i=0, iLen=arr.length; i<iLen; i++) {

	    if (arr[i].ps_lineid == value) return arr[i].sum_qty;
	  }
	}
		

			function isNegative(val) {
		
			var res = val.indexOf('-');
		
			if (res == 0) {
				return true;
			} else {
				return false
			}
			}

		
		function getSearch() {

		    var savedSearch = nlapiLoadSearch(null, 'customsearch_ps_billremaining_search');

		    var resultset = savedSearch.runSearch();
		    var returnSearchResults = [];
		    var searchid = 0;
			var results = [];
			var cols = savedSearch.getColumns();
			
			var SO_interalID =[];

		    do {
		        var resultslice = resultset.getResults(searchid, searchid + 1000);
		        for ( var rs in resultslice) {
		            returnSearchResults.push(resultslice[rs]);
		            searchid++;
		        }
		    } while (resultslice.length >= 1000);

			if(returnSearchResults != null) {
			returnSearchResults.forEach(function(element) {
				
				 SO_interalID.push(element.getValue(cols[1]))
				
					results.push({
				
						
						salesorder_id : element.getValue(cols[1]),
						sum_qty : element.getValue(cols[3]),
						sum_amt: element.getValue(cols[4]),
						ps_lineid : element.getValue(cols[2]),
				});	
				});

			}
			
			var SOarr = remove_duplicates(SO_interalID);
			var SO_obj = {};
		
			for(var x = 0; x<SOarr.length; x++) {
				
				SO_obj[SOarr[x]] = [];
			}
			
			
			var objkeys = Object.keys(SO_obj);
			
		
			results.forEach(function(element) {
				
				for(var i = 0; i<objkeys.length; i++) {
					
				if(element.salesorder_id == objkeys[i]) {
					
					
					SO_obj[objkeys[i]].push(element);
				}	
					
				}
			
				});
			
	
			return [SOarr, SO_obj];

		}
		
		function remove_duplicates(arr) {
		    var obj = {};
		    var ret_arr = [];
		    for (var i = 0; i < arr.length; i++) {
		        obj[arr[i]] = true;
		    }
		    for (var key in obj) {
		        ret_arr.push(key);
		    }
		    return ret_arr;
		}
		


		function getTaxCode(subsidiary) {
			var res = '';

			var arr = [
			{subsidiary : '22' , taxcode: '5'}, //202_CyberArk ISR
			{subsidiary : '18' , taxcode: '-7'}, //302_CyberArk USA
			{subsidiary : '23' , taxcode: '263'}, //303_CyberArk CAN
			{subsidiary : '14' , taxcode: '6'}, //402_CyberArk GBR
			{subsidiary : '12' , taxcode: '78'}, //403_CyberArk FRA
			{subsidiary : '10' , taxcode: '41'}, //404_CyberArk DEU
			{subsidiary : '11' , taxcode: '61'}, //405_CyberArk ITA
			{subsidiary : '13' , taxcode: '103'}, //406_CyberArk NLD 
			{subsidiary : '15' , taxcode: '22'}, //502_CyberArk SGP
			{subsidiary : '17' , taxcode: '167'}, //503_CyberArk JPN
			{subsidiary : '16' , taxcode: '150'}, //504_CyberArk AUS
			]

			for(var i = 0; i<arr.length; i++) {

			if(subsidiary == arr[i].subsidiary) {


			res = arr[i].taxcode;
			}


			}


			return res
			}



