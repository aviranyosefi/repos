/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */





function dynamicSwitchDisable_SaveRecord(){
	
	  var currentSubsid = nlapiGetFieldValue('subsidiary');
	
	if (currentSubsid === "21") //Jfrog Subsidiary in the demo env
	{
	  var v = getDropdown(window.document.getElementsByName('inpt_custpage_4601_witaxcode')[0]);
	  var text = v.textArray;
	  var value = v.valueArray;
	  var currentTaxCode = nlapiGetFieldText('custpage_4601_witaxcode');

	  var whtCodes = [];
	  var dynamic = '';
	  for (var i = 0; i < text.length; i++) {
	    whtCodes.push({
	      taxCodeText: text[i],
	      taxCodeId: value[i]
	    });

	    if ((whtCodes[i].taxCodeText).indexOf(currentTaxCode) != -1) {
	      console.log('ok' + ' ' + currentTaxCode);
	    }
	    if (whtCodes[i].taxCodeText == "IL WHT Local Vendors:WHT דינאמי") {
	      dynamic = whtCodes[i].taxCodeId;
	      nlapiSetFieldValue('custpage_4601_witaxcode', dynamic);
	      nlapiDisableField('custpage_4601_witaxcode', true);
	    }
	  }
	  return true;
	}

    return true;
}
