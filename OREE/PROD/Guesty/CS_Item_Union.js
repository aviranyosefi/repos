function aftersubmit(type) {
    if (type != 'delete') {
        var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
        var count = rec.getLineItemCount('item');
        var itemArr = new Array();
        var qntArr = new Array();
        var lines = 0;

        var amntPerItm = 0;

        for (var i = 0; i < count; i++) {

            itemArr.push(rec.getLineItemValue('item', 'item', i + 1));// array of all the items id on current record

            nlapiLogExecution('debug', 'set amount ' + (i + 1) + ' : ', rec.getLineItemValue('item', 'amount', i + 1));
            rec.setLineItemValue('item', 'custcol_total_amount_grouped_by_item', i + 1, rec.getLineItemValue('item', 'amount', i + 1));// copy current amount of each line to new field
            nlapiLogExecution('debug', 'set print:  ', 'F');
            rec.setLineItemValue('item', 'custcol_printing_exclusion_indication', i + 1, 'F');
            qntArr[i] = rec.getLineItemValue('item', 'quantity', i + 1);

        }
        nlapiLogExecution('debug', 'before counting:  ', 'F');
        var counter = {};
        itemArr.forEach(function (i) { counter[i] = (counter[i] || 0) + 1; });

        nlapiLogExecution('debug', 'after counting:  ', '');


        for (var y = 0; y < itemArr.length; y++) {
            var arrLines = new Array();
            amntPerItm = 0;
            if (counter[itemArr[y]] > 1) {

                var item = itemArr[y];
                lines = counter[item];
                for (var z = 0; z < lines; z++) {
                    if (z == 0) {
                        arrLines.push((itemArr.indexOf(item, z) + 1));
                    }
                    else {
                        var lastindex = arrLines[z - 1];
                        arrLines.push((itemArr.indexOf(item, lastindex) + 1));
                    }
                }

                for (var x = 0; x < arrLines.length; x++) {
                    amntPerItm = (amntPerItm + parseFloat(rec.getLineItemValue('item', 'amount', arrLines[x])));
                    if (x > 0) {
                        rec.setLineItemValue('item', 'custcol_printing_exclusion_indication', arrLines[x], 'T');
                        //console.log('dont print=T for line: ' + arrLines[x]);
                    }
                }
                rec.setLineItemValue('item', 'custcol_total_amount_grouped_by_item', arrLines[0], amntPerItm);

                counter[itemArr[y]] = 0;
            }

        }

        var recid = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'Record submited: ', recid);
    }
}

/*for (var i = 0; i < count; i++) {

console.log('TOT amount for line : ' + i + 1 + '= '+ rec.getLineItemValue('item', 'custcol_total_amount_grouped_by_item', i + 1));
console.log('printing indication for line  : ' + i + 1 + '= '+ rec.getLineItemValue('item', 'custcolprinting_exclusion_indication', i + 1));
}*/
 


///custcol_printing_exclusion_indication
//custcol_total_amount_grouped_by_item	


