var keys = [];
var res1 = [];
var res2 = [];
var res3 = [];

var context = nlapiGetContext();

function revenue_reports() {

    var employeeId = context.user;
    var employeeName = context.name;

    var fromDateString = context.getSetting('SCRIPT', 'custscript_ss_from_date');
    var toDateString = context.getSetting('SCRIPT', 'custscript_ss_to_date');

    
    var fromDate = nlapiStringToDate(fromDateString);
    var toDate = nlapiStringToDate(toDateString);

    nlapiLogExecution('DEBUG', 'fromDate: ' + fromDate, 'toDate: ' + toDate );
  
    
   
    nlapiLogExecution('DEBUG', 'res1 START', 'res1 START');
    res1 = RevenueReportTransaction();
    nlapiLogExecution('DEBUG', 'res1 END', 'res1 END');
    nlapiLogExecution('DEBUG', 'res2 START', 'res2 START');
    res2 = CustomerPopulation();
    nlapiLogExecution('DEBUG', 'res2 END', 'res2 END');
    nlapiLogExecution('DEBUG', 'res3 START', 'res3 START');
    res3 = RevenueReportTransactionV2();
    nlapiLogExecution('DEBUG', 'res3 END', 'res3 END');
     
    var sum_of_amount = 0;
    var sum_of_amount_smaller = 0;
    var data_last = []; 
    var line = 0;

    for (var i = 0; i < keys.length; i++) {
        Context(context);  
        //console.log(keys[i]); console.log(i); console.log(JSON.stringify(data_last))
        for (var j = line; j < res3.length; j++) {
            Context(context);
           
            if (keys[i] == res3[j].id) {
                var period_date = nlapiStringToDate(res3[j].period_date);
                if (period_date >= fromDate && period_date <= toDate) {
                    sum_of_amount += parseFloat(res3[j].sum_of_amount);
                }
                else if (period_date < fromDate) {
                    sum_of_amount_smaller += parseFloat(res3[j].sum_of_amount);
                }
                else if (j == res3.length - 1) {
                    data_last.push({
                        customer: keys[i],
                        custrecord_balance: res1[keys[i]].sum_of_balance,
                        custrecord_receipt: res1[keys[i]].sum_of_receipt,
                        custrecord_not_recognised_sum: res1[keys[i]].sum_of_not_reco,
                        custrecord_deposit: res1[keys[i]].sum_of_deposit,
                        custrecord_sap_cust_number: res2[keys[i]].father_code,
                        custrecord_collector: res2[keys[i]].collector,
                        custrecord_sales_rep: res2[keys[i]].sales_person_code,
                        custrecord_site: res2[keys[i]].max_of_addid,
                        custrecord_rec_in_period: sum_of_amount,
                        custrecord_prev_rec_sum: sum_of_amount_smaller

                    });
                }
            }
            else if (sum_of_amount != 0 || sum_of_amount_smaller != 0) {
                data_last.push({
                    customer: keys[i],
                    custrecord_balance: res1[keys[i]].sum_of_balance,
                    custrecord_receipt: res1[keys[i]].sum_of_receipt,
                    custrecord_not_recognised_sum: res1[keys[i]].sum_of_not_reco,
                    custrecord_deposit: res1[keys[i]].sum_of_deposit,
                    custrecord_sap_cust_number: res2[keys[i]].father_code,
                    custrecord_collector: res2[keys[i]].collector,
                    custrecord_sales_rep: res2[keys[i]].sales_person_code,
                    custrecord_site: res2[keys[i]].max_of_addid,
                    custrecord_rec_in_period: sum_of_amount,
                    custrecord_prev_rec_sum: sum_of_amount_smaller

                });
                sum_of_amount = 0;
                sum_of_amount_smaller = 0;
                line = j;
                break;

            }
            else if (j == res3.length - 1) {
                data_last.push({
                    customer: keys[i],
                    custrecord_balance: res1[keys[i]].sum_of_balance,
                    custrecord_receipt: res1[keys[i]].sum_of_receipt,
                    custrecord_not_recognised_sum: res1[keys[i]].sum_of_not_reco,
                    custrecord_deposit: res1[keys[i]].sum_of_deposit,
                    custrecord_sap_cust_number: res2[keys[i]].father_code,
                    custrecord_collector: res2[keys[i]].collector,
                    custrecord_sales_rep: res2[keys[i]].sales_person_code,
                    custrecord_site: res2[keys[i]].max_of_addid,
                    custrecord_rec_in_period: sum_of_amount,                    
                    custrecord_prev_rec_sum: sum_of_amount_smaller

                });
                //line = j;
            }
        } // for(var j=0 ; j< res4.length ; j++) -  end

        if (sum_of_amount != 0 || sum_of_amount_smaller != 0) {
            data_last.push({
                customer: keys[i],
                custrecord_balance: res1[keys[i]].sum_of_balance,
                custrecord_receipt: res1[keys[i]].sum_of_receipt,
                custrecord_not_recognised_sum: res1[keys[i]].sum_of_not_reco,
                custrecord_deposit: res1[keys[i]].sum_of_deposit,
                custrecord_sap_cust_number: res2[keys[i]].father_code,
                custrecord_collector: res2[keys[i]].collector,
                custrecord_sales_rep: res2[keys[i]].sales_person_code,
                custrecord_site: res2[keys[i]].max_of_addid,
                custrecord_rec_in_period: sum_of_amount,               
                custrecord_prev_rec_sum: sum_of_amount_smaller

            });

        }

    } // for(var i=0 ;i<data.length ;i++) - end

    nlapiLogExecution('DEBUG', 'data_last.length ' + data_last.length, JSON.stringify(data_last));
      
    var state = nlapiYieldScript();

    var date = DateNow();
    var toDate_obj = nlapiStringToDate(toDate);

    for (var m = 0; m < data_last.length; m++) {

        Context(context);
        try {

            var rec = nlapiCreateRecord('customrecord_revenue_report_entity');

            rec.setFieldValue('custrecord_rev_repor_entity_customer', data_last[m].customer)
            rec.setFieldValue('custrecord_balance', data_last[m].custrecord_balance)
            rec.setFieldValue('custrecord_receipt', data_last[m].custrecord_receipt)
            rec.setFieldValue('custrecord_not_recognised_sum', data_last[m].custrecord_not_recognised_sum)
            rec.setFieldValue('custrecord_deposit', data_last[m].custrecord_deposit)
            rec.setFieldValue('custrecord_sap_cust_number', data_last[m].custrecord_sap_cust_number)
            rec.setFieldValue('custrecord_collector', data_last[m].custrecord_collector)
            rec.setFieldValue('custrecord_sales_rep', data_last[m].custrecord_sales_rep)	
            rec.setFieldValue('custrecord_site', data_last[m].custrecord_site)
            rec.setFieldValue('custrecord_rec_in_period', data_last[m].custrecord_rec_in_period)
            rec.setFieldValue('custrecord_prev_rec_sum', data_last[m].custrecord_prev_rec_sum)

            var id = nlapiSubmitRecord(rec);
            //nlapiLogExecution('DEBUG', 'm ' + m + ' id ' + id , id );

        } catch (e) {
            nlapiLogExecution('DEBUG', 'error : ' + data_last[m].customer + ' ,line :' + m, e);
        }
    }

    

    nlapiLogExecution('DEBUG', 'loop end', 'loop end');
    nlapiSendEmail(employeeId, employeeId, 'revenue report ', 'end ', null, null, null, null);




}



