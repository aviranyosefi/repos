
function getBillsJournal(bill) {
    try {
        var itemReceipt = [];
        var journal = [];
        var lastJournal;
        for (rs in res1) {
            if (bill == res1[rs].billId) {          
                itemReceipt.push(res1[rs].itemReceipt);
            }
        }
        if (itemReceipt.length > 0) {
            for (i in itemReceipt) {
                for (rs in res2) {
                    if (itemReceipt[i] == res2[rs].itemReceipt) {
                        if (lastJournal != res2[rs].itemReceipt) {
                            journal.push(res2[rs].jurnalNo);
                        }
                    }
                    lastJournal = res2[rs].itemReceipt;
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'getBillsJournal func', e)
    }
    return journal
    
}

function getJournalSearch() {
    try {
        var searchElements = nlapiLoadSearch(null, 'customsearch_itemreceipt_to_journal');
        var allSelection = [];
        var allResults = [];
        var searchid = 0;
        var resultset = searchElements.runSearch();
        var rs;
        var lastjurnalid;

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (rs in resultslice) {

                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);

        if (allSelection != null) {
            allSelection.forEach(function (line) {
                
                if (lastjurnalid != line.getValue('tranid')) {

                    allResults.push({
                        jurnalNo: line.getValue('tranid'),
                        jurnalId: line.getValue('internalid'),
                        itemReceipt: line.getValue('custbody_sst_created_from'),

                    });
                }
                lastjurnalid = line.getValue('tranid');

            });
        };
    } catch (e) {
        nlapiLogExecution('error', 'getJournalSearch func', e)
    }
    return allResults;
}

function getBillSearch() {
    try {
        var searchElements = nlapiLoadSearch(null, 'customsearch_po_bill');
        var allSelection = [];
        var allResults = [];
        var searchid = 0;
        var resultset = searchElements.runSearch();
        var rs;
        var lasttranid;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (rs in resultslice) {

                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice.length >= 1000);

        if (allSelection != null) {
            allSelection.forEach(function (line) {
                if (lasttranid != line.getValue('tranid')) {

                    allResults.push({
                        poNo: line.getValue('tranid'),
                        poId: line.getValue('internalid'),
                        billNo: line.getValue('tranid', 'billingTransaction'),
                        billId: line.getValue('internalid', 'billingTransaction'),
                        itemReceipt: line.getValue('applyingtransaction'),
                    });
                }

                lasttranid = line.getValue('tranid');

            });

        };
    } catch (e) {
        nlapiLogExecution('error', 'getBillSearch func', e)
    }
    return allResults;
}

var res1 = getBillSearch();
var res2 = getJournalSearch();

