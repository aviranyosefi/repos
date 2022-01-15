function fillMaxDate(type) {
    if (type != 'delete') {
        try {
            var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId())
            var sotype = rec.getFieldValue("custbody_sale_type");
            if (sotype == '5') {
                var customer = rec.getFieldValue("entity");
                var maxDate = getMaxDate(customer);              
                nlapiSubmitField('customer', customer, 'custentity_last_product_so_date', maxDate);
            }
            else if (sotype== '1' && rec.getFieldText("createdfrom").indexOf('Quote') > -1) {
                var agreement = rec.getFieldValue("custbody_agreement");
                var shipdate = rec.getFieldValue("shipdate")
                if (!isNullOrEmpty(agreement) && !isNullOrEmpty(shipdate)) {
                    nlapiSubmitField('customrecord_agreement', agreement, 'custrecord_agreement_start_date', shipdate);
                }
            }
        } catch (e) {

        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getMaxDate(customer) {


        var columns = new Array();
        columns[0] = new nlobjSearchColumn("trandate", null, "MAX").setSort(false);
       
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('type', null, 'is', 'SalesOrd')
        filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T')
        filters[2] = new nlobjSearchFilter('custbody_sale_type', null, 'anyof', '5')
        filters[3] = new nlobjSearchFilter('internalid', 'customer', 'is', customer)

        var search = nlapiCreateSearch('salesorder', filters, columns);

        var resultset = search.runSearch();
        var returnSearchResults = [];
        var searchid = 0;

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                returnSearchResults.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (returnSearchResults != null) {
            return returnSearchResults[0].getValue("trandate", null, "MAX");                                      
            
         }
    return '';
}