function agr_line_edit(context) {
    try {
        var tranId = nlapiGetRecordId() 
        try { nlapiScheduleScript('customscript_edit_save_so', null, { custscript_itf_id: tranId }) } catch (e) { }
        var newRec = nlapiGetNewRecord();
        var oldRec = nlapiGetOldRecord();

        var newshipstatus = newRec.getFieldValue('shipstatus');

        if (oldRec == null) {
            oldRec = newRec;
            var oldshipstatus = '';
        }
        else {
            var oldshipstatus = oldRec.getFieldValue('shipstatus');
        }

        nlapiLogExecution('debug', 'context: ', context);
        nlapiLogExecution('debug', 'oldshipstatus: ' + oldshipstatus, 'newshipstatus: ' + newshipstatus);

        if (context != 'delete' && oldshipstatus != newshipstatus && newshipstatus == 'C') { //c -shiped

            var params = {
                'custscript_newrec_id': newRec.id,
                'custscript_newrec_type': nlapiGetRecordType()
            }

            var status = nlapiScheduleScript('customscript_agr_line_creation_ss', 'customdeploy_agr_line_creation_ss', params);//, params
            nlapiLogExecution('DEBUG', 'status', status);


            //agr_line_creation(newRec);
        }

    } catch (e) {
        nlapiLogExecution('error', 'error', e);
        throw nlapiCreateError('Error', e, true);
    }
}



