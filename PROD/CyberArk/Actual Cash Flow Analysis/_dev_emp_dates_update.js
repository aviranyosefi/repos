var context = nlapiGetContext();
var user = context.user;

function updateDates(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('');
        form.addSubmitButton('Submit');
        //form.setScript('customscript_customer_agreement_cs');

        form.addFieldGroup('custpage_ilo_searchdetails_curr', 'Current Dates');
    

        var fromDateData= nlapiLookupField('employee', user, 'custentity_fin_search_from_date')
        var startDate_curr = form.addField('custpage_ilo_multi_fromdate_curr', 'date', 'FINANCIAL SEARCHES FROM DATE', null, 'custpage_ilo_searchdetails_curr');
        startDate_curr.setDefaultValue(fromDateData);
        startDate_curr.setDisplayType('inline');

        var toDateData = nlapiLookupField('employee', user, 'custentity_fin_search_to_date')
        var totDate_curr = form.addField('custpage_ilo_multi_todate_curr', 'date', 'FINANCIAL SEARCHES TO DATE', null, 'custpage_ilo_searchdetails_curr');
        totDate_curr.setDefaultValue(toDateData);
        totDate_curr.setDisplayType('inline');

        form.addFieldGroup('custpage_ilo_searchdetails', 'New Dates');

        var startDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'FINANCIAL SEARCHES FROM DATE', null, 'custpage_ilo_searchdetails');
        startDate.setMandatory(true);
        //startDate.setDefaultValue(nlapiDateToString(new Date()))

        var totDate = form.addField('custpage_ilo_multi_todate', 'date', 'FINANCIAL SEARCHES TO DATE', null, 'custpage_ilo_searchdetails');
        totDate.setMandatory(true);
        //totDate.setDefaultValue(nlapiDateToString(new Date()))

    }

    else  { 
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
        try {

            var fromDateData = request.getParameter('custpage_ilo_multi_fromdate');
            var toDateData = request.getParameter('custpage_ilo_multi_todate');       
            setDatesOnUser(fromDateData, toDateData);          
            var form = nlapiCreateForm('Dates successfully updated');
            //var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
            //htmlHeader.setDefaultValue("Please click <a href='" + nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', null, null, { "searchid": "_CF_by_expenses" }) +"' target='_blank' >here</a>");
            nlapiSetRedirectURL('tasklink', 'LIST_SEARCHRESULTS', null, null, { "searchid": "customsearch_cf_by_expenses" })
        }
        catch (e) {
            nlapiLogExecution('DEBUG', 'stage two error', e);
        }

    }

    response.writePage(form);
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function setDatesOnUser(fromDate, toDate) {

    var fields = new Array();
    fields[0] = 'custentity_fin_search_from_date';
    fields[1] = 'custentity_fin_search_to_date';
    var values = new Array();
    values[0] = fromDate;
    values[1] = toDate;

    nlapiSubmitField('employee', user, fields, values);

}

