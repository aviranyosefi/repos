//var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var JsonData = [];
var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

function target_transaction_screen(request, response) {


        nlapiLogExecution('DEBUG', 'stage first', 'stage first');

        var typeData =request.getParameter('type')
        var yearData = request.getParameter('year');
        var salesData = request.getParameter('sales');
        var dimensionData = request.getParameter('dim');
        var pfData = request.getParameter('pf');
        var screenType = request.getParameter('screen');

        var yearDataName = nlapiLookupField('customlist358', yearData, 'name');        
        //var periods = getPeriodsId();

        var form = nlapiCreateForm('TRANSACTION SCREEN');
     
        form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

        var sales = form.addField('custpage_ilo_multi_sales', 'select', 'SALES REP', 'employee', 'custpage_ilo_searchdetails');
        sales.setDefaultValue(salesData);
        sales.setDisplayType('inline');

        var type = form.addField('custpage_ilo_type', 'select', 'TYPE', 'customlist_mounth_type', 'custpage_ilo_searchdetails')
        type.setMandatory(true); 
        type.setDefaultValue(typeData);
        type.setDisplayType('inline');

        var year = form.addField('custpage_ilo_year', 'select', 'Year List', 'customlist358', 'custpage_ilo_searchdetails')
        year.setMandatory(true);
        year.setDefaultValue(yearData);
        year.setDisplayType('inline');

        //var yearName = getYearName(yearData)

        form.setScript('customscript_target_client');
        form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');

        
        var NumberOfMonts = '';
        var line = 0;
        if (typeData == '1') {
            NumberOfMonts = 1;
            var m = request.getParameter('m');
            line = m - 1   
        }
        else if (typeData == '2') {
            NumberOfMonts = 3;
            var q = request.getParameter('qu')
            if (q == '1') {
                line = 0;
            }
            else if (q == '2') {
                line = 3;
            }
            else if (q == '3') {
                line = 6;
            }
            else {
                line = 9;
            } 
        }
        else {
            NumberOfMonts = 6;
            var h = request.getParameter('h')
            if (h == '1') {
                 line = 0;               
            }
            else {            
                line = 6;
            }            
        }

        var NumberOfRuns = 1;
        for (var i = line; i < months.length && NumberOfRuns <= NumberOfMonts ; i++) {
            NumberOfRuns += 1;
            //var period = periods[months[i] + ' ' + yearName].id;
            //nlapiLogExecution('debug', 'period ' , period)
            var firstDay = '1/' + (i+1) + '/' + yearDataName;
            var lastDay = lastDay = nlapiDateToString(nlapiStringToDate(firstDay).lastDayOfCurrentMonth());
            getData(firstDay, lastDay, salesData, dimensionData, pfData, screenType);
        }
        nlapiLogExecution('debug', 'JsonData ', JsonData.length)      
        if (JsonData != [] && JsonData.length >0) { 
            var resultsSubList = form.addSubList('custpage_re_sublist', 'list', 'Results', null);     
            resultsSubList.addField('custpage_customer', 'text', 'Customer')
            resultsSubList.addField('custpage_source', 'text', 'SOURCE')
            resultsSubList.addField('custpage_billing_date', 'text', 'BILLING DATE') 
            resultsSubList.addField('custpage_amount', 'text', 'amount')
            resultsSubList.addField('custpage_pf', 'text', 'REV REC PRODUCT FAMILY')
                     
            for (var m = 0; m < JsonData.length; m++) {    
                //nlapiLogExecution('debug', 'JsomnData ', m)    
                resultsSubList.setLineItemValue('custpage_customer', m + 1, GetCusLink(JsonData[m].entity, JsonData[m].entityID));
                resultsSubList.setLineItemValue('custpage_billing_date', m + 1, JsonData[m].billing_date);
                resultsSubList.setLineItemValue('custpage_source', m + 1, GetTranLink(JsonData[m].source, JsonData[m].sourceID));
                resultsSubList.setLineItemValue('custpage_amount', m + 1, formatNumber(JsonData[m].amount));
                resultsSubList.setLineItemValue('custpage_pf', m + 1, JsonData[m].pf);
          
               
      
                               
            }
    } //   if (request.getParameter('custpage_ilo_type') == '1')
     
        response.writePage(form);
    
    } // services_update_screen function - end


//functions
//Target godel tik row data
function getData(fromDate, toDate, sales, dimensionData, pfData, screenType) {
    try {
        debugger;
        if (screenType == 1) { searchID = 'customsearch_new_money_recurrent_actual' }
        else { searchID = 'customsearch_money_loss_detailed' }
        var search = nlapiLoadSearch(null, searchID);
        search.addFilter(new nlobjSearchFilter('custcol_billing_date_rev_rec', null, 'onorafter', fromDate));
        search.addFilter(new nlobjSearchFilter('custcol_billing_date_rev_rec', null, 'onorbefore', toDate));
        search.addFilter(new nlobjSearchFilter('salesrep', null, 'anyof', sales));
        if (dimensionData != '' && dimensionData != null) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_classification', 'class', 'anyof', dimensionData));
        }
        if (pfData != '' && pfData != null) {
            search.addFilter(new nlobjSearchFilter('custrecord_rev_rec_product_family', 'class', 'anyof', pfData));
        }
        var allSelection = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        //nlapiLogExecution('debug', 'allSelection ', allSelection.length)
        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {

                JsonData.push({
                    entity: allSelection[i].getText('entity'),
                    entityID: allSelection[i].getValue('entity'),
                    amount: allSelection[i].getValue("formulacurrency"),     
                    pf: allSelection[i].getText("custrecord_rev_rec_product_family", "class", null),                                 
                    sourceID: allSelection[i].id,
                    source: allSelection[i].getValue('tranid'),
                    billing_date: allSelection[i].getValue('custcol_billing_date_rev_rec'),
                });             
            }        
        }
    } catch (e) {
        nlapiLogExecution('error', 'getData func', e)
    }
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

function getPeriodsId() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('periodname');

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('periodname', null, 'is', name)

    var search = nlapiCreateSearch('accountingperiod', null, columns);

    var resultset = search.runSearch();
    var SearchResults = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            SearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (SearchResults != null) {

        for (var i = 0; i < SearchResults.length; i++) {
            res[SearchResults[i].getValue('periodname')] = {
                id: SearchResults[i].getValue('internalid')
            }
        }

    }
    return res;
}


function GetTranLink(source, sourceID) {

    var link = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/" + 'salesord' + '.nl?id=' + sourceID + "'" + 'target="_blank">' + source + "</a>";
    return link;

}
function GetCusLink(name, id) {

    var link = "<a href='https://4998343.app.netsuite.com/app/common/entity/custjob.nl?id=" + id + "'" + 'target="_blank">' + name + "</a>";
    return link;

}

function getType(sourceType) {
   
    var res = '';
    sourceType = sourceType.split(" ");
    nlapiLogExecution('debug', 'sourceType', sourceType[0])
    if (sourceType[0] == 'Invoice') {
        res = 'custinvc';
    }
    else if (sourceType[0] == 'Cash') {
        res = 'cashsale';

    }
    else if (sourceType[0] == 'Credit') {
        res = 'custcred';
    }
    return res;

}

Date.prototype.lastDayOfCurrentMonth = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0);
};