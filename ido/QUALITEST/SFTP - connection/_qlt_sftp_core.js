/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 */
define(['N/sftp', 'N/file', 'N/log', 'N/search', 'N/record','N/format', 'N/error', 'N/runtime','N/format'],

function(sftp, file, logger, search, record, format, error, runtime,formatter) {
	
	function GetSftpConnection(){
		try {
			

			// get SFTP server URL field id
			var urlField = 'custrecord_qlt_sftp_cred_url'
			
			// get host key field id
			var hostKeyField = 'custrecord_qlt_sftp_cred_hostkey'
			
			// get password GUID field id
			var pwdGUIDField = 'custrecord_qlt_sftp_cred_pwd'
			
			// get user name field id
			var userNameField = 'custrecord_qlt_sftp_cred_username'
				
				var credentials = search.lookupFields({
					type :"customrecord_qlt_sftp_cred_rec",
					id : 1,
					columns : [ urlField, hostKeyField ,pwdGUIDField,userNameField]
	            });

				
				var url= credentials[urlField];
				var hostkey= credentials[hostKeyField];
				var pwdGUID = credentials[pwdGUIDField];
				var userName = credentials[userNameField];
			
			
				var url= url;
				var hostkey= hostkey
				var pwdGUID = pwdGUID
				var userName = userName

				logger.debug({
					title: 'url',
					details:url
				});
				logger.debug({
					title: 'hostkey',
					details:hostkey
				});
				logger.debug({
					title: 'pwdGUID',
					details:pwdGUID
				});
				logger.debug({
					title: 'userName',
					details:userName
				});


				var connection = sftp.createConnection({
							username : userName,
							passwordGuid :pwdGUID,  
							url : url, 
							hostKey : hostkey,
							port : 1080,
							hostKeyType : 'rsa'
						});
						logger.debug({
							title: 'connection',
							details:connection
						});
						return connection;			
		} catch (e) {
			log.debug({
				title: 'error',
				details:'connection to the SFTP server was not established successfully.'+e.message
		});
			throw error.create({
				name : 'QLT.SFTP.Core -> GetSftpConnection',
				message : e.message,
				notifyOff : false
			});;
		}
	}
	function UploadFile(connection, file, fileName){
	    var folder = ''; //Add folder name here;
		try {

			if(folder != null && file != null) {
				var fld = '/'+ folder;
				
						log.debug({
							title: 'connection',
							details:fld +' - '+fileName+' - '+file,
					});
				connection.upload({
					directory : fld,
					filename : fileName,
					file : file,
					replaceExisting : true
				});

			}else{
				log.debug({
					title: 'error',
					details:'file upload fail. file was not created.'
			});
			}
		} catch (e) { 
			throw error.create({
				name : 'QLT.Lib.SFTP.Core -> UploadFile',
				message : 'Upload file failed due to the following error: '+e.message,
				notifyOff : false
			});
		}
	}
	
	function DownloadFile(connection, fileName){
		var folder //Add folder name here;
		try {
			if(folder != null && fileName != null) {
					var fld = '/'+ folder;
			        return downloadedFile = connection.download({
			            directory: folder,
			            filename: fileName
			        });
				
			}else{
				throw error.create({
					name : 'QLT.SFTP.Core -> DownloadFile',
					message : "given integration id is invalid.",
					notifyOff : false
				});
			}
		} catch (e) {
			log.debug({
				title: 'error',
				details:'Failed to download input file.'+e.message
		});
		}
	}

    return {
        GetSftpConnection:GetSftpConnection,
        UploadFile:UploadFile,
        DownloadFile:DownloadFile,
    };
});