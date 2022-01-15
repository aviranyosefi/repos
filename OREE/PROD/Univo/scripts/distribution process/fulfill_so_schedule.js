var context = nlapiGetContext();
var employeeId = context.user;
var compArr = context.getSetting('SCRIPT', 'custscript_fileid');
var errArr = new Array();
var sList = new Array();

function so_to_fulfilment() {
    try {
        nlapiLogExecution('DEBUG', 'so_to_fulfilment', 'compArr: ' + JSON.stringify(compArr));
        var so_list = sort(compArr);

        for (y = 0; y < so_list.length; y++) {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }
            try {
                var ff = nlapiTransformRecord('salesorder', so_list[y].sales_order, 'itemfulfillment', { inventorylocation: so_list[y].inv_loc });
                nlapiLogExecution('DEBUG', 'ff:' + ff, 'so ID: ' + so_list[y].sales_order);
                var so_rec = nlapiLoadRecord('salesorder', so_list[y].sales_order);
                var so_item_count = so_rec.getLineItemCount('item');
                ff.setFieldValue('shipstatus', 'A');
                var item_count = ff.getLineItemCount('item');
                var lines = so_list[y].lines.split(',')
                for (z = 0; z < lines.length; z++) {
                    if (lines[z] != '') {
                        
                        for (x = 1; x <= item_count; x++) {
                            var so_line = 0;
                            if (lines[z] == ff.getLineItemValue('item', 'orderline', x)) {
                                nlapiLogExecution('debug', 'lines[z]', lines[z]);
                                for (m = 1; m <= so_item_count; m++) {
                                    if (lines[z] == so_rec.getLineItemValue('item', 'line', m)) {
                                        subrecord = so_rec.viewLineItemSubrecord('item', 'inventorydetail', m);
                                        if (subrecord != "" && subrecord != null) {
                                            nlapiLogExecution('debug', ' subrecord', subrecord.id);
                                            var invId = subrecord.id;
                                        }
                                        //var invId = so_rec.getLineItemValue('item', 'inventorydetail', );
                                        if (!isNullOrEmpty(invId)) {
                                            var qty = getInventoryDetails(invId);
                                            if (!isNullOrEmpty(qty)) {
                                                ff.setLineItemValue('item', 'quantity', x, qty);
                                                nlapiLogExecution('DEBUG', 'So:' + so_list[y].sales_order + 'line: ' + m, 'qty: ' + qty);
                                            }
                                        }
                                        ff.setLineItemValue('item', 'itemreceive', x, 'T');
                                        break;
                                    } 
                                }
                                
                            }
                        }
                    }
                }

                var submition = nlapiSubmitRecord(ff, null, true);
                if (submition != -1) {
                    sList.push({
                        so_id: so_list[y].sales_order,
                        lines: so_list[y].lines,
                        so_tranid: so_list[y].tranid,
                        status: 'succeed',
                        ff_id: submition,
                        ff_tranid: nlapiLookupField('itemfulfillment', submition, 'tranid')
                    })
                }
            }
            catch (e) {
                errArr.push({
                    so_id: so_list[y].sales_order,
                    line: so_list[y].lines,
                    so_tranid: so_list[y].tranid,
                    status: 'Failed',
                    error: e,
                })
                nlapiLogExecution('ERROR', 'error  - sales order id:' + so_list[y].salesOrderId + ' ', e);
                continue;
            }
        }
        nlapiLogExecution('DEBUG', 'before send mail', '');
        summaryEmail(employeeId);
    } catch (e) {
        nlapiSendEmail(employeeId, employeeId, 'Transform Sales Orders to Fuilfillments summary' , 'An error occurred while trying to fulfill sales orders \n Error description: ' + e);
    }
}

