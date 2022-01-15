function beforeSubmit() {

    var end_user = nlapiGetFieldValue('custbody_sim_end_user');
    if (end_user != '' && end_user != null && end_user != undefined) {
        var customerRec = nlapiLoadRecord('customer', end_user)
        var address = customerRec.getFieldValue('defaultaddress');
        if (address != '' && address != null && address != undefined) {
            nlapiSetFieldValue('custbody_end_user_address', address);
        }

    }

}