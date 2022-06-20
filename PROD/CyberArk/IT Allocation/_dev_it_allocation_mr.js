/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/log', 'N/url', 'N/runtime', 'N/email', 'N/render', 'N/format'],
    function (search, record, logger, url, runtime, email, render, format) {
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
                var jeRecordID = buildJournalEntry(ObjLine);       
                context.write('1', jeRecordID);
            } catch (e) {
                logger.error('error map', e);
            }
        }
        function buildJournalEntry(ObjLine) {
            TOTAL_AMT = Math.abs(Number(ObjLine.amount))
            TOTAL_COUNT = getTotal();
            logger.debug('TOTAL_AMT: ' + TOTAL_AMT, 'TOTAL_COUNT ' + TOTAL_COUNT);
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
        function addSublistLine(isDepLines, ObjLine) {
            currAmount = Number(ObjLine.amount);
            if (!isDepLines) {
                var field = 'credit';
                if (currAmount < 0) field = 'debit'
                logger.debug('field: ' + field, 'isDepLines false ' + isDepLines);
                jeRecord.selectNewLine({ sublistId: 'line' });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: ObjLine.account });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: field, value: TOTAL_AMT, });
                jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'department', value: GLOBAL_DEPARTMENT, });
                jeRecord.commitLine({ sublistId: 'line' });
            }
            else {
                var field = 'debit';
                if (currAmount < 0) field = 'credit'
                logger.debug('field: ' + field, 'isDepLines true ' + isDepLines);
                var departments = getAllDepartments();
                var lastDep = departments.length - 1
                for (var i = 0; i < departments.length; i++) {
                    if (i != lastDep) {
                        debit = calcDebit(ObjLine, departments[i])
                        totalDepAmt = totalDepAmt + debit
                    }
                    else {
                        debit = TOTAL_AMT - totalDepAmt
                    }
                    jeRecord.selectNewLine({ sublistId: 'line' });
                    jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: ObjLine.account });
                    jeRecord.setCurrentSublistValue({ sublistId: 'line', fieldId: field, value: debit });
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
            if (!isNullOrEmpty(TOTAL_AMT) && !isNullOrEmpty(TOTAL_COUNT) && !isNullOrEmpty(departmentsData.count))
                var amount = (TOTAL_AMT / TOTAL_COUNT * departmentsData.count).toFixed(2)

            return Number(amount);

        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function reduce(context) {
            var billList = context.values;
            logger.debug('billList' + billList.length, billList);

            var body = '<html>' +
                '<head>' +
                '<style>' +
                'table, th, td {' +
                'border: 2px solid black;' +
                'border-collapse: collapse;' +
                '}' +
                'td {' +
                'padding: 5px;' +
                'text-align: left;' +
                '}' +
                'th {' +
                'padding: 5px;' +
                'text-align: center;' +
                'background-color: #edeaea;' +
                'font-weight: bold ;' +
                '}' +
                '</style>' +
                '</head>' +
                "<div>" +
                "<p style='color: black; font-size:100%;'>Please find below Journal entries that were created from IT allocations:</p></div>";

            var successTbl = '';
            successTbl += "<table class='errtable' style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>Journal</th></tr>";
            for (var s in billList) {
                var tranid = search.lookupFields({
                    type: search.Type.JOURNAL_ENTRY,
                    id: billList[s],
                    columns: ['tranid']
                }).tranid;
                successTbl += "<tr><td>" + GetLink(tranid, billList[s], 'journalentry') + "</td></tr > ";
            }
            successTbl += "</table>"
            body += successTbl;
            email.send({
                author: runtime.getCurrentUser().id,
                recipients: runtime.getCurrentUser().id,
                subject: 'IT allocation sucsefully completed',
                body: body,
            });

        }
        function GetLink(name, id, type) {
            var output = url.resolveRecord({
                recordType: type,
                recordId: id,
                isEditMode: false
            });
            var link = "<a href='https://system.netsuite.com" + output + "'" + ' target="_blank">' + name + "</a>";
            return link;
        }


        return {
            getInputData: getInputData,
            map: map,
            reduce: reduce,           
        };
    });
