
function beforeLoad_addButton(type, form) {
   
    if (type == 'view' && (nlapiGetFieldValue('category') != '5' || nlapiGetFieldValue('custevent_internal_case_type') != '13')) {
        //category mapping= {1-'����� ����� �����'
        // 3-'����� ����� �����'
        //5-'����� ����� �����'}
        // && ((nlapiGetFieldValue('category') == '3' && nlapiGetFieldValue('custevent_internal_case_type')== '6') || nlapiGetFieldValue('category') == '1')
        if (nlapiGetFieldValue('category') == '5' && nlapiGetContext().role == '1065' && (nlapiGetFieldValue('status') == '6' || nlapiGetFieldValue('status') == '7')) { //nlapiGetContext().role == '1119' - SandBox
            // status: 6- ����
            //7- ����� ������ ����� (prod=9)
            nlapiLogExecution('DEBUG', 'button clicked', 'no permission');
        }
        else {
            form.setScript('customscript_assembly_item_client'); // client script id
            form.addButton('custpage_button_print', '����� ���� �����', 'printButton()');
        }
    }            
}


        //custevent_internal_case_type mapping= {13-'����� �����'
        // 
        //}