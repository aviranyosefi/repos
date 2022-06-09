	

var accPeriods = getAccountingPeriods();
	
	
function awt_control(request, response){

	if (request.getMethod() == 'GET') {
		
		var form = nlapiCreateForm('AWT Reports For Vendors');
		form.addSubmitButton('Continue');
		
		var searchFilterGroup = form.addFieldGroup('custpage_search_group','Filters');
		var vendorFilterGroup = form.addFieldGroup('custpage_vendor_group','Vendors');
			
				
		var selectPeriodFrom = form.addField('custpage_select_periodfrom','select','From Period', null, 'custpage_search_group');
		selectPeriodFrom.setMandatory( true );
		selectPeriodFrom.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodFrom.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
		}


		var selectPeriodTo = form.addField('custpage_select_periodto','select', 'To Period', null, 'custpage_search_group');
		selectPeriodTo.setMandatory( true );
		selectPeriodTo.addSelectOption('', '');
		for(var i = 0; i<accPeriods.length; i++) {
			selectPeriodTo.addSelectOption(accPeriods[i].periodID, accPeriods[i].periodname);
		}

		
	    var selectSubsidiary = form.addField('custpage_select_subsidiary', 'select', 'Subsidary', 'SUBSIDIARY', 'custpage_search_group');
        selectSubsidiary.setMandatory(true);

        var templateLayout = form.addField('custpage_select_template', 'select', 'Template', null, 'custpage_search_group');
        templateLayout.addSelectOption('1', 'Hebrew');
        templateLayout.addSelectOption('2', 'English');

        try
	    {
	        var subsid = nlapiLookupField('customrecord_ilo_setup', 1, 'custrecord_il_subsidiary')

	        selectSubsidiary.setMandatory(true);
	        selectSubsidiary.setDefaultValue(subsid);
	    }
	    catch (e)
	    { }
	
		
		var selectOnlyActual = form.addField('custpage_select_only_actual', 'checkbox', 'Only if deducted in actual', null, 'custpage_vendor_group');
		selectOnlyActual.setLayoutType('normal', 'startcol')
		var selectVendor = form.addField('custpage_select_vendor','multiselect', 'Vendor', 'VENDOR', 'custpage_vendor_group');
		response.writePage(form);

		}//end of first if
	
	else{
		
		 var getUserMail = nlapiGetContext().getEmail();
		 var getUserID =  nlapiGetContext().getUser();
		 var getSubsid = request.getParameter('custpage_select_subsidiary')
		 
		 var fromPeriod = request.getParameter('custpage_select_periodfrom')
		 var toPeriod = request.getParameter('custpage_select_periodto')
		 
		 var onlyActual = request.getParameter('custpage_select_only_actual')
		 var selectedVendors = request.getParameter('custpage_select_vendor')

        var template = request.getParameter('custpage_select_template')
		 

		 var range =fromPeriod+'-'+toPeriod

		 var sendForm = nlapiCreateForm('Creating AWT Reports...');
		
		 var htmlField1 = sendForm.addField('custpage_header1', 'inlinehtml');
		 htmlField1.setDefaultValue("<span style='font-size:18px'>An email with the documents will be sent to : <b> " +getUserMail+ "</b> once completed.<br></span>"); 

			
        var params = {
                    custscript_ilo_awt_range: range,
		            custscript_ilo_awt_email : getUserMail,
		            custscript_ilo_awt_sender : getUserID,
		            custscript_ilo_awt_subsid : getSubsid,
		            custscript_ilo_awt_vendors : selectedVendors,
                    custscript_ilo_awt_onlyactual: onlyActual,
                    custscript_ilo_awt_template: template
             };
			 
			 nlapiScheduleScript('customscript_ilo_awt_scheduled', 'customdeploy_ilo_awt_scheduled', params);
		
		response.writePage(sendForm);
		
	}
}


function getAccountingPeriods() {

	var allResults = [];

	var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'notbefore', '01/01/2016');



	var columns = new Array();
    columns[0] = new nlobjSearchColumn('periodname');
	columns[1] = new nlobjSearchColumn('internalid');
	columns[2] = new nlobjSearchColumn('startdate').setSort();
						


	var searchresults = nlapiSearchRecord('accountingperiod', null, filters, columns);
	
		if (searchresults != null) {
		searchresults.forEach(function(line) {

			allResults.push({
				periodname : line.getValue('periodname'),
				periodID : line.getValue('internalid')
			});

		});
	}

return allResults;
};