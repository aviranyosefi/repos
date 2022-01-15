var Results = searchitemvalues();

function aftersubmit() {


    rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
    var count = rec.getLineItemCount('item');
    var business = 'FSS';

    for (y = 1; y <= count; y++) {
        var item = rec.getLineItemValue('item', 'item', y)
        if (Results[item] != null && Results[item] != undefined) {


            var handling = Results[item].handling;
            business = Results[item].business;

            if (handling == 'T') {
                rec.setLineItemValue('item', 'custcol4', y, 'HW');
            }
            else {
                switch (business) {
                    case '1':
                        business = 'FSS';
                        break;
                    case '2':
                        business = 'MSS';
                        break;
                    default:
                        business = 'FSS';

                }
                rec.setLineItemValue('item', 'custcol4', y, business);
            }
        }
    }
    var newRecId = nlapiSubmitRecord(rec);
        nlapiLogExecution('debug', 'insertnewlineitem: ', newRecId);
}

function searchitemvalues() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custitem_logistic_handling');
    columns[2] = new nlobjSearchColumn('custitem_line_of_business');
    var search = nlapiCreateSearch('item', null, columns);

    var s = [];
    var Results = [];


    var searchid = 0;
    var resultset = search.runSearch();
    //var cols = search.getColumns();

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }

    } while (resultslice.length >= 1000);

    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[s[i].id] = {
                handling: s[i].getValue('custitem_logistic_handling'),
                business: s[i].getValue('custitem_line_of_business'),
            }
        }
    }   
    return Results;
}

/*
     var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_oree_custommemo', null, 'isnotempty', null);
    filters[1] = new nlobjSearchFilter('trandate', null, 'equalTo', 'today');
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custitem_logistic_handling');
    columns[2] = new nlobjSearchColumn('custitem_line_of_business');
    var search = nlapiCreateSearch('item', null, columns);
    var runSearch = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s[resultslice[rs].id] = resultslice[rs];
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
 */

/*
     var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_oree_custommemo', null, 'isnotempty', null);
    filters[1] = new nlobjSearchFilter('trandate', null, 'equalTo', 'today');
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');
    columns[1] = new nlobjSearchColumn('custitem_logistic_handling');
    columns[2] = new nlobjSearchColumn('custitem_line_of_business');
    var search = nlapiCreateSearch('item', null, columns);
    var runSearch = search.runSearch();
    var s = [];
    var searchid = 0;

    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s[resultslice[rs].id] = resultslice[rs];
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
 */