var context = nlapiGetContext();
var serialList = [];

function suitelet_print(request, response) {
    nlapiLogExecution('debug', 'suitelet_print', 'run');

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

            var toSubsidiaryInfo = getToSubsidiaryInfo(record);
            if (isNullOrEmpty(toSubsidiaryInfo)) {
                toSubsidiaryInfo = '';
            }

            xml = xml.replace('/toSubsidiaryInfo/', toSubsidiaryInfo.replace(/\n/ig, '<br />'));
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

            //var shipStatus = record.getFieldValue('shipstatus');
            //var shipStatusDisplay = '';
            //if (shipStatus == 'C') {
            //    var shipStatusDisplay = 'draft';
            //}

            var itemCount = record.getLineItemCount('item');
            var completeTable = [];
            //if (itemCount > 0) {
            //    for (var i = 1; i <= itemCount; i++) {
            //        var seriel_string = create_pl_table_information(record, i);
            //        var res = buildSerialsResult(seriel_string);
            //        xml = xml.replace('/serial_string ' + i + '/', res);
            //    }
            //}

            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    var lineTable = create_pl_line_table_information(record, i);
                    nlapiLogExecution('debug', 'lineTable' + i + ":", JSON.stringify(lineTable));

                    var pnTable = buildPnTable(lineTable);
                    nlapiLogExecution('debug', 'pnTable' + i, pnTable);
                    completeTable.push(pnTable);
                }
            }

            nlapiLogExecution('debug', 'completeTable', JSON.stringify(completeTable));

            xml = xml.replace('/ITEMSLINES/', completeTable);
            //xml = xml.replace('/shipStatus/', shipStatusDisplay)

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'print.pdf', 'inline');
            response.write(pdf.getValue());
        }
        else if (record.getFieldValue('ordertype') == 'TrnfrOrd' && ButtonType == 'pl') { //print transfer order item fulfillment
            nlapiLogExecution('debug', 'from tro pl', 'from tro pl');

            var renderer = nlapiCreateTemplateRenderer();
            var template = nlapiLoadFile(6590);   // sand box
            nlapiLogExecution('debug', 'template', 'template');

            renderer.setTemplate(template.getValue());
            renderer.addRecord('record', record);
            var xml = renderer.renderToString();

            var toSubsidiaryInfo = getToSubsidiaryInfo(record);
            if (isNullOrEmpty(toSubsidiaryInfo)) {
                toSubsidiaryInfo = '';
            }
            nlapiLogExecution('debug', 'toSubsidiaryInfo', toSubsidiaryInfo);

            //var shipStatus = record.getFieldValue('shipstatus');
            //var shipStatusDisplay = '';
            //if (shipStatus == 'C') {
            //    var shipStatusDisplay = 'draft';
            //}

            var itemCount = record.getLineItemCount('item');
            var completeTable = [];

            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {
                    var lineTable = create_pl_line_table_information(record, i);
                    nlapiLogExecution('debug', 'lineTable' + i, JSON.stringify(lineTable));

                    var pnTable = buildPnTable(lineTable);
                    nlapiLogExecution('debug', 'pnTable' + i, pnTable);

                    completeTable.push(pnTable);

                }
            }
            nlapiLogExecution('debug', 'completeTable', JSON.stringify(completeTable));

            xml = xml.replace('/ITEMSLINES/', completeTable);
            xml = xml.replace('/toSubsidiaryInfo/', toSubsidiaryInfo);
            //xml = xml.replace('/shipStatus/', shipStatusDisplay);

            var pdf = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'print.pdf', 'inline');
            response.write(pdf.getValue());
        }
    }
    else if (Rectype == 'purchaseorder') {
        nlapiLogExecution('debug', 'from po', 'from po');
        var xml = createPoTempalte(record, Recid)
        var pdf = nlapiXMLToPDF(xml);
        response.setContentType('PDF', 'print.pdf', 'inline');
        response.write(pdf.getValue());
    }
}

