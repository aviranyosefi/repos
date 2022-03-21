var currentTotals = [];
var tot_no_current = [];
var tot_one_to_thirty = [];
var tot_thirtyone_to_sixty = [];
var tot_sixtyone_to_ninety = [];
var tot_over_ninetyone = [];
var tot_totals = [];

function getReport() {

var allCells = [];
var eachSub = [];
var a = nlapiLoadSearch('transaction', 439);
var resultset = a.runSearch();
var resultslice = resultset.getResults(0, 0 + 1000);


               if (resultslice != null) {
                              resultslice.forEach(function(line) {
                              
                              allCells.push({
                              
                              values : line.rawValues
                              
                              });

               });

               };
                              
                             allCells.forEach(function(line) {

                              eachSub.push({
                            	  
                              subsidiary : line.values[7].text,
                              total_no_current : line.values[6].value,
                              current : line.values[0].value,
                              one_to_thirty : line.values[1].value,
                              thirtyone_to_sixty : line.values[2].value,
                              sixtyone_to_ninety : line.values[3].value,
                              over_ninetyone : line.values[4].value,
                              subsid_total : line.values[5].value
                              
                              
                              });

               });
               
return eachSub;
}



function agingreportClientInit() {

    var results = getReport();
    
    for(var i = 0; i<results.length; i++) {
    	
    	currentTotals.push(parseFloat(results[i].current));
		tot_no_current.push(parseFloat(results[i].total_no_current));

		
		if(results[i].one_to_thirty == ''){
			results[i].one_to_thirty  ='0.00';
			}
		
		if(results[i].thirtyone_to_sixty == ''){
		results[i].thirtyone_to_sixty  ='0.00';
		}
			tot_thirtyone_to_sixty.push(parseFloat(results[i].thirtyone_to_sixty));
			
			if(results[i].sixtyone_to_ninety == ''){
				results[i].sixtyone_to_ninety  ='0.00';
				}
			
			if(results[i].over_ninetyone == ''){
				results[i].over_ninetyone  ='0.00';
				}
			tot_one_to_thirty.push(parseFloat(results[i].one_to_thirty));
			tot_sixtyone_to_ninety.push(parseFloat(results[i].sixtyone_to_ninety));
    	tot_over_ninetyone.push(parseFloat(results[i].over_ninetyone));
		tot_totals.push(parseFloat(results[i].subsid_total));
    }
    
    
    var ltdTotal = tot_totals[0];
    var ltdTotalNoCurr = tot_no_current[0];
    var incTotal = tot_totals[1];
    var incTotalNoCurr = tot_no_current[1];
    var sasTotal = tot_totals[2];
    var sasTotalNoCurr = tot_no_current[2];
    
    
    currentTotals = currentTotals.reduce(add,0);
    tot_no_current = tot_no_current.reduce(add,0);
    tot_one_to_thirty = tot_one_to_thirty.reduce(add,0);
    tot_thirtyone_to_sixty = tot_thirtyone_to_sixty.reduce(add,0);
    tot_sixtyone_to_ninety = tot_sixtyone_to_ninety.reduce(add,0);            
    tot_over_ninetyone = tot_over_ninetyone.reduce(add,0);
    tot_totals = tot_totals.reduce(add,0);

    var totalsObj = {

    subsidCol : 'Totals',
    totalCurrent : currentTotals.toFixed(2),
    totalOne_Thirty : tot_one_to_thirty.toFixed(2),
    totalThirtyOne_Sixty : tot_thirtyone_to_sixty.toFixed(2),
    totalSixtyOne_Ninety : tot_sixtyone_to_ninety.toFixed(2),
    totalOverNinetyOne : tot_over_ninetyone.toFixed(2),
    totalNoCurrent : tot_no_current.toFixed(2),
    totalTotal : tot_totals.toFixed(2)


    };
    
    results.push({
    	
        subsidiary : 'Totals',
        total_no_current : tot_no_current.toFixed(2),
        current : currentTotals.toFixed(2),
        one_to_thirty : tot_one_to_thirty.toFixed(2),
        thirtyone_to_sixty : tot_thirtyone_to_sixty.toFixed(2),
        sixtyone_to_ninety : tot_sixtyone_to_ninety.toFixed(2),
        over_ninetyone : tot_over_ninetyone.toFixed(2),
        subsid_total : tot_totals.toFixed(2)
    	
    	
    });
    

    
    
    var totalsStr = JSON.stringify(totalsObj);
    var resultStr = JSON.stringify(results);
    
    nlapiSetFieldValue('custpage_alltotal', tot_totals.toFixed(2), null, null);
    nlapiSetFieldValue('custpage_total_nocurr', tot_no_current.toFixed(2), null, null);
    
    
    nlapiSetFieldValue('custpage_percltd', perc(ltdTotalNoCurr,ltdTotal));
    nlapiSetFieldValue('custpage_percinc', perc(incTotalNoCurr, incTotal));
    nlapiSetFieldValue('custpage_percsas', perc(sasTotalNoCurr, sasTotal));
    
    nlapiSetFieldValue('custpage_totltd', formatNumber(ltdTotalNoCurr));
    nlapiSetFieldValue('custpage_totinc', formatNumber(incTotalNoCurr));
    nlapiSetFieldValue('custpage_totsas', formatNumber(sasTotalNoCurr));
    
    nlapiSetFieldValue('custpage_total_no_current', formatGrandTotal(tot_no_current));
    
    nlapiSetFieldValue('custpage_grandtotal', perc(tot_no_current,tot_totals));
    
    nlapiSetFieldValue('custpage_results', resultStr, null, null);
    nlapiSetFieldValue('custpage_grandtotals', totalsStr, null, null);


               }
               
               
function add(a, b) {
    return a + b;
}

function perc(a, b) {

	var c = a/b;
	var d = c*100;

	return d.toFixed(2)+'%';
	 }
	 
function go_back() {
	window.location.href = 'https://system.eu2.netsuite.com/app/site/hosting/scriptlet.nl?script=314&deploy=1&compid=4511400&whence=';
}

function formatNumber (num) {


	var numStr = num.toString();
	var res = numStr.split(".");
	
	var scndPart = res[1];
	
if(scndPart == undefined) {
	
	scndPart = '00';
}
	
	var firstPart = res[0].toString();
	
	var secondPart = parseInt(scndPart, 2);
//	
	var frstPrt = firstPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	

	
    return frstPrt+'.'+scndPart;
	
//	return num.toString();
}


function formatGrandTotal(num) {
	
	var numStr = num.toString();
	var res = numStr.split(".");
	
//	var scndPart = res[1];
//	
//if(scndPart == undefined) {
//	
//	scndPart = '00';
//}
	
	var firstPart = res[0].toString();
	
	var secondPart = res[1].substring(0,2);
//	
	var frstPrt = firstPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	

	
    return frstPrt+'.'+secondPart;
	
	
	
}

