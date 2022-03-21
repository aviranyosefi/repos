/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
var ErrorList = [];
var SuccessList = [];
define(['N/search', 'N/record', 'N/log', 'N/currency'],
    function (search, record, logger, currency) {
      
        function getInputData() {        
            var data = [];           
            var data = getRunData();     
            logger.debug({ title: 'data ' + data.length, details: JSON.stringify(data) });
            return data;
        }
        function getRunData() {

            var searchObj = search.create({
                type: "item",
                filters:
                    [
                        ["cost", "isnotempty", ""],
                        "AND",
                        ["custitem_purchase_price_currency", "noneof", "@NONE@"],
                    ],
                columns: [ 
                    "custitem_purchase_price_currency","cost"
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

            if (s != null) {
                for (var i = 0; i < s.length; i++) {
                    res.push({
                        id: s[i].id,
                        type: s[i].recordType,
                        cost: s[i].getValue('cost'),
                        currency: s[i].getValue('custitem_purchase_price_currency'),
                    });
                }
            }
            return res
        }
        function map(context) {
            try {
                logger.debug('mapContext', context.value);
                var ObjLine = JSON.parse(context.value);
                var purchase_price_currency = ObjLine.currency;
                var rate = currency.exchangeRate({
                    source: purchase_price_currency,
                    target: 'USD',
                    date: new Date()
                });
                var itemId = ObjLine.id;
                var itemType = ObjLine.type;
                var itemRec = record.load({
                    type: itemType,
                    id: itemId
                });
                var cost = Number(ObjLine.cost);
                var purchasePriceClc = (rate * cost).toFixed(2) 
                itemRec.setValue('custitem_purchase_price_orig_currency', purchasePriceClc);
                itemRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                //logger.debug('rate', rate);
            } catch (e) {
                logger.debug('error map', e);
               
          
            }
        }
        return {
            getInputData: getInputData,
            map: map,
        };
    });
