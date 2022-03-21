var nexus_country = nlapiGetFieldValue('nexus_country');
var whttaxcode = 0;
var vendorid = 0;
var dynId = null;
var rate = GetVendorWHTRate();


function GetVendorWHTRate() {
    var vendorRate = null;
    try {
        if (nexus_country == 'IL') {
            var type = nlapiGetRecordType();
            var id = nlapiGetRecordId();
            if (id == null) return;
            var billrec = nlapiLoadRecord(type, id);
            vendorid = billrec.getFieldValue('entity');
            var duedate = billrec.getFieldValue('duedate');
            var defaultratecode = nlapiLookupField('vendor', vendorid, 'custentity_4601_defaultwitaxcode');
            var defaulttaxtype;
            var defaultpercent;

            if (defaultratecode != null) {
                defaultpercent = nlapiLookupField('customrecord_4601_witaxcode', defaultratecode, 'custrecord_4601_wtc_rate');
                defaulttaxtype = nlapiLookupField('customrecord_4601_witaxcode', defaultratecode, 'custrecord_4601_wtc_witaxtype');
            }

            vendorRate = GetVendorWHT(vendorid, duedate);

            var whtCodes;
            whtCodes = nlapiSearchRecord('customrecord_4601_witaxcode', null, [new nlobjSearchFilter('custrecord_4601_wtc_witaxtype', null, 'is', defaulttaxtype)], [new nlobjSearchColumn('custrecord_4601_wtc_rate', null, null), new nlobjSearchColumn('custrecord_4601_wtc_name', null, null), new nlobjSearchColumn('internalid', null, null)]);
            for (var i = 0; i < whtCodes.length; i++) {
                var name = whtCodes[i].getValue('custrecord_4601_wtc_name');
                if (name.indexOf('דינאמי') > 0)
                    dynId = whtCodes[i].id;
            }
            if (vendorRate == null) {
                vendorRate = defaultpercent;
                whttaxcode = defaultratecode;
            }
            else
                whttaxcode = dynId;
        }
    }
    catch (ex) {
        nlapiLogExecution('error', 'GetVendorWHTRate', 'recordId: ex: ' + ex);
    }
    return vendorRate;
}

//function BeforeLoad() {
//    return;
//    vendorid = nlapiGetFieldValue('entity');
//    try {
//        if (nexus_country == 'IL') {
//            var status = nlapiGetFieldValue('status');
//            var rate = GetVendorWHTRate();
//            if (status == "Paid In Full") return;
//            nlapiLogExecution('debug', 'BeforeLoad', 'vendorid' + vendorid + 'whttaxcode:' + whttaxcode);
//            if (rate != null && dynId != null)
//                nlapiSubmitField('customrecord_4601_witaxcode', dynId, 'custrecord_4601_wtc_rate', rate); //wht dynamic
//            var date = nlapiGetFieldValue('trandate');
//            var lineItemCount = nlapiGetLineItemCount('expense');
//            nlapiSetFieldValue('custbody_4601_appliesto', 'T');
//            try {
//                if (rate != null) {
//                    rate = rate.replace('%', '');
//                    for (var line = 1; line <= lineItemCount; line++) {
//                        var totalamount = nlapiGetLineItemValue('expense', 'grossamt', line);
//                        if (rate != null) {
//                            nlapiLogExecution('debug', '*** wht code**', 'TO:2 ' + whttaxcode);
//
//                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for expense: ' + rate);
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxrate_exp', line, rate);
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxamt_exp', line, totalamount * rate / 100 * (-1));
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, whttaxcode);
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxapplies', line, 'T');
//                        }
//                    }
//
//                    lineItemCount = billrec.getLineItemCount('item');
//                    for (var line = 1; line <= lineItemCount; line++) {
//                        var totalamount = billrec.getLineItemValue('item', 'grossamt', line);
//                        //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
//                        if (rate != null) {
//                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for item: ' + rate);
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxrate', line, rate);
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxcode', line, whttaxcode);
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxapplies', line, 'T');
//                        }
//                    }
//
//                }
//            }
//            catch (e) {
//                nlapiLogExecution('error', 'UpdateBillWHT', 'recordId:' + recordId + "ex: " + e.getDetails());
//
//            }
//        }
//    }
//    catch (ex)
//    { }
//}

//function BeforeSubmit() {
//    if (rate != null && nexus_country == 'IL' && dynId != null) {
//        nlapiSubmitField('customrecord_4601_witaxcode', dynId, 'custrecord_4601_wtc_rate', rate); //wht dynamic
//    }
//}
//function BeforeSubmit() {
//    try {

