function budgetrefresh() {
    nlapiLogExecution('debug', ' budgetrefresh:  ', 'beginning');
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var abuType = 'customrecord_annual_budgeting_unit';
    var cbuType = 'customrecord_control_budgeting_unit';
    var exceeded = false;
    var budgetunits = false;
    var err_msg = '';
    var unitName = '';
    var abuArray = [];
    var cbuArray = [];
    var itemCount = rec.getLineItemCount('item');
    nlapiLogExecution('debug', ' record.getLineItemCount:  ', 'beginning');
    nlapiLogExecution('debug', ' itemCount:  ', itemCount);
    for (i = 1; i <= itemCount; i++) {

        currAbu = rec.getLineItemValue('item', 'custcol_budgeting_unit', i);
        currCbu = rec.getLineItemValue('item', 'custcol_budget_control_unit', i);
        currAmount = rec.getLineItemValue('item', 'amount', i);
        if (currAmount != null && currAmount != '' && currAmount != undefined && currAmount != '0') {
            currAmount = parseFloat(currAmount);
            if (currAbu != null && currAbu != '' && currAbu != undefined) {
                if (abuArray[currAbu] == null || abuArray[currAbu] == undefined) {
                    budgetunits = true;
                    var record = nlapiLoadRecord(abuType, currAbu);
                    var recId = nlapiSubmitRecord(record);
                    abuArray[currAbu] = {
                        availableFunds: parseFloat(nlapiLookupField(abuType, currAbu, 'custrecord_abu_avaliable_funds')),
                        exceededFlag: false,
                    }
                }
                if (abuArray[currAbu].availableFunds < 0 && abuArray[currAbu].exceededFlag != true) {
                    exceeded = true;
                    unitName = nlapiLookupField(abuType, currAbu, 'name');
                    err_msg += unitName + ', ';
                    abuArray[currAbu].exceededFlag = true;
                }
            }
            if (currCbu != null && currCbu != '' && currCbu != undefined) {
                if (cbuArray[currCbu] == null || cbuArray[currCbu] == undefined) {
                    budgetunits = true;
                    var record = nlapiLoadRecord(cbuType, currCbu);
                    var recId = nlapiSubmitRecord(record);
                    cbuArray[currCbu] = {
                        availableFunds: parseFloat(nlapiLookupField(cbuType, currCbu, 'custrecord_cbu_available_funds')),
                        exceededFlag: false,
                    }
                }
                if (cbuArray[currCbu].availableFunds < 0 && cbuArray[currCbu].exceededFlag != true) {
                    exceeded = true;
                    unitName = nlapiLookupField(cbuType, currCbu, 'name');
                    err_msg += unitName + ', ';
                    cbuArray[currCbu].exceededFlag = true;
                }
            }
        }
    }
    // div_budget.addEventListener('click', function () {
    //     this.style.display = 'none';
    //     document.getElementById("bgdiv").style.display = 'none';
    // });
    // document.getElementById("bgdiv").style.display = 'none';
    // var loadingdiv = document.getElementById('loadingdiv');
    // document.body.removeChild(loadingdiv);
    /************************/

    ////divs

    var bd = document.getElementById('bgdiv');
    document.getElementById("bgdiv").style.display = 'none';
    var loadingdiv = document.getElementById('loadingdiv');
    document.body.removeChild(loadingdiv);
    document.body.removeChild(bd);

    /// /divs

    showmsg(exceeded, err_msg, budgetunits);
}

function checkoverlimit(type, curr, amount) {
    nlapiLogExecution('debug', ' checkoverlimit:  ', curr);
    //var rec = nlapiLoadRecord(type, curr);
    //var recId = nlapiSubmitRecord(rec);
    var avalableField = 'custrecord_cbu_available_funds';
    var availableFunds = 0;
    var newAvailableFunds = 0;
    if (type == 'customrecord_annual_budgeting_unit') {
        avalableField = 'custrecord_abu_avaliable_funds';
    }
    availableFunds = parseFloat(nlapiLookupField(type, curr, avalableField));
    newAvailableFunds = availableFunds - amount;
    if (newAvailableFunds < 0) {
        return true;
    }
    else {
        return false;
    }

}


