function fieldChange(type, name) {
    if (name == 'category') {
        debugger;
        var category = rec.getValue(fieldId);
        if (category == 1) {
            nlapiSetFieldMandatory('custentity_related_customer', true)
        }
    }
}