/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       06 Jun 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */

var showAlert = false;

function validate_line(type) {

    try {
    	
    	
            var isedit =  nlapiGetFieldValue('id') != "";
            var salesDeps = ['20', '21', '31', '30'];
            var toSave = true;
      		var currLine = nlapiGetCurrentLineItemIndex('item');
      		if (currLine == "") return true;
            var department = nlapiGetCurrentLineItemValue('item', 'department');
            var region = nlapiGetCurrentLineItemValue('item', 'custcol_cseg1');
          nlapiLogExecution('debug', 'validate_line', 'start' + isedit);
            if (department == '' || department == null && !isedit) {
            	     alert('All department fields must be populated in order to save this bill - Please check the lines');	

                toSave = false;
                showAlert = true;
            }
            nlapiLogExecution('debug', 'validate_line', 'department' + department);
            nlapiLogExecution('debug', 'validate_line', 'region' + region);
            if (salesDeps.indexOf(department) != -1 && region == '' && isedit) {
             	if(!showAlert){
                alert('Region value is missing for one of the lines. Please check');
             	}
                toSave = false;
                showAlert = true;
            }
         nlapiLogExecution('debug', 'validate_line', 'end' + toSave);
            return toSave;
            
        }
        catch (err) {
            console.log(err);
            return true;
        }

}


