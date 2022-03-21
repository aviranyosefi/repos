/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Nov 2017     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function populate_approved_afterSubmit(type){
	
	var discountsArr = [];
	
	
	try{
	if(type == 'edit' || 'create') {
		
		
		var ctx = nlapiGetContext();
		var role = ctx.role;
		
		if(role != '14') {
			
	var lineCount = nlapiGetLineItemCount('item');
	var toCheck = [];
	var approved = [];
	
	for(var i = 1; i<=lineCount; i++) {
		
	var checkPriceLevel = nlapiGetLineItemValue('item', 'price', i);
	var checkLineAmt = nlapiGetLineItemValue('item', 'amount', i);
	var checkItem = nlapiGetLineItemValue('item', 'item', i);
	var checkRate = parseInt(nlapiGetLineItemValue('item', 'rate', i));
	var checkBasePrice = parseInt(nlapiGetLineItemValue('item', 'custcol_ilo_gal_ref_price', i));
	
	var percentGiven = nlapiGetLineItemValue('item', 'custcol_ilo_gal_discount_given', i);

	var itemBasePrice = nlapiLookupField('item', checkItem, 'baseprice');
	var getPercentage = GetPercentage(itemBasePrice, checkLineAmt);
	
	
	
	var empPrices = filterPriceLevels();
	var discountAllowed; 
	if(JSON.stringify(empPrices) != '[]') {
		discountAllowed = empPrices[0].percentage;
	}
	if(JSON.stringify(empPrices) == '[]') {
		discountAllowed = nlapiLookupField('employee', nlapiGetFieldValue('custbody_so_creator'), 'custentity_ilo_price_level_emp');
	}
				
			toCheck.push({
				amt: checkLineAmt,
				discountAllowed : parseInt(discountAllowed),
				percentDiscount : getPercentage,
				line : i,
				percentGiven : parseInt(percentGiven)
			})

	}
	
	nlapiLogExecution('debug', 'toCheck', JSON.stringify(toCheck))
	
		
		for(var x = 0; x<toCheck.length; x++) {
			
			if(toCheck[x].percentDiscount > toCheck[x].discountAllowed) {
				discountsArr.push(toCheck[x].percentGiven);
				approved.push('1');
			}
			
			if(toCheck[x].percentDiscount == toCheck[x].discountAllowed) {
				discountsArr.push(toCheck[x].percentGiven);
				approved.push('1');
			}
			
		}

	
	nlapiLogExecution('debug', 'approved', JSON.stringify(approved.length));
	nlapiLogExecution('debug', 'discountsArr', JSON.stringify(discountsArr));
	

	var discToApprove = getHighestDiscount(discountsArr);
	nlapiLogExecution('debug', 'discToApprove', discToApprove)
	
	var toSubmit = 0;
	
if(approved.length != 0) {
	
	toSubmit = 0;
	
}
	nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_ilo_discount_approved', discToApprove)
	}
		
		
	}
	}catch(err){
		nlapiSubmitField('salesorder', nlapiGetRecordId(), 'custbody_ilo_discount_approved', 0)
		nlapiLogExecution('debug', 'err', err)
		return true;
		
	}
}



function getPriceLevels() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');

	var s = nlapiSearchRecord('pricelevel', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				name : s[i].getValue('name'),
				internalid : s[i].id

			});

		}

	}

	return resultsArr;

}

function GetPercentage($oldFigure, $newFigure)
{
    var $percentChange = (($oldFigure - $newFigure) / $oldFigure) * 100;
    return parseInt(Math.abs($percentChange));
}


function filterPriceLevels() {
	var context = nlapiGetContext();
	var getCurrUser = context.user;

	var priceLevels = getPriceLevels()

	//console.log(priceLevels)
	var priceIDS = [];
	var empLevels = [];

	for (var i = 0; i < priceLevels.length; i++) {

		priceIDS.push(priceLevels[i].internalid)

	}

	var empID = nlapiGetFieldValue('custbody_so_creator');
	if (empID == "") {
		var context = nlapiGetContext();
		empID = getCurrUser;
	}
	if (empID != getCurrUser) {
		empID = getCurrUser
	}
	var empRec = nlapiLoadRecord('employee', empID)
	var levels = empRec.getFieldValue('custentity_ilo_price_level_emp');
	if (levels != null) {

		empLevels.push(levels);

	}
	var empPriceObj = [];

	for (var i = 0; i < empLevels.length; i++) {
		for (var j = 0; j < priceLevels.length; j++) {

			if (empLevels[i] == priceLevels[j].internalid) {

				empPriceObj.push({

					percentage : priceLevels[j].name,
					perc_id : priceLevels[j].internalid

				})

			}

		}

	}
	return empPriceObj;
}


function getHighestDiscount(discountsArr) {
	
	var cleanArr = filter_array(discountsArr)
	try{
		var max;
		
		max = cleanArr.reduce(function(a, b) {
		    return Math.max(a, b);
		});
		
		return max
		
	}catch(err) {
		nlapiLogExecution('debug', 'getHighestDiscount - err', err);
		return 0;
	}
	

}

function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
}