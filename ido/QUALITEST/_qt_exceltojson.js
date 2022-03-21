/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Oct 2018     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function excelToJSON(request, response) {

	if (request.getMethod() == 'GET') {

		var csvFile = nlapiLoadFile('8092')

		var contents = csvFile.getValue();

		//split by new line
		var arr = contents.split('\r\n')

		var res = [];

		//start loop at [3] to remove unnecessary lines
		for (var i = 3; i < arr.length; i++) {

			//only push lines without '-----' to res array
			if (arr[i].indexOf("----") == -1) {

				res.push(arr[i])
			}

		}
		var headers = res[0];
		var splitHeaders = headers.split(',')
		var all = [];

		for (var y = 1; y < res.length; y++) {
			var obj = {};
			var firstLine = res[y];
			var splitFirstLine = firstLine.split(',')

			for (var x = 0; x < splitHeaders.length; x++) {

				if (splitFirstLine[x] == "") {
					splitFirstLine[x] = null;
				}

				//use headers as keys and line values as values
				obj[splitHeaders[x]] = splitFirstLine[x]

			}

			all.push(obj);
		}

		//all for logging purposes
//		var res_contents = JSON.stringify(contents, null, 2)
//		var res_arr = JSON.stringify(arr, null, 2)
//		var res_res = JSON.stringify(res, null, 2)
//		var res_headers = JSON.stringify(splitHeaders, null, 2)
		var res_all = JSON.stringify(all, null, 2)

		
		response.write(res_all);

	}//end of first if
}
