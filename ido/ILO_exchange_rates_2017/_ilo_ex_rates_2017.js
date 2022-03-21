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

        var er = nlapiRequestURL('http://www.boi.org.il/currency.xml', null, null);
        var xmlRes = er.getBody();
        output = nlapiStringToXML(xmlRes);
        var currencyCode = nlapiSelectValues(output, '//CURRENCYCODE');
        var exchangeRate = nlapiSelectValues(output, '//RATE');
        var lastUpdate = nlapiSelectValue(output, '//LAST_UPDATE');
        var exchangeRates = [];
        exchangeRates.push(exchangeRate);


        for (var i = 0; i < exchangeRates.length; i++) {
            var obj = {};
            for (var j = 0; j < exchangeRates[i].length; j++) {
                obj[currencyCode[j]] = exchangeRates[i][j];
            }
            obj["ILS"] = "1";
            exRates.push(obj);
        }

        var exRateArr = exRates[0];
        var exRateISO = Object.keys(exRateArr);
        effectiveDate = formatDate(lastUpdate);

        nlapiLogExecution('debug', 'exRateISO', JSON.stringify(exRateISO))
        nlapiLogExecution('debug', 'effectiveDate', effectiveDate)




        var allCurrencies = allCurrencies();
        var baseCurrencies = getBaseCurrencies();

        nlapiLogExecution('debug', 'get base and all currencies', 'true');

        var data = '';
        baseCurrencies.forEach(function (element) {
            for (var i = 0; i < allCurrencies.length; i++) {
                if (element == 'ILS') {
                    data += element + "," + allCurrencies[i] + "," + exRateArr[allCurrencies[i]] + "," + effectiveDate + "\n";
                }
                else {

                    data += element + "," + allCurrencies[i] + "," + ROTbase(exRateArr[element], exRateArr[allCurrencies[i]]).toFixed(5) + "," + effectiveDate + "\n";
                }

            }
        });

        var csv_ER_updated = "Base Currency,Source Currency,Exchange Rate,Effective Date" + "\n" + data;

        var clean = csv_ER_updated.replaceAll("undefined", "1.00000");

        var cleanNaN = clean.replaceAll("NaN", "1.00000");


        nlapiLogExecution('debug', 'created csv', cleanNaN);

        //sysExRates = current currencies in system;
        //exRateISO = most recent currencies from BOI
        //exRateArr = most recent exchange rates from BOI
        //toUpdate = currencies from the system that match currencies from BOI



        var exRateUpdated_csvfile = nlapiCreateFile("ExchangeRates_Update", "CSV", cleanNaN);
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