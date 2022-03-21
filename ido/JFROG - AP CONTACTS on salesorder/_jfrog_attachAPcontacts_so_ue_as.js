/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Jan 2019     idor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function attachAPcontacts_aftersubmit(type) {

    try {

        var recID = nlapiGetRecordId()
        var rec = nlapiLoadRecord('salesorder', recID);


        var customerID = rec.getFieldValue('entity')

        var contacts = getCustomersContacts(customerID);

        if (contacts != []) {

            for (var i = 0; i < contacts.length; i++) {

                nlapiAttachRecord('contact', contacts[i].internalid, 'salesorder', recID, null)
            }

        }

    } catch (err) {

        nlapiLogExecution('debug', 'error adding AP contacts', err)
        return true;
    }
}


function getCustomersContacts(customerID) {

    try {
        var results = [];
        var rawResults = [];
        var toReturn = [];
        var customerIDArr = [customerID]

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('company', null, 'anyof', customerIDArr);


        var columns = new Array();
        columns[0] = new nlobjSearchColumn('entityid');
        columns[1] = new nlobjSearchColumn('company');
        columns[2] = new nlobjSearchColumn('email');
        columns[3] = new nlobjSearchColumn('contactrole');
        columns[4] = new nlobjSearchColumn('internalid');


        var search = nlapiCreateSearch('contact', filters, columns);
        var resultset = search.runSearch();
        results = resultset.getResults(0, 1000);


        if (results != []) {
            results.forEach(function (line) {

                var contactName = line.getValue('entityid')
                var checkName = contactName.startsWith('AP')
                if (checkName == true) {

                    rawResults.push({
                        contactName: line.getValue('entityid'),
                        contactEmail: line.getValue('email'),
                        contactRole: line.getText('contactrole'),
                        internalid: line.getValue('internalid')
                    })
                }//if(checkName == true) 

            });
        }

        var allMails = pluck(rawResults, 'contactEmail');
        var uniqueMails = allMails.filter(function (item, pos) {
            return allMails.indexOf(item) == pos;
        })

        var res = [];
        for (var i = 0; i < uniqueMails.length; i++) {
            for (j = 0; j < rawResults.length; j++) {
                if (uniqueMails[i] == rawResults[j].contactEmail) {
                    res.push(rawResults[j]);
                    break;
                }
            }
        }

        return res;
    } catch (err) {
        nlapiLogExecution('debug', 'error in unique contacts', err)
        return res;
    }
}


function pluck(array, key) {
    return array.map(function (obj) {
        return obj[key];
    });
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function (search, pos) {
            pos = !pos || pos < 0 ? 0 : +pos;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}