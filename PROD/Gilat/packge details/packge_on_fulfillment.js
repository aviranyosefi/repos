
function packge_on_fulfillment() {
    try { 
        //var packge_id = nlapiGetFieldValue('id');
        var fulfillment = nlapiGetFieldValue('custrecord_pd_fulfillment_no');
        
        FindPackges(fulfillment);        
       
        //nlapiSubmitField('customrecord_quote', quote_id, 'custrecord_max_months', max_months) 
        
        
    } catch (err) {
        nlapiLogExecution('error', 'packge_on_fulfillment()', err)
    }
    
}




function FindPackges(fulfillment) {

    nlapiLogExecution('error', 'fulfillment', fulfillment)
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_pd_fulfillment_no', null, 'anyof', fulfillment);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_pd_box_no');
    columns[1] = new nlobjSearchColumn('custrecord_pd_kgs');
    columns[2] = new nlobjSearchColumn('custrecord_pd_dimensions');
    columns[3] = new nlobjSearchColumn('custrecord_pd_item_no');
    columns[4] = new nlobjSearchColumn('custrecordpd_quantity');
         

    var savedSearch = nlapiCreateSearch('customrecord_package_detail', filters, columns);

    var resultset = savedSearch.runSearch();
    var SearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            SearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    prodocts_to_jason = [];
    if (SearchResults != null) {
        for (var i = 0; i < SearchResults.length; i++) {

            prodocts_to_jason.push({
                box: SearchResults[i].getValue('custrecord_pd_box_no'),
                kgs: SearchResults[i].getValue('custrecord_pd_kgs'),
                dimensions: SearchResults[i].getValue('custrecord_pd_dimensions'),
                item: SearchResults[i].getText('custrecord_pd_item_no'),
                qty: SearchResults[i].getValue('custrecordpd_quantity'),


            });

        }
    
        var prodocts_to = '';
        var sum_weihgt =0;
        var test = [];
        var num = 1;
        for (var j = 0; j < prodocts_to_jason.length; j++) {

            
            if (j > 0 && (j < prodocts_to_jason.length)) {
               
                if (prodocts_to_jason[j].box == prodocts_to_jason[j - 1].box) {
                     num = num + 1;
                }
                else {
                    test.push({ box: prodocts_to_jason[j - 1].box, number: num })
                    num = 1;
                }
            }
            if (j + 1 == prodocts_to_jason.length && j !=0) {
                if (prodocts_to_jason[j].box == prodocts_to_jason[j - 1].box) {
                    //num = num + 1;
                    test.push({ box: prodocts_to_jason[j - 1].box, number: num })

                }
                else {
                    num = 1;
                    test.push({ box: prodocts_to_jason[j].box, number: num })
                }
            }            
               
        }

       
        var arr = [];
        for (var m = 0; m < test.length; m++) {
            var num = test[m].number
            for (var z = 0; z < num; z++) {
                if (z == 0) {
                    arr.push(num);
                }
                else {
                    arr.push(0);
                }
            }
        }

           
        for (var j = 0; j < prodocts_to_jason.length; j++) {
            if (arr[j] == undefined) { var curr_arr = '1' }
            else { var curr_arr = arr[j] }

            prodocts_to += curr_arr + '^';
            prodocts_to += prodocts_to_jason[j].item + '^';
            prodocts_to += prodocts_to_jason[j].qty + '^';
            prodocts_to += prodocts_to_jason[j].box + '^';
            prodocts_to += prodocts_to_jason[j].dimensions + '^';
            prodocts_to += prodocts_to_jason[j].kgs + '~~';

            if (prodocts_to_jason[j].kgs != '' && prodocts_to_jason[j].kgs != null) {
                sum_weihgt += parseFloat(prodocts_to_jason[j].kgs);
            }
        }
           

       
    } // if - end

    if (test.length == 0) { var length = 1 } else { var length = test.length }
    nlapiLogExecution('debug', 'prodocts_to()', prodocts_to)
    nlapiSubmitField('itemfulfillment', fulfillment, 'custbody_package_detail_script', prodocts_to);
    nlapiSubmitField('itemfulfillment', fulfillment, 'custbody_package_detail_weight', sum_weihgt);
    nlapiSubmitField('itemfulfillment', fulfillment, 'custbody_package_detail_num', length);

}

