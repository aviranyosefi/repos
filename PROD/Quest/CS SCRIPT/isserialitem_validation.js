/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/search'],
    function (search) {
        function fieldChanged(scriptContext) {
            var rec = scriptContext.currentRecord;
            var name = scriptContext.fieldId;
            if (name == 'custrecord_issued_item') {
                debugger;
                var isserialitem = false;
                var item = rec.getValue({ fieldId: 'custrecord_issued_item' });
                if (!isNullOrEmpty(item)) {
                    var fieldLookUp = search.lookupFields({ type: 'item', id: item, columns: ['isserialitem'] });
                    isserialitem = fieldLookUp.isserialitem;
                }
                rec.setValue('custrecord_sp_is_serialized', isserialitem);
            }
            else if (name == 'custevent_replacing_item') {
                var isserialitem = false;
                var item = rec.getValue({ fieldId: 'custevent_replacing_item' });
                if (!isNullOrEmpty(item)) {
                    var fieldLookUp = search.lookupFields({ type: 'item', id: item, columns: ['isserialitem'] });
                    isserialitem = fieldLookUp.isserialitem;
                }
                rec.setValue('custevent_is_serialized', isserialitem);
            }
            if (name == 'custrecord_sp_serial_number' || name == 'custrecord_issued_item' ) {
                var item = rec.getValue({ fieldId: 'custrecord_issued_item' });
                var serial = rec.getValue({ fieldId: 'custrecord_sp_serial_number' });
                var location = rec.getValue({ fieldId: 'custrecord_sp_location' });
                if (!isNullOrEmpty(item) && !isNullOrEmpty(location)) {
                    var len = searchLoad(item, serial, location);
                    val = false;
                    if (len == 0) {
                        val = true;
                    }
                    rec.setValue({ fieldId: 'custrecord_sp_incorrect_reporting', value: val });
                }

            }
        }
        function searchLoad(item, serial, location) {
            debugger;
            var objSearch = search.load({
                id: 'customsearch_dangot_inventory_balance',
                type: 'inventorybalance'

            });
            var defaultFilters = objSearch.filters;
            defaultFilters.push(search.createFilter({ name: "item", operator: 'anyof', values: item }));
            if(!isNullOrEmpty(serial)){
                defaultFilters.push(search.createFilter({ name: "inventorynumber", operator: 'anyof', values: serial }));
            }        
            defaultFilters.push(search.createFilter({ name: "location", operator: 'anyof', values: location }));
            objSearch.filters = defaultFilters;
            var resultset = objSearch.run();
            var s = [];
            var searchid = 0;
            do {
                var resultslice = resultset.getRange(searchid, searchid + 1000);
                for (var rs in resultslice) {
                    s.push(resultslice[rs]);
                    searchid++;
                }
            } while (resultslice != null && resultslice.length >= 1000);

            return s.length
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            fieldChanged: fieldChanged,
        };
    });