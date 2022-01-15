var toPrintArr = [];
var paymentsArr = [];
var templateString = '';
var bankAccount = nlapiLookupField('subsidiary', 22, 'custrecord_cbr_tradeon_bank_acc_number')

var data = [];
var currencyValidation = false;

function eft_template(request, response) {

    if (request.getMethod() == 'GET') {

        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var form = nlapiCreateForm('Choose Payments');

        form.setScript('customscript_dev_leumi_eft_cs')
        form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
        form.addSubmitButton('Next');

        var type = form.addField('custpage_type', 'select', 'TYPE', null, null);
        type.addSelectOption('1', 'Generate Eft File');
        type.addSelectOption('2', 'Approve Success Upload');

        paymentSearch();

        var resultsSubList = form.addSubList('custpage_results_sublist', 'inlineeditor', 'Results', null);

        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

        resultsSubList.addField('custpage_resultssublist_id', 'text', 'id').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_tranid', 'text', 'Document Number').setDisplayType('disabled');

        resultsSubList.addField('custpage_resultssublist_trandate', 'date', 'Date').setDisplayType('disabled');

        resultsSubList.addField('custpage_resultssublist_customer', 'text', 'Customer').setDisplayType('disabled');

        resultsSubList.addField('custpage_resultssublist_currency', 'text', 'Currency').setDisplayType('disabled');

        resultsSubList.addField('custpage_resultssublist_totalamt', 'currency', 'Amount').setDisplayType('disabled');

        var type = resultsSubList.addField('custpage_resultssublist_type', 'select', 'Type');
        type.addSelectOption('15', 'תשלום יבוא שירותים');
        type.addSelectOption('16', 'העברות מט"ח');
        type.setMandatory(true);

        var resson = resultsSubList.addField('custpage_resultssublist_reason', 'select', 'Reason', 'customrecord_cbr_tradeon_reason');
        resson.setMandatory(true);

        resultsSubList.addField('custpage_resultssublist_reason_comments', 'text', 'TRANSFER REASON COMMENTS', null);

        resultsSubList.addField('custpage_resultssublist_reason_tax', 'percent', 'TRADEON-TAX', null);

        var calc_type = resultsSubList.addField('custpage_resultssublist_calc_type', 'select', 'CALCULATION TYPE');
        calc_type.addSelectOption('2', 'r- במקור');
        calc_type.addSelectOption('1', 'g- מגולם');

        resultsSubList.addField('custpage_resultssublist_exempt_cer_num', 'text', 'CERTIFICATE NUMBER', null);

        resultsSubList.addField('custpage_resultssublist_exempt_cer_date', 'date', 'CERTIFICATE DATE', null);

        resultsSubList.addField('custpage_resultssublist_account_goods', 'select', 'ACCOUNT FOR THE GOODS', 'customlist_cbr_tradeon_bank_account');

        resultsSubList.addField('custpage_resultssublist_currency_goods', 'select', 'ACCOUNT CURRENCY (GOODS)', 'currency');

        resultsSubList.addField('custpage_resultssublist_account_commission', 'select', 'ACCOUNT FOR THE commission', 'customlist_cbr_tradeon_bank_account');

        resultsSubList.addField('custpage_resultssublist_currency_commission', 'select', 'ACCOUNT CURRENCY (COMMISSION)', 'currency');

        var charge_fee = resultsSubList.addField('custpage_resultssublist_charge_fee', 'select', 'charge fee');
        charge_fee.addSelectOption('3', 's- מתחלק');
        charge_fee.addSelectOption('1', 'o- על חשבונינו');
        charge_fee.addSelectOption('2', 'b- על חשבון המוטב');

        resultsSubList.addField('custpage_resultssublist_exempt_payment_date', 'date', 'payment DATE', null);

        resultsSubList.addField('custpage_resultssublist_comments', 'text', 'comments', null);

        resultsSubList.addField('custpage_resultssublist_treadon_code', 'text', 'tread on code').setDisplayType('disabled');

        resultsSubList.addField('custpage_resultssublist_branch_code', 'text', 'BRANCH CODE').setDisplayType('disabled');
        resultsSubList.addField('custpage_resultssublist_bank_name', 'text', 'BANK NAME').setDisplayType('disabled');
        resultsSubList.addField('custpage_resultssublist_account_number', 'text', 'ACCOUNT NUMBER').setDisplayType('disabled');

   

        var today = new Date();

        for (var j = 0; j < paymentsArr.length; j++) {

            resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'T')
            resultsSubList.setLineItemValue('custpage_resultssublist_tranid', j + 1, toPrintArr[paymentsArr[j]].p_transactionnumber);
            resultsSubList.setLineItemValue('custpage_resultssublist_id', j + 1, paymentsArr[j]);
            resultsSubList.setLineItemValue('custpage_resultssublist_trandate', j + 1, toPrintArr[paymentsArr[j]].p_trandate);
            resultsSubList.setLineItemValue('custpage_resultssublist_customer', j + 1, toPrintArr[paymentsArr[j]].p_customerName);
            resultsSubList.setLineItemValue('custpage_resultssublist_currency', j + 1, toPrintArr[paymentsArr[j]].p_currency);
            resultsSubList.setLineItemValue('custpage_resultssublist_totalamt', j + 1, toPrintArr[paymentsArr[j]].p_totalAmt);
            resultsSubList.setLineItemValue('custpage_resultssublist_type', j + 1, toPrintArr[paymentsArr[j]].tradeon_trans_type);
            resultsSubList.setLineItemValue('custpage_resultssublist_reason', j + 1, toPrintArr[paymentsArr[j]].tradeon_reason);
            resultsSubList.setLineItemValue('custpage_resultssublist_reason_comments', j + 1, toPrintArr[paymentsArr[j]].reason_comments);
            resultsSubList.setLineItemValue('custpage_resultssublist_reason_tax', j + 1, toPrintArr[paymentsArr[j]].tradeon_tax);
            resultsSubList.setLineItemValue('custpage_resultssublist_calc_type', j + 1, toPrintArr[paymentsArr[j]].calc_type);
            resultsSubList.setLineItemValue('custpage_resultssublist_exempt_cer_num', j + 1, toPrintArr[paymentsArr[j]].exe_cert_num);
            resultsSubList.setLineItemValue('custpage_resultssublist_exempt_cer_date', j + 1, toPrintArr[paymentsArr[j]].exe_cert_date);
            resultsSubList.setLineItemValue('custpage_resultssublist_account_goods', j + 1, toPrintArr[paymentsArr[j]].tradeon_account_goods);
            resultsSubList.setLineItemValue('custpage_resultssublist_currency_goods', j + 1, toPrintArr[paymentsArr[j]].acc_goods_curr);
            resultsSubList.setLineItemValue('custpage_resultssublist_account_commission', j + 1, toPrintArr[paymentsArr[j]].tradeon_acc_commission);
            resultsSubList.setLineItemValue('custpage_resultssublist_currency_commission', j + 1, toPrintArr[paymentsArr[j]].tradeon_acc_curr_commi);
            resultsSubList.setLineItemValue('custpage_resultssublist_charge_fee', j + 1, toPrintArr[paymentsArr[j]].tradeon_charge_fees);
            resultsSubList.setLineItemValue('custpage_resultssublist_exempt_payment_date', j + 1, toPrintArr[paymentsArr[j]].tradeon_pay_date);          
            resultsSubList.setLineItemValue('custpage_resultssublist_comments', j + 1, toPrintArr[paymentsArr[j]].comments);
            resultsSubList.setLineItemValue('custpage_resultssublist_treadon_code', j + 1, toPrintArr[paymentsArr[j]].treadon_code);
            resultsSubList.setLineItemValue('custpage_resultssublist_branch_code', j + 1, toPrintArr[paymentsArr[j]].BRANCH_CODE);
            resultsSubList.setLineItemValue('custpage_resultssublist_bank_name', j + 1, toPrintArr[paymentsArr[j]].BANK_NAME);
            resultsSubList.setLineItemValue('custpage_resultssublist_account_number', j + 1, toPrintArr[paymentsArr[j]].ACCOUNT_NUMBER);

        }

        var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
        checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');



        response.writePage(form);

    }


    else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') { // change to something less broad
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');

        var secondForm = nlapiCreateForm('Approve Success Upload');
        var approve_type = request.getParameter('custpage_type');
        var LinesNo = request.getLineItemCount('custpage_results_sublist');
        for (var m = 1; m <= LinesNo; m++) {

            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', m);
            if (checkBox == 'T') {
                id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_id', m);
                amount = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_totalamt', m);
                currency = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_currency', m);
                type = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_type', m);
                reason = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_reason', m);
                reason_comments = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_reason_comments', m);
                tax = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_reason_tax', m);
                calc_type = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_calc_type', m);
                cer_num = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_exempt_cer_num', m);
                cer_date = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_exempt_cer_date', m);
                account_goods = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_account_goods', m);
                currency_goods = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_currency_goods', m);
                account_commission = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_account_commission', m);
                currency_commission = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_currency_commission', m);
                charge_fee = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_charge_fee', m);
                payment_date = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_exempt_payment_date', m);
                treadon_code = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_treadon_code', m);
                comments = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_comments', m);

                data.push({
                    id: id,
                    amount: amount.replace('.', ''),
                    currency: currency,
                    type: type,
                    reason: reason,
                    reason_comments: reason_comments,
                    tax: tax,
                    calc_type: calc_type,
                    cer_num: cer_num,
                    cer_date: cer_date,
                    account_goods: account_goods,
                    currency_goods: currency_goods,
                    account_commission: account_commission,
                    currency_commission: currency_commission,
                    comments: comments,
                    charge_fee: charge_fee,
                    payment_date: payment_date,
                    treadon_code: treadon_code,
                });
            } // if (checkBox == 'T')		
        } // for (var m = 1; m <= LinesNo; m++){   
        buildHeaderTemplate();
        nlapiLogExecution('DEBUG', 'JSON.stringify(Billing_entity)', JSON.stringify(data));

        buildTemplate(data);
        try { nlapiScheduleScript('customscript_dev_leumi_eft_ss', 'customdeploy_dev_leumi_eft_ss_dep', { custscript_treadon_data: JSON.stringify(data), custscript_approve_type: approve_type }) } catch (e) { }
        if (approve_type == '1') {
            downloadData(response, null)
        }
        else {
            var linkprintChoiceForm = secondForm.addField("custpage_ilo_view", "inlinehtml", "", null, null);
            linkprintChoiceForm.setDefaultValue('<h1>Approve Success Upload</h1>'); //url of pdf from f
            response.writePage(secondForm);
        }

    }//end of first else  
};



