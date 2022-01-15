function createEventFromCase() {
    try { 
        var context = nlapiGetContext();
        var user = context.user
        var group = context.getSetting('SCRIPT', 'custscript_group');  
        nlapiLogExecution('debug', ' group: ', group);
        var recID = nlapiGetRecordId();
        var recTYPE = nlapiGetRecordType();
        var rec = nlapiLoadRecord(recTYPE, recID);
        nlapiLogExecution('debug', ' recTYPE: ' + recTYPE, 'recID: ' + recID);
        var company = rec.getFieldValue('company');
        //var comapnyName = nlapiLookupField('customer', company, 'companyname');
        var customerRec = nlapiLoadRecord('customer', company);
        var comapnyName = customerRec.getFieldValue('companyname')
        var address = customerRec.getFieldValue('defaultaddress');
        var custevent_arrival_date = rec.getFieldValue('custevent_arrival_date');    
        var custevent_arrival_time = rec.getFieldValue('custevent_arrival_time');
        var assigned = rec.getFieldValue('assigned');
        var assignedText = rec.getFieldText('assigned');
        var case_type = rec.getFieldText('custevent_internal_case_type');
        //var category = rec.getFieldText('category');
        
        var dataForCase = [];
        dataForCase.push({
            company: company,
            caseid: recID,
            user: user,
            custevent_arrival_date: custevent_arrival_date,
            custevent_arrival_time: custevent_arrival_time,
            assigned: assigned,
            category: assignedText + ' - ' + case_type + ' (' + comapnyName + ')',
            address: address,
            group: group
  
        });
        nlapiLogExecution('DEBUG', 'data: ' + dataForCase.length, JSON.stringify(dataForCase));
        var eventId = createEvent(dataForCase);
        if (eventId != -1) {
            rec.setFieldValue('custevent_scheduled_event', eventId);
            nlapiSubmitRecord(rec);
        
        }

    } catch (e) {
        nlapiLogExecution('ERROR', 'error',  e);
    }
    
}

function createEvent(data) {

    
    try {      
        for (var i = 0; i < data.length; i++) {
            var rec = nlapiCreateRecord('calendarevent');
            //Header Fields 
            rec.setFieldValue('organizer', data[i].user);
            rec.setFieldValue('company', data[i].company);
            rec.setFieldValue('startdate', data[i].custevent_arrival_date);
            if (!isNullOrEmpty(data[i].custevent_arrival_date)) {
                rec.setFieldValue('alldayevent', 'T');
            }
            if (!isNullOrEmpty(data[i].custevent_arrival_time)) {
                rec.setFieldValue('alldayevent', 'F');
                rec.setFieldValue('starttime', data[i].custevent_arrival_time);
                rec.setFieldValue('endtime', addMinutes(data[i].custevent_arrival_time,'60'));
            }
            rec.setFieldValue('supportcase', data[i].caseid);
            rec.setFieldValue('status', 'CONFIRMED');
            rec.setFieldValue('title', data[i].category);
            rec.setFieldValue('location', data[i].address);
                 
            try {
                // lines Fields
                rec.selectNewLineItem('attendee');
                rec.setCurrentLineItemValue('attendee', 'attendee', data[i].assigned);             
                rec.commitLineItem('attendee');
            } catch (err) {
                nlapiLogExecution('ERROR', 'error createRma - lines', err);
            }

            if (!isNullOrEmpty(data[i].group)) {
                try {
                    // lines Fields
                    rec.selectNewLineItem('attendee');
                    rec.setCurrentLineItemValue('attendee', 'attendee', data[i].group);
                    rec.commitLineItem('attendee');
                } catch (err) {
                    nlapiLogExecution('ERROR', 'error createRma - lines', err);
                }
            }
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', 'event id: ', id);
            if (id != -1) {
                try { 
                var user = nlapiGetContext().user;
                var rec = nlapiLoadRecord('calendarevent', id);
                var count = rec.getLineItemCount('attendee');
                    for (var i = count ; i >= 1; i--) {
                    if (rec.getLineItemValue('attendee', 'attendee', i) == user) {
                        rec.removeLineItem('attendee', i);
                    }
                    else {
                        rec.setLineItemValue('attendee', 'response', i, "ACCEPTED");
                    }
                }
                    nlapiSubmitRecord(rec)  
                } catch (e) {
                    nlapiLogExecution('ERROR', 'error nlapiSubmitRecord ', e);
                    return id;
                }
                return id;
            }
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'error createEvent ', e);
    }

    return -1;

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function addMinutes(time, minsToAdd) {
    function D(J) { return (J < 10 ? '0' : '') + J; };
    var piece = time.split(':');
    var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}  