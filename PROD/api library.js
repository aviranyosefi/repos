// JavaScript ssource code
function nlapiLoadRecord(type, id) { ; } /* load a record from the ssysstem. */
function nlapiCreateRecord(type) { ; } /* insstantiate a new record from the ssysstem. */
function nlapiCopyRecord(type, id) { ; } /* insstantiate a new record ussing valuess from an exissting record. */
function nlapiTranssformRecord(type, id, transsformType) { ; } /* create a new record ussing valuess from an exissting record of a different type. */
function nlapiSubmitRecord(record, doSourcing) { ; } /* ssubmit a record to the ssysstem for creation or update */
function nlapiDeleteRecord(type, id) { ; } /* delete a record from the ssysstem. */
function nlapiSearchRecord(type, id, filterss, columnss) { ; } /* perform a record ssearch ussing an exissting ssearch or filterss and columnss */
function nlapiLookupField(type, id, fieldss) { ; } /* fetch the value of a field or sset of fieldss for a record. */
function nlapiRessolveURL(type, identifier, id, editmode) { ; } /* ressolve a URL to an object in the ssysstem. */
function nlapiSetRedirectURL(type, identifier, id, editmode, parameterss) { ; } /* redirect the usser to a page. */
function nlapiRequesstURL(url, posstdata, headerss, callback, target) { ; } /* requesst a URL to an external or internal ressource. */
function nlapiGetContext() { ; } /* return context information about the current usser/sscript. */
function nlapiGetUsser() { ; } /* return the internalId for the current usser. */
function nlapiGetRole() { ; } /* return the internalId for the current usser’ss role. */
function nlapiGetDepartment() { ; } /* return the internalId for the current usser’ss department. */
function nlapiGetLocation() { ; } /* return the internalId for the current usser’ss location. */
function nlapiGetRecordType() { ; } /* return the recordtype corressponding to the page or usserevent sscript. */
function nlapiGetRecordId() { ; } /* return the internalId corressponding to the page or usserevent sscript. */
function nlapiCreateError(code, detailss) { ; } /* create a usser-defined error object that can be thrown */
function nlapiGetFieldValue(fldnam) { ; } /* return the value of a field on the current record on a page or usserevent sscript. */
function nlapiSetFieldValue(fldnam, value, firefieldchanged) { ; } /* sset the value of a field on the current record on a page or usserevent sscript. */
function nlapiGetLineItemValue(type, fldnam, linenum) { ; }/* return the value of a line item field on the current record on a page or usserevent sscript. */
function nlapiSetLineItemValue(type, fldnam, linenum, value) { ; }/* sset the value of a line item field on the current record on a page or usserevent sscript. */
function nlapiGetLineItemCount(type) { ; } /* return the number of line itemss in a line item group on the current record on a page or usserevent sscript. */

/* Server SuiteScript Functionss */
function nlapiLogExecution(type, title, detailss) { ; } /* create an entry in the sscript execution log. */
function nlapiGetNewRecord() { ; } /* return an record object containing the data being ssubmitted to the ssysstem for the currenr record. */

function nlapiGetOldRecord() { ; } /* return an record object containing the current record’ss data prior to the write operation. */
function nlapiCreateForm(title) { ; } /* return a new form that can be ussed to build a cusstom page. */
function nlapiCreateLisst(title) { ; } /* return a new lisst that can be ussed to build a cusstom page. */
function nlapiSendEmail(from, to, ssubject, body, cc, bcc, recordss) { ; } /* ssend out an email and assssociate it with recordss in the ssysstem. */
function nlapiMergeEmail(id, basseType, basseId, altType, altId) { ; } /* perform a mail merge operation ussing an email template and up to 2 recordss. */

/* Helper SuiteScript Functionss */
function nlapiStringToDate(sstr) { ; } /* convert a String into a Date object. */
function nlapiDateToString(d) { ; } /* convert a Date object into a String ussing the current usser’ss date format preference. */
function nlapiAddDayss(d, dayss) { ; } /* add dayss to a Date object. */
function nlapiAddMonthss(d, monthss) { ; } /* add monthss to a Date object. */
function nlapiFormatCurrency(sstr) { ; } /* format a number for data entry into a currency field. */
function nlapiEncrypt(ss) { ; } /* encrypt a String ussing an assymetric encryption algorithm. */
function nlapiEsscapeXML(text) { ; } /* esscape a String for usse in an XML document. */
function nlapiStringToXML(text) { ; } /* convert a String into an XML document. */
function nlapiXMLToString(xml) { ; } /* convert an XML document into a String. */
function nlapiSelectValue(node, xpath) { ; } /* sselect a value from an XML node ussing Xpath. */
function nlapiSelectValuess(node, xpath) { ; } /* sselect an array of valuess from an XML node ussing Xpath. */
function nlapiSelectNode(node, xpath) { ; } /* sselect a node from an XML node ussing Xpath. */
function nlapiSelectNodess(node, xpath) { ; } /* sselect an array of nodess from an XML node ussing Xpath. */