function create_pl_line_table_information(rec, i) {

    try {
        var results = [], serials = [];
        var subrecord = "";
        subrecord = rec.viewLineItemSubrecord('item', 'inventorydetail', i);

        if (subrecord != "" && subrecord != null) {
            nlapiLogExecution('debug', ' subrecord', subrecord.id);
            var invDetailID = subrecord.id;
            if (invDetailID != "" && invDetailID != null) {
                serials = getInventoryDetails(invDetailID);
                //if (!isNullOrEmpty(serials)) {
                //    results.push({ flag: false });
                //    nlapiLogExecution('debug', 'create_pl_line_table_information-serials:' + i, serials);
                //}
            }
        }

        var fcc = rec.getLineItemValue('item', 'custitem_fcc_id', i) ? rec.getLineItemValue('item', 'custitem_fcc_id', i) : "";
        var hsCode = rec.getLineItemValue('item', 'custcol_hs_code', i) ? rec.getLineItemValue('item', 'custcol_hs_code', i) : "";
        var coo = rec.getLineItemValue('item', 'custcol_coo', i) ? rec.getLineItemValue('item', 'custcol_coo', i) : "";
        var includeIon = rec.getLineItemValue('item', 'custcol_including_ion_batteries', i) ? rec.getLineItemValue('item', 'custcol_including_ion_batteries', i) : "";
        var udi = rec.getLineItemValue('item', 'custcol_udi_code_on_carton', i) ? rec.getLineItemValue('item', 'custcol_udi_code_on_carton', i) : "";
        var pallets = rec.getLineItemValue('item', 'custcol_package_detail', i) ? rec.getLineItemValue('item', 'custcol_package_detail', i) : "";
        var qtn = rec.getLineItemValue('item', 'quantity', i) ? rec.getLineItemValue('item', 'quantity', i) : "";
        var name = rec.getLineItemValue('item', 'itemname', i) ? rec.getLineItemValue('item', 'itemname', i) : "";
        var description = rec.getLineItemValue('item', 'description', i) ? rec.getLineItemValue('item', 'description', i) : "";

        results.push({
            fcc: fcc, hsCode: hsCode, coo: coo, includeIon: includeIon, udi: udi, pallets: pallets, qtn: qtn, name: name, description: description, inventorydetail: serials
        });


    } catch (e) {
        nlapiLogExecution('debug', 'create_pl_line_table_information error', e);
    }

    return results;
}

function getInventoryDetails(invDetailID) {

    var serials = [], filters = [], columns = [];

    filters.push(new nlobjSearchFilter('internalid', null, 'is', invDetailID));
    columns.push(new nlobjSearchColumn('inventorynumber', 'inventorynumber'));

    results = nlapiSearchRecord('inventorydetail', null, filters, columns) || [];

    if (results != null) {
        results.forEach(function (line) {
            serials.push(line.getValue('inventorynumber', 'inventorynumber'));
        });
        nlapiLogExecution('debug', 'getInventoryDetails-serials:', JSON.stringify(serials));

    }
    return serials;
}

function buildPnTable(lineTable) {

    var table = '';
    table += '<table class="linetb" style="width: 100%;"><tr><th colspan="10"><p style="width: 100%; text-align: center;">' + "PACKAGE" + '</p></th><th colspan="8"><p style="width: 100%; text-align: center;">' + "QUANTITY" + '</p></th><th colspan="20"><p style="width: 100%; text-align: center;">' + "DESCRIPTION" + '</p></th></tr>'
    var pnTable = '';
    pnTable += '<tr>'
    pnTable += '<td colspan="10"><p style="width: 100%; text-align: center; vertical-align: middle;">' + "FCC ID:" + lineTable[0].fcc + '</p>'
    pnTable += '<p style="width: 100%; text-align: center; vertical-align: middle;">' + "HS code:" + lineTable[0].hsCode + '</p>'
    pnTable += '<p style="width: 100%; text-align: center; vertical-align: middle;">' + "COO ID:" + lineTable[0].coo + '</p>'
    pnTable += '<p style="width: 100%; text-align: center; vertical-align: middle;">' + lineTable[0].includeIon + '</p>'
    pnTable += '<p style="width: 100%; text-align: center; vertical-align: middle;">' + "UDI on carton:" + lineTable[0].udi + '</p>'
    pnTable += '<p style="width: 100%; text-align: left; vertical-align: middle;">' + lineTable[0].pallets + '</p></td>'
    pnTable += '<td colspan="8"><p style = "width: 100%; text-align: center; vertical-align: middle;">' + lineTable[0].qtn + '</p></td>'
    pnTable += '<td colspan = "20" style = "vertical-align: left;"><p style="font-weight: bold ">' + "PN:" + lineTable[0].name + ", " + lineTable[0].description + '</p></td>'
    pnTable += '</tr>'
    table += pnTable + '</table>'

    if (lineTable[0].inventorydetail != '') {
        table += '<p style="display: table; text-align: left; table-layout: 100%; border: 1px solid; font-size: 10px"><strong>' + "S/N: " + '</strong>' + lineTable[0].inventorydetail.toString().replace(/,/gi, ", ") + '</p>'

    }

    return table;
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
            ApproverBy_ID: s[s.length - 1].getValue('custrecord_approved_or_rejected_by'),

        });
    }

    return results;
}

function getToSubsidiaryInfo(record) {
    var toSubsidiaryId = '', toSubsidiaryInfo = '';
    var troRecId = record.getFieldValue('createdfrom');
    nlapiLogExecution('debug', 'troRecId', troRecId);

    var troRec = nlapiLoadRecord('transferorder', troRecId);
    toSubsidiaryId = troRec.getFieldValue('tosubsidiary');
    if (!isNullOrEmpty(toSubsidiaryId)) {
        var tosubsidiaryRec = nlapiLoadRecord('subsidiary', toSubsidiaryId);
        var toSubsidiaryInfo = tosubsidiaryRec.getFieldValue('custrecord_fulfillment_info');
    }
    return toSubsidiaryInfo;
}

