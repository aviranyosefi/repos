function beforeSubmit_blockRoles() {

	var recType = nlapiGetRecordType();

	if (recType == 'customrecord_ilo_vendor_bank') {

		var allowedRoles = nlapiLookupField(
				'customrecord_dev_il_vendor_bank_perm_rec', 1,
				'custrecord_dev_il_vendor_bank_roles')

		var allowedArr = allowedRoles.split(',')
		var currentRole = nlapiGetContext().getRole();

		nlapiLogExecution('debug', 'allowedRole', allowedRoles)
		nlapiLogExecution('debug', 'currentRole', currentRole)

		var allowed = false

		for (var i = 0; i < allowedArr.length; i++) {

			if (allowedArr[i] == currentRole) {
				allowed = true
			}

		}
		if (!allowed) {

			throw nlapiCreateError("ERROR",
					"This role is not allowed to edit IL Vendor Bank record",
					false);
		} else {
			return true;
		}
	}

	if (recType == 'vendor') {

		var checkForm = nlapiGetFieldValue('customform');

		if (checkForm == '103') { // Israeli Vendor Form

			var allowedRoles = nlapiLookupField(
					'customrecord_dev_il_vendor_bank_perm_rec', 1,
					'custrecord_dev_il_vendor_bank_roles')

			var allowedArr = allowedRoles.split(',')
			var currentRole = nlapiGetContext().getRole();

			nlapiLogExecution('debug', 'allowedRole', allowedRoles)
			nlapiLogExecution('debug', 'currentRole', currentRole)

			var allowed = false
			var recID = nlapiGetRecordId();
			var checkIfFieldsChanged = vendorDetailsUpdated(recID, false);

			for (var i = 0; i < allowedArr.length; i++) {

				if (allowedArr[i] == currentRole) {
					allowed = true
				}

			}
			if (!allowed && checkIfFieldsChanged.length != 8) {

				throw nlapiCreateError("ERROR",
						"This role is not allowed to edit Vendor Bank details",
						false);
			} else {
				nlapiSetFieldValue('customform', '103')
				return true;
			}
		}
		return true;
	}

}

function afterSubmit_checkBankDetails(type) {

	var recType = nlapiGetRecordType();
	
//	if (type == 'edit') {

		

		
			var recID = nlapiGetRecordId();
try{
	if (recType == 'customrecord_ilo_vendor_bank') {
		
		if(type == 'create') {
			
			var rec = nlapiLoadRecord('customrecord_ilo_vendor_bank', recID);
			var vendorID = rec.getFieldValue('custrecord_ilo_vendor_bank_vendor')
			
			var fields = new Array()
			fields[0] = 'custentity_cbr_bank_details_updated'
			fields[1] = 'custentity_nc_vqa_vend_auth_status'

			var values = new Array()
			values[0] = 'T'
			values[1] = '5'

			nlapiSubmitField('vendor', vendorID, fields, values)
			
		}else{
			bankDetailsUpdated();
		}
	
	}
}catch(err){
	nlapiLogExecution('error', 'error in bankDetailsUpdated', err)
}

try {
			if (recType == 'vendor') {
				vendorDetailsUpdated(recID, true);
			}

		} catch (err) {

			nlapiLogExecution('error', 'error in vendorDetailsUpdated', err)
		}
//	}
	
	if (recType == 'vendor') {
		
		var recID = nlapiGetRecordId();
		var vendorRec = nlapiLoadRecord('vendor', recID)
		var checkSubsid = vendorRec.getFieldValue('subsidiary');
		if (checkSubsid == '22') {

			try {

				vendorRec.setFieldValue('customform', '103')
				nlapiSubmitRecord(vendorRec)

			} catch (err) {
				nlapiLogExecution('debug', 'err', err)

			}
		}
	}
}

