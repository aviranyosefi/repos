// JavaScript source code


function beforSubmit(type) {

    if (type == 'edit') {
        var num = nlapiGetFieldValue('custentityil_tax_payer_id');
        var res = LegalId(num);
        if (!res) {
            throw nlapiCreateError("ERROR", "Invalid TAX PAYER ID", false);
            return false;
        }
    }
}



function LegalId(num) {
    try {
        if (isNaN(num)) {
            return false;
        }
        if (num <= 510000000 || num >= 589999999) {
            return false;
        }

        var tot = 0;
        var tz = new String(num);
        for (i = 0; i < 8; i++) {
            x = (((i % 2) + 1) * tz.charAt(i));
            if (x > 9) {
                x = x.toString();
                x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
            }
            tot += x;
        }
        
        if ((tot + parseInt(tz.charAt(8))) % 10 == 0) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        nlapiLogExecution('error', 'LegalId().', e);
    }
}

function isIsraeliIdValid(id) {
    let strId = String(id).trim();
    if (strId.length > 9) {
        return false;
    }
    if (strId.length < 9) {
        while (strId.length < 9) strId = "0" + strId;
    }
    let counter = 0, rawVal, actualVal;
    for (let i = 0; i < strId.length; i++) {
        rawVal = Number(strId[i]) * ((i % 2) + 1);
        actualVal = rawVal > 9 ? (rawVal - 9) : rawVal;
        counter += actualVal;
    }
    return (counter % 10 === 0);
};