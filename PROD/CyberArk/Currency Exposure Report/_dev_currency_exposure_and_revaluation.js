var context = nlapiGetContext();
var user = context.user;
function CurrencyReport(request, response) {
    var form = nlapiCreateForm('Currency exposure and Revaluation Analysis');
    form.addSubmitButton('Refresh');
    form.setScript('customscript_dev_currency_exposure_cs');
    form.addFieldGroup('custpage_batch_group', 'Select Details');

    var selectFromDate = form.addField('custpage_select_fromdate', 'date', 'From Date', null, 'custpage_batch_group').setLayoutType('midrow');
    var from_date_data = request.getParameter('custpage_select_fromdate')
    selectFromDate.setMandatory(true);
    selectFromDate.setDefaultValue(from_date_data)
    var selectToDate = form.addField('custpage_select_todate', 'date', 'To Date', null, 'custpage_batch_group').setLayoutType('midrow');
    var to_date_data = request.getParameter('custpage_select_todate');
    selectToDate.setDefaultValue(to_date_data)
    selectToDate.setMandatory(true);

    var sub = form.addField('custpage_sub', 'select', 'Subsidiary', 'Subsidiary', 'custpage_batch_group').setLayoutType('midrow');
    var sub_data = request.getParameter('custpage_sub');
    sub.setDefaultValue(sub_data);
    if (!isNullOrEmpty(from_date_data) && !isNullOrEmpty(to_date_data)) {
        setDatesOnUser(from_date_data, to_date_data);
    }
    var results = [];
    results = CurrencyExposureReport(sub_data)
    if (results.length > 0) {
        //form.addButton('customscript_marlk_all', 'Continue', 'Continue()');
        form.addFieldGroup('custpage_timesheet_group', 'List');
        form.addButton('customscript_export', 'Export to Excel', 'fnExcelReport()');
        var subList = form.addSubList('custpage_res_sublist', 'list', 'number of results: ' + results.length, 'custpage_timesheet_group');
        subList.addField('custpage_acc_id', 'text', 'ACCOUNT NUMBER')
        subList.addField('custpage_acc_name', 'text', 'ACCOUNT NAME')//.setDisplayType('hidden');
        subList.addField('custpage_currency', 'text', 'CURRENCY');
        subList.addField('custpage_usd_amt', 'text', 'USD AMOUNT')//.setDisplayType('hidden');        
        subList.addField('custpage_org_amt', 'text', 'ORIGINAL CURRENCY AMOUNT');
        subList.addField('custpage_exchange_rate', 'text', 'exchange rate');
        subList.addField('custpage_end_m_usd', 'text', 'End of Month USD amount');
        subList.addField('custpage_acc_for_revalue', 'text', 'Account For Revalue');
        subList.addField('custpage_clc_rev_amt', 'text', 'Calculated Revaluation amount');
        subList.addField('custpage_sub', 'text', 'Subsidiary');

        for (var i = 0; i < results.length; i++) {
            subList.setLineItemValue('custpage_acc_id', i + 1, results[i].acc_id);
            subList.setLineItemValue('custpage_acc_name', i + 1, results[i].acc_name);
            subList.setLineItemValue('custpage_currency', i + 1, results[i].currency);
            subList.setLineItemValue('custpage_usd_amt', i + 1, results[i].usd_amt);
            subList.setLineItemValue('custpage_org_amt', i + 1, results[i].org_amt);
            subList.setLineItemValue('custpage_exchange_rate', i + 1, results[i].exchange_rate);
            subList.setLineItemValue('custpage_end_m_usd', i + 1, results[i].end_m_usd);
            subList.setLineItemValue('custpage_clc_rev_amt', i + 1, results[i].clc_rev_amt);
            subList.setLineItemValue('custpage_acc_for_revalue', i + 1, results[i].acc_for_revalue);
            subList.setLineItemValue('custpage_sub', i + 1, results[i].sub);
        }
    }
    response.writePage(form);
}
//NR exchange rate by user fin date
function exchangerate() {

    var search = nlapiLoadSearch(null, 'customsearch_exchange_rate_by_user');
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var cols = search.getColumns();
    var res = [];
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            currency = s[i].getValue(cols[3])
            res[currency] = {
                rate: s[i].getValue(cols[4])
            }
        }
    }
    return res;
}
//Currency Exposure Report
function CurrencyExposureReport(subsidiary) {

    var search = nlapiLoadSearch(null, 'customsearch_curr_exposure_report');
    //if (!isNullOrEmpty(from_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bill_plan_billing_on_date', null, 'onorafter', from_date_data)) }
    //if (!isNullOrEmpty(to_date_data)) { search.addFilter(new nlobjSearchFilter('custrecord_bill_plan_billing_on_date', null, 'onorbefore', to_date_data)) }
    if (!isNullOrEmpty(subsidiary)) { search.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiary)) }

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var cols = search.getColumns();
    var res = [];
    if (s != null) {
        var rates = exchangerate();
        for (var i = 0; i < s.length; i++) {
            var currency = s[i].getValue(cols[2]);
            var usd_amt = s[i].getValue(cols[3])
            var org_amt = s[i].getValue(cols[4]);
            var acc_for_revalue = s[i].getText(cols[7]);
            var sub = s[i].getValue(cols[8]);
            if (rates[currency] != undefined) {
                var rate = rates[currency].rate;
                if (rate != "1") {
                    var rate = Number(rates[currency].rate);
                }
            }
            else { rate = '1' }  
            var end_m_usd = rate * org_amt
            if (acc_for_revalue == 'Yes') {
                var clc_rev_amt = formatNumber(end_m_usd - usd_amt)
            }
            else {
                var clc_rev_amt = '0.00'
            }
            res.push({
                acc_id: s[i].getValue(cols[0]),
                acc_name: s[i].getValue(cols[1]),
                currency: currency,
                usd_amt: formatNumber(usd_amt),
                org_amt: formatNumber(org_amt),
                exchange_rate: rate,
                end_m_usd: formatNumber(end_m_usd),
                clc_rev_amt: clc_rev_amt,
                acc_for_revalue: acc_for_revalue,
                sub: sub,
            });
        }
    }
    return res;
}
function formatNumber(num) {
    if (!isNullOrEmpty(num)) {
        num = Number(num).toFixed(2);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

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

