/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Mar 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function updateAccount(type){


	var arr = [
1194,
11385,
2122,
97,
256,
2090,
822,
824,
274,
736,
1456,
881,
11025,
2087,
910,
939,
1975,
1944,
10937,
1962,
1964,
1251,
1840,
1834,
2003,
1954,
2079,
3742,
3744,
11329,
7415,
7420,
7418,
11068,
11101,
11091,
11297,
719,
732

];
	

		
		for(var x = 0; x<arr.length; x++) {
		  
		var recID = arr[x];
		
		var rec = nlapiLoadRecord('vendorpayment', recID);

		var accField = rec.getFieldValue('account')
		
			if(accField == '946') {
				
				rec.setFieldValue('account', '980')
			}
			
		nlapiSubmitRecord(rec)
		
		
		};
   
}
