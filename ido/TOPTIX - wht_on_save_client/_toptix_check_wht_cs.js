/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 May 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */

var confirm_save;

function check_wht_confirmBox(){
	
//	try{
//		
//		var vendorid = nlapiGetFieldValue('entity');
//		var trandate = nlapiGetFieldValue('trandate');
//		
//		var checkWHT = GetVendorWHT(vendorid, trandate);
//		
//		if(checkWHT == null) {
//			
//			showPrompt();
//			console.log(confirm_save)
//			return confirm_save;		
//		}
//		else{
//			return true;
//		}
//		
//	}
//	catch(err) {
//		
//		console.log(err);
//		return true;
//	}
	return true;
   
}

function showPrompt(){
	Ext.Msg.confirm("שים לב", "לספק אין ניכוי בתאריך התשלום , וינוכה לו מקסימום במקרה זה. האם להמשיך?", handlePromptResult, this);
	
	function handlePromptResult(buttonClicked, text) {
	if(buttonClicked == 'yes') {
	console.log('yes');
	
	}
			if(buttonClicked == 'no') {
	console.log('no');
	
	}
		confirm_save = 	buttonClicked == 'yes';
	}
	
}


function GetVendorWHT(vendorid, date) {
    nlapiLogExecution('debug', 'GetVendorWHT', 'start:' + vendorid);
    var result = null;
    var search = nlapiLoadSearch(null, 'customsearch_il_vendor_certificate');
    search.addFilter(new nlobjSearchFilter('custrecord_vendor_cert_vendorid', null, 'is', vendorid));
    //search.addFilter(new nlobjSearchFilter('custrecord_vendor_cert_groupid', null, 'is', groupid));
    var resultSet = search.runSearch();

    resultSet.forEachResult(
            function (item) {
                var searchColumns = resultSet.getColumns();
                var startate = getColVal(searchColumns, item, "custrecord_vendor_cert_fromdate");
                var enddate = getColVal(searchColumns, item, "custrecord_vendor_cert_enddate");
                var percent = getColVal(searchColumns, item, "custrecord_vendor_cert_percent");
                if (convertDate(enddate) >= convertDate(date) && convertDate(startate) <= convertDate(date))
                    result = percent.replace('%', '');
                return true;
            });
    nlapiLogExecution('debug', 'GetVendorWHT', 'result:' + result);
    return result;
}


function getColVal(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getValue(columns[i]);
    }

    return value;
}

function convertDate(odate) { // Convert to vat date format - from 28/4/2016 to YYYYMMDD
    if (odate == undefined)
        return '';
    var dateformat = 'dd/MM/yyyy';
    var ISMMDD;
    var dateMMDD = '3/31/17';
    var check = nlapiStringToDate(dateMMDD);
    whatFormat = isNaN(check);
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';

    var newDate = '';
    var arr = odate.split("/");
    var day = arr[0];
    var month = arr[1];

    if (dateformat.toLowerCase() == "mm/dd/yyyy") {
        day = arr[1];
        month = arr[0];
    }
    newDate = new Date(arr[2], month - 1, day);
    //  nlapiLogExecution('debug', 'convertDate' + odate, 'dateformat:' + dateformat + ' ' + newDate);
    return newDate;
}