function bankDetailsUpdated() {

	// Old and New record instances are retrieved from global functions
	var newRec = nlapiGetNewRecord();
	var oldRec = nlapiGetOldRecord();

	// Make sure that this is not a newly created Record
	if (oldRec != null) {

		var vendorRecID = oldRec.getFieldValue('internalid')

		var newVendor = newRec
				.getFieldValue('custrecord_ilo_vendor_bank_vendor')
		var newBankDetail = newRec
				.getFieldValue('custrecord_ilo_vendor_bank_bank')
		var newAccountNum = newRec
				.getFieldValue('custrecord_ilo_bank_details_account')
		var newAccountName = newRec
				.getFieldValue('custrecord_ilo_bank_account_name')
		var newFromDate = newRec
				.getFieldValue('custrecord_ilo_vendor_bank_from')
		var newToDate = newRec.getFieldValue('custrecord_ilo_vendor_bank_to')

		var oldVendor = oldRec
				.getFieldValue('custrecord_ilo_vendor_bank_vendor')
		var oldBankDetail = oldRec
				.getFieldValue('custrecord_ilo_vendor_bank_bank')
		var oldAccountNum = oldRec
				.getFieldValue('custrecord_ilo_bank_details_account')
		var oldAccountName = oldRec
				.getFieldValue('custrecord_ilo_bank_account_name')
		var oldFromDate = oldRec
				.getFieldValue('custrecord_ilo_vendor_bank_from')
		var oldToDate = oldRec.getFieldValue('custrecord_ilo_vendor_bank_to')

		var checkArr = [];

		if (newVendor === oldVendor) {
			checkArr.push('true')
		}
		if (newBankDetail === oldBankDetail) {
			checkArr.push('true')
		}
		if (newAccountNum === oldAccountNum) {
			checkArr.push('true')
		}
		if (newAccountName === oldAccountName) {
			checkArr.push('true')
		}
		if (newFromDate === oldFromDate) {
			checkArr.push('true')
		}
		if (newToDate === oldToDate) {
			checkArr.push('true')
		}

		if ((newVendor === '') && (oldVendor === null)) {
			checkArr.push('true')
		}
		if ((newBankDetail === '') && (oldBankDetail === null)) {
			checkArr.push('true')
		}
		if ((newAccountNum === '') && (oldAccountNum === null)) {
			checkArr.push('true')
		}
		if ((newAccountName === '') && (oldAccountName === null)) {
			checkArr.push('true')
		}
		if ((newFromDate === '') && (oldFromDate === null)) {
			checkArr.push('true')
		}
		if ((newToDate === '') && (oldToDate === null)) {
			checkArr.push('true')
		}

		if (checkArr.length != 6) {

			var fields = new Array()
			fields[0] = 'custentity_cbr_bank_details_updated'
			fields[1] = 'custentity_nc_vqa_vend_auth_status'

			var values = new Array()
			values[0] = 'T'
			values[1] = '5'

			nlapiSubmitField('vendor', newVendor, fields, values)

		}
	}
		
		if(oldRec == null) {
			
			var newVendor = newRec.getFieldValue('internalid')
			
			var checkArr = [];

			if (newVendor !== '') {
				checkArr.push('true')
			}
			if (newBankDetail !== '') {
				checkArr.push('true')
			}
			if (newAccountNum !== '') {
				checkArr.push('true')
			}
			if (newAccountName !== '') {
				checkArr.push('true')
			}
			if (newFromDate !== '') {
				checkArr.push('true')
			}
			if (newToDate !== '') {
				checkArr.push('true')
			}

			if (checkArr.length != 6) {

				var fields = new Array()
				fields[0] = 'custentity_cbr_bank_details_updated'
				fields[1] = 'custentity_nc_vqa_vend_auth_status'

				var values = new Array()
				values[0] = 'T'
				values[1] = '5'

				nlapiSubmitField('vendor', newVendor, fields, values)

			}
			
		}

	

}

