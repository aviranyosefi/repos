// JavaScript source code

var result = nlapiSearchRecord('customrecord192', null, null, [new nlobjSearchColumn('internalid'), new nlobjSearchColumn('name'), new nlobjSearchColumn('custrecord9')])
var searchresults = nlapiSearchRecord('customrecord192', null, null, null);

if (result != null && result.length > 0) {
    result.sort(function (a, b) {
        var x = a.getValue('name').toLowerCase();
        var y = b.getValue('name').toLowerCase();
        if (x > y) { return -1; }
        if (y > x) { return 1; }
        return 0;
    })
    for (var i = 0; i < result.length; i++) {
        var res = result[i];

        if (res.getValue('custrecord9') > 1234567) {
            console.log(res.getId() + '' + res.getValue('name'));
        };
        if (res.getValue('custrecord9').includes('55')) {
            console.log(res.getId() + ' ' + res.getValue('custrecord9'));
        }
        else {
            console.log(res.getId() + 'does not contain: ' + res.getValue('custrecord9'));
        }
    }
    result.sort(function (a, b) {
        var x = a.getValue('name').toLowerCase();
        var y = b.getValue('name').toLowerCase();
        if (x > y) { return -1; }
        if (y > x) { return 1; }
        return 0;
    })
}


/*
 *    var emailAddress = '';
   for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
   {
      var searchresult = searchresults[ i ];
      emailAddress += searchresult.getValue( 'email' );
   }

 * 
 * /