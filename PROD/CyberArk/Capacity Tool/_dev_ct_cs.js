empType = nlapiGetFieldValue('custpage_user_type')
var EmpIdCol = 1 //EMPLOYEE ID
//var TotalCol = 14; // ASSESSMENT TYPE
var TotalAggCol = clcColumnindex(16, empType); //VALIDATION STATUS
var SubmitCol = clcColumnindex(17, empType); //SUBMIT
var CreateAcCol = clcColumnindex(18, empType); // CREATE ACTUAL
//var disabledSubmitCount = 0;
var prev_ia;
var at_type_change;
var ScreenOffset
var fff;

function SubmitAllActuals() {
    var flag = nlapiGetFieldValue('custpage_auto_lock_actual');
    if (flag == 'true') {
        alert('Actual period status is Close')
    }
    else {
        debugger;
        openLoadingdiv();
        var notSubmittedCount = 0;
        var linecount = nlapiGetLineItemCount('custpage_sublist');
        for (var i = 1; i <= linecount; i++) {
            at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
            var submit_type = nlapiGetLineItemValue('custpage_sublist', 'custpage_submit_type', i);
            var total_aggregated = nlapiGetLineItemValue('custpage_sublist', 'custpage_total_aggregated', i);
            if (at == '1' && checkIfShowSubmitButton(submit_type, total_aggregated, flag)) {
                var ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', i);
                nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_rep_ent_submit_checkbox', 1)
            }
            else if (at == '1' && submit_type == '2') {
                notSubmittedCount++
            }
        }
        if (notSubmittedCount != 0) {
            alert("Notice: there are " + notSubmittedCount + " record that are not Validated therefore they were not submitted!");
        }
        document.getElementById("submitter").click()

    }

}
function Clean() {
    nlapiSetFieldValue('custpage_type', '')
    nlapiSetFieldValue('custpage_submitted_type', '')
    nlapiSetFieldValue('custpage_employee', '')
    nlapiSetFieldValue('custpage_select_reporters', '')
    nlapiSetFieldValue('custpage_product_div', '')
    nlapiSetFieldValue('custpage_product_grp', '')
    document.getElementById("submitter").click()
}
function SubmitAll() {
    var flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
    if (flag == 'true') {
        alert('Forcast period status is Close')
    }
    else {
        var notSubmittedCount = 0;
        var linecount = nlapiGetLineItemCount('custpage_sublist');
        for (var i = 1; i <= linecount; i++) {
            at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
            var submit_type = nlapiGetLineItemValue('custpage_sublist', 'custpage_submit_type', i);
            var total_aggregated = nlapiGetLineItemValue('custpage_sublist', 'custpage_total_aggregated', i);
            if (at == '2' && checkIfShowSubmitButton(submit_type, total_aggregated, flag)) {
                var ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', i);
                nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_rep_ent_submit_checkbox', 1)
            }
            else if (at == '2' && submit_type == '2') {
                notSubmittedCount++
            }
        }
        if (notSubmittedCount != 0) {
            alert("Notice: there are " + notSubmittedCount + " record that are not Validated therefore they were not submitted!");
        }
        document.getElementById("submitter").click()

    }

}
function Submit() {
    debugger;
    var line = nlapiGetFieldValue('custpage_line_press')
    var ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', line);
    nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_rep_ent_submit_checkbox', 1)
    nlapiSetLineItemValue('custpage_sublist', 'custpage_submit_type', line, 1);
    var index = nlapiGetCurrentLineItemIndex('custpage_sublist');
    if (index == line)
        nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_submit_type', 1);
    setTimeout(function () {
        document.getElementById("custpage_sublist_addedit").click()
        hideBtn("uir-machine-button-row", 'class');
        hideBtn("uir-machine-row uir-machine-row-even listtextnonedit uir-machine-row-focused", 'class');
    }, 150);

}
function CreateActualAll() {
    var lock_actual = nlapiGetFieldValue('custpage_auto_lock_actual');
    if (lock_actual == 'true') {
        alert('Actual period status is Close')
    }
    else {
        var linecount = nlapiGetLineItemCount('custpage_sublist');
        //flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
        for (var i = 1; i <= linecount; i++) {
            at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
            if (at == '2') {
                var submit_type = nlapiGetLineItemValue('custpage_sublist', 'custpage_submit_type', i);
                var total_aggregated = nlapiGetLineItemValue('custpage_sublist', 'custpage_total_aggregated', i);
                var acual_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_acual_id', i);
                if (checkIfShowActualButton(submit_type, total_aggregated, null, acual_id, lock_actual)) {
                    createTran(i);
                }
            }
        }
        document.getElementById("submitter").click()
    }
}
function Create() {
    var line = nlapiGetFieldValue('custpage_line_press')
    addActualLine(line)
}
function addActualLine(line) {
    nlapiInsertLineItem('custpage_sublist', line)
    nlapiCommitLineItem('custpage_sublist');
    addStyleAndColors();
    setTimeout(function () {
        document.getElementById("custpage_sublist_addedit").click()
    }, 150);
}
function CreateForcast() {
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_dev_ct_addrow_su', 'customdeploy_dev_ct_addrow_su', false);
    createdPdfUrl += '&period=' + nlapiGetFieldValue('custpage_select_periodfrom');
    createdPdfUrl += '&a=' + nlapiGetFieldValue('custpage_auto_lock_actual');
    createdPdfUrl += '&f=' + nlapiGetFieldValue('custpage_auto_lock_forcast');
    createdPdfUrl += '&user_type=' + nlapiGetFieldValue('custpage_user_type');

    //createdPdfUrl += '&email=-1';
    window.open(createdPdfUrl, 'win', 'resizable=0,scrollbars=0,width=1750,height=290');
    //window.open(createdPdfUrl);
}

