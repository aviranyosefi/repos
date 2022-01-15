define(['N/search'], function (search) {
    /**
     * @NApiVersion 2.x
     * @NModuleScope Public
     * @NScriptType ClientScript
     */
    var exports = {};
    function pageInit(context) {
        var ffcolor = '#EAFAF1';
        var pocolor = '#FEF9E7';
        var manualcolor = '#F4ECF7';
        var pofffcolor = '#FFEBCD';
        var numofrows = 50;

        nlapiRemoveLineItem('rma', 1)
        for (i = 0; i < numofrows; i++) {
            try {
                var trDom = document.getElementById('sosublistrow' + i),
                    trDomChild = trDom.children;
                var ffcheck = document.getElementById('custpage_ff' + (i + 1));
                var pocheck = document.getElementById('custpage_po' + (i + 1));
                var manualcheck = document.getElementById('custpage_manual' + (i + 1));
                var trocheck = document.getElementById('custpage_tro_full' + (i + 1));
                var shipmentcheck = document.getElementById('custpage_shipment' + (i + 1));
                if (ffcheck.checked) {
                    var so = nlapiGetLineItemValue('sosublist', 'custpage_tran_id_text', i + 1);
                    ffcheck.parentElement.val = "Sales Order #" + so;
                    ffcheck.parentElement.onclick = function () { ShowTab('tabff', false); nlapiSetFieldText('custpage_ff_so', this.val); setTimeout("document.getElementById('submitter').click()", 1650) };
              
                }
                if (pocheck.checked) {
                    var porel = nlapiGetLineItemValue('sosublist', 'custcol_related_po', i + 1);
                    var porelated = porel;
                    pocheck.parentElement.val = porel;
                    pocheck.parentElement.onclick = function () { ShowTab('tabpo', false); nlapiSetFieldText('custpage_doc_po', this.val); setTimeout("document.getElementById('submitter').click()", 1650) };
                 
                }
                if (manualcheck.checked) {
                    var tro = nlapiGetLineItemValue('sosublist', 'custcol_transfer_order', i + 1);
                    manualcheck.parentElement.val = tro;
                    manualcheck.parentElement.onclick = function () { ShowTab('tabtro', false); nlapiSetFieldText('custpage_doc_tro', this.val); setTimeout("document.getElementById('submitter').click()", 1650) };
                 
                }

                if (trocheck.checked) {
                    var tro = nlapiGetLineItemValue('tro', 'transactionname', i + 1);                   
                    trocheck.parentElement.val = tro;
                    trocheck.parentElement.onclick = function () { ShowTab('tabff', false); nlapiSetFieldText('custpage_ff_so', this.val); setTimeout("document.getElementById('submitter').click()", 1650) };
            
                }

                if (shipmentcheck.checked) {
                    var shipment = nlapiGetLineItemValue('sosublist', 'quantityonshipments', i + 1);                    
                    shipmentcheck.parentElement.val = shipment;
                    shipmentcheck.parentElement.onclick = function () { ShowTab('tabinbound', false); nlapiSetFieldValue('custpage_shipnumber_ship', this.val); setTimeout("document.getElementById('submitter').click()", 165) };

                }

            }
            catch (e) { }
        }

    }
	/*
	function fieldChange(context){
		return false;
		/*
		var fieldId = context.fieldId;
		//rma fields - start
		if(fieldId == 'custpage_stage_rma'){

			var rmaFilters = [];			
			if (nlapiGetFieldText(fieldId) != "") {
            rmaFilters.push(['stage', 'is', nlapiGetFieldText(fieldId)]);
			}

			 load_data('customsearch253', rmaFilters ,'fd' );
				
		}
			
	
		//rma fields - finish
		*/

    //}


   



    exports.pageInit = pageInit;
    //exports.fieldChanged = fieldChange;
    return exports;
});

