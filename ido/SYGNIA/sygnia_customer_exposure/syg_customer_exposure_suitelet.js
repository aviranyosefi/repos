/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 May 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function syg_customer_exposure(request, response){
	
	var allTran = getAllTransactions();
	var allTime = getAllTimeTrack();
	
	var allClients = [];
	
	
	for(var i = 0; i<allTran.length; i++) {
		
		allClients.push(allTran[i].clientname)
	}
	
	for(var j = 0; j<allTime.length; j++) {
		
		allClients.push(allTime[j].clientname)
	}
	
	var uniqueClients = removeDuplicates(allClients)
	var clientArr = {};

	uniqueClients.forEach(function(client) {

		clientArr[client] = [];

	});


var keys = Object.keys(clientArr)

for(var i = 0; i<keys.length; i++) {
	
	for(var x = 0; x<allTran.length; x++) {
		
		if(allTran[x].clientname == keys[i]) {
			
			var obj = {
					trantotal : allTran[x].trantotal
			}
			
			clientArr[keys[i]] = obj
		}
	}
}



var clientKeys= Object.keys(clientArr)

for(var j = 0; j<clientKeys.length; j++) {
	
	for(var m = 0; m<allTime.length; m++) {
		
		if(allTime[m].clientname == clientKeys[j]) {	
			clientArr[clientKeys[j]].duration = allTime[m].duration
		}
	}
}

//console.log(clientArr)
var res = massageData(clientArr)
//console.log(res)


	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('Sygnia Customer Exposure');
		//form.addSubmitButton('Continue');
		
		
		var resultsSubList = form.addSubList('custpage_results_sublist', 'list', null, null);
		
		var res_client = resultsSubList.addField('custpage_resultssublist_client', 'text','Client/Project');
		var res_opentran = resultsSubList.addField('custpage_resultssublist_opentran', 'text','Open Transactions');
		var res_unbilled = resultsSubList.addField('custpage_resultssublist_unbilled', 'text','Un-billed Time Sheets');
		
		for(var x = 0; x<res.length; x++) {
			
			resultsSubList.setLineItemValue('custpage_resultssublist_client',x+1 ,res[x].client);
			resultsSubList.setLineItemValue('custpage_resultssublist_opentran',x+1 ,formatNumber(res[x].trantotal));
			resultsSubList.setLineItemValue('custpage_resultssublist_unbilled',x+1 ,res[x].duration);
			
		}
		



		response.writePage(form);

		}//end of first if





}



function getAllTransactions() {
	

	var searchFAM = nlapiLoadSearch(null, 'customsearch_exposure_transaction');


	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();

	do {
		if(resultslice != null) {
			
	
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

		theResults.push({

			clientname : line.getText(cols[0]),
			trantotal : line.getValue(cols[1]),

		});

		});

	};
	return theResults;
}

function getAllTimeTrack() {
	

	var searchFAM = nlapiLoadSearch(null, 'customsearch_exposure_tme_track');


	var allSelection = [];
	var theResults = [];
	var allResults = [];
	var resultSelection = [];
	var searchid = 0;
	var resultset = searchFAM.runSearch();
	var rs;
	var cols = searchFAM.getColumns();

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allSelection
					.push(resultSelection[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allSelection != null) {
		allSelection.forEach(function(line) {

		theResults.push({

			clientname : line.getText(cols[0]),
			duration : line.getValue(cols[1]),

		});

		});

	};
	return theResults;
}





function removeDuplicates(arr){
    var unique_array = []
    for(var i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}


function massageData(clientArr) {
	
	var data = clientArr;
	var res = [];
	var keys = Object.keys(data);
	
	for(var i = 0; i< keys.length; i++) {
		
		var duration = data[keys[i]].duration;
		if(duration == undefined) {
			duration = '0'
		}
		var trantotal = data[keys[i]].trantotal;
		if(trantotal == undefined) {
			trantotal = '0'
		}
		
		res.push({
			client: keys[i],
			trantotal : trantotal,
			duration : duration,
			
		})
	}
	
	return res;
}

function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}