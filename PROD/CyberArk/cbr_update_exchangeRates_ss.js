/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Nov 2016     idor
 *
 */

/**
 * @param {nlobjRequest}
 *            request Request object
 * @param {nlobjResponse}
 *            response Response object
 * @returns {Void} Any output is written via response object
 * 
 * 
 * 
 */


function runExRateScript() {


    for (var i = 0; i < 5; ++i) {
        try {
            nlapiLogExecution('debug', 'running', 'running')
            exchangeRateUpdate();
        }

        catch (err) {

            nlapiLogExecution('debug', 'err', err);
        }
    }
}



function exchangeRateUpdate() {
    try {



        function allCurrencies() {

            var sysExRates = [];
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('symbol', null, null);
            var search = nlapiSearchRecord('currency', null, null, columns);
            for (var i = 0; i < search.length; i++) {
                sysExRates.push(search[i].getValue(columns[0]));
            }
            return sysExRates;
        }

        function getBaseCurrencies() {

            var baseCurrencies = [];

            var columns = [];

            columns[0] = new nlobjSearchColumn('symbol', null, null);
            columns[1] = new nlobjSearchColumn('internalid', null, null);
            var search = nlapiSearchRecord('currency', null, null, columns);

            //return search

            if (search != null) {

                for (var i = 0; i < search.length; i++) {

                    var rec = nlapiLoadRecord('currency', search[i].id)

                    var checkBase = rec.getFieldValue('isbasecurrency');

                    if (checkBase == 'T') {

                        baseCurrencies.push(rec.getFieldValue('symbol'))
                    }

                }

            }
            return baseCurrencies;
        }





        var output;
        var effectiveDate = '';
        var exRates = [];
        var sysExRates = [];
        var ILSline = '';
        var EURline = '';
        var USDline = '';

        var er = nlapiRequestURL('https://www.boi.org.il/currency.xml', null, null);
        var xmlRes = er.getBody();
        output = nlapiStringToXML(xmlRes);
        var currencyCode = nlapiSelectValues(output, '//CURRENCYCODE');
        var exchangeRate = nlapiSelectValues(output, '//RATE');
        var lastUpdate = nlapiSelectValue(output, '//LAST_UPDATE');
        var units = nlapiSelectValues(output, '//UNIT');
        var exchangeRates = [];
        exchangeRates.push(exchangeRate);


        for (var i = 0; i < exchangeRates.length; i++) {
            var obj = {};
            for (var j = 0; j < exchangeRates[i].length; j++) {
                //nlapiLogExecution('debug', 'unit - ' + currencyCode[j], parseFloat(units[j]))
                obj[currencyCode[j]] = parseFloat(exchangeRates[i][j]) / parseFloat(units[j]);
            }
            obj["ILS"] = "1";
            exRates.push(obj);
        }

        var exRateArr = exRates[0];
        var exRateISO = Object.keys(exRateArr);
        effectiveDate = getDateAfterCheck() //GetTodayDate();

        nlapiLogExecution('debug', 'units', JSON.stringify(units))
        nlapiLogExecution('debug', 'exRateISO', JSON.stringify(exRateISO))
        nlapiLogExecution('debug', 'effectiveDate', effectiveDate)




        var allCurrencies = allCurrencies();
        var baseCurrencies = getBaseCurrencies();

        nlapiLogExecution('audit', 'get base and all currencies', JSON.stringify(exRateArr));

        var data = '';
        baseCurrencies.forEach(function (element) {
            var line = element + "," + element + "," + 1 + "," + effectiveDate + "\n";
            data += line;
            for (var i = 0; i < allCurrencies.length; i++) {
                if (element == 'ILS') {
                    var line = element + "," + allCurrencies[i] + "," + exRateArr[allCurrencies[i]] + "," + effectiveDate + "\n";
                    //nlapiLogExecution('debug', 'line', line)
                    if (line.indexOf("1.000") > 0 || line.indexOf("undefined") > 0 || line.indexOf("NaN") > 0)
                        continue;
                    else
                        data += line;
                }
                else {
                    var line = element + "," + allCurrencies[i] + "," + ROTbase(exRateArr[element], exRateArr[allCurrencies[i]]).toFixed(5) + "," + effectiveDate + "\n";
                    //nlapiLogExecution('debug', 'line', line)
                    if (line.indexOf("1.000") > 0 || line.indexOf("undefined") > 0 || line.indexOf("NaN") > 0)
                        continue;
                    else
                        data += line;
                }
            }
        });

        var csv_ER_updated = "Base Currency,Source Currency,Exchange Rate,Effective Date" + "\n" + data;

        nlapiLogExecution('debug', 'created csv', csv_ER_updated);

        //sysExRates = current currencies in system;
        //exRateISO = most recent currencies from BOI
        //exRateArr = most recent exchange rates from BOI
        //toUpdate = currencies from the system that match currencies from BOI



        var exRateUpdated_csvfile = nlapiCreateFile("ExchangeRates_Update", "CSV", csv_ER_updated);
        exRateUpdated_csvfile.setFolder(-15);
        importCSVjob(exRateUpdated_csvfile);
        nlapiLogExecution('debug', 'import csv', 'true');


    } catch (err) {
        nlapiLogExecution('debug', 'err', err)
    }


};


