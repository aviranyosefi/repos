var StatusObj = {

    'A': 'Pending Approval',
    'B': 'Pending Fulfillment',
    'C': 'Cancelled',
    'D': 'Partially Fulfilled',
    'E': 'Pending Billing/Partially Fulfilled',
    'F': 'Pending Billing',
    'G': 'Billed',
    'H': 'Closed'
}
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

/**
* Module Description
* 
 * Version    Date            Author           Remarks
* 1.00       02 May 2019     idor + mosheb
*
*/

/**
* The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
* 
 * @param {String} type Operation types: create, edit, delete, xedit,
*                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
*                      pack, ship (IF only)
*                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
* @returns {Void}
*/
function checkSOForUpdates_workato(type) {

    var recType = nlapiGetRecordType();

    nlapiLogExecution('debug', 'type of execution', type);
    nlapiLogExecution('debug', 'type of record', recType);

    var isCancel = false;
    var invoiceCreated = false;
    var invoiceNumber;
    if (type == 'cancel') {
        try {
            nlapiLogExecution('debug', 'order is cancelled', 'true');

            isCancel = true;
           

            var recID = nlapiGetRecordId()
            var postData = checkForChanges(recID, isCancel, false);
            // if check == null (no changes occured)
            // if check returns an object (a change occured and json is to be sent to Workato)
            if (postData != null) {
                var url = environment();
                nlapiLogExecution('debug', 'field was changed - postData', JSON.stringify(postData));
                var res = nlapiRequestURL(url, JSON.stringify(postData), null, null, 'POST');
                nlapiLogExecution('audit', 'response:', res.getBody());
            }
        }
        catch (err) {
            nlapiLogExecution('error', 'error in checking for workato updates', err)
        }


    }

    if (type == 'edit') {
        try {
            nlapiLogExecution('audit', 'checkSOForUpdates_workato', '1');
            var recID = nlapiGetRecordId()
            var postData = checkForChanges(recID, isCancel, false);
            // if check == null (no changes occured)
            // if check returns an object (a change occured and json is to be sent to Workato)
            if (postData != null) {
                var url = environment();
                nlapiLogExecution('debug', 'field was changed - postData', JSON.stringify(postData));
                var res = nlapiRequestURL(url, JSON.stringify(postData), null, null, 'POST');
                nlapiLogExecution('audit', 'response:', res.getBody());
            }
        }
        catch (err) {
            nlapiLogExecution('error', 'error in checking for workato updates', err)
        }
    }

    if (type == 'create' && recType == 'invoice') {
        try {
            isCancel = false;
            nlapiLogExecution('audit', 'type == create', '1');
            //
            var SalesOrder = nlapiGetFieldValue('createdfrom');
            var invRec = nlapiGetRecordId()
            nlapiLogExecution('audit', 'createdfrom: ', SalesOrder);
            if (SalesOrder != "" && SalesOrder != null) {
                invoiceCreated = true;
                var rec = nlapiLoadRecord('invoice', invRec);
                invoiceNumber = rec.getFieldValue('tranid')
                nlapiLogExecution('debug', 'invoiceNumber', invoiceNumber)
                var postData = checkForChanges(SalesOrder, isCancel, invoiceCreated);
                if (postData != null) {
                    var url = environment();
                    nlapiLogExecution('debug', 'field was changed - postData', JSON.stringify(postData));
                    var res = nlapiRequestURL(url, JSON.stringify(postData), null, null, 'POST');
                    nlapiLogExecution('audit', 'response:', res.getBody());
                }
                //

            }

        } catch (err) {
            nlapiLogExecution('error', 'create - error in checking for workato updates', err)
        }

    }


    function checkForChanges(recID, isCancel, invoiceCreated) {
        nlapiLogExecution('audit', 'checkSOForUpdates_workato', '2');

        if (invoiceCreated && !isCancel) {
            nlapiLogExecution('audit', 'invoiceCreated', invoiceCreated);
            checkwaschanged = true;
            newTrandate = ""
            newPOnumber = ""
            newJfrogPurchaseType = ""
            newWorkflowCurrentState = ""
            newStatus = ""
            newCustomerType = ""
            newCustomerCategory = ""
            newOrderType = ""
            newOrderOwner = ""
            newSalesPerson = ""
            newPaymentType = ""
            newshipcountry = ""
            newshipstate = ""
            newshipcity = ""
            newshipaddressee = ""
            newshipzip = ""
            newbillcountry = ""
            newbillstate = ""
            newbillcity = ""
            newbilladdressee = ""
            newbillzip = ""

        }
        else {
            invoiceNumber = "";
            // Old and New record instances are retrieved from global functions
            var newRec = nlapiGetNewRecord();
            var oldRec = nlapiGetOldRecord();
            var fieldchanged = "";


            var newTrandate = newRec.getFieldValue('trandate')
            var newPOnumber = newRec.getFieldValue('otherrefnum')
            var newJfrogPurchaseType = newRec.getFieldValue('custbody_po_type')
            var newPaymentType = newRec.getFieldValue('custbody_pay_type')
            var newWorkflowCurrentState = newRec.getFieldValue('custbody_workflow_current_state')
            var newStatus = newRec.getFieldValue('orderstatus')
            var newCustomerType = newRec.getFieldValue('custbody_cust_type')
            var newCustomerCategory = newRec.getFieldValue('custbody_jfrog_cust_category')
            var newOrderType = newRec.getFieldValue('custbody_order_type')
            var newOrderOwner = newRec.getFieldValue('custbody_order_owner')
            var newSalesPerson = newRec.getFieldValue('custbody_sf_sp')

            var newshipaddressee = newRec.getFieldValue('shipaddressee')
            var newshipcountry = newRec.getFieldValue('shipcountry')
            var newshipstate = newRec.getFieldValue('shipstate')
            var newshipcity = newRec.getFieldValue('shipcity')
            var newshipzip = newRec.getFieldValue('shipzip')

            var newbilladdressee = newRec.getFieldValue('billaddressee')
            var newbillcountry = newRec.getFieldValue('billcountry')
            var newbillstate = newRec.getFieldValue('billstate')
            var newbillcity = newRec.getFieldValue('billcity')
            var newbillzip = newRec.getFieldValue('billzip')

            var newinvoicecreated = newRec.getFieldValue('custbody_invoice_created')

            ///////////////////////////////////////////////////////////////////////////
            var oldTrandate = oldRec.getFieldValue('trandate')
            var oldPOnumber = oldRec.getFieldValue('otherrefnum')
            var oldJfrogPurchaseType = oldRec.getFieldValue('custbody_po_type')
            var oldPaymentType = oldRec.getFieldValue('custbody_pay_type')
            var oldWorkflowCurrentState = oldRec.getFieldValue('custbody_workflow_current_state')
            var oldStatus = oldRec.getFieldValue('orderstatus')
            var oldCustomerType = oldRec.getFieldValue('custbody_cust_type')
            var oldCustomerCategory = oldRec.getFieldValue('custbody_jfrog_cust_category')
            var oldOrderType = oldRec.getFieldValue('custbody_order_type')
            var oldOrderOwner = oldRec.getFieldValue('custbody_order_owner')
            var oldSalesPerson = oldRec.getFieldValue('custbody_sf_sp')

            var oldshipaddressee = oldRec.getFieldValue('shipaddressee')
            var oldshipcountry = oldRec.getFieldValue('shipcountry')
            var oldshipstate = oldRec.getFieldValue('shipstate')
            var oldshipcity = oldRec.getFieldValue('shipcity')
            var oldshipzip = oldRec.getFieldValue('shipzip')

            var oldbilladdressee = oldRec.getFieldValue('billaddressee')
            var oldbillcountry = oldRec.getFieldValue('billcountry')
            var oldbillstate = oldRec.getFieldValue('billstate')
            var oldbillcity = oldRec.getFieldValue('billcity')
            var oldbillzip = oldRec.getFieldValue('billzip')

            var oldinvoicecreated = oldRec.getFieldValue('custbody_invoice_created')


            var checkwaschanged = false;

            //Checking for actual changes
            if (newTrandate != oldTrandate) {
                fieldchanged = newTrandate;
                checkwaschanged = true;
            }
            else newTrandate = "";

            if (newPOnumber != oldPOnumber) {
                nlapiLogExecution('audit', 'newPOnumber', newPOnumber + ' ' + oldPOnumber);
                nlapiLogExecution('audit', 'newPOnumber', newPOnumber != oldPOnumber);
                fieldchanged = newPOnumber;
                checkwaschanged = true;
            }
            else newPOnumber = "";


            if (newJfrogPurchaseType != oldJfrogPurchaseType) {
                fieldchanged = newJfrogPurchaseType;
                checkwaschanged = true;
            }
            else newJfrogPurchaseType = "";


            if (newPaymentType != oldPaymentType) {
                fieldchanged = newPaymentType;
                checkwaschanged = true;
            }
            else newPaymentType = "";


            if (newWorkflowCurrentState != oldWorkflowCurrentState) {
                fieldchanged = newWorkflowCurrentState;
                checkwaschanged = true;
            }
            else newWorkflowCurrentState = "";
            // checkwaschanged = true;
            nlapiLogExecution('audit', 'newStatus', newStatus);
            nlapiLogExecution('audit', 'oldStatus', oldStatus);
            if (newStatus != oldStatus) {
                fieldchanged = newStatus;
                newStatus = StatusObj[newStatus];
                checkwaschanged = true;
            }
            else newStatus = "";


            if (newCustomerType != oldCustomerType) {
                fieldchanged = newCustomerType;
                checkwaschanged = true;
            }
            else newCustomerType = "";


            if (newCustomerCategory != oldCustomerCategory) {
                fieldchanged = newCustomerCategory;
                checkwaschanged = true;
            }
            else newCustomerCategory = "";


            if (newOrderType != oldOrderType) {
                fieldchanged = newOrderType;
                checkwaschanged = true;
            }
            else newOrderType = "";


            if (newOrderOwner != oldOrderOwner) {
                fieldchanged = newOrderOwner;
                checkwaschanged = true;
            }
            else newOrderOwner = "";


            if (newSalesPerson != oldSalesPerson) {
                fieldchanged = newSalesPerson;
                checkwaschanged = true;
            }
            else newSalesPerson = "";


            if ((newshipaddressee != oldshipaddressee) || (newshipcountry != oldshipcountry) || (newshipstate != oldshipstate) || (newshipcity != oldshipcity) || (newshipzip != oldshipzip)) {
                // fieldchanged = newShipAddress;
                newshipcountry = countryList[newshipcountry].country
                checkwaschanged = true;
            }
            else { newshipcountry = ""; newshipstate = ""; newshipcity = ""; newshipaddressee = ""; newshipzip = ""; }
            if ((newbilladdressee != oldbilladdressee) || (newbillcountry != oldbillcountry) || (newbillstate != oldbillstate) || (newbillcity != oldbillcity) || (newbillzip != oldbillzip)) {
                //fieldchanged = newBillAddress;
                nlapiLogExecution('audit', 'newbillcountry:  ', newbillcountry);
                newbillcountry = countryList[newbillcountry].country
                nlapiLogExecution('audit', 'newbillcountry:  ', newbillcountry);
                checkwaschanged = true;
            }
            else { newbilladdressee = ""; newbillcountry = ""; newbillstate = ""; newbillcity = ""; newbillzip = ""; }
        }

        nlapiLogExecution('audit', 'checkwaschanged:  ', checkwaschanged);
        if (checkwaschanged && !isCancel && !invoiceCreated) {
            //A field has been changed - set workato obj and return it

            // var rec = nlapiLoadRecord('salesorder', recID);


            var workatoObj = {
                NS_Internal_Id: recID,
                Tran_Date: newTrandate,
                PO_Num: newPOnumber,
                Purchase_Type: newJfrogPurchaseType,
                Worflow_Current_State: newWorkflowCurrentState,
                NS_Order_Status: newStatus,
                Customer_Type: newCustomerType,
                Customer_Category: newCustomerCategory,
                Order_Type: newOrderType,
                Order_Owner: newOrderOwner,
                Sales_Person: newSalesPerson,
                Payment_Type: newPaymentType,
                Shipping_Country: newshipcountry,
                Shipping_State: newshipstate,
                Shipping_City: newshipcity,
                Shipping_Street: newshipaddressee,
                Shipping_Postal_Code: newshipzip,
                Billing_Country: newbillcountry,
                Billing_State: newbillstate,
                Billing_City: newbillcity,
                Billing_Street: newbilladdressee,
                Billing_Postal_Code: newbillzip,
                Invoice_Number: invoiceNumber,
            }

            return workatoObj;

        }

        if (isCancel) {

            var workatoObj = {
                NS_Internal_Id: recID,
                Tran_Date: newTrandate,
                PO_Num: newPOnumber,
                Purchase_Type: newJfrogPurchaseType,
                Worflow_Current_State: newWorkflowCurrentState,
                NS_Order_Status: 'Cancelled',
                Customer_Type: newCustomerType,
                Customer_Category: newCustomerCategory,
                Order_Type: newOrderType,
                Order_Owner: newOrderOwner,
                Sales_Person: newSalesPerson,
                Payment_Type: newPaymentType,
                Shipping_Country: newshipcountry,
                Shipping_State: newshipstate,
                Shipping_City: newshipcity,
                Shipping_Street: newshipaddressee,
                Shipping_Postal_Code: newshipzip,
                Billing_Country: newbillcountry,
                Billing_State: newbillstate,
                Billing_City: newbillcity,
                Billing_Street: newbilladdressee,
                Billing_Postal_Code: newbillzip,
                Invoice_Number: invoiceNumber,
            }

            return workatoObj;


        }
        if (invoiceCreated) {

            var workatoObj = {
                NS_Internal_Id: recID,
                Tran_Date: "",
                PO_Num: "",
                Purchase_Type: '',
                Worflow_Current_State: '',
                NS_Order_Status: 'Billed',
                Customer_Type: '',
                Customer_Category: '',
                Order_Type: '',
                Order_Owner: '',
                Sales_Person: '',
                Payment_Type: '',
                Shipping_Country: '',
                Shipping_State: '',
                Shipping_City: '',
                Shipping_Street: '',
                Shipping_Postal_Code: '',
                Billing_Country: '',
                Billing_State: '',
                Billing_City: '',
                Billing_Street: '',
                Billing_Postal_Code: '',
                Invoice_Number: invoiceNumber,
            }

            return workatoObj;

        }
        else {
            //No changes occured return null
            return null;
        }


    }

    function environment() {
        var url;
        nlapiLogExecution('audit', 'nlapiGetContext().getEnvironment():', nlapiGetContext().getEnvironment());
        if (nlapiGetContext().getEnvironment() == 'PRODUCTION') {
            url = "https://www.workato.com/webhooks/rest/90076a68-0ba3-4091-aa8d-9da27893cfd6/production-ns-order-updated";   
        }
        else url = "https://www.workato.com/webhooks/rest/90076a68-0ba3-4091-aa8d-9da27893cfd6/ns-order-updated";

        return url;
    }
    function searchInvoice(saleId) {
        try {
            nlapiLogExecution('audit', 'searchInvoice start:  ', '3');
            var res;
            var result;
            var resultsmulti = [];
            var invoice = [];
            var filters = new Array();
            filters[0] = new nlobjSearchFilter('createdfrom', null, 'anyof', saleId);
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('tranid');

            var search = nlapiCreateSearch('invoice', filters, columns);
            var runSearch = search.runSearch();
            res = runSearch.getResults(0, 1)
            nlapiLogExecution('audit', 'res :  ', res[0]);
            resultsmulti.push(res[0]);
            if (resultsmulti != "" & resultsmulti != null) {
                nlapiLogExecution('audit', 'resultsmulti :  ', resultsmulti.length);
                resultsmulti.forEach(function (line) {
                    invoice.push({
                        inv: line.getValue('tranid'),
                    });
                });

                if (invoice != "" && invoice != null) result = invoice[0].inv;
                nlapiLogExecution('audit', 'searchInvoice finish:  ', result);
                return result;
            }

        } catch (e) {
            // nlapiLogExecution('error', 'searchInvoice function', e)

        }
    }



}
