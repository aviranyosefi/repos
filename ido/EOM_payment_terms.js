var date = new Date();
var curr_date = date.getDate();
var curr_month = date.getMonth();
curr_month++;
var curr_year = date.getFullYear();
var today = curr_date + "/" + curr_month + "/" + curr_year;

function suitelet(request, response) {

	if (request.getMethod() == 'GET') {

		// here we create the form
		var form = nlapiCreateForm('EOM Payment Terms');

		// add a select field and then add the select options that will appear
		// in the dropdown
		var select2 = form.addField('selectfield2', 'select', 'terms');
		select2.addSelectOption('', '');
		select2.addSelectOption('a', '1% 10 Net 30');
		select2.addSelectOption('b', '2% 10 Net 30');
		select2.addSelectOption('c', 'Due on reciept');
		select2.addSelectOption('d', 'Net 15');
		select2.addSelectOption('e', 'Net 30');
		select2.addSelectOption('f', 'Net 60');

		var daysAhead = form.addField('custpage_selectfield_day', 'select', 'days ahead');
		daysAhead.addSelectOption('', '');
		daysAhead.addSelectOption('a', '3');
		daysAhead.addSelectOption('b', '5');
		daysAhead.addSelectOption('c', '10');
		daysAhead.addSelectOption('d', '15');
		
		daysAhead.setLayoutType('startrow', 'startcol');
		
		var monthsAhead = form.addField('custpage_selectfield_month', 'select', 'months ahead');
		monthsAhead.addSelectOption('', '');
		monthsAhead.addSelectOption('a', '1');
		monthsAhead.addSelectOption('b', '2');
		monthsAhead.addSelectOption('c', '3');
		monthsAhead.addSelectOption('d', '4');

		monthsAhead.setLayoutType('startrow', 'startcol');
		
		var fldDate = form.addField('datefield', 'date', 'Date');
		fldDate.setDefaultValue(today);
		
		fldDate.setLayoutType('outsidebelow');

		form.addSubmitButton('Continue');
		response.writePage(form);
	}

	else {

		// after clicking the continue button we rebuild the form on the
		// postback and populate the fields

		var reqTerm = request.getParameter('selectfield2');
		var reqDate = request.getParameter('date');

		var respForm = nlapiCreateForm('Updated Record Notes');

		var respTerm = respForm.addField('custpage_ilo_name', 'text', 'TERM');
		respTerm.setDefaultValue(reqTerm);
		var respDate = respForm.addField('datefield', 'date', 'Date');
		respDate.setDefaultValue(today);

		if ('reqTerm' == ' c ') {
			var respNotes = respForm.addField('custpage_ilo_notes', 'textarea',
					'Notes');
		}

		response.writePage(respForm);

	}

}
