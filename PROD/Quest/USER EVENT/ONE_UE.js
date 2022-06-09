/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/query', 'N/runtime', 'N/record', 'N/search'],
    function (query, runtime, record, search) {
        var GLOBAL_SUBSIDIARIY = 14;
        var GLOBAL_REASON_FOR_ADJUSTMENT = 9 // 'יצירת סריאלי ל IB'
        var GLOBAL_ACCOUNT =  219 //'50100 Cost of Goods Sold'
        var GLOBAL_LOCATION = 43//Dangot IB
        function beforeLoad(context) {
            var rec = context.newRecord;
            var recType = rec.type;
            if ((recType == 'salesorder' || recType == 'estimae') && context.type == 'edit') {
                var sublist = context.form.getSublist("item")
                var rate = sublist.getField({ id: 'rate' });
                rate.isDisabled = true
            }
        }
        function beforeSubmit(context) {
            try {
                if (context.type != context.UserEventType.DELETE) {
                    var rec = context.newRecord;
                    var recType = rec.type;
                    var recId = rec.id;
                    log.debug("recType " + recType, 'recId ' + recId)
                    if (recType == 'salesorder') {
                        var ismultishipto = rec.getValue('ismultishipto');
                        if (!ismultishipto) {
                            var end_customer = rec.getValue('custbody_end_customer');
                            if (!isNullOrEmpty(end_customer)) {
                                var lineCount = rec.getLineCount({ sublistId: 'item' });
                                for (var i = 0; i < lineCount; i++) {
                                    var item_display = rec.getSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'item_display',
                                        line: i,
                                    });
                                    if (item_display != 'End of Group') {
                                        rec.setSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol_end_customer',
                                            line: i,
                                            value: end_customer
                                        });

                                    }
                                }
                            }
                        }
                    }
                    else if (recType == 'customrecord_ib' && context.type == context.UserEventType.CREATE && runtime.executionContext === runtime.ContextType.USER_INTERFACE) { // todo create
                        var ib_item = rec.getValue('custrecord_ib_item');
                        var ib_serial_number = rec.getValue('custrecord_ib_serial_number');
                        if (!isNullOrEmpty(ib_item) && isNullOrEmpty(ib_serial_number)) {
                            var isserialitem = checkItem(ib_item)
                            log.debug("isserialitem", isserialitem)
                            if (isserialitem == 'T') {
                                var serial = rec.getValue('custrecord_ib_serial_number_s');
                                log.debug("serial", serial)
                                var serialId = createInventoryAdj(ib_item, serial);
                                log.debug("serialId", serialId)
                                rec.setValue('custrecord_ib_serial_number', serialId);
                            }                           
                        }
                    }
                }
            } catch (e) { }
        }
        function createInventoryAdj(item, serial ) {
            try { 
                log.debug("createInventoryAdj", "createInventoryAdj")
                invAdjRec = record.create({ type: 'inventoryadjustment', isDynamic: true });
                invAdjRec.setValue({ fieldId: 'subsidiary', value: GLOBAL_SUBSIDIARIY });
                invAdjRec.setValue({ fieldId: 'custbody_dangot_reason_for_adjustment', value: GLOBAL_REASON_FOR_ADJUSTMENT });
                invAdjRec.setValue({ fieldId: 'account', value: GLOBAL_ACCOUNT });

                addItem(invAdjRec, item, serial, 1)

                var id = invAdjRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                log.debug("Inventory Adjustment", id);
                if (id != -1) {
                    addNegativLine(id, item, serial)
                    var serialId = getSerialId(item, serial)
                    return serialId;
                }
            } catch (e) {
                log.debug("createInventoryAdj error", e)
            }
        }
        function addNegativLine(id , item , serial) {
            try {
                var invAdjRec = record.load({ type: 'inventoryadjustment', id: id, isDynamic: true, });
                addItem(invAdjRec, item, serial, -1)
                invAdjRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
            } catch (e) {
                log.debug("addNegativLine error", e)
            }
        }
        function addItem(invAdjRec , item , serial ,qty) {

            invAdjRec.selectNewLine({ sublistId: 'inventory' });
            invAdjRec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'item', value: item });
            invAdjRec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'location', value: GLOBAL_LOCATION });
            invAdjRec.setCurrentSublistValue({ sublistId: 'inventory', fieldId: 'adjustqtyby', value: qty });
            var subrec = invAdjRec.getCurrentSublistSubrecord({ sublistId: 'inventory', fieldId: 'inventorydetail' });

            subrec.selectNewLine({ sublistId: 'inventoryassignment' });
            subrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'receiptinventorynumber', value: serial });
            subrec.setCurrentSublistValue({ sublistId: 'inventoryassignment', fieldId: 'quantity', value: qty });
            subrec.commitLine({ sublistId: 'inventoryassignment' });

            invAdjRec.commitLine({ sublistId: 'inventory' });

        }
        function getSerialId(item , serial) {

            var s = search.create({
                type: "inventorydetail",
                filters:
                    [
                        ["item", "anyof", item],
                        "AND",
                        ["inventorynumber.inventorynumber", "is", serial]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            join: "inventoryNumber",
                            label: "Internal ID"
                        })
                    ]
            });
            var serialId;
            s.run().each(function (result) {
                serialId= result.getValue({
                    name: "internalid",
                    join: "inventoryNumber",
                    label: "Internal ID"
                });
                return true;
            });
            return serialId;
        }
        function checkItem(item) {
            isserialitem = false;
            var query_str = `SELECT isserialitem
                FROM Item
                WHERE Item.id=${item}`
            var query_res = query.runSuiteQL({ query: query_str }).asMappedResults()
            log.debug("query_res", JSON.stringify(query_res))
            if (query_res.length > 0) {
                isserialitem = query_res[0].isserialitem
            }
            return isserialitem;
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
        };
    });