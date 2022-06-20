var context = nlapiGetContext();
var globalSettings = [];
var invId = [];

function creation() {
    try {
        nlapiLogExecution('DEBUG', 'SCRIPT', 'RUN');

        var arr = context.getSetting('SCRIPT', 'custscript_arr');
        var method = context.getSetting('SCRIPT', 'custscript_method');
        var userid = context.getSetting('SCRIPT', 'custscript_user');
        var batch = context.getSetting('SCRIPT', 'custscript_batch');
        
        var duedate = context.getSetting('SCRIPT', 'custscript_duedate');

        globalSettings = getGlobalSettings(method);
        var payment_account = globalSettings[0].acc_batch_screen
       
        nlapiLogExecution('DEBUG', 'method : ' + method, 'userid : ' + userid + ' | batch : ' + batch + ' | payment_account : ' + payment_account + ' | duedate : ' + duedate);
        nlapiLogExecution('DEBUG', 'arr', arr);

        arr = JSON.parse(arr)

        insertBatch(batch, payment_account, duedate, arr);
        for (var fld in arr) {
            var val = arr[fld];
            nlapiLogExecution('debug', fld, JSON.stringify(val));
            scriptcheck();
            for (var fldEnt in val) {
                var valEnt = val[fldEnt];
                scriptcheck();
                nlapiLogExecution('debug', fldEnt, valEnt);

                if (fldEnt == 'entity') {
                    var amountcorrection = val['amountcorrection'];
                    nlapiLogExecution('DEBUG', 'amountcorrection', amountcorrection);
                    var custSum = 0;
                    var results = [];             
                    if (amountcorrection > 0) {
                        if (method == '2')
                            paymentcreation(valEnt, batch, results, amountcorrection, payment_account, method);
                        if (method == '1')
                            creditguard(valEnt, batch, results, custSum, amountcorrection, payment_account, method);
                    }
                }
            }
        }
        if (method == '2')
            filecreation(batch, userid);
        if (method == '1')
            var newEmail = nlapiSendEmail(userid, userid, 'Credit Guard Email Notification', 'Please note that payment credit guard with batch #: ' + batch + ' - finished', null, null, null, null);


        nlapiLogExecution('DEBUG', 'SCRIPT', 'END');
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error', e);
    }
}
function insertBatch(batch, payment_account, duedate, arr) {

    nlapiLogExecution('DEBUG', ' W/C- insertBatch', JSON.stringify(arr));
    for (var fld in arr) {
        var val = arr[fld];
        scriptcheck();
        for (var fldEnt in val) {
            var valEnt = val[fldEnt];
            scriptcheck();

            if (fldEnt == 'entity') {

                var results = [];
                var columns = new Array();
                columns[0] = new nlobjSearchColumn('internalid');
                columns[1] = new nlobjSearchColumn('tranid');
                columns[2] = new nlobjSearchColumn('recordtype');
         

                //Collection Batch (Script) without group
                var search = nlapiLoadSearch(null, 'customsearch_without_group');
                search.addFilter(new nlobjSearchFilter('internalid', 'customermain', 'anyof', valEnt));
                search.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', duedate));
                search.addFilter(new nlobjSearchFilter('mainline', null, 'is', 'T'));


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
                nlapiLogExecution('DEBUG', 'transaction list: ', JSON.stringify(s));
                if (s != null) {
                    for (var i = 0; i < s.length; i++) {
                        scriptcheck();
                        try {    
                            invId.push(s[i].id);
                            nlapiSubmitField(s[i].getValue('recordtype'), s[i].id, 'custbody_batch', batch);
                            
                        } catch (e) {
                            continue;
                        }
                    }
                }
            }
        }


    }
}
function paymentcreation(entity, batch_number, arr, amountcorrection, payment_account, method) {
    try {
        nlapiLogExecution('DEBUG', 'paymentcreation', 'START');

        var rec = nlapiCreateRecord('customerpayment', { recordmode: 'dynamic' });
        rec.setFieldValue('customer', entity);

        rec.setFieldValue('custbody_batch', batch_number);    
        nlapiLogExecution('DEBUG', 'arr==null', amountcorrection);
        rec.setFieldValue('payment', amountcorrection);   
        rec.setFieldValue('paymentoption', globalSettings[0].payment_option);
        rec.setFieldValue('undepfunds', 'F');
        rec.setFieldValue('autoapply', 'F');
        rec.setFieldValue('account', payment_account);

        var linecount = rec.getLineItemCount('apply');
        for (var k = 1; k <= linecount; k++) {
            internalid = rec.getLineItemValue('apply', 'internalid', k);
            nlapiLogExecution('DEBUG', 'internalid ' + internalid, invId + '-' + invId.indexOf(internalid));
            rec.selectLineItem('apply', k);            
            if (invId.indexOf(internalid) != -1) {
                rec.setCurrentLineItemValue("apply", "apply", 'T');
            }              
            //else rec.setLineItemValue("apply", "apply", k, 'F');
            rec.commitLineItem("apply");
        }
        var recid = nlapiSubmitRecord(rec, true, true);
        nlapiLogExecution('DEBUG', 'paymentcreation recid', recid);

        return true;

    } catch (e) {
        nlapiLogExecution('ERROR', 'error - paymentcreation', e);
        return e
    }

}
function filecreation(batch, userid) {
    try {
        nlapiLogExecution('DEBUG', 'filecreation', 'batch: ' + batch + ' , userid: ' + userid);

        var rec = nlapiLoadRecord('subsidiary', globalSettings[0].subsidiary)

        var strFirst = ''
        var strRows = ''
        var strLast = ''

        var mosad = globalSettings[0].code_mosad;
        var mosad_sender = globalSettings[0].mosad_sender;
        var mosadname = rec.getFieldValue('name');
        var currency = '00';
        var date = dateconverter();


        strFirst += 'K';
        strFirst += mosad;
        strFirst += currency;
        strFirst += date;
        strFirst += '0';
        strFirst += '001';
        strFirst += '0';
        strFirst += date;
        strFirst += mosad_sender;
        strFirst += '000000';
        strFirst += pad(mosadname, 30);
        strFirst += pad(' ', 56, ' ');
        strFirst += 'KOT';





        //************************************************************************************************* */
        var results = [];
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('internalid');
        columns[1] = new nlobjSearchColumn('tranid');
        columns[2] = new nlobjSearchColumn('amount');
        columns[3] = new nlobjSearchColumn('name');
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
        filters[1] = new nlobjSearchFilter('custbody_batch', null, 'is', batch);


        var search = nlapiCreateSearch('customerpayment', filters, columns);

        var resultset = search.runSearch();
        var s = [];
        var searchid = 0;
        var results = [];
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        var sum = 0;
        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                scriptcheck()



                var custid = s[i].getValue('name');
                var cust = nlapiLoadRecord('customer', custid);




                strRows += '1';
                strRows += mosad;
                strRows += currency;
                strRows += '000000';
                strRows += pad(cust.getFieldValue('custentity_ilo_cust_bank_number'), 2);//קוד בנק
                strRows += pad(cust.getFieldValue('custentityilo_cust_bank_branch_number'), 3);//מספר סניף
                strRows += '0000';
                strRows += pad(cust.getFieldValue('custentity_ilo_cust_bank_account_number'), 9);//מספר חשבון
                strRows += '0';
                strRows += pad(cust.getFieldValue('vatregnumber'), 9);//מס' זיהוי של הלקוח
                //strRows += pad(cust.getFieldValue('entityid'), 16);//שם הלקוח
                strRows += pad(cust.getFieldValue('nameorig'), 16);//שם הלקוח
                sum += Number(s[i].getValue('amount'));
                strRows += pad((Number(s[i].getValue('amount')) * 100).toFixed(0), 13);
                strRows += pad(cust.id, 20);//מס' מזהה ללקוח במוסד )אסמכתא(
                strRows += '00000000';//תקופת החיוב
                strRows += '000';
                strRows += '504';
                strRows += '000000000000000000';//18
                strRows += pad(' ', 2, ' ');



                strRows += "\r\n";


            }
            //return results;
        }


        //***************************************************************************************************** */







        strLast += '5';
        strLast += mosad;
        strLast += currency;
        strLast += date;
        strLast += '0';
        strLast += '001';
        strLast += '000000000000000';//15
        strLast += pad((sum * 100).toFixed(0), 15);//סכום התנועות
        strLast += '0000000';//7
        strLast += pad(s.length, 7);//מספר תנועות
        strLast += pad(' ', 63, ' ');

        strLast += '\r\n99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999';

        var data = strFirst + "\r\n" + strRows + strLast + "\r\n";
        nlapiLogExecution('DEBUG', 'data', data);
        var file = nlapiCreateFile('Masav.txt', 'PLAINTEXT', data);
        var newEmail = nlapiSendEmail(userid, userid, 'MASAV email and attachment', 'Please see the attached file', null, null, null, file);
        nlapiLogExecution('DEBUG', 'newEmail', newEmail);

    } catch (e) {
        nlapiLogExecution('DEBUG', 'error - filecreation', e);
        return e
    }
}
function creditguard(entity, batch_number, invoices, custSum, amountcorrection, payment_account, method) {

    nlapiLogExecution('DEBUG', 'creditguard', 'START');
    nlapiLogExecution('DEBUG', 'creditguard : custSum', custSum);
    nlapiLogExecution('DEBUG', 'entity : ' + entity + ' + invoices: ', JSON.stringify(invoices));
    nlapiLogExecution('DEBUG', 'custSum', custSum);
    scriptcheck();

    if (custSum == 0)
        custSum = amountcorrection;

    var cardid = nlapiLookupField('customer', entity, 'custentity_card_id');
    var expdate = nlapiLookupField('customer', entity, 'custentity_expiration_date');

    var xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<ashrait>';
    xml += '<request>';
    xml += '<version>2000</version>';
    xml += '<language>HEB</language>';
    var date = getdate();
    xml += '<dateTime>' + date + '</dateTime>';
    xml += '<command>doDeal</command>';
    xml += '<doDeal>';
    xml += '<terminalNumber>0886812013</terminalNumber>';
    xml += '<cardId>' + cardid + '</cardId>';
    xml += '<cardExpiration>' + expdate + '</cardExpiration>';
    xml += '<cvv>' + 0 + '</cvv>';
    xml += '<total>' + (custSum * 100).toFixed(0) + '</total>';
    xml += '<transactionType>Debit</transactionType>';
    xml += '<creditType>RegularCredit</creditType>';
    xml += '<currency>ILS</currency>';
    xml += '<transactionCode>Phone</transactionCode>';
    xml += '<validation>AutoComm</validation>';
    xml += '</doDeal>';
    xml += '</request>';
    xml += '</ashrait>';

    //nlapiLogExecution('DEBUG', 'xml', xml);

    var headers = {
        'Content-Type': "application/x-www-form-urlencoded"
    };

    var environment = context.getEnvironment();
    nlapiLogExecution('DEBUG', 'environment', environment);

    if (environment == 'SANDBOX') {
        var sUrl = globalSettings[0].sandbox_url

        var xmltosend = {
            'user': globalSettings[0].sandbox_user_name,
            'password': globalSettings[0].sandbox_password,
            'int_in': xml
        }
    }
    else {
        var sUrl = globalSettings[0].prod_url

        var xmltosend = {
            'user': globalSettings[0].prod_user_name,
            'password': globalSettings[0].prod_password,
            'int_in': xml
        }
    }

    var response = nlapiRequestURL(sUrl, xmltosend, headers);
    nlapiLogExecution('DEBUG', 'response', JSON.stringify(response));
    var mestr = 'userMessage';
    var usermessage = response.body.slice(response.body.indexOf(mestr) + mestr.length + 1, response.body.lastIndexOf(mestr) - 2);
    nlapiLogExecution('DEBUG', 'usermessage', usermessage);
    var xmlDataResponse = nlapiStringToXML(response.body);
    var status = nlapiSelectValue(xmlDataResponse, '//status');
    nlapiLogExecution('DEBUG', 'status', status);
    var additionalInfo = nlapiSelectValue(xmlDataResponse, '//additionalInfo');
    nlapiLogExecution('DEBUG', 'additionalInfo', additionalInfo);

    if (status == '000') {
        nlapiLogExecution('DEBUG', 'in if status', '== 000');
        paymentcreation(entity, batch_number, invoices, amountcorrection, payment_account, method);

    }
    else if (status != '000') {
        nlapiLogExecution('DEBUG', 'in if status', '!= 000');

        for (var fld in invoices) {
            scriptcheck();
            var invoice = invoices[fld];
            var id = invoice["id"];
            nlapiLogExecution('DEBUG', 'id', id);
            nlapiSubmitField('invoice', id, 'custbody_batch', ' ');


        }
        var errecord = nlapiCreateRecord('customrecord_credit_card_interface_error');
        errecord.setFieldValue('custrecord_cg_customer', entity);
        errecord.setFieldValue('custrecord_transaction_amount', custSum);
        errecord.setFieldValue('custrecord_cg_status_response', status);
        errecord.setFieldValue('custrecord_error_returned', usermessage);
        errecord.setFieldValue('custrecord_additionalinfo', additionalInfo);
        errecord.setFieldValue('custrecord_cg_batch', batch_number);



        erid = nlapiSubmitRecord(errecord, true, true);



    }
    return true;
}
function pad(n, width, z) {
    if (n == null)
        n = '0';
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function dateconverter() {

    var d = new Date();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear().toString().slice(2, 4);

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = [year, month, day].join('')/* + [hour, minutes, seconds].join('')*/;
    return formatdate

}
function getdate() {
    var d = new Date();
    d.setHours(d.getHours() + 9)
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();


    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = [year, month, day].join('-') + ' ' + d.toTimeString().substring(0, 8)
    return formatdate;
}
function scriptcheck() {
    if (context.getRemainingUsage() < 400) {
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }
    return true
}
function getGlobalSettings(method) {

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custrecord_bank_acc_cg_batch_screen'));
    columns.push(new nlobjSearchColumn('custrecord_bank_acc_cg_customer_button'));
    columns.push(new nlobjSearchColumn('custrecord_code_mosad'));
    columns.push(new nlobjSearchColumn('custrecord_mosad_sender'));
    columns.push(new nlobjSearchColumn('custrecord_prod_user_name'));
    columns.push(new nlobjSearchColumn('custrecord_prod_password'));
    columns.push(new nlobjSearchColumn('custrecord_sandbox_user_name'));
    columns.push(new nlobjSearchColumn('custrecord_sandbox_password'));
    columns.push(new nlobjSearchColumn('custrecord_prod_url'));
    columns.push(new nlobjSearchColumn('custrecord_sandbox_url'));
    columns.push(new nlobjSearchColumn('custrecord_subsidiary'));
    columns.push(new nlobjSearchColumn('custrecord_payment_option'));

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_recurring_agr_collection_mtd', null, 'anyof', method)

    var search = nlapiCreateSearch('customrecord_collection_settings', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            results.push({
                acc_batch_screen: s[i].getValue('custrecord_bank_acc_cg_batch_screen'),
                acc_customer_button: s[i].getValue('custrecord_bank_acc_cg_customer_button'),
                code_mosad: s[i].getValue('custrecord_code_mosad'),
                mosad_sender: s[i].getValue('custrecord_mosad_sender'),
                prod_user_name: s[i].getValue('custrecord_prod_user_name'),
                prod_password: s[i].getValue('custrecord_prod_password'),
                sandbox_user_name: s[i].getValue('custrecord_sandbox_user_name'),
                sandbox_password: s[i].getValue('custrecord_sandbox_password'),
                prod_url: s[i].getValue('custrecord_prod_url'),
                sandbox_url: s[i].getValue('custrecord_sandbox_url'),
                subsidiary: s[i].getValue('custrecord_subsidiary'),
                payment_option: s[i].getValue('custrecord_payment_option'),
            });
        }
        nlapiLogExecution('DEBUG', 'getGlobalSettings results', JSON.stringify(results));
        return results;
    }
}