function paymentSearch() {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
    filters[1] = new nlobjSearchFilter('custbody_cbr_tradeon_vendor_code', null, 'noneof', ["@NONE@"]);
    filters[2] = new nlobjSearchFilter('custbody_cbr_tradeon_eft_created', null, 'is', 'F');
    filters[3] = new nlobjSearchFilter('currency', null, 'noneof', ["5"]);
    filters[4] = new nlobjSearchFilter('status', null, 'noneof', ["VendPymt:E", "VendPymt:V", "VendPymt:D", "VendPymt:A"]);
    filters[5] = new nlobjSearchFilter('custbody_cbr_tradeon_reason', null, 'noneof', ["@NONE@"]);


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid')
    columns[1] = new nlobjSearchColumn('tranid');
    columns[2] = new nlobjSearchColumn('trandate');
    columns[3] = new nlobjSearchColumn('entity');
    columns[4] = new nlobjSearchColumn('fxamount');
    columns[5] = new nlobjSearchColumn('transactionnumber');
    columns[6] = new nlobjSearchColumn('currency');
    columns[7] = new nlobjSearchColumn('custbody_cbr_tradeon_vendor_code');
    columns[8] = new nlobjSearchColumn('custbody_cbr_tradeon_trans_type');
    columns[9] = new nlobjSearchColumn('custbody_cbr_tradeon_reason');
    columns[10] = new nlobjSearchColumn('custbody_cbr_tradeon_reason_comments');
    columns[11] = new nlobjSearchColumn('custbody_cbr_tradeon_tax');
    columns[12] = new nlobjSearchColumn('custbody_cbr_tradeon_calc_type');
    columns[13] = new nlobjSearchColumn('custbody_cbr_tradeon_exe_cert_num');
    columns[14] = new nlobjSearchColumn('custbody_cbr_tradeon_exe_cert_date');
    columns[15] = new nlobjSearchColumn('custbody_cbr_tradeon_account_goods');
    columns[16] = new nlobjSearchColumn('custbody_cbr_tradeon_acc_goods_curr');
    columns[17] = new nlobjSearchColumn('custbody_cbr_tradeon_acc_commission');
    columns[18] = new nlobjSearchColumn('custbody_cbr_tradeon_acc_curr_commi');
    columns[19] = new nlobjSearchColumn('custbody_cbr_tradeon_charge_fees');
    columns[20] = new nlobjSearchColumn('custbody_cbr_tradeon_pay_date');
    columns[21] = new nlobjSearchColumn('custbody_cbr_tradeon_comments');
    columns[22] = new nlobjSearchColumn('exchangerate');



    var search = nlapiCreateSearch('vendorpayment', filters, columns);
    var runSearch = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);



    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            var code_id = s[i].getValue('custbody_cbr_tradeon_vendor_code');


            toPrintArr[s[i].id] = {
                p_tranid: s[i].getValue('tranid'),
                p_trandate: s[i].getValue('trandate'),
                p_customerName: s[i].getText('entity'),
                p_totalAmt: Math.abs(s[i].getValue('fxamount')).toFixed(2),
                p_transactionnumber: s[i].getValue('transactionnumber'),
                p_currency: s[i].getText('currency'),
                treadon_code: s[i].getText('custbody_cbr_tradeon_vendor_code'),
                BRANCH_CODE: nlapiLookupField('customrecord_cbr_tradeon_vendor_codes', code_id, 'custrecord15'),
                BANK_NAME: nlapiLookupField('customrecord_cbr_tradeon_vendor_codes', code_id, 'custrecord16'),
                ACCOUNT_NUMBER: nlapiLookupField('customrecord_cbr_tradeon_vendor_codes', code_id, 'custrecord19'),
                tradeon_trans_type: s[i].getValue('custbody_cbr_tradeon_trans_type'),
                tradeon_reason: s[i].getValue('custbody_cbr_tradeon_reason'),
                reason_comments: s[i].getValue('custbody_cbr_tradeon_reason_comments'),
                tradeon_tax: s[i].getValue('custbody_cbr_tradeon_tax'),
                calc_type: s[i].getValue('custbody_cbr_tradeon_calc_type'),
                exe_cert_num: s[i].getValue('custbody_cbr_tradeon_exe_cert_num'),
                exe_cert_date: s[i].getValue('custbody_cbr_tradeon_exe_cert_date'),
                tradeon_account_goods: s[i].getValue('custbody_cbr_tradeon_account_goods'),
                acc_goods_curr: s[i].getValue('custbody_cbr_tradeon_acc_goods_curr'),
                tradeon_acc_commission: s[i].getValue('custbody_cbr_tradeon_acc_commission'),
                tradeon_acc_curr_commi: s[i].getValue('custbody_cbr_tradeon_acc_curr_commi'),
                tradeon_charge_fees: s[i].getValue('custbody_cbr_tradeon_charge_fees'),
                tradeon_pay_date: s[i].getValue('custbody_cbr_tradeon_pay_date'),
                comments: s[i].getValue('custbody_cbr_tradeon_comments'),

            };
        }
    }
    paymentsArr = Object.keys(toPrintArr);
}

