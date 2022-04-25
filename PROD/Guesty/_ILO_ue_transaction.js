/* **************************************************************************************
 ** Copyright (c) 2016 One1 LTD
 ** All Rights Reserved.
 **
 * Version    Date            Author           Remarks
 * 5.20       26 NOV 2018      Moshe Barel     
 *
 *************************************************************************************** */

var taxperiods = null;
var taxcodes = null;
var nexus_country = nlapiGetFieldValue('nexus_country');
var recType = nlapiGetRecordType();
var type = recType;
var url = "https://1283062.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=639&deploy=1&compid=1283062&h=c90a24d6ffa5f3b52281";


function beforesubmit(type) {
    if (nexus_country != 'IL')
        return true;
    var body = "";
    try {
        var context = nlapiGetContext();
        var comp = context.getCompany();
        var postdata = { "refsite": comp }
        var headers = { "Content-Type": "application/json" }
        nlapiLogExecution('audit', 'res', 'type: ' + JSON.stringify(headers) + 'post: ' + JSON.stringify(postdata));
        var res = nlapiRequestURL(url, JSON.stringify(postdata), headers, null, 'POST');
        body = res.getBody();
    }
    catch (e) {
    }

    if (body.indexOf("data:notvalid") > 0)
        throw nlapiCreateError('UNEXPECTED ERROR', 'Error #9505664 - Please contact Israeli Support - supportns@one1.co.il', true);

    nlapiLogExecution('audit', 'res', 'body: ' + body);
    try {
        var subsidiary = nlapiGetFieldValue('subsidiary');
        if (subsidiary == null || subsidiary == '')
            return;
        var filters = [new nlobjSearchFilter('custrecordilo_tax_period_subsidiary', null, 'is', subsidiary)];
        var cols = [new nlobjSearchColumn("custrecordilo_tax_period_list").setSort(),
        new nlobjSearchColumn("custrecordilo_ap_tax_period_status"),
        new nlobjSearchColumn("custrecordilo_ar_tax_period_status"),
        new nlobjSearchColumn("internalid"),
        ];

        if (taxperiods == null) {
            taxperiods = nlapiSearchRecord("customrecordilo_tax_period", null, filters, cols);
        }
        cols = [new nlobjSearchColumn("custrecordil_tax_code_for_localization"),
        new nlobjSearchColumn("internalid").setSort(),
        ];
        if (taxcodes == null) {
            taxcodes = nlapiSearchRecord("salestaxitem", null, null, cols);
        }

        var recType = nlapiGetRecordType();
        var isVatPeriodEmpty = nlapiGetFieldValue('custbody_ilo_header_vat_period') == "" || nlapiGetFieldValue('custbody_ilo_header_vat_period') == null;
        nlapiLogExecution('debug', 'beforesubmit start', 'type: ' + type + ' rectype:' + recType + (new Date()).toTimeString());
        var PostingPeriodForCurDate = dateToPostingPeriod(nlapiGetFieldValue('trandate'));
        nlapiLogExecution('debug', 'PostingPeriodForCurDate', PostingPeriodForCurDate + (new Date()).toTimeString());

        var setpostingvalue = '';
        setpostingvalue = get_next_valid_period(PostingPeriodForCurDate);
        nlapiLogExecution('debug', 'setpostingvalue', setpostingvalue + (new Date()).toTimeString());
        var oldid = nlapiGetRecordId();
        var oldRecord = (oldid != "" && oldid != null) ? nlapiLoadRecord(nlapiGetRecordType(), oldid) : null;

        //setpostingvalue = get_tax_period(PostingPeriodForCurDate);
        var status = nlapiGetFieldText('approvalstatus');
        nlapiLogExecution('debug', 'status', status);

        nlapiLogExecution('debug', 'oldRecord', JSON.stringify(oldRecord));
        //nlapiLogExecution('debug', 'custbody_ilo_header_vat_period', nlapiGetFieldValue('custbody_ilo_header_vat_period'));

        if (oldRecord != null && nlapiGetFieldValue('custbody_ilo_header_vat_period') != null && nlapiGetFieldValue('custbody_ilo_header_vat_period') != '' && nlapiGetFieldValue('custbody_ilo_header_vat_period') != oldRecord.getFieldValue('custbody_ilo_header_vat_period')) {
            if (oldRecord.getFieldValue('custbody_ilo_header_vat_period') != null && is_period_closed(nlapiGetFieldValue('custbody_ilo_header_vat_period')))
                setpostingvalue = '';
        }

        if ((status != 'Approved' || status == null) && (recType == 'vendorbill'))
            setpostingvalue = '';

        if (oldRecord != null && nlapiGetFieldValue('custbody_ilo_header_vat_period') != oldRecord.getFieldValue('custbody_ilo_header_vat_period'))
            if (is_period_closed(nlapiGetFieldValue('custbody_ilo_header_vat_period')))
                nlapiSetFieldValue('custbody_ilo_header_vat_period', '');

        if (isVatPeriodEmpty)
            nlapiSetFieldValue('custbody_ilo_header_vat_period', setpostingvalue);

        //now update the lines

        var linetype = 'expense';
        var lineItemCount = nlapiGetLineItemCount(linetype);
        var headerperiod = nlapiGetFieldValue('custbody_ilo_header_vat_period');
        for (var line = 1; line <= lineItemCount; line++) {
            nlapiLogExecution('audit', 'expense ', 'line:' + line + ' linetype:' + linetype + ' ' + headerperiod);
            //set_vat_report_period(linetype, setpostingvalue);
            nlapiSetLineItemValue(linetype, 'custcol_isr_report_vat', line, headerperiod);
            nlapiLogExecution('audit', 'expense done ', 'line:' + line + ' linetype:' + linetype);
        }
        var linetype = 'line';
        var lineItemCount = nlapiGetLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            nlapiLogExecution('audit', 'expense ', 'line:' + line + ' linetype:' + linetype + ' ' + headerperiod);
            //set_vat_report_period(linetype, setpostingvalue);
            nlapiSetLineItemValue(linetype, 'custcol_isr_report_vat', line, headerperiod);
            nlapiLogExecution('audit', 'expense done ', 'line:' + line + ' linetype:' + linetype);
        }
        var linetype = 'item';
        var lineItemCount = nlapiGetLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            // set_vat_report_period(linetype, setpostingvalue);
            if (nlapiGetLineItemValue(linetype, 'itemtype', line) != "EndGroup")
                nlapiSetLineItemValue(linetype, 'custcol_isr_report_vat', line, headerperiod);
        }

    }
    catch (ex) {
        nlapiLogExecution('ERROR', 'beforesubmit ', 'error:' + ex.message);
    }
    return true;
}

