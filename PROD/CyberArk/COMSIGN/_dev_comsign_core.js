/**
 * @NApiVersion 2.x
 * @NModuleScope public
 */
define(['require', 'N/record', 'N/search', 'N/render', 'N/error', 'N/log', 'N/file', 'N/https', 'N/runtime'],

	function (require, record, search, render, error, logger, file, https, runtime) {

		signTransaction = function (tranRecId, signingEmployee) {

			var transactionData = search.lookupFields({
				type: search.Type.TRANSACTION,
				id: tranRecId,
				columns: [
					'recordtype',
					'tranid',
					'entity',
					'custbody_cbr_comsign_doc_signed',
					'subsidiary',
					'customform'
				]
			});
			

			var customerData = search.lookupFields({
				type: search.Type.CUSTOMER,
				id: transactionData.entity[0].value,
				columns: [
					'billcountry',
					'language'
				]
			});
			
			var isILcustomer = true;
			if(customerData.billcountry != [] && customerData.billcountry[0].value == 'IL') {
				isILcustomer = true;
			}
			
			var customerLocale = false;
			if(customerData.language != [] && customerData.language[0].value == 'he_IL') {
				customerLocale = true;
			}
			
			if (transactionData.custbody_cbr_comsign_doc_signed == true) {
				var errorObj = error.create({
					name: 'Digital_Sign',
					message: 'This transaction was already signed',
					notifyOff: true
				});
				
				throw errorObj;
			}

			if (isILcustomer == false) {
				var errorObj = error.create({
					name: 'Digital_Sign',
					message: 'Digital Signature is supported for IL customers only',
					notifyOff: true
				});
				throw errorObj;
			}

			var folderId = getFolderId('ComSign Signed Invoices');
			if (folderId == null || folderId == undefined || folderId == '') {
				var errorObj = error.create({
					name: 'Digital_Sign',
					message: 'Unable to find destination folder in file cabinet',
					notifyOff: true
				});
				throw errorObj;
			}
			

			
			/* === END Validations === */
			
			var originalPrintRecId = null;
			var signedFileId = null;
			try {
				
				record.submitFields({
					type: transactionData.recordtype,
					id: tranRecId,
					values: {
						custbody_cbr_comsign_print_original : 'T'
					}
				});


				//Print Transaction
				var renderedTransaction = render.transaction({
					entityId: Number(tranRecId),	
					printMode: render.PrintMode.PDF,
					inCustLocale: customerLocale,
				});
				var fileContent = renderedTransaction.getContents();
				
				//Sign Transaction		
				signedContent = performComSignSigning(fileContent, signingEmployee, isILcustomer, transactionData.subsidiary[0].value, customerLocale);
				//Create File
				var signedFile = file.create({
					name: transactionData.tranid +' - Signed.pdf',
					fileType: file.Type.PDF,
					contents: signedContent,
					folder: folderId
				});
				//Save File to file cabinet
				signedFileId = signedFile.save();
			

					//Create Original Print Record For Current Transaction
					var originalPrintRec = record.create({
						type: 'customrecord_cbr_comsign_signed_record',
						isDynamic: false
					});
					
					originalPrintRec.setValue({
						fieldId: 'custrecord_cbr_comsign_signed_trans',
						value: tranRecId
					});
					
					
					originalPrintRecId = originalPrintRec.save()
					record.submitFields({
						type: transactionData.recordtype,
						id: tranRecId,
						values: {
							custbody_cbr_comsign_doc_record: originalPrintRecId
						}
					});
					record.submitFields({
						type: 'customrecord_cbr_comsign_signed_record',
						id: originalPrintRecId,
						values: {
							custrecord_cbr_comsign_signed_doc: signedFileId
						}
					});
					
					record.submitFields({
						type: transactionData.recordtype,
						id: tranRecId,
						values: {
							custbody_cbr_comsign_doc_signed: 'T',
							custbody_cbr_comsign_print_original : 'T'
							
						}
					});
				
			} catch (err) {
				//If failed in this step, set the signed records on invoice to ''
					record.submitFields({
						type: transactionData.recordtype,
						id: tranRecId,
						values: {
							custbody_cbr_comsign_doc_record: '',
							custbody_cbr_comsign_doc_signed: 'F',
							custbody_cbr_comsign_print_original : 'F'
						}
					});
				

				throw err;
			}

			return signedFileId;
		};

		performComSignSigning = function (fileContent, signerEmployeeId, isILcustomer, subsidiary, customerLocale) {
			var signedContent = null;
			var signSettings = getSignSettings(signerEmployeeId, isILcustomer, subsidiary, customerLocale);
			//var signSettings = getSignSettings(signerEmployeeId)
			//Call comSign API
			var headers = [];
			headers['content-type'] = 'text/xml; charset=utf-8';
			headers['SOAPAction'] = 'http://www.comsigntrust.com/ISignService/SignPDF_PIN';
          	headers['CYBER'] = 'ABC';

			
			var soamEnv = generateComSignObject(signSettings, fileContent);

			var resp = https.post({
				url: signSettings.endPoint,
				headers: headers,
				body: soamEnv
			});
			var apiError = '';
			try {

				if (resp.code == '200') {
					var body = resp.body;

					//Get Result Status
					var matches = [];
					body.replace(/<Result>(.*?)<\/Result>/g, function () {
						matches.push(arguments[1]);
					});

					if (isNullOrEmpty(matches) || matches.length != 1) {
						apiError = 'Unable to parse XMl response from comSign server : Result node is missing';
					} else {
						var status = matches[0];
						if (status.toLowerCase() != 'success') {
							apiError = 'comSign server responded with the following error : ' + status;
						} else {
							//Get Signed File Content
							matches = [];
							body.replace(/<SignedBytes>(.*?)<\/SignedBytes>/g, function () {
								matches.push(arguments[1]);
							});
							if (isNullOrEmpty(matches) || matches.length != 1) {
								apiError = 'Unable to parse XMl response from comSign server : SignedBytes node is missing';
							}
							signedContent = matches[0];
						}
					}
				} else {
					apiError = 'HTTP Connection Error # UNEXPECTED ERROR, CODE ' + resp.code;
				}

				
				if (!isNullOrEmpty(apiError)) {
					throw error.create({
						name: 'COMSIGN_SIGN_ERROR',
						message: apiError,
						notifyOff: true
					});
				}
				if (isNullOrEmpty(signedContent)) {
					throw error.create({
						name: 'COMSIGN_SIGN_ERROR',
						message: 'Signed File Content is empty',
						notifyOff: true
					});
				}
			} catch (err) {
				throw error.create({
					name: 'COMSIGN_SIGN_ERROR',
					message: err.message,
					notifyOff: true
				});
			}
			return signedContent;
		};

		getSignSettings = function (employeeId, isILcustomer, subsidiary, customerLocale) {
			var res = {
				endPoint: null,
				apiName: null,
				certificate: null,
				pinCode: null,
				pageNum: null,
				left: null,
				top: null,
				width: null,
				height: null,
				imgId: null
			};
			var signerErrorMessage = '';
			var signerRecId = null;

			
			logger.debug({
				title: 'check employeeId',
				details:employeeId
			});
			var globalSettings = search.lookupFields({
				type: 'customrecord_cbr_comsign_control_record',
				id: '1',
				columns: [
					'custrecord_cbr_com_endpoint_url',
					'custrecord_cbr_com_apiname',
					'custrecord_cbr_com_sign_page',
					'custrecord_cbr_com_sign_left',
					'custrecord_cbr_com_sign_top',
					'custrecord_cbr_com_sign_width',
					'custrecord_cbr_com_sign_height',
					'custrecord_cbr_com_sign_image_nonil',
					'custrecord_cbr_com_sign_image_il'
				]
			});
			var searchParams = {
				type: 'customrecord_cbr_comsign_auth_signers',
				filters: [
					['isinactive', 'is', 'F'],
					'AND', 
					['custrecord_cbr_comsign_subsidiary', 'anyof', subsidiary],
					'AND',
					['custrecord_cbr_comsign_employee', 'is', employeeId]
				]
			};

			
			var comsignSignersSearchResults = search.create(searchParams).run().getRange(0, 2);
			if (!isNullOrEmpty(comsignSignersSearchResults) && comsignSignersSearchResults.length > 0) {
				if (comsignSignersSearchResults.length == 1) {
					signerRecId = comsignSignersSearchResults[0].id;
				} else {
					signerErrorMessage = 'More than 1 ComSign signatures were found for the employee';
				}
			} else {
				signerErrorMessage = 'Unable to determine the ComSign signature of current employee - EMPLOYEE_NOT_SIGNER';
			}
			if (isNullOrEmpty(signerRecId)) {
				var errorObj = error.create({
					name: 'EMPLOYEE_NOT_SIGNER',
					message: signerErrorMessage,
					notifyOff: true
				});
				
				throw JSON.stringify(errorObj, null, 2)
			};

			var signerData = search.lookupFields({
				type: 'customrecord_cbr_comsign_auth_signers',
				id: signerRecId,
				columns: [
					'custrecord_cbr_comsign_certificate',
					'custrecord_cbr_comsign_pincode'
				]
			});
			
			
			
			res.endPoint = globalSettings.custrecord_cbr_com_endpoint_url;
			res.apiName = globalSettings.custrecord_cbr_com_apiname;
			res.certificate = escapeHtml(signerData.custrecord_cbr_comsign_certificate);
			res.pinCode = escapeHtml(signerData.custrecord_cbr_comsign_pincode);
			res.pageNum = globalSettings.custrecord_cbr_com_sign_page;
			res.left = globalSettings.custrecord_cbr_com_sign_left;
			res.top = globalSettings.custrecord_cbr_com_sign_top;
			res.width = globalSettings.custrecord_cbr_com_sign_width;
			res.height = globalSettings.custrecord_cbr_com_sign_height;
			if (isILcustomer && customerLocale) {
					res.imgId = globalSettings.custrecord_cbr_com_sign_image_il[0].value
			}
			if (isILcustomer && !customerLocale) {
				res.imgId = globalSettings.custrecord_cbr_com_sign_image_nonil[0].value
		}

			var missingAttributes = [];
			for (var att in res) {
				if (res.hasOwnProperty(att) && isNullOrEmpty(res[att])) {
					missingAttributes.push(att);
				}
			}
			if (missingAttributes.length > 0) {
				throw error.create({
					name: 'ComSign_MISSING_SETTING',
					message: 'The following ComSign signature are missing : ' + missingAttributes.join(','),
					notifyOff: true
				});
			}
			
			return res;
		};

		generateComSignObject = function (signSettings, fileContent) {
			var requestAttributes = {
				CertID: signSettings.certificate,
				InputFile: fileContent,
				Page: signSettings.pageNum,
				Left: signSettings.left,
				Top: signSettings.top,
				Width: signSettings.width,
				Height: signSettings.height,
				Pincode: signSettings.pinCode,
				Image: (file.load({
					id: signSettings.imgId
				})).getContents()
			};

			var res = ['<?xml version="1.0" encoding="UTF-8"?>'];
			res.push('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.comsigntrust.com">');
			res.push('<SOAP-ENV:Body>');
			res.push('<ns1:' + signSettings.apiName + '>');
			for (var att in requestAttributes) {
				if (requestAttributes.hasOwnProperty(att)) {
					res.push('<ns1:' + att + '>' + requestAttributes[att] + '</ns1:' + att + '>');
				}
			}
			res.push('</ns1:' + signSettings.apiName + '>');
			res.push('</SOAP-ENV:Body>');
			res.push('</SOAP-ENV:Envelope>');
			return res.join('');
		};
		
		escapeHtml = function (text) {
			  var map = {
			    '&': '&amp;',
			    '<': '&lt;',
			    '>': '&gt;',
			    '"': '&quot;',
			    "'": '&#039;'
			  };

			  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
		};
		
		isNullOrEmpty = function(val) {

			if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
				return true;
			}
			return false;
		};

		getFolderId = function(fileName) {
			var id = null;
			require(['N/search'], function(search) {
				var folderName = null;
				var pathParts = fileName.split('\/');
				if (pathParts.length > 1) {
					folderName = pathParts[pathParts.length - 2];
					fileName = pathParts[pathParts.length - 1];
				}
				var res = search.create({
					type : search.Type.FOLDER,
					columns : ['parent'],
					filters : [ 
						['name', 'is', fileName]
					]
				}).run();
				id = null;
				res.each(function(result) {
					var parent = result.getText('parent');
					if (folderName == null || (parent.toLowerCase() == folderName.toLowerCase())) {
						id = id || result.id;
					}
				});
			});
			return id;
		};

		
		return {
			signTransaction: signTransaction,
			performComSignSigning: performComSignSigning,
			getSignSettings: getSignSettings,
			generateComSignObject: generateComSignObject,
			escapeHtml : escapeHtml,
			isNullOrEmpty: isNullOrEmpty,
			getFolderId : getFolderId
		};
	}
);