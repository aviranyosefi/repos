


function tofes_yud_alef_client_pageInit(type) {

	var checkReport = document.querySelector('h1.uir-record-type').innerHTML;
	var check = checkReport.includes('Type');

	if (check == true) {
		
	

		var summed_cost_ob;
		var summed_cost_acq;
		var summed_cost_disposal;
		var summed_cost_writedown
		var summed_cost_totals;

		var summed_dprn_ob;
		var summed_dprn_dprn;
		var summed_dprn_disposal;
		var summed_dprn_writedown;
		var summed_dprn_totals;

		function getTotals() {

			var cost_ob = [];
			var cost_acq = [];
			var cost_disposal = [];
			var cost_writedown = [];
			var cost_total = [];

			var dprn_ob = [];
			var dprn_dprn = [];
			var dprn_disposal = [];
			var dprn_writedown = [];
			var dprn_total = [];

			var lineCount = nlapiGetLineItemCount('custpage_results_sublist')

			for (var i = 0; i < lineCount; i++) {

				var costOBLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_c_openbalance', i + 1)
				cost_ob.push(costOBLines);

				var costAcqLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_c_acquisition', i + 1)
				cost_acq.push(costAcqLines);

				var costDisposalLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_c_disposal', i + 1)
				cost_disposal.push(costDisposalLines);

				var costWriteDownLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_c_writedown', i + 1)
				cost_writedown.push(costWriteDownLines);

				var costTotalLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_c_total', i + 1)
				cost_total.push(costTotalLines);

				var dprnOBLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_d_openbalance', i + 1)
				dprn_ob.push(dprnOBLines);

				var dprnDPRNLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_d_depreciation', i + 1)
				dprn_dprn.push(dprnDPRNLines);

				var dprnDisposalLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_d_disposal', i + 1)
				dprn_disposal.push(dprnDisposalLines);

				var dprnWriteDownLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_d_writedown', i + 1)
				dprn_writedown.push(dprnWriteDownLines);

				var dprnTotalLines = nlapiGetLineItemValue(
						'custpage_results_sublist',
						'custpage_resultssublist_d_total', i + 1)
				dprn_total.push(dprnTotalLines);

			}
			summed_cost_ob = cost_ob.reduce(add, 0);
			summed_cost_acq = cost_acq.reduce(add, 0);
			summed_cost_disposal = cost_disposal.reduce(add, 0);
			summed_cost_writedown = cost_writedown.reduce(add, 0);
			summed_cost_totals = cost_total.reduce(add, 0);

			summed_dprn_ob = dprn_ob.reduce(add, 0);
			summed_dprn_dprn = dprn_dprn.reduce(add, 0);
			summed_dprn_disposal = dprn_disposal.reduce(add, 0);
			summed_dprn_writedown = dprn_writedown.reduce(add, 0);
			summed_dprn_totals = dprn_total.reduce(add, 0);
		}

		getTotals()

		function Totals(summed_cost_ob, summed_cost_acq, summed_cost_disposal, summed_cost_writedown, summed_cost_totals, summed_dprn_ob, summed_dprn_dprn, summed_dprn_disposal, summed_dprn_writedown, summed_dprn_totals) {

			var getDiv = document
					.getElementById('custpage_results_sublist_div')

			var rows = getDiv.getElementsByTagName("tr");

			var rowsLength = rows.length

			var cellsLength = rows[0].cells.length

			for (var x = 0; x < cellsLength; x++) {

				var costOBTOTAL = rows[rowsLength - 1].children[1].innerHTML = summed_cost_ob
						.toFixed(2)
				var costACQTOTAL = rows[rowsLength - 1].children[2].innerHTML = summed_cost_acq
						.toFixed(2)
				var costDISPOSALTOTAL = rows[rowsLength - 1].children[3].innerHTML = summed_cost_disposal
						.toFixed(2)
				var costWRITEDOWNTOTAL = rows[rowsLength - 1].children[4].innerHTML = summed_cost_writedown
						.toFixed(2)
				var costTOTALS = rows[rowsLength - 1].children[5].innerHTML = summed_cost_totals
						.toFixed(2)

				var dprnOBTOTAL = rows[rowsLength - 1].children[6].innerHTML = summed_dprn_ob
						.toFixed(2)
				var dprnACQTOTAL = rows[rowsLength - 1].children[7].innerHTML = summed_dprn_dprn
						.toFixed(2)
				var dprnDISPOSALTOTAL = rows[rowsLength - 1].children[8].innerHTML = summed_dprn_disposal
						.toFixed(2)
				var dprnWRITEDOWNTOTAL = rows[rowsLength - 1].children[9].innerHTML = summed_dprn_writedown
						.toFixed(2)
				var dprnTOTALS = rows[rowsLength - 1].children[10].innerHTML = summed_dprn_totals
						.toFixed(2)

			}

		}

		Totals(summed_cost_ob, summed_cost_acq, summed_cost_disposal,
				summed_cost_writedown, summed_cost_totals, summed_dprn_ob,
				summed_dprn_dprn, summed_dprn_disposal, summed_dprn_writedown,
				summed_dprn_totals)

		function setBold() {

			var getDiv = document
					.getElementById('custpage_results_sublist_div')

			var rows = getDiv.getElementsByTagName("tr");

			var rowsLength = rows.length;

			var cellsLength = rows[0].cells.length;

			for (var i = 0; i < rowsLength; i++) {

				var assetTypes = rows[i].children[0].style = "font-weight:bold;";
				var totalCOST_cols = rows[i].children[5].style = "font-weight:bold;";
				var totalDPRN_cols = rows[i].children[10].style = "font-weight:bold;";

			}

			for (var x = 0; x < cellsLength; x++) {

				var headerLabels = rows[0].children[x].children[0].style = "font-weight:bold;";
				var totalRow = rows[rowsLength - 1].children[x].style = "font-weight:bold;";
				var costOBTOTAL = rows[rowsLength - 1].children[0].text = "font-weight:bold;";
			}
			
			 
		}
		setBold();
		setTimeout(function(){
			formatAllNumbers()//format all fields - to currency format
		}, 1000);


		var costCol;
		var dprnCol;
		var netbookVals;
		var netBookCol;

		function setNetBookValues() {

			var getDiv = document
					.getElementById('custpage_results_sublist_div')

			var rows = getDiv.getElementsByTagName("tr");

			var rowsLength = rows.length

			var cellsLength = rows[0].cells.length

			for (var x = 0; x < cellsLength; x++) {
				try {

					costCol = parseFloat(rows[x + 1].children[5].innerHTML);
					dprnCol = parseFloat(rows[x + 1].children[10].innerHTML);

					netbookVals = costCol + dprnCol;

					netBookCol = rows[x + 1].children[11].innerHTML = netbookVals.toFixed(2)
					rows[x + 1].children[11].style = "font-weight:bold;";
				} catch (err) {
					continue;
				}
			}

		}
		setNetBookValues()

		function add(a, b) {
			return parseFloat(a) + parseFloat(b);
		}

	}// end of clientscript for type report

	if (check == false) {

		var getDiv = document.getElementById('custpage_results_sublist_div')

		var rows = getDiv.getElementsByTagName("tr");

		var rowsLength = rows.length

		var cellsLength = rows[0].cells.length
		


	function getTotals() {
	
	var summed_cost_ob;
	var summed_dprn_ob;

	var cost_ob = [];

	var dprn_ob = [];
	var ob_Total = [];
	


	var lineCount = nlapiGetLineItemCount('custpage_results_sublist')

	for(var i = 1; i<=lineCount; i++) {

	var costOBLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_openbalance', i)
	var dprnOBLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_openbalance', i)

	var costAcqLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_acquisition', i)
	var costDisposalLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_disposal', i)
	var costWriteDownLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_writedown', i)

	var dprnDPRNLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_depreciation', i)
	var dprnDisposalLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_disposal', i)
	var dprnWriteDownLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_writedown', i)

	ob_Total.push({
	line : i,
	cost_ob : costOBLines,
	dprn_ob : dprnOBLines,
	costAcqLines : costAcqLines,
	costDisposalLines : costDisposalLines,
	costWriteDownLines : costWriteDownLines,
	dprnDPRNLines : dprnDPRNLines,
	dprnDisposalLines : dprnDisposalLines,
	dprnWriteDownLines : dprnWriteDownLines
	})
	}	
	return ob_Total ;
	}

		var a = getTotals();
		var lineTotals = [];
		var costTotals = [];
		var dprnTotals = [];
		
				
	var TOTAL_obcost = [];
	var TOTAL_acqcost = [];
	var TOTAL_disposalcost = [];
	var TOTAL_writedowncost = [];
	
	var TOTAL_obdprn = [];
	var TOTAL_dprndprn = [];
	var TOTAL_disposaldprn = [];
	var TOTAL_writedowndprn = [];
	var TOTAL_TOTAL = [];
	
	for(var x = 0; x<a.length; x++) {
	
	lineTotals.push(makeTotal(a[x]));
	
	costTotals.push({
						line : a[x].line,
						total1 : a[x].cost_ob,
						total2 : a[x].costAcqLines,
						total3 : a[x].costDisposalLines,
						total4 : a[x].costWriteDownLines,
						})
						
							dprnTotals.push({
						line : a[x].line,
						total1 : a[x].dprn_ob,
						total2 : a[x].dprnDPRNLines,
						total3 : a[x].dprnDisposalLines,
						total4 : a[x].dprnWriteDownLines,
						})
						
			TOTAL_obcost.push(a[x].cost_ob);	
			
			if(a[x].costAcqLines != "") {
			TOTAL_acqcost.push(a[x].costAcqLines);
			}
			if(a[x].costDisposalLines != "") {
			TOTAL_disposalcost.push(a[x].costDisposalLines);
			}
				if(a[x].costWriteDownLines != "") {
			TOTAL_writedowncost.push(a[x].costWriteDownLines);
			}
			
			
			TOTAL_obdprn.push(a[x].dprn_ob);
			
				if(a[x].dprnDPRNLines != "") {
			TOTAL_dprndprn.push(a[x].dprnDPRNLines);
			}
			if(a[x].dprnDisposalLines != "") {
			TOTAL_disposaldprn.push(a[x].dprnDisposalLines);
			}
			if(a[x].dprnWriteDownLines != "") {
			TOTAL_writedowndprn.push(a[x].dprnWriteDownLines);
			}
	}
	
	
	function makeTotal(obj) {
	var total ={};
	var arr = [];
		var vals = Object.values(obj);
        var line = vals[0];
		for(var i = 1; i<vals.length; i++) {
		if(vals[i] == "") {
		vals[i] = '0';
		}
		arr.push(parseFloat(vals[i]))
		}

	
	total = {
	total : arr.reduce(add, 0),
	line : line
	
	};
	
	return total;
	}
	
	
	var totalTOTAL_cost = [];
	var totalTOTAL_dprn = [];
	var totalTOTAL = [];
	
	
	 var tot_obcost = TOTAL_obcost.reduce(add, 0);
	 var tot_acqcost = TOTAL_acqcost.reduce(add, 0);
	 var tot_disposalcost = TOTAL_disposalcost.reduce(add, 0);
	 var tot_writedowncost =  TOTAL_writedowncost.reduce(add, 0);
	 
	 var tot_obdprn = TOTAL_obdprn.reduce(add, 0);
	 var tot_dprndprn = TOTAL_dprndprn.reduce(add, 0);
	 var tot_disposaldprn = TOTAL_disposaldprn.reduce(add, 0);
	 var tot_writedowndprn =  TOTAL_writedowndprn.reduce(add, 0);
	 


var COST_col_total = [];
var DPRN_col_total = [];
var TOTAL_col_total = [];
		 
	for(var i = 0 ; i<lineTotals.length; i++) {
	
	var lineTotal = lineTotals[i].total
	
	//line total
	rows[lineTotals[i].line].children[16].innerHTML = lineTotal.toFixed(2);
	TOTAL_col_total.push(lineTotal);
	
	//line cost total
	rows[lineTotals[i].line].children[10].innerHTML = (makeTotal(costTotals[i]).total).toFixed(2);
		COST_col_total.push(makeTotal(costTotals[i]).total)
		
	//line dprn total
	rows[lineTotals[i].line].children[15].innerHTML = (makeTotal(dprnTotals[i]).total).toFixed(2);
		DPRN_col_total.push(makeTotal(dprnTotals[i]).total)
	
	//TOTAL - openbalance cost
	rows[lineTotals.length].children[6].innerHTML = tot_obcost.toFixed(2);
	
	//TOTAL - Acquisition - COST
	rows[lineTotals.length].children[7].innerHTML = tot_acqcost.toFixed(2);
	
	//TOTAL - Disposal - COST
	rows[lineTotals.length].children[8].innerHTML = tot_disposalcost.toFixed(2);
	
	//TOTAL - Write-Down - COST
	rows[lineTotals.length].children[9].innerHTML = tot_writedowncost.toFixed(2);
	
	//TOTAL - openbalance dprn
	rows[lineTotals.length].children[11].innerHTML = tot_obdprn.toFixed(2);
	
		
	//TOTAL - Depreciation - DPRN
	rows[lineTotals.length].children[12].innerHTML = tot_dprndprn.toFixed(2);
	
	//TOTAL - Disposal - DPRN
	rows[lineTotals.length].children[13].innerHTML = tot_disposaldprn.toFixed(2);
	
	//TOTAL - Write-Down - DPRN
	rows[lineTotals.length].children[14].innerHTML = tot_writedowndprn.toFixed(2);
	
	
	}
	
	
		var endTotal_cost = COST_col_total.reduce(add, 0)
		var endTotal_dprn = DPRN_col_total.reduce(add, 0)
		var endTotalTOTAL = TOTAL_col_total.reduce(add, 0)
		

		
			rows[lineTotals.length].children[16].innerHTML = endTotalTOTAL.toFixed(2);
			rows[lineTotals.length].children[15].innerHTML = endTotal_dprn.toFixed(2);
			rows[lineTotals.length].children[10].innerHTML = endTotal_cost.toFixed(2)
			
					

	


		function add(a, b) {
	    return parseFloat(a) + parseFloat(b);
	}


	}// end of level reprt clientscript
}

if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}




function formatAllNumbers() {

	var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;

	for (var i = 0; i < rowsLength; i++) {
		for (var x = 0; x < cellsLength-1; x++) {
			try {

				
				var currField = rows[i + 1].children[x + 1].innerHTML
				if(currField == NaN || currField == 'NaN') {
					currField = '0'
				}

				rows[i + 1].children[x + 1].innerHTML = formatCurrency(currField)

			} catch (err) {
				continue;
			}
		}
	}

}



function formatCurrency(str) {

	var value = parseFloat(str).toFixed(2);
	var num = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

	return num;

}