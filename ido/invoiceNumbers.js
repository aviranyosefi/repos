/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Nov 2016     idor
 *
 */


// this search returns most recent Invoice created, its tranid and its trandate
	var columnsInvoice = new Array();
	columnsInvoice[0] = new nlobjSearchColumn('internalid', null, 'max');

	var s = nlapiSearchRecord('invoice', null, null, columnsInvoice);
	var content = 'Invoice #: ';
	if (s){
		var id = s[0].getValue(columnsInvoice[0]);
		if (id){
			
			var fields = ['tranid', 'trandate'];
			var columns = nlapiLookupField('invoice', id, fields);
			var tranid = columns.tranid;
			var trandate = columns.trandate;

			var objINV = {lastInv: tranid,
						trandate: trandate};
		};
	};
 //   console.log(objINV);
    
  
 // this search returns most recent Credit Memo created, its tranid and its trandate
    var columnsCredMemo = new Array();
    columnsCredMemo[0] = new nlobjSearchColumn('internalid', null, null).setSort(true);
    
    var sCM = nlapiSearchRecord('creditmemo', null, null, columnsCredMemo);
    if(sCM){
    	   var idCM = sCM[0].getValue(columnsCredMemo[0]);
    	   if (idCM) {
    		   
   			var CMfields = ['tranid', 'trandate'];
			var CMcolumns = nlapiLookupField('creditmemo', idCM, CMfields);
			var CMtranid = CMcolumns.tranid;
			var CMtrandate = CMcolumns.trandate;

			var objCM = {lastCM: CMtranid,
						CMtrandate: CMtrandate};
    	   }
    }
// console.log(objCM);
    