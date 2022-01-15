var form;
var ActualTotal = 0;
var TargetlTotal = 0;
var GAPTotal = 0;
var link = 'https://4998343.app.netsuite.com/app/site/hosting/scriptlet.nl?script=641&deploy=1&sales='
var CurrYear = new Date().getFullYear();
var currM = new Date().getMonth() + 1
var salesData;
var yearData;
var yearDataName = null;
var fss_mssData;
var sales_dep_manData;
var sales_team_manData;
var dimensionData;
var to_mounthData;
var from_mounthData;
var measureData;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var total1 = 0, total2 = 0, total3 = 0, total4 = 0, total5 = 0, total6 = 0, total7 = 0, total8 = 0, total9 = 0, total10 = 0, total11 = 0, total12 = 0;
var target1T = 0, target2T = 0, target3T = 0, target4T = 0, target5 = 0, target6 = 0, target7 = 0, target8 = 0, target9 = 0, target10 = 0, target11 = 0, target12 = 0;
var gap1 = 0, gap2 = 0, gap3 = 0, gap4 = 0, gap5 = 0, gap6 = 0, gap7 = 0, gap8 = 0, gap9 = 0, gap10 = 0, gap11 = 0, gap12 = 0;
var totalquoarterly1 = 0, totalquoarterly2 = 0, totalquoarterly3 = 0, totalquoarterly4 = 0;
var totaltargetquoarterly1 = 0, totaltargetquoarterly2 = 0, totaltargetquoarterly3 = 0, totaltargetquoarterly4 = 0;
var totalgapquoarterly1 = 0, totalgapquoarterly2 = 0, totalgapquoarterly3 = 0, totalgapquoarterly4 = 0;
var totalhalfYearly1 = 0, totalhalfYearly2 = 0;
var totaltargethalfYearly1 = 0, totaltargethalfYearly2 = 0;
var totalgaphalfYearly1 = 0, totalgaphalfYearly2 = 0;

function getName(name) {
    if (isNullOrEmpty(name)) { name = 'NONE' };
    return name;
}

