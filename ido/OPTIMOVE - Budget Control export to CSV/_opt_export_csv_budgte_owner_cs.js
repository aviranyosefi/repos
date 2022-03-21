function exportCSV() {
var exportCSVButton = document.getElementById("custpage_exportcsv").addEventListener("click", function(){
try{
	var tableBody = document.getElementsByClassName('tya_table')[0].children[0]
	var rows = tableBody.children
	var lines = [];

	String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);

}
	for (var x = 0; x < rows.length; x++) {
		var oneLine = getLineValues(rows[x])
		oneLine = oneLine.replaceAll("&amp;", "&");
		lines.push(oneLine)
	}
	var rowStr = lines.join("\r\n")

	var str = rowStr
	var today = new Date();
	var todayStr = nlapiDateToString(today);

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,%EF%BB%BF'
			+ encodeURI(str);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'Budget Owner Report Columns - ' + todayStr
			+ '.csv';
	hiddenElement.click();

	function getLineValues(row) {
		var arr = [];
		var cells = row.cells;
		for (var i = 0; i < cells.length; i++) {
			var innerHTML;
			if (i != 11 && i != 12) {
				var innerHTML = cells[i].innerHTML
				arr.push(innerHTML.replace(',', ''))
			}
		}
		var inputField = arr[11]
		if (inputField.indexOf('<input') != -1) {
			var htmlObject = document.createElement('div');
			htmlObject.innerHTML = inputField;
			var child = htmlObject.children[0];
			child = child.value;
			arr[11] = child
		}
		var statusField = arr[13];
		if (statusField.indexOf('<div') != -1) {
			var htmlObject2 = document.createElement('div');
			htmlObject2.innerHTML = statusField;
			var child2 = htmlObject2.children[0];
			child2 = child2.innerHTML;
			arr[13] = child2
		}
		return arr.join();
	}
	
}catch(err){
console.log(err)
}
});
}


