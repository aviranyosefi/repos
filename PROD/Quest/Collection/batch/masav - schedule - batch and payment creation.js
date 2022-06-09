var context = nlapiGetContext();
var wire_id = 8;//wire list value
var credit_card_id = 10;//credit card id value


function creation() {
    try {
        nlapiLogExecution('DEBUG', 'SCRIPT', 'RUN');


        var arr = nlapiGetContext().getSetting('SCRIPT', 'custscript_arr');
        var method = nlapiGetContext().getSetting('SCRIPT', 'custscript_method');
        var userid = nlapiGetContext().getSetting('SCRIPT', 'custscript_user');
        var batch = nlapiGetContext().getSetting('SCRIPT', 'custscript_batch');
        var payment_account = nlapiGetContext().getSetting('SCRIPT', 'custscript_payment_account');
        var duedate = nlapiGetContext().getSetting('SCRIPT', 'custscript_duedate');

        //var entityobj = '{"batch":"147test20210420234922","duedate":"19/4/2021","entities":[{"entity":"92","amount":499975},{"entity":"17","amount":20592}]}'
        //var method = 'c';


        nlapiLogExecution('DEBUG', 'method : ' + method, 'userid : ' + userid + ' | batch : ' + batch + ' | payment_account : ' + payment_account + ' | duedate : ' + duedate);
        nlapiLogExecution('DEBUG', 'arr', arr);


        arr = JSON.parse(arr)

        insertBatch(batch, payment_account, duedate, arr);
        nlapiLogExecution('DEBUG', 'insertBatch - out', '');



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
                    /*if (amountcorrection <= 0) {
                        var columns = new Array();
                        columns[0] = new nlobjSearchColumn('internalid');
                        columns[1] = new nlobjSearchColumn('tranid');
                        columns[2] = new nlobjSearchColumn('amountremaining');
                        var filters = new Array();
                        filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
                        filters[1] = new nlobjSearchFilter('custbody_batch', null, 'is', batch);
                        filters[2] = new nlobjSearchFilter('name', null, 'anyof', valEnt);


                        var search = nlapiCreateSearch('invoice', filters, columns);

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

                                custSum += parseFloat(s[i].getValue('amountremaining'));//discamount
                                results.push({
                                    id: s[i].id,
                                    tranid: s[i].getValue('tranid'),
                                    amount: s[i].getValue('amountremaining')
                                });


                            }
                            //return results;
                        }
                    }*/
                    if (amountcorrection > 0) {
                        if (method == 'w')
                            paymentcreation(valEnt, batch, results, amountcorrection, payment_account, method);
                        if (method == 'c')
                            creditguard(valEnt, batch, results, custSum, amountcorrection, payment_account, method);
                    }
                }


            }


        }


        if (method == 'w')
            filecreation(batch, userid);
        if (method == 'c')
            var newEmail = nlapiSendEmail(userid, userid, 'Credit Guard Email Notification', 'Please note that payment credit guard with batch #: ' + batch + ' - finished', null, null, null, null);


        nlapiLogExecution('DEBUG', 'SCRIPT', 'END');
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error', e);
    }
}

function insertBatch(batch, payment_account, duedate, arr) {

    nlapiLogExecution('DEBUG', ' W/C- insertBatch', JSON.stringify(arr));


    //var search = nlapiLoadSearch(null, 'customsearch_collection_batch');
    //var sfilters = search.getFilters();


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
                var filters = new Array();
                /*filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
                if (method == 'w')//wire - masav
                    filters[1] = new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', wire_id);
                if (method == 'c')//credit guard
                    filters[1] = new nlobjSearchFilter('custentity_customer_payment_method', 'customermain', 'anyof', credit_card_id);
                filters[2] = new nlobjSearchFilter('status', null, 'anyof', 'CustInvc:A');
                filters[3] = new nlobjSearchFilter('duedate', null, 'onorbefore', duedate);
                filters[4] = new nlobjSearchFilter('internalid', 'customermain', 'anyof', valEnt);*/


                //var search = nlapiCreateSearch('transaction', sfilters, columns);
                var search = nlapiLoadSearch(null, 'customsearch_without_group');
                search.addFilter(new nlobjSearchFilter('internalid', 'customermain', 'anyof', valEnt));
                search.addFilter(new nlobjSearchFilter('trandate', null, 'onorbefore', duedate));
                search.addFilter(new nlobjSearchFilter('mainline', null, 'is', 'T'));


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

                nlapiLogExecution('DEBUG', 's: ', JSON.stringify(s));


                if (s != null) {
                    for (var i = 0; i < s.length; i++) {
                        scriptcheck();
                        try {
                            //var rec = nlapiLoadRecord('invoice',s[i].id);
                            // rec.setFieldValue( 'custbody_batch', batch);
                            nlapiLogExecution('DEBUG', 'type: ' + s[i].getValue('recordtype'), 'id: ' + s[i].id);
                            nlapiSubmitField(s[i].getValue('recordtype'), s[i].id, 'custbody_batch', batch);
                            //nlapiSubmitRecord(rec, true,true);
                            //nlapiLogExecution('DEBUG', 'invoice saved', rec.id);

                            /* results.push({
                                 id: s[i].id,
                                 tranid: s[i].getValue('tranid')
                             });*/
                        } catch (e) {
                            continue;
                        }

                    }
                    //return results;
                }

                // nlapiLogExecution('DEBUG', 'entity: ' + valEnt + ' results', JSON.stringify(results));


            }
        }


    }
}

