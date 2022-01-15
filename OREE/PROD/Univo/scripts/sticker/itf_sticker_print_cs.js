function printButton() {
    //alert(1)
    var Data = nlapiGetFieldValue('custbody_packages_data');
    if (Data == null || Data == undefined || Data == "") {
        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        nlapiSubmitRecord(rec, null, true);
    }
         var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_itf_sticker_print_suitelet', 'customdeploy_itf_sticker_print_su_dep', false);
            createdPdfUrl += '&id=' + nlapiGetRecordId();
           
            window.open(createdPdfUrl);
   
}