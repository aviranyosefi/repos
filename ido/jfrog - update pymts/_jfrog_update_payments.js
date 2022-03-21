
var pymtArr = [
'RCUS1722835',
'RCUS1722837',
'RCUS1722840',
'RCUS1722841',
'RCUS1722929',
'RCUS1722933',
'RCUS1722934'


];



		pymtArr.forEach(function(pymt) {
		
		
		var currPymt = getPayment(pymt);
		if(currPymt != null || currPymt != []) {
		
			var rec = nlapiLoadRecord('customerpayment', currPymt[0].internalid);
			var lineCount = rec.getLineItemCount('apply');
			
	
			for(var i = 0; i<lineCount; i++) {
				
				try{
					
			
			
			if(rec.getLineItemValue('apply', 'apply', i+1) == 'T') {
				
				var amtdue = rec.getLineItemValue('apply', 'due', i+1)
				var total = rec.getLineItemValue('apply', 'amount', i+1)
				
				rec.setLineItemValue('apply', 'amount', i+1, amtdue)
				
				nlapiSubmitRecord(rec)
					var v = nlapiGetContext();
		var y = v.getRemainingUsage();
		
		console.log(y)
			}
			
				}catch(err){
					continue;
					
				}
			
			}
			
		
		}
		
	
			});


function getPayment(pymt) {
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('transactionnumbertext', null, 'haskeywords', pymt);
	filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	
	var cols = new Array();
	cols[0] = new nlobjSearchColumn('internalid')

	var search = nlapiSearchRecord('customerpayment', null, filters, cols);
	var results = [];
	
	
	if (search != null) {
		search.forEach(function(line) {
			
			results.push({
			
			internalid : line.getValue('internalid'),

			});

		});

	};
	
	return results;
}