function paymentcreation(entity, batch_number, arr, amountcorrection, payment_account, method) {
    try {
        nlapiLogExecution('DEBUG', 'paymentcreation', 'START');
        nlapiLogExecution('DEBUG', 'entity : ' + entity + ' + arr: ', JSON.stringify(arr));

        var rec = nlapiCreateRecord('customerpayment', { recordmode: 'dynamic' });
        rec.setFieldValue('customer', entity);

        rec.setFieldValue('custbody_batch', batch_number);
        var linecount = rec.getLineItemCount('apply');
        nlapiLogExecution('DEBUG', 'linecount', linecount);
        /*if (arr.length > 0) {
            for (var fld in arr) {
                var val = arr[fld];
                var tranid = val["tranid"]

                for (var k = 1; k < linecount + 1; k++) {
                    var refnum = rec.getLineItemValue('apply', 'refnum', k);

                    if (refnum == tranid) {
                        rec.selectLineItem('apply', k);
                        rec.setCurrentLineItemValue("apply", "apply", 'T');
                        rec.commitLineItem("apply");

                        continue;

                    }

                }

            }
        }
        else {*/
        nlapiLogExecution('DEBUG', 'arr==null', amountcorrection);
        rec.setFieldValue('payment', amountcorrection);
        if (linecount < 2)
            rec.setFieldValue('autoapply', 'T');
        //}

        /*if (method == 'c')
            rec.setFieldValue('paymentoption', credit_card_id);//credit guard
        if (method == 'w')
            rec.setFieldValue('paymentoption', wire_id);//wire
            */

        rec.setFieldValue('undepfunds', 'F');
        rec.setFieldValue('account', payment_account);

        var recid = nlapiSubmitRecord(rec, true, true);
        nlapiLogExecution('DEBUG', 'billCreation recid', recid);

        return true;

    } catch (e) {
        nlapiLogExecution('ERROR', 'error - paymentcreation', e);
        return e
    }

}






function filecreation(batch, userid) {
    try {
        nlapiLogExecution('DEBUG', 'filecreation', 'batch: ' + batch + ' , userid: ' + userid);

        var rec = nlapiLoadRecord('subsidiary', 2);//Synel Mll Payway Ltd.



        var strFirst = ''
        var strRows = ''
        var strLast = ''




        var mosad = '59426700';
        var mosad_sender = '59426';
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

    nlapiLogExecution('DEBUG', 'xml', xml);

    var headers = {
        'Content-Type': "application/x-www-form-urlencoded"
    };

    var environment = context.getEnvironment();
    nlapiLogExecution('DEBUG', 'environment', environment);

    if (environment == 'SANDBOX') {
        var sUrl = 'https://cguat2.creditguard.co.il/xpo/Relay';

        var xmltosend = {
            'user': 'dangot',
            'password': 'dGN2@z31',
            'int_in': xml
        }
    }
    else {
        var sUrl = 'https://kupot1.creditguard.co.il/xpo/Relay';

        var xmltosend = {
            'user': '',
            'password': '',
            'int_in': xml
        }
    }

    //var xml1 = 'user:cgdemo password:C!kd2nc3a int_in:<ashrait><request><version>2000</version><language>HEB</language><dateTime>2021-03-17 10:33:27</dateTime><command>doDeal</command><requestId>1517472867-17050</requestId><doDeal><terminalNumber>0882810010</terminalNumber><cardId>4444333322221111</cardId><cardExpiration>0330</cardExpiration><cvv>123</cvv><total>100</total><transactionType>Debit</transactionType><creditType>RegularCredit</creditType><currency>ILS</currency><transactionCode>Phone</transactionCode><validation>AutoComm</validation><customerData /></doDeal></request></ashrait>';


    //var xmlfile = nlapiStringToXML(xml);
    var response = nlapiRequestURL(sUrl, xmltosend, headers);
    nlapiLogExecution('DEBUG', 'response', JSON.stringify(response));
    var mestr = 'userMessage';
    var usermessage = response.body.slice(response.body.indexOf(mestr) + mestr.length + 1, response.body.lastIndexOf(mestr) - 2);
    nlapiLogExecution('DEBUG', 'usermessage', usermessage);
    var xmlDataResponse = nlapiStringToXML(response.body);
    //nlapiLogExecution('DEBUG', 'xmlDataResponse', xmlDataResponse);
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