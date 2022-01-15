// JavaScript source code

function printPaymentRequest(request, response) {

    var today = nlapiDateToString(new Date());


    if (request.getMethod() == 'GET') {
        try {
            nlapiLogExecution('DEBUG', 'A', 'A')
            updateRec = false;
            var id = request.getParameter('soid');
            var pmt = request.getParameter('pmt');
            var record = nlapiLoadRecord('salesorder', id);

            var SoNo = record.getFieldValue('tranid');
            var PoNo = record.getFieldValue('custbody_customer_po_num');
            var address = record.getFieldValue('billaddress')
            if (address == "" || address == null || address == undefined) {
                address = record.getFieldValue('entityname');
            }
            else address = address.replace(/\n/ig, '<br />');

            //currency symbol
            var currencysymbol = record.getFieldValue('currencysymbol');
            var symbol;
            if (currencysymbol == 'USD')
                symbol = '$'
            else if (currencysymbol == 'GBP')
                symbol = '£'
            else if (currencysymbol == 'EUR')
                symbol = '€'
            else symbol = '₪'

            var date, pmtPrecent;
            if (pmt == 1) {
                pmtPrecent = record.getFieldValue('custbody_pmt1'); //PMT 1                           
                date = record.getFieldValue('custbody_pmt1_date'); // PMT 1 DATE
                if (date == '' || date == null || date == undefined) {
                    date = today;
                    record.setFieldValue('custbody_pmt1_date', date);
                    updateRec = true;
                }
            }
            else if (pmt == 2) {
                pmtPrecent = record.getFieldValue('custbody_pmt2'); //PMT 2
                date = record.getFieldValue('custbody_pmt2_date') //PMT 2 DATE
                if (date == '' || date == null || date == undefined) {
                    date = today;
                    record.setFieldValue('custbody_pmt2_date', date);
                    updateRec = true;
                }
            }
            else {
                pmtPrecent = record.getFieldValue('custbody_pmt3'); //PMT 3
                date = record.getFieldValue('custbody_pmt3_date') // PMT 3 DATE
                if (date == '' || date == null || date == undefined)
                    date = today;
                record.setFieldValue('custbody_pmt3_date', date);
                updateRec = true;
            }

            //subTotal calc 
            var subTotal = record.getFieldValue('subtotal')
            subTotal = (subTotal * parseInt(pmtPrecent)) / 100;
            subTotal = parseFloat(subTotal).toFixed(2);

            //VAT calc
            var taxTotal = record.getFieldValue('taxtotal')
            if (taxTotal != '' && taxTotal != null && taxTotal != undefined) {
                taxTotal = (taxTotal * parseInt(pmtPrecent)) / 100;
                taxTotal = parseFloat(taxTotal).toFixed(2);
            }
            else taxTotal = 0;

            //TOTAL
            var Total = (parseFloat(taxTotal) + parseFloat(subTotal)).toFixed(2);

            //exachange rate
            var exachange = nlapiExchangeRate(currencysymbol, 'ILS', date)
            if (pmt == 1) {
                updateRec = true;
                record.setFieldValue('custbody_pmt1_rate', exachange); //RATE FOR PMT 1   
                record.setFieldValue('custbody_pmt1_ils_balance', formatNumber(parseFloat(Total * exachange).toFixed(2))) //ILS BALANCE PMT 1
            }
            else if (pmt == 2) {
                updateRec = true;
                record.setFieldValue('custbody_pmt2_rate', exachange); //RATE FOR PMT 2
                record.setFieldValue('custbody_pmt2_ils_balance', formatNumber(parseFloat(Total * exachange).toFixed(2))) //ILS BALANCE PMT 2
            }
            else if (pmt == 3) {
                updateRec = true;
                record.setFieldValue('custbody_pmt3_rate', exachange); //RATE FOR PMT 3
                record.setFieldValue('custbody_pmt3_ils_balance', formatNumber(parseFloat(Total * exachange).toFixed(2))) //ILS BALANCE PMT 3
            }

            // CommentTable  table
            var comments = record.getFieldValue('custbody_pmt_comments');
            if (comments == null) { comments = ""; }

            // sub table
            var subId = record.getFieldValue('subsidiary');
            nlapiLogExecution('DEBUG', 'subId', subId)
            var subTable = SubTable(subId);
            nlapiLogExecution('DEBUG', 'subTable', subTable)

            //bank details
            var bankDetails;
            var SubRec = nlapiLoadRecord('subsidiary', subId);
            var entity = nlapiLoadRecord('customer', record.getFieldValue('entity')); // customer id
            var country = entity.getFieldValue('billcountry');
            var billattention = entity.getFieldValue('billattention');
            if (billattention == '' || billattention == null || billattention == undefined) billattention = "";
            if (country == 'IL' || (country != 'IL' && symbol != '$')) { bankDetails = SubRec.getFieldValue('custrecord_bankils') }
            else bankDetails = SubRec.getFieldValue('custrecord_bankfrn')

            if (bankDetails != null) {
                bankDetails = bankDetails.replace(/\n/ig, '<br />');
                var banktTable = "<table style='font-size:12px;padding-left:5px' align='left' width='100%'>";
                banktTable += "<tr> <td>Bank Details: <br /> " + bankDetails + "</td></tr>";
                banktTable += "</table>"
            }

            nlapiLogExecution('DEBUG', 'B', 'B')

            // list of items -> start
            var itemCount = record.getLineItemCount('item');
            if (itemCount > 0) {
                var line = 1;
                var item, description, quantity, unit, unitPrice, amount, total_amount;
                var sumOfRate = 0;
                var sumOfAmount = 0;
                var lineTable = "<table align='center' width='100%' class='a'>";
                lineTable += '<tr><th>Line</th><th>Product ID</th><th>Description</th><th>Qty</th><th>UM</th><th><p style="width:100%; text-align:left;">Unit Price</p></th><th><p style="width:100%; text-align:left;">Total Price</p></th><th><p style="width:100%; text-align:left;">' + pmtPrecent + ' Advance Payment Due</p></th></tr>';
                for (var i = 1; i <= itemCount; i++) {
                    ingroup = record.getLineItemValue('item', 'ingroup', i);
                    if (ingroup == null) {
                        if (record.getLineItemValue('item', 'itemtype', i) == 'Group') {
                            for (var j = i + 1; j <= itemCount; j++) {
                                if (record.getLineItemValue('item', 'itemtype', j) == 'EndGroup') {
                                    item = record.getLineItemValue('item', 'item_display', i);
                                    description = record.getLineItemValue('item', 'description', i);
                                    quantity = record.getLineItemValue('item', 'quantity', i);
                                    unit = "Each";
                                    unitPrice = record.getLineItemValue('item', 'amount', j) / quantity;
                                    unitPrice = parseFloat(unitPrice).toFixed(2)
                                    total_amount = unitPrice * quantity;
                                    total_amount = parseFloat(total_amount).toFixed(2)
                                    amount = ((unitPrice * quantity) * parseInt(pmtPrecent)) / 100;
                                    amount = parseFloat(amount).toFixed(2)
                                    lineTable += addLine(line, item, description, quantity, unit, formatNumber(unitPrice), formatNumber(total_amount), formatNumber(amount), symbol);
                                    line++;
                                    break;
                                }
                            }
                        }
                        else if (!isNullOrEmpty(record.getLineItemValue('item', 'custcol_bundle_number', i))) {
                            var lineCore = '';
                            var bundle_number = record.getLineItemValue('item', 'custcol_bundle_number', i);
                            nlapiLogExecution('DEBUG', 'bundle_number', bundle_number)
                            quantity = record.getLineItemValue('item', 'quantity', i);
                            unit = "Each";
                            description = record.getLineItemValue('item', 'description', i);
                            sumOfRate = parseFloat(record.getLineItemValue('item', 'rate', i));
                            sumOfAmount = parseFloat(record.getLineItemValue('item', 'amount', i));
                            var item = record.getLineItemValue('item', 'item', i);
                            var itemText = record.getLineItemText('item', 'item', i);
                            if (nlapiLookupField('item', item, 'custitem_item_type') == '3') {
                                lineCore = i;
                            }
                            for (var j = i + 1; j <= itemCount; j++) {
                                var Next_bundle_number = record.getLineItemValue('item', 'custcol_bundle_number', j);
                                if (bundle_number == Next_bundle_number) {
                                    var Second_item = record.getLineItemValue('item', 'item', j);
                                    if (lineCore == '') {
                                        if (nlapiLookupField('item', Second_item, 'custitem_item_type') == '3') {
                                            lineCore = j;
                                        }
                                    }
                                    description += '<br /><br />' + record.getLineItemValue('item', 'description', j);
                                    sumOfRate += parseFloat(record.getLineItemValue('item', 'rate', j));
                                    sumOfAmount += parseFloat(record.getLineItemValue('item', 'amount', j));

                                }
                                else {
                                    break;
                                }
                            } //  for (var j = i+1 ; j <= count; j++)
                            amount = ((sumOfRate * quantity) * parseInt(pmtPrecent)) / 100;
                            amount = parseFloat(amount).toFixed(2);
                            i = j - 1;
                            lineTable += addLine(line, itemText, description, quantity, unit, formatNumber(sumOfRate.toFixed(2)), formatNumber(sumOfAmount.toFixed(2)), formatNumber(amount), symbol);
                            line++;
                        }
                        else {
                            var itemtype = record.getLineItemValue('item', 'itemtype', i)
                            item = record.getLineItemValue('item', 'item_display', i);
                            description = getVal(record.getLineItemValue('item', 'description', i));
                            quantity = getVal(record.getLineItemValue('item', 'quantity', i));
                            if (!isNullOrEmpty(quantity)) quantity = 1;
                            unit = record.getLineItemValue('item', 'units_display', i);
                            if (unit == "" || unit == null || unit == undefined) unit = "";
                            unitPrice = record.getLineItemValue('item', 'rate', i);
                            total_amount = record.getLineItemValue('item', 'amount', i);
                            if (itemtype == 'Discount') {
                                amount = (total_amount * parseInt(pmtPrecent)) / 100;
                            }
                            else {
                                amount = ((unitPrice * quantity) * parseInt(pmtPrecent)) / 100;
                            }
                            amount = parseFloat(amount).toFixed(2)

                            lineTable += addLine(line, item, description, quantity, unit, formatNumber(unitPrice), formatNumber(total_amount), formatNumber(amount), symbol);
                            line++;
                        }
                    }
                }
                var totalILS = parseFloat(Total * exachange).toFixed(2);

                lineTable += "<tr> <td colspan='4' rowspan='3' style='border-bottom:0px;border-right:0px;border-left:0px;padding: 0px;font-size:12px'><br />Comments: <br />" + comments + "</td><td  style='border-bottom:0px;border-right:0px;border-left:0px;padding: 0px;'></td><td colspan='2' >Sub Total</td><td >" + symbol + formatNumber(subTotal) + "</td></tr>";
                lineTable += "<tr> <td  style='border: 0px'></td> <td colspan='2'>VAT 17%</td><td>" + symbol + formatNumber(taxTotal) + "</td></tr>";
                lineTable += "<tr><td  style='border: 0px'></td> <td colspan='2'>Total</td><td>" + formatNumber(Total) + "</td></tr>";
                if (country == 'IL') { lineTable += "<tr> <td colspan='5' style='border: 0px'></td>  <td colspan='2'>Total in ILS</td><td>" + formatNumber(totalILS) + "</td></tr>"; }
                lineTable += "</table> ";
            }
            // list of items -> end


            nlapiLogExecution('DEBUG', 'C', 'C')
            // Terms  Conditions table
            var Terms = record.getFieldValue('custbody_pmt_terms_and_conditions');
            var TermstTable = "";
            if (Terms != null) {
                TermstTable = "<table style='font-size:12px;padding-left:5px' align='left' width='50%'>";
                TermstTable += "<tr><td>Terms & Conditions: <br /> " + Terms + "</td></tr>";
                TermstTable += "</table>"
            }





            //customer table
            var CustomerTable = customerTable(address, billattention, date, SoNo, currencysymbol, PoNo);



            //var heb = "<link name='sans-serif' type='font' subtype='truetype' src='https://5463879.app.netsuite.com/c.5463879/suitebundle257625/IL_Files/Heb-Regular.ttf' />";
            var heb = "<link name='sans-serif' type='font' subtype='truetype' src='https://5463879.app.netsuite.com/c.5463879/suitebundle255679/IL_Files/Heb-Regularr.ttf' />";

            var style = "<style> body{font-family:sans-serif} .a { padding: 8px; font-size: 9px;}table.a td, table.a th {border: 1px solid black;padding: 5px; } </style > ";

            var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xml += "<pdf>";
            xml += "<head>" + heb + style + "<macrolist><macro id=\"myfooter\"><p align=\"center\"><pagenumber /></p></macro></macrolist></head>";
            xml += "<body font-size=\"12\">\n";
            xml += subTable;
            xml += "<p style='font-size:30px;'  align='center'><b><u>" + ' Payment Request : ' + SoNo.replace(/[A-Z]/g, "") + '-' + pmt + "</u></b></p>";
            xml += CustomerTable;
            xml += lineTable;
            xml += TermstTable
            xml += '<br />' + banktTable;
            xml += "</body>\n</pdf>";

            xml = xml.replace(/&/ig, '&amp;');
            var file = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'Print.pdf', 'inline');
            if (updateRec) nlapiSubmitRecord(record);
            response.write(file.getValue());



        }

        catch (e) {
            nlapiLogExecution('error', 'Error in PrintPdf: ', e);

        }
    }
}

