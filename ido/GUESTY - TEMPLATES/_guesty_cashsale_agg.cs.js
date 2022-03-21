


function updateAggField_afterSubmit(type) {
	
try{
	
	var linesToWork = [];
	var allLines = getAllLines();

	var itemArrKeyHolder = [];
	var itemArr = [];
	allLines.forEach(function(item){
		   itemArrKeyHolder[item.item] = itemArrKeyHolder[item.item]||{};
	    var obj = itemArrKeyHolder[item.item];
	    if(Object.keys(obj).length == 0)
	 	   itemArr.push(obj);
	    
	    obj.item = item.item;
	    obj.values  = obj.values || [];
	    obj.values.push({item:item.item, value: item.value, amount: item.amount, desc: item.desc });
	});


	itemArr.forEach(function(element) {

		   currItem = element.values;

		   var agg = aggregateLines(currItem);
		   for(var x = 0; x<agg.length; x++) {
			   
			   linesToWork.push(agg[x])
		   }
		   
		   
		 });

	//console.log(itemArr);
	nlapiLogExecution('debug', 'itemArr', JSON.stringify(itemArr, null, 2))
	//console.log(linesToWork)
	nlapiLogExecution('debug', 'linesToWork', JSON.stringify(linesToWork, null, 2))
	
	
	            if (linesToWork != []) {

                var comma = '_';

 
                var strEng = '';
                for (var i = 0; i < linesToWork.length; i++) {

                    var line = i + 1;
                    //var total = (Math.round(parseFloat(linesToWork[i].totalPymt) /10)*10).toFixed(2);
                   // strEng += '`' + line + comma + linesToWork[i].item + comma + comma + linesToWork[i].value + comma + linesToWork[i].amount + '`;';
                    strEng += '<td colspan="2" style="text-align:center;"><p style="width: 100%; text-align:center;">'+line+'</p></td>'+
                    		  '<td colspan="18" style="text-align:justify; text-justify:none;">' + linesToWork[i].item +'</td>'+
                    		  '<td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:center;">' + linesToWork[i].value +'</p></td>'+
                    		  '<td colspan="6" style="text-align:center; text-justify:none;"><p style="width: 100%; text-align:center;">' + linesToWork[i].amount +'</p></td>```'
                    //strTotal += parseFloat(total);
                    //currency = otherPymts[i].currency;
                }
	            }
	

	nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_guesty_agglines_for_print', strEng)
	
}catch(err) {
	nlapiLogExecution('debug', 'err', err)
}

	
}




function getAllLines() {

var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());	
	var lineCount = rec.getLineItemCount('item');
	var lineArr = [];
	
	for(var i = 0; i<lineCount; i++) {
		
		
		var item = rec.getLineItemText('item', 'item', i+1)
		nlapiLogExecution('debug', 'item', item)
		var productValue = parseFloat(rec.getLineItemValue('item', 'custcol_product_price_value', i+1));
		var amount = parseFloat(rec.getLineItemValue('item', 'amount', i+1));
		var desc = rec.getLineItemValue('item', 'description', i+1)
		var isTax = rec.getLineItemValue('item', 'custcol_tax_line', i+1)
		var isVat = rec.getLineItemValue('item', 'custcol_vat_line', i+1)
		
		if(item !== 'Tax') {
			
			lineArr.push({
				item : item,
				value : productValue,
				amount : amount,
				desc : desc
			})
			
		}
		

	}
	
	return lineArr;
}


function aggregateLines(arr) {
	var groupBy = function(xs, key) {
	  return xs.reduce(function(rv, x) {
	    (rv[x[key]] = rv[x[key]] || []).push(x);
	    return rv;
	  }, {});
	};


	var res = [];
	var grouped = groupBy(arr, 'value')
	var groupKeys = Object.keys(grouped)

	for(var i = 0; i<groupKeys.length; i++) {

	var currGroup = grouped[groupKeys[i]]
	if(currGroup.length === 1) {

	res.push(currGroup[0])
	}else{

	var allValues = [];
	var allAmounts = [];
	var allDescs = [];
	for(var x = 0; x<currGroup.length; x++) {
	allValues.push(currGroup[x].value)
	allAmounts.push(currGroup[x].amount)
	allDescs.push(currGroup[x].desc)
	}

	res.push({
	item : currGroup[0].item,
	value : allValues[0],
	amount : allAmounts.reduce(add, 0),
	desc : allDescs[0],
	})

	}

	}
	return res
	 }



	function add(a, b) {
	    return a + b;
	}



      