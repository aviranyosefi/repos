var item_for_submit = 46;

function callInvCount() {
    var subs = nlapiGetFieldValue('subsidiary');
    var location = nlapiGetFieldValue('location');
    if (isNullOrEmpty(subs)) {
        alert('Please insert subsidiary')
        return;
    }
    if (isNullOrEmpty(location)) {
        alert('Please insert location')
        return;
    }
    var URL = 'https://system.eu2.netsuite.com/app/common/custom/custrecordentry.nl?rectype=200';
    document.getElementById("historytxt").click();
    window.open(URL, "popuphelp", "scrollbars=yes,resizable=yes,status=no,'top=" + 350 + ",left=" + 236 + ",height=600,width=1500'");  
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function pageInit() {
    var rectype = nlapiGetRecordType();
    if (rectype == 'customrecord_inventory_count_file_up') {
        var recId = nlapiGetRecordId();
        if (isNullOrEmpty(recId)) {
            document.getElementsByClassName('uir-multibutton')[0].style.display = "none"
        }
    }
}

function saveRec() {
    try {
        debugger
        var rectype = nlapiGetRecordType();
        if (rectype == 'customrecord_inventory_count_file_up') {

            var fileid = nlapiGetFieldValue('custrecord_uploaded_file');

            var win = window.opener;
            if (win != null) {
                var prevwin = win.window;
                prevwin.nlapiSetFieldValue('custbody_file_id', fileid);
                prevwin.nlapiSelectLineItem('item', 1)
                prevwin.nlapiSetCurrentLineItemValue('item', 'item', item_for_submit);
                prevwin.nlapiCommitLineItem('item');

                itemslnk = prevwin.document.getElementById("itemslnk");
                itemslnk.style.display = 'none';
                prevwin.document.getElementById("historytxt").click();
                set_inv_count = prevwin.document.getElementById("custpage_set_inv_count")
                set_inv_count.style.display = 'none';
            }
        }
        return true;
    }
    catch (e) {
        alert('error: ' +e)
    }
}

function EditSave() {
    try {
        var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_invcount_callinvcount_su', 'customdeploy_invcount_callinvcount_su', false);
        createdPdfUrl += '&Recid=' + nlapiGetRecordId();
        var response = nlapiRequestURL(createdPdfUrl);
        if (response.getBody()) {
            window.location.reload();
        }
    }
    catch (e) {
        alert('error: ' + e)
    }
}

function checkFile() {
    debugger;
    var uploaded_file = nlapiGetFieldValue('custrecord_uploaded_file')
    if (isNullOrEmpty(uploaded_file)) {
        alert('PLEASE UPLOADED FILE')
        return;
    }
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_invcount_check_file_su', 'customdeploy_invcount_check_file_su', false);
    createdPdfUrl += '&file=' + uploaded_file
    var response = nlapiRequestURL(createdPdfUrl);
    if (response.getBody()) {
        var res = response.getBody();
        if (res == 'fail') {
            showAlertBox('alert_No_relevant', 'fails', '', NLAlertDialog.ERROR)
            document.getElementsByClassName('uir-multibutton')[0].style.display = "none"
        }
        else {
            showAlertBox('alert_No_relevant', 'success', '', NLAlertDialog.CONFIRMATION)
            document.getElementsByClassName('uir-multibutton')[0].style.display = "block"
        }
   
    }


}


