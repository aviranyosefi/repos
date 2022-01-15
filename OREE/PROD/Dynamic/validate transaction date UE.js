    var pPeriodoldValue = nlapiGetFieldValue('postingperiod');
    var trandateoldValue = nlapiGetFieldValue('trandate');
    var vatPoldValue = nlapiGetFieldValue('custbody_ilo_header_vat_period');
    var subsidiaryoldValue = nlapiGetFieldValue('subsidiary');
    var fieldChanged = false;

    function beforesubmit(type) {
        if (type == 'edit') {
            var oldRec = nlapiGetOldRecord();
            var pPeriodoldValue = oldRec.getFieldValue('postingperiod');
            var trandateoldValue = oldRec.getFieldValue('trandate');
            if (pPeriodoldValue != nlapiGetFieldValue('postingperiod') || trandateoldValue != nlapiGetFieldValue('trandate')) {
                fieldChanged = true;
            }
            //var vatPoldValue = nlapiGetFieldValue('custbody_ilo_header_vat_period');
            //nlapiLogExecution('debug', 'old record trandate = ' + oldRec.getFieldValue('trandate'));
        }
        nlapiLogExecution('debug', 'old trandate= ' + trandateoldValue, 'new trandate= ' + nlapiGetFieldValue('trandate') );
        if (fieldChanged ||  type == 'create') {
            var subsidiary = nlapiGetFieldValue('subsidiary');
            var tranDate = nlapiGetFieldValue('trandate');
            if (tranDate != null && tranDate != '' && tranDate != undefined && subsidiary != null && subsidiary != '' && subsidiary != undefined) {
                var lastTrx = getLasttrxDate(subsidiary);
                if (lastTrx != -1) {
                    if (nlapiStringToDate(lastTrx) > nlapiStringToDate(tranDate)) {
                        throw nlapiCreateError("ERROR", 'there is already more recent transaction for this subsidiary, please pick date later then: ' + lastTrx, false);
                        //alert('there is already more recent transaction for this subsidiary, please pick date later then : ' + lastTrx);
                        //alert('old value = ' + oldValue);
                        //oldValue = GEToldValue(name);
                        //nlapiSetFieldValue(name, oldValue, false);
                        return false;
                    }
                }
            }

            //var vatPeriodName = nlapiGetFieldValue('custbody_ilo_header_vat_period');
            //if (vatPeriodName != null && vatPeriodName != '' && vatPeriodName != undefined) {
            //    vatPeriodEndDate = getVatPeriod(vatPeriodName);
            //    if (vatPeriodEndDate != -1 && nlapiStringToDate(vatPeriodEndDate) < nlapiStringToDate(tranDate)) {
            //        throw nlapiCreateError("ERROR", 'transaction should be posted to the appropriate vat period, please choose different vat period or transaction date', false);
            //        //alert('transaction should be posted to the appropriate vat period, please choose different vat period or transaction date');
            //        //oldValue = GEToldValue(name);
            //        //nlapiSetFieldValue(name, oldValue, false);
            //        return false;
            //    }
            //}

            var postingPeriod = nlapiGetFieldValue('postingperiod');

            if (postingPeriod != null && postingPeriod != '' && postingPeriod != undefined) {
                var pPeriod = nlapiLoadRecord('accountingperiod', postingPeriod);
                if (pPeriod.getFieldValue('closed') == 'T') {
                    throw nlapiCreateError("ERROR", 'accounting period is closed, transaction can be modified or create for open period only' , false);
                    //alert('accounting period is closed, transaction can be modified or create for open period only');
                    //oldValue = GEToldValue(name);
                    //nlapiSetFieldValue(name, oldValue, false);
                    return false;
                }
                else if (nlapiStringToDate(pPeriod.getFieldValue('enddate')) < nlapiStringToDate(tranDate) || nlapiStringToDate(pPeriod.getFieldValue('startdate')) > nlapiStringToDate(tranDate)) {
                    throw nlapiCreateError("ERROR", 'transaction  date should match the appropriate posting period, please choose different posting period or transaction date', false);
                    //alert('transaction should be posted to the latest open accounting period, please choose different posting period');
                    //oldValue = GEToldValue(name);
                    //nlapiSetFieldValue(name, oldValue, false);
                    return false;
                }
            }
            return true;
        }
   
    }

    function getLasttrxDate(subsidiary) {
        var transactionSearch = nlapiSearchRecord("transaction", null,
            [
                ["type", "anyof", "CustInvc", "CustCred"],
                "AND",
                ["subsidiary", "anyof", subsidiary]
            ],
            [
                new nlobjSearchColumn("trandate", null, "MAX"),
                new nlobjSearchColumn("subsidiary", null, "GROUP")
            ]
        );
        var latestTrx = transactionSearch[0].getValue('trandate', null, 'MAX')
        if (latestTrx != null && latestTrx != undefined && latestTrx != '') { return latestTrx; }
        else { return -1; }

    }

    function getVatPeriod(vatPerioName) {
        var columns = new Array();
        columns[0] = new nlobjSearchColumn('internalid');
        columns[1] = new nlobjSearchColumn('periodname');
        columns[2] = new nlobjSearchColumn('enddate');

        var filters = new Array();
        filters[0] = new nlobjSearchFilter('periodname', null, 'is', vatPerioName);

        var search = nlapiCreateSearch('taxperiod', filters, columns);

        var s = [];
        var Results = [];

        var searchid = 0;
        var resultset = search.runSearch();
        //var cols = search.getColumns();

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }

        } while (resultslice.length >= 1000);

        if (s.length > 0) { return s[0].getValue('enddate'); }
        else { return -1; }

    }


    function GEToldValue(name) {
        switch (name) {
            case 'postingperiod':
                return pPeriodoldValue;
            case 'trandate':
                return trandateoldValue;
            case 'custbody_ilo_header_vat_period':
                return vatPoldValue;
            case 'subsidiary':
                return subsidiaryoldValue;
            default:

        }
    }

    function fieldWasChanged(field) {

    var rcdOld = nlapiGetOldRecord(); 

    //var record = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId()); 

    if (rcdOld.getFieldValue(field) != record.getFieldValue(field)) { // compare field values 

        return true;

    } else {

        return false;

    }

    }