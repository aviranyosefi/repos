/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 *
 */
define(['N/record', 'N/http', 'N/format', 'N/search', 'N/encode', 'N/runtime'],
    function (record, http, format, search, encode, runtime) {
        function afterSubmit(context) {

            var newRecord = context.newRecord;
            var prevRecord = context.oldRecord;
            if (prevRecord == null)
                prevRecord = newRecord;

            var jsontosend = {};


            log.debug('newRecord-subsidiary', newRecord.getValue('subsidiary'));
            log.debug('newRecord-custbody_ura_invoice_id', newRecord.getValue('custbody_ura_invoice_id'));
            log.debug('newRecord-custbody_ura_invoice_number', newRecord.getValue('custbody_ura_invoice_number'));
            log.debug('type',context.type);



            if ((newRecord.getValue('subsidiary') == '26') && (newRecord.getValue('custbody_ura_invoice_id') == '' && (newRecord.getValue('custbody_ura_invoice_number') != ''))) {//if(subsidiary == Gilat Uganda Ltd.) && URA INVOICE id ==""
                log.debug('Script', 'Run');
                try {

                    var invoicenumber = newRecord.getValue('custbody_ura_invoice_number');
                    jsontosend = '{"invoiceNo": ' + invoicenumber + '}';

                    var stringInput = jsontosend;
                    var base64EncodedString = encode.convert({
                        string: stringInput,
                        inputEncoding: encode.Encoding.UTF_8,
                        outputEncoding: encode.Encoding.BASE_64
                    });

                    log.debug('jsontosend', jsontosend);
                    log.debug('base64EncodedString', base64EncodedString);

                    var headerObj = { 'Content-Type': 'application/json;charset=UTF-8', 'Accept': '*/*' };
                    var method = http.Method.POST;

                    //*********************************************************************************************************


                    var content = base64EncodedString;
                    var requestTime = URA_Time();
                    log.debug('requestTime', requestTime);
                    var interfaceCode = 'T108';
                    var jsontest = "{'data': {'content': '" + content + "','signature': '','dataDescription': {'codeType': '0','encryptCode': '0','zipCode': '0'}},'globalInfo': {'appId': 'AP04','dataExchangeId': '1','deviceMAC': '1','deviceNo': '202002271756','longitude': '0','latitude':'0','interfaceCode':'" + interfaceCode + "','requestCode': 'TP','requestTime': '" + requestTime + "','responseCode': 'TA','taxpayerID': '1008972943','tin': '1008972943','userName': 'admin','version': '1.1.20191201','extendField': {'responseDateFormat':'dd/MM/yyyy','responseTimeFormat': 'dd/MM/yyyy HH:mm:ss'}},'returnStateInfo': {'returnCode': '','returnMessage': ''}}";
                    log.debug('jsontest POST', jsontest);

                    //**************************************************************************************************************
                    var environment = runtime.envType;

                    var url;
                    if (environment == 'SANDBOX')
                        url = 'http://81.199.137.238:9880/efristcs/ws/tcsapp/getInformation';
                    else
                        url = 'http://81.199.137.237:9880/efristcs/ws/tcsapp/getInformation';//prod

                    log.debug('environment and url', environment + ' & url : ' + url);

                    var response = http.request({
                        method: method,
                        url: url,
                        body: jsontest,
                        headers: headerObj
                    });
                    log.debug('response', response);
                    var body = JSON.parse(response.body);
                    log.debug('body POST', body);


                    var stringInput = body.data.content;
                    var utf8EncodedString = encode.convert({
                        string: stringInput,
                        inputEncoding: encode.Encoding.BASE_64,
                        outputEncoding: encode.Encoding.UTF_8
                    });

                    utf8EncodedString = JSON.parse(utf8EncodedString);
                    log.debug('utf8EncodedString', utf8EncodedString);
                    var returnedURAid = utf8EncodedString.basicInformation.invoiceId;

                    // var returnedURANumber = utf8EncodedString.basicInformation.invoiceNo;
                    // var returnedQRCode = utf8EncodedString.summary.qrCode;
                    // var returnURAVerificationCode = utf8EncodedString.basicInformation.antifakeCode;


                    log.debug('body returnedURAid', returnedURAid);

                    var rec = record.load({
                        type: 'invoice',
                        id: newRecord.id,
                    });
                    rec.setValue({ fieldId: 'custbody_ura_invoice_id', value: returnedURAid });
                    rec.save();


                } catch (e) {
                    log.error('Error e: ', e);
                    log.error('Error e.message: ', e.message);
                }
            }//if(subsidiary == Gilat Uganda Ltd.)
        }
        //*******************************************************************************URA_Time********************************************************************************

        function URA_Time() {
            var d = new Date();
            d.setHours(d.getHours() + 10)
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


        return {
            afterSubmit: afterSubmit
        };
    });

function Tofix_noround(num) {
    num = num.toString();
    var temp = num;
    if (num.indexOf('.') != 0 && num.substring(num.indexOf('.'), num.length).length > 2) {
        var temp = num.substring(0, num.indexOf('.') + 3);
        return parseFloat(temp);
    }
    return parseFloat(temp);
}



