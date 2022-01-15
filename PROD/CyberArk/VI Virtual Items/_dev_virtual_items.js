// NCS.Server.Transaction.Forms.Admin.js -> helpers.populateCustomLineIds &&  helpers.splitMaintenanceItems -> line 610
// new custom record
//FREEZE

var itemsData = [], alredyExsistItems = [];
var keys;
var itemCount;
var virtual_item_to_process = [];
var id = nlapiGetRecordId();
var RecType = nlapiGetRecordType();
var rec = nlapiLoadRecord(RecType, id);
var createdfrom;
var country;
var mergeData = [];
var context = nlapiGetContext().getExecutionContext();
nlapiLogExecution('debug', 'context', context);
var checkCancelationSoLine =null;
if (RecType == 'returnauthorization' && context == 'webservices') {
     checkCancelationSoLine = checkCancelation(rec.getFieldValue('custbody_cbr_so_cancelation_reason'))
}

function afterSubmit(type) {
    if (type != 'delete') {
        nlapiLogExecution('debug', 'RecType:' + RecType, ' id:' + id);
        if (RecType == 'salesorder' || (RecType == 'returnauthorization' && isNullOrEmpty(rec.getFieldValue('createdfrom'))) || (context == 'webservices' && RecType == 'returnauthorization' && !isNullOrEmpty(rec.getFieldValue('createdfrom')) && checkCancelationSoLine == 'T')) {
            itemCount = rec.getLineItemCount('item');
            if (itemCount > 0) {
                country = rec.getLineItemValue('item', 'custcol_cseg_cbr_countries', 1);
                for (var i = 1; i <= itemCount; i++) {
                    rec.setLineItemValue('item', 'custcol_cbr_custom_line_id', i, i.toString())
                    var is_virtual_item = rec.getLineItemValue('item', 'custcol_is_virtual_item', i);
                    if (is_virtual_item == 'T') {
                        var item = rec.getLineItemValue('item', 'item', i);
                        alredyExsistItems[item] = {
                            item: item,
                            from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', i),
                            to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', i),
                            line: i,
                        };
                    }
                    else {
                        virtual_item_to_process.push(i);
                    }
                }
            }
            nlapiLogExecution('debug', 'virtual_item_to_process.length: ' + virtual_item_to_process.length, JSON.stringify(virtual_item_to_process));
            if (virtual_item_to_process.length > 0) {
                for (var i = 0; i < virtual_item_to_process.length; i++) {
                    var item = rec.getLineItemValue('item', 'item', virtual_item_to_process[i]);
                    var virtualItemsPerItem = virtualItemsSearch(item, 'T');
                    if (virtualItemsPerItem.length > 0) {
                        itemValidation(virtualItemsPerItem, virtual_item_to_process[i], item);
                    }
                    else {
                        var item_category = rec.getLineItemValue('item', 'custcol_cbr_trn_item_category', virtual_item_to_process[i]);
                        if (!isNullOrEmpty(item_category)) {
                            var virtualItemsPerItem = virtualItemsSearch(item_category, 'F');
                            if (virtualItemsPerItem.length > 0) {
                                itemValidation(virtualItemsPerItem, virtual_item_to_process[i], item);
                            }
                        }
                    }
                }
            }
            keys = Object.keys(itemsData);
            addItemsToSo();
        }
              
    } // if (type != 'delete') 		
}

