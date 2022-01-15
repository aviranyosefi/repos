// JavaScript source code
var record = nlapiCreateRecord('customrecord192');
record.setFieldValue('name', 'automatic generated');
record.setFieldValue('custrecord9', '0123456');
var date = new Date();
record.setFieldValue('custrecord10', nlapiStringToDate(currentDate));
record.setFieldValue('custrecord11', 'T');

record.setFieldValue('name', 'automatic generated');
record.setFieldValue('id', '\'' + i + '\'');
record.setFieldValue('custrecord13','5');
var internalId = nlapiSubmitRecord(record); 

/*
 var date = new Date();
var tdate = date.getDate();
var month = date.getMonth() + 1; // jan = 0
var year = date.getFullYear();
var currentDate = month + '/' + tdate + '/' + year;
var i =10;
    var str = i.toString();
    var record = nlapiCreateRecord('customrecord192');
    record.setFieldValue('name', 'automatic generated'+ str);
    record.setFieldValue('custrecord9', '0123456');
    var date = new Date();
    record.setFieldValue('custrecord10', nlapiStringToDate(currentDate));
    record.setFieldValue('custrecord11', 'T');

    record.setFieldValue('id',  i );
    record.setFieldValue('custrecord13', '5');

    var internalId = nlapiSubmitRecord(record);

 */

/*
 
var date = new Date();
var tdate = date.getDate();
var month = date.getMonth() + 1; // jan = 0
var year = date.getFullYear();
var currentDate = month + '/' + tdate + '/' + year;
for (var i = 20; i < 1020; i++) {
    var str = i.toString();
    var record = nlapiCreateRecord('customrecord192');
    record.setFieldValue('name', 'auto generated'+ str);
    record.setFieldValue('custrecord9', '0123456');
    record.setFieldValue('custrecord10', currentDate);
    record.setFieldValue('custrecord11', 'T');
    record.setFieldValue('custrecord13', 4);

    var internalId = nlapiSubmitRecord(record);
}


*/

localStorage.setItem('checks', 2);
localStorage.setItem('internalIdlocal', 1801);
function myFunction() {
    debugger;
    var temp = localStorage.getItem('checks');
    if (temp > 0) {
        var date = new Date();
        var tdate = date.getDate();
        var month = date.getMonth() + 1; // jan = 0
        var year = date.getFullYear();
        var currentDate = month + '/' + tdate + '/' + year;
        for (var i = localStorage.getItem('internalIdlocal'); i < (localStorage.getItem('internalIdlocal') + 100); i++) {
            console.log('run number i: #' + i);
            var str = i.toString();
            var record = nlapiCreateRecord('customrecord192');
            record.setFieldValue('name', 'auto generated' + str);
            record.setFieldValue('custrecord9', '0123456' + str);
            record.setFieldValue('custrecord10', currentDate);
            record.setFieldValue('custrecord11', 'T');
            record.setFieldValue('custrecord13', 4);

            var internalId = nlapiSubmitRecord(record);
        }
        alert('run number: #' + localStorage.getItem('checks'));
        localStorage.setItem('checks', localStorage.getItem('checks') -1);
        localStorage.setItem('internalIdlocal', (localStorage.getItem('internalIdlocal') + 101));
        window.location.reload();
    }
}

window.onload = function () {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        myFunction();
    }
}

function reloadP() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}

window.onload = function () {
    alert('window.onload')
}

if (window.addEventListener) {
    alert('firstif');
    window.addEventListener('load', function () { alert('test1') }, false);
} else if (window.attachEvent) {
    alert('secif');// IE < 9
    window.attachEvent('onload', function () {
        alert('test2')
    });
}

HTMLBodyElement.bindAsEventListener('')

nlapiGetContext().getRemainingUsage = function () { return 1000; }


