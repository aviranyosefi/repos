/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Jun 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */




	var PO_id = '';
	var billsTotals = [];

function beforeLoad_poBalance() {
	

	
	var html = '<SCRIPT language="JavaScript" type="text/javascript">';
	html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){'; html += 'function getPO_id(){for(var i=document.location.search.split("&"),t=/id/,e=0;e<i.length;e++)if(1==t.test(i[e])){var d=i[e];nlapiSetFieldValue("custbody_ilo_po_internal_id_hidden",d)}}getPO_id();'; html += '});'; html += '</SCRIPT>';
	// push a dynamic field into the environment
	var field0 = form.addField('custpage_alertmode', 'inlinehtml', '',null,null); field0.setDefaultValue(html);
	
	//nlapiLogExecution('DEBUG', 'before-load func', PO_id);
}


function getRemaining_PO_balance_AS(type) {
	
	
	var a = nlapiGetFieldValue('custbody_ilo_po_internal_id_hidden');
	
	var numberPattern = /\d+/g;

	var IDarr = a.match(numberPattern);

	PO_id = IDarr[0];
	
	

	if (type == 'create') {

		var session_country = nlapiGetFieldValue('nexus_country');
		if (session_country == 'IL') {
			
			if(PO_id != undefined || null || "") {
						

			function updatePOremaining(poId) {
				
				try{

			var filters = new Array();
			filters[0] = new nlobjSearchFilter('createdfrom', null, 'is', poId);
			filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');

			var cols = new Array();
			cols[0] = new nlobjSearchColumn('total');
			cols[1] = new nlobjSearchColumn('internalid');

			var bills = nlapiSearchRecord('vendorbill', null, filters, cols);
			




									if (bills != null) {
							bills.forEach(function(line) {

								billsTotals.push({

									internalid : line.getValue('internalid'),
									total : parseFloat(line.getValue('total'))

								});

							});

						};
						

						var tots = [];

						for (var i = 0; i < billsTotals.length; i++) {
							tots.push(billsTotals[i].total);
						}

						//tots.push(getCurrentAmt); // add new amount to totals

						var sumTotals = tots.reduce(add, 0);
						
						
					
						var poRec = nlapiLoadRecord('purchaseorder', PO_id);

						var PO_Total = poRec.getFieldValue('total');
						var exrate = poRec.getFieldValue('exchangerate');

						var PO_Total_USD = parseFloat(PO_Total) * parseFloat(exrate);

						//subtract paid totals from total of PO
						var remaining_USD = parseFloat(PO_Total_USD) - sumTotals;



						nlapiSubmitField('purchaseorder', PO_id,
								'custbody_ilo_po_remaining', remaining_USD.toFixed(2));

						
					} catch (err) {
						nlapiLogExecution('DEBUG', 'err', err);
					}

				}

				// call the function with internal id of Purchase Order
				updatePOremaining(PO_id);

			}


		}
	}

}
  


function add(a, b) {
    return a + b;
}