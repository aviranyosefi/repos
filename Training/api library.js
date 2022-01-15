// JavaScript source code
function nlapiLoadRecord(type, id) { ; } /* load a record from the system. */
function nlapiCreateRecord(type) { ; } /* instantiate a new record from the system. */
function nlapiCopyRecord(type, id) { ; } /* instantiate a new record using values from an existing record. */
function nlapiTransformRecord(type, id, transformType) { ; } /* create a new record using values from an existing record of a different type. */
function nlapiSubmitRecord(record, doSourcing) { ; } /* submit a record to the system for creation or update */
function nlapiDeleteRecord(type, id) { ; } /* delete a record from the system. */
function nlapiSearchRecord(type, id, filters, columns) { ; } /* perform a record search using an existing search or filters and columns */
function nlapiLookupField(type, id, fields) { ; } /* fetch the value of a field or set of fields for a record. */
function nlapiResolveURL(type, identifier, id, editmode) { ; } /* resolve a URL to an object in the system. */
function nlapiSetRedirectURL(type, identifier, id, editmode, parameters) { ; } /* redirect the user to a page. */
function nlapiRequestURL(url, postdata, headers, callback, target) { ; } /* request a URL to an external or internal resource. */
function nlapiGetContext() { ; } /* return context information about the current user/script. */
function nlapiGetUser() { ; } /* return the internalId for the current user. */
function nlapiGetRole() { ; } /* return the internalId for the current user’s role. */
function nlapiGetDepartment() { ; } /* return the internalId for the current user’s department. */
function nlapiGetLocation() { ; } /* return the internalId for the current user’s location. */
function nlapiGetRecordType() { ; } /* return the recordtype corresponding to the page or userevent script. */
function nlapiGetRecordId() { ; } /* return the internalId corresponding to the page or userevent script. */
function nlapiCreateError(code, details) { ; } /* create a user-defined error object that can be thrown */
function nlapiGetFieldValue(fldnam) { ; } /* return the value of a field on the current record on a page or userevent script. */
function nlapiSetFieldValue(fldnam, value, firefieldchanged) { ; } /* set the value of a field on the current record on a page or userevent script. */
function nlapiGetLineItemValue(type, fldnam, linenum) { ; }/* return the value of a line item field on the current record on a page or userevent script. */
function nlapiSetLineItemValue(type, fldnam, linenum, value) { ; }/* set the value of a line item field on the current record on a page or userevent script. */
function nlapiGetLineItemCount(type) { ; } /* return the number of line items in a line item group on the current record on a page or userevent script. */

/* Server SuiteScript Functions */
function nlapiLogExecution(type, title, details) { ; } /* create an entry in the script execution log. */
function nlapiGetNewRecord() { ; } /* return an record object containing the data being submitted to the system for the currenr record. */

function nlapiGetOldRecord() { ; } /* return an record object containing the current record’s data prior to the write operation. */
function nlapiCreateForm(title) { ; } /* return a new form that can be used to build a custom page. */
function nlapiCreateList(title) { ; } /* return a new list that can be used to build a custom page. */
function nlapiSendEmail(from, to, subject, body, cc, bcc, records) { ; } /* send out an email and associate it with records in the system. */
function nlapiMergeEmail(id, baseType, baseId, altType, altId) { ; } /* perform a mail merge operation using an email template and up to 2 records. */

/* Helper SuiteScript Functions */
function nlapiStringToDate(str) { ; } /* convert a String into a Date object. */
function nlapiDateToString(d) { ; } /* convert a Date object into a String using the current user’s date format preference. */
function nlapiAddDays(d, days) { ; } /* add days to a Date object. */
function nlapiAddMonths(d, months) { ; } /* add months to a Date object. */
function nlapiFormatCurrency(str) { ; } /* format a number for data entry into a currency field. */
function nlapiEncrypt(s) { ; } /* encrypt a String using an asymetric encryption algorithm. */
function nlapiEscapeXML(text) { ; } /* escape a String for use in an XML document. */
function nlapiStringToXML(text) { ; } /* convert a String into an XML document. */
function nlapiXMLToString(xml) { ; } /* convert an XML document into a String. */
function nlapiSelectValue(node, xpath) { ; } /* select a value from an XML node using Xpath. */
function nlapiSelectValues(node, xpath) { ; } /* select an array of values from an XML node using Xpath. */
function nlapiSelectNode(node, xpath) { ; } /* select a node from an XML node using Xpath. */
function nlapiSelectNodes(node, xpath) { ; } /* select an array of nodes from an XML node using Xpath. */

