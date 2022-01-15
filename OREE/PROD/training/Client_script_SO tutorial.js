function commit_val_deposit_based(type, name) {
    //debugger;
    nlapiLogExecution('DEBUG', 'name= ', name);
    if (name == 'custbody_dep_percent') {
        var percent = nlapiGetFieldValue('custbody_dep_percent');
        var ind = percent.indexOf('.');
        if (ind != -1) {
            percent = percent.substring(0, ind);
        }
        nlapiLogExecution('DEBUG', 'percent= ', percent);
        var intPercent = parseInt(percent);

        if (intPercent >= 10) {
            var count = nlapiGetLineItemCount('item');

            for (var i = 0; i < count; i++) {
                nlapiSetLineItemValue("item", "description", i + 1, "Special deposit percentage");
                nlapiSelectLineItem('item', 1);
                nlapiLogExecution('DEBUG', ' BEFOR commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
                //nlapiSetLineItemValue("item", "commitinventory", i + 1, 3);
                nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit", false);
                nlapiLogExecution('DEBUG', 'AFTER commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
            }
        }
    }
}


function commit_val_deposit_based() {
    debugger;
    var percent = nlapiGetFieldValue('custbody_dep_percent');
    var ind = percent.indexOf('.');
    if (ind != -1) {
        percent = percent.substring(0, ind);
    }
    nlapiLogExecution('DEBUG', 'percent= ', percent);
    var intPercent = parseInt(percent);

    if (intPercent >= 10) {
        var count = nlapiGetLineItemCount('item');

        for (var i = 0; i < count; i++) {
            nlapiSetLineItemValue("item", "description", i + 1, "Special deposit percentage");
            nlapiLogExecution('DEBUG', ' BEFOR commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
            //nlapiSetLineItemValue("item", "commitinventory", i + 1, 3);
            nlapiSetCurrentLineItemText('item', 'commitinventory', "Do Not Commit");
            nlapiLogExecution('DEBUG', 'AFTER commitinventory= ', nlapiGetLineItemValue('item', 'commitinventory', 1));
        }
    }
}


//var description = nlapiGetLineItemValue('item', 'description', 1);
//var com = nlapiGetLineItemValue('item', 'commitinventory', 1);






//edits---------------
function commit_val_deposit_based() {
    debugger;
    var percent = nlapiGetFieldValue('custbody_dep_percent');
    var ind = percent.indexOf('.');
    if (ind != -1) {
        percent = percent.substring(0, ind);
    }
    nlapiLogExecution('DEBUG', 'percent= ', percent);
    var intPercent = parseInt(percent);

    if (intPercent >= 10) {
        custbody_cseg2
        var count = nlapiGetLineItemCount('item');

        for (var i = 0; i < count; i++) {
            nlapiSetLineItemValue("item", "description", i + 1, "Special deposit percentage");
            nlapiSetLineItemValue("item", 'commitinventory', i + 1, "Do Not Commit");
        }
    }
}


//nlapiSetCurrentLineItemValue
//nlapiSelectLineItem('item', 'i'); 

//nlapiSetCurrentLineItemText('item', 'commitinventory',"Do Not Commit");

//var description = nlapiGetLineItemValue('item', 'description', 1);
//var com = nlapiGetLineItemValue('item', 'commitinventory', 1);

//nlapiFieldChanged(null , <field name>)
