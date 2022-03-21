function getLastNumbers() {

	var searchNumbers = nlapiLoadSearch(null,
			'customsearch_ilo_numbering_saved_search');

	var allnumbers = [];
	var theNumbers = [];
	var resultNumbers = [];
	var searchid = 0;
	var resultset = searchNumbers.runSearch();
	var rs;

	do {
		var resultslice = resultset.getResults(searchid, searchid + 1000);
		for (rs in resultslice) {

			allnumbers
					.push(resultNumbers[resultslice[rs].id] = resultslice[rs]);
			searchid++;
		}
	} while (resultslice.length >= 1000);

	if (allnumbers != null) {
		allnumbers.forEach(function(line) {

			theNumbers.push({

				nameid : line.getValue('name'),
				type : line.getValue('custrecord_ilo_numbering_trantype'),
				last_number : line.getValue('custrecord_ilo_numbering_tranid'),
				subsidiary : line
						.getText('custrecord_ilo_numbering_subsidiary'),
				rec_id : line.getValue('internalid')

			});

		});

	}
	;

	return theNumbers;
}

var lastNumbers = getLastNumbers();

function doc_numbering_suitlet(request, response) {

	if (request.getMethod() == 'GET') {

		var form = nlapiCreateForm('Document Numbering');
		form.addSubmitButton('Save');

		var toEditBtn = form.addField('custpage_ilo_to_save', 'text', 'tosave');
		toEditBtn.setDisplayType('hidden');
		toEditBtn.setDefaultValue('to_save');

		// field groups
		var CreditMemoGroup = form.addFieldGroup('custpage_cm_group',
				'Credit Memos');
		var InvoiceGroup = form.addFieldGroup('custpage_inv_group', 'Invoices');
		var TicketGroup = form.addFieldGroup('custpage_tkts_group', 'Tickets');
		var TicketCMGroup = form.addFieldGroup('custpage_tkts_cm_group',
				'Credit Memo Tickets');
		var ZuoraGroupINV = form.addFieldGroup('custpage_zuora_inv_group',
				'Zuora Invoices');
		var ZuoraGroupCM = form.addFieldGroup('custpage_zuora_cm_group',
				'Zuora Credit Memos');

		// /////////////////////invoices//////////////////////////

		var inv_LTD_last = getNumber('INV_LTD');
		var inv_LTD = form.addField('custpage_inv_ltd', 'text', 'Invoice LTD',
				null, 'custpage_inv_group');
		inv_LTD.setDefaultValue(inv_LTD_last);

		var inv_INC_last = getNumber('INV_INC');
		var inv_INC = form.addField('custpage_inv_inc', 'text', 'Invoice INC',
				null, 'custpage_inv_group');
		inv_INC.setDefaultValue(inv_INC_last);

		var inv_SAS_last = getNumber('INV_SAS');
		var inv_SAS = form.addField('custpage_inv_sas', 'text', 'Invoice SAS',
				null, 'custpage_inv_group');
		inv_SAS.setDefaultValue(inv_SAS_last);

		// ///////////////////////////////////////////////////////

		// /////////////////////credit memos//////////////////////////

		var cm_LTD_last = getNumber('CM_LTD');
		var cm_LTD = form.addField('custpage_cm_ltd', 'text',
				'Credit Memo LTD', null, 'custpage_cm_group');
		cm_LTD.setDefaultValue(cm_LTD_last);

		var cm_INC_last = getNumber('CM_INC');
		var cm_INC = form.addField('custpage_cm_inc', 'text',
				'Credit Memo INC', null, 'custpage_cm_group');
		cm_INC.setDefaultValue(cm_INC_last);

		var cm_INC_last = getNumber('CM_SAS');
		var cm_SAS = form.addField('custpage_cm_sas', 'text',
				'Credit Memo SAS', null, 'custpage_cm_group');
		cm_SAS.setDefaultValue(cm_INC_last);

		// ///////////////////////////////////////////////////////

		// /////////////////////tickets//////////////////////////
		
		var tkt_LTD_last = getNumber('TKT_LTD');
		var tkt_LTD = form.addField('custpage_tkt_ltd', 'text', 'Ticket LTD',
				null, 'custpage_tkts_group');
		tkt_LTD.setDefaultValue(tkt_LTD_last);
		
		var tkt_INC_last = getNumber('TKT_INC');
		var tkt_INC = form.addField('custpage_tkt_inc', 'text', 'Ticket INC',
				null, 'custpage_tkts_group');
		tkt_INC.setDefaultValue(tkt_INC_last);
		
		var tkt_SAS_last = getNumber('TKT_SAS');
		var tkt_SAS = form.addField('custpage_tkt_sas', 'text', 'Ticket SAS',
				null, 'custpage_tkts_group');
		tkt_SAS.setDefaultValue(tkt_SAS_last);
		
		// ///////////////////////////////////////////////////////

		// /////////////////////tickets-credit memo//////////////////////////

		var tkt_cm_LTD_last = getNumber('TKT_CM_LTD');
		var tkt_cm_LTD = form.addField('custpage_tkt_cm_ltd', 'text',
				'Ticket Credit Memo LTD', null, 'custpage_tkts_cm_group');
		tkt_cm_LTD.setDefaultValue(tkt_cm_LTD_last);
		
		var tkt_cm_INC_last = getNumber('TKT_CM_INC');
		var tkt_cm_INC = form.addField('custpage_tkt_cm_inc', 'text',
				'Ticket Credit Memo INC', null, 'custpage_tkts_cm_group');
		tkt_cm_INC.setDefaultValue(tkt_cm_INC_last);
		
		var tkt_cm_SAS_last = getNumber('TKT_CM_SAS');
		var tkt_cm_SAS = form.addField('custpage_tkt_cm_sas', 'text',
				'Ticket Credit Memo SAS', null, 'custpage_tkts_cm_group');
		tkt_cm_SAS.setDefaultValue(tkt_cm_SAS_last);
		
		// ///////////////////////////////////////////////////////

		// /////////////////////zuora invoices//////////////////////////

	
		var zuora_inv_LTD_last = getNumber('ZUO_INV_LTD');
		var zuora_inv_LTD = form.addField('custpage_zuora_inv_ltd', 'text',
				'Zuora Invoice LTD', null, 'custpage_zuora_inv_group');
		zuora_inv_LTD.setDefaultValue(zuora_inv_LTD_last);
		
		var zuora_inv_INC_last = getNumber('ZUO_INV_INC');
		var zuora_inv_INC = form.addField('custpage_zuora_inv_inc', 'text',
				'Zuora Invoice INC', null, 'custpage_zuora_inv_group');
		zuora_inv_INC.setDefaultValue(zuora_inv_INC_last);
		
		var zuora_inv_SAS_last = getNumber('ZUO_INV_SAS');
		var zuora_inv_SAS = form.addField('custpage_zuora_inv_sas', 'text',
				'Zuora Invoice SAS', null, 'custpage_zuora_inv_group');
		zuora_inv_SAS.setDefaultValue(zuora_inv_SAS_last);
		
		// ///////////////////////////////////////////////////////

		// /////////////////////zuora creditmemos//////////////////////////
		
		var zuora_cm_LTD_last = getNumber('ZUO_CM_LTD');
		var zuora_cm_LTD = form.addField('custpage_zuora_cm_ltd', 'text',
				'Zuora Credit Memo LTD', null, 'custpage_zuora_cm_group');
		zuora_cm_LTD.setDefaultValue(zuora_cm_LTD_last);
		
		var zuora_cm_INC_last = getNumber('ZUO_CM_INC');
		var zuora_cm_INC = form.addField('custpage_zuora_cm_inc', 'text',
				'Zuora Credit Memo INC', null, 'custpage_zuora_cm_group');
		zuora_cm_INC.setDefaultValue(zuora_cm_INC_last);
		
		var zuora_cm_SAS_last = getNumber('ZUO_CM_SAS');
		var zuora_cm_SAS = form.addField('custpage_zuora_cm_sas', 'text',
				'Zuora Credit Memo SAS', null, 'custpage_zuora_cm_group');
		zuora_cm_SAS.setDefaultValue(zuora_cm_SAS_last);

		response.writePage(form);

	} else {
		
		var invLTD = request.getParameter('custpage_inv_ltd');
		updateNumber(invLTD, '2');
		var invINC = request.getParameter('custpage_inv_inc');
		updateNumber(invINC, '1');
		var invSAS = request.getParameter('custpage_inv_sas');
		updateNumber(invSAS, '3');
		
		var cmLTD = request.getParameter('custpage_cm_ltd');
		updateNumber(cmLTD, '4');
		var cmINC = request.getParameter('custpage_cm_inc');
		updateNumber(cmINC, '5');
		var cmSAS = request.getParameter('custpage_cm_sas');
		updateNumber(cmSAS, '6');
		
		var tktLTD = request.getParameter('custpage_tkt_ltd');
		updateNumber(tktLTD, '7');
		var tktINC = request.getParameter('custpage_tkt_inc');
		updateNumber(tktINC, '13');
		var tktSAS = request.getParameter('custpage_tkt_sas');
		updateNumber(tktSAS, '15');
		
		var tktcmLTD = request.getParameter('custpage_tkt_cm_ltd');
		updateNumber(tktcmLTD, '8');
		var tktcmINC = request.getParameter('custpage_tkt_cm_inc');
		updateNumber(tktcmINC, '14');
		var tktcmSAS = request.getParameter('custpage_tkt_cm_sas');
		updateNumber(tktcmSAS, '16');
		
		var zuoinvLTD = request.getParameter('custpage_zuora_inv_ltd');
		updateNumber(zuoinvLTD, '9');
		var zuoinvINC = request.getParameter('custpage_zuora_inv_inc');
		updateNumber(zuoinvINC, '10');
		var zuoinvSAS = request.getParameter('custpage_zuora_inv_sas');
		updateNumber(zuoinvSAS, '17');
		
		var zuocmLTD = request.getParameter('custpage_zuora_cm_ltd');
		updateNumber(zuocmLTD, '11');
		var zuocmINC = request.getParameter('custpage_zuora_cm_inc');
		updateNumber(zuocmINC, '12');
		var zuocmSAS = request.getParameter('custpage_zuora_cm_sas');
		updateNumber(zuocmSAS, '18');
		
	
		var endForm = nlapiCreateForm('Document Numbering Updated');
		response.writePage(endForm);
	}

}

function getNumber(type) {

	var allTranNumbers = getLastNumbers();

	var theNum;

	for (var i = 0; i < lastNumbers.length; i++) {

		if (lastNumbers[i].nameid == type) {
			theNum = lastNumbers[i].last_number;
		}
	}

	return theNum;
}

function updateNumber(newtranid, recid) {
	
	nlapiSubmitField('customrecord_ilo_inv_cm_numbering', recid, 'custrecord_ilo_numbering_tranid', newtranid);
	
}