function CreateTrn() {

    var createdUrl = nlapiResolveURL('SUITELET', 'customscript_inventory_adj_so_su', 'customdeploy_inventory_adj_so_su', false);
    createdUrl += '&id=' + nlapiGetRecordId();
    var response = nlapiRequestURL(createdUrl);
    if (response.getBody()) {
        alert(response.getBody());
        window.location.reload();
    }
    

}