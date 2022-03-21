/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/sftp', 'N/runtime', 'N/search'],

function(logger, ui, record, sftp, runtime, search) {

    function onRequest(context) {
    	var request = context.request;
    	if(request.method === "GET"){
    	    var form = ui.createForm({title: 'Enter SFTP Credentials'});
    	    
    	    // Add user name field
    	    var userfield = form.addField({
    	        id : 'custfield_sftp_username',
    	        type : ui.FieldType.TEXT,
    	        label : 'User Name'
    	    });
    	    userfield.isMandatory = true;

    	    // Add password field 
    	    form.addCredentialField({
    	    	id: 'custfield_sftp_password_token',
    	    	label: 'Password',
    	    	restrictToScriptIds: ['customscript_qlt_upload_download_sched', 
    	    	                      'customscript_qlt_suitlet_sftp_cred'],
    	    	restrictToDomains: ['sftp://182.73.206.190',
    	    	                    'sftp://182.73.251.68',
    	    	                    'https://4619195-sb1.app.netsuite.com'],
    	    	restrictToCurrentUser: false //Depends on use case
    	    });
    	    // Add user name field
    	    var urlfield = form.addField({
    	        id : 'custfield_sftp_url',
    	        type : ui.FieldType.TEXT,
    	        label : 'SFTP Server Address (Domain)'
    	    });
    	    urlfield.isMandatory = true;
    	    
    	    // Add user name field
    	    var hostkeyfield = form.addField({
    	        id : 'custfield_sftp_hostkey',
    	        type : ui.FieldType.LONGTEXT,
    	        label : 'SFTP Server SSL Host Key'
    	    });
    	    hostkeyfield.isMandatory = true;
    	    
    	    form.addSubmitButton();
    	    context.response.writePage(form);
    	}
    	if(request.method == "POST"){
    		// Read the request parameter matching the field ID we specified in the form
    	    var userName = request.parameters.custfield_sftp_username;
    	    var passwordToken = request.parameters.custfield_sftp_password_token;
    	    var url = request.parameters.custfield_sftp_url;
    	    var hostkey = request.parameters.custfield_sftp_hostkey;
    	    
			// set SFTP server URL field id
			var urlField = 'custrecord_qlt_sftp_cred_url'
			
			// set host key field id
			var hostKeyField = 'custrecord_qlt_sftp_cred_hostkey'
			
			// set password GUID field id
			var pwdGUIDField = 'custrecord_qlt_sftp_cred_pwd'
			
			// set user name field id
			var userNameField = 'custrecord_qlt_sftp_cred_username'
			
    	    var values = {};
    	    values[urlField] = url;
    	    values[hostKeyField] = hostkey;
    	    values[pwdGUIDField] = passwordToken;
    	    values[userNameField] = userName;
    	    
    	    // find the integration system's id:
    		var integSys = search.create({
    			type: "customrecord_qlt_sftp_cred_rec",
    		}).run().getRange({
    			start : 0,
    			end : 1
    		});


	    	    record.submitFields({
	    	        type: 'customrecord_qlt_sftp_cred_rec',
	    	        id: 1,
	    	        values:values,
	    	        options: {
	    	            enableSourcing: false,
	    	            ignoreMandatoryFields : true
	    	        }
	    	    });
	    	    
				//var myHostKey = "AAAAB3NzaC1yc2EAAAABEQAAAQEA2rHzZK6MtRHtHwfWLba9UN8u2uy7zhBrRR/ZgTfzrLAZzINcV1DwehXJAv7OHYGAOeNEOKo4dkZ1gCoO4thfhLrkv5hlTydZuBylKpSDr0GxYIOaWKWfHVXxgCQUCAyMkopIMYQfUhcMfGBXPRLEEPqTWA1zflSf9yrJgNxL/oGZkF+40ZjeBaUPW8/JOLeWtKnh3hyxzMmw5P6OVqUl58iALGjLRcYzvELxneOgn4wTlvEenNJrANbD/9L6cDUPbfZEqTFOpLznjW68yPZ+L7f6KIDmiWXIJA2PturoSbjAvbZQU9oR8ZMtF4aAs1RsKxckjGpLyhDyTWnq3/C34Q==";
//				var connection = sftp.createConnection({
//					username : userName,//'19251717P',
//					passwordGuid : passwordToken, // password: 'FuJFk3c5TnSXa', 
//					url : url,
//					hostKey : hostkey,
//					port : 22,
//					hostKeyType : 'rsa'
//				});
//				logger.debug({
//					title : 'connection',
//					details : connection
//				});
    		
    	}
    }

    return {
        onRequest: onRequest
    };   
});