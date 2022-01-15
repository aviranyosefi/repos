var RecType = nlapiGetRecordType();
var context = nlapiGetContext();
var user = context.user;
if (RecType == 'vendorbill') {
    nlapiGetField('paymenthold').setDisplayType('disabled')
}
nlapiGetField('custbody_receiver_approval').setDisplayType('disabled');
var tranID = nlapiGetRecordId()
if (tranID =='') {
    nlapiSetFieldValue('approvalstatus', '2')
    nlapiSetFieldValue('custbody_il_bill_creator', user);

}
var OldEntity = nlapiGetFieldValue('entity');
var OldReciever = nlapiGetFieldValue('custbody_bill_po_reciever');
var OldUsertotal = Number(nlapiGetFieldValue('usertotal')) * Number(nlapiGetFieldValue('exchangerate'))
var subsidiary= nlapiGetFieldValue('subsidiary')
if (subsidiary == '22') {
    var OldPorforma = GetTaxcode();
}


function validateReciver(type, name, linenum){	
    if (name == 'custbody_bill_po_reciever' || name == 'custbody_ilo_payment_method' || (type == 'expense' && name == 'account')) {
        debugger;
        var reciever = nlapiGetFieldValue('custbody_bill_po_reciever');
        if (reciever != '') {
            //if (RecType == 'vendorbill') {
                var pay_method = nlapiGetFieldValue('custbody_ilo_payment_method');                
                if (name == 'account') { var Porforma = GetCurrentTaxcode(linenum); }
                else { var Porforma = GetTaxcode();}
            
                if (reciever == user && subsidiary == '22' && (Porforma || pay_method == '4')) {
                    return true;
                }
                else if (reciever == user) {
                    alert('You cannot choose yourself as a reciever')
                    nlapiSetFieldValue('custbody_bill_po_reciever', '');
                }
            //} // 
            //else if (RecType == 'vendorcredit') {
            //    var pay_method = nlapiGetFieldValue('custbody_ilo_payment_method');  
            //    if (name == 'account') { var Porforma = GetCurrentTaxcode(linenum); }
            //    else { var Porforma = GetTaxcode(); }

            //    if (reciever == user && subsidiary == '22' && (Porforma || pay_method == '4')) {
            //        return true;
            //    }
            //    else if (reciever == user) {
            //        alert('You cannot choose yourself as a reciever')
            //        nlapiSetFieldValue('custbody_bill_po_reciever', '');
            //    }
            //} //if(RecType == 'vendorcredit')
        } // if (reciever != '')
    }   
}
function saveReciever() {
    debugger; 
    var MessageType = 'VC';
    if (RecType == 'vendorbill') {
        MessageType = 'VB'
    }
    var entity = nlapiGetFieldValue('entity');
    if (entity != OldEntity && tranID != '') {
        if (!confirm("Vendor change. " +MessageType +" must be reapproved. Please submit for approval")) {
            return false;
        }
        else {
            setAprrovalEmpty()
        }
    }
    var reciever = nlapiGetFieldValue('custbody_bill_po_reciever');
    if (reciever != OldReciever && tranID != '') {
        if (!confirm("Receiver change. " + MessageType +" must be reapproved. Please submit for approval")) {
            return false;
        }
        else {
            setAprrovalEmpty()
        }
    }  
    var usertotal = Number(nlapiGetFieldValue('usertotal') * Number(nlapiGetFieldValue('exchangerate')))
    if ((OldUsertotal + 5 <= usertotal || OldUsertotal - 5 >= usertotal) && tranID != '') {
        if (!confirm("Amount change. " + MessageType +" must be reapproved. Please submit for approval")) {
            return false;
        }
        else {
            setAprrovalEmpty()
        }
    }
    if (reciever != '') {
        if (RecType == 'vendorbill') {
            var pay_method = nlapiGetFieldValue('custbody_ilo_payment_method');
            var subsidiary = nlapiGetFieldValue('subsidiary');
            var Porforma = GetTaxcode();
            if (reciever == user && subsidiary == '22' && (Porforma || pay_method == '4')) {
                return true;
            }
            else if (reciever == user) {
                alert('You cannot choose yourself as a reciever')
                nlapiSetFieldValue('custbody_bill_po_reciever', '');
                return false;
            }
        } // 
        else if (RecType == 'vendorcredit') {
            var subsidiary = nlapiGetFieldValue('subsidiary');
            var Porforma = GetTaxcode();
            if (reciever == user && subsidiary == '22' && Porforma) {
                return true;
            }
            else if (reciever == user) {
                alert('You cannot choose yourself as a reciever')
                nlapiSetFieldValue('custbody_bill_po_reciever', '');
                return false;
            }
        } //if(RecType == 'vendorcredit')
    } 
    var Porforma = GetTaxcode();
    if (subsidiary == 22 && OldPorforma && !Porforma && tranID != '') {
        if (!confirm("Account change. " + MessageType + " must be reapproved. Please submit for approval")) {
            return false;
        }
        else {
            nlapiSetFieldValue('custbody_ilo_account_change', 'T');
            setAprrovalEmpty();
        }
    } 
    if (tranID == '' && nlapiGetFieldValue('custbody_ilo_payment_method')=='') {
        var vendorRec = nlapiLoadRecord('vendor', nlapiGetFieldValue('entity'))
        var pymtMethod = vendorRec.getFieldValue('custentity_ilo_field_payment_method')
        nlapiSetFieldValue('custbody_ilo_payment_method', pymtMethod)
    }
    if (tranID == '' && RecType == 'vendorcredit') {
        if (billsWithHold(entity) > 0) {
            alert('The transaction could not be saved.');
            return false;
        }
    }
    return true      
    //{ old.custbody_bill_po_reciever.id }!= { custbody_bill_po_reciever.id } or { old.entity.id }!= { entity.id } or({ old.usertotal } * { exchangerate } + 5 <= { usertotal } * { exchangerate }) or({ old.usertotal } * { exchangerate } - 5 >= { usertotal } * { exchangerate })
}
function GetTaxcode(){
	// ID 1920 = Porforma - Clearing 
	var lineExpenseCount = nlapiGetLineItemCount('expense');
	for (var line = 1; line <= lineExpenseCount; line++) {
		  var account = nlapiGetLineItemValue('expense', 'account', line);
		  if (account == '1920'){
			  return true;
		  }
	}	  
	return false;	
}
function GetTaxcodeCount(){
	debugger;
	// ID 1920 = Porforma - Clearing 
	var number = 0;
	var lineExpenseCount = nlapiGetLineItemCount('expense');
	for (var line = 1; line <= lineExpenseCount; line++) {
		  var account = nlapiGetLineItemValue('expense', 'account', line);
		  if (account == '1920'){
			  number++;
		  }
	}	  
	return number;	
}
function deleteAccount(){
    var reciever = nlapiGetFieldValue('custbody_bill_po_reciever');
    var pay_method = nlapiGetFieldValue('custbody_ilo_payment_method');
    if (GetTaxcodeCount() < 2 && reciever == user && pay_method != '4' ){	
		alert('You cannot choose yourself as a reciever')
		nlapiSetFieldValue('custbody_bill_po_reciever' , '');	
	}	
	return true;
}
function setAprrovalEmpty() {
    nlapiSetFieldValue('custbody_receiver_approval', '')
    getLastLogNumber('approval', tranID)
    nlapiSetFieldValue('custbody_tolerance_approver', '')
    getLastLogNumber('tolerance', tranID)
}
function getLastLogNumber(type, tranid) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ilo_approval_transaction', null, 'is', tranid)
    if (type == 'tolerance') {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_tolerance_cb', null, 'is', 'T')
    }
    else {
        filters[1] = new nlobjSearchFilter('custrecord_ilo_approval_rece_cb', null, 'is', 'T')
    }

    var search = nlapiCreateSearch('customrecord_ilo_approval_process', filters, null);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null && returnSearchResults.length > 0) {
  
        var id = returnSearchResults[returnSearchResults.length - 1].id
        nlapiSubmitField('customrecord_ilo_approval_process', id, 'custrecord_ilo_expired', 'T') // Yes            
    }   
}
function GetCurrentTaxcode(linenum) { 
    var newAccount  = nlapiGetCurrentLineItemValue('expense', 'account');
    var oldAccount = nlapiGetLineItemValue('expense', 'account', linenum);
    if (oldAccount == '1920' && newAccount != '1920') {
        if (GetTaxcodeCount() > 2) {
            return true;
        }
        return false;
    }
    return true;
}
function billsWithHold(entity) {

    var myFilters = [["status", "anyof", "VendBill:A"], 'and', ['entity', 'is', parseInt(entity)], 'and', ['paymenthold', 'is', 'T'], 'and', ['mainline', 'is', 'T']];
    var srchResults = nlapiSearchRecord('vendorbill', null, myFilters, null);
    if (srchResults != null) { return srchResults.length }
    return 0
   
}