function buildSerialsResult(seriel_string) {
    var res = '', buetyRes = '';
    for (var i = 0; i < seriel_string.length; i++) {
        res += seriel_string[i].serial + ', ';
        nlapiLogExecution('debug', 'res:', res);

    }

    buetyRes = res.slice(0, -2);
    nlapiLogExecution('debug', 'buetyRes:', buetyRes);

    return buetyRes;

}



/////////////suitlet for email -po

function suitelet_email(request, response) {
    nlapiLogExecution('debug', 'suitelet_email', 'run');

    var Recid = request.getParameter('Recid');

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');

        var record = nlapiLoadRecord('purchaseorder', Recid);
        var form = nlapiCreateForm('Email Message');
        form.addSubmitButton('Submit');

        //vendor email
        var vendorEmailField = form.addField('custpage_vendor_email', 'text', 'Vendor Email', null, null);
        var vendorId = record.getFieldValue('entity');
        var getVendorMail = nlapiLookupField('vendor', vendorId, 'email');
        nlapiLogExecution('DEBUG', 'getVendorMail', getVendorMail);

        vendorEmailField.setDefaultValue(getVendorMail);//will change to automatically insert the vendor mail
        vendorEmailField.setMandatory(true);

        // cc emails
        var additionalRecipients = form.addField('custpage_cc_email', 'text', 'Additional Recipients', null, null);
        additionalRecipients.setDefaultValue('please insert cc email if applicable.');//maybe will insert a scroll down list of contacts

        // body email
        var bodyMessage = form.addField('custpage_body_message', 'richtext', 'Body Message', null, null);
        bodyMessage.setDefaultValue('please write your message here.');

        var checkStage = form.addField('custpage_rec_id', 'text', 'check', null, null);
        checkStage.setDefaultValue(Recid);
        checkStage.setDisplayType('hidden');

        response.writePage(form);

    }
    else {
        nlapiLogExecution('DEBUG', 'stage two', 'stage two');
        // send email to vendor 

        var form = nlapiCreateForm("Send Email To Vendor With Attached Purchase Order");

        var Recid = request.getParameter('custpage_rec_id');
        var vendorEmailField = request.getParameter('custpage_vendor_email');
        var additionalRecipients = request.getParameter('custpage_cc_email');
        var bodyMessage = request.getParameter('custpage_body_message');

        nlapiLogExecution('DEBUG', 'Recid', Recid);
        nlapiLogExecution('DEBUG', 'vendorEmailField', vendorEmailField);
        nlapiLogExecution('DEBUG', 'additionalRecipients', additionalRecipients);
        nlapiLogExecution('DEBUG', 'bodyMessage', bodyMessage);

        var record = nlapiLoadRecord('purchaseorder', Recid);


        var xml = createPoTempalte(record, Recid);
        var pdf = nlapiXMLToPDF(xml);
        nlapiLogExecution('debug', 'pdf ', pdf);
        var file = nlapiCreateFile(record.getFieldValue('tranid') +'.pdf', 'PDF', pdf.getValue());
       
        var newEmail = nlapiSendEmail(context.getUser(), vendorEmailField, 'Purchase Order Attached From Netsuite system.', bodyMessage, additionalRecipients, null, null, file);
        nlapiLogExecution('DEBUG', 'newEmail', newEmail);
        response.writePage(form);
    }
}

function createPoTempalte(record, Recid) {
    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(6579);   // prod
    var template = nlapiLoadFile(6579);   // sb

    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    var approval_log_data = approval_log(Recid);
    nlapiLogExecution('debug', 'approval_log_data:', JSON.stringify(approval_log_data));
    nlapiLogExecution('debug', 'approval_log_data.length:', approval_log_data.length);

    var ApprovedBy = '', ApprovedDate = '', Title = '', ApprovedByName = '', Title_id = '', ApproverBy_ID = '';
    if (approval_log_data.length > 0) {
        ApproverBy_ID = approval_log_data[0].ApproverBy_ID;
        nlapiLogExecution('debug', 'ApproverBy_ID', ApproverBy_ID);

        Title_id = nlapiLookupField('employee', ApproverBy_ID, 'custentity_position');
        if (!isNullOrEmpty(Title_id)) {
            Title = nlapiLookupField('customlist523', Title_id, 'name');
        }

        ApprovedBy = approval_log_data[0].ApprovedBy;
        nlapiLogExecution('debug', 'ApprovedBy', ApprovedBy);

        ApprovedByName = ApprovedBy.substring(ApprovedBy.indexOf(' ') + 1);
        nlapiLogExecution('debug', 'ApprovedByName', ApprovedByName);

        ApprovedDate = approval_log_data[0].ApprovedDate
        ApprovedDate = ApprovedDate.substring(0, ApprovedDate.indexOf(' '));
    }

    xml = xml.replace('/ApprovedBy/', ApprovedByName);
    xml = xml.replace('/Title/', Title);
    xml = xml.replace('/ApprovedDate/', ApprovedDate);
    return xml;
}





