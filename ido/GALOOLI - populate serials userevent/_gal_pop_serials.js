function aftersubmit() {

    try {
        var resultItems = nlapiSearchRecord('item', null, null, [new nlobjSearchColumn('type'), new nlobjSearchColumn('name')]);
        var itemtypes = [];

        if (resultItems != null) {
            resultItems.forEach(function (line) {
                var type = line.getRecordType();
                itemtypes[line.id] = type;

            });
        }

        var serials = [];
        var recType = nlapiGetRecordType();
        var recId = nlapiGetRecordId();
        var rec = nlapiLoadRecord(recType, recId);
        try {
            var subrec = nlapiLoadRecord('subsidiary', rec.getFieldValue('subsidiary'));

            rec.setFieldValue('custbody_subsidiary', rec.getFieldValue('subsidiary'));
            rec.setFieldValue('custbody_subaddress', subrec.getFieldValue('mainaddress_text'));
            rec.setFieldValue('custbody_subimg', subrec.getFieldValue('logo'));
        }
        catch (ex) {

        }
        var lineItemCount = rec.getLineItemCount('item');
        var lastkitline = 0;
        for (var line = 1; line <= lineItemCount; line++) {
            nlapiLogExecution('debug', 'line', line);

            if ((recType == "purchaseorder") && line == 1) {
                rec.setFieldValue('department', rec.getLineItemValue('item', 'department', line));
            }


            var itemid = -1;
            if (rec.getLineItemValue('item', 'custcolinu_reference_item', line) != null) {
                itemid = rec.getLineItemValue('item', 'custcolinu_reference_item', line);
            }
            else
                itemid = rec.getLineItemValue('item', 'item', line);
            var itemtype = "noninventoryitem";
            try { itemtype = itemtypes[itemid] } catch (e) { itemtype = "noninventoryitem" };
            var iskit = rec.getLineItemValue('item', 'itemtype', line) == "Kit";
            if (iskit)
                lastkitline = line;
            nlapiLogExecution('debug', 'itemid', itemid);
            nlapiLogExecution('debug', 'type', itemtype);
            var itemrec = nlapiLoadRecord(itemtype, itemid);

            var displayname = itemrec.getFieldValue("invt_dispname");
            var description = itemrec.getFieldValue("invt_salesdesc");
            nlapiLogExecution('debug', 'displayname', '-'+displayname+'-');
            nlapiLogExecution('debug', 'description', description);

            rec.setLineItemValue('item', 'custcol_inu_customer_item', line, description);
            var olddesc = itemrec.getFieldValue("invt_salesdesc");
 			nlapiLogExecution('debug', 'displayname', displayname)
 
            if (displayname != null && (olddesc == null || olddesc == "")) {
                    rec.setLineItemValue('item', 'description', line, displayname);
                }
             

            

            var kitlevel = null;
            try {
                kitlevel = rec.getLineItemValue('item', 'kitlevel', line);
            }
            catch (e) { }
            nlapiLogExecution('debug', '2', kitlevel);
            var subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', line);
            nlapiLogExecution('debug', '3', line);
            if (subrecord != null) {
                var invDetailID = subrecord.id;
                nlapiLogExecution('debug', 'invDetailID', invDetailID);
                if (invDetailID != null) {
                    var serials = getInventoryDetails(invDetailID);
                    nlapiLogExecution('debug', 'lastkitline', lastkitline);
                    nlapiLogExecution('debug', 'serials', serials.length);

                    if (kitlevel != null) {
                    	
                    	var splitSerials = splitString(serials, 3900);
                    	rec.setLineItemValue('item', 'custcol_ilo_invserials', lastkitline, splitSerials[0]);
                    	rec.setLineItemValue('item', 'custcol_ilo_invserials_cont', lastkitline, splitSerials[1]);
                      	if(splitSerials[1] == undefined) {
                    		rec.setLineItemValue('item', 'custcol_ilo_invserials_cont', lastkitline, '');	
                    	}
         
                        rec.setLineItemValue('item', 'custcol_invserialscount', lastkitline, count);
                        nlapiLogExecution('debug', '32', line);
                      nlapiLogExecution('debug', 'serials-check', serials)
                    }
                    else {
//                     
                        	var splitSerials = splitString(serials, 3900);
                        	rec.setLineItemValue('item', 'custcol_ilo_invserials', line, splitSerials[0]);
                        	rec.setLineItemValue('item', 'custcol_ilo_invserials_cont', line, splitSerials[1]);
                        	if(splitSerials[1] == undefined) {
                        		rec.setLineItemValue('item', 'custcol_ilo_invserials_cont', line, '');	
                        	}
                   
//                        rec.setLineItemValue('item', 'custcol_ilo_invserials', line, serials);
                        rec.setLineItemValue('item', 'custcol_invserialscount', line, count);
                        nlapiLogExecution('debug', '33', line);
                    }

                }
            }
        }
        var approvedby = "";
        try {
            var filters = [];
            filters.push(new nlobjSearchFilter('internalid', null, 'is', recId));
            filters.push(new nlobjSearchFilter('newvalue', 'systemNotes', 'is', 'Pending Fulfillment'));

            // Define search columns
            var columns = [
            (new nlobjSearchColumn('date', 'systemNotes')).setSort(true), new nlobjSearchColumn('name', 'systemNotes'),
            new nlobjSearchColumn('field', 'systemNotes'),
            new nlobjSearchColumn('newvalue', 'systemNotes'),
            new nlobjSearchColumn('oldvalue', 'systemNotes')
            ];

            var searchResults = nlapiSearchRecord('transferorder', null, filters, columns);
            approved = searchResults[0].getText("name", "systemnotes");
            rec.setFieldValue('custbody_approvedby', approved);
        }
        catch (ex) {

        }
        try {
            var createdfrom = rec.getFieldValue("createdfrom");
            var trasfrerRec = nlapiLoadRecord("transferorder", createdfrom);
            var approvedby = trasfrerRec.getFieldValue("custbody_approvedby");
            var fromlocation = trasfrerRec.getFieldValue("location");

            rec.setFieldValue('custbody_approvedby', approvedby);
            rec.setFieldValue('custbody_shipping_from', fromlocation);
        }
        catch (ex) {

        }

        nlapiLogExecution('debug', '4', line);


        nlapiSubmitRecord(rec);
    }
    catch (ex) {
        nlapiLogExecution('error', 'error:', ex);

    }
}


function getInventoryDetails(invDetailID) {
    var serials = "";
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    count = 0;
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var inventname = line.getValue('inventorynumber', 'inventorynumber');
            var quantity = line.getValue('quantity');
 //           if (serials.length > 990)
 //               return serials;
            if (quantity != null && quantity > 1)
                serials += inventname + " " + quantity + "<br>";
            else
                serials += inventname + " ";
            count++;
        });
    }

    return serials;
}


function splitString (string, size) {
	var re = new RegExp('.{1,' + size + '}', 'g');
	return string.match(re);
}