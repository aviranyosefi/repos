// NCS.SS.Transaction.Forms.Admin - > LINE 405
// NCS.Lib.Helpers.js -> LINE 582  - 618


var arragmentRec = null;
var secondArragmentRec = null;
var soRec = null;

function beforSubmit(){
	
	var itemsLineCount = nlapiGetLineItemCount('item')
	var tranDate = nlapiGetFieldValue ( 'trandate' )
	var so = nlapiGetFieldValue ( 'createdfrom' )
	soRec =nlapiLoadRecord('salesorder', so)
	nlapiLogExecution('debug', 'createdfrom', so);
	var soCount=  soRec.getLineItemCount('item');
	var startDate= '' ,  endDate = '';	
	for (var line = 1; line <= itemsLineCount; line++) {
		
		var endDateUpdated = nlapiGetLineItemValue ( 'item' , 'custcol_cbr_end_date_updated' , line )
		var period = nlapiGetLineItemValue ( 'item' , 'custcol_cbr_period' , line )
		if (endDateUpdated == 'T'  && !isNullOrEmpty(period) ) {
								
			var ff_start_date = nlapiGetLineItemValue ( 'item' , 'custcol_cbr_start_date' , line )
			var ff_end_date = nlapiGetLineItemValue ( 'item' , 'custcol_cbr_end_date' , line )
			nlapiLogExecution('debug', 'ff_start_date line: '+line, ff_start_date);
			nlapiLogExecution('debug', 'ff_end_date line: '+line, ff_end_date);
			var orderline = nlapiGetLineItemValue ( 'item' , 'orderline' , line )
			for (var j=1 ; j<= soCount ; j++ ){
				
				var ff_line = soRec.getLineItemValue( 'item' , 'line' , j )
				if(orderline ==  ff_line){
					 
					 var so_start_date = soRec.getLineItemValue( 'item' , 'custcol_cbr_start_date' , j )
					 var so_end_date = soRec.getLineItemValue( 'item' , 'custcol_cbr_end_date' , j )
					 var lineuniquekey = soRec.getLineItemValue( 'item' , 'lineuniquekey' , j  );
					 if (ff_start_date ==so_start_date && ff_end_date == so_end_date &&  ff_start_date != ff_end_date  ){
						nlapiLogExecution('debug', '1 line: '+line, '1');					
						startDate = tranDate;
						nlapiSetLineItemValue ( 'item' , 'custcol_cbr_start_date' , line  ,startDate )
						nlapiLogExecution('DEBUG', 'startDate', startDate);
											
						endDate = getPeriodEndDate(nlapiStringToDate(startDate), period);
						nlapiSetLineItemValue ( 'item' , 'custcol_cbr_end_date' , line  ,endDate )
						nlapiLogExecution('DEBUG', 'endDate', endDate);												
						
						soRec.setLineItemValue( 'item' , 'custcol_cbr_start_date' , j  ,startDate );
						soRec.setLineItemValue( 'item' , 'custcol_cbr_end_date' , j , endDate );
						var startDateObj = nlapiStringToDate(startDate)
						period = getMonthDiff_fractional( startDateObj, endDate);
						nlapiSetLineItemValue ( 'item' , 'custcol_cbr_period' , line  ,period )
						soRec.setLineItemValue( 'item' , 'custcol_cbr_period' , j , period )
						if( !isNullOrEmpty(lineuniquekey)){
								updateArragmemt(lineuniquekey  , startDate  , endDate, period);
								updateSecondArragmemt(lineuniquekey  , startDate  , endDate , period);
							}
						
		    							
					 } // if (ff_start_date ==so_start_date && ff_end_date == so_end_date )
					
					else{
						if(ff_start_date == ff_end_date ){
							nlapiLogExecution('debug', '2 line: '+line, '2');
							
							nlapiSetLineItemValue ( 'item' , 'custcol_cbr_start_date' , line  ,tranDate )
							nlapiSetLineItemValue ( 'item' , 'custcol_cbr_end_date' , line  ,tranDate )
							soRec.setLineItemValue( 'item' , 'custcol_cbr_start_date' , j  ,tranDate )
							soRec.setLineItemValue( 'item' , 'custcol_cbr_end_date' , j , tranDate )
							var startDateObj  = nlapiStringToDate(tranDate)
							period = getMonthDiff_fractional( startDateObj, nlapiStringToDate(tranDate));
							nlapiSetLineItemValue ( 'item' , 'custcol_cbr_period' , line  ,period )
							soRec.setLineItemValue( 'item' , 'custcol_cbr_period' , j , period )
							if( !isNullOrEmpty(lineuniquekey)){
								updateArragmemt(lineuniquekey  , tranDate  , tranDate , period);
								updateSecondArragmemt(lineuniquekey  , tranDate  , tranDate , period);
							}							
							
						}
						
						else{
							nlapiLogExecution('debug', '3 line: '+line, '3');
								soRec.setLineItemValue( 'item' , 'custcol_cbr_start_date' , j  ,ff_start_date )
								soRec.setLineItemValue( 'item' , 'custcol_cbr_end_date' , j , ff_end_date )
								var startDateObj  = nlapiStringToDate(ff_start_date)
								period = getMonthDiff_fractional(startDateObj,nlapiStringToDate(ff_end_date));
								nlapiSetLineItemValue ( 'item' , 'custcol_cbr_period' , line  ,period )
								soRec.setLineItemValue( 'item' , 'custcol_cbr_period' , j , period )								
								if( !isNullOrEmpty(lineuniquekey)){
									updateArragmemt(lineuniquekey  , ff_start_date  , ff_end_date , period);
									updateSecondArragmemt(lineuniquekey  , ff_start_date  , ff_end_date , period);
									
								}
							
							}							
					}
								
				}//if(orderline ==  line)
			
			} //for (var j=1 ; j<= soCount ; j++ )							
		}		        		
	}
	
	nlapiSubmitRecord(soRec)
	if (arragmentRec != null){
		nlapiSubmitRecord(arragmentRec)
	}
	if (secondArragmentRec != null){
		nlapiSubmitRecord(secondArragmentRec)
	}
	
	
}

