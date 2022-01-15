function fieldchange(type, name) {
    if (name == 'custpage_irrelevant' && nlapiGetFieldValue('custpage_irrelevant') == 'T') {
        
        var selectReasonField = nlapiGetField('custpage_irrelevant_reason_select');
        if (!isNullOrEmpty(selectReasonField)) {
            selectReasonField.setDisplayType('normal');
            nlapiSetFieldMandatory('custpage_irrelevant_reason_select', true);
        }
        var reasonField = nlapiGetField('custpage_reason');
        if (!isNullOrEmpty(reasonField)) {
            reasonField.setDisplayType('normal');
            if (nlapiGetFieldValue('custpage_irrelevant_reason_select') == 'c') {
                var reasonField = nlapiGetField('custpage_reason');
                if (!isNullOrEmpty(reasonField)) {
                    nlapiSetFieldMandatory('custpage_reason', true);
                }
            }
            else {
                var reasonField = nlapiGetField('custpage_reason');
                if (!isNullOrEmpty(reasonField)) {
                    nlapiSetFieldMandatory('custpage_reason', false);
                }
            }
            //nlapiSetFieldMandatory('custpage_reason', true);
        }
        var fnameField = nlapiGetField('custpage_fname');
        if (!isNullOrEmpty(fnameField)) {
            nlapiSetFieldMandatory('custpage_fname', false);
        }
        var lnameField = nlapiGetField('custpage_lname');
        if (!isNullOrEmpty(lnameField)) {
            nlapiSetFieldMandatory('custpage_lname', false);
        }
    }
    else if (name == 'custpage_irrelevant' && nlapiGetFieldValue('custpage_irrelevant') == 'F') {
        var reasonField = nlapiGetField('custpage_reason');
        if (!isNullOrEmpty(reasonField)) {
            //reasonField.setDisplayType('hidden');
            nlapiSetFieldMandatory('custpage_reason', false);
        }
        var selectReasonField = nlapiGetField('custpage_irrelevant_reason_select');
        if (!isNullOrEmpty(selectReasonField)) {
            selectReasonField.setDisplayType('hidden');
            nlapiSetFieldMandatory('custpage_irrelevant_reason_select', false);
        }
        var fnameField = nlapiGetField('custpage_fname');
        if (!isNullOrEmpty(fnameField)) {
            nlapiSetFieldMandatory('custpage_fname', true);
        }
        var lnameField = nlapiGetField('custpage_lname');
        if (!isNullOrEmpty(lnameField)) {
            nlapiSetFieldMandatory('custpage_lname', true);
        }
    }
    else if (name == 'custpage_irrelevant_reason_select') {
        if (nlapiGetFieldValue('custpage_irrelevant_reason_select') == 'c') {
            var reasonField = nlapiGetField('custpage_reason');
            if (!isNullOrEmpty(reasonField)) {
                nlapiSetFieldMandatory('custpage_reason', true);
            }
        }
        else {
            var reasonField = nlapiGetField('custpage_reason');
            if (!isNullOrEmpty(reasonField)) {
                nlapiSetFieldMandatory('custpage_reason', false);
            }
        }

    }
}

function pageinit() {

    var div = document.getElementById('div__body');
    if (!isNullOrEmpty(div)) {
        div.dir = "rtl";
    }

    var reasonField = nlapiGetField('custpage_reason');
    if (!isNullOrEmpty(reasonField)) {
        //reasonField.setDisplayType('hidden');
        nlapiSetFieldMandatory('custpage_reason', false);
    }

    var selectReasonField = nlapiGetField('custpage_irrelevant_reason_select');
    if (!isNullOrEmpty(selectReasonField)) {
        selectReasonField.setDisplayType('hidden');
        nlapiSetFieldMandatory('custpage_irrelevant_reason_select', false);
    }

    if (!isNullOrEmpty(document.getElementById('custpage_ilo_check_stage')) && document.getElementById('custpage_ilo_check_stage').value == "stageOne") {
        document.getElementById('tdbody_submitter').style.display = 'none';
        document.getElementById('tdbody_secondarysubmitter').style.display = 'none';
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
