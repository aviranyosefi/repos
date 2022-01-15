var SO_rec;
var status = '';

function updateSub() {

    var context = nlapiGetContext();
     var fulfillment = context.getSetting('SCRIPT', 'custscript_fulfillment_id');
    
    var rec = nlapiLoadRecord('itemfulfillment', fulfillment);        
        var createdfrom = rec.getFieldValue('createdfrom');
    try { SO_rec = nlapiLoadRecord('salesorder', createdfrom); } catch (e) { SO_rec = null }
        if (SO_rec != null && SO_rec != undefined) {
            var SO_itemCount = SO_rec.getLineItemCount('item');            
            var itemCount = rec.getLineItemCount('item');
            var So_type = SO_rec.getFieldValue('custbody_topic');
            getStatus(So_type)
            if (itemCount > 0) {
                for (var i = 1; i <= itemCount; i++) {

                    if (context.getRemainingUsage() < 150) {
                        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                    }

                    nlapiLogExecution('debug', 'i ', i)                    
                    var item = rec.getLineItemValue('item', 'item', i);
                    var line = rec.getLineItemValue('item', 'custcol_so_line_numberdisp', i);
                    for (var j = 1; j <= SO_itemCount; j++) {
                        var S0_line = SO_rec.getLineItemValue('item', 'line', j);
                        var S0_item = SO_rec.getLineItemValue('item', 'item', j);

                        if (item == S0_item && S0_line == line) {

                            //nlapiLogExecution('debug', 'item == S0_item ', item == S0_item)
                            var install_base = SO_rec.getLineItemValue('item', 'custcol_install_base', j);
                            //var action_type = SO_rec.getLineItemValue('item', 'custcol_action_type', j);
                            var install_base_so = '';
                            if (install_base != '' && install_base != null) {
                                var install_base_so = nlapiLookupField('customrecord_ib_service_type', install_base, 'custrecord_ib_source_so');
                            }                                      
                            if (install_base != '' && install_base != null && install_base_so != createdfrom) {  // line from services update screen                                                  
                               
                                var subscription = SO_rec.getLineItemValue('item', 'custcol_subscription', j);
                                if (subscription != '' && subscription != null && subscription != undefined && status != '') {
                                    updateIb(subscription);
                                }
                                
                            } //    if (install_base != '' && action_type == '1')
                                                 
                        }// if item equals
                    } // foor itemCount - end
                }
            } // if (itemCount > 0) - end           
        }//   if (SO_rec != null && SO_rec != undefined) - end
    
}

function getStatus(So_type) {

    if (So_type == '19' || So_type == '3' || So_type == '7' || So_type == '25'
        || So_type == '26' || So_type == '27' || So_type == '28' || So_type == '29' || So_type == '30') {

        status = '2';
    }
    else if (So_type == '17') { // Temporary Disconnection


        status = '3';


    }
    else if (So_type == '18') { //Temporary Disconnection => Stop Billing


        status = '3';
    }
    else if (So_type == '11') { //Reconnection - Start Billing


        status = '1';
    }
    else if (So_type == '10') { //Reconnection 


        status = '1';
    }


}

function updateIb( subscription) {

   
   
        updateSubscription(status, subscription)

    


}


function updateSubscription(status, subscription) {
    nlapiLogExecution('debug', ' updateSubscription: ' + subscription, 'status: ' + status);
    if (status == '1') { // Activate
        var status = nlapiLookupField('customrecord_subscription', subscription, 'custrecord_subs_activation_status');  //subscription status 
        if (status != '2') { // Active
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '2');
        }
    }
    else if (status == '2') {   // Deactivated
        // check if all IB are  Deactivated
        if (!serachIbToUpdateSubscription(subscription, '2')) {
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '3'); // Deactivated
        }
    }
    else if (status == '3') {   // Suspended 
        // check if all IB are  Suspended
        if (!serachIbToUpdateSubscription(subscription, '3')) {
            nlapiSubmitField('customrecord_subscription', subscription, 'custrecord_subs_activation_status', '4'); // Suspended
        }
    }

}

function serachIbToUpdateSubscription(subscription, status) {

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_ib_is_service', null, 'is', 'T');
    filters[1] = new nlobjSearchFilter('custrecord_ib_subscription', null, 'anyof', subscription);
    filters[2] = new nlobjSearchFilter('custrecord_ib_service_status', null, 'noneof', status);


    var search = nlapiCreateSearch('customrecord_ib_service_type', filters, null);
    var runSearch = search.runSearch();

    var s = [];
    var searchid = 0;
    do {

        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    nlapiLogExecution('debug', ' s.length', s.length);
    try {
        if (s.length > 0) { return true; }
        else { return false; }
    }
    catch (e) {
        return false;
    }


}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
