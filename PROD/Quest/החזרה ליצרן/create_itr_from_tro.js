function createITR(type) {
    try {
        if (type != 'delete') {
            try { nlapiScheduleScript('customscript_create_itr_from_tro_ss', null, { custscript_fulfillment_id: nlapiGetRecordId() }) } catch (e) { }
        }
    } catch (e) { }
}