function bg_set_vat_period() { // this is for wf only 
    var recid = nlapiGetContext().getSetting('SCRIPT', 'custscript_recid');
    var rectype = nlapiGetContext().getSetting('SCRIPT', 'custscript_rectype');
    var ILPeiod = nlapiGetContext().getSetting('SCRIPT', 'custscript_il_period');
    appstatus = nlapiLookupField(rectype, recid, 'approvalstatus');
    if (appstatus != '2' || appstatus == null)
        ILPeiod = '';
    nlapiLogExecution('audit', 'ILPeiod ', 'ILPeiod:' + ILPeiod + ' recid:' + recid + ' status ' + appstatus);
    nlapiSubmitField(rectype, recid, 'custbody_ilo_header_vat_period', ILPeiod);
}

function wf_set_vat_period() { // this is for wf only 
    try {
        var rec = nlapiGetNewRecord();
        //var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
        var subsidiary = rec.getFieldValue('subsidiary');
        var cur_vat = rec.getFieldValue('custbody_ilo_header_vat_period');
        if (!isNullOrEmpty(cur_vat))
            return;
        if (subsidiary == null || subsidiary == '')
            return;
        var filters = [new nlobjSearchFilter('custrecordilo_tax_period_subsidiary', null, 'is', subsidiary)];
        var cols = [new nlobjSearchColumn("custrecordilo_tax_period_list").setSort(),
        new nlobjSearchColumn("custrecordilo_ap_tax_period_status"),
        new nlobjSearchColumn("custrecordilo_ar_tax_period_status"),
        new nlobjSearchColumn("internalid"),
        ];
        if (taxperiods == null) {
            taxperiods = nlapiSearchRecord("customrecordilo_tax_period", null, filters, cols);
        }
        var PostingPeriodForCurDate = dateToPostingPeriod(rec.getFieldValue('trandate'));
        nlapiLogExecution('debug', 'PostingPeriodForCurDate', PostingPeriodForCurDate);
        var setpostingvalue = '';
        setpostingvalue = get_next_valid_period_wf(PostingPeriodForCurDate ,rec);
        nlapiLogExecution('debug', 'setpostingvalue', setpostingvalue);
        rec.setFieldValue('custbody_ilo_header_vat_period', setpostingvalue);

        //now update the lines

        var linetype = 'expense';
        var lineItemCount = rec.getLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            rec.setLineItemValue(linetype, 'custcol_isr_report_vat', line, setpostingvalue);
        }
        var linetype = 'item';
        var lineItemCount = rec.getLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            if (rec.getLineItemValue(linetype, 'itemtype', line) != "EndGroup")
                rec.setLineItemValue(linetype, 'custcol_isr_report_vat', line, setpostingvalue);
        }
        //rec.setFieldValue('approvalstatus', 2);
        //rec.setFieldValue('custbody_draft', 'F');
        //rec.setFieldValue('nextapprover', '');      
        //rec.setFieldValue('memo' , 'fasdfdf')
        //nlapiSubmitRecord(rec , null ,true);
    }
    catch (e) { }
}