// subsidiary table
function SubTable(id) {

    var SubRec = nlapiLoadRecord('subsidiary', id);
    //var name = SubRec.getFieldValue('name');
    var add1 = SubRec.getFieldValue('mainaddress_text');
    add1 = add1.replace(/\n/ig, '<br />');
    var email = SubRec.getFieldValue('email');
    var website = SubRec.getFieldValue('url');
    var tax = SubRec.getFieldValue('custrecordil_tax_payer_id_subsidary');
    var logo = SubRec.getFieldValue('logo');
    var imageURL = nlapiLoadFile(logo).getURL();
    var domainStr = 'https://5463879-sb1.app.netsuite.com';
    var imgLink = domainStr + imageURL
    //imageURL = nlapiEscapeXML(imgLink);
    var subTable = "<table width='100%' style='color:#00aaff;font-size: 12px'>";
    subTable += "<tr>";
    subTable += "<th>";
    subTable += "<table>";
    subTable += "<tr>";
    subTable += "<td>";
    subTable += " <img src='" + imgLink + "' height='60' width='130' /> ";
    subTable += "</td>";
    subTable += "</tr>";
    subTable += "<tr>";
    subTable += "<td>";
    subTable += add1;
    subTable += "</td>";
    subTable += "</tr>";
    if (email != null) {
        subTable += "<tr>";
        subTable += "<td>";
        subTable += 'Email: ' + email;
        subTable += "</td>";
        subTable += "</tr>";
    }
    if (website != null) {
        subTable += "<tr>";
        subTable += "<td>";
        subTable += 'Website: ' + website;
        subTable += "</td>";
        subTable += "</tr>";
    }
    subTable += "<tr>";
    subTable += "<td>";
    subTable += ' Company Reg No: ' + tax;
    subTable += "</td>";
    subTable += "</tr>";
    subTable += "</table> ";
    subTable += "</th>";
    subTable += "</tr>";
    subTable += "</table> ";
    return subTable;

}

