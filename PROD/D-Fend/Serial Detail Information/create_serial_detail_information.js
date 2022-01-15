var res = serach_pd()
var serial_string = '';


function create_serial_detail_information() {
    try {

        var typeRecord = nlapiGetRecordType();
        var Recid = nlapiGetRecordId()
        nlapiLogExecution('debug', ' typeRecord: ' + typeRecord, 'id: ' + Recid);  
        var rec = nlapiLoadRecord(typeRecord, Recid );
            var itemCount = rec.getLineItemCount('item');
            var data = [];
            var create = true;
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    var item = rec.getLineItemValue('item', 'item', i);
                    var manage_sw_version = nlapiLookupField('item', item, 'custitemcustitem_manage_sw_version')                        
                    if (manage_sw_version == 'T') {
                        subrecord = "";
                        subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                        if (subrecord != "" && subrecord != null) {
                            nlapiLogExecution('debug', ' subrecord', subrecord.id);
                            var invDetailID = subrecord.id;
                            if (invDetailID != "" && invDetailID != null) {
                                var serials = getInventoryDetails(invDetailID);
                                if (serials != null) {
                                    nlapiLogExecution('debug', ' serials.length ', serials.length);
                                    var description = rec.getLineItemValue('item', 'itemdescription', i);                                        
                                    var trandate = rec.getFieldValue('trandate');
                                    var vendorOrCustomer = rec.getFieldValue('entity');
                                    var location = rec.getLineItemValue('item', 'location', i);
                                    rec.setLineItemValue('item', 'custcol_invserials', i, serial_string )
                                    var context = nlapiGetContext()
                                    var user = context.user;
                                    if (typeRecord == 'itemfulfillment') {
                                        var serialnumber = '';
                                        var ordertype = rec.getFieldValue('ordertype'); 
                                        if (ordertype == "SalesOrd") {
                                            nlapiLogExecution('debug', ' ordertype', ordertype);
                                            var createdfrom = rec.getFieldValue('createdfrom');
                                            var soRec = nlapiLoadRecord('salesorder', createdfrom);
                                            var so_type = soRec.getFieldValue('custbody_so_type');
                                            if (so_type == '2') { // RMA
                                                var caseNum = soRec.getFieldValue('custbody_rac_link_to_case');
                                                if (isNullOrEmpty(caseNum)) {
                                                    caseNum = soRec.getFieldValue('custbody9');
                                                }
                                                if (!isNullOrEmpty(caseNum)) {
                                                    serialnumber = nlapiLookupField('supportcase', caseNum, 'serialnumber');
                                                }
                                            }                                         
                                        }
                                    }
                                    nlapiLogExecution('debug', ' serialnumber', serialnumber);
                                    for (var j = 0; j < serials.length; j++) {
                                        if (typeRecord == 'itemreceipt') {
                                            create = true;
                                            if (res[serials[j]] != null) {                                                 
                                                if (res[serials[j]].item == item) {
                                                    create = false;
                                                }
                                            }
                                            if (create) {
                                                var getExecutionContext = context.getExecutionContext()
                                                nlapiLogExecution('debug', 'nlapiGetContext().getExecutionContext()', getExecutionContext)
                                                if (getExecutionContext == 'scheduled') { user = '';}

                                                data.push({
                                                    pd_item: item,
                                                    pd_description: description,
                                                    pd_serial_number: serials[j],
                                                    pd_user: user,
                                                    pd_trandate: trandate,
                                                    pd_vendor: vendorOrCustomer,
                                                    pd_location: location,
                                                });

                                            }
                                        }
                                        else if (typeRecord == 'itemfulfillment') {
                                            var newDate = '';
                                            var UpdateExpirationDate = true;
                                            var endCustomer = rec.getFieldValue('custbody6');
                                            if (serialnumber != '') { // FROM RMA && CASE
                                                if (serialnumber == serials[j] ) {
                                                    UpdateExpirationDate = false;
                                                }
                                                else { // not some serials
                                                    try { var case_pd_id = res[serialnumber].id; } catch (e) { case_pd_id = ''; }
                                                    nlapiLogExecution('debug', ' case_pd_id', case_pd_id);
                                                    if (case_pd_id != '' ) {
                                                        if (res[serialnumber].item == item) {
                                                            newDate = nlapiLookupField('customrecord_serial_detail_information', case_pd_id, 'custrecord_warranty_expiration_date');
                                                            if (!isNullOrEmpty(newDate)) {
                                                                UpdateExpirationDate = false;
                                                            }
                                                        }                                                     
                                                    }
                                                }
                                            }                
                                            if (res[serials[j]] != null) {
                                                if (res[serials[j]].item == item) {
                                                    var pd_id = res[serials[j]].id
                                                    if (pd_id != '') {
                                                        var context = nlapiGetContext();
                                                        var user = context.user;
                                                        var today = nlapiDateToString(new Date());
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_customer', vendorOrCustomer)  //CUSTOMER
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_end_customer', endCustomer)  //END CUSTOMER
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_item_fulfillment', Recid)  // ITF
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_sipping_date', trandate)  // SIPPING DATE
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_update_by', user)  // update by
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_sd_date_update', today)  // DATE UPDATE (DATE)
                                                        nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_warranty_period_month', rec.getFieldValue('custbody_warranty_period'))  // WARRANTY PERIOD(MONTH)
                                                        if (UpdateExpirationDate) {
                                                            nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_warranty_expiration_date', rec.getFieldValue('custbody_warranty_expiration_date'))  // WARRANTY EXPIRATION DATE                                                           
                                                        }
                                                        else if (!isNullOrEmpty(newDate)) {
                                                            nlapiSubmitField('customrecord_serial_detail_information', pd_id, 'custrecord_warranty_expiration_date', newDate)  // WARRANTY EXPIRATION DATE                                                           
                                                        }
                                                       
                                                    }
                                                }
                                            }                                                                                 
                                        }
                                    } //   for (var j = 0; j < serials.length; j++) - end
                                } //     if (serials != null) -end
                            } // if (invDetailID != "" && invDetailID != null) - end
                        } //   if (subrecord != "" && subrecord != null) - end
                    } //     if (manage_sw_version == 'T') - end                    
                } // loop - end
                nlapiSubmitRecord(rec)
                if (typeRecord == 'itemreceipt') { create_pd(data) }
            } // if (itemCount > 0) - end     
    } catch (e) {
        nlapiLogExecution('debug', 'create_serial_detail_information  error', e);
    }  
}
//ITR00205

