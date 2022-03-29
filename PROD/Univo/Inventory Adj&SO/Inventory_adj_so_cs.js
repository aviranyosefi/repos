function CreateTrn() {
    debugger;
    var createdUrl = nlapiResolveURL('SUITELET', 'customscript_inventory_adj_so_su', 'customdeploy_inventory_adj_so_su', false);
    createdUrl += '&id=' + nlapiGetRecordId();
    //createDiv();
    openLoadingdiv();
    var response = nlapiRequestURL(createdUrl);
    if (response.getBody()) {
        closeLoadingdiv();
        alert(response.getBody());
        window.location.reload();
    }   
}
function openLoadingdiv() {
    debugger;
    var bd = document.getElementById('bgdiv');
    var loadingdiv = document.getElementById('loadingdiv');
    bd.style.display = 'block'
    loadingdiv.style.display = 'block'
}
function closeLoadingdiv() {
    document.getElementById("bgdiv").style.display = 'none';
    document.getElementById("loadingdiv").style.display = 'none';
}