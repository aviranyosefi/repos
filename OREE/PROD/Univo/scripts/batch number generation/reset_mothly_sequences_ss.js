var recsForReset = [];

function resetsecuenses() {
    recsForReset = getLotNumberRecords();
    if (recsForReset != undefined && recsForReset.length > 0) {
        for (i = 0; i < recsForReset.length; i++) {
            nlapiSubmitField('customrecord_lot_number_sequence', recsForReset[i].id, 'custrecord_lot_number_sequence', 1);
        }
    }
}

function getLotNumberRecords() {
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('internalid');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_sequence_reset_period', null, 'is', '2');
    var Results = [];

    var results = nlapiCreateSearch('customrecord_lot_number_sequence', filters, columns);
    var runSearch = results.runSearch();
    var s = [];
    var searchid = 0;
    do {
        var resultslice = runSearch.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            Results[i] = {
                id: s[i].getValue('internalid'),
            }
        }
    }
    return Results;
}