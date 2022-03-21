/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Jun 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */


function clientValidateLines_dy(type) {
    debugger;
    var allAccounts = getAccountsForValidation()

    var allJEAccounts = groupBy(allAccounts, function (item) {
        return [item.mand_JE_name]
    });
    allJEAccounts = allJEAccounts[1];
    var JEAccounts = [];
    for (var i = 0; i < allJEAccounts.length; i++) {
        JEAccounts.push(allJEAccounts[i].internalid)
    }


    var allDprtAccounts = groupBy(allAccounts, function (item) {
        return [item.mand_Dprt]
    });
    allDprtAccounts = allDprtAccounts[1]
    var DprtAccounts = [];
    for (var i = 0; i < allDprtAccounts.length; i++) {
        DprtAccounts.push(allDprtAccounts[i].internalid)
    }


    var allEmpAccounts = groupBy(allAccounts, function (item) {
        return [item.mand_Emp]
    });
    allEmpAccounts = allEmpAccounts[0][1];
    var EmpAccounts = [];
    for (var i = 0; i < allEmpAccounts.length; i++) {
        EmpAccounts.push(allEmpAccounts[i].internalid)
    }

	var recType = nlapiGetRecordType();

	if (recType == 'journalentry' && type == 'line') {

		try {

			var currAcount = nlapiGetCurrentLineItemValue('line', 'account');
			var currName = nlapiGetCurrentLineItemValue('line', 'entity');
			var currDprt = nlapiGetCurrentLineItemValue('line', 'department')
			var currEmp = nlapiGetCurrentLineItemValue('line', 'custcol6')

			var checkJEAccount = JEAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkDprtAccount = DprtAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkEmpAccount = EmpAccounts.indexOf(currAcount) != -1 ? true : false;

			// Validate Name Column
			if (checkJEAccount && (currName == null || currName == '')) {
				alert('Please choose a vendor for the name column.');
				return false;
			}
			
			// Validate Name Column is Vendor
			if (checkJEAccount && (currName != null || currName != '')) {
				
				try{
				var isVendor = nlapiLoadRecord('vendor', currName);

				}catch(err){					
					alert('The entity chosen must be a vendor.');
					return false;
				}
			}

			// Validate Department Column
			if (checkDprtAccount) {
				if (currDprt == null || currDprt == '') {
					alert('Please select a department for this line.');
					return false;
				}
				var dprtRec = nlapiLoadRecord('department', currDprt);
				var isParent = dprtRec.getFieldValue('custrecord_is_parent') == 'T' ? true : false
				if (isParent) {
					alert('Please choose a child department for this line.');
					return false;
				}

			}
			
			// Validate Employee Column
			if (checkEmpAccount && (currEmp == null || currEmp == '')) {
				alert('Please choose an employee for the employee column.');
				return false;
			}
			return true;

		} catch (err) {
			console.log(err);
			return true;
		}

	}// (recType == 'journalentry' && type == 'line')

	if (recType == 'expensereport' && type == 'expense') {
		try {

			var currExpCategory = nlapiGetCurrentLineItemValue('expense','category');
			var expCategoryRec = nlapiLoadRecord('expensecategory',currExpCategory)
			var currAcount = expCategoryRec.getFieldValue('expenseacct')
			var currDprt = nlapiGetCurrentLineItemValue('expense', 'department')
			var currEmp = nlapiGetCurrentLineItemValue('expense', 'custcol6')

			var checkDprtAccount = DprtAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkEmpAccount = EmpAccounts.indexOf(currAcount) != -1 ? true : false;

			// Validate Department Column
			if (checkDprtAccount) {
				if (currDprt == null || currDprt == '') {
					alert('Please select a department for this line.');
					return false;
				}
				var dprtRec = nlapiLoadRecord('department', currDprt);
				var isParent = dprtRec.getFieldValue('custrecord_is_parent') == 'T' ? true : false
				if (isParent) {
					alert('Please choose a child department for this line.');
					return false;
				}
			}
			
			// Validate Employee Column
			if (checkEmpAccount && (currEmp == null || currEmp == '')) {
				alert('Please choose an employee for the employee column.');
				return false;
			}
			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	} //(recType == 'expensereport' && type == 'expense')
	
	if ((recType == 'vendorbill' || recType == 'vendorcredit') && type == 'expense') {
		try {

			var currAcount = nlapiGetCurrentLineItemValue('expense','account');
			var currDprt = nlapiGetCurrentLineItemValue('expense', 'department')
			var currEmp = nlapiGetCurrentLineItemValue('expense', 'custcol6')

			var checkDprtAccount = DprtAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkEmpAccount = EmpAccounts.indexOf(currAcount) != -1 ? true : false;

			// Validate Department Column
			if (checkDprtAccount) {
				if (currDprt == null || currDprt == '') {
					alert('Please select a department for this line.');
					return false;
				}
				var dprtRec = nlapiLoadRecord('department', currDprt);
				var isParent = dprtRec.getFieldValue('custrecord_is_parent') == 'T' ? true
						: false
				if (isParent) {
					alert('Please choose a child department for this line.');
					return false;
				}
			}
			
			// Validate Employee Column
			if (checkEmpAccount && (currEmp == null || currEmp == '')) {
				alert('Please choose an employee for the employee column.');
				return false;
			}
			
			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	}// ((recType == 'vendorbill' || recType == 'vendorcredit') && type == 'expense')
	
	if ((recType == 'vendorbill' || recType == 'vendorcredit') && type == 'item') {
		try {

			var currItem = nlapiGetCurrentLineItemValue('item','item');
			var itemRec = nlapiLoadRecord('item', currItem);
			var currAcount = itemRec.getFieldValue('expenseaccount');
			var currDprt = nlapiGetCurrentLineItemValue('item', 'department')
			var currEmp = nlapiGetCurrentLineItemValue('item', 'custcol6')

			var checkDprtAccount = DprtAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkEmpAccount = EmpAccounts.indexOf(currAcount) != -1 ? true : false;

			// Validate Department Column
			if (checkDprtAccount) {
				if (currDprt == null || currDprt == '') {
					alert('Please select a department for this line.');
					return false;
				}
				var dprtRec = nlapiLoadRecord('department', currDprt);
				var isParent = dprtRec.getFieldValue('custrecord_is_parent') == 'T' ? true
						: false
				if (isParent) {
					alert('Please choose a child department for this line.');
					return false;
				}
			}
			
			// Validate Employee Column
			if (checkEmpAccount && (currEmp == null || currEmp == '')) {
				alert('Please choose an employee for the employee column.');
				return false;
			}
			
			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	}// ((recType == 'vendorbill' || recType == 'vendorcredit')
	
	
	if (recType == 'purchaseorder' && type == 'item') {
		try {

			var currItem = nlapiGetCurrentLineItemValue('item','item');
			var itemRec = nlapiLoadRecord('item', currItem);
			var currAcount = itemRec.getFieldValue('expenseaccount');
			var currDprt = nlapiGetCurrentLineItemValue('item', 'department')
			var currEmp = nlapiGetCurrentLineItemValue('item', 'custcol6')

			var checkDprtAccount = DprtAccounts.indexOf(currAcount) != -1 ? true : false;
			var checkEmpAccount = EmpAccounts.indexOf(currAcount) != -1 ? true : false;

			// Validate Department Column
			if (checkDprtAccount) {
				if (currDprt == null || currDprt == '') {
					alert('Please select a department for this line.');
					return false;
				}
				var dprtRec = nlapiLoadRecord('department', currDprt);
				var isParent = dprtRec.getFieldValue('custrecord_is_parent') == 'T' ? true
						: false
				if (isParent) {
					alert('Please choose a child department for this line.');
					return false;
				}
			}
			
			// Validate Employee Column
			if (checkEmpAccount && (currEmp == null || currEmp == '')) {
				alert('Please choose an employee for the employee column.');
				return false;
			}
	
			return true;
		} catch (err) {
			console.log(err);
			return true;
		}
	}// (recType == 'purchaseorder' && type == 'item')
	
}

function getAccountsForValidation() {
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('custrecord_set_je_name_col_as_mandatory');
	columns[2] = new nlobjSearchColumn('custrecord_set_dept_as_mandtory_for_trx');
	columns[3] = new nlobjSearchColumn('custrecord_set_emp_as_mandtory_for_trx');

	var savedSearch = nlapiCreateSearch('account', null, columns)

	var resultset = savedSearch.runSearch();
	var returnSearchResults = [];
	var searchid = 0;
	var results = [];
	var cols = savedSearch.getColumns();
	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for ( var rs in resultslice) {
			returnSearchResults.push(resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (returnSearchResults != null) {
		returnSearchResults.forEach(function(element) {
			results.push({
				internalid : element.getValue('internalid'),
				mand_JE_name : element.getValue('custrecord_set_je_name_col_as_mandatory'),
				mand_Dprt : element.getValue('custrecord_set_dept_as_mandtory_for_trx'),
				mand_Emp : element.getValue('custrecord_set_emp_as_mandtory_for_trx')
			});
		});
	}
	return results;

}

function groupBy(array, f) {
	var groups = {};
	array.forEach(function(o) {
		var group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	})
}


