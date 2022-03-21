function tyaOnPageLoad() {

	var printPDFButton = document.getElementById('custpage_print_pdf')
			.addEventListener("click", function() {
				printPDF();
			});
	;
	
	var exportCSVButton = document.getElementById('custpage_print_csv')
	.addEventListener("click", function() {
		exportCSV();
	});
;

}

function printPDF() {
	
	var header = document.getElementById('custpage_header_val');
	var table = document.getElementsByClassName('tya_table')[0]

	var mywindow = window.open('', 'PRINT', 'height=400,width=600');

	mywindow.document
			.write('<html><head><title>' + document.title + '</title>');
	mywindow.document
			.write('</head><style>   table.tya_table {border-collapse: collapse; border: 1px solid black; font-size: 12px;}th.tya_header {text-align:center; font-weight: bold;border: 1px solid black; padding: 2px;} td.tya_cell {text-align:center; border: 1px solid black; padding: 5px; page-break-inside: avoid;} td.tya_cell_total {text-align:center; border: 1px solid black; padding: 5px; page-break-inside: avoid;} .hideView {display : none;}tr {page-break-inside: avoid;}</style><body > ');
	mywindow.document.write('<h1>' + document.title + '</h1>');
	mywindow.document.write(header.outerHTML);
	mywindow.document.write(table.outerHTML);
	mywindow.document.write('</body></html>');
	mywindow.document.close(); // necessary for IE >= 10
	mywindow.focus(); // necessary for IE >= 10*/
	mywindow.print();
	mywindow.close();
	return true;
}

function exportCSV() {
	
	var tableBody = document.getElementsByClassName('tya_table')[0].children[1]
	var headers = 'ASSET,ASSET TYPE,ASSET DESCRIPTION,PURCHASE DATE,ANNUAL DPRN %,COST - OPEN BALANCE,COST - ACQUISITION,COST - DISPOSAL,COST - WRITE DOWN,COST - TOTAL,DPRN - OPEN BALANCE,DPRN - DEPRECIATION,DPRN - DISPOSAL,DPRN - WRITE DOWN,DPRN - TOTAL,TOTAL\r\n'
	var rows = tableBody.children
	var lines = [];


	for(var x = 0; x<rows.length; x++) {
	var oneLine = getLineValues(rows[x])
	lines.push(oneLine)
	}

	var rowStr = lines.join("\r\n")
	
	var details = document.getElementById('detail_table_lay').innerText

	var str = details+headers+rowStr
	var today = new Date();
	var todayStr = nlapiDateToString(today);
	   
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(str);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'Tofes Yud Alef - '+todayStr+'.csv';
	hiddenElement.click();

	function getLineValues(row) {
	var arr = [];
	var cells = row.cells;
	for(var i = 1; i<cells.length; i++) {
	arr.push(cells[i].innerHTML)
	}
	return arr.join();
	}



}

