var SO = [];
var SO_lines =[];
var s = [];
SO_Select();


function UserEventAddPrintBtn() {
    try {

        var internalId = nlapiGetRecordId();
        var res = GetSOLines(internalId);
        if (res){
        var button = form.addButton('custpage_create_be', 'Create BE',"OpenBillingSuitelet();");
        var button = form.addButton('custpage_next_bill', 'BE Bill',"CreateInv();");
        form.setScript('customscript_dev_cs_complex_billing');
        }

    }catch (exception) {
        nlapiLogExecution('DEBUG', 'Error in AddButton()', exception);
    }
 }





function SO_Select(){

    var loadedSearch = nlapiLoadSearch(null, 'customsearch200202');
    var runSearch = loadedSearch.runSearch()
    var searchid = 0;

    do{
    var resultslice = runSearch.getResults(searchid, searchid + 1000);
    for (var rs in resultslice) {
    s.push(resultslice[rs]);			
    searchid++;
    }
    } while (resultslice.length >= 1000);


    if(s.length >0){

    for (var i=0 ;i<s.length;i++){
    SO.push({			
    id: s[i].id,
    tranID: s[i].getValue('tranid'),

    });
    }	
}

return SO;
}
//amount orig currency
function GetSOLines(saleorder){

    for(var j=0 ;j<s.length;j++){	
        if( s[j].id == saleorder ){	

            return true;
     }
    }	
    return false;

}