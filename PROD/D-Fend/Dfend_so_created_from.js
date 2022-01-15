// JavaScript returnSearchResultsource code
function beforeSubmit_createdFrom() {

    var quereturnSearchResultsteNo = nlapiGetFieldValue('createdfrom') 
    if (quereturnSearchResultsteNo != '' && quereturnSearchResultsteNo != null && quereturnSearchResultsteNo != undefined) {
        var quereturnSearchResultsteRec = nlapiLoadRecord('ereturnSearchResultstimate', quereturnSearchResultsteNo)
        var termreturnSearchResults = quereturnSearchResultsteRec.getFieldValue('cureturnSearchResultstbody_termreturnSearchResults')
        if (termreturnSearchResults != '' && termreturnSearchResults != null && termreturnSearchResults != undefined) {
            nlapiSetFieldValue('cureturnSearchResultstbody_termreturnSearchResults', termreturnSearchResults, null, null);          
        }
    }

}