function virtualItemsSearch(itemOrCategory, type) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_1st_virtual_item');
    columns[1] = new nlobjSearchColumn('custrecord2nd_virtual_item');
    columns[2] = new nlobjSearchColumn('custrecord_3st_virtual_item');
    columns[3] = new nlobjSearchColumn('custrecord_4th_virtual_item');
    columns[4] = new nlobjSearchColumn('custrecord_5th_virtual_item');
    columns[5] = new nlobjSearchColumn('custrecord_6th_virtual_item');
    columns[6] = new nlobjSearchColumn('custrecord_vi1_qty');
    columns[7] = new nlobjSearchColumn('custrecord_vi2_qty');
    columns[8] = new nlobjSearchColumn('custrecord_vi3_qty');
    columns[9] = new nlobjSearchColumn('custrecord_vi4_qty');
    columns[10] = new nlobjSearchColumn('custrecord_vi5_qty');
    columns[11] = new nlobjSearchColumn('custrecord_vi6_qty');
    columns[12] = new nlobjSearchColumn('custrecord_to_merge_vi1');
    columns[13] = new nlobjSearchColumn('custrecord_to_merge_vi2');
    columns[14] = new nlobjSearchColumn('custrecord_to_merge_vi3');
    columns[15] = new nlobjSearchColumn('custrecord_to_merge_vi4');
    columns[16] = new nlobjSearchColumn('custrecord_to_merge_vi5');
    columns[17] = new nlobjSearchColumn('custrecord_to_merge_vi6');
    columns[18] = new nlobjSearchColumn('custrecord_qty_calculated_by_period');
    columns[19] = new nlobjSearchColumn('custrecord_7th_virtual_item');
    columns[20] = new nlobjSearchColumn('custrecord_8th_virtual_item');
    columns[21] = new nlobjSearchColumn('custrecord_9th_virtual_item');
    columns[22] = new nlobjSearchColumn('custrecord_vi7_qty');
    columns[23] = new nlobjSearchColumn('custrecord_vi8_qty');
    columns[24] = new nlobjSearchColumn('custrecord_vi9_qty');
    columns[25] = new nlobjSearchColumn('custrecord_to_merge_vi7');
    columns[26] = new nlobjSearchColumn('custrecord_to_merge_vi8');
    columns[27] = new nlobjSearchColumn('custrecord_to_merge_vi9');

    var filters = new Array();
    if (type == 'T') {
        filters[0] = new nlobjSearchFilter('custrecord_sf_item', null, 'anyof', itemOrCategory)
    }
    else {
        filters[0] = new nlobjSearchFilter('custrecord_sf_item_category', null, 'anyof', itemOrCategory)
    }

    var search = nlapiCreateSearch('customrecord_connect_virtual_items', filters, columns);
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var virtualItemsPerItem = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length > 0) {
        stItem = s[0].getValue('custrecord_1st_virtual_item');
        ndItem = s[0].getValue('custrecord2nd_virtual_item');
        rdItem = s[0].getValue('custrecord_3st_virtual_item');
        fourthItem = s[0].getValue('custrecord_4th_virtual_item');
        fifththItem = s[0].getValue('custrecord_5th_virtual_item');
        sixth6thItem = s[0].getValue('custrecord_6th_virtual_item');
        sev7thItem = s[0].getValue('custrecord_7th_virtual_item');
        eig8thItem = s[0].getValue('custrecord_8th_virtual_item');
        nin9thItem = s[0].getValue('custrecord_9th_virtual_item');
        if (stItem != "" || ndItem != "" || rdItem != "" || fourthItem != "" || fifththItem != "" || sixth6thItem != ""
            || sev7thItem != "" || eig8thItem != "" || nin9thItem != "") {
            virtualItemsPerItem.push({

                st: stItem,
                nd: ndItem,
                rd: rdItem,
                fourth: fourthItem,
                fifth: fifththItem,
                sixth: sixth6thItem,
                sev: sev7thItem,
                eig: eig8thItem,
                nin: nin9thItem,
                st_qty: s[0].getValue('custrecord_vi1_qty'),
                nd_qty: s[0].getValue('custrecord_vi2_qty'),
                rd_qty: s[0].getValue('custrecord_vi3_qty'),
                fourth_qty: s[0].getValue('custrecord_vi4_qty'),
                fifth_qty: s[0].getValue('custrecord_vi5_qty'),
                sixth_qty: s[0].getValue('custrecord_vi6_qty'),
                sev_qty: s[0].getValue('custrecord_vi7_qty'),
                eig_qty: s[0].getValue('custrecord_vi8_qty'),
                nin_qty: s[0].getValue('custrecord_vi9_qty'),
                st_merge: s[0].getValue('custrecord_to_merge_vi1'),
                nd_merge: s[0].getValue('custrecord_to_merge_vi2'),
                rd_merge: s[0].getValue('custrecord_to_merge_vi3'),
                fourth_merge: s[0].getValue('custrecord_to_merge_vi4'),
                fifth_merge: s[0].getValue('custrecord_to_merge_vi5'),
                sixth_merge: s[0].getValue('custrecord_to_merge_vi6'),
                sev_merge: s[0].getValue('custrecord_to_merge_vi7'),
                eig_merge: s[0].getValue('custrecord_to_merge_vi8'),
                nin_merge: s[0].getValue('custrecord_to_merge_vi9'),
                qty_type: s[0].getValue('custrecord_qty_calculated_by_period'),
            });
        }

    }
    return virtualItemsPerItem;
}

