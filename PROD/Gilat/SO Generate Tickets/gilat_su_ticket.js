/**
 * Module tickets
 * 
 * Version    Date            Author           Remarks
 * 1.00       1 Aug 2019     Moshe Barel
 *
 */
function beforeload(type, form) {
    try {
        var itemclass_and_site_exists = false;
        var charging_recurrent_once = false;
        var status = nlapiGetFieldValue('status');
        if (status == "Pending Approval")
            return true;
        var count = nlapiGetLineItemCount('item');

        if (nlapiGetFieldValue('custbody7') == 'T' && (nlapiGetFieldValue('custbody_test_status') == 4 || nlapiGetFieldValue('custbody_test_status') == 6)) // is test - expried or active
        {
            form.setScript('customscript_gilat_cs_generatetickets');
            form.addButton('custpage_endtest', 'End Test', 'endtest(this)');	
        }

        for (var i = 1; i <= count; i++) {
            var site = nlapiGetLineItemValue("item", "custcol_site", i);
            var type = nlapiGetLineItemValue("item", "custcol_item_flow_type", i);
            var ticket = nlapiGetLineItemValue("item", "custcol_ticket", i);
            var charging_recurrent = nlapiGetLineItemValue("item", "custcol_charging_method", i) == 2;
            nlapiLogExecution('debug', 'ticket', ' ticket:' + ticket);
            nlapiLogExecution('debug', 'type', ' type:' + type);
            site = site == "" ? null : site;
            type = type == "" ? null : type;
            ticket = ticket == "" ? null : ticket;
            if (charging_recurrent && ticket == null)
                charging_recurrent_once = true;

            if ((ticket == null && site != null && type != null) || !charging_recurrent) { // site and item flow type assign (only if recurrent charging)
                itemclass_and_site_exists =  true;
            }
            else
                itemclass_and_site_exists = false;

        }
        if (nlapiGetContext().getExecutionContext() == 'userinterface' && itemclass_and_site_exists && charging_recurrent_once) {
            form.setScript('customscript_gilat_cs_generatetickets');
            form.addButton('custpage_gilat_generatetickets', 'Generate Tickets', 'generate_so_tickets()');

        }
    }
    catch (e) {
        nlapiLogExecution('error', 'save', ' error:' + JSON.stringify(e.message));
    }
}