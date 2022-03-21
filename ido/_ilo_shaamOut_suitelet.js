/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Oct 2016     idor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function generate_shaam_file(request, response) {

    //Create the form and add fields to it 
    var form = nlapiCreateForm("Generate Shaam Out File");
    form.addField('subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');
    //form.addField('currency', 'select', 'Currency', 'CURRENCY');

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

        
        //var Currency = request.getParameter("currency");
        var Subsidiary = request.getParameter("subsidiary");
        var subRec = nlapiLoadRecord('subsidiary', Subsidiary, null);
        var Subsidiary_VAT_Reg_No = subRec.getFieldValue('federalidnumber'); //VAT Registration Number
        

        //create Shaam file for sending Israel Shaam Authorities
        //2. Rows = Transaction Lines: 

       //search filters - include in Shaam Report filter is between 1 or 2 (1 == "YES", 2 == "NO")
        
        var results = nlapiSearchRecord('vendor', null, [new nlobjSearchFilter('subsidiary', null, 'is', Subsidiary), new nlobjSearchFilter('custentity_ilo_include_in_shaam_report', null, 'noneof', '2')], [new nlobjSearchColumn('custentity_il_tax_payer_id'), new nlobjSearchColumn('vatregnumber'), new nlobjSearchColumn('companyname'), new nlobjSearchColumn('custentity_ilo_shaam_update')]);
        if (results != null) {
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                var vendor_number = PadLeftWithSpaces(item.id, 13);
                var vendor_payerid = PadLeftWithZero(item.getValue("custentity_il_tax_payer_id"), 9);
                var vendor_regnumber = PadLeftWithZero(item.getValue("vatregnumber"), 9);
                var vendor_legalname = PadLeftWithSpaces(item.getValue("companyname"), 34);
                          
                
                var row = '';
                row += 'B';
                    
                row += vendor_number;
                row += vendor_payerid;
                row += vendor_regnumber;
                row += vendor_legalname;
     
                strRows += row + "\r\n";
                iRows++;
            }
        }
        
        {
            //1. Opening Line: 
        	strFirst += 'A';
            strFirst += PadLeftWithZero(Subsidiary_VAT_Reg_No, 9);
            strFirst += GetTodayDate();
        }


        //3. Closing Line: X511295487
        strLast = 'Z';
        strLast += PadLeftWithZero(Subsidiary_VAT_Reg_No, 9);
        strLast += GetTodayDate();
        strLast += PadLeftWithZero(iRows, 9);
        strData = strFirst + "\r\n" + strRows + strCash + strLast + "\r\n";
        downloadData(strData, response, form);

    }
}


function GetTodayDate() {
    var now = new Date();
    var nowDate = now.getFullYear().toString() + PadLeftWithZero((now.getMonth() + 1), 2) + PadLeftWithZero((now.getDate() + 1), 2);
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


function PadLeftWithSpaces (data, maxlength) {
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
    response.setContentType('PLAINTEXT', 'SHAAM_IN.txt');
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