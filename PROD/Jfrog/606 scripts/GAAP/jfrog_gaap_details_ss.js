
function Run() {

    var context = nlapiGetContext();
    var arrayForGenarate = [];
    var getSellGaaps = getSellGaapsSearch();

    for (var i = 0; i < getSellGaaps.length; i++) {
        Context(context);
        var identifier_num = getSellGaaps[i].name;
        var getBuyGaaps = getBuyGaapsSearchEachNumber(identifier_num);
        getBuyGaaps.sort(function (a, b) { return a.id - b.id });
        if (getBuyGaaps != []) {
            var curr_qty = Math.abs(getSellGaaps[i].curr_qty);
            for (var x = 0; x < getBuyGaaps.length; x++) {
                if (curr_qty > 0) {
                    var availavle_qty = getBuyGaaps[x].availavle_qty;
                    var qty_difference = parseFloat(availavle_qty) - parseFloat(curr_qty);
                    if (qty_difference < 0) { qty_difference = 0; }
                    var buy_curr_qty = parseFloat(availavle_qty) - parseFloat(qty_difference)

                    arrayForGenarate.push({

                        identifier_number: identifier_num,
                        buy_id: getBuyGaaps[x].id,
                        buy_curr_qty: buy_curr_qty,
                        buy_price_unit_price: getBuyGaaps[x].price_unit_price,
                        sell_id: getSellGaaps[i].id,
                        sell_curr_qty: buy_curr_qty,
                        sell_price_unit_price: getSellGaaps[i].price_unit_price,
                        sell_date: getSellGaaps[i].sell_date,

                    });
                    curr_qty = parseFloat(curr_qty) - parseFloat(buy_curr_qty);
                    nlapiSubmitField('customrecord_gaap_trx', getBuyGaaps[x].id, 'custrecord_available_for_sale', qty_difference)
                }  
            } // for (var x = 0; x < getBuyGaaps.length; x++)                    
        }  //    if (getBuyGaaps != []) 
        nlapiSubmitField('customrecord_gaap_trx', getSellGaaps[i].id, 'custrecord_split', 'T')
    } // for (var i = 0; i < getSellGaaps.length; i++)


    if (arrayForGenarate != []) {
        GenerateRecords(arrayForGenarate);
    }
}

function getSellGaapsSearch() {


    var search = nlapiLoadSearch(null, 'customsearch_get_all_gaap');
    search.addFilter(new nlobjSearchFilter('custrecord_trx_type', null, 'noneof', 1));
    search.addFilter(new nlobjSearchFilter('custrecord_split', null, 'is', 'F'));


    var s = [];
    var results = [];
    var searchid = 0;
    var resultset = search.runSearch();


    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);


    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,
                name: s[i].getValue('custrecord_identifier_num'),
                curr_qty: s[i].getValue('custrecord_curr_unit'),
                price_unit_price: s[i].getValue('custrecord_price_per_unit'),
                sell_date: s[i].getValue('custrecord_settle_date'),


            });

        }


    }

    return results;
}

function getBuyGaapsSearchEachNumber(number) {


    var search = nlapiLoadSearch(null, 'customsearch_get_all_gaap');
    search.addFilter(new nlobjSearchFilter('custrecord_trx_type', null, 'is', 1));
    search.addFilter(new nlobjSearchFilter('custrecord_identifier_num', null, 'is', number));
    search.addFilter(new nlobjSearchFilter('custrecord_available_for_sale', null, 'greaterthan', 0));

    var s = [];
    var results = [];
    var searchid = 0;
    var resultset = search.runSearch();


    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);


    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,
                name: s[i].getValue('custrecord_identifier_num'),
                availavle_qty: s[i].getValue('custrecord_available_for_sale'),
                price_unit_price: s[i].getValue('custrecord_price_per_unit'),

            });

        }


    }

    return results;
}

function GenerateRecords(arrayForGenarate) {

    for (var m = 0; m < arrayForGenarate.length; m++) {
        try {
   
            var rec = nlapiCreateRecord('customrecord_gaap_trx_split');

            rec.setFieldValue('custrecord_identifier_num_split', arrayForGenarate[m].identifier_number)
            rec.setFieldValue('custrecord_buy_id', arrayForGenarate[m].buy_id)
            rec.setFieldValue('custrecord_current_qty_split', arrayForGenarate[m].buy_curr_qty)
            rec.setFieldValue('custrecord_buy_unit_price', arrayForGenarate[m].buy_price_unit_price)
            rec.setFieldValue('custrecord_sell_id', arrayForGenarate[m].sell_id)
            rec.setFieldValue('custrecord_current_qty_sell_split', arrayForGenarate[m].sell_curr_qty)
            rec.setFieldValue('custrecord_sell_unit_price', arrayForGenarate[m].sell_price_unit_price)
            rec.setFieldValue('custrecord_sell_date', nlapiStringToDate(arrayForGenarate[m].sell_date))
            
            var id = nlapiSubmitRecord(rec);

            nlapiLogExecution('DEBUG', 'm ' + m + ' id ' + id, id);

        } catch (e) {
            nlapiLogExecution('DEBUG', 'error : ' + arrayForGenarate[m].id, e);
        }
    }


}

function Context(context) {



    if (context.getRemainingUsage() < 150) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}





