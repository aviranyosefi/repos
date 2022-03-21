/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Feb 2018     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function checkifCreatedFromBulkScreen(type, form, request){
	
	if(type == 'create'){
		
		try{

		var html = '<SCRIPT language="JavaScript" type="text/javascript">';
		html += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} "; html += 'bindEvent(window, "load", function(){'; html += 'function checkURL(){var e="";window.location.href.indexOf("purchordermanager")>-1&&(e="true"),"true"==e&&nlapiSetFieldValue("custbodycreated_from_po","T")}checkURL();'; html += '});'; html += '</SCRIPT>';
		// push a dynamic field into the environment
		var field0 = form.addField('custpage_alertmode', 'inlinehtml', '',null,null); field0.setDefaultValue(html);
	
	}catch(err){
		nlapiLogExecution('debug', 'err', err);
	}

	return true;
	}
}