function itemValidation(virtualItemsPerItem, line, item) {

    var item_from_date = rec.getLineItemValue('item', 'custcol_cbr_start_date', line); // item
    var item_to_date = rec.getLineItemValue('item', 'custcol_cbr_end_date', line);	// item		

    if (((itemsData[virtualItemsPerItem[0].st] == null || itemsData[virtualItemsPerItem[0].st] == undefined) && virtualItemsPerItem[0].st != "" && (alredyExsistItems[virtualItemsPerItem[0].st] == null || alredyExsistItems[virtualItemsPerItem[0].st] == undefined)) || (virtualItemsPerItem[0].st_merge == 'F' && virtualItemsPerItem[0].st != "")) {
        if (virtualItemsPerItem[0].st_merge == 'F' && virtualItemsPerItem[0].st != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].st,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'st', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].st] = {
                item: virtualItemsPerItem[0].st,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'st', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            };

        }

    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].st] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].st].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].st].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].st].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].st].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].st].to_date = item_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].st].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].st != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].st].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].st].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].st].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].st].to_date = item_to_date;
            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].nd] == null || itemsData[virtualItemsPerItem[0].nd] == undefined) && virtualItemsPerItem[0].nd != "" && (alredyExsistItems[virtualItemsPerItem[0].nd] == null || alredyExsistItems[virtualItemsPerItem[0].nd] == undefined)) || (virtualItemsPerItem[0].nd_merge == 'F' && virtualItemsPerItem[0].nd != "")) {
        if (virtualItemsPerItem[0].nd_merge == 'F'  && virtualItemsPerItem[0].nd != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].nd,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'nd', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].nd] = {
                item: virtualItemsPerItem[0].nd,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'nd', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }
    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].nd] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].nd].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].nd].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].nd].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].nd].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].nd].to_date = item_to_date
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].nd].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].nd != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].nd].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].nd].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].nd].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].nd].to_date = item_to_date;
            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].rd] == null || itemsData[virtualItemsPerItem[0].rd] == undefined) && virtualItemsPerItem[0].rd != "" && (alredyExsistItems[virtualItemsPerItem[0].rd] == null || alredyExsistItems[virtualItemsPerItem[0].rd] == undefined)) || (virtualItemsPerItem[0].rd_merge == 'F' && virtualItemsPerItem[0].rd != "")) {
        if (virtualItemsPerItem[0].rd_merge == 'F' && virtualItemsPerItem[0].rd != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].rd,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'rd', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].rd] = {
                item: virtualItemsPerItem[0].rd,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'rd', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }
    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].rd] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].rd].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].rd].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].rd].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].rd].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].rd].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].rd].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].rd != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].rd].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].rd].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].rd].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].rd].to_date = item_to_date;

            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].fourth] == null || itemsData[virtualItemsPerItem[0].fourth] == undefined) && virtualItemsPerItem[0].fourth != "" && (alredyExsistItems[virtualItemsPerItem[0].fourth] == null || alredyExsistItems[virtualItemsPerItem[0].fourth] == undefined)) || (virtualItemsPerItem[0].fourth_merge == 'F' && virtualItemsPerItem[0].fourth != "")) {
        if (virtualItemsPerItem[0].fourth_merge == 'F' && virtualItemsPerItem[0].fourth != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].fourth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'fourth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].fourth] = {
                item: virtualItemsPerItem[0].fourth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'fourth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }
    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].fourth] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].fourth].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].fourth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].fourth].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].fourth].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].fourth].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].fourth].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].fourth != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].fourth].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].fourth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].fourth].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].fourth].to_date = item_to_date;

            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].fifth] == null || itemsData[virtualItemsPerItem[0].fifth] == undefined) && virtualItemsPerItem[0].fifth != "" && (alredyExsistItems[virtualItemsPerItem[0].fifth] == null || alredyExsistItems[virtualItemsPerItem[0].fifth] == undefined)) || (virtualItemsPerItem[0].fifth_merge == 'F' && virtualItemsPerItem[0].fifth != "")) {
        if (virtualItemsPerItem[0].fifth_merge == 'F' && virtualItemsPerItem[0].fifth != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].fifth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'fifth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].fifth] = {
                item: virtualItemsPerItem[0].fifth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'fifth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }

    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].fifth] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].fifth].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].fifth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].fifth].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].fifth].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].fifth].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].fifth].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].fifth != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].fifth].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].fifth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].fifth].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].fifth].to_date = item_to_date;

            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].sixth] == null || itemsData[virtualItemsPerItem[0].sixth] == undefined) && virtualItemsPerItem[0].sixth != "" && (alredyExsistItems[virtualItemsPerItem[0].sixth] == null || alredyExsistItems[virtualItemsPerItem[0].sixth] == undefined)) || (virtualItemsPerItem[0].sixth_merge == 'F' && virtualItemsPerItem[0].sixth != "")) {
        if (virtualItemsPerItem[0].sixth_merge == 'F' && virtualItemsPerItem[0].sixth != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].sixth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'sixth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].sixth] = {
                item: virtualItemsPerItem[0].sixth,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'sixth', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }

    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].sixth] != undefined) {

            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].sixth].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].sixth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].sixth].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].sixth].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].sixth].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].sixth].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].sixth != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].sixth].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].sixth].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].sixth].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].sixth].to_date = item_to_date;

            }
        }
    }

    // 10.03.21

    if (((itemsData[virtualItemsPerItem[0].sev] == null || itemsData[virtualItemsPerItem[0].sev] == undefined) && virtualItemsPerItem[0].sev != "" && (alredyExsistItems[virtualItemsPerItem[0].sev] == null || alredyExsistItems[virtualItemsPerItem[0].sev] == undefined)) || (virtualItemsPerItem[0].sev_merge == 'F' && virtualItemsPerItem[0].sev != "")) {
        if (virtualItemsPerItem[0].sev_merge == 'F' && virtualItemsPerItem[0].sev != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].sev,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'sev', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].sev] = {
                item: virtualItemsPerItem[0].sev,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'sev', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }
    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].sev] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].sev].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].sev].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].sev].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].sev].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].sev].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].sev].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].sev != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].sev].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].sev].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].sev].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].sev].to_date = item_to_date;

            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].eig] == null || itemsData[virtualItemsPerItem[0].eig] == undefined) && virtualItemsPerItem[0].eig != "" && (alredyExsistItems[virtualItemsPerItem[0].eig] == null || alredyExsistItems[virtualItemsPerItem[0].eig] == undefined)) || (virtualItemsPerItem[0].eig_merge == 'F' && virtualItemsPerItem[0].eig != "")) {
        if (virtualItemsPerItem[0].eig_merge == 'F' && virtualItemsPerItem[0].eig != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].eig,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'eig', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].eig] = {
                item: virtualItemsPerItem[0].eig,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'eig', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }

    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].eig] != undefined) {


            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].eig].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].eig].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].eig].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].eig].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].eig].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].eig].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].eig != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].eig].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].eig].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].eig].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].eig].to_date = item_to_date;

            }
        }
    }

    if (((itemsData[virtualItemsPerItem[0].nin] == null || itemsData[virtualItemsPerItem[0].nin] == undefined) && virtualItemsPerItem[0].nin != "" && (alredyExsistItems[virtualItemsPerItem[0].nin] == null || alredyExsistItems[virtualItemsPerItem[0].nin] == undefined)) || (virtualItemsPerItem[0].nin_merge == 'F' && virtualItemsPerItem[0].nin != "")) {
        if (virtualItemsPerItem[0].nin_merge == 'F' && virtualItemsPerItem[0].nin != "") {
            mergeData.push({
                item: virtualItemsPerItem[0].nin,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'nin', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),
            })
        }
        else {
            itemsData[virtualItemsPerItem[0].nin] = {
                item: virtualItemsPerItem[0].nin,
                from_date: rec.getLineItemValue('item', 'custcol_cbr_start_date', line),
                to_date: rec.getLineItemValue('item', 'custcol_cbr_end_date', line),
                line: line,
                ParentItem: item,
                qty: getQty(virtualItemsPerItem, 'nin', line),
                price_list_region: rec.getLineItemValue('item', 'custcol_cbr_price_list_region', line),
                sf_so_lineid: rec.getLineItemValue('item', 'custcol_sf_so_lineid', line),

            };
        }

    }
    else {

        if (alredyExsistItems[virtualItemsPerItem[0].nin] != undefined) {

            var curr_from_date = alredyExsistItems[virtualItemsPerItem[0].nin].from_date;
            var curr_to_date = alredyExsistItems[virtualItemsPerItem[0].nin].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                alredyExsistItems[virtualItemsPerItem[0].nin].from_date = item_from_date;
                rec.setLineItemValue('item', 'custcol_cbr_start_date', alredyExsistItems[virtualItemsPerItem[0].nin].line, nlapiStringToDate(item_from_date));
            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                alredyExsistItems[virtualItemsPerItem[0].nin].to_date = curr_to_date;
                rec.setLineItemValue('item', 'custcol_cbr_end_date', alredyExsistItems[virtualItemsPerItem[0].nin].line, nlapiStringToDate(item_to_date));
            }
        }
        else if (virtualItemsPerItem[0].nin != "") {

            var curr_from_date = itemsData[virtualItemsPerItem[0].nin].from_date;
            var curr_to_date = itemsData[virtualItemsPerItem[0].nin].to_date;

            if (!checkWhoBigger(item_from_date, curr_from_date)) {
                itemsData[virtualItemsPerItem[0].nin].from_date = item_from_date;

            }
            if (checkWhoBigger(item_to_date, curr_to_date)) {
                itemsData[virtualItemsPerItem[0].nin].to_date = item_to_date;

            }
        }
    }

    //

}