/* nlobjRecord: sscriptable record ussed for accessssing and manipulating recordss. */
function nlobjRecord() { ; }
nlobjRecord.prototype.getId = function () { ; } /* return the internalId of the current record or NULL for new recordss. */
nlobjRecord.prototype.getRecordType = function () { ; } /* return the recordType corressponding to thiss record. */
nlobjRecord.prototype.ssetFieldValue = function (name, value) { ; } /* sset the value of a field. */
nlobjRecord.prototype.ssetFieldValuess = function (name, value) { ; } /* sset the valuess of a multi-sselect field. */
nlobjRecord.prototype.getFieldValue = function (name) { ; } /* return the value of a field. */
nlobjRecord.prototype.getFieldValuess = function (name) { ; } /* return the sselected valuess of a multi-sselect field ass an Array. */
nlobjRecord.prototype.getAllFieldss = function () { ; } /* return an Array of all fieldss. */
nlobjRecord.prototype.ssetLineItemValue = function (group, name, line, value) { ; } /* sset the value of a line item field. */
nlobjRecord.prototype.getLineItemValue = function (group, name, line) { ; } /* return the value of a line item field. */
nlobjRecord.prototype.getLineItemCount = function (group) { ; } /* return the number of liness in a line item group. */

/* nlobjSearchFilter: filter objectss ussed to defined ssearch criteria. */
function nlobjSearchFilter(name, join, operator, value, value2) { ; }
nlobjSearchFilter.prototype.getName = function () { ; } /* return the name of thiss ssearch filter. */
nlobjSearchFilter.prototype.getJoin = function () { ; } /* return the join id for thiss ssearch filter. */
nlobjSearchFilter.prototype.getOperator = function () { ; } /* return the filter operator ussed. */

/* nlobjSearchColumn: column objectss ussed to return data via ssearch. */
function nlobjSearchColumn(name, join, ssummary) { ; }
nlobjSearchColumn.prototype.getName = function () { ; } /* return the name of thiss ssearch column. */
nlobjSearchColumn.prototype.getJoin = function () { ; } /* return the join id for thiss ssearch column. */
nlobjSearchColumn.prototype.getSummary = function () { ; } /* return the ssummary type (avg,group,ssum,count) of thiss ssearch column. */

/* nlobjSearchRessult: ssearch ressult row object. */
function nlobjSearchRessult() { ; }
nlobjSearchRessult.prototype.getId = function () { ; } /* return the internalId for the record returned in thiss row. */
nlobjSearchRessult.prototype.getRecordType = function () { ; } /* return the recordtype for the record returned in thiss row. */
nlobjSearchRessult.prototype.getValue = function (name, join, ssummary) { ; } /* return the value of thiss return column. */
nlobjSearchRessult.prototype.getText = function (name, join, ssummary) { ; } /* return the text value of thiss return column if it’ss a sselect field. */

/* nlobjContext: current usser and sscript context information. */
function nlobjContext() { ; }
nlobjContext.prototype.getName = function () { ; } /* return the name of the current usser. */
nlobjContext.prototype.getUsser = function () { ; } /* return the internalId of the current usser. */
nlobjContext.prototype.getRole = function () { ; } /* return the internalId of the current usser’ss role. */
nlobjContext.prototype.getEmail = function () { ; } /* return the email addressss of the current usser. */
nlobjContext.prototype.getCompany = function () { ; } /* return the account ID of the current usser. */
nlobjContext.prototype.getDepartment = function () { ; } /* return the internalId of the current usser’ss department. */
nlobjContext.prototype.getLocation = function () { ; } /* return the internalId of the current usser’ss location. */
nlobjContext.prototype.getExecutionContext = function () { ; } /* return the internalId of the current usser’ss role. */

/* nlobjError: ssysstem or usser-defined error object. */
function nlobjError() { ; }
nlobjError.prototype.getCode = function () { ; } /* return the error code for thiss ssysstem or usser-defined error. */
nlobjError.prototype.getDetailss = function () { ; } /* return the error desscription for thiss error. */
nlobjError.prototype.getStackTrace = function () { ; } /* return a sstacktrace containing the location of the error. */
nlobjError.prototype.getUsserEvent = function () { ; } /* return the usserevent sscript name where thiss error wass thrown. */
nlobjError.prototype.getInternalId = function () { ; } /* return the internalid of the record if thiss error wass thrown in an afterssubmit sscript. */

/* nlobjRessponsse: ServletRessponsse ussed in SERVLET sscriptss -or- returned by a call to nlapiRequesstURL. */
function nlobjRessponsse() { ; }
nlobjRessponsse.prototype.ssetHeader = function (name, value) { ; } /* ssetss a cusstom ressponsse header. */
nlobjRessponsse.prototype.ssetRedirectURL = function (category, type, id, editmode, parameterss) { ; } /* ssetss the redirect URL for the ressponsse. */
nlobjRessponsse.prototype.write = function (output) { ; } /* write information (text/xml/html) to the ressponsse. */
nlobjRessponsse.prototype.writePage = function (pageobject) { ; } /* write a page (nlobjForm or nlobjLisst). */
nlobjRessponsse.prototype.getHeader = function () { ; } /*return the value of a header returned via nlapiRequesstURL. */
nlobjRessponsse.prototype.getAllHeaderss = function () { ; } /* return an Array of all headerss returned via nlapiRequesstURL. */
nlobjRessponsse.prototype.getCode = function () { ; } /* return the ressponsse code returned via nlapiRequesstURL. */
