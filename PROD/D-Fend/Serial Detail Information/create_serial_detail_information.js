var res = serach_pd()
var serial_string = '';
var context = nlapiGetContext()
var user = context.user;
var so_type = '';
var today = nlapiDateToString(new Date());
var pdList = [];
var sublist;
var setInactiveList = [];
var createdfromRec = null
var i;

function create_serial_detail_information(type) {
    try {
        if (type != 'delete') {
            var typeRecord = nlapiGetRecordType();
            var Recid = nlapiGetRecordId()
            nlapiLogExecution('debug', ' typeRecord ' + typeRecord, 'Recid ' + Recid);
            var rec = nlapiLoadRecord(typeRecord, Recid);
            sublist = 'item';
            if (typeRecord == 'inventoryadjustment') { sublist = 'inventory' }
            var itemCount = rec.getLineItemCount(sublist);
            var data = [];
            var create = true;
            if (itemCount > 0) {
                var ordertype = rec.getFieldValue('ordertype');
                var trandate = rec.getFieldValue('trandate');
                var vendorOrCustomer = rec.getFieldValue('entity');
                for ( i = 1; i <= itemCount; i++) {
                    var isserial = rec.getLineItemValue(sublist, 'isserial', i);
                    if (isserial == 'T') {
                        var item = rec.getLineItemValue(sublist, 'item', i);
                        subrecord = "";
                        subrecord = rec.viewLineItemSubrecord(sublist, 'inventorydetail', i);
                        if (subrecord != "" && subrecord != null) {
                            var invDetailID = subrecord.id;
                            if (invDetailID != "" && invDetailID != null) {
                                var serials = getInventoryDetails(invDetailID);
                                if (serials != null) {
                                    nlapiLogExecution('debug', ' serials.length ' + serials.length, JSON.stringify(serials));
                                    var description = rec.getLineItemValue(sublist, 'itemdescription', i);
                                    var location = rec.getLineItemValue(sublist, 'location', i);
                                    rec.setLineItemValue(sublist, 'custcol_invserials', i, serial_string)
                                    if (typeRecord == 'itemfulfillment') {
                                        var serialnumber = '';
                                        if (ordertype == "SalesOrd") {
                                            var createdfrom = rec.getFieldValue('createdfrom');
                                            if (createdfromRec == null) {
                                                createdfromRec = nlapiLoadRecord('salesorder', createdfrom);
                                            }
                                            so_type = createdfromRec.getFieldValue('custbody_so_type');
                                            if (so_type == '2') { // RMA
                                                var caseNum = createdfromRec.getFieldValue('custbody_rac_link_to_case');
                                                if (isNullOrEmpty(caseNum)) {
                                                    caseNum = createdfromRec.getFieldValue('custbody9');
                                                }
                                                if (!isNullOrEmpty(caseNum)) {
                                                    serialnumber = nlapiLookupField('supportcase', caseNum, 'serialnumber');
                                                }
                                            }
                                        }
                                    }
                                    for (var j = 0; j < serials.length; j++) {
                                        if (typeRecord == 'itemreceipt' || typeRecord == 'inventoryadjustment') {
                                            create = true;
                                            var pd_id = '';
                                            if (res[serials[j]] != null) {
                                                var resData = res[serials[j]];
                                                for (var t = 0; t < resData.length; t++) {
                                                    if (resData[t].item == item) {
                                                        create = false;
                                                        pd_id = resData[t].id
                                                        pdList.push(pd_id);
                                                        if (typeRecord == 'inventoryadjustment') {
                                                            updateInventoryadjustment(Recid, pd_id)
                                                            var adjustqtyby = rec.getLineItemValue(sublist, 'adjustqtyby', i);
                                                            if (Number(adjustqtyby) < 0) { setInactiveList.push(pd_id); }
                                                        }
                                                        else { // typeRecord == itemreceipt
                                                            if (ordertype == "RtnAuth") {
                                                                var createdfrom = rec.getFieldValue('createdfrom');
                                                                if (createdfromRec == null) {
                                                                    createdfromRec = nlapiLoadRecord('returnauthorization', createdfrom);
                                                                    var replacement = createdfromRec.getFieldValue('custbody_enable_advance_replacement');
                                                                }
                                                                if (replacement == 2) {
                                                                    updateITRFromRma(pd_id);
                                                                }
                                                            }                                                           
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            //nlapiLogExecution('debug', 'create', create);
                                            if (create) {
                                                var getExecutionContext = context.getExecutionContext()
                                                if (getExecutionContext == 'scheduled') { user = ''; }
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
                                            if (type == 'edit') {
                                                updateApi(rec, Recid)
                                            }
                                            var newDate = '';
                                            var UpdateExpirationDate = true;
                                            if (serialnumber != '') { // FROM RMA && CASE
                                                if (serialnumber == serials[j]) {
                                                    UpdateExpirationDate = false;
                                                }
                                                else { // not some serials
                                                    try {
                                                        if (res[serialnumber] != null) {
                                                            var resData = res[serialnumber];
                                                            for (var t = 0; t < resData.length; t++) {
                                                                if (resData[t].item == item) {
                                                                    var case_pd_id = resData[t].id
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    } catch (e) { case_pd_id = ''; }
                                                    nlapiLogExecution('debug', ' case_pd_id', case_pd_id);
                                                    if (case_pd_id != '') {
                                                        newDate = nlapiLookupField('customrecord_serial_detail_information', case_pd_id, 'custrecord_warranty_expiration_date');
                                                        if (!isNullOrEmpty(newDate)) {
                                                            UpdateExpirationDate = false;
                                                        }
                                                    }
                                                }
                                            }
                                            if (res[serials[j]] != null) {
                                                var resData = res[serials[j]];
                                                for (var t = 0; t < resData.length; t++) {
                                                    if (resData[t].item == item) {
                                                        var pd_id = resData[t].id
                                                        pdList.push(pd_id);
                                                        break;
                                                    }
                                                }
                                                if (pd_id != '') {
                                                    var df_serial_number = rec.getLineItemValue(sublist, 'custcol_df_serial_number', i);
                                                    try { update_pd(pd_id, rec, Recid, UpdateExpirationDate, newDate, vendorOrCustomer, trandate, type, serials[j], item, df_serial_number) } catch (e) { }
                                                }
                                            }
                                        }
                                        else if (typeRecord == 'returnauthorization') {
                                            if (res[serials[j]] != null) {
                                                var resData = res[serials[j]];
                                                for (var t = 0; t < resData.length; t++) {
                                                    if (resData[t].item == item) {
                                                        var pd_id = resData[t].id
                                                        pdList.push(pd_id);
                                                        break;
                                                    }
                                                }
                                                if (pd_id != '' && type == 'create') {
                                                    try { updatePdRMA(pd_id, serials[j], item, Recid) } catch (e) { }
                                                }
                                            }
                                        }
                                        } //   for (var j = 0; j < serials.length; j++) - end
                                    } //     if (serials != null) -end
                                } // if (invDetailID != "" && invDetailID != null) - end
                            } //   if (subrecord != "" && subrecord != null) - end
                        } //     if (isserial == 'T') - end                    
                    } // loop - end

                    if (data.length > 0) { create_pd(data, Recid, typeRecord) }
                    //nlapiLogExecution('debug', ' pdList ' + pdList.length, pdList);
                    if (pdList.length > 0) {
                        rec.setFieldValues('custbody_related_sdi', pdList)
                    }
                    nlapiSubmitRecord(rec);
                    if (setInactiveList.length > 0) { // only for inventoryadjustment type and qty <0
                        setInactive(setInactiveList)
                    }
                } // if (itemCount > 0) - end   
        }  //if (type != 'delete')      
    } catch (e) {
        nlapiLogExecution('error', 'create_serial_detail_information  error', e);
    }
}
function serach_pd() {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F')


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_sd_item');
    columns[1] = new nlobjSearchColumn('custrecord_sd_serial_number');


    var search = nlapiCreateSearch('customrecord_serial_detail_information', null, columns);
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
            var serial_sd = s[i].getValue('custrecord_sd_serial_number')
            var line = [];
            line.push({ item: s[i].getValue('custrecord_sd_item'), id: s[i].id })
            if (results[serial_sd] == null) {
                results[serial_sd] = line
            }
            else {
                var row = results[serial_sd]
                row.push({ item: s[i].getValue('custrecord_sd_item'), id: s[i].id })
                results[serial_sd] = row
            }
        }
    }


    return results;

}
function create_pd(data, Recid, typeRecord) {
    nlapiLogExecution('debug', 'create_pd  data', JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {
        try {
            var rec = nlapiCreateRecord('customrecord_serial_detail_information');
            var serial = data[i].pd_serial_number;
            var item = data[i].pd_item;
            var name = buildName(serial, item)
            rec.setFieldValue('name', name);
            rec.setFieldValue('custrecord_sd_item', item);
            rec.setFieldValue('custrecord_sd_description', data[i].pd_description);
            rec.setFieldValue('custrecord_sd_serial_number', serial);
            rec.setFieldValue('custrecord_sd_update_by', data[i].pd_user);
            rec.setFieldValue('custrecord_sd_receivind_date', data[i].pd_trandate);
            rec.setFieldValue('custrecord_sd_vendor_name', data[i].pd_vendor);
            rec.setFieldValue('custrecord_sd_location', data[i].pd_location);
            var field = 'custrecord_sd_original_item_receipt'
            if (typeRecord == 'inventoryadjustment') {
                field = 'custrecord_sd_inventory_adjustment_ref'
            }
            rec.setFieldValue(field, Recid);

            var id = nlapiSubmitRecord(rec, null, true);
            pdList.push(id);
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
function update_pd(pd_id, rec, Recid, UpdateExpirationDate, newDate, vendorOrCustomer, trandate, type, serial, item, df_serial_number) {
    try {
        nlapiLogExecution('debug', ' UpdateExpirationDate', UpdateExpirationDate);
        var pdRec = nlapiLoadRecord('customrecord_serial_detail_information', pd_id);
        var name = pdRec.getFieldValue('name')
        if (isNullOrEmpty(name)) {
            var name = buildName(serial, item)
            pdRec.setFieldValue('name', name);
        }
        pdRec.setFieldValue('custrecord_sd_in_rma_process', 'F');
        var endCustomer = rec.getFieldValue('custbody6')
        var api_marketing = checkEndCustomer(endCustomer)
        var sdItf = pdRec.getFieldValue('custrecord_sd_item_fulfillment')
        pdRec.setFieldValue('custrecord_sd_update_by', user)// update by
        pdRec.setFieldValue('custrecord_sd_date_update', today)// DATE UPDATE (DATE)                                                                                                                                                          
        if (isNullOrEmpty(sdItf)) {
            pdRec.setFieldValue('custrecord_sd_item_fulfillment', Recid) // ITF      
            pdRec.setFieldValue('custrecord_sd_customer', vendorOrCustomer)//CUSTOMER
            if (UpdateExpirationDate) { expirationDate = rec.getLineItemValue(sublist, 'custcol_warranty_expiration_date', i) }
            else if (!isNullOrEmpty(newDate)) { expirationDate = newDate }
            pdRec.setFieldValue('custrecord_warranty_expiration_date', expirationDate)   // WARRANTY EXPIRATION DATE 
            if (api_marketing == 'T') {
                pdRec.setFieldValue('custrecord_sd_end_customer', endCustomer) //END CUSTOMER
            }
            pdRec.setFieldValue('custrecord_sd_sipping_date', trandate)// SIPPING DATE
            if (so_type != '2') { // RMA
                pdRec.setFieldValue('custrecord_warranty_period_month', rec.getFieldValue('custbody_warranty_period'))// WARRANTY PERIOD(MONTH)         
            }
            else { // FROM RMA               
                if (serial == df_serial_number) {
                    pdRec.setFieldValue('custrecord_sd_in_rma_process', 'F') // IN RMA PROCESS  
                }
                else if (!isNullOrEmpty(df_serial_number)) {
                    nlapiLogExecution('debug', 'df_serial_number', df_serial_number);
                    getSDI(df_serial_number, item)                
                }
            }
            pdRec.setFieldValue('custrecord_sd_last_item_fulfillment', Recid)
            pdRec.setFieldValue('custrecord_sd_api_ref_number', rec.getFieldValue('custbody7'))

        }
        if (type == 'create') {
            pdRec.setFieldValue('custrecord_sd_last_item_fulfillment', Recid)
            pdRec.setFieldValue('custrecord_sd_customer', vendorOrCustomer)//CUSTOMER
            if (UpdateExpirationDate) { expirationDate = rec.getLineItemValue(sublist, 'custcol_warranty_expiration_date', i) }
            else if (!isNullOrEmpty(newDate)) { expirationDate = newDate }
            pdRec.setFieldValue('custrecord_warranty_expiration_date', expirationDate)   // WARRANTY EXPIRATION DATE 
            if (api_marketing == 'T') {
                pdRec.setFieldValue('custrecord_sd_end_customer', endCustomer) //END CUSTOMER
            }
            if (so_type != '2') { // RMA
                pdRec.setFieldValue('custrecord_sd_api_ref_number', rec.getFieldValue('custbody7'))
                pdRec.setFieldValue('custrecord_warranty_period_month', rec.getFieldValue('custbody_warranty_period'))// WARRANTY PERIOD(MONTH)              
                pdRec.setFieldValue('custrecord_sd_sipping_date', trandate)// SIPPING DATE                  
            }
            else { // FROM RMA
                if (serial == df_serial_number) {
                    pdRec.setFieldValue('custrecord_sd_in_rma_process', 'F') // IN RMA PROCESS  
                }
                else if (!isNullOrEmpty(df_serial_number)) {
                    nlapiLogExecution('debug', 'df_serial_number', df_serial_number);
                    getSDI(df_serial_number, item)
                }
            }
        }
            nlapiSubmitRecord(pdRec, null, true);
    } catch (e) {
        nlapiLogExecution('error', 'error update_pd ', e);
    }

}
function checkEndCustomer(endCustomer) {
    if (!isNullOrEmpty(endCustomer)) {
        var api_marketing = nlapiLookupField('customer', endCustomer, 'custentity_api_marketing');
        return api_marketing
    }
}
function updatePdRMA(pd_id, serial, item, Recid) {
    var pdRec = nlapiLoadRecord('customrecord_serial_detail_information', pd_id);
    var name = buildName(serial, item)
    pdRec.setFieldValue('name', name);
    pdRec.setFieldValue('custrecord_sd_in_rma_process', 'T');
    pdRec.setFieldValue('custrecord_sd_last_rma', Recid);   
    nlapiSubmitRecord(pdRec, null, true);
}
function buildName(serial, item) {

    var itemid = nlapiLookupField('item', item, 'itemid')
    var name = serial + ' : ' + itemid;
    return name

}
function updateApi(rec, Recid) {
    var oldRec = nlapiGetOldRecord();
    var old_api = oldRec.getFieldValue('custbody7')
    var api = rec.getFieldValue('custbody7')
    if (old_api != api && !isNullOrEmpty(api)) {
        updatePDApi(Recid, api)
    }
}
function updatePDApi(Recid, api) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[1] = new nlobjSearchFilter('custrecord_sd_item_fulfillment', null, 'anyof', Recid)
    filters[2] = new nlobjSearchFilter('custrecord_sd_api_ref_number', null, 'isnot', api)

    var search = nlapiCreateSearch('customrecord_serial_detail_information', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    nlapiLogExecution('debug', 'updatePDApi s ' + s.length, JSON.stringify(s));
    for (var i = 0; i < s.length; i++) {
        nlapiSubmitField('customrecord_serial_detail_information', s[i].id, 'custrecord_sd_api_ref_number', api)
    }
  
}
function setInactive(setInactiveList) {
    for (var i = 0; i < setInactiveList.length; i++) {
        var pdRec = nlapiLoadRecord('customrecord_serial_detail_information', setInactiveList[i]);
        pdRec.setFieldValue('isinactive', 'T');
        nlapiSubmitRecord(pdRec, null, true);      
    }   
}
function updateInventoryadjustment(Recid, pd_id) {
    var pdRec = nlapiLoadRecord('customrecord_serial_detail_information', pd_id);
    pdRec.setFieldValue('custrecord_sd_inventory_adjustment_ref', Recid);
    nlapiSubmitRecord(pdRec, null, true);
}
function updateITRFromRma(pd_id) {
    var pdRec = nlapiLoadRecord('customrecord_serial_detail_information', pd_id);
    pdRec.setFieldValue('custrecord_sd_end_customer', '') //END CUSTOMER   
    pdRec.setFieldValue('custrecord_sd_customer', '')//CUSTOMER
    pdRec.setFieldValue('custrecord_sd_in_rma_process', 'F') // IN RMA PROCESS
    nlapiSubmitRecord(pdRec, null, true);
}
function getSDI(df_serial_number, item) {
    nlapiLogExecution('DEBUG', 'getSDI FUNCATION ', 'df_serial_number: ' + df_serial_number + ' ,item: ' + item);
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[1] = new nlobjSearchFilter('custrecord_sd_item', null, 'anyof', item)
    filters[2] = new nlobjSearchFilter('custrecord_sd_serial_number', null, 'is', df_serial_number)


    var search = nlapiCreateSearch('customrecord_serial_detail_information', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s.length > 0) {
        var sdiID = s[0].id;
        updateITRFromRma(sdiID)
    }
}

