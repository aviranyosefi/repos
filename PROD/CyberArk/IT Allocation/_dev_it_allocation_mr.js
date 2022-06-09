/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/log', 'N/error', 'N/runtime', 'N/file', 'N/email', 'N/render', 'N/format'],
    function (search, record, logger, error, runtime, file, email, render, format) {
        var GLOBAL_DEPARTMENT = 24;
        var TOTAL_AMT;
        var totalDepAmt = 0;
        var TOTAL_COUNT;
        function getInputData() {
            var script = runtime.getCurrentScript();
            var it_allocation_data = script.getParameter({ name: 'custscript_it_allocation_data' });
            logger.debug('it_allocation_data', it_allocation_data);
            var data = JSON.parse(it_allocation_data);
            return data;
        }
        function map(context) {
            try {
                totalDepAmt = 0;
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value);
                var jeRecordID = buildJournalEntry(ObjLine)
                context.write('1', jeRecordID);
            } catch (e) {
                logger.error('error map', e);
            }
        }
        function buildJournalEntry(ObjLine) {
            TOTAL_AMT = Math.abs(Number(ObjLine.amount))
            TOTAL_COUNT = getTotal();
            logger.debug('TOTAL_AMT: ' + TOTAL_AMT, 'TOTAL_COUNT ' + TOTAL_COUNT );
            jeRecord = record.create({ type: record.Type.JOURNAL_ENTRY, isDynamic: true });
            jeRecord.setValue({ fieldId: 'subsidiary', value: ObjLine.subsidiary });
            jeRecord.setValue({ fieldId: 'trandate', value: StringToDate(ObjLine.trandate) });
            jeRecord.setValue({ fieldId: 'custbody_created_from_it_alloc', value: true });
            addSublistLine(false, ObjLine)
            addSublistLine(true, ObjLine);
            var jeRecordID = jeRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
            logger.debug('jeRecord id: ', jeRecordID);
            return jeRecordID
        }
        function addSublistLine(isDebit, ObjLine) {       
            if (isDebit) {
                jeRecord.selectNewLine({ sublistId: 'line' });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: ObjLine.account });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'credit', value: ObjLine.amount, });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'department', value: GLOBAL_DEPARTMENT, });
                jeRecord.commitLine({ sublistId: 'line' });
            }
            else {
                var departments = getAllDepartments();
                var lastDep = departments.length - 1
                for (var i = 0; i < departments.length; i++) {
                    if (i != lastDep) {
                        debit = calcDebit(ObjLine, departments[i])
                        totalDepAmt = totalDepAmt + debit
                    }
                    else {      
                        debit= TOTAL_AMT - totalDepAmt        
                    }
                    jeRecord.selectNewLine({ sublistId: 'line' });
                    jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: ObjLine.account });
                    jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'debit', value: debit });
                    jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'department', value: departments[i].dep, });
                    jeRecord.commitLine({ sublistId: 'line' });
                }
            }                   
        }
        function StringToDate(date) {

            var date = format.parse({
                value: date,
                type: format.Type.DATE
            });

            return date

        }
        //NR IT Allocation weights
        function getAllDepartments() {

            var objSearch = search.load({ id: 'customsearch_it_allocation_weights' });
            var resultSet = objSearch.run();
            var s = [];
            var searchid = 0;
            var res = [];
            do {
                var results = resultSet.getRange({ start: searchid, end: searchid + 1000 });
                for (var rs in results) {
                    s.push(results[rs]);
                    searchid++;
                }
            } while (results != null && results.length >= 1000);

            for (var i = 0; i < s.length; i++) {
                var result = s[i];       
                res.push({
                    dep: result.getValue(result.columns[0]),
                    count: result.getValue(result.columns[1]),
                })            
            }
            logger.debug({ title: 'getAllDepartments ' + res.length, details: JSON.stringify(res) });
            return res

        }
        //NR IT Allocation weights Total
        function getTotal() {
            var objSearch = search.load({ id: 'customsearch_it_allocation_count' });
            var resultSet = objSearch.run();
            var s = [];
            var searchid = 0;
            var res = '';

            do {
                var results = resultSet.getRange({ start: searchid, end: searchid + 1000 });
                for (var rs in results) {
                    s.push(results[rs]);
                    searchid++;
                }
            } while (results != null && results.length >= 1000);
            if (s != null && s.length > 0) {
                var result = s[0];
                res = result.getValue(result.columns[0])           
            }
            return res;
        }
        function calcDebit(ObjLine, departmentsData) {
            var amount = 1;
            if (!isNullOrEmpty(ObjLine.amount) && !isNullOrEmpty(TOTAL_COUNT) && !isNullOrEmpty(departmentsData.count))
                var amount = (ObjLine.amount / TOTAL_COUNT * departmentsData.count).toFixed(2)

            return Number(amount);

        }    
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function reduce(context) {
            //logger.debug('context', context);
            var key = context.key;
            //logger.debug('key', key);
            var billList = context.values;
            logger.debug('billList' + billList.length, billList);

            email.send({
                author: runtime.getCurrentUser().id,
                recipients: runtime.getCurrentUser().id,
                subject: 'IT Allocation',
                body: 'JOURNAL IDS LIST: ' +JSON.stringify(billList),
            });

        }
        function summarize(context) {
            try {
                //var errArr = getDodayErrors()
                //logger.debug('errorsList ' + errArr.length, JSON.stringify(errArr))
                //if (errArr.length > 0) {
                //    //var htmlbBody = BuildHtml();
                //    //failTbl = htmlbBody
                //    var failTbl = ' <p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
                //    failTbl += "<table class='errtable' style = \"width: 100 %;\" >";
                //    // for th
                //    failTbl += "<tr><th class='errtable' >Vendor</th><th  class='errtable'>Bill#</th><th  class='errtable'>Summary File</th><th  class='errtable'>Line</th><th  class='errtable'>Error</th></tr>";
                //    for (var s in errArr) {
                //        failTbl += "<tr><td class='errtable'>" + errArr[s].vendor + "</td><td  class='errtable'>" + errArr[s].tranid + "</td><td class='errtable'>" + errArr[s].summary_file + "</td><td class='errtable'>" + errArr[s].line + "</td><td class='errtable'>" + errArr[s].error + "</td></tr > ";
                //    }
                //    failTbl += "</table>"

                //    var mergeResult = render.mergeEmail({
                //        templateId: GLOBAL_ERRORS_EMAIL_TEMPLATE,
                //        entity: {
                //            type: 'employee',
                //            id: GLOBAL_ERROR_RECIVER
                //        },
                //        recipient: null,
                //        supportCaseId: null,
                //        transactionId: null,
                //        customRecord: null
                //    });
                //    var emailSubject = mergeResult.subject;
                //    var emailBody = mergeResult.body;
                //    emailBody = emailBody.replace('//failTbl//', failTbl);
                //    email.send({
                //        author: GLOBAL_ERROR_RECIVER,
                //        recipients: GLOBAL_ERROR_RECIVER,
                //        subject: emailSubject,
                //        body: emailBody,
                //        relatedRecords: null
                //    });
                //}
            } catch (e) {
                logger.error('error summary', e);
            }
        }
   

        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,
            summarize: summarize

        };
    });
