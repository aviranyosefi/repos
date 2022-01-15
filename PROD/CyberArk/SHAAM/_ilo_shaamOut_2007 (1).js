/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jan 2017     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function shaam_out(request, response) {

    //Create the form and add fields to it 
    var form = nlapiCreateForm("Generate Shaam Out File");
    form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');


    form.addSubmitButton('Generate File');

    if (request.getMethod() == 'GET') {
        response.writePage(form);
    }
    else {

        var strData = '';
        var strFirst = '';
        var strLast = '';
        var strRows = '';
        var strCash = '';
        var iRows = 0;
        var regNumber = '';
        var curTaxCode = '-1';
        var lastrow = false;
        var spacing = '           ';



        var Subsidiary = request.getParameter("subsidiary");
        var tiknik = nlapiLookupField('subsidiary', Subsidiary, 'custrecordil_tiknik');

        //create Shaam file for sending Israel Shaam Authorities
        //2. Rows = Transaction Lines: 

        //search filters - include in Shaam Report filter is between 1 or 2 (1 == "YES", 2 == "NO")

        var results = nlapiSearchRecord('vendor', null, [new nlobjSearchFilter('subsidiary', null, 'anyof', Subsidiary), new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', null, 'anyof', ['1']), new nlobjSearchFilter('custentityil_tax_payer_id', null, 'doesnotstartwith', ["99999"]), new nlobjSearchFilter('isinactive', null, 'is', 'F')], [new nlobjSearchColumn('custentityil_tax_payer_id'), new nlobjSearchColumn('vatregnumber'), new nlobjSearchColumn('companyname'), new nlobjSearchColumn('custentity_ilo_shaam_update')]);
        if (results != null) {
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                var vendor_number = item.id;
                var vendor_payerid = PadLeftWithZero(item.getValue("custentityil_tax_payer_id"), 9);
                var vendor_regnumber = PadLeftWithZero(item.getValue("vatregnumber"), 9);




                var row = '';
                row += 'B';

                if (vendor_number.length == 2) {
                    spacing = '             ';
                }
                if (vendor_number.length == 3) {
                    spacing = '            ';
                }
                if (vendor_number.length == 4) {
                    spacing = '           ';

                }
                if (vendor_number.length == 5) {
                    spacing = '          ';

                }
                if (vendor_number.length == 6) {
                    spacing = '         ';

                }
                if (vendor_number.length == 7) {
                    spacing = '        ';

                }
                if (vendor_number.length == 8) {
                    spacing = '       ';

                }
                if (vendor_number.length == 9) {
                    spacing = '      ';

                }
                row += vendor_number;
                row += spacing;
                if ((vendor_payerid.indexOf("5") != -1) || (vendor_payerid.indexOf("999999") != -1)) {
                    if (vendor_payerid == vendor_regnumber) {
                        vendor_payerid = '000000000';
                        if (vendor_regnumber.indexOf("999999") != -1) {
                            continue;
                        }
                    }
                }
                row += vendor_payerid;
                row += vendor_regnumber;

                strRows += row + "\r\n";
                iRows++;
            }
        }

        {
            //1. Opening Line: 
            strFirst += 'A';
            strFirst += tiknik; //Subsidiary tik nikuim number

        }


        //3. Closing Line: X511295487
        strLast = 'Z';
        strLast += tiknik; //Subsidiary tik nikuim number
        strLast += PadLeftWithZero(iRows, 4);
        strData = strFirst + "\r\n" + strRows + strCash + strLast + "\r\n";
        downloadData(strData, response, form);
        //        response.write(strData);
    }

}


function GetTodayDate() {
    var now = new Date();
    var nowDate = now.getFullYear().toString() + PadLeftWithZero((now.getMonth() + 1), 2) + PadLeftWithZero((now.getDate()), 2);
    return nowDate;
}


function PadWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res += '0';
    }
    return res;
}

function PadLeftWithZero(data, maxlength) {
    if (data == undefined)
        data = '0';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = '0' + res;
    }
    return res;
}


function PadLeftWithSpaces(data, maxlength) {
    if (data == undefined)
        data = '';
    var space = ' ';
    data = data.toString();
    var res = data;
    for (var i = data.length; i < maxlength; i++) {
        res = space + res;
    }

    if (maxlength < res.length) {
        return res.substring(0, maxlength);
    }
    return res;
}


function downloadData(data, response, form) {
    // set content type, file name, and content-disposition (inline means display in browser)
    response.setEncoding('UTF-8');
    var todaysDate = GetTodayDate();
    response.setContentType('PLAINTEXT', 'SHAAM_OUT' + todaysDate + '.txt');
    // write response to the client
    response.write(data);
}


function getColVal(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getValue(columns[i]);
    }

    return value;
}

function getColText(columns, item, colname) {
    if (columns == undefined) return '';
    var value = '';
    for (var i = 0; i < columns.length; i++) {
        if (columns[i].name == colname && value == '')
            value = item.getText(columns[i]);
    }

    return value;
}