function set_il_vat_code() {
    try {
        //if (name == 'trandate') {
        var linetype = 'expense';
        var lineItemCount = nlapiGetLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            nlapiSelectLineItem(linetype, line);
            nlapiCommitLineItem(linetype);
        }
        var linetype = 'item';
        var lineItemCount = nlapiGetLineItemCount(linetype);
        for (var line = 1; line <= lineItemCount; line++) {
            nlapiSelectLineItem(linetype, line);
            nlapiCommitLineItem(linetype);
        }


        var PostingPeriodForCurDate = dateToPostingPeriod(nlapiGetFieldValue('trandate'));
        PostingPeriodForCurDate = get_next_valid_period(PostingPeriodForCurDate);


    }
    catch (ex) {
        nlapiLogExecution('ERROR', 'set_il_vat_code ', 'error:' + ex.message);
    }
    return true;

}

function validate_posting_periods(selectedpostingtext, latepostingtext) {
    if (selectedpostingtext == '' || latepostingtext == '')
        return true;
    var latedate = '1' + latepostingtext;
    latedate = latedate.replace(' ', '-');
    latedate = latedate.replace(' ', '-');
    latedate = new Date(latedate);

    var selecteddate = '1 ' + selectedpostingtext;
    selecteddate = selecteddate.replace(' ', '-');
    selecteddate = new Date(selecteddate);
    var result = (latedate - selecteddate) <= 0;
    return result;
}

var closed_periods = [];
var opened_periods = [];
function is_period_closed(selectedperiod) {

    try {
        if (closed_periods.indexOf(selectedperiod) > 0)
            return true;
        if (opened_periods.indexOf(selectedperiod) > 0)
            return false;

        for (var i = 0; i < taxperiods.length; i++) {
            // access the value using the column objects
            var periodname = taxperiods[i].getText("custrecordilo_tax_period_list");
            periodname = get_base_period(periodname);
            var status = "";
            if (type == 'vendorbill' || type == "vendorcredit")
                status = taxperiods[i].getText("custrecordilo_ap_tax_period_status");
            else
                status = taxperiods[i].getText("custrecordilo_ar_tax_period_status");
            if (periodname == selectedperiod && status == 'Open') {
                opened_periods.push(selectedperiod);
                return false;
            }

        }
    }
    catch (e) { };
    closed_periods.push(selectedperiod);
    return true;

}

