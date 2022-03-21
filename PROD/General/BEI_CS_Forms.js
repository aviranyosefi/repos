/**
* Copyright (c) 2006-2015 NetCloud (NetSuite-IL), Ltd. Israel
* All Rights Reserved.
* 
* This file is part of The Inventory Count File Bundle.
* User may not copy, modify, distribute, re-bundle or reuse this code in any way.
*/
/**
 * Author: Igor Povolotski
 */

/**
 * NC_Inv_Count_CS_Forms.js
 */

invCountEditWindow = {
		window : null,
		bckgndDiv : null		
}
var recType = nlapiGetRecordType();
var recId = nlapiGetRecordId();

function ncInvCount_PageInit(type){
   
}

function ncInvCount_SaveRecord(){
	if (recType == 'customrecord_be_inv_count_file_upload') {
		var isValidated = nsBoolToBool(nlapiGetFieldValue('custrecord_be_inv_count_file_validated'))
		if (!isValidated) {
			alert('Please validate the file before saving.');
			return false;
		}
	}
    return true;
}

function ncInvCount_ValidateField(type, name, linenum){
   
    return true;
}

function ncInvCount_FieldChanged(type, name, linenum){
	if (recType == 'customrecord_be_inv_count_file_upload') {
		if (name == 'custrecord_be_inv_count_file_file') {
			nlapiSetFieldValue('custrecord_nc_inv_count_file_validated','F');
		}
	}
}

function openFileRec() {
	var subsidiary = nlapiGetFieldValue('subsidiary');
	var location = nlapiGetFieldValue('location');
	var account = nlapiGetFieldValue('account');
	if (isNullOrEmpty(subsidiary) || isNullOrEmpty(location) || isNullOrEmpty(account)) {
		alert('Please set value(s) for : Subsidiary,Location and account');
		return;
	}
	var invRecFileRecId = nlapiGetFieldValue('custpage_invcount_filerecid');	
	var invCountFileRecUrl = nlapiResolveURL('RECORD', 'customrecord_be_inv_count_file_upload', isNullOrEmpty(invRecFileRecId) ? null : invRecFileRecId);
	invCountFileRecUrl += '&subsidiary=' + subsidiary + '&location=' + location + '&account=' + account;
	if (!invCountEditWindow.bckgndDiv || invCountEditWindow.bckgndDiv == null) {
		//disable_scroll();
		//document.body.style.overflow = 'hidden';				
		invCountEditWindow.bckgndDiv = document.createElement("div");
		invCountEditWindow.bckgndDiv.style.position = "absolute";
		invCountEditWindow.bckgndDiv.style.zIndex = "999";
		invCountEditWindow.bckgndDiv.style.top = '0px';
		invCountEditWindow.bckgndDiv.style.left = '0px';
		invCountEditWindow.bckgndDiv.style.width = (Math.max(document.body.scrollWidth, jQuery(window).width())) + 'px';
		invCountEditWindow.bckgndDiv.style.height = (Math.max(document.body.scrollHeight, jQuery(window).height())) + 'px';
		setObjectOpacity(50, invCountEditWindow.bckgndDiv);
		invCountEditWindow.bckgndDiv.style.backgroundColor = 'gray';
		document.body.appendChild(invCountEditWindow.bckgndDiv);
	}
	invCountEditWindow.bckgndDiv.style.display = "block";
	invCountEditWindow.bckgndDiv.style.top = '0px';
	
	invCountEditWindow.window = window.open(invCountFileRecUrl,"Set Inventory Count File", 'width=500,height=500,resizable=no,scrollbars=no');		
	invCount_checkWindowOpenned();
	
}

function invCount_checkWindowOpenned() {
	if (!invCountEditWindow.window) {
        alert('Unable to open edit mode windows');
    } else { 
        if (invCountEditWindow.window.closed) { 
        	invCount_popUPCloseHandler();        	
        } else {
        	setTimeout('invCount_checkWindowOpenned()',100);
        }    
    }
};

var isInvCountSaving = false;
function invCount_popUPCloseHandler(){	
	var invRecFileRecId = nlapiGetFieldValue('custpage_invcount_filerecid');
	if (isNullOrEmpty(invRecFileRecId)) {
		var sessionInvCountFileRecId = nlapiGetContext().getSessionObject('invCount_recId');
		if (!isNullOrEmpty(sessionInvCountFileRecId)) {			
			nlapiSetFieldValue('custpage_invcount_filerecid',sessionInvCountFileRecId);
			//Overwrite getLineCountFunc function to prevent line count validatin
			var originalSaveRecord = save_record;
			save_record = function(lastcall){
				isInvCountSaving = true;
				var res = originalSaveRecord(lastcall);
				isInvCountSaving = false;
				return res;
			};
			var originalLineCount = nlapiGetLineItemCount;
			nlapiGetLineItemCount = function(a){
				if (a == 'item' && isInvCountSaving) {
					return 1;
				}
				return originalLineCount(a);
			};
			
			//Remove lines items and hide
			var lineItemCount = nlapiGetLineItemCount('item');
			for (var i = lineItemCount; i > 0; i--) {
				nlapiRemoveLineItem('item', i);
			}
			jQuery('#itemslnk').hide();
			jQuery('#historytxt').click();
			
			//Remove Set File Button
			jQuery('#custpage_btn_set_file').parent().hide();
		};
		invCountEditWindow.bckgndDiv.style.display = "none";
	}		
};


function validateInventoryCountFile(){
  debugger;
	var fileId = nlapiGetFieldValue('custrecord_be_inv_count_file_file');
	if (isNullOrEmpty(fileId)) {
		alert('Please select a file');
		return;
	}
	var locationId = getURLParameter('location');
	var subsidiaryId = getURLParameter('subsidiary');
	var accountIdId = getURLParameter('account');
	var handlerUrl = nlapiGetFieldValue('custpage_validator_handler_url');
	handlerUrl += '&fileId=' + fileId + '&subsidiaryId=' + subsidiaryId + '&locationId=' + locationId;
	try{
		var resp = nlapiRequestURL(handlerUrl  + '&responseType=json');
		resp = JSON.parse(resp.getBody());
		if (resp.status == 'success') {
			if (resp.data.isValid) {
				alert('File is valid.');
				nlapiSetFieldValue('custrecord_be_inv_count_file_validated', 'T');
			}
			else {
				alert('File is invalid.');
				nlapiSetFieldValue('custrecord_be_inv_count_file_validated', 'F');
				window.open(handlerUrl  + '&responseType=attachment' + '&sessionObjectId=' + resp.data.sessionUID);				
			}
		}
	}
	catch(err){
		alert('Error occured while validating file.\nPlease contact support.');
	}
};

function getURLParameter(name) {
	  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}