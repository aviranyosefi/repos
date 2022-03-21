function ascii2utf(str) {
	
	

    var obj = new Array();
    obj['€'] = 'א';
    obj['']	= 'ב';
    obj['‚'] = 'ג';
    obj['ƒ'] = 'ד';
    obj['„'] = 'ה';
    obj['…'] = 'ו';
    obj['†'] = 'ז'; 
    obj['‡'] = 'ח';
    obj['ˆ'] = 'ט';
    obj['‰'] = 'י';
    obj['Š'] = 'ך';
    obj['‹'] = 'כ';
    obj['�'] = 'ל';
    obj[' '] = 'ם';
    obj[''] = 'מ';
    obj[' '] = 'ן';
    obj['']	= 'נ';
    obj['‘'] = 'ס';
    obj['’'] = 'ע';
    obj['“'] = 'ף';
    obj['”'] = 'פ';
    obj['•'] = 'ץ';
    obj['–'] = 'צ';
    obj['—'] = 'ק';
    obj['˜'] = 'ר';
    obj['™'] = 'ש';
    obj[''] = 'ת';
    obj['"'] = '"';
    obj[' '] = ' '


  


var res = str.split("");
var arrCodes = [];
res.forEach(function (element) {
    arrCodes.push(obj[element]);

});

var arrReversed = arrCodes.reverse();

var res = arrReversed.join('')
return res;
}

var test = ' „—‰ƒ ' //דנ"ח פעולת מטח"
var check = ascii2utf(test);
console.log(check)
