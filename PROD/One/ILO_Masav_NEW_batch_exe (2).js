/* **************************************************************************************
 ** Copyright (c) 2016 One1 LTD
 ** All Rights Reserved.
 **
 * Version    Date            Author           Remarks
 * 5.20       26 NOV 2016      Moshe Barel     
 *
 *************************************************************************************** */
var whtResults = [];
var vendorsbank = [];
var batchrec;


function exe_masav_batch(request, response) {
    //Create the form and add fields to it 
    var form = nlapiCreateForm("Approve Payment Batch");
    var arrPay = [];

    if (request.getMethod() == 'GET') {
        form.addField('paymentdate', 'date', 'Payment Date');
        //form.addField('status', 'select', 'Status', 'customlist_ilo_lst_masav_batchstatus').setDefaultValue(1);
        form.addField('createdby', 'select', 'Created By', 'employee');
        form.addSubmitButton('Load');
        response.writePage(form);
    }
    else {

        var action = request.getParameter("action");
        //  form.addField('paymentstatus', 'label', '<b>Pre Approved</b>: Masav');
        var results = nlapiSearchRecord('customrecord_ilo_vendor_bank', null, [new nlobjSearchFilter('isinactive', null, 'is', 'F')], [new nlobjSearchColumn('custrecord_ilo_vendor_bank_vendor'), new nlobjSearchColumn('custrecord_ilo_vendor_bank_bank'), new nlobjSearchColumn('custrecord_ilo_bank_details_account'), new nlobjSearchColumn('custrecord_ilo_default_bank_account', null, null).setSort(true), new nlobjSearchColumn('internalid', null, null).setSort(true)]);
        // loop over vendor bank to find the right one (we can't filter by vendor due to Netsuite internal bug
        var vendorbankid = '0';
        if (results == null)
            throw nlapiCreateError('masav', 'No vendors with israeli banks. Please verify vendors data', true);
        for (var l = 0; l < results.length; l++) {
            var vendoraccount = results[l].getText('custrecord_ilo_vendor_bank_bank') + ' ' + results[l].getValue('custrecord_ilo_bank_details_account');
            var venbankid = results[l].getValue('custrecord_ilo_vendor_bank_vendor');
            if (vendorsbank[venbankid] == null)
                vendorsbank[venbankid] = vendoraccount;
        }

        if (action == '' || action == null) {
            var paymentdate = request.getParameter("paymentdate");
            var status = 2;
            var createdby = request.getParameter("inpt_createdby");

            var filters = [];
            //if (paymentdate != '') {
            //    filters.push(new nlobjSearchFilter('custrecord_ilo_masav_batch_pymdate', null, 'is', paymentdate));
            //}

            // only preapproved
            filters.push(new nlobjSearchFilter('custrecord_ilo_masav_batch_status', null, 'is', '1'));
            var results = nlapiSearchRecord('customrecord_ilo_masav_batch', null, filters, [new nlobjSearchColumn('name').setSort(true), new nlobjSearchColumn('custrecord_ilo_masav_batch_pymdate'), new nlobjSearchColumn('custrecord_ilo_masav_batch_status'), new nlobjSearchColumn('custrecord_ilo_masav_batch_data')]);
            // Create a sublist to show the search results
            var sublist = form.addSubList('custpage_transaction_list', 'list', 'Batch To Execute');
            form.addField('action', 'text', '').setDisplayType('hidden').setDefaultValue('execute');

            // Create an array to store the transactions from the search results
            var transactionArray = new Array();

            if (results != null) {
                // Add a checkbox column to the sublist to select the transactions that will be selected in the batch.
                sublist.addField('approve', 'radio', 'Approve');

                // Add hidden columns for the Internal ID and for the Record type.
                // These fields are necessary for the nlapiDeleteRecord function.
                sublist.addField('internalid', 'text', 'Internal ID').setDisplayType('hidden');


                // Get the the search result columns
                var columns = results[0].getAllColumns();

                // Add the search columns to the sublist
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].getName() == 'custrecord_ilo_masav_batch_data')
                        sublist.addField(columns[i].getName(), 'text', columns[i].getName()).setDisplayType('hidden').setMaxLength(100000);
                    else
                        sublist.addField(columns[i].getName(), 'text', columns[i].getName());
                }

                // For each search results row, create a transaction object and attach it to the transactionArray
                for (var i = 0; i < results.length; i++) {
                    var transaction = new Object();

                    //// Set the Pay column to False
                    //transaction['pay'] = 'F';
                    // Set the hidden internal ID field
                    transaction['internalid'] = results[i].getId();

                    // Copy the row values to the transaction object
                    for (var j = 0; j < columns.length; j++) {
                        if (columns[j].type == 'select')
                            transaction[columns[j].getName()] = results[i].getText(columns[j].getName());
                        else
                            transaction[columns[j].getName()] = results[i].getValue(columns[j].getName());
                    }

                    // Attach the transaction object to the transaction array
                    transactionArray[i] = transaction;
                }
            }

            // Initiate the sublist with the transactionArray
            sublist.setLineItemValues(transactionArray);

            form.addSubmitButton('Approve Batch Bills');
        }
        else if (action == 'execute') // execute  a new payment batch
        {
            form.addField('action', 'text', '').setDisplayType('hidden').setDefaultValue('pay');
            // Check how many lines in the sublist
            var count = request.getLineItemCount('custpage_transaction_list');
            form.setScript('customscript_ilo_cs_masav2');

            var num = 0;
            var batch_transactions = '';
            var isError = false;
            var sublist = form.addSubList('custpage_transaction_list', 'inlineeditor', 'Bills From Batch. Total to Pay');
            var batch_id = 0;
            sumnet = 0;
            sumwht = 0;
            sumgross = 0;
            var batchdate = '';
            var batch_id = '';
            //for each line in the sublist
            for (var i = 1; i < count + 1; i++) {
                //get the value of the Delete checkbox
                var savedTransaction = request.getLineItemValue('custpage_transaction_list', 'approve', i);
                // If it's checked, delete the transaction
                if (savedTransaction == 'T') {
                    var bill_ids = request.getLineItemValue('custpage_transaction_list', 'custrecord_ilo_masav_batch_data', i);
                    batchdate = request.getLineItemValue('custpage_transaction_list', 'custrecord_ilo_masav_batch_pymdate', i);
                    batch_id = request.getLineItemValue('custpage_transaction_list', 'internalid', i);
                    nlapiLogExecution('debug', 'savedTransaction ', i + ' batch_id:' + batch_id + ' batchdate:' + batchdate + ' bill_ids:' + bill_ids + ' approve:' + savedTransaction);
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_last_line_execute', 1);
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments', ''); //approved

                    var WHTObj = searchWHTbyDate(batchdate);
                    // Get the transaction internal ID
                    var internalId = batch_id;
                    // Get the transaction type
                    try {
                        var results = nlapiSearchRecord('vendorbill', null, [new nlobjSearchFilter('internalid', null, 'anyof', bill_ids.split(",")), new nlobjSearchFilter('fxamountremaining', null, 'notequalto', 0), new nlobjSearchFilter('mainline', null, 'is', 'T')], [new nlobjSearchColumn('entity').setSort(), new nlobjSearchColumn('tranid'), new nlobjSearchColumn('duedate'), new nlobjSearchColumn('trandate'), new nlobjSearchColumn('fxamountremaining'), new nlobjSearchColumn('currency'), new nlobjSearchColumn('account')]);
                        // Create a sublist to show the search results
                        nlapiLogExecution('debug', 'internalId', ' internalId:' + internalId);

                        // Create an array to store the transactions from the search results
                        var transactionArray = new Array();
                        if (results != null) {
                            // Add a checkbox column to the sublist to select the transactions that will be selected in the batch.
                            sublist.addField('pay', 'checkbox', 'Pay').setDefaultValue('T');

                            // Add hidden columns for the Internal ID and for the Record type.
                            // These fields are necessary for the nlapiDeleteRecord function.
                            sublist.addField('internalid', 'text', 'INTERNAL ID').setDisplayType('hidden');

                            // Add a column for the Internal ID link
                            sublist.addField('internalidlink', 'text', 'Bill Id').setDisplayType('disabled');

                            // Get the the search result columns
                            var columns = results[0].getAllColumns();

                            // Add the search columns to the sublist
                            for (var k = 0; k < columns.length; k++) {
                                var name = columns[k].getName();
                                var nameUppoer = "";
                                switch (name) {
                                    case 'currency':
                                        nameUppoer = "Currency";
                                        break;
                                    case 'account':
                                        nameUppoer = "Bank Account";
                                        break;
                                    case 'duedate':
                                        nameUppoer = "Due Date";
                                        break;
                                    case 'entity':
                                        nameUppoer = "Vendor";
                                        break;
                                    case 'trandate':
                                        nameUppoer = "Date";
                                        break;
                                    case 'tranid':
                                        nameUppoer = "Bill";
                                        break;
                                }
                                if (name == 'fxamountremaining')
                                    sublist.addField(name, 'text', 'Total');
                                else
                                    sublist.addField(name, 'text', nameUppoer).setDisplayType('disabled');
                            }
                            sublist.addField('custpage_whtrate', 'text', 'WHT Rate').setDisplayType('disabled');
                            sublist.addField('custpage_whtamount', 'text', 'WHT Amount').setDisplayType('disabled');
                            sublist.addField('totaltopay', 'float', 'Total to Pay').setDisplayType('disabled');
                            sublist.addField('custpage_currencyid', 'text', 'total to pay').setDisplayType('hidden');
                            sublist.addField('custpage_entityid', 'text', 'total to pay').setDisplayType('hidden');
                            sublist.setAmountField('totaltopay');

                            // For each search results row, create a transaction object and attach it to the transactionArray
                            for (var j = 0; j < results.length; j++) {
                                var transaction = new Object();

                                //// Set the Pay column to False
                                //transaction['pay'] = 'F';
                                // Set the hidden internal ID field
                                transaction['internalid'] = results[j].getId();
                                // Set the hidden record type field

                                // Create a link so users can navigate from the list of transactions to a specific transaction
                                var url = nlapiResolveURL('RECORD', results[j].getRecordType(), results[j].getId(), null);
                                internalIdLink = " " + results[j].getId() + " ";

                                // Set the link
                                transaction['internalidlink'] = internalIdLink;

                                // Copy the row values to the transaction object
                                for (var l = 0; l < columns.length; l++) {
                                    var col = columns[l].getName();
                                    if (col == "custpage_whtrate" || col == "custpage_whtamount" || col == "totaltopay")
                                        continue;
                                    if (columns[l].type == 'select')
                                        transaction[col] = results[j].getText(col);
                                    else
                                        transaction[col] = results[j].getValue(col);
                                    if (col == "currency")
                                        transaction["custpage_currencyid"] = results[j].getValue(col);
                                    if (col == "entity")
                                        transaction["custpage_entityid"] = results[j].getValue(col);

                                }
                                var vendorid = results[j].getValue('entity');
                                transaction['Payment Date'] = batchdate;
                                nlapiLogExecution('Debug', 'WHTObj', 'entity ID ' + vendorid);

                                var vendor_wht_rate = WHTObj[vendorid] != null ? WHTObj[vendorid].whtCertPercent : '';
                                if (vendor_wht_rate == '') {
                                    var defaultratecode = nlapiLookupField('vendor', vendorid, 'custentity_4601_defaultwitaxcode');
                                    if (defaultratecode != null)
                                        vendor_wht_rate = nlapiLookupField('customrecord_4601_witaxcode', defaultratecode, 'custrecord_4601_wtc_rate');
                                }
                                transaction['account'] = vendorsbank[vendorid];
                                transaction['custpage_whtrate'] = vendor_wht_rate;
                                transaction['custpage_whtamount'] = (parseFloat(transaction['fxamountremaining']) * (parseFloat(transaction['custpage_whtrate']) / 100)).toFixed(2);
                                transaction['totaltopay'] = (parseFloat(transaction['fxamountremaining']) - transaction['custpage_whtamount']).toFixed(2);

                                // Attach the transaction object to the transaction array
                                transactionArray[j] = transaction;
                                nlapiLogExecution('Debug', 'WHTObj', 'transactionArray ' + j);
                                num++;

                                sumnet += parseFloat(transaction['totaltopay']);
                                sumwht += parseFloat(transaction['custpage_whtamount']);
                                sumgross += parseFloat(transaction['fxamountremaining']);

                                transaction['custpage_whtamount'] = formatMoney(transaction['custpage_whtamount']);
                                // transaction['totaltopay'] = formatMoney(transaction['totaltopay']);
                                transaction['fxamountremaining'] = formatMoney(transaction['fxamountremaining']);

                            }
                        }


                    }
                    // Errors will be logged in the Execution Log
                    catch (ex) {
                        nlapiLogExecution('ERROR', 'Error', 'Transaction ID ' + internalId + ': ' + ex);
                    }
                }
            }
            try {
                batchrec = nlapiLoadRecord('customrecord_ilo_masav_batch', batch_id);
                // Initiate the sublist with the transactionArray
                sublist.setLineItemValues(transactionArray);
                //sublist.addMarkAllButtons();

                nlapiLogExecution('Debug', 'WHTObj', 'sublist end ' + i);
                form.addSubmitButton('Make Payments');
                //form.addField("total", "label", "TOTAL NET: ₪<b>" + formatMoney(sumnet.toFixed(2)) + "</b>" + "  &nbsp;&nbsp;&nbsp;&nbsp;    TOTAL WHT: <b>₪" + formatMoney(sumwht.toFixed()) + "</b>   &nbsp;&nbsp;&nbsp;&nbsp;     TOTAL GROSS: <b>₪" + formatMoney(sumgross.toFixed()) + "</b>").setMaxLength(500);
                form.addField("total", "label", "TOTAL WHT: <b>₪" + formatMoney(sumwht.toFixed()) + "</b>").setMaxLength(500);

                form.addButton('custpage_print_sublist', 'Download Masav Report', null);
                var sub = batchrec.getFieldText('custrecord_masav_subsidiary');
                try {
                    sub = sub.substr(sub.lastIndexOf(':') + 2, sub.length - 1)
                }
                catch (e) { };
                if (sub == null || sub == "")
                    sub = batchrec.getFieldText('custrecord_masav_subsidiary');
                var head =
                    '<tr>' +
                    '<td>Report Date</td>' +
                    '<td>' + GetTodayDateFormated() + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Company</td>' +
                    '<td>' + sub + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>Masav Payment Date</td>' +
                    '<td>' + batchrec.getFieldValue('custrecord_ilo_masav_batch_pymdate') + '</td>' +
                    '</tr>';

                var total = '<TR  bgcolor=\"#87AFC6\">' +
                    '<TD>TOTAL</Data></Cell>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD></TD>' +
                    '<TD>' + formatMoney(sumwht.toFixed()) + '</TD>' +
                    '<TD> \'+ document.getElementById("custpage_transaction_list_total").innerHTML + \'</TD>' +
                    '</TR>';

                //head = escape(head);
                //in the script you need to replace the 'sublist_internalid' variable with the internal id of the sublist. It's the first variable initialized
                //var printScript = "<script>\nvar sublist_internalid = 'custpage_transaction_list_splits';\nfunction printSublist(sublist_internalid) {\n\t debugger; var printPDFButton = document.getElementById('custpage_print_sublist').addEventListener(\"click\", function() {\n\t\t\t\tvar table = document.getElementById(sublist_internalid)\n\t\t\t\tvar fullHeader = document.title\n\t\t\t\tvar fullHeaderArr = fullHeader.split('-')\n\t\t\t\tvar header = fullHeaderArr[0]\n\t\t\t\tvar mywindow = window.open('', 'PRINT', 'height=400,width=600');\n\t\t\t\tmywindow.document.write('<html><head>' + document.title + '</title>');\n\t\t\t\tmywindow.document.write('</head><style>  table {table-layout: fixed; border-collapse: collapse;}  '  + \n\t\t\t\t\t\t '           table th { background-color: #d3d3d3;   color: white; padding-bottom: 10px; padding-top: 10px;}  '  + \n\t\t\t\t\t\t '           table td {  border: 1px solid black; text-overflow: ellipsis; word-wrap:break-word; text-align:center; padding: 5px; page-break-inside: avoid;};  '+ \n\t\t\t\t\t\t \t'table tr {page-break-inside: avoid;}' + \n\t\t\t\t\t \t\t' </style><body > ');\n\t\t\t\tmywindow.document.write('<h1>' + header + '</h1>');\n\t\t\t\t//mywindow.document.write(header.outerHTML);\n\t\t\t\tmywindow.document.write(table.outerHTML);\n\t\t\t\tmywindow.document.write('</body></html>');\n\t\t\t\tmywindow.document.close(); // necessary for IE >= 10\n\t\t\t\tmywindow.focus(); // necessary for IE >= 10*/\n\t\t\t\tmywindow.print();\n\t\t\t\tmywindow.close();\n\t\t\t\treturn true;\n\t\t\t});\n}\n printSublist(sublist_internalid);var sublistBtn = document.getElementById('custpage_transaction_list_buttons');sublistBtn.style.display = 'none'\n</script>"
                var printScript = " <script> document.getElementById('custpage_print_sublist').addEventListener(\"click\", function() {  var tab_text = \'<table>" + head + "<tr><td colspan=\"8\"><h3> Approve Payment Batch \' + nlapiGetFieldValue('batch') + \'<\/h3><\/td><\/tr><\/table>\';\r\n                        tab_text += \"<table border=\'2px\'><tr bgcolor=\'#87AFC6\'>\";\r\n                        var textRange;\r\n                        var j = 0;\r\n                        tab = document.getElementById(\'custpage_transaction_list_splits\'); \/\/ id of table\r\n\r\n                        for (j = 0; j < tab.rows.length - 3; j++) {\r\n                            tab_text = tab_text + tab.rows[j].innerHTML + \"<\/tr>\";\r\n                            \/\/tab_text=tab_text+\"<\/tr>\";\r\n                        }\r\n\r\n                        tab_text = tab_text + '" + total + " <\/table>';\r\n                        tab_text = tab_text.replace(\/<A[^>]*>|<\\\/A>\/g, \"\");\/\/remove if u want links in your table\r\n                        tab_text = tab_text.replace(\/<img[^>]*>\/gi, \"\"); \/\/ remove if u want images in your table\r\n                        tab_text = tab_text.replace(\/<input[^>]*>|<\\\/input>\/gi, \"\"); \/\/ reomves input params\r\n\r\n                        var ua = window.navigator.userAgent;\r\n                        var msie = ua.indexOf(\"MSIE \");\r\n\r\n                        if (msie > 0 || !!navigator.userAgent.match(\/Trident.*rv\\:11\\.\/))      \/\/ If Internet Explorer\r\n                        {\r\n                            txtArea1.document.open(\"txt\/html\", \"replace\");\r\n                            txtArea1.document.write(tab_text);\r\n                            txtArea1.document.close();\r\n                            txtArea1.focus();\r\n                            sa = txtArea1.document.execCommand(\"SaveAs\", true, \"Masav_" + batch_id + ".xls\");\r\n                        }\r\n                        else                 \/\/other browser not tested on IE 11\r\n                            function dl() {var link = document.createElement('a');link.href = \'data:application\/vnd.ms-excel,\' + encodeURIComponent(tab_text);link.download = 'Masav_" + batch_id + ".xls';link.click();;} dl();\r\n\r\n                        return (sa);})<\/script>";
                var fieldhtml = form.addField('custpage_html_printpdf', 'inlinehtml', '', null, null);
                fieldhtml.setDefaultValue(printScript);


                var pydate = batchrec.getFieldValue('custrecord_ilo_masav_batch_pymdate');
                form.addField("msg", "text").setDisplayType('inline').setDefaultValue(num + " transactions were picked to pay by the batch");
                var accountrec = nlapiLoadRecord('account', batchrec.getFieldValue('custrecord_masav_batch_bank'));
                var mosad_number = accountrec.getFieldText('custrecord_ilo_masav_mosad');
                form.addField('lblbatch', 'label', '<b>Batch</b>:' + batchrec.getFieldValue('name'));
                form.addField('lblpymdate', 'label', '<b>Payment Date</b>:' + pydate);
                form.addField('lblaccount', 'label', '<b>Bank account:</b>:' + batchrec.getFieldText('custrecordilo_masav_batch_account'));
                form.addField('lblmosad', 'label', '<b>Mosad:</b>:' + mosad_number);
                //form.addField('createdby', 'label', '<b>Created By</b>:' + batchrec.getFieldText('owner'));
                form.addField('status', 'select', 'New Status', 'customlist_ilo_lst_masav_batchstatus').setDefaultValue(2);
                form.addField('account', 'text', '').setDisplayType('hidden').setDefaultValue(batchrec.getFieldText('custrecordilo_masav_batch_account'));
                form.addField('mosad', 'text', '').setDisplayType('hidden').setDefaultValue(mosad_number);
                form.addField('pymdate', 'text', '').setDisplayType('hidden').setDefaultValue(batchrec.getFieldValue('custrecord_ilo_masav_batch_pymdate'));
                form.addField('batch', 'text', '').setDisplayType('hidden').setDefaultValue(batch_id);
                //if (transactionArray != null) {
                //    downloadExcel(transactionArray, batch_id, pydate,response, form, true);
                //}

            }
            // Errors will be logged in the Execution Log
            catch (ex) {
                //form.addField("msg", "text").setDisplayType('inline').setMaxLength(1500).setDefaultValue(" Error - the bills couldn't fully loaded :" + ex);
                nlapiLogExecution('ERROR', 'Error', 'Error: ' + ex);
            }

        }
        else if (action == 'pay') // execute  a  payment batch
        {
            var params = [];
            var values = [];


            var count = request.getLineItemCount('custpage_transaction_list');
            var paymentdate = request.getParameter('pymdate');
            var status = request.getParameter('status');
            var mosad = request.getParameter('mosad');
            var batchaccount = request.getParameter('account');
            var batch_id = request.getParameter('batch');

            setBillCredits();

            /*******mandatory fields for segments****/
            try {

                //var arrdepartments = []; var departments = nlapiSearchRecord('department', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
                //if (departments != null) {
                //    departments.forEach(function (obj) { arrdepartments[obj.id] = obj.getValue('name') })
                //};
                //default_department_value = arrdepartments.indexOf("N/A");

                //var arrlocations = []; var locations = nlapiSearchRecord('location', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
                //if (locations != null) {
                //    locations.forEach(function (obj) { arrlocations[obj.id] = obj.getValue('name') })
                //};
                //default_location_value = arrlocations.indexOf("N/A");

                //var arrclassifications = []; var classifications = nlapiSearchRecord('classification', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
                //if (classifications != null) {
                //    classifications.forEach(function (obj) { arrclassifications[obj.id] = obj.getValue('name') })
                //};
                //default_classification_value = arrclassifications.indexOf("N/A");
                default_payment_form = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_vendor_payment_form');
                default_department_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_department');
                //default_location_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_location');
                default_classification_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_class');
                var sub = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_masav_subsidiary');

                default_location_value = -1;
                var arrlocations = []; var locations = nlapiSearchRecord('location', null, [new nlobjSearchFilter('subsidiary', null, 'is', sub)], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
                if (locations != null) {
                    locations.forEach(function (obj) { if (default_location_value == -1) { default_location_value = obj.id } })
                };

            }
            catch (e) {
                nlapiLogExecution('ERROR', 'arrlocations', e);

            }
            /*******mandatory fields for segments****/

            // Check how many lines in the sublist


            nlapiLogExecution('debug', 'new payment', 'mosad,count, payment date:' + mosad + ' ' + count + ' ' + paymentdate);

            // This variable will keep track of how many records 
            var num = 0;
            var status_msg = '';
            var batch_transactions = '';
            var isError = false;
            var strFirst = "";
            var strRows = "";
            var strLast = "";
            var sumamount = 0;
            var currentContext = nlapiGetContext();
            var subsidiary = currentContext.subsidiary;
            //var subsidiary_name = nlapiLoadRecord('subsidiary', subsidiary).getFieldValue('name');
            var lastvandor = "";

            var vendorpayment = null;
            var applyLines = 0;
            var transactionArray = new Array();
            var excelnArray = new Array();
            var payments_data = "";
            var sumnet = 0;;
            var sumwht = 0;
            var sumgross = 0;
            var updatefunc = "";

            //var sublist = form.addSubList('custpage_payment_list', 'list', 'New Payments');
            //sublist.addField('tranid', 'text', 'Payment');
            //sublist.addField('vendor', 'text', 'Vendor');
            //sublist.addField('numofbills', 'text', 'Number of Bills ');
            //sublist.addField('amounttotal', 'text', 'Gross Amount ');
            //sublist.addField('amountnet', 'text', 'Net Amount ');
            //sublist.addField('amountwht', 'text', 'WHT Amount ');

            var stop = false;
            var start = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_last_line_execute');

            //for each line in the sublist
            for (var i = start; i <= count; i++) {
                //get the value of the Delete checkbox
                //location.reload();
                if (stop == true) {
                    nlapiLogExecution('debug', 'execute bill', 'stop!');
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_last_line_execute', i);
                    var lastpaymentdata = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments');
                    lastpaymentdata = lastpaymentdata + payments_data;
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments', lastpaymentdata); //approved
                    var html = '<SCRIPT language="JavaScript" type="text/javascript">';
                    html += "location.reload();";
                    html += '</SCRIPT>';
                    var field1 = form.addField('custpage_reload' + i, 'inlinehtml', '', null, null);
                    field1.setDefaultValue(html);
                    break;
                }

                values.push(JSON.stringify({
                    Transaction: request.getLineItemValue('custpage_transaction_list', 'pay', i),
                    internalId: request.getLineItemValue('custpage_transaction_list', 'internalid', i),
                    entity: request.getLineItemValue('custpage_transaction_list', 'custpage_entityid', i),
                    vendorname: request.getLineItemValue('custpage_transaction_list', 'entity', i),
                    currency: request.getLineItemValue('custpage_transaction_list', 'currency', i),
                    currencyid: request.getLineItemValue('custpage_transaction_list', 'custpage_currencyid', i),
                    account: request.getLineItemValue('custpage_transaction_list', 'account', i),
                    tranid: request.getLineItemValue('custpage_transaction_list', 'tranid', i),
                    amountremaining: request.getLineItemValue('custpage_transaction_list', 'fxamountremaining', i),
                }));


                //  nlapiLogExecution('debug', 'new payment', 'custscript_ss_masavexec_param: ' + params['custscript_ss_masavexec_param']);


            }
            nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_prc_data', JSON.stringify(values));

            params['custscript_sendingto'] = nlapiGetContext().user;
            params['custscript_ss_masavexec_batch_id'] = batch_id;
            params['custscript_ss_masavexec_status'] = status;
            params['custscript_ss_masavexec_mosad'] = mosad;
            params['custscript_ss_masavexec_account'] = batchaccount;
            params['custscript_ss_masavexec_count'] = count;
            nlapiScheduleScript('customscript_ilo_ss_masavexec', null, params);


            var paramsurl = new Array();
            paramsurl['searchid'] = "customdeploy_ilo_ss_masav_exec";
            paramsurl['date'] = 'TODAY';

            //nlapiSetRedirectURL('TASKLINK', "LIST_SCRIPTSTATUS", null, null, paramsurl);
            form.addField("msg", "inlinehtml").setDefaultValue("<div style='font-size:20px'>Processing will take some time. You will get the results by email when done</div>");


        }
        //form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue(status_msg);
        response.writePage(form);
    }
}


