/* **************************************************************************************
 ** Copyright (c) 2016 One1 LTD
 ** All Rights Reserved.
 **
 * Version    Date            Author           Remarks
 * 5.40       26 NOV 2018      Moshe Barel     
 *
 *************************************************************************************** */
var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var yL = new Array;
for (var year = 2018; year <= 2099; year++)
    yL.push(year);
var yS = new Array;
for (var year = 18; year <= 99; year++)
    yS.push(year);

function get_base_period(period_phrase) {
    var periods1 = getPeriodsArray(mL, yL);
    var ind = getindex(periods1, period_phrase);
    if (ind != -1)
        return periods1[ind];
    var periods2 = getPeriodsArray(mL, yS);
    var ind = getindex(periods2, period_phrase);
    if (ind != -1)
        return periods2[ind];
    var periods3 = getPeriodsArray(mS, yL);
    var ind = getindex(periods3, period_phrase);
    if (ind != -1)
        return periods3[ind];
    var periods4 = getPeriodsArray(mS, yS);
    var ind = getindex(periods4, period_phrase);
    if (ind != -1)
        return periods4[ind];
}

function getPeriodsArray(mArray, yArray) {
    var periodsArr = [];
    for (var i = 0; i < yArray.length; i++) {
        for (var j = 0; j < mArray.length; j++) {
            periodsArr.push(mArray[j] + ' ' + yArray[i]);
        }
    }
    return periodsArr;
}

function getindex(arr, phrase) {
    for (var k = 0; k < arr.length; k++)
        if (phrase.indexOf(arr[k]) >= 0) {
            return k;
        }
    return -1;
}