///////////////////////// functions  /////////////////////////


// Revenue Report Entity Transaction
function RevenueReportTransaction() {

    Context(context)

    var search = nlapiLoadSearch(null, 'customsearch_revenue_report_entity_trans');
    //search.addFilter(new nlobjSearchFilter('enddate', 'accountingperiod', 'onorbefore', toDate));

    var s = [];
    var Results = [];
    var searchid = 0;
    var resultset = search.runSearch();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (var rs in resultslice) {
            cols = resultslice[0].getAllColumns();
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);


    if (s != null) {
        s.forEach(function (line) {

            try {
                Results[line.getValue(cols[0])] = {
                    sum_of_balance: line.getValue(cols[2]),
                    sum_of_receipt: line.getValue(cols[3]),
                    sum_of_not_reco: line.getValue(cols[4]),
                    sum_of_deposit: line.getValue(cols[5]),

                }


            } catch (e) { }
        });

    }
    keys = Object.keys(Results)
    nlapiLogExecution('debug', 'keys.length: ' + keys.length , JSON.stringify(keys))
    return Results;

}

// Revenue Element Report Entity TransactionV2
function RevenueReportTransactionV2() {

    Context(context)

    var search = nlapiLoadSearch(null, 'customsearch_revenue_element_report_enti');
    //search.addFilter(new nlobjSearchFilter('enddate', 'accountingperiod', 'onorbefore', toDate));

    var s = [];
    var Results = [];
    var searchid = 0;
    var resultset = search.runSearch();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (var rs in resultslice) {
            cols = resultslice[0].getAllColumns();
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);


    if (s != null) {
        s.forEach(function (line) {

            try {
                Results.push({
                    id: line.getValue(cols[1]),
                    sum_of_amount: line.getValue(cols[2]),
                    period_date: line.getValue(cols[3])
                });


            } catch (e) { }
        });

    }    
    return Results;

}

//Customer Population
function CustomerPopulation(toDate) {

    Context(context)

    var search = nlapiLoadSearch(null, 'customsearch_customer_population');
    //search.addFilter(new nlobjSearchFilter('enddate', 'accountingperiod', 'onorbefore', toDate));

    var s = [];
    var Results = [];
    var searchid = 0;
    var resultset = search.runSearch();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (var rs in resultslice) {
            cols = resultslice[0].getAllColumns();
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);


    if (s != null) {
        s.forEach(function (line) {

            try {
                Results[line.getValue(cols[0])] = {
                    father_code: line.getValue(cols[1]),
                    collector: line.getValue(cols[3]),
                    sales_person_code: line.getValue(cols[4]),
                    max_of_addid: line.getValue(cols[5]),

                }


            } catch (e) { }
        });

    }
    
    return Results;

}



function DateNow() {

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " - "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    return datetime;
}

function Context(context) {
    if (context.getRemainingUsage() < 5000) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}