/*   working code
 localStorage.setItem('checks', 2);
localStorage.setItem('internalIdlocal', 1968);
    var temp = localStorage.getItem('checks');
    if (temp > 0) {
        var date = new Date();
        var tdate = date.getDate();
        var month = date.getMonth() + 1; // jan = 0
        var year = date.getFullYear();
        var currentDate = month + '/' + tdate + '/' + year;
        for (var i = localStorage.getItem('internalIdlocal'); i < (localStorage.getItem('internalIdlocal') + 100); i++) {
            console.log('run number i: #' + i);
            var str = i.toString();
            var record = nlapiCreateRecord('customrecord192');
            record.setFieldValue('name', 'auto generated' + str);
            record.setFieldValue('custrecord9', '0123456' + str);
            record.setFieldValue('custrecord10', currentDate);
            record.setFieldValue('custrecord11', 'T');
            record.setFieldValue('custrecord13', 4);

            var internalId = nlapiSubmitRecord(record);
        }
        alert('run number: #' + localStorage.getItem('checks'));
        localStorage.setItem('checks', localStorage.getItem('checks') -1);
        localStorage.setItem('internalIdlocal', (localStorage.getItem('internalIdlocal') + 101));
nlapiGetContext().getRemainingUsage = function () { return 1000; }
    }

 
 */

/*
 var x = nlapiGetContext();
x.usage[x.getScriptId()];*/


/*stored function Search multiple text matches*/
function textSearch(type, matchArr){
    var arr = new Array();
    if (matchArr != null && matchArr != '') {
        if (matchArr.length > 0) {
            var filterExpressions = new Array();
            for (var i = 0; i < arr.length; i++) {
                filterExpressions.push([type, 'is', arr[i]]);
            }

        }
    }
    arr = matchArr.split(',');

    var filterExpressions = new Array();
    var fil1 = 'auto generated100';
    var fil2 = 'auto generated1001';
    var fil3 = 'auto generated1008';
    filterExpressions.push([['name', 'is', fil1], 'OR', ['name', 'is', fil2], 'OR', ['name', 'is', fil3]]);

}


 var filters = new Array();
    filters[0] = new nlobjSearchFilter('custrecord_oree_custommemo', null, 'isnotempty',null);
    //filters[1] = new nlobjSearchFilter('trandate', null, 'equalTo', 'today');

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('custrecord_oree_custommemo');
    //columns[1] = new nlobjSearchColumn('custrecord_oree_custommemo');


    var search = nlapiCreateSearch('customrecord192', filters,columns);
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

        var date = new Date();
        var tdate = date.getDate();
        var month = date.getMonth() + 1; // jan = 0
var year = date.getFullYear();
var hour = date.getHours();
var min = date.getMinutes();
var sec = date.getSeconds();
var currentDate = month + '/' + tdate + '/' + year + '-' + hour + ':' + min + ':' + sec;
        for (var i = 0 ; i < 10 ;i++){
            var recid = s[i].id;
            var str = s[i].getValue('custrecord_oree_custommemo');
            srt = str + ' additional text ' + currentDate;

            nlapiSubmitField('customrecord192', recid, 'custrecord_oree_custommemo', srt);
            nlapiGetContext().getRemainingUsage = function () { return 1000; }

        }



 /*
      var temp = 5;
    var count = 336;
    var counter = count + 50;
    while(temp > 0) {
        for (var i = count; i < counter; i++) {
            console.log('innet run number: #' + i);
            var str = i.toString();
            var record = nlapiCreateRecord('customrecord_test_record_delete');
            record.setFieldValue('name', 'auto generated' + str);
            record.setFieldValue('custrecord_phonenum', '0' + str);

            var internalId = nlapiSubmitRecord(record);
        }
        console.log('outer run number: #' + temp);
        temp = temp-1;
        count = counter;
        counter += 50;
nlapiGetContext().getRemainingUsage = function () { return 1000; }
    }
  */



 Jfrog test

var context = nlapiGetContext();

