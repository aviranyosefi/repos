
function firstMailBatch_ss(type) {

    runTwice();
    //	runTwice();
    //	runTwice();


}

function runTwice() {


    var context = nlapiGetContext();
    var emailJobID = context.getSetting('SCRIPT', 'custscript_splitit_ss_emails_data');

    InvArr = JSON.parse(emailJobID);

    nlapiLogExecution('DEBUG', 'InvArr[i].id', InvArr.length);
    ////


    //var subsidiary = request.getParameter('custpage_ilo_subsidiary');


    lastFormName = 'Documents Sent';
    var subsidiary = InvArr[0].subsidiary;
    var mail;
    var subRec = nlapiLoadRecord('subsidiary', subsidiary)
    var subject = subRec.getFieldValue('custrecord_batch_subject_mail');
    var body = subRec.getFieldValue('custrecord_batch_body_mail');
    var body_mail;
    var customer;

    var employee = nlapiGetContext();
    var employeeId = employee.user;

    for (var i = 0; i < InvArr.length; i++) {
        mail = InvArr[i].mail.split(",")
        var firstMail = mail.shift();
        body_mail = body;
        customer = InvArr[i].customer;
        body_mail = body_mail.replace("(Merchant Name)", customer.replace(/[0-9]/g, ""));
        body_mail = body_mail.replace("(INV #)", "#" + InvArr[i].invoiceNo);
        body_mail = body_mail.replace("(Currency + Amount)", InvArr[i].currency + " " + parseFloat(InvArr[i].amount).toFixed(2) + " ");
        body_mail = body_mail.replace("(Currency + Amount)", InvArr[i].currency + " " + parseFloat(InvArr[i].amount).toFixed(2) + " ");
        if (InvArr[i].type == 'Invoice') { body_mail = body_mail.replace("(Due Date)", InvArr[i].duedate); }
        else { body_mail = body_mail.replace("(Due Date)", InvArr[i].trandate) }


        //
        nlapiLogExecution('DEBUG', 'InvArr[i].id', InvArr[i].id);
        var emailAttachmentreturnSearchResults = [];
        var checkForAttachmentreturnSearchResults = getInvoiceAttachments(InvArr[i].id);
        if (checkForAttachmentreturnSearchResults != null || checkForAttachmentreturnSearchResults != undefined || checkForAttachmentreturnSearchResults != []) {

            for (var s = 0; s < checkForAttachmentreturnSearchResults.length; s++) {
                try {

                    var attachRecID = checkForAttachmentreturnSearchResults[s].fileID
                    var attachFileObj = nlapiLoadFile(attachRecID)

                    emailAttachmentreturnSearchResults.push(attachFileObj)

                } catch (err) {
                    continue;
                }
            }

        }

        //

        var attachment = nlapiPrintRecord('TRANSACTION', InvArr[i].id, 'PDF', null);
        emailAttachmentreturnSearchResults.push(attachment)
        try {
            //nlapiSendEmail(employeeId, firstMail, subject, body_mail, mail, null, null, emailAttachmentreturnSearchResults);
            nlapiSendEmail(4382, firstMail, subject, body_mail, mail, null, null, emailAttachmentreturnSearchResults);
            var today = nlapiDateToString(new Date());
            var typeRec = 'invoice';
            if (InvArr[i].type == 'Credit Memo') { typeRec = 'creditmemo' }
            nlapiSubmitField(typeRec, InvArr[i].id, 'custbody_batch_date', today);

        }  catch (err) {
            continue;
        }
   




        ////




    }
}


function getInvoiceAttachments(invID) {

    var results = [];
    var toReturn = [];


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('tranid');
    columns[1] = new nlobjSearchColumn('name', 'file');
    columns[2] = new nlobjSearchColumn('internalid', 'file');
    columns[3] = new nlobjSearchColumn('url', 'file');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', invID)
    filters[1] = new nlobjSearchFilter('type', null, 'anyof', ['CustInvc', 'CustCred'])
    filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T')


    var search = nlapiCreateSearch('transaction', filters, columns);
    var resultset = search.runSearch();
    results = resultset.getResults(0, 1000);


    if (results != []) {
        results.forEach(function (line) {

            toReturn.push({
                fileName: line.getValue('name', 'file'),
                fileID: line.getValue('internalid', 'file'),
                fileURL: line.getValue('url', 'file')
            })


        });
    }

    return toReturn;
}

