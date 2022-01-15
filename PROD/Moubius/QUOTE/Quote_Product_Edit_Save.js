
function SaveRecord() {
    try { 
        /// Until DATE Calc
        var valid_until = nlapiGetFieldValue('custrecord_quote_valid_until');
        nlapiLogExecution('debug', 'until', valid_until)
        var proposal_date = nlapiGetFieldValue('custrecord_proposal_date');
        nlapiLogExecution('debug', 'proposal_date', proposal_date)
        if (proposal_date != '' && proposal_date != null && proposal_date != undefined) {
            var proposal_date_obj = nlapiStringToDate(proposal_date);
            if (valid_until == 1) { var date_after_calc = nlapiAddDays(proposal_date_obj, 30) }
            else if (valid_until == 2) { var date_after_calc = nlapiAddDays(proposal_date_obj, 60) }
            else if (valid_until == 3) { var date_after_calc = nlapiAddDays(proposal_date_obj, 90) }
            nlapiLogExecution('debug', 'date_after_calc', date_after_calc)

            nlapiSubmitField('customrecord_quote', nlapiGetRecordId(), 'custrecord_valid_until_date', date_after_calc)
        
        }
    
        ///


        var newRec = nlapiGetNewRecord();
        var oldRec = nlapiGetOldRecord();

        var newDate = newRec.getFieldValue('custrecord_effective_date')
        var oldRec = oldRec.getFieldValue('custrecord_effective_date')

        nlapiLogExecution('audit', 'newDate:  ', newDate);
        nlapiLogExecution('audit', 'oldRec:  ', oldRec);

   
        if (newDate != oldRec)
        {
            var id = nlapiGetRecordId();
            nlapiLogExecution('audit', ' id  ', id);
            var SearchResults = FindProducs(id);
            nlapiLogExecution('audit', ' SearchResults  ', SearchResults);
            if (SearchResults != null && SearchResults.length > 0) {
                nlapiLogExecution('audit', ' if  ', 'if');
                for (var i = 0; i < SearchResults.length; i++) {
                    nlapiLogExecution('audit', ' for  ', 'for'+ i);
                    var rec = nlapiLoadRecord('customrecord_product', SearchResults[i]);

                    rec.setFieldValue('custrecord_product_effective_date', newDate);
               

                    var from_month = rec.getFieldValue('custrecord_from_month');
                    if (from_month == '1') {

                        rec.setFieldValue('custrecord_product_start_month', newDate);
                        var to_month = rec.getFieldValue('custrecord_to_month');
                        var date_to_obj = nlapiStringToDate(newDate);
                        var to_date = nlapiAddMonths(date_to_obj, to_month);
                        var to_date_final = nlapiAddDays(to_date, -1);
                        rec.setFieldValue('custrecord_product_end_month', to_date_final);
              
                
                    }
                    if (from_month > 1) {

                        var date_to_obj = nlapiStringToDate(newDate);
                        var start_date = nlapiAddMonths(date_to_obj, from_month-1);                    
                        rec.setFieldValue('custrecord_product_start_month', start_date);

                        var to_month = rec.getFieldValue('custrecord_to_month');                 
                        var to_date = nlapiAddMonths(date_to_obj, to_month);
                        var to_date_final = nlapiAddDays(to_date, -1);
                        rec.setFieldValue('custrecord_product_end_month', to_date_final);

                    }

                    nlapiSubmitRecord(rec);
    
                }
            }
        }
    } catch (err) {
    }

}


function FindProducs(quote) {
    
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_quote_number', null, 'anyof', quote);

    var savedSearch = nlapiCreateSearch('customrecord_product', filters, null);

    var resultset = savedSearch.runSearch();
    var SearchResults = [];
    var searchid = 0;
    
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
           SearchResults.push(resultslice[rs].id);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    return SearchResults;

}