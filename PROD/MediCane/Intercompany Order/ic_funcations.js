function headerFieldsMappings(type) {
    try {
        var results = [];

        //var search = nlapiSearchRecord('customrecord_adv_ic_fields_mappings', null,filters, columns);
        var savedSearch = nlapiLoadSearch(null, 'customsearch_md_adv_ic');
        savedSearch.addFilter(new nlobjSearchFilter('custrecord_adv_ic_fld_map_source_id', null, 'is', type));
        savedSearch.addFilter(new nlobjSearchFilter('custrecord_adv_ic_line_field', null, 'is', 'F'));
        var s = [];
        var searchid = 0;
        var resultset = savedSearch.runSearch();

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                results.push({
                    target_record_id: s[i].getValue('custrecord_adv_ic_fld_map_target_id'),
                    target_field_id: s[i].getValue('custrecord_adv_ic_fld_map_t_fld_id'),
                    source_field_id: s[i].getValue('custrecord_adv_ic_fld_map_s_fld_id'),
                });
            }
            return results;
        }
    } catch (e) {
        nlapiLogExecution('debug', 'headerFieldsMappings error', e);
        return null;
    }
    return null;
}
function lineFieldsMappings(type) {
    try {
        var results = [];

        //var search = nlapiSearchRecord('customrecord_adv_ic_fields_mappings', null,filters, columns);
        var savedSearch = nlapiLoadSearch(null, 'customsearch_md_adv_ic');
        savedSearch.addFilter(new nlobjSearchFilter('custrecord_adv_ic_fld_map_source_id', null, 'is', type));
        savedSearch.addFilter(new nlobjSearchFilter('custrecord_adv_ic_line_field', null, 'is', 'T'));
        var s = [];
        var searchid = 0;
        var resultset = savedSearch.runSearch();

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                results.push({
                    target_record_id: s[i].getValue('custrecord_adv_ic_fld_map_target_id'),
                    target_field_id: s[i].getValue('custrecord_adv_ic_fld_map_t_fld_id'),
                    source_field_id: s[i].getValue('custrecord_adv_ic_fld_map_s_fld_id'),
                });
            }
            return results;
        }
    } catch (e) {
        nlapiLogExecution('debug', 'headerFieldsMappings error', e);
        return null;
    }
    return null;
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

