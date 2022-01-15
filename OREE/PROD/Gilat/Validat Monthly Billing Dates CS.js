function save_record() {
    var From = nlapiGetFieldValue('custpage_from_date');
    var datefrom = null;
    var fromFlag = false;

    var To = nlapiGetFieldValue('custpage_to_date');
    var dateTo = null;
    var toFlag = false;

    var Exe = nlapiGetFieldValue('custpage_exe_date');
    var dateExe = null;
    var exeFlag = false;

    if (From != null && From != '' && From != undefined) {
        nlapiLogExecution('DEBUG', 'from date', From);
        datefrom = nlapiStringToDate(From);
        fromFlag = true
    }
    if (To != null && To != '' && To != undefined) {
        nlapiLogExecution('DEBUG', 'To date', To);
        dateTo = nlapiStringToDate(To);
        toFlag = true;
    }
    if (Exe != null && Exe != '' && Exe != undefined) {
        nlapiLogExecution('DEBUG', 'Exe date', Exe);
        dateExe = nlapiStringToDate(Exe);
        exeFlag = true;
    }

    if (fromFlag == true && toFlag == true) {
        if (datefrom > dateTo) {
            nlapiLogExecution('DEBUG', 'from > to', From + ' - ' + To);
            alert('To Date can not be prior to From Date');
            return false;
        }
    }

    if (toFlag == true && exeFlag == true) {
        if (dateExe < dateTo) {
            nlapiLogExecution('DEBUG', 'To > Exe', To + ' - ' + Exe);
            alert('Execution Date can not be prior to To Date');
            return false;
        }
    }

    return true;
}