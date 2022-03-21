
var billsTotals = [];
var paidTotal;


function updatePOremaining(poId) {
	
	
	
	try{

var filters = new Array();
filters[0] = new nlobjSearchFilter('createdfrom', null, 'is', poId);
filters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');

var cols = new Array();
cols[0] = new nlobjSearchColumn('total');
cols[1] = new nlobjSearchColumn('internalid');

var bills = nlapiSearchRecord('vendorbill', null, filters, cols);




if (bills != null) {
	bills.forEach(function(line) {
		
		billsTotals.push({
		
		internalid : line.getValue('internalid'),
		total : parseFloat(line.getValue('total'))
		
		
		});
						
	});

};

var tots = [];

for(var i = 0; i<billsTotals.length; i++) {
	tots.push(billsTotals[i].total);
}

var sumTotals = tots.reduce(add, 0);

console.log('tots : ' + tots);
console.log('sumTotals : ' + sumTotals);

var poRec = nlapiLoadRecord('purchaseorder', poId);

var PO_Total = poRec.getFieldValue('total');
var exrate = poRec.getFieldValue('exchangerate');

var PO_Total_USD = parseFloat(PO_Total) * parseFloat(exrate);

//subtract paid totals from total of PO
var remaining_USD = parseFloat(PO_Total_USD) - sumTotals;

console.log(remaining_USD);

//if remaining_USD is bigger than zero -> then we update

if((remaining_USD < 0) != true) {
	
nlapiSubmitField('purchaseorder', poId,
		'custbody_ilo_po_remaining', remaining_USD.toFixed(2));

}


	}
	catch(err) {
		alert(err);
	}

}

//call the function with internal id of Purchase Order
updatePOremaining(nlapiGetRecordId());


function add(a, b) {
    return a + b;
}