function pageInit() {
    var periodName = nlapiGetFieldText('custpage_select_periodfrom');
    nlapiSetFieldText('custpage_period_name', periodName);
    hideBtn("tbl_customscript_continue", 'id');
    hideBtn("tbl_secondarycustomscript_continue", 'id');
    hideBtn("tbl_customscript_create", 'id');
    hideBtn("tbl_secondarycustomscript_create", 'id');
    hideBtn("tdbody_secondarysubmitter", 'id');
    hideBtn("tdbody_secondarycustomscript_export", 'id');
    hideBtn("tdrightcap_secondarycustomscript_export", 'id');
    hideBtn("tdbody_secondarycustomscript_create_forcast", 'id');
    hideBtn("tbl_secondarycustomscript_clean", 'id');


    hideBtn("uir-machine-row uir-machine-row-even listtextnonedit uir-machine-row-focused", 'class');
    hideBtn("uir-machine-button-row", 'class');
    hideBtn("uir-machine-row uir-machine-row-odd listtextnonedit uir-machine-row-focused", 'class');
    hideBtn("uir-button-menu-divider", '');

    document.getElementsByClassName("uir-outside-fields-table")[1].align = 'center'

    addStyleAndColors();
    lock_forcast = nlapiGetFieldValue('custpage_auto_lock_forcast');
    lock_actual = nlapiGetFieldValue('custpage_auto_lock_actual');
    if (lock_actual == 'true' && lock_forcast == 'true') { CreatForcastBtnStyle() }
    addSortFun()
    dropdownDiv()
    floatDIV();
    closeLoadingdiv();
    return true;
}
function fieldChange(type, name) {
    if (name == 'custpage_npd' || name == 'custpage_maintenance' || name == 'custpage_appm' || name == 'custpage_cc') {
        var val = nlapiGetCurrentLineItemValue('custpage_sublist', name);
        at_type_change = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
        if (!checkNum(val)) {
            nlapiSetCurrentLineItemValue('custpage_sublist', name, '');
        }
        var total = calcTotal()
        nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_total', total);
    }
    else if (name == 'custpage_ia') {
        //debugger;
        var val = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ia');
        var at = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
        if (val != '' && val != prev_ia) {
            var ia = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ia');
            var period = nlapiGetFieldValue('custpage_select_periodfrom');
            var employee = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_emp_id');
            var res = Reporting_Entity(employee, period, ia, at);
            keys = Object.keys(res);
            if (res.length > 0) {
                var ct_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id');
                if (res[keys[0]] != ct_id) {
                    alert('It is not possible to create two records with the same investment area.')
                    nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_ia', prev_ia, true, true);
                    return;
                }
            }
            var segment = nlapiLookupField('customrecord_ct_investment_area', val, 'custrecord_ct_inverst_area_segment');
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_segment', segment);
        }
    }
    //addStyleAndColors()
}
function calcTotal() {
    var val = Number(nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_npd')) + Number(nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_maintenance')) + Number(nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_appm')) + Number(nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_cc'))
    return val

}
function clientScript() {
    addStyleAndColors()
}
function lineInit() {
    var custpage_mark = nlapiGetFieldValue('custpage_mark');
    if (custpage_mark != 'true') {
        acual_id = '';
        prev_ia = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ia');
        var actionType = 'block'
        var ct_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id');
        if (!isNullOrEmpty(ct_id)) {
            var at = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
            if (at == 1) {
                var flag = nlapiGetFieldValue('custpage_auto_lock_actual');
                if (flag == 'true') {
                    var actionType = 'none'
                }
            }
            else {
                flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
                acual_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_acual_id')
            }
            flag = chekTrueOrFalse(flag)
        }
        else {
            flag = true;
        }
        if (!isNullOrEmpty(acual_id) && empType != '4') {
            var actionType = 'none'
            flag = true;
        }
        hideDeleteBtnLines(actionType)
        hideRemoveLines()
        var fieldsArr = ["custpage_ia", 'custpage_npd', 'custpage_maintenance', 'custpage_appm', 'custpage_cc']
        for (var fld in fieldsArr) {
            nlapiSetLineItemDisabled('custpage_sublist', fieldsArr[fld], flag, Number(nlapiGetCurrentLineItemIndex('custpage_sublist')))
        }
       
    }
    setTimeout(function () {
        addStyleAndColors();
        hideBtn("uir-machine-row uir-machine-row-odd listtextnonedit", 'class');
    }, 150);
    return true;
}
function validateLine() {
    fff = document.getElementsByClassName('uir-machine-table-container')[0]
    ScreenOffset = fff.scrollTop
    var custpage_mark = nlapiGetFieldValue('custpage_mark');
    if (custpage_mark != 'true') {
        var ct_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id');
        var at = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
        var flag = "false";
        if (at == 1 && ct_id != "") {
            var flag = nlapiGetFieldValue('custpage_auto_lock_actual');
        }
        else if (at != "") {
            var acual_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_acual_id');
            if (!isNullOrEmpty(acual_id)) {
                flag = 'true'
            }
            else {
                if (at == 1) {
                    flag = nlapiGetFieldValue('custpage_auto_lock_actual');
                } else {
                    flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
                }

            }
        }
        if (flag == "false" && at == 1) {
            var res = getLinesTotal(at, 'validate');
        }
        else if (at == 2) {
            var res = getLinesTotal(at, 'validate');
        }
        if (!isNullOrEmpty(ct_id) && flag == "false") {
            updateTran(ct_id)
        }
        else if (flag == "false") {
            createTran(null)
        }
    }
    if (!res) { addStyleAndColors() }
    return res;
}
function insertLine() {
    var curCustId = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_emp_id');
    if (!isNullOrEmpty(curCustId))
        setTimeout(function () {
            var fieldsArr = ['custpage_emp_id', 'custpage_f_name', 'custpage_l_name', 'custpage_job_titel', 'custpage_pg', 'custpage_ol_name', 'custpage_pd', "custpage_total_aggregated", "custpage_ia", "custpage_segment", "custpage_npd", "custpage_maintenance", "custpage_appm", "custpage_cc"]
            var curLine = Number(nlapiGetCurrentLineItemIndex('custpage_sublist'));
            for (var fld in fieldsArr) {
                var val = fieldsArr[fld]
                nlapiSetCurrentLineItemValue('custpage_sublist', val, nlapiGetLineItemValue('custpage_sublist', val, curLine + 1));
            }
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_at', 1);
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_submit_type', 1);
            var row = document.getElementById('custpage_sublist_row_' + curLine);
            var cells = row.getElementsByTagName('td');
            var total_aggregated = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_total_aggregated');
            paintTotalAggregated(total_aggregated, cells)
            //submitAllStyle(disabledSubmitCount)
            var type = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at', curLine);
            checkType(type, nlapiGetCurrentLineItemIndex('custpage_sublist'), cells)
        }, 750);
    return true;
}
function deleteLine() {
    curCustId = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_emp_id');
    curAt = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
    curLine = Number(nlapiGetCurrentLineItemIndex('custpage_sublist'));
    var linecount = nlapiGetLineItemCount('custpage_sublist');
    for (var i = 1; i <= linecount; i++) {
        at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
        CustId = nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', i);
        if (at == curAt && curLine != i && CustId == curCustId) {
            var r = confirm("Are you sure you want to delete the line?");
            if (r == true) {
                var ct_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id');
                getLinesTotal(curAt, 'delete')
                deleteTran(ct_id, curAt);
                return true;
            } else { return false; }
        }
    }
    alert("Employee must have at least one record, the last record could not be deleted")
    return false
}
function deleteTran(id, at) {
    //if (at == 1) {
    //    getForcastByActual(id);
    //}
    nlapiDeleteRecord('customrecord_ct_reporting_entity', id)
}
function reclac() {
    setTimeout(function () {
        fff.scrollTo(0, ScreenOffset);
        hideBtn("uir-machine-button-row", 'class');
    }, 2000);
}
function getForcastByActual(id) {

    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_ct_acual_id', null, 'anyof', id))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', 2))

    var search = nlapiCreateSearch('customrecord_ct_reporting_entity', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var res = [];
    if (s.length > 0) {
        nlapiSubmitField('customrecord_ct_reporting_entity', s[0].id, 'custrecord_ct_acual_id', '')
    }
    return res;
}
function addStyleAndColors() {
    setTimeout(function () {
        var linecount = nlapiGetLineItemCount('custpage_sublist');
        var empArr = [];
        for (var i = 1; i <= linecount; i++) {
            empArr.push(nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', i));
            var at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
            var row = document.getElementById('custpage_sublist_row_' + i);
            var cells = row.getElementsByTagName('td');
            var total_aggregated = nlapiGetLineItemValue('custpage_sublist', 'custpage_total_aggregated', i);
            checkType(at, i, cells, total_aggregated)        
            paintTotalAggregated(total_aggregated, cells)
            //submitAllStyle(disabledSubmitCount)
        }
        var uniqEmpArr = toUniqueArray(empArr);
        for (var j = 0; j < uniqEmpArr.length; j++) {
            var lines = [];
            for (var k = 1; k <= linecount; k++) {
                var row = document.getElementById('custpage_sublist_row_' + k);
                var cells = row.getElementsByTagName('td');
                var employee = nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', k);
                if (employee == '') {
                    employee = nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', k + 1);
                }
                if (employee == uniqEmpArr[j]) {
                    lines.push(k);
                    if (j % 2 == 0) {
                        paintCoulmns('#fcdbc5', EmpIdCol, cells)
                    }
                    else {
                        paintCoulmns('#e6e1c6', EmpIdCol, cells)
                    }
                }
                else if (lines.length > 0) {
                    break;
                }
            }
        }
    }, 150);
}
function paintCoulmns(color, coulmn, cells) {
    cells[coulmn].style = 'background-color : ' + color + ' !important;';
}
function checkType(at, i, cells, total_aggregated) {
    if (at == '2') {
        flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
        //var color = 'yellow';
        var acual_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_acual_id', i);
        var lock_actual = nlapiGetFieldValue('custpage_auto_lock_actual');
    }
    else if (at == '1') {
        var flag = nlapiGetFieldValue('custpage_auto_lock_actual');
        //var color = 'green';
    }
    //paintCoulmns(color, TotalCol, cells);
    var submit_type = nlapiGetLineItemValue('custpage_sublist', 'custpage_submit_type', i);
    var index = Number(nlapiGetCurrentLineItemIndex('custpage_sublist'));
    if (index != i) {
        var total_aggregated = nlapiGetLineItemValue('custpage_sublist', 'custpage_total_aggregated', i);
    }
    if (checkIfShowSubmitButton(submit_type, total_aggregated, flag)) {
        addSubmitButton(i, cells, null);
    }
    else {
        addSubmitButton(i, cells, 'disabled')
    }
    if (at == '2' && checkIfShowActualButton(submit_type, total_aggregated, flag, acual_id, lock_actual)) {
        addCreateActualButton(i, cells, null)
    }
    else if (at == '2' && acual_id == "") {
        flag = nlapiGetFieldValue('custpage_auto_lock_actual');
        addCreateActualButton(i, cells, 'disabled')
    }
    setLineToNotSubmittet(at, total_aggregated, i, submit_type)
}
function setLineToNotSubmittet(at, total_aggregated, i, submit_type, current) {
    // debugger;
    if (at == at_type_change && total_aggregated == '2' && submit_type == '1') {
        if (current == 'current') {
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_submit_type', 2);
            ct_id = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id');
        }
        else {
            nlapiSetLineItemValue('custpage_sublist', 'custpage_submit_type', i, 2);
            ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', i);
        }
        nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_rep_ent_submit_checkbox', 2)
    }
    return false;
}
function checkIfShowSubmitButton(submit_type, total_aggregated, flag) {
    if (submit_type != 1 && total_aggregated == 1 && flag == 'false') {
        return true
    }
    return false;

}
function checkIfShowActualButton(submit_type, total_aggregated, flag, acual_id, lock_actual) {
    if (submit_type == 1 && total_aggregated == 1 && acual_id == "" && lock_actual == 'false') { //&& flag == 'false'
        return true
    }
    return false;

}
function addSubmitButton(i, cells, disabled) {
    if (disabled == 'disabled') {
        cells[SubmitCol].innerHTML = '<button disabled onclick="nlapiSetFieldValue(' + "'custpage_line_press', " + i + ');document.getElementById(' + "'customscript_continue'" + ').click()"' + ' >Submit</button ></html >';       
    }
    else {
        cells[SubmitCol].innerHTML = '<button onclick="nlapiSetFieldValue(' + "'custpage_line_press', " + i + ');document.getElementById(' + "'customscript_continue'" + ').click()"' + ' >Submit</button ></html >';
    }
}
function addCreateActualButton(i, cells, disabled) {
    if (disabled == 'disabled') {
        cells[CreateAcCol].innerHTML = '<button disabled onclick="nlapiSetFieldValue(' + "'custpage_line_press', " + i + ');document.getElementById(' + "'customscript_create'" + ').click()"' + ' >Create Actual</button ></html >';
    }
    else {
        cells[CreateAcCol].innerHTML = '<button onclick="nlapiSetFieldValue(' + "'custpage_line_press', " + i + ');document.getElementById(' + "'customscript_create'" + ').click()"' + ' >Create Actual</button ></html >';
    }
}
function getLinesTotal(at, typeBtn) {
    var total = 0;
    var lines = [];
    var curCustId = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_emp_id');
    var index = Number(nlapiGetCurrentLineItemIndex('custpage_sublist'));
    for (var i = 1; nlapiGetLineItemCount('custpage_sublist'); i++) {
        var empID = nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', i)
        if (curCustId == empID || index == i) {
            if (index == i) {
                var currAt = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
            }
            else {
                var currAt = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', i);
            }
            if (currAt == at) {
                if (index == i) {
                    if (typeBtn != 'delete') {
                        total += Number(nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_total'));
                    }
                }
                else {
                    total += Number(nlapiGetLineItemValue('custpage_sublist', 'custpage_total', i));
                }
                lines.push(i);
            }
        }
        else if (lines.length > 0) {
            break;
        }
    }
    return paintTotal(total, index, lines, typeBtn);
}
function paintTotal(total, index, lines, typeBtn) {
    //debugger;
    var val = 1
    if (total != 100) {
        val = 2
    }
    for (var m = 0; m < lines.length; m++) {
        if (index == lines[m]) {
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_total_aggregated', val);
            var at = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
            submit_type = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_submit_type');
        }
        else {
            nlapiSetLineItemValue('custpage_sublist', 'custpage_total_aggregated', lines[m], val);
            if (typeBtn == 'delete') {
                nlapiSetLineItemValue('custpage_sublist', 'custpage_submit_type', lines[m], val);
                if (val == 2) {
                    var ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', lines[m]);
                    nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_rep_ent_submit_checkbox', 2)
                }
            }
            var at = nlapiGetLineItemValue('custpage_sublist', 'custpage_at', lines[m]);
            submit_type = nlapiGetLineItemValue('custpage_sublist', 'custpage_submit_type', lines[m]);
        }
        var i = lines[m];
        setLineToNotSubmittet(at, val, i, submit_type, 'current')
        var row = document.getElementById('custpage_sublist_row_' + i);
        var cells = row.getElementsByTagName('td');
        checkType(at, i, cells, val)
    }
    if (total > 100) {
        alert("Employee’s periodical Assessment can't exceed 100%.")
        return false;
    }
    return true;
}
function toUniqueArray(a) {
    var newArr = [];
    for (var i = 0; i < a.length; i++) {
        if (newArr.indexOf(a[i]) === -1) {
            newArr.push(a[i]);
        }
    }
    return newArr;
}
function updateTran(ct_id) {
    openLoadingdiv();
    var at = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_at');
    if (at == 1) {
        var flag = nlapiGetFieldValue('custpage_auto_lock_actual');
    }
    else {
        flag = nlapiGetFieldValue('custpage_auto_lock_forcast');
    }
    flag = chekTrueOrFalse(flag)
    if (!flag) {
        console.log('updateTran')
        var npd = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_npd');
        var maintenance = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_maintenance');
        var appm = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_appm');
        var cc = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_cc');
        var segment = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_segment');
        var ia = nlapiGetCurrentLineItemValue('custpage_sublist', 'custpage_ia');
        var fields = []; var val = [];
        fields[0] = 'custrecord_ct_rep_ent_npd';
        fields[1] = 'custrecord_ct_rep_ent_maint'
        fields[2] = 'custrecord_ct_rep_ent_appm';
        fields[3] = 'custrecord_ct_rep_ent_cc';
        fields[4] = 'custrecord_ct_rep_ent_segment';
        fields[5] = 'custrecord_ct_rep_ent_invest_area';
        val[0] = npd
        val[1] = maintenance
        val[2] = appm
        val[3] = cc
        val[4] = segment
        val[5] = ia
        nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, fields, val)
    }
    else { console.log('not updateTran') }
    closeLoadingdiv()
}
function createTran(line) {
    openLoadingdiv();
    if (isNullOrEmpty(line)) {
        var index = Number(nlapiGetCurrentLineItemIndex('custpage_sublist'))
        index = index + 1
    }
    else {
        index = line;
    }
    var emp_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_emp_id', index);
    if (!isNullOrEmpty(emp_id)) {
        var rec = nlapiCreateRecord('customrecord_ct_reporting_entity');
        var npd = nlapiGetLineItemValue('custpage_sublist', 'custpage_npd', index);
        var maintenance = nlapiGetLineItemValue('custpage_sublist', 'custpage_maintenance', index);
        var appm = nlapiGetLineItemValue('custpage_sublist', 'custpage_appm', index);
        var cc = nlapiGetLineItemValue('custpage_sublist', 'custpage_cc', index);
        var segment = nlapiGetLineItemValue('custpage_sublist', 'custpage_segment', index);
        var ia = nlapiGetLineItemValue('custpage_sublist', 'custpage_ia', index);
        var period = nlapiGetFieldValue('custpage_select_periodfrom');
        rec.setFieldValue('custrecord_ct_rep_ent_npd', npd)
        rec.setFieldValue('custrecord_ct_rep_ent_maint', maintenance)
        rec.setFieldValue('custrecord_ct_rep_ent_appm', appm)
        rec.setFieldValue('custrecord_ct_rep_ent_cc', cc)
        rec.setFieldValue('custrecord_ct_rep_ent_segment', segment)
        rec.setFieldValue('custrecord_ct_rep_ent_invest_area', ia)
        rec.setFieldValue('custrecord_ct_rep_ent_period', period)
        rec.setFieldValue('custrecord_ct_rep_ent_type', 1)
        rec.setFieldValue('custrecord_ct_rep_ent_employee', emp_id)
        rec.setFieldValue('custrecord_ct_rep_ent_submit_checkbox', 1)

        ct_id = nlapiGetLineItemValue('custpage_sublist', 'custpage_ct_id', index)
        var id = nlapiSubmitRecord(rec, null, true);
        nlapiSubmitField('customrecord_ct_reporting_entity', ct_id, 'custrecord_ct_acual_id', id);
        if (isNullOrEmpty(line)) {
            nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_ct_id', id);
            nlapiSetLineItemValue('custpage_sublist', 'custpage_acual_id', index, id);
        }
    }
    closeLoadingdiv();
}
function openLoadingdiv() {
    var bd = document.getElementById('bgdiv');
    var loadingdiv = document.getElementById('loadingdiv');
    bd.style.display = 'block'
    loadingdiv.style.display = 'block'
}
function closeLoadingdiv() {
    document.getElementById("bgdiv").style.display = 'none';
    document.getElementById("loadingdiv").style.display = 'none';
}
function paintTotalAggregated(total_aggregated, cells) {
    if (total_aggregated == 2) {
        paintCoulmns('red', TotalAggCol, cells);
        //disabledSubmitCount++;
    }
    else {
        paintCoulmns('green', TotalAggCol, cells)
    }
}
function chekTrueOrFalse(flag) {
    if (flag == "true") { return true }
    else { return false }
}
function hideDeleteBtnLines(actionType) {
    document.getElementById("tbl_custpage_sublist_remove").style.display = actionType
}
function hideRemoveLines() {
    document.getElementById("tbl_custpage_sublist_insert").style.display = 'none'
}
function submitAllStyle(count) {
    var btn = document.getElementById("customscript_submit_all")
    if (count > 0) {
        btn.disabled = true;
        btn.style.opacity = '50%'
    }
    else {
        btn.disabled = false;
        btn.style.opacity = '100%'
    }
}
function CreatForcastBtnStyle() {
    var btn = document.getElementById("customscript_create_forcast")
    btn.disabled = true;
    btn.style.opacity = '50%'
}
function fnExcelReport() {
    actual = document.getElementById('custpage_period_status_actual_val')
    forcast = document.getElementById('custpage_period_status_forcast_val')
    period = nlapiGetFieldText('custpage_select_periodfrom')
    var tab_text = '<h3>' + actual.innerHTML + '</h3>';
    tab_text += '<h3>' + forcast.innerHTML + '</h3>';
    tab_text += '<h3>Period: ' + period + '</h3>';
    tab_text += "<table border='2px'><tr bgcolor='#87AFC6'>";
    tab = document.getElementById('custpage_sublist_splits'); // id of table
    for (var j = 0; j < tab.rows.length - 3; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    }
    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    }
    else                 //other browser not tested on IE 11
        var myBlob = new Blob([tab_text], { type: 'application/vnd.ms-excel' });
    var url = window.URL.createObjectURL(myBlob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = period + ".xls";
    a.click();
    //adding some delay in removing the dynamically created link solved the problem in FireFox
    setTimeout(function () { window.URL.revokeObjectURL(url); }, 0);

    return (sa);
}
function addSortFun() {
    table = document.getElementById("custpage_sublist_splits");
    if (table != null) {
        rows = table.rows;
        td = rows[0].getElementsByTagName("TD")[3]
        td.addEventListener("click", function () { sortTable(3, 'custpage_sort_fname'); });

        td = rows[0].getElementsByTagName("TD")[4]
        td.addEventListener("click", function () { sortTable(4, 'custpage_sort_lname'); });

        td = rows[0].getElementsByTagName("TD")[5]
        td.addEventListener("click", function () { sortTable(5, 'custpage_sort_job'); });

        td = rows[0].getElementsByTagName("TD")[6]
        td.addEventListener("click", function () { sortTable(6, 'custpage_sort_pdiv'); });

        td = rows[0].getElementsByTagName("TD")[7]
        td.addEventListener("click", function () { sortTable(7, 'custpage_sort_pgrp'); });

        td = rows[0].getElementsByTagName("TD")[8]
        td.addEventListener("click", function () { sortTable(8, 'custpage_sort_office'); });

        td = rows[0].getElementsByTagName("TD")[9]
        td.addEventListener("click", function () { sortTable(9, 'custpage_sort_seg'); });

        td = rows[0].getElementsByTagName("TD")[10]
        td.addEventListener("click", function () { sortTable(10, 'custpage_sort_inv'); });

        //td = rows[0].getElementsByTagName("TD")[11]
        //td.addEventListener("click", function () { sortTable(10, 'custpage_sort_inv'); });
    }
}
function sortTable(num, fieldId) {
    sort_type = nlapiGetFieldValue(fieldId)
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("custpage_sublist_splits");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[num];
            y = rows[i + 1].getElementsByTagName("TD")[num];
            //check if the two rows should switch place:
            if (sort_type == 'asc') {
                if (x.innerHTML < y.innerHTML) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
                nlapiSetFieldValue(fieldId, 'desc')
            }
            else {
                if (x.innerHTML > y.innerHTML) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
                nlapiSetFieldValue(fieldId, 'asc')
            }

        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function MarkAll() {
    nlapiSetFieldValue('custpage_mark', true)
    var LineCount = nlapiGetLineItemCount('custpage_sublist');
    if (LineCount != 0) {
        for (var i = 0; i < LineCount; i++) {
            if (nlapiGetLineItemValue('custpage_sublist', 'custpage_result_cb', i + 1) == 'F') {
                nlapiSelectLineItem('custpage_sublist', i + 1)
                nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_result_cb', 'T', true, true);
                nlapiCommitLineItem('custpage_sublist')
            }
        }
    }
    nlapiSetFieldValue('custpage_mark', false)
    hideBtn("uir-machine-button-row", 'class');
}
function UnmarkAll() {
    nlapiSetFieldValue('custpage_mark', true)
    var LineCount = nlapiGetLineItemCount('custpage_sublist');
    if (LineCount != 0) {
        for (var i = 0; i < LineCount; i++) {
            if (nlapiGetLineItemValue('custpage_sublist', 'custpage_result_cb', i + 1) == 'T') {
                nlapiSelectLineItem('custpage_sublist', i + 1)
                nlapiSetCurrentLineItemValue('custpage_sublist', 'custpage_result_cb', 'F', true, true);
                nlapiCommitLineItem('custpage_sublist')
            }
        }
    }
    nlapiSetFieldValue('custpage_mark', false)
    hideBtn("uir-machine-button-row", 'class');
}
function isNullOrEmpty(val) {
    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function checkNum(val) {
    if (val >= 0 && val <= 100) { return true }
    else {
        alert("Investment Type can't exceed 100%.");
        return false;
    }
}
function hideBtn(id, type) {
    if (type == 'id') {
        var btn = document.getElementById(id)
        if (btn != null) {
            btn.style.display = 'none';
        }
    }
    else if ('class') {
        var btn = document.getElementsByClassName(id)
        if (btn.length > 0) {
            btn[0].style.display = 'none';
        }
    }
    else {
        var btn = document.getElementsByClassName(id)
        if (btn.length > 0) {
            btn[0].style.display = 'none';
            btn[1].style.display = 'none';
        }
    }
}
function Reporting_Entity(employee, period, invest_area, type) {

    var filters = new Array();
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_employee', null, 'anyof', employee))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_period', null, 'anyof', period))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_invest_area', null, 'anyof', invest_area))
    filters.push(new nlobjSearchFilter('custrecord_ct_rep_ent_type', null, 'anyof', type))
    filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'))

    var search = nlapiCreateSearch('customrecord_ct_reporting_entity', filters, null);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    var res = [];
    for (var i = 0; i < s.length; i++) {
        res[s[i].id] = [s[i].id]
    }
    return res;
}
function pressOk() {
    var input = document.getElementById("myInput");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("myBtn").click();
        }
    });
}
function clcColumnindex(num, empType) {
    if (empType == '4') {
        return num
    }
    return num - 2

}
function dropdownDiv() {
    var dropdown = document.getElementsByClassName("dropdownDiv")
    for (var i = 0; i < dropdown.length; i++) {
        dropdown[i].style.width = '300px'
        dropdown[i].style.height = '100px'
    }
}
function floatDIV() {
    var divs = document.getElementsByClassName("uir-field-wrapper uir-inline-tag")
    for (var i = 2; i < 7; i++) {
        divs[i].style.float = 'left'
    }
}
function setAlignLeft() {
    alignList = ['nl2', 'nl3']
    for (var i = 0; i < alignList.length; i++) {
        var div = document.getElementById(alignList[0]);
        div.style.textAlign = 'left'
    }

}
