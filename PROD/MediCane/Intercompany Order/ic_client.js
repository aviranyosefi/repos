function Intercompany() {

    debugger;
    if (confirm("are you sure ?")) {       
        var createdUrl = nlapiResolveURL('SUITELET', 'customscript_ic_suitlet', 'customdeploy_ic_suitlet', false);
        createdUrl += '&id=' + nlapiGetRecordId();
        createdUrl += '&type=' + nlapiGetRecordType();
        var response = nlapiRequestURL(createdUrl);
        if (response.getBody()) {
            alert(response.getBody());
            window.location.reload();
        }
    }
    else { return false }
}
function saveRecord() {
    debugger;
    if (!isNullOrEmpty(nlapiGetFieldValue('custbody_ic_target_tran'))) {      
        if (nlapiGetFieldValue('custbody_ic_already_fulfill') == 'T') {
                alert('The Sale Order Has Been Fulfilled And Can’t be Update');
                return false;
            }          
        alert('The Sale Order Will Be Update');
    }
    return true;
}