function isNullOrEmpty(val) {

	if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
		return true;
	}
		return false;
}

function getPeriodEndDate (startDate, period) {
	if (period == 0) {
		return startDate;
	}
	var strDateMonth = startDate.getMonth();
	var strDateDay = startDate.getDate();

	var endDate = new Date(startDate.getTime());
	endDate.setDate(1);    
	endDate.setMonth(parseInt(strDateMonth) +parseInt( period));
	var lastDayOfEndDate =   lastday(endDate.getFullYear() ,endDate.getMonth() ) //endDate.lastDayOfCurrentMonth().getDate();

	var endDateDay = strDateDay -1;
	if(endDateDay > lastDayOfEndDate){
		//If the end date of the period is bigger than the the days quantity in the end date
		endDateDay = lastDayOfEndDate;
	}
	endDate.setDate(endDateDay);

	return endDate;
}

var lastday = function(y,m){
return  new Date(y, m +1, 0).getDate();
}

function updateArragmemt(lineuniquekey, startDate  , endDate , period){
	debugger
	if (arragmentRec == null ){
		
		var linkCount =  soRec.getLineItemCount('links');
		for (var j=1 ; j<= linkCount ; j++ ){
			if(  soRec.getLineItemValue( 'links' , 'linktype' , j ) == 'Revenue Arrangement' &&
				soRec.getLineItemValue( 'links' , 'accountingbook' , j ) == 'Primary Accounting Book' ){
					var id = soRec.getLineItemValue( 'links' , 'id' , j )
					if (!isNullOrEmpty(id)){
						arragmentRec = nlapiLoadRecord('revenuearrangement' , id)
					}
				}		
		}
	}
	 if ( arragmentRec != null){
		var revenueelementCount = arragmentRec.getLineItemCount('revenueelement');
		for (var j=1 ; j<= revenueelementCount ; j++ ){
			 if ( arragmentRec.getLineItemValue( 'revenueelement' , 'sourceid' , j ) ==  lineuniquekey){
				arragmentRec.setLineItemValue( 'revenueelement' , 'revrecstartdate' , j , startDate ) 
				arragmentRec.setLineItemValue( 'revenueelement' , 'forecaststartdate' , j , startDate ) 
				arragmentRec.setLineItemValue( 'revenueelement' , 'revrecenddate' , j , endDate ) 
				arragmentRec.setLineItemValue( 'revenueelement' , 'forecastenddate' , j , endDate ) 
				arragmentRec.setLineItemValue( 'revenueelement' , 'custcol_cbr_rr_terms' , j , period ) 
			 }
			
		}
		
	}
	
}

