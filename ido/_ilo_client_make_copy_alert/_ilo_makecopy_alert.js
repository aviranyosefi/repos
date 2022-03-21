function checkifCopy(type){
	
	var copyStr = '&e=T&memdoc=0';
	var toCheck = '';

	var a = window.location.search;
	var res = a.split("whence=");

	if(res[1] != '') {
	  
	  toCheck = res[1];
	   checkCopied(toCheck);
	}

	function checkCopied(str) {
	  if(str == copyStr) {
	    debugger; //copied
	    
	    nlapiSetFieldValue('custbodyilo_vat_reported', 'F');
	    nlapiSetFieldValue('custbody_ilo_header_vat_period', ' '); 
	    nlapiSetFieldValue('custbody_ilo_masav_batch', ' ');
	    
	  }
	  else {
	    return false;
	  }
	  
	}
   
}