function masav_exec() {
    var context = nlapiGetContext();
    var values = context.getSetting('SCRIPT', 'custscript_ss_masavexec_param');
    var batch_id = context.getSetting('SCRIPT', 'custscript_ss_masavexec_batch_id');
    var status = context.getSetting('SCRIPT', 'custscript_ss_masavexec_status');
    var mosad = context.getSetting('SCRIPT', 'custscript_ss_masavexec_mosad');
    var batchaccount = context.getSetting('SCRIPT', 'custscript_ss_masavexec_account');
    var count = context.getSetting('SCRIPT', 'custscript_ss_masavexec_count');


    nlapiLogExecution('debug', 'new payment', 'all values: ' + values);

    setBillCredits();

    /*******mandatory fields for segments****/
    try {

        //var arrdepartments = []; var departments = nlapiSearchRecord('department', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
        //if (departments != null) {
        //    departments.forEach(function (obj) { arrdepartments[obj.id] = obj.getValue('name') })
        //};
        //default_department_value = arrdepartments.indexOf("N/A");

        //var arrlocations = []; var locations = nlapiSearchRecord('location', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
        //if (locations != null) {
        //    locations.forEach(function (obj) { arrlocations[obj.id] = obj.getValue('name') })
        //};
        //default_location_value = arrlocations.indexOf("N/A");

        //var arrclassifications = []; var classifications = nlapiSearchRecord('classification', null, [new nlobjSearchFilter('subsidiary', null, 'is', 'nlapiGetContext().subsidiary')], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
        //if (classifications != null) {
        //    classifications.forEach(function (obj) { arrclassifications[obj.id] = obj.getValue('name') })
        //};
        //default_classification_value = arrclassifications.indexOf("N/A");
        default_payment_form = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_vendor_payment_form');
        default_department_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_department');
        default_classification_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_class');
        var sub = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_masav_subsidiary');
        var batchaccount = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_masav_batch_bank');
        var clearing = nlapiLoadRecord("account", batchaccount).getFieldValue("custrecord_ilo_masav_clearing_account");
        batchaccount = clearing;
        default_location_value = -1;
        var arrlocations = []; var locations = nlapiSearchRecord('location', null, [new nlobjSearchFilter('subsidiary', null, 'is', sub)], [new nlobjSearchColumn('name', null, null), new nlobjSearchColumn('internalid', null, null)]);
        if (locations != null) {
            locations.forEach(function (obj) { if (default_location_value == -1) { default_location_value = obj.id } })
        };

    }
    catch (e) {
    }
    /*******mandatory fields for segments****/

    // Check how many lines in the sublist


    //nlapiLogExecution('debug', 'new payment', 'mosad,count, payment date:' + mosad + ' ' + count + ' ' + paymentdate);

    // This variable will keep track of how many records 
    var num = 0;
    var status_msg = '';
    var batch_transactions = '';
    var isError = false;
    var strFirst = "";
    var strRows = "";
    var strLast = "";
    var sumamount = 0;
    var currentContext = nlapiGetContext();
    var subsidiary = currentContext.subsidiary;
    //var subsidiary_name = nlapiLoadRecord('subsidiary', subsidiary).getFieldValue('name');
    var lastvandor = "";

    var vendorpayment = null;
    var applyLines = 0;
    var transactionArray = new Array();
    var excelnArray = new Array();
    var payments_data = "";
    var sumnet = 0;;
    var sumwht = 0;
    var sumgross = 0;
    var updatefunc = "";

    var stop = false;
    var start = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_last_line_execute');
    var values = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_prc_data');
    var paymentdate = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_pymdate');
    nlapiLogExecution('debug', 'new payment', 'original values ' + values);

    values = JSON.parse(values);
    nlapiLogExecution('debug', 'parse', 'parse ' + values);

    //values = values.split("},{");
    //nlapiLogExecution('debug', 'split', 'split ' + values);

    //for each line in the sub
    for (var i = start - 1; i < count; i++) {
        //get the value of the Delete checkbox
        //location.reload();
        context.setPercentComplete((i * 100 / count).toFixed(2));

        var curbill = values[i];
        nlapiLogExecution('debug', 'new payment', 'current bill ' + i + ' : ' + curbill);

        curbill = JSON.parse(curbill);
        nlapiLogExecution('debug', 'new payment', 'replace ' + i + ' : ' + curbill);


        var savedTransaction = curbill.Transaction;
        var internalId = curbill.internalId;
        nlapiLogExecution('debug', 'new payment', 'loop payment' + i + ' id=' + internalId + ' savedTransaction:' + savedTransaction);

        //         If not checked or reject batch, refect the transaction
        if (savedTransaction == 'F' || status == 3) {
            nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', '');
        }
        // If it's checked, pay the transaction
        else if (savedTransaction == 'T') {
            var excelbill = new Object();
            // Get the transaction internal ID
            var entity = curbill.entity;
            var vendorrec = nlapiLoadRecord('vendor', entity);
            nlapiLogExecution('debug', 'starting payment for ' + entity);
            var taxpayerid = vendorrec.getFieldValue('custentityil_tax_payer_id');
            var accountid = vendorrec.getFieldValue('payablesaccount');

            var vendorname = curbill.entity;
            var batchdate = paymentdate;
            var currency = curbill.currency;
            var currencyid = curbill.currencyid
            var account = curbill.account;
            var tranid = curbill.tranid;
            var amountremaining = curbill.amountremaining;
            amountremaining = amountremaining.replace(/,/g, '');


            // Get the transaction type
            try {
                nlapiLogExecution('debug', 'search bank details for bank:' + entity);
                var results = nlapiSearchRecord('customrecord_ilo_vendor_bank', null, new nlobjSearchFilter('custrecord_ilo_vendor_bank_vendor', null, 'anyof', entity), [new nlobjSearchColumn('custrecord_ilo_vendor_bank_vendor').setSort(true), new nlobjSearchColumn('custrecord_ilo_vendor_bank_bank'), new nlobjSearchColumn('custrecord_ilo_bank_details_account')]);
                // loop over vendor bank to find the right one (we can't filter by vendor due to Netsuite internal bug
                var vendorbankid = '0';
                for (var l = 0; l < results.length; l++) {
                    if (results[l].getValue('custrecord_ilo_vendor_bank_vendor') == entity)
                        vendorbankid = results[l].getValue('custrecord_ilo_vendor_bank_bank');
                }
                if (vendorbankid == 0) {
                    status_msg = " Error - Couldn't create payment for bill:" + internalId + ' Error: No bank for vendor ' + entity + ' <br/>\n\r';
                    nlapiLogExecution('ERROR', 'Error', status_msg);
                    continue;
                }
                nlapiLogExecution('debug', 'vendorbankid' + vendorbankid);

                nlapiLogExecution('debug', 'creating payment for vendor: ' + entity + ' vendor:' + vendorname + ' lastvendor:' + lastvandor + ' status:' + status);
                // go to dynamic mode so you can find the related sublist item
                if (vendorname != lastvandor) { // we want only 1 payment record for each vendor - if new vendor create the record
                    if (vendorpayment != null) { //save the last record
                        //if approved commit the record
                        if (status == 2 && applyLines > 0) { //approve
                            //if (nlapiLookupField('vendorbill', internalId, 'status') != "Paid In Full")
                            //    nlapiSubmitField('vendorbill', internalId, 'custbodyilo_selected_for_payment', 'F');
                            vendorpayment.setFieldValue('trandate', paymentdate);
                            nlapiLogExecution('debug', 'saving payment!!', 'saving payment!!');
                            var recpaymentId = nlapiSubmitRecord(vendorpayment, { disabletriggers: false, enablesourcing: false });
                            nlapiLogExecution('debug', 'status', nlapiLookupField('vendorbill', internalId, 'status'));
                            if (nlapiLookupField('vendorbill', internalId, 'status') != "paidInFull")
                                nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', '');

                            //var func = "function updatepym() {debugger; nlapiSubmitRecord(nlapiLoadRecord('vendorpayment', " + recpaymentId + ", { recordmode: 'dynamic' }), { disabletriggers: false, enablesourcing: true }); }";
                            //var html = '<SCRIPT language="JavaScript" type="text/javascript">';
                            //html += "updatepym();";
                            //html += "setTimeout(updatepym, 5500);";
                            //html += func;
                            //html += '</SCRIPT>';
                            //var field1 = form.addField('custpage_alertmode_' + i, 'inlinehtml', '', null, null);
                            //field1.setDefaultValue(html);


                            // nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', batch_id);

                            //for (var z = 1; z < 150000; z++) {
                            //}
                            vendorpayment = nlapiLoadRecord('vendorpayment', recpaymentId);

                            // push a dynamic field into the environment

                            payments_data += recpaymentId + ",";
                            nlapiLogExecution('debug', 'new payment', 'payment saved:' + recpaymentId);
                            sumamount += parseFloat(vendorpayment.getFieldValue("total"));
                            var transaction = new Object();
                            transaction['tranid'] = vendorpayment.getFieldValue('transactionnumber');
                            transaction['vendor'] = lastvandor;
                            transaction['numofbills'] = applyLines.toFixed(0);
                            var netotopay = 0;
                            var total = 0;
                            var wht = 0;
                            for (var lineNum = 1; lineNum <= vendorpayment.getLineItemCount('apply'); lineNum++) {
                                if (vendorpayment.getLineItemValue('apply', 'apply', lineNum) == 'T') {
                                    total += parseFloat(vendorpayment.getLineItemValue('apply', 'total', lineNum));
                                    netotopay += parseFloat(vendorpayment.getLineItemValue('apply', 'amount', lineNum));
                                    var billid = vendorpayment.getLineItemValue('apply', 'internalid', lineNum)
                                    if (billcredits != null && billcredits[billid] != null) //credit with minus
                                        total = total + parseFloat(billcredits[billid]["creditamount"]);

                                }
                            }

                            total = total.toFixed(2);
                            netotopay = netotopay.toFixed(2);

                            wht = total - netotopay;
                            wht = parseFloat(total - netotopay);
                            wht = wht.toFixed(2);
                            transaction['amounttotal'] = total;
                            transaction['amountwht'] = wht;
                            transaction['amountnet'] = netotopay;
                            transactionArray.push(transaction);
                            sumnet += Math.abs(parseFloat(netotopay));
                            sumwht += Math.abs(parseFloat(wht));
                            sumgross += Math.abs(parseFloat(total));

                            //status_msg += "<br> Bill: " + internalId + " New Payment was created - id: " + recpaymentId;
                            num++;
                            applyLines = 0;


                        }
                    }
                    var remainingusg = nlapiGetContext().getRemainingUsage();
                    nlapiLogExecution('debug', 'execute bill', i + ' remaining: ' + remainingusg);
                    var nextentity = "0";
                    if (i < count)
                        var nextentity = curbill.entity;

                    if (remainingusg <= 350) {
                        nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_last_line_execute', i);
                        var lastpaymentdata = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments');
                        lastpaymentdata = lastpaymentdata + payments_data;
                        nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments', lastpaymentdata);
                        var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'dailyupdate', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                        stop = true;
                    }
                    vendorpayment = nlapiCreateRecord('vendorpayment', { recordmode: 'dynamic', 'entity': entity });
                    nlapiLogExecution('debug', 'new payment', 'created record payment for entity ' + entity + ' batchdate:' + paymentdate + ' currencyid:' + currencyid);
                    vendorpayment.setFieldValue('trandate', paymentdate);
                    vendorpayment.setFieldValue('customform', default_payment_form);
                    nlapiLogExecution('debug', 'apacct', vendorpayment.getFieldValue('apacct'));
                    if (vendorpayment.getFieldValue('apacct') != accountid)
                        vendorpayment.setFieldValue('apacct', accountid);
                    nlapiLogExecution('debug', 'apacct', vendorpayment.getFieldValue('apacct'));

                    vendorpayment.setFieldValue('currency', currencyid);
                    vendorpayment.setFieldValue('account', batchaccount);
                    vendorpayment.setFieldValue('autoapply', 'F');
                    vendorpayment.setFieldValue('memo', 'Masav Batch Payment:' + batch_id);
                    /*******mandatory fields for segments****/
                    try {
                        nlapiLogExecution('audit', 'default_location_value', default_location_value);
                        if (vendorpayment.getFieldValue('location') == (null || ''))
                            vendorpayment.setFieldValue('location', default_location_value);
                        if (vendorpayment.getFieldValue('department') == (null || ''))
                            vendorpayment.setFieldValue('department', default_department_value);
                        if (vendorpayment.getFieldValue('class') == (null || ''))
                            vendorpayment.setFieldValue('class', default_classification_value);
                    }
                    catch (e) {
                        nlapiLogExecution('error', 'mandatory field', e);

                    }
                    /*******mandatory fields for segments****/
                }
                lastvandor = vendorname;
                //vendorpayment.setFieldValue('CUSTBODY_ILO_PAYMENT_METHOD', '2');
                nlapiLogExecution('debug', 'new payment', 'now seaching the bill in line items ' + internalId);

                //work the line items
                var lineNum = vendorpayment.findLineItemValue('apply', 'internalid', internalId);
                if (lineNum == "-1") {
                    nlapiLogExecution('error', 'new payment', 'can not find bill to apply in new payment - billid:' + internalId);
                    status_msg = " Error - Couldn't create payment for bill:" + internalId + ' Error: Can not find bill to apply in new payment - billid:' + internalId + ' <br/>\n\r';
                    continue;
                }
                nlapiLogExecution('debug', 'new payment', 'line' + lineNum);
                //form.addField("msg12", "text").setDisplayType('inline').setMaxLength(1500).setDefaultValue(" line:" + lineNum + ' internalId:' + internalId + ' entity:' + entity);
                vendorpayment.selectLineItem('apply', lineNum);
                vendorpayment.setCurrentLineItemValue('apply', 'apply', 'T');
                vendorpayment.setCurrentLineItemValue('apply', 'amount', amountremaining);
                vendorpayment.commitLineItem('apply');
                applyLines++;

                //excelbill = new Object();
                //excelbill["entity"] = vendorpayment.getFieldText('entity');
                //excelbill["tranid"] = request.getLineItemValue('custpage_transaction_list', 'tranid', count);
                //excelbill["trandate"] = request.getLineItemValue('custpage_transaction_list', 'trandate', count);
                //excelbill["duedate"] = request.getLineItemValue('custpage_transaction_list', 'duedate', count);
                //excelbill["total"] = amountremaining;
                //excelbill["wht"] = request.getLineItemValue('custpage_transaction_list', 'custpage_whtamount', count);
                //excelbill['wht_rate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent');
                //excelbill['wht_vendorrate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent_vendor');
                //excelbill["currency"] = currency;
                //excelbill["payment"] = "created";
                //excelnArray.push(excelbill);

            }
            catch (ex) {
                // Errors will be logged in the Execution Log
                //status_msg = " Error - Couldn't create payment for bill:" + internalId + ' Error:' + ex + '<br/>\n\r';
                nlapiLogExecution('ERROR', 'Error', ex);
                //excelbill = new Object();
                //excelbill["entity"] = vendorname;
                //excelbill["tranid"] = request.getLineItemValue('custpage_transaction_list', 'tranid', i);
                //excelbill["trandate"] = request.getLineItemValue('custpage_transaction_list', 'trandate', i);
                //excelbill["duedate"] = request.getLineItemValue('custpage_transaction_list', 'duedate', i);
                //excelbill["total"] = amountremaining;
                //excelbill["wht"] = request.getLineItemValue('custpage_transaction_list', 'custpage_whtamount', i);
                //excelbill["currency"] = currency;
                //excelbill["payment"] = "Not OK: " + ex;

                //excelnArray.push(excelbill);

                continue;
            }

        }

    }
    nlapiLogExecution('debug', 'new payment', 'last line:' + applyLines + ' ' + status);
    try {

        //if approved commit the record - this code is for last payment
        if (status == 2 && applyLines > 0) { //approve
            //if (nlapiLookupField('vendorbill', internalId, 'status') != "Paid In Full")
            //    nlapiSubmitField('vendorbill', internalId, 'custbodyilo_selected_for_payment', 'F');
            nlapiLogExecution('debug', 'new payment', 'saving last payment applyLines:' + applyLines);
            vendorpayment.setFieldValue('trandate', paymentdate);
            nlapiLogExecution('debug', 'saving payment!!', 'saving payment!!');
            var recpaymentId = nlapiSubmitRecord(vendorpayment, { disabletriggers: false, enablesourcing: false });
            nlapiLogExecution('debug', 'new payment', 'Last payment saved:' + recpaymentId);
            //var func = "function updatepym() {debugger; nlapiSubmitRecord(nlapiLoadRecord('vendorpayment', " + recpaymentId + ", { recordmode: 'dynamic' }), { disabletriggers: false, enablesourcing: true }); }";
            //var html = '<SCRIPT language="JavaScript" type="text/javascript">';
            //html += "updatepym();";
            //html += "setTimeout(updatepym, 3500);";
            //html += func;
            //html += '</SCRIPT>';
            //// push a dynamic field into the environment
            //var field0 = form.addField('custpage_alertmodelastpayment', 'inlinehtml', '', null, null);
            //field0.setDefaultValue(html);
            //for (var z = 1; z < 75000; z++) {
            //}
            if (nlapiLookupField('vendorbill', internalId, 'status') != "paidInFull")
                nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', '');
            vendorpayment = nlapiLoadRecord('vendorpayment', recpaymentId);

            var transaction = new Object();
            transaction['tranid'] = vendorpayment.getFieldValue('transactionnumber');
            transaction['vendor'] = vendorpayment.getFieldText('entity');
            transaction['wht_rate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent');
            transaction['wht_vendorrate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent_vendor');
            transaction['numofbills'] = applyLines.toFixed(0);
            var netotopay = 0;
            var total = 0;
            var wht = 0;
            for (var lineNum = 1; lineNum <= vendorpayment.getLineItemCount('apply'); lineNum++) {
                if (vendorpayment.getLineItemValue('apply', 'apply', lineNum) == 'T') {
                    total += parseFloat(vendorpayment.getLineItemValue('apply', 'total', lineNum));
                    netotopay += parseFloat(vendorpayment.getLineItemValue('apply', 'amount', lineNum));
                }
            }
            wht = parseFloat(total - netotopay);
            wht = wht.toFixed(2);
            transaction['amounttotal'] = total;
            transaction['amountwht'] = wht;
            transaction['amountnet'] = netotopay;
            transactionArray.push(transaction);

            payments_data += recpaymentId + ",";
            sumamount += parseFloat(vendorpayment.getFieldValue("total"));
            sumnet += Math.abs(parseFloat(netotopay));
            sumwht += Math.abs(parseFloat(wht));
            sumgross += Math.abs(parseFloat(total));

            status_msg += "<br> Bill: " + internalId + " New Payment was created - id: " + recpaymentId;
            num++;

        }
        // sublist.setLineItemValues(transactionArray);


        if (status != 3) {
            nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_status', '2'); //approved
            var lastpaymentdata = nlapiLookupField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments');
            lastpaymentdata = lastpaymentdata + payments_data;
            nlapiLogExecution('debug', '!!!! 2 submit payment data', lastpaymentdata);
            nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments', lastpaymentdata); //approved
            var data = strFirst + "\r\n" + strRows + strLast + "\r\n";
            var folder = nlapiCreateRecord('folder');
            //  folder.setFieldValue('name', 'masav_' + batch_id + '_' + GetTodayDate() + Math.floor((Math.random() * 1000) + 1));
            //   var parentFolderid = GetFolderId(batch_id);
            //  folder.setFieldValue('parent', parentFolderid);
            // var FolderId = nlapiSubmitRecord(folder, true);
        }
        else {
            nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_status', '3'); //rejected
            //form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue('batch ' + batch_id + ' was rejected');
        }
    }
    catch (ex) {
        // Errors will be logged in the Execution Log
        status_msg = " Error - Couldn't create Last payment. Bill:" + internalId + ' Error:' + ex + '<br/>\n\r';
        //if (start == 1)
        //    downloadExcel(excelnArray, batch_id, response, form);
        // form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue('ERROR: ' + status_msg);
        nlapiLogExecution('ERROR', 'Error', status_msg);
    }
    context.setPercentComplete((100));
    var sendingto = context.getSetting('SCRIPT', 'custscript_sendingto');
    html = "The masav processing is done. Please Go to step 3 to see the results";
    nlapiSendEmail(sendingto, sendingto, 'Masav Processing is Done', html, null, null, null, null, false);

}


