var results = [];

function getSerialNumber(request, response) {

  
    if (request.getMethod() == 'GET') {

        var form = nlapiCreateForm('Update Version');
        form.addSubmitButton('Update');
        var id = request.getParameter('rec_id');
        var type = request.getParameter('rec_type');
        var rec = nlapiLoadRecord(type, id);
        
        nlapiLogExecution('debug', ' id', id);
        nlapiLogExecution('debug', ' type', type);
        if (type == 'supportcase') {
            var item = rec.getFieldValue('item')
            var serialnumber = rec.getFieldValue('serialnumber')
            serach_pd(item, serialnumber);

        }
        else {
            var itemCount = rec.getLineItemCount('item');
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    //var serials = rec.getLineItemValue('item', 'custcol_invserials', i);
                    subrecord = "";
                    subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);
                    if (subrecord != "" && subrecord != null) {
                        nlapiLogExecution('debug', ' subrecord', subrecord.id);
                        var invDetailID = subrecord.id;
                        if (invDetailID != "" && invDetailID != null) {
                            var serials = getInventoryDetails(invDetailID);             
                            if (serials != '' && serials != null) {
                                nlapiLogExecution('debug', ' serials.length ', serials.length);
                                var serials_split = serials.split(' ')
                                var item = rec.getLineItemValue('item', 'item', i);
                                for (var z = 0; z < serials_split.length; z++) {
                                    if (serials_split[z] != '') {
                                        nlapiLogExecution('debug', ' serials_split[z]', serials_split[z]);
                                        serach_pd(item, serials_split[z])
                                    }
                                }

                            }
                        }
                    }                                 
                } // for (var i = 1; i <= itemCount; i++)
            } //   if (itemCount > 0) 
        }
        form.addField('custpage_ilo_multi_version', 'select', 'Version', 'customlist_software_version', null);

        var rec_type = form.addField('custpage_ilo_type', 'text', 'Version', null, null).setDisplayType('hidden');
        rec_type.setDefaultValue(type);

        var rec_id = form.addField('custpage_ilo_id', 'text', 'Version', null, null).setDisplayType('hidden');
        rec_id.setDefaultValue(id);

        form.setScript('customscript_update_serial_detail_cs');

        // RESULTS TRANSACTIONS SUBLIST - START
        var resultsSubList = form.addSubList('custpage_results_sublist', 'list', 'Serial Detail Information', null);

        resultsSubList.addButton('customscript_marlk_all', 'Mark All', 'MarkAll()');

        resultsSubList.addButton('customscript_un_marlk_all', 'Unmark All', 'UnmarkAll()');

        resultsSubList.addField('custpage_resultssublist_checkbox', 'checkbox', 'select');

        resultsSubList.addField('custpage_resultssublist_id', 'text', 'ID');

        resultsSubList.addField('custpage_resultssublist_item', 'text', 'Item');

        resultsSubList.addField('custpage_resultssublist_item_value', 'text', 'Item').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_serial', 'text', 'Serial');

        resultsSubList.addField('custpage_resultssublist_vendor', 'text', 'Vendor');

        resultsSubList.addField('custpage_resultssublist_vendor_value', 'text', 'Vendor').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_version_new', 'select', 'Version', 'customlist_software_version');

        resultsSubList.addField('custpage_resultssublist_version_curr', 'select', 'Version', 'customlist_software_version').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_location', 'text', 'Location').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_site', 'text', 'site').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_end_customer', 'text', 'endCustomer').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_rece_date', 'text', 'receDate').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_customer', 'text', 'customer').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_itf', 'text', 'itf').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_des', 'text', 'des').setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_warranty_period_month', 'text', 'WARRANTY PERIOD (MONTH)')//.setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_warranty_expiration_date', 'text', 'WARRANTY EXPIRATION DATE')//.setDisplayType('hidden');

        resultsSubList.addField('custpage_resultssublist_shipping_date', 'text', 'custpage_resultssublist_shipping_date').setDisplayType('hidden');

        nlapiLogExecution('debug', ' results', results.length);
        for (var j = 0; j < results.length; j++) {

            resultsSubList.setLineItemValue('custpage_resultssublist_checkbox', j + 1, 'T');
            resultsSubList.setLineItemValue('custpage_resultssublist_id', j + 1, results[j].id);
            resultsSubList.setLineItemValue('custpage_resultssublist_item', j + 1, results[j].item);
            resultsSubList.setLineItemValue('custpage_resultssublist_item_value', j + 1, results[j].itemValue);          
            resultsSubList.setLineItemValue('custpage_resultssublist_serial', j + 1, results[j].serial);
            resultsSubList.setLineItemValue('custpage_resultssublist_vendor', j + 1, results[j].vendor);
            resultsSubList.setLineItemValue('custpage_resultssublist_vendor_value', j + 1, results[j].vendorValue);           
            resultsSubList.setLineItemValue('custpage_resultssublist_location', j + 1, results[j].location);
            resultsSubList.setLineItemValue('custpage_resultssublist_site', j + 1, results[j].site);
            resultsSubList.setLineItemValue('custpage_resultssublist_end_customer', j + 1, results[j].endCustomer);
            resultsSubList.setLineItemValue('custpage_resultssublist_rece_date', j + 1, results[j].receDate);
            resultsSubList.setLineItemValue('custpage_resultssublist_customer', j + 1, results[j].customer);
            resultsSubList.setLineItemValue('custpage_resultssublist_itf', j + 1, results[j].itf);
            resultsSubList.setLineItemValue('custpage_resultssublist_des', j + 1, results[j].des);
            resultsSubList.setLineItemValue('custpage_resultssublist_version_curr', j + 1, results[j].version);
            resultsSubList.setLineItemValue('custpage_resultssublist_version_new', j + 1, results[j].version);
            resultsSubList.setLineItemValue('custpage_resultssublist_warranty_period_month', j + 1, results[j].warranty_period_month);
            resultsSubList.setLineItemValue('custpage_resultssublist_warranty_expiration_date', j + 1, results[j].warranty_expiration_date);
            resultsSubList.setLineItemValue('custpage_resultssublist_shipping_date', j + 1, results[j].shipping_date);



        }


        response.writePage(form);

    }

    else {

        var Secondform = nlapiCreateForm('Update Version will be update');

        var rec_type = request.getParameter('custpage_ilo_type');
        var rec_id = request.getParameter('custpage_ilo_id');

        var data = [];
        var sdToUpdateInActive = [];
        var sdToUpdate = [];
        var lineCount = request.getLineItemCount('custpage_results_sublist')
        for (var x = 1; x <= lineCount; x++) {
            checkBox = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_checkbox', x);
            id = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_id', x)
            item = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_item_value', x)
            serial = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_serial', x)
            vendor = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_vendor_value', x)
            version_new = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_version_new', x)
            location = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_location', x)
            site = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_site', x)
            endCustomer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_end_customer', x)
            receDate = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_rece_date', x)
            customer = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_customer', x)
            itf = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_itf', x)
            des = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_des', x)
            version_curr = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_version_curr', x)
            warranty_period_month = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_warranty_period_month', x)
            warranty_expiration_date = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_warranty_expiration_date', x)
            shipping_date = request.getLineItemValue('custpage_results_sublist', 'custpage_resultssublist_shipping_date', x)

                            
            if (version_new != version_curr && version_curr != '' && version_curr != null ) {
                sdToUpdateInActive.push(id);
                data.push({
                    pd_item: item,
                    pd_serial: serial,
                    pd_vendor: vendor,
                    pd_version: version_new,
                    pd_location: location,
                    pd_site: site,
                    pd_endCustomer: endCustomer,
                    pd_receDate: receDate,
                    pd_customer: customer,
                    pd_itf: itf,
                    pd_description: des,
                    warranty_period_month: warranty_period_month,
                    warranty_expiration_date: warranty_expiration_date,
                    shipping_date: shipping_date
                });
            } //   if (version != '')

            else if (version_new != version_curr && version_curr == null ) {
                sdToUpdate.push({
                    id: id,
                    version: version_new,
                });


            }
            
        } //   for (var x = 1; x <= lineCount; x++)

        

            create_pd(data);
            update_pd(sdToUpdateInActive, sdToUpdate );
        

        nlapiSetRedirectURL('record', rec_type, rec_id, null, null)

    } // else 
   
    response.writePage(Secondform);
}




