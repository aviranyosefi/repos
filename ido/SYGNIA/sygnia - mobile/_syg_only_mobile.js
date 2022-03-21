
	



	var getExpenseForm = document.getElementById('expense_form')
	
	
	function pageInitforMobile(){

		try{
			

		
		//TAXCODE COLUMN FIELD
		var taxcode_col_display = document.getElementById('taxcode_display');
		taxcode_col_display.setAttribute('onclick','return false');
//		var taxcode_col_hidden = document.getElementById('hddn_expense_taxcode_fs');
//		taxcode_col_hidden.setAttribute('onchange','return false');
		
		
		//AMOUNT COLUMN FIELD
		var amount_col_display = document.getElementById('amount_formattedValue');
		if(amount_col_display.value != "") {
			amount_col_display.setAttribute('onclick','return false');	
		}
		
		//TRAVEL NUMBER COLUMN FIELD
		var travel_col_display = document.getElementById('custcol_ilo_travel_number_column_display');
		travel_col_display.setAttribute('onclick','return false');
		
		//EMPLOYEE COLUMN FIELD
		var employee_col_display = document.getElementById('custcol_employee_display');
		employee_col_display.setAttribute('onclick','return false');
	
		//PROJECT COLUMN FIELD - set mandatory
		var project_col_display = document.getElementById('customer_display');
		project_col_display.parentElement.parentElement.parentElement.classList.add("sp_MandatoryField");
		
		}catch(err) {
			console.log(err)
		}
	}
		
	