function get_local_tax_code(taxcodeid) {
    var local_taxcode = '';
    for (var i = 0; i < taxcodes.length; i++) {
        // access the value using the column objects
        if (taxcodes[i].id == taxcodeid)
            return taxcodes[i].getText("custrecordil_tax_code_for_localization");
    }
    if (local_taxcode == '') {
        //nlapiLogExecution('debug', 'taxgroup', 'data: ' + taxcodeid);
        var taxgroup = nlapiLoadRecord('taxgroup', taxcodeid);
        //nlapiLogExecution('debug', 'taxgroup', 'loaded');
        var taxItemCount = taxgroup.getLineItemCount('taxitem');
        //nlapiLogExecution('debug', 'taxgroup', 'count: ' + taxItemCount);
        for (var line = 1; line <= taxItemCount; line++) {
            taxcodeid = taxgroup.getLineItemValue('taxitem', 'taxitemnkey', line);
            for (var i = 0; i < taxcodes.length; i++) {
                // access the value using the column objects
                if (taxcodes[i].id == taxcodeid) {
                    local_taxcode = taxcodes[i].getText("custrecordil_tax_code_for_localization");
                    local_taxcode = local_taxcode.replace('AP ', '');
                    local_taxcode = local_taxcode.replace('AR ', '');
                }
            }
            if (local_taxcode != '')
                break;
        }
    }
    return local_taxcode;
}

var posting_periods = ['Jan 2016', 'Feb 2016', 'Mar 2016', 'Apr 2016', 'May 2016', 'Jun 2016', 'Jul 2016', 'Aug 2016', 'Sep 2016', 'Oct 2016', 'Nov 2016', 'Dec 2016',
    'Jan 2017', 'Feb 2017', 'Mar 2017', 'Apr 2017', 'May 2017', 'Jun 2017', 'Jul 2017', 'Aug 2017', 'Sep 2017', 'Oct 2017', 'Nov 2017', 'Dec 2017',
    'Jan 2018', 'Feb 2018', 'Mar 2018', 'Apr 2018', 'May 2018', 'Jun 2018', 'Jul 2018', 'Aug 2018', 'Sep 2018', 'Oct 2018', 'Nov 2018', 'Dec 2018',
    'Jan 2019', 'Feb 2019', 'Mar 2019', 'Apr 2019', 'May 2019', 'Jun 2019', 'Jul 2019', 'Aug 2019', 'Sep 2019', 'Oct 2019', 'Nov 2019', 'Dec 2019',
    'Jan 2020', 'Feb 2020', 'Mar 2020', 'Apr 2020', 'May 2020', 'Jun 2020', 'Jul 2020', 'Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020',
    'Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021', 'May 2021', 'Jun 2021', 'Jul 2021', 'Aug 2021', 'Sep 2021', 'Oct 2021', 'Nov 2021', 'Dec 2021',
    'Jan 2022', 'Feb 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022', 'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022',
    'Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023', 'Jul 2023', 'Aug 2023', 'Sep 2023', 'Oct 2023', 'Nov 2023', 'Dec 2023',
    'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
    'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026',
    'Jan 2027', 'Feb 2027', 'Mar 2027', 'Apr 2027', 'May 2027', 'Jun 2027', 'Jul 2027', 'Aug 2027', 'Sep 2027', 'Oct 2027', 'Nov 2027', 'Dec 2027',
    'Jan 2028', 'Feb 2028', 'Mar 2028', 'Apr 2028', 'May 2028', 'Jun 2028', 'Jul 2028', 'Aug 2028', 'Sep 2028', 'Oct 2028', 'Nov 2028', 'Dec 2028',
    'Jan 2029', 'Feb 2029', 'Mar 2029', 'Apr 2029', 'May 2029', 'Jun 2029', 'Jul 2029', 'Aug 2029', 'Sep 2029', 'Oct 2029', 'Nov 2029', 'Dec 2029']


