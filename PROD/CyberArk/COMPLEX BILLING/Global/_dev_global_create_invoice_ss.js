var context = nlapiGetContext();
function globalCreateInvoice() {

	try{

        var resForBill = search_Billing();
        if (resForBill.length > 0) {
            var invoices_after_created = createInvoice(resForBill);
            invoices_after_created = dedupe(invoices_after_created)
            nlapiLogExecution('DEBUG', 'invoices_after_created()', JSON.stringify(invoices_after_created));
            if (invoices_after_created.length > 0) {
                email(invoices_after_created)
            }
        }
        else {
            nlapiLogExecution('DEBUG', 'resForBill.length', '0');	
        }
     

	}catch(err){
		nlapiLogExecution('DEBUG', 'createInvoice()', err);	
			
	}	
}


function search_Billing() {

    try {
        var filtersInvoice = new Array();
        //filtersInvoice[0] = new nlobjSearchFilter('custrecord_be_order', null, 'is', SO_ID);
        filtersInvoice[0] = new nlobjSearchFilter('custrecord_be_invoice_number', null, 'anyof', '@NONE@');
        filtersInvoice[1] = new nlobjSearchFilter('custrecord_be_billing_date', null, 'on', "today");
        filtersInvoice[2] = new nlobjSearchFilter('custrecord_be_subsidiary', null, 'noneof', ["18","23","22"]);
       

        var columnsInvoice = new Array();
        columnsInvoice[0] = new nlobjSearchColumn('custrecord_be_sequence_number');
        columnsInvoice[1] = new nlobjSearchColumn('custrecord_be_item');
        columnsInvoice[2] = new nlobjSearchColumn('custrecord_be_order_line_id');
        columnsInvoice[3] = new nlobjSearchColumn('custrecord_be_order').setSort();
        columnsInvoice[4] = new nlobjSearchColumn('custrecord_be_billing_date');
        columnsInvoice[5] = new nlobjSearchColumn('custrecord_be_from_date');
        columnsInvoice[6] = new nlobjSearchColumn('custrecord_be_to_date');
        columnsInvoice[7] = new nlobjSearchColumn('custrecord_be_amount');



        var search = nlapiCreateSearch('customrecord_billing_entity', filtersInvoice, columnsInvoice);
        var results = [];
        var resForBill = [];
        var resultset = search.runSearch();
        var searchid = 0;
        var results = [];

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                results.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        for (var i = 0; i < results.length; i++) {

            var tranid = nlapiLookupField('salesorder', results[i].getValue('custrecord_be_order'), 'tranid')
            resForBill.push({

                be_id: results[i].id,
                so: results[i].getValue('custrecord_be_order'),
                item: results[i].getValue('custrecord_be_item'),
                itemNmae: results[i].getText('custrecord_be_item'),
                line_id: results[i].getValue('custrecord_be_order_line_id'),
                billing_date: results[i].getValue('custrecord_be_billing_date'),
                from_date: results[i].getValue('custrecord_be_from_date'),
                to_date: results[i].getValue('custrecord_be_to_date'),
                amount: results[i].getValue('custrecord_be_amount'),               
                tranid: tranid

            });
        }



        resForBill.sort(function (a, b) {
            var aa = a.billing_date.split('/').reverse().join(),
                bb = b.billing_date.split('/').reverse().join();
            return aa > bb ? -1 : (aa < bb ? 1 : 0);
        });

    } catch (err) {
        nlapiLogExecution('ERROR', 'search_Billing', err);
    }
    return resForBill;

}

