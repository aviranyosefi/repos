function makeEasyObject_Item(rec, sublistType) {

	var SubListArr = [];
	
	var lineCount = rec.getLineItemCount(sublistType);

	var fieldNames = rec.getAllLineItemFields(sublistType);

	for (var lineNum = 1; lineNum <= lineCount; lineNum++) {

		var SubListObj = new Object();

		for (var i = 0; i < fieldNames.length; i++) {

			var fieldValues = rec.getLineItemValue(sublistType, fieldNames[i],
					lineNum);

			SubListObj[fieldNames[i]] = fieldValues;
		};
		
		SubListArr.push(SubListObj);
	};
	
	//get value of any sublist field by calling the SubListArr[?].property
	//for example below we get the trandate from the first object(lineitem)
	var trandate = SubListArr[0].trandate;
	console.log(trandate);
	console.log(SubListArr);
	var a = a;	//for debug

}

var rec = nlapiLoadRecord('opportunity', 1);

makeEasyObject_Item(rec, 'estimates');
