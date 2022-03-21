var invForLTDSAS = [];
var invForINC = [];


var firstFollow = [];
var secondFollow = [];
var afterdueThree = [];
var afterdueWeek = [];
var afterdueTwoWeek = [];

function getInvPool() {

	var searchPool = nlapiLoadSearch(null, 'customsearch_ilo_jfrog_invoice_search');

	var allinv = [];
	var invPool =[];
	var resultDocs = [];
	var searchid = 0;
	var resultset = searchPool.runSearch();
	var rs;

	do {
	    var resultslice = resultset.getResults(searchid, searchid + 1000);
	    for (rs in resultslice) {
	        
			allinv.push(resultDocs[resultslice[rs].id] = resultslice[rs]);
	        searchid++;
	    }
	} while (resultslice.length >= 1000);

			if (allinv != null) {
				allinv.forEach(function(line) {
					

					invPool.push({
					
					inv_created : line.getValue('trandate'),
					inv_duedate : line.getValue('duedate'),
					inv_id : line.id,
					inv_subsidiary : line.getValue('subsidiary'),
					inv_terms : line.getText('terms'),
					invdays_open : line.getValue('daysopen'),
				    invdays_overdue : line.getValue('daysoverdue'),
				    inv_name : line.getText('name'),
				    second_follow : '0'
	
					});

				});

			};
			
			return invPool;

	}
	
	
	var poolMain = getInvPool();

	var currDueDate;

function invMail_router(type) {
	
	
		
	for (var i = 0; i < poolMain.length; i++) {
		
		
		
		//first follow-up
		if (poolMain[i].invdays_open == 7) {
			if(poolMain[i].inv_subsidiary == '1' || '4') {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
			if(poolMain[i].inv_subsidiary == '2') {
				
				invForINC.push(poolMain[i].inv_id);
			}

		
		}

		//first alert
		if (poolMain[i].invdays_overdue == 3) {
			if(poolMain[i].inv_subsidiary == '1' || '4') {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
			if(poolMain[i].inv_subsidiary == '2') {
				
				invForINC.push(poolMain[i].inv_id);
			}

			
		}
		//second alert
		if (poolMain[i].invdays_overdue == 10) {

			if(poolMain[i].inv_subsidiary == '1' || '4') {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
			if(pool[i].inv_subsidiary == '2') {
				
				invForINC.push(poolMain[i].inv_id);
			}
		}
		//third alert
		if (poolMain[i].invdays_overdue == 17) {
			if(poolMain[i].inv_subsidiary == '1' || '4') {
				
				invForLTDSAS.push(poolMain[i].inv_id);
			}
			if(poolMain[i].inv_subsidiary == '2') {
				
				invForINC.push(poolMain[i].inv_id);
			}
		}

		
		//second follow-up
		////add week before due date/////////
		
		currDueDate = poolMain[i].inv_duedate;
		var myDate = nlapiStringToDate(currDueDate);

		var months = myDate.getMonth();
		var days = myDate.getDate();


		var today=new Date();

		var daysBeforeDueDate =new Date(today.getFullYear(), months, days); //Month is 0-11 in JavaScript
		//Set 1 day in milliseconds
		var one_day=1000*60*60*24;
		 
		 
		var daysBefore = Math.ceil((daysBeforeDueDate.getTime()-today.getTime())/(one_day));
		
if(daysBefore == 7) {
	if(poolMain[i].inv_subsidiary == '1' || '4') {
		
		invForLTDSAS.push(poolMain[i].inv_id);
	}
	if(poolMain[i].inv_subsidiary == '2') {
		
		invForINC.push(poolMain[i].inv_id);
	}
}
	}
	
	
	//routing
	

	
	nlapiLogExecution('DEBUG', 'firstFollow', firstFollow);
	nlapiLogExecution('DEBUG', 'secondFollow', secondFollow);
	nlapiLogExecution('DEBUG', 'afterdueThree', afterdueThree);
	nlapiLogExecution('DEBUG', 'afterdueWeek', afterdueWeek);
	nlapiLogExecution('DEBUG', 'afterdueTwoWeek', afterdueTwoWeek);
	
	nlapiScheduleScript('customscript_ilo_invmail_ltdsas_sender', 'customdeploy_ilo_invmail_ltdsas_sender_d', {custscript_ilo_invmail_ltdsas_params: invForLTDSAS});
	nlapiScheduleScript('customscript_ilo_invmail_inc_sender_ss', 'customdeploy_ilo_invmail_inc_sender_dep', {custscript_ilo_invmail_inc_params: invForINC});


}
