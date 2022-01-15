var rec = null;
function afterSubmit(type) {
    if (type != 'create' && type != 'delete') {
        try {
            var newRec = nlapiGetNewRecord();
            var oldRec = nlapiGetOldRecord();
            var scheduled_event = newRec.getFieldValue('custevent_scheduled_event');
            if (!isNullOrEmpty(scheduled_event)) {
                var new_assigned = newRec.getFieldValue('assigned');
                var old_assigned = oldRec.getFieldValue('assigned');
                if (new_assigned != old_assigned) {            
                    var company = newRec.getFieldValue('company');   
                    var case_type = newRec.getFieldText('custevent_internal_case_type');
                    updateEvent(scheduled_event, new_assigned, old_assigned, company, case_type, newRec)                  
                }
                var new_date = newRec.getFieldValue('custevent_arrival_date');
                var old_date = oldRec.getFieldValue('custevent_arrival_date');
                if (new_date != old_date) {
                    updateEventDate(scheduled_event, new_date) 
                }
                var new_time = newRec.getFieldValue('custevent_arrival_time');
                var old_time = oldRec.getFieldValue('custevent_arrival_time');
                if (new_time != old_time ) {
                    updateEventTime(scheduled_event, new_time)
                }               
                if (rec != null) {
                    nlapiSubmitRecord(rec);
                }                
            }
        }
        catch (e) {

        }
    }
}

function updateEvent(scheduled_event, new_assigned, old_assigned, company, case_type, newRec) {
    try {

            if (rec == null) {
                rec = nlapiLoadRecord('calendarevent', scheduled_event);
            }
           
            var new_entityid = nlapiLookupField('employee', new_assigned, 'entityid');
                 
            var customerRec = nlapiLoadRecord('customer', company);
            var comapnyName = customerRec.getFieldValue('companyname')
            var custevent_site = newRec.getFieldValue('custevent_site');
            var city = '';
            if (!isNullOrEmpty(custevent_site)) {
                city = nlapiLookupField('customrecord_site', custevent_site, 'custrecord_site_city')
            }
            if (isNullOrEmpty(city)) {
                city = customerRec.getFieldValue('billcity');
            }
            var assignedText = newRec.getFieldText('assigned');
            var name = assignedText + ' - ' + comapnyName;
            if (!isNullOrEmpty(city)) {
                name += ' (' + city + ')'
            }
            rec.setFieldValue('title', name)
            var count = rec.getLineItemCount('attendee');
            try {
                // lines Fields
                rec.selectNewLineItem('attendee');
                rec.setCurrentLineItemValue('attendee', 'attendee', new_assigned);
                rec.setCurrentLineItemValue('attendee', 'response', "ACCEPTED");
                rec.commitLineItem('attendee');
            } catch (err) {
                nlapiLogExecution('ERROR', 'error createRma - lines', err);
            }
            for (var i = count; i >= 1; i--) {
                if (rec.getLineItemValue('attendee', 'attendee', i) == old_assigned) {
                    rec.removeLineItem('attendee', i);
                }
                //else {
                //rec.setLineItemValue('attendee', 'response', i, "ACCEPTED");
                //}
            }
           
            
        
                    
    } catch (e) {
        nlapiLogExecution('ERROR', 'error updateEvent ', e);
    }

    return -1;

}

function updateEventDate(scheduled_event, new_date ) {
    try {

        if (rec == null) {
            rec = nlapiLoadRecord('calendarevent', scheduled_event);
        }
        rec.setFieldValue('startdate', new_date )
        
    } catch (e) {
        nlapiLogExecution('ERROR', 'error updateEventDate ', e);
    }

    return -1;

}

function updateEventTime(scheduled_event, new_time) {
    try {
        nlapiLogExecution('debug', ' scheduled_event', scheduled_event);
        if (rec == null) {
            rec = nlapiLoadRecord('calendarevent', scheduled_event);
        }
        if (isNullOrEmpty(new_time)) {
            rec.setFieldValue('alldayevent', 'T')
            rec.setFieldValue('starttime', '08:00')
            rec.setFieldValue('endtime', '18:00');
        } else {
            rec.setFieldValue('alldayevent' , 'F')
            rec.setFieldValue('starttime', new_time)
            rec.setFieldValue('endtime', addMinutes(new_time, '60'));
        }


    } catch (e) {
        nlapiLogExecution('ERROR', 'error updateEventTime ', e);
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