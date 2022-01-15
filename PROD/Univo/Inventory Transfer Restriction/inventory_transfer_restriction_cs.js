var orig_location = nlapiGetFieldValue('location');
var orig_transferlocation = nlapiGetFieldValue('transferlocation');
var msg = '';
var message = 'Only Univo Products can be released to Finish Product in a regular transfer.\n';
var messageEnd = 'cannot be transferred';

function fieldChange(type, name) {

    var role = nlapiGetContext().getRole();
    if (name == 'location' && role != '3' && nlapiGetFieldValue('location') != orig_location  ) {     
        var fromlocation = nlapiGetFieldValue('location');
        var transferlocation = nlapiGetFieldValue('transferlocation');
        if (fromlocation != '' && transferlocation != '') {
            var ifexistsByLocations = getInventoryTransferRestrictionsByRole(role, fromlocation , transferlocation);
            if (ifexistsByLocations == '') {              
                alert('You are not eligible to transfer inventory as requested')
                nlapiSetFieldValue('location', orig_location);
                return true;
            }
        }
    }
    else if (name == 'transferlocation' && role != '3' && nlapiGetFieldValue('transferlocation') != orig_transferlocation  ){       
        var fromlocation = nlapiGetFieldValue('location');
        var transferlocation = nlapiGetFieldValue('transferlocation');
        if (fromlocation != '' && transferlocation != '') {
            var ifexists = getInventoryTransferRestrictionsByRole(  role , fromlocation, transferlocation);
            if (ifexists == '') {
                alert('You are not eligible to transfer inventory as requested')
                nlapiSetFieldValue('transferlocation', orig_transferlocation);
                return true;
            }
        }

        if (transferlocation == '19' ) {
            var itemCount = nlapiGetLineItemCount('inventory');
            for (var i = 1; i <= itemCount; i++) {
                var item = nlapiGetLineItemValue('inventory', 'item', i);
                var custitem_item_category = nlapiLookupField('item', item, 'custitem_item_category');
                var custitem_ownership = nlapiLookupField('item', item, 'custitem_ownership');
                if (custitem_ownership != '1' && custitem_item_category == '2') {
                    var itemName = nlapiGetLineItemText('inventory', 'item',i);
                    addItem(itemName, i);
                } 
            } //for (var i = 1; i <= itemCount; i++)

            if (msg != '') {
                alert(message + msg);
                msg = '';
                nlapiSetFieldValue('transferlocation', orig_transferlocation);
            }

        }

    }
    return true;
}

function getInventoryTransferRestrictionsByLocations(fromlocation, transferlocation) {

    var results = '';

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_from_location', null, 'anyof', fromlocation)
    filters[1] = new nlobjSearchFilter('custrecord_to_location', null, 'anyof', transferlocation)

    var search = nlapiCreateSearch('customrecord_inv_transfer_restrict', filters, null);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        if (returnSearchResults.length > 0) {
            results = returnSearchResults[0].getId();
        }
    }
    return results;
}

function getInventoryTransferRestrictionsByRole(role, fromlocation, transferlocation ) {

    var results = '';

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_from_location', null, 'anyof', fromlocation)
    filters[1] = new nlobjSearchFilter('custrecord_restrict_to_role', null, 'anyof', role)
    filters[2] = new nlobjSearchFilter('custrecord_to_location', null, 'anyof', transferlocation)

    var search = nlapiCreateSearch('customrecord_inv_transfer_restrict', filters, null);
    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        if (returnSearchResults.length > 0) {
            results = returnSearchResults[0].getId();
        }
    }
    return results;
}

function addItem(item, i) {
    msg += 'Line:' + i + '  Item: ' + item + '\n';
}

function validateLine() {

    var transferlocation = nlapiGetFieldValue('transferlocation');
    if (transferlocation == '12') {       
        var item = nlapiGetCurrentLineItemValue('inventory', 'item');
        var itemName = nlapiGetCurrentLineItemText('inventory', 'item');
        var custitem_item_category = nlapiLookupField('item', item, 'custitem_item_category');
        var custitem_ownership = nlapiLookupField('item', item, 'custitem_ownership');
        if (custitem_ownership != '1' && custitem_item_category == '2') {
            alert('Only Univo Products can be released to Finish Product in a regular transfer.\nItem ' + itemName +' cannot be transferred')
            return false;
        }
    }

    return true;
}