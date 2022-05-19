function ncrEmail() {
    try {
        var context = nlapiGetContext();
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);

        var title = rec.getFieldValue('title')
        var comment = rec.getFieldValue('custevent_dangot_repair_desc_comment')
        comment = '<p style="text-align:right;" dir="rtl">' + comment
        comment += '</p>'

        var assigned = rec.getFieldValue('assigned')
        var company = rec.getFieldValue('company')
        //nlapiLookupField('customer', company, 'companyname')

        var images = [];
        var pic_1 = rec.getFieldValue('custevent_ncr_pic_1')
        nlapiLogExecution('debug', 'pic_1', pic_1);
        if (!isNullOrEmpty(pic_1)) {
            var pic_1 = nlapiLoadFile(pic_1)
            images.push(pic_1)
        }
        var pic_2 = rec.getFieldValue('custevent_ncr_pic_2')
        if (!isNullOrEmpty(pic_2)) {
            var pic_2 = nlapiLoadFile(pic_2)
            images.push(pic_2)
        }
        var pic_3 = rec.getFieldValue('custevent_ncr_pic_3')
        if (!isNullOrEmpty(pic_3)) {
            var pic_3 = nlapiLoadFile(pic_3)
            images.push(pic_3)
        }
        var pic_4 = rec.getFieldValue('custevent_ncr_pic_4')
        if (!isNullOrEmpty(pic_4)) {
            var pic_4 = nlapiLoadFile(pic_4)
            images.push(pic_4)
        }

        nlapiLogExecution('debug', 'images', images.length);
        var attachRec = new Object();
        attachRec['transaction'] = recID;
      
        nlapiSendEmail(assigned, company, title, comment, null, null, attachRec, images, false);


    } catch (e) {
        nlapiLogExecution('error', 'error', e);
    }
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

