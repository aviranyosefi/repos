/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope Public
 */
define(['N/search', 'N/log', 'N/file'],

function(search, logger, file) {
   
    execute = function(scriptContext) {
    	
    	try{
    		
      	log.debug('script started', 'script started');
      
    	var fileName = 'BKMVDATA.txt';
    	
    	var fileids = ['70138','70137', '70139', '70140'];
      
//    	var searchRes = hypCore.GetSearchResults('customsearch_hyp_file_search', null);
//    	if(searchRes != null || searchRes != undefined) {
//			for(var i=0; i< searchRes.length; i++){
//				
//				var fileID;
//				
//				var currentLine = searchRes[i];
//				var filename = currentLine.getValue({name:'name', join: 'file'});				
//				if(filename == '01_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//				if(filename == '02_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//				if(filename == '03_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '04_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '05_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '06_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '07_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '08_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '09_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '10_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '11_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//              	if(filename == '12_2019.csv') {			
//					fileID = currentLine.getValue({name:'internalid', join: 'file'});
//					fileids.push(fileID);
//				}
//
//			   		
//			}
//    	}
 	
     	log.debug('fileids', JSON.stringify(fileids));
     	
     	var allText = [];
     	
     	for(var i = 0; i<fileids.length; i++) {
     		
         	var fileObj = file.load({
          id: fileids[i]
    });
            var iterator = fileObj.lines.iterator();

            //Skip the first line (CSV header)
/*            iterator.each(function() {
                return false; //return false to only process the first line
            });*/

            iterator.each(function(line) {
                //split each line by the column delimiter
               //var line = line.value.split(',');

                //do something with the data
               var fullLine = line.join()
                allText.push(fullLine);

                //return true to continue to the next line
                return true;
            });
     	}
     	

     	    // Create the CSV file
     	    var textFile = file.create({
     	        name: 'BKMVDATA-test.txt', 
     	        contents: '\n', 
     	        fileType: 'PLAINTEXT',
     	        folder: '60627',
     	    });

     	    //use appendLine to append each line to the file
     	    for (var i = 0; i < allText.length; i++) {
     	    	textFile.appendLine({
     	          value: allText[i]
     	      });
     	    }

     	    var textFileID = textFile.save();
          
            	log.debug('before upload csv', 'before upload csv');
    
    	}catch(err) {
    		
    		log.error('error', err);
    	}
    	
    };

    return {
        execute: execute
    };  
});