/* nlobjRecord: scriptable record used for accessing and manipulating records. */
function nlobjRecord() { ; }
nlobjRecord.prototype.getId = function () { ; } /* return the internalId of the current record or NULL for new records. */
nlobjRecord.prototype.getRecordType = function () { ; } /* return the recordType corresponding to this record. */
nlobjRecord.prototype.setFieldValue = function (name, value) { ; } /* set the value of a field. */
nlobjRecord.prototype.setFieldValues = function (name, value) { ; } /* set the values of a multi-select field. */
nlobjRecord.prototype.getFieldValue = function (name) { ; } /* return the value of a field. */
nlobjRecord.prototype.getFieldValues = function (name) { ; } /* return the selected values of a multi-select field as an Array. */
nlobjRecord.prototype.getAllFields = function () { ; } /* return an Array of all fields. */
nlobjRecord.prototype.setLineItemValue = function (group, name, line, value) { ; } /* set the value of a line item field. */
nlobjRecord.prototype.getLineItemValue = function (group, name, line) { ; } /* return the value of a line item field. */
nlobjRecord.prototype.getLineItemCount = function (group) { ; } /* return the number of lines in a line item group. */

/* nlobjSearchFilter: filter objects used to defined search criteria. */
function nlobjSearchFilter(name, join, operator, value, value2) { ; }
nlobjSearchFilter.prototype.getName = function () { ; } /* return the name of this search filter. */
nlobjSearchFilter.prototype.getJoin = function () { ; } /* return the join id for this search filter. */
nlobjSearchFilter.prototype.getOperator = function () { ; } /* return the filter operator used. */

/* nlobjSearchColumn: column objects used to return data via search. */
function nlobjSearchColumn(name, join, summary) { ; }
nlobjSearchColumn.prototype.getName = function () { ; } /* return the name of this search column. */
nlobjSearchColumn.prototype.getJoin = function () { ; } /* return the join id for this search column. */
nlobjSearchColumn.prototype.getSummary = function () { ; } /* return the summary type (avg,group,sum,count) of this search column. */

/* nlobjSearchResult: search result row object. */
function nlobjSearchResult() { ; }
nlobjSearchResult.prototype.getId = function () { ; } /* return the internalId for the record returned in this row. */
nlobjSearchResult.prototype.getRecordType = function () { ; } /* return the recordtype for the record returned in this row. */
nlobjSearchResult.prototype.getValue = function (name, join, summary) { ; } /* return the value of this return column. */
nlobjSearchResult.prototype.getText = function (name, join, summary) { ; } /* return the text value of this return column if it’s a select field. */

/* nlobjContext: current user and script context information. */
function nlobjContext() { ; }
nlobjContext.prototype.getName = function () { ; } /* return the name of the current user. */
nlobjContext.prototype.getUser = function () { ; } /* return the internalId of the current user. */
nlobjContext.prototype.getRole = function () { ; } /* return the internalId of the current user’s role. */
nlobjContext.prototype.getEmail = function () { ; } /* return the email address of the current user. */
nlobjContext.prototype.getCompany = function () { ; } /* return the account ID of the current user. */
nlobjContext.prototype.getDepartment = function () { ; } /* return the internalId of the current user’s department. */
nlobjContext.prototype.getLocation = function () { ; } /* return the internalId of the current user’s location. */
nlobjContext.prototype.getExecutionContext = function () { ; } /* return the internalId of the current user’s role. */

/* nlobjError: system or user-defined error object. */
function nlobjError() { ; }
nlobjError.prototype.getCode = function () { ; } /* return the error code for this system or user-defined error. */
nlobjError.prototype.getDetails = function () { ; } /* return the error description for this error. */
nlobjError.prototype.getStackTrace = function () { ; } /* return a stacktrace containing the location of the error. */
nlobjError.prototype.getUserEvent = function () { ; } /* return the userevent script name where this error was thrown. */
nlobjError.prototype.getInternalId = function () { ; } /* return the internalid of the record if this error was thrown in an aftersubmit script. */

/* nlobjResponse: ServletResponse used in SERVLET scripts -or- returned by a call to nlapiRequestURL. */
function nlobjResponse() { ; }
nlobjResponse.prototype.setHeader = function (name, value) { ; } /* sets a custom response header. */
nlobjResponse.prototype.setRedirectURL = function (category, type, id, editmode, parameters) { ; } /* sets the redirect URL for the response. */
nlobjResponse.prototype.write = function (output) { ; } /* write information (text/xml/html) to the response. */
nlobjResponse.prototype.writePage = function (pageobject) { ; } /* write a page (nlobjForm or nlobjList). */
nlobjResponse.prototype.getHeader = function () { ; } /*return the value of a header returned via nlapiRequestURL. */
nlobjResponse.prototype.getAllHeaders = function () { ; } /* return an Array of all headers returned via nlapiRequestURL. */
nlobjResponse.prototype.getCode = function () { ; } /* return the response code returned via nlapiRequestURL. */
