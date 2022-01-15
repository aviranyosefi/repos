function commit_val_deposit_based(type, name) {
    nlapiLogExecution('DEBUG', 'name= ', name);
    if (name == 'custbody_dep_percent') { //fire only on a specific field change.
        var percent = nlapiGetFieldValue('custbody_dep_percent');// get value from a field on Main subtab.
        var ind = percent.indexOf('.');
        if (ind != -1) {
            percent = percent.substring(0, ind);
        }
        nlapiLogExecution('DEBUG', 'percent= ', percent);
        var intPercent = parseInt(percent);

        if (intPercent >= 10) {
            var count = nlapiGetLineItemCount('item');// Gets the count of the sublist records 
            for (var i = 0; i < count; i++) {
                nlapiSetLineItemValue("item", "description", i + 1, "Special deposit percentage");// set value for a custom column "free text" type
                nlapiSelectLineItem('item', i + 1);// select the current line on the sublist (required for set value for 'select' list type)
                nlapiLogExecution('DEBUG', ' BEFOR commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
                nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);//set value for a custom column 'select' list type, 
                //third Parameter 'firefieldchanged' If true, then the fieldchange script for that field is executed
                nlapiLogExecution('DEBUG', 'AFTER commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
            }
        }
    }
}


//        var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());

//var columns = new Array();
//columns[0] = new nlobjSearchColumn('name');
//columns[1] = new nlobjSearchColumn('internalid');
//columns[2] = new nlobjSearchColumn('custrecord_ib_subscription');

//var record =  nlapiSearchRecord('salesorder',new nlobjSearchFilter('memo', null, 'isnotempty'),in