function vendorDetailsUpdated(recID, allowedRole) {

	// Old and New record instances are retrieved from global functions
	var newRec = nlapiGetNewRecord();
	var oldRec = nlapiGetOldRecord();

	// Make sure that this is not a newly created Record
	if (oldRec != null) {

		var checkSubsid = newRec.getFieldValue('subsidiary');

		var newBankName = newRec.getFieldValue('custentity_ilo_bank_name')
		var newBankBranch = newRec
				.getFieldValue('custentity_ilo_bank_branch_number')
		var newBankAddress = newRec
				.getFieldValue('custentity_ilo_bank_account_address')
		var newBankAccountName = newRec
				.getFieldValue('custentity_ilo_bank_account_name')
		var newBankAccountNumber = newRec
				.getFieldValue('custentity_ilo_bank_account_number')
		var newBankSwift = newRec
				.getFieldValue('custentity_ilo_bank_swift_code')
		var newBankIBAN = newRec.getFieldValue('custentity_il_aba_number')
		var newBankABA = newRec.getFieldValue('custentity_ilo_iban')

		var oldBankName = oldRec.getFieldValue('custentity_ilo_bank_name')
		var oldBankBranch = oldRec
				.getFieldValue('custentity_ilo_bank_branch_number')
		var oldBankAddress = oldRec
				.getFieldValue('custentity_ilo_bank_account_address')
		var oldBankAccountName = oldRec
				.getFieldValue('custentity_ilo_bank_account_name')
		var oldBankAccountNumber = oldRec
				.getFieldValue('custentity_ilo_bank_account_number')
		var oldBankSwift = oldRec
				.getFieldValue('custentity_ilo_bank_swift_code')
		var oldBankIBAN = oldRec.getFieldValue('custentity_il_aba_number')
		var oldBankABA = oldRec.getFieldValue('custentity_ilo_iban')

		var vendorRecID = oldRec.getFieldValue('internalid')

		var checkArr = [];

		if (newBankName === oldBankName) {
			checkArr.push('true')
		}
		if (newBankBranch === oldBankBranch) {
			checkArr.push('true')
		}
		if (newBankAddress === oldBankAddress) {
			checkArr.push('true')
		}
		if (newBankAccountName === oldBankAccountName) {
			checkArr.push('true')
		}
		if (newBankAccountNumber === oldBankAccountNumber) {
			checkArr.push('true')
		}
		if (newBankSwift === oldBankSwift) {
			checkArr.push('true')
		}
		if (newBankIBAN === oldBankIBAN) {
			checkArr.push('true')
		}
		if (newBankABA === oldBankABA) {
			checkArr.push('true')
		}

		if ((newBankName === '') && (oldBankName === null)) {
			checkArr.push('true')
		}
		if ((newBankBranch === '') && (oldBankBranch === null)) {
			checkArr.push('true')
		}
		if ((newBankAddress === '') && (oldBankAddress === null)) {
			checkArr.push('true')
		}
		if ((newBankAccountName === '') && (oldBankAccountName === null)) {
			checkArr.push('true')
		}
		if ((newBankAccountNumber === '') && (oldBankAccountNumber === null)) {
			checkArr.push('true')
		}
		if ((newBankSwift === '') && (oldBankSwift === null)) {
			checkArr.push('true')
		}
		if ((newBankIBAN === '') && (oldBankIBAN === null)) {
			checkArr.push('true')
		}
		if ((newBankABA === '') && (oldBankABA === null)) {
			checkArr.push('true')
		}

		if (allowedRole) {
			// Make sure the subisidary is ISR
			if (checkArr.length != 8 && checkSubsid == '22') {

				var fields = new Array()
				fields[0] = 'custentity_cbr_bank_details_updated'
				fields[1] = 'custentity_nc_vqa_vend_auth_status'

				var values = new Array()
				values[0] = 'T'
				values[1] = '5'

				nlapiSubmitField('vendor', recID, fields, values)

			}
			
			if(oldRec == null) {
				
				var checkSubsid = newRec.getFieldValue('subsidiary');
				
				var checkArr = [];
				
				if (newBankName !== '') {
					checkArr.push('true')
				}
				if (newBankBranch !== '') {
					checkArr.push('true')
				}
				if (newBankAddress !== '') {
					checkArr.push('true')
				}
				if (newBankAccountName !== '')  {
					checkArr.push('true')
				}
				if (newBankAccountNumber !== '') {
					checkArr.push('true')
				}
				if (newBankSwift !== '')  {
					checkArr.push('true')
				}
				if (newBankIBAN !== '')  {
					checkArr.push('true')
				}
				if (newBankABA !== '')  {
					checkArr.push('true')
				}
				
				if (checkArr.length != 8 && checkSubsid == '22') {

					var fields = new Array()
					fields[0] = 'custentity_cbr_bank_details_updated'
					fields[1] = 'custentity_nc_vqa_vend_auth_status'

					var values = new Array()
					values[0] = 'T'
					values[1] = '5'

					nlapiSubmitField('vendor', recID, fields, values)

				}
			}
		}
		if (!allowedRole) {
			return checkArr;
		}

	}// if(oldRec != null) {
}
