// JavaScript source code

    function hightAmount() {
        var loadedSearch = nlapiLoadSearch(null, 'customsearch586');
        var runSearch = loadedSearch.runSearch();
        var rec, isUpdate;
        var amount;
        var vendors = [];
        var resultsmulti = [];
        var high_amount_count;
        var searchid = 0;
        try {
            do {
                var results = runSearch.getResults(searchid, searchid + 1000);
                for (rs in results) {   
                    searchid++;
                    resultsmulti.push(results[rs]); 
                }

            } while (results.length >= 1000);

            for (r in resultsmulti) {  
                rec = nlapiLoadRecord(resultsmulti[r].type, resultsmulti[r].id); // results[i].type == 'vendorbill'
                high_amount_count = 0;
                isUpdate = false;
                    if (rec != null && rec != "") {
                        var itemCount = rec.getLineItemCount('item');
                        for (var j = 1; j <= itemCount; j++) {
                            amount = rec.getLineItemValue('item', 'amount', j);
                            if (amount > 0) {  //amount > 2500
                               rec.setLineItemValue('item', 'custcol_high_amount', j, 'T');
                               isUpdate = true;
                                high_amount_count++;
                            }
                        }
                        if (isUpdate) nlapiSubmitRecord(rec);
                        if (high_amount_count > 1)
                            vendors.push({
                                name: rec.getFieldValue('entityname'),
                                billNo: rec.getFieldValue('transactionnumber')
                            });
                    }
            }
           
            if (vendors.length > 0) email(vendors);

        } catch (e) {
            nlapiLogExecution('error', 'hightAmount()', e);
        }
    } 


function email(vendors) {
    try {
    
        var subject = "Vendors List ";
        var body = "<h3><span style='color:blue; font-weight: bold ;'>vendors whit two true lines : </span><br></h3>";
         /*
        var list = "<table border=1>";
        // for th
        list += "<tr> <th> Vendor Name</th> <th> Bill No.</th>"
        for (v in vendors) {
            list += "<tr><th>" + vendors[v].name +"</th> <th>"+ vendors[v].billNo +"</th></tr> "  
        }
        list += "</table>"
        */
        
        var list = "<ol>";
        for (v in vendors) {
            list += "<li> vendor name: " +  vendors[v]  + " .</li><br>";
        }
        list += "</ol>";  
        body += list;
        body += "Total: " + vendors.length + " vendors.";
        nlapiSendEmail('617', 'avirany@one1.co.il', subject, body);
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
    
}

 
    /*
    for (var i = 0; i < results.length && results != null; i++) {
        isUpdate = false;
        rec = nlapiLoadRecord(results[i].type, results[i].id);
        if (rec != null && rec != "") {
            var itemCount = rec.getLineItemCount('item');
            for (var j = 1; j <= itemCount; j++) {
                amount = rec.getLineItemValue('item', 'amount', j);
                if (amount > 2500) {
                    rec.setLineItemValue('item', 'custcol_high_amount', j, 'T');
                    isUpdate = true;
                }
            }
            if (isUpdate) nlapiSubmitRecord(rec);
            if (itemCount > 1) {
                for (var x = 1; x <= itemCount; x++) {
                    if (rec.getLineItemValue('item', 'custcol_high_amount', x) == 'T') {
                        high_amount_count += 1;
                    }
                }
                if (high_amount_count > 1) vendors.push(rec.getFieldValue('companyid'));
            }
        }
    }
    */




