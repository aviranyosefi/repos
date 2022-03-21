

	var today = new Date();
	var todayStr = nlapiDateToString(today);
		

	var fourMonthsAgo = nlapiAddMonths(today, -4);
	var fourMonthsAgoStr = nlapiDateToString(fourMonthsAgo);


function getSearch(todayStr, fourMonthsAgoStr) {
	
	var startdate = "TO_DATE("+fourMonthsAgoStr+", 'DD/MM/YYYY')"//;
	var enddate = "TO_DATE("+todayStr+", 'DD/MM/YYYY')"//;
	
	
	var search = nlapiLoadSearch(null, 'customsearch_gal_custstate_openbalance_7')
		
	var cols = search.getColumns();
	var fils = search.getFilters();
	
	
	var newCols = [];
	var newFils = [];
	
	for(var i = 0; i<fils.length; i++) {
		
		var curr = fils[i]
		var currFormula = fils[i].formula
		
		if(currFormula == null) {
			newFils.push(curr);
		}
		
		if(fils[i].formula != null) {
			
			if(currFormula.indexOf('{user.custentity_financial_report_start_date}') != -1) {
				
				currFormula = currFormula.replace('{user.custentity_financial_report_start_date}',startdate)
				fils[i].formula = currFormula
				newFils.push(fils[i]);
			}	
		}
	}
	
	for(var i = 0; i<cols.length; i++) {

		var currCol = cols[i];
		
		if(currCol.formula == null) {
			
			newCols.push(cols[i]);
		}else{
			
			var colFormula = currCol.formula;
			
			if(colFormula.indexOf('{user.custentity_financial_report_start_date}') != -1) {	
				colFormula = colFormula.replace(/{user.custentity_financial_report_start_date}/g, startdate)
				cols[i].formula = colFormula
				//newCols.push(cols[i]);
			}
			
			 if(colFormula.indexOf('{user.custentity_financial_report_end_date}') != -1) {	
				colFormula = colFormula.replace(/{user.custentity_financial_report_end_date}/g, enddate)
				cols[i].formula = colFormula
				//newCols.push(cols[i]);
			}
			else{
				//newCols.push(cols[i])
			}
		}

	}


	search.setFilters(newFils)
	search.setColumns(newCols)

	return search;
}



var a = getSearch(todayStr, fourMonthsAgoStr)
console.log(a)
var resultset = a.runSearch();

var resultslice = resultset.getResults(0, 0 + 1000);
console.log(resultslice)


