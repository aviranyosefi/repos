function printBankLetter()

{
	var id = nlapiGetRecordId();

	var suiteletURL = nlapiResolveURL('SUITELET', 'customscript_dev_bankletters_suitlet', 'customdeploy_dev_bankletters_suitlet_dep')+'&billid='+id+'&printtype=forbank';

	openInNewTab(suiteletURL)
}

function printVendorLetter()

{
	var id = nlapiGetRecordId();

	var suiteletURL = nlapiResolveURL('SUITELET', 'customscript_dev_bankletters_suitlet', 'customdeploy_dev_bankletters_suitlet_dep')+'&billid='+id+'&printtype=forvendor';

	openInNewTab(suiteletURL)
}


function openInNewTab(url) {
	  var win = window.open(url, '_blank');
	  win.focus();
	}