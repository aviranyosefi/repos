// JavaScript source code
var results = nlapiSearchRecord('customer', null, null, [new nlobjSearchColumn('internalid'), new nlobjSearchColumn('companyname')]);

if (results != null && results.length > 0) {
    results.sort(function (a, b) {
        var x = a.getValue('companyname').toLowerCase();
        var y = b.getValue('companyname').toLowerCase();
        if (x > y) { return -1; }
        if (y > x) { return 1; }
        return 0;
    })
    for (var i = 0; i < results.length; i++) {
        var res = results[i];
        console.log(res.getId() + '' + res.getValue('companyname'));
    };
}



results.sort(function (a, b) {
    var x = a.getValue('companyname').toLowerCase();
    var y = b.getValue('companyname').toLowerCase();
    if (x > y) { return -1; }
    if (y > x) { return 1; }
    return 0;
})

