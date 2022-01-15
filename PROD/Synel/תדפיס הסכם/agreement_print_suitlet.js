function suitelet_print(request, response) {
    if (request.getMethod() == 'GET') {
        var Recid = request.getParameter('Recid');
        var mail = request.getParameter('email');
        nlapiLogExecution('debug', Recid, mail);
        var record = nlapiLoadRecord('customrecord_agreement', Recid);
        var agr_status = record.getFieldValue('custrecord_agr_status')
        var name = record.getFieldValue('name')
        var price = record.getFieldValue('')
        var groupcheck = record.getFieldValue('custrecord_agr_group_line_agr')
        var groupline = 'F'
        if (groupcheck == 'T') {
            groupline = 'T'
        }
        var type = null;
        if (agr_status == 3) {
            type = 'next';
        }

        printTemplate(response, record, Recid, name, type, price, mail, groupline);
    }
}

function printTemplate(response, record, Recid, name, type, price, mail, groupline) {
    nlapiLogExecution('debug', 'printTemplate type ', type);

    var context = nlapiGetContext()
    var user = context.user;
    var employeeRec = nlapiLoadRecord('employee', user);
    var phone = employeeRec.getFieldValue('officephone')
    if (isNullOrEmpty(phone)) { phone = ''; }
    var customer = record.getFieldValue('custrecord_agr_bill_cust')
    var entityRec = nlapiLoadRecord('customer', customer);
    //var defaultaddress = BuildAddress(entityRec)
    var defaultaddress = entityRec.getFieldValue('defaultaddress')
    //defaultaddress = defaultaddress.replace(/\n/ig , '')
    if (isNullOrEmpty(defaultaddress)) { defaultaddress = ''; }
    else { defaultaddress.replace(entityRec.getFieldValue('companyname'), '') }
    var searchTable = SearchTable(Recid, type, record, groupline);
    var print_address = defaultaddress.replaceAll()
    var siteid = record.getFieldValue('custrecord_agr_main_site');
    if (isNullOrEmpty(siteid)) { }
    else {
        var site = nlapiLoadRecord('customrecord_site', siteid);
        var print_address = siteAddress(site)
        nlapiLogExecution('Debug', 'SiteAdd', siteAddress(site))
    }

    //nlapiLogExecution('debug', 'printTemplate searchTable ', searchTable);

    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(14861);   // sendbox
    var template = nlapiLoadFile(4087);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);

    var xml = renderer.renderToString();

    xml = xml.replace('/custrecord_agr_current_user.entityid/', context.name)
    xml = xml.replace('/custrecord_agr_current_user.phone/', phone)
    xml = xml.replace('/custrecord_agr_current_user.email/', context.email)
    xml = xml.replace('/custrecord_agr_current_user.entityid/', context.name)
    xml = xml.replace('/custrecord_agr_current_user.phone/', phone)
    xml = xml.replace('/custrecord_agr_current_user.email/', context.email)
    xml = xml.replace('/customerAddress/', print_address)
    xml = xml.replace('/customerAddress/', print_address)
    xml = xml.replace('/customerAddress/', print_address)
    xml = xml.replace('/searchTable/', searchTable)
    xml = xml.replace('/price/', price)
    var pdf = nlapiXMLToPDF(xml);
    if (mail != -1 && mail != '') {
        form = nlapiCreateForm('')
        nlapiSendEmail(context.user, mail, 'Agreement Report', 'Agreement Report from Netsuite system.', null, null, null, pdf);
        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
        var html = "<script>showAlertBox('alert_No_relevant', 'Email Successfully Send To: " + mail + "', '', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
        htmlfield.setDefaultValue(html);
        response.writePage(form);
    }
    response.setContentType('PDF', 'itemlabel.pdf', 'inline');
    response.write(pdf.getValue());

}

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
String.prototype.replaceAll = function () {
    var target = this;
    var num = target.split(/\n/ig);
    if (num.length == 0) { return target; }
    var res = '';
    for (var i = 0; i < num.length; i++) {
        if (num[i] == 'Israel') { res += '' + '<br />'; }
        else if (!isNullOrEmpty(num[i])) { res += num[i] + '<br />'; }
    }
    return res;
}
function SearchTable(id, type, record, groupline) {
    if (type != 'next') {
        var total = record.getFieldValue('custrecord_agr_sum');
        var discount = record.getFieldValue('custrecord_agr_disc_amt');
        var net_amt = record.getFieldValue('custrecord_agr_net_amt')
    }
    else { // next
        var total = record.getFieldValue('custrecord_next_agreement_amount');
        var discount = record.getFieldValue('custrecord_agr_new_disc_amount');
        var net_amt = record.getFieldValue('custrecord_agr_new_agreed_amt')
    }
    var table = '';
    var list = getSerach(id, type, groupline);
    nlapiLogExecution('debug', 'list ' + list.length, JSON.stringify(list));
    //nlapiLogExecution('debug', 'groupline', groupline);
    if (groupline == 'T') {
        if (list.length > 0) {
            table = '<table class="pl" align="right" style="text-align:right; direction:rtl;width:650px;">' +
                '<thead><tr><td colspan="2" align="right">תיאור</td>' +
                '<td align="right">ישוב</td><td align="right">כמות</td><td align="right">מחיר ליחידה</td><td align="right">חודשי חיוב</td><td align="right">סכום</td></tr></thead> ';
            for (var i = 0; i < list.length; i++) {
                table += '<tr><td colspan="2" align="right"><p dir="rtl" style="width:100%;text-align:right;">' + list[i].des + '</p></td>';
                table += '<td align="right">' + list[i].city + '</td>';
                table += '<td align="right">' + list[i].print + '</td>';
                table += '<td align="right">' + Number(list[i].rate).toFixed(1) + '</td>';
                table += '<td align="right">' + list[i].war + '</td>';
                table += '<td align="right">' + Number(list[i].amt).toFixed(1) + '</td>';
                table += '</tr>';
            }
            table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right">סה"כ ללא מע"מ</td><td align="right">' + total + '</td></tr>'
            if (discount > 0) {
                table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right">הנחה</td><td align="right">' + discount + '</td></tr>'
                table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right"><p style="font-size: 12pt; text-align:right;" dir="rtl">סה"כ אחרי הנחה</p></td><td align="right">' + net_amt + '</td></tr>'
            }
        }
        table += '</table>'


    }
    else {
        if (list.length > 0) {
            table = '<table class="pl" align="right" style="text-align:right; direction:rtl;width:650px;">' +
                '<thead><tr><td colspan="2" align="right">תיאור</td>' +
                '<td align="right">ישוב</td><td align="right">הערות</td><td align="right">מחיר ליחידה</td><td align="right">חודשי חיוב</td><td align="right">סכום</td></tr></thead> ';
            for (var i = 0; i < list.length; i++) {
                table += '<tr><td colspan="2" align="right"><p dir="rtl" style="width:100%;text-align:right;">' + list[i].des + '</p></td>';
                table += '<td align="right">' + list[i].city + '</td>';
                table += '<td align="right">' + list[i].print + '</td>';
                table += '<td align="right">' + Number(list[i].rate).toFixed(1) + '</td>';
                table += '<td align="right">' + list[i].war + '</td>';
                table += '<td align="right">' + Number(list[i].amt).toFixed(1) + '</td>';
                table += '</tr>';
            }
            table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right">סה"כ ללא מע"מ</td><td align="right">' + total + '</td></tr>'
            if (discount > 0) {
                table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right">הנחה</td><td align="right">' + discount + '</td></tr>'
                table += '<tr><td style="border:0px" colspan="4"></td><td colspan="2" align="right"><p style="font-size: 12pt; text-align:right;" dir="rtl">סה"כ אחרי הנחה</p></td><td align="right">' + net_amt + '</td></tr>'
            }
        }
        table += '</table>'
    }
    return table;
}
function getSerach(id, type, groupline) {
    nlapiLogExecution('debug', 'getSerach type', type);
    //nlapiLogExecution('debug', 'id', id);

    if (type == 'next') {
        if (groupline == 'T') {
            var search = nlapiLoadSearch(null, 'customsearch_agr_print_next_agr_group');
            search.addFilter(new nlobjSearchFilter('custrecord_agr_line_new_agr‏', null, 'anyof', id));
            var cols = search.getColumns();
        }
        else {
            var search = nlapiLoadSearch(null, 'customsearch_agr_print_next_agr');
            search.addFilter(new nlobjSearchFilter('custrecord_agr_line_new_agr‏', null, 'anyof', id));
            var cols = search.getColumns();
        }
    }
    else {
        var search = nlapiLoadSearch(null, 'customsearch_agr_print');
        search.addFilter(new nlobjSearchFilter('custrecord_agr_line_agreement', null, 'anyof', id));
    }

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            if (type == 'next') {
                if (groupline == 'T') {
                    des = s[i].getValue("salesdescription", "CUSTRECORD_AGR_LINE_ITEM", 'GROUP');
                    city = s[i].getValue("custrecord_site_city", "CUSTRECORD_AGR_SITE", 'GROUP');
                    rate = s[i].getValue('custrecord_agr_line_renewal_amount', null, 'GROUP');
                    war = s[i].getValue('custrecord_agr_line_new_exclude_month_w', null, 'GROUP');
                    amt = s[i].getValue('custrecord_agr_line_new_agr_amount', null, 'SUM');
                    print = s[i].getValue('internalid', null, 'COUNT')
                }
                else {
                    des = s[i].getValue("salesdescription", "CUSTRECORD_AGR_LINE_ITEM", null);
                    city = s[i].getValue("custrecord_site_city", "CUSTRECORD_AGR_SITE", null);
                    rate = s[i].getValue('custrecord_agr_line_renewal_amount');
                    war = s[i].getValue('custrecord_agr_line_new_exclude_month_w');
                    amt = s[i].getValue('custrecord_agr_line_new_agr_amount');
                    print = s[i].getValue('custrecord_agr_line_print_comments')
                }
            }
            else {
                des = s[i].getValue("salesdescription", "CUSTRECORD_AGR_LINE_ITEM", null);
                city = s[i].getValue("custrecord_site_city", "CUSTRECORD_AGR_SITE", null);
                rate = s[i].getValue("custrecord_agr_line_bsc_rate")
                amt = s[i].getValue("custrecord_agr_line_gross_amount");
                war = s[i].getValue("custrecord_agr_line_warranty_month")
                print = s[i].getValue('custrecord_agr_line_print_comments')
            }

            results.push({
                des: des.replace('&', '&amp;'),
                city: city,
                rate: rate,
                war: war,
                amt: amt,
                print: print
            });
        }
    }
    return results;
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return ''


}
//function BuildAddress(entityRec) {
//    var address = '';
//    var addr1 = entityRec.getFieldValue('addr1')
//    var addr2 = entityRec.getFieldValue('addr2')
//    var city = entityRec.getFieldValue('city')
//    var zip = entityRec.getFieldValue('zip')
//    var country = entityRec.getFieldValue('country')
//    if (!isNullOrEmpty(addr1)) { address += addr1 + '<br>' }
//    if (!isNullOrEmpty(addr2)) { address += addr2 + '<br>' }
//    if (!isNullOrEmpty(city)) { address += city + '<br>' }
//    if (!isNullOrEmpty(zip)) { address += zip + '<br>' }
//    if (!isNullOrEmpty(country)) { address += country + '<br>' }
//    return address

//}

function siteAddress(site) {
    var address_site = '';
    var breakline = '\n'
    var addr1 = site.getFieldValue('custrecord_site_street');
    var city = site.getFieldValue('custrecord_site_city');
    var zip = site.getFieldValue('custrecord_site_zip');
    nlapiLogExecution('Debug', 'Site', addr1 + ' ' + city + ' ' + zip)
    if (!isNullOrEmpty(addr1)) { address_site += addr1 + ', ' + breakline };
    if (!isNullOrEmpty(city)) { address_site += city + breakline };
    // if (!isNullOrEmpty(zip)) { address_site += zip + breakline };
    nlapiLogExecution('Debug', 'address site', address_site)
    return address_site
}
