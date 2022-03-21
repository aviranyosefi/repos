function makeEasyObject() {
	
	var arr = [];
	
	var rec = nlapiLoadRecord('salesorder', 12);
	
	
	var Fields = new Object();
	


	var subLists = rec.getSubList('item');

	var FieldsNames = rec.getAllLineItemFields('item');
	

	for (var i=0; i < FieldsNames.length; i++) {
		
		var FieldValues = rec.getLineItemValue('item', FieldsNames[i], 1);
		Fields[FieldsNames[i]] = FieldValues;
	};

	
	var a = a;

}
makeEasyObject();