function serach_pd(item, serial) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F')
    filters[1] = new nlobjSearchFilter('custrecord_sd_serial_number', null, 'is', serial)
    filters[2] = new nlobjSearchFilter('custrecord_sd_item', null, 'anyof', item)

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_sd_item');
    columns[1] = new nlobjSearchColumn('custrecord_sd_serial_number');
    columns[2] = new nlobjSearchColumn('custrecord_sd_vendor_name');
    columns[3] = new nlobjSearchColumn('custrecord_sd_item');
    columns[4] = new nlobjSearchColumn('custrecord_sd_software_version');
    columns[5] = new nlobjSearchColumn('custrecord_sd_location');
    columns[6] = new nlobjSearchColumn('custrecord_sd_site');
    columns[7] = new nlobjSearchColumn('custrecord_sd_end_customer');
    columns[8] = new nlobjSearchColumn('custrecord_sd_receivind_date');
    columns[9] = new nlobjSearchColumn('custrecord_sd_customer');
    columns[10] = new nlobjSearchColumn('custrecord_sd_item_fulfillment');
    columns[11] = new nlobjSearchColumn('custrecord_sd_description');
    columns[12] = new nlobjSearchColumn('id').setSort(true)
    columns[13] = new nlobjSearchColumn('custrecord_warranty_period_month');
    columns[14] = new nlobjSearchColumn('custrecord_warranty_expiration_date');
    columns[15] = new nlobjSearchColumn('custrecord_sd_sipping_date');
    
    

    var search = nlapiCreateSearch('customrecord_serial_detail_information', filters, columns);
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

    nlapiLogExecution('debug', ' s', s.length);
    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,
                item: s[i].getText('custrecord_sd_item'),
                itemValue: s[i].getValue('custrecord_sd_item'),
                serial: s[i].getValue('custrecord_sd_serial_number'),
                vendor: s[i].getText('custrecord_sd_vendor_name'),
                vendorValue: s[i].getValue('custrecord_sd_vendor_name'),
                location: s[i].getValue('custrecord_sd_location'),
                site: s[i].getValue('custrecord_sd_site'),
                endCustomer: s[i].getValue('custrecord_sd_end_customer'),
                receDate: s[i].getValue('custrecord_sd_receivind_date'),
                customer: s[i].getValue('custrecord_sd_customer'),
                itf: s[i].getValue('custrecord_sd_item_fulfillment'),
                des: s[i].getValue('custrecord_sd_description'),
                version: s[i].getValue('custrecord_sd_software_version'),
                warranty_period_month: s[i].getValue('custrecord_warranty_period_month'),
                warranty_expiration_date: s[i].getValue('custrecord_warranty_expiration_date'),
                shipping_date: s[i].getValue('custrecord_sd_sipping_date'),
               
                

            });


            results.sort(function (a, b) { return a.id - b.id });
           
        }
    }

}

