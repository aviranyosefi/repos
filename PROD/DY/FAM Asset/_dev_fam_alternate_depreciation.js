4/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/runtime', 'N/search', 'N/email', 'N/task'],
    function (record, runtime, search, email, task) {

        var errorsList = [];
        var sendMailFlag = false;

        function getInputData(inputContext) {
            try {
                var script = runtime.getCurrentScript();
                var assetID = script.getParameter({ name: 'custscript_fam_id' });
                log.debug('assetID', assetID)
                var res = getData(assetID);
               
                log.debug({
                    title: 'res:',
                    details: JSON.stringify(res)
                })
                return res;
            } catch (e) {
                log.debug('error :', e.message);

            }

        }
        //FAM Asset Search AY
        // FAM Asset Search (FOR SCRIPT)
        function getData(assetID) {

            var objSearch = search.load({ id: 'customsearch_fam_alternate_dep' });
            if (!isNullOrEmpty(assetID)) {
                var defaultFilters = objSearch.filters;
                defaultFilters.push(search.createFilter({ name: "internalid", operator: 'anyof', values: assetID }));
                objSearch.filters = defaultFilters;
            }

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

            if (s != null) {
                for (var i = 0; i < s.length; i++) {
                    var result = s[i];
                    res.push({
                        id: result.getValue({ name: "internalid", summary: "GROUP", label: "Internal ID" }),
                        parent_trn: result.getValue({ name: "type", join: 'CUSTRECORD_ASSETSOURCETRN', summary: "GROUP", label: "Type" }),
                    })
                }
                return res;
            }
        }

        function map(mapContext) {
            try {
                log.debug('mapContext', mapContext.value);
                var ObjLine = JSON.parse(mapContext.value)
                //log.debug('serialObj.invNumberId: ', serialObj);
                var assetID = ObjLine.id
                var assetRec = record.load({ type: 'customrecord_ncfar_asset', id: assetID, });
                //log.debug('assetRec.assetRec: ', assetRec);
                var depRec = record.create({ type: 'customrecord_ncfar_altdepreciation', isDynamic: true, });
                //log.debug('depRec: ', depRec);


                depRec.setValue('custrecord_altdepr_accountingbook', 2);
                //log.debug('custrecord_altdepr_accountingbook: ', 'custrecord_altdepr_accountingbook');

                depRec.setValue('custrecord_altdepraltmethod', '10');
                //log.debug('custrecord_altdepraltmethod: ', 'custrecord_altdepraltmethod');

                depRec.setValue('custrecord_altdeprasset', assetID);
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
                var cost = getCost(ObjLine.parent_trn, assetRec)
                depRec.setValue('custrecord_altdepr_originalcost', cost);

                depRec.setValue('custrecord_altdepr_assetaccount', assetRec.getValue('custrecord_assetmainacc'));
                depRec.setValue('custrecord_altdepr_depraccount', assetRec.getValue('custrecord_assetdepracc'));
                depRec.setValue('custrecord_altdepr_chargeaccount', assetRec.getValue('custrecord_assetdeprchargeacc'));
                depRec.setValue('custrecord_altdepr_writeoffaccount', assetRec.getValue('custrecord_assetwriteoffacc'));
                depRec.setValue('custrecord_altdepr_writedownaccount', assetRec.getValue('custrecord_assetwritedownacc'));
                depRec.setValue('custrecord_altdepr_disposalaccount', assetRec.getValue('custrecord_assetdisposalacc'));
                if (!isNullOrEmpty(cost)) {
                    var depRecID = depRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                    log.debug('depRecID: ', depRecID);
                }
              
               
                //11365.20
            } catch (e) {
                log.debug('error ' + id, e.message);
            }

            return mapContext.value;
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
                    var quantity = typeRec.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'quantity',
                        line: lineNumber
                    });
                    log.debug('sublistName amount ' + amount, 'quantity: ' + quantity + ', exchangerate: ' + exchangerate );
                }
                else {
                    var secondSublistName = secondSublist(sublistName);
                    var lineNumber = typeRec.findSublistLineWithValue({
                        sublistId: secondSublistName,
                        fieldId: 'line',
                        value: line
                    });
                    var amount = typeRec.getSublistValue({
                        sublistId: secondSublistName,
                        fieldId: 'amount',
                        line: lineNumber
                    });
                    var quantity = typeRec.getSublistValue({
                        sublistId: secondSublistName,
                        fieldId: 'quantity',
                        line: lineNumber
                    });
                    log.debug('secondSublistName: ' + secondSublistName, 'amount:' + amount  + ', quantity: ' + quantity + ', exchangerate: ' + exchangerate);                   
                }
                var ncfar_quantity = assetRec.getValue('custrecord_ncfar_quantity')
                if (isNullOrEmpty(ncfar_quantity)) { ncfar_quantity = 1 }
                if (isNullOrEmpty(quantity)) { quantity = 1 }               
                var cost = (exchangerate * amount * ncfar_quantity) / quantity
            }
            else {
                var cost = exchangerate * assetRec.getValue('custrecord_assetcurrentcost')
            }

            log.debug('cost', cost);
            return cost.toFixed(2);
        }
        function getType(parent_trn) {
            if (parent_trn == 'Journal') {
                return 'journalentry'
            }
            else if (parent_trn == 'VendBill') {
                return 'vendorbill'
            }
        }
        function secondSublist(sublistName) {
            if (sublistName == 'expense') {
                return 'item'
            }
            return 'expense'
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            getInputData: getInputData,
            map: map,
            //reduce: reduce,
            //summarize: summarize
        }

    });
