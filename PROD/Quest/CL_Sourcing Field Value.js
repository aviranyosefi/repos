/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

 define(['N/search','N/currency','N/ui/dialog','N/record','N/query'],
 function ( search,currency,ui,record,query) {
     var exports = {};
     function fieldChanged(scriptContext) {
         debugger;
         var rec = scriptContext.currentRecord;
         var name = scriptContext.fieldId;
         var list = scriptContext.sublistId;
         //log.debug('Field Change',scriptContext)
         if (list == 'item' && name == 'custcol_dangot_original_item'){
             try{
                 var itemID = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_original_item'});
                 var Custid = rec.getValue('entity');
                 var Tran_Date = rec.getValue('trandate')
                     var Price_Level = rec.getValue('custbody_dangot_price_list')
                     var Tran_currency = rec.getValue('currency');
                     var Conversion_Rate = 1
                     var itemqty = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'quantity'});
                     if (isNullOrEmpty(Price_Level)){
                         Price_Level = '1'
                     }
                     if(!isNullOrEmpty(itemID) && !isNullOrEmpty(Custid)){
                         /*
                         var Pricelist_cust = search.create({
                             type: 'customrecord_customer_price_list',
                             filters: [['custrecord_cp_item', 'anyof', itemID],'AND',['custrecord_cp_customer', 'anyof', Custid]],
                             })
                         var Pricelist_cust_Result = Pricelist_cust.run().getRange({start: 0,end: 1});
                         var Custprice = Pricelist_cust_Result.length
                         if (Custprice == 1){
                             var Rec_PL_ID = Pricelist_cust_Result[0].id
                             var PL_Rec = record.load({
                                 type: 'customrecord_customer_price_list',
                                 id: Rec_PL_ID,
                                 isDynamic: false
                                 })
                             var PL_Original_Rate = PL_Rec.getValue('custrecord_cp_rate');
                             var PL_Price_Currency = PL_Rec.getValue('custrecord_cp_currency');
                             var PL_Item_Type = PL_Rec.getValue('custrecord_cp_item_type');
                             Price_Level = '9' // Customer Price Level 
                         }
                         else{
                             var Pricelist = search.create({
                                 type: 'customrecord_price_list',
                                 filters: [['custrecord_price_item', 'anyof', itemID],'AND',['custrecord_price_price_level', 'anyof', Price_Level]],
                                 })
                             var Pricelist_Result = Pricelist.run().getRange({start: 0,end: 1});
                             var Levelprice = Pricelist_Result.length
                             if (Levelprice == 1){
                                 var Rec_PL_ID = Pricelist_Result[0].id
                                 var PL_Rec = record.load({
                                 type: 'customrecord_price_list',
                                 id: Rec_PL_ID,
                                 isDynamic: false
                             })
                             var PL_Original_Rate = PL_Rec.getValue('custrecord_price_rate');
                             var PL_Price_Currency = PL_Rec.getValue('custrecord_price_currency');
                             var PL_Item_Type = PL_Rec.getValue('custrecord_price_item_type');
                             }
                         }
                     }
                     */
                     var statment = `select
                                    itemtype,
                                    pl.*
                                    from item as i
                                    left join ( 
                                        select
                                            c.custrecord_cp_item as item ,
                                            'customer' as  type,
                                            c.custrecord_cp_currency as currency,
                                            c.custrecord_cp_rate as rate,
                                            c.custrecord_cp_recurring_rate as recurring_rate,
                                            c.custrecord_cp_billing_cycle as billing_cycle,
                                            c.custrecord_cp_charging_type as charge_type,
                                            c.custrecord_cp_recurring_rate_2 as recurring_rate_2,
                                            c.custrecord_cp_billing_cycle_2 as billing_cycle_2,
                                            c.custrecord_cp_charging_type_2 as charge_type_2
                                        from customrecord_customer_price_list as c 
                                        where c.custrecord_cp_customer = ${Custid}
                                            UNION ALL
                                        select
                                            p.custrecord_price_item as item,
                                            'price' as type,
                                            p.custrecord_price_currency as currency,
                                            p.custrecord_price_rate as rate,
                                            p.custrecord_price_recurring_rate as recurring_rate,
                                            p.custrecord_price_billing_cycle as billing_cycle,
                                            p.custrecord_price_charging_type as charge_type,
                                            p.custrecord_price_recurring_rate_2 as recurring_rate_2,
                                            p.custrecord_price_billing_cycle_2 as billing_cycle_2,
                                            p.custrecord_price_charging_type_2 as charge_type_2
                                        from customrecord_price_list as p 
                                            where p.custrecord_price_price_level = ${Price_Level}
                                         ) as pl on pl.item = i.id
                                    where i.id = ${itemID} 
                                    fetch first 1 rows only
                    `
                    
                    var pl_query = query.runSuiteQL({query:statment}).asMappedResults()
                     }  
                     if (pl_query[0].itemtype == 'NonInvtPart'){
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_price_list_item',value: itemID})
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'item',value: itemID});
                     }
                     else{
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_price_list_item',value: '22765'})
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'item',value: '22765'})
                     }
                      
                     if (!isNullOrEmpty(pl_query[0].item)){
                         
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'price',value: '-1'});
                         if (!isNullOrEmpty(pl_query[0].rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price',value: pl_query[0].rate })}; 
                         if (!isNullOrEmpty(pl_query[0].currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency',value: pl_query[0].currency })}; 
                         if (Tran_currency != PL_Price_Currency){
                             var Conversion_Rate = currency.exchangeRate({source: pl_query[0].currency, target: Tran_currency,date:Tran_Date})
                         }
                         var ratecalc = pl_query[0].rate * Conversion_Rate
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: ratecalc.toFixed(2) ,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: pl_query[0].rate * Conversion_Rate * itemqty,ignoreFieldChange:true});
                         if (!isNullOrEmpty(pl_query[0].currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: pl_query[0].currency })};
                         if (!isNullOrEmpty(pl_query[0].rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: pl_query[0].rate })};  
                        
                        
                     }
                     else {
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'price',value: '-1'});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: 0 ,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: 0 ,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: '' ,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: 0 ,ignoreFieldChange:true});
                         
                     }
                     
                     rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_price_level',value: Price_Level,ignoreFieldChange:true});
                     rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_conversion_rate',value: Conversion_Rate });
                         
                  



         }catch(e){log.debug('Field Change Error',e)}
         }
         
     }
     function postSourcing(scriptContext) {
         debugger;
         //log.debug('start',scriptContext)
         try{
         var FindPrice = false
         var rec = scriptContext.currentRecord;
         var name = scriptContext.fieldId;
         var list = scriptContext.sublistId;
         if (name == 'item' && list == 'item') {
         
                     var OldItem = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_price_list_item'});
                     var itemID = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'item'});
                     var Quote_Item = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_original_item'});
                     if (!isNullOrEmpty(Quote_Item)){
                         var SearchDesc = 'SELECT item.description FROM item WHERE item.id ='+Quote_Item
                         var SearchDesc_R = query.runSuiteQL({query:SearchDesc}).asMappedResults();
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'description', value: SearchDesc_R[0].description});
                     }
                     //log.debug('OldItem',OldItem);
                     //log.debug('itemID',itemID);
                     if (itemID !=OldItem){
                        
                         var Custid = rec.getValue('entity');
                         var Tran_Date = rec.getValue('trandate')
                         var Price_Level = rec.getValue('custbody_dangot_price_list')
                         var Tran_currency = rec.getValue('currency');
                         var Conversion_Rate = 1
                         var itemqty = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'quantity'});
                         if (isNullOrEmpty(Price_Level)){
                             Price_Level = '1'
                         }
                         if(!isNullOrEmpty(itemID) && !isNullOrEmpty(Custid)){
                             var statment = `select * ,case when type = 'customer' then 9 else ${Price_Level} end as pl_level from ( 
                                 select
                                     c.custrecord_cp_item as item ,
                                     'customer' as  type,
                                     c.custrecord_cp_currency as currency,
                                     c.custrecord_cp_rate as rate,
                                     c.custrecord_cp_recurring_rate as recurring_rate,
                                     c.custrecord_cp_billing_cycle as billing_cycle,
                                     c.custrecord_cp_charging_type as charge_type,
                                     c.custrecord_cp_recurring_rate_2 as recurring_rate_2,
                                     c.custrecord_cp_billing_cycle_2 as billing_cycle_2,
                                     c.custrecord_cp_charging_type_2 as charge_type_2
                                 from customrecord_customer_price_list as c
                                   where c.custrecord_cp_item= ${itemID} and c.custrecord_cp_customer = ${Custid}
                                 UNION ALL
                                 select
                                     p.custrecord_price_item as item,
                                     'price' as type,
                                     p.custrecord_price_currency as currency,
                                     p.custrecord_price_rate as rate,
                                     p.custrecord_price_recurring_rate as recurring_rate,
                                     p.custrecord_price_billing_cycle as billing_cycle,
                                     p.custrecord_price_charging_type as charge_type,
                                     p.custrecord_price_recurring_rate_2 as recurring_rate_2,
                                     p.custrecord_price_billing_cycle_2 as billing_cycle_2,
                                     p.custrecord_price_charging_type_2 as charge_type_2
                                 from customrecord_price_list as p
                                     where p.custrecord_price_item  = ${itemID} and p.custrecord_price_price_level = ${Price_Level}
                             )
                             fetch first 1 rows only
                             `
                             var pl_query = query.runSuiteQL({query:statment}).asMappedResults()
                                 log.debug({
                                     title: "pl_query",
                                     details: pl_query
                                 })
                             /*    
                             var Pricelist_cust = search.create({
                                 type: 'customrecord_customer_price_list',
                                 filters: [['custrecord_cp_item', 'anyof', itemID],'AND',['custrecord_cp_customer', 'anyof', Custid]],
                                 })
                             var Pricelist_cust_Result = Pricelist_cust.run().getRange({start: 0,end: 1});
                             var Custprice = Pricelist_cust_Result.length
                             if (Custprice == 1){
                                 var Rec_PL_ID = Pricelist_cust_Result[0].id
                                 var PL_Rec = record.load({
                                     type: 'customrecord_customer_price_list',
                                     id: Rec_PL_ID,
                                     isDynamic: false
                                     })
                                 var PL_Original_Rate = PL_Rec.getValue('custrecord_cp_rate');
                                 var PL_Price_Currency = PL_Rec.getValue('custrecord_cp_currency');
                                 var PL_Reccuring = PL_Rec.getValue('custrecord_cp_recurring_rate');
                                 var PL_Billing_Cycle = PL_Rec.getValue('custrecord_cp_billing_cycle');
                                 var PL_Charging_Type = PL_Rec.getValue('custrecord_cp_charging_type');
                                 var PL_Reccuring_2 = PL_Rec.getValue('custrecord_cp_recurring_rate_2');
                                 var PL_Billing_Cycle_2 = PL_Rec.getValue('custrecord_cp_billing_cycle_2');
                                 var PL_Charging_Type_2 = PL_Rec.getValue('custrecord_cp_charging_type_2');
                                 Price_Level = '9' // Customer Price Level 
                             }
                             else{
                                 var Pricelist = search.create({
                                     type: 'customrecord_price_list',
                                     filters: [['custrecord_price_item', 'anyof', itemID],'AND',['custrecord_price_price_level', 'anyof', Price_Level]],
                                     })
                                 var Pricelist_Result = Pricelist.run().getRange({start: 0,end: 1});
                                 var Levelprice = Pricelist_Result.length
                                 if (Levelprice == 1){
                                     var Rec_PL_ID = Pricelist_Result[0].id
                                     var PL_Rec = record.load({
                                     type: 'customrecord_price_list',
                                     id: Rec_PL_ID,
                                     isDynamic: false
                                 })
                                 var PL_Original_Rate = PL_Rec.getValue('custrecord_price_rate');
                                 var PL_Price_Currency = PL_Rec.getValue('custrecord_price_currency');
                                 var PL_Reccuring = PL_Rec.getValue('custrecord_price_recurring_rate');
                                 var PL_Billing_Cycle = PL_Rec.getValue('custrecord_price_billing_cycle');
                                 var PL_Charging_Type = PL_Rec.getValue('custrecord_price_charging_type');
                                 var PL_Reccuring_2 = PL_Rec.getValue('custrecord_price_recurring_rate_2');
                                 var PL_Billing_Cycle_2 = PL_Rec.getValue('custrecord_price_billing_cycle_2');
                                 var PL_Charging_Type_2 = PL_Rec.getValue('custrecord_price_charging_type_2');
                                 }
                             }
                         
                         
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'price',value: '-1'});    
                         if (!isNullOrEmpty(Rec_PL_ID)){

                             if (!isNullOrEmpty(PL_Original_Rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price',value: PL_Original_Rate })}; 
                             if (!isNullOrEmpty(PL_Price_Currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency',value: PL_Price_Currency })}; 
                             if (!isNullOrEmpty(PL_Reccuring)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_reccuring_rate',value: PL_Reccuring })}; 
                             if (!isNullOrEmpty(PL_Billing_Cycle)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_bs_billing_cycle',value: PL_Billing_Cycle })}; 
                             if (!isNullOrEmpty(PL_Charging_Type)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_recurring_charge_type',value: PL_Charging_Type })}; 
                             if (!isNullOrEmpty(PL_Reccuring_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_recurring_second_year',value: PL_Reccuring_2 })}; 
                             if (!isNullOrEmpty(PL_Billing_Cycle_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_billing_cycle_2',value: PL_Billing_Cycle_2 })}; 
                             if (!isNullOrEmpty(PL_Charging_Type_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_charge_type_2',value: PL_Charging_Type_2 })}; 
                             if (Tran_currency != PL_Price_Currency){
                                 var Conversion_Rate = currency.exchangeRate({source: PL_Price_Currency, target: Tran_currency,date:Tran_Date})
                             }
                             var ratecalc = PL_Original_Rate * Conversion_Rate
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: ratecalc.toFixed(2) ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: PL_Original_Rate * Conversion_Rate * itemqty,ignoreFieldChange:true});
                             if (!isNullOrEmpty(PL_Price_Currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: PL_Price_Currency })};
                             if (!isNullOrEmpty(PL_Original_Rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: PL_Original_Rate })};  
                         
                             
                         }
                         else {
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: 0 ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: 0 ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: '' ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: 0 ,ignoreFieldChange:true});
                             
                         }
                         */
                        if (!isNullOrEmpty(pl_query[0].pl_level)){
                            Price_Level = pl_query[0].pl_level
                        }
                        if (pl_query.length == 1){ 
                            log.debug({
                                title: 'Rater',
                                details:pl_query[0]
                            })
                             if (!isNullOrEmpty(pl_query[0].rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price',value: pl_query[0].rate })}; 
                             if (!isNullOrEmpty(pl_query[0].currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency',value: pl_query[0].currency })}; 
                             if (!isNullOrEmpty(pl_query[0].recurring_rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_reccuring_rate',value: pl_query[0].recurring_rate })}; 
                             if (!isNullOrEmpty(pl_query[0].billing_cycle)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_bs_billing_cycle',value: pl_query[0].billing_cycle })}; 
                             if (!isNullOrEmpty(pl_query[0].charge_type)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_recurring_charge_type',value: pl_query[0].charge_type })}; 
                             if (!isNullOrEmpty(pl_query[0].recurring_rate_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_recurring_second_year',value: pl_query[0].recurring_rate_2 })}; 
                             if (!isNullOrEmpty(pl_query[0].billing_cycle_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_billing_cycle_2',value: pl_query[0].billing_cycle_2 })}; 
                             if (!isNullOrEmpty(pl_query[0].charge_type_2)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_charge_type_2',value: pl_query[0].charge_type_2 })}; 
                             if (Tran_currency != pl_query[0].currency){
                                 var Conversion_Rate = currency.exchangeRate({source: pl_query[0].currency, target: Tran_currency,date:Tran_Date})
                             }
                             var ratecalc = pl_query[0].rate * Conversion_Rate
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: ratecalc.toFixed(2) ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: pl_query[0].rate * Conversion_Rate * itemqty,ignoreFieldChange:true});
                             if (!isNullOrEmpty(pl_query[0].currency)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: pl_query[0].currency })};
                             if (!isNullOrEmpty(pl_query[0].rate)){rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: pl_query[0].rate })};  
                         
                             
                         }
                         else {
                            log.debug({
                                title: 'Rater 0',
                                details:pl_query[0]
                            })
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: 0 ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: 0 ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden',value: '' ,ignoreFieldChange:true});
                             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden',value: 0 ,ignoreFieldChange:true});
                        }
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_price_list_item',value: itemID,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_price_level',value: Price_Level,ignoreFieldChange:true});
                         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_conversion_rate',value: Conversion_Rate });               
                         }
                     }
                 }
             
         
     }catch(e){
         rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'price',value: '-1'});    
         log.debug({
             title: "postSourcing Error",
             details: e
         })
     }
     }
 
     function validateLine  (scriptContext) {
         try{
         var rec = scriptContext.currentRecord;
         var sublistName = scriptContext.sublistId;
         //var recform =rec_data
         //log.debug({title:"rec Type",details: rec.type})
         //log.debug({title:"rec Sublist",details: sublistName})
         if (sublistName === 'item'){
         var RecalcPrice = false
         var AgrType = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_bs_agr_type'});
         //var RecalcPrice = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_recalc_price'});
         var Original_Currency = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_currency_hidden'});
         var Original_Price = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price_hidden'});
         var Original_Conversion_Rate = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_conversion_rate'});
         var Item_Price = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price'});
         var Item_Rate = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'rate'});
         var Item_Currency = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency'});
         if (Original_Currency !=Item_Currency){
             RecalcPrice = true
             log.debug({
                 title: 'Original_Currency <> Item_Currency',
                 details: '{Original_Currency:'+Original_Currency+',Item_Currency :' + Item_Currency +'}'
             })
         }
         if (Item_Rate!=(Original_Price*Original_Conversion_Rate).toFixed(2)){
             RecalcPrice = true
             log.debug({
                 title: 'Item_Rate <> (Original_Price*Original_Conversion_Rate)',
                 details: '{Item_Rate:'+Item_Rate+',Calc :' + (Original_Price*Original_Conversion_Rate) +'}'
             })
         }
         if (Item_Price!=Original_Price){
             RecalcPrice = true
             log.debug({
                 title: 'Item <> Original Price',
                 details: '{Item_Price:'+Item_Price+',Original_Price :' + Original_Price +'}'
             })
         }
         if (RecalcPrice){
           
             var Tran_Date = rec.getValue('trandate')
             var Tran_currency = rec.getValue('currency');
             var Conversion_Rate = 1
             var itemqty = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'quantity'});
             var Line_Currency = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency'});
             var Line_Original_Rate = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_original_price'});
             if(isNullOrEmpty(Line_Currency)){
                 rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_item_currency',value: Tran_currency ,ignoreFieldChange:true});
                 Line_Currency = Tran_currency
             }
             if (!isNullOrEmpty(Line_Original_Rate)){
             if (Tran_currency != Line_Currency){
                 var Conversion_Rate = currency.exchangeRate({source: Line_Currency, target: Tran_currency,date:Tran_Date})
             }
             var ratecalc = Line_Original_Rate * Conversion_Rate
             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'rate',value: ratecalc.toFixed(2) ,ignoreFieldChange:true});
             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'amount',value: Line_Original_Rate * Conversion_Rate * itemqty,ignoreFieldChange:true});
             rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_dangot_price_level',value:'8',ignoreFieldChange:true});//Custom Price Calc
             }
         }
         
             var Order_type = rec.getValue('custbody_dangot_sale_type');
    
                if (Order_type == 1){
                    var item_rec = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'item'});
                    const sql = 'SELECT item.isserialitem FROM item WHERE item.id ='+item_rec
                    var queryResults = query.runSuiteQL({query:sql}).asMappedResults()
                    if (queryResults[0].isserialitem == 'T'){
                        AgrType = '1'
                        rec.setCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_bs_agr_type', value: 1});
                    }
                }
         if (!isNullOrEmpty(AgrType)){
            var Misssing_Fieds = []
            if (AgrType == '1'){
                var Site_Warranty = custbody_dangot_sale_type
                var Lab_Warranty = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_lab_warranty'});
                if(isNullOrEmpty(Site_Warranty)){ Misssing_Fieds.push('Site Warranty Month')};
                if(isNullOrEmpty(Lab_Warranty)){ Misssing_Fieds.push('Lab Warranty Month')};
            }
            if (AgrType == '2'){
                var Billing_Cycle = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_bs_billing_cycle'});
                var Sub_Type = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_agr_sub_type'});
                var Rate = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_reccuring_rate'});
                var First_Period = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_month_first_period'});
                if(isNullOrEmpty(Billing_Cycle)){ Misssing_Fieds.push('Billing Cycle')};
                if(isNullOrEmpty(Sub_Type)){ Misssing_Fieds.push('Sub_Type')};
                if(isNullOrEmpty(Rate)){ Misssing_Fieds.push('Reccuring Rate')};
                if (!isNullOrEmpty(First_Period)){
                    var Billing_Cycle_2 = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_billing_cycle_2'});
                    var Rate_2 = rec.getCurrentSublistValue({sublistId: 'item',fieldId: 'custcol_recurring_second_year'});
                    if(isNullOrEmpty(Billing_Cycle_2)){ Misssing_Fieds.push('Billng Cycle For Second Period')};
                    if(isNullOrEmpty(Rate_2)){ Misssing_Fieds.push('Reccurrig Rate For Second Period')};
                }
            }
            var Error_Length = Misssing_Fieds.length;
            if (Error_Length == 1){
                ui.alert({title: 'Missing Billing Value',message: 'Please enter '+ Misssing_Fieds +' before submit the line' })
                return false
            }
            log.debug({
                title: 'Missing Fields: '+Error_Length,
                details: Misssing_Fieds
            })
            if (Error_Length > 1){
            for (var i = 0; i < Error_Length; i++){
                    if ( i == 0){
                        var Text = ''+Misssing_Fieds[i]
                    }
                    else {
                        Text = Text + ', '+Misssing_Fieds[i]
                    }

                }
                ui.alert({title: 'Missing Billing Values',message: 'Please enter the follwing fields: '+ Text +' before submit the line' })
                return false

            } 
            
         }
         return true
         }
         else{
         return true
         }
             }catch(e){
                 log.debug({
                     title: "validateLine Error",
                     details: e
                 })
                 return true
         }
     }
    
     function isNullOrEmpty(val) {
         if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
             return true;
         }
         return false;
     }

         
     exports.fieldChanged = fieldChanged
     exports.validateLine    = validateLine   
        exports.postSourcing = postSourcing
     return exports
 });