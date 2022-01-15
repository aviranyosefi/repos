/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/search', 'N/ui/dialog'],
    function (search, dialog) {      
        function validateLine(scriptContext) {
            debugger;
            var rec = scriptContext.currentRecord;
            var type = scriptContext.sublistId;
            if (type == 'item') {
                var ItemID = rec.getCurrentSublistValue('item', 'item');
                var fieldLookUp = search.lookupFields({ type: search.Type.ITEM, id: ItemID,columns: ['expenseaccount']});
                var account = fieldLookUp.expenseaccount              
                if (!isNullOrEmpty(account)) {
                    var account = account[0].value
                    var accountData = search.lookupFields({ type: search.Type.ACCOUNT, id: account, columns: ['custrecord_under_budgetary_control','custrecord_budgetary_control_level','name'] });                 
                    if (accountData.custrecord_under_budgetary_control == true && !isNullOrEmpty(accountData.custrecord_budgetary_control_level)) {
                        var fieldForCheck = getFieldForCheck(accountData.custrecord_budgetary_control_level[0].value)
                        if (!isNullOrEmpty(fieldForCheck)) {
                            val = rec.getCurrentSublistValue('item', fieldForCheck);
                            if (isNullOrEmpty(val)) {
                                let options = {
                                    title: 'Please enter a ' + fieldForCheck,
                                    message: 'The selected item is connected to account <b><u>' + accountData.name + '</b></u> that is under budgetary control by account and ' + fieldForCheck + '.'
                                };
                                function success() {
                                    return false;
                                }
                                dialog.alert(options).then(success)
                                //alert('The selected item is connected to account ' + accountData.name + ' that is under budgetary control by account and ' + fieldForCheck + '.\nPlease enter a ' + fieldForCheck + '.')
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
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
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            validateLine: validateLine,         
        };
    });