var next_period = [];
function get_next_valid_period(selectedperiod) {
    nlapiLogExecution('debug', 'get_next_valid_period start', 'selectedperiod: ' + selectedperiod + ' ' + (new Date()).toTimeString());
    if (next_period[selectedperiod])
        return next_period[selectedperiod];

    var found_open = false;
    var start_from_this_period = false;
    var curVatPeriod = nlapiGetFieldValue('custbody_ilo_header_vat_period');

    var curVatPeriod_selected_index = 0;
    var NewVatPeriod_selected_index = 0
    var findnextperiod = false;
    nlapiLogExecution('debug', 'curVatPeriod', curVatPeriod)
    for (var l = 0; l < posting_periods.length; l++) {
        if (posting_periods[l] == curVatPeriod)
            curVatPeriod_selected_index = l;
    }

    var selected_period_index = posting_periods.indexOf(selectedperiod);

    // if the current value is closed - save the value;
    if (curVatPeriod != '' && !is_period_closed(posting_periods[curVatPeriod_selected_index]))
        return curVatPeriod;
    else { // current value is empty or open period
        // now check if it's open (check the data from the env)
        for (var i = selected_period_index; i <= selected_period_index + 6; i++) {
            // access the value using the column objects
            var periodname = posting_periods[i];
            if (periodname == selectedperiod)
                findnextperiod = true;
            if (findnextperiod && !is_period_closed(posting_periods[i])) {
                NewVatPeriod_selected_index = i;
                break;
            }
        }
    }

    if (NewVatPeriod_selected_index > curVatPeriod_selected_index)
        periodname = posting_periods[NewVatPeriod_selected_index];
    else
        periodname = posting_periods[curVatPeriod_selected_index];
    if (periodname == "Jan 2016")
        periodname = "";

    next_period[selectedperiod] = periodname;
    return periodname;
}

function get_next_valid_period_wf(selectedperiod , rec) {// this is for wf only 
    nlapiLogExecution('debug', 'get_next_valid_period start', 'selectedperiod: ' + selectedperiod + ' ' + (new Date()).toTimeString());
    if (next_period[selectedperiod])
        return next_period[selectedperiod];

    var found_open = false;
    var start_from_this_period = false;
    var curVatPeriod = rec.getFieldValue('custbody_ilo_header_vat_period');

    var curVatPeriod_selected_index = 0;
    var NewVatPeriod_selected_index = 0
    var findnextperiod = false;
    nlapiLogExecution('debug', 'curVatPeriod', curVatPeriod)
    for (var l = 0; l < posting_periods.length; l++) {
        if (posting_periods[l] == curVatPeriod)
            curVatPeriod_selected_index = l;
    }

    var selected_period_index = posting_periods.indexOf(selectedperiod);
    nlapiLogExecution('debug', 'selected_period_index', selected_period_index)
    // if the current value is closed - save the value;
    if (curVatPeriod != '' && !is_period_closed(posting_periods[curVatPeriod_selected_index]))
        return curVatPeriod;
    else { // current value is empty or open period
        // now check if it's open (check the data from the env)
        for (var i = selected_period_index; i <= selected_period_index + 6; i++) {
            // access the value using the column objects
            var periodname = posting_periods[i];
            if (periodname == selectedperiod)
                findnextperiod = true;
            if (findnextperiod && !is_period_closed(posting_periods[i])) {
                NewVatPeriod_selected_index = i;
                break;
            }
        }
    }

    if (NewVatPeriod_selected_index > curVatPeriod_selected_index)
        periodname = posting_periods[NewVatPeriod_selected_index];
    else
        periodname = posting_periods[curVatPeriod_selected_index];

    if (periodname == "Jan 2016")
        periodname = posting_periods[selected_period_index];

    if (periodname == "Jan 2016")
        periodname = "";

    next_period[selectedperiod] = periodname;
    return periodname;
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
    nlapiLogExecution('debug', 'convertDate', 'check:' + check);
    ISMMDD = isNaN(check) == false;
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';

    var newDate = '';
    var arr = odate.split("/");
    var day = arr[0];
    var month = arr[1];
    nlapiLogExecution('debug', 'convertDate', 'dateformat:' + dateformat);

    if (dateformat.toLowerCase() == "mm/dd/yyyy") {
        day = arr[1];
        month = arr[0];
    }
    newDate = new Date(arr[2], month - 1, day);
    nlapiLogExecution('debug', 'convertDate' + odate, 'dateformat:' + dateformat + ' ' + newDate);
    return newDate;
}

function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