function serach_pd() {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F')


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_sd_item');
    columns[1] = new nlobjSearchColumn('custrecord_sd_serial_number');
  

    var search = nlapiCreateSearch('customrecord_serial_detail_information', filters, columns);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    var results = [];
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    
    if (s != null) {
       
        for (var i = 0; i < s.length; i++) {

            results[s[i].getValue('custrecord_sd_serial_number')] = {
                item: s[i].getValue('custrecord_sd_item'),
                id : s[i].id

            }
        }
    }

 
    return results;

}

function create_pd(data) {

    nlapiLogExecution('debug', 'create_pd  data', JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {
        try {
            var rec = nlapiCreateRecord('customrecord_serial_detail_information');
            rec.setFieldValue('custrecord_sd_item', data[i].pd_item);
            rec.setFieldValue('custrecord_sd_description', data[i].pd_description);
            rec.setFieldValue('custrecord_sd_serial_number', data[i].pd_serial_number);
            rec.setFieldValue('custrecord_sd_update_by', data[i].pd_user);
            rec.setFieldValue('custrecord_sd_receivind_date', data[i].pd_trandate);
            rec.setFieldValue('custrecord_sd_vendor_name', data[i].pd_vendor);
            rec.setFieldValue('custrecord_sd_location', data[i].pd_location);
            var id = nlapiSubmitRecord(rec);
            nlapiLogExecution('debug', ' id', id);
        } catch (e) {
            nlapiLogExecution('debug', 'create_pd  error', e);
        }
    }



}

function getInventoryDetails(invDetailID) {
    var serials = [];
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    count = 0;
    serial_string = '';
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {

            var inventname = line.getValue('inventorynumber', 'inventorynumber'); 
            serial_string += inventname + ' ';
            serials.push(inventname);
            count++;
        });
    }

    return serials;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}