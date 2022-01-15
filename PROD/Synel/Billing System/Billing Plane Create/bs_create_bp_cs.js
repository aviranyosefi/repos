function CreateBillingPlan() {
    debugger;
        var createdUrl = nlapiResolveURL('SUITELET', 'customscript_bs_create_bl_su', 'customdeploy_bs_create_bl_su', false);
        createdUrl += '&id=' + nlapiGetRecordId();
        nlapiRequestURL(createdUrl);
        window.location.reload();
   
}