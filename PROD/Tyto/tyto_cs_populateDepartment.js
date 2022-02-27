/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 FEB 2022  Maya Katz Libhaber
 */
define(['N/ui/dialog', 'N/currentRecord'],
    function (dialog, currentRecord) {
        function saveRecord(scriptContext) {
            var rec = currentRecord.get();
            var lineCount = rec.getLineCount('item');
            var recStatus = rec.getValue('status').toLowerCase();
            log.debug('recStatus', recStatus);
            var BodyDepartemnt = rec.getValue('department');
            if (!isNullOrEmpty(BodyDepartemnt)) {
                log.debug('BodyDepartemnt', BodyDepartemnt);
                var isContains = recStatus.indexOf('pending')//contains 'pendingApproval' or 'pendingReceipt'
                log.debug('isContains', isContains);
                if (isContains != -1) { //then needs to populate all sublist lines if the user confirm to override
                    //var options = {
                    //    title: "Populate all lines with header department",
                    //    message: "Press OK or Cancel"
                    //};
                    //function success(result) {//user pressed o.k.
                    //    debugger;
                    //    alert("Success with value " + result); 
                    //    rec.setValue('memo' ,'fasdfsdfdsf')
                    //    for (var i = 0; i < lineCount; i++) {   
                    //        //alert("lineCount " + lineCount + 'BodyDepartemnt ' + BodyDepartemnt); 
                    //        //var lineNum = rec.selectLine({sublistId: 'item',line: i});
                    //       rec.selectLine({sublistId: 'item',line: i});

                    //        rec.setCurrentSublistValue({
                    //            sublistId: 'item',
                    //            fieldId: 'department',
                    //            value: BodyDepartemnt,
                    //            ignoreFieldChange: true
                    //        });
                    //        rec.commitLine({sublistId: 'item'});
                    //    }
                    //}
                    //function failure(reason) {//user pressed cancel    
                    //    console.log("Failure: " + reason); 
                    //    for (var i = 0; i < lineCount; i++) {
                    //        var departmentValue = rec.getSublistValue('item', 'department', i);
                    //        if (isNullOrEmpty(departmentValue)) {
                    //            rec.setSublistValue('item', 'department', i, BodyDepartemnt);
                    //        }
                    //    }
                    //}
                    //dialog.confirm(options).then(success).catch(failure);
                    if (confirm("Are you sure you want to populate all lines with header department?")) {
                        for (var i = 0; i < lineCount; i++) {
                            settingValues(rec, i, BodyDepartemnt);
                        }

                    } else {
                        for (var i = 0; i < lineCount; i++) {
                            var departmentValue = rec.getSublistValue('item', 'department', i);
                            if (isNullOrEmpty(departmentValue)) {
                                settingValues(rec, i, BodyDepartemnt);
                            }
                        }
                    }
                } else {//then needs to populate just the empty departemnt lines without confirmation
                    for (var i = 0; i < lineCount; i++) {
                        var departmentValue = rec.getSublistValue('item', 'department', i);
                        if (isNullOrEmpty(departmentValue)) {
                            settingValues(rec, i, BodyDepartemnt);
                        }
                    }
                }
            }

            return true;
        }
        function settingValues(rec, i, BodyDepartemnt) {
            rec.selectLine({ sublistId: 'item', line: i });

            rec.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'department',
                value: BodyDepartemnt,
                ignoreFieldChange: true
            });
            rec.commitLine({ sublistId: 'item' });
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            saveRecord: saveRecord
        };
    });