function createInvoice(Be_To_Invoice) {
  
    try {
        var invoices_after_created = [];
        var line_id;

        var Be_To_Invoice_Sort = sort(Be_To_Invoice);

        var delete_item = [];
        nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort ', Be_To_Invoice_Sort.length);

        for (var i = 0; i < Be_To_Invoice_Sort.length; i++) {
            Context(context)
            var count = Be_To_Invoice_Sort[i].countt;
            var so_num = Be_To_Invoice_Sort[i].sales_order;
            try {
                var invRec = nlapiTransformRecord('salesorder', so_num, 'invoice');
                invRec.setFieldValue('trandate', Be_To_Invoice_Sort[i].date);

                var lineCount = invRec.getLineItemCount('item');
                nlapiLogExecution('DEBUG', 'lineCount ' + i, lineCount);

                var be_ids = Be_To_Invoice_Sort[i].be_ids;
                var be_ids_array = be_ids.split(",")


                var lines_id = Be_To_Invoice_Sort[i].lines;
                var lines_id_array = lines_id.split(",")
                nlapiLogExecution('DEBUG', 'lines_id_array.length ', lines_id_array.length);

                for (x = 0; x < lines_id_array.length; x++) {

                    if (lines_id_array[x] != '') {

                        if (x == 0) {

                            for (var j = 1; j <= lineCount; j++) {
                                line_id = invRec.getLineItemValue('item', 'orderline', j);
                                if (line_id != lines_id_array[x]) {
                                    delete_item.push(line_id);
                                }
                            }
                        }

                        else {

                            for (var j = 0; j < delete_item.length; j++) {
                                if (lines_id_array[x] == delete_item[j]) {
                                    delete_item.splice(j, 1)
                                }
                            }

                        }

                    }
                }

                // delete rows - start
                for (var j = lineCount; j >= 1; j--) {
                    for (var a = 0; a < delete_item.length; a++) {
                        if (invRec.getLineItemValue('item', 'orderline', j) == delete_item[a]) {

                            invRec.removeLineItem('item', j);
                        }
                    }
                }
                // delete rows - end



                nlapiLogExecution('DEBUG', 'delete_item ', delete_item);

                ///
                invoiceID = nlapiSubmitRecord(invRec);

                var incoice_rec = nlapiLoadRecord('invoice', invoiceID);
                /// for update qty and original qty - start
                for (x = 0; x < be_ids_array.length; x++) {

                    if (be_ids_array[x] != '') {


                        var tranid = incoice_rec.getFieldValue('tranid');
                        var currency = incoice_rec.getFieldValue('currencysymbol')
                        var subsidiary = incoice_rec.getFieldValue('subsidiary');
                        var customer = incoice_rec.getFieldValue('entity');
                        var checkIfAdjust = nlapiLookupField('customer', customer, 'custentity_ps_adjust_rate');
                        var customerName = nlapiLookupField('customer', customer, 'altname');
                        var createdFrom = nlapiLookupField('salesorder', so_num, 'tranid');



                        invoices_after_created.push({
                            tranid: tranid,
                            id: invoiceID,
                            so: so_num,
                            so_tranid: createdFrom,
                            customer: customerName,

                        });

                        var newLineCount = incoice_rec.getLineItemCount('item');

                        var InvId = incoice_rec.getId();

                        var be_amount = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_amount')
                        var be_lne_id = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_order_line_id')
                        var be_invoice_number = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_num_of_invoices')
                        var be_sequence_number = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_sequence_number')
                        var so_original_qty = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_so_original_quantity')
                        var be_from_date = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_from_date')
                        var be_to_date = nlapiLookupField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_to_date')

                        nlapiSubmitField('customrecord_billing_entity', be_ids_array[x], 'custrecord_be_invoice_number', InvId)

                        for (var h = 1; h <= newLineCount; h++) {

                            if (checkIfAdjust == 'T' && currency != 'USD' && subsidiary == '22') {

                                var tranDate = incoice_rec.getFieldValue('trandate');
                                var newExRate = nlapiExchangeRate(currency, 'USD', tranDate);
                                var salesPrice = incoice_rec.getLineItemValue('item', 'custcol_cbr_so_original_unit_price', h)
                                if (newExRate != '' && newExRate != null && salesPrice != '' && salesPrice != null) {
                                    var new_rate = parseFloat(salesPrice) / parseFloat(newExRate)
                                    incoice_rec.setLineItemValue('item', 'rate', h, new_rate)
                                }

                            }

                            if (be_lne_id == incoice_rec.getLineItemValue('item', 'orderline', h)) {
                                if (be_invoice_number != be_sequence_number) {  // last invoice for this item
                                    var qty = incoice_rec.getLineItemValue('item', 'quantity', h);
                                    var amount = incoice_rec.getLineItemValue('item', 'amount', h);
                                    if (amount != '0' && amount != '0.00' && !isNullOrEmpty(amount)) {
                                        var newQty = (be_amount / amount) * qty;
                                        nlapiLogExecution('DEBUG', 'newQty', newQty);
                                        incoice_rec.setLineItemValue('item', 'quantity', h, addZeroes(newQty.toString())); // qty
                                        nlapiLogExecution('DEBUG', 'addZeroes(newQty.toString()()', addZeroes(newQty.toString()));
                                    }
                                    incoice_rec.setLineItemValue('item', 'amount', h, be_amount); //amount
                                    incoice_rec.setLineItemValue('item', 'custcol_cbr_start_date', h, be_from_date);//be_from_date
                                    incoice_rec.setLineItemValue('item', 'custcol_cbr_end_date', h, be_to_date);//be_to_date


                                }
                                else {
                                    incoice_rec.setLineItemValue('item', 'amount', h, be_amount); //amount
                                    incoice_rec.setLineItemValue('item', 'custcol_cbr_start_date', h, be_from_date);//be_from_date
                                    incoice_rec.setLineItemValue('item', 'custcol_cbr_end_date', h, be_to_date);//be_to_date
                                }

                                incoice_rec.setLineItemValue('item', 'custcol_orig_order_qty', h, so_original_qty);


                            }


                        }




                    }

                } // for update qty and original qty - 

                nlapiSubmitRecord(incoice_rec);




                ///

                //invoiceID = nlapiSubmitRecord(invRec);



                nlapiLogExecution('DEBUG', 'invoiceID()', invoiceID);
                delete_item = [];
                nlapiLogExecution('DEBUG', 'delete_item', delete_item);
            } catch (e) {
                nlapiLogExecution('DEBUG', 'createInvoice in for (): ' + so_num, e);
                //console.log(e)
            }
        }
        return invoices_after_created;

    } catch (err) {
        nlapiLogExecution('DEBUG', 'createInvoice()', err);
        //console.log(err)

    }
}

