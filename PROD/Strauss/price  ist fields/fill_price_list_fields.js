function afterSubmit(type) {
    if (type != 'delete') {
        try { nlapiScheduleScript('customscript_fill_price_list_fields_ss', null, null) } catch (e) { }
    }
}