function create_pd(data) {

    var context = nlapiGetContext();
    var user = context.user;
    var today = nlapiDateToString(new Date());
    nlapiLogExecution('debug', ' data', JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {

        var rec = nlapiCreateRecord('customrecord_serial_detail_information');

        rec.setFieldValue('custrecord_sd_item', data[i].pd_item);
        rec.setFieldValue('custrecord_sd_serial_number', data[i].pd_serial);
     
        rec.setFieldValue('custrecord_sd_software_version', data[i].pd_version);
        rec.setFieldValue('custrecord_sd_site', data[i].pd_site);
        rec.setFieldValue('custrecord_sd_end_customer', data[i].pd_endCustomer);
        rec.setFieldValue('custrecord_sd_date_update', today);
        rec.setFieldValue('custrecord_sd_update_by', user);
        rec.setFieldValue('custrecord_sd_receivind_date', data[i].pd_receDate);     
        rec.setFieldValue('custrecord_sd_vendor_name', data[i].pd_vendor);
        rec.setFieldValue('custrecord_sd_customer', data[i].pd_customer);
        rec.setFieldValue('custrecord_sd_location', data[i].pd_location);
        rec.setFieldValue('custrecord_sd_item_fulfillment', data[i].pd_itf);      
        rec.setFieldValue('custrecord_sd_description', data[i].pd_description); 
        rec.setFieldValue('custrecord_warranty_period_month', data[i].warranty_period_month); 
        rec.setFieldValue('custrecord_warranty_expiration_date', data[i].warranty_expiration_date);
        rec.setFieldValue('custrecord_sd_sipping_date', data[i].shipping_date);
        
        var id = nlapiSubmitRecord(rec);  

    }


}


function update_pd(sdToUpdateInActive,sdToUpdate) {
    if (sdToUpdateInActive != null) {
        for (var i = 0; i < sdToUpdateInActive.length; i++) {

            nlapiSubmitField('customrecord_serial_detail_information', sdToUpdateInActive[i], 'isinactive', 'T')  // INACTIVE

        }
    }
    if (sdToUpdate != null) {
        for (var j = 0; j < sdToUpdate.length; j++) {

            nlapiSubmitField('customrecord_serial_detail_information', sdToUpdate[j].id, 'custrecord_sd_software_version', sdToUpdate[j].version)

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
    var result = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (result != null) {
        result.forEach(function (line) {

            var inventname = line.getValue('inventorynumber', 'inventorynumber');
            serial_string += inventname + ' ';
            serials.push(inventname);
            count++;
        });
    }

    return serial_string;
}
     