/*
function agr_line_creation(context) {

    try {

    var soId = newRec.getFieldValue('createdfrom');
    var soRec = '';
    if (!isEmpty(soId))
        soRec = nlapiLoadRecord('salesorder', soId);




    var lineCount = newRec.getLineItemCount('item');
    for (var i = 1; i <= lineCount; i++) {
        var itype = newRec.getLineItemValue('item', 'itemtype', i); // Get the item type
        var itemId = newRec.getLineItemValue('item', 'item', i);
        var isSerial = newRec.getLineItemValue('item', 'isserial', i);
        var solineid = newRec.getLineItemValue('item', 'orderline', i);
        var linenum = linecheck(soRec, solineid);
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
        if (recordtype != '') {
            nlapiLogExecution('debug', 'isSerial: ', isSerial);
            nlapiLogExecution('debug', 'itemId: ' + itemId, 'itype: ' + itype + ' , ' + 'recordtype: ' + recordtype);
            var itemRec = nlapiLoadRecord(recordtype, itemId);


            if (isSerial == 'T') {//if serial item

                var subrecord = "";
                subrecord = newRec.viewLineItemSubrecord('item', 'inventorydetail', i);
                if (subrecord != "" && subrecord != null) {
                    var invDetailID = subrecord.id;
                    if (invDetailID != "" && invDetailID != null) {
                        var serials = getInventoryDetails(invDetailID);
                        if (serials != '' && serials != null) {
                            for (var key in serials) {
                                var serial = serials[key];

                                createrRecord(newRec, itemRec, soRec, linenum, serial.inventid);
                            }



                        }
                    }
                }




            }//if serial item
            else if (isSerial != 'T')
                createrRecord(newRec, itemRec, soRec, linenum)


    }
}
    } catch (e) {
    nlapiLogExecution('error', 'error', e);
    throw nlapiCreateError('Error', e, true);
}


}



function isEmpty(val) {
    return (val == undefined || val == null || val == '');
}


function getInventoryDetails(invDetailID) {
    var serials = [];

    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('internalid', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));
    count = 0;
    serial_string = '';
    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];
    if (results != null) {
        results.forEach(function (line) {
            var serial = {};

            serial.inventid = line.getValue('internalid', 'inventorynumber');
            serial.inventname = line.getValue('inventorynumber', 'inventorynumber');
            // serial_string += inventname + ' ';
            serials.push(serial);
            count++;
        });
    }

    return serials;
}


function createrRecord(ffRec, itemRec, soRec, soline, serialNumber) {

    var agrType = soRec.getLineItemValue('item', 'custcol_agreement_type', soline);
    nlapiLogExecution('debug', 'agrType', agrType);
    if (!isEmpty(agrType)) {
        var custId = soRec.getFieldValue('entity');
        var custname = nlapiLookupField('customer', custId, 'companyname');

        var agreement = agrSearch(custId, agrType);
        nlapiLogExecution('debug', 'agreement', agreement);
        if (isEmpty(agreement)) {
            agreement = agrSearch(custId, 3);//3 - לפי קריאה
            nlapiLogExecution('debug', 'לפי קריאה = agreement', agreement);
        }

        var agrRec = nlapiCreateRecord('customrecord_agr_line');
        if (!isEmpty(serialNumber))
            agrRec.setFieldValue('name', itemRec.getFieldValue('itemid') + ' ' + custname + ' ' + serialNumber);
        else
            agrRec.setFieldValue('name', itemRec.getFieldValue('itemid') + ' ' + custname);

        if (!isEmpty(agreement))
            agrRec.setFieldValue('custrecord_agr_line_agreement', agreement);


        agrRec.setFieldValue('custrecord_agr_line_end_cust', soRec.getFieldValue('custbody_tran_end_user'));
        agrRec.setFieldValue('custrecord_agr_line_bus_line', itemRec.getFieldValue('class'));

        agrRec.setFieldValue('custrecord_agr_site', soRec.getLineItemValue('item', 'custcol_site', soline));
        agrRec.setFieldValue('custrecord_agr_line_agent', soRec.getLineItemValue('item', 'custcol_agent', soline));

        agrRec.setFieldValue('custrecord_agr_line_bill_cyc', soRec.getLineItemValue('item', 'custcol_billing_cycle', soline));
        agrRec.setFieldValue('custrecord_agr_line_so', soRec.getId());
        agrRec.setFieldValue('custrecord_agr_line_so_line', soline);
        agrRec.setFieldValue('custrecord_agr_line_cal_mtd', soRec.getLineItemValue('item', 'custcol_computing_systems', soline));
        agrRec.setFieldValue('custrecord_agr_line_item', itemRec.getId());

        agrRec.setFieldValue('custrecord_agr_line_bsc_qty', soRec.getLineItemValue('item', 'custcol_bsc_qty', soline));
        agrRec.setFieldValue('custrecord_agr_line_bsc_rate', soRec.getLineItemValue('item', 'custcol_basic_rate', soline));
        agrRec.setFieldValue('custrecord_agr_line_exceed_rate', soRec.getLineItemValue('item', 'custcol_agre_exceed', soline));


        agrRec.setFieldValue('custrecord_version_num', itemRec.getFieldValue('custitem_version_number'));
        agrRec.setFieldValue('custrecordversion_last_update_date', itemRec.getFieldValue('custitem_ver_n_last_u'));
        agrRec.setFieldValue('custrecord_number_of_users', soRec.getLineItemValue('item', 'custcol_sy_num_license', soline));

        agrRec.setFieldValue('custrecord_agr_line_sales_rep', soRec.getFieldValue('salesrep'));


        var default_warranty_period_mon = Number(itemRec.getFieldValue('custitem_default_warranty_period_mon'));
        nlapiLogExecution('debug', 'default_warranty_period_mon', default_warranty_period_mon);
        if (default_warranty_period_mon > 0) {
            var agr_line_war_str_date = nlapiStringToDate(ffRec.getFieldValue('trandate'));
            nlapiLogExecution('debug', 'agr_line_war_str_date', agr_line_war_str_date);
            var agr_line_war_end_date = nlapiAddMonths(agr_line_war_str_date, default_warranty_period_mon);
            nlapiLogExecution('debug', 'agr_line_war_end_date', agr_line_war_end_date);

            if (!isEmpty(agr_line_war_str_date))
                agrRec.setFieldValue('custrecord_agr_line_war_str_date', nlapiDateToString(agr_line_war_str_date));
            if (!isEmpty(agr_line_war_end_date))
                agrRec.setFieldValue('custrecord_agr_line_war_end_date', nlapiDateToString(agr_line_war_end_date));
        }

        if (!isEmpty(serialNumber)) {
            agrRec.setFieldValue('custrecord_agr_line_serial', serialNumber);
        }


        var date = ffRec.getFieldValue('trandate');
        nlapiLogExecution('debug', 'date', date);
        var newdate = getNextdate(date);
        nlapiLogExecution('debug', 'newdate', newdate);

        agrRec.setFieldValue('custrecord_initial_billing_date', newdate);
        agrRec.setFieldValue('custrecord_agr_line_eft_date', newdate);

        var recid = nlapiSubmitRecord(agrRec);
        nlapiLogExecution('debug', 'recid', recid);
    }
}



function linecheck(record, lineid) {

    var lineCount = record.getLineItemCount('item');
    for (var i = 1; i <= lineCount; i++) {
        var line = record.getLineItemValue('item', 'line', i);
        if (lineid == line)
            return i;

    }

}


function agrSearch(custId, agrType) {

    var results = [];
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'anyof', custId)
    filters[1] = new nlobjSearchFilter('custrecord_agr_type', null, 'anyof', agrType)
    filters[2] = new nlobjSearchFilter('custrecord_agr_status', null, 'anyof', '1')//פעיל
    var search = nlapiCreateSearch('customrecord_agreement', filters, columns);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    //nlapiLogExecution('debug', 's', JSON.stringify(s));
    if (s != null) {
        for (var i = 0; i < s.length; i++) {

            return s[i].id;
        }
        //return results;
    }
}

function getNextdate(trandate) {
    var d = nlapiStringToDate(trandate)
    d.setHours(d.getHours() + 10)
    var month = '' + (d.getMonth() + 2),
        day = '' + d.getDate(),
        year = d.getFullYear();



    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var formatdate = ['01', month, year].join('/')
    return formatdate;
}
*/