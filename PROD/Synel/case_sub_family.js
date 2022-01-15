var assignedOld = nlapiGetFieldValue('assigned');
function AgrLineFieldChange(type, name) {

    if (name == 'custevent_agreement_line_is_system' || name == 'custevent_site_agreement_line_is_system') {
        var value = nlapiGetFieldValue(name);
        if (!isNullOrEmpty(value)) {
            var item = nlapiLookupField('customrecord_agr_line', value, 'custrecord_agr_line_item')
            if (!isNullOrEmpty(item)) {
                var sub_family = nlapiLookupField('item', item, 'custitem_item_sub_system');
                if (!isNullOrEmpty(sub_family)) {
                    nlapiSetFieldValue('custevent_case_sub_system', sub_family)
                }
            }
        }
    }
    else if (name == 'custevent_agreement' || name == 'custevent_site_agreement') {
        var value = nlapiGetFieldValue(name);
        if (!isNullOrEmpty(value)) {
            var sla_in_hours = nlapiLookupField('customrecord_agreement', value, 'custrecord_agr_sla_in_hours')
            if (!isNullOrEmpty(sla_in_hours)) {
                nlapiSetFieldValue('custevent_sla_in_hours', sla_in_hours)
            }
        }
    }
    else if (name == 'assigned') {
        var role = nlapiGetRole()
        if (role == '1047' || role == '1048' || role == '1051') {
            var value = nlapiGetFieldValue(name);
            if (!isNullOrEmpty(value) && value != assignedOld) {
                try {
                    var type = entityType(value);
                    if (!isNullOrEmpty(type) && type != 'Group') {
                        alert("ניתן לבחור רק צוות תמיכה")
                        nlapiSetFieldValue('assigned', assignedOld)
                    }
                } catch (e) {

                }
            }
            else if (isNullOrEmpty(value)) {
                alert("ניתן לבחור רק צוות תמיכה")
                nlapiSetFieldValue('assigned', assignedOld)
            }
        }
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function entityType(id) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('type');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)
    filters[1] = new nlobjSearchFilter('type', null, 'anyof', ["Employee", "Group"])



    var search = nlapiCreateSearch("entity", filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length > 0) {
        return s[0].getValue('type')
    }
    return '';
}