function addItemsToSo() {

    try {
        var soRec = null;
        nlapiLogExecution('DEBUG', 'RecType', RecType);
        if (RecType == 'returnauthorization' && context == 'webservices'  && checkCancelationSoLine == 'T') {
            createdfrom = rec.getFieldValue('createdfrom');
            if (!isNullOrEmpty(createdfrom)) {
                soRec = nlapiLoadRecord('salesorder', createdfrom);
                var SoItemCount = soRec.getLineItemCount('item');
            }
        }
        nlapiLogExecution('DEBUG', 'JSON.stringify(itemsData)' + keys.length, JSON.stringify(itemsData));
        for (var i = 0; i < keys.length; i++) {
            try {               
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', keys[i])
                rec.setCurrentLineItemValue('item', 'quantity', itemsData[keys[i]].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0.00')
                rec.setCurrentLineItemValue('item', 'amount', '0.00');
                rec.setCurrentLineItemValue('item', 'custcol_cbr_start_date', itemsData[keys[i]].from_date);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_end_date', itemsData[keys[i]].to_date);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_period', getMonthDiff_fractional(nlapiStringToDate(itemsData[keys[i]].from_date), nlapiStringToDate(itemsData[keys[i]].to_date)));
                var line = parseInt(parseInt(itemCount) + parseInt(i) + 1);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_custom_line_id', line.toString());
                rec.setCurrentLineItemValue('item', 'custcol_cbr_split_from_custom_line_id', itemsData[keys[i]].line.toString());
                rec.setCurrentLineItemValue('item', 'location', getRegionLocation(country));
                rec.setCurrentLineItemValue('item', 'custcol_vi_parent_item', itemsData[keys[i]].ParentItem);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_price_list_region', itemsData[keys[i]].price_list_region); 
                //rec.setCurrentLineItemValue('item', 'custcol_sf_so_lineid', itemsData[keys[i]].sf_so_lineid); 
                rec.commitLineItem('item');

                if (RecType == 'returnauthorization' && context == 'webservices' && soRec != null) {
                    for (var m = 1; m <= SoItemCount; m++) {

                        if (keys[i] == soRec.getLineItemValue('item', 'item', m)) {
                            //nlapiLogExecution('DEBUG', 'equal ', m);
                            soRec.setLineItemValue('item', 'custcol_cbr_so_rma_qty_returned', m, 1);
                            soRec.setLineItemValue('item', 'custcol_cbr_so_rma', m, id);
                        }
                    }

                    soRec.selectNewLineItem('item');
                    soRec.setCurrentLineItemValue('item', 'item', keys[i])
                    soRec.setCurrentLineItemValue('item', 'quantity', 1)
                    soRec.setCurrentLineItemValue('item', 'rate', '0.00')
                    soRec.setCurrentLineItemValue('item', 'amount', '0.00');
                    soRec.setCurrentLineItemValue('item', 'custcol_cbr_start_date', itemsData[keys[i]].from_date);
                    soRec.setCurrentLineItemValue('item', 'custcol_cbr_end_date', itemsData[keys[i]].to_date);
                    soRec.setCurrentLineItemValue('item', 'custcol_cbr_period', getMonthDiff_fractional(nlapiStringToDate(itemsData[keys[i]].from_date), nlapiStringToDate(itemsData[keys[i]].to_date)));
                    var line = parseInt(parseInt(SoItemCount) + keys.length + i);
                    soRec.setCurrentLineItemValue('item', 'custcol_cbr_custom_line_id', line.toString());
                    soRec.setCurrentLineItemValue('item', 'custcol_cbr_split_from_custom_line_id', itemsData[keys[i]].line.toString());
                    soRec.setCurrentLineItemValue('item', 'location', getRegionLocation(country));
                    rec.setCurrentLineItemValue('item', 'custcol_vi_parent_item', itemsData[keys[i]].ParentItem);
                    rec.setCurrentLineItemValue('item', 'custcol_cbr_price_list_region', itemsData[keys[i]].price_list_region);
                    //rec.setCurrentLineItemValue('item', 'custcol_sf_so_lineid', itemsData[keys[i]].sf_so_lineid); 
                    soRec.commitLineItem('item');
                }
            } catch (err) {
                nlapiLogExecution('DEBUG', 'error in add item ', err);
            }
        }
        nlapiLogExecution('DEBUG', 'JSON.stringify(mergeData)' + mergeData.length, JSON.stringify(mergeData));
        for (var k = 0; k < mergeData.length; k++) {
            try {
                rec.selectNewLineItem('item');
                rec.setCurrentLineItemValue('item', 'item', mergeData[k].item)
                rec.setCurrentLineItemValue('item', 'quantity', mergeData[k].qty)
                rec.setCurrentLineItemValue('item', 'rate', '0.00')
                rec.setCurrentLineItemValue('item', 'amount', '0.00');
                rec.setCurrentLineItemValue('item', 'custcol_cbr_start_date', mergeData[k].from_date);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_end_date', mergeData[k].to_date);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_period', getMonthDiff_fractional(nlapiStringToDate(mergeData[k].from_date), nlapiStringToDate(mergeData[k].to_date)));
                var line = parseInt(parseInt(itemCount) + k + keys.length) + 1;
                rec.setCurrentLineItemValue('item', 'custcol_cbr_custom_line_id', line.toString());
                rec.setCurrentLineItemValue('item', 'custcol_cbr_split_from_custom_line_id', mergeData[k].line.toString());
                rec.setCurrentLineItemValue('item', 'location', getRegionLocation(country));
                rec.setCurrentLineItemValue('item', 'custcol_vi_parent_item', mergeData[k].ParentItem);
                rec.setCurrentLineItemValue('item', 'custcol_cbr_price_list_region', mergeData[k].price_list_region);
                //rec.setCurrentLineItemValue('item', 'custcol_sf_so_lineid', mergeData[k].sf_so_lineid); 
                rec.commitLineItem('item');
            } catch (e) {
                nlapiLogExecution('DEBUG', 'error in add mergeData item ', e);
            }

        }
        
        if (RecType == 'returnauthorization' && soRec != null) {
            nlapiSubmitRecord(soRec);
        }
              
        nlapiSubmitRecord(rec);
    } catch (e) {
        nlapiLogExecution('DEBUG', 'error', e);
    }
}

