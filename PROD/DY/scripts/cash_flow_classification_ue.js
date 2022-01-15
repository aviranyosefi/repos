
function afterSubmit() { 

    var context = nlapiGetContext().getExecutionContext()
    nlapiLogExecution('debug', 'context', context);
    if (context == 'scheduled' || context == 'webservices' ) {
        try {
            var PayRec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId())
            var payee = PayRec.getFieldValue('entity');
            try {
                var valueField = '2';//Vendor Payment
                var rec = nlapiLoadRecord('employee', payee)
                if (rec) { // employee
                    var subsidiary = rec.getFieldValue('subsidiary');
                    if (subsidiary == '3') { // INK
                        valueField = '5' // Salary Payments & Related Expenses
                    }
                }
            } catch (e) {
                var salary = nlapiLookupField('vendor', payee, 'custentity_salary', true);
                if (salary == 'YES') { // Salary Payments & Related Expenses
                    valueField = '5'
                }
            }

            PayRec.setFieldValue('custbody_cf_classification', valueField)

        } catch (e) {
            nlapiLogExecution('debug', 'afterSubmit error', e);
            PayRec.setFieldValue('custbody_cf_classification', valueField)
        }

        nlapiSubmitRecord(PayRec)
    }
    
}

