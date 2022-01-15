/**
* @NApiVersion 2.0
* @NScriptType suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/record', 'N/email', 'N/render', 'N/url'],
    function (serverWidget, search, record, email, render, url) {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var vendorId = context.request.parameters.vendorId;
                var lastLogID = getLastLodID(vendorId)
                var logID = context.request.parameters.log
                log.debug("lastLogID:  " + lastLogID, 'logID: ' + logID);
                if (Number(lastLogID) != Number(logID)) {
                    showMessage(context, 'This request has expired');
                    return;
                }
                var alredyRes = getVal('customrecord_vendors_quick_add_logs', logID, 'custrecord_already_responded')
                if (alredyRes) {
                    showMessage(context, 'You have already responded to this Request');
                    return;
                }
                else {
                    var form = serverWidget.createForm({
                        title: 'New Vendor Form - Login'
                    });
                    form.clientScriptModulePath = 'SuiteScripts/CyberArk/Dev/_dev_ven_quick_add_cs.js';

                    form.addSubmitButton('Login');
                    var password = form.addField({ id: 'custpage_password', type: serverWidget.FieldType.PASSWORD, label: 'PLEASE ENTER YOUR PASSWORD', container: null, source: null });
                    password.isMandatory = true;

                    var page = form.addField({ id: 'custpage_next_page', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    page.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    page.defaultValue = '1';

                    var logField = form.addField({ id: 'custpage_log', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    logField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    logField.defaultValue = logID;
                    context.response.writePage(form);

                    var vendorField = form.addField({ id: 'custpage_vendor', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    vendorField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    vendorField.defaultValue = vendorId;
                    context.response.writePage(form);
                }
            }
            else if (context.request.parameters.custpage_next_page == '1') {
                var form = serverWidget.createForm({
                    title: 'New Vendor Form'
                });
                form.clientScriptModulePath = 'SuiteScripts/CyberArk/Dev/_dev_ven_quick_add_cs.js';
                var logID = context.request.parameters.custpage_log
                var logField = form.addField({ id: 'custpage_log', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                logField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                logField.defaultValue = logID;

                var vendorId = context.request.parameters.custpage_vendor
                log.debug('vendorId', vendorId)
                var vendorField = form.addField({ id: 'custpage_vendor', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                vendorField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                vendorField.defaultValue = vendorId;

                var vendData = getVendorVal('vendor', vendorId);
                log.debug('vendData', JSON.stringify(vendData))
                var sub = vendData[0].sub
                var vendPhone = vendData[0].phone
                var vendFax = vendData[0].fax
                var vendComments = vendData[0].comments
                var vendVat = vendData[0].vatregnumber
                var vendUrl = vendData[0].url
                var vend_print_nam = vendData[0].print_nam
                var vend_pos_title = vendData[0].pos_title
                var vendName = vendData[0].vendName
                var vendEmail = vendData[0].vendEmail
                var vendCreator = vendData[0].vendCreator
                var vendCurrency = vendData[0].vendCurrency

                var SubData = getSubData(sub);
                var mainaddress_text = SubData[0];
                var group_distrib_list = SubData[1];
                var accountEmail = SubData[2];

                var accountEmailField = form.addField({ id: 'custpage_account_email', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                accountEmailField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                accountEmailField.defaultValue = group_distrib_list;

                var subField = form.addField({ id: 'custpage_sub', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                subField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                subField.defaultValue = sub;

                var currencyField = form.addField({ id: 'custpage_currency', type: serverWidget.FieldType.TEXT, label: 'currency', container: null, source: null })
                currencyField.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                currencyField.defaultValue = vendCurrency;
                var rec = record.load({
                    type: record.Type.VENDOR,
                    id: vendorId,
                    isDynamic: true,
                });
                var addressData = getAddressVend(rec, null)
                log.debug('addData', JSON.stringify(addressData))
                var address_addr1 = addressData[0].addr1
                var address_city = addressData[0].city
                var address_zip = addressData[0].zip
                var address_state = addressData[0].state
                var address_addr2 = addressData[0].addr2
                var address_country = addressData[0].country
                if (isNullOrEmpty(address_addr1) && isNullOrEmpty(address_city) && isNullOrEmpty(address_zip) && isNullOrEmpty(address_state) && isNullOrEmpty(address_addr2)) {
                    var first_address = form.addField({ id: 'custpage_first_address', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    first_address.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    first_address.defaultValue = '1';
                }
                if (sub == 18) {
                    var addressDataLigal = getAddressVend(rec, 'ligal');
                    log.debug('addressDataLigal', JSON.stringify(addressDataLigal))
                    if (addressDataLigal.length > 0) {
                        var address_addr1_ligal = addressDataLigal[0].addr1
                        var address_city_ligal = addressDataLigal[0].city
                        var address_zip_ligal = addressDataLigal[0].zip
                        var address_state_ligal = addressDataLigal[0].state
                        var address_addr2_ligal = addressDataLigal[0].addr2
                        var address_country_ligal = addressDataLigal[0].country
                        if (isNullOrEmpty(address_addr1_ligal) && isNullOrEmpty(address_city_ligal) && isNullOrEmpty(address_zip_ligal) && isNullOrEmpty(address_state_ligal) && isNullOrEmpty(address_addr2_ligal)) {
                            var first_address_ligal = form.addField({ id: 'custpage_first_address_ligal', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                            first_address_ligal.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                            first_address_ligal.defaultValue = '1';
                            address_country_ligal = ''
                        }
                    }                                  
                }

                var saleContactData = getContact(vendorId, 1);
                if (saleContactData.length > 0) {
                    log.debug('saleContactData', JSON.stringify(saleContactData))
                    var sale_internalid = saleContactData[0].internalid
                    var sale_phone = saleContactData[0].phone
                    var sale_fax = saleContactData[0].fax
                    var sale_entityid = saleContactData[0].entityid
                    var sale_email = saleContactData[0].email

                    var sales_id = form.addField({ id: 'custpage_sales_id', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    sales_id.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    sales_id.defaultValue = sale_internalid;
                }
                var finContactData = getContact(vendorId, 2);
                if (finContactData.length > 0) {
                    log.debug('finContactData', JSON.stringify(finContactData))
                    var fin_internalid = finContactData[0].internalid
                    var fin_phone = finContactData[0].phone
                    var fin_fax = finContactData[0].fax
                    var fin_entityid = finContactData[0].entityid
                    var fin_email = finContactData[0].email

                    var fin_id = form.addField({ id: 'custpage_fin_id', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                    fin_id.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                    fin_id.defaultValue = fin_internalid;
                }
                if (sub != 22 && sub != 18|| (sub == 22 && currencyField != 'ILS')) {
                    var BankDetailsData = getBankDetails(vendorId)
                    if (BankDetailsData.length > 0) {
                        var BankID = BankDetailsData[0].internalid
                        var acct_name = BankDetailsData[0].acct_name
                        var acct_no = BankDetailsData[0].acct_no
                        var bank_no = BankDetailsData[0].bank_no
                        var branch_no = BankDetailsData[0].branch_no
                        var aba = BankDetailsData[0].aba

                        var bank_id = form.addField({ id: 'custpage_bank_id', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                        bank_id.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                        bank_id.defaultValue = BankID;
                    }
                }
                else if (sub == 18) {
                    var BankDetailsData = getBankDetails(vendorId)
                    log.debug('BankDetailsData', JSON.stringify(BankDetailsData))
                    if (BankDetailsData.length > 0) {
                        var BankID = BankDetailsData[0].internalid
                        var acct_no = BankDetailsData[0].acct_no
                        var file_format = BankDetailsData[0].file_format
                        if (file_format == 72) {
                            var bank_no = BankDetailsData[0].bank_no
                            var bank_acct_type = BankDetailsData[0].bank_acct_type
                        }
                        else {
                            var entity_bank_name = BankDetailsData[0].entity_bank_name
                            var entity_iban = BankDetailsData[0].entity_iban
                            var entity_address1 = BankDetailsData[0].entity_address1
                            var entity_address2 = BankDetailsData[0].entity_address2
                            var entity_swift = BankDetailsData[0].entity_swift
                        }                                                                                     
                        var bank_id = form.addField({ id: 'custpage_bank_id', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                        bank_id.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                        bank_id.defaultValue = BankID;
                    }
                }
                else {
                    var BankDetailsData = getILBankDetails(vendorId)
                    if (BankDetailsData.length > 0) {
                        var BankID = BankDetailsData[0].internalid
                        var acct_name = BankDetailsData[0].account_name
                        var bank_bank = BankDetailsData[0].bank_bank

                        var bank_id = form.addField({ id: 'custpage_bank_il_id', type: serverWidget.FieldType.TEXT, label: 'NEXT', container: null, source: null })
                        bank_id.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
                        bank_id.defaultValue = BankID;
                    }
                }
                var html = "<table style = 'width :650px' ><tr><td>All fields below marked with * are mandatory.</td></tr>" +
                    '<tr><td><b><u>All invoices must be addressed to:</b></u></td></tr>' +
                    "<tr><td style='white - space: pre'> Accounts Payable " + mainaddress_text + "<td></tr>" +
                    '<tr><td>email: ' + accountEmail +'</td></tr>' +
                    '<tr><td>Contact: ' + vendCreator + '</td></tr>' +
                    '<tr><td>Please note: standard payment terms are Net 30. Payment is made via bank transfer.</td></tr>' +
                    '</table>';
                form.addFieldGroup({ id: 'general', label: 'General' });
                form.addField({
                    id: 'custpage_html',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: 'general'
                }).defaultValue = html;
                form.addSubmitButton('Submit');

                form.addFieldGroup({ id: 'info', label: 'Supplier Information' });
                var name = form.addField({ id: 'custpage_legal_name', type: serverWidget.FieldType.TEXT, label: 'LEGAL NAME', container: 'info', source: null });
                name.isMandatory = true;
                name.defaultValue = vendName;
                //var terms = form.addField({ id: 'custpage_terms', type: serverWidget.FieldType.SELECT, label: 'PAYMENT TERMS', container: 'info', source: 'term' })
                //terms.defaultValue = vendTerms;
                var phone = form.addField({ id: 'custpage_phone', type: serverWidget.FieldType.PHONE, label: 'PHONE', container: 'info', source: null })
                phone.isMandatory = true;
                phone.defaultValue = vendPhone;
                var fax = form.addField({ id: 'custpage_fax', type: serverWidget.FieldType.TEXT, label: 'FAX', container: 'info', source: null })
                fax.defaultValue = vendFax;
                var email = form.addField({ id: 'custpage_email', type: serverWidget.FieldType.TEXT, label: 'EMAIL', container: 'info', source: null });
                email.updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });
                email.defaultValue = vendEmail;
                var website = form.addField({ id: 'custpage_website', type: serverWidget.FieldType.URL, label: 'WEBSITE', container: 'info', source: null })
                website.defaultValue = vendUrl;
                var comments = form.addField({ id: 'custpage_comments', type: serverWidget.FieldType.TEXTAREA, label: 'COMMENTS', container: 'info', source: null })
                comments.defaultValue = vendComments;
                var vat = form.addField({ id: 'custpage_taxvat', type: serverWidget.FieldType.TEXT, label: 'TAX/VAT NUMBER', container: 'info', source: null })
                vat.defaultValue = vendVat;
                if (sub == 18) {
                    vat.isMandatory = true;
                }

                //Bank details
                form.addFieldGroup({ id: 'bank', label: 'Bank Details - Please provide: Voided check or bank information from your banking institution (with company name, account #, and routing # )' });
                if (sub == 18) {
                    var payment_type_us = form.addField({ id: 'custpage_payment_type_us', type: serverWidget.FieldType.SELECT, label: 'Payment Type', container: 'bank', source: null });
                    payment_type_us.addSelectOption({ value: '72', text: 'ACH' });
                    payment_type_us.addSelectOption({ value: '67', text: 'Wire' });
                    payment_type_us.defaultValue = file_format; payment_type_us.isMandatory = true;
                    var account_number_us = form.addField({ id: 'custpage_account_number_us', type: serverWidget.FieldType.TEXT, label: 'Account number', container: 'bank', source: null });
                    account_number_us.defaultValue = acct_no
                    //ACH                    
                    var bank_number_us = form.addField({ id: 'custpage_bank_number_us', type: serverWidget.FieldType.TEXT, label: 'Bank Number', container: 'bank', source: null });
                    bank_number_us.defaultValue = bank_no;
                    var bank_account_us = form.addField({ id: 'custpage_bank_account_type_us', type: serverWidget.FieldType.SELECT, label: 'Bank Account Type', container: 'bank', source: null });
                    bank_account_us.addSelectOption({ value: '1', text: 'Checking' });
                    bank_account_us.addSelectOption({ value: '2', text: 'Savings' });
                    bank_account_us.defaultValue = bank_acct_type

                    //wire
                    var bank_name_us = form.addField({ id: 'custpage_bank_name_us', type: serverWidget.FieldType.TEXT, label: 'Bank Name', container: 'bank', source: null });
                    bank_name_us.defaultValue = entity_bank_name;
                    var iban_us = form.addField({ id: 'custpage_iban_us', type: serverWidget.FieldType.TEXT, label: 'IBAN', container: 'bank', source: null });
                    //iban_us.isMandatory = true;
                    iban_us.defaultValue = entity_iban;
                    var bank1_us = form.addField({ id: 'custpage_bank1_us', type: serverWidget.FieldType.TEXT, label: 'Bank Address1', container: 'bank', source: null });
                    //bank1_us.isMandatory = true;
                    bank1_us.defaultValue = entity_address1;
                    var bank2_us = form.addField({ id: 'custpage_bank2_us', type: serverWidget.FieldType.TEXT, label: 'Bank Address2', container: 'bank', source: null });
                    //bank2_us.isMandatory = true;
                    bank2_us.defaultValue = entity_address2;
                    var swift_us = form.addField({ id: 'custpage_swift_us', type: serverWidget.FieldType.TEXT, label: 'Swift Code', container: 'bank', source: null });
                    //swift_us.isMandatory = true;
                    swift_us.defaultValue = entity_swift;

                }
                else {
                    var bank_name = form.addField({ id: 'custpage_bank_name', type: serverWidget.FieldType.TEXT, label: 'Bank Name', container: 'bank', source: null });
                    bank_name.isMandatory = true; bank_name.defaultValue = acct_name;
                    var bank_details = form.addField({ id: 'custpage_bank_details', type: serverWidget.FieldType.SELECT, label: 'BANK DETAIL', container: 'bank', source: null });
                    if (sub == 22) { getBankDetailsList(bank_details, bank_bank) }
                    var branch_number = form.addField({ id: 'custpage_branch_number', type: serverWidget.FieldType.TEXT, label: 'Branch Number', container: 'bank', source: null });
                    branch_number.defaultValue = branch_no;
                    var bank_number = form.addField({ id: 'custpage_bank_number', type: serverWidget.FieldType.TEXT, label: 'Bank Number', container: 'bank', source: null });
                    bank_number.defaultValue = bank_no;
                    var account_number = form.addField({ id: 'custpage_account_number', type: serverWidget.FieldType.TEXT, label: 'Account number', container: 'bank', source: null });
                    account_number.defaultValue = acct_no
                    var swift_code = form.addField({ id: 'custpage_swift_code', type: serverWidget.FieldType.TEXT, label: 'Swift Code', container: 'bank', source: null });
                    swift_code.defaultValue = '';
                    var iban = form.addField({ id: 'custpage_iban', type: serverWidget.FieldType.TEXT, label: 'IBAN', container: 'bank', source: null });
                    //iban.isMandatory = true;
                    //iban.defaultValue = address_state;
                    var abaField = form.addField({ id: 'custpage_aba', type: serverWidget.FieldType.TEXT, label: 'ABA Number/Routing number', container: 'bank', source: null });
                    //aba.isMandatory = true;             
                    abaField.defaultValue = aba;
                }
              
     

                //ADDRESS
                form.addFieldGroup({ id: 'address', label: 'Supplier Address' });
                var street = form.addField({ id: 'custpage_street', type: serverWidget.FieldType.TEXT, label: 'STREET ADDDRESS', container: 'address', source: null });
                street.isMandatory = true; street.defaultValue = address_addr1
                var number = form.addField({ id: 'custpage_number', type: serverWidget.FieldType.TEXT, label: 'BUILDING/HOUSE NUMBER', container: 'address', source: null });
                number.defaultValue = address_addr2;
                var city = form.addField({ id: 'custpage_city', type: serverWidget.FieldType.TEXT, label: 'TOWN/CITY', container: 'address', source: null });
                city.isMandatory = true; city.defaultValue = address_city
                var postal_code = form.addField({ id: 'custpage_postal_code', type: serverWidget.FieldType.TEXT, label: 'POSTAL CODE', container: 'address', source: null });
                postal_code.defaultValue = address_zip
                if (sub == 18) { postal_code.isMandatory = true }
                var state = form.addField({ id: 'custpage_state', type: serverWidget.FieldType.TEXT, label: 'STATE', container: 'address', source: null });
                //state.isMandatory = true;
                state.defaultValue = address_state;
                var state_select = form.addField({ id: 'custpage_state_select', type: serverWidget.FieldType.SELECT, label: 'STATE', container: 'address', source: null });
                if (address_country == 'US' || address_country == 'JP' || address_country == 'MX' || address_country == 'GB' || address_country == 'AT' || address_country == 'CA' || address_country == 'CN' || address_country == 'CN') {
                    setState(state_select, address_country, address_state);
                }
                var country = form.addField({ id: 'custpage_country', type: serverWidget.FieldType.SELECT, label: 'COUNTRY', container: 'address', source: null });
                country.isMandatory = true;
                setCountries(country)
                country.defaultValue = address_country;

                //Legal address 
                if (sub == 18) {
                    form.addFieldGroup({ id: 'ligal_address', label: 'Legal address' });
                    var street_ligal = form.addField({ id: 'custpage_street_ligal', type: serverWidget.FieldType.TEXT, label: 'STREET ADDDRESS', container: 'ligal_address', source: null });
                    street_ligal.defaultValue = address_addr1_ligal
                    var number_ligal = form.addField({ id: 'custpage_number_ligal', type: serverWidget.FieldType.TEXT, label: 'BUILDING/HOUSE NUMBER', container: 'ligal_address', source: null });
                    number_ligal.defaultValue = address_addr2_ligal;
                    var city_ligal = form.addField({ id: 'custpage_city_ligal', type: serverWidget.FieldType.TEXT, label: 'TOWN/CITY', container: 'ligal_address', source: null });
                    city_ligal.defaultValue = address_city_ligal
                    var postal_code_ligal = form.addField({ id: 'custpage_postal_code_ligal', type: serverWidget.FieldType.TEXT, label: 'POSTAL CODE', container: 'ligal_address', source: null });
                    postal_code_ligal.defaultValue = address_zip_ligal
                    var state_ligal = form.addField({ id: 'custpage_state_ligal', type: serverWidget.FieldType.TEXT, label: 'STATE', container: 'ligal_address', source: null });
                    //state.isMandatory = true;
                    state_ligal.defaultValue = address_state_ligal;
                    var state_select_ligal = form.addField({ id: 'custpage_state_select_ligal', type: serverWidget.FieldType.SELECT, label: 'STATE', container: 'ligal_address', source: null });
                    if (address_country_ligal == 'US' || address_country_ligal == 'JP' || address_country_ligal == 'MX' || address_country_ligal == 'GB' || address_country_ligal == 'AT' || address_country_ligal == 'CA' || address_country_ligal == 'CN' || address_country_ligal == 'CN') {
                        setState(state_select_ligal, address_country_ligal, address_state_ligal);
                    }
                    var country_ligal = form.addField({ id: 'custpage_country_ligal', type: serverWidget.FieldType.SELECT, label: 'COUNTRY', container: 'ligal_address', source: null });
                    //country_ligal.isMandatory = true;
                    setCountries(country_ligal)
                    country_ligal.defaultValue = address_country_ligal;
                }


                //Sales Contact - Details
                form.addFieldGroup({ id: 'sales_contact', label: 'Sales/Financial Contact - Details' });
                var contact_name = form.addField({ id: 'custpage_contact_name', type: serverWidget.FieldType.TEXT, label: 'SALES CONTACT - NAME', container: 'sales_contact', source: null });
                contact_name.defaultValue = sale_entityid;
                var contact_phone = form.addField({ id: 'custpage_contact_phone', type: serverWidget.FieldType.PHONE, label: 'SALES CONTACT - PHONE', container: 'sales_contact', source: null });
                contact_phone.defaultValue = sale_phone;
                var contact_fax = form.addField({ id: 'custpage_contact_fax', type: serverWidget.FieldType.PHONE, label: 'SALES CONTACT - FAX', container: 'sales_contact', source: null });
                contact_fax.defaultValue = sale_fax;
                var contact_email = form.addField({ id: 'custpage_contact_email', type: serverWidget.FieldType.EMAIL, label: 'SALES CONTACT - EMAIL', container: 'sales_contact', source: null });
                contact_email.defaultValue = sale_email;
                var fin_contact_name = form.addField({ id: 'custpage_fin_contact_name', type: serverWidget.FieldType.TEXT, label: 'FINANCIAL CONTACT - NAME', container: 'sales_contact', source: null });
                fin_contact_name.defaultValue = fin_entityid;
                var fin_contact_phone = form.addField({ id: 'custpage_fin_contact_phone', type: serverWidget.FieldType.PHONE, label: 'FINANCIAL CONTACT - PHONE', container: 'sales_contact', source: null });
                fin_contact_phone.defaultValue = fin_phone;
                var fin_contact_fax = form.addField({ id: 'custpage_fin_contact_fax', type: serverWidget.FieldType.PHONE, label: 'FINANCIAL CONTACT - FAX', container: 'sales_contact', source: null });
                fin_contact_fax.defaultValue = fin_fax;
                var fin_contact_email = form.addField({ id: 'custpage_fin_contact_email', type: serverWidget.FieldType.EMAIL, label: 'FINANCIAL CONTACT - EMAIL', container: 'sales_contact', source: null });
                fin_contact_email.defaultValue = fin_email;
                //Authorized Confirmation
                form.addFieldGroup({ id: 'sales_auth_conf', label: 'Authorized Confirmation' });
                var printName = form.addField({ id: 'custpage_print_name', type: serverWidget.FieldType.TEXT, label: 'PRINT NAME', container: 'sales_auth_conf', source: null });
                printName.defaultValue = vend_print_nam;
                var position = form.addField({ id: 'custpage_position', type: serverWidget.FieldType.TEXT, label: 'POSITION TITLE', container: 'sales_auth_conf', source: null });
                position.isMandatory = true;
                position.defaultValue = vend_pos_title;
                //
                var html = "<table style='width :650px'>" +
                    "<tr><td><u>Bank account confirmation</u>Please provide bank account confirmation letter or void check including the bank account details.</td></tr>" +
                    "<tr><td>In addition, please provide the following documents :<td></tr>" +
                    "<tr><td><ol><li>For U.S listed company, please attach a W9 form.</li><li>For outside the U.S companies, please attach a W8 form.</li></ol></td></tr>" +
                    "<tr><td>By submitting this form, I warrant and represent that: (a) The information stated herein is truthful and accurate; and (b) I shall indemnify and hold CyberArk harmless against any and all claims and any and all damages, losses or expenses CyberArk may incur by reason of implementation of any change(s) requested herein.For any question, please contact <a href='mailto: " + accountEmail + "'>" + accountEmail+"</a>.</td></tr>" +
                    "</table>";
                form.addFieldGroup({ id: 'additional', label: 'Additional information - please add the following documentation to this form' });
                form.addField({
                    id: 'custpage_html_additional',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: 'additional'
                }).defaultValue = html;

                //Attachments
                form.addField({ id: 'custpage_file', type: serverWidget.FieldType.FILE, label: 'DOCUMENT', container: null, source: null });
                form.addField({ id: 'custpage_file2', type: serverWidget.FieldType.FILE, label: 'DOCUMENT', container: null, source: null });
                form.addField({ id: 'custpage_file3', type: serverWidget.FieldType.FILE, label: 'DOCUMENT', container: null, source: null });
                form.addField({ id: 'custpage_file4', type: serverWidget.FieldType.FILE, label: 'DOCUMENT', container: null, source: null });
                form.addField({ id: 'custpage_file5', type: serverWidget.FieldType.FILE, label: 'DOCUMENT', container: null, source: null });


                var download_html = "<table style='width :650px'>" +
                    "<tr><td><a href='https://4678143.app.netsuite.com/core/media/media.nl?id=2760637&c=4678143&h=V5YzgnmRWzCQwuX3pkT8tNuuv3x2OUbVeABD4b7hZswwJq7G&_xt=.pdf' target='_blank'>Blank W-8BEN (rev July 2017) Individuals</a></td></tr>" +
                    "<tr><td><a href='https://4678143.app.netsuite.com/core/media/media.nl?id=2760638&c=4678143&h=TN-vXOSfM8Ml3M5Htl7ZO-nHNNKW8oBPEurW9HddTlGokHv0&_xt=.pdf' target='_blank'>Blank W-8BEN (rev July 2017)</a></td></tr>" +
                    "<tr><td><a href='https://4678143.app.netsuite.com/core/media/media.nl?id=2760639&c=4678143&h=qUPxnGMBUZDJvnl4nIG7pxY589zxFoAUvzUwhA6HZkl3mqHP&_xt=.pdf' target='_blank'>Blank W9_Rev Oct 2018</a></td></tr>" +
                    "</table>";
                
                form.addFieldGroup({ id: 'download', label: 'Fiels For Download' });
                form.addField({
                    id: 'custpage_html_download',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: 'download'
                }).defaultValue = download_html;

                context.response.writePage(form);
            }
            else {
                var logID = context.request.parameters.custpage_log
                var vendorID = context.request.parameters.custpage_vendor
                log.debug('logID', logID)
                log.debug('vendorID', vendorID)
                
                var account_email = context.request.parameters.custpage_account_email 
                var country = context.request.parameters.custpage_country              
                var custpage_taxvat = context.request.parameters.custpage_taxvat;
                var custpage_currency = context.request.parameters.custpage_currency
                var taxvat = getTaxVat(country, custpage_currency, custpage_taxvat)
                var data = {
                    companyname: context.request.parameters.custpage_legal_name,
                    phone: context.request.parameters.custpage_phone,
                    url: context.request.parameters.custpage_website,
                    comments: context.request.parameters.custpage_comments,
                    taxidnum: taxvat,
                    custentity_nc_vqa_vendor_print_nam: context.request.parameters.custpage_print_name,
                    custentity_nc_vqa_vendor_print_pos_title: context.request.parameters.custpage_position,
                    fax: context.request.parameters.custpage_fax,

                }
                keyNames = Object.keys(data);
                log.debug('keyNames', keyNames)
                log.debug('data', JSON.stringify(data))

                var rec = record.load({ type: record.Type.VENDOR, id: vendorID, isDynamic: true, });
                for (var i = 0; i < keyNames.length; i++) {
                    NullOrEmptyVal(data[keyNames[i]], keyNames[i], rec)
                }
                var street = context.request.parameters.custpage_street
                var number = context.request.parameters.custpage_number
                var city = context.request.parameters.custpage_city
                var postal_code = context.request.parameters.custpage_postal_code
                var custpage_sub = context.request.parameters.custpage_sub

                if (country == 'US' || country == 'JP' || country == 'MX' || country == 'GB' || country == 'AT' || country == 'CA' || country == 'CN' || country == 'IN') {
                    var state = context.request.parameters.custpage_state_select
                }
                else {
                    var state = context.request.parameters.custpage_state
                }
                var first_address = context.request.parameters.custpage_first_address
                if (first_address == '1') {
                    createAddress(rec, street, number, city, postal_code, state, country, custpage_sub , null)
                }
                else {
                    updateAddressVend(rec, street, number, city, postal_code, state, country, null)
                }
                if (custpage_sub == 18) {
                    var street_ligal = context.request.parameters.custpage_street_ligal
                    var number_ligal = context.request.parameters.custpage_number_ligal
                    var city_ligal = context.request.parameters.custpage_city_ligal
                    var postal_code_ligal = context.request.parameters.custpage_postal_code_ligal
                    var country_ligal = context.request.parameters.custpage_country_ligal
                    if (country_ligal == 'US' || country_ligal == 'JP' || country_ligal == 'MX' || country_ligal == 'GB' || country_ligal == 'AT' || country_ligal == 'CA' || country_ligal == 'CN' || country_ligal == 'IN') {
                        var state_ligal = context.request.parameters.custpage_state_select_ligal
                    }
                    else {
                        var state_ligal = context.request.parameters.custpage_state_ligal
                    }
                    var custpage_first_address_ligal = context.request.parameters.custpage_first_address_ligal
                    if (custpage_first_address_ligal == '1') {
                        if (street_ligal != '' || number_ligal != '' || city_ligal != '' || postal_code_ligal != '') {
                            createAddress(rec, street_ligal, number_ligal, city_ligal, postal_code_ligal, state_ligal, country_ligal, 'ligal')
                        }
                       
                    }
                    else {
                        if (street_ligal != '' || number_ligal != '' || city_ligal != '' || postal_code_ligal != '') {
                            updateAddressVend(rec, street_ligal, number_ligal, city_ligal, postal_code_ligal, state_ligal, country_ligal, 'ligal')
                        }                     
                    }
                }
          
                var custpage_contact_name = context.request.parameters.custpage_contact_name
                var custpage_contact_phone = context.request.parameters.custpage_contact_phone
                var custpage_contact_fax = context.request.parameters.custpage_contact_fax
                var custpage_contact_email = context.request.parameters.custpage_contact_email
                var custpage_fin_contact_name = context.request.parameters.custpage_fin_contact_name
                var custpage_fin_contact_phone = context.request.parameters.custpage_fin_contact_phone
                var custpage_fin_contact_fax = context.request.parameters.custpage_fin_contact_fax
                var custpage_fin_contact_email = context.request.parameters.custpage_fin_contact_email
                var custpage_sales_id = context.request.parameters.custpage_sales_id
                var custpage_fin_id = context.request.parameters.custpage_fin_id
                if (isNullOrEmpty(custpage_sales_id)) {
                    createContact(custpage_contact_name, 1, vendorID, custpage_contact_phone, custpage_contact_email, custpage_contact_fax)
                }
                else {
                    updateContact(custpage_sales_id, custpage_contact_name, custpage_contact_phone, custpage_contact_email, custpage_contact_fax)
                }
                if (isNullOrEmpty(custpage_fin_id)) {
                    createContact(custpage_fin_contact_name, 2, vendorID, custpage_fin_contact_phone, custpage_fin_contact_email, custpage_fin_contact_fax)
                }
                else {
                    updateContact(custpage_fin_id, custpage_fin_contact_name, custpage_fin_contact_phone, custpage_fin_contact_email, custpage_fin_contact_fax)
                }

                AttachmentDocs(vendorID, context )

               
                var custpage_bank_id = context.request.parameters.custpage_bank_id
                var custpage_bank_il_id = context.request.parameters.custpage_bank_il_id


                if (custpage_sub != 22 && custpage_sub != 18 || (custpage_sub == 22 && custpage_currency != 'ILS')) {
                    var bankData = {
                        custpage_bank_name: context.request.parameters.custpage_bank_name,
                        custpage_branch_number: context.request.parameters.custpage_branch_number,
                        custpage_account_number: context.request.parameters.custpage_account_number,
                        custpage_swift_code: context.request.parameters.custpage_swift_code,
                        custpage_iban: context.request.parameters.custpage_iban,
                        custpage_aba: context.request.parameters.custpage_aba,
                        custpage_bank_number: context.request.parameters.custpage_bank_number
                    }
                }
                else {
                    var bankData = {
                        custpage_bank_name: context.request.parameters.custpage_bank_name,
                        custpage_branch_number: context.request.parameters.custpage_branch_number,
                        custpage_account_number: context.request.parameters.custpage_account_number,
                        custpage_swift_code: context.request.parameters.custpage_swift_code,
                        custpage_iban: context.request.parameters.custpage_iban,
                        custpage_aba: context.request.parameters.custpage_aba,
                        custpage_bank_number: context.request.parameters.custpage_bank_number,
                        custpage_bank_details: context.request.parameters.custpage_bank_details

                    }
                }
                rec.save({ enableSourcing: true, ignoreMandatoryFields: true });
                if (isNullOrEmpty(custpage_bank_id) && ((custpage_sub != 22 && custpage_sub != 18) || (custpage_sub == 22 && custpage_currency != 'ILS'))) {
                    log.debug('createForiegnBank', 'createForiegnBank')
                    createForiegnBank(vendorID, bankData);
                }
                else if (isNullOrEmpty(custpage_bank_id) && custpage_sub == 18) {
                    log.debug('createUSBank','createUSBank')
                    createUSBank(vendorID, context, data );
                }
                else if ((custpage_sub != 22 && custpage_sub != 18)  || (custpage_sub == 22 && custpage_currency != 'ILS')) {
                    udateForiegnBank(custpage_bank_id, bankData, vendorID)
                }
                else if (custpage_sub == 18 ) {
                    udateForiegnBankUS(custpage_bank_id, context, vendorID)
                }
                if (isNullOrEmpty(custpage_bank_il_id) && custpage_sub == 22) {
                    createILBank(vendorID, bankData);
                }
                else if (custpage_sub == 22) { udateILBank(custpage_bank_il_id, bankData) }
                record.submitFields({
                    type: record.Type.VENDOR, id: vendorID,
                    values: { 'custentity_nc_vqa_vend_auth_status': 2, },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                sendEmailToCreator(account_email, vendorID)
                var form = serverWidget.createForm({ title: 'Your Data was submitted successfully' });
                var html = '<script>function startTimer(duration, display) {var timer = duration, minutes, seconds;setInterval(function () { minutes = parseInt(timer / 60, 10);seconds = parseInt(timer % 60, 10);minutes = minutes < 10 ? "0" + minutes : minutes;seconds = seconds < 10 ? "0" + seconds : seconds;display.textContent = minutes + ":" + seconds;if (--timer < 0) {timer = duration;}}, 1000);} window.onload = function () {var fiveMinutes = 60 * 0.1,display = document.querySelector("#time");startTimer(fiveMinutes, display);};</script><div>this Window will close in <span id="time">6</span> seconds!</div>;'
                form.addField({
                    id: 'custpage_redirect_htmlk',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: null
                }).defaultValue = html;
                var html = "<script>setTimeout(function(){window.location.href = 'https://www.cyberark.com/';}, 6000);</script>;"
                form.addField({
                    id: 'custpage_redirect_html',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: null
                }).defaultValue = html;
                record.submitFields({
                    type: 'customrecord_vendors_quick_add_logs', id: logID,
                    values: { 'custrecord_already_responded': true, },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                context.response.writePage(form);
            }
        }
        function getLastLodID(vendorId) {

            var customrecord_vendors_quick_add_logsSearchObj = search.create({
                type: "customrecord_vendors_quick_add_logs",
                filters:
                    [
                        ["custrecord_vend_id", "anyof", vendorId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            summary: "MAX",
                            sort: search.Sort.DESC,
                            label: "Internal ID"
                        })
                    ]
            });
            var id = '';
            var searchResultCount = customrecord_vendors_quick_add_logsSearchObj.runPaged().count;

            customrecord_vendors_quick_add_logsSearchObj.run().each(function (result) {
                id = result.getValue({ name: "internalid", summary: "MAX", sort: search.Sort.DESC, label: "Internal ID" });
                return true;
            });
            return id;
        }
        function showMessage(context, message) {
            var html = '<h1 style="background:red;">';
            html += message;
            html += '<h1>';
            context.response.write({ output: html });
        }
        function getVendorVal(type, id) {
            var SearchObj = search.create({
                type: type,
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        "subsidiary", "phone", "fax", "url", "comments", "taxidnum", "custentity_nc_vqa_vendor_print_name", "custentity_nc_vqa_vendor_print_pos_title", "email", "companyname", "currency",
                        search.createColumn({
                            name: "altname",
                            join: "CUSTENTITY_VENDOR_CREATOR",
                            label: "Name"
                        })
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push({
                    phone: result.getValue({ name: "phone" }),
                    fax: result.getValue({ name: "fax" }),
                    url: result.getValue({ name: "url" }),
                    comments: result.getValue({ name: "comments" }),
                    vatregnumber: result.getValue({ name: "taxidnum" }),
                    print_nam: result.getValue({ name: "custentity_nc_vqa_vendor_print_name" }),
                    pos_title: result.getValue({ name: "custentity_nc_vqa_vendor_print_pos_title" }),
                    vendName: result.getValue({ name: "companyname" }),
                    vendEmail: result.getValue({ name: "email" }),
                    sub: result.getValue({ name: "subsidiary" }),
                    vendCreator: result.getValue({ name: "altname", join: "CUSTENTITY_VENDOR_CREATOR", label: "Name" }),
                    vendCurrency: result.getText({ name: "currency" }),
                })
                return true;
            });
            return res;
        }
        function getAddressVend(rec, type) {
            var res = [];
            var count = rec.getLineCount({
                sublistId: 'addressbook'
            });
            log.debug('type' + type, 'count' + count)
            var line = 0;
            if (type == 'ligal' && count > 1) { line = 1 }
            else if (type == 'ligal') return res;
            rec.selectLine({
                sublistId: 'addressbook',
                line: line
            });
            var addrRec = rec.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            });

            addr1 = addrRec.getValue({ fieldId: 'addr1' })
            city = addrRec.getValue({ fieldId: 'city' })
            zip = addrRec.getValue({ fieldId: 'zip' })
            state = addrRec.getValue({ fieldId: 'state' })
            addr2 = addrRec.getValue({ fieldId: 'addr2' })
            country = addrRec.getValue({ fieldId: 'country' })
            res.push({
                addr1: addr1,
                city: city,
                zip: zip,
                state: state,
                addr2: addr2,
                country: country
            })
            return res;
        }
        function getVal(type, id, field) {
            var SearchObj = search.create({
                type: type,
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        field
                    ]
            });
            SearchObj.run().each(function (result) {
                val = result.getValue({ name: field });
                return true;
            });

            return val;
        }
        function NullOrEmptyVal(val, field, rec) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return;
            }
            else {
                rec.setValue({
                    fieldId: field,
                    value: val
                });
                return;

            }
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function updateAddressVend(rec, street, number, city, postal_code, state, country, type) {
            var line = 0;
            if (type == 'ligal') { line = 1 }
            rec.selectLine({ sublistId: 'addressbook', line: line });
            var addrRec = rec.getCurrentSublistSubrecord({ sublistId: 'addressbook', fieldId: 'addressbookaddress' });
            addrRec.setValue({ fieldId: 'country', value: country })
            addrRec.setValue({ fieldId: 'addr1', value: street })
            addrRec.setValue({ fieldId: 'addr2', value: number })
            addrRec.setValue({ fieldId: 'city', value: city })
            addrRec.setValue({ fieldId: 'zip', value: postal_code })
            addrRec.setValue({ fieldId: 'state', value: state })
            rec.commitLine({ sublistId: 'addressbook' })
        }    
        function createAddress(rec, street, number, city, postal_code, state, country , type) {
            //log.debug('city', city)
            rec.selectNewLine({ sublistId: 'addressbook' })
            var myAddressSubRecord = rec.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            })
            myAddressSubRecord.setValue({
                fieldId: 'country',
                value: country,
            })
            myAddressSubRecord.setValue({
                fieldId: 'addr1',
                value: street,
            })
            myAddressSubRecord.setValue({
                fieldId: 'addr2',
                value: number,
            })
            myAddressSubRecord.setValue({
                fieldId: 'city',
                value: city,
            })
            myAddressSubRecord.setValue({
                fieldId: 'state',
                value: state,
            })
            myAddressSubRecord.setValue({
                fieldId: 'zip',
                value: postal_code,
            })
            if (type == 'ligal') {
                rec.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultshipping',
                    value: false,
                    ignoreFieldChange: true
                });
                rec.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultbilling',
                    value: true,
                    ignoreFieldChange: true
                });         
            }
            else {
                rec.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultshipping',
                    value: true,
                    ignoreFieldChange: true
                });
                rec.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: 'defaultbilling',
                    value: false,
                    ignoreFieldChange: true
                });

            }
            //defaultbilling            
            rec.commitLine({
                sublistId: 'addressbook'
            })
        }
        function getContact(vendorId, type) { // finance =2
            var SearchObj = search.create({
                type: 'contact',
                filters:
                    [
                        ["company", "anyof", vendorId], 'and',
                        ["custentity_nc_vqa_contact_type", "anyof", type]
                    ],
                columns:
                    [
                        "internalid", "phone", "fax", "entityid", "fax", "email"
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push({
                    internalid: result.getValue({ name: "internalid" }),
                    phone: result.getValue({ name: "phone" }),
                    fax: result.getValue({ name: "fax" }),
                    entityid: result.getValue({ name: "entityid" }),
                    fax: result.getValue({ name: "fax" }),
                    email: result.getValue({ name: "email" }),
                })
                return true;
            });
            return res;
        }
        function createContact(name, role, company, phone, email, fax) {
            if (!isNullOrEmpty(name)) {
                contactRecord = record.create({
                    type: record.Type.CONTACT,
                    isDynamic: true,
                });
                contactRecord.setValue({
                    fieldId: 'entityid',
                    value: name
                });
                contactRecord.setValue({
                    fieldId: 'custentity_nc_vqa_contact_type',
                    value: role
                });
                contactRecord.setValue({
                    fieldId: 'company',
                    value: company
                });
                contactRecord.setValue({
                    fieldId: 'phone',
                    value: phone
                });
                contactRecord.setValue({
                    fieldId: 'email',
                    value: email
                });
                contactRecord.setValue({
                    fieldId: 'fax',
                    value: fax
                });
                vendRecId = contactRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
            }
        }
        function updateContact(id, name, phone, email, fax) {

            contactRecord = record.load({
                type: record.Type.CONTACT,
                id: id,
                isDynamic: true,
            });
            contactRecord.setValue({
                fieldId: 'entityid',
                value: name
            });
            contactRecord.setValue({
                fieldId: 'phone',
                value: phone
            });
            contactRecord.setValue({
                fieldId: 'email',
                value: email
            });
            contactRecord.setValue({
                fieldId: 'fax',
                value: fax
            });
            contactRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
        }
        function setCountries(field) {
            var countryList = {
                "AD": {
                    "country": "Andorra"
                },
                "AE": {
                    "country": "United Arab Emirates"
                },
                "AF": {
                    "country": "Afghanistan"
                },
                "AG": {
                    "country": "Antigua and Barbuda"
                },
                "AI": {
                    "country": "Anguilla"
                },
                "AL": {
                    "country": "Albania"
                },
                "AM": {
                    "country": "Armenia"
                },
                "AN": {
                    "country": "Netherlands Antilles (Deprecated)"
                },
                "AO": {
                    "country": "Angola"
                },
                "AQ": {
                    "country": "Antarctica"
                },
                "AR": {
                    "country": "Argentina"
                },
                "AS": {
                    "country": "American Samoa"
                },
                "AT": {
                    "country": "Austria"
                },
                "AU": {
                    "country": "Australia"
                },
                "AW": {
                    "country": "Aruba"
                },
                "AZ": {
                    "country": "Azerbaijan"
                },
                "BA": {
                    "country": "Bosnia and Herzegovina"
                },
                "BB": {
                    "country": "Barbados"
                },
                "BD": {
                    "country": "Bangladesh"
                },
                "BE": {
                    "country": "Belgium"
                },
                "BF": {
                    "country": "Burkina Faso"
                },
                "BG": {
                    "country": "Bulgaria"
                },
                "BH": {
                    "country": "Bahrain"
                },
                "BI": {
                    "country": "Burundi"
                },
                "BJ": {
                    "country": "Benin"
                },
                "BL": {
                    "country": "Saint Barth??lemy"
                },
                "BM": {
                    "country": "Bermuda"
                },
                "BN": {
                    "country": "Brunei Darussalam"
                },
                "BO": {
                    "country": "Bolivia"
                },
                "BR": {
                    "country": "Brazil"
                },
                "BS": {
                    "country": "Bahamas"
                },
                "BT": {
                    "country": "Bhutan"
                },
                "BV": {
                    "country": "Bouvet Island"
                },
                "BW": {
                    "country": "Botswana"
                },
                "BY": {
                    "country": "Belarus"
                },
                "BZ": {
                    "country": "Belize"
                },
                "CA": {
                    "country": "Canada"
                },
                "CC": {
                    "country": "Cocos (Keeling) Islands"
                },
                "CD": {
                    "country": "Congo, Democratic Republic of"
                },
                "CF": {
                    "country": "Central African Republic"
                },
                "CG": {
                    "country": "Congo, Republic of"
                },
                "CH": {
                    "country": "Switzerland"
                },
                "CI": {
                    "country": "Cote d'Ivoire"
                },
                "CK": {
                    "country": "Cook Islands"
                },
                "CL": {
                    "country": "Chile"
                },
                "CM": {
                    "country": "Cameroon"
                },
                "CN": {
                    "country": "China"
                },
                "CO": {
                    "country": "Colombia"
                },
                "CR": {
                    "country": "Costa Rica"
                },
                "CS": {
                    "country": "Serbia and Montenegro (Deprecated)"
                },
                "CU": {
                    "country": "Cuba"
                },
                "CV": {
                    "country": "Cape Verde"
                },
                "CX": {
                    "country": "Christmas Island"
                },
                "CY": {
                    "country": "Cyprus"
                },
                "CZ": {
                    "country": "Czech Republic"
                },
                "DE": {
                    "country": "Germany"
                },
                "DJ": {
                    "country": "Djibouti"
                },
                "DK": {
                    "country": "Denmark"
                },
                "DM": {
                    "country": "Dominica"
                },
                "DO": {
                    "country": "Dominican Republic"
                },
                "DZ": {
                    "country": "Algeria"
                },
                "EC": {
                    "country": "Ecuador"
                },
                "EE": {
                    "country": "Estonia"
                },
                "EG": {
                    "country": "Egypt"
                },
                "EH": {
                    "country": "Western Sahara"
                },
                "ER": {
                    "country": "Eritrea"
                },
                "ES": {
                    "country": "Spain"
                },
                "ET": {
                    "country": "Ethiopia"
                },
                "FI": {
                    "country": "Finland"
                },
                "FJ": {
                    "country": "Fiji"
                },
                "FK": {
                    "country": "Falkland Islands"
                },
                "FM": {
                    "country": "Micronesia, Federal State of"
                },
                "FO": {
                    "country": "Faroe Islands"
                },
                "FR": {
                    "country": "France"
                },
                "GA": {
                    "country": "Gabon"
                },
                "GB": {
                    "country": "United Kingdom"
                },
                "GD": {
                    "country": "Grenada"
                },
                "GE": {
                    "country": "Georgia"
                },
                "GF": {
                    "country": "French Guiana"
                },
                "GG": {
                    "country": "Guernsey"
                },
                "GH": {
                    "country": "Ghana"
                },
                "GI": {
                    "country": "Gibraltar"
                },
                "GL": {
                    "country": "Greenland"
                },
                "GM": {
                    "country": "Gambia"
                },
                "GN": {
                    "country": "Guinea"
                },
                "GP": {
                    "country": "Guadeloupe"
                },
                "GQ": {
                    "country": "Equatorial Guinea"
                },
                "GR": {
                    "country": "Greece"
                },
                "GS": {
                    "country": "South Georgia"
                },
                "GT": {
                    "country": "Guatemala"
                },
                "GU": {
                    "country": "Guam"
                },
                "GW": {
                    "country": "Guinea-Bissau"
                },
                "GY": {
                    "country": "Guyana"
                },
                "HK": {
                    "country": "Hong Kong"
                },
                "HM": {
                    "country": "Heard and McDonald Islands"
                },
                "HN": {
                    "country": "Honduras"
                },
                "HR": {
                    "country": "Croatia/Hrvatska"
                },
                "HT": {
                    "country": "Haiti"
                },
                "HU": {
                    "country": "Hungary"
                },
                "ID": {
                    "country": "Indonesia"
                },
                "IE": {
                    "country": "Ireland"
                },
                "IL": {
                    "country": "Israel"
                },
                "IM": {
                    "country": "Isle of Man"
                },
                "IN": {
                    "country": "India"
                },
                "IO": {
                    "country": "British Indian Ocean Territory"
                },
                "IQ": {
                    "country": "Iraq"
                },
                "IR": {
                    "country": "Iran (Islamic Republic of)"
                },
                "IS": {
                    "country": "Iceland"
                },
                "IT": {
                    "country": "Italy"
                },
                "JE": {
                    "country": "Jersey"
                },
                "JM": {
                    "country": "Jamaica"
                },
                "JO": {
                    "country": "Jordan"
                },
                "JP": {
                    "country": "Japan"
                },
                "KE": {
                    "country": "Kenya"
                },
                "KG": {
                    "country": "Kyrgyzstan"
                },
                "KH": {
                    "country": "Cambodia"
                },
                "KI": {
                    "country": "Kiribati"
                },
                "KM": {
                    "country": "Comoros"
                },
                "KN": {
                    "country": "Saint Kitts and Nevis"
                },
                "KP": {
                    "country": "Korea, Democratic People's Republic"
                },
                "KR": {
                    "country": "Korea, Republic of"
                },
                "KW": {
                    "country": "Kuwait"
                },
                "KY": {
                    "country": "Cayman Islands"
                },
                "KZ": {
                    "country": "Kazakhstan"
                },
                "LA": {
                    "country": "Lao People's Democratic Republic"
                },
                "LB": {
                    "country": "Lebanon"
                },
                "LC": {
                    "country": "Saint Lucia"
                },
                "LI": {
                    "country": "Liechtenstein"
                },
                "LK": {
                    "country": "Sri Lanka"
                },
                "LR": {
                    "country": "Liberia"
                },
                "LS": {
                    "country": "Lesotho"
                },
                "LT": {
                    "country": "Lithuania"
                },
                "LU": {
                    "country": "Luxembourg"
                },
                "LV": {
                    "country": "Latvia"
                },
                "LY": {
                    "country": "Libya"
                },
                "MA": {
                    "country": "Morocco"
                },
                "MC": {
                    "country": "Monaco"
                },
                "MD": {
                    "country": "Moldova, Republic of"
                },
                "ME": {
                    "country": "Montenegro"
                },
                "MF": {
                    "country": "Saint Martin"
                },
                "MG": {
                    "country": "Madagascar"
                },
                "MH": {
                    "country": "Marshall Islands"
                },
                "MK": {
                    "country": "Macedonia"
                },
                "ML": {
                    "country": "Mali"
                },
                "MM": {
                    "country": "Myanmar (Burma)"
                },
                "MN": {
                    "country": "Mongolia"
                },
                "MO": {
                    "country": "Macau"
                },
                "MP": {
                    "country": "Northern Mariana Islands"
                },
                "MQ": {
                    "country": "Martinique"
                },
                "MR": {
                    "country": "Mauritania"
                },
                "MS": {
                    "country": "Montserrat"
                },
                "MT": {
                    "country": "Malta"
                },
                "MU": {
                    "country": "Mauritius"
                },
                "MV": {
                    "country": "Maldives"
                },
                "MW": {
                    "country": "Malawi"
                },
                "MX": {
                    "country": "Mexico"
                },
                "MY": {
                    "country": "Malaysia"
                },
                "MZ": {
                    "country": "Mozambique"
                },
                "NA": {
                    "country": "Namibia"
                },
                "NC": {
                    "country": "New Caledonia"
                },
                "NE": {
                    "country": "Niger"
                },
                "NF": {
                    "country": "Norfolk Island"
                },
                "NG": {
                    "country": "Nigeria"
                },
                "NI": {
                    "country": "Nicaragua"
                },
                "NL": {
                    "country": "Netherlands"
                },
                "NO": {
                    "country": "Norway"
                },
                "NP": {
                    "country": "Nepal"
                },
                "NR": {
                    "country": "Nauru"
                },
                "NU": {
                    "country": "Niue"
                },
                "NZ": {
                    "country": "New Zealand"
                },
                "OM": {
                    "country": "Oman"
                },
                "PA": {
                    "country": "Panama"
                },
                "PE": {
                    "country": "Peru"
                },
                "PF": {
                    "country": "French Polynesia"
                },
                "PG": {
                    "country": "Papua New Guinea"
                },
                "PH": {
                    "country": "Philippines"
                },
                "PK": {
                    "country": "Pakistan"
                },
                "PL": {
                    "country": "Poland"
                },
                "PM": {
                    "country": "St. Pierre and Miquelon"
                },
                "PN": {
                    "country": "Pitcairn Island"
                },
                "PR": {
                    "country": "Puerto Rico"
                },
                "PS": {
                    "country": "State of Palestine"
                },
                "PT": {
                    "country": "Portugal"
                },
                "PW": {
                    "country": "Palau"
                },
                "PY": {
                    "country": "Paraguay"
                },
                "QA": {
                    "country": "Qatar"
                },
                "RE": {
                    "country": "Reunion Island"
                },
                "RO": {
                    "country": "Romania"
                },
                "RS": {
                    "country": "Serbia"
                },
                "RU": {
                    "country": "Russian Federation"
                },
                "RW": {
                    "country": "Rwanda"
                },
                "SA": {
                    "country": "Saudi Arabia"
                },
                "SB": {
                    "country": "Solomon Islands"
                },
                "SC": {
                    "country": "Seychelles"
                },
                "SD": {
                    "country": "Sudan"
                },
                "SE": {
                    "country": "Sweden"
                },
                "SG": {
                    "country": "Singapore"
                },
                "SH": {
                    "country": "Saint Helena"
                },
                "SI": {
                    "country": "Slovenia"
                },
                "SJ": {
                    "country": "Svalbard and Jan Mayen Islands"
                },
                "SK": {
                    "country": "Slovak Republic"
                },
                "SL": {
                    "country": "Sierra Leone"
                },
                "SM": {
                    "country": "San Marino"
                },
                "SN": {
                    "country": "Senegal"
                },
                "SO": {
                    "country": "Somalia"
                },
                "SR": {
                    "country": "Suriname"
                },
                "ST": {
                    "country": "Sao Tome and Principe"
                },
                "SV": {
                    "country": "El Salvador"
                },
                "SY": {
                    "country": "Syrian Arab Republic"
                },
                "SZ": {
                    "country": "Swaziland"
                },
                "TC": {
                    "country": "Turks and Caicos Islands"
                },
                "TD": {
                    "country": "Chad"
                },
                "TF": {
                    "country": "French Southern Territories"
                },
                "TG": {
                    "country": "Togo"
                },
                "TH": {
                    "country": "Thailand"
                },
                "TJ": {
                    "country": "Tajikistan"
                },
                "TK": {
                    "country": "Tokelau"
                },
                "TM": {
                    "country": "Turkmenistan"
                },
                "TN": {
                    "country": "Tunisia"
                },
                "TO": {
                    "country": "Tonga"
                },
                "TP": {
                    "country": "East Timor"
                },
                "TR": {
                    "country": "Turkey"
                },
                "TT": {
                    "country": "Trinidad and Tobago"
                },
                "TV": {
                    "country": "Tuvalu"
                },
                "TW": {
                    "country": "Taiwan"
                },
                "TZ": {
                    "country": "Tanzania"
                },
                "UA": {
                    "country": "Ukraine"
                },
                "UG": {
                    "country": "Uganda"
                },
                "UM": {
                    "country": "US Minor Outlying Islands"
                },
                "US": {
                    "country": "United States"
                },
                "UY": {
                    "country": "Uruguay"
                },
                "UZ": {
                    "country": "Uzbekistan"
                },
                "VA": {
                    "country": "Holy See (City Vatican State)"
                },
                "VC": {
                    "country": "Saint Vincent and the Grenadines"
                },
                "VE": {
                    "country": "Venezuela"
                },
                "VG": {
                    "country": "Virgin Islands (British)"
                },
                "VI": {
                    "country": "Virgin Islands (USA)"
                },
                "VN": {
                    "country": "Vietnam"
                },
                "VU": {
                    "country": "Vanuatu"
                },
                "WF": {
                    "country": "Wallis and Futuna"
                },
                "WS": {
                    "country": "Samoa"
                },
                "YE": {
                    "country": "Yemen"
                },
                "YT": {
                    "country": "Mayotte"
                },
                "ZA": {
                    "country": "South Africa"
                },
                "ZM": {
                    "country": "Zambia"
                },
                "ZW": {
                    "country": "Zimbabwe"
                }
            }
            var names = Object.keys(countryList);
            field.addSelectOption({
                value: '',
                text: ''
            });
            for (var i = 0; i < names.length; i++) {
                field.addSelectOption({
                    value: names[i],
                    text: countryList[names[i]].country
                });
            }

        }
        function setState(field, country, state) {
            log.debug(country, state)
            var nsStates = {
                'US': [{ "value": "", "text": "" }, { "value": "AL", "text": "Alabama" }, { "value": "AK", "text": "Alaska" }, { "value": "AZ", "text": "Arizona" }, { "value": "AR", "text": "Arkansas" }, { "value": "AA", "text": "Armed Forces Americas" }, { "value": "AE", "text": "Armed Forces Europe" }, { "value": "AP", "text": "Armed Forces Pacific" }, { "value": "CA", "text": "California" }, { "value": "CO", "text": "Colorado" }, { "value": "CT", "text": "Connecticut" }, { "value": "DE", "text": "Delaware" }, { "value": "DC", "text": "District of Columbia" }, { "value": "FL", "text": "Florida" }, { "value": "GA", "text": "Georgia" }, { "value": "HI", "text": "Hawaii" }, { "value": "ID", "text": "Idaho" }, { "value": "IL", "text": "Illinois" }, { "value": "IN", "text": "Indiana" }, { "value": "IA", "text": "Iowa" }, { "value": "KS", "text": "Kansas" }, { "value": "KY", "text": "Kentucky" }, { "value": "LA", "text": "Louisiana" }, { "value": "ME", "text": "Maine" }, { "value": "MD", "text": "Maryland" }, { "value": "MA", "text": "Massachusetts" }, { "value": "MI", "text": "Michigan" }, { "value": "MN", "text": "Minnesota" }, { "value": "MS", "text": "Mississippi" }, { "value": "MO", "text": "Missouri" }, { "value": "MT", "text": "Montana" }, { "value": "NE", "text": "Nebraska" }, { "value": "NV", "text": "Nevada" }, { "value": "NH", "text": "New Hampshire" }, { "value": "NJ", "text": "New Jersey" }, { "value": "NM", "text": "New Mexico" }, { "value": "NY", "text": "New York" }, { "value": "NC", "text": "North Carolina" }, { "value": "ND", "text": "North Dakota" }, { "value": "OH", "text": "Ohio" }, { "value": "OK", "text": "Oklahoma" }, { "value": "OR", "text": "Oregon" }, { "value": "PA", "text": "Pennsylvania" }, { "value": "PR", "text": "Puerto Rico" }, { "value": "RI", "text": "Rhode Island" }, { "value": "SC", "text": "South Carolina" }, { "value": "SD", "text": "South Dakota" }, { "value": "TN", "text": "Tennessee" }, { "value": "TX", "text": "Texas" }, { "value": "UT", "text": "Utah" }, { "value": "VT", "text": "Vermont" }, { "value": "VA", "text": "Virginia" }, { "value": "WA", "text": "Washington" }, { "value": "WV", "text": "West Virginia" }, { "value": "WI", "text": "Wisconsin" }, { "value": "WY", "text": "Wyoming" }],
                'JP': [{ "value": "", "text": "" }, { "value": "北海道", "text": "Hokkaidō" }, { "value": "青森県", "text": "Aomori" }, { "value": "岩手県", "text": "Iwate" }, { "value": "宮城県", "text": "Miyagi" }, { "value": "秋田県", "text": "Akita" }, { "value": "山形県", "text": "Yamagata" }, { "value": "福島県", "text": "Fukushima" }, { "value": "茨城県", "text": "Ibaraki" }, { "value": "栃木県", "text": "Tochigi" }, { "value": "群馬県", "text": "Gunma" }, { "value": "埼玉県", "text": "Saitama" }, { "value": "千葉県", "text": "Chiba" }, { "value": "東京都", "text": "Tokyo" }, { "value": "神奈川県", "text": "Kanagawa" }, { "value": "新潟県", "text": "Niigata" }, { "value": "富山県", "text": "Toyama" }, { "value": "石川県", "text": "Ishikawa" }, { "value": "福井県", "text": "Fukui" }, { "value": "山梨県", "text": "Yamanashi" }, { "value": "長野県", "text": "Nagano" }, { "value": "岐阜県", "text": "Gifu" }, { "value": "静岡県", "text": "Shizuoka" }, { "value": "愛知県", "text": "Aichi" }, { "value": "三重県", "text": "Mie" }, { "value": "滋賀県", "text": "Shiga" }, { "value": "京都府", "text": "Kyoto" }, { "value": "大阪府", "text": "Osaka" }, { "value": "兵庫県", "text": "Hyōgo" }, { "value": "奈良県", "text": "Nara" }, { "value": "和歌山県", "text": "Wakayama" }, { "value": "鳥取県", "text": "Tottori" }, { "value": "島根県", "text": "Shimane" }, { "value": "岡山県", "text": "Okayama" }, { "value": "広島県", "text": "Hiroshima" }, { "value": "山口県", "text": "Yamaguchi" }, { "value": "徳島県", "text": "Tokushima" }, { "value": "香川県", "text": "Kagawa" }, { "value": "愛媛県", "text": "Ehime" }, { "value": "高知県", "text": "Kochi" }, { "value": "福岡県", "text": "Fukuoka" }, { "value": "佐賀県", "text": "Saga" }, { "value": "長崎県", "text": "Nagasaki" }, { "value": "熊本県", "text": "Kumamoto" }, { "value": "大分県", "text": "Ōita" }, { "value": "宮崎県", "text": "Miyazaki" }, { "value": "鹿児島県", "text": "Kagoshima" }, { "value": "沖縄県", "text": "Okinawa" }],
                'MX': [{ "value": "", "text": "" }, { "value": "AGS", "text": "Aguascalientes" }, { "value": "BCN", "text": "Baja California Norte" }, { "value": "BCS", "text": "Baja California Sur" }, { "value": "CAM", "text": "Campeche" }, { "value": "CHIS", "text": "Chiapas" }, { "value": "CHIH", "text": "Chihuahua" }, { "value": "COAH", "text": "Coahuila" }, { "value": "COL", "text": "Colima" }, { "value": "DF", "text": "Distrito Federal" }, { "value": "DGO", "text": "Durango" }, { "value": "GTO", "text": "Guanajuato" }, { "value": "GRO", "text": "Guerrero" }, { "value": "HGO", "text": "Hidalgo" }, { "value": "JAL", "text": "Jalisco" }, { "value": "MICH", "text": "Michoacán" }, { "value": "MOR", "text": "Morelos" }, { "value": "MEX", "text": "México (Estado de)" }, { "value": "NAY", "text": "Nayarit" }, { "value": "NL", "text": "Nuevo León" }, { "value": "OAX", "text": "Oaxaca" }, { "value": "PUE", "text": "Puebla" }, { "value": "QRO", "text": "Querétaro" }, { "value": "QROO", "text": "Quintana Roo" }, { "value": "SLP", "text": "San Luis Potosí" }, { "value": "SIN", "text": "Sinaloa" }, { "value": "SON", "text": "Sonora" }, { "value": "TAB", "text": "Tabasco" }, { "value": "TAMPS", "text": "Tamaulipas" }, { "value": "TLAX", "text": "Tlaxcala" }, { "value": "VER", "text": "Veracruz" }, { "value": "YUC", "text": "Yucatán" }, { "value": "ZAC", "text": "Zacatecas" }],
                'GB': [{ "value": "", "text": "" }, { "value": "Aberdeenshire", "text": "Aberdeenshire" }, { "value": "Angus", "text": "Angus" }, { "value": "Argyll", "text": "Argyll" }, { "value": "Avon", "text": "Avon" }, { "value": "Ayrshire", "text": "Ayrshire" }, { "value": "Banffshire", "text": "Banffshire" }, { "value": "Beds.", "text": "Bedfordshire" }, { "value": "Berks.", "text": "Berkshire" }, { "value": "Berwickshire", "text": "Berwickshire" }, { "value": "Bucks.", "text": "Buckinghamshire" }, { "value": "Caithness", "text": "Caithness" }, { "value": "Cambs.", "text": "Cambridgeshire" }, { "value": "Ches.", "text": "Cheshire" }, { "value": "Clackmannanshire", "text": "Clackmannanshire" }, { "value": "Cleveland", "text": "Cleveland" }, { "value": "Clwyd", "text": "Clwyd" }, { "value": "Cornwall", "text": "Cornwall" }, { "value": "Co Antrim", "text": "County Antrim" }, { "value": "Co Armagh", "text": "County Armagh" }, { "value": "Co Down", "text": "County Down" }, { "value": "Durham", "text": "County Durham" }, { "value": "Co Fermanagh", "text": "County Fermanagh" }, { "value": "Co Londonderry", "text": "County Londonderry" }, { "value": "Co Tyrone", "text": "County Tyrone" }, { "value": "Cumbria", "text": "Cumbria" }, { "value": "Derbys.", "text": "Derbyshire" }, { "value": "Devon", "text": "Devon" }, { "value": "Dorset", "text": "Dorset" }, { "value": "Dumfriesshire", "text": "Dumfriesshire" }, { "value": "Dunbartonshire", "text": "Dunbartonshire" }, { "value": "Dyfed", "text": "Dyfed" }, { "value": "E Lothian", "text": "East Lothian" }, { "value": "E Sussex", "text": "East Sussex" }, { "value": "Essex", "text": "Essex" }, { "value": "Fife", "text": "Fife" }, { "value": "Gloucs.", "text": "Gloucestershire" }, { "value": "London", "text": "Greater London" }, { "value": "Gwent", "text": "Gwent" }, { "value": "Gwynedd", "text": "Gwynedd" }, { "value": "Hants.", "text": "Hampshire" }, { "value": "Hereford", "text": "Herefordshire" }, { "value": "Herts.", "text": "Hertfordshire" }, { "value": "Inverness-shire", "text": "Inverness-shire" }, { "value": "Isle of Arran", "text": "Isle of Arran" }, { "value": "Isle of Barra", "text": "Isle of Barra" }, { "value": "Isle of Benbecula", "text": "Isle of Benbecula" }, { "value": "Isle of Bute", "text": "Isle of Bute" }, { "value": "Isle of Canna", "text": "Isle of Canna" }, { "value": "Isle of Coll", "text": "Isle of Coll" }, { "value": "Isle of Colonsay", "text": "Isle of Colonsay" }, { "value": "Isle of Cumbrae", "text": "Isle of Cumbrae" }, { "value": "Isle of Eigg", "text": "Isle of Eigg" }, { "value": "Isle of Gigha", "text": "Isle of Gigha" }, { "value": "Isle of Harris", "text": "Isle of Harris" }, { "value": "Isle of Iona", "text": "Isle of Iona" }, { "value": "Isle of Islay", "text": "Isle of Islay" }, { "value": "Isle of Jura", "text": "Isle of Jura" }, { "value": "Isle of Lewis", "text": "Isle of Lewis" }, { "value": "Isle of Mull", "text": "Isle of Mull" }, { "value": "Isle of North Uist", "text": "Isle of North Uist" }, { "value": "Isle of Rum", "text": "Isle of Rum" }, { "value": "Isle of Scalpay", "text": "Isle of Scalpay" }, { "value": "Isle of Skye", "text": "Isle of Skye" }, { "value": "Isle of South Uist", "text": "Isle of South Uist" }, { "value": "Isle of Tiree", "text": "Isle of Tiree" }, { "value": "Isle of Wight", "text": "Isle of Wight" }, { "value": "Kent", "text": "Kent" }, { "value": "Kincardineshire", "text": "Kincardineshire" }, { "value": "Kinross-shire", "text": "Kinross-shire" }, { "value": "Kirkcudbrightshire", "text": "Kirkcudbrightshire" }, { "value": "Lanarkshire", "text": "Lanarkshire" }, { "value": "Lancs.", "text": "Lancashire" }, { "value": "Leics.", "text": "Leicestershire" }, { "value": "Lincs.", "text": "Lincolnshire" }, { "value": "Merseyside", "text": "Merseyside" }, { "value": "M Glam", "text": "Mid Glamorgan" }, { "value": "Mid Lothian", "text": "Mid Lothian" }, { "value": "Middx.", "text": "Middlesex" }, { "value": "Morayshire", "text": "Morayshire" }, { "value": "Nairnshire", "text": "Nairnshire" }, { "value": "Norfolk", "text": "Norfolk" }, { "value": "N Humberside", "text": "North Humberside" }, { "value": "N Yorkshire", "text": "North Yorkshire" }, { "value": "Northants.", "text": "Northamptonshire" }, { "value": "Northumberland", "text": "Northumberland" }, { "value": "Notts.", "text": "Nottinghamshire" }, { "value": "Oxon.", "text": "Oxfordshire" }, { "value": "Peeblesshire", "text": "Peeblesshire" }, { "value": "Perthshire", "text": "Perthshire" }, { "value": "Powys", "text": "Powys" }, { "value": "Renfrewshire", "text": "Renfrewshire" }, { "value": "Ross-shire", "text": "Ross-shire" }, { "value": "Roxburghshire", "text": "Roxburghshire" }, { "value": "Selkirkshire", "text": "Selkirkshire" }, { "value": "Shrops", "text": "Shropshire" }, { "value": "Somt.", "text": "Somerset" }, { "value": "S Glam", "text": "South Glamorgan" }, { "value": "S Humberside", "text": "South Humberside" }, { "value": "S Yorkshire", "text": "South Yorkshire" }, { "value": "Staffs.", "text": "Staffordshire" }, { "value": "Stirlingshire", "text": "Stirlingshire" }, { "value": "Suffolk", "text": "Suffolk" }, { "value": "Surrey", "text": "Surrey" }, { "value": "Sutherland", "text": "Sutherland" }, { "value": "Tyne & Wear", "text": "Tyne and Wear" }, { "value": "Warks", "text": "Warwickshire" }, { "value": "W Glam", "text": "West Glamorgan" }, { "value": "W Lothian", "text": "West Lothian" }, { "value": "W Midlands", "text": "West Midlands" }, { "value": "W Sussex", "text": "West Sussex" }, { "value": "W Yorkshire", "text": "West Yorkshire" }, { "value": "Wigtownshire", "text": "Wigtownshire" }, { "value": "Wilts", "text": "Wiltshire" }, { "value": "Worcs", "text": "Worcestershire" }],
                'AT': [{ "value": "", "text": "" }, { "value": "ACT", "text": "Australian Capital Territory" }, { "value": "NSW", "text": "New South Wales" }, { "value": "NT", "text": "Northern Territory" }, { "value": "QLD", "text": "Queensland" }, { "value": "SA", "text": "South Australia" }, { "value": "TAS", "text": "Tasmania" }, { "value": "VIC", "text": "Victoria" }, { "value": "WA", "text": "Western Australia" }],
                'CA': [{ "value": "", "text": "" }, { "value": "AB", "text": "Alberta" }, { "value": "BC", "text": "British Columbia" }, { "value": "MB", "text": "Manitoba" }, { "value": "NB", "text": "New Brunswick" }, { "value": "NL", "text": "Newfoundland" }, { "value": "NT", "text": "Northwest Territories" }, { "value": "NS", "text": "Nova Scotia" }, { "value": "NU", "text": "Nunavut" }, { "value": "ON", "text": "Ontario" }, { "value": "PE", "text": "Prince Edward Island" }, { "value": "QC", "text": "Quebec" }, { "value": "SK", "text": "Saskatchewan" }, { "value": "YT", "text": "Yukon" }],
                'CN': [{ "value": "", "text": "" }, { "value": "黑龙江省", "text": "Heilongjiang Province" }, { "value": "吉林省", "text": "Jilin Province" }, { "value": "辽宁省", "text": "Liaoning Province" }, { "value": "内蒙古", "text": "Neimenggu A. R." }, { "value": "甘肃省", "text": "Gansu Province" }, { "value": "宁夏回族自治区", "text": "Ningxia A. R." }, { "value": "新疆维吾尔族自治区", "text": "Xinjiang A. R." }, { "value": "青海省", "text": "Qinghai Province" }, { "value": "河北省", "text": "Hebei Province" }, { "value": "河南省", "text": "Henan Province" }, { "value": "山东省", "text": "Shandong Province" }, { "value": "山西省", "text": "Shanxi Province" }, { "value": "陕西省", "text": "Shaanxi Province" }, { "value": "江苏省", "text": "Jiangsu Province" }, { "value": "浙江省", "text": "Zhejiang Province" }, { "value": "安徽省", "text": "Anhui Province" }, { "value": "湖北省", "text": "Hubei Province" }, { "value": "湖南省", "text": "Hunan Province" }, { "value": "四川省", "text": "Sichuan Province" }, { "value": "贵州省", "text": "Guizhou Province" }, { "value": "江西省", "text": "Jiangxi Province" }, { "value": "广东省", "text": "Guangdong Province" }, { "value": "广西壮族自治区", "text": "Guangxi A. R." }, { "value": "云南省", "text": "Yunnan Province" }, { "value": "海南省", "text": "Hainan Province" }, { "value": "西藏藏族自治区", "text": "Xizang A. R." }, { "value": "北京市", "text": "Beijing" }, { "value": "上海市", "text": "Shanghai" }, { "value": "天津市", "text": "Tianjin" }, { "value": "重庆市", "text": "Chongqing" }, { "value": "福建省", "text": "Fujian Province" }],
                'IN': [{ "value": "", "text": "" }, { "value": "AP", "text": "Andhra Pradesh" }, { "value": "AR", "text": "Arunachal Pradesh" }, { "value": "BR", "text": "Bihar" }, { "value": "AS", "text": "Assam" }, { "value": "CT", "text": "Chhattisgarh" }, { "value": "GA", "text": "Goa" }, { "value": "GJ", "text": "Gujarat" }, { "value": "HR", "text": "Haryana" }, { "value": "HP", "text": "Himachal Pradesh" }, { "value": "JK", "text": "Jammu and Kashmir" }, { "value": "JH", "text": "Jharkhand" }, { "value": "KA", "text": "Karnataka" }, { "value": "KL", "text": "Kerala" }, { "value": "MP", "text": "Madhya Pradesh" }, { "value": "MH", "text": "Maharashtra" }, { "value": "MN", "text": "Manipur" }, { "value": "ML", "text": "Meghalaya" }, { "value": "MZ", "text": "Mizoram" }, { "value": "NL", "text": "Nagaland" }, { "value": "OR", "text": "Odisha" }, { "value": "PB", "text": "Punjab" }, { "value": "RJ", "text": "Rajasthan" }, { "value": "SK", "text": "Sikkim" }, { "value": "TN", "text": "Tamil Nadu" }, { "value": "TG", "text": "Telangana" }, { "value": "TR", "text": "Tripura" }, { "value": "UT", "text": "Uttarakhand" }, { "value": "UP", "text": "Uttar Pradesh" }, { "value": "WB", "text": "West Bengal" }, { "value": "AN", "text": "Andaman and Nicobar Islands" }, { "value": "CH", "text": "Chandigarh" }, { "value": "DN", "text": "Dadra and Nagar Haveli" }, { "value": "DD", "text": "Daman and Diu" }, { "value": "DL", "text": "Delhi" }, { "value": "LD", "text": "Lakshadweep" }, { "value": "PY", "text": "Puducherry" }]
            }
            var list = nsStates[country]
            for (var i = 0; i < list.length; i++) {
                var val = list[i].value;
                if (val == state) {
                    field.addSelectOption({
                        value: val,
                        text: list[i].text,
                        isSelected: true
                    });
                }
                else {
                    field.addSelectOption({
                        value: val,
                        text: list[i].text
                    });
                }
            }
        }
        function createForiegnBank(vendorID, bankData) {
            bankRecord = record.create({ type: 'customrecord_2663_entity_bank_details', isDynamic: true, });
            bankRecord.setValue({ fieldId: 'name', value: bankData.custpage_bank_name + ' ' + vendorID });
            bankRecord.setValue({ fieldId: 'custrecord_2663_parent_vendor', value: vendorID });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_file_format', value: 72 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_type', value: 1 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_acct_type', value: 1 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData.custpage_bank_name });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_no', value: bankData.custpage_account_number });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_no', value: bankData.custpage_bank_number });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_branch_no', value: bankData.custpage_branch_number });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData[0].custpage_swift_code });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData.custpage_iban });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData[0].custpage_aba });             
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function udateForiegnBank(ID, bankData, vendorID) {
            bankRecord = record.load({ type: 'customrecord_2663_entity_bank_details', id: ID, isDynamic: true, });
            bankRecord.setValue({ fieldId: 'name', value: bankData.custpage_bank_name + ' ' + vendorID });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_file_format', value: 72 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_type', value: 1 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_acct_type', value: 1 });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData.custpage_bank_name });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_no', value: bankData.custpage_account_number });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_no', value: bankData.custpage_bank_number });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_branch_no', value: bankData.custpage_branch_number });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData[0].custpage_swift_code });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData[0].custpage_iban });
            //bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_name', value: bankData[0].custpage_aba });             
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function createUSBank(vendorID, context, data ) {
            var payment_type_us = context.request.parameters.custpage_payment_type_us
            bankRecord = record.create({ type: 'customrecord_2663_entity_bank_details', isDynamic: true, });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_file_format', value: payment_type_us });
            bankRecord.setValue({ fieldId: 'custrecord_2663_parent_vendor', value: vendorID });
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_type', value: 1 }); //Primary
            custpage_account_number_us = context.request.parameters.custpage_account_number_us         
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_no', value: custpage_account_number_us });
            if (payment_type_us == 72) {
                setPaymentMethod(vendorID, 9 , true)
                bankRecord.setValue({ fieldId: 'name', value: data.companyname });
   
                custpage_bank_number_us = context.request.parameters.custpage_bank_number_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_no', value: custpage_bank_number_us });
                
                custpage_bank_account_type_us = context.request.parameters.custpage_bank_account_type_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_acct_type', value: custpage_bank_account_type_us });
                
            }
            else {
                setPaymentMethod(vendorID, 4 , false)
                custpage_bank_name_us = context.request.parameters.custpage_bank_name_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_name', value: custpage_bank_name_us});
                custpage_iban_us = context.request.parameters.custpage_iban_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_iban', value: custpage_iban_us });
                custpage_bank1_us = context.request.parameters.custpage_bank1_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_address1', value: custpage_bank1_us });
                custpage_bank2_us = context.request.parameters.custpage_bank2_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_address2', value: custpage_bank2_us });
                custpage_swift_us = context.request.parameters.custpage_swift_us 
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bic', value: custpage_swift_us });
            }     
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function udateForiegnBankUS(ID, context, vendorID) {
            bankRecord = record.load({ type: 'customrecord_2663_entity_bank_details', id: ID, isDynamic: true, });
            var payment_type_us = context.request.parameters.custpage_payment_type_us
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_file_format', value: payment_type_us });
            custpage_account_number_us = context.request.parameters.custpage_account_number_us
            bankRecord.setValue({ fieldId: 'custrecord_2663_entity_acct_no', value: custpage_account_number_us });
            if (payment_type_us == 72) {

                setPaymentMethod(vendorID, 9 , true)
                custpage_bank_number_us = context.request.parameters.custpage_bank_number_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_no', value: custpage_bank_number_us });

                custpage_bank_account_type_us = context.request.parameters.custpage_bank_account_type_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_acct_type', value: custpage_bank_account_type_us });

            }
            else {
                setPaymentMethod(vendorID, 4,false)
                custpage_bank_name_us = context.request.parameters.custpage_bank_name_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bank_name', value: custpage_bank_name_us });
                custpage_iban_us = context.request.parameters.custpage_iban_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_iban', value: custpage_iban_us });
                custpage_bank1_us = context.request.parameters.custpage_bank1_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_address1', value: custpage_bank1_us });
                custpage_bank2_us = context.request.parameters.custpage_bank2_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_address2', value: custpage_bank2_us });
                custpage_swift_us = context.request.parameters.custpage_swift_us
                bankRecord.setValue({ fieldId: 'custrecord_2663_entity_bic', value: custpage_swift_us });
            }          
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }       
        function getBankDetails(vendorId) { // finance =2
            var SearchObj = search.create({
                type: 'customrecord_2663_entity_bank_details',
                filters:
                    [
                        ["custrecord_2663_parent_vendor", "anyof", vendorId],
                    ],
                columns:
                    [
                        "internalid", "custrecord_2663_entity_acct_name", "custrecord_2663_entity_acct_no", "custrecord_2663_entity_bank_no", "custrecord_2663_entity_branch_no",
                        "custrecord_2663_entity_file_format", "custrecord_2663_entity_bank_acct_type", "custrecord_2663_entity_bank_name", "custrecord_2663_entity_iban",
                        "custrecord_2663_entity_address1", "custrecord_2663_entity_address2", "custrecord_2663_entity_bic"
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push({
                    internalid: result.getValue({ name: "internalid" }),
                    acct_name: result.getValue({ name: "custrecord_2663_entity_acct_name" }),
                    acct_no: result.getValue({ name: "custrecord_2663_entity_acct_no" }),
                    bank_no: result.getValue({ name: "custrecord_2663_entity_bank_no" }),
                    branch_no: result.getValue({ name: "custrecord_2663_entity_branch_no" }),
                    file_format: result.getValue({ name: "custrecord_2663_entity_file_format" }),
                    bank_acct_type: result.getValue({ name: "custrecord_2663_entity_bank_acct_type" }),
                    entity_bank_name: result.getValue({ name: "custrecord_2663_entity_bank_name" }),
                    entity_iban: result.getValue({ name: "custrecord_2663_entity_iban" }),
                    entity_address1: result.getValue({ name: "custrecord_2663_entity_address1" }),
                    entity_address2: result.getValue({ name: "custrecord_2663_entity_address2" }),
                    entity_swift: result.getValue({ name: "custrecord_2663_entity_bic" }),
                    
                    
                    
                })
                return true;
            });
            return res;
        }
        function getBankDetailsList(field, bank) {

            var SearchObj = search.create({
                type: 'customrecord_ilo_bank_details',
                filters:
                    [
                        ["name", "isnot", "#VALUE!"],
                    ],
                columns:
                    [
                        "internalid", "name",
                    ]
            });
            field.addSelectOption({
                value: '',
                text: ''
            });
            SearchObj.run().each(function (result) {
                var val = result.getValue({ name: "internalid" })
                if (val == bank) {
                    field.addSelectOption({
                        value: val,
                        text: result.getValue({ name: "name" }),
                        isSelected: true
                    });
                }
                else {
                    field.addSelectOption({
                        value: val,
                        text: result.getValue({ name: "name" })
                    });
                }
                return true;
            });
        }
        function createILBank(vendorID, bankData) {
            bankRecord = record.create({ type: 'customrecord_ilo_vendor_bank', isDynamic: true, });
            bankRecord.setValue({ fieldId: 'custrecord_ilo_vendor_bank_vendor', value: vendorID });
            bankRecord.setValue({ fieldId: 'custrecord_ilo_vendor_bank_bank', value: bankData.custpage_bank_details });
            bankRecord.setValue({ fieldId: 'custrecord_ilo_bank_account_name', value: bankData.custpage_bank_name });
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function udateILBank(ID, bankData) {
            bankRecord = record.load({ type: 'customrecord_ilo_vendor_bank', id: ID, isDynamic: true, });
            bankRecord.setValue({ fieldId: 'custrecord_ilo_vendor_bank_bank', value: bankData.custpage_bank_details });
            bankRecord.setValue({ fieldId: 'custrecord_ilo_bank_account_name', value: bankData.custpage_bank_name });
            bankRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function getILBankDetails(vendorId) { // finance =2
            var SearchObj = search.create({
                type: 'customrecord_ilo_vendor_bank',
                filters:
                    [
                        ["custrecord_ilo_vendor_bank_vendor", "anyof", vendorId],
                    ],
                columns:
                    [
                        "internalid", "custrecord_ilo_vendor_bank_bank", "custrecord_ilo_bank_account_name"
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push({
                    internalid: result.getValue({ name: "internalid" }),
                    bank_bank: result.getValue({ name: "custrecord_ilo_vendor_bank_bank" }),
                    account_name: result.getValue({ name: "custrecord_ilo_bank_account_name" }),
                })
                return true;
            });
            return res;
        }
        function getFolder(vendRecId) {
            var SearchObj = search.create({
                type: 'folder',
                filters:
                    [
                        ["name", "is", vendRecId]
                    ],
                columns:
                    [
                        "internalid"
                    ]
            });
            var val;
            SearchObj.run().each(function (result) {
                val = result.getValue({ name: "internalid" });
                return true;
            });
            return val
        }
        function createFolder(vendRecId) {
            folderRecord = record.create({
                type: record.Type.FOLDER,
                isDynamic: true,
            });
            folderRecord.setValue({
                fieldId: 'parent',
                value: 836420
            });
            folderRecord.setValue({
                fieldId: 'name',
                value: vendRecId
            });
            folderId = folderRecord.save({ enableSourcing: true, ignoreMandatoryFields: true });
            if (folderId != -1) {
                return folderId
            }

            return folderId;
        }
        function createFile(Folder, vendorID, file) {
            file.folder = Folder;
            var id = file.save();
            log.debug('file id', id)
            record.attach({
                record: {
                    type: 'file',
                    id: id
                },
                to: {
                    type: 'vendor',
                    id: vendorID,
                }
            });
        }
        function getSubData(sub) {
            var subData = [];
            subRecord = record.load({ type: 'subsidiary', id: sub, isDynamic: true, });
            var address = subRecord.getValue({ fieldId: 'mainaddress_text' });
            subData.push(address)
            var group_distrib_list = subRecord.getValue({ fieldId: 'custrecord_ncs_ap_group_distrib_list' });
            subData.push(group_distrib_list)
            var payable_email = subRecord.getValue({ fieldId: 'custrecord_accounts_payable_email' });
            subData.push(payable_email)
            return subData
        }
        function getTaxVat(country, custpage_currency, custpage_taxvat) {
            if (country == 'IL' && custpage_currency == 'ILS') { return custpage_taxvat }
            else if (isNullOrEmpty(custpage_taxvat)) { return '999999999' }
            else return custpage_taxvat
        }
        function AttachmentDocs(vendorID, context) {

            var Folder = getFolder(vendorID);
            if (isNullOrEmpty(Folder)) {
                var Folder = createFolder(vendorID)
            }
            var file = context.request.files.custpage_file;
            if (!isNullOrEmpty(file)) { createFile(Folder, vendorID, file) }
            var file2 = context.request.files.custpage_file2;
            if (!isNullOrEmpty(file2)) { createFile(Folder, vendorID, file2) }
            var file3 = context.request.files.custpage_file3;
            if (!isNullOrEmpty(file3)) { createFile(Folder, vendorID, file3) }
            var file4 = context.request.files.custpage_file4;
            if (!isNullOrEmpty(file4)) { createFile(Folder, vendorID, file4) }
            var file5 = context.request.files.custpage_file5;
            if (!isNullOrEmpty(file5)) { createFile(Folder, vendorID, file5) }
        }
        function sendEmailToCreator(account_email, vendRecId ) {
            try {
                if (!isNullOrEmpty(account_email)) {
                    var mergeResult = render.mergeEmail({
                        templateId: 46,
                        entity: {
                            type: 'vendor',
                            id: parseInt(vendRecId)
                        },
                        recipient: null,
                        supportCaseId: null,
                        transactionId: null,
                        customRecord: null
                    });
                    var emailSubject = mergeResult.subject;
                    //log.error('emailSubject:', emailSubject);
                    var emailBody = mergeResult.body;                   
                    var urlScript =getURL(vendRecId)
                    emailBody = emailBody.replace('#url#', urlScript);

                    email.send({
                        author: account_email.split('\x05')[0],
                        recipients: account_email.split('\x05'),
                        subject: emailSubject,
                        body: emailBody,
                    });
                    log.debug('send email:', emailBody);
                }
            } catch (e) {
                log.error('error sendEmail :', e);
            }
        }
        function getURL(vendRecId) {
            var outputURL = url.resolveRecord({
                recordType: 'vendor',
                recordId: vendRecId,
                isEditMode: false
            });
            return outputURL;
        }
        function setPaymentMethod(vendorID, vendor_pay_method,payment_method ) {
            record.submitFields({
                type: record.Type.VENDOR, id: vendorID,
                values: { 'custentity_il_vendor_pay_method': vendor_pay_method, 'custentity_2663_payment_method': payment_method,},
                options: { enableSourcing: false, ignoreMandatoryFields: true }
            });            
        }
        return {
            onRequest: onRequest
        };
    });