function sort(So_to_Fulfillment) {
    So_to_Fulfillment = JSON.parse(So_to_Fulfillment);
    So_to_Fulfillment.sort(function (a, b) {
        return a.salesOrderId - b.salesOrderId;
    });

    var count = 0;
    var curr_so;
    var curr_tranId;
    var curr_location;
    var array = '';
    var So_to_fulfill_sorted = [];

    for (var i = 0; i < So_to_Fulfillment.length; i++) {

        if (i == 0) {
            count += 1;
            array += So_to_Fulfillment[i].lineId;
        }
        else if (curr_so == So_to_Fulfillment[i].salesOrderId) {
            count += 1;
            array += ',' + So_to_Fulfillment[i].lineId;
        }
        else {
            So_to_fulfill_sorted.push({
                sales_order: curr_so,
                countt: count,
                tranid: curr_tranId,
                inv_loc: curr_location,
                lines: array,

            });
            array = So_to_Fulfillment[i].lineId;
            count = 1;
        }

        curr_so = So_to_Fulfillment[i].salesOrderId;
        curr_tranId = So_to_Fulfillment[i].tranid;
        curr_location = So_to_Fulfillment[i].inv_Location;

    }
    So_to_fulfill_sorted.push({
        sales_order: curr_so,
        countt: count,
        tranid: curr_tranId,
        inv_loc: curr_location,
        lines: array,
    });

    nlapiLogExecution('DEBUG', 'Be_To_Invoice_Sort', JSON.stringify(So_to_fulfill_sorted));

    return So_to_fulfill_sorted;

}

function summaryEmail(employeeId) {
    nlapiLogExecution('DEBUG', 'inside send mail', '');
    try {
        var date = new Date();
        var subject = "Transform Sales Orders to Fuilfillments summary ";
        var body = '<html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'td {' +
            'padding: 5px;' +
            'text-align: left;' +
            '}' +
            'th {' +
            'padding: 5px;' +
            'text-align: center;' +
            'background-color: #edeaea;' +
            'font-weight: bold ;' +
            '}' +
            '</style>' +
            '</head>' +
            "<div><p style= \'font-weight: bold ;font-size:110%; \'> Time stamp : " + date + "</p><br><br>" +
            "<p style='color:black; font-size:100%;'>The process of fulfilling the selected Sales orders, has been completed. </p> " +
            "<p style='color: black; font-size:10%;'>Here is a summary of the results:</p></div>";

        var successTbl = '<p style= \'font-weight: bold ;color: green; font-size:140%; \'>Total: ' + sList.length + ' succeeded</p><br>';
        if (sList != null && sList != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr><th>SO Id + name </th><th>FF Id </th><th>FF TranId </th><tr>"; //<th>Lines</th>
            var i = 0;
            for (v in sList) {
                successTbl += "<tr><td>" + sList[v].so_id + ' - ' + sList[v].so_tranid + "</td>";
                /*successTbl += "<td>";
                var lines = sList[v].lines.split(',')
                for (z = 0; z < lines.length; z++) {
                    successTbl += lines[z] + ', ';
                }
                successTbl += "</td>";*/
                successTbl += "<td>" + sList[v].ff_id + "</td>"
                successTbl += "<td>" + sList[v].ff_tranid + "</td>"
                successTbl += "</tr>";
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;color: red; font-size:140%; \'> Total: ' + errArr.length + ' failed</p><br>';
        if (errArr != null && errArr != '') {
            failTbl += "<table style = \"width: 100 %;\" >";
            // for th
            failTbl += "<tr><th>Id </th><th>Description</th><tr>";
            for (s in errArr) {
                failTbl += "<tr><td>" + errArr[s].so_id + ' - ' + errArr[s].so_tranid + "</td> <td>" + errArr[s].error + "</td></tr> "
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(employeeId, employeeId, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
} 

function getInventoryDetails(invDetailID) {
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));
    columns.push(new nlobjSearchColumn('quantity'));

    var search = nlapiCreateSearch('inventorydetail', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        //var cols = resultslice.getColumns();
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        var totQty = 0;
        for (var i = 0; i < returnSearchResults.length; i++) {
            var inventname = returnSearchResults[i].getValue('inventorynumber', 'inventorynumber');
            var qty = parseInt(returnSearchResults[i].getValue('quantity'));
            totQty += qty;
        }
    }
    return totQty;
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}