//        var type = nlapiGetRecordType();
//        var id = nlapiGetRecordId();
//        vendorid = nlapiGetFieldValue('entity');

//        if (nexus_country == 'IL') {
//            var rate = GetVendorWHTRate();
//            nlapiLogExecution('debug', 'BeforeSubmit', 'vendorid' + vendorid + 'whttaxcode:' + whttaxcode);
//            var date = nlapiGetFieldValue('trandate');
//            var lineItemCount = nlapiGetLineItemCount('expense');
//            nlapiSetFieldValue('custbody_4601_appliesto', 'T');
//            try {
//                rate = rate.replace('%', '');
//                if (rate != null) {
//                    for (var line = 1; line <= lineItemCount; line++) {
//                        var totalamount = nlapiGetLineItemValue('expense', 'grossamt', line);
//                        if (rate != null) {
//                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for expense: ' + rate + ' ' + totalamount + ' ' + totalamount * rate / 100 * (-1));
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxrate_exp', line, rate);
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxamt_exp', line, totalamount * rate / 100 * (-1));
//                            nlapiSetLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, whttaxcode);
//                        }
//                    }

//                    lineItemCount = billrec.getLineItemCount('item');
//                    for (var line = 1; line <= lineItemCount; line++) {
//                        var totalamount = billrec.getLineItemValue('item', 'grossamt', line);
//                        //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
//                        if (rate != null) {
//                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for item: ' + rate);
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxrate', line, rate);
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
//                            nlapiSetLineItemValue('item', 'custcol_4601_witaxcode', line, whttaxcode);
//                        }
//                    }
//                }
//            }
//            catch (e) {
//                nlapiLogExecution('error', 'UpdateBillWHT', 'recordId:' + recordId + "ex: " + e.getDetails());

