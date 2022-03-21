var whtResults = [];

function generate_masav(request, response) {
                  var params = new Array();
                params['custscript_batchid'] = "10013";
                var status = nlapiScheduleScript('customscript_ilo_ss_mark_masav_bills', null, params);  
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
                    for (var j = 0; j < columns.length ; j++) {
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
            form.addButton('custpage_print_sublist', 'Print', null)
           // form.setScript('customscript_print_masav_sublist_cs')
            
            var tableElementID = 'custpage_transaction_list_splits'          	
            var printScript =  '<script>  function masavOnPageLoad(){document.getElementById("custpage_print_sublist").addEventListener("click",function(){printPDF()})}function printPDF(){var e=document.getElementById("'+tableElementID+'"),t=document.title.split("-")[0],d=window.open("","PRINT","height=400,width=600");return d.document.write("<html><head><title>"+document.title+"</title>"),d.document.write("</head><style>   table.tya_table {border-collapse: collapse; border: 1px solid black; font-size: 12px;}th.tya_header {text-align:center; font-weight: bold;border: 1px solid black; padding: 2px;} td.tya_cell {text-align:center; border: 1px solid black; padding: 5px; page-break-inside: avoid;} td.tya_cell_total {text-align:center; border: 1px solid black; padding: 5px; page-break-inside: avoid;} .hideView {display : none;}tr {page-break-inside: avoid;}</style><body > "),d.document.write("<h1>"+t+"</h1>"),d.document.write(e.outerHTML),d.document.write("</body></html>"),d.document.close(),d.focus(),d.print(),d.close(),!0}window.onload=masavOnPageLoad; </script>  ' ; 
            var fieldhtml = form.addField('custpage_html2', 'inlinehtml', '', null, null);   
            fieldhtml.setDefaultValue(printScript);
        }
        else if (action == 'execute') // execute  a new payment batch
        {
            form.addField('action', 'text', '').setDisplayType('hidden').setDefaultValue('pay');
            // Check how many lines in the sublist
            var count = request.getLineItemCount('custpage_transaction_list');

            var num = 0;
            var batch_transactions = '';
            var isError = false;
            var sublist = form.addSubList('custpage_transaction_list', 'inlineeditor', 'Bills From Batch to Pay');
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
                            sublist.addField('internalid', 'text', 'Internal ID').setDisplayType('hidden');

                            // Add a column for the Internal ID link
                            sublist.addField('internalidlink', 'text', 'Internal ID');

                            // Get the the search result columns
                            var columns = results[0].getAllColumns();

                            // Add the search columns to the sublist
                            for (var k = 0; k < columns.length; k++) {
                                var name = columns[k].getName();
                                sublist.addField(name, 'text', name);
                            }
                            sublist.addField('custpage_whtrate', 'text', 'wht rate');
                            sublist.addField('custpage_whtamount', 'text', 'wht amount');
                            sublist.addField('custpage_totaltopay', 'text', 'total to pay').setDisplayType('inline');;
                            sublist.addField('custpage_currencyid', 'text', 'total to pay').setDisplayType('hidden');
                            sublist.addField('custpage_entityid', 'text', 'total to pay').setDisplayType('hidden');

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
                                for (var l = 0; l < columns.length ; l++) {
                                    var col = columns[l].getName();
                                    if (col == "custpage_whtrate" || col == "custpage_whtamount" || col == "custpage_totaltopay")
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

                                transaction['custpage_whtrate'] = vendor_wht_rate;
                                transaction['custpage_whtamount'] = (parseFloat(transaction['fxamountremaining']) * (parseFloat(transaction['custpage_whtrate']) / 100)).toFixed(2);
                                transaction['custpage_totaltopay'] = (parseFloat(transaction['fxamountremaining']) - transaction['custpage_whtamount']).toFixed(2);

                                // Attach the transaction object to the transaction array
                                transactionArray[j] = transaction;
                                nlapiLogExecution('Debug', 'WHTObj', 'transactionArray ' + j);
                                num++;

                                sumnet += parseFloat(transaction['custpage_totaltopay']);
                                sumwht += parseFloat(transaction['custpage_whtamount']);
                                sumgross += parseFloat(transaction['fxamountremaining']);

                            }
                        }

                        // Initiate the sublist with the transactionArray
                        sublist.setLineItemValues(transactionArray);
                        sublist.addMarkAllButtons();

                        nlapiLogExecution('Debug', 'WHTObj', 'sublist end ' + i);
                        form.addSubmitButton('Make Payments');
                        form.addField("total", "label", "TOTAL NET: ₪<b>" + sumnet + "</b>" + "  &nbsp;&nbsp;&nbsp;&nbsp;    TOTAL WHT: <b>₪" + sumwht + "</b>   &nbsp;&nbsp;&nbsp;&nbsp;     TOTAL GROSS: <b>₪" + sumgross + "</b>").setMaxLength(500);

                    }
                    // Errors will be logged in the Execution Log
                    catch (ex) {
                        nlapiLogExecution('ERROR', 'Error', 'Transaction ID ' + internalId + ': ' + ex);
                    }
                }

            }
            try {

                form.addField("msg", "text").setDisplayType('inline').setDefaultValue(num + " transactions were picked to pay by the batch");
                var batchrec = nlapiLoadRecord('customrecord_ilo_masav_batch', batch_id);
                var accountrec = nlapiLoadRecord('account', batchrec.getFieldValue('custrecordilo_masav_batch_account'));
                var mosad_number = accountrec.getFieldText('custrecord_ilo_masav_mosad');
                form.addField('lblbatch', 'label', '<b>Batch</b>:' + batchrec.getFieldValue('name'));
                form.addField('lblpymdate', 'label', '<b>Payment Date</b>:' + batchrec.getFieldValue('custrecord_ilo_masav_batch_pymdate'));
                form.addField('lblaccount', 'label', '<b>Bank account:</b>:' + batchrec.getFieldText('custrecordilo_masav_batch_account'));
                form.addField('lblmosad', 'label', '<b>Mosad:</b>:' + mosad_number);
                //form.addField('createdby', 'label', '<b>Created By</b>:' + batchrec.getFieldText('owner'));
                form.addField('status', 'select', 'New Status', 'customlist_ilo_lst_masav_batchstatus').setDefaultValue(2);
                form.addField('account', 'text', '').setDisplayType('hidden').setDefaultValue(batchrec.getFieldText('custrecordilo_masav_batch_account'));
                form.addField('mosad', 'text', '').setDisplayType('hidden').setDefaultValue(mosad_number);
                form.addField('pymdate', 'text', '').setDisplayType('hidden').setDefaultValue(batchrec.getFieldValue('custrecord_ilo_masav_batch_pymdate'));
                form.addField('batch', 'text', '').setDisplayType('hidden').setDefaultValue(batch_id);

            }
            // Errors will be logged in the Execution Log
            catch (ex) {
                //form.addField("msg", "text").setDisplayType('inline').setMaxLength(1500).setDefaultValue(" Error - the bills couldn't fully loaded :" + ex);
                nlapiLogExecution('ERROR', 'Error', 'Error: ' + ex.getDetails());
            }

        }
        else if (action == 'pay') // execute  a  payment batch
        {
            nlapiLogExecution('debug', 'new payment', 'start');
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
                default_location_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_location');
                default_classification_value = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_ilo_setup_wht_class');


            }
            catch (e) {
            }
            /*******mandatory fields for segments****/

            // Check how many lines in the sublist
            var count = request.getLineItemCount('custpage_transaction_list');
            var paymentdate = request.getParameter('pymdate');
            var status = request.getParameter('status');
            var mosad = request.getParameter('mosad');
            var batchaccount = request.getParameter('account');
            var batch_id = request.getParameter('batch');

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
            for (var i = start; i < count + 1; i++) {
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


                var savedTransaction = request.getLineItemValue('custpage_transaction_list', 'pay', i);
                var internalId = request.getLineItemValue('custpage_transaction_list', 'internalid', i);
                nlapiLogExecution('debug', 'new payment', 'loop payment' + i + ' id=' + internalId);

                //         If not checked or reject batch, refect the transaction
                if (savedTransaction == 'F' || status == 3) {
                    nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', '');
                }
                    // If it's checked, pay the transaction
                else if (savedTransaction == 'T') {
                    var excelbill = new Object();
                    // Get the transaction internal ID
                    var entity = request.getLineItemValue('custpage_transaction_list', 'custpage_entityid', i);
                    var vendorrec = nlapiLoadRecord('vendor', entity);
                    nlapiLogExecution('debug', 'starting payment for ' + entity);
                    var taxpayerid = vendorrec.getFieldValue('custentityil_tax_payer_id');
                    var accountid = vendorrec.getFieldValue('payablesaccount');

                    var vendorname = request.getLineItemValue('custpage_transaction_list', 'entity', i);
                    var batchdate = paymentdate;
                    var currency = request.getLineItemValue('custpage_transaction_list', 'currency', i);
                    var currencyid = request.getLineItemValue('custpage_transaction_list', 'custpage_currencyid', i);
                    var account = request.getLineItemValue('custpage_transaction_list', 'account', i);
                    var tranid = request.getLineItemValue('custpage_transaction_list', 'tranid', i);
                    var amountremaining = request.getLineItemValue('custpage_transaction_list', 'fxamountremaining', i);



                    // Get the transaction type
                    try {
                        nlapiLogExecution('debug', 'search bank details for bank:' + entity);
                        var results = nlapiSearchRecord('customrecord_ilo_vendor_bank', null, null, [new nlobjSearchColumn('custrecord_ilo_vendor_bank_vendor').setSort(true), new nlobjSearchColumn('custrecord_ilo_vendor_bank_bank'), new nlobjSearchColumn('custrecord_ilo_bank_details_account')]);
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

                        nlapiLogExecution('debug', 'creating payment for vendor: ' + entity);
                        // go to dynamic mode so you can find the related sublist item
                        if (vendorname != lastvandor) { // we want only 1 payment record for each vendor - if new vendor create the record
                            if (vendorpayment != null) { //save the last record
                                //if approved commit the record
                                if (status == 2 && applyLines > 0) { //approve
                                    //if (nlapiLookupField('vendorbill', internalId, 'status') != "Paid In Full")
                                    //    nlapiSubmitField('vendorbill', internalId, 'custbodyilo_selected_for_payment', 'F');
                                    var recpaymentId = nlapiSubmitRecord(vendorpayment, { disabletriggers: false, enablesourcing: false });
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
                                    for (var lineNum = 1; lineNum <= vendorpayment.getLineItemCount('apply') ; lineNum++) {
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
                                var nextentity = request.getLineItemValue('custpage_transaction_list', 'custbody_entityid', i + 1);

                            if (remainingusg <= 350 && entity != nextentity) {
                                nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, '_ilo_masav_last_line_execute', j); // set last point to continue after refresh
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
                            vendorpayment.setFieldText('account', batchaccount);
                            vendorpayment.setFieldValue('autoapply', 'F');
                            vendorpayment.setFieldValue('memo', 'Masav Batch Payment');
                            /*******mandatory fields for segments****/
                            try
                            {
                                if (vendorpayment.getFieldValue('location') == null)
                                    vendorpayment.setFieldValue('location', default_location_value);
                                if (vendorpayment.getFieldValue('department') == null)
                                    vendorpayment.setFieldValue('department', default_department_value);
                                if (vendorpayment.getFieldValue('class') == null)
                                    vendorpayment.setFieldValue('class', default_classification_value);
                            }
                            catch (e)
                            { }
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

                        excelbill = new Object();
                        excelbill["entity"] = vendorpayment.getFieldText('entity');
                        excelbill["tranid"] = request.getLineItemValue('custpage_transaction_list', 'tranid', count);
                        excelbill["trandate"] = request.getLineItemValue('custpage_transaction_list', 'trandate', count);
                        excelbill["duedate"] = request.getLineItemValue('custpage_transaction_list', 'duedate', count);
                        excelbill["total"] = amountremaining;
                        excelbill["wht"] = request.getLineItemValue('custpage_transaction_list', 'custpage_whtamount', count);
                        excelbill['wht_rate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent');
                        excelbill['wht_vendorrate'] = vendorpayment.getFieldText('custbody_ilo_wh_tax_percent_vendor');
                        excelbill["currency"] = currency;
                        excelbill["payment"] = "created";
                        excelnArray.push(excelbill);

                        applyLines++;
                    }
                    catch (ex) {
                        // Errors will be logged in the Execution Log
                        status_msg = " Error - Couldn't create payment for bill:" + internalId + ' Error:' + ex + '<br/>\n\r';
                        nlapiLogExecution('ERROR', 'Error', status_msg);
                        excelbill = new Object();
                        excelbill["entity"] = vendorname;
                        excelbill["tranid"] = request.getLineItemValue('custpage_transaction_list', 'tranid', i);
                        excelbill["trandate"] = request.getLineItemValue('custpage_transaction_list', 'trandate', i);
                        excelbill["duedate"] = request.getLineItemValue('custpage_transaction_list', 'duedate', i);
                        excelbill["total"] = amountremaining;
                        excelbill["wht"] = request.getLineItemValue('custpage_transaction_list', 'custpage_whtamount', i);
                        excelbill["currency"] = currency;
                        excelbill["payment"] = "Not OK: " + ex;

                        excelnArray.push(excelbill);

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
                    nlapiSubmitField('vendorbill', internalId, 'custbody_ilo_masav_batch', batch_id);
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
                    for (var lineNum = 1; lineNum <= vendorpayment.getLineItemCount('apply') ; lineNum++) {
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
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_payments', lastpaymentdata); //approved
                    var data = strFirst + "\r\n" + strRows + strLast + "\r\n";
                    var folder = nlapiCreateRecord('folder');
                    folder.setFieldValue('name', 'masav_' + batch_id + '_' + GetTodayDate() + Math.floor((Math.random() * 1000) + 1));
                    var parentFolderid = GetFolderId();
                    folder.setFieldValue('parent', parentFolderid);
                    var FolderId = nlapiSubmitRecord(folder, true);
                    //var link = form.addField("custpage_ilo_downloads", "url", "", null)
                    //    .setDisplayType("inline")
                    //    .setLinkText("Download Excel Files")
                    //    .setDefaultValue("/core/media/downloadfolder.nl?id=" + FolderId + "&_xt=&_xd=T&e=T");
                    // form.addField("total", "label", "TOTAL NET: ₪<b>" + sumnet + "</b>" + "  &nbsp;&nbsp;&nbsp;&nbsp;    TOTAL WHT: <b>₪" + sumwht + "</b>   &nbsp;&nbsp;&nbsp;&nbsp;     TOTAL GROSS: <b>₪" + sumgross + "</b>").setMaxLength(500);
                    //downloadExcel(excelnArray, batch_id, response, form);
                }
                else {
                    nlapiSubmitField('customrecord_ilo_masav_batch', batch_id, 'custrecord_ilo_masav_batch_status', '3'); //rejected
                    //form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue('batch ' + batch_id + ' was rejected');
                }
                form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue('<div>batch ' + batch_id + ' was executed. <br> <a href="' + nlapiResolveURL('SUITELET', 'customscript_ilo_masav_create_file', 'customdeploy_ilo_masav_create_file') + '">Click Here</a> see the new  payments details.</div<');

                //for (var o = 0; o < arrPay.length; o++) {
                //    var params = new Array();
                //    params['custscript_sspayment_recordid'] = arrPay[o];
                //    nlapiSubmitField('vendorpayment', paymentid, 'custbody_ilo_wht_fix_applied', 'F');
                //    var status = nlapiScheduleScript('customscriptilo_ss_payment', null, params);
                //    for (var z = 1; z < 150000; z++) {
                //    }
                //}

                //for (var o = 0; o < arrPay.length; o++) {
                //    var params = new Array();
                //    params['custscript_sspayment_recordid'] = arrPay[0];
                //    nlapiSubmitField('vendorpayment', paymentid, 'custbody_ilo_wht_fix_applied', 'F');
                //    var status = nlapiScheduleScript('customscriptilo_ss_payment', null, params);
                //    for (var z = 1; z < 150000; z++) {
                //    }
                //}
            }
            catch (ex) {
                // Errors will be logged in the Execution Log
                status_msg = " Error - Couldn't create Last payment. Bill:" + internalId + ' Error:' + ex + '<br/>\n\r';
                //if (start == 1)
                //    downloadExcel(excelnArray, batch_id, response, form);
                form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue('ERROR: ' + status_msg);
                nlapiLogExecution('ERROR', 'Error', status_msg);
            }
        }
        //       form.addField("msg", "text").setMaxLength(8500).setDisplayType('inline').setDefaultValue(status_msg);
        response.writePage(form);
    }
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
    catch (e)
    { }

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
    catch(e)
    {}
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

function GetFolderId() {
    var filters = new Array();
    filters[0] = new nlobjSearchFilter('name', null, 'is', 'Masav');

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
        for (var i = 0 ; i < searchResult.length; i++) {
            var f = searchResult[i];
            folderid = f.id;
        };
    };
    return folderid;
}

function downloadExcel(results, batch, response, form) {
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
    xmlStr += '<Font ss:Size="10"  ss:Color="#fefefe"  ss:Bold="0"/>';
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
    xmlStr += '<Style ss:ID="s__TIMEOFDAY"><NumberFormat ss:Format="Medium Time"/></Style>';
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

    xmlStr += '<Worksheet ss:Name="Sheet1">';
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
   '<ss:Column ss:AutoFitWidth="1" ss:Width="110"/>' +
          '<Row>' +
            '<Cell ss:StyleID="maintitle" ss:MergeAcross="8"><Data ss:Type="String">דוח חשבוניות ששולמו במסב לקובץ מספר ' + batch + '</Data></Cell>' +
         '</Row>' +
        '<Row>' +
            '<Cell ss:StyleID="header" ><Data ss:Type="String">Vendor</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">Bill</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">Date</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">Due Date</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">Amount Remaining</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">WHT Amount</Data></Cell>' +
           '<Cell ss:StyleID="header"><Data ss:Type="String">Currency</Data></Cell>' +
            '<Cell ss:StyleID="header"><Data ss:Type="String">Status</Data></Cell>' +
 '</Row>';
    for (var i = 0; i < results.length; i++) {
        xmlStr += '<Row>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["entity"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["tranid"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["trandate"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["duedate"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="Number">' + results[i]["total"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="Number">' + results[i]["wht"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["currency"] + '</Data></Cell>' +
                '<Cell ss:StyleID="Default"><Data ss:Type="String">' + results[i]["payment"] + '</Data></Cell>' +
          '</Row>';
    }


    xmlStr += '</Table></Worksheet></Workbook>';

    //create file
    var xlsFile = nlapiCreateFile('masav_payments.xls', 'EXCEL', nlapiEncrypt(xmlStr, 'base64'));
    var folder = nlapiCreateRecord('folder');
    folder.setFieldValue('name', 'masav' + GetTodayDate() + Math.floor((Math.random() * 1000) + 1));
    var parentFolderid = GetFolderId();
    folder.setFieldValue('parent', parentFolderid);
    var FolderId = nlapiSubmitRecord(folder, true);
    xlsFile.setIsOnline(true);
    xlsFile.setFolder(FolderId);
    xlsFile.setEncoding('UTF-8');
    nlapiSubmitFile(xlsFile);

    var link = form.addField("custpage_ilo_downloads", "url", "", null, "download")
        .setDisplayType("inline")
        .setLinkText("Click Here to Download Excel For Masav")
        .setDefaultValue("/core/media/downloadfolder.nl?id=" + FolderId + "&_xt=&_xd=T&e=T");

}