var billcredits = new Array();
function setBillCredits() {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_ilo_bill_credit');
        var searchrun = search.runSearch();

        if (searchrun != null) {
            var searchid = 0;
            do {
                var searchResults = searchrun.getResults(searchid, searchid + 1000);
                searchResults.forEach(function (searchResult) {
                    var billcreditobj = new Object();
                    var creditid = searchResult.id;
                    var billid = searchResult.getValue('internalid', 'appliedToTransaction');
                    var creditamount = searchResult.getValue('fxamount');

                    billcreditobj["creditid"] = creditid;
                    billcreditobj["creditamount"] = creditamount;
                    billcredits[billid] = billcreditobj;
                    return true;
                });
                searchid += 1000;
            } while (whtCertsearch.length >= 1000);
        }
    }
    catch (e) { }

}

function searchWHTbyDate(date) {
    if (whtResults.length > 0)
        return whtResults;
    var whtCertfilters = new Array();
    try {
        whtCertfilters[0] = new nlobjSearchFilter('custrecord_vendor_cert_fromdate', null, 'onorbefore', date);
        whtCertfilters[1] = new nlobjSearchFilter('custrecord_vendor_cert_enddate', null, 'onorafter', date);
        var whtCertcolumns = new Array();
        whtCertcolumns[0] = new nlobjSearchColumn(
            'custrecord_vendor_cert_fromdate');
        whtCertcolumns[1] = new nlobjSearchColumn(
            'custrecord_vendor_cert_enddate');
        whtCertcolumns[2] = new nlobjSearchColumn(
            'custrecord_vendor_cert_percent');
        whtCertcolumns[3] = new nlobjSearchColumn(
            'custrecord_vendor_cert_vendorid');
        var whtCertsearchobj = nlapiCreateSearch('customrecord_oil_vendor_cert', whtCertfilters, whtCertcolumns);
        var whtCertsearchrun = whtCertsearchobj.runSearch();

        if (whtCertsearchrun != null) {
            var searchid = 0;
            do {
                var whtCertsearch = whtCertsearchrun.getResults(searchid, searchid + 1000);
                whtCertsearch.forEach(function (whtCert) {
                    whtResults[whtCert.getValue('custrecord_vendor_cert_vendorid')] = {
                        whtCertPercent: whtCert.getValue('custrecord_vendor_cert_percent')
                    };

                });
                searchid += 1000;
            } while (whtCertsearch.length >= 1000);
        };
    }
    catch (e) { }
    return whtResults;
}

