 var internalIds = [58833, 58833, 58833, 71080, 79114, 97164, 105673, 107593, 114785, 114885, 114986, 115917, 116101, 116101, 116101, 116101, 116102, 123227, 123227, 123227, 123227, 123329, 128394];
var lineids = [1, 14, 24, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 1, 1, 2, 3, 4, 1, 1];
var origItem = [162, 1370, 1549, 361, 3024, 447, 3024, 5105, 1515, 439, 5084, 5090, 132, 353, 374, 162, 151, 5123, 5124, 5125, 5126, 3024, 439];
var counter = 1;
var itemCount = 0;

for (i = 0; i < internalIds.length; i++) {
    //changedFlag = false;
    try {
        var recId = internalIds[i];
        //var recType = s[i].type;
        var line = lineids[i];
        var originalItem = origItem[i];

        if (i == 0 || internalIds[i - 1] != recId) {
            rec = nlapiLoadRecord('invoice', recId);
            itemCount = rec.getLineItemCount('item');
            console.log(counter + '- Load Record - tranID: ' + recId + ', type: ' + 'invoice');
        }

        for (z = 1; z <= itemCount; z++) {
            if (rec.getLineItemValue('item', 'line', z) == line) {
                //var id = Results[y].id;
                rec.setLineItemValue('item', 'custcol_scm_itemsub_original_item', z, originalItem);
                console.log('rec type = ' + 'invoice' + ', id= ' + recId + ', line= ' + z + ' - orig item id= ' + originalItem);
                //changedFlag = true;
                break;
            }
            else {
                if (z == itemCount) {//&& changedFlag == false
                    console.log('ERR - rec type = ' + 'invoice' + ', id= ' + recId + ', line= ' + z + ' - line id does not exist ');
                }
            }
        }
        if (((i + 1) == internalIds.length) || (internalIds[i + 1] != recId)) {
            var submition = nlapiSubmitRecord(rec);
            console.log(counter + '- Submition- tranID: ' + submition + ', type: ' + 'invoice' + ', line: ' + z + ', orig item id= ' + originalItem);
            counter++;
        }
        else {
            console.log(counter + '*********** Update- tranID: ' + recId + ', type: ' + recType + ', line: ' + z + ', orig item id= ' + originalItem);
        }
        nlapiGetContext().getRemainingUsage = function () { return 1000; }
    } catch (e) {
        console.log('error: s = ' + i + ' - record:' + recId);
        console.log('detail: ' + e.message);
        continue;
    }

}