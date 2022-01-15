/**
 * Module Activation
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Aug 2019     Moshe Barel
 *
 */
function activate() {
    var search = nlapiLoadSearch(null, 'customsearch_non_activated');
    var periods = getperiods();
    var periodsinternalids = [];

    var firstperiod, secondperiod, thridperiod = -1;
    var z = 1;
    for (var i in periods) {
        if (z == 1) { firstperiod = i }
        z++;
        periodsinternalids.push(i);
    }

    var resultSet = [];
    var searchid = 0;
    var resultsetTranRecord = search.runSearch();
    do {
        var resultsliceRecord = resultsetTranRecord.getResults(searchid, searchid + 1000);
        for (var rs in resultsliceRecord) {
            resultSet.push(resultsliceRecord[rs]);
            searchid++;
        }
    } while (resultsliceRecord.length >= 1000 && searchid < 50000);

    //resultSet.forEachResult(
    //        function (searchResult) {
    var context = nlapiGetContext();

    for (var i = 0; i < resultSet.length; i++) {
        if (context.getRemainingUsage() < 550) {
            var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
        var searchResult = resultSet[i];
        try {
            var rowid = searchResult.id;
            var rowtype = searchResult.getRecordType();
            var salesorder = nlapiLoadRecord(rowtype, rowid);
            //debugger;
            var item = searchResult.getValue("item");
            var activationdate = searchResult.getValue("custbody_jfrog_activation_date");
            var periodactivation = dateToPostingPeriod(activationdate);
            var linkscount = salesorder.getLineItemCount('links');
            var foundrevenue = false;

            for (j = 1; j <= linkscount; j++) {//	Go to revenue element of each of the related SO lines:
                var revarr_id = salesorder.getLineItemValue('links', 'id', j);
                var revarr_type = salesorder.getLineItemValue('links', 'type', j);
                if (revarr_type == 'Revenue Arrangement') {
                    var revarr = nlapiLoadRecord('revenuearrangement', revarr_id);
                    var revcount = revarr.getLineItemCount('revenueelement');
                    for (k = 1; k <= revcount; k++) {
                        var isactual = revarr.getLineItemValue('revenueelement', 'planhasbeencreated', k) == 'T';
                        var itemrev = revarr.getLineItemValue('revenueelement', 'item', k);
                        if (itemrev != item) //do it only on the onprem items (current line on the search)
                            continue;
                        var status = revarr.getLineItemValue('revenueelement', 'revenueplanstatus', k);
                        var reveleid = revarr.getLineItemValue('revenueelement', 'revenueelement', k);
                        var accountingbook = revarr.getLineItemValue('revenueelement', 'accountingbook', k);
                        var searchResults = nlapiSearchRecord('revenueplan', null, [new nlobjSearchFilter("internalid", "revenueelement", 'anyof', reveleid), new nlobjSearchFilter("status", null, 'noneof', "COMPLETED")], null);
                        //revarr.setLineItemValue('revenueelement', 'revrecenddate', k, zoura_start);
                        if (searchResults != null && searchResults.length > 0) {
                            //debugger;
                            foundrevenue = true;
                            var planid = searchResults[0].id;
                            var planrec = nlapiLoadRecord('revenueplan', planid);
                            planrec.setFieldValue('holdrevenuerecognition', 'F');//unhold rev plan
                            var planrevcount = planrec.getLineItemCount('plannedrevenue');
                            // for (l = 1; l <= planrevcount; l++) {//2-oct - by ishay - always update catchup period
                            //  var plannedperiodnum = planrec.getLineItemValue('plannedrevenue', 'plannedperiod', l);
                            var catchupperiod = periods.indexOf(periodactivation);
                            if (catchupperiod < 0)
                                catchupperiod = firstperiod;
                            nlapiLogExecution('debug', 'planid:' + planid, 'periodactivation:' + catchupperiod + ' text:' + periodactivation);
                            //  isactivaitonlater = periods.indexOf(periodactivation) > plannedperiodnum;
                            //if (isactivaitonlater && isactual) { //2-oct - by ishay - always update catchup period
                            planrec.setFieldValue('catchupperiod', catchupperiod);//
                            //planrec.setLineItemValue('plannedrevenue', 'plannedperiod', l, periods.indexOf(periodactivation));//2-oct - by ishay
                            //}
                            //   }

                            // ** 25-12 **

                            var indexof_periods_internal_id = catchupperiod;
                            nlapiLogExecution('debug', 'periods', 'catchupperiod:' + catchupperiod + 'periods:' + JSON.stringify(periodsinternalids));
                            var firstline_after_catcatchup = 0;

                            for (l = 1; l <= planrevcount; l++) {
                                var cur_period = planrec.getLineItemValue('plannedrevenue', 'plannedperiod', l);
                                var next_valid_period_id = periodsinternalids[periodsinternalids.indexOf(indexof_periods_internal_id) + l - firstline_after_catcatchup];
                                if (cur_period < indexof_periods_internal_id) {
                                    next_valid_period_id = indexof_periods_internal_id;
                                    if (catchupperiod != cur_period)
                                        firstline_after_catcatchup = l;
                                }
                                if (catchupperiod == cur_period)
                                    continue;
                                nlapiLogExecution('debug', 'line:' + l, 'indexof_periods_internal_id:' + next_valid_period_id + ',cur_period:' + cur_period);
                                nlapiLogExecution('debug', 'line:' + l, 'period index:' + next_valid_period_id + ' period:' + periods[next_valid_period_id]);
                                if (next_valid_period_id >= cur_period)
                                    planrec.setLineItemValue('plannedrevenue', 'plannedperiod', l, next_valid_period_id);
                            }
                            // ** 25-12

                            try {
                                nlapiSubmitRecord(planrec);
                            }
                            catch (e) {
                                nlapiLogExecution('error', 'plan loop', 'Error:' + e.message);
                            }
                            //nlapiLogExecution('debug', 'UpdatePaymentWHT', 'creditid:' + creditid + ' creditamount:' + creditamount + ' billid:' + billid + ' memo:' + memo + memo.indexOf('Withholding Tax'));
                        }
                    }
                }
            }
            if (foundrevenue)
                nlapiSubmitField(rowtype, rowid, 'custbody_jfrog_activation_processed', 'T');
        }
        catch (e) {
            nlapiLogExecution('error', 'activate:' + salesorder, 'Error:' + e.message);
        }
    }
    // now look for rma that has rev element on hold:

    // var search = nlapiLoadSearch(null, 'customsearch_rma_all');
    var search = nlapiLoadSearch(null, 'customsearch_non_activated_3');
    var resultSet = search.runSearch();
    resultSet.forEachResult(
        function (searchResult) {
            try {

                var rmaid = searchResult.id;
                var activationdate = searchResult.getValue("custbody_jfrog_activation_date");
                var periodactivation = dateToPostingPeriod(activationdate);
                var catchupperiod = periods.indexOf(periodactivation);
                if (catchupperiod < 0)
                    catchupperiod = firstperiod;

                var rma = nlapiLoadRecord('returnauthorization', rmaid);
                //debugger;
                var item = searchResult.getValue("item");
                var linkscount = rma.getLineItemCount('links');
                var foundrevenue = false;

                for (j = 1; j <= linkscount; j++) {//	Go to revenue element of each of the related SO lines:
                    var revarr_id = rma.getLineItemValue('links', 'id', j);
                    var revarr_type = rma.getLineItemValue('links', 'type', j);
                    if (revarr_type == 'Revenue Arrangement') {
                        var revarr = nlapiLoadRecord('revenuearrangement', revarr_id);
                        var revcount = revarr.getLineItemCount('revenueelement');
                        for (k = 1; k <= revcount; k++) {
                            var status = revarr.getLineItemValue('revenueelement', 'revenueplanstatus', k);
                            var reveleid = revarr.getLineItemValue('revenueelement', 'revenueelement', k);
                            var accountingbook = revarr.getLineItemValue('revenueelement', 'accountingbook', k);
                            var searchResults = nlapiSearchRecord('revenueplan', null, new nlobjSearchFilter("internalid", "revenueelement", 'anyof', reveleid), null);
                            //revarr.setLineItemValue('revenueelement', 'revrecenddate', k, zoura_start);
                            if (searchResults != null && searchResults.length > 0) {
                                //debugger;
                                foundrevenue = true;
                                var planid = searchResults[0].id;
                                var planrec = nlapiLoadRecord('revenueplan', planid);
                                planrec.setFieldValue('holdrevenuerecognition', 'F');//unhold rev plan
                                var planrevcount = planrec.getLineItemCount('plannedrevenue');
                                // for (l = 1; l <= planrevcount; l++) {//2-oct - by ishay - always update catchup period
                                //  var plannedperiodnum = planrec.getLineItemValue('plannedrevenue', 'plannedperiod', l);
                                var catchupperiod = periods.indexOf(periodactivation);
                                if (catchupperiod < 0)
                                    catchupperiod = firstperiod;
                                nlapiLogExecution('debug', 'planid:' + planid, 'periodactivation:' + catchupperiod + ' text:' + periodactivation);
                                //  isactivaitonlater = periods.indexOf(periodactivation) > plannedperiodnum;
                                //if (isactivaitonlater && isactual) { //2-oct - by ishay - always update catchup period
                                planrec.setFieldValue('catchupperiod', catchupperiod);//
                                //planrec.setLineItemValue('plannedrevenue', 'plannedperiod', l, periods.indexOf(periodactivation));//2-oct - by ishay
                                //}
                                //   }

                                // ** 25-12 **

                                var indexof_periods_internal_id = catchupperiod;
                                nlapiLogExecution('debug', 'periods', 'catchupperiod:' + catchupperiod + 'periods:' + JSON.stringify(periodsinternalids));
                                var firstline_after_catcatchup = 0;

                                for (l = 1; l <= planrevcount; l++) {
                                    var cur_period = planrec.getLineItemValue('plannedrevenue', 'plannedperiod', l);
                                    var next_valid_period_id = periodsinternalids[periodsinternalids.indexOf(indexof_periods_internal_id) + l - firstline_after_catcatchup];
                                    if (cur_period < indexof_periods_internal_id) {
                                        next_valid_period_id = indexof_periods_internal_id;
                                        if (catchupperiod != cur_period)
                                            firstline_after_catcatchup = l;
                                    }
                                    if (catchupperiod == cur_period)
                                        continue;
                                    nlapiLogExecution('debug', 'line:' + l, 'indexof_periods_internal_id:' + next_valid_period_id + ',cur_period:' + cur_period);
                                    nlapiLogExecution('debug', 'line:' + l, 'period index:' + next_valid_period_id + ' period:' + periods[next_valid_period_id]);
                                    if (next_valid_period_id >= cur_period)
                                        planrec.setLineItemValue('plannedrevenue', 'plannedperiod', l, next_valid_period_id);
                                }
                                // ** 25-12
                                try {
                                    nlapiSubmitRecord(planrec);
                                }
                                catch (e) {
                                    nlapiLogExecution('error', 'plan loop', 'Error:' + e.message);
                                }

                                //nlapiLogExecution('debug', 'UpdatePaymentWHT', 'creditid:' + creditid + ' creditamount:' + creditamount + ' billid:' + billid + ' memo:' + memo + memo.indexOf('Withholding Tax'));
                            }
                        }
                    }
                }
                if (foundrevenue)
                    nlapiSubmitField('returnauthorization', rmaid, 'custbody_jfrog_activation_processed', 'T');
            }
            catch (e) {
                nlapiLogExecution('error', 'activate:' + salesorder, 'Error:' + e.message);
            }

            return true;
        }
    );


}

function getperiods() {
    var columns = [];
    var filters = [new nlobjSearchFilter('closed', null, 'is', 'F'), new nlobjSearchFilter('isyear', null, 'is', 'F'), new nlobjSearchFilter('isquarter', null, 'is', 'F')];
    var allResults = [];
    columns[0] = new nlobjSearchColumn('periodname');
    columns[1] = new nlobjSearchColumn('internalid').setSort();
    var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (searchresults != null) {
        searchresults.forEach(function (line) {
            allResults[line.getValue('internalid')] = line.getValue('periodname');
        });
    }
    return allResults;
}


function dateToPostingPeriod(odate) {
    var date = convertVatDate(odate)
    var year = date.getFullYear();
    var month = date.getMonth(); // jan = 0
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[month] + " " + year;
}

function convertVatDate(odate) { // Convert to vat date format - from 28/4/2016 to YYYYMMDD
    if (odate == undefined)
        return '';
    var dateformat = 'dd/MM/yyyy';
    var ISMMDD;
    var dateMMDD = '3/31/17';
    var check = nlapiStringToDate(dateMMDD);
    whatFormat = isNaN(check);
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';

    var newDate = '';
    var arr = odate.split("/");
    var day = arr[0];
    var month = arr[1];

    if (dateformat.toLowerCase() == "mm/dd/yyyy") {
        day = arr[1];
        month = arr[0];
    }
    newDate = new Date(arr[2], month - 1, day);
    return newDate;
}