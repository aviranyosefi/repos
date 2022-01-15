var prodocts_to_jason = [];
var prodocts_to;
var max_months = 0;
var total_final = 0;
var quote_id = nlapiGetFieldValue('custrecord_quote_number');
function fill_quote_prodocts(type) {
    if (type != 'delete') {
        try {
            var currency = nlapiLookupField('customrecord_quote', quote_id, 'custrecord_quote_currency', true);
            var symbol_currency = currency;
            if (currency == 'EUR') { symbol_currency = '€' }
            else if (currency == 'ILS') { symbol_currency = currency }
            else if (currency == 'GBP') { symbol_currency = '£' }
            else if (currency == 'USD' || currency == 'CAD') { symbol_currency = '$' }

            var type = nlapiGetFieldValue('custrecord_product_type');
            var fee_type = nlapiGetFieldValue('custrecord_fee_type');
            var product_quote_type = nlapiGetFieldValue('custrecord_product_quote_type');


            if (type == '2') { // type: Optimail
                OptiMail(symbol_currency);
            }

            else if (type == '1') {// type: Optimove Core
                if (fee_type == '2') { // fee type :UMDs
                    CoreUMD(symbol_currency);
                }
                else {
                    var number_of_instances = nlapiGetFieldValue('custrecord_number_of_instances')
                    if (number_of_instances != null && number_of_instances != '') {
                        nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', +number_of_instances + ' Optimove instance(s) included')
                    }
                    else {
                        nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', '')
                    }

                }

            }

            else if (type == '3') { // type: ps
                var renewal = nlapiGetFieldValue('custrecord_auto_renewal')
                if (renewal == '2') {
                    PS();
                }
                else {
                    var number_of_hours = nlapiGetFieldValue('custrecord_number_of_monthly_hours_inclu')
                    if (number_of_hours != null && number_of_hours != '') {
                        nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', +number_of_hours + '  hours per month')
                    }
                    else {
                        nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', '')
                    }
                }

            }

            else if (type == '15') { // Change Request Hours
                ChangeRequestHours(symbol_currency)
             }

            else {
                var number_of_instances = nlapiGetFieldValue('custrecord_number_of_instances')
                if (number_of_instances != null && number_of_instances != '') {
                    nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', +number_of_instances + ' Optimove instance(s) included')
                }
                else {
                    nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', '')
                }
            }


            if (product_quote_type == '3') {

                var start = nlapiGetFieldValue('custrecord_product_start_month');
                var end = nlapiGetFieldValue('custrecord_product_end_month');

                var res = subs_term(nlapiStringToDate(start), nlapiStringToDate(end))

                //var start_date = start.split('/');
                //var end_date = end.split('/');

                //var start_number_of_days = new Date(start_date[2], start_date[1], 0).getDate();
                //var end_number_of_days = new Date(end_date[2], end_date[1], 0).getDate();

                //var final_start = (start_number_of_days - start_date[0] + 1) / start_number_of_days;

                //var final_end = end_date[0] / end_number_of_days;

                //var number_of_month = monthDiff(new Date(start_date[2], start_date[1], start_date[0]), new Date(end_date[2], end_date[1], end_date[0]))
            
                //if (number_of_month == 0 && start_date[1] == end_date[1]  && start_date[1] == end_date[1]  ) { final_end = 0; }

                //var res = (final_start + final_end + number_of_month).toFixed(2);

          
                nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_terms', res)

            }

            FindProducs(quote_id, symbol_currency);

           
            //prodocts_to = prodocts_to.replace(/UMPs/g, units);
            nlapiSubmitField('customrecord_quote', quote_id, 'custrecord_prodocts', prodocts_to);
            //nlapiLogExecution('audit', 'units:' + units, prodocts_to)
            //nlapiSubmitField('customrecord_quote', quote_id, 'custrecord_max_months', max_months) 


        } catch (err) {
            nlapiLogExecution('error', 'fill_quote_prodocts()', err)
        }
    }
    else {
        FindProducs(quote_id, symbol_currency);     
        //prodocts_to = prodocts_to.replace(/UMPs/g, units);
        nlapiSubmitField('customrecord_quote', quote_id, 'custrecord_prodocts', prodocts_to);

    }

}




