


var context = nlapiGetContext();
var role = context.role;
console.log(role)

var salesOProles = ['1069','1072']
var fromWebService = false;

function blockPageInit(type){
   
	var createdFrom = nlapiGetFieldValue('source');
	if (createdFrom == "Web Services") {
		fromWebService = true;
	}
}


function blockLineInit(type) {
	
	if(salesOProles.indexOf(role) != -1 && fromWebService == true) {
		
		alert('You cannot add/edit or remove lines from this Sales Order')
	}
		
	
}
function blockValidateLine(type){
 	
	if(salesOProles.indexOf(role) != -1 && fromWebService == true) {
		console.log('validate line')
		
		alert('You cannot add/edit or remove lines from this Sales Order')
		return false;
	}
	
    return true;
}


function blockValidateDelete(type){
	if(salesOProles.indexOf(role) != -1 && fromWebService == true) {
		console.log('validate delete')
		
		alert('You cannot add/edit or remove lines from this Sales Order')
		return false;
	}

    return true;
}
