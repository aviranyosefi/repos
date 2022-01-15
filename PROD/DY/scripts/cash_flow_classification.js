
function pageInitCf() {
    debugger;
    try {
        var payee = nlapiGetFieldValue('entity');
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

        nlapiSetFieldValue('custbody_cf_classification', valueField)

    } catch (e) { nlapiSetFieldValue('custbody_cf_classification', valueField) }

}