//            }
//        }
//    }
//    catch (ex)
//    { }
//}
function AfterSubmit() {
    try {

        var type = nlapiGetRecordType();
        nlapiLogExecution('debug', 'billrectype', type)
        var id = nlapiGetRecordId();
        nlapiLogExecution('debug', 'billrecid', id)
        
              nlapiLogExecution('debug', 'nlapiGetContext().subsidiary', nlapiGetContext().subsidiary)
                    nlapiLogExecution('debug', 'nlapiGetContext().environment', nlapiGetContext().environment)
                          nlapiLogExecution('debug', 'nlapiGetContext().company', nlapiGetContext().company)
        
        var billrec = nlapiLoadRecord(type, id);
        var rate = GetVendorWHTRate();
if(rate != null) {
	   rate = rate.replace('%', '');
}
if(rate != null) {
	   rate = rate.replace('%', '');
}
     
        
        if (nexus_country == 'IL') {
            nlapiLogExecution('debug', 'UpdateBillWHT', 'AfterSubmit:' + rate + ' dynId:' + dynId);
            var vendorid = billrec.getFieldValue('entity');
            var date = billrec.getFieldValue('trandate');
            var lineItemCount = billrec.getLineItemCount('expense');
            try {
              nlapiLogExecution('debug', 'check dynId', dynId)
                if (rate != null && dynId != null) {
                 //   nlapiSubmitField('customrecord_4601_witaxcode', dynId, 'custrecord_4601_wtc_rate', rate); //wht dynamic
                    for (var line = 1; line <= lineItemCount; line++) {
                        var totalamount = billrec.getLineItemValue('expense', 'grossamt', line);
                        //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
                        nlapiLogExecution('debug', 'aftersubmit', 'vendorid' + vendorid + 'whttaxcode:' + whttaxcode);
                        if (rate != null) {
                            nlapiLogExecution('debug', '*** wht code**', 'TO:3 ' + whttaxcode);
                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for expense: ' + rate);
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxapplies', line, 'T');
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxrate_exp', line, rate);
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxamt_exp', line, totalamount * rate / 100 * (-1));
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, '2');
                                 nlapiLogExecution('debug', 'updating custcol_4601_witaxcode_exp', 'updating')
                          
                            //billrec.setLineItemValue('expense', 'custcol_4601_witaxcode', line, whttaxcode);                           
                            //billrec.setLineItemValue('expense', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
                           // billrec.setFieldValue('custbody_4601_appliesto', 'T');
                            //billrec.setFieldValue('custbody_4601_entitydefaultwitaxcode', '2');
                        }

                    }
                

                    lineItemCount = billrec.getLineItemCount('item');
                    for (var line = 1; line <= lineItemCount; line++) {
                        var totalamount = billrec.getLineItemValue('item', 'grossamt', line);
                        //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
                        if (rate != null) {
                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for item: ' + rate);
                            billrec.setLineItemValue('item', 'custcol_4601_witaxrate', line, rate);
                            billrec.setLineItemValue('item', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
                            billrec.setLineItemValue('item', 'custcol_4601_witaxcode', line, whttaxcode);
                            billrec.setFieldValue('custbody_4601_appliesto', 'T');
                            billrec.setFieldText('custbody_4601_entitydefaultwitaxcode', 'WHT דינאמי');
                            billrec.setLineItemValue('item', 'custcol_4601_witaxapplies', line, 'T');
                        }
                    }
                }
                else {
                    var defaultvendortax = nlapiLookupField('vendor', vendorid, 'custentity_4601_defaultwitaxcode');
                    //billrec.setFieldValue('custbody_4601_entitydefaultwitaxcode', defaultvendortax);
                    rate = nlapiLookupField('customrecord_4601_witaxcode', defaultvendortax, 'custrecord_4601_wtc_rate'); //wht dynamic
                    rate = rate.replace('%', '');

                    lineItemCount = billrec.getLineItemCount('item');
                    for (var line = 1; line <= lineItemCount; line++) {
                        if (rate != null) {
                            var totalamount = billrec.getLineItemValue('item', 'grossamt', line);
                            billrec.setLineItemValue('item', 'custcol_4601_witaxrate', line, rate);
                            billrec.setLineItemValue('item', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
                            billrec.setLineItemValue('item', 'custcol_4601_witaxcode', line, defaultvendortax);
                            billrec.setFieldValue('custbody_4601_appliesto', 'T');
                            billrec.setLineItemValue('item', 'custcol_4601_witaxapplies', line, 'T');
                        }
                    }

                    for (var line = 1; line <= lineItemCount; line++) {
                        var totalamount = billrec.getLineItemValue('expense', 'grossamt', line);
                        //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
                        if (rate != null) {
                            nlapiLogExecution('debug', '*** wht code**', 'TO:1 ' + defaultvendortax);
                            nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for expense: ' + rate);
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxrate_exp', line, rate);
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxamt_exp', line, totalamount * 40 / 100 * (-1));
                            //billrec.setLineItemValue('expense', 'custcol_4601_witaxcode', line, defaultvendortax);
                           billrec.setLineItemValue('expense', 'custcol_4601_witaxapplies', line, 'T');
                            billrec.setLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, '2');
                          nlapiLogExecution('debug', 'updating custcol_4601_witaxcode_exp', 'updating')
                            //billrec.setLineItemValue('expense', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
//billrec.setLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, '2')
                        }

                    }
                }

            }
            catch (e) {
                nlapiLogExecution('error', 'UpdateBillWHT', 'recordId:' + recordId + "ex: " + e.getDetails());

            }
            nlapiSubmitRecord(billrec);
        //    billrec = nlapiLoadRecord(type, id, { recordmode: 'dynamic' });
         //   nlapiSubmitRecord(billrec);

        }
    }
    catch (ex)
    {
    	nlapiLogExecution('debug', 'ex', ex)
    }

}


//function AfterSubmit() {
//    try {

//        var type = nlapiGetRecordType();
//        var id = nlapiGetRecordId();
//        var billrec = nlapiLoadRecord(type, id);
//        vendorid = billrec.getFieldValue('entity');