function SalesRepTargets(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'SalesRepTargets allSelection ', allSelection.length);

        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data);
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    for (var t = 0; t < 12; t++) {
                        var sum = 0;
                        var target = 0;
                        for (z = 0; z < ProductFamilyList2.length; z++) {
                            sum += data[t].data[ProductFamilyList2[z].id].sum
                            target += data[t].data[ProductFamilyList2[z].id].target
                        }
                        item['mounth' + (t + 1)] = formatNumber(sum);
                        item['target' + (t + 1)] = formatNumber(target);
                        item['perc' + (t + 1)] = formatNumber(getPrecenge(sum, target)) + '%';
                        item['gap' + (t + 1)] = formatNumber(sum - target);
                    }
                    Results.push(item)
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargets func', e)
    }
    return Results;
}
function SalesRepTargetsQuoartly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection.push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data)
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    var line = 1;
                    var totalquoarterly = 0, totaltarget = 0
                    for (var t = 0; t < 12; t++) {
                        var sum = 0, target = 0;
                        for (z = 0; z < ProductFamilyList2.length; z++) {
                            target += data[t].data[ProductFamilyList2[z].id].target + data[t + 1].data[ProductFamilyList2[z].id].target + data[t + 2].data[ProductFamilyList2[z].id].target
                            sum += data[t].data[ProductFamilyList2[z].id].sum + data[t + 1].data[ProductFamilyList2[z].id].sum + data[t + 2].data[ProductFamilyList2[z].id].sum
                        }
                        totalquoarterly += sum;
                        totaltarget += target;
                        item['quoarterly' + line] = formatNumber(sum);
                        item['target' + line] = formatNumber(target);
                        item['perc' + line] = formatNumber(getPrecenge(sum, target)) + '%';
                        item['gap' + line] = formatNumber(sum - target);
                        line = line + 1;
                        t = t + 2
                    }
                    item['totalquoarterly'] = formatNumber(totalquoarterly);
                    item['totaltarget'] = formatNumber(totaltarget);
                    item['totalperc'] = formatNumber(getPrecenge(totalquoarterly, totaltarget)) + '%';
                    item['totalgap'] = formatNumber(totalquoarterly - totaltarget);
                    Results.push(item)
                }
            }
        }


    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsQuoartly func', e)
    }
    return Results;
}
function SalesRepTargetsHalfYearly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data)
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    var line = 1;
                    var totalhalfYearly = 0, totaltarget = 0;
                    for (var t = 0; t < 12; t++) {

                        var sumFirst = 0, sumSecond = 0, target = 0, target01 = 0;
                        for (z = 0; z < ProductFamilyList2.length; z++) {

                            sumFirst += data[t].data[ProductFamilyList2[z].id].sum + data[t + 1].data[ProductFamilyList2[z].id].sum + data[t + 2].data[ProductFamilyList2[z].id].sum
                            sumSecond += data[t + 3].data[ProductFamilyList2[z].id].sum + data[t + 4].data[ProductFamilyList2[z].id].sum + data[t + 5].data[ProductFamilyList2[z].id].sum
                            target += data[t].data[ProductFamilyList2[z].id].target + data[t + 1].data[ProductFamilyList2[z].id].target + data[t + 2].data[ProductFamilyList2[z].id].target
                            target01 += data[t + 3].data[ProductFamilyList2[z].id].target + data[t + 4].data[ProductFamilyList2[z].id].target + data[t + 5].data[ProductFamilyList2[z].id].target
                        }

                        totalhalfYearly += (sumFirst + sumSecond)
                        totaltarget += (target + target01)
                        item['halfYearly' + line] = formatNumber(sumFirst + sumSecond);
                        item['target' + line] = formatNumber(target + target01);
                        item['perc' + line] = formatNumber(getPrecenge(sumFirst + sumSecond, target + target01)) + '%';
                        item['gap' + line] = formatNumber((sumFirst + sumSecond) - (target + target01));
                        line = line + 1;
                        t = t + 5
                    }
                    item['totalhalfYearly'] = formatNumber(totalhalfYearly);
                    item['totaltarget'] = formatNumber(totaltarget);
                    item['totalperc'] = formatNumber(getPrecenge(totalhalfYearly, totaltarget)) + '%';
                    item['totalgap'] = formatNumber(totalhalfYearly - totaltarget);
                    Results.push(item)
                }
            }
        }

    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearly func', e)
    }
    return Results;
}
///
function SalesRepTargetsPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }

        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'SalesRepTargets allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data)
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    for (var t = 0; t < 12; t++) {
                        for (z = 0; z < ProductFamilyList.length; z++) {
                            var sum = data[t].data[ProductFamilyList[z].id].sum
                            item[ProductFamilyList[z].id + 'mounth' + (t + 1)] = formatNumber(sum);
                            var target = data[t].data[ProductFamilyList[z].id].target
                            item[ProductFamilyList[z].id + 'target' + (t + 1)] = formatNumber(target)
                            item[ProductFamilyList[z].id + 'perc' + (t + 1)] = formatNumber(getPrecenge(sum, target)) + '%';
                            item[ProductFamilyList[z].id + 'gap' + (t + 1)] = formatNumber(sum - target);
                        }
                    }
                    Results.push(item)
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsPf func', e)
    }
    return Results;
}
function SalesRepTargetsQuoartlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);

            for (var rs in resultslice) {
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data)
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    var line = 1;
                    for (var t = 0; t < 12; t++) {
                        for (z = 0; z < ProductFamilyList.length; z++) {
                            var sum = data[t].data[ProductFamilyList[z].id].sum + data[t + 1].data[ProductFamilyList[z].id].sum + data[t + 2].data[ProductFamilyList[z].id].sum
                            item[ProductFamilyList[z].id + 'quoarterly' + line] = formatNumber(sum);
                            var target = data[t].data[ProductFamilyList[z].id].target + data[t + 1].data[ProductFamilyList[z].id].target + data[t + 2].data[ProductFamilyList[z].id].target
                            item[ProductFamilyList[z].id + 'target' + line] = formatNumber(target);
                            item[ProductFamilyList[z].id + 'perc' + line] = formatNumber(getPrecenge(sum, target)) + '%';
                            item[ProductFamilyList[z].id + 'gap' + line] = formatNumber(sum - target);
                        }
                        line = line + 1;
                        t = t + 2
                    }
                    Results.push(item)
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsQuoartlyClass func', e)
    }
    nlapiLogExecution('error', 'Results', JSON.stringify(Results[0]))
    return Results;
}
function SalesRepTargetsHalfYearlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 1));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_sr_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_sr_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_sr_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var allSelection = [];
        var Results = [];
        var searchid = 0;
        var resultset = search.runSearch();
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            for (var rs in resultslice) {
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)

        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_aa")
                if (!isNullOrEmpty(data)) {
                    data = JSON.parse(data)
                    var item = {};
                    item['id'] = allSelection[i].id;
                    item['sales_rep'] = getName(allSelection[i].getText("custrecord_sr_sales_rep"))
                    item['sales_rep_id'] = allSelection[i].getValue("custrecord_sr_sales_rep")
                    var line = 1;
                    for (var t = 0; t < 12; t++) {
                        for (z = 0; z < ProductFamilyList.length; z++) {
                            var sum = data[t].data[ProductFamilyList[z].id].sum + data[t + 1].data[ProductFamilyList[z].id].sum + data[t + 2].data[ProductFamilyList[z].id].sum
                            var sum1 = data[t + 3].data[ProductFamilyList[z].id].sum + data[t + 4].data[ProductFamilyList[z].id].sum + data[t + 5].data[ProductFamilyList[z].id].sum
                            item[ProductFamilyList[z].id + 'halfYearly' + line] = formatNumber(sum + sum1);
                            var target = data[t].data[ProductFamilyList[z].id].target + data[t + 1].data[ProductFamilyList[z].id].target + data[t + 2].data[ProductFamilyList[z].id].target
                            var target01 = data[t + 3].data[ProductFamilyList[z].id].target + data[t + 4].data[ProductFamilyList[z].id].target + data[t + 5].data[ProductFamilyList[z].id].target
                            item[ProductFamilyList[z].id + 'target' + line] = formatNumber(target + target01);
                            item[ProductFamilyList[z].id + 'perc' + line] = formatNumber(getPrecenge(sum + sum1, target + target01)) + '%';
                            item[ProductFamilyList[z].id + 'gap' + line] = formatNumber((sum + sum1) - (target + target01));
                        }
                        line = line + 1;
                        t = t + 5
                    }
                    Results.push(item)
                }
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearlyPf func', e)
    }
    return Results;
}

