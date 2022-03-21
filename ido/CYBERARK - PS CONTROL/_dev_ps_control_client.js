function onInit() {

	try {

		var linecount = nlapiGetLineItemCount('custpage_res_sublist');
		console.log(linecount)

		var rowsToPaint = [];

		for (var i = 0; i < linecount; i++) {

			var row = document.getElementById('custpage_res_sublistrow' + i);

			var cells = row.getElementsByTagName('td')

			for (var j = 0; j < cells.length; j++) {

				if (cells[j].innerHTML == 'Closed'
						|| cells[j].innerHTML == 'Canceled' || cells[j].innerHTML == 'Billed') {

					rowsToPaint.push(row)
				}
			}

		}

		if (rowsToPaint != []) {

			for (var x = 0; x < rowsToPaint.length; x++) {

				var cellsToPaint = rowsToPaint[x].getElementsByTagName('td')

				for (var y = 1; y < cellsToPaint.length; y++) {

					cellsToPaint[y].style = 'background-color : red !important; border-color: red !important';

				}

			}

		}

	} catch (err) {
		console.log(err);

	}

}