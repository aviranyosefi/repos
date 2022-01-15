function printPrmyButton() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_prmy_pack_stkr_prt_sl', 'customdeploy_prmy_pack_stkr_prt_sl_dep', false);
    createdPdfUrl += '&id=' + nlapiGetRecordId();  
            window.open(createdPdfUrl);   
}