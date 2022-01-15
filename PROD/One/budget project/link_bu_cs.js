function ValidateLineLinkBU(type) {
    if (type == 'item') {
        var ItemID = nlapiGetCurrentLineItemValue('item', 'item');
        var account = nlapiLookupField('item', ItemID, 'expenseaccount' );
        if (!isNullOrEmpty(account)) {
            var field = []; field[0] = 'custrecord_under_budgetary_control'; field[1] = 'custrecord_budgetary_control_level'; field[2] = 'name'
            var accountData = nlapiLookupField('account', account, field);
            if (accountData.custrecord_under_budgetary_control == 'T' && !isNullOrEmpty(accountData.custrecord_budgetary_control_level)) {
                var fieldForCheck = getFieldForCheck(accountData.custrecord_budgetary_control_level)
                if (!isNullOrEmpty(fieldForCheck)) {
                    val = nlapiGetCurrentLineItemValue('item', fieldForCheck);
                    if (isNullOrEmpty(val)) {
                        alert('The selected item is connected to account ' + accountData.name + ' that is under budgetary control by account and ' + fieldForCheck + '.\nPlease enter a ' + fieldForCheck+'.')
                        return false;
                    }
                }
            }
        } 
     
    }
    return true;
}
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getFieldForCheck(budgetary_control) {
    switch (budgetary_control) {
        case '1':// Control By Account
            return '';
            
        case '2': // Control By Account And Department
            return 'deparment'
         
        case '3': // Control By Account And Parent Department
            return 'deparment'
        
        case '4': // Control By Parent Account
            return ''; 
         
        case '5': // Control By Parent Account And Department
            return 'deparment'
          
        case '6': // Control By Parent Account And Parent Department
            return 'deparment'
          
        case '7': // Control By Department
            return 'deparment'
           
        case '8': // Control By Parent Department
            return 'deparment'
           
        case '9': // Control by Account and Class
            return 'class'
         
        case '10': // Control by Parent Account and Class
            return 'class'
           
        default:            
             
        }

    return '';
}