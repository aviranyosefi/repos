function _shipping_weights_bs(type){
	
	var ctx = nlapiGetContext();
	var role = ctx.role;
	var subsid = nlapiGetFieldValue('subsidiary');
	
	if (role != '14' && subsid == '1'){
	
	var linecount = nlapiGetLineItemCount('item');
	
	//var allItems = getAllItems();
	
	for(var i = 1; i<=linecount; i++) {
		
		var currentItem = 	nlapiGetLineItemValue('item', 'item', i);
		var currentQty = nlapiGetLineItemValue('item', 'quantity', i);
		
		
		//var itemType = '';
		
		//for(var x = 0; x<allItems.length; x++) {
			
		//	if(allItems[x].internalid == currentItem) {
				
		//		itemType = allItems[x].type;
		//	}
		//}		
		//if(itemType != '') {
			
		
        //var itemRec = nlapiLoadRecord('item', currentItem);
        var itemRec=nlapiLookupField('item', currentItem, ['weight','weightunit']);
		
        var itemWeight = itemRec.weight
        //var weightUnit = itemRec.weightunit //itemRec.getFieldValue('weightunit');
		
		if(itemWeight != null || itemWeight != "" || itemWeight != undefined) {
			try{
				nlapiSetLineItemValue('item', 'custcol_ilo_item_totalweight_kg', i, itemWeight*currentQty)
			
			}catch(err) {
				nlapiLogExecution('debug', 'err', 'Total weight error : '+err)
			}
		
		}
		//}//	if(itemType != '')

		
	}
	
	return true;

	}//end of if (role != '14' && subsid == '1')
 return true;
}



function getAllItems() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('type');
	cols[2] = new nlobjSearchColumn('isserialitem');


	var s = nlapiSearchRecord('item', null, null, cols);

	if (s != null) {

		var serialized = 'serializedinventoryitem';
		var notSerialized = 'inventoryitem';

		for (var i = 0; i < s.length; i++) {

			//var type = '';

			//if (s[i].getValue('isserialitem') == 'T') {

			//	type = serialized;
			//}

			//if (s[i].getValue('isserialitem') == 'F') {

			//	type = notSerialized;
			//}

			//if (s[i].getValue('type') == 'NonInvtPart') {

			//	type = 'noninventoryitem';
			//}

			//if (s[i].getValue('type') == 'Assembly') {

			//	type = 'serializedassemblyitem';
			//}
          
   //       	if (s[i].getValue('type') == 'Service for Sale') {

			//	type = 'serviceitem';
			//}
			
			//if (s[i].getValue('type') == 'Kit') {

			//	type = 'kititem';
			//}

			resultsArr.push({
				name : s[i].getValue('name'),
				internalid : s[i].id,
				//type : type
			});

		}

	}

	return resultsArr;

}