function checkWhoBigger(item_from_date, curr_from_date) {

    return Date.parse(item_from_date) > Date.parse(curr_from_date)
}

function getMonthDiff_fractional(startDate, d) {
    //nlapiLogExecution('debug', 'startDate: ' + startDate, 'endDate: ' +d);  
    var fDate = null;
    var tDate = null;
    var thisRoundDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    var dRoundDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var startDateEndDayOffset = thisRoundDate.numberOfDaysInCurrentMonth() - thisRoundDate.getDate();

    if (thisRoundDate == dRoundDate) {
        return 0;
    } else if (thisRoundDate.getTime() < dRoundDate.getTime()) {
        fDate = thisRoundDate;
        tDate = dRoundDate;
    } else {
        fDate = dRoundDate;
        tDate = thisRoundDate;
    }
    var isSkipped = false;
    var months = 0;
    while (!isSkipped) {
        if (fDate.lastDayOfCurrentMonth().getTime() >= tDate.getTime()) {
            var dayDiff = tDate.getDate() - fDate.getDate() + 1;
            var daysInMonth = fDate.numberOfDaysInCurrentMonth();
            var partial = dayDiff / daysInMonth;
            months += partial;
            isSkipped = true;
        } else {
            months += 1;
            var nextMonth = new Date(fDate.getFullYear(), fDate.getMonth() + 1, 1);
            var setDateValue = startDate.getDate() <= nextMonth.numberOfDaysInCurrentMonth() ? startDate.getDate() : nextMonth.numberOfDaysInCurrentMonth() - startDateEndDayOffset;
            if (setDateValue <= 0) {
                setDateValue = fDate.getDate();
            }
            nextMonth.setDate(setDateValue);
            fDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate());
        }
    }
    return Math.floor(months * 100) / 100;
}

