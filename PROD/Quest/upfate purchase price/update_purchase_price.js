/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
var ErrorList = [];
var SuccessList = [];
define(['N/search', 'N/record', 'N/log', 'N/currency', 'N/runtime'],
    function (search, record, logger, currency, runtime) {
      
        function getInputData() {  
            var script = runtime.getCurrentScript();
            var itemId = script.getParameter({ name: 'custscript_item_id' });
            logger.debug('itemId', itemId);   
            var data = [];           
            var data = getRunData(itemId);     
            logger.debug({ title: 'data ' + data.length, details: JSON.stringify(data)});
            return data;
        }
        function getRunData(itemId) {

            var filters = []
            filters.push(search.createFilter({ name: 'custitem_purchase_price_orig_currency', operator: 'isnotempty', values: "" }))
            filters.push(search.createFilter({ name: 'custitem_purchase_price_currency', operator: 'noneof', values: "@NONE@" }))
            if (!isNullOrEmpty(itemId))
                filters.push(search.createFilter({ name: 'internalid', operator: 'anyof', values: itemId }))


            var myFilters = [['custitem_purchase_price_orig_currency', 'isnotempty', ""] ,  "AND"];
            myFilters.push(['custitem_purchase_price_currency', 'noneof', '@NONE@'])
            if (!isNullOrEmpty(itemId))
                myFilters.push( "AND",['internalid', 'anyof', itemId])
            var searchObj = search.create({
                type: "item",
                filters:
                    
                        myFilters                       
                    ,
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
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
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
