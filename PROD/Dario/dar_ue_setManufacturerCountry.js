/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/format/i18n'],
    function (record, search, format) {

        function beforeSubmit(context) {
            if (context.type !== context.UserEventType.DELETE) {

                var rec = context.newRecord;
                log.debug('rec:', rec);
                //var isChanged = false;

                var lineCount = rec.getLineCount('item');
                for (var lineIndex = 0; lineIndex < lineCount; lineIndex++) {
                    var itemID = rec.getSublistValue('item', 'item', lineIndex);
                    //log.debug('itemID :', itemID);

                    //var getcountryOfManufactureIdId = lookupFields(search.Type.LOT_NUMBERED_ASSEMBLY_ITEM, itemID, 'countryofmanufacture');
                    //log.debug('getcountryOfManufactureIdId :', getcountryOfManufactureIdId);


                    var countryData = search.lookupFields({type: search.Type.ITEM, id: itemID, columns: 'countryofmanufacture'});
                    log.debug('countryData :', countryData);

                    var formatCountery = format.countryData;
                    log.debug('formatCountery :', formatCountery);

                    //var countryOfManufactureIdValue = newIventoryDetails.getValue('countryofmanufacture');
                    //log.debug('countryOfManufactureIdValue:', countryOfManufactureIdValue);

                    //var countryData = newIventoryDetails.getText('countryofmanufacture');
                    //log.debug('countryOfManufactureIdText:', countryOfManufactureIdText);
                    //var countryOfManufactureIdText = '';
                    //if (!isNullOrEmpty(countryOfManufactureIdText)) {
                    //    rec.setSublistText('item', 'custcol_manufacturer_country', lineIndex, countryOfManufactureIdText);

                        //rec.setSublistValue('item', 'custcol_manufacturer_country', lineIndex, countryOfManufactureIdText);
                        //isChanged = true;
                    //}

                    var countryOfManufactureIdValue = rec.getSublistValue('item', 'countryofmanufacture', lineIndex);
                    log.debug('countryOfManufactureIdValue:', countryOfManufactureIdValue);

                    //var counteryData = getCounteryManufactureVal(countryOfManufactureIdValue);
                    //log.debug('counteryData:', counteryData);

                    //var countryOfManufactureIdText = rec.getSublistText('item', 'countryofmanufacture', lineIndex);
                    //log.debug('countryOfManufactureIdText:', countryOfManufactureIdText);

                    if (!isNullOrEmpty(counteryData)) {
                        //rec.setSublistText('item', 'custcol_manufacturer_country', lineIndex, countryOfManufactureIdText);

                        rec.setSublistValue('item', 'custcol_manufacturer_country', lineIndex, counteryData);
                        //isChanged = true;
                    }
                }

                //if (isChanged) {
                //    try {
                //        var id = rec.save();
                //        log.debug('id:', id);
                //    } catch (e) {
                //        log.error(e.name);
                //    }
                //}
            }
        }

        function getCounteryManufactureVal(id) {
            log.debug('id:', id);

            var SearchObj = search.create({
                type: 'country',
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        "name",
                    ]
            });
            var counteryName = '';
            //var res = [];
            SearchObj.run().each(function (result) {
                
                counteryName = result.getValue({ name: "name" })
                
                return true;
            });
                return counteryName;
        }

        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }

        return {
            beforeSubmit: beforeSubmit
        };
    });