//        if (nexus_country == 'IL') {
//            var rate = GetVendorWHTRate();
//            nlapiLogExecution('debug', 'AfterSubmit', 'vendorid' + vendorid + 'whttaxcode:' + whttaxcode);
//            var date = billrec.getFieldValue('trandate');
//            var lineItemCount = 0;
//            try {
//                lineItemCount = billrec.getLineItemCount('item');
//                for (var line = 1; line <= lineItemCount; line++) {
//                    var totalamount = billrec.getLineItemValue('item', 'grossamt', line);
//                    //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
//                    rate = rate.replace('%', '');
//                    if (rate != null) {
//                        nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for item: ' + rate + " total: " +  " tax: " + (totalamount * rate / 100 * (-1)));
//                        billrec.setLineItemValue('item', 'custcol_4601_witaxrate', line, rate);
//                        billrec.setLineItemValue('item', 'custcol_4601_witaxamount', line, totalamount * rate / 100 * (-1));
//                        billrec.setLineItemValue('item', 'custcol_4601_witaxcode', line, whttaxcode);
//                    }
//                }
//            }
//            catch (e) {
//                nlapiLogExecution('error', 'UpdateBillWHT', 'recordId:' + recordId + "ex: " + e.getDetails());
//            }
//            try {
//                lineItemCount = billrec.getLineItemCount('expense');
//                for (var line = 1; line <= lineItemCount; line++) {
//                    var totalamount = billrec.getLineItemValue('expense', 'grossamt', line);
//                    //var groupid = billrec.getLineItemValue('expense', 'custcol_4601_witaxcode_exp', line);
//                    rate = rate.replace('%', '');
//                    if (rate != null) {
//                        nlapiLogExecution('debug', 'UpdateBillWHT', 'update rate for expense: ' + rate + " total: " + " tax: " + (totalamount * rate / 100 * (-1)));
//                        billrec.setLineItemValue('expense', 'custcol_4601_witaxrate_exp', line, rate);
//                        billrec.setLineItemValue('expense', 'custcol_4601_witaxamt_exp', line, totalamount * rate / 100 * (-1));
//                        billrec.setLineItemValue('expense', 'custcol_4601_witaxcode_exp', line, whttaxcode);
//                    }
//                }
//            }
//            catch (e) {
//                nlapiLogExecution('error', 'UpdateBillWHT', 'recordId:' + recordId + "ex: " + e.getDetails());
//            }

//            nlapiSubmitRecord(billrec);
//            //nlapiSubmitRecord(nlapiLoadRecord(type,id ,{ recordmode: 'dynamic' }), { disabletriggers: false, enablesourcing: true });


//        }
//    }
//    catch (ex)
//    { }
//}

function getColVal(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getValue(columns[i]);
    }

    return value;
}

function GetVendorWHT(vendorid, date) {
    //nlapiLogExecution('debug', 'GetVendorWHT', 'start:' + vendorid);
    var result = null;
    var search = nlapiLoadSearch(null, 'customsearch_il_vendor_certificate');
    search.addFilter(new nlobjSearchFilter('custrecord_vendor_cert_vendorid', null, 'is', vendorid));
    //search.addFilter(new nlobjSearchFilter('custrecord_vendor_cert_groupid', null, 'is', groupid));
    var resultSet = search.runSearch();

    resultSet.forEachResult(
            function (item) {
                var searchColumns = resultSet.getColumns();
                var startate = getColVal(searchColumns, item, "custrecord_vendor_cert_fromdate");
                var enddate = getColVal(searchColumns, item, "custrecord_vendor_cert_enddate");
                var percent = getColVal(searchColumns, item, "custrecord_vendor_cert_percent");
                var now = GetTodayDate();
                //nlapiLogExecution('debug', 'GetVendorWHT', 'now:' + now + ' startate:' + convertDate(startate));
                if (convertDate(enddate) >= convertDate(date) && convertDate(startate) <= convertDate(date))
                    result = percent.replace('%', '');
                return true;
            });
    //nlapiLogExecution('debug', 'GetVendorWHT', 'result:' + result);
    return result;
}


function convertDate(odate) { // Convert to vat date format - from 28/4/2016 to YYYYMMDD
    if (odate == undefined)
        return '';
    var dateformat = 'dd/MM/yyyy';
    var ISMMDD;
    var dateMMDD = '3/31/17';
    var check = nlapiStringToDate(dateMMDD);
    whatFormat = isNaN(check);
    if (ISMMDD)
        dateformat = 'MM/dd/yyyy';

    var newDate = '';
    var arr = odate.split("/");
    var day = arr[0];
    var month = arr[1];

    if (dateformat.toLowerCase() == "mm/dd/yyyy") {
        day = arr[1];
        month = arr[0];
    }
    newDate = new Date(arr[2], month - 1, day);
    //  nlapiLogExecution('debug', 'convertDate' + odate, 'dateformat:' + dateformat + ' ' + newDate);
    return newDate;
}


function GetTodayDate() {
    var now = new Date();
    now.setTime(now.getTime() + (10 * 60 * 60 * 1000));
    var nowDate = new Date(now.getFullYear().toString(), PadLeftWithZero((now.getMonth()), 2), PadLeftWithZero((now.getDate()), 2));
    return nowDate;
}

function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    if (maxlength < res.length)
        return res.substring(0, maxlength);
    return res;
}
