
var createdfrom = nlapiGetFieldValue('createdfrom');
if (!isNullOrEmpty(createdfrom)) { var block = true; }
else var block = false;

function validateLine(type) {
    debugger;
    if (block) {
        alert(' You are not allowed to update items lines.');
        return false;
    }
    else return true;
}

// validateInsert
function validateInsert(type) {
    if (block) {
        alert(' You are not allowed to add items lines.');
        return false;
    }
    else return true;
}

// validateDelete
function validateDelete(type) {
    if (block) {
        alert(' You are not allowed to remove items lines.');
        return false;
    }
    else return true;
}





function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