function updateSecondArragmemt(lineuniquekey, startDate  , endDate , period){
	debugger
	if (secondArragmentRec == null ){
		
		var linkCount =  soRec.getLineItemCount('links');
		for (var j=1 ; j<= linkCount ; j++ ){
			if(  soRec.getLineItemValue( 'links' , 'linktype' , j ) == 'Revenue Arrangement' &&
				soRec.getLineItemValue( 'links' , 'accountingbook' , j ) == 'Secondary Book' ){
					var id = soRec.getLineItemValue( 'links' , 'id' , j )
					if (!isNullOrEmpty(id)){
						secondArragmentRec = nlapiLoadRecord('revenuearrangement' , id)
					}
				}		
		}
	}
	 if ( secondArragmentRec != null){
		var revenueelementCount = secondArragmentRec.getLineItemCount('revenueelement');
		for (var j=1 ; j<= revenueelementCount ; j++ ){
			 if ( secondArragmentRec.getLineItemValue( 'revenueelement' , 'sourceid' , j ) ==  lineuniquekey){
				secondArragmentRec.setLineItemValue( 'revenueelement' , 'revrecstartdate' , j , startDate ) 
				secondArragmentRec.setLineItemValue( 'revenueelement' , 'forecaststartdate' , j , startDate ) 
				secondArragmentRec.setLineItemValue( 'revenueelement' , 'revrecenddate' , j , endDate ) 
				secondArragmentRec.setLineItemValue( 'revenueelement' , 'forecastenddate' , j , endDate ) 
				secondArragmentRec.setLineItemValue( 'revenueelement' , 'custcol_cbr_rr_terms' , j , period ) 
			 }
			
		}
		
	}
	
}


function getMonthDiff_fractional( startDate, d) {
   nlapiLogExecution('debug', 'startDate', startDate);
   nlapiLogExecution('debug', 'd', d);
		var fDate = null; 
		var tDate = null;  			
		var thisRoundDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
		var dRoundDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		var startDateEndDayOffset = thisRoundDate.numberOfDaysInCurrentMonth() - thisRoundDate.getDate();

		if (thisRoundDate == dRoundDate) {
			return 0;
		} else if (thisRoundDate.getTime() < dRoundDate.getTime()) {
			fDate = thisRoundDate;
			tDate = dRoundDate;
		} else {
			fDate = dRoundDate;
			tDate = thisRoundDate;
		}
		var isSkipped = false;
		var months = 0;
		while (!isSkipped) {
			if (fDate.lastDayOfCurrentMonth().getTime() >= tDate.getTime()) {
				var dayDiff = tDate.getDate() - fDate.getDate() + 1;
				var daysInMonth = fDate.numberOfDaysInCurrentMonth();
				var partial = dayDiff / daysInMonth;
				months += partial;
				isSkipped = true;
			} else {
				months += 1;
				var nextMonth = new Date(fDate.getFullYear(), fDate.getMonth() + 1, 1);
				var setDateValue = startDate.getDate() <= nextMonth.numberOfDaysInCurrentMonth() ? startDate.getDate() : nextMonth.numberOfDaysInCurrentMonth() - startDateEndDayOffset;
				if (setDateValue <= 0) {
					setDateValue = fDate.getDate();
				}
				nextMonth.setDate(setDateValue);
				fDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate());
			}
		}
		return Math.floor(months * 100) / 100;
	};
	
 Date.prototype.numberOfDaysInCurrentMonth = function () {
	return this.lastDayOfCurrentMonth().getDate();
};

  Date.prototype.lastDayOfCurrentMonth = function () {
	return new Date(this.getFullYear(), this.getMonth() + 1, 0);
};
			    