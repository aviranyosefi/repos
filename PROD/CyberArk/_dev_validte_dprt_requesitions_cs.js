//remember to remove validate line for requesitions in NC script - customscript_nc_pba_cs_forms

//this line  - line 199-202 
//https://4678143.app.netsuite.com/app/common/scripting/script.nl?id=559
//Validate same approval path
//if (poApprovalPath == null || poApprovalPath == '' || poApprovalPath != approvalPathId) {				
//	throw nlapiCreateError('PBA.Client.Form.validateLine', 'The Approval Path of this line, does not match the current PO approval path, therfore it cannot be added', true);
//				 
//}


function validateDepartments_onsave() {
    debugger;
	try{

    console.log('in our script - save function')
		
	var lineCount = nlapiGetLineItemCount('item');
	console.log(lineCount);
	
	var dprtArr = [];
	var locationArr = [];
	
	for(var i = 0; i<lineCount; i++) {
		
		var dprt = nlapiGetLineItemValue('item', 'department', i+1);
		dprtArr.push(dprt);
		var loc = nlapiGetLineItemValue('item', 'location', i+1)
		locationArr.push(loc);	
	}	
	//var check = allValuesSame(dprtArr);
	
	//if(check == false) {
		
	//	alert('Department must be the same in all lines to enable approval workflow. Please check Department in lines.');
	//	return check;
	//}
	//else{		
		var selectedDprt = dprtArr[0];
		var selectedLoc = locationArr[0]
		var subsid = nlapiGetFieldValue('subsidiary');		
        var approvePath = getApprovalPath(dprtArr, subsid, selectedLoc)
        if (approvePath.length > 1) {
            alert('Multiple departments are allowed only if they have the same approvers.\nYou have selected departments with different approvers, so the requisition cannot be saved.')
            return false;
        }
        else if (approvePath.length ==1) {		
            nlapiSetFieldValue('custbody_nc_pba_approval_path', approvePath[0].id, true, true);
            nlapiSetFieldValue('custbody_cbr_req_bdg_owner', approvePath[0].level1, true, true);
            nlapiSetFieldValue('custbody_cbr_req_fpa', approvePath[0].level2, true, true);
            nlapiSetFieldValue('custbody_cbr_req_fpa_director', approvePath[0].level3, true, true);
            console.log('set approval path - ready to save')
		}
	//}
	}catch(err) {
		
		alert('An error occured while trying to validate the departments on the line : ' + err);
		return true;
	}

return true;
}

function allValuesSame(arr) {
	
    for(var i = 1; i < arr.length; i++)
    {
        if(arr[i] !== arr[0])
            return false;
    }

    return true;
}	
	
function getApprovalPath(selectedDprt, subsid, selectedLoc) {
	
	try {

		var res = [];
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid');
        columns[1] = new nlobjSearchColumn('custrecord_nc_powf_level1'); 
        columns[2] = new nlobjSearchColumn('custrecord_nc_powf_level2'); 
        columns[3] = new nlobjSearchColumn('custrecord_nc_powf_level3'); 

		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custrecord_cb_nc_po_path_trantype_id', null, 'is', 'purchaserequisition');
		filters[1] = new nlobjSearchFilter('custrecord_nc_po_approver_sub', null, 'is', subsid);
		filters[2] = new nlobjSearchFilter('custrecord_nc_powf_path', null, 'is', selectedDprt);
        filters[3] = new nlobjSearchFilter('custrecord_nc_powf_location', null, 'is', selectedLoc);
        filters[4] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		
		// Create the saved search
		var search = nlapiCreateSearch('customrecord_nc_pba_po_hierarchy_list', filters, columns);
		var runSearch = search.runSearch();
		var results = runSearch.getResults(0, 1000);

		if (results != null) {

			results.forEach(function(element) {
				res.push({					
                    id: element.getValue('internalid'),
                    level1: element.getValue('custrecord_nc_powf_level1'),
                    level2: element.getValue('custrecord_nc_powf_level2'),
                    level3: element.getValue('custrecord_nc_powf_level3'),
				});
			});			
		}	
        return res;
	} catch (err) {
		console.log('err : ' +JSON.stringify(err));
        return res;
	}
	
}
	