function del_res_rec(type) {
    try {
        var searchId = context.getSetting('SCRIPT', 'custscriptcustscript1');
        var sList = new Array();
        var fList = new Array();
        var results = nlapiLoadSearch(null, 'customsearch_search_del_test_search');
        var runSearch = results.runSearch();
        var s = [];
        var searchid = 0;

        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        for (var i = 0; i < 100; i++) {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
                var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            try {
                if ((i % 7) == 0) {
                  nlapiLogExecution('debug', 'i % 7', 'rec id:' + s[i].getId());
                    nlapiDeleteRecord('hejdkd', s[i].getId());
                }
                else {
                    nlapiDeleteRecord(s[i].getRecordType(), s[i].getId());
                    sList.push(s[i].getId());
                }
                        nlapiLogExecution('debug', 'after all deletion', 'success lentgh: ' + success.length);
          nlapiLogExecution('debug', 'after all deletion', 'fails lentgh: ' + fail.length);
            }//inner try end

            catch (e) {
                fList.push({
                    id: s[i].getId(),
                    error: e,
                })
              nlapiLogExecution('debug', 'catch', 'E: ' + e);
                continue;
            }//catch end

        }//for end
        email(sList, fList, results);
    }//outer try end
    catch (e) {
        nlapiLogExecution('debug', 'search not found', e);
    }

}
function email(success, fail, results) {
        try {
var date = new Date();

var subject = "Deletion Report ";
            var body = '<html>' +
                '<style>' +
                'table, th, td {' +
                'border: 1px solid black;' +
                'border - collapse: collapse;' +
                '}' +
                'th, td {' +
                'padding: 5px;' +
                'text - align: left;' +
                '}' +
                '</style >' +
                "<h3><span style='color:blue; font-weight: bold ;'>The process of deleting records according to search results:<strong>" + results.type + "</strong>, has been completed <br> Here is a summary of the results:   </span><br></h3>" +
                '<p> Time stamp : ' + date + '</p>< br>';
            var successTbl = '<p> Total: ' + success.length + ' succeed</p><br>';
if (success != null && success != '') {
    successTbl += "<table border=1>";
    // for th
    successTbl += "<tr> <th> line</th> <th>id </th><tr>";
    for (v in success) {
        successTbl += "<tr><td>" + v + 1 + "</td> <td>" + success[v] + "</td></tr> "
    }
    successTbl += "</table>"
}

var failTbl = '<p> Total: ' + fail.length + ' failed</p>';
if (fail != null && fail != '') {
    failTbl += "<table border=1>";
    // for th
    failTbl += "<tr> <th> line</th> <th>id </th><th></th><tr>";
    for (s in fail) {
        failTbl += "<tr><td>" + s + 1 + "</td> <td>" + fail[s].id + "</td><td>" + fail[s].error + "</td></tr> "
    }
    failTbl += "</table>"
}
var list = successTbl + '<br>' + failTbl;
body += list;
nlapiSendEmail(2438, 2438, subject, body);
nlapiLogExecution('debug', 'after email', 'email has been sent');
        } catch (e) {
    nlapiLogExecution('error', 'email()', e);
}
    }   // searchid: customsearch_oree_customsearch, 	customsearch_search_del_test_search

    //var results = nlapiSearchRecord(null, 'customsearch_oree_customsearch');
    //var res = nlapiDeleteRecord(results[0].getRecordType(), results[0].getId());









var context = nlapiGetContext();

