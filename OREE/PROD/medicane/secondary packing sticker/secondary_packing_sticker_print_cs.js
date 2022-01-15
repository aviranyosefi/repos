function printScdyButton() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_scdy_pack_stkr_prt_sl', 'customdeploy_scdy_pack_stkr_prt_sl_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();  
            window.open(createdPdfUrl);   
}