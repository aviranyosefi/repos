/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/ui/message'],
    function (message) {
        function beforeLoad(context) {
            if (context.type == context.UserEventType.VIEW) {
                var rec = context.newRecord;
                var warranty_status = rec.getValue('custrecord_ib_warranty_status');
                if (!isNullOrEmpty(warranty_status)) {  
                    var warranty_status_text = rec.getText('custrecord_ib_warranty_status');
                    var myMsg = message.create({
                        title: "WARRANTY STATUS",
                        message: warranty_status_text ,
                        type: getColor(warranty_status),
                        duration: 50000
                    });
                    context.form.addPageInitMessage({ message: myMsg });
                }
                         
            }
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function getColor(warranty_status) {
            var color = message.Type.INFORMATION
            if (warranty_status == 1) { color = message.Type.ERROR }
            else if (warranty_status == 5 || warranty_status == 7) { color = message.Type.WARNING }
            return color

        }
        return {
            beforeLoad: beforeLoad,
        };
    });

