function afterSubmit(type) {
    try {
        var recordType = nlapiGetRecordType();
        if (type == 'create' && recordType == 'salesorder') {
            var rec = nlapiLoadRecord('salesorder', nlapiGetRecordId())
            if (serachAgreement(rec.getFieldValue('entity')) == 0) {
                createAgreement(rec);
            }
        }
        else if (recordType == 'invoice' && type != 'delete') {
            var recId = nlapiGetRecordId()
            var rec = nlapiLoadRecord('invoice', recId)
            var agr = rec.getFieldValue('custbody_ser_agr');
            if (!isNullOrEmpty(agr)) {
                var data = [];
                var agr_type = nlapiLookupField('customrecord_agreement', agr, 'custrecord_agr_type')
                nlapiLogExecution('debug', 'agr_type', agr_type);
                var count = rec.getLineItemCount('item');
                if (type == 'create') {
                    try { nlapiScheduleScript('customscript_bs_ss', null, { custscript_bs_ss_id: recId }) } catch (e) { }
                }  
                for (var i = 1; i <= count; i++) {                                    
                    if (agr_type == 1) {
                        data.push({
                            item: rec.getLineItemText('item', 'item', i),
                            des: rec.getLineItemValue('item', 'description', i),
                            sDate: rec.getLineItemValue('item', 'custcol_rev_rec_start', i),
                            eDate: rec.getLineItemValue('item', 'custcol_rev_rec_end', i),
                            qty: rec.getLineItemValue('item', 'quantity', i),
                            rate: rec.getLineItemValue('item', 'rate', i),
                            amt: rec.getLineItemValue('item', 'amount', i),
                            memo_type: rec.getLineItemText('item', 'custcol_invoice_memo_type', i),
                        });
                    }
                }
                if (agr_type == 1) {
                    var data = SortAgrLines(data);
                    if (data != '') {
                        rec.setFieldValue('custbody_prodocts', data)
                    }
                }
            }
            if (type == 'create') {
                var emails = getContactEmails(rec.getFieldValue('entity'));
                if (!isNullOrEmpty(emails)) {
                    rec.setFieldValue('email', emails)
                }
            }
         
            nlapiLogExecution('debug', 'nlapiSubmitRecord rec', rec);
            nlapiSubmitRecord(rec, null, true);
        }
    } catch (e) {
        nlapiLogExecution('ERROR', 'error afterSubmit', e);
    }
}
function serachAgreement(entity) {
    try {
        var filters = new Array();
        filters.push(new nlobjSearchFilter('custrecord_agr_bill_cust', null, 'anyof', entity));
        filters.push(new nlobjSearchFilter('custrecord_agr_type', null, 'anyof', '2')); //Maintenance  

        var search = nlapiCreateSearch('customrecord_agreement', filters, null);
        var runSearch = search.runSearch();

        var s = [];
        var searchid = 0;
        do {

            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        try {
            if (s.length > 0) return s[0].id
            else return 0;
        }
        catch (e) {
            return 0;
        }
        return 0;
    } catch (e) {
        nlapiLogExecution('ERROR', 'error serachAgreement', e);
    }

}
function createAgreement(rec) {
    try {

        var AGR_rec = nlapiCreateRecord('customrecord_agreement');

        AGR_rec.setFieldValue('name', data[i].name);
        AGR_rec.setFieldText('custrecord_agr_type', 2);//Maintenance 
        AGR_rec.setFieldText('custrecord_agr_bill_cust', rec.getFieldValue('entity'));
        AGR_rec.setFieldText('custrecord_agr_so', rec.getFieldValue('id'));

        var id = nlapiSubmitRecord(AGR_rec);
        nlapiLogExecution('debug', 'AGREEMENT ID: ', id);


    } catch (e) {
        nlapiLogExecution('ERROR', 'error createAgreement', e);
    }
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getContactEmails(entity) {

    var search = nlapiLoadSearch(null, 'customsearch_contact_for_invoice');
    search.addFilter(new nlobjSearchFilter('company', null, 'anyof', entity));
    var s = [];
    var searchid = 0;
    var resultset = search.runSearch();
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null && s.length > 0) {
        var emails = '';
        for (var i = 0; i < s.length; i++) {
            if (i != s.length - 1) {
                emails += s[i].getValue('email') + ','
            }
            else {
                emails += s[i].getValue('email');
            }
        }
    }
    return emails;
}
function SortAgrLines(data) {
    try {
        data.sort(dynamicSortMultiple("item", "des", "sDate", "eDate", "rate"));
        var pre_item = data[0].item;
        var pre_rate = data[0].rate;
        var pre_qty = data[0].qty;
        var pre_des = data[0].des;
        var pre_sDate = data[0].sDate;
        var pre_eDate = data[0].eDate;
        var memo_type = data[0].memo_type;
        var qty = Number(pre_qty);
        var line = 1;
        var dataSort = '';
        for (var i = 1; i < data.length; i++) {
            if (pre_item == data[i].item && pre_rate == data[i].rate && pre_des == data[i].des && pre_sDate == data[i].sDate && pre_eDate == data[i].eDate) {
                qty += Number(data[i].qty);
            } else {
                if (qty == 0) { qty = pre_qty }
                dataSort += line + '^';
                dataSort += pre_item + '^';
                dataSort += pre_des + '^';
                dataSort += memo_type + '^';
                dataSort += qty + '^';
                dataSort += pre_rate + '^';
                dataSort += formatNumber(pre_rate * qty) + '^';
                dataSort += pre_sDate + '^';
                dataSort += pre_eDate + '~~';
                line += 1;
                qty = Number(data[i].qty);
                var pre_item = data[i].item;
                var pre_rate = data[i].rate;
                var pre_qty = data[i].qty;
                var pre_des = data[i].des;
                var pre_sDate = data[i].sDate;
                var pre_eDate = data[i].eDate;
                var memo_type = data[i].memo_type;
            }
        }
        dataSort += line + '^';
        dataSort += pre_item + '^';
        dataSort += pre_des + '^';
        dataSort += memo_type + '^';
        dataSort += qty + '^';
        dataSort += pre_rate + '^';
        dataSort += formatNumber(pre_rate * qty) + '^';
        dataSort += pre_sDate + '^';
        dataSort += pre_eDate + '~~';
    } catch (e) {
        nlapiLogExecution('ERROR', 'error SortAgrLines', e);
    }
    nlapiLogExecution('debug', 'dataSort', dataSort);
    return dataSort;
}
function dynamicSort(property) {

    if (property == 'date') {
        return function (obj1, obj2) {
            return new Date(obj1.date) - new Date(obj2.date);
        }
    }
    else {
        return function (obj1, obj2) {
            return obj1[property] > obj2[property] ? 1
                : obj1[property] < obj2[property] ? -1 : 0;
        }
    }
}
function dynamicSortMultiple() {

    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}
function formatNumber(num) {
    if (num != '' && num != undefined && num != null) {
        num = num.toFixed(2)
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return num

}
