/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord',  'N/search'],
    function (currentRecord, search) {
        function pageInit(context) {
            if (context.mode == 'create') {
                var rec = currentRecord.get();
                if (rec.type == 'inventoryitem') {
                    var locations = getRMALocations();
                    var count = rec.getLineCount('locations');
                    for (var i = 0; i < count; i++) {
                        var locationID = rec.getSublistValue({ sublistId: 'locations', fieldId: 'locations',line: i});
                        if (locations[locationID] != undefined) {
                           rec.setSublistValue({ sublistId: 'locations', fieldId: 'defaultreturncost', line: i, value:'0.00' });
                        }
                    }
                }
            }
        }
        function getRMALocations() {
            var results = [];
            var SearchObj = search.create({
                type: 'location',
                filters:
                    [
                        ["custrecord_location_classification", "anyof", 3]
                    ],
                columns:
                    [
                       "internalid",
                    ]
            });
            SearchObj.run().each(function (result) {
                results[result.id] = {
                    id: result.id
                }
                return true;
            });
            return results;
        }     
        return {
            pageInit: pageInit,
        };

    });
