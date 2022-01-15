var Context = nlapiGetContext();
var company = Context.company;
company = company.replace('_', '-');

function transaction_screen(request, response) {


    nlapiLogExecution('DEBUG', 'stage first', 'stage first');

    var customerData = request.getParameter('customer')

    var form = nlapiCreateForm('רשימת תעודות משלוח/הזמנות');

    form.addFieldGroup('custpage_ilo_searchdetails', 'נתונים');

    var customer = form.addField('custpage_customer', 'select', 'לקוח', 'CUSTOMER', 'custpage_ilo_searchdetails');
    customer.setDefaultValue(customerData);
    customer.setDisplayType('inline');

    var JsonData = getData(customerData);
  
    nlapiLogExecution('debug', 'JsonData ', JsonData.length)
    if (JsonData != [] && JsonData.length > 0) {
        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', '', null);
        resultsSubList.addField('custpage_customer', 'text', 'לקוח')
        resultsSubList.addField('custpage_item', 'text', 'מוצר')
        resultsSubList.addField('custpage_qty', 'text', 'כמות')
        resultsSubList.addField('custpage_des', 'text', 'תיאור')
        resultsSubList.addField('custpage_so', 'text', 'הזמנה')
        resultsSubList.addField('custpage_ff', 'text', 'תעודת משלוח')
        resultsSubList.addField('custpage_date', 'text', 'תאריך')
        //resultsSubList.addField('custpage_item_', 'text', 'פריט')
      

        for (var m = 0; m < JsonData.length; m++) {
            //nlapiLogExecution('debug', 'JsomnData ', m)              
            resultsSubList.setLineItemValue('custpage_customer', m + 1, JsonData[m].customer);
            resultsSubList.setLineItemValue('custpage_item', m + 1, JsonData[m].item);
            resultsSubList.setLineItemValue('custpage_qty', m + 1, JsonData[m].qty);
            resultsSubList.setLineItemValue('custpage_des', m + 1, JsonData[m].des);
            resultsSubList.setLineItemValue('custpage_so', m + 1, GetSOLink(JsonData[m].so, JsonData[m].so_id))
            resultsSubList.setLineItemValue('custpage_ff', m + 1, GetFFLink(JsonData[m].ff, JsonData[m].ff_id));
            resultsSubList.setLineItemValue('custpage_date', m + 1, JsonData[m].date);
            //resultsSubList.setLineItemValue('custpage_item_', m + 1, JsonData[m].item);

        }
    } //   if (request.getParameter('custpage_ilo_type') == '1')

    response.writePage(form);

} // services_update_screen function - end


//functions
//DS FF Screen Search Drill Down
function getData( customer) {

    var loadedSearch = nlapiLoadSearch(null, 'customsearch_df_ff_dril_down');
    loadedSearch.addFilter(new nlobjSearchFilter('entity', null, 'anyof', customer));

    var cols = loadedSearch.getColumns();
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;
    var s = [];
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    var results = [];
    if (s.length > 0) {

        for (var i = 0; i < s.length; i++) {
 
            results.push({
                customer: s[i].getText(cols[0]),
                item: s[i].getText(cols[1]),
                qty: s[i].getValue(cols[2]),
                des: s[i].getValue(cols[3]),
                so: s[i].getValue(cols[5]),
                ff: s[i].getValue(cols[6]),
                date: s[i].getValue("trandate", null, "GROUP"),
                so_id: s[i].getValue(cols[12]),
                ff_id: s[i].getValue("internalid", null, "GROUP"),
                
          
            });
        }
    }
    nlapiLogExecution('DEBUG', 'results: ' + results.length, JSON.stringify(results));
    return results;
}

function formatNumber(num) {
    var num = parseFloat(num).toFixed(2)
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return '0.00'
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function GetFFLink(name, id) {

    var link = "<a href='https://" + company + ".app.netsuite.com/app/accounting/transactions/itemship.nl?id=" + id + "'" + 'target="_blank">' + name + "</a>";
    return link;

}
function GetSOLink(name, id) {

    var link = "<a href='https://" + company + ".app.netsuite.com/app/accounting/transactions/salesord.nl?id=" + id + "'" + 'target="_blank">' + name + "</a>";
    return link;

}