function formatDate(initDate) {
    var justNumbers = initDate.replace(/[^a-zA-Z0-9 ]/g, "");
    var year = justNumbers.substr(0, 4);
    var month = justNumbers.substr(4, 2);
    var day = justNumbers.substr(6, 2);
    var reformatDate = day + '/' + month + '/' + year;
    return reformatDate;
}

//rule of three function
function ROTbase(a, b) {
    var x = b / a;
    return x;
}

function importCSVjob(primaryFile) {

    try {

        nlapiLogExecution('debug', 'importCSVjob in function', 'true');

        var job = nlapiCreateCSVImport();
        job.setMapping('custimport_exrate_mapping'); // Set the mapping

        // Set File
        job.setPrimaryFile(primaryFile.getValue()); // Fetches the content of the file and sets it.

        var res = nlapiSubmitCSVImport(job); // We are done

        nlapiLogExecution('debug', 'importCSVjob in function', 'DONE' + res);
    } catch (err) {
        nlapiLogExecution('error', 'importCSVjob = err', err);
    }
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
//"2020-05-03
function GetTodayDate() {
    var now = new Date();
    var dateformat = 'yyyy-MM-dd';
    return nlapiDateToString(now,dateformat);
}
function getDate() {
    //var date = new Date()
    //date.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })
    date =nlapiDateToString(new Date(), 'datetimetz')
    return date;
}
function getCompanyDate() {
    var currentDateTime = new Date();
    var companyTimeZone = nlapiLoadConfiguration('companyinformation').getFieldText('timezone');
    //nlapiLogExecution('debug', 'companyTimeZone', companyTimeZone)
    var timeZoneOffSet = (companyTimeZone.indexOf('(GMT)') == 0) ? 0 : new Number(companyTimeZone.substr(4, 6).replace(/\+|:00/gi, '').replace(/:30/gi, '.5'));
    //nlapiLogExecution('debug', 'timeZoneOffSet', timeZoneOffSet)
    var UTC = currentDateTime.getTime() + (currentDateTime.getTimezoneOffset() * 60000);
    //nlapiLogExecution('debug', 'UTC', UTC)
    var companyDateTime = UTC + (timeZoneOffSet * 60 * 60 * 1000);
    //nlapiLogExecution('debug', 'companyDateTime', companyDateTime)

    return nlapiDateToString(new Date(companyDateTime));
}
function getDateAfterCheck() {
    var date1 = getCompanyDate().split('/')[0]// jerusalem
    nlapiLogExecution('debug', 'date1', date1)
    var date = GetTodayDate();
    nlapiLogExecution('debug', 'date', date)
    var date2 = date.split('/')[0]
    nlapiLogExecution('debug', 'date2', date2)
    if (date1 != date2) {
        return nlapiDateToString(nlapiAddDays(nlapiStringToDate(date), 1))
    }
    return date
}