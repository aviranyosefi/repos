function DeleteRecords() {
    try {
         res = getAllRecords();
        if (res.length > 0) {
            var context = nlapiGetContext();

            for (var i = 0; i < res.length; i++) {
                try {

                    if (context.getRemainingUsage() < 150) {
                        nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage()); var state = nlapiYieldScript();
                        if (state.status == 'FAILURE') {
                            nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                        }
                        else if (state.status == 'RESUME') {
                            nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                        }
                    }


                 
                    nlapiDeleteRecord(res[i].type, res[i].id)
                   
                } catch (e) {
                    console.log(e)
                    nlapiLogExecution('error', 'loop search', e)

                }
            } // end for loop

        }
        // UpdateRevenue_second();
    } catch (err) {
        nlapiLogExecution('error', 'DeleteRecords()', err)
    }

}





function getAllRecords() {


    var search = nlapiLoadSearch(null, 'customsearch_delete_records');
  

    var allSelection = [];
    var s = [];

    var searchid = 0;
    var resultset = search.runSearch();

   

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);

        for (rs in resultslice) {
            var columns = resultslice[0].getAllColumns();

            allSelection
                .push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    for (var i = 0; i < allSelection.length; i++) {
        console.log(search.type + 'id : ' + allSelection[i].getValue(columns[0]));
        s.push({
                type: search.type,
                id: allSelection[i].getValue(columns[0])
            });
    
      
    }

   


    return s;
}