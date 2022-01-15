// Create a standard NetSuite record
function loadsearch(datain) {

    nlapiLogExecution('debug', ' datain:', JSON.stringify(datain));
    nlapiLogExecution('debug', ' after run:', 'customsearch' + datain.searchid);

    var returnRes = [];
    try {
        var search = nlapiLoadSearch(null, 'customsearch' + datain.searchid);
        nlapiLogExecution('debug', 'start after load:','customsearch' + datain.searchid);
        var resultSet = search.runSearch();
        if (resultSet != null) {
     
            var startfrom = 0;
            do {
              
                nlapiLogExecution('debug', ' before get results:', startfrom);
                var resultslice = resultSet.getResults(startfrom, startfrom + 1000);
                //var cols = resultSet.getColumns();
                nlapiLogExecution('debug', ' resultslice', resultslice.length);

                for (var rs in resultslice) {
                    var  cols = resultslice[0].getAllColumns();
                    var curRes = resultslice[rs];
                    var obj = new Object();

                    for (var j = 0; j < cols.length ; j++) {
                        val = curRes.getText(cols[j]);
                        if (val == null)
                            val = curRes.getValue(cols[j]);

                        val = val.replace(/"/g, "");
                        val = val.replace(/'/g,  "");
                        obj[cols[j].getLabel()] = val;
                    }
                    //allobjs += JSON.stringify(obj);
                    returnRes.push(obj);
                    startfrom++;
                }
            } while (resultslice.length >= 1000);
        }
    }
    catch (e) {
        nlapiLogExecution('debug', ' error', e);
    };
    //return "{{status:OK},{jfrogid:45654}},{{status:OK},{jfrogid:45654}},{{status:OK},{jfrogid:45654}},{{status:OK},{jfrogid:45654}}";
    nlapiLogExecution('debug', 'returnRes:', returnRes.length);
    // var dataout = JSON.stringify(returnRes);
    //returnRes = allobjs.toJSONString();
    //return "{" + allobjs + "}";
    return returnRes ;
}

//https://4520481-sb1.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=517&deploy=1&searchid=494
//NLAuth nlauth_account=4520481_SB1, nlauth_email=avirany@one1.co.il, nlauth_signature=Neta181190@$, nlauth_role=3

//prod
// https://4520481.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=539&deploy=1
