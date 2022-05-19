function ar_rev_rec_je_update() {
    var context = nlapiGetContext();
    var period_ar_closed_search = nlapiLoadSearch(null, 'customsearch_nr_ar_status');
    var columns = period_ar_closed_search.getColumns();
    var period_ar_closed = period_ar_closed_search.runSearch().getResults(0, 1)[0];
    var ar_locked_date = period_ar_closed.getValue(columns[3]);
    var ar_locked_name = period_ar_closed.getValue(columns[0]);
    var last_date_cr_op_period = period_ar_closed.getValue(columns[7]);
    nlapiLogExecution('audit', 'last_date_cr_op_period ', last_date_cr_op_period);


    var cols = [new nlobjSearchColumn("periodname"),
    new nlobjSearchColumn("internalid").setSort()
    ];
    var periods_res = nlapiSearchRecord('accountingperiod', null, [['isyear', 'is', 'F'], 'and', ['isquarter', 'is', 'F']], cols);
    var rs;
    var periodsids = [];
    var periodsnames = [];
    for (rs in periods_res) {
        var periodid = periods_res[rs].id;
        var periodname = periods_res[rs].getValue('periodname');
        periodsids.push(periodid);
        periodsnames.push(periodname);
    }


    var nextPeriod_index = periodsnames.indexOf(ar_locked_name) + 1;
    var nextPeriod_id = periodsids[nextPeriod_index];


    var revrec = nlapiLoadSearch(null, 'customsearch_nr_revrec_entries');
    nlapiLogExecution('audit', 'ar_locked_date ', ar_locked_date);
    revrec.addFilter(new nlobjSearchFilter('datecreated', null, 'after', ar_locked_date/* + " 00:00"*/));
    nlapiLogExecution('audit', 'filter ', JSON.stringify(revrec.getFilterExpression(), null, 2));
    var rs;
    var searchid = 0;
    var columns = revrec.getColumns();

    do {
        var resultslice = revrec.runSearch().getResults(searchid, searchid + 1000);
        for (rs in resultslice) {
            nlapiLogExecution('audit', 'resultslice ', searchid);
            var jeid = resultslice[rs].getValue(columns[2]);
            var date = resultslice[rs].getValue(columns[4]);
            nlapiLogExecution('audit', 'date ', date);

            nlapiLogExecution('audit', 'jeid ', jeid + ' ' + context.getRemainingUsage());

            if (context.getRemainingUsage() < 1200) {
                var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script close_vat_trans');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'nightjob_bills', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }
            if (last_date_cr_op_period <= date)
                nlapiSubmitField('journalentry', jeid, 'postingperiod', nextPeriod_id);
            searchid++;
        }
    } while (resultslice.length >= 1000);


}