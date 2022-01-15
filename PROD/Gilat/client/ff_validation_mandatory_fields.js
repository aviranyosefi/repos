var block = false;
var message = '';
var siteArr = [];
var itemCount = nlapiGetLineItemCount('item');
var SO_rec;
var SO_itemCount;
var lineOfBusinessValue;



function saveRecord() {
    debugger;
    var recType = nlapiGetRecordType()
    if (recType == 'itemfulfillment' || recType == 'fulfillmentrequest' ) {
        var customer = nlapiGetFieldValue('entity');
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (!isNullOrEmpty(customer) && !isNullOrEmpty(createdfrom)) {
            lineOfBusinessValue = nlapiLookupField('customer', customer, 'custentity_customer_line_of_business')
            if (!isNullOrEmpty(lineOfBusinessValue)) {
                SO_rec = nlapiLoadRecord('salesorder', createdfrom);
                SO_itemCount = SO_rec.getLineItemCount('item');

                for (var i = 1; i <= itemCount; i++) {
                    nlapiGetContext().getRemainingUsage = function () { return 1000; }
                    var item = nlapiGetLineItemValue('item', 'item', i);
                    var line = nlapiGetLineItemValue('item', 'orderline', i);
                    var itemreceive = nlapiGetLineItemValue('item', 'itemreceive', i);
                    if (itemreceive == 'T') {
                        for (var j = 1; j <= SO_itemCount; j++) {
                            var S0_line = SO_rec.getLineItemValue('item', 'line', j);
                            var S0_item = SO_rec.getLineItemValue('item', 'item', j);
                            var item_display = SO_rec.getLineItemValue('item', 'item_display', j);
                            if (item == S0_item && S0_line == line) {
                                var isService = nlapiLookupField('item', S0_item, 'custitem_is_service')
                                var BillingDate = SO_rec.getLineItemValue('item', 'custcol_billing_date', j);
                                if (lineOfBusinessValue == '1') {// FSS Internet Connectivity
                                    var site = SO_rec.getLineItemValue('item', 'custcol_site', j);

                                    if (isNullOrEmpty(site)) {
                                        var siteValidation = true;
                                    }
                                    else {
                                        siteValidation = false;
                                        siteArr.push(site);


                                    }

                                }
                                else if (lineOfBusinessValue == '2') {  // MSS
                                    var subscription = SO_rec.getLineItemValue('item', 'custcol_subscription', j);
                                    if (isNullOrEmpty(subscription) && isService == 'T') {
                                        var subscriptionValidation = true;
                                    }
                                    else subscriptionValidation = false;
                                }

                                if (isNullOrEmpty(BillingDate) && isService == 'T') {
                                    var BillingDateValidation = true;
                                }
                                else BillingDateValidation = false;

                                setAlert(lineOfBusinessValue, siteValidation, BillingDateValidation, subscriptionValidation, j, item_display)
                                break;
                            }
                        }
                    }
                }

                if (message != '') {
                    //alert(message);
                    block = true;
                }
            }
        }
        var unique = siteArr.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        var siteBlock = false;
        if (unique.length > 1) {
            siteBlock = true;
            siteArr = [];
        }

        if (siteBlock) {
            alert('Only Lines related to the same site can be included');
            message = '';
            block = false;
            return false;
        }

        if (block) {
            alert('Required fields are missing \nTransaction cannot be saved\n' + message)
            message = '';
            block = false;
            return false;
        }

        return true;
    }
    else if (recType == 'salesorder') {
        
        var customer = nlapiGetFieldValue('entity');
        var createdfrom = nlapiGetFieldValue('createdfrom');
        if (!isNullOrEmpty(customer) && !isNullOrEmpty(createdfrom)) {
            var action = nlapiGetFieldValue('custbody_topic');
            lineOfBusinessValue = nlapiLookupField('customer', customer, 'custentity_customer_line_of_business')
            if (!isNullOrEmpty(lineOfBusinessValue)) {
                SO_rec = nlapiLoadRecord('estimate', createdfrom);
                SO_itemCount = SO_rec.getLineItemCount('item');
                var line = 0;
                for (var i = 1; i <= itemCount; i++) {
                    nlapiGetContext().getRemainingUsage = function () { return 1000; }
                    var item = nlapiGetLineItemValue('item', 'item', i);   
                        for (var j = 1; j <= SO_itemCount; j++) {                          
                            var S0_item = SO_rec.getLineItemValue('item', 'item', j);
                            var item_display = SO_rec.getLineItemValue('item', 'item_display', j);
                            if (item == S0_item) {
                                //var isService = nlapiLookupField('item', S0_item, 'custitem_is_service')
                                var BillingDate = SO_rec.getLineItemValue('item', 'custcol_billing_date', j);
                                if (lineOfBusinessValue == '1') {// FSS Internet Connectivity
                                    var site = SO_rec.getLineItemValue('item', 'custcol_site', j);
                                    if (isNullOrEmpty(site)) {
                                        var siteValidation = true;
                                    }
                                    else {
                                        siteValidation = false;                                   
                                    }
                                    line = j;
                                }
                                else if (lineOfBusinessValue == '2') {  // MSS
                                    debugger;
                                    var BillingDate = nlapiGetLineItemValue('item', 'custcol_billing_date', i);
                                    line = i;
                                    if (isNullOrEmpty(BillingDate) && topicValidation(action)) {
                                        var BillingDateValidation = true;
                                    }
                                    else BillingDateValidation = false;
                                }
                               
                                setAlert(lineOfBusinessValue, siteValidation, BillingDateValidation, false, line, item_display)
                                break;
                            }
                        }
                    
                }

                if (message != '') {
                    alert('Required fields are missing \nTransaction cannot be saved\n' + message)
                    message = '';
                    return false;
                }
            }
        }
        return true;
    }
}

function setAlert(lineOfBusinessValue, siteValidation, BillingDateValidation, subscriptionValidation, j , item) {   
    
    if (lineOfBusinessValue == '1') {
        if (siteValidation && BillingDateValidation) { message += 'Line:' + j + '  Item: ' + item + ' -Site and Billing Date Missing'  +'\n' }
        else if (siteValidation) { message += 'Line:' + j +'  Item: ' + item + ' -Site Missing ' + '\n'}
        else if (BillingDateValidation) { message += 'Line:' + j + '  Item: ' + item + '  -Billing Date Missing' +  '\n' }
    }
    if (lineOfBusinessValue == '2') {
        if (subscriptionValidation && BillingDateValidation) { message += 'Line:' + j + '  Item: ' + item  + ' -Subscription and Billing Date Missing' + '\n' }
        else if (subscriptionValidation) { message += 'Line:' + j + '  Item: ' + item + ' -Subscription Missing ' + '\n'}
        else if (BillingDateValidation) { message += 'Line:' + j +'  Item: ' + item +  '  -Billing Date Missing' + '\n' }
    }
   
}

function topicValidation(topic) {

    if (topic == '24' || topic == '26' || topic == '27' || topic == '28' || topic == '29' || topic == '30') { return true }
    else return false;
}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}