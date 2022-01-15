var serialList = [];

function suitelet_print(request, response) {

    var Recid = request.getParameter('Recid');
    var Rectype = request.getParameter('Rectype');
    var ButtonType = request.getParameter('ButtonType');

    var record = nlapiLoadRecord(Rectype, Recid);
    if (Rectype == 'itemfulfillment') {
        if (record.getFieldValue('ordertype') == 'SalesOrd' && ButtonType == 'ci') {
            nlapiLogExecution('debug', 'from so ci', 'from so ci');
            var renderer = nlapiCreateTemplateRenderer();
            var template = nlapiLoadFile(6593);   // sand box
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'printSoCI.pdf', 'inline');
            response.write(pdf.getValue());
        }
        else if (record.getFieldValue('ordertype') == 'TrnfrOrd' && ButtonType == 'ci') {
            nlapiLogExecution('debug', 'from tro ci', 'from tro ci');

            var renderer = nlapiCreateTemplateRenderer();
            var template = nlapiLoadFile(6594);   // sand box
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'printTroCI.pdf', 'inline');
            response.write(pdf.getValue());
        }
        else if (record.getFieldValue('ordertype') == 'SalesOrd' && ButtonType == 'pl') { //print sales order item fulfillment
            nlapiLogExecution('debug', 'from so pl', 'from so pl');
            var renderer = nlapiCreateTemplateRenderer();
            var template = nlapiLoadFile(6580);   // sand box
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            var shipStatus = record.getFieldValue('shipstatus');
            var shipStatusDisplay = '';
            if (shipStatus == 'C') {
                var shipStatusDisplay = 'draft';
            }

            var itemCount = record.getLineItemCount('item');
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    var seriel_string = create_serial_detail_information(record, i);
                    nlapiLogExecution('debug', 'serial_string', JSON.stringify(seriel_string));
                    var res = buildSerialsResult(seriel_string);
                    nlapiLogExecution('debug', 'res', res);

                    xml = xml.replace('/serial_string ' + i + '/', res);
                }
            }

            xml = xml.replace('/shipStatus/', shipStatusDisplay)

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'print.pdf', 'inline');
            response.write(pdf.getValue());
        }
        else if (record.getFieldValue('ordertype') == 'TrnfrOrd' && ButtonType == 'pl') { //print transfer order item fulfillment
            nlapiLogExecution('debug', 'from tro pl', 'from tro pl');

            var renderer = nlapiCreateTemplateRenderer();
            var template = nlapiLoadFile(6590);   // sand box
            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            var toSubsidiaryInfo = getToSubsidiaryInfo(record);

            var shipStatus = record.getFieldValue('shipstatus');
            var shipStatusDisplay = '';
            if (shipStatus == 'C') {
                var shipStatusDisplay = 'draft';
            }

            var itemCount = record.getLineItemCount('item');
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    var seriel_string = create_serial_detail_information(record, i);
                    nlapiLogExecution('debug', 'serial_string', JSON.stringify(seriel_string));
                    var res = buildSerialsResult(seriel_string);
                    nlapiLogExecution('debug', 'res', res);

                    xml = xml.replace('/serial_string ' + i + '/', res);
                }
            }

            xml = xml.replace('/toSubsidiaryInfo/', toSubsidiaryInfo);
            xml = xml.replace('/shipStatus/', shipStatusDisplay);

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'print.pdf', 'inline');
            response.write(pdf.getValue());
        }
    }
    else if (Rectype == 'purchaseorder') {
        nlapiLogExecution('debug', 'from po', 'from po');

        var renderer = nlapiCreateTemplateRenderer();
        var template = nlapiLoadFile(6579);   // prod
        renderer.setTemplate(template.getValue());
        renderer.addRecord('record', record);
        var xml = renderer.renderToString();
        var approval_log_data = approval_log(Recid);
        var ApprovedBy = ''
        var ApprovedDate = ''
        if (approval_log_data.length > 0) {
            ApprovedBy = approval_log_data[0].ApprovedBy;
            ApprovedBy = ApprovedBy.substring(ApprovedBy.indexOf(' ') + 1, ApprovedBy.length);
            ApprovedDate = approval_log_data[0].ApprovedDate
            ApprovedDate = ApprovedDate.substring(0, ApprovedDate.indexOf(' '));
        }
        xml = xml.replace('/ApprovedBy/', ApprovedBy)
        xml = xml.replace('/ApprovedDate/', ApprovedDate)
        var pdf = nlapiXMLToPDF(xml);
        response.setContentType('PDF', 'print.pdf', 'inline');
        response.write(pdf.getValue());
    }
}


function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function approval_log(Recid) {


    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_approved_or_rejected_by');
    columns[1] = new nlobjSearchColumn('custrecord_end_date');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_transaction', null, 'is', Recid)

    var search = nlapiCreateSearch('customrecord_transactions_approval_log', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length > 0) {
        results.push({
            id: s[s.length - 1].id,
            ApprovedBy: s[s.length - 1].getText('custrecord_approved_or_rejected_by'),
            ApprovedDate: s[s.length - 1].getValue('custrecord_end_date'),
        });
    }

    return results;
}

function getToSubsidiaryInfo(record) {
    var troRecId = record.getFieldValue('createdfrom');
    var troRec = nlapiLoadRecord('transferorder', troRecId);
    var toSubsidiaryId = troRec.getFieldValue('tosubsidiary');
    var tosubsidiaryRec = nlapiLoadRecord('subsidiary', toSubsidiaryId);
    var toSubsidiaryInfo = tosubsidiaryRec.getFieldValue('custrecord_fulfillment_info');

    if (isNullOrEmpty(toSubsidiaryInfo)) {
        toSubsidiaryInfo = '';
    }
    return toSubsidiaryInfo;
}

function buildSerialsResult(seriel_string) {
    var res = '';
    for (var i = 0; i < seriel_string.length; i++) {
        res += seriel_string[i].serial + ', ';
    }
    return res.slice(0, -2);
}

function create_serial_detail_information(rec, index) {
    try {
        var serials = [];
        var results = [];

        subrecord = "";
        subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', index);
        if (subrecord != "" && subrecord != null) {
            nlapiLogExecution('debug', ' subrecord', subrecord.id);
            var invDetailID = subrecord.id;
            if (invDetailID != "" && invDetailID != null) {
                var serials = getInventoryDetails(invDetailID)
                nlapiLogExecution('debug', 'serials', JSON.stringify(serials));

                for (var i = 0; i < serials.length; i++) {
                    results.push({
                        serial: serials[i].serialNum
                    })
                }
            }
        }
        else {
            results.push({
                serial: '',
            })
        }
    } catch (e) {
        nlapiLogExecution('debug', 'create_serial_detail_information  error', e);
    }
    nlapiLogExecution('debug', 'results', JSON.stringify(results));

    return results;
}

function getInventoryDetails(invDetailID) {
    nlapiLogExecution('debug', 'getInventoryDetails1()', 'run');

    var serials = [];
    //hunt for related inventory detail records
    filters = [];
    columns = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));

    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];

    if (results != null) {
        results.forEach(function (line) {

            serials.push({
                serialNum: line.getValue('inventorynumber', 'inventorynumber')

            });
        });
        nlapiLogExecution('debug', 'serials.push', JSON.stringify(serials));

    }
    return serials;
}


