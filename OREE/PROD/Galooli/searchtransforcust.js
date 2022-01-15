
    var id = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), id);
    function aftersubmit() {

        var res = searchtrans(id);

        if (res != null) {
            nlapiLogExecution('debug', 'res != null', "id: " + id);
            var templateString = createPSDetailPage(rec, res);
            downloadDataPDF(templateString)
            //PrintPdf();
        }
    }


    function searchtrans(customer) {

        var search = nlapiLoadSearch(null, 'customsearch_nr_billing_transaction');
        search.addFilter(new nlobjSearchFilter('internalid', 'customer', 'is', customer));
        var s = [];
        var Results = [];

        var searchid = 0;
        var resultset = search.runSearch();
        var cols = search.getColumns();

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }

        } while (resultslice.length >= 1000);

        if (s != null) {
            for (var i = 0; i < s.length; i++) {
                Results[i] = {
                    id: s[i].id,
                    docNumber: s[i].getValue('tranid'),
                    currency: s[i].getText('currency'),
                    date: s[i].getValue('trandate'),
                    dueDate: s[i].getValue('formuladate'),
                    accType: s[i].getValue('accounttype'),
                    Aging_days: s[i].getValue('formulatext'),
                    originalAmount: s[i].getValue(cols[5]),
                    PastDue: s[i].getValue(cols[6]),
                    TotalDebt: s[i].getValue(cols[7]),
                    OrigAmtTrxCurr: s[i].getValue(cols[11]),
                    customerId: s[i].getValue('internalid', 'customer'),
                }
            }
        }

        Results.sort(sortByProp("dueDate"));
         //Results.sort(custom_sort);

        return Results;
    }



    function createPSDetailPage(rec, arr) {
        nlapiLogExecution('debug', 'createPSDetailPage', "");

        var name = rec.getFieldValue('companyname');
        var sub = nlapiLoadRecord('subsidiary', rec.getFieldValue('subsidiary'));
        var recAdrress = sub.getFieldValue('mainaddress_text');
        var recEmail = sub.getFieldValue('custrecord_email');
        var recRank = rec.getFieldText('custentitycustomers_rank');
        nlapiLogExecution('debug', 'customer name: ', name);

        //var _supp_comment = '';
        //var invoiceNum = invoiceRecord.getFieldValue('tranid');
        //var invoiceSubsid = invoiceRecord.getFieldValue('subsidiary');
        //if (invoiceSubsid == '18') { //USA Subsidiary
        //    _supp_comment = nlapiLookupField('subsidiary', invoiceSubsid, 'custrecord_ps_supplement_comment')
        //}

        var temp = nlapiLoadFile('480955').getValue();
        var a = temp.toString();

        var startlist = a.indexOf("--startlist--") + 13
        var head = a.substr(0, startlist - 13);
        var endlist = a.indexOf("--endlist--");
        var list = a.substr(startlist, endlist - startlist);

        var totalDebt = parseFloat(0);
        var totalpass = parseFloat(0);

        var restOfTemplate = a.substr(endlist + 11, a.length);

        var dynList = '';
        var temp;
        var temp2;
        for (var x = 0; x < arr.length; x++) {

            var line = '';
            line +='<tr>';
            line += '<td colspan="3" class="left">' + arr[x].docNumber + '</td>';
            line += '<td colspan="3" class="left">' + arr[x].date + '</td>';
            line += '<td colspan="3" class="center">' + arr[x].dueDate + '</td>';
            line += '<td colspan="3" class="center">' + numberWithCommas(arr[x].OrigAmtTrxCurr) + '</td>';
            line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].originalAmount) + '</td>';
            line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].PastDue) + '</td>';
            line += '<td colspan="3" class="left">' + numberWithCommas(arr[x].TotalDebt) + '</td></tr>';

            dynList += line;
            temp = parseFloat(arr[x].TotalDebt);
            temp2 = parseFloat(totalDebt);
            totalDebt = (temp2 + temp);
            totalDebt = totalDebt.toFixed(2);

            temp = parseFloat(arr[x].PastDue);
            temp2 = parseFloat(totalpass);
            totalpass = (temp2 + temp);
            totalpass = totalpass.toFixed(2);
            //temp = parseFloat(arr[x].PastDue);
            //totalpass = (totalpass + temp);
            //totalpass = totalpass.toFixed(2);
        }

        totalDebt = numberWithCommas(totalDebt);
        totalpass = numberWithCommas(totalpass);

        var line = '';
        line += '<tr >';
        line += '<td colspan="12" style= " background-color: white"  class="left"></td>';
        line += '<td colspan="3" class="left">' + '<b>Total</b>' + '</td>';
        line += '<td style="border-top-style:solid;" colspan="3" class="left"><b>' + totalpass + '</b></td>';
        line += '<td colspan="3" class="left"><b>' + totalDebt + '</b></td></tr>';
        dynList += line;


        var allTemplate = head + dynList + restOfTemplate.toString();


        var pattern = /_invoice_number|_supp_comment/ig;


        //PS Detail Information Information
        var _invoice_number = name + "test";//"customer name";//name;
        var address = recAdrress;//'test test'
        var email = recEmail;//'wwwwwwwww'
        var Rank = recRank;

        var mapObj = {
            _invoice_number: name,
            address: address,
            email: email,
            Rank: Rank,
           // _supp_comment: _supp_comment
        };


        var str = allTemplate.replace(/\{\{(.*?)\}\}/g, function (i, match) {
            return mapObj[match];
        });
        //must clean all amps
        //var clean = str.replaceAll("&", "&amp;");
        return str;
    }


    function downloadDataPDF( data) {
        try {
            nlapiLogExecution('debug', 'downloadDataPDF', data);
           // var tt = nlapiEscapeXML(data)
            var file = nlapiXMLToPDF(data);
            nlapiLogExecution('debug', 'after nlapiXMLToPDF: ', '')
            // set content type, file name, and content-disposition
            var multipleINV_pdf = nlapiCreateFile('Print25.pdf', 'PDF', file.getValue());
            nlapiLogExecution('debug', 'after nlapiCreateFile: ', '')
            multipleINV_pdf.setFolder(368160);
            multipleINV_pdf.setIsOnline(true);
            nlapiLogExecution('debug', 'before submit: ', '')
            var printFileID = nlapiSubmitFile(multipleINV_pdf);
        }catch (e) {
        nlapiLogExecution('debug', 'error', e)
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortByProp(prop) {
    return function (a, b) {
        if (nlapiStringToDate(a[prop]) > nlapiStringToDate(b[prop])) {
            return 1;
        } else if (nlapiStringToDate(a[prop]) < nlapiStringToDate(b[prop])) {
            return -1;
        }
        return 0;
    }
}
function custom_sort(a, b) {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}


function beforeLoad_addButton(type, form) {
    if (type == 'view') {
        form.setScript('customscript_aging_print_client'); // client script id
        form.addButton('custpage_button_print', 'Print Aging Table', 'printButton()');
    }
}


    /*function PrintPdf() {
        try {
            //Retrieve some values from the sales order record which you want to display in pdf
            var heb = "<link name='sans-serif' type='font' subtype='truetype' src='https://4855789-sb1.app.netsuite.com/c.4855789_SB1/suitebundle149431/Heb-Regular-test.ttf?fcts=20200319060208' />";
            var style = "<style> body{font-family:sans-serif} .a { border-collapse:collapse;padding: 8px; font-size: 9px; }table.a td, table.a th {border: 1px solid black;padding: 5px; } </style > ";

            var customer = 'asdf'
            var date = 'asdfsdf'
            // create a table to present the results of the search
            var strName = "<table>";
            strName += "<tr>";
            strName += "<td>";
            strName += "Customer: ";
            strName += customer;
            strName += "</td>";
            strName += "</tr>";
            strName += "<tr>";
            strName += "<td>";
            strName += "Date: ";
            strName += date;
            strName += "</td>";
            strName += "</tr>";
            strName += "</table>";
            nlapiLogExecution('DEBUG', 'Table created');

            // build up BFO-compliant XML using well-formed HTML
            var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
            xml += "<pdf>";
            xml += "<head>" + heb + style + "<macrolist><macro id=\"myfooter\"><p align=\"center\"><pagenumber /></p></macro></macrolist></head>";
            xml += "<body font-size=\"12\">\n<h3>Printing PDF בדיקה בעברית Example</h3><br />\n";
            xml += "<p></p>";
            xml += strName;
            xml += "</body>\n</pdf>";
            // run the BFO library to convert the xml document to a PDF
            var file = nlapiXMLToPDF(xml);
            // set content type, file name, and content-disposition
            var multipleINV_pdf = nlapiCreateFile('Print.pdf', 'PDF', file.getValue());
            nlapiLogExecution('debug', 'after nlapiCreateFile: ', '')
            multipleINV_pdf.setFolder(348098);
            multipleINV_pdf.setIsOnline(true);
            nlapiLogExecution('debug', 'before submit: ', '')
            var printFileID = nlapiSubmitFile(multipleINV_pdf);
            nlapiLogExecution('debug', 'submitted FileID: ', printFileID)

        }
        catch (exception) {
            nlapiLogExecution('DEBUG', 'Error in PrintPdf: ', exception);
        }
    }*/