Date.prototype.numberOfDaysInCurrentMonth = function () {
    return this.lastDayOfCurrentMonth().getDate();
};

Date.prototype.lastDayOfCurrentMonth = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0);
};

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getRegionLocation(country) {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_cbr_region');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_cbr_country', null, 'is', country)

    var search = nlapiCreateSearch('customrecord_cbr_countries', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        return returnSearchResults[0].getValue('custrecord_cbr_region')
    }
    return '';
}

function getQty(virtualItemsPerItem, type, line) {
    try {
        var qty = 1;
        if (isNullOrEmpty(virtualItemsPerItem[0][type + '_qty'])) { qty = 1; }
        else if (virtualItemsPerItem[0].qty_type == 'F') {
            qty = Number(virtualItemsPerItem[0][type + '_qty']) * Number(rec.getLineItemValue('item', 'quantity', line))
        }
        else {
            qty = Number(virtualItemsPerItem[0][type + '_qty']) * (Number(rec.getLineItemValue('item', 'custcol_cbr_period', line) / 12))
        }
        return Math.ceil(qty);
    } catch (e) {
        nlapiLogExecution('debug', 'getQty error: ', e);
        return 1;
    }
}

function checkCancelation(cancelationId) {
    try { 
        if (!isNullOrEmpty(cancelationId)) {
            var create_so_line = nlapiLookupField('customrecord_cbr_cancelation_reason', cancelationId, 'custrecord_cbr_cancelatio_create_so_line');
            return create_so_line         
        }
    } catch(e){
        return 'F'
    }
    return 'F'
}
