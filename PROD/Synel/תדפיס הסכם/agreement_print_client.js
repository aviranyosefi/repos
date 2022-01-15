function printButton() {

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_agreement_print_suitlet', 'customdeploy_agreement_print_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    createdPdfUrl += '&email=-1';

    window.open(createdPdfUrl);

}
function addLines() {
    var recId= nlapiGetRecordId();
    rec = nlapiLoadRecord('customrecord_agreement', recId)
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_renewal_agr_su', 'customdeploy_renewal_agr_su', false);
    createdPdfUrl += '&Recid=' + recId ;
    createdPdfUrl += '&from=' + rec.getFieldValue('custrecord_agr_copyed_from');
    createdPdfUrl += '&action=3';
    window.open(createdPdfUrl);
}
function EditAgr() {
    var recId = nlapiGetRecordId();
    rec = nlapiLoadRecord('customrecord_agreement', recId)
    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_renewal_agr_su', 'customdeploy_renewal_agr_su', false);
    createdPdfUrl += '&Recid=' + recId;
    createdPdfUrl += '&action=2';
    window.open(createdPdfUrl);
}
function gotoscreen() {


    var createdPdfUrl = 'https://6398307.app.netsuite.com/app/common/search/searchresults.nl?rectype=329&searchtype=Custom&BAH_CUSTRECORD_SITE_MAGIC_NUMBER=&BAH_Custom_NAME=&BAI_CUSTRECORD_MAINTENANCE_AGREEMENT_TYPE=%40ALL%40&BAI_Custom_INTERNALID=' + nlapiGetRecordId() + '&CUSTRECORD_AGR_LINE_ITEM=%40ALL%40&style=NORMAL&BAH_CUSTRECORD_SITE_MAGIC_NUMBERtype=STARTSWITH&BAH_Custom_NAMEtype=STARTSWITH&report=&grid=&searchid=1462&dle=T&sortcol=Custom_SCRIPTID_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=100&_csrf=txgDuA_vhG2z4D0bgBSWgav1V8qV3f_uPf9lVE8-tAlZhIVQdnTRn24IULVEDkx22DL71bAcKcQ5MHpBmhX_fVhFd4__sJg-rLlu6M8g4Qga_USvYcG6zqyugFk2M7Qabhi29dvd3E3i1RlbQGIV-VKNQVdpTI6gVBpUp41gEzw%3D&twbx=F';

    window.open(createdPdfUrl);

}

function gotoNextscreen() {


    var createdPdfUrl = '//6398307.app.netsuite.com/app/common/search/searchresults.nl?rectype=329&searchtype=Custom&BAH_CUSTRECORD_SITE_MAGIC_NUMBER=&BAH_Custom_NAME=&AZL_Custom_INTERNALID=' + nlapiGetRecordId() + '&CUSTRECORD_AGR_LINE_ITEM=%40ALL%40&style=NORMAL&BAH_CUSTRECORD_SITE_MAGIC_NUMBERtype=STARTSWITH&BAH_Custom_NAMEtype=STARTSWITH&report=&grid=&searchid=1469&dle=T&sortcol=Custom_SCRIPTID_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&_csrf=2RFaVJE3Lj15f8UrPfAQsabOvpoV5CmpKNsmB814y6zSCRYjLRpEUbBu5WhM01M5KYcTKMNDG5pqeFQckxzfeyyaUUYo1iRzC6exMY1fEEuCfwv4PT790W5FENSPFZRdB45xrUevKmLC0LxGfnOy19D_MLhH8tPirXHS6ZbsZ-0%3D&twbx=F';

    window.open(createdPdfUrl);

}



function emailButton() {

    var RecType = nlapiGetRecordType();
    var RecID = nlapiGetRecordId();
    var rec = nlapiLoadRecord(RecType, RecID);
    var contid = rec.getFieldValue('custrecord_agr_contact');
    var defaultmail = nlapiLookupField('contact', contid, 'email');
    //var defaultmail = rec.getFieldValue('custrecord_agr_contact');


    var mail = prompt('please enter mail address:', defaultmail);

    var createdPdfUrl = nlapiResolveURL('SUITELET', 'customscript_agreement_print_suitlet', 'customdeploy_agreement_print_suitlet', false);
    createdPdfUrl += '&Recid=' + nlapiGetRecordId();
    createdPdfUrl += '&email=' + mail;
    window.open(createdPdfUrl);
    if (rec.getFieldValue('custrecord_agr_draft_status') == 1) { processAfterSubmit(RecType, RecID) }
}


function processAfterSubmit(RecType, RecID) {

    nlapiSubmitField(RecType, RecID, 'custrecord_agr_draft_status', 3)
}