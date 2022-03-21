
function tofes_yud_alef_client_pageInit(type) {

	var checkReport = document.querySelector('h1.uir-record-type').innerHTML;
	var check = checkReport.includes('Type');
	
	var checkLanguage = nlapiGetFieldValue('custpage_check_lang');



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
			formatAllNumbers_TypeReport()//format all fields - to currency format
			if(checkLanguage == 'hebrew') {
				setHebrew_TypeReport();
			}
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
			rows[lineTotals.length].children[10].innerHTML = endTotal_cost.toFixed(2);
			
					

	


		function add(a, b) {
	    return parseFloat(a) + parseFloat(b);
	}
			

			
			setTimeout(function(){
				
				var lineTotalObj = getLineTotals()
				setLineTotals(lineTotalObj)
				
				formatAllNumbers_LevelReport()//format all fields - to currency format
				setBold_LevelReport()
				var lineTotalObj = getLineTotals()
				console.log(lineTotalObj)
				setLineTotals(lineTotalObj)
					formatTotalsLineReport()
				
				
				if(checkLanguage == 'hebrew') {
					setHebrew_LevelReport();
				
						var lineTotalObj = getLineTotals()
				setLineTotals(lineTotalObj)
					formatTotalsLineReport()
				
				}
			}, 1000);

	}// end of level reprt clientscript
	
}
	
	
	function setLineTotals(lineTotalObj) {
		
		var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;

	for (var i = 0; i < lineTotalObj.length; i++) {
	
		rows[lineTotalObj[i].line].children[6].innerHTML =  formatCurrency(lineTotalObj[i].obcost_total.toFixed(2))
		rows[lineTotalObj[i].line].children[6].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[7].innerHTML =  formatCurrency(lineTotalObj[i].costAcq_total.toFixed(2))
		rows[lineTotalObj[i].line].children[7].style = "font-weight:bold;";

		rows[lineTotalObj[i].line].children[8].innerHTML =  formatCurrency(lineTotalObj[i].costDisposal_total.toFixed(2))
		rows[lineTotalObj[i].line].children[8].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[9].innerHTML =  formatCurrency(lineTotalObj[i].costWriteDown_total.toFixed(2))
		rows[lineTotalObj[i].line].children[9].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[10].innerHTML =  formatCurrency(lineTotalObj[i].COST_TOTAL.toFixed(2))
		rows[lineTotalObj[i].line].children[10].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[11].innerHTML =  formatCurrency(lineTotalObj[i].obdprn_total.toFixed(2))
		rows[lineTotalObj[i].line].children[11].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[12].innerHTML =  formatCurrency(lineTotalObj[i].dprn_dprn_total.toFixed(2))
		rows[lineTotalObj[i].line].children[12].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[13].innerHTML =  formatCurrency(lineTotalObj[i].dprn_disposal_total.toFixed(2))
		rows[lineTotalObj[i].line].children[13].style = "font-weight:bold;";
						
		rows[lineTotalObj[i].line].children[14].innerHTML =  formatCurrency(lineTotalObj[i].dprn_writedown_total.toFixed(2))
		rows[lineTotalObj[i].line].children[14].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[15].innerHTML =  formatCurrency(lineTotalObj[i].DPRN_TOTAL.toFixed(2))
		rows[lineTotalObj[i].line].children[15].style = "font-weight:bold;";
		
		rows[lineTotalObj[i].line].children[16].innerHTML =  formatCurrency(lineTotalObj[i].NET_TOTAL.toFixed(2))
		rows[lineTotalObj[i].line].children[16].style = "font-weight:bold;";
	


}

	}






