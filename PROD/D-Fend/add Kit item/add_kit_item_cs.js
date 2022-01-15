
function pageLoad() {
    debugger;
    item = nlapiGetLineItemCount('custpage_res_sublist')
    var win = window.opener
    var po = win.window
    po.nlapiSetFieldValue('memo', item)
    alert(JSON.stringify(item))
    po.nlapiSelectLineItem('item', 1)
    po.nlapiSetCurrentLineItemValue('item', 'quantity', item);
    po.nlapiCommitLineItem('item')
}

function AddKit() {

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_add_kit_item_su', 'customdeploy_add_kit_item_su', false);
    createdPdfUrl += '&idd=' + nlapiGetRecordId();

   var res=  window.open(createdPdfUrl);
    res.postMessage("The user is 'bob' and the password is 'secret'",
        "https://secure.example.net");
    //var itemsLineCount = nlapiGetLineItemCount('item')
    //for (var line = 1; line <= itemsLineCount; line++) {
    //    nlapiSelectLineItem('item', line)
    //    nlapiSetCurrentLineItemValue('item', 'custcol_mark', 'T');
    //    nlapiCommitLineItem('item')
    //}    
}

