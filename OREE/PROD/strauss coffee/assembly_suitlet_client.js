function cancel() {
    window.open('https://6208757.app.netsuite.com/app/crm/support/supportcase.nl?id=' + nlapiGetFieldValue('custpage_relatedsc_select'));
   //window.open('https://6208757-sb1.app.netsuite.com/app/crm/support/supportcase.nl?&id=' + nlapiGetFieldValue('custpage_relatedsc_select')); // SandBox
}

function fieldChanged(type,name,linenum) {
    if (name == 'custpage_resultssublist_list') {
        if (nlapiGetCurrentLineItemValue(type, name) == 'b') {
            nlapiSetLineItemDisabled(type, 'custpage_resultssublist_qty', false, linenum);
            nlapiSetLineItemDisabled(type, 'custpage_resultssublist_memo', false, linenum);
        }
        else if (nlapiGetCurrentLineItemValue(type, name) == 'a') {
            nlapiSetLineItemDisabled(type, 'custpage_resultssublist_qty', true, linenum);
            nlapiSetLineItemDisabled(type, 'custpage_resultssublist_memo', true, linenum);
        }
    }
    else if (name == 'custpage_resultssublist_qty') {
        if (nlapiGetLineItemValue(type, name, linenum) > nlapiGetLineItemValue(type,'custpage_resultssublist_qtyintree',linenum)) {
            alert('���� ������ ����� ����� ��� �����');
            //alert('������:' + nlapiGetLineItemValue(type, name,linenum));
            //alert('���:' + nlapiGetLineItemValue(type, 'custpage_resultssublist_qtyintree',linenum));
        }
    }
}

function pageLoad() {
    if (nlapiGetFieldValue('custpage_isapp') != 'F') {
        var rec = nlapiLoadRecord('supportcase', nlapiGetFieldValue('custpage_relatedsc_select'));
        var storage = nlapiGetFieldValue('custpage_storage');
        //var loction = nlapiLookupField('employee', rec.getFieldValue('assigned'), 'location')
        if ((rec.getFieldValue('category') == '3' || rec.getFieldValue('category') == '1') && isNullOrEmpty(storage)) {
            alert('�� ���� ����� ���� ����� - �� ����� ���� ���� ������ ������');
            location.href = 'https://6208757.app.netsuite.com/app/crm/support/supportcase.nl?id=' + nlapiGetFieldValue('custpage_relatedsc_select');
            //location.href = 'https://6208757-sb1.app.netsuite.com/app/crm/support/supportcase.nl?&id=' + nlapiGetFieldValue('custpage_relatedsc_select'); //-SandBox
        }
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}