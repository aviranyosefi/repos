function beforSubmit(type) {

    if (type != 'delete') {

        nlapiSetFieldValue('vsoesopgroup', 'EXCLUDE')
        nlapiSetFieldValue('createrevenueplanson', -2)

        var displayname = nlapiGetFieldValue('displayname');
        if (displayname != '') {
            nlapiSetFieldValue('salesdescription', displayname )
        }

        var itemtypename = nlapiGetFieldValue('itemtypename');
        if (itemtypename == 'Non-inventory Item for Resale') {

            var custitem_virtual_ar_trx = nlapiGetFieldValue('custitem_virtual_ar_trx');
            if (custitem_virtual_ar_trx == 'T') {
                nlapiSetFieldValue('revenuerecognitionrule', 3) // BY BILLING
                nlapiSetFieldValue('revrecforecastrule', 3)
            }
            else {
                nlapiSetFieldValue('revenuerecognitionrule', 4) // BY DATES
                nlapiSetFieldValue('revrecforecastrule', 4)

            }
            nlapiSetFieldValue('vsoesopgroup', 'EXCLUDE')
            nlapiSetFieldValue('createrevenueplanson', -2)
        }
        else if (itemtypename == 'Inventory Item') {
            nlapiSetFieldValue('revenuerecognitionrule', 3) // BY BILLING
            nlapiSetFieldValue('revrecforecastrule', 3)
            nlapiSetFieldValue('vsoesopgroup', 'EXCLUDE')
            nlapiSetFieldValue('createrevenueplanson', -2)
        }

       


    }
}