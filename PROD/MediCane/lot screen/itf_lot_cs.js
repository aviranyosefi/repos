
function enterLot() {
    
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_itf_lot_su', 'customdeploy_itf_lot_su', false);
        createdPdfUrl += '&id=' + nlapiGetRecordId();
           
        window.open(createdPdfUrl);
   
}