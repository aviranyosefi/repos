function PageLoad() {
    var from_workflow =nlapiGetFieldValue('custbody_test_from_site')
    if (from_workflow == 'T') {    
        nlapiSetFieldValue('entity', nlapiGetFieldValue('entity')) 
        return true;
    }
}