

function ipValidation(type, name) {

    var typeRec = nlapiGetRecordType();
    if (typeRec == 'customrecord_router') {

        if (name == 'custrecord_router_management_ip_address') {

            var ip = nlapiGetFieldValue('custrecord_router_management_ip_address');
            if (ip != '') {
                if (CheckIP(ip)) { alert("Valid IP"); return true; }
                else { alert("Invalid IP"); nlapiSetFieldValue('custrecord_router_management_ip_address', ''); return true; }
            }
            else return true;
        }
        else return true;

    }

    else if (typeRec == 'customrecord_ip_address') {

        if (name == 'custrecord_start_ip' || name == 'custrecord_end_ip') {

            var ip = nlapiGetFieldValue(name);
            if (ip != '') {
                if (CheckIP(ip)) {  return true; }
                else { alert("Invalid IP"); nlapiSetFieldValue(name, ''); return true; }
            }
            else return true;
        }
        else return true;
    }

    else if (typeRec == 'customrecord_modem') {

        if (name == 'custrecord_modem_management_ip_address' || name == 'custrecord_modem_data_ip_address') {

            var ip = nlapiGetFieldValue(name);
            if (ip != '') {
                if (CheckIP(ip)) { alert("Valid IP"); return true; }
                else { alert("Invalid IP"); nlapiSetFieldValue(name, ''); return true; }
            }
            else return true;
        }
        else return true;
    }

    else if (typeRec == 'customrecord_site') {

        if (name == 'custrecord_site_bgp_ipa1'
            || name == 'custrecord_site_bgp_ipa2'
            || name == 'custrecord_site_bgp_ipa3'
            || name == 'custrecord_site_bgp_ipa4'
            || name == 'custrecord_site_bgp_ipa5'
            || name == 'custrecord_site_bgp_ipa6'
            || name == 'custrecord_site_bgp_ipa7'
            || name == 'custrecord_site_bgp_ipa8'
            || name == 'custrecord_site_bgp_ipa9'
            || name == 'custrecord_site_bgp_ipa10'
            || name == 'custrecord_site_router_ip_address') {

            var ip = nlapiGetFieldValue(name);
            if (ip != '') {
                if (CheckIP(ip)) { alert("Valid IP"); return true; }
                else { alert("Invalid IP"); nlapiSetFieldValue(name, ''); return true; }
            }
            else return true;
        }
        else return true;
    }

    // end if else
    else return true;

 
}


function CheckIP(IPText) {

    ValidIP = false;
    if (!isNaN(IPText)) {
        return false;
    }
    ipParts = IPText.split(".");
    if (ipParts.length == 4) {
        for (i = 0; i < 4; i++) {

            TheNum = ipParts[i];
            if (TheNum >= 0 && TheNum <= 255) { }
            else { break; }

        }
        if (i == 4) ValidIP = true;
    }
    if (ValidIP) return true;
    else return false;
}