function getLineTotals(){


function getTotals() {

var summed_cost_ob;
var summed_dprn_ob;

var cost_ob = [];

var dprn_ob = [];
var ob_Total = [];



var lineCount = nlapiGetLineItemCount('custpage_results_sublist')

for(var i = 1; i<=lineCount; i++) {

var getType = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_type', i)

var costOBLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_openbalance', i)
var dprnOBLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_openbalance', i)

var costAcqLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_acquisition', i)
var costDisposalLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_disposal', i)
var costWriteDownLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_c_writedown', i)

var dprnDPRNLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_depreciation', i)
var dprnDisposalLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_disposal', i)
var dprnWriteDownLines = nlapiGetLineItemValue('custpage_results_sublist','custpage_resultssublist_d_writedown', i)



ob_Total.push({
assetType: getType,
line : i,
cost_ob : costOBLines,
dprn_ob : dprnOBLines,
costAcqLines : costAcqLines,
costDisposalLines : costDisposalLines,
costWriteDownLines : costWriteDownLines,
dprnDPRNLines : dprnDPRNLines,
dprnDisposalLines : dprnDisposalLines,
dprnWriteDownLines : dprnWriteDownLines,
})
}	
return ob_Total ;
}

var tots = getTotals();
var assetTypes = getTypesForTotals();

var totalsArr = [];

assetTypes.forEach(function(element) {

var openBalanceCost = [];
var costAcq = [];
var costDisposal = [];
var costWriteDown = [];

var openBalanceDprn = [];
var dprnDprn = [];
var dprnDisposal = [];
var dprnWriteDown = [];

var netTotalArr = [];

for(var i = 0; i<tots.length; i++) {

if(tots[i].cost_ob != '' && tots[i].assetType == element) {

openBalanceCost.push(parseFloat(tots[i].cost_ob))
}
if(tots[i].costAcqLines != '' && tots[i].assetType == element) {

costAcq.push(parseFloat(tots[i].costAcqLines))
}
if(tots[i].costDisposalLines != '' && tots[i].assetType == element) {

costDisposal.push(parseFloat(tots[i].costDisposalLines))
}

if(tots[i].costWriteDownLines != '' && tots[i].assetType == element) {

costWriteDown.push(parseFloat(tots[i].costWriteDownLines))
}

if(tots[i].dprn_ob != '' && tots[i].assetType == element) {

openBalanceDprn.push(parseFloat(tots[i].dprn_ob))
}

if(tots[i].dprnDPRNLines != '' && tots[i].assetType == element) {

dprnDprn.push(parseFloat(tots[i].dprnDPRNLines))
}

if(tots[i].dprnDisposalLines != '' && tots[i].assetType == element) {

dprnDisposal.push(parseFloat(tots[i].dprnDisposalLines))
}

if(tots[i].dprnWriteDownLines != '' && tots[i].assetType == element) {

dprnWriteDown.push(parseFloat(tots[i].dprnWriteDownLines))
}

if(tots[i].netTotal != '' && tots[i].assetType == element) {

netTotalArr.push(parseFloat(tots[i].netTotal))
}

}

var TOTAL_ob_cost = openBalanceCost.reduce(add, 0);
var TOTAL_cost_acq = costAcq.reduce(add, 0);
var TOTAL_cost_dispoal = costDisposal.reduce(add, 0);
var TOTAL_cost_writedown = costWriteDown.reduce(add, 0);

var TOTAL_ob_dprn = openBalanceDprn.reduce(add, 0);
var TOTAL_dprn_dprn = dprnDprn.reduce(add, 0);
var TOTAL_dprn_dispoal = dprnDisposal.reduce(add, 0);
var TOTAL_dprn_writedown = dprnWriteDown.reduce(add, 0);

var COST_TOTAL = TOTAL_ob_cost+TOTAL_cost_acq+TOTAL_cost_dispoal+TOTAL_cost_writedown
var DPRN_TOTAL = TOTAL_ob_dprn+TOTAL_dprn_dprn+TOTAL_dprn_dispoal+TOTAL_dprn_writedown

var NET_TOTAL = COST_TOTAL-Math.abs(DPRN_TOTAL)

totalsArr.push({

type : element,
obcost_total : TOTAL_ob_cost,
costAcq_total : TOTAL_cost_acq,
costDisposal_total : TOTAL_cost_dispoal,
costWriteDown_total: TOTAL_cost_writedown,
obdprn_total: TOTAL_ob_dprn,
dprn_dprn_total: TOTAL_dprn_dprn,
dprn_disposal_total: TOTAL_dprn_dispoal,
dprn_writedown_total : TOTAL_dprn_writedown,
COST_TOTAL : COST_TOTAL,
DPRN_TOTAL : DPRN_TOTAL,
NET_TOTAL: NET_TOTAL,
line : 0

})


});

var lineObj = getTotalAssetLineNumbers();

for(var i = 0; i<lineObj.length; i++) {
for(var x = 0; x<totalsArr.length; x++) {

if(lineObj[i].asset_type == totalsArr[x].type) {

totalsArr[x].line = lineObj[i].lineNumber
}

}

}


return totalsArr

			function getTypesForTotals() {

var resultsArr = [];

var cols = new Array();
cols[0] = new nlobjSearchColumn('name');
cols[1] = new nlobjSearchColumn('internalid');
cols[2] = new nlobjSearchColumn('custrecord_hebrew_description')

var s = nlapiSearchRecord('customrecord_ncfar_assettype', null, null, cols);

if (s != null) {

for (var i = 0; i < s.length; i++) {

	resultsArr.push(s[i].getValue('name'));

}

}

return resultsArr;
}

function add(a, b) {
return parseFloat(a) + parseFloat(b);
}
	
	function getTotalAssetLineNumbers() {

	var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;
	
	var types = getTypesForTotals();
	
	var assetLines = [];
	
	types.forEach(function(type) {

	for (var i = 0; i < rowsLength; i++) {
		var lineNumber = 0;
		if(rows[i].children[1].innerHTML == 'TOTALS') {
		
		if(rows[i].children[2].innerHTML == type) {
			
		assetLines.push({
			asset_type : type,
			lineNumber : i
		})					
					
		
		}
		}

	}


});

return assetLines;
}

var a = getTotals();
return a;
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




function formatAllNumbers_TypeReport() {

	var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;

	for (var i = 0; i < rowsLength; i++) {
		for (var x = 0; x < cellsLength-1; x++) {
			try {

				
				var currField = rows[i + 1].children[x + 1].innerHTML
				if(currField == 'NaN') {
					currField = '0.00'
				}

				rows[i + 1].children[x + 1].innerHTML = formatCurrency(currField)

			} catch (err) {
				continue;
			}
		}
	}

}


function setHebrew_TypeReport() {


			var getDiv = document
					.getElementById('custpage_results_sublist_div')

			var rows = getDiv.getElementsByTagName("tr");

			var rowsLength = rows.length;

			var cellsLength = rows[0].cells.length;
			
			var assetType = rows[0].children[0].innerHTML;
		
			var allTypes = getTypes();
			
			
		for(var i = 1; i<rowsLength; i++) {
		for(var x = 0; x<allTypes.length; x++) {
		
		if(rows[i].children[0].innerHTML == allTypes[x].type_name) {
		
		rows[i].children[0].innerHTML = allTypes[x].hebrew
		}
		if(rows[i].children[0].innerHTML == 'TOTALS') {
		
		rows[i].children[0].innerHTML = "сд'л"
		}
		
		}
		
		
		
		}
		
		}


function setHebrew_LevelReport() {

		var getDiv = document.getElementById('custpage_results_sublist_div')

		var rows = getDiv.getElementsByTagName("tr");

		var rowsLength = rows.length

		var cellsLength = rows[0].cells.length
		
			var allTypes = getTypes();
			
			
				for(var i = 1; i<rowsLength; i++) {
		for(var x = 0; x<allTypes.length; x++) {
		
		if(rows[i].children[2].innerHTML == allTypes[x].type_name) {
		
		rows[i].children[2].innerHTML = allTypes[x].hebrew
	
		}
		
		}
		
		}

		}

function setBold_LevelReport() {

	var getDiv = document
			.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;

	for (var i = 0; i < rowsLength; i++) {

		var assetTypes = rows[i].children[2].style = "font-weight:bold;";
		var assetNames = rows[i].children[1].style = "font-weight:bold;";
		var totalCOST_cols = rows[i].children[10].style = "font-weight:bold;";
		var totalDPRN_cols = rows[i].children[15].style = "font-weight:bold;";
		var total_cols = rows[i].children[16].style = "font-weight:bold;";

	}

	for (var x = 0; x < cellsLength; x++) {

		var headerLabels = rows[0].children[x].children[0].style = "font-weight:bold;";
		var totalRow = rows[rowsLength - 1].children[x].style = "font-weight:bold;";

	}
	
	 
}

function formatAllNumbers_LevelReport() {

	var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;



			try {
			
	for (var i = 0; i < rowsLength; i++) {
	
				var currFieldCOST = rows[i + 1].children[10].innerHTML;
				var currFieldDPRN = rows[i + 1].children[15].innerHTML;
		
				rows[i + 1].children[10].innerHTML = formatCurrency(currFieldCOST)
				rows[i + 1].children[15].innerHTML = formatCurrency(currFieldDPRN)
				

			}
			

			} catch (err) {
				console.log(err)
			}

	

}

function formatTotalsLineReport() {

	var getDiv = document.getElementById('custpage_results_sublist_div')

	var rows = getDiv.getElementsByTagName("tr");

	var rowsLength = rows.length;

	var cellsLength = rows[0].cells.length;

for(var i = 6; i<cellsLength; i++) {

var currFieldTOTAL = rows[rowsLength -1].children[i].innerHTML;

	rows[rowsLength -1].children[i].innerHTML = formatCurrency(currFieldTOTAL)

}



}



function formatCurrency(str) {

	if (str.indexOf(',') == -1) { //checking if value is already formatted.

		var value = parseFloat(str).toFixed(2);
		var num = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

		return num;
	}

	return str;
	}



function getTypes() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	cols[2] = new nlobjSearchColumn('custrecord_hebrew_description')

	var s = nlapiSearchRecord('customrecord_ncfar_assettype', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push({
				type_name : s[i].getValue('name'),
				internalid : s[i].getValue('internalid'),
				hebrew: s[i].getValue('custrecord_hebrew_description')
			});

		}

	}

	return resultsArr;
}

function getTypesForTotals() {

	var resultsArr = [];

	var cols = new Array();
	cols[0] = new nlobjSearchColumn('name');
	cols[1] = new nlobjSearchColumn('internalid');
	cols[2] = new nlobjSearchColumn('custrecord_hebrew_description')

	var s = nlapiSearchRecord('customrecord_ncfar_assettype', null, null, cols);

	if (s != null) {

		for (var i = 0; i < s.length; i++) {

			resultsArr.push(s[i].getValue('name'));

		}

	}

	return resultsArr;
}