function SaveData(data, response, form, folderId) {
    var empFile = nlapiCreateFile('MASAV.TXT', 'PLAINTEXT', data);
    empFile.setIsOnline(true);
    empFile.setFolder(folderId);
    empFile.setEncoding('UTF-8');
    nlapiSubmitFile(empFile);
}

function convertMasavDate(odate) { // Convert to Shaam date format - from 28/4/2016 to YYYYMMDD
    if (odate == undefined)
        return '';
    var newDate = '';
    var arr = odate.split("/");
    newDate = PadLeftWithZero(arr[2].substring(2, 4), 2) + '' + PadLeftWithZero(arr[1], 2) + '' + PadLeftWithZero(arr[0], 2);
    return newDate;
}

function GetTodayDate() {
    var now = new Date();
    now.setTime(now.getTime() + (10 * 60 * 60 * 1000));
    var nowDate = now.getYear().toString().substring(1, 3) + PadLeftWithZero((now.getMonth() + 1), 2) + PadLeftWithZero((now.getDate()), 2);
    return nowDate;
}

function GetFirstDayForPeriod(odate) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (odate == undefined)
        return '';
    var newDate = '';
    var arr = odate.split(" ");
    newDate = "01" + PadLeftWithZero(months.indexOf(arr[0]) + 1, 2) + arr[1];
    return newDate;
}

