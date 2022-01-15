function updateRecordTypeMemo(type) {
    var filters = new Array();
    //filters[0] = new nlobjSearchFilter('custrecord_oree_custommemo', null, 'isnotempty', null);
    //filters[1] = new nlobjSearchFilter('trandate', null, 'equalTo', 'today');
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_oree_custommemo');
    var search = nlapiCreateSearch('customrecord192', filters, columns);
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

    var date = new Date();
    var tdate = date.getDate();
    var month = date.getMonth() + 1; // jan = 0
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var currentDate = month + '/' + tdate + '/' + year + '-' + hour + ':' + min + ':' + sec;
    var context = nlapiGetContext();
    for (var i = 0; i < s.length; i++) {
        var recid = s[i].id;
        var str = s[i].getValue('custrecord_oree_custommemo');
        srt = str + ' additional text ' + currentDate;

        nlapiSubmitField('customrecord192', recid, 'custrecord_oree_custommemo', srt);
        if (context.getRemainingUsage() < 150) {
            nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
            if (state.status == 'FAILURE') {
                nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
            }
            else if (state.status == 'RESUME') {
                nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
            }
        }
    }    
}