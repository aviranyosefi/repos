
var resForBill = [];


function create_invoice(request, response){

    if (request.getMethod() == 'GET') {
        
		nlapiLogExecution('DEBUG', 'stage one', 'stage one');
		
		//var salesorderId = request.getParameter('Soid');
		//var salesordertranid = request.getParameter('tranid');

        var form = nlapiCreateForm('Please Select Details');
      
		form.addSubmitButton('Submit');
	
		//var SO_NO = form.addField('custpage_saleorder', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		//SO_NO.setDefaultValue("<p style='font-size:20px; color:blue'>Sale Order # : "+ salesordertranid +"<br></p>");
     
		form.addFieldGroup('custpage_ilo_searchdetails', 'Details');

		
		var fromDate = form.addField('custpage_ilo_multi_fromdate', 'date', 'From Date', null, 'custpage_ilo_searchdetails');
		fromDate.setMandatory(true);

		var toDate = form.addField('custpage_ilo_multi_todate', 'date', 'To Date', null, 'custpage_ilo_searchdetails');
		toDate.setMandatory(true);
		
		var selectSubsidiary = form.addField('custpage_ilo_multi_subsidiary', 'select', 'Subsidary', 'SUBSIDIARY', 'custpage_ilo_searchdetails');
        //selectSubsidiary.setMandatory(true);

		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
		checkStage.setDefaultValue('stageOne');
		checkStage.setDisplayType('hidden');
		
		response.writePage(form);
	}
	else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') {
	
		nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');	
		
		var second = nlapiCreateForm('Billing Entity List');
		second.addSubmitButton('Submit');

		var inp_fromDate = request.getParameter('custpage_ilo_multi_fromdate');
		var inp_toDate = request.getParameter('custpage_ilo_multi_todate');
		var inp_subsidiary = request.getParameter('custpage_ilo_multi_subsidiary');
		search_Billing(inp_fromDate, inp_toDate ,inp_subsidiary);
		// sublist - start
		//var resultsSubList = form.addSubList('custpage_results_sublist', 'inlineeditor', 'Billing Entity Results', null);
		var resultsSubList = second.addSubList('custpage_results_sublist', 'list', 'Billing Entity Results', null);
		
		resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

		resultsSubList.addField('custpage_resultssublist_be_tranid', 'text', 'Sales Order');

		resultsSubList.addField('custpage_resultssublist_be_order', 'text', 'Sales Order').setDisplayType('hidden');;
		  
		resultsSubList.addField('custpage_resultssublist_be_id', 'text', 'BE ID');
		
        resultsSubList.addField('custpage_resultssublist_item', 'text', 'Item');
		
		resultsSubList.addField('custpage_resultssublist_item_id', 'text', 'ID').setDisplayType('hidden');
		
		resultsSubList.addField('custpage_resultssublist_line_id', 'text', 'Line ID');
		
		resultsSubList.addField('custpage_resultssublist_be_billing_date', 'text', 'Billing Date');
		
		resultsSubList.addField('custpage_resultssublist_be_from_date', 'text', 'From Date');
		
		resultsSubList.addField('custpage_resultssublist_be_to_date', 'text', 'To Date');

		resultsSubList.addField('custpage_resultssublist_be_amount', 'text', 'Amount');
		
	
		for(var i=0 ; i<resForBill.length ;i++ ){
		
			resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', i + 1, 'T');			
			resultsSubList.setLineItemValue('custpage_resultssublist_be_tranid', i + 1, resForBill[i].tranid);	
			resultsSubList.setLineItemValue('custpage_resultssublist_be_order', i + 1, resForBill[i].sales_order);	
			resultsSubList.setLineItemValue('custpage_resultssublist_be_id', i + 1, resForBill[i].be_id);
			resultsSubList.setLineItemValue('custpage_resultssublist_item', i + 1, resForBill[i].itemNmae);
			resultsSubList.setLineItemValue('custpage_resultssublist_item_id', i + 1, resForBill[i].item);				
			resultsSubList.setLineItemValue('custpage_resultssublist_line_id', i + 1, resForBill[i].line_id);
			resultsSubList.setLineItemValue('custpage_resultssublist_be_billing_date', i + 1, resForBill[i].billing_date );
			resultsSubList.setLineItemValue('custpage_resultssublist_be_from_date', i + 1, resForBill[i].from_date);
			resultsSubList.setLineItemValue('custpage_resultssublist_be_to_date', i + 1, resForBill[i].to_date);
			resultsSubList.setLineItemValue('custpage_resultssublist_be_amount', i + 1, formatNumber(resForBill[i].amount));
		
					
		}
		resultsSubList.addMarkAllButtons(); 
		// sublist - end
		
		// sales order number
		//var sales_order = second.addField('custpage_ilo_sales_order', 'text', 'check', null, null);
		//sales_order.setDefaultValue(salesorderId);
        //sales_order.setDisplayType('hidden');

		var checkStage = second.addField('custpage_ilo_check_stage', 'text', 'check', null, null);
		checkStage.setDefaultValue('stageTwo');
        checkStage.setDisplayType('hidden');
			
        response.writePage(second);

	}
	
	else if (request.getParameter('custpage_ilo_check_stage') == 'stageTwo') {

		nlapiLogExecution('DEBUG', 'stage 3', 'stage 3');		
		var SecondForm = nlapiCreateForm('The invoices will be created');
		var Be_To_Invoice = [];
		
		var sublist_number = request.getLineItemCount('custpage_results_sublist');
		//var sales_order = request.getParameter('custpage_ilo_sales_order');

		for (var i = 1; i <= sublist_number; i++)
		{          
			checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i); 
			if (checkBox == 'T'){
				Be_To_Invoice.push({
					
					so : request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_order', i),
					be_id : request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_id', i),
					item_id:	request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_item_id', i),
					line_id : request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_line_id', i),
					billing_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_billing_date', i),
					fron_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_from_date', i),
					to_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_to_date', i),
					

				});	
			}
		}
		
		nlapiLogExecution('DEBUG', 'Be_To_Invoice', JSON.stringify(Be_To_Invoice));	
		
		nlapiScheduleScript('customscript_dev_global_create_invoice_s', 'customdeploy_global_create_invoice_dep',
                { custscript_ss_invoices_data: JSON.stringify(Be_To_Invoice)});
		
	


	
		
		response.writePage(SecondForm);


	}


    
}



