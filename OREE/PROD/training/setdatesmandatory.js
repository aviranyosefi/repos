function aftersubmit() {
    var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = rec.getLineItemCount('item');
    var changeFlag = false;
    for (var i = 1; i <= count; i++) {        // Loop through each of the items in the sublist

        var itype = rec.getLineItemValue('item', 'itemtype', i); // Get the item type
        var Id = rec.getLineItemValue('item', 'item', i);
        var recordtype = '';

        switch (itype) {   // Compare item type to its record type counterpart
            case 'InvtPart':
                recordtype = 'inventoryitem';
                break;
            case 'NonInvtPart':
                recordtype = 'noninventoryitem';
                break;
            case 'Service':
                recordtype = 'serviceitem';
                break;
            case 'Assembly':
                recordtype = 'assemblyitem';
                break;

            case 'GiftCert':
                recordtype = 'giftcertificateitem';
                break;
            default:
        }

        var item_rec = nlapiLoadRecord(recordtype, Id);
        if (item_rec != '' && item_rec != null && item_rec != undefined) {
            var revRecognitionRule = item_rec.getFieldValue('revenuerecognitionrule');
            var revRecForecastRule = item_rec.getFieldValue('revrecforecastrule');
            if (revRecognitionRule == '4' || revRecForecastRule == '4') {

            }
        }

}