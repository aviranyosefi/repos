
function Markalllines() {
    var itemsLineCount = nlapiGetLineItemCount('item')
    for (var line = 1; line <= itemsLineCount; line++) {
        nlapiSelectLineItem('item', line)
        nlapiSetCurrentLineItemValue('item', 'custcol_mark', 'T');
        nlapiCommitLineItem('item')
    }    
}

function Remove() {
    var itemsLineCount = nlapiGetLineItemCount('item')  
    for (var line = itemsLineCount; line >= 1; line--) {     
        if (nlapiGetLineItemValue('item', 'custcol_mark', line) == 'T') {
            nlapiRemoveLineItem('item', line)
        }           
    }
}