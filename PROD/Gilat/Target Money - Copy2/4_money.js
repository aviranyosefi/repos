function LossSalesRepTargets(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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
function LossSalesRepTargetsQuoartly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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
function LossSalesRepTargetsHalfYearly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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
function LossSalesRepTargetsPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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
function LossSalesRepTargetsQuoartlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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
function LossSalesRepTargetsHalfYearlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sale_rep_amounts_search');
        search.addFilter(new nlobjSearchFilter('custrecord_sr_year', null, 'anyof', yearData));
        search.addFilter(new nlobjSearchFilter('custrecord_sr_type', null, 'anyof', 2));
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