function FindProducs(quote, symbol_currency) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_quote_number', null, 'anyof', quote);

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_product_type');
    columns[1] = new nlobjSearchColumn('custrecord_from_month');
    columns[2] = new nlobjSearchColumn('custrecord_to_month');
    columns[3] = new nlobjSearchColumn('custrecord_product_fix_price');
    columns[4] = new nlobjSearchColumn('custrecord_number_of_instances');
    columns[5] = new nlobjSearchColumn('custrecord_product_optimove_core_comment');
    columns[6] = new nlobjSearchColumn('custrecord_product_sorting_code');
    columns[7] = new nlobjSearchColumn('custrecord_core_fix_price_1');
    columns[8] = new nlobjSearchColumn('custrecord_fee_type');
    columns[9] = new nlobjSearchColumn('custrecord_precentage_from_optimove_core');
    columns[10] = new nlobjSearchColumn('custrecord_monthly_inventory_fees');
    columns[11] = new nlobjSearchColumn('custrecord_number_of_monthly_hours_inclu'); // NUMBER OF MONTHLY HOURS INCLUDED
    columns[12] = new nlobjSearchColumn('custrecord_monthly_fees'); //MONTHLY FEES
    columns[13] = new nlobjSearchColumn('custrecord_following_committed_term'); //FOLLOWING COMMITTED TERM
    columns[14] = new nlobjSearchColumn('custrecord_bracket_1_fees'); // Optimove Core -->BRACKET 1 FEES
    columns[15] = new nlobjSearchColumn('custrecord_product_start_month'); // custrecord_product_start_month
    columns[16] = new nlobjSearchColumn('custrecord_product_end_month'); // custrecord_product_end_month
    columns[17] = new nlobjSearchColumn('custrecord_product_quote_type'); // custrecord_product_quote_type
    columns[18] = new nlobjSearchColumn('custrecord_product_comments'); // 
    columns[19] = new nlobjSearchColumn('custrecord_product_credit_amount'); // 
    columns[20] = new nlobjSearchColumn('custrecord_product_terms'); // 
    columns[21] = new nlobjSearchColumn('custrecord_package_type'); // 
    columns[22] = new nlobjSearchColumn('custrecord_deliverability_packages'); // 
    columns[23] = new nlobjSearchColumn('custrecord_fees'); // 

    var savedSearch = nlapiCreateSearch('customrecord_product', filters, columns);

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

    var ExcludeList = nlapiLookupField('customrecord_exclude_prod_monthly_fees', 1, 'custrecord_products_to_exclude').split(',')
    if (SearchResults != null) {
        for (var i = 0; i < SearchResults.length; i++) {
            prodocts_to_jason.push({
                name: SearchResults[i].getText('custrecord_product_type'),
                product_type: SearchResults[i].getValue('custrecord_product_type'),
                fix_price: SearchResults[i].getValue('custrecord_product_fix_price'),
                from_month: SearchResults[i].getValue('custrecord_from_month'),
                to_month: SearchResults[i].getValue('custrecord_to_month'),
                qty: SearchResults[i].getValue('custrecord_number_of_instances'),
                comment: SearchResults[i].getValue('custrecord_product_optimove_core_comment'),
                type: SearchResults[i].getValue('custrecord_product_sorting_code'),
                fix_price1: SearchResults[i].getValue('custrecord_core_fix_price_1'),
                type_fee: SearchResults[i].getText('custrecord_fee_type'),
                precentage: SearchResults[i].getValue('custrecord_precentage_from_optimove_core'),
                monthly: SearchResults[i].getValue('custrecord_monthly_inventory_fees'),
                ps_qty: SearchResults[i].getValue('custrecord_number_of_monthly_hours_inclu'),
                ps_monthly: SearchResults[i].getValue('custrecord_monthly_fees'),
                committed_term: SearchResults[i].getValue('custrecord_following_committed_term'),
                braket_1_fees: SearchResults[i].getValue('custrecord_bracket_1_fees'),
                start_month: SearchResults[i].getValue('custrecord_product_start_month'),
                end_month: SearchResults[i].getValue('custrecord_product_end_month'),
                quote_type: SearchResults[i].getValue('custrecord_product_quote_type'),
                new_comment: SearchResults[i].getValue('custrecord_product_comments'),
                credit_amount: SearchResults[i].getValue('custrecord_product_credit_amount'),
                product_terms: SearchResults[i].getValue('custrecord_product_terms'),
                package_type: SearchResults[i].getText('custrecord_package_type'),
                deliverability_packages: SearchResults[i].getText('custrecord_deliverability_packages'),
                custrecord_fees: SearchResults[i].getValue('custrecord_fees'),    
                
            });
        }

        prodocts_to_jason.sort(function (a, b) { return b.type - a.type });

        nlapiLogExecution('debug', 'prodocts_to_jason', JSON.stringify(prodocts_to_jason))

        var startDate, currStartDate, currEndDate;
        var endDate;
        prodocts_to = '';
        var price_for_calc = 0;
        var total = 0;
        var totalFees = 0;
        var braket_fees = 0;
        var creditAmount = 0;
        for (var i = 0; i < prodocts_to_jason.length; i++) {


            currStartDate = nlapiStringToDate(prodocts_to_jason[i].start_month);
            if (startDate == null)
                startDate = currStartDate;
            if (startDate > currStartDate && prodocts_to_jason[i].name != 'Credit')
                startDate = currStartDate;

            currEndDate = nlapiStringToDate(prodocts_to_jason[i].end_month);
            if (endDate == null)
                endDate = currEndDate;
            if (endDate < currEndDate)
                endDate = currEndDate;



            //item - start
            if (prodocts_to_jason[i].name == 'PS') { prodocts_to += 'Strategic Services' + '^'; }     
            else { prodocts_to += prodocts_to_jason[i].name + '^'; }
            //item - end

            //Monthly Price - start
            if ((prodocts_to_jason[i].fix_price != '' || prodocts_to_jason[i].fix_price1 != '' || prodocts_to_jason[i].monthly != '' ||
                prodocts_to_jason[i].ps_monthly != '' || prodocts_to_jason[i].credit_amount != '') && prodocts_to_jason[i].type_fee != 'Active Customers') {
                prodocts_to += symbol_currency;
            }
            if (prodocts_to_jason[i].name == 'Optimove Core' && prodocts_to_jason[i].type_fee == 'Fix Price') { prodocts_to += formatNumber(prodocts_to_jason[i].fix_price1) + '^' }
            else if (prodocts_to_jason[i].name == 'Optimove Core' && prodocts_to_jason[i].type_fee == 'Active Customers') { prodocts_to += 'See Details ' + '^' }
            else if (prodocts_to_jason[i].name == 'PS') { prodocts_to += formatNumber(prodocts_to_jason[i].ps_monthly) + '^' }
            else if (prodocts_to_jason[i].name == 'Credit') { prodocts_to += formatNumber(prodocts_to_jason[i].credit_amount) + '^' }
            else if (prodocts_to_jason[i].name == 'Change Request Hours') { prodocts_to += 'One-Time Fee' + '^' }
            else {
                if (prodocts_to_jason[i].fix_price != '') { prodocts_to += formatNumber(prodocts_to_jason[i].fix_price) + '^'; }
                else if (prodocts_to_jason[i].precentage != '') { prodocts_to += formatNumber(prodocts_to_jason[i].precentage) + ' From Core' + '^'; }
                else { prodocts_to += formatNumber(prodocts_to_jason[i].monthly) + '^'; }
            }
            //Monthly Price - end

            //Subscription Months - start
            if (prodocts_to_jason[i].from_month != '') {
                prodocts_to += prodocts_to_jason[i].from_month + ' to '
                    + prodocts_to_jason[i].to_month + '^';
            }
            else {
                if (prodocts_to_jason[i].quote_type == '3' && prodocts_to_jason[i].committed_term == '1') {
                    prodocts_to += prodocts_to_jason[i].start_month + '<br>to ' + prodocts_to_jason[i].end_month + '^';
                }
                else if (prodocts_to_jason[i].name == 'Custom Attribute Creation') { prodocts_to += 'One-Time fee for <br> attributes inventory  ^' } 
                else if (prodocts_to_jason[i].name == 'Change Request Hours') { prodocts_to += 'Not Applicable  ^' } // 
                else if (prodocts_to_jason[i].name != 'Credit') { prodocts_to += 'See Details  ^' } // change from : 'Applicable pricing for the renewal term'             
                else { prodocts_to += '^' }

            }
            //Subscription Months - end


            //comment - start
            prodocts_to += prodocts_to_jason[i].comment;
            if (prodocts_to_jason[i].comment != '') { prodocts_to +=  '<br>' +prodocts_to_jason[i].new_comment }
            else if (prodocts_to_jason[i].name == 'Custom Attribute Creation') { prodocts_to += prodocts_to_jason[i].package_type +'<br>' + prodocts_to_jason[i].new_comment }
            else { prodocts_to += prodocts_to_jason[i].new_comment }

            if (prodocts_to_jason[i].deliverability_packages != '') {
                if (prodocts_to_jason[i].comment != '' || prodocts_to_jason[i].new_comment != '') {
                    prodocts_to += '<br>' + prodocts_to_jason[i].deliverability_packages;
                }
                else { prodocts_to +=  prodocts_to_jason[i].deliverability_packages;}
            }
            //comment - end

            prodocts_to += '~~';

            ////// Total - start
            if (prodocts_to_jason[i].name == 'Optimove Core' && prodocts_to_jason[i].committed_term == '1' && prodocts_to_jason[i].type_fee == 'Active Customers') {
                braket_fees = prodocts_to_jason[i].braket_1_fees;
                price_for_calc = prodocts_to_jason[i].braket_1_fees;
                if (prodocts_to_jason[i].quote_type == '3') {
                    var NoMonths = prodocts_to_jason[i].product_terms
                } else {
                    var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                }

                total += price_for_calc * NoMonths;
                if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * NoMonths;}
                nlapiLogExecution('debug', '1 braket_1_fees' + ' ' + prodocts_to_jason[i].name + ' ' + prodocts_to_jason[i].type_fee, prodocts_to_jason[i].braket_1_fees)
                nlapiLogExecution('debug', '1 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                nlapiLogExecution('debug', '1 price_for_calc * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * NoMonths)
                nlapiLogExecution('debug', '1 total()' + ' ' + prodocts_to_jason[i].name, total)
                nlapiLogExecution('debug', '1 totalFees()' + ' ' + prodocts_to_jason[i].name, totalFees)
            }
            else if (prodocts_to_jason[i].name == 'Optimove Core' && prodocts_to_jason[i].committed_term == '1') {
                price_for_calc = prodocts_to_jason[i].fix_price1;
                if (prodocts_to_jason[i].quote_type == '3') {
                    var NoMonths = prodocts_to_jason[i].product_terms;
                } else {
                    var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                }
                total += price_for_calc * NoMonths;
                if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * NoMonths; }
               
                nlapiLogExecution('debug', '2 fix_price' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                nlapiLogExecution('debug', '2 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                nlapiLogExecution('debug', '2 price_for_calc * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * NoMonths)
                nlapiLogExecution('debug', '2 total()' + ' ' + prodocts_to_jason[i].name, total)
            }
            else if (prodocts_to_jason[i].name == 'Optimail' && prodocts_to_jason[i].committed_term == '1') {
                price_for_calc = prodocts_to_jason[i].monthly;
                if (prodocts_to_jason[i].quote_type == '3') {
                    var NoMonths = prodocts_to_jason[i].product_terms;
                } else {
                    var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                }
                total += price_for_calc * NoMonths;
                if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * NoMonths; }            
                nlapiLogExecution('debug', '3 monthly' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                nlapiLogExecution('debug', '3 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                nlapiLogExecution('debug', '3 price_for_calc * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * NoMonths)
                nlapiLogExecution('debug', '3 total()' + ' ' + prodocts_to_jason[i].name, total)
                nlapiLogExecution('debug', '3 totalFees()' + ' ' + prodocts_to_jason[i].name, totalFees)
            }
            else if (prodocts_to_jason[i].name == 'Change Request Hours') {
                price_for_calc = parseFloat(prodocts_to_jason[i].custrecord_fees);               
                total += price_for_calc;
                if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc; }             
                nlapiLogExecution('debug', '4 Change Request Hours' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                nlapiLogExecution('debug', '4 total()' + ' ' + prodocts_to_jason[i].name, total)
            }
            else if (prodocts_to_jason[i].name == 'PS' && prodocts_to_jason[i].committed_term == '1') {
                price_for_calc = prodocts_to_jason[i].ps_monthly;
                if (prodocts_to_jason[i].quote_type == '3') {
                    var NoMonths = prodocts_to_jason[i].product_terms;
                } else {
                    var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                }
                total += price_for_calc * NoMonths;
                if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * NoMonths; }      
                nlapiLogExecution('debug', '5 ps_monthly' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                nlapiLogExecution('debug', '5 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                nlapiLogExecution('debug', '5 price_for_calc * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * NoMonths)
                nlapiLogExecution('debug', '5 total()' + ' ' + prodocts_to_jason[i].name, total)
            }
            else if (prodocts_to_jason[i].committed_term == '1') {
                if (prodocts_to_jason[i].type_fee == '% From Optimove Core' && prodocts_to_jason[i].committed_term == '1') {
                    price_for_calc = parseInt(prodocts_to_jason[i].precentage) / 100;
                    if (prodocts_to_jason[i].quote_type == '3') {
                        var NoMonths = prodocts_to_jason[i].product_terms;
                    } else {
                        var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                    }
                    total += price_for_calc * braket_fees * NoMonths;
                    //if (prodocts_to_jason[i].name != 'IP Deliverability Services' && prodocts_to_jason[i].name != 'PS') {
                    //    totalFees += price_for_calc * braket_fees * NoMonths;
                    //}
                    if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * braket_fees * NoMonths; } 
                  
                    nlapiLogExecution('debug', '6 price_for_calc' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                    nlapiLogExecution('debug', '6 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                    nlapiLogExecution('debug', '6 price_for_calc * braket_fees * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * braket_fees * NoMonths)
                    nlapiLogExecution('debug', '6 total()' + ' ' + prodocts_to_jason[i].name, total)
                }
                else if (prodocts_to_jason[i].name != 'Credit') {
                    price_for_calc = prodocts_to_jason[i].fix_price;
                    if (prodocts_to_jason[i].quote_type == '3') {
                        var NoMonths = prodocts_to_jason[i].product_terms;
                    } else {
                        var NoMonths = calcMonths(prodocts_to_jason[i].from_month, prodocts_to_jason[i].to_month)
                    }
                    total += price_for_calc * NoMonths;
                    //if (prodocts_to_jason[i].name != 'IP Deliverability Services' && prodocts_to_jason[i].name != 'PS') {
                    //    totalFees += price_for_calc * NoMonths;
                    //}
                    if (ExcludeList.indexOf(prodocts_to_jason[i].product_type) == -1) { totalFees += price_for_calc * NoMonths; } 
                    nlapiLogExecution('debug', ' 7 fix_price' + ' ' + prodocts_to_jason[i].name, price_for_calc)
                    nlapiLogExecution('debug', '7 NoMonths' + ' ' + prodocts_to_jason[i].name, NoMonths)
                    nlapiLogExecution('debug', '7 price_for_calc * NoMonths' + ' ' + prodocts_to_jason[i].name, price_for_calc * NoMonths)
                    nlapiLogExecution('debug', '7 total()' + ' ' + prodocts_to_jason[i].name, total)
                    nlapiLogExecution('debug', '7 totalFees()' + ' ' + prodocts_to_jason[i].name, totalFees)
                }
            }

            if (prodocts_to_jason[i].name == 'Credit') {

                creditAmount += parseFloat(prodocts_to_jason[i].credit_amount);
            }


            ////// Total - end


        }
        var quote_type = nlapiLookupField('customrecord_quote', quote, 'custrecord_quote_type', true);
        nlapiLogExecution('debug', 'quote_type)', quote_type);
        if (quote_type == 'Upsell') {
            //var subscription_dates = (endDate - startDate) / 2592000000;

            nlapiLogExecution('debug', 'startDate', startDate);
            nlapiLogExecution('debug', 'endDate', endDate);
            var res = subs_term(startDate, endDate)
            nlapiSubmitField('customrecord_quote', quote, 'custrecord_quote_subscription_term', res)
        }


        nlapiLogExecution('debug', 'TOTAL total()', total);
        nlapiLogExecution('debug', 'credit_amount()', creditAmount);
        var subscription_term = parseFloat(nlapiLookupField('customrecord_quote', quote, 'custrecord_quote_subscription_term'));
        nlapiLogExecution('debug', 'TOTAL subscription_term()', subscription_term);
        var total_final = (total + creditAmount) / subscription_term;
        var total_fees_final = (totalFees + creditAmount) / subscription_term;
        nlapiLogExecution('debug', 'Ttotal_final()', total_final);
        var field = []; field[0] = 'custrecord_quote_monthly_commited_fess'; field[1] = 'custrecord_quote_monthly_ex_products'
        var val = []; val[0] = total_final.toFixed(2); val[1] = total_fees_final.toFixed(2)
        nlapiSubmitField('customrecord_quote', quote, field, val)

    }
}