//functions



// search_Billing(13627,466 ,2)
function search_Billing(inp_fromDate , inp_toDate ,inp_subsidiary ) 
{

	try{
			var filtersInvoice = new Array();
			//filtersInvoice[0] = new nlobjSearchFilter('custrecord_be_order', null, 'is', SO_ID);
			filtersInvoice[0] = new nlobjSearchFilter('custrecord_be_invoice_number', null, 'anyof', '@NONE@');
			filtersInvoice[1] = new nlobjSearchFilter('custrecord_be_billing_date', null, 'onorafter', inp_fromDate);
			filtersInvoice[2] = new nlobjSearchFilter('custrecord_be_billing_date', null, 'onorbefore', inp_toDate);
			//filtersInvoice[3] = new nlobjSearchFilter('custrecord_be_subsidiary', null, 'is', inp_subsidiary)
			

            var columnsInvoice = new Array();
            columnsInvoice[0] = new nlobjSearchColumn('custrecord_be_sequence_number');
            columnsInvoice[1] = new nlobjSearchColumn('custrecord_be_item');
            columnsInvoice[2] = new nlobjSearchColumn('custrecord_be_order_line_id');          
			columnsInvoice[3] = new nlobjSearchColumn('custrecord_be_order');
			columnsInvoice[4] = new nlobjSearchColumn('custrecord_be_billing_date');
			columnsInvoice[5] = new nlobjSearchColumn('custrecord_be_from_date');
			columnsInvoice[6] = new nlobjSearchColumn('custrecord_be_to_date');
			columnsInvoice[7] = new nlobjSearchColumn('custrecord_be_amount');
			
			

			var search = nlapiCreateSearch('customrecord_billing_entity', filtersInvoice, columnsInvoice);
			var runSearch = search.runSearch();
			var results = [];
			var resultslice = runSearch.getResults(0,  1000);
				
				for (var rs in resultslice) {
					results.push(resultslice[rs]);					
                }


              
                var last;
                for(var i=0;i<results.length;i++){

						var tranid = nlapiLookupField ( 'salesorder' , results[i].getValue('custrecord_be_order') , 'tranid' ) 
                        resForBill.push({
							
								be_id : results[i].id,
								item :results[i].getValue('custrecord_be_item'),
								itemNmae :  results[i].getText('custrecord_be_item'),							
								line_id :results[i].getValue('custrecord_be_order_line_id'),
								billing_date:results[i].getValue('custrecord_be_billing_date'),
								from_date: results[i].getValue('custrecord_be_from_date'),
								to_date: results[i].getValue('custrecord_be_to_date'),
								amount: results[i].getValue('custrecord_be_amount'),
								sales_order: results[i].getValue('custrecord_be_order'),
								tranid : tranid
								
							});
						}
                
			

				resForBill.sort(function(a, b){
					var aa = a.billing_date.split('/').reverse().join(),
						bb = b.billing_date.split('/').reverse().join();
					return aa > bb ? -1 : (aa < bb ? 1 : 0);
					});

	}catch(err){
		nlapiLogExecution('ERROR', 'search_Billing', err);
	}

}



