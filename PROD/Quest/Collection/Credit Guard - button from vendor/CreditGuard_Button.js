function credit_guard_button() {
    try {
        var rectype = nlapiGetRecordType();
        nlapiLogExecution('DEBUG', 'SCRIPT - Client1', 'RUN');
        nlapiLogExecution('DEBUG', 'rectype', rectype);

        var custid = '';
        var cardid = '';

        if (rectype == 'customer') {
            nlapiLogExecution('DEBUG', 'IN', 'CUSTOMER IF');

            custid = nlapiGetRecordId();
            cardid = nlapiLookupField('customer', custid, 'custentity_card_id');

        }
        else {
            nlapiLogExecution('DEBUG', 'ELSE', 'ELSE IF');

            var recid = nlapiGetRecordId();
            nlapiLogExecution('DEBUG', 'recid', recid);
            var rec = nlapiLoadRecord(rectype, recid);
            custid = rec.getFieldValue('custbody_customer')



            //custid = nlapiGetFieldValue('custbody_customer');
            cardid = nlapiLookupField('customer', custid, 'custentity_card_id');

        }
        nlapiLogExecution('DEBUG', 'custid + cardid', custid + ' + ' + cardid);
        var suiteletUrl = nlapiResolveURL('SUITELET', 'customscript_credit_guard_interface', 'customdeploy_credit_guard_interface', false);
        suiteletUrl += '&custid=' + custid + '&cardid=' + cardid + '&rectype=' + rectype;
        window.open(suiteletUrl);

        //window.location = nlapiResolveURL('SUITELET', 'customscript_credit_guard_interface', 'customdeploy_credit_guard_interface')+'&custid='+custid + '&cardid=' + cardid;
        //window.open('https://6398307-sb1.app.netsuite.com/app/site/hosting/scriptlet.nl?script=203&deploy=1&custid=' + custid + '&cardid=' + cardid + '&rectype=' + rectype);


        return true;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error', JSON.stringify(e));
    }
}
