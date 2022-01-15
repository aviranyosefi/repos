/**
* @NApiVersion 2.0
* @NScriptType suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/format'],
    function (serverWidget, search, format) {
        function onRequest(context) {
            //    if (context.request.method === 'GET') {
            var form = serverWidget.createForm({
                title: 'SCM'
            });

            var htmlfield = form.addField({
                id: 'custpage_html',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'html'
            });


            var tab = form.addTab({
                id: 'tabso',
                label: 'Sales Orders'
            });
            var tabff = form.addTab({
                id: 'tabff',
                label: 'Fulfillment'
            });
            var tabpo = form.addTab({
                id: 'tabpo',
                label: 'Purchae Orders'
            });
            var tabtro = form.addTab({
                id: 'tabtro',
                label: 'TRO'
            });
            var tabrma = form.addTab({
                id: 'tabrma',
                label: 'RMA'
            });
            var tabinbound = form.addTab({
                id: 'tabinbound',
                label: 'Shipment'
            });
            var sosublist = form.addSublist({
                id: 'sosublist',
                type: serverWidget.SublistType.LIST,
                tab: 'tabso',
                label: 'So Lines'
            });

            var inbound = form.addSublist({
                id: 'inbound',
                tab: 'tabinbound',
                type: serverWidget.SublistType.LIST,
                label: 'Inbound Shipment'
            });
            var posublist = form.addSublist({
                id: 'posublist',
                tab: 'tabpo',
                type: serverWidget.SublistType.LIST,
                label: 'PO'
            });
            var ffsublist = form.addSublist({
                id: 'ff_sublist',
                tab: 'tabff',
                type: serverWidget.SublistType.LIST,
                label: 'Fulfillment'
            });
            var tro = form.addSublist({
                id: 'tro',
                tab: 'tabtro',
                type: serverWidget.SublistType.LIST,
                label: 'TRO'
            });
            var rma = form.addSublist({
                id: 'rma',
                tab: 'tabrma',
                type: serverWidget.SublistType.LIST,
                label: 'RMA'
            });
            form.addSubmitButton('Refresh');

            function load_data(searchid, sublist, filters) {
                try {
                    var objSearch = search.load({
                        id: searchid
                    });
                    log.audit({ title: 'filters of ' + searchid + ' ' + sublist.label, details: filters + ' filters.length : ' + filters.length });
                    if (filters.length > 0) {
                        objSearch.filterExpression = objSearch.filterExpression.concat(filters);
                    }
                    var resultSet = objSearch.run();

                    resultSet.columns.forEach(function (col) {// This adds columns to the sublist based on the search results

                        sublist.addField({
                            id: col.name,
                            label: col.label,
                            type: serverWidget.FieldType.TEXT
                        });

                        //}
                    });


                    {
                        var results = resultSet.getRange({
                            start: 0,
                            end: 150
                        });
                    }
                    log.debug('results ', results.length);
                    for (var i in results) {
                        var result = results[i];
                        var line = Number(i);
                        for (var k in result.columns) {
                            if (result.getText(result.columns[k])) { //This is to get the values of any select field in the search
                                var fieldValue = result.getText(result.columns[k])
                            }
                            else {
                                var fieldValue = result.getValue(result.columns[k])
                            };

                            if (fieldValue == null || fieldValue == "")
                                fieldValue = " ";

                            if (searchid == 'customsearch_logitrack') {
                                sublist.setSublistValue({
                                    id: 'custpage_tran_id_text',
                                    value: result.getValue('tranid'),
                                    line: line
                                });
                            }


                            if ((result.columns[k].label == 'ORDER #' && searchid == 'customsearch_logitrack')) {  // so search	 SCM Report [Don't Touch]-For Sales Order

                                fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/salesord.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>";
                            }
                            else if (searchid == 'customsearch_logitrack_2') { // item fullfilment search		 SCM Report [Don't Touch]-For Fulfillment				
                                if (result.columns[k].label == 'ORDER #') { fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/itemship.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>"; }
                                else if (result.columns[k].label == 'CREATED FROM') { fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/salesord.nl?id=" + result.getValue('createdfrom') + "'" + 'target="_blank">' + fieldValue + "</a>"; }
                            }
                            else if (searchid == 'customsearch_logitrack_2_2') { // po search  SCM Report [Don't Touch]-For PO						
                                if (result.columns[k].label == 'ORDER #' || result.columns[k].label == 'TRANSACTION NAME') { fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/purchord.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>"; }
                                else if (result.columns[k].label == 'QUANTITY ON SHIPMENTS ') { fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/shipping/inboundshipment/inboundshipment.nl?id=" + result.getValue('quantityonshipments') + "'" + 'target="_blank">' + fieldValue + "</a>"; }
                            }
                            else if (result.columns[k].label == 'ORDER #' && searchid == 'customsearch_logitrack_2_2_2') { // tro search  SCM Report [Don't Touch]-For TO						
                                fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/trnfrord.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>";
                            }
                            else if (searchid == 'customsearch_logitrack_2_2_2_2') { // rma search		SCM Report [Don't Touch]-For CASES			
                                if (result.columns[k].label == 'CASE #') fieldValue = "<a href='https://4998343.app.netsuite.com/app/crm/support/supportcase.nl?id=" + result.getValue('custbody_case') + "'" + 'target="_blank">' + fieldValue + "</a>";
                                else if (result.columns[k].label == 'TRANSACTION NUMBER') { fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/rtnauth.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>"; }
                            }

                            else if (result.columns[k].label == 'SHIPMENT NUMBER' && searchid == 'customsearch305') { // Shipment search	 SCM Report [Don't Touch]-For Inbound Shipment					
                                fieldValue = "<a href='https://4998343.app.netsuite.com/app/accounting/transactions/shipping/inboundshipment/inboundshipment.nl?id=" + result.id + "'" + 'target="_blank">' + fieldValue + "</a>";
                            }




                            sublist.setSublistValue({
                                id: result.columns[k].name,
                                value: fieldValue,
                                line: line
                            });
                        }
                        if (sublist.getSublistValue({ id: "quantitypacked", line: line }) > 0 && searchid == 'customsearch_logitrack') //packed
                        {
                            sublist.setSublistValue({
                                id: 'custpage_ff',
                                value: 'T',
                                line: line
                            });
                        }
                        if ((sublist.getSublistValue({ id: "purchaseorder", line: line }) != " " || sublist.getSublistValue({ id: "custcol_related_po", line: line }) != " ") && searchid == 'customsearch_logitrack') {
                            sublist.setSublistValue({
                                id: 'custpage_po',
                                value: 'T',
                                line: line
                            });
                        }
                        if (sublist.getSublistValue({ id: "custcol_transfer_order", line: line }) != " " && searchid == 'customsearch_logitrack') {
                            sublist.setSublistValue({
                                id: 'custpage_manual',
                                value: 'T',
                                line: line
                            });
                        }
                        if (sublist.getSublistValue({ id: "quantityonshipments", join: "CUSTCOL_RELATED_PO", line: line }) > 0 && searchid == 'customsearch_logitrack') {
                            sublist.setSublistValue({
                                id: 'custpage_shipment',
                                value: 'T',
                                line: line
                            });
                        }
                        if (sublist.getSublistValue({ id: "transferorderquantitypacked", line: line }) > 0 && searchid == 'customsearch_logitrack_2_2_2') {
                            sublist.setSublistValue({
                                id: 'custpage_tro_full',
                                value: 'T',
                                line: line
                            });
                        }




                    }
                }
                catch (e) {
                    log.error('Error: ', e);
                }

            }
            sosublist.addField({
                id: 'custpage_ff',
                label: 'Fullfilled',
                type: serverWidget.FieldType.CHECKBOX
            }).updateDisplayType({
                displayType: 'DISABLED'
            });;
            sosublist.addField({
                id: 'custpage_po',
                label: 'PO Related',
                type: serverWidget.FieldType.CHECKBOX
            }).updateDisplayType({
                displayType: 'DISABLED'
            });
            sosublist.addField({
                id: 'custpage_manual',
                label: 'TO Related',
                type: serverWidget.FieldType.CHECKBOX
            }).updateDisplayType({
                displayType: 'DISABLED'
            });
            sosublist.addField({
                id: 'custpage_shipment',
                label: 'shipment',
                type: serverWidget.FieldType.CHECKBOX
            }).updateDisplayType({
                displayType: 'DISABLED'
            });
            sosublist.addField({
                id: 'custpage_tran_id_text',
                label: 'so',
                type: serverWidget.FieldType.TEXT
            }).updateDisplayType({
                displayType: 'Hidden'
            });
            tro.addField({
                id: 'custpage_tro_full',
                label: 'Fullfilled',
                type: serverWidget.FieldType.CHECKBOX
            }).updateDisplayType({
                displayType: 'DISABLED'
            });
            //so:
            form.addField({
                id: 'custpage_stickyheaders_script',
                label: 'Hidden',
                type: serverWidget.FieldType.INLINEHTML,
                container: 'tabso'
            }).defaultValue = '<script>' +
            "(function ($, undefined) {" +
            " $(function () {" +
            " const windowHeight = $(window).height();" +

            "$('.uir-machine-table-container')" +
            "    .filter((index, elem) => $(elem).height() > windowHeight)" +
            "   .css('height', '70vh')" +
            "   .bind('scroll', (event) => {" +
            "      const headerElem = $(event.target).find('.uir-machine-headerrow');" +
            "      headerElem.css('transform', `translate(0, ${event.target.scrollTop}px)`);" +
            "   })" +
            "   .bind('scroll', (event) => {" +
            "       const headerElem = $(event.target).find('.uir-list-headerrow');" +
            "       headerElem.css('transform', `translate(0, ${event.target.scrollTop}px)`);" +
            "   })" +
            " });" +
            "})(window.jQuery.noConflict(true));" +
                '</script>';
            var fldso_sub = form.addField({ id: 'custpage_so_sub', type: serverWidget.FieldType.SELECT, label: 'Subsidiary', container: 'tabso', source: 'subsidiary' });
            var fldso_cust = form.addField({ id: 'custpage_so_cust', type: serverWidget.FieldType.SELECT, label: 'Customer', container: 'tabso', source: 'customer' });
            var fldso_item = form.addField({ id: 'custpage_so_item', type: serverWidget.FieldType.SELECT, label: 'Item', container: 'tabso', source: 'item' });
            var fldso_tran = form.addField({ id: 'custpage_so_doc', type: serverWidget.FieldType.SELECT, label: 'Document Number', container: 'tabso', source: 'salesorder' });
            var fldso_owner = form.addField({ id: 'custpage_owner', type: serverWidget.FieldType.SELECT, label: 'Logistics Owner', container: 'tabso' });
            getLogitrackOwner(fldso_owner)
            var fldso_location = form.addField({ id: 'custpage_location', type: serverWidget.FieldType.SELECT, label: 'Location', container: 'tabso', source: 'location' });
            var fldso_date = form.addField({ id: 'custpage_so_date', type: serverWidget.FieldType.DATE, label: 'Date', container: 'tabso' });
            
            //ff:        
            var fldff_tran = form.addField({ id: 'custpage_ff_so', type: serverWidget.FieldType.SELECT, label: 'Sales Order', container: 'tabff', source: 'salesorder' });
            var fldff_sub = form.addField({ id: 'custpage_ff_sub', type: serverWidget.FieldType.SELECT, label: 'Subsidiary', container: 'tabff', source: 'subsidiary' });
            var fldff_date = form.addField({ id: 'custpage_ff_date', type: serverWidget.FieldType.DATE, label: 'Date', container: 'tabff' });
            var fldff_trandid = form.addField({ id: 'custpage_ff_trandid', type: serverWidget.FieldType.SELECT, label: 'Document number', container: 'tabff', source: 'itemfulfillment' });
            var fldff_cust = form.addField({ id: 'custpage_ff_cust', type: serverWidget.FieldType.SELECT, label: 'Customer', container: 'tabff', source: 'customer' });
            var fldff_owner = form.addField({ id: 'custpage_ff_owner', type: serverWidget.FieldType.SELECT, label: 'Logistic  Owner', container: 'tabff' });
            getLogitrackOwner(fldff_owner)
            var fldff_cust_po = form.addField({ id: 'custpage_ff_cust_po', type: serverWidget.FieldType.TEXT, label: 'Customer PO', container: 'tabff' });
            var fldff_shipstatus = form.addField({ id: 'custpage_ff_shipstatus', type: serverWidget.FieldType.SELECT, label: 'status', container: 'tabff', source: 'status' });
            fldff_shipstatus.addSelectOption({
                value: '',
                text: ''
            });
            fldff_shipstatus.addSelectOption({
                value: 'C',
                text: 'Shipped'
            });
            fldff_shipstatus.addSelectOption({
                value: 'B',
                text: 'Packed'
            });
            fldff_shipstatus.addSelectOption({
                value: 'A',
                text: 'Picked'
            });
            var fldff_shipment_status = form.addField({ id: 'custpage_ff_shipment_status', type: serverWidget.FieldType.SELECT, label: 'shipment status', container: 'tabff', source: 'customlist353' });
            var fldff_closed = form.addField({ id: 'custpage_ff_closed', type: serverWidget.FieldType.SELECT, label: 'CLOSED', container: 'tabff' });
            fldff_closed.addSelectOption({
                value: 'false',
                text: 'NO'
            });            
            fldff_closed.addSelectOption({
                value: 'true',
                text: 'YES'
            });
            fldff_closed.addSelectOption({
                value: 'ALL',
                text: 'ALL'
            });
            //po:
            var fldpo_sub = form.addField({ id: 'custpage_sub_po', type: serverWidget.FieldType.SELECT, label: 'Subsidiary', container: 'tabpo', source: 'subsidiary' });
            var fldpo_cust = form.addField({ id: 'custpage_cust_po', type: serverWidget.FieldType.SELECT, label: 'Vendor', container: 'tabpo', source: 'vendor' });
            var fldpo_item = form.addField({ id: 'custpage_item_po', type: serverWidget.FieldType.SELECT, label: 'Item', container: 'tabpo', source: 'item' });
            var fldpo_tran = form.addField({ id: 'custpage_doc_po', type: serverWidget.FieldType.SELECT, label: 'Document Number', container: 'tabpo', source: 'purchaseorder' });
            var fldpo_location = form.addField({ id: 'custpage_location_po', type: serverWidget.FieldType.SELECT, label: 'Location', container: 'tabpo', source: 'location' });
            var fldpo_from_date = form.addField({ id: 'custpage_from_date_po', type: serverWidget.FieldType.DATE, label: 'From Date', container: 'tabpo' });
            var fldpo_to_date = form.addField({ id: 'custpage_to_date_po', type: serverWidget.FieldType.DATE, label: 'To Date', container: 'tabpo' });
            var fldpo_owner = form.addField({ id: 'custpage_owner_po', type: serverWidget.FieldType.SELECT, label: 'Logistic Owner', container: 'tabpo' });
            getLogitrackOwner(fldpo_owner)
            //var fldpo_vendor = form.addField({ id: 'custpage_vendor_po', type: serverWidget.FieldType.SELECT, label: 'Name (vendor)', container: 'tabpo', source: 'vendors' });
            var fldpo_createdby = form.addField({ id: 'custpage_createdby_po', type: serverWidget.FieldType.SELECT, label: 'Created By', container: 'tabpo' });
            var fldpo_status = form.addField({ id: 'custpage_status_po', type: serverWidget.FieldType.SELECT, label: 'status', container: 'tabpo' });
            fldpo_status.addSelectOption({
                value: '',
                text: ''
            });
            fldpo_status.addSelectOption({
                value: 'A',
                text: 'Pending Supervisor Approval'
            });
            fldpo_status.addSelectOption({
                value: 'B',
                text: 'Pending Receipt'
            });
            fldpo_status.addSelectOption({
                value: 'D',
                text: 'Partially Received'
            });
            fldpo_status.addSelectOption({
                value: 'G',
                text: 'Fully Billed'
            });
            fldpo_status.addSelectOption({
                value: 'E',
                text: 'Pending Billing/Partially Received'
            });
            var fldpo_requester = form.addField({ id: 'custpage_requester', type: serverWidget.FieldType.SELECT, label: 'requester', container: 'tabpo', source: 'Employee' });

            //tro:
            var fldtro_sub = form.addField({ id: 'custpage_sub_tro', type: serverWidget.FieldType.SELECT, label: 'Subsidiary', container: 'tabtro', source: 'subsidiary' });
            var fldtro_owner = form.addField({ id: 'custpage_owner_tro', type: serverWidget.FieldType.SELECT, label: 'Logistics Owner', container: 'tabtro' });
            getLogitrackOwner(fldtro_owner)
            var fldtro_tran = form.addField({ id: 'custpage_doc_tro', type: serverWidget.FieldType.SELECT, label: 'Document Number', container: 'tabtro', source: 'transferorder' });
            var fldtro_date = form.addField({ id: 'custpage_date_tro', type: serverWidget.FieldType.DATE, label: 'Date', container: 'tabtro' });
            //var fldtro_cust = form.addField({ id: 'custpage_cust_tro', type: serverWidget.FieldType.SELECT, label: 'Customer', container: 'tabtro', source: 'customer' });
            var fldtro_location = form.addField({ id: 'custpage_location_tro', type: serverWidget.FieldType.SELECT, label: 'Location', container: 'tabtro', source: 'location' });
            var fldtro_tolocation = form.addField({ id: 'custpage_tolocation_tro', type: serverWidget.FieldType.SELECT, label: 'To Location', container: 'tabtro', source: 'location' });
            var fldtro_createdby = form.addField({ id: 'custpage_createdby_tro', type: serverWidget.FieldType.SELECT, label: 'Created By', container: 'tabtro', source: 'employee' });
            var fldtro_item = form.addField({ id: 'custpage_item_tro', type: serverWidget.FieldType.SELECT, label: 'Item', container: 'tabtro', source: 'item' });
            var fldtro_shipment_status = form.addField({ id: 'custpage_shipment_status_tro', type: serverWidget.FieldType.SELECT, label: 'shipment status', container: 'tabtro' });
            fldtro_shipment_status.addSelectOption({
                value: '',
                text: ''
            });

            fldtro_shipment_status.addSelectOption({
                value: 'H',
                text: 'Closed'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'D',
                text: 'Partially Fulfilled'
            });

            fldtro_shipment_status.addSelectOption({
                value: 'A',
                text: 'Pending Approval'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'B',
                text: 'Pending Fulfillment'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'E',
                text: 'Pending Receipt/Partially Fulfilled'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'F',
                text: 'Pending Receipt'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'G',
                text: 'Received'
            });
            fldtro_shipment_status.addSelectOption({
                value: 'C',
                text: 'Rejected'
            });


            //rma:
            var fldrma_stage = form.addField({ id: 'custpage_stage_rma', type: serverWidget.FieldType.SELECT, label: 'Stage', container: 'tabrma' });
            fldrma_stage.addSelectOption({
                value: '',
                text: ''
            });
            fldrma_stage.addSelectOption({
                value: 'OPEN',
                text: 'Open'
            });
            fldrma_stage.addSelectOption({
                value: 'ESCALATED',
                text: 'Escalated'
            });
            fldrma_stage.addSelectOption({
                value: 'CLOSED',
                text: 'Closed'
            });
            var fldrma_assignedto = form.addField({ id: 'custpage_assignto_rma', type: serverWidget.FieldType.SELECT, label: 'Assigned To', container: 'tabrma', source: 'employee' });
            var fldrma_createdby = form.addField({ id: 'custpage_createdby_rma', type: serverWidget.FieldType.SELECT, label: 'Created By', container: 'tabrma', source: 'employee' });
            var fldrma_status = form.addField({ id: 'custpage_status_rma', type: serverWidget.FieldType.SELECT, label: 'status', container: 'tabrma' });
            fldrma_status.addSelectOption({
                value: '',
                text: ''
            });
            fldrma_status.addSelectOption({
                value: '1',
                text: 'Not Started'
            });
            fldrma_status.addSelectOption({
                value: '2',
                text: 'In Progress'
            });
            fldrma_status.addSelectOption({
                value: '3',
                text: 'Escalated'
            });
            fldrma_status.addSelectOption({
                value: '4',
                text: 'Re-Opened'
            });
            fldrma_status.addSelectOption({
                value: '5',
                text: 'Closed'
            });
            //var fldrma_item = form.addField({ id: 'custpage_item_rma', type: serverWidget.FieldType.SELECT, label: 'Item', container: 'tabrma', source: 'item' });
            //shipment:
            var fldShipNumber = form.addField({ id: 'custpage_shipnumber_ship', type: serverWidget.FieldType.SELECT, label: 'Shipment Number', container: 'tabinbound', source: 'inboundshipment' });
            var fldship_TrackingNumber = form.addField({ id: 'custpage_trackingnumber_ship', type: serverWidget.FieldType.TEXT, label: 'Tracking Number', container: 'tabinbound' });
            var fldship_item = form.addField({ id: 'custpage_item_ship', type: serverWidget.FieldType.SELECT, label: 'Item', container: 'tabinbound', source: 'item' });
            var fldship_itemPO = form.addField({ id: 'custpage_itempo_ship', type: serverWidget.FieldType.SELECT, label: 'Item PO', container: 'tabinbound', source: 'purchaseorder' });
            var fldship_owner = form.addField({ id: 'custpage_owner_ship', type: serverWidget.FieldType.SELECT, label: 'Owner', container: 'tabinbound' });
            getLogitrackOwner(fldship_owner)
            var fldship_status = form.addField({ id: 'custpage_status_ship', type: serverWidget.FieldType.SELECT, label: 'Status', container: 'tabinbound', source: 'customlist353' });
            var fldship_carrier = form.addField({ id: 'custpage_carrier_ship', type: serverWidget.FieldType.SELECT, label: 'Carrier', container: 'tabinbound', source: 'customlist_inbound_list_carrier' });
            var fldship_Problematic = form.addField({ id: 'custpage_problematic_ship', type: serverWidget.FieldType.CHECKBOX, label: 'problematic', container: 'tabinbound' });

            /** SO ***/
            var soFilters = [];
            fldso_owner.defaultValue = context.request.parameters['custpage_owner'];
            if (fldso_owner.defaultValue != "") {
                soFilters.push("AND");
                if (fldso_owner.defaultValue == 'Unassigned') {                   
                    soFilters.push(["custbody_logistic_owner", "anyof", "@NONE@"]);
                }
                else soFilters.push(['custbody_logistic_owner', 'is', fldso_owner.defaultValue]);
            }
            fldso_location.defaultValue = context.request.parameters['custpage_location'];
            if (fldso_location.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['location', 'is', fldso_location.defaultValue]);
            }
            fldso_sub.defaultValue = context.request.parameters['custpage_so_sub'];
            if (fldso_sub.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['subsidiary', 'is', fldso_sub.defaultValue]);
            }
            fldso_cust.defaultValue = context.request.parameters['custpage_so_cust'];
            if (fldso_cust.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['entity', 'is', fldso_cust.defaultValue]);
            }
            fldso_item.defaultValue = context.request.parameters['custpage_so_item'];
            if (fldso_item.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['item', 'is', fldso_item.defaultValue]);
            }
            fldso_tran.defaultValue = context.request.parameters['custpage_so_doc'];
            if (fldso_tran.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['internalid', 'anyof', fldso_tran.defaultValue]);
            }
            fldso_date.defaultValue = context.request.parameters['custpage_so_date'];
            if (fldso_date.defaultValue != "") {
                soFilters.push("AND");
                soFilters.push(['trandate', 'on', parseAndFormatDateString(fldso_date.defaultValue)]);
            }

            load_data('customsearch_logitrack', sosublist, soFilters);
            form.addField({
                id: 'custpage_stickyheaders_scriptt',
                label: 'Hidden',
                type: serverWidget.FieldType.INLINEHTML,
                container: 'tabff'
            }).defaultValue = '<script>' +
            "(function ($, undefined) {" +
            " $(function () {" +
            " const windowHeight = $(window).height();" +
            "$('.listtable listborder uir-list-table').each(function(i,obj))}" +
            "    .filter((index, elem) => $(elem).height() > windowHeight)" +
            "   .css('height', '70vh')" +
            "   .bind('scroll', (event) => {" +
            "      const headerElem = $(event.target).find('#ff_sublistheader');" +
            "      headerElem.css('transform', `translate(0, ${event.target.scrollTop}px)`);" +
            "   })" +
            "   .bind('scroll', (event) => {" +
            "       const headerElem = $(event.target).find('.uir-list-headerrow');" +
            "       headerElem.css('transform', `translate(0, ${event.target.scrollTop}px)`);" +
            "   })" +
            " });" +
            "})(window.jQuery.noConflict(true));" +
                '</script>';
            /** SO ***/

            /** Fullfill ***/
            var ffFilters = [];
            fldff_tran.defaultValue = context.request.parameters['custpage_ff_so'];
            if (fldff_tran.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['createdfrom', 'is', fldff_tran.defaultValue]);
            }
            fldff_sub.defaultValue = context.request.parameters['custpage_ff_sub'];
            if (fldff_sub.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['subsidiary', 'is', fldff_sub.defaultValue]);
            }
            fldff_date.defaultValue = context.request.parameters['custpage_ff_date'];
            if (fldff_date.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['trandate', 'on', parseAndFormatDateString(fldff_date.defaultValue)]);
            }
            fldff_trandid.defaultValue = context.request.parameters['custpage_ff_trandid'];
            if (fldff_trandid.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['internalid', 'anyof', fldff_trandid.defaultValue]);
            }
            fldff_cust.defaultValue = context.request.parameters['custpage_ff_cust'];
            if (fldff_cust.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['entity', 'is', fldff_cust.defaultValue]);
            }
            fldff_owner.defaultValue = context.request.parameters['custpage_ff_owner'];
            if (fldff_owner.defaultValue != "") {
                ffFilters.push("AND");
                if (fldff_owner.defaultValue == 'Unassigned') {
                    ffFilters.push(["custbody_logistic_owner", "anyof", "@NONE@"]);
                }
                else ffFilters.push(['custbody_logistic_owner', 'is', fldff_owner.defaultValue]);
            }
            fldff_cust_po.defaultValue = context.request.parameters['custpage_ff_cust_po'];
            if (fldff_cust_po.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['custbody_customer_po_num', 'is', fldff_cust_po.defaultValue]);
            }
            fldff_shipstatus.defaultValue = context.request.parameters['custpage_ff_shipstatus'];
            if (fldff_shipstatus.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['status', 'anyof', "ItemShip:" + fldff_shipstatus.defaultValue]);
            }
            fldff_shipment_status.defaultValue = context.request.parameters['custpage_ff_shipment_status'];
            if (fldff_shipment_status.defaultValue != "") {
                ffFilters.push("AND");
                ffFilters.push(['custbody8', 'anyof', fldff_shipment_status.defaultValue]);
            }
            fldff_closed.defaultValue = context.request.parameters['custpage_ff_closed'];
            if (fldff_closed.defaultValue == '') {
                ffFilters.push("AND");
                ffFilters.push(['custbody_closed', 'is', 'false']);
            }
            else {
                ffFilters.push("AND");
                ffFilters.push(['custbody_closed', 'is', fldff_closed.defaultValue]);
            }






            load_data('customsearch_logitrack_2', ffsublist, ffFilters);
            /** Fullfill ***/

            /*** PO ***/
            var poFilters = [];
            fldpo_sub.defaultValue = context.request.parameters['custpage_sub_po'];
            if (fldpo_sub.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['subsidiary', 'is', fldpo_sub.defaultValue]);
            }
            fldpo_cust.defaultValue = context.request.parameters['custpage_cust_po'];
            if (fldpo_cust.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['entity', 'is', fldpo_cust.defaultValue]);
            }
            fldpo_item.defaultValue = context.request.parameters['custpage_item_po'];
            if (fldpo_item.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['item', 'is', fldpo_item.defaultValue]);
            }
            fldpo_tran.defaultValue = context.request.parameters['custpage_doc_po'];
            if (fldpo_tran.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['internalid', 'is', fldpo_tran.defaultValue]);
            }
            fldpo_from_date.defaultValue = context.request.parameters['custpage_from_date_po'];
            if (fldpo_from_date.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['trandate', 'onorafter', parseAndFormatDateString(fldpo_from_date.defaultValue)]);
            }
            fldpo_to_date.defaultValue = context.request.parameters['custpage_to_date_po'];
            if (fldpo_to_date.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['trandate', 'onorbefore', parseAndFormatDateString(fldpo_to_date.defaultValue)]);
            }
            fldpo_location.defaultValue = context.request.parameters['custpage_location_po'];
            if (fldpo_location.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['location', 'is', fldpo_location.defaultValue]);
            }
            /*
            fldpo_vendor.defaultValue = context.request.parameters['custpage_vendor_po'];
            if (fldpo_vendor.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['altname', 'is', fldpo_vendor.defaultValue]);
            }
            */
            fldpo_owner.defaultValue = context.request.parameters['custpage_owner_po'];
            if (fldpo_owner.defaultValue != "") {
                poFilters.push("AND");
                if (fldpo_owner.defaultValue == 'Unassigned') {
                    poFilters.push(["custbody_logistic_owner", "anyof", "@NONE@"]);
                }
                else poFilters.push(['custbody_logistic_owner', 'is', fldpo_owner.defaultValue]);
            }
            fldpo_createdby.defaultValue = context.request.parameters['custpage_createdby_po'];
            if (fldpo_createdby.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['createdby', 'is', fldpo_createdby.defaultValue]);
            }
            fldpo_status.defaultValue = context.request.parameters['custpage_status_po'];
            if (fldpo_status.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['status', 'anyof', "PurchOrd:" + fldpo_status.defaultValue]);
            }
            fldpo_requester.defaultValue = context.request.parameters['custpage_requester'];
            if (fldpo_requester.defaultValue != "") {
                poFilters.push("AND");
                poFilters.push(['custbody_requester', 'is', fldpo_requester.defaultValue]);
            }



            load_data('customsearch_logitrack_2_2', posublist, poFilters);
            /** PO **/

            /*** TRO ***/
            var troFilters = [];

            fldtro_sub.defaultValue = context.request.parameters['custpage_sub_tro'];
            if (fldtro_sub.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['subsidiary', 'is', fldtro_sub.defaultValue]);
            }
            fldtro_owner.defaultValue = context.request.parameters['custpage_owner_tro'];
            if (fldtro_owner.defaultValue != "") {
                troFilters.push("AND");
                if (fldtro_owner.defaultValue == 'Unassigned') {
                    troFilters.push(["custbody_logistic_owner", "anyof", "@NONE@"]);
                }
                else troFilters.push(['custbody_logistic_owner', 'is', fldtro_owner.defaultValue]);
            }
            /*
            fldtro_cust.defaultValue = context.request.parameters['custpage_cust_tro'];
            if (fldtro_cust.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['entity', 'is', fldtro_cust.defaultValue]);
            }
            */
            fldtro_tran.defaultValue = context.request.parameters['custpage_doc_tro'];
            if (fldtro_tran.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['internalid', 'is', fldtro_tran.defaultValue]);
            }
            fldtro_date.defaultValue = context.request.parameters['custpage_date_tro'];
            if (fldtro_date.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['trandate', 'is', fldtro_date.defaultValue]);
            }
            fldtro_location.defaultValue = context.request.parameters['custpage_location_tro'];
            if (fldtro_location.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['location', 'is', fldtro_location.defaultValue]);
            }
            fldtro_tolocation.defaultValue = context.request.parameters['custpage_tolocation_tro'];
            if (fldtro_tolocation.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['transferlocation', 'is', fldtro_tolocation.defaultValue]);
            }
            fldtro_createdby.defaultValue = context.request.parameters['custpage_createdby_tro'];
            if (fldtro_createdby.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['createdby', 'is', fldtro_createdby.defaultValue]);
            }
            fldtro_item.defaultValue = context.request.parameters['custpage_item_tro'];
            if (fldtro_item.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['item', 'anyof', fldtro_item.defaultValue]);
            }
            fldtro_shipment_status.defaultValue = context.request.parameters['custpage_shipment_status_tro'];
            if (fldtro_shipment_status.defaultValue != "") {
                troFilters.push("AND");
                troFilters.push(['status', 'anyof', "TrnfrOrd:" + fldtro_shipment_status.defaultValue]);
            }

            load_data('customsearch_logitrack_2_2_2', tro, troFilters);
            /** TRO **/

            /** RMA ***/
            var rmaFilters = [];

            fldrma_stage.defaultValue = context.request.parameters['custpage_stage_rma'];
            if (fldrma_stage.defaultValue != "") {
                rmaFilters.push(['stage', 'is', fldrma_stage.defaultValue]);
            }
            fldrma_createdby.defaultValue = context.request.parameters['custpage_createdby_rma'];
            if (fldrma_createdby.defaultValue != "") {
                rmaFilters.push("AND");
                rmaFilters.push(['createdby', 'is', fldrma_createdby.defaultValue]);
            }
            fldrma_assignedto.defaultValue = context.request.parameters['custpage_assignto_rma'];
            if (fldrma_assignedto.defaultValue != "") {
                rmaFilters.push("AND");
                rmaFilters.push(['assigned', 'is', fldrma_assignedto.defaultValue]);
            }
            fldrma_status.defaultValue = context.request.parameters['custpage_status_rma'];
            if (fldrma_status.defaultValue != "") {
                rmaFilters.push("AND");
                rmaFilters.push(['status', 'anyof', fldrma_status.defaultValue]);
            }
            //fldrma_item.defaultValue = context.request.parameters['custpage_item_rma'];
            //if (fldrma_item.defaultValue != "") {
            //    rmaFilters.push("AND");
            //    rmaFilters.push(['item', 'anyof', fldrma_item.defaultValue]);
            //}

            load_data('customsearch_logitrack_2_2_2_2', rma, rmaFilters);
            /** RMA ***/

            /** Inbound ***/

            //shipment:
            var inFilters = [];
            fldship_Problematic.defaultValue = context.request.parameters['custpage_problematic_ship'];
            if (fldship_Problematic.defaultValue != "") {
                inFilters.push(['custrecord_inbound_ship_problem', 'is', fldship_Problematic.defaultValue]);
            }
            fldShipNumber.defaultValue = context.request.parameters['custpage_shipnumber_ship'];
            if (fldShipNumber.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['internalid', 'anyof', fldShipNumber.defaultValue]);
            }
            fldship_TrackingNumber.defaultValue = context.request.parameters['custpage_trackingnumber_ship'];
            if (fldship_TrackingNumber.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['billoflading', 'is', fldship_TrackingNumber.defaultValue]);
            }
            fldship_item.defaultValue = context.request.parameters['custpage_item_ship'];
            if (fldship_item.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['item', 'is', fldship_item.defaultValue]);
            }
            fldship_itemPO.defaultValue = context.request.parameters['custpage_itempo_ship'];
            if (fldship_itemPO.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['purchaseorder', 'is', fldship_itemPO.defaultValue]);
            }
            fldship_owner.defaultValue = context.request.parameters['custpage_owner_ship'];
            if (fldship_owner.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['custrecord_inbound_ship_owner', 'is', fldship_owner.defaultValue]);
            }
            fldship_status.defaultValue = context.request.parameters['custpage_status_ship'];
            if (fldship_status.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['status', 'is', fldship_status.defaultValue]);
            }
            fldship_carrier.defaultValue = context.request.parameters['custpage_carrier_ship'];
            if (fldship_carrier.defaultValue != "") {
                inFilters.push("AND");
                inFilters.push(['custrecord_inbound_ship_carrier', 'is', fldship_carrier.defaultValue]);
            }

            load_data('customsearch305', inbound, inFilters);

            function parseAndFormatDateString(DateString) {

                var parsedDateStringAsRawDateObject = format.parse({
                    value: DateString,
                    type: format.Type.DATE
                });
                var formattedDateString = format.format({
                    value: parsedDateStringAsRawDateObject,
                    type: format.Type.DATE
                });

                return formattedDateString
            }

            function getLogitrackOwner(select) {
                var employeeSearchObj  = search.create({
                    type: "employee",
                    filters:
                        [
                            ["custentity_is_logistic", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "internalid",                               
                                label: "ID"
                            }),
                            search.createColumn({ name: "altname", label: "Name" }),                           
                        ]
                });
                select.addSelectOption({
                    value: '',
                    text: 'All'
                });
                select.addSelectOption({
                    value: 'Unassigned',
                    text: 'Unassigned'
                });                             
                employeeSearchObj .run().each(function (result) {
                    select.addSelectOption({
                        value: result.getValue({
                            name: "internalid",                            
                            label: "ID"
                        }),
                        text: result.getValue({
                            name: "altname",
                            label: "Name"
                        })
                    });

                    return true;
                });

            }

            /** Inbound ***/

            form.clientScriptModulePath = 'SuiteScripts/gilat_cs2_logitrack.js';

            //add the data:
            context.response.writePage(form);
            //}
        }
        return {
            onRequest: onRequest
        };
    });

