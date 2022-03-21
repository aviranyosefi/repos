/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 08 Nov 2016 idor
 * 
 */




//this script loads all customers and pushes each as an object to customerArr
//the index for each object is the internalid of the customer
		var customerArr = [];

		var c_name = '';
		var c_companyName = '';
		var c_email = '';
		var c_phone = '';
		var c_consolBalance = '';

		var customerColumns = new Array();
		customerColumns[0] = new nlobjSearchColumn(
				'firstname').setSort();
		customerColumns[1] = new nlobjSearchColumn(
		'lastname').setSort();
		customerColumns[2] = new nlobjSearchColumn(
				'companyname');
		customerColumns[3] = new nlobjSearchColumn(
				'email');
		customerColumns[4] = new nlobjSearchColumn(
				'phone');
		customerColumns[5] = new nlobjSearchColumn('consolbalance');


		var customerSearch = nlapiSearchRecord('customer',
				null, null, customerColumns);

		
		
		customerSearch.forEach(function(customer) {

				customerArr[customer.id] = {
						    c_name : customer.getValue('firstname') + ' ' + customer.getValue('lastname') ,
							c_companyName: customer.getValue('companyname'),
							c_email : customer.getValue('email'),
							c_phone : customer.getValue('phone'),
							c_consolBalance : customer.getValue('consolbalance'),
				};
			});

	

		
		//console.log(customerArr);