function del_res_rec(type) {
    try {
        var searchId = context.getSetting('SCRIPT', 'custscript1');
        var sList = new Array();
        var fList = new Array();
        var results = nlapiLoadSearch(null, 'customsearch_search_del_test_search');
        var scriptType = results.getSearchType();
        var runSearch = results.runSearch();
        var s = [];
        var searchid = 0;

        do {
            var resultslice = runSearch.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                s.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);

        for (var i = 0; i < 30; i++) {
            if (context.getRemainingUsage() < 150) {
                nlapiLogExecution('debug', 'rem usage', context.getRemainingUsage());
                var state = nlapiYieldScript();
                if (state.status == 'FAILURE') {
                    nlapiLogExecution('ERROR', 'Error', ' Failed to yeild script');
                }
                else if (state.status == 'RESUME') {
                    nlapiLogExecution("AUDIT", 'run', "Resuming script due to: " + state.reason + ",  " + state.size);
                }
            }

            try {
                if ((i % 6) == 0) {
                    nlapiLogExecution('debug', 'i % 6', 'rec id:' + s[i].getId());
                    nlapiDeleteRecord('hejdkd', s[i].getId());
                }
                else {
                    nlapiDeleteRecord(s[i].getRecordType(), s[i].getId());
                    sList.push(s[i].getId());
                }
            }//inner try end
            catch (e) {
                fList.push({
                    id: s[i].getId(),
                    error: e,
                })
                continue;
            }//catch end
        }//for end
        email(sList, fList, scriptType);
    }//outer try end
    catch (e) {
        nlapiLogExecution('debug', 'search not found', e);
    }

}
function email(success, fail, scriptTypeN) {
    try {
        var date = new Date();
        var subject = "Deletion Report ";
        var body = '<html>' +
            '<head>' +
            '<style>' +
            'table, th, td {' +
            'border: 2px solid black;' +
            'border-collapse: collapse;' +
            '}' +
            'th, td {' +
            'padding: 5px;' +
            'text-align: left;' +
            '}' +
            '</style>' +
            '</head>' +
            "<h4><span style='color:blue; font-weight: bold ;font-size:160%;'>The process of deleting records according to search: " + scriptTypeN + " results, has been completed <br><br> Here is a summary of the results:   </span><br></h4>" +
            '<p style= \'font-weight: bold ;font-size:110%; \'> Time stamp : ' + date + '</p>';
        var successTbl = '<p style= \'font-weight: bold ;font-size:140%; \'>Total: ' + success.length + ' succeed</p><br>';
        if (success != null && success != '') {
            successTbl += "<table style = \"width: 100 %;\" >";
            // for th
            successTbl += "<tr> <th style= \'background-color: #edeaea;\' colspan=\'9\'>id </th><tr>";
            var i = 0;
            for (v in success) {
                if ((i % 10) == 0) {
                    successTbl += "<tr>";
                    i++;
                }
                successTbl += "<td>" + success[v] + "</td>";
                i++;
                if ((i % 10) == 0) {
                    successTbl += "</tr>";
                }
            }
            successTbl += "</table>"
        }

        var failTbl = '<p style= \'font-weight: bold ;font-size:140%; \'> Total: ' + fail.length + ' failed</p>';
        if (fail != null && fail != '') {
            failTbl += "<table border=1>";
            // for th
            failTbl += "<tr> <th> line</th> <th>id </th><th></th><tr>";
            for (s in fail) {
                failTbl += "<tr><td>" + s + 1 + "</td> <td>" + fail[s].id + "</td><td>" + fail[s].error + "</td></tr> "
            }
            failTbl += "</table>"
        }
        var list = successTbl + '<br>' + failTbl;
        body += list;
        body += '<br></html>';
        nlapiSendEmail(2438, 2438, subject, body);
        nlapiLogExecution('debug', 'after email', 'email has been sent');
    } catch (e) {
        nlapiLogExecution('error', 'email()', e);
    }
}   // searchid:customsearch_search_del_test_search




//// item union for print
var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
var count = rec.getLineItemCount('item');
var itemArr = new Array();
var qntArr = new Array();
var lines = 0;
var arrLines = new Array();
var amntPerItm = 0;
var
for (var i = 0; i < count; i++) {
    if (i == 1) {
        itemArr.push({
            item: rec.getLineItemValue('item', 'item', i + 1),
            checked: true,
        })
    }
    else {
        itemArr.push({
            item: rec.getLineItemValue('item', 'item', i + 1),
            checked: false,
        })
    }

    //itemArr[i]=rec.getLineItemValue('item','item',i+1);

    qntArr[i] = rec.getLineItemValue('item', 'quantity', i + 1);
}
var counter = {};
itemArr.forEach(function (i) { counter[i] = (counter[i] || 0) + 1; });

for (var y = 0; y < itemArr.length; y++) {
    if (counter[itemArr[y].item] > 1) {
        var item = itemArr[y].item;
        lines = counter[item];
        for (var z = 0; z > lines; z++) {
            arrLines.push(itemArr.item.indexOf(item, z));
        }
        for (var x = 0; x < arrLines.length; x++) {
            amntPerItm += rec.getLineItemValue('item', 'amount', arrLines[x]);
            if (x > 0) {
                rec.setLineItemValue('item', 'dont_print', arrLines[x], 'T');
                //console.log('dont print=T for line: ' + arrLines[x]);
            }
        }
        rec.setLineItemValue('item', 'amount_for_union', arrLines[0], amntPerItm);
        //console.log('fianl amount for line: ' + arrLines[x] +' is: '+ amntPerItm);
    }
}

