function beforeLoad_createButton(type, form, request)

{
	if (type == 'view') {
		
		var rec = nlapiLoadRecord('vendorpayment', nlapiGetRecordId());
		
		var checkSubsid = rec.getFieldValue('subsidiary');
		var checkForm = rec.getFieldValue('customform');
		
		if(checkSubsid == '22' && (checkForm == '179' || checkForm == '153')) {
			
		form.setScript('customscript_dev_bankletters_client'); // id of client// script
		form.addButton('custpage_print_bankletter', 'Print Bank Transfer',
		'printBankLetter()');		
		form.addButton('custpage_print_vendorletter', 'Bank Transfer Vendor Letter',
		'printVendorLetter()');
		}



	}
}