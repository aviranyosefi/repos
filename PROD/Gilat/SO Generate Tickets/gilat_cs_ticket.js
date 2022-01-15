var topicgen = "";
function generate_so_tickets() {
    try {
        debugger;
        var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
        if (topicgen == "")
            topic = rec.getFieldValue('custbody_topic');
        else
            topic = topicgen;
        var customer = rec.getFieldValue('entity');
        var ticket_array = [];
        var count = rec.getLineItemCount('item');
        for (var i = 1; i <= count; i++) {
            var site = rec.getLineItemValue("item", "custcol_site", i);
            var type = rec.getLineItemValue("item", "custcol_item_flow_type", i);
            if (site > 0 && type > 0) {
                var key = site + "_" + type;
                var ticketid = -1;
                if (ticket_array[key] == null) {
                    ticketid = create_ticket(site, type, customer, topic);
                    ticket_array[key] = ticketid;
                }
                else
                    ticketid = ticket_array[key];
                rec.setLineItemValue("item", 'custcol_ticket', i, ticketid);
            }
        }
        nlapiSubmitRecord(rec);
        showAlertBox('New_tickets', 'Done', 'New tickets have been assigned to this sales order', NLAlertDialog.TYPE_LOWEST_PRIORITY);
        window.location.reload();
    }
    catch (e) {
        nlapiLogExecution('error', 'save', ' error:' + e);
    }
    return true;
}

function endtest(obj) {
    obj.style.display = "none";
    var soid = nlapiGetRecordId();
    nlapiSubmitField('salesorder', soid, 'custbody_test_status', 7);
    alert('End ticket in progress...');
    topicgen = 21;
    var assignTicket = nlapiSearchRecord('customrecord_ticket', null, [new nlobjSearchFilter('custrecord_ticket_sales_order', null, 'is', soid)],null)
    //for (result in assignTicket) {
    //    nlapiSubmitField('customrecord_ticket', assignTicket[result].id, 'custrecord_ticket_sales_order', null);
    //}
    //    nlapiSubmitField('customrecord_ticket', assignTicket[result].id, 'custrecord_ticket_sales_order', null);
    generate_so_tickets();

}


function create_ticket(site, type, customer, topic) {
    var ticket = nlapiCreateRecord('customrecord_ticket');
    var soid = nlapiGetRecordId();
    var status = '2'; //in progress;

    ticket.setFieldValue('custrecord_ticket_status', status);
    ticket.setFieldValue('custrecord_ticket_site', site);
    ticket.setFieldValue('custrecord_ticket_type', type);
    ticket.setFieldValue('custrecord_ticket_customer', customer);
    ticket.setFieldValue('custrecord_ticket_sales_order', soid);
    ticket.setFieldValue('custrecord_ticket_topic', topic);
    var d = new Date();
    d = nlapiAddDays(d, 30);
    ticket.setFieldValue('custrecord_ticket_expected_dead_line', nlapiDateToString(d));
    //if (topic == 21)
    //{
    //    ticket.setFieldValue('custrecord_ticket_date_completed', nlapiDateToString(new Date(), false));
    //}

    var ticketid = nlapiSubmitRecord(ticket, null, true);
    return ticketid;
}