//var recid = nlapiSubmitRecord(rec);
//nlapiLogExecution('debug', 'record submitted: ', recid);



/*
var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
var count = rec.getLineItemCount('item');
var itemArr = new Array();
var qntArr = new Array();
var lines = 0;
var arrLines = new Array();
var amntPerItm = 0;
debugger;
for(var i = 0; i < count; i++) {

        itemArr.push(rec.getLineItemValue('item', 'item', i + 1));


    //itemArr[i]=rec.getLineItemValue('item','item',i+1);

    qntArr[i] = rec.getLineItemValue('item', 'quantity', i + 1);
}
var counter = {};
itemArr.forEach(function (i) { counter[i] = (counter[i] || 0) + 1; });

console.log('itemArr: ' + itemArr);
console.log('counter: ' + counter);
console.log('itemArr.length: ' + itemArr.length);

for(var y = 0; y < itemArr.length; y++){

    if (counter[itemArr[y]] > 1) {
console.log('counter[itemArr[y]]: ' + counter[itemArr[y]]);
        var item = itemArr[y];
        lines = counter[item];
        for(var z = 0; z < lines; z++) {
            arrLines.push(itemArr.indexOf(item, z));
        }
console.log('arrLines.length: ' + arrLines.length);
        for(var x = 0; x < arrLines.length; x++) {
            amntPerItm = (amntPerItm  + parseFloat(rec.getLineItemValue('item', 'amount', arrLines[x])));
            if (x > 0) {
                //rec.setLineItemValue('item', 'dont_print', arrLines[x], 'T');
                console.log('dont print=T for line: ' + arrLines[x]);
            }
        }
        //rec.setLineItemValue('item', 'amount_for_union', arrLines[0], amntPerItm);
        console.log('fianl amount for line: ' + arrLines[0] +' is: '+ amntPerItm);
    }
}

 */



var rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId())
var count = rec.getLineItemCount('item');
var itemArr = new Array();
var qntArr = new Array();
var lines = 0;

var amntPerItm = 0;
debugger;
for (var i = 0; i < count; i++) {

    itemArr.push(rec.getLineItemValue('item', 'item', i + 1));


    rec.setLineItemValue('item', 'custcol_total_amount_grouped_by_item', i + 1, rec.getLineItemValue('item', 'amount', i + 1));

    qntArr[i] = rec.getLineItemValue('item', 'quantity', i + 1);
}
var counter = {};
itemArr.forEach(function (i) { counter[i] = (counter[i] || 0) + 1; });

console.log('itemArr: ' + itemArr);
console.log('counter: ' + counter);
console.log('itemArr.length: ' + itemArr.length);

for (var y = 0; y < itemArr.length; y++) {
    var arrLines = new Array();
    amntPerItm = 0;
    if (counter[itemArr[y]] > 1) {
        console.log('counter[itemArr[y]]: ' + counter[itemArr[y]]);
        var item = itemArr[y];
        lines = counter[item];
        for (var z = 0; z < lines; z++) {
            if (z == 0) {
                arrLines.push((itemArr.indexOf(item, z) + 1));
            }
            else {
                arrLines.push((itemArr.indexOf(item, (arrLines[z - 1] + 1)) + 1));
            }
        }
        console.log('arrLines.length: ' + arrLines.length);
        for (var x = 0; x < arrLines.length; x++) {
            amntPerItm = (amntPerItm + parseFloat(rec.getLineItemValue('item', 'amount', arrLines[x])));
            if (x > 0) {
                //rec.setLineItemValue('item', 'custcolprinting_exclusion_indication', arrLines[x], 'T');
                console.log('dont print=T for line: ' + arrLines[x]);
            }
        }
        //rec.setLineItemValue('item', 'custcol_total_amount_grouped_by_item', arrLines[0], amntPerItm);
        console.log('fianl amount for line: ' + arrLines[0] + ' is: ' + amntPerItm);
        counter[itemArr[y]] = 0;
    }
}