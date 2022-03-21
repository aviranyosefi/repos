/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 May 2018     idor
 *
 */




var arr = [
           
20413,
18007,
18201,







,];


arr.forEach(function(element) {



		var bill = nlapiLoadRecord('invoice', element);
		var itemCount = bill.getLineItemCount('accountingbookdetail');
		var subsid = bill.getFieldValue('subsidiary')	

		if(subsid == '3') {
			
			console.log(element)
			
		
		}
		else {
		try{
			

	//var exRateBody = bill.setFieldValue('exchangerate', '0.28579')
			
		for (var i=0; i<itemCount ; i++ ) { 
			
			var exchangeRate = bill.setLineItemValue('accountingbookdetail', 'exchangerate', i+1, '3.597');

		}
		var ctx = nlapiGetContext();
		var usage = ctx.getRemainingUsage();
		
		nlapiSubmitRecord(bill)
		console.log(usage)
		}catch(err) {
			console.log(err)
		}
		}
	
		
});