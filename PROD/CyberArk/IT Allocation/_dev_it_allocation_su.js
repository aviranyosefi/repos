/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/task", 'N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', 'N/url'],
    function (task, serverWidget, runtime, search, record, url) {

        function onRequest(context) {
            var request = context.request;
            var subsidiary = request.parameters.custpage_subsidiary
            var posting_date = request.parameters.custpage_trandate;
            var action_data = request.parameters.custpage_action;
            var start_date = request.parameters.custpage_start_date
            var end_date = request.parameters.custpage_end_date 
            if (isNullOrEmpty(posting_date)) posting_date = new Date();
            try {
                var form = serverWidget.createForm({ title: 'IT Allocation' });              
                if (request.parameters.custpage_next == '1') {
                    log.debug('POST', 'action_data: ' + action_data);  
                    var data = [];
                    var lineCount = request.getLineCount('sublist');                                
                        for (var i = 0; i < lineCount; i++) {
                            choose = request.getSublistValue('sublist', 'custpage_choose', i);
                            if (choose == 'T') {
                                if (action_data == 'create') {
                                    data.push({
                                        account: request.getSublistValue('sublist', 'custpage_account_id', i),
                                        amount: NTR(request.getSublistValue('sublist', 'custpage_total', i)),
                                        subsidiary: subsidiary,
                                        trandate: posting_date
                                    });
                                }
                                else {
                                    data.push(request.getSublistValue('sublist', 'custpage_account_id', i));
                                }                          
                            }
                        }
                    log.debug('JSON.stringify(data) ' + data.length, JSON.stringify(data));
                    if (action_data == 'create') {
                        var scriptTask = task.create({
                            taskType: task.TaskType.MAP_REDUCE,
                            scriptId: "customscript_dev_it_allocation_mr",
                            deploymentId: null,
                            params: {
                                'custscript_it_allocation_data': JSON.stringify(data)
                            }
                        });
                        scriptTask.submit();

                        var userObj = runtime.getCurrentUser();
                        var getUserMail = userObj.email
                        var html = "<span style='font-size:18px'>An email with the summary of results will be sent to : <b> " + getUserMail + "</b> once completed.<br></span>";
                        form.addField({
                            id: 'custpage_html',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'html',
                            container: null
                        }).defaultValue = html;
                    }
                    else { //action_data == 'delete'
                        deleteJE(subsidiary, start_date, end_date, data);                  
                        var suitletURL = getURL(subsidiary, start_date, end_date);
                        html = "<p style='font-size:20px'>The Journal transactions are currently being deleted.</p><br><br>Please click <a href='" + suitletURL+ "'  >here</a> to go back."
                        form.addField({
                            id: 'custpage_html',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'html',
                            container: null
                        }).defaultValue = html;

                    }                     
                }
                else {
                    log.debug('GET', 'GET');                   
                    form.addSubmitButton('Refresh');
                    var sub = form.addField({ id: 'custpage_subsidiary', type: serverWidget.FieldType.SELECT, label: 'Subsidiary', container: null, source: 'subsidiary' }).updateLayoutType({ layoutType: serverWidget.FieldLayoutType.MIDROW });
                    sub.isMandatory = true;
                    var startDate = form.addField({ id: 'custpage_start_date', type: serverWidget.FieldType.DATE, label: 'Start Date', container: null }).updateLayoutType({ layoutType: serverWidget.FieldLayoutType.MIDROW });
                    startDate.isMandatory = true;
                    var endDate = form.addField({ id: 'custpage_end_date', type: serverWidget.FieldType.DATE, label: 'End Date', container: null }).updateLayoutType({ layoutType: serverWidget.FieldLayoutType.MIDROW });
                    endDate.isMandatory = true;
                    var postingDate = form.addField({ id: 'custpage_trandate', type: serverWidget.FieldType.DATE, label: 'Posting Date', container: null }).updateLayoutType({ layoutType: serverWidget.FieldLayoutType.MIDROW });
                    postingDate.isMandatory = true;

                    var action = form.addField({ id: 'custpage_action', type: serverWidget.FieldType.SELECT, label: 'Action', container: null, source: null }).updateLayoutType({ layoutType: serverWidget.FieldLayoutType.MIDROW });
                    action.isMandatory = true;
                    action.addSelectOption({ value: '', text: '' });
                    action.addSelectOption({ value: 'create', text: 'Create' });
                    action.addSelectOption({ value: 'delete', text: 'Delete' });

                    sub.defaultValue = subsidiary;
                    startDate.defaultValue = start_date;
                    endDate.defaultValue = end_date;
                    postingDate.defaultValue = posting_date;
                    action.defaultValue = action_data;
                    if (!isNullOrEmpty(subsidiary) && !isNullOrEmpty(action_data)) {
                        var data = {
                            subsidiary: subsidiary,
                            start_date: start_date,
                            end_date: end_date
                        }
                        log.debug('data', data);
                        var results = loadData(data);
                        log.debug('results ' + results.length, JSON.stringify(results));
                        if (results.length > 0) {
                            form.clientScriptModulePath = 'SuiteScripts/CyberArk/Dev/_dev_it_allocation_cs.js';
                            form.addButton({ id: 'custpage_execute', label: 'execute', functionName: 'executeFun'});
                            var sublist = form.addSublist({ id: 'sublist', type: serverWidget.SublistType.LIST, label: 'Lines' });
                            sublist.addMarkAllButtons();
                            sublist.addField({ id: 'custpage_choose', type: serverWidget.FieldType.CHECKBOX, label: 'CHOOSE' })
                            sublist.addField({ id: 'custpage_account_number', type: serverWidget.FieldType.TEXT, label: 'account number' })
                            sublist.addField({ id: 'custpage_account_name', type: serverWidget.FieldType.TEXT, label: 'account' })
                            sublist.addField({ id: 'custpage_account_id', type: serverWidget.FieldType.TEXT, label: 'account id' }).updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN });
                            sublist.addField({ id: 'custpage_total', type: serverWidget.FieldType.TEXT, label: 'total' })
                            for (var i = 0; i < results.length; i++) {            
                                sublist.setSublistValue({ id: 'custpage_choose', line: i, value: 'T' })                         
                                sublist.setSublistValue({ id: 'custpage_account_number', line: i, value: results[i].number })
                                sublist.setSublistValue({ id: 'custpage_account_name', line: i, value: results[i].accountName})
                                sublist.setSublistValue({ id: 'custpage_account_id', line: i, value: results[i].accountId})
                                sublist.setSublistValue({ id: 'custpage_total', line: i , value: results[i].amt })
                            }
                            var next = form.addField({ id: 'custpage_next', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                            next.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                        }

                    }               
                }
                context.response.writePage(form);
            }
            catch (err) {
                context.response.write(err);
            }
        }
        //NR IT Allocation Amounts Aggr
        function loadData(data) {
            log.debug('data ' , JSON.stringify(data));
            var objSearch = search.load({ id: 'customsearch_it_allocation_amt' });
            var defaultFilters = objSearch.filters;
            defaultFilters.push(search.createFilter({ name: "subsidiary", operator: 'anyof', values: data.subsidiary }));
            defaultFilters.push(search.createFilter({ name: "startdate", join: 'accountingperiod', operator: 'onorafter', values: data.start_date }));
            defaultFilters.push(search.createFilter({ name: "enddate", join: 'accountingperiod', operator: 'onorbefore', values: data.end_date }));
            objSearch.filters = defaultFilters;
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
            //log.debug('s ' +s.length, JSON.stringify(s));
            for (var i = 0; i < s.length; i++) {
                var result = s[i];
                //log.debug('result ', result);
                var aggr = result.getValue(result.columns[0])              
                var account = getAccount(aggr);
                if (account.length > 0) {
                    var amt = result.getValue(result.columns[3])
                    res.push({
                        aggr: aggr,
                        amt: formatNumber(Number(amt)),
                        accountName: account[0],
                        accountId: account[1],
                        number: account[2],
                        subsidiary: data.subsidiary
                    })
                }
            }
            //log.debug('res ' + res.length, JSON.stringify(res));
            return res
        }
        function getAccount(aggr) {
            //log.debug('getAccount aggr ', aggr);
            var searchObj = search.create({
                type: "account",
                filters:
                    [
                        ["number", "startswith", aggr],
                        "AND",
                        ["custrecord_it_allocation_account", "is", 'T'],
                    ],
                columns: [
                    "name", "number"
                ]
            });
            var res = [];
            var resultset = searchObj.run();
            var s = [];
            var searchid = 0;
            do {
                var resultslice = resultset.getRange(searchid, searchid + 1000);
                for (var rs in resultslice) {
                    s.push(resultslice[rs]);
                    searchid++;
                }
            } while (resultslice != null && resultslice.length >= 1000);

            if (s != null && s.length > 0) {
                var name = s[0].getValue('name')
                var id = s[0].id;
                var number = s[0].getValue('number')
                //log.debug('number', number);
                res.push(name.toString())
                res.push(id.toString())
                res.push(number.toString())
                
            }
            //log.debug('getAccount res ' + res.length, JSON.stringify(res));
            return res
        }
        function formatNumber(num) {
            if (num != '' && num != undefined && num != null) {
                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }
            else return '0.00'


        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function NTR(number) {
            if (!isNullOrEmpty(number) && number != 'NaN%' && number != 'NaN') {
                var f = number.replace(new RegExp(",", "g"), "");
                f = Number(f)
                return f
            }
            else { return 0 }

        }
        function deleteJE(subsidiary, start_date, end_date, data) {
            var objSearch = search.create({
                type: "journalentry",
                filters:
                    [
                        ["type", "anyof", "Journal"],
                        "AND",
                        ["subsidiary", "anyof", subsidiary],
                        "AND",
                        ["custbody_created_from_it_alloc", "is", "T"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["account", "anyof", data],
                        "AND",
                        ["trandate", "within", start_date, end_date]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            label: "Internal ID"
                        }),
                    ]
            });
            var resultSet = objSearch.run();
            var s = [];
            var searchid = 0;
            do {
                var results = resultSet.getRange({ start: searchid, end: searchid + 1000 });
                for (var rs in results) {
                    s.push(results[rs]);
                    searchid++;
                }
            } while (results != null && results.length >= 1000);
            log.debug("journalentrySearchObj result count", s.length);
            for (var i = 0; i < s.length; i++) {
                var result = s[i];
                try {
                    var recId = result.getValue({
                        name: "internalid",
                        summary: "GROUP",
                        label: "Internal ID"
                    });
                    log.debug("recId", recId);
                    record.delete({
                        type: 'journalentry',
                        id: recId,
                    });
                } catch (e) {
                    log.error('error', e.message)
                }
            }
        }
        function getURL(subsidiary, start_date, end_date){
            var suitletURL = url.resolveScript({
                scriptId: 'customscript_dev_it_allocation_su',
                deploymentId: 'customdeploy_dev_it_allocation_su',
                returnExternalUrl: false
            });
            suitletURL += '&custpage_subsidiary=' + subsidiary
            suitletURL += '&custpage_start_date=' + start_date
            suitletURL += '&custpage_end_date=' + end_date
            return suitletURL;
        }
        return {
            onRequest: onRequest
        };
    });