function buildHeaderTemplate() {

    templateString += '150201' + BankAccount(bankAccount) + getDateFormat() + ('000' + data.length).slice(-3) + '\r\n';

}

function buildTemplate(data) {

    for (var i = 0; i < data.length; i++) {
        if (data[i].reason != "" && data[i].reason != null && data[i].reason != undefined) {
            var CODE_MAHUT = nlapiLookupField('customrecord_cbr_tradeon_reason', data[i].reason, 'custrecord_cbr_tradeon_code_mahut')
        }
        //var TAX_CODE = nlapiLookupField ( 'customrecord_cbr_tradeon_reason' , data[i].reason , 'custrecord_cbr_tradeon_tax_code'  )

        templateString += slice((i + 1), 3) + data[i].type + '\r\n';
        templateString += slice(data[i].amount, 15) + data[i].currency.toLowerCase() + getSpace(16) + getSpace(35) + getSpace(35) + getSpace(16) + getZero(6) + getZero(2) + getZero(2) +
            slice(CODE_MAHUT, 3) + getReasonComments(data[i].reason_comments) + getSpace(150) + getTax(data[i].tax) + getCalcType(data[i].calc_type) +
            get_cer_num(data[i].cer_num) + getDate(data[i].cer_date) + getTreadonCode(data[i].treadon_code) + getSpace(8) + getSpace(35) + getSpace(35) + getSpace(35) +
            getSpace(35) + getSpace(3) + getSpace(8) + getSpace(8) + getSpace(35) + getSpace(35) + getSpace(35) + getSpace(35) + getSpace(3) + getSpace(35) + 's' +
            getAccountGoods(data[i].account_goods) + getCurrencyText(data[i].currency_goods) + getAccountGoods(data[i].account_commission) +
            getCurrencyText(data[i].currency_commission) + "01" + Comments(data[i].comments) + getChargeFee(data[i].charge_fee) + 'y' + getDate(data[i].payment_date) + getZero(6) +
            getZero(2) + '#\r\n';

    }
}

