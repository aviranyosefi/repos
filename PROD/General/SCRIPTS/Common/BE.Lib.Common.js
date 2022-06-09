/**
 * Common
 * @NApiVersion 2.x
 * @NModuleScope public
 * 
 * 
 */
/**
* Copyright (c) 2006-2019 BE NetSuite
* All Rights Reserved.
* 
* User may not copy, modify, distribute, re-bundle or reuse this code in any way.
*/
/**
 * Author: Igor Povolotski
 */

/**
 * BE.Lib.Common.js
 */

define([
	'require'
, 	'N/log'
, 	'N/error'
, 	'N/search'
,	'N/record'
],
function(
	require
, 	logger
, 	error 
, 	search
,	record) 
{
	'use strict';
	
	/**
	 * isNullOrEmpty
	 * @memberOf BE.Lib.Common
	 */
	function isNullOrEmpty(val) {
		if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
			return true;
		}
		return false;
	};

	/**
	 * boolToNsBool
	 * @memberOf BE.Lib.Common
	 */
	function boolToNsBool(val){
		var nsBool = 'F';
			if (!this.isNullOrEmpty(val) && (val == true || val == 'T')) {
				nsBool = 'T';
			}
			return nsBool;
	}
	

	/**
	 * tryParseInt
	 * @memberOf BE.Lib.Common
	 */
	function tryParseInt(val) {
		if (isNullOrEmpty(val) || isNaN(val)) {
			return 0;
		} else {
			return parseInt(val);
		}
	};

	/**
	 * tryParseFloat
	 * @memberOf BE.Lib.Common
	 */
	function tryParseFloat(val) {
		if (isNullOrEmpty(val) || isNaN(val)) {
			return 0.00;
		} else {
			return parseFloat(val);
		}
	};

	/**
	 * nsBoolToBool
	 * @memberOf BE.Lib.Common
	 */	
	function nsBoolToBool(val) {
		if (!isNullOrEmpty(val)) {
			if(typeof(val) === "boolean"){
				return val;
			}
			else {
				if (val == 'T') {
					return true;
				}
			}
		}
		return false;
	};
			
	/**
	 * toBoolean
	 * @memberOf BE.Lib.Common
	 */	
	function toBoolean(val) {
		return val === true || val === 'T' || val === 'true'
	}
			
	/**
	 * nsDateToDate
	 * @memberOf BE.Lib.Common
	 */	
	function nsDateToDate(val){
		if (!isNullOrEmpty(val)) {
			if(typeof(val) === "object"){
				return val;
			}
			else {
				var res = null;
				require(['N/format'], function(format) {
					res = format.parse({
					    value: val,
					    type: format.Type.DATE
					});
				});
				return res;
			}
		}
		return null;
	};
	
	/**
	 * getFileURL
	 * @memberOf BE.Lib.Common
	**/
	function getFileURL(fileName) {
		var folderName = null,
			pathParts = fileName.split('\/'),
			url = null,
			res = null;
			
		if (pathParts.length > 1) {
			folderName = pathParts[pathParts.length - 2];
			fileName = pathParts[pathParts.length - 1];
		}
		res = search.create({
			type: 'file',
			columns: [ 'folder', 'url' ],
			filters: [ {
				name: 'name',
				operator: 'is',
				values: fileName
			} ]
		}).run();
				
		res.each(function(result) {
			var folder = result.getText('folder');
			if (isNullOrEmpty(folderName) || (folder.toLowerCase() == folderName.toLowerCase())) {
				url = url || result.getValue('url');
			}
		});
		//logger.debug({ title: 'getFileURL url', details: url })
		return url;
	}
	
	/**
	 * getFileId
	 * @memberOf BE.Lib.Common
	**/
	function getFileId(fileName) {
		var id = null,
			folderName = null,
			res = null,
			pathParts = fileName.split('\/');
		
		if (pathParts.length > 1) {
			folderName = pathParts[pathParts.length - 2];
			fileName = pathParts[pathParts.length - 1];
		}
		res = search.create({
			type : 'file',
			columns : [ 'folder' ],
			filters : [ {
				name : 'name',
				operator : 'is',
				values : fileName
			} ]
		}).run();
		
		res.each(function(result) {
			var folder = result.getText('folder');
			if (folderName == null || (folder.toLowerCase() == folderName.toLowerCase())) {
				id = id || result.id;
			}
		});
		return id;
	}
	
	/**
	 * getItemTypeFromType
	 * @memberOf BE.Lib.Common
	**/
	function getItemTypeFromType(type) {
		var ITEM_TYPE = {
			'Assembly' : record.Type.ASSEMBLY_ITEM,
			'Description' : record.Type.DESCRIPTION_ITEM,
			'Discount' : record.Type.DISCOUNT_ITEM,
			'GiftCert' : record.Type.GIFT_CERTIFICATE_ITEM,
			'InvtPart' : record.Type.INVENTORY_ITEM,
			'Group' : record.Type.ITEM_GROUP,
			'Kit' : record.Type.KIT_ITEM,
			'Markup' : record.Type.MARKUP_ITEM,
			'NonInvtPart' : record.Type.NON_INVENTORY_ITEM,
			'OthCharge' : record.Type.OTHER_CHARGE_ITEM,
			'Payment' : record.Type.PAYMENT_ITEM,
			'Service' : record.Type.SERVICE_ITEM,
			'Subtotal' : record.SUBTOTAL_ITEM
		};
		return ITEM_TYPE[type]
	}
	
	/**
	 * zeroIfNullOrEmpty
	 * @memberOf NCS.Lib.Common
	 */
	function zeroIfNullOrEmpty(val){
		if (isNullOrEmpty(val)) {
			return 0;
		}
		return val;
	}
	
	return {
		nsDateToDate: nsDateToDate,
		toBoolean: toBoolean,
		nsBoolToBool: nsBoolToBool,
		tryParseFloat: tryParseFloat,
		tryParseInt: tryParseInt,
		isNullOrEmpty: isNullOrEmpty,
		getFileURL: getFileURL,
		getFileId: getFileId,
		getItemTypeFromType: getItemTypeFromType,
		zeroIfNullOrEmpty: zeroIfNullOrEmpty,
		boolToNsBool: boolToNsBool
	};
});