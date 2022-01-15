function beforeSubmit() {

    var address = nlapiGetFieldValue('mainaddress_text')
    if (!isNullOrEmpty(address)) {
        nlapiSetFieldValue('custrecord_location_address', address);
    }

}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}