function slice(num, numToSlice) {
    var zero = '';
    for (var j = 0; j < numToSlice; j++) {
        zero += '0';
    }

    return (zero + num).slice(-numToSlice)

}

function downloadData(response, form) {

    var filename = 'te';
    response.setContentType('PLAINTEXT', filename + '.txt');
    response.writeLine(templateString);
}

function getDateFormat() {
    var date = new Date();

    var formattedDate = ('0' + date.getDate()).slice(-2);
    var formattedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
    var formattedYear = date.getFullYear().toString().substr(2, 2);
    var currDate = 'd' + formattedYear + formattedMonth + formattedDate;
    var formattedHours = ('0' + date.getHours()).slice(-2);
    var formattedMinutes = ('0' + date.getMinutes()).slice(-2);
    var currHours = 't' + formattedHours + formattedMinutes;

    return currDate + currHours;

}

function getSpace(num) {
    var space = '';
    for (var i = 1; i <= num; i++) {

        space += ' ';
    }
    return space;
}

function getZero(num) {
    var zero = '';
    for (var i = 1; i <= num; i++) {

        zero += '0';
    }
    return zero;
}

function getReasonComments(comments) {
    var res = '';
    if (comments == '' || comments == null) {
        res = getSpace(50)
    }
    else {
        var commentsLength = comments.length;
        var numForSpace = 50 - commentsLength;
        res = comments + getSpace(numForSpace);
    }
    return res;
}