function convertPostingPeriod(odate) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (odate == undefined)
        return '';
    var newDate = '';
    var arr = odate.split(" ");
    newDate = arr[1] + PadLeftWithZero(months.indexOf(arr[0]) + 1, 2);
    return newDate;
}

function GetARShaamCode(type) {
    if (type == 'Shaam-S')
        return 'S';

    return '9';

}

function GetAPShaamCode(type) {
    if (type == 'Shaam-S')
        return 'T';

    return '9';
}

function PadWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res += '0';
    }
    return res;
}

function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    if (maxlength < res.length)
        return res.substring(0, maxlength);
    return res;
}

function PadLeftWithNines(data, maxlength) {
    if (data == undefined)
        data = '9';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '9' + res;
    }
    return res;
}

function PadRightWithSpaces(data, maxlength) {
    if (data == undefined)
        data = '';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = res + ' ';
    }

    if (maxlength < res.length) {
        return res.substring(0, maxlength);
    }
    return res;
}

function PadLeftWithSpaces(data, maxlength) {
    if (data == undefined)
        data = '';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = ' ' + res;
    }

    if (maxlength < res.length) {
        return res.substring(0, maxlength);
    }
    return res;
}

function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
    response.setContentType('PLAINTEXT', 'MASAV.txt');
    // write response to the client
    response.write(data);
}

