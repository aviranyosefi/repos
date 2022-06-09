/**
* Module Description
*
* Version Date Author Remarks
* 1.00 26 Apr 2021 igorp
*
*/

function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
	try {
		handleGLImpactPrepayement(transactionRecord, standardLines, customLines, book);
	} catch (err) {
		nlapiLogExecution('error', 'customizeGlImpact', err.message);
	};
};

function handleGLImpactPrepayement(transactionRecord, standardLines, customLines, book) {
	var linecount = standardLines.getCount();
	if (linecount == 0) return;

	var recType = transactionRecord.getRecordType();
	var recId = transactionRecord.getId();
	var reClassSettings = {
		createdfrom: transactionRecord.getFieldValue('createdfrom'),
		createdFromRecordType: null,
		doReclass: false,
		reclassType: null,
		accounts: [],
		reclassUmmaryLine: false
	}
	var acceptedRecTypes = ['itemfulfillment'];
	
	if (acceptedRecTypes.indexOf(recType) != -1) {
		reClassSettings.doReclass = true;
	}

	if (reClassSettings.doReclass) {

		var rec = transactionRecord;
		var toAccount;
		switch (recType) {
			case 'itemfulfillment':

				
				if(transactionRecord.getFieldText('createdfrom').indexOf('Sales Order') < 0) {
					reClassSettings.doReclass = false;
					return;
				}
				
				
				var createdFrom = rec.getFieldValue('createdfrom');
				var orderType = nlapiLookupField('salesorder', createdFrom, 'custbody_so_type', true);
				var orderTypeSearch = nlapiSearchRecord("customrecord_so_type_list",null,[ ["name", "is", orderType] ], [ new nlobjSearchColumn("custrecord_df_so_order_type_exp_acct"), new nlobjSearchColumn("custrecord_df_so_order_type_show_sn") ]);

				if(orderTypeSearch.length < 1 || isNullOrEmpty(orderTypeSearch)) {
					reClassSettings.doReclass = false;
					return;
				};
				if(isNullOrEmpty(orderTypeSearch[0].getValue('custrecord_df_so_order_type_exp_acct'))) {
					reClassSettings.doReclass = false;
					return;
				};
				
				var showSn = orderTypeSearch[0].getValue('custrecord_df_so_order_type_show_sn');
				toAccount = orderTypeSearch[0].getValue('custrecord_df_so_order_type_exp_acct');
				
				var itemIds = [];
				var itemIdToIdx = {};
				var ifLineCount = rec.getLineItemCount('item');
				for (var i = 1; i <= ifLineCount; i++) {

					var itemId = rec.getLineItemValue('item', 'item', i);
					
					if(showSn == 'T') {
						if(!itemIdToIdx.hasOwnProperty(itemId)) {
							itemIdToIdx[itemId] = []
						} 
						itemIdToIdx[itemId].push(i)
					}

					if (itemIds.indexOf(itemId) == -1 ) {
						itemIds.push(itemId);
					}
				}				
				
				//nlapiLogExecution('audit', 'reClassSettings.accounts', JSON.stringify(reClassSettings.accounts));
				
				// reClassSettings.reclassUmmaryLine = true;
			
			break;
			
		default:
			break;
		}
		
	}
	//nlapiLogExecution('audit', 'reClassSettings.doReclass', reClassSettings.doReclass);
	if (!reClassSettings.doReclass) {
		return;
	};
	//Account Map (From : To)
	var map = {};
	var accToSn = {};

	var itemAccountsRes = nlapiSearchRecord(
			'item', 
			null, 
			[new nlobjSearchFilter('internalid', null, 'anyof', itemIds)], 
			[new nlobjSearchColumn('expenseaccount'), new nlobjSearchColumn('isserialitem'), new nlobjSearchColumn('itemid')]
	);
	if (itemAccountsRes) {
		for (var i = 0; i < itemAccountsRes.length; i++) {
			var itemAccountRes = itemAccountsRes[i];
			var accountId = itemAccountRes.getValue('expenseaccount');
			if (!map.hasOwnProperty(accountId)) {
				map[accountId] = toAccount;
			}

			if(showSn == 'T') {
				if(itemAccountRes.getValue('isserialitem') == 'T') {
					if(!accToSn.hasOwnProperty(accountId)) {
						accToSn[accountId] = itemAccountRes.getValue('itemid') + ':'
					} else {
						accToSn[accountId] += itemAccountRes.getValue('itemid') + ':'
					}
					for(var idx = 0; idx < itemIdToIdx[itemAccountRes.id].length; idx++) {
	
						var lineIdx = itemIdToIdx[itemAccountRes.id][idx]
						var invDetRec = rec.viewLineItemSubrecord('item', 'inventorydetail', lineIdx);
						var invDetLineCount = invDetRec.getLineItemCount('inventoryassignment')
	
						for(var sIdx = 1; sIdx <= invDetLineCount; sIdx++) {
							accToSn[accountId] += invDetRec.getLineItemText('inventoryassignment', 'issueinventorynumber', sIdx);
							accToSn[accountId] += (sIdx == invDetLineCount) ? ';' : ',' ;
						}
					}
				}
			}
			
		}
	}
	//====
	nlapiLogExecution('AUDIT', 'accToSn', JSON.stringify(accToSn));
	var glSegments = getGLCustomSegments();
	// the value of the relevant GL accounts as the same account may be used on multiple lines;
	// the map allows us to key on only the GL accounts that need to be reclassed. The rest are ignored
	var reclass_summary = new Map_list(map);
	//nlapiLogExecution('AUDIT', 'customizeGlImpact reclass_summary', JSON.stringify(reclass_summary));
	// loop through the posted lines and add them to the map

	for (var i = 0; i < linecount; i++) {
		//get the value of NetSuite's GL posting
		var line = standardLines.getLine(i);
		if (!line.isPosting()) continue; // not a posting item
		if (!reClassSettings.reclassUmmaryLine && line.getId() == 0) continue; // summary lines; ignore
		//build a unique key that spans the account, class, dept, and location
		var acc = line.getAccountId();
		var cls = emptyIfNull(line.getClassId());
		var loc = emptyIfNull(line.getLocationId());
		var dep = emptyIfNull(line.getDepartmentId());	
		var entity = emptyIfNull(line.getEntityId());
		
		var key = acc + '|' + entity + '|' + cls + '|' + loc + '|' + dep  ;
		var customSegmentKey = [];
		if (glSegments.customSegmentsExists) {
			for (var segmentId in glSegments.customSegments) {
				if (glSegments.customSegments.hasOwnProperty(segmentId)) {
					customSegmentKey.push(emptyIfNull(emptyIfNull(line.getSegmentValueId(segmentId))));
				}
			}
			key += '|' + customSegmentKey.join('|')
		}
		//determine the amount. debits will be positive. Add it to the summary map
		var amt = parseFloat(zeroIfNull(line.getDebitAmount(), 0)) + (parseFloat(zeroIfNull(line.getCreditAmount(), 0)) * parseFloat(-1));
		//nlapiLogExecution('DEBUG', 'build lines to reclass - ' + line.getId(), key);
		reclass_summary.add(key, amt);
	};

	// now the reclass array should have the amounts we want to adjust. Spin through it as it
	// will have unique combinations of account, class, dept and location
	var arr_reclass = reclass_summary.list;
	var keys = Object.keys(arr_reclass);
	var klen = keys.length;
	for (var k = 0; k < klen; k++) {
		var key = keys[k];
		//nlapiLogExecution('AUDIT', 'customizeGlImpact Accounts Map', key);
		var akey = key.split('|');
		var amt = arr_reclass[keys[k]];
		var to_acc = emptyIfNull(akey[0]).toString();
		var from_acc = akey[1];
		var entity = emptyIfNull(akey[2]).toString();
		var cls = emptyIfNull(akey[3]).toString();
		var loc = emptyIfNull(akey[4]).toString();
		var dep = emptyIfNull(akey[5]).toString();	
		
		amt = parseFloat(amt) * parseFloat(-1);
		if (amt == 0) continue;
		// remove the original amount
		var newLine = customLines.addNewLine();
		newLine.setAccountId(parseInt(from_acc));
		newLine.setBookSpecific(true);
		if (cls.length > 0) {
			newLine.setClassId(parseInt(cls));
		};
		if (loc.length > 0) {
			newLine.setLocationId(parseInt(loc));
		};
		if (dep.length > 0) {
			newLine.setDepartmentId(parseInt(dep));
		};
		if (glSegments.customSegmentsExists) {
			var nextSegmentIndex = 6;
			for (var segmentId in glSegments.customSegments) {
				if (glSegments.customSegments.hasOwnProperty(segmentId)) {
					if (!isNullOrEmpty(akey[nextSegmentIndex])) {
						newLine.setSegmentValueId(segmentId, parseInt(akey[nextSegmentIndex]));
					}
					nextSegmentIndex += 1;
				}
			}
		}
		if (entity.length > 0) {
			newLine.setEntityId(parseInt(entity));
		};
		if (parseFloat(amt) > 0) {
			newLine.setDebitAmount(amt);
		} else {
			newLine.setCreditAmount(parseFloat(amt) * parseFloat(-1));
		};
		if(showSn == 'T' && accToSn.hasOwnProperty(from_acc)) {
			newLine.setMemo(accToSn[from_acc].slice(0, 250));
		} else {
			newLine.setMemo("Generate by D-Fend Custom GL");
		}		
		var newLine = customLines.addNewLine();
		newLine.setAccountId(parseInt(to_acc));
		newLine.setBookSpecific(true);
		if (cls.length > 0) {
			newLine.setClassId(parseInt(cls));
		}
		if (loc.length > 0) {
			newLine.setLocationId(parseInt(loc));
		}
		if (dep.length > 0) {
			newLine.setDepartmentId(parseInt(dep));
		}
		if (glSegments.customSegmentsExists) {
			var nextSegmentIndex = 6;
			for (var segmentId in glSegments.customSegments) {
				if (glSegments.customSegments.hasOwnProperty(segmentId)) {
					if (!isNullOrEmpty(akey[nextSegmentIndex])) {
						newLine.setSegmentValueId(segmentId, parseInt(akey[nextSegmentIndex]));
					}
					nextSegmentIndex += 1;
				}
			}
		}
		if (entity.length > 0) {
			newLine.setEntityId(parseInt(entity));
		};
		if (parseFloat(amt) < 0) {
			newLine.setDebitAmount(amt * parseFloat(-1));
		} else {
			newLine.setCreditAmount(parseFloat(amt));
		}
		if(showSn == 'T' && accToSn.hasOwnProperty(to_acc)) {
			newLine.setMemo(accToSn[to_acc].slice(0, 250));
		} else {
			newLine.setMemo("Generate by D-Fend Custom GL");
		}
	}
	// nlapiLogExecution('audit', 'BE Transaction Allocation', (isEnabled ? ('Process Finished for : ' + recType) : ' Process is disabled'));
}

function Map_list(map) {
	this.map = map;
	this.list = {};
}

Map_list.prototype.add = function (key, amt) {
	var acc = key.split('|')[0];
	if (!this.map.hasOwnProperty(acc)) {
		return;
	}
	key =  this.map[acc] + '|' + key;
	if (!this.list.hasOwnProperty(key)) {
		this.list[key] = 0;
	}
	this.list[key] += amt;
}
//End of DT #586,687,614,744

//====================Helpers ==========================
function isNullOrEmpty(val) {
	if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
		return true;
	}
	return false;
}

function nsBoolToBool(val) {
	if (!isNullOrEmpty(val) && val == 'T') {
		return true;
	}
	return false;
}

function emptyIfNull(val) {
	if (val == null) {
		return '';
	}
	return val;
}

function zeroIfNull(val) {
	if (val == null) {
		return 0;
	}
	return val;
}

function getGLCustomSegments() {

	var res = {
		customSegmentsExists: false,
		customSegments: {}
	}
	if (isFeatureOn('customsegments')) {
		var customsegmentSearch = nlapiSearchRecord("customsegment", null,
			[
				["glimpact", "is", "T"]
			],
			[
				new nlobjSearchColumn("displayorder").setSort(false),
				new nlobjSearchColumn("name"),
				new nlobjSearchColumn("scriptid"),
				new nlobjSearchColumn("recordscriptid")
			]
		);
		if (!isNullOrEmpty(customsegmentSearch) && customsegmentSearch.length > 0) {
			res.customSegmentsExists = true;
			for (var i = 0; i < customsegmentSearch.length; i++) {
				var segmentRes = customsegmentSearch[i];
				var id = segmentRes.getValue('scriptid');
				res.customSegments[id] = {
					id: id,
					name: segmentRes.getValue('name'),
					recordType: segmentRes.getValue('recordscriptid')
				}
			}
		}
	}
	return res;

}

function getItemTypeFromType(type) {
	var ITEM_TYPE = {
		'Assembly' : 'assemblyitem',
		'Description' : 'descriptionitem',
		'Discount' : 'discountitem',
		'GiftCert' : 'giftcertificateitem',
		'InvtPart' : 'inventoryitem',
		'Group' : 'itemgroup',
		'Kit' : 'kititem',
		'Markup' : 'markupitem',
		'NonInvtPart' : 'noninventoryitem',
		'OthCharge' : 'otherchargeitem',
		'Payment' : 'paymentitem',
		'Service' : 'serviceitem',
		'Subtotal' : 'subtotalitem'
	};
	return ITEM_TYPE[type]
}

isFeatureOn = function (featureName) {
	var isFeatureOn = true;
	var featureStatus = nlapiGetContext().getSetting('FEATURE', featureName);
	if (featureStatus == 'F') { isFeatureOn = false; }
	return isFeatureOn;
}