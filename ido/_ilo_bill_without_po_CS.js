/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Dec 2016     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Access mode: create, copy, edit
 * @returns {Void}
 */

var isPoRequired = '';
var noCont = '';

function bill_without_po_Save() {
	
	  var fType = getUrlVars()["transform"];
	  var isNewBill = nlapiGetRecordId() == '';

	var vendID = nlapiGetFieldValue('entity');
	var currVendor = nlapiLoadRecord('vendor', vendID);
	var poRequired = currVendor.fields.custentity3;

	var billType = nlapiGetFieldValue('custbodycustbody_ilo_bill_type');
	
	if ((poRequired == '2') && (billType == '1') && (isNewBill)) {
			
		if(fType == 'purchord') {
			return true;
		}
		alert('Unable to save this Bill - PO is required for this vendor.');
		return false;
	}
return true;

};
/**
 * 
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Sublist internal id
 * @param {String}
 *            name Field internal id
 * @param {Number}
 *            linenum Optional line item number, starts from 1
 * @returns {Void}
 */

function bill_without_po_Field_Changed(type, name, linenum) {
	if (name == 'entity') {
		var vendorID = nlapiGetFieldValue('entity');
		var a = nlapiLoadRecord('vendor', vendorID);
		var poReq = a.fields.custentity3;
		isPoRequired = poReq; // if value == '2' then a PO is required

		if (isPoRequired == '2') {
			alert('PO is required for this vendor.');

		}

	}
}



//function that checks the url to see if this bill has been created through a purchase order('recieve')
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }