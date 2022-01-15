// JavaScript source code
function beforeSubmit_blockRoles() {
    var id = getID();
    nlapiLogExecution('debug', 'id', id)
    var allowedRoles = nlapiLookupField(
        'customrecord_jfrog_il_vend_bank_perm_rec', id,
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
            "This role is not allowed to create or edit IL Vendor Bank records", false);
    } else {
        return true;
    }

}
function getID() {

    var search = nlapiCreateSearch('customrecord_jfrog_il_vend_bank_perm_rec', null, null);
    var runSearch = search.runSearch();
    res = runSearch.getResults(0, 1)

    return res[0].id


}