// customer table

function customerTable(address, billattention, date, SoNo, currencysymbol, PoNo) {

    var CustomerTable = '<table style="width:650px;padding-top:10px;padding-left:5px;table-layout: fixed; font-size:12px">' +
        '<tr>' +
        '<td style="width:70%" ><b>Customer:</b> <br />' + address + '<br /> Attention To:' + billattention + '</td>  ' +
        '<td  align="right" >' +
        'Date: ' + date + ' <br />';
    if (PoNo != null) {
        CustomerTable += 'PO#: ' + PoNo + ' <br />';
    }
    CustomerTable += '   SO#: ' + SoNo + ' <br />';
    CustomerTable += 'Currency: ' + currencysymbol + '</td > ' +
        '</tr>  ' +
        '</table>  ';

    nlapiLogExecution('debug', 'CustomerTable', CustomerTable)
    return CustomerTable;
}

// items
function addLine(number, item, description, quantity, unit, unitPrice, total_amount, amount, symbol) {
    try {

        if (unitPrice == null || unitPrice == undefined) { unitPrice = '' }
        else { unitPrice = symbol + unitPrice }

        var firstline;
        firstline += "<tr>";
        firstline += "<td>";
        firstline += number;
        firstline += "</td>";
        firstline += "<td>";
        firstline += item;
        firstline += "</td>";
        firstline += "<td>";
        firstline += description;
        firstline += "</td>";
        firstline += "<td>";
        firstline += quantity;
        firstline += "</td>";
        firstline += "<td>";
        firstline += unit;
        firstline += "</td>";
        firstline += "<td>";
        firstline += unitPrice;
        firstline += "</td>";
        firstline += "<td>";
        firstline += symbol + total_amount;
        firstline += "</td>";
        firstline += "<td>";
        firstline += symbol + amount;
        firstline += "</td>";
        firstline += "</tr>";

        return firstline;
    } catch (e) {
        nlapiLogExecution('DEBUG', 'addLine ', e);
    }
}

//add comma 
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return ''


}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}

function getVal(val) {

    if (isNullOrEmpty(val)) { return ''; }
    return val;

}







