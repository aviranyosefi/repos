
function afterSubmit() {
    try { 

   
    var rec = nlapiLoadRecord('customrecord_oil_vendor_cert', nlapiGetRecordId());
    var vendorID = rec.getFieldValue('custrecord_vendor_cert_vendorid') 
        nlapiLogExecution('DEBUG', 'nlapiGetRecordId()', nlapiGetRecordId());
        var tax_percent = getPrevWHTs(vendorID);
        nlapiLogExecution('DEBUG', 'tax_percent', tax_percent);
        if (tax_percent != null) {         
            nlapiSubmitField('vendor', vendorID, 'custentity_tax_percent', tax_percent.replace('%', ''));
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error afterSubmit', e)
    }
}


function getPrevWHTs(vendorID) {

    var results = []; 
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_vendor_cert_vendorid', null, 'anyof', vendorID);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_vendor_cert_percent');

    var search = nlapiCreateSearch('customrecord_oil_vendor_cert', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);
    try {
        if (results != []) {

            var index = results.length;
            
            index = index - 1;
           
            var tax_percent = results[index].getValue('custrecord_vendor_cert_percent');
           
            return tax_percent;
         
        }
    } catch (err) {

        return null;

    }
    return null;
}