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
            logger.debug({ title: 'data ' + data.length, details: JSON.stringify(data)});
            return data;
        }
        function getRunData() {

            var searchObj = search.create({
                type: "item",
                filters:
                    [
                        ["custitem_purchase_price_orig_currency", "isnotempty", ""],
                        "AND",
                        ["custitem_purchase_price_currency", "noneof", "@NONE@"],
                    ],
                columns: [ 
                    "custitem_purchase_price_currency","custitem_purchase_price_orig_currency"
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
                        price: s[i].getValue('custitem_purchase_price_orig_currency'),
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
                    source: 'USD',
                    target: purchase_price_currency,
                    date: new Date()
                });
                var itemId = ObjLine.id;
                var itemType = ObjLine.type;
                var itemRec = record.load({
                    type: itemType,
                    id: itemId
                });
                var price = Number(ObjLine.price);
                var purchasePriceClc = (price/rate) //.toFixed(4) 
                itemRec.setValue('cost', purchasePriceClc);
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
