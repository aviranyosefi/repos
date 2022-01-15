function ValidateLines(type, name) {
    //debugger;
    var department = nlapiGetCurrentLineItemValue('item', 'department');
    var rectypr = nlapiGetRecordType();
    if (rectypr == 'expensereport' || rectypr == 'vendorcredit')
        department = nlapiGetCurrentLineItemValue('expense', 'department');


    if (department != '' && department != null && department != undefined) {
        nlapiLogExecution('DEBUG', 'department:  ', department);
        var dep = nlapiLoadRecord('department', department);
        var pDep = dep.getFieldValue('parent');
        nlapiLogExecution('DEBUG', 'pDep:  ', pDep);
        if (department == '2' || pDep == '2') {
            nlapiLogExecution('DEBUG', 'nlapiSetLineItemMandatory:  ', " ");
            var project = nlapiGetCurrentLineItemValue(type, 'custcol_md_project');
            if (project != '' && project != null && project != undefined) {
                return true;
            }
            else {
                alert('Please enter value for filed Project (line: ' + nlapiGetCurrentLineItemIndex('item') + ' )');
                return false;
            }

            //nlapiSetLineItemMandatory('item', 'custcol_md_project', true, nlapiGetCurrentLineItemIndex('item'));
        }
        else {
            nlapiLogExecution('DEBUG', 'nlapiSetLineItemMandatory:  ', "false ");
            //nlapiSetLineItemMandatory('item', 'custcol_md_project', false);

            return true;
        }
    }
    return true;
}




//function ValidateLines(type, name) {
//    var department = nlapiGetCurrentLineItemValue('item', 'department');
//    if (department != '' && department != null && department != undefined) {
//        nlapiLogExecution('DEBUG', 'department:  ', department);
//        var dep = nlapiLoadRecord('department', department);
//        var pDep = dep.getFieldValue('parent');
//        nlapiLogExecution('DEBUG', 'pDep:  ', pDep);
//        if (department == '2' || pDep == '2') {
//            nlapiLogExecution('DEBUG', 'nlapiSetLineItemMandatory:  ', " ");
//            var project = nlapiGetCurrentLineItemValue('item', 'custcol_md_project'); 
//            if (project != '' && project != null && project != undefined) {
//                return true;
//            }
//            else {
//                alert('Please enter value for filed Project (line: ' + nlapiGetCurrentLineItemIndex('item')+' )');
//                return false;
//            }

//            //nlapiSetLineItemMandatory('item', 'custcol_md_project', true, nlapiGetCurrentLineItemIndex('item'));
//        }
//        else {
//            nlapiLogExecution('DEBUG', 'nlapiSetLineItemMandatory:  ', "false ");
//            //nlapiSetLineItemMandatory('item', 'custcol_md_project', false);

//            return true;
//        }
//    }
//    return true;
//}