function getTax(tax) {
    var res = '';
    if (tax == '' || tax == null) {
        res = getZero(5)
    }
    else {
        var tax = tax.replace('%', '')
        taxSplit = tax.split('.')
        if (taxSplit[1].length == 1) {
            res = taxSplit[0] + taxSplit[1] + '0';
        }
        else {
            res = taxSplit[0] + taxSplit[1];
        }
    }
    return slice(res, 5);
}

function get_cer_num(num) {
    var res = '';
    if (num == '' || num == null) {
        res = getSpace(16)
    }
    else {

        var commentsLength = num.length;
        var numForSpace = 16 - commentsLength;
        res = num + getSpace(numForSpace);
    }

    return res;
}

function getDate(date) {
    if (date == '' || date == null) {
        var currDate = getZero(6)
    }
    else {
        var currDate = nlapiStringToDate(date);
        var formattedDate = ('0' + currDate.getDate()).slice(-2);
        var formattedMonth = ('0' + (currDate.getMonth() + 1)).slice(-2);
        var formattedYear = currDate.getFullYear().toString().substr(2, 2);
        var currDate = formattedYear + formattedMonth + formattedDate;
    }
    return currDate;
}

function getTreadonCode(code) {
    var res = '';
    if (code == '' || code == null) {
        res = getSpace(8)
    }
    else {

        var commentsLength = code.length;
        var numForSpace = 8 - commentsLength;
        res = code + getSpace(numForSpace);
    }

    return res;
}