function showmsg(exceeded, err, budgetunits) {
    nlapiLogExecution('debug', ' showmsg, exceeded: ', exceeded);
    if (budgetunits == false) {
        showAlertBox(
            "my_element_id",   // Dummy element id of alert.
            "Verified",          // Message header.
            'No budget units to be evaluated',
            0,                 // Color of alert: 0 - Success (green), 1 - Information (blue), 2 - Warning (yellow), 3 - Error (red)
            "", "", "", ""        // Not sure what this does.
        );
    }
    else {
        if (exceeded == false) {
            showAlertBox(
                "my_element_id",   // Dummy element id of alert.
                "Verified",          // Message header.
                'All containing units are within their budget',
                0,                 // Color of alert: 0 - Success (green), 1 - Information (blue), 2 - Warning (yellow), 3 - Error (red)
                "", "", "", ""        // Not sure what this does.
            );
        }
        else {
            showAlertBox(
                "my_element_id",   // Dummy element id of alert.
                "The following units exceeded their budget: ",          // Message header.
                err,
                3,                 // Color of alert: 0 - Success (green), 1 - Information (blue), 2 - Warning (yellow), 3 - Error (red)
                "", "", "", ""        // Not sure what this does.
            );
        }
    }
}



/*
 function budgetrefresh() {
    nlapiLogExecution('debug', ' budgetrefresh:  ', 'beginning');
    nlapiLogExecution('debug', ' nlapiGetRecordType:  ', nlapiGetRecordType());
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var abuType = 'customrecord_annual_budgeting_unit';
    var cbuType = 'customrecord_control_budgeting_unit';
    var exceeded = false;
    var err_msg = '';
    var unitName = '';
    var itemCount = rec.getLineItemCount('item');
    nlapiLogExecution('debug', ' record.getLineItemCount:  ', 'beginning');
    nlapiLogExecution('debug', ' itemCount:  ', itemCount);
    for (i = 1; i <= itemCount; i++) {

        currAbu = rec.getLineItemValue('item', 'custcol_budgeting_unit', i);
        currCbu = rec.getLineItemValue('item', 'custcol_budget_control_unit', i);
        currAmount = rec.getLineItemValue('item', 'amount', i);
        if (currAmount != null && currAmount != '' && currAmount != undefined && currAmount != '0') {
            currAmount = parseFloat(currAmount);
            if (currAbu != null && currAbu != '' && currAbu != undefined) {
                if (checkoverlimit(abuType, currAbu, currAmount)) {
                    exceeded = true;
                    unitName = nlapiLookupField(abuType, currAbu, 'name');
                    err_msg += unitName + ', ';
                }
            }
            if (currCbu != null && currCbu != '' && currCbu != undefined) {
                if (checkoverlimit(cbuType, currCbu, currAmount)) {
                    exceeded = true;
                    unitName = nlapiLookupField(cbuType, currCbu, 'name');
                    err_msg += unitName + ', ';
                }
            }
        }
    }
    showmsg(exceeded, err_msg);
}

function checkoverlimit(type, curr, amount) {
    nlapiLogExecution('debug', ' checkoverlimit:  ', curr);
    var rec = nlapiLoadRecord(type, curr);
    var recId = nlapiSubmitRecord(rec);
    var avalableField = 'custrecord_cbu_available_funds';
    var availableFunds = 0;
    var newAvailableFunds = 0;
    if (type == 'customrecord_annual_budgeting_unit') {
        avalableField = 'custrecord_abu_avaliable_funds';
    }
    availableFunds = parseFloat(nlapiLookupField(type, curr, avalableField));
    newAvailableFunds = availableFunds - amount;
    if (newAvailableFunds < 0) {
        return true;
    }
    else {
        return false;
    }

}


function showmsg(exceeded, err) {
    nlapiLogExecution('debug', ' showmsg, exceeded: ', exceeded);
    if (exceeded == false) {
        showAlertBox(
            "my_element_id",   // Dummy element id of alert.
            "Verified",          // Message header.
            'all containing units are within their budget',
            0,                 // Colour of alert: 0 - Success (green), 1 - Information (blue), 2 - Warning (yellow), 3 - Error (red)
            "", "", "", ""        // Not sure what this does.
        );
    }
    else {
        showAlertBox(
            "my_element_id",   // Dummy element id of alert.
            "The following units exceeded their budget: ",          // Message header.
            err,
            3,                 // Colour of alert: 0 - Success (green), 1 - Information (blue), 2 - Warning (yellow), 3 - Error (red)
            "", "", "", ""        // Not sure what this does.
        );
    }
}

 
 
 */