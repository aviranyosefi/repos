
function fieldChanged(type, name) {
    debugger;
    if (name == 'custpage_ilo_iptype') {
        nlapiRemoveSelectOption('custpage_ilo_system')
        nlapiInsertSelectOption('custpage_ilo_system', '', '', false)
            if (nlapiGetFieldValue('custpage_ilo_iptype') == '1') {
                //nlapiRemoveSelectOption('custpage_ilo_system', 2);
                //nlapiRemoveSelectOption('custpage_ilo_system', 3);
                //nlapiRemoveSelectOption('custpage_ilo_system', 4);
                //nlapiRemoveSelectOption('custpage_ilo_system', 12);
                nlapiInsertSelectOption('custpage_ilo_system', '1', 'RF Device Management', false)
                nlapiInsertSelectOption('custpage_ilo_system', '6', 'OSPF', false)
                nlapiInsertSelectOption('custpage_ilo_system', '5', 'ISIS', false)
                nlapiInsertSelectOption('custpage_ilo_system', '8', 'Device Management - Internet', false)
                nlapiInsertSelectOption('custpage_ilo_system', '9', 'Device Management - MGMT', false)
                nlapiInsertSelectOption('custpage_ilo_system', '7', 'FTG1', false)
                nlapiInsertSelectOption('custpage_ilo_system', '10', 'FTG2', false)
                nlapiInsertSelectOption('custpage_ilo_system', '11', 'FTG3', false)
         
            }
            else {
                //nlapiRemoveSelectOption('custpage_ilo_system', 1);
                //nlapiRemoveSelectOption('custpage_ilo_system', 5);
                //nlapiRemoveSelectOption('custpage_ilo_system', 6);
                //nlapiRemoveSelectOption('custpage_ilo_system', 7);
                //nlapiRemoveSelectOption('custpage_ilo_system', 8);
                //nlapiRemoveSelectOption('custpage_ilo_system', 9);
                //nlapiRemoveSelectOption('custpage_ilo_system', 10);
                //nlapiRemoveSelectOption('custpage_ilo_system', 11
                nlapiInsertSelectOption('custpage_ilo_system', '3', 'SEII', false)
                nlapiInsertSelectOption('custpage_ilo_system', '12', 'Public General', false)
                nlapiInsertSelectOption('custpage_ilo_system', '4', 'Newtec', false)
                nlapiInsertSelectOption('custpage_ilo_system', '2', 'iDirect', false)
            }
        }
    }

