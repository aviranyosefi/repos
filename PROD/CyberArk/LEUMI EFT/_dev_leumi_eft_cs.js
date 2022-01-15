function validateLine(type, name) {	
	var reason = nlapiGetCurrentLineItemValue ( 'custpage_results_sublist' , 'custpage_resultssublist_reason' )
	var resonArray = ['80' ,'31','81', '32',  '82' , '33' ]   // 996 - 997 - 999
	if ( resonArray.includes(reason)){
		
		var reason_comments  = nlapiGetCurrentLineItemValue ( 'custpage_results_sublist' , 'custpage_resultssublist_reason_comments' )
		if( reason_comments == '' || reason_comments == null){
			var reson_Text = nlapiGetCurrentLineItemText ( 'custpage_results_sublist' , 'custpage_resultssublist_reason' )
			nlapiSetCurrentLineItemValue ( 'custpage_results_sublist' , 'custpage_resultssublist_reason_comments' , reson_Text  )			
		}		
	}	
	return true;
}

function fieldChange(type, name) {
    try { 
        //var update = true;
        //if (name == 'custpage_resultssublist_type') { // TYPE
        //    var field = 'custbody_cbr_tradeon_trans_type';
        //}
        //else if (name == 'custpage_resultssublist_reason') { // REASON
        //    var field = 'custbody_cbr_tradeon_reason';
        //}
        //else if (name == 'custpage_resultssublist_reason_comments') { // TRANSFER REASON COMMENTS
        //    var field = 'custbody_cbr_tradeon_reason_comments';
        //}
        //else if (name == 'custpage_resultssublist_reason_tax') { // TRADEON-TAX
        //    var field = 'custbody_cbr_tradeon_tax';
        //}
        //else if (name == 'custpage_resultssublist_calc_type') { // TRADEON-TAX
        //    var field = 'custbody_cbr_tradeon_calc_type';
        //}
         if (name == 'custpage_resultssublist_exempt_cer_date') { // CERTIFICATE DATE
            var date = nlapiGetCurrentLineItemValue(type, name);
            var dateObj = nlapiStringToDate(date);
            var today = new Date();
            if (today < dateObj) {
                alert('Invalid Date - cannot be greater than todays date');
                nlapiSetCurrentLineItemValue(type, name, '', false);
                //update = false;
            }
            //else {
            //    var field = 'custbody_cbr_tradeon_exe_cert_date';
            //}
        }
        //if (update) {
        //    var id = nlapiGetCurrentLineItemValue(type, 'custpage_resultssublist_id');
        //    nlapiSubmitField('vendorpayment', id, field, nlapiGetCurrentLineItemValue(type, name));
        //}

    } catch (e) {
        //nlapiSetCurrentLineItemValue(type, name, '', false);
    }

}



function fnExcelReport() {
  
    var tab_text = "<head><meta charset='UTF-8'></head><table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange;
    var j = 0;
    tab = document.getElementById('custpage_results_sublist_splits'); // id of table

    for (j = 0; j < tab.rows.length -3; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    sa = window.open('data:application/vnd.ms-excel,base64,' + encodeURIComponent(tab_text));

    return (sa);
}


function exportTableToExcel() {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById('custpage_results_sublist_splits');
    tableSelect.style.border = 1;
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }
}