function formatNumber(num) {
    var num = parseFloat(num).toFixed(2)
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return '0.00'
}
function formatNumberTotal(num) {
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return '0.00'
}
function formatNumberPrecent(num) {
    num = Number(num).toFixed(2);
    var len = num.toString().indexOf('.');
    len = len + 2;
    var num = Number(num).toFixed(2).substring(0, len)
    if (num != '' && num != undefined && num != null) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    else return '0.00'
}
function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function getPrecenge(num1, num2) {
    //nlapiLogExecution('error', 'num2 num2', num2)
    if (num2 != '0' && num1 != '0') {
        return (num1 / num2) * 100
    }
    else if (num1 != '0' && num2 == '0') {
        return '100.00'
    }
    else return '0.00'

}
function NTR(number) {
    debugger;
    if (!isNullOrEmpty(number) && number != 'NaN%' && number != 'NaN') {
        number = number.toString()
        var f = number.replace(new RegExp(",", "g"), "");
        f = Number(f)
        return f
    }
    else { return 0 }

}
function SALESDEPARTMENTMANAGER() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('altname');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custentity_is_sales_department_manager', null, 'is', 'T')

    var search = nlapiCreateSearch('employee', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {

            results.push({

                id: returnSearchResults[i].id,
                name: returnSearchResults[i].getValue('altname')
            });

        }
        return results;
    }
}
function SALESTEAMMANAGER() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('altname');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custentity_is_sales_team_manager', null, 'is', 'T')

    var search = nlapiCreateSearch('employee', filters, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {

        for (var i = 0; i < returnSearchResults.length; i++) {

            results.push({

                id: returnSearchResults[i].id,
                name: returnSearchResults[i].getValue('altname')
            });

        }
        return results;
    }
}
function getColor(number) {
    try {
        number = Number(number.substring(0, number.length - 1))
        if (number < 100)
            return "red";
        else return "#2db300"
    } catch (e) {
        return "black";
    }
}
function GCM(number, m) {
    if (isNullOrEmpty(yearDataName)) {
        yearDataName = nlapiLookupField('customlist358', yearData, 'name');
    }
    if (measureData == 1) {
        if (CurrYear < yearDataName) {
            return "black";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "black"; }
        }
        try {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number < 100)
                return "red";
            else return "#2db300"
        } catch (e) {
            return "black";
        }
    }
    else if (measureData == 2) {
        if (CurrYear < yearDataName) {
            return "black";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "black"; }
        }
        try {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number > 100 || number == 100) {
                return "red";
            }
            else return "#2db300"
        } catch (e) {
            return "black";
        }

    }

}
function getGapColor(number, gap) {
    try {
        if (measureData == 1) {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number < 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        }
        else if (measureData == 2) {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number > 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        }

    } catch (e) {
        return "<span style='color: black'>" + gap + "</span>";
    }

}
function GGC(number, gap, m) {
    if (isNullOrEmpty(yearDataName)) {
        yearDataName = nlapiLookupField('customlist358', yearData, 'name');
    }
    if (measureData == 1) {
        if (CurrYear < yearDataName) {
            return "<span style='color: black'>" + gap + "</span>";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "<span style='color: black'>" + gap + "</span>"; }
        }
        try {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number < 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        } catch (e) {
            return "<span style='color: black'>" + gap + "</span>";
        }
    }
    else if (measureData == 2) {
        if (CurrYear < yearDataName) {
            return "<span style='color: black'>" + gap + "</span>";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "<span style='color: black'>" + gap + "</span>"; }
        }
        try {
            gap = formatNumber(Math.abs(Number(NTR(gap.substring(1, gap.length)))))
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number > 100 || number == 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        } catch (e) {
            return "<span style='color: black'>" + gap + "</span>";
        }
    }



}
function GGCT(number, gap, m) {
    if (isNullOrEmpty(yearDataName)) {
        yearDataName = nlapiLookupField('customlist358', yearData, 'name');
    }
    if (measureData == 1) {
        if (CurrYear < yearDataName) {
            return "<span style='color: black'>" + gap + "</span>";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "<span style='color: black'>" + gap + "</span>"; }
        }
        try {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number < 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        } catch (e) {
            return "<span style='color: black'>" + gap + "</span>";
        }
    }
    else if (measureData == 2) {
        if (CurrYear < yearDataName) {
            return "<span style='color: black'>" + gap + "</span>";
        }
        else if (CurrYear == yearDataName) {
            if (m > currM) { return "<span style='color: black'>" + gap + "</span>"; }
        }
        try {
            number = Number(NTR(number.substring(0, number.length - 1)))
            if (number > 100 || number == 100)
                return "<span style='color: red'>" + gap + "</span>";
            else return "<span style='color: #2db300'>" + gap + "</span>";
        } catch (e) {
            return "<span style='color: black'>" + gap + "</span>";
        }
    }



}
function addTotalLines(resultsSubList, line, ActualTotal, TargetlTotal, GAPTotal) {
    resultsSubList.setLineItemValue('custpage_n', line, 'Total');
    resultsSubList.setLineItemValue('custpage_p', line, 'Actual');
    resultsSubList.setLineItemValue('custpage_total_t', line, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%', formatNumberTotal(parseInt(ActualTotal))))
    resultsSubList.setLineItemValue('custpage_total', line, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%', formatNumberTotal(parseInt(ActualTotal))))
    resultsSubList.setLineItemValue('custpage_m1', line, GGCT(formatNumberPrecent(getPrecenge(total1, target1T)) + '%', formatNumberTotal(parseInt(total1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line, GGCT(formatNumberPrecent(getPrecenge(total2, target2T)) + '%', formatNumberTotal(parseInt(total2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line, GGCT(formatNumberPrecent(getPrecenge(total3, target3T)) + '%', formatNumberTotal(parseInt(total3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line, GGCT(formatNumberPrecent(getPrecenge(total4, target4T)) + '%', formatNumberTotal(parseInt(total4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line, GGCT(formatNumberPrecent(getPrecenge(total5, target5)) + '%', formatNumberTotal(parseInt(total5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line, GGCT(formatNumberPrecent(getPrecenge(total6, target6)) + '%', formatNumberTotal(parseInt(total6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line, GGCT(formatNumberPrecent(getPrecenge(total7, target7)) + '%', formatNumberTotal(parseInt(total7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line, GGCT(formatNumberPrecent(getPrecenge(total8, target8)) + '%', formatNumberTotal(parseInt(total8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line, GGCT(formatNumberPrecent(getPrecenge(total9, target9)) + '%', formatNumberTotal(parseInt(total9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line, GGCT(formatNumberPrecent(getPrecenge(total10, target10)) + '%', formatNumberTotal(parseInt(total10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line, GGCT(formatNumberPrecent(getPrecenge(total11, target11)) + '%', formatNumberTotal(parseInt(total11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line, GGCT(formatNumberPrecent(getPrecenge(total12, target12)) + '%', formatNumberTotal(parseInt(total12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly1, totaltargetquoarterly1)) + '%', formatNumberTotal(parseInt(totalquoarterly1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly2, totaltargetquoarterly2)) + '%', formatNumberTotal(parseInt(totalquoarterly2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly3, totaltargetquoarterly3)) + '%', formatNumberTotal(parseInt(totalquoarterly3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly4, totaltargetquoarterly4)) + '%', formatNumberTotal(parseInt(totalquoarterly4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly1, totaltargethalfYearly1)) + '%', formatNumberTotal(parseInt(totalhalfYearly1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly2, totaltargethalfYearly2)) + '%', formatNumberTotal(parseInt(totalhalfYearly2))))

    // line 2 
    resultsSubList.setLineItemValue('custpage_n', line + 1, '');
    resultsSubList.setLineItemValue('custpage_p', line + 1, 'Target');
    resultsSubList.setLineItemValue('custpage_total_t', line + 1, formatNumberTotal(parseInt(TargetlTotal)))
    resultsSubList.setLineItemValue('custpage_total', line + 1, formatNumberTotal(parseInt(TargetlTotal)))
    resultsSubList.setLineItemValue('custpage_m1', line + 1, formatNumberTotal(parseInt(target1T)))
    resultsSubList.setLineItemValue('custpage_m2', line + 1, formatNumberTotal(parseInt(target2T)))
    resultsSubList.setLineItemValue('custpage_m3', line + 1, formatNumberTotal(parseInt(target3T)))
    resultsSubList.setLineItemValue('custpage_m4', line + 1, formatNumberTotal(parseInt(target4T)))
    resultsSubList.setLineItemValue('custpage_m5', line + 1, formatNumberTotal(parseInt(target5)))
    resultsSubList.setLineItemValue('custpage_m6', line + 1, formatNumberTotal(parseInt(target6)))
    resultsSubList.setLineItemValue('custpage_m7', line + 1, formatNumberTotal(parseInt(target7)))
    resultsSubList.setLineItemValue('custpage_m8', line + 1, formatNumberTotal(parseInt(target8)))
    resultsSubList.setLineItemValue('custpage_m9', line + 1, formatNumberTotal(parseInt(target9)))
    resultsSubList.setLineItemValue('custpage_m10', line + 1, formatNumberTotal(parseInt(target10)))
    resultsSubList.setLineItemValue('custpage_m11', line + 1, formatNumberTotal(parseInt(target11)))
    resultsSubList.setLineItemValue('custpage_m12', line + 1, formatNumberTotal(parseInt(target12)))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 1, formatNumberTotal(parseInt(totaltargetquoarterly1)))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 1, formatNumberTotal(parseInt(totaltargetquoarterly2)))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 1, formatNumberTotal(parseInt(totaltargetquoarterly3)))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 1, formatNumberTotal(parseInt(totaltargetquoarterly4)))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 1, formatNumberTotal(parseInt(totaltargethalfYearly1)))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 1, formatNumberTotal(parseInt(totaltargethalfYearly2)))
    //line 3
    resultsSubList.setLineItemValue('custpage_n', line + 2, '');
    resultsSubList.setLineItemValue('custpage_p', line + 2, '% of Target');
    resultsSubList.setLineItemValue('custpage_total_t', line + 2, formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%')
    resultsSubList.setLineItemValue('custpage_total', line + 2, formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%')
    resultsSubList.setLineItemValue('custpage_m1', line + 2, formatNumberPrecent(getPrecenge(total1, target1T)) + '%')
    resultsSubList.setLineItemValue('custpage_m2', line + 2, formatNumberPrecent(getPrecenge(total2, target2T)) + '%')
    resultsSubList.setLineItemValue('custpage_m3', line + 2, formatNumberPrecent(getPrecenge(total3, target3T)) + '%')
    resultsSubList.setLineItemValue('custpage_m4', line + 2, formatNumberPrecent(getPrecenge(total4, target4T)) + '%')
    resultsSubList.setLineItemValue('custpage_m5', line + 2, formatNumberPrecent(getPrecenge(total5, target5)) + '%')
    resultsSubList.setLineItemValue('custpage_m6', line + 2, formatNumberPrecent(getPrecenge(total6, target6)) + '%')
    resultsSubList.setLineItemValue('custpage_m7', line + 2, formatNumberPrecent(getPrecenge(total7, target7)) + '%')
    resultsSubList.setLineItemValue('custpage_m8', line + 2, formatNumberPrecent(getPrecenge(total8, target8)) + '%')
    resultsSubList.setLineItemValue('custpage_m9', line + 2, formatNumberPrecent(getPrecenge(total9, target9)) + '%')
    resultsSubList.setLineItemValue('custpage_m10', line + 2, formatNumberPrecent(getPrecenge(total10, target10)) + '%')
    resultsSubList.setLineItemValue('custpage_m11', line + 2, formatNumberPrecent(getPrecenge(total11, target11)) + '%')
    resultsSubList.setLineItemValue('custpage_m12', line + 2, formatNumberPrecent(getPrecenge(total12, target12)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 2, formatNumberPrecent(getPrecenge(totalquoarterly1, totaltargetquoarterly1)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 2, formatNumberPrecent(getPrecenge(totalquoarterly2, totaltargetquoarterly2)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 2, formatNumberPrecent(getPrecenge(totalquoarterly3, totaltargetquoarterly3)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 2, formatNumberPrecent(getPrecenge(totalquoarterly4, totaltargetquoarterly4)) + '%')
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 2, formatNumberPrecent(getPrecenge(totalhalfYearly1, totaltargethalfYearly1)) + '%')
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 2, formatNumberPrecent(getPrecenge(totalhalfYearly2, totaltargethalfYearly2)) + '%')
    //line 4
    resultsSubList.setLineItemValue('custpage_n', line + 3, '');
    resultsSubList.setLineItemValue('custpage_p', line + 3, 'GAP (Amount)');
    resultsSubList.setLineItemValue('custpage_total_t', line + 3, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%', formatNumberTotal(parseInt(GAPTotal))))
    resultsSubList.setLineItemValue('custpage_total', line + 3, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%', formatNumberTotal(parseInt(GAPTotal))))
    resultsSubList.setLineItemValue('custpage_m1', line + 3, GGCT(formatNumberPrecent(getPrecenge(total1, target1T)) + '%', formatNumberTotal(parseInt(gap1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line + 3, GGCT(formatNumberPrecent(getPrecenge(total2, target2T)) + '%', formatNumberTotal(parseInt(gap2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line + 3, GGCT(formatNumberPrecent(getPrecenge(total3, target3T)) + '%', formatNumberTotal(parseInt(gap3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line + 3, GGCT(formatNumberPrecent(getPrecenge(total4, target4T)) + '%', formatNumberTotal(parseInt(gap4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line + 3, GGCT(formatNumberPrecent(getPrecenge(total5, target5)) + '%', formatNumberTotal(parseInt(gap5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line + 3, GGCT(formatNumberPrecent(getPrecenge(total6, target6)) + '%', formatNumberTotal(parseInt(gap6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line + 3, GGCT(formatNumberPrecent(getPrecenge(total7, target7)) + '%', formatNumberTotal(parseInt(gap7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line + 3, GGCT(formatNumberPrecent(getPrecenge(total8, target8)) + '%', formatNumberTotal(parseInt(gap8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line + 3, GGCT(formatNumberPrecent(getPrecenge(total9, target9)) + '%', formatNumberTotal(parseInt(gap9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line + 3, GGCT(formatNumberPrecent(getPrecenge(total10, target10)) + '%', formatNumberTotal(parseInt(gap10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line + 3, GGCT(formatNumberPrecent(getPrecenge(total11, target11)) + '%', formatNumberTotal(parseInt(gap11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line + 3, GGCT(formatNumberPrecent(getPrecenge(total12, target12)) + '%', formatNumberTotal(parseInt(gap12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly1, totaltargetquoarterly1)) + '%', formatNumberTotal(parseInt(totalgapquoarterly1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly2, totaltargetquoarterly2)) + '%', formatNumberTotal(parseInt(totalgapquoarterly2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly3, totaltargetquoarterly3)) + '%', formatNumberTotal(parseInt(totalgapquoarterly3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly4, totaltargetquoarterly4)) + '%', formatNumberTotal(parseInt(totalgapquoarterly4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly1, totaltargethalfYearly1)) + '%', formatNumberTotal(parseInt(totalgaphalfYearly1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly2, totaltargethalfYearly2)) + '%', formatNumberTotal(parseInt(totalgaphalfYearly2))))

    line = line + 3;
}
function addTotalLinesPF(resultsSubList, line, total, target, gap, type, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, tar1, tar2, tar3, tar4, tar5, tar6, tar7, tar8, tar9, tar10, tar11, tar12, gap1, gap2, gap3, gap4, gap5, gap6, gap7, gap8, gap9, gap10, gap11, gap12) {
    resultsSubList.setLineItemValue('custpage_n', line, type);
    resultsSubList.setLineItemValue('custpage_p', line, 'Actual');
    resultsSubList.setLineItemValue('custpage_total_t', line, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(total))))
    resultsSubList.setLineItemValue('custpage_total', line, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(total))))
    resultsSubList.setLineItemValue('custpage_m1', line, GGCT(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(t1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line, GGCT(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(t2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line, GGCT(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(t3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line, GGCT(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(t4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line, GGCT(formatNumberPrecent(getPrecenge(t5, tar5)) + '%', formatNumberTotal(parseInt(t5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line, GGCT(formatNumberPrecent(getPrecenge(t6, tar6)) + '%', formatNumberTotal(parseInt(t6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line, GGCT(formatNumberPrecent(getPrecenge(t7, tar7)) + '%', formatNumberTotal(parseInt(t7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line, GGCT(formatNumberPrecent(getPrecenge(t8, tar8)) + '%', formatNumberTotal(parseInt(t8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line, GGCT(formatNumberPrecent(getPrecenge(t9, tar9)) + '%', formatNumberTotal(parseInt(t9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line, GGCT(formatNumberPrecent(getPrecenge(t10, tar10)) + '%', formatNumberTotal(parseInt(t10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line, GGCT(formatNumberPrecent(getPrecenge(t11, tar11)) + '%', formatNumberTotal(parseInt(t11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line, GGCT(formatNumberPrecent(getPrecenge(t12, tar12)) + '%', formatNumberTotal(parseInt(t12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(t1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(t2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line, getGapColor(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(t3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line, getGapColor(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(t4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(t1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(t2))))


    // line 2 
    resultsSubList.setLineItemValue('custpage_n', line + 1, '');
    resultsSubList.setLineItemValue('custpage_p', line + 1, 'Target');
    resultsSubList.setLineItemValue('custpage_total_t', line + 1, formatNumberTotal(parseInt(target)))
    resultsSubList.setLineItemValue('custpage_total', line + 1, formatNumberTotal(parseInt(target)))
    resultsSubList.setLineItemValue('custpage_m1', line + 1, formatNumberTotal(parseInt(tar1)))
    resultsSubList.setLineItemValue('custpage_m2', line + 1, formatNumberTotal(parseInt(tar2)))
    resultsSubList.setLineItemValue('custpage_m3', line + 1, formatNumberTotal(parseInt(tar3)))
    resultsSubList.setLineItemValue('custpage_m4', line + 1, formatNumberTotal(parseInt(tar4)))
    resultsSubList.setLineItemValue('custpage_m5', line + 1, formatNumberTotal(parseInt(tar5)))
    resultsSubList.setLineItemValue('custpage_m6', line + 1, formatNumberTotal(parseInt(tar6)))
    resultsSubList.setLineItemValue('custpage_m7', line + 1, formatNumberTotal(parseInt(tar7)))
    resultsSubList.setLineItemValue('custpage_m8', line + 1, formatNumberTotal(parseInt(tar8)))
    resultsSubList.setLineItemValue('custpage_m9', line + 1, formatNumberTotal(parseInt(tar9)))
    resultsSubList.setLineItemValue('custpage_m10', line + 1, formatNumberTotal(parseInt(tar10)))
    resultsSubList.setLineItemValue('custpage_m11', line + 1, formatNumberTotal(parseInt(tar11)))
    resultsSubList.setLineItemValue('custpage_m12', line + 1, formatNumberTotal(parseInt(tar12)))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 1, formatNumberTotal(parseInt(tar1)))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 1, formatNumberTotal(parseInt(tar2)))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 1, formatNumberTotal(parseInt(tar3)))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 1, formatNumberTotal(parseInt(tar4)))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 1, formatNumberTotal(parseInt(tar1)))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 1, formatNumberTotal(parseInt(tar2)))
    //line 3
    resultsSubList.setLineItemValue('custpage_n', line + 2, '');
    resultsSubList.setLineItemValue('custpage_p', line + 2, '% of Target');
    resultsSubList.setLineItemValue('custpage_total_t', line + 2, formatNumberPrecent(getPrecenge(total, target)) + '%')
    resultsSubList.setLineItemValue('custpage_total', line + 2, formatNumberPrecent(getPrecenge(total, target)) + '%')
    resultsSubList.setLineItemValue('custpage_m1', line + 2, formatNumberPrecent(getPrecenge(t1, tar1)) + '%')
    resultsSubList.setLineItemValue('custpage_m2', line + 2, formatNumberPrecent(getPrecenge(t2, tar2)) + '%')
    resultsSubList.setLineItemValue('custpage_m3', line + 2, formatNumberPrecent(getPrecenge(t3, tar3)) + '%')
    resultsSubList.setLineItemValue('custpage_m4', line + 2, formatNumberPrecent(getPrecenge(t4, tar4)) + '%')
    resultsSubList.setLineItemValue('custpage_m5', line + 2, formatNumberPrecent(getPrecenge(t5, tar5)) + '%')
    resultsSubList.setLineItemValue('custpage_m6', line + 2, formatNumberPrecent(getPrecenge(t6, tar6)) + '%')
    resultsSubList.setLineItemValue('custpage_m7', line + 2, formatNumberPrecent(getPrecenge(t7, tar7)) + '%')
    resultsSubList.setLineItemValue('custpage_m8', line + 2, formatNumberPrecent(getPrecenge(t8, tar8)) + '%')
    resultsSubList.setLineItemValue('custpage_m9', line + 2, formatNumberPrecent(getPrecenge(t9, tar9)) + '%')
    resultsSubList.setLineItemValue('custpage_m10', line + 2, formatNumberPrecent(getPrecenge(t10, tar10)) + '%')
    resultsSubList.setLineItemValue('custpage_m11', line + 2, formatNumberPrecent(getPrecenge(t11, tar11)) + '%')
    resultsSubList.setLineItemValue('custpage_m12', line + 2, formatNumberPrecent(getPrecenge(t12, tar12)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 2, formatNumberPrecent(getPrecenge(t1, tar1)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 2, formatNumberPrecent(getPrecenge(t2, tar2)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 2, formatNumberPrecent(getPrecenge(t3, tar3)) + '%')
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 2, formatNumberPrecent(getPrecenge(t4, tar4)) + '%')
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 2, formatNumberPrecent(getPrecenge(t1, tar1)) + '%')
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 2, formatNumberPrecent(getPrecenge(t2, tar2)) + '%')

    //line 4
    resultsSubList.setLineItemValue('custpage_n', line + 3, '');
    resultsSubList.setLineItemValue('custpage_p', line + 3, 'GAP (Amount)');
    resultsSubList.setLineItemValue('custpage_total_t', line + 3, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(gap))))
    resultsSubList.setLineItemValue('custpage_total', line + 3, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(gap))))
    resultsSubList.setLineItemValue('custpage_m1', line + 3, GGCT(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(gap1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line + 3, GGCT(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(gap2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line + 3, GGCT(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(gap3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line + 3, GGCT(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(gap4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line + 3, GGCT(formatNumberPrecent(getPrecenge(t5, tar5)) + '%', formatNumberTotal(parseInt(gap5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line + 3, GGCT(formatNumberPrecent(getPrecenge(t6, tar6)) + '%', formatNumberTotal(parseInt(gap6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line + 3, GGCT(formatNumberPrecent(getPrecenge(t7, tar7)) + '%', formatNumberTotal(parseInt(gap7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line + 3, GGCT(formatNumberPrecent(getPrecenge(t8, tar8)) + '%', formatNumberTotal(parseInt(gap8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line + 3, GGCT(formatNumberPrecent(getPrecenge(total9, tar9)) + '%', formatNumberTotal(parseInt(gap9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line + 3, GGCT(formatNumberPrecent(getPrecenge(t10, tar10)) + '%', formatNumberTotal(parseInt(gap10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line + 3, GGCT(formatNumberPrecent(getPrecenge(t11, tar11)) + '%', formatNumberTotal(parseInt(gap11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line + 3, GGCT(formatNumberPrecent(getPrecenge(t12, tar12)) + '%', formatNumberTotal(parseInt(gap12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(gap1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(gap2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(gap3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(gap4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(gap1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(gap2))))


    line = line + 3;

}
function getPFLIST(yearData) {
    PFLISTField = 'custrecord_pl_for_new_money'
    if (measureData == 2) { PFLISTField = 'custrecord_pl_for_money_loss' }
    var columns = new Array();
    columns[0] = new nlobjSearchColumn(PFLISTField);

    var filters = new Array();
 
    filters[0] = new nlobjSearchFilter('custrecord_pl_year', null, 'anyof', yearData)

    var search = nlapiCreateSearch('customrecord_product_line_setting_screen', filters, columns);

    var resultset = search.runSearch();
    var returns = [];
    var searchid = 0;
    var pfToHidde = [];
    var res;

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returns.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returns != null) {
        for (var i = 0; i < returns.length; i++) {
            res = returns[0].getValue(PFLISTField);
            if (!isNullOrEmpty(res)) {
                pfToHidde = res.split(',');
            }

        }
    }
    return pfToHidde;

}
function getProductFamilyList(pfToHidde) {
    nlapiLogExecution('debug', 'pfToHidde  ', pfToHidde.length);
    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid').setSort()

    var filters = new Array();
    if (pfToHidde.length > 0) {
        filters[0] = new nlobjSearchFilter('internalid', null, 'noneof', pfToHidde)
    }

    var search = nlapiCreateSearch('customlist_rev_rec_product_family_list', filters, columns);

    var resultset = search.runSearch();
    var returns = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returns.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returns != null) {
        for (var i = 0; i < returns.length; i++) {
            res.push({
                id: returns[i].getValue('internalid'),
                name: returns[i].getValue('name')
            });
        }
        res.push({
            id: "3",
            name: 'none'
        });
    }
    return res;
}
function getProductFamilyList2() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid').setSort()

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist_rev_rec_product_family_list', null, columns);

    var resultset = search.runSearch();
    var returns = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returns.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returns != null) {
        for (var i = 0; i < returns.length; i++) {
            res.push({
                id: returns[i].getValue('internalid'),
                name: returns[i].getValue('name')
            });
        }
        res.push({
            id: "3",
            name: 'none'
        });
    }
    return res;
}


