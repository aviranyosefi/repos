function CreateTrn() {
    debugger;
    var createdUrl = nlapiResolveURL('SUITELET', 'customscript_inventory_adj_so_su', 'customdeploy_inventory_adj_so_su', false);
    createdUrl += '&id=' + nlapiGetRecordId();
    createDiv();
    openLoadingdiv();
    var response = nlapiRequestURL(createdUrl);
    if (response.getBody()) {
        closeLoadingdiv();
        alert(response.getBody());
        window.location.reload();
    }   
}
function createDiv() {
    var divhtml = "<div><b>Processing.....</b></div>";
    var style = "left: 25%; top: 25%; z-index: 10001; position:absolute;width:620px;height:40px;line-height:1.5em;cursor:pointer;margin:5px;list-style-type: none;font-size:12px; padding:5px; background-color:#FFF; border: 2px solid gray;border-radius:10px;display:none;";
    var stylebg = "position: absolute; z-index: 10000; top: 0px; left: 0px; height: 100%; width: 100%; margin: 5px 0px; background-color: rgb(204, 204, 204); opacity: 0.6;display:none;";
    var bgdiv = document.createElement('div')
    bgdiv.id = 'bgdiv';
    bgdiv.onclick = bgdiv.style.display = 'none';
    bgdiv.style.cssText = stylebg;
    var loadingdiv = document.createElement('div');
    loadingdiv.id = 'loadingdiv';
    loadingdiv.innerHTML = divhtml;
    loadingdiv.style.cssText = style;
    document.body.appendChild(loadingdiv);
    document.body.appendChild(bgdiv);
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