function CoreUMD(symbol_currency) {
    try {
        var amount1 = nlapiGetFieldValue('custrecord_braket_1_amount');
        var fees1 = nlapiGetFieldValue('custrecord_bracket_1_fees');

        var amount2 = nlapiGetFieldValue('custrecord_braket_2_amount');
        var fees2 = nlapiGetFieldValue('custrecord_bracket_2_fees');

        var amount3 = nlapiGetFieldValue('custrecord_braket_3_amount');
        var fees3 = nlapiGetFieldValue('custrecord_bracket_3_fees');

        var amount4 = nlapiGetFieldValue('custrecord_braket_4_amount');
        var fees4 = nlapiGetFieldValue('custrecord_braket_4_fees');

        var amount5 = nlapiGetFieldValue('custrecord_braket_5_amount');
        var fees5 = nlapiGetFieldValue('custrecord_braket_5_fees');

        var infinite_bracket_amount = nlapiGetFieldValue('custrecord_additional_bracket_amount');
        var infinite_bracket_fees = nlapiGetFieldValue('custrecord_additional_bracket_fees');

        var number_of_instances = nlapiGetFieldValue('custrecord_number_of_instances')
        var ifUpdate = false;

        var units = 'Active Customers'; 

        var comment = '';
        if (number_of_instances != null && number_of_instances != '') {
            comment = number_of_instances + ' Optimove instance(s) included <br>'
        }

        comment += '<br>Monthly Fees Thresholds: <br>';
        if (amount1 != '' && fees1 != '') { comment += '• Up to ' + formatNumber(amount1) + ' ' + units + ': ' + symbol_currency + formatNumber(fees1); ifUpdate = true; }
        if (amount2 != '' && fees2 != '') { comment += '<br> • From ' + formatNumber(parseInt(amount1) + 1) + ' to ' + formatNumber(amount2) + ' ' + units + ': ' + symbol_currency + formatNumber(fees2); ifUpdate = true; }
        if (amount3 != '' && fees3 != '') { comment += '<br> • From ' + formatNumber(parseInt(amount2) + 1) + ' to ' + formatNumber(amount3) + ' ' + units + ': ' + symbol_currency + formatNumber(fees3); ifUpdate = true; }
        if (amount4 != '' && fees4 != '') { comment += '<br> • From ' + formatNumber(parseInt(amount3) + 1) + ' to ' + formatNumber(amount4) + ' ' + units + ': ' + symbol_currency + formatNumber(fees4); ifUpdate = true; }
        if (amount5 != '' && fees5 != '') { comment += '<br> • From ' + formatNumber(parseInt(amount4) + 1) + ' to ' + formatNumber(amount5) + ' ' + units + ': ' + symbol_currency + formatNumber(fees5); ifUpdate = true; }
        if (infinite_bracket_amount != '' && infinite_bracket_fees != '') { comment += '<br> • Each additional ' + formatNumber(infinite_bracket_amount) + ' ' + units + ': ' + symbol_currency + formatNumber(infinite_bracket_fees); ifUpdate = true; }
        //if (units == 'UMPs') { comment += '<br> * Unique Monthly Purchasers '; }
        //else { comment += '<br> * Unique Monthly Depositors ';}
        if (ifUpdate) { nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', comment) }

    } catch (err) {
        nlapiLogExecution('error', 'CoreUMD()', err)
    }
}

function OptiMail(symbol_currency) {
    try {
        var ip_addresses_included = nlapiGetFieldValue('custrecord_ip_addresses_included');
        var inventory_emails_amount = nlapiGetFieldValue('custrecord_inventory_emails_amount');
        var exceeding_emails_onetime_fee = nlapiGetFieldValue('custrecord_exceeding_emails_onetime_fee'); // EXCEEDING EMAILS ONE-TIME FEE
        var exceeding_emails_amount = nlapiGetFieldValue('custrecord_exceeding_emails_amount'); // // EXCEEDING EMAILS AMOUNT
        var additional_ip_addresses_fees = nlapiGetFieldValue('custrecord_additional_ip_addresses_fees'); // ADDITIONAL IP ADDRESSES FEES

        var ifUpdate = false;

        var comment = '';
        if (inventory_emails_amount != '') { comment += '• Includes an inventory of ' + formatNumber(inventory_emails_amount) + ' e-mails.'; ifUpdate = true; }
        if (exceeding_emails_onetime_fee != '') { comment += '<br> • Additional inventory will be charged at ' + symbol_currency + formatNumber(exceeding_emails_onetime_fee) + '<br> for each additional set of ' + formatNumber(exceeding_emails_amount) + ' emails.'; ifUpdate = true; }
        if (additional_ip_addresses_fees != '' && ip_addresses_included != '') { comment += '<br> • Includes up to ' + formatNumber(ip_addresses_included) + ' IP addresses. Additional IP <br>Addresses may be required according to Client’s OptiMail configuration and will be charged at ' + symbol_currency + formatNumber(additional_ip_addresses_fees) + ' per IP Address, per month.'; ifUpdate = true; }



        if (ifUpdate) { nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', comment) }
    } catch (err) {
        nlapiLogExecution('error', 'OptiMail()', err)
    }

}

function PS() {
    try {
        var result = 0;
        var to_month = nlapiGetFieldValue('custrecord_to_month'); //TO MONTH
        var from_month = nlapiGetFieldValue('custrecord_from_month'); //FROM MONTH
        var renewal = nlapiGetFieldValue('custrecord_renewal_term_months'); // RENEWAL TERM(MONTHS)
        var period_days = nlapiGetFieldValue('custrecord_notice_period_days'); // NOTICE PERIOD(DAYS)
        var number_of_monthly_hours_inclu = nlapiGetFieldValue('custrecord_number_of_monthly_hours_inclu'); // NUMBER OF MONTHLY HOURS INCLUDED

        
       
        var custrecord_product_quote_type = nlapiGetFieldValue('custrecord_product_quote_type'); 


        if (to_month != '' && from_month != '') {
            result = (parseInt(to_month) - parseInt(from_month)) + 1;
        }
        var ifUpdate = false;
        var comment = '';
        if (number_of_monthly_hours_inclu != '') { comment += formatNumber(number_of_monthly_hours_inclu) + ' hours per month <br>  '; ifUpdate = true; }
        if (renewal != '' && result != 0 && period_days != '') { comment += 'Following the intial ' + formatNumber(result) + ' months period, the Strategic Services shall automatically renew for ' + formatNumber(renewal) + ' month(s) with ' + formatNumber(period_days) + ' days notice.'; ifUpdate = true; }
        else if (custrecord_product_quote_type == '3') { comment += 'Following the intial period, the Strategic Services shall automatically renew for ' + formatNumber(renewal) + ' month(s) with ' + formatNumber(period_days) + ' days notice.'; ifUpdate = true; }
        if (ifUpdate) { nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', comment) }




    } catch (err) {
        nlapiLogExecution('error', 'PS()', err)
    }
}

function ChangeRequestHours(symbol_currency) {
    try {
        var result = '';
        var custrecord_fees = nlapiGetFieldValue('custrecord_fees'); //FEES
        var custrecord_number_of_hours_included = nlapiGetFieldValue('custrecord_number_of_hours_included'); 
       

        if (!isNullOrEmpty(custrecord_fees) && !isNullOrEmpty(custrecord_number_of_hours_included)) {
            result = parseInt(custrecord_fees) / parseInt(custrecord_number_of_hours_included);
            //nlapiLogExecution('error', 'ChangeRequestHours RESULT', result)
        }
        var ifUpdate = false;
        var comment = '';     
        if (!isNullOrEmpty(result)) { comment += 'Includes ' + formatNumber(custrecord_number_of_hours_included) + ' hours, at  ' + symbol_currency + formatNumber(result.toFixed(2)) + '  per hour, totalling ' + symbol_currency+  formatNumber(custrecord_fees) + '.'; ifUpdate = true; }
        if (ifUpdate) { nlapiSubmitField('customrecord_product', nlapiGetRecordId(), 'custrecord_product_optimove_core_comment', comment) }




    } catch (err) {
        nlapiLogExecution('error', 'ChangeRequestHours()', err)
    }
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function calcMonths(from, to) {

    var result = (parseInt(to) - parseInt(from)) + 1;

    return result;
}

function monthDiff(d1, d2) {
    
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;    
    months -= d1.getMonth() + 1;
    months += d2.getMonth() ;
    return months <= 0 ? 0 : months;
}

function subs_term(start, end) {

    var start_to_string = nlapiDateToString(start);
    var end_to_string = nlapiDateToString(end);

    var start_date = start_to_string.split('/');
    var end_date = end_to_string.split('/');

    var start_number_of_days = new Date(start_date[2], start_date[1], 0).getDate();
    var end_number_of_days = new Date(end_date[2], end_date[1], 0).getDate();

    var final_start = (start_number_of_days - start_date[0] + 1) / start_number_of_days;

    var final_end = end_date[0] / end_number_of_days;

    var number_of_month = monthDiff(new Date(start_date[2], start_date[1] - 1, start_date[0]), new Date(end_date[2], end_date[1] - 1, end_date[0]))
    if (number_of_month == 0 && start_date[1] == end_date[1] && start_date[2] == end_date[2]) { final_start = 0; }


    var res = (final_start + final_end + number_of_month).toFixed(2);

    return res;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}