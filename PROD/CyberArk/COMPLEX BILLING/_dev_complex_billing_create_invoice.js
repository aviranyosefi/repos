
var resForBill = [];


function create_invoice(request, response){

    if (request.getMethod() == 'GET') {
        
		nlapiLogExecution('DEBUG', 'stage one', 'stage one');
		
		var salesorderId = request.getParameter('Soid');
		var salesordertranid = request.getParameter('tranid');

        var form = nlapiCreateForm('Select Billing Entity');
      
		form.addSubmitButton('Submit');
	
		var SO_NO = form.addField('custpage_saleorder', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
		SO_NO.setDefaultValue("<p style='font-size:20px; color:blue'>Sale Order # : "+ salesordertranid +"<br></p>");
     
		form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
		
        search_Billing(salesorderId);
        nlapiLogExecution('DEBUG', 'resForBill', resForBill.length);
		// sublist - start
		//var resultsSubList = form.addSubList('custpage_results_sublist', 'inlineeditor', 'Billing Entity Results', null);
		var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Billing Entity Results', null);
		
		resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');
		  
		resultsSubList.addField('custpage_resultssublist_be_id', 'text', 'BE ID');
		
        resultsSubList.addField('custpage_resultssublist_item', 'text', 'Item');
		
		resultsSubList.addField('custpage_resultssublist_item_id', 'text', 'ID').setDisplayType('hidden');
		
		resultsSubList.addField('custpage_resultssublist_line_id', 'text', 'Line ID');
		
		resultsSubList.addField('custpage_resultssublist_be_billing_date', 'text', 'Billing Date');
		
		resultsSubList.addField('custpage_resultssublist_be_from_date', 'text', 'From Date');
		
		resultsSubList.addField('custpage_resultssublist_be_to_date', 'text', 'To Date');

		resultsSubList.addField('custpage_resultssublist_be_amount', 'text', 'Amount');
		
        var line = 1;
		for(var i=0 ; i<resForBill.length ;i++ ){
			
			var checked = ifDateInThisPeriod(resForBill[i].billing_date);
            if (checked != 'H') {
                
                resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', line, checked);	
                resultsSubList.setLineItemValue('custpage_resultssublist_be_id', line, resForBill[i].be_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_item', line, resForBill[i].itemNmae);
                resultsSubList.setLineItemValue('custpage_resultssublist_item_id', line, resForBill[i].item);				
                resultsSubList.setLineItemValue('custpage_resultssublist_line_id', line, resForBill[i].line_id);
                resultsSubList.setLineItemValue('custpage_resultssublist_be_billing_date', line, resForBill[i].billing_date );
                resultsSubList.setLineItemValue('custpage_resultssublist_be_from_date', line, resForBill[i].from_date);
                resultsSubList.setLineItemValue('custpage_resultssublist_be_to_date', line, resForBill[i].to_date);
                resultsSubList.setLineItemValue('custpage_resultssublist_be_amount', line, formatNumber(resForBill[i].amount));
                line += 1;
			}						
		}
		// sublist - end
		
		// sales order number
		var sales_order = form.addField('custpage_ilo_sales_order', 'text', 'check', null, 'custpage_ilo_searchdetails');
		sales_order.setDefaultValue(salesorderId);
        sales_order.setDisplayType('hidden');

		var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
		checkStage.setDefaultValue('stageOne');
        checkStage.setDisplayType('hidden');
			
        response.writePage(form);

	}
	
	else if (request.getParameter('custpage_ilo_check_stage') == 'stageOne') {

		nlapiLogExecution('DEBUG', 'stage 2', 'stage 2');		
		var SecondForm = nlapiCreateForm('Invoice List');
		var Be_To_Invoice = [];
		
		var sublist_number = request.getLineItemCount('custpage_results_sublist');
		var sales_order = request.getParameter('custpage_ilo_sales_order');

		for (var i = 1; i <= sublist_number; i++)
		{          
			checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', i); 
			if (checkBox == 'T'){
				
				var be_id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_id', i)
				var invoice = nlapiLookupField ( 'customrecord_billing_entity' , be_id , 'custrecord_be_invoice_number'  )
					
				if (invoice =='' || invoice == null || invoice == undefined){
				
					Be_To_Invoice.push({
						
						so :sales_order,
						be_id : be_id,
						item_id:request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_item_id', i)	,
						line_id : request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_line_id', i),
						billing_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_billing_date', i),
						fron_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_from_date', i),
						to_date: request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_be_to_date', i),
						

					});
				}				
			}
		}
		
		nlapiLogExecution('DEBUG', 'Be_To_Invoice: ' + Be_To_Invoice.length, JSON.stringify(Be_To_Invoice));		
		
		var invoices_after_created = [];
		if( Be_To_Invoice.length > 0){
			invoices_after_created =createInvoice(Be_To_Invoice);
		}
		else{
			nlapiLogExecution('DEBUG', 'else ' , JSON.stringify(Be_To_Invoice));	
			var invoicesList = SecondForm.addField('custpage_ilo_checkbox_num', "inlinehtml", "", null, null)//.setLayoutType('outside', 'startrow');
				invoicesList.setDefaultValue( '<h1 style="color:red;font-size:50px" >You have not selected records to create an invoice </h1>'); //url of pdf from filecabinet			
		}

		//var unique = invoices_after_created.filter(function(elem, index, self) {
		//	return index === self.indexOf(elem);
		//})
		if(invoices_after_created != null &&  invoices_after_created.length >0){
			var res= dedupe(invoices_after_created)


			nlapiLogExecution('DEBUG', 'invoices_after_created.length: ' + invoices_after_created.length, invoices_after_created);		
			if (res.length > 0){
				
				for (var i=0; i<res.length ;i++){
					var invoice =   res[i].tranid;
					var id = res[i].id;
				
					var field_id ="custpage_ilo_download_invoices"+i;
					var invoicesList = SecondForm.addField(field_id, "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
					invoicesList.setDefaultValue('<font size="3"><a style="color:blue;font-size:3"target="_blank" href =https://4678143.app.netsuite.com/app/accounting/transactions/custinvc.nl?id=' +id + '><b>'+invoice+'</b></a>'); //url of pdf from filecabinet
					
					if (!checkPeriodValidation( id)){
						var error_field_id ="custpage_ilo_error"+i;
						var errorMessage = SecondForm.addField(error_field_id, "inlinehtml", "", null, null).setLayoutType('outside', 'startrow');
						errorMessage.setDefaultValue('<h1 style="color:red;font-size:50px" > The invoice date is not the same as the period </h1>'); //url of pdf from filecabinet	
						
					}
				}
			}

		
			
		}
	

	
		
		response.writePage(SecondForm);


	}


    
}



//functions



// search_Billing(13627,466 ,2)
function search_Billing(SO_ID) 
{
	try{
			var filtersInvoice = new Array();
			filtersInvoice[0] = new nlobjSearchFilter('custrecord_be_order', null, 'is', SO_ID);
			filtersInvoice[1] = new nlobjSearchFilter('custrecord_be_invoice_number', null, 'anyof', '@NONE@');
			

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

                    if (i ==0){
                        resForBill.push({
							
								be_id : results[i].id,
								item :results[i].getValue('custrecord_be_item'),
								itemNmae :  results[i].getText('custrecord_be_item'),							
								line_id :results[i].getValue('custrecord_be_order_line_id'),
								billing_date:results[i].getValue('custrecord_be_billing_date'),
								from_date: results[i].getValue('custrecord_be_from_date'),
								to_date: results[i].getValue('custrecord_be_to_date'),
								amount: results[i].getValue('custrecord_be_amount'),
							});
                    }
                    else{
                        last = results[i].getValue('custrecord_be_order_line_id');
                        if (last != results[i-1].getValue('custrecord_be_order_line_id')){
                            resForBill.push({
								
								be_id : results[i].id,
								item :results[i].getValue('custrecord_be_item'),
								itemNmae :  results[i].getText('custrecord_be_item'),							
								line_id :results[i].getValue('custrecord_be_order_line_id'),
								billing_date:results[i].getValue('custrecord_be_billing_date'),
								from_date: results[i].getValue('custrecord_be_from_date'),
								to_date: results[i].getValue('custrecord_be_to_date'),
								amount: results[i].getValue('custrecord_be_amount'),

								});
                        }                       
                    }                   
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
		var so_num = Be_To_Invoice[0].so;
		var Be_To_Invoice_Sort = sort(Be_To_Invoice);

		var delete_item=[];
		nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort ', Be_To_Invoice_Sort.length);		
		
		for(var i=0;i<Be_To_Invoice_Sort.length;i++){
			var count = Be_To_Invoice_Sort[i].countt;
			
				var invRec= nlapiTransformRecord('salesorder', so_num, 'invoice');	
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
								line_id =  invRec.getLineItemValue('item', 'orderline', j);							
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
							if( invRec.getLineItemValue('item', 'orderline', j) == delete_item[a] )					
								{
								
									invRec.removeLineItem('item', j);
								}							
						}				
					}
					// delete rows - end
			
					
			
				nlapiLogExecution('DEBUG', 'delete_item ', delete_item);
				
				///
				invoiceID = nlapiSubmitRecord(invRec);
				
				var incoice_rec = nlapiLoadRecord('invoice',invoiceID);
				/// for update qty and original qty - start
				for (x=0; x < be_ids_array.length;x++){
					
					if(be_ids_array[x] != ''){

						
						var tranid = incoice_rec.getFieldValue('tranid');
						var currency = incoice_rec.getFieldValue('currencysymbol')
						var subsidiary = incoice_rec.getFieldValue('subsidiary');
						var customer = incoice_rec.getFieldValue('entity');
						var checkIfAdjust = nlapiLookupField('customer', customer, 'custentity_ps_adjust_rate');

					

						invoices_after_created.push({
							tranid:tranid,
							id: invoiceID,

						});
						
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
								var salesPrice = incoice_rec.getLineItemValue('item', 'custcol_cbr_so_original_unit_price', h)
								if(newExRate !='' && newExRate !=null && salesPrice !='' && salesPrice !=null ){
									var new_rate = parseFloat(salesPrice) / parseFloat(newExRate)
									incoice_rec.setLineItemValue('item', 'rate', h , new_rate)
								}
	
							}

							if (be_lne_id == incoice_rec.getLineItemValue('item', 'orderline', h)){																				
								if (be_invoice_number != be_sequence_number ){  // last invoice for this item
									var qty = incoice_rec.getLineItemValue('item', 'quantity', h);	
									var amount = incoice_rec.getLineItemValue('item', 'amount', h);
									if( amount != '0' && amount != '0.00'&& !isNullOrEmpty(amount)){
									var newQty = (be_amount / amount) * qty;
									    nlapiLogExecution('DEBUG', 'newQty', newQty);
										incoice_rec.setLineItemValue('item', 'quantity', h ,addZeroes(newQty.toString())); // qty
										nlapiLogExecution('DEBUG', 'addZeroes(newQty.toString()()', addZeroes(newQty.toString()));
									}
									incoice_rec.setLineItemValue('item', 'amount', h ,be_amount); //amount
									incoice_rec.setLineItemValue('item', 'custcol_cbr_start_date', h ,be_from_date);//be_from_date
									incoice_rec.setLineItemValue('item', 'custcol_cbr_end_date', h ,be_to_date);//be_to_date


								}
								else{
								incoice_rec.setLineItemValue('item', 'amount', h ,be_amount); //amount
								incoice_rec.setLineItemValue('item', 'custcol_cbr_start_date', h ,be_from_date);//be_from_date
								incoice_rec.setLineItemValue('item', 'custcol_cbr_end_date', h ,be_to_date);//be_to_date
								}
								
								incoice_rec.setLineItemValue('item', 'custcol_orig_order_qty', h ,so_original_qty);

								
							}
							
						
						}
						
						
					
						
					}
					
				} // for update qty and original qty - 
				
				nlapiSubmitRecord(incoice_rec);
				
			
			 

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
Be_To_Invoice = [{"so":"13627","item_id":"466","line_id":"1","billing_date":"20/9/2019","fron_date":"1/9/2019","to_date":"30/9/2019"},
{"so":"13627","item_id":"466","line_id":"2","billing_date":"20/10/2019","fron_date":"1/10/2019","to_date":"31/10/2019"},
{"so":"13627","item_id":"466","line_id":"3","billing_date":"20/10/2019","fron_date":"1/10/2019","to_date":"31/10/2019"}]
*/
function sort (Be_To_Invoice){



		Be_To_Invoice.sort(function(a, b){
			var aa = a.billing_date.split('/').reverse().join(),
				bb = b.billing_date.split('/').reverse().join();
			return aa > bb ? -1 : (aa < bb ? 1 : 0);
			});

			var count=0;
			var bill_date ;
			var array ='';
			var be_id ='';
			var Be_To_Invoice_Sort =[];
			
		for (var i =0 ; i<Be_To_Invoice.length;i++){
			
			if (i == 0){
				count += 1;
				array += Be_To_Invoice[i].line_id+',';
				be_id += Be_To_Invoice[i].be_id+',';

			}			
			else if (bill_date ==Be_To_Invoice[i].billing_date ){
				count += 1;
				array +=  ','+Be_To_Invoice[i].line_id ;
				be_id += ','+Be_To_Invoice[i].be_id;
			}
			else{
				Be_To_Invoice_Sort.push({

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
			
			
		}	
		Be_To_Invoice_Sort.push({
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

function dedupe(arr) {
	return arr.reduce(function(p, c) {
  
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
  
function addZeroes( num ) {
    var value = Number(num);
    var res = num.split(".");
	if(res[1] != undefined){
		if(res[1].length > 4) {
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

function ifDateInThisPeriod(dateTime){

    //var parts = dateTime.split(/[/]/);
    var parts = nlapiStringToDate(dateTime)

    var month = parts.getMonth() +1 ;
    var year = parts.getFullYear();

	var currentdate = new Date();
    var cur_month = currentdate.getMonth() + 1;
	var cur_year = currentdate.getFullYear();

	if (cur_month == month && year == cur_year) {
	  return 'T'
	} 
    else if (parseInt(year) <= parseInt(cur_year) && parseInt(month) <= parseInt(cur_month) || parseInt(year) <= parseInt(cur_year)){
        return 'F';      
	}
	else {
	  return 'H'
	}
}

function checkPeriodValidation(invoiceId){
	
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];

	var trandate = nlapiLookupField('invoice', invoiceId, 'trandate');
	trandate = nlapiStringToDate(trandate );
	var postingperiod = nlapiLookupField('invoice', invoiceId, 'postingperiod'  ,true );
	var month =  monthNames[trandate.getMonth()];
	var year = trandate.getFullYear();
	
	if ( month + ' ' + year != postingperiod  ){return false}
	else return true;
	
}