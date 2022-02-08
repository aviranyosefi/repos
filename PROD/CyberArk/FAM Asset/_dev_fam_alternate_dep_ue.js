/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([ 'N/task'],
    function ( task) {
        function afterSubmit(context) {

            if (context.type != context.UserEventType.DELETE) {
                try { 
                    //var rec = context.newRecord;
                    //var assetID = rec.id
                    //var res = getData(assetID)
                    //if (res.length>0) { createDepreciation(assetID ,res) }

                    var scriptTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_dev_fam_alternate_depreciat',
                        deploymentId: null,
                    });
                    scriptTask.submit();
                   
                } catch (e) {
                    log.error(e.message);
                }
            }
        }
        function getData(assetID) {

            var objSearch = search.load({ id: 'customsearch_fam_alternate_dep' });
            var defaultFilters = objSearch.filters;
            defaultFilters.push(search.createFilter({ name: "internalid", operator: 'anyof', values: assetID }));
            objSearch.filters = defaultFilters;
            //addFilter = [];
            //addFilter.push("AND");
            //addFilter.push(['internalid', 'anyof', assetID]);
            //objSearch.filters.push(addFilter);
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

            if (s.length > 0) {
                res.push(s[0].getValue({ name: "type", join: 'CUSTRECORD_ASSETSOURCETRN', summary: "GROUP", label: "Type" }));
            }
            return res;
        }
        function createDepreciation(assetID , res) {
            try {
                var assetRec = record.load({ type: 'customrecord_ncfar_asset', id: assetID, });
                //log.debug('assetRec.assetRec: ', assetRec);
                var depRec = record.create({ type: 'customrecord_ncfar_altdepreciation', isDynamic: true, });
                //log.debug('depRec: ', depRec);


                depRec.setValue('custrecord_altdeprasset', assetID);

                depRec.setValue('custrecord_altdepr_accountingbook', 2);
                //log.debug('custrecord_altdepr_accountingbook: ', 'custrecord_altdepr_accountingbook');

                depRec.setValue('custrecord_altdepraltmethod', '10');
                //log.debug('custrecord_altdepraltmethod: ', 'custrecord_altdepraltmethod');

           
                //log.debug('custrecord_altdeprasset: ', 'custrecord_altdeprasset');


                depRec.setValue('custrecord_altdepr_isposting', true);
                //log.debug('custrecord_altdepr_isposting: ', 'custrecord_altdepr_isposting');

                depRec.setValue('custrecord_altdepr_assettype', assetRec.getValue('custrecord_assettype'));
                //log.debug('custrecord_altdepr_assettype: ', 'custrecord_altdepr_assettype');

                depRec.setValue('custrecord_altdeprmethod', '3');
                //log.debug('custrecord_altdeprmethod: ', 'custrecord_altdeprmethod');

                //log.debug('custrecord_altdeprmethod: ', 'custrecord_altdeprmethod');
                depRec.setValue('custrecord_altdepr_subsidiary', assetRec.getValue('custrecord_assetsubsidiary'));
                depRec.setValue('custrecord_altdeprstartdeprdate', assetRec.getValue('custrecord_assetdeprstartdate'));
                depRec.setValue('custrecord_altdeprlifetime', assetRec.getValue('custrecord_assetlifetime'));
                depRec.setValue('custrecord_altdeprrv', '0.00');
                depRec.setValue('custrecord_altdeprrv_perc', '0.00');
                var cost = getCost(res[0], assetRec)
                depRec.setValue('custrecord_altdepr_originalcost', cost);
                depRec.setValue('custrecord_altdepr_currentcost', cost);
                depRec.setValue('custrecord_altdeprnbv', cost);
                
                depRec.setValue('custrecord_altdeprcd', '0.00');
                

                depRec.setValue('custrecord_altdepr_assetaccount', assetRec.getValue('custrecord_assetmainacc'));
                depRec.setValue('custrecord_altdepr_depraccount', assetRec.getValue('custrecord_assetdepracc'));
                depRec.setValue('custrecord_altdepr_chargeaccount', assetRec.getValue('custrecord_assetdeprchargeacc'));
                depRec.setValue('custrecord_altdepr_writeoffaccount', assetRec.getValue('custrecord_assetwriteoffacc'));
                depRec.setValue('custrecord_altdepr_writedownaccount', assetRec.getValue('custrecord_assetwritedownacc'));
                depRec.setValue('custrecord_altdepr_disposalaccount', assetRec.getValue('custrecord_assetdisposalacc'));

                var depRecID = depRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                log.debug('depRecID: ', depRecID);
                
        }catch (e) {
                log.debug('error createDepreciation ', e.message);
        }

        }
        function getCost(parent_trn, assetRec) {
            //log.debug('parent_trn', parent_trn);
            var type = getType(parent_trn);
            log.debug('type', type);
            var typeRec = record.load({ type: type, id: assetRec.getValue('custrecord_assetsourcetrn'), });
            var exchangerate = typeRec.getSublistValue({
                sublistId: 'accountingbookdetail',
                fieldId: 'exchangerate',
                line: 0
            })
            if (typeRec.getValue('currency') != '1' && type == 'vendorbill') {
                var line = assetRec.getValue('custrecord_assetsourcetrnline');
                log.debug('line', line);
                var lineCount = typeRec.getLineCount({ sublistId: 'expense' });
                log.debug('lineCount', lineCount);
                if (lineCount > 0) { var sublistName = 'expense' }
                else { var sublistName = 'item' }
                log.debug('sublistName', sublistName);
                var lineNumber = typeRec.findSublistLineWithValue({
                    sublistId: sublistName,
                    fieldId: 'line',
                    value: line
                });
                log.debug('lineNumber', lineNumber);
                if (lineNumber != -1) {
                    var amount = typeRec.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'amount',
                        line: lineNumber
                    });
                    log.debug('amount', amount);
                    var cost = exchangerate * amount
                }
            }
            else {
                var cost = exchangerate * assetRec.getValue('custrecord_assetcurrentcost')
            }

            log.debug('cost', cost);
            return cost;
        }
        function getType(parent_trn) {
            if (parent_trn == 'Journal') {
                return 'journalentry'
            }
            else if (parent_trn == 'VendBill') {
                return 'vendorbill'
            }
        }
        return {
            afterSubmit: afterSubmit
        };
    });



