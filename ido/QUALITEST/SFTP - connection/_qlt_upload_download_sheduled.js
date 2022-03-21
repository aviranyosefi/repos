/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['./_qlt_sftp_core', 'N/search', 'N/log'],
function(sftpCore, search, logger) {
   
    execute = function(scriptContext) {
    	
    	//Example of upload
    	var fileName =  'PLACTUAL.csv';
    	//var csvFile = //file to upload
    	
		logger.debug({
			title: 'trying to connect',
			details:'attempting'
		});
    	var connection = sftpCore.GetSftpConnection();
		logger.debug({
			title: 'connection',
			details:connection
		});
    	//sftpCore.UploadFile(connection, csvFile, fileName);
    };
    
    //Example of download
	//var fileName =  //name of file you want to download
//	var connection = sftpCore.GetSftpConnection();
//	var fileObj = sftpCore.DownloadFile(connection, fileName);

    return {
        execute: execute
    };  
});