function getAccountGoods(account_goods) {

    nlapiLogExecution('DEBUG', 'account_goods', account_goods);
    var res = '';
    if (account_goods == '' || account_goods == null) {
        res = getZero(11) + getZero(4)
        currencyValidation = false;
    }
    else {
        var name = getAccountName(account_goods);
        //res = name.replace(/ /g,'');
        var splits = name.split(' ');
        //nlapiLogExecution('DEBUG', 'splits', JSON.stringify(splits));
        res = splits[1] + splits[2] + splits[0];
        currencyValidation = true;

    }

    return res;
}

function getCurrencyText(id) {
    var name = '';

    if (id != "" && id != null && currencyValidation) {

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('internalid', null, 'is', id);

        var columns = new Array();
        columns[0] = new nlobjSearchColumn('name')

        var search = nlapiCreateSearch('currency', filters, columns);
        var runSearch = search.runSearch();
        var s = [];
        var searchid = 0;
        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);



        if (s != null) {

            name = s[0].getValue('name').toLowerCase();
        }
    }
    else {
        name = getSpace(3)
    }

    return name;
}

function getCalcType(type) {
    if (type == '2') {
        return 'r'
    }
    else if (type == '1') {
        return 'g'
    }
    else return ' ';
}

function getChargeFee(type) {
    if (type == '2') {
        return 'b'
    }
    else if (type == '1') {
        return 'o'
    }
    else if (type == '3') {
        return 's'
    }
    else return ' ';
}

function getAccountName(id) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalId', null, 'is', id);

    var col = new Array();
    col[0] = new nlobjSearchColumn('name');
    col[1] = new nlobjSearchColumn('internalId');
    var results = nlapiSearchRecord('customlist_cbr_tradeon_bank_account', null, filters, col);
    var res = '';

    if (results != null) {
        res = results[0].getValue('name')
    }
    return res

}

function BankAccount(bankAccount) {
    var res = '';
    if (bankAccount == '' || bankAccount == null) {
        res = getSpace(11)
    }
    else {
        var commentsLength = bankAccount.length;
        var numForSpace = 11 - commentsLength;
        res = bankAccount + getSpace(numForSpace);
    }
    return res;
}

function Comments(comments) {
    var res = '';
    if (comments == '' || comments == null) {
        res = getSpace(65)
    }
    else {
        var commentsLength = comments.length;
        if (commentsLength > 65) {
            res = substring(0, 65)
        }
        else {
            var numForSpace = 65 - commentsLength;
            res = comments + getSpace(numForSpace);
        }
    }
    return res;
}