function getColVal(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getValue(columns[i]);
    }

    return value;
}

function getColText(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getText(columns[i]);
    }

    return value;
}

function GetFolderId(batch) {
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', 'Masav_' + batch);

    // get two columns so we can build a drop down list: file name and file internal ID
    var columns = new Array();
    var filename = new nlobjSearchColumn('name', 'file');
    var fileid = new nlobjSearchColumn('internalid', 'file');

    //use this syntax so we can pass in the object reference to get the file info, not the
    //text representation of column lookup
    columns[0] = filename;
    columns[1] = fileid;
    var folderid = -1;
    // perform the search and loop through the findings
    var searchResult = nlapiSearchRecord('folder', null, filters, columns);
    if (searchResult) {
        for (var i = 0; i < searchResult.length; i++) {
            var f = searchResult[i];
            folderid = f.id;
        };
    };
    return folderid;
}

function downloadExcel(results, batch, pydate, response, form, beforepay) {
    // XML content of the file
    var xmlStr = '<?xml version="1.0" encoding="utf-8"?><?mso-application progid="Excel.Sheet"?>';
    xmlStr += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlStr += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
    xmlStr += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    xmlStr += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
    xmlStr += 'xmlns:html="http://www.w3.org/TR/REC-html40">';
    xmlStr += '<Styles>';
    xmlStr += '<Style ss:ID="company">';
    xmlStr += '<Alignment ss:Horizontal="Center"/>';
    xmlStr += '<Font ss:Bold="1"/>';
    xmlStr += '</Style> <Style ss:ID="error">';
    xmlStr += '<Alignment ss:Horizontal="Center"/>';
    xmlStr += '<Interior ss:Color="#007ACC" ss:Pattern="Solid" />';
    xmlStr += '<Font ss:Bold="1"/>';
    xmlStr += '</Style> <Style ss:ID="header">';
    xmlStr += '<Alignment ss:Horizontal="Center" />';
    xmlStr += '<Font ss:Size="8"  ss:Color="#fefefe"  ss:Bold="0"/>';
    xmlStr += '<Interior ss:Color="#007ACC" ss:Pattern="Solid"/>';
    xmlStr += '</Style> <Style ss:ID="maintitle">';
    xmlStr += '<Alignment ss:Horizontal="Center"/>';
    xmlStr += '<Font ss:Size="14" ss:Bold="1"/>';
    xmlStr += '<Interior ss:Pattern="Solid"/>';
    xmlStr += '</Style> <Style ss:ID="Default" ss:Name="Normal">';
    xmlStr += '<Alignment ss:Vertical="Bottom" ss:Horizontal="Center"/>';
    xmlStr += '<Borders/>';
    xmlStr += '    <Font ss:FontName="Arial" ss:Size="8"/>';
    xmlStr += '<Interior/>';
    xmlStr += '   <NumberFormat ss:Format="&quot;ILS&quot;#,##0.00_);(&quot;ILS&quot;#,##0.00)"/>';
    xmlStr += '<Protection/>';
    xmlStr += '</Style>';
    xmlStr += '<Style ss:ID="s__TIMEOF DAY"><NumberFormat ss:Format="Medium Time"/></Style>';
    xmlStr += '<Style ss:ID="s__DATETIME"><NumberFormat ss:Format="General Date"/></Style>';
    xmlStr += '<Style ss:ID="s__DATETIMETZ"><NumberFormat ss:Format="General Date"/></Style>';
    xmlStr += '<Style ss:ID="s__DATE"><NumberFormat ss:Format="Short Date"/>';
    xmlStr += '</Style><Style ss:ID="s__text"></Style><Style ss:ID="s__currency"><NumberFormat ss:Format="Currency"/></Style>';
    xmlStr += '<Style ss:ID="s__percent"><NumberFormat ss:Format="Percent"/></Style>';
    xmlStr += '<Style ss:ID="s1_b_text"><Alignment ss:Indent="1"/><Font ss:FontName="Verdana" x:Family="Swiss" ss:Size="8" ss:Color="#000000" ss:Bold="1"/></Style>';
    xmlStr += '<Style ss:ID="s_b_text"><Font ss:FontName="Verdana" x:Family="Swiss" ss:Size="8" ss:Color="#000000" ss:Bold="1"/></Style>';
    xmlStr += '<Style ss:ID="s2__text"><Alignment ss:Indent="2"/></Style>';
    xmlStr += '<Style ss:ID="s_b_currency"><Font ss:FontName="Verdana" x:Family="Swiss" ss:Size="8" ss:Color="#000000" ss:Bold="1"/><NumberFormat ss:Format="Currency"/></Style>';
    xmlStr += '<Style ss:ID="s_currency_nosymbol"><Font ss:FontName="Verdana" x:Family="Swiss" ss:Size="8" ss:Color="#000000" /><NumberFormat ss:Format="#,##0.00_);[Red]\(#,##0.00\)"/></Style>';
    xmlStr += '<Style ss:ID="s1__text"><Alignment ss:Indent="1"/></Style>';
    xmlStr += '<Style ss:ID="s_b_currency_X"><Font ss:FontName="Verdana" x:Family="Swiss" ss:Size="8" ss:Color="#000000" ss:Bold="1"/><Interior ss:Color="#f0e0e0" ss:Pattern="Solid"/><NumberFormat ss:Format="Currency"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_he_IL"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;ILS&quot;#,##0.00_);(&quot;ILS&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_en_US"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;$&quot;#,##0.00_);(&quot;$&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_en_CA"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;Can$&quot;#,##0.00_);(&quot;Can$&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_fr_FR_EURO"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;€&quot;#,##0.00_);(&quot;€&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_en_GB"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;£&quot;#,##0.00_);(&quot;£&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_ko_KR"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;KRW&quot;#,##0.00_);(&quot;KRW&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_zh_CN"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;Y&quot;#,##0.00_);(&quot;Y&quot;#,##0.00)"/></Style>';
    xmlStr += '<Style ss:ID="s__currency_en_NZ"><Alignment ss:Vertical="Center" ss:Horizontal="Right"/><NumberFormat ss:Format="&quot;$NZ&quot;#,##0.00_);(&quot;$NZ&quot;#,##0.00)"/></Style>';
    xmlStr += '</Styles>';

    xmlStr += '<Worksheet ss:Name="מסב2">';

    var sub = batchrec.getFieldText('custrecord_masav_subsidiary');
    try {
        sub = sub.substr(sub.lastIndexOf(':') + 2, sub.length - 1)
    }
    catch (e) { };
    var header = '<Row><Cell ss:StyleID="maintitle" ss:MergeAcross="8"><Data ss:Type="String">דוח חשבוניות ששולמו במסב לקובץ מספר ' + batch + '</Data></Cell></Row>';
    if (beforepay)
        header = '<Row><Cell ss:StyleID="maintitle" ss:MergeAcross="8"><Data ss:Type="String">דוח חשבוניות מסב לקובץ מספר ' + batch + '</Data></Cell></Row>';

    header +=
        '<Row>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">תאריך</Data></Cell>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">' + GetTodayDateFormated() + '</Data></Cell>' +
        '</Row>' +
        '<Row>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">חברה</Data></Cell>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">' + sub + '</Data></Cell>' +
        '</Row>' +
        '<Row>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">תאריך תשלום </Data></Cell>' +
        '<Cell ss:StyleID="Default"><Data ss:Type="String">' + pydate + '</Data></Cell>' +
        '</Row>';

    xmlStr += '<Table>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
        header +
        '<Row>' +
        '<Cell ss:StyleID="header" ><Data ss:Type="String">Vendor</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">Bill</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">Date</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">Due Date</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">Amount Remaining</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">WHT Amount</Data></Cell>' +
        '<Cell ss:StyleID="header"><Data ss:Type="String">Currency</Data></Cell>' +
        '</Row>';
    for (var i = 0; i < results.length; i++) {
        xmlStr += '<Row>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["entity"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["tranid"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["trandate"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["duedate"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="Number">' + results[i]["totaltopay"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="Number">' + results[i]["custpage_whtamount"] + '</Data></Cell>' +
            '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["currency"] + '</Data></Cell>' +
            '</Row>';
    }

    xmlStr += '<Row>' +
        '<Cell ss:StyleID="error"><Data ss:Type="String">TOTAL</Data></Cell>' +
        '<Cell ss:StyleID="error"><Data ss:Type="String"></Data></Cell>' +
        '<Cell ss:StyleID="error"><Data ss:Type="String"></Data></Cell>' +
        '<Cell ss:StyleID="error"><Data ss:Type="String"></Data></Cell>' +
        '<Cell ss:StyleID="error" ss:Formula="=SUM(R[-' + (results.length) + ']C:R[-1]C)"><Data ss:Type="Number"></Data></Cell>' +
        '<Cell ss:StyleID="error" ss:Formula="=SUM(R[-' + (results.length) + ']C:R[-1]C)"><Data ss:Type="Number"></Data></Cell>' +
        '<Cell ss:StyleID="error"><Data ss:Type="String"></Data></Cell>' +
        '</Row>';
    xmlStr += '</Table></Worksheet></Workbook>';
    xmlStr = xmlStr.split('>NaN<').join('>0<');
    //create file
    var xlsFile = nlapiCreateFile('masav_pay_bills_' + GetTodayDate() + Math.floor((Math.random() * 1000) + 1) + '.xls', 'EXCEL', nlapiEncrypt(xmlStr, 'base64'));
    var FolderId = GetFolderId(batch);
    xlsFile.setIsOnline(true);
    xlsFile.setFolder(FolderId);
    xlsFile.setEncoding('UTF-8');
    nlapiSubmitFile(xlsFile);

    var link = form.addField("custpage_ilo_downloads", "url", "", 'custom', "download")
        .setDisplayType("inline")
        .setLinkText("Download Masav Reports")
        .setDefaultValue("/core/media/downloadfolder.nl?id=" + FolderId + "&_xt=&_xd=T&e=T");

}
function lineinit(type) {
    var wht_zero = nlapiGetCurrentLineItemValue(type, 'custpage_whtrate') == "0.0%";
    if (!wht_zero)
        nlapiDisableLineItemField(type, 'fxamountremaining', true);
    else
        nlapiDisableLineItemField(type, 'fxamountremaining', false);

}
function validateline(type) {
    debugger;
    var gross = nlapiGetCurrentLineItemValue(type, 'fxamountremaining');
    nlapiSetCurrentLineItemValue(type, 'totaltopay', gross);
    //nlapiSetFieldValue('total',total);
    return true;
}
function GetTodayDateFormated() {
    var now = new Date();
    var nowDate = PadLeftWithZero((now.getDate()), 2) + "-" + PadLeftWithZero((now.getMonth() + 1), 2) + "-" + now.getFullYear().toString() + " " + timestamp();
    return nowDate;
}
function timestamp() {
    var str = "";

    var currentTime = new Date();
    var hours = currentTime.getHours();
    currentTime.setHours(currentTime.getHours() + 10);
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var meridian = "";
    if (hours > 12) {
        meridian += "pm";
    } else {
        meridian += "am";
    }
    if (hours > 12) {

        hours = hours - 12;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    str += hours + ":" + minutes + ":" + seconds + " ";

    return str + meridian;
}
function formatMoney(data) {
    try {
        var formatted = Number(data)
        formatted = formatted.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        var toReturn = formatted;
        var arr = formatted.split('.');
        if (arr.length === 2) {
            if (arr[1].length === 1) {
                toReturn = toReturn + '0'
            }
        }
        else {
            toReturn = toReturn + '.00'
        }
        return toReturn
    }
    catch (e) {
    }
    return data;
}


