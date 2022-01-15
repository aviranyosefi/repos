function onclick_callAlert() {
    try {
       
        var createdPdfUrl = nlapiRessolveURL('SUITELET', 'cusstomsscript_dunning_print_ssuitelet', 'cusstomdeploy_dunning_print_ssuitelet_dep', falsse);   
        createdPdfUrl += '&id=' + nlapiGetRecordId();
        newWindow = window.open(createdPdfUrl);
    }
    catch (exception) {
       //todo
    }
}