function createInvoice(Be_To_Invoice){

	try{
		var invoices_after_created =[] ;
		var  line_id;
		
		var Be_To_Invoice_Sort = sort(Be_To_Invoice);

		var delete_item=[];
		nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort ', Be_To_Invoice_Sort.length);		
		
		for(var i=0;i<Be_To_Invoice_Sort.length;i++){
			var count = Be_To_Invoice_Sort[i].countt;
			
				var invRec= nlapiTransformRecord('salesorder', Be_To_Invoice_Sort[i].sales_order, 'invoice');	
				invRec.setFieldValue('trandate', Be_To_Invoice_Sort[i].date);			
				
				var lineCount = invRec.getLineItemCount('item');
				nlapiLogExecution('DEBUG', 'lineCount ' + i , lineCount);	
				
				var be_ids = Be_To_Invoice_Sort[i].be_ids;
				var be_ids_array = be_ids.split(",")
			

				var lines_id = Be_To_Invoice_Sort[i].lines;
				var lines_id_array = lines_id.split(",")
				nlapiLogExecution('DEBUG', 'lines_id_array.length ' , lines_id_array.length);	
				
				for (x=0; x < lines_id_array.length;x++){
				
					if(lines_id_array[x] != ''){ 
						
						if (x == 0){

							for (var j=1;j<=lineCount;j++){
								line_id =  invRec.getLineItemValue('item', 'custcol_cbr_custom_line_id', j);							
								if(line_id !=  lines_id_array[x] ){					
									delete_item.push(line_id);
								}
							}
						}
							
						else{
				
							for (var j=0;j< delete_item.length;j++){
								if (lines_id_array[x] ==  delete_item[j] ){
									delete_item.splice(j, 1) 
								}							   
						}

						}
				
					}
				}
				
					// delete rows - start
					for (var j=lineCount ; j>= 1 ; j--){
						for (var a =0 ;a<delete_item.length;  a++) {					
							if( invRec.getLineItemValue('item', 'custcol_cbr_custom_line_id', j) == delete_item[a] )
								{
									invRec.removeLineItem('item', j);
								}							
						}				
					}
					// delete rows - end
			
					
			
				nlapiLogExecution('DEBUG', 'delete_item ', delete_item);
				
				///
				invoiceID = nlapiSubmitRecord(invRec);
				
				
				/// for update qty and original qty - start
				for (x=0; x < be_ids_array.length;x++){
					
					if(be_ids_array[x] != ''){

						var incoice_rec = nlapiLoadRecord('invoice',invoiceID);
						var tranid = incoice_rec.getFieldValue('tranid');
						var currency = incoice_rec.getFieldValue('currencysymbol')
						var subsidiary = incoice_rec.getFieldValue('subsidiary');
						var customer = incoice_rec.getFieldValue('entity');
						var checkIfAdjust = nlapiLookupField('customer', customer, 'custentity_ps_adjust_rate');

					

						invoices_after_created.push(tranid);
						
						var newLineCount = incoice_rec.getLineItemCount('item');
					
						var InvId = incoice_rec.getId();
							
						var be_amount = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_amount' ) 
						var be_lne_id = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_order_line_id' ) 
						var be_invoice_number = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_num_of_invoices' ) 
						var be_sequence_number = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_sequence_number' ) 
						var so_original_qty = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_so_original_quantity' )
						var be_from_date = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_from_date' )
						var be_to_date = nlapiLookupField ( 'customrecord_billing_entity' , be_ids_array[x] , 'custrecord_be_to_date' )
					
						
						

						
						nlapiSubmitField ( 'customrecord_billing_entity' , be_ids_array[x]  , 'custrecord_be_invoice_number' , InvId )
							
						for(var h=1;h<=newLineCount;h++){

							if(checkIfAdjust == 'T' && currency !='USD' && subsidiary == '22' ){

								var tranDate = incoice_rec.getFieldValue('trandate');
								var newExRate = nlapiExchangeRate(currency,'USD' , tranDate);
								var salesPrice = incoice_rec.getFieldItemValue('item', 'custcol_cbr_so_original_unit_price', h)
								if(newExRate !='' && newExRate !=null && salesPrice !='' && salesPrice !=null ){
								}
	
							}

							if (be_lne_id == incoice_rec.getLineItemValue('item', 'custcol_cbr_custom_line_id', h)){																				
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
								
								incoice_rec.setLineItemValue('item', 'custcol_orig_order_qty', h ,so_original_qty);

								nlapiSubmitRecord(incoice_rec);
							}
						
						}
						
					
						
					}
					
				} /// for update qty and original qty - end
				
			
			 

				///

				//invoiceID = nlapiSubmitRecord(invRec);

				
				
				nlapiLogExecution('DEBUG', 'invoiceID()', invoiceID);	
				delete_item= [];
				nlapiLogExecution('DEBUG', 'delete_item', delete_item);
		}
		return invoices_after_created;

	}catch(err){
		nlapiLogExecution('DEBUG', 'createInvoice()', err);	
			
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
function sort (Be_To_Invoice){



		Be_To_Invoice.sort(function(a, b){
			var aa = a.billing_date.split('/').reverse().join(),
				bb = b.billing_date.split('/').reverse().join();
			return aa > bb ? -1 : (aa < bb ? 1 : 0);
			});

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
			else if (bill_date ==Be_To_Invoice[i].billing_date &&  bill_so == Be_To_Invoice[i].so){
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

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}