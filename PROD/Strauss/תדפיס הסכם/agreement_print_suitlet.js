function suitelet_print(request, response) {

    var id = request.getParameter('id');   
    var record = nlapiLoadRecord('customrecord_agreement', id);
    var customer = record.getFieldValue('custrecord_agreement_customer')
    var entityRec = nlapiLoadRecord('customer', customer);
    var defaultaddress = entityRec.getFieldValue('defaultaddress')
    if (isNullOrEmpty(defaultaddress)) { defaultaddress = ''; }   
    var subsidiary = entityRec.getFieldValue('subsidiary');
    var subsidiaryRec = nlapiLoadRecord('subsidiary', subsidiary);
    var custrecord_ilo_subsid_hebrew_address = subsidiaryRec.getFieldValue('custrecord_ilo_subsid_hebrew_address');
    custrecord_ilo_subsid_hebrew_address.replace(/\n/ig, '<br />');
    custrecord_ilo_subsid_hebrew_address.replace(/\n/ig, '<br />');
    var name = subsidiaryRec.getFieldValue('name');
    //var hotels_nw_agreement_remarks = record.getFieldValue('custrecord_general_comments');
    //if (isNullOrEmpty(hotels_nw_agreement_remarks)) { hotels_nw_agreement_remarks = '';}
    if (!isNullOrEmpty(record.getFieldValue('custrecord_yearly_bonus_percent'))) { var bonusTable = BonusTable(record) }
    
    var included_branches_source = record.getFieldValue('custrecord_included_branches_source')
    if (included_branches_source == 2) {
        var CustomerList = getCustomerList(customer);
        if (CustomerList.length > 0) { var CustomerTable = buildCustomerTable(CustomerList) }
        else { var CustomerTable = ''; }
    }
    else { CustomerTable = '';}
  
    var PriceListTable = getPriceList(record)

    var renderer = nlapiCreateTemplateRenderer();
    //var template = nlapiLoadFile(3493);   // sendbox
    var template = nlapiLoadFile(4654);   // prod
    renderer.setTemplate(template.getValue());
    renderer.addRecord('record', record);
    var xml = renderer.renderToString();
    xml = xml.replace('/customerAddress/', defaultaddress.replaceAll())
    xml = xml.replace('/subName/', name)
    xml = xml.replace('/subAddress/', custrecord_ilo_subsid_hebrew_address.replaceAll())
    xml = xml.replace('/subAddress/', custrecord_ilo_subsid_hebrew_address.replaceAll())
    //xml = xml.replace('/HOTELSNETWORKAGREEMENTREMARKS/', hotels_nw_agreement_remarks.replaceAll())
    xml = xml.replace('/customerList/', CustomerTable)
    xml = xml.replace('/PriceList/', PriceListTable)
    xml = xml.replace('/BONUOSTABLE/', bonusTable)
    
    //xml = xml.replace('/custbody_contact_person/', custbody_contact_person)
    //xml = xml.replace('/custentity_service_technician/', custentity_service_technician)
    //xml = xml.replace('/salesrep/', salesrep)
    //xml = xml.replace('/user/', user)
    nlapiLogExecution('error', 'xml ', xml);
    var pdf = nlapiXMLToPDF(xml);
    nlapiLogExecution('error', 'pdf ', pdf);
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
        if (num[i] == 'Israel') { res += 'ישראל' + '<br />';}
        else { res += num[i] + '<br />'; }
    }
    return res;
}
function getCustomerList(customer) {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custentity_sap_number');
    columns[1] = new nlobjSearchColumn('companyname');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('parent', null, 'is', customer)

    var search = nlapiCreateSearch('customer', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {

            results.push({

                id: returnSearchResults[i].getValue('custentity_sap_number'),
                name: returnSearchResults[i].getValue('companyname')
            });

        }
        return results;
    }

}
function buildCustomerTable(CustomerList) {
    var CustomerTable = '<table align="right" style="text-align:right; direction:rtl;width:500px;">' +
        '<tr><td align="right"> מס לקוח</td><td align="right">שם לקוח</td></tr>';
    for (var i = 0; i < CustomerList.length; i++) {

        CustomerTable += '<tr><td align="right">' + CustomerList[i].id +'</td><td align="right">' + CustomerList[i].name+'</td></tr>';
    }
    CustomerTable += '</table>  ';
    return CustomerTable;
}
function getPriceList(record) {
    if (!isNullOrEmpty(record.getFieldValue('custrecord_yearly_bonus_percent')) || !isNullOrEmpty(record.getFieldValue('custrecord_yearly_bonus_amount')) || !isNullOrEmpty(record.getFieldValue('custrecord_signing_bonus'))) {
        var number = 'ב'
    }
    else {  var number = 'א'}
    var count = record.getLineItemCount('recmachcustrecord_pl_agreement');
    if (count > 0) {        
        var CustomerTable = '<pbr></pbr>' +
            '<p align="center" style="font-size:12pt;text-align:right;direction:rtl;padding-left:0.5in;padding-top:20px" dir="rtl"> <b><u>נספח ' + number+ "'"  + '- פירוט מחירים קבועים ללקוח</u></b></p>';

        CustomerTable += '<table class="pl" align="right" style="text-align:right; direction:rtl;width:500px;">' +
            '<tr><td align="right"  colspan="7"> מוצר</td><td align="right" colspan="2" >מחיר</td><td align="right" colspan="5">כמות באריזה</td></tr>';
        for (var i = 1; i <= count; i++) {

            CustomerTable += '<tr><td align="right" colspan="7">' + record.getLineItemValue('recmachcustrecord_pl_agreement', 'custrecord_item_description', i) + '</td><td align="right" colspan="2">' +
                record.getLineItemValue('recmachcustrecord_pl_agreement', 'custrecord_customer_price', i) +
                '</td><td align="right" colspan="5">' + record.getLineItemValue('recmachcustrecord_pl_agreement', 'custrecord_pl_units_in_pkg', i) + '</td></tr>';
        }
        CustomerTable += '</table>  ';
        if (!isNullOrEmpty(record.getFieldValue('custrecord_yearly_bonus_percent')) || !isNullOrEmpty(record.getFieldValue('custrecord_yearly_bonus_amount')) || !isNullOrEmpty(record.getFieldValue('custrecord_signing_bonus'))) {
            number = 'ג'
        }
        else { number = 'ב' }
        CustomerTable += '<pbr></pbr>' +
            '<p align="center" style = "font-size: 12pt; text-align:right; direction:rtl;padding-left:0.5in;padding-top:20px" dir="rtl"> <b><u>נספח '+ number + "'"  + '- כללי</u></b></p>';

    }
    else {
        var CustomerTable = '<pbr></pbr>' +
            '<p align="center" style = "font-size: 12pt; text-align:right; direction:rtl;padding-left:0.5in;padding-top:20px" dir="rtl"> <b><u>נספח ' + number + "'" + '- כללי</u></b></p>';

    }
    
    return CustomerTable;
}
function BonusTable(record) {
    var table = '<table class="pl" align="right" style="text-align:right; direction:rtl;width:500px;">' +
        '<tr><td align="right">קטגוריה</td>';
    var sales_target_for_bonus = record.getFieldValue('custrecord_sales_target_for_bonus');
    if (!isNullOrEmpty(sales_target_for_bonus)) {
        table += '<td align="right">יעד מכירות קפה כללי </td>';
    }  
    table += '<td align="right"> בונוס מקניות נטו % </td>';
    table += '</tr>';

    var product_category_for_bonus = record.getFieldValue('custrecord_product_category_for_bonus');
    if (isNullOrEmpty(product_category_for_bonus)) { product_category_for_bonus = '';}
    table += '<tr><td align="right">' + product_category_for_bonus + '</td>';
    if (!isNullOrEmpty(sales_target_for_bonus)) {
        table += '<td align="right"> ₪ ' + formatNumber(sales_target_for_bonus) +'</td>';
    }
    table += '<td align="right">' + record.getFieldValue('custrecord_yearly_bonus_percent') + '</td></tr>';       
    table += '</table>  ';
    return table;
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return ''


}