/*
Be_To_Invoice = [
{"so":"2990567","be_id":"2","item_id":"3579","line_id":"1","billing_date":"8/10/2019","fron_date":"8/10/2019","to_date":"7/11/2019"}
,{"so":"15841","be_id":"119","item_id":"578","line_id":"1","billing_date":"24/10/2019","fron_date":"24/10/2019","to_date":"23/8/2020"}
,{"so":"15841","be_id":"129","item_id":"573","line_id":"4","billing_date":"24/10/2019","fron_date":"24/10/2019","to_date":"23/8/2020"}
,{"so":"15841","be_id":"139","item_id":"569","line_id":"6","billing_date":"24/10/2019","fron_date":"24/10/2019","to_date":"23/8/2020"}
,{"so":"13684","be_id":"23","item_id":"496","line_id":"1","billing_date":"24/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"35","item_id":"454","line_id":"2","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"47","item_id":"373","line_id":"3","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"59","item_id":"401","line_id":"4","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"71","item_id":"415","line_id":"5","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"83","item_id":"412","line_id":"6","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"95","item_id":"433","line_id":"7","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"13684","be_id":"107","item_id":"413","line_id":"8","billing_date":"23/10/2019","fron_date":"23/10/2019","to_date":"22/10/2020"}
,{"so":"15838","be_id":"148","item_id":"572","line_id":"2","billing_date":"2/10/2019","fron_date":"2/10/2019","to_date":"2/10/2019"}]
*/

//Be_To_Invoice =[
//{ "be_id": "282", "item": "3350", "itemNmae": "MAINT - EU24X7 - Renewal", "line_id": "1", "billing_date": "4 / 10 / 2020", "from_date": "4 / 4 / 2020", "to_date": "3 / 4 / 2021", "amount": "3002.33", "sales_order": "4590299", "tranid": "SOGBR504678" },
//{ "be_id": "738", "item": "3596", "itemNmae": "PAS - USER - SUBS", "line_id": "1", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "148333.33", "sales_order": "4905483", "tranid": "SOUSA509818" },
//{ "be_id": "741", "item": "586", "itemNmae": "MAINT - TBL - 24X7(VI)", "line_id": "2", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "0", "sales_order": "4905483", "tranid": "SOUSA509818" },
//{ "be_id": "744", "item": "586", "itemNmae": "MAINT - TBL - 24X7(VI)", "line_id": "3", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "0", "sales_order": "4905483", "tranid": "SOUSA509818" },
//{ "be_id": "747", "item": "3736", "itemNmae": "PS - TAM", "line_id": "1", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "86400", "sales_order": "4905484", "tranid": "SOUSA509817" },
//{ "be_id": "749", "item": "3834", "itemNmae": "PREMIUM - SUPPORT", "line_id": "2", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "85500", "sales_order": "4905484", "tranid": "SOUSA509817" },
//{ "be_id": "751", "item": "4321", "itemNmae": "IAMFA - B2E - USER - SAAS", "line_id": "3", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "43350", "sales_order": "4905484", "tranid": "SOUSA509817" },
//{ "be_id": "753", "item": "4312", "itemNmae": "IASSO - B2E - USER - SAAS", "line_id": "4", "billing_date": "4 / 10 / 2020", "from_date": "4 / 10 / 2020", "to_date": "4 / 10 / 2020", "amount": "34680", "sales_order": "4905484", "tranid": "SOUSA509817" }
//]
function sort (Be_To_Invoice){



		//Be_To_Invoice.sort(function(a, b){
		//	var aa = a.billing_date.split('/').reverse().join(),
		//		bb = b.billing_date.split('/').reverse().join();
		//	return aa > bb ? -1 : (aa < bb ? 1 : 0);
		//	});

			var count=0;
			var bill_date ;
			var bill_so;
			var array ='';
			var be_id ='';
			var Be_To_Invoice_Sort =[];
	
		for (var i =0 ; i<Be_To_Invoice.length;i++){
			
			if (i == 0){
				count += 1;
				array += Be_To_Invoice[i].line_id+',';
				be_id += Be_To_Invoice[i].be_id+',';

			}			
            else if (bill_date == Be_To_Invoice[i].billing_date && bill_so == Be_To_Invoice[i].so){
				count += 1;
				array +=  ','+Be_To_Invoice[i].line_id ;
				be_id += ','+Be_To_Invoice[i].be_id;
			}		
			else{
				Be_To_Invoice_Sort.push({
						sales_order : bill_so,
						date: bill_date,
						countt: count,
						lines :array,
						be_ids: be_id,
					});
					array= Be_To_Invoice[i].line_id;
					be_id= Be_To_Invoice[i].be_id;
					count = 1;
			}
			bill_date= Be_To_Invoice[i].billing_date;
            bill_so = Be_To_Invoice[i].so;
			
			
		}	
		Be_To_Invoice_Sort.push({
			sales_order : bill_so,
			date: bill_date,
			countt: count,
			lines :array,
			be_ids : be_id,
		});


		nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort', JSON.stringify(Be_To_Invoice_Sort));		

		return Be_To_Invoice_Sort;
		
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function addZeroes(num) {
    var value = Number(num);
    var res = num.split(".");
    if (res[1] != undefined) {
        if (res[1].length > 4) {
            value = value.toFixed(4);
        }
    }
    return value
}

function dedupe(arr) {
    return arr.reduce(function (p, c) {

        // create an identifying id from the object values
        var id = [c.trnnid, c.id].join('|');

        // if the id is not found in the temp array
        // add the object to the output array
        // and add the key to the temp array
        if (p.temp.indexOf(id) === -1) {
            p.out.push(c);
            p.temp.push(id);
        }
        return p;

        // return the deduped array
    }, {
            temp: [],
            out: []
        }).out;
}

function email(data) {
    try {

        var subject = "Invoices List ";
        var body = "<h3><span style='color:blue; font-weight: bold ;'>Invoices List : </span><br></h3>";

        var list = "<table border=1>";
        // for th
        list += "<tr> <th> Customer</th> <th> Sale Order</th> <th> Invoice</th>"
        for (v in data) {
            list += "<tr><td>" + data[v].customer + "</td><td>" + '<a href="' + getUrl('salesord', data[v].so) + '" rel="link">' + data[v].so_tranid + '</a>' + "</td> <td>" + '<a href="' + getUrl('custinvc', data[v].id) + '" rel="link">' + data[v].tranid + "</td></tr> "
        }
        list += "</table>"

        body += list;
 
        var attachRec = new Object();
        attachRec['employee'] = '375465' //attach email to customer record   
        try { nlapiSendEmail('375465', 'test@gmail.co.il', subject, body, null, null, attachRec, null, false); }
        catch (e) {
            nlapiLogExecution('DEBUG', 'error', e);
        }
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }

}

function getUrl(type , id) {
    var company = nlapiGetContext().company;
    company = company.replace('_', '-');
    var res = 'https://' + company + '.app.netsuite.com/app/accounting/transactions/' + type + '.nl?id='+id;
    return res;
}

function Context(context) {

    //nlapiLogExecution('DEBUG', 'context.getRemainingUsage()', context.getRemainingUsage());
    if (context.getRemainingUsage() < 1250) {
        nlapiLogExecution('DEBUG', 'Context', context.getRemainingUsage());
        //nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

}