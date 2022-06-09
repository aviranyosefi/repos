/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 May 2015     igorp
 *
 */

Function.prototype.inheritsFrom = function(parentClassOrObject) { 
	if(parentClassOrObject) {
		if (parentClassOrObject.constructor == Function) { 
			//Normal Inheritance 
			this.prototype = new parentClassOrObject;
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject.prototype;
		} 
		else { 
			//Pure Virtual Inheritance 
			this.prototype = parentClassOrObject;
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject;
		} 
		return this;
	}
	else {
		throw new Error('Cannot inherit from null or undefined.');
	}
	return null;
};

/**
 * Prototypes
 */

// String Prototypes
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.startsWith = function(substring, position) {
	position = position || 0;
	return this.indexOf(substring, position) === position;
};

String.prototype.endsWith = function(substring, position) {
	substring = String(substring);

	var subLen = substring.length | 0;

	if(!subLen)
		return true;//Empty string

	var strLen = this.length;

	if(position === void 0)
		position = strLen;
	else
		position = position | 0;

	if(position < 1)
		return false;

	var fromIndex = (strLen < position ? strLen : position) - subLen;

	return (fromIndex >= 0 || subLen === -fromIndex) 
		&& (position === 0 || this.charCodeAt(fromIndex) === substring.charCodeAt(0)) 
		&& this.indexOf(substring, fromIndex) === fromIndex;
};

String.prototype.reverse = function() {
	return this.split('').reverse().join('');
};

String.prototype.capitalize = function() {
	if(this.length > 0) {
		return this.charAt(0).toUpperCase() + this.substring(1);
	}

	return this;
};

String.prototype.regexIndexOf = function(pattern, startIndex) {
	startIndex = startIndex || 0;
	var searchResult = this.substr(startIndex).search(pattern);
	return (-1 === searchResult) ? -1 : searchResult + startIndex;
};

String.prototype.regexLastIndexOf = function(pattern, startIndex) {
	startIndex = startIndex === undefined ? this.length : startIndex;
	var searchResult = this.substr(0, startIndex).reverse().regexIndexOf(pattern, 0);
	return (-1 === searchResult) ? -1 : this.length - ++searchResult;
};

String.prototype.replaceSyntax = function(tagReplacer, targetObject, startTag, endTag) {
	this.tagReplacer = tagReplacer || function(tag, targetObject) {
		return '"' + tag + '"';
	};

	this.startTag = startTag || '{';
	this.endTag = endTag || '}';
	var output = [];
	var tagParenthesis = [];
	var length = this.length;
	var currentIndex = 0;

	this.findNextTag = function() {
		currentIndex = this.regexIndexOf(this.startTag + '|' + this.endTag, currentIndex);
		if(currentIndex == -1) {
			currentIndex = length + 1;
			return null;
		}
		var retChar = this.charAt(currentIndex);
		currentIndex++;
		return retChar;
	};

	this.validateTagPrnths = function(tagPrnth) {
		if(tagParenthesis.length == 0 && tagPrnth == this.endTag) {
			throw new Error('Invalid Start Parenthesis : ' + tagPrnth);
		}
		var lastPrnth = tagParenthesis[tagParenthesis.length - 1];
		if(lastPrnth == tagPrnth) {
			throw new Error('Encountered ' + tagPrnth + ' after ' + lastPrnth);
		}
		return true;
	};

	// Start Replace Data	
	while(currentIndex < length) {
		var prevIndx = currentIndex;
		var tagParnth = this.findNextTag();

		if(tagParnth) {
			this.validateTagPrnths(tagParnth);
			tagParenthesis.push(tagParnth);
		}

		var tmpStr = this.substring(prevIndx, currentIndex - 1);

		if(tagParnth && tagParnth == this.endTag) {
			// syntax
			output.push(this.tagReplacer(tmpStr, targetObject));
		}
		else {
			// The simple text
			output.push(tmpStr);
		}

	}

	return output.join('');
};

String.prototype.replaceCharCode = function(charCode, replaceChar, position) {
	position = position || 0;
	charCode = new Number(charCode);
	var res = [];

	for( var i = position; i < this.length; i++) {
		if(this.charCodeAt(i) == charCode) {
			res.push(replaceChar);
		}
		else {
			res.push(this.charAt(i));
		}
	}

	return res.join('');
};

String.prototype.resolveHtmlNewLines = function() {
	if(this != null) {
		return this.replace(/\r\n|\n\r|\n|\r/gi, '<br/>');
	}	
	return null;
};

String.prototype.leftPad = function(pchar, plength) {
	var newStr = this;
	var deltaPad = plength - newStr.length;
	if(deltaPad > 0) {
		while(newStr.length < plength) {
			newStr = pchar + newStr;
		}
	}
	return newStr;
};

String.prototype.rightPad = function(pchar, plength) {
	var newStr = this;
	var deltaPad = plength - newStr.length;
	if(deltaPad > 0) {
		while(newStr.length < plength) {
			newStr = newStr + pchar;
		}
	}
	return newStr.toString();
};

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
	});
};

// StringBuilder & its Prototypes
function StringBuilder(value) {
	this.strings = [];
	this.append(value);
}

StringBuilder.prototype.append = function(value) {
	if(value) {
		this.strings.push(value);
	}
};

StringBuilder.prototype.clear = function() {
	this.strings = [];
};

StringBuilder.prototype.removeLast = function() {
	return this.strings.pop();
};

StringBuilder.prototype.getLength = function() {
	return this.strings.length();
};

StringBuilder.prototype.toString = function() {
	return this.strings.join('');
};

// Number Prototypes
Number.prototype.toFixedFloat = function(n) {
	return parseFloat(parseFloat(this).toFixed(2));
};

Number.prototype.toCurrencyString = function(symbol) {
	var res = this.toFixedFloat(2).toFixed(2).replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
	if(!isNullOrEmpty(symbol)) {
		return symbol + res;
	}
	return res;
};

//Array Prototypes
Array.prototype.addRange = function(arr2, unique) {
	if(unique === true) {
		for(var i = 0; i < arr2.length; i++) {
			var newVal = arr2[i];
			if(this.indexOf(newVal) == -1) {
				this.push(newVal);
			}
		}
	}
	else {
		for(var i = 0; i < arr2.length; i++) {
			this.push(arr2[i]);
		}
	}
};
Object.defineProperty(Array.prototype, "addRange", { enumerable: false });

Array.prototype.addHashTableRange = function(hashtable2) {
	for( var key in hashtable2) {
		if(hashtable2.hasOwnProperty(key)) {
			this[key] = hashtable2[key];
		}
	}
};
Object.defineProperty(Array.prototype, "addHashTableRange", { enumerable: false });

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
Object.defineProperty(Array.prototype, "unique", { enumerable: false });

Array.prototype.distinctSearchResults = function(isJsonResult) {
	var tmpHT = [];
	var returnArr = [];

	for( var i = 0; i < this.length; i++) {
		var rec = this[i];
		var recId = isJsonResult === true ? rec.id : rec.getId();
		if(tmpHT[recId] == null) {
			returnArr.push(rec);
			tmpHT[recId] = true;
		}
	}

	return returnArr;
};
Object.defineProperty(Array.prototype, "distinctSearchResults", { enumerable: false });

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};
Object.defineProperty(Array.prototype, "insert", { enumerable: false });


//Methods

function getConstructorName(obj) {
	if(typeof obj.getClassName != 'undefined') {
		return obj.getClassName();
	}
	else {
		return obj.constructor.name;
	}
}

function isNullOrEmpty(val) {
	if(typeof(val) == 'undefined' || val == null || (typeof(val) == 'string' && val.length == 0)) {
		return true;
	}
	return false;
}

function tryParseInt(val) {
	if(isNullOrEmpty(val) || isNaN(val)) {
		return 0;
	}
	else {
		return parseInt(val);
	}
}

function tryParseFloat(val) {
	if(isNullOrEmpty(val) || isNaN(val)) {
		return 0.00;
	}
	else {
		return parseFloat(val);
	}
}

function isNullOrUndefined(val) {
	return (typeof val === "undefined" || val === null);
}

function emptyIfNull(val) {
	if(typeof (val) == 'undefined' || val == null) {
		return '';
	}
	return val;
}

function emptyIfNoData(data) {
	if(isNullOrEmpty(data)) {
		return '';
	}
	
	if(typeof (data) == 'string') {
		var trimData = data.toLowerCase().trim();
		if(trimData === '' || trimData === '- none -' || trimData === '-none-' || trimData === 'null' || trimData === 'undefined') {
			return '';
		}
	}
	return data;
}

function nullIfNoData(data) {
	if(isNullOrEmpty(emptyIfNoData(data))) {
		return null;
	}
	return data;
}

function emptyIfNullOrZiro(val) {
	if(typeof (val) == 'undefined' || val == null || val == 0) {
		return '';
	}
	return val;
}

function escapeXMLString(str) {
	// /&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+);)(?!(?>(?:(?!<!\[CDATA\[|\]\]>).)*)\]\]>)/s
	if(!isNullOrEmpty(str)) {
		var ampersand = /&(?!(?:apos|quot|[gl]t|amp|nbsp);|#)/gi;
		return str.replace(ampersand, '&amp;');
	}
	return str;
}

function getRecordScriptId(abstractType, recordId) {
	var res = nlapiSearchRecord(abstractType, null, [new nlobjSearchFilter('internalid', null, 'is', recordId)]);
	if(res != null) {
		return res[0].getRecordType();
	}
	
	return null;
}

function getRecordFieldValue(fldName, record) {
	if(record) {
		return record.getFieldValue(fldName);
	}
	else {
		return nlapiGetFieldValue(fldName);
	}
}

function setRecordFieldValue(fldName, fldValue, record) {
	if(record) {
		record.setFieldValue(fldName, fldValue);
	}
	else {
		nlapiSetFieldValue(fldName, fldValue);
	}
}

function getRecordFieldText(fldName, record) {
	if(record) {
		return record.getFieldText(fldName);
	}
	else {
		return nlapiGetFieldText(fldName);
	}
}

function setRecordFieldText(fldName, fldText, record) {
	if(record) {
		record.setFieldText(fldName, fldText);
	}
	else {
		nlapiSetFieldText(fldName, fldText);
	}
}

function getRecordLineItemText(subListType, fldName, line, record) {
	if(record) {
		return record.getLineItemText(subListType, fldName, line);
	}
	else {
		return nlapiGetLineItemText(subListType, fldName, line);
	}
}

function getRecordLineItemValue(subListType, fldName, line, record) {
	if(record) {
		return record.getLineItemValue(subListType, fldName, line);
	}
	else {
		return nlapiGetLineItemValue(subListType, fldName, line);
	}
}

function setRecordLineItemValue(subListType, fldName, fldValue, line, record) {
	if(record) {
		record.setLineItemValue(subListType, fldName, line, fldValue);
	}
	else {
		nlapiSetLineItemValue(subListType, fldName, line, fldValue);
	}
}

function getRecordLineItemCount(subListType, record) {
	if(record) {
		return record.getLineItemCount(subListType);
	}
	else {
		return nlapiGetLineItemCount(subListType);
	}
}

function getRecordSubList(subListType, record) {
	if(record) {
		return record.getSubList(subListType);
	}
	else {
		return nlapiGetSubList(subListType);
	}
}

function serializeParameters(hashtable)
{
    var params = "";
    for(var key in hashtable)
    {
        params += "&" + key + "=" + hashtable[key];
    }
    if(params.length > 0)
        params = params.substring(1,params.length);
    
    return params;
}

function deserializeParameters(params)
{
	var temp = params.split("?");
	if(temp.length > 1)
	{
		params = temp[1];
	}

    var hashtable = new Array();
    var keyValueArray = params.split("&");
    for(var i = 0; i < keyValueArray.length; i++)
    {
        var keyValue = keyValueArray[i].split("=");
        hashtable[keyValue[0]] = keyValue[1]; 
    }        
    return hashtable;
}

function getFolderId(fileName) {
    var folderName = null;
	var pathParts = fileName.split('\/');
	if(pathParts.length > 1) {
		folderName = pathParts[pathParts.length - 2];
		fileName = pathParts[pathParts.length - 1];
	}
	
    var results = nlapiSearchRecord('folder', null, [new nlobjSearchFilter('name', null, 'is', fileName)], [new nlobjSearchColumn('parent')]);
	if(results != null) {
		if (folderName == null) {
			return results[0].getId();
		}
		else {
			for (var i = 0; i < results.length; i++) {
				var rec = results[i];
				if (rec.getText('parent') == folderName) {
					return rec.getId();
				}
			}
		}
	}
    return null;
}

function getFileId(fileName) {
    var folderName = null;
	var pathParts = fileName.split('\/');
	if(pathParts.length > 1) {
		folderName = pathParts[pathParts.length - 2];
		fileName = pathParts[pathParts.length - 1];
	}
	
    var results = nlapiSearchRecord('file', null, [new nlobjSearchFilter('name', null, 'is', fileName)], [new nlobjSearchColumn('folder')]);
	if(results != null) {
		if (folderName == null) {
			return results[0].getId();
		}
		else {
			for (var i = 0; i < results.length; i++) {
				var rec = results[i];
				if (rec.getText('folder') == folderName) {
					return rec.getId();
				}
			}
		}
	}
    return null;
}

function getFileURL(fileName) {
	var folderName = null;
	var pathParts = fileName.split('\/');
	if(pathParts.length > 1) {
		folderName = pathParts[pathParts.length - 2];
		fileName = pathParts[pathParts.length - 1];
	}
	
    var results = nlapiSearchRecord('file', null, [new nlobjSearchFilter('name', null, 'is', fileName)], [new nlobjSearchColumn('url'), new nlobjSearchColumn('folder')]);
	if(results != null) {
		if (folderName == null) {
			return results[0].getValue('url');
		}
		else {
			for (var i = 0; i < results.length; i++) {
				var rec = results[i];
				if (rec.getText('folder') == folderName) {
					return rec.getValue('url');
				}
			}
		}
	}
    return null;
}

function getFileURLByID(fileId)
{
    var result = nlapiSearchRecord( "file", null,
        [new nlobjSearchFilter("internalid", null, 'is', fileId)],
        [new nlobjSearchColumn("url")]);
            
    return result == null? null: result[0].getValue("url");
}

function date_to_file_name(d) {
	if (isNullOrEmpty(d)) {
		d = new Date();
	}
	return [d.getDate(),
            d.getMonth()+1,
            d.getFullYear(),
            d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join('_');
}

function submitField(recType,recId,fieldName,value,isDisabletriggers,isEnablesourcing) {
	isDisabletriggers = (isNullOrEmpty(isDisabletriggers)? false: isDisabletriggers);
	isEnablesourcing = (isNullOrEmpty(isEnablesourcing)? false: isEnablesourcing);
	try {
		if (!isDisabletriggers) {
			nlapiSubmitField(recType, recId, fieldName, value,isEnablesourcing);
		}
		else {
			nlapiSubmitField(recType, recId, fieldName, value, {disabletriggers : isDisabletriggers, enablesourcing : isEnablesourcing});
		}
		nlapiLogExecution('debug', 'submitField ','new value submitted succefully - rec type: ' +  recType + 
				' record id : ' + recId + ' field name : ' +
				fieldName + ' new value : ' + value);
	}
	catch (err) {
		nlapiLogExecution('ERROR', 'submitField ','Error occured when submitting new value - rec type: ' +  recType + 
				' record id : ' + recId + ' field name : ' +
				fieldName + ' new value : ' + value + ' Error Message : ' + err.message);
	}
}

function submitRecord(record,isDisabletriggers,isEnablesourcing,isIgnoreMandatory) {
	isDisabletriggers = (isNullOrEmpty(isDisabletriggers)? false: isDisabletriggers);
	isEnablesourcing = (isNullOrEmpty(isEnablesourcing)? false: isEnablesourcing);
	var id = null;
	try {
		if (!isDisabletriggers) {
			id = nlapiSubmitRecord(record, isEnablesourcing,isIgnoreMandatory);			
		}
		else {
			id = nlapiSubmitRecord(record, {disabletriggers : isDisabletriggers, enablesourcing : isEnablesourcing},isIgnoreMandatory);			
		}
		nlapiLogExecution('debug', 'submitRecord ','record submitted succefully - rec type: ' +  record.getRecordType() + 
				' record id : ' + (isNullOrEmpty(record)? '' : record.getId()));		
	}
	catch (err) {
		nlapiLogExecution('ERROR', 'submitField ','Error occured when submitting record - rec type: ' +  record.getRecordType() + 
				' record id : ' + (isNullOrEmpty(record)? '' : record.getId()) + ' Error Message : ' + err.message);
		throw err;
	}
	return id;
}

function getData(params) {	
	var searchResults = null;
	var columns = params.columns;			
	var filters = params.filters;
	var search = nlapiCreateSearch(params.search, filters, columns);
	//nlapiLogExecution('debug', 'search : ', search + ' searchName : ' + params.search + ' : filter : ' + filters.length + ' columns : ' + columns.length);
	if (search != null) {
		var resultSet = search.runSearch();	
		if (resultSet != null) {
			searchResults = [];
			var nextPageExits = true;
			var nextPage = 1000;
			while (nextPageExits) {
				var pageResults = resultSet.getResults(nextPage - 1000, nextPage);
				if (pageResults.length > 0) {
					searchResults.addRange(pageResults);					
				}				
				nextPage +=1000;
				if (pageResults.length<1000) {
					nextPageExits = false;
				}			
			}		
		}
	}	
	return searchResults; 	
}

function getData_SavedSearch(params) {
	//nlapiLogExecution('debug', 'search : ', searchID);
	var searchResults = null;
	var columns = null;	
	var searchID = params.search;
	var search = nlapiLoadSearch(null, searchID);
	
	//nlapiLogExecution('debug', 'search : ', search);
	if (search != null) {	
		if (!isNullOrEmpty(params.filters)) {
			if (!isNullOrEmpty(params.overWriteFilters) && params.overWriteFilters) {
				search.setFilters(params.filters);
			}			
			else {
				search.addFilters(params.filters);
			}
		}
		if (!isNullOrEmpty(params.columns)) {
			if (!isNullOrEmpty(params.overWriteColumns) && params.overWriteColumns) {
				search.setColumns(params.columns);
			}			
			else {
				search.addColumns(params.columns);
			}		
		}
		columns = search.getColumns();
		var resultSet = search.runSearch();	
		if (resultSet != null) {
			searchResults = [];
			var nextPageExits = true;
			var nextPage = 1000;
			while (nextPageExits) {
				var pageResults = resultSet.getResults(nextPage - 1000, nextPage);
				if (pageResults.length > 0) {
					searchResults.addRange(pageResults);
				}				
				nextPage +=1000;
				if (pageResults.length<1000) {
					nextPageExits = false;
				}			
			}		
		}
	}
	return {
		searchResults : searchResults,
		searchColumns : columns
	}; 		
}

function string_toCsvField(field) {
	return '"' + field.replace("\"", "\"\"") + '"';
}

function get_Global_Setting(propertyId) {
	return nlapiLookupField('customrecord_ncs_global_settings', 1, propertyId);
}

function writeToLog(title,msg,logType) {
	if (isNullOrEmpty(logType)) {
		logType = 'audit';
	}
	nlapiLogExecution(logType, title, msg);
}

function customException(msg,errorCode,isSupressNotification) {
	msg = (isNullOrEmpty(msg)?'Unexpected Error' : msg);
	errorCode = (isNullOrEmpty(errorCode)?'Unknown' : errorCode);
	isSupressNotification = (isNullOrEmpty(isSupressNotification)? false : isSupressNotification);	
	return nlapiCreateError(errorCode, msg, isSupressNotification);
}

function nsBoolToBool(val){
	if (!isNullOrEmpty(val) && val == 'T') {
		return true;
	}
	return false;
}

function getFileURL(fileName) {
	var folderName = null;
	var pathParts = fileName.split('\/');
	if(pathParts.length > 1) {
		folderName = pathParts[pathParts.length - 2];
		fileName = pathParts[pathParts.length - 1];
	}
	
    var results = nlapiSearchRecord('file', null, [new nlobjSearchFilter('name', null, 'is', fileName)], [new nlobjSearchColumn('url'), new nlobjSearchColumn('folder')]);
	if(results != null) {
		if (folderName == null) {
			return results[0].getValue('url');
		}
		else {
			for (var i = 0; i < results.length; i++) {
				var rec = results[i];
				if (rec.getText('folder') == folderName) {
					return rec.getValue('url');
				}
			}
		}
	}
    return null;
} 

function lookupRecord(recType, lookupFld, lookupVal) {
	if(isNullOrEmpty(recType)) {
		throw new Error('lookupRecord: "recType not defined."');
	}
	if(isNullOrEmpty(lookupFld)) {
		throw new Error('lookupRecord: "lookupFld not defined."');
	}

	var filter = new nlobjSearchFilter(lookupFld, null, 'is', lookupVal);
	var res = nlapiSearchRecord(recType, null, filter);
	if(res && res.length > 0) {
		return res[0].getId();
	}
	return null;
}

function lookupFieldData(recType, recId, fldNames) {
	var filter = new nlobjSearchFilter('internalid', null, 'is', recId);
	var columns = null;
	
	if(fldNames && fldNames.length > 0) {
		columns = [];
		if(typeof(fldNames) == 'string') {
			columns.push(new nlobjSearchColumn(fldNames));
		}
		else {
			for(var i = 0; i < fldNames.length; i++) {
				columns.push(new nlobjSearchColumn(fldNames[i]));
			}
		}

		var searchResult = nlapiSearchRecord(recType, null, filter, columns);
		if(searchResult && searchResult.length > 0) {
			var retObj = {};
			var result = searchResult[0];
			for(var i = 0; i < columns.length; i++) {
				var column = columns[i];
				retObj[column.getName()] = {
					id: result.getValue(column),
					value: result.getValue(column),
					text: result.getText(column)
				};
			}
			return retObj;
		}
	}
	
	return null;
};

function addHtmlBlock(form, name, htmlText) {
	if(isNullOrEmpty(name)) {
		name = 'custpage_' + new Date().getTime().toString();
	}
	else if(name.indexOf('custpage') == -1) {
		name = 'custpage_' + name;
	}

	var htmlFld = form.addField(name, 'inlinehtml', '');
	htmlFld.setDefaultValue(htmlText);
}

function getFullFileName(filePath) {
	return filePath.split('/').pop();
}

function getFileName(fileName) {
	var fullFileName = getFullFileName(fileName);
	var index = fullFileName.lastIndexOf('.');
	
	if(index >= 0) {
		return fullFileName.substring(0, index);
	}
	return fullFileName;
}

function getFileExtension(fileName) {
	return fileName.split('.').pop();
}

function TemplateEngine (tagWrapper) {
	var startTag = '${';
	var endTag = '}';
	
	if(tagWrapper && tagWrapper.startTag && tagWrapper.endTag) {
		startTag = tagWrapper.startTag;
		endTag = tagWrapper.endTag;
	}
	
	startTag = startTag.replace('$', '\\$');

	var matchArrayToFields = function(arr, fn) {
		var newArr = null;
		if(arr && arr.length > 0) {
			newArr = [];
			for(var i = 0; i < arr.length; i++) {
				newArr.push(fn.call(this, arr[i]));
			}
		}
		return newArr;
	};
	
	this.exec = function(tpl, data) {
		var cData = data;
		var retString = tpl;
		var isNSRecord = false;
		var nsLookupFields = null;

		this.data = data;
		this.nsData = null;

		if(retString && cData) {
			isNSRecord = cData.recType && cData.recId;
			nsLookupFields = [];

			var regEx = new RegExp(startTag + '[a-z0-9_.]+' + endTag, 'gi');
			var matches = retString.match(regEx);

			if(matches && matches.length > 0) {
				var uqMatches = matches.unique();
				
				if(isNSRecord) {
					nsLookupFields = matchArrayToFields(uqMatches, function(item) {
						return item.replace(new RegExp('['+startTag+endTag+']', 'gi'), '');
					});

					this.nsData = cData = lookupFieldData(cData.recType, cData.recId, nsLookupFields);
				}

				for (var i = 0; i < uqMatches.length; i++) {
					var tagMatch = uqMatches[i];
					var fldMatch = tagMatch.replace(new RegExp('['+startTag+endTag+']', 'gi'), '');
					var fldVal = null;

					try {
					   var fldValObj = cData[fldMatch];
					   !fldValObj && fldValObj != '' && (fldValObj = eval('cData.' + fldMatch));
					   
					   if(fldValObj) {
						   if(fldValObj.text != null && fldValObj.text != 'undefined') {
							   fldVal = fldValObj.text;
						   }
						   else {
							   fldVal = fldValObj.id || fldValObj.value || fldValObj || '';
						   }
					   }
					}
					catch(ex) {}

					if(fldVal != null && fldVal != 'undefined') {
                        tagMatch = tagMatch.replace('$', '\\$');
                        retString = retString.replace(new RegExp(tagMatch, 'g'), fldVal);
					}
				}
			}
		}			
		return retString;
	};
	
}

function isArrayAndNotEmpty(arr) {
	try {
		if (arr && arr instanceof Array && arr.length > 0) {
			return true;
		}
		return false;
	} catch (err) {
		return false;
	}
};

function findLineItemValue(subListType, fldNames, fldValues, record) {
	var lineItemCount = record? record.getLineItemCount(subListType) : nlapiGetLineItemCount(subListType);
	for(var line = 1; line <= lineItemCount; line++) {
		var check = true;
		for(var i = 0; i < fldNames.length; i++) {
			var fldName = fldNames[i];
			var fldValue = fldValues[i];
			var lineItemFld = record? record.getLineItemField(subListType, fldName, line) : nlapiGetLineItemField(subListType, fldName, line);
			var lineItemVal = record? record.getLineItemValue(subListType, fldName, line) : nlapiGetLineItemValue(subListType, fldName, line);
			if(lineItemFld.getType() == 'checkbox' && isNullOrEmpty(lineItemVal)) {
				lineItemVal = 'F';
			}
			check = check && (lineItemVal == fldValue);
		}
		if(check) {
			return line;
		}
	}
	return -1;
}

function getTimeZoneDateTimeValue(dateTime, timeZone) {
	var newDateTime = new Date(dateTime);
	
	var timeZoneList = ncTimeZonesList;
	
	timeZone = timeZone || nlapiGetContext().getPreference('timezone');
	
	var dateTimeTimeZoneOffset = dateTime.getTimezoneOffset();
	var newTimeZoneOffset = timeZoneList[timeZone].offset;
	
	newDateTime.addMinutes(dateTimeTimeZoneOffset + newTimeZoneOffset*-1);

	return newDateTime;
}

var AL = AL || {};

//Utils
AL.Utils = AL.Utils || {};

AL.Utils.values = function(obj) {
	var returnObj = [];
	
	if(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				returnObj.push(obj[key]);
			}
		}
	}
	return returnObj;
};