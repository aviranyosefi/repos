// JavaScript source code
function onclick_print() {
    try {
        var suiteletURL = 'https://system.na1.netsuite.com' + nlapiResolveURL('SUITELET', 'customscript_comercial_print_suitlet', 'customdeploy_comercial_print_suitlet_dep')+'&custparam_recid='+nlapiGetRecordId(); 
            //na1 can be changed depending on the data center/url of the user
            //scriptid and deploymentid will depend on the Suitelet that will be created below

         window.open(suiteletURL);

   }
    catch (e) {
        nlapiLogExecution('error', 'onclick_payment_request().', e);
    }
}