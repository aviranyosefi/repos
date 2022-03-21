



function invCheckAttachments(){
	
	
	try{
	
	function getAllDocs() {

		var searchDocs = nlapiLoadSearch(null, 'customsearch_ilo_folder_saved_search');

		var alldocs = [];
		var invDocs =[];
		var resultDocs = [];
		var searchid = 0;
		var resultset = searchDocs.runSearch();
		var rs;

		do {
		    var resultslice = resultset.getResults(searchid, searchid + 1000);
		    for (rs in resultslice) {
		        
				alldocs.push(resultDocs[resultslice[rs].id] = resultslice[rs]);
		        searchid++;
		    }
		} while (resultslice.length >= 1000);

				if (alldocs != null) {
					alldocs.forEach(function(line) {
						

						invDocs.push({
						
						documentID : line.getValue('internalid', 'file'),
						documentName : line.getValue('name', 'file'),
		
						
						});

					});

				};
				
				return invDocs;

		}
		
		
		var allDocuments = getAllDocs();
		
		var currTranID = nlapiGetFieldValue('tranid');
		var currEntity = nlapiGetFieldText('entity');
					
		
		
				for (var x = 0; x < allDocuments.length; x++) {

					var currDoc = allDocuments[x].documentName;
					
			
//					
//					var re = new RegExp(currDoc, 'g');
//					var res = currTranID.match(re);
					

					if (currDoc.includes(currTranID)) {

						var getId = nlapiGetRecordId();
						var getType = nlapiGetRecordType();
						attachmentID = allDocuments[x].documentID;
						//nlapiSetFieldValue('custbody_ilo_invmail_attachment', attachmentID, null, null);
						//console.log(attachmentID)
						//(getType, parseInt(getId), 'custbody_ilo_invmail_attachment', attachmentID);
						nlapiSetFieldValue('custbody_ilo_invmail_attachment', attachmentID);

					}

				}
		
		
		if (!String.prototype.includes) {
		String.prototype.includes = function(search, start) {
			'use strict';
			if (typeof start !== 'number') {
				start = 0;
			}

			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		};
	}


    return true;
	}
	catch(err) {
		
		return true;
	}
	
	return true;
}
