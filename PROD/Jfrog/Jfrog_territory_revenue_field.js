function beforeSubmit() {

    try {
        //var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
        //var customer = rec.getFieldValue('entity');

        //var customer = nlapiGetFieldValue('entity');
        //nlapiLogExecution('debug', 'customer ', customer)
        //var country = nlapiLookupField('customer', customer, 'shipcountry')
        var country = nlapiGetFieldValue('shipcountry');
        nlapiLogExecution('debug', 'country ', country)
        if (country != "" && country != null && country != undefined) {
            var countryName = CountryList(country)
            var territory = jfrog_territory(countryName);
            if (territory != "" && territory != null && territory != undefined) {
                nlapiSetFieldValue('custbody_jfrog_territory_revenue', territory);
            }
        }
    } catch (e) { }
}


    


    function afterSubmit() {

        try {
            var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());          
            var country = rec.getFieldValue('shipcountry');
            //nlapiLogExecution('debug', 'country ', country)
            if (country != "" && country != null && country != undefined) {
                var countryName = CountryList(country)
                var territory = jfrog_territory(countryName);
                if (territory != "" && territory != null && territory != undefined) {
                    rec.setFieldValue('custbody_jfrog_territory_revenue', territory);
                    nlapiSubmitRecord(rec);
                }
            }
        } catch (e) { }



    }




function jfrog_territory(country) {

    try { 
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('custrecord_jfrog_enduser_country', null, 'is', country) 

        var columns = new Array();
        columns[0] = new nlobjSearchColumn('custrecord_jfrog_territory');
 
        var search = nlapiCreateSearch('customrecord_jfrog_territory', filters, columns);

        var resultset = search.runSearch();
        var s = [];
        var searchid = 0;
        var results = '';

        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        if ( !(Object.keys(s).length === 0)) {

            results = s[0].getValue('custrecord_jfrog_territory');
            return results;
       
        }
       
    } catch (e) {
        return results;
    }
}

function CountryList(countryCode) {


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

    return countryList[countryCode].country;

}