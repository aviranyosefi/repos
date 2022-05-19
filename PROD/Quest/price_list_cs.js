/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/currentRecord','N/currency','N/record','N/query'],
    function (currentRecord,currency,record,query) {
        var rec;
        function pageInit(scriptContext) {
            rec = rec || currentRecord.get();
            try {
                debugger;
                if ((scriptContext.mode == 'create' || scriptContext.mode == 'copy')
                    && (rec.type == record.Type.VENDOR_BILL || rec.type == record.Type.ITEM_RECEIPT)) {
                    updateLines()           
                }                
            } catch (e) {
                log.error('pageInit error', e)
            }
        }
        function fieldChanged(scriptContext) {
            try {
                rec = rec || currentRecord.get(); 
                var name = scriptContext.fieldId;
                if (rec.type == record.Type.PURCHASE_ORDER) {                  
                    if (name == 'custcol_dangot_quotation_rate' || name == 'custcol_dangot_quotation_currency') {
                        var currencyLine = rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_currency' })
                        var price = rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_rate' })
                        var trandate = rec.getValue('trandate')
                        var currencyBody = rec.getValue('currency');
                        var exchangeRate = currency.exchangeRate({ source: currencyLine, target: currencyBody, date: trandate })
                        rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcoldangot_quotation_exchange_rate', value: exchangeRate, fireSlavingSync: true, ignoreFieldChange: true })
                        setRate(price, exchangeRate)
                    }
                }
                else if (name == 'trandate') {
                        updateLines()                    
                }
            } catch (e) {
                log.error('fieldChanged error', e)
            }           
        }          
        function postSourcing(scriptContext) {
             try{
                 rec = rec || currentRecord.get(); 
                 if (rec.type == record.Type.PURCHASE_ORDER) {
                     var name = scriptContext.fieldId;
                     var list = scriptContext.sublistId;
                     if (name == 'item') {
                         debugger;
                         var item = rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'item' });
                         if (!isNullOrEmpty(item)) {
                             var entity = rec.getValue('entity');
                             var trandate = rec.getValue('trandate')
                             var currencyBody = rec.getValue('currency');                             
                             if (!isNullOrEmpty(entity)) {
                                 var query_str = `SELECT                               
                                                Item.custitem_purchase_price_orig_currency as price_orig_currency,
                                                Item.custitem_purchase_price_currency as purchase_price_currency ,
                                                ItemVendor.purchaseprice,
                                            FROM Item
                                            LEFT OUTER JOIN ItemVendor ON(ItemVendor.item = Item.id and ItemVendor.vendor= ${entity})
                                            WHERE Item.id = ${item} `
                                 var query_res = query.runSuiteQL({ query: query_str }).asMappedResults()
                                 log.debug("query_res", JSON.stringify(query_res))
                                 if (query_res.length > 0) {
                                     var purchaseprice = query_res[0].purchaseprice
                                     var price_orig_currency = query_res[0].price_orig_currency
                                     var currencyLine = query_res[0].purchase_price_currency
                                     if (!isNullOrEmpty(purchaseprice)) {
                                         var price = purchaseprice
                                     }
                                     else if (!isNullOrEmpty(price_orig_currency)) {
                                         var price = price_orig_currency
                                     }
                                     
                                     rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_currency', value: currencyLine, fireSlavingSync: true, ignoreFieldChange: true })
                                     rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_rate', value: price, fireSlavingSync: true, ignoreFieldChange: true })
                                     var exchangeRate = currency.exchangeRate({ source: currencyLine, target: currencyBody, date: trandate })
                                     rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcoldangot_quotation_exchange_rate', value: exchangeRate, fireSlavingSync: true, ignoreFieldChange: true })
                                     setRate(price, exchangeRate)

                                 }
                             }
                         }
                     }
                 }
            }catch(e){
                log.debug("postSourcing error: ",e)
            }
        }
        function setRate(price, exchangeRate) {
            try {
                var rate = price * exchangeRate;
                rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate, fireSlavingSync: true, ignoreFieldChange: true })
                setAmount(rate)
            } catch (e) {
                log.error('setRate error', e)
            }

        }
        function setAmount(rate) {
            try {
                var qty = rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' });
                var amount = rate * qty;
                rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: amount, fireSlavingSync: true, ignoreFieldChange: true })
            } catch (e) {
                log.error('setAmount error', e)
            }

        }
        function updateLines() {
            try {
                var count = rec.getLineCount('item');
                for (var i = 0; i < count; i++) {
                    var trandate = rec.getValue('trandate');
                    var currencyBody = rec.getValue('currency');
                    var currencyLine = rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_currency', line: i })
                    var price = rec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_dangot_quotation_rate', line: i })
                    var exchangeRate = currency.exchangeRate({ source: currencyLine, target: currencyBody, date: trandate })             
                    rec.selectLine({ sublistId: 'item', line: i })
                    rec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcoldangot_quotation_exchange_rate', value: exchangeRate, fireSlavingSync: true, ignoreFieldChange: true })
                    setRate(price, exchangeRate)
                    rec.commitLine({sublistId: 'item' })
                    }
            } catch (e) {
                log.error('updateLines error', e)
            }
        }
        function isNullOrEmpty(val) {
         if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
             return true;
         }
         return false;
     }       
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            postSourcing: postSourcing,
    };
 });