function beforeSubmit_func(context) {

	var lineCount = nlapiGetLineItemCount('item');
	var departmentHeader = nlapiGetFieldValue('department');
	var classHeader = nlapiGetFieldValue('class');
    var location = nlapiGetFieldValue('location');
    var customform = nlapiGetFieldValue('customform');
	//nlapiLogExecution('debug', 'lineCount:' + lineCount, 'departmentHeader: ' + departmentHeader + ' ,classHeader: ' + classHeader );

    for (var lineIndex = 1; lineIndex <= lineCount; lineIndex++) {
        nlapiSetLineItemValue('item', 'department', lineIndex, departmentHeader);//populate department from the header				
        nlapiSetLineItemValue('item', 'class', lineIndex, classHeader);//populate class from the header
        if (customform != 118) {
            nlapiSetLineItemValue('item', 'location', lineIndex, location); 
        }                 
	}
}

function isNullOrEmpty(val) {

	if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
		return true;
	}
	return false;
}

