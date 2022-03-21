function beforeSubmit_blockRoles() {

		var allowedRoles = nlapiLookupField(
				'customrecord_jfrog_il_vend_bank_perm_rec', 1,
				'custrecord_jfrog_il_vend_bank_roles')

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
					"This role is not allowed to create or edit IL Vendor Bank records",false);
		} else {
			return true;
		}

}

