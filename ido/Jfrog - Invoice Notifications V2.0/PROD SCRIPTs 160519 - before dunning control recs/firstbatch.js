function getAllInvContacts() {

    var searchContacts = nlapiLoadSearch(null, 'customsearch_ilo_contact_invoice_search');

    var allcontacts = [];
    var invContacts = [];
    var resultContacts = [];
    var searchid = 0;
    var resultset = searchContacts.runSearch();
    var rs;

    var tranName;
    var tranNameArr;
    var invTranID;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {

            allcontacts.push(resultContacts[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allcontacts != null) {
        allcontacts.forEach(function (line) {

            tranName = line.getValue('transactionname', 'transaction');
            tranNameArr = tranName.split('#');
            invTranID = tranNameArr[1];

            invContacts.push({

                contact_id: line.getValue('internalid'),
                contact_name: line.getValue('entityid'),
                contact_company: line.getValue('company'),
                contact_email: line.getValue('email'),
                contact_inv: invTranID

            });




        });

    };

    return invContacts;

}


function getAllItems() {

    var searchItems = nlapiLoadSearch(null, 'customsearch_ilo_automail_item_search');

    var allItems = [];
    var items = [];
    var resultItems = [];
    var searchid = 0;
    var resultset = searchItems.runSearch();
    var rs;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {

            allItems.push(resultItems[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (allItems != null) {
        allItems.forEach(function (line) {

            items.push(line.getValue('internalid'));



        });

    };

    return items;

}

function getAllDocs() {

    var searchDocs = nlapiLoadSearch(null, 'customsearch_ilo_folder_saved_search');

    var alldocs = [];
    var invDocs = [];
    var resultDocs = [];
    var searchid = 0;
    var resultset = searchDocs.runSearch();
    var rs;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (rs in resultslice) {

            alldocs.push(resultDocs[resultslice[rs].id] = resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    if (alldocs != null) {
        alldocs.forEach(function (line) {


            invDocs.push({

                documentID: line.getValue('internalid', 'file'),
                documentName: line.getValue('name', 'file'),


            });

        });

    };

    return invDocs;

}






function firstMailBatch_ss(type) {

    runTwice();
    runTwice();
    runTwice();


}

function runTwice() {

    var checkItems = getAllItems();
    var allContacts = getAllInvContacts();
    var allDocuments = getAllDocs();


    var context = nlapiGetContext();
    var emailJobID = context.getSetting('SCRIPT', 'custscript_ilo_ss_data_id');


    var jobRec = nlapiLoadRecord('customrecord_ilo_firstmail_batch_job', emailJobID);

    var emailArray = jobRec.getFieldValue('custrecord_ilo_email_data_array');
    var toremoveArray = jobRec.getFieldValue('custrecord_ilo_remove_data_array');

    if (toremoveArray != '[]') {

        var obj = JSON.parse(toremoveArray);

        for (var i = 0; i < obj.length; i++) {

            nlapiSubmitField('invoice', obj[i].rec_id, 'custbody_ilo_marked_as_sent', 'T');
        }
    }

    if (emailArray != '[]') {

        var emailObj = JSON.parse(emailArray);

        //looping over invoices and sending

        nlapiLogExecution('DEBUG', 'emailObj.length', emailObj.length)

        for (var i = 0; i < emailObj.length; i++) {

            try {


                if (emailObj[i].subsid == 'JFrog LTD') {

                    var checkItemsLicense = [];

                    var attachment;
                    var contactFirstName;
                    var emailArr = [];

                    var ltdRec = nlapiLoadRecord('invoice', emailObj[i].rec_id);
                    var customerID = ltdRec.getFieldValue('entity');
                    var thisInvoice = emailObj[i].rec_id;
                    var thisInvoiceName = ltdRec.getFieldValue('tranid');
                    var thisInvoicePO = ltdRec.getFieldValue('otherrefnum');
                    var licenseOwner = ltdRec.getFieldValue('custbody_ilo_license_owner');

                    var checkIfSent = ltdRec.getFieldValue('custbody_ilo_invmail_yes_no_mailed');


                    var hasAttachment = checkAttach(thisInvoiceName, allDocuments, thisInvoice);

                    if (checkIfSent != '1') { //check to see if sent already

                        var itemsArr = [];
                        var itemName;
                        var itemID;

                        var lineCount = ltdRec.getLineItemCount('item');

                        if (lineCount > 0) {
                            for (var i = 1; i <= lineCount; i++) {
                                itemName = ltdRec.getLineItemValue('item', 'name', i);
                                itemsArr.push(itemName);
                                itemID = ltdRec.getLineItemValue('item', 'item', i);
                                checkItemsLicense.push(itemID);
                            }
                        }

                        //check if item invoice should include license dates or not

                        var PO_statement = '';

                        var noPO = ['Email Approval', 'Signed Quote'];

                        if (noPO.indexOf(thisInvoicePO) == -1) {
                            PO_statement = ' / PO#' + thisInvoicePO;
                        }



                        var thisInvoiceContacts = [];


                        for (var x = 0; x < allContacts.length; x++) {

                            if (allContacts[x].contact_inv == thisInvoiceName) {

                                thisInvoiceContacts.push(allContacts[x]);
                            }

                        }

                    contactFirstName = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_name');
                    try {
                        contactFirstName =  contactFirstName.replace(/ .*/, '');
                    }
                    catch (e)
                    { }
                        for (var i = 0; i < thisInvoiceContacts.length; i++) {

                            if (thisInvoiceContacts.length > 1) {

                                contactFirstName = 'AP';
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                            else {
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                        }


                        var JFrogInvoiceMail = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_email')
                        if (JFrogInvoiceMail != "") {
                            emailArr.push(JFrogInvoiceMail)
                        }

                        //					nlapiLogExecution('DEBUG', 'checkifMailed', checkifMailed);
                        //					nlapiLogExecution('DEBUG', 'sendFirstMail', sendFirstMail);
                        //					nlapiLogExecution('DEBUG', 'thisSubsidiary', thisSubsidiary);
                        nlapiLogExecution('DEBUG', 'thisInvoiceContacts', JSON.stringify(thisInvoiceContacts));
                        nlapiLogExecution('DEBUG', 'contactFirstName', JSON.stringify(contactFirstName));
                        nlapiLogExecution('DEBUG', 'emailArr', JSON.stringify(emailArr));

                        var pleaseForward = ".";
                        if (contactFirstName != 'AP') {
                            pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.';
                        }


                        var addLicenseDates = '';
                        var findOne = function (haystack, arr) {
                            return arr.some(function (v) {
                                return haystack.indexOf(v) >= 0;
                            });
                        };

                        nlapiLogExecution('DEBUG', 'checkItemsLicense', checkItemsLicense)
                        var checklicenseDates = findOne(checkItems, checkItemsLicense);

                        if (checklicenseDates == false) {
                            addLicenseDates = '<br>License keys were sent to the following email address: ' + licenseOwner + '.<br>';
                        }

                        var fromId = 18767; //AR JFrog LTD Internal ID
                        attachment = nlapiPrintRecord('TRANSACTION', thisInvoice, 'PDF', null);
                        if (typeof hasAttachment != 'undefined') {
                            attachment = nlapiLoadFile(hasAttachment);
                        }

                        var senderFirstName = 'AR';

                        var customMessage = '';
                        var customMsg = nlapiLookupField('invoice', thisInvoice, 'message');
                        if (customMsg != "") {
                            customMessage = '<br><br>' + customMsg + '<br>';
                        }

                        var sbj = 'JFrog LTD Invoice #' + thisInvoiceName + PO_statement;
                        var msg = 'Dear ' + contactFirstName + ',<br><br> \n\rAttached please find JFrog LTD. invoice #' + thisInvoiceName + pleaseForward + addLicenseDates + '<br>Payment should be executed by a bank wire to our account (all detailed on top of the invoice).' + customMessage + '<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>' + senderFirstName + '<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;font-size:14px;text-decoration:underline;">ar.il@jfrog.com</span></p><br><span style="color:#43a047"> Accounts Receivable | JFrog LTD </span><br><span style="color:#a9a9a9"> Tel. <u>+972-9-8941444</u> | U.S Toll Free Number: <u>1-888-70-40-670</u> </span><br><br>';
                        var attachRec = new Object();
                        attachRec['entity'] = customerID; //attach email to customer record
                        attachRec['transaction'] = thisInvoice; //attach email to invoice record
                        //multiple email addresses
                        //Recipient is a comma separated list of email addresses


                        nlapiLogExecution('DEBUG', 'LTD - TRAN ID - SENT', thisInvoiceName);

                        nlapiSendEmail(fromId, emailArr, sbj, msg, ['ar.il@jfrog.com'], null, attachRec, attachment);


                        nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');



                    }//end of check if sent
                }//end of Jfrog LTD block

                if (emailObj[i].subsid == 'JFrog LTD : JFrog INC') {

                    var checkItemsLicense = [];

                    var attachment;
                    var contactFirstName;
                    var emailArr = [];

                    var incRec = nlapiLoadRecord('invoice', emailObj[i].rec_id);
                    var customerID = incRec.getFieldValue('entity');
                    var thisInvoice = emailObj[i].rec_id;
                    var thisInvoiceName = incRec.getFieldValue('tranid');
                    var thisInvoicePO = incRec.getFieldValue('otherrefnum');
                    var licenseOwner = incRec.getFieldValue('custbody_ilo_license_owner');
                    var shipCountry = incRec.getFieldValue('shipcountry');

                    var checkIfSent = incRec.getFieldValue('custbody_ilo_invmail_yes_no_mailed');

                    var hasAttachment = checkAttach(thisInvoiceName, allDocuments, thisInvoice);

                    nlapiLogExecution('DEBUG', 'hasAttachment type', typeof hasAttachment);
                    nlapiLogExecution('DEBUG', 'hasAttachment JSON.stringify', JSON.stringify(hasAttachment));


                    if (checkIfSent != '1') { //check to see if sent already

                        var itemsArr = [];
                        var itemName;
                        var itemID;

                        var lineCount = incRec.getLineItemCount('item');

                        if (lineCount > 0) {
                            for (var i = 1; i <= lineCount; i++) {
                                itemName = incRec.getLineItemValue('item', 'name', i);
                                itemsArr.push(itemName);
                                itemID = incRec.getLineItemValue('item', 'item', i);
                                checkItemsLicense.push(itemID);
                            }
                        }

                        //check if item invoice should include license dates or not

                        var PO_statement = '';

                        var noPO = ['Email Approval', 'Signed Quote'];

                        if (noPO.indexOf(thisInvoicePO) == -1) {
                            PO_statement = ' / PO#' + thisInvoicePO;
                        }



                        var thisInvoiceContacts = [];


                        for (var x = 0; x < allContacts.length; x++) {

                            if (allContacts[x].contact_inv == thisInvoiceName) {

                                thisInvoiceContacts.push(allContacts[x]);
                            }

                        }

                      contactFirstName = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_name');
                    try {
                        contactFirstName =  contactFirstName.replace(/ .*/, '');
                    }
                    catch (e)
                    { }
                        for (var i = 0; i < thisInvoiceContacts.length; i++) {

                            if (thisInvoiceContacts.length > 1) {

                                contactFirstName = 'AP';
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                            else {
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                        }

                        var JFrogInvoiceMail = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_email')
                        if (JFrogInvoiceMail != "") {
                            emailArr.push(JFrogInvoiceMail)
                        }

                        //					nlapiLogExecution('DEBUG', 'checkifMailed', checkifMailed);
                        //					nlapiLogExecution('DEBUG', 'sendFirstMail', sendFirstMail);
                        //					nlapiLogExecution('DEBUG', 'thisSubsidiary', thisSubsidiary);
                        nlapiLogExecution('DEBUG', 'thisInvoiceContacts', JSON.stringify(thisInvoiceContacts));
                        nlapiLogExecution('DEBUG', 'contactFirstName', JSON.stringify(contactFirstName));
                        nlapiLogExecution('DEBUG', 'emailArr', JSON.stringify(emailArr));

                        var pleaseForward = ".";
                        if (contactFirstName != 'AP') {
                            pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.';
                        }
                        if (shipCountry == 'US') {
                            pleaseForward = '. If you are not the correct contact, please forward these attachments to your AP department.';

                        }


                        var addLicenseDates = '';
                        var findOne = function (haystack, arr) {
                            return arr.some(function (v) {
                                return haystack.indexOf(v) >= 0;
                            });
                        };

                        var checklicenseDates = findOne(checkItems, checkItemsLicense);

                        if (checklicenseDates == false) {
                            addLicenseDates = '<br>License keys were sent to the following email address: ' + licenseOwner + '.<br>';
                        }


                        nlapiLogExecution('DEBUG', 'hasAttachment', hasAttachment)
                        nlapiLogExecution('DEBUG', 'thisInvoice', thisInvoice)
                        var fromId = 18768; //AR JFrog INC Internal ID
                        attachment = nlapiPrintRecord('TRANSACTION', thisInvoice, 'PDF', null);

                        nlapiLogExecution('DEBUG', 'attachment', attachment)
                        nlapiLogExecution('DEBUG', 'hasAttachment', hasAttachment)
                        if (typeof hasAttachment != 'undefined') {
                            attachment = nlapiLoadFile(hasAttachment);
                        }

                        var w9form = nlapiLoadFile('460350'); //W-9 form in file cabinet internal id

                        var senderFirstName = 'AR';

                        var customMessage = '';
                        var customMsg = nlapiLookupField('invoice', thisInvoice, 'message');
                        if (customMsg != "") {
                            customMessage = '<br><br>' + customMsg + '<br>';
                        }


                        nlapiLogExecution('DEBUG', 'test - customerID', customerID)
                        nlapiLogExecution('DEBUG', 'test - thisInvoice', thisInvoice)
                        nlapiLogExecution('DEBUG', 'test -fromId', fromId)
                        nlapiLogExecution('DEBUG', 'test - msg', msg)
                        nlapiLogExecution('DEBUG', 'test - emailArr', emailArr)



                        var sbj = 'JFrog INC Invoice #' + thisInvoiceName + PO_statement;
                        var msg = 'Dear ' + contactFirstName + ',<br><br> \n\rAttached please find JFrog INC. invoice #' + thisInvoiceName + pleaseForward + addLicenseDates + '<br>Payment can be made by an ACH/wire payment to our JFrog INC. bank account (details can be found on invoice).' + customMessage + '<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>' + senderFirstName + '<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;font-size:14px;text-decoration:underline;">ar@jfrog.com</span></p><br><span style="color:#43a047"> Accounts Receivable | JFrog INC </span><br><span style="color:#a9a9a9"> Tel. <u>408-329-1540</u> | U.S Toll Free Number: <u>1-888-70-40-670</u></span><br><br>';
                        if (shipCountry == 'US') {
                            msg = 'Dear ' + contactFirstName + ',<br><br> \n\rAttached please find JFrog INC. invoice #' + thisInvoiceName + ' and our W9 form' + pleaseForward + addLicenseDates + '<br>Payment can be made by an ACH/wire payment to our JFrog INC. bank account (details can be found on invoice).' + customMessage + '<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>' + senderFirstName + '<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;font-size:14px;text-decoration:underline;">ar@jfrog.com</span></p><br><span style="color:#43a047"> Accounts Receivable | JFrog INC </span><br><span style="color:#a9a9a9"> Tel. <u>408-329-1540</u> | U.S Toll Free Number: <u>1-888-70-40-670</u></span><br><br>';
                        }

                        var attachRec = new Object();
                        attachRec['entity'] = customerID; //attach email to customer record
                        attachRec['transaction'] = thisInvoice; //attach email to invoice record
                        //multiple email addresses
                        //Recipient is a comma separated list of email addresses


                        nlapiLogExecution('DEBUG', 'INC - TRAN ID - SENT', thisInvoiceName);

                        var attachArr = [];
                        attachArr.push(attachment);
                        if (shipCountry == 'US') {
                            attachArr.push(w9form);
                        }

                        nlapiSendEmail(fromId, emailArr, sbj, msg, ['ar@jfrog.com'], null, attachRec, attachArr);


                        nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');

                    }//end of check if sent
                } //end of Jfrog INC block

                if (emailObj[i].subsid == 'JFrog LTD : JFrog SAS') {

                    var checkItemsLicense = [];

                    var attachment;
                    var contactFirstName;
                    var emailArr = [];

                    var sasRec = nlapiLoadRecord('invoice', emailObj[i].rec_id);
                    var customerID = sasRec.getFieldValue('entity');
                    var thisInvoice = emailObj[i].rec_id;
                    var thisInvoiceName = sasRec.getFieldValue('tranid');
                    var thisInvoicePO = sasRec.getFieldValue('otherrefnum');
                    var licenseOwner = sasRec.getFieldValue('custbody_ilo_license_owner');


                    var checkIfSent = sasRec.getFieldValue('custbody_ilo_invmail_yes_no_mailed');


                    var hasAttachment = checkAttach(thisInvoiceName, allDocuments, thisInvoice);


                    if (checkIfSent != '1') { //check to see if sent already

                        var itemsArr = [];
                        var itemName;
                        var itemID;

                        var lineCount = sasRec.getLineItemCount('item');

                        if (lineCount > 0) {
                            for (var i = 1; i <= lineCount; i++) {
                                itemName = sasRec.getLineItemValue('item', 'name', i);
                                itemsArr.push(itemName);
                                itemID = sasRec.getLineItemValue('item', 'item', i);
                                checkItemsLicense.push(itemID);
                            }
                        }

                        //check if item invoice should include license dates or not

                        var PO_statement = '';

                        var noPO = ['Email Approval', 'Signed Quote'];

                        if (noPO.indexOf(thisInvoicePO) == -1) {
                            PO_statement = ' / PO#' + thisInvoicePO;
                        }



                        var thisInvoiceContacts = [];


                        for (var x = 0; x < allContacts.length; x++) {

                            if (allContacts[x].contact_inv == thisInvoiceName) {

                                thisInvoiceContacts.push(allContacts[x]);
                            }

                        }

                     contactFirstName = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_name');
                    try {
                        contactFirstName =  contactFirstName.replace(/ .*/, '');
                    }
                    catch (e)
                    { }
                        for (var i = 0; i < thisInvoiceContacts.length; i++) {

                            if (thisInvoiceContacts.length > 1) {

                                contactFirstName = 'AP';
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                            else {
                                emailArr.push(thisInvoiceContacts[i].contact_email);
                            }
                        }

                        var JFrogInvoiceMail = nlapiLookupField('invoice', thisInvoice, 'custbody_ilo_contact_email')
                        if (JFrogInvoiceMail != "") {
                            emailArr.push(JFrogInvoiceMail)
                        }
                        //					nlapiLogExecution('DEBUG', 'checkifMailed', checkifMailed);
                        //					nlapiLogExecution('DEBUG', 'sendFirstMail', sendFirstMail);
                        //					nlapiLogExecution('DEBUG', 'thisSubsidiary', thisSubsidiary);
                        nlapiLogExecution('DEBUG', 'thisInvoiceContacts', JSON.stringify(thisInvoiceContacts));
                        nlapiLogExecution('DEBUG', 'contactFirstName', JSON.stringify(contactFirstName));
                        nlapiLogExecution('DEBUG', 'emailArr', JSON.stringify(emailArr));

                        var pleaseForward = ".";
                        if (contactFirstName != 'AP') {
                            pleaseForward = '. If you are not the correct contact, please forward this invoice to your AP department.';
                        }


                        var addLicenseDates = '';
                        var findOne = function (haystack, arr) {
                            return arr.some(function (v) {
                                return haystack.indexOf(v) >= 0;
                            });
                        };


                        var checklicenseDates = findOne(checkItems, checkItemsLicense);

                        if (checklicenseDates == false) {
                            addLicenseDates = '<br>License keys were sent to the following email address: ' + licenseOwner + '.<br>';
                        }



                        var fromId = 18769; //AR JFrog SAS Internal ID
                        attachment = nlapiPrintRecord('TRANSACTION', thisInvoice, 'PDF', null);
                        if (typeof hasAttachment != 'undefined') {
                            attachment = nlapiLoadFile(hasAttachment);
                        }

                        var senderFirstName = 'AR';

                        var customMessage = '';
                        var customMsg = nlapiLookupField('invoice', thisInvoice, 'message');
                        if (customMsg != "") {
                            customMessage = '<br><br>' + customMsg + '<br>';
                        }

                        var sbj = 'JFrog SAS Invoice #' + thisInvoiceName + PO_statement;
                        var msg = 'Dear ' + contactFirstName + ',<br><br> \n\rAttached please find JFrog SAS. invoice #' + thisInvoiceName + pleaseForward + addLicenseDates + '<br>Payment should be executed by a bank wire to our account (all detailed on top of the invoice).' + customMessage + '<br>Feel free to contact us for any further information you may need.<br>Best regards,<br>' + senderFirstName + '<br><br><p style="color:#43a047;font-size:14px;">JFrog is keeping the environment green. For a hard copy invoice, please contact: <span style="color:#43a047;text-decoration:underline;">ar.fr@jfrog.com</span></p><br><span style="color:#43a047"> Accounts Receivable | JFrog SAS </span><br><span style="color:#a9a9a9"> Tel. <u>+33 (0)5 32 10 87 20 </u></span><br><br>';
                        var attachRec = new Object();
                        attachRec['entity'] = customerID; //attach email to customer record
                        attachRec['transaction'] = thisInvoice; //attach email to invoice record
                        //multiple email addresses
                        //Recipient is a comma separated list of email addresses

                        nlapiLogExecution('DEBUG', 'SAS - TRAN ID - SENT', thisInvoiceName);

                        nlapiSendEmail(fromId, emailArr, sbj, msg, ['ar.fr@jfrog.com'], null, attachRec, attachment);

                        nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_yes_no_mailed', '1');




                    }//end of check if sent
                } //end of Jfrog SAS block

            }
            catch (err) {

                nlapiLogExecution('DEBUG', 'try-catch-error', err)
            }


        }// end of loop over all emails to be sent


    }

}// endof runTwice


if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}


function checkAttach(tranID, allDocuments, thisInvoice) {
    var attachmentID;

    try {
        for (var x = 0; x < allDocuments.length; x++) {

            var currDoc = allDocuments[x].documentName;

            if (currDoc.includes(tranID)) {

                attachmentID = allDocuments[x].documentID;

                nlapiSubmitField('invoice', thisInvoice, 'custbody_ilo_invmail_attachment', attachmentID);

                return attachmentID;
            }


        }


    } catch (err) {


        nlapiLogExecution('DEBUG', 'checkAttach error', err);

    }
}


