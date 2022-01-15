var context = nlapiGetContext();
var AgreemetLinesList = [];
function BillingPlan() {
    try {
        var agr_line_id = context.getSetting('SCRIPT', 'custscript_agr_line_id');
        nlapiLogExecution('DEBUG', 'agr_line_id: ', agr_line_id);
        if (!isNullOrEmpty(agr_line_id)) {
            var number = getBillingPlane(agr_line_id)
            if (number > 0) {
                getAgreemetLines(3, agr_line_id);
            }
        }
        else {
            getAgreemetLinesLoadSearch();
        }
        nlapiLogExecution('DEBUG', 'AgreemetLinesList ' + AgreemetLinesList.length, JSON.stringify(AgreemetLinesList));
        for (var i = 0; i < AgreemetLinesList.length; i++) {
            var createBPdata = [];
            var BillingCycle = AgreemetLinesList[i].line_bill_cyc;
            if (!isNullOrEmpty(BillingCycle)) {
                var singl_invoice_indication = nlapiLookupField('customrecord_billing_cycle', BillingCycle, 'custrecord_singl_invoice_indication');
                nlapiLogExecution('DEBUG', 'singl_invoice_indication ', singl_invoice_indication);
                if (singl_invoice_indication == 'T') {
                    inv_year = 1;
                    firstDay = AgreemetLinesList[i].line_srt_date;
                    lastDay = AgreemetLinesList[i].line_end_date;
                    interval = 1
                }
                else {
                    var interval = nlapiLookupField('customrecord_billing_cycle', BillingCycle, 'custrecord_interval');
                    inv_year = parseInt(nlapiLookupField('customrecord_billing_cycle', BillingCycle, 'custrecord_inv_year'));
                    inv_year = (AgreemetLinesList[i].num_mon / 12) * inv_year
                }
                for (var m = 0; m < inv_year; m++) {
                    if (singl_invoice_indication == 'F') {
                        var firstDay = getStartDate(AgreemetLinesList[i].line_srt_date, m, interval)
                        var day = AgreemetLinesList[i].line_srt_date.split('/')[0]
                        if (day != '01' && day != '1') {
                            var lastDay = nlapiDateToString(DayOfCurrentMonth(firstDay, interval));
                        }
                        else {
                            var lastDay = nlapiDateToString(lastDayOfCurrentMonth(firstDay, interval));
                        }
                        firstDay = nlapiDateToString(firstDay);
                    }
                    createBPdata.push({
                        line_id: AgreemetLinesList[i].line_id,
                        line_agreement: AgreemetLinesList[i].line_agreement,
                        line_customer: AgreemetLinesList[i].line_customer,
                        line_bill_grp: AgreemetLinesList[i].line_bill_grp,
                        line_bsc_rate: AgreemetLinesList[i].line_bsc_rate,
                        line_bsc_qty: AgreemetLinesList[i].line_bsc_qty,
                        line_item: AgreemetLinesList[i].line_item,
                        firstDay: firstDay,
                        lastDay: lastDay,
                        line_exceed_rate: AgreemetLinesList[i].line_exceed_rate,
                        line_war_end_date: AgreemetLinesList[i].line_war_end_date,
                        line_end_cust: AgreemetLinesList[i].line_end_cust,
                        line_bill_cyc: AgreemetLinesList[i].line_bill_cyc,
                        discount: AgreemetLinesList[i].discount,
                    })
                }
                try {
                    if (CreateBillingPlan(createBPdata)) {
                        nlapiSubmitField('customrecord_agr_line', AgreemetLinesList[i].line_id, 'custrecord_agr_line_last_billing_plan', lastDay)
                    }

                } catch (e) {
                    nlapiLogExecution('error', 'error CreateBillingPlan ', e);
                }

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'error BillingPlan ', e);
    }
}
function getAgreemetLines(type, id) {
    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bill_cyc'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bill_grp'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_gross_amount'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bsc_qty'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_item'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_eft_date'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_billing_customer'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_exceed_rate'))
    columns.push(new nlobjSearchColumn('custrecord_agr_type', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_bill_cyc', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_war_end_date'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_end_cust'))
    columns.push(new nlobjSearchColumn('custrecord_agr_srt_date', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_num_mon', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_last_billing_plan'))
    columns.push(new nlobjSearchColumn('custrecord_agr_discount', 'custrecord_agr_line_agreement'))

    var filters = new Array();
    if (type == 1) { /*filters[0] = new nlobjSearchFilter('custrecord_agr_line_last_billing_plan', null, 'isempty', "")*/; }
    else if (type == 2) { filters[0] = new nlobjSearchFilter('custrecord_agr_line_last_billing_plan', null, 'onorbefore', "today"); }
    else { filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id); }

    filters.push(new nlobjSearchFilter('custrecord_agr_line_agreement', null, 'anyof', [1847]))
    filters.push(new nlobjSearchFilter('custrecord_agr_type', 'custrecord_agr_line_agreement', 'anyof', '2'))
    filters.push(new nlobjSearchFilter('custrecord_agr_status', 'custrecord_agr_line_agreement', 'anyof', '1'))

    var search = nlapiCreateSearch('customrecord_agr_line', filters, columns);
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
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            if (type == 2) {
                line_srt_date = s[i].getValue('custrecord_agr_line_last_billing_plan');
                line_srt_date = nlapiDateToString(nlapiAddDays(nlapiStringToDate(line_srt_date), 1))
            }
            else {
                line_srt_date = s[i].getValue('custrecord_agr_srt_date', 'custrecord_agr_line_agreement')
            }
            AgreemetLinesList.push({
                line_id: s[i].id,
                line_agreement: s[i].getValue('custrecord_agr_line_agreement'),
                line_customer: s[i].getValue('custrecord_billing_customer'),
                line_bill_cyc: s[i].getValue('custrecord_agr_bill_cyc', 'custrecord_agr_line_agreement'),
                line_bill_grp: s[i].getValue('custrecord_agr_line_bill_grp'),
                line_bsc_rate: s[i].getValue('custrecord_agr_line_gross_amount'),
                line_bsc_qty: s[i].getValue('custrecord_agr_line_bsc_qty'),
                line_item: s[i].getValue('custrecord_agr_line_item'),
                line_srt_date: line_srt_date,
                line_exceed_rate: s[i].getValue('custrecord_agr_line_exceed_rate'),
                line_war_end_date: s[i].getValue('custrecord_agr_line_war_end_date'),
                agreementType: s[i].getValue('custrecord_agr_type', 'custrecord_agr_line_agreement'),
                line_end_cust: s[i].getValue('custrecord_agr_line_end_cust'),
                num_mon: Number(s[i].getValue('custrecord_agr_num_mon', 'custrecord_agr_line_agreement')),
                discount: s[i].getValue('custrecord_agr_discount', 'custrecord_agr_line_agreement'),

            });
        }
    }
}
function getAgreemetLinesLoadSearch() {

    var search = nlapiLoadSearch(null, 'customsearch_bp_creation_m');

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bill_cyc'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bill_grp'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_gross_amount'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_bsc_qty'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_item'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_eft_date'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_billing_customer'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_exceed_rate'))
    columns.push(new nlobjSearchColumn('custrecord_agr_type', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_bill_cyc', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_war_end_date'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_end_cust'))
    columns.push(new nlobjSearchColumn('custrecord_agr_srt_date', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_end_date', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_num_mon', 'custrecord_agr_line_agreement'))
    columns.push(new nlobjSearchColumn('custrecord_agr_line_last_billing_plan'))
    columns.push(new nlobjSearchColumn('custrecord_agr_discount', 'custrecord_agr_line_agreement'))

    search.addColumns(columns);

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
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            line_srt_date = s[i].getValue('custrecord_agr_srt_date', 'custrecord_agr_line_agreement')
            line_end_date = s[i].getValue('custrecord_agr_end_date', 'custrecord_agr_line_agreement')
            AgreemetLinesList.push({
                line_id: s[i].id,
                line_agreement: s[i].getValue('custrecord_agr_line_agreement'),
                line_customer: s[i].getValue('custrecord_billing_customer'),
                line_bill_cyc: s[i].getValue('custrecord_agr_bill_cyc', 'custrecord_agr_line_agreement'),
                line_bill_grp: s[i].getValue('custrecord_agr_line_bill_grp'),
                line_bsc_rate: s[i].getValue('custrecord_agr_line_gross_amount'),
                line_bsc_qty: s[i].getValue('custrecord_agr_line_bsc_qty'),
                line_item: s[i].getValue('custrecord_agr_line_item'),
                line_srt_date: line_srt_date,
                line_exceed_rate: s[i].getValue('custrecord_agr_line_exceed_rate'),
                line_war_end_date: s[i].getValue('custrecord_agr_line_war_end_date'),
                agreementType: s[i].getValue('custrecord_agr_type', 'custrecord_agr_line_agreement'),
                line_end_cust: s[i].getValue('custrecord_agr_line_end_cust'),
                num_mon: Number(s[i].getValue('custrecord_agr_num_mon', 'custrecord_agr_line_agreement')),
                discount: s[i].getValue('custrecord_agr_discount', 'custrecord_agr_line_agreement'),
                line_end_date: line_end_date,

            });
        }
    }
}
function CreateBillingPlan(createBPdata) {
    debugger;
    nlapiLogExecution('DEBUG', 'createBPdata: ' + createBPdata.length, JSON.stringify(createBPdata));
    try {
        var setLastBillindDate = true;
        for (var i = 0; i < createBPdata.length; i++) {
            Context(context)
            var rec = nlapiCreateRecord('customrecord_billing_plan');
            //Header Fields 
            rec.setFieldValue('custrecord_bill_plan_cust', createBPdata[i].line_customer);
            rec.setFieldValue('custrecord_bill_plan_agr', createBPdata[i].line_agreement);
            rec.setFieldValue('custrecord_bill_plan_agr_line', createBPdata[i].line_id);
            rec.setFieldValue('custrecord_bill_plan_bill_grp', createBPdata[i].line_bill_grp);
            rec.setFieldValue('custrecord_bill_plan_bsc_rate', createBPdata[i].line_bsc_rate);
            rec.setFieldValue('custrecord_bill_plan_bsc_qty', createBPdata[i].line_bsc_qty);
            rec.setFieldValue('custrecord_bill_plan_per_str_date', createBPdata[i].firstDay);
            rec.setFieldValue('custrecord_bill_plan_per_end_date', createBPdata[i].lastDay);
            rec.setFieldValue('custrecord_bill_plan_item', createBPdata[i].line_item);
            rec.setFieldValue('custrecord_bill_plan_warranty_end_date', createBPdata[i].line_war_end_date);
            rec.setFieldValue('custrecord_bill_plan_exc_rate', createBPdata[i].line_exceed_rate);
            rec.setFieldValue('custrecord_bill_plan_end_cust', createBPdata[i].line_end_cust);
            rec.setFieldValue('custrecord_bill_plan_billing_cycle', createBPdata[i].line_bill_cyc);
            rec.setFieldValue('custrecord_bill_sche_disc', createBPdata[i].discount);


            if (i == 0) {
                rec.setFieldValue('custrecord_bill_plan_frst_bill', 'T');
            }
            if (createBPdata[i].agreementType == '2') {
                rec = nlapiLoadRecord('customrecord_agr_line', createBPdata[i].line_id)
                rec.setFieldValue('custrecord_bill_plan_maint_charge_amt', rec.getFieldValue('custrecord_agr_line_maint_charge_rate'));
            }
            try {
                var id = nlapiSubmitRecord(rec);
                nlapiLogExecution('debug', 'Billing Plan id: ', id);
                //console.log(id)
            } catch (e) {
                nlapiLogExecution('DEBUG', 'error nlapiSubmitRecord ', e);
                setLastBillindDate = false;
                //console.log(e)
            }
        }
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error CreateBillingPlan ', e);
        setLastBillindDate = false;
    }
    return setLastBillindDate;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 800) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}
function lastDayOfCurrentMonth(firstDay, interval) {
    firstDay = nlapiAddMonths(firstDay, interval - 1);
    return new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0)
}
function getStartDate(startDate, line, interval) {
    if (line == 0) { return nlapiStringToDate(startDate) }
    else {
        startDate = nlapiStringToDate(startDate)
        startDate = nlapiAddMonths(startDate, line * interval);
        return startDate
    }
}
function DayOfCurrentMonth(firstDay, interval) {
    firstDay = nlapiAddMonths(firstDay, interval);
    firstDay = nlapiAddDays(firstDay, -1)
    return firstDay
}
function getBillingPlane(id) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_bill_plan_agr_line', null, 'anyof', id);
    filters[1] = new nlobjSearchFilter('custrecord_bill_plan_inv_on', null, 'anyof', ["@NONE@"]);

    var search = nlapiCreateSearch('customrecord_billing_plan', filters, null);
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
    if (s != null) {
        nlapiLogExecution('debug', 'Number Of Billing Plane to delete', s.length);
        for (var i = 0; i < s.length; i++) {
            nlapiDeleteRecord('customrecord_billing_plan', s[i].id)
        }
    }
    return s.length;
}


