var form;
var link = 'https://4998343.app.netsuite.com/app/site/hosting/scriptlet.nl?script=566&deploy=1&sales='
var line = 0;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var total1 = 0, total2 = 0, total3 = 0, total4 = 0, total5 = 0, total6 = 0, total7 = 0, total8 = 0, total9 = 0, total10 = 0, total11 = 0, total12 = 0;
var target1 = 0, target2 = 0, target3 = 0, target4 = 0, target5 = 0, target6 = 0, target7 = 0, target8 = 0, target9 = 0, target10 = 0, target11 = 0, target12 = 0;
var gap1 = 0, gap2 = 0, gap3 = 0, gap4 = 0, gap5 = 0, gap6 = 0, gap7 = 0, gap8 = 0, gap9 = 0, gap10 = 0, gap11 = 0, gap12 = 0;
var totalquoarterly1 = 0, totalquoarterly2 = 0, totalquoarterly3 = 0, totalquoarterly4 = 0;
var totaltargetquoarterly1 = 0, totaltargetquoarterly2 = 0, totaltargetquoarterly3 = 0, totaltargetquoarterly4 = 0;
var totalgapquoarterly1 = 0, totalgapquoarterly2 = 0, totalgapquoarterly3 = 0, totalgapquoarterly4 = 0;
var totalhalfYearly1 = 0, totalhalfYearly2 = 0;
var totaltargethalfYearly1 = 0, totaltargethalfYearly2 = 0;
var totalgaphalfYearly1 = 0, totalgaphalfYearly2 = 0;
////
var Totalbbs = 0, Totalvas = 0, Totalbod = 0, Totalcband = 0;
var Totaldomestic = 0, Totalip = 0, Totaliru = 0, Totalkuband = 0;
var Totalmobile_vsat = 0, Totalmpip = 0, Totalo3b = 0, Totalps = 0;
var Totalsr = 0, Totalhw = 0, Totaldhls_hw = 0, Totalgt = 0;

var targetbbs = 0, targetvas = 0, targetbod = 0, targetcband = 0;
var targetdomestic = 0, targetip = 0, targetiru = 0, targetkuband = 0;
var targetmobile_vsat = 0, targetmpip = 0, targeto3b = 0, targetps = 0;
var targetsr = 0, targethw = 0, targetdhls_hw = 0, targetgt = 0;

var gapbbs = 0, gapvas = 0, gapbod = 0, gapcband = 0;
var gapdomestic = 0, gapip = 0, gapiru = 0, gapkuband = 0;
var gapmobile_vsat = 0, gapmpip = 0, gapo3b = 0, gapps = 0;
var gapsr = 0, gaphw = 0, gapdhls_hw = 0, gapgt = 0;

var total1bbs = 0, total2bbs = 0, total3bbs = 0, total4bbs = 0, total5bbs = 0, total6bbs = 0, total7bbs = 0, total8bbs = 0, total9bbs = 0, total10bbs = 0, total11bbs = 0, total12bbs = 0;
var target1bbs = 0, target2bbs = 0, target3bbs = 0, target4bbs = 0, target5bbs = 0, target6bbs = 0, target7bbs = 0, target8bbs = 0, target9bbs = 0, target10bbs = 0, target11bbs = 0, target12bbs = 0;
var gap1bbs = 0, gap2bbs = 0, gap3bbs = 0, gap4bbs = 0, gap5bbs = 0, gap6bbs = 0, gap7bbs = 0, gap8bbs = 0, gap9bbs = 0, gap10bbs = 0, gap11bbs = 0, gap12bbs = 0;

var total1vas = 0, total2vas = 0, total3vas = 0, total4vas = 0, total5vas = 0, total6vas = 0, total7vas = 0, total8vas = 0, total9vas = 0, total10vas = 0, total11vas = 0, total12vas = 0;
var target1vas = 0, target2vas = 0, target3vas = 0, target4vas = 0, target5vas = 0, target6vas = 0, target7vas = 0, target8vas = 0, target9vas = 0, target10vas = 0, target11vas = 0, target12vas = 0;
var gap1vas = 0, gap2vas = 0, gap3vas = 0, gap4vas = 0, gap5vas = 0, gap6vas = 0, gap7vas = 0, gap8vas = 0, gap9vas = 0, gap10vas = 0, gap11vas = 0, gap12vas = 0;

var total1bod = 0, total2bod = 0, total3bod = 0, total4bod = 0, total5bod = 0, total6bod = 0, total7bod = 0, total8bod = 0, total9bod = 0, total10bod = 0, total11bod = 0, total12bod = 0;
var target1bod = 0, target2bod = 0, target3bod = 0, target4bod = 0, target5bod = 0, target6bod = 0, target7bod = 0, target8bod = 0, target9bod = 0, target10bod = 0, target11bod = 0, target12bod = 0;
var gap1bod = 0, gap2bod = 0, gap3bod = 0, gap4bod = 0, gap5bod = 0, gap6bod = 0, gap7bod = 0, gap8bod = 0, gap9bod = 0, gap10bod = 0, gap11bod = 0, gap12bod = 0;

var total1cband = 0, total2cband = 0, total3cband = 0, total4cband = 0, total5cband = 0, total6cband = 0, total7cband = 0, total8cband = 0, total9cband = 0, total10cband = 0, total11cband = 0, total12cband = 0;
var target1cband = 0, target2cband = 0, target3cband = 0, target4cband = 0, target5cband = 0, target6cband = 0, target7cband = 0, target8cband = 0, target9cband = 0, target10cband = 0, target11cband = 0, target12cband = 0;
var gap1cband = 0, gap2cband = 0, gap3cband = 0, gap4cband = 0, gap5cband = 0, gap6cband = 0, gap7cband = 0, gap8cband = 0, gap9cband = 0, gap10cband = 0, gap11cband = 0, gap12cband = 0;

var total1domestic = 0, total2domestic = 0, total3domestic = 0, total4domestic = 0, total5domestic = 0, total6domestic = 0, total7domestic = 0, total8domestic = 0, total9domestic = 0, total10domestic = 0, total11domestic = 0, total12domestic = 0;
var target1domestic = 0, target2domestic = 0, target3domestic = 0, target4domestic = 0, target5domestic = 0, target6domestic = 0, target7domestic = 0, target8domestic = 0, target9domestic = 0, target10domestic = 0, target11domestic = 0, target12domestic = 0;
var gap1domestic = 0, gap2domestic = 0, gap3domestic = 0, gap4domestic = 0, gap5domestic = 0, gap6domestic = 0, gap7domestic = 0, gap8domestic = 0, gap9domestic = 0, gap10domestic = 0, gap11domestic = 0, gap12domestic = 0;

var total1ip = 0, total2ip = 0, total3ip = 0, total4ip = 0, total5ip = 0, total6ip = 0, total7ip = 0, total8ip = 0, total9ip = 0, total10ip = 0, total11ip = 0, total12ip = 0;
var target1ip = 0, target2ip = 0, target3ip = 0, target4ip = 0, target5ip = 0, target6ip = 0, target7ip = 0, target8ip = 0, target9ip = 0, target10ip = 0, target11ip = 0, target12ip = 0;
var gap1ip = 0, gap2ip = 0, gap3ip = 0, gap4ip = 0, gap5ip = 0, gap6ip = 0, gap7ip = 0, gap8ip = 0, gap9ip = 0, gap10ip = 0, gap11ip = 0, gap12ip = 0;

var total1iru = 0, total2iru = 0, total3iru = 0, total4iru = 0, total5iru = 0, total6iru = 0, total7iru = 0, total8iru = 0, total9iru = 0, total10iru = 0, total11iru = 0, total12iru = 0;
var target1iru = 0, target2iru = 0, target3iru = 0, target4iru = 0, target5iru = 0, target6iru = 0, target7iru = 0, target8iru = 0, target9iru = 0, target10iru = 0, target11iru = 0, target12iru = 0;
var gap1iru = 0, gap2iru = 0, gap3iru = 0, gap4iru = 0, gap5iru = 0, gap6iru = 0, gap7iru = 0, gap8iru = 0, gap9iru = 0, gap10iru = 0, gap11iru = 0, gap12iru = 0;

var total1kuband = 0, total2kuband = 0, total3kuband = 0, total4kuband = 0, total5kuband = 0, total6kuband = 0, total7kuband = 0, total8kuband = 0, total9kuband = 0, total10kuband = 0, total11kuband = 0, total12kuband = 0;
var target1kuband = 0, target2kuband = 0, target3kuband = 0, target4kuband = 0, target5kuband = 0, target6kuband = 0, target7kuband = 0, target8kuband = 0, target9kuband = 0, target10kuband = 0, target11kuband = 0, target12kuband = 0;
var gap1kuband = 0, gap2kuband = 0, gap3kuband = 0, gap4kuband = 0, gap5kuband = 0, gap6kuband = 0, gap7kuband = 0, gap8kuband = 0, gap9kuband = 0, gap10kuband = 0, gap11kuband = 0, gap12kuband = 0;

var total1mobile_vsat = 0, total2mobile_vsat = 0, total3mobile_vsat = 0, total4mobile_vsat = 0, total5mobile_vsat = 0, total6mobile_vsat = 0, total7mobile_vsat = 0, total8mobile_vsat = 0, total9mobile_vsat = 0, total10mobile_vsat = 0, total11mobile_vsat = 0, total12mobile_vsat = 0;
var target1mobile_vsat = 0, target2mobile_vsat = 0, target3mobile_vsat = 0, target4mobile_vsat = 0, target5mobile_vsat = 0, target6mobile_vsat = 0, target7mobile_vsat = 0, target8mobile_vsat = 0, target9mobile_vsat = 0, target10mobile_vsat = 0, target11mobile_vsat = 0, target12mobile_vsat = 0;
var gap1mobile_vsat = 0, gap2mobile_vsat = 0, gap3mobile_vsat = 0, gap4mobile_vsat = 0, gap5mobile_vsat = 0, gap6mobile_vsat = 0, gap7mobile_vsat = 0, gap8mobile_vsat = 0, gap9mobile_vsat = 0, gap10mobile_vsat = 0, gap11mobile_vsat = 0, gap12mobile_vsat = 0;

var total1mpip = 0, total2mpip = 0, total3mpip = 0, total4mpip = 0, total5mpip = 0, total6mpip = 0, total7mpip = 0, total8mpip = 0, total9mpip = 0, total10mpip = 0, total11mpip = 0, total12mpip = 0;
var target1mpip = 0, target2mpip = 0, target3mpip = 0, target4mpip = 0, target5mpip = 0, target6mpip = 0, target7mpip = 0, target8mpip = 0, target9mpip = 0, target10mpip = 0, target11mpip = 0, target12mpip = 0;
var gap1mpip = 0, gap2mpip = 0, gap3mpip = 0, gap4mpip = 0, gap5mpip = 0, gap6mpip = 0, gap7mpip = 0, gap8mpip = 0, gap9mpip = 0, gap10mpip = 0, gap11mpip = 0, gap12mpip = 0;

var total1o3b = 0, total2o3b = 0, total3o3b = 0, total4o3b = 0, total5o3b = 0, total6o3b = 0, total7o3b = 0, total8o3b = 0, total9o3b = 0, total10o3b = 0, total11o3b = 0, total12o3b = 0;
var target1o3b = 0, target2o3b = 0, target3o3b = 0, target4o3b = 0, target5o3b = 0, target6o3b = 0, target7o3b = 0, target8o3b = 0, target9o3b = 0, target10o3b = 0, target11o3b = 0, target12o3b = 0;
var gap1o3b = 0, gap2o3b = 0, gap3o3b = 0, gap4o3b = 0, gap5o3b = 0, gap6o3b = 0, gap7o3b = 0, gap8o3b = 0, gap9o3b = 0, gap10o3b = 0, gap11o3b = 0, gap12o3b = 0;

var total1ps = 0, total2ps = 0, total3ps = 0, total4ps = 0, total5ps = 0, total6ps = 0, total7ps = 0, total8ps = 0, total9ps = 0, total10ps = 0, total11ps = 0, total12ps = 0;
var target1ps = 0, target2ps = 0, target3ps = 0, target4ps = 0, target5ps = 0, target6ps = 0, target7ps = 0, target8ps = 0, target9ps = 0, target10ps = 0, target11ps = 0, target12ps = 0;
var gap1ps = 0, gap2ps = 0, gap3ps = 0, gap4ps = 0, gap5ps = 0, gap6ps = 0, gap7ps = 0, gap8ps = 0, gap9ps = 0, gap10ps = 0, gap11ps = 0, gap12ps = 0;

var total1sr = 0, total2sr = 0, total3sr = 0, total4sr = 0, total5sr = 0, total6sr = 0, total7sr = 0, total8sr = 0, total9sr = 0, total10sr = 0, total11sr = 0, total12sr = 0;
var target1sr = 0, target2sr = 0, target3sr = 0, target4sr = 0, target5sr = 0, target6sr = 0, target7sr = 0, target8sr = 0, target9sr = 0, target10sr = 0, target11sr = 0, target12sr = 0;
var gap1sr = 0, gap2sr = 0, gap3sr = 0, gap4sr = 0, gap5sr = 0, gap6sr = 0, gap7sr = 0, gap8sr = 0, gap9sr = 0, gap10sr = 0, gap11sr = 0, gap12sr = 0;

var total1hw = 0, total2hw = 0, total3hw = 0, total4hw = 0, total5hw = 0, total6hw = 0, total7hw = 0, total8hw = 0, total9hw = 0, total10hw = 0, total11hw = 0, total12hw = 0;
var target1hw = 0, target2hw = 0, target3hw = 0, target4hw = 0, target5hw = 0, target6hw = 0, target7hw = 0, target8hw = 0, target9hw = 0, target10hw = 0, target11hw = 0, target12hw = 0;
var gap1hw = 0, gap2hw = 0, gap3hw = 0, gap4hw = 0, gap5hw = 0, gap6hw = 0, gap7hw = 0, gap8hw = 0, gap9hw = 0, gap10hw = 0, gap11hw = 0, gap12hw = 0;

var total1dhls_hw = 0, total2dhls_hw = 0, total3dhls_hw = 0, total4dhls_hw = 0, total5dhls_hw = 0, total6dhls_hw = 0, total7dhls_hw = 0, total8dhls_hw = 0, total9dhls_hw = 0, total10dhls_hw = 0, total11dhls_hw = 0, total12dhls_hw = 0;
var target1dhls_hw = 0, target2dhls_hw = 0, target3dhls_hw = 0, target4dhls_hw = 0, target5dhls_hw = 0, target6dhls_hw = 0, target7dhls_hw = 0, target8dhls_hw = 0, target9dhls_hw = 0, target10dhls_hw = 0, target11dhls_hw = 0, target12dhls_hw = 0;
var gap1dhls_hw = 0, gap2dhls_hw = 0, gap3dhls_hw = 0, gap4dhls_hw = 0, gap5dhls_hw = 0, gap6dhls_hw = 0, gap7dhls_hw = 0, gap8dhls_hw = 0, gap9dhls_hw = 0, gap10dhls_hw = 0, gap11dhls_hw = 0, gap12dhls_hw = 0;

var total1gt = 0, total2gt = 0, total3gt = 0, total4gt = 0, total5gt = 0, total6gt = 0, total7gt = 0, total8gt = 0, total9gt = 0, total10gt = 0, total11gt = 0, total12gt = 0;
var target1gt = 0, target2gt = 0, target3gt = 0, target4gt = 0, target5gt = 0, target6gt = 0, target7gt = 0, target8gt = 0, target9gt = 0, target10gt = 0, target11gt = 0, target12gt = 0;
var gap1gt = 0, gap2gt = 0, gap3gt = 0, gap4gt = 0, gap5gt = 0, gap6gt = 0, gap7gt = 0, gap8gt = 0, gap9gt = 0, gap10gt = 0, gap11gt = 0, gap12gt = 0;

function getName(name) {
    if (isNullOrEmpty(name)) { name = 'NONE' };
    return name;
}

function SalesRepTargets(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
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

                var data = allSelection[i].getValue("custrecord_data_amounts");
                if (!isNullOrEmpty(data)) {
                    var dataSplit = splitDataAmount(data)
                    var dataSplitSecond = splitDataAmountSecond(data)
                    var totalmount = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5] + dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                    var totaltarget = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));

                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        mounth1: dataSplit[0],
                        mounth2: dataSplit[1],
                        mounth3: dataSplit[2],
                        mounth4: dataSplit[3],
                        mounth5: dataSplit[4],
                        mounth6: dataSplit[5],
                        mounth7: dataSplit[6],
                        mounth8: dataSplit[7],
                        mounth9: dataSplit[8],
                        mounth10: dataSplit[9],
                        mounth11: dataSplit[10],
                        mounth12: dataSplit[11],
                        totalmount: formatNumber(totalmount),
                        target1: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_jan")),
                        target2: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_feb")),
                        target3: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_mar")),
                        target4: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_apr")),
                        target5: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_may")),
                        target6: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_jun")),
                        target7: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_jul")),
                        target8: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_aug")),
                        target9: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_sep")),
                        target10: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_oct")),
                        target11: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_nov")),
                        target12: formatNumber(allSelection[i].getValue("custrecord_target_godel_tik_dec")),
                        totaltarget: formatNumber(totaltarget),
                        gap1: formatNumber(dataSplitSecond[0] - allSelection[i].getValue("custrecord_target_godel_tik_jan")),
                        gap2: formatNumber(dataSplitSecond[1] - allSelection[i].getValue("custrecord_target_godel_tik_feb")),
                        gap3: formatNumber(dataSplitSecond[2] - allSelection[i].getValue("custrecord_target_godel_tik_mar")),
                        gap4: formatNumber(dataSplitSecond[3] - allSelection[i].getValue("custrecord_target_godel_tik_apr")),
                        gap5: formatNumber(dataSplitSecond[4] - allSelection[i].getValue("custrecord_target_godel_tik_may")),
                        gap6: formatNumber(dataSplitSecond[5] - allSelection[i].getValue("custrecord_target_godel_tik_jun")),
                        gap7: formatNumber(dataSplitSecond[6] - allSelection[i].getValue("custrecord_target_godel_tik_jul")),
                        gap8: formatNumber(dataSplitSecond[7] - allSelection[i].getValue("custrecord_target_godel_tik_aug")),
                        gap9: formatNumber(dataSplitSecond[8] - allSelection[i].getValue("custrecord_target_godel_tik_sep")),
                        gap10: formatNumber(dataSplitSecond[9] - allSelection[i].getValue("custrecord_target_godel_tik_oct")),
                        gap11: formatNumber(dataSplitSecond[10] - allSelection[i].getValue("custrecord_target_godel_tik_nov")),
                        gap12: formatNumber(dataSplitSecond[11] - allSelection[i].getValue("custrecord_target_godel_tik_dec")),
                        totalgap: formatNumber(totalmount - totaltarget),
                        perc1: formatNumber(getPrecenge(dataSplitSecond[0], allSelection[i].getValue("custrecord_target_godel_tik_jan"))) + '%',
                        perc2: formatNumber(getPrecenge(dataSplitSecond[1], allSelection[i].getValue("custrecord_target_godel_tik_feb"))) + '%',
                        perc3: formatNumber(getPrecenge(dataSplitSecond[2], allSelection[i].getValue("custrecord_target_godel_tik_mar"))) + '%',
                        perc4: formatNumber(getPrecenge(dataSplitSecond[3], allSelection[i].getValue("custrecord_target_godel_tik_apr"))) + '%',
                        perc5: formatNumber(getPrecenge(dataSplitSecond[4], allSelection[i].getValue("custrecord_target_godel_tik_may"))) + '%',
                        perc6: formatNumber(getPrecenge(dataSplitSecond[5], allSelection[i].getValue("custrecord_target_godel_tik_jun"))) + '%',
                        perc7: formatNumber(getPrecenge(dataSplitSecond[6], allSelection[i].getValue("custrecord_target_godel_tik_jul"))) + '%',
                        perc8: formatNumber(getPrecenge(dataSplitSecond[7], allSelection[i].getValue("custrecord_target_godel_tik_aug"))) + '%',
                        perc9: formatNumber(getPrecenge(dataSplitSecond[8], allSelection[i].getValue("custrecord_target_godel_tik_sep"))) + '%',
                        perc10: formatNumber(getPrecenge(dataSplitSecond[9], allSelection[i].getValue("custrecord_target_godel_tik_oct"))) + '%',
                        perc11: formatNumber(getPrecenge(dataSplitSecond[10], allSelection[i].getValue("custrecord_target_godel_tik_nov"))) + '%',
                        perc12: formatNumber(getPrecenge(dataSplitSecond[11], allSelection[i].getValue("custrecord_target_godel_tik_dec"))) + '%',
                        totalperc: formatNumber(getPrecenge(totalmount, totaltarget)) + '%',
                    });
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
        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
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

                var data = allSelection[i].getValue("custrecord_data_amounts")
                if (!isNullOrEmpty(data)) {
                    var dataSplitSecond = splitDataAmountSecond(data)

                    var quoarterly1 = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2];
                    var quoarterly2 = dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5];
                    var quoarterly3 = dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8];
                    var quoarterly4 = dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                    var totalquoarterly = quoarterly1 + quoarterly2 + quoarterly3 + quoarterly4
                    var target1 = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar"));
                    var target2 = Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun"));
                    var target3 = Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep"));
                    var target4 = Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
                    var totaltarget = target1 + target2 + target3 + target4;
                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        quoarterly1: formatNumber(quoarterly1),
                        quoarterly2: formatNumber(quoarterly2),
                        quoarterly3: formatNumber(quoarterly3),
                        quoarterly4: formatNumber(quoarterly4),
                        totalquoarterly: formatNumber(totalquoarterly),
                        target1: formatNumber(target1),
                        target2: formatNumber(target2),
                        target3: formatNumber(target3),
                        target4: formatNumber(target4),
                        totaltarget: formatNumber(totaltarget),
                        gap1: formatNumber(quoarterly1 - target1),
                        gap2: formatNumber(quoarterly2 - target2),
                        gap3: formatNumber(quoarterly3 - target3),
                        gap4: formatNumber(quoarterly4 - target4),
                        totalgap: formatNumber(totalquoarterly - totaltarget),
                        perc1: formatNumber(getPrecenge(quoarterly1, target1)) + '%',
                        perc2: formatNumber(getPrecenge(quoarterly2, target2)) + '%',
                        perc3: formatNumber(getPrecenge(quoarterly3, target3)) + '%',
                        perc4: formatNumber(getPrecenge(quoarterly4, target4)) + '%',
                        totalperc: formatNumber(getPrecenge(totalquoarterly, totaltarget)) + '%',
                    });
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
        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
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

                var data = allSelection[i].getValue("custrecord_data_amounts")
                if (!isNullOrEmpty(data)) {
                    var dataSplitSecond = splitDataAmountSecond(data)

                    var halfYearly1 = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5];
                    var halfYearly2 = dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                    var totalhalfYearly = halfYearly1 + halfYearly2;
                    var target1 = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun"));
                    var target2 = Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
                    var totaltarget = target1 + target2;
                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        halfYearly1: formatNumber(halfYearly1),
                        halfYearly2: formatNumber(halfYearly2),
                        totalhalfYearly: formatNumber(totalhalfYearly),
                        target1: formatNumber(target1),
                        target2: formatNumber(target2),
                        totaltarget: formatNumber(totaltarget),
                        gap1: formatNumber(halfYearly1 - target1),
                        gap2: formatNumber(halfYearly2 - target2),
                        totalgap: formatNumber(totalhalfYearly - totaltarget),
                        perc1: formatNumber(getPrecenge(halfYearly1, target1)) + '%',
                        perc2: formatNumber(getPrecenge(halfYearly2, target2)) + '%',
                        totalperc: formatNumber(getPrecenge(totalhalfYearly, totaltarget)) + '%',

                    });
                }
              

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearly func', e)
    }
    return Results;
}
function SalesRepTargetsClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }

        var newColumns = new Array();
        newColumns[0] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[1] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[2] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[3] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[4] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[5] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[6] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[7] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[8] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[9] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[10] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[11] = new nlobjSearchColumn('custrecord_gt_dec_rec');
        //
        newColumns[12] = new nlobjSearchColumn('custrecord_target_class_data');
        //
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_hw');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_hw');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_hw');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_hw');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_hw');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_hw');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_hw');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_hw');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_hw');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_hw');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_hw');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_hw');
        //
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_ic');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_ic');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_ic');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_ic');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_ic');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_ic');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_ic');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_ic');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_ic');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_ic');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_ic');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_ic');


        search.addColumns(newColumns);
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

                var data = allSelection[i].getValue("custrecord_target_class_data")
                if (!isNullOrEmpty(data)) {
                    var dataSplit = splitDataAmountClass(data)
                    var dataSplitSecond = splitDataAmountSecondClass(data)
                    var totalmount = dataSplitSecond[0].sumOfHLS + dataSplitSecond[1].sumOfHLS + dataSplitSecond[2].sumOfHLS + dataSplitSecond[3].sumOfHLS + dataSplitSecond[4].sumOfHLS + dataSplitSecond[5].sumOfHLS + dataSplitSecond[6].sumOfHLS + dataSplitSecond[7].sumOfHLS + dataSplitSecond[8].sumOfHLS + dataSplitSecond[9].sumOfHLS + dataSplitSecond[10].sumOfHLS + dataSplitSecond[11].sumOfHLS
                    var totaltarget = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec")) + Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec")) + Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec")) + Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"))
                    var totalsumOfHW = dataSplitSecond[0].sumOfHW + dataSplitSecond[1].sumOfHW + dataSplitSecond[2].sumOfHW + dataSplitSecond[3].sumOfHW + dataSplitSecond[4].sumOfHW + dataSplitSecond[5].sumOfHW + dataSplitSecond[6].sumOfHW + dataSplitSecond[7].sumOfHW + dataSplitSecond[8].sumOfHW + dataSplitSecond[9].sumOfHW + dataSplitSecond[10].sumOfHW + dataSplitSecond[11].sumOfHW
                    var totaltargetsumOfHW = Number(allSelection[i].getValue("custrecord_jan_hw")) + Number(allSelection[i].getValue("custrecord_feb_hw")) + Number(allSelection[i].getValue("custrecord_mar_hw")) + Number(allSelection[i].getValue("custrecord_apr_hw")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_jun_hw")) + Number(allSelection[i].getValue("custrecord_jul_hw")) + Number(allSelection[i].getValue("custrecord_aug_hw")) + Number(allSelection[i].getValue("custrecord_sep_hw")) + Number(allSelection[i].getValue("custrecord_oct_hw")) + Number(allSelection[i].getValue("custrecord_nov_hw")) + Number(allSelection[i].getValue("custrecord_dec_hw"))
                    var totalsumOfIC = dataSplitSecond[0].sumOfIC + dataSplitSecond[1].sumOfIC + dataSplitSecond[2].sumOfIC + dataSplitSecond[3].sumOfIC + dataSplitSecond[4].sumOfIC + dataSplitSecond[5].sumOfIC + dataSplitSecond[6].sumOfIC + dataSplitSecond[7].sumOfIC + dataSplitSecond[8].sumOfIC + dataSplitSecond[9].sumOfIC + dataSplitSecond[10].sumOfIC + dataSplitSecond[11].sumOfIC
                    var totaltargetsumOfIC = Number(allSelection[i].getValue("custrecord_jan_ic")) + Number(allSelection[i].getValue("custrecord_feb_ic")) + Number(allSelection[i].getValue("custrecord_mar_ic")) + Number(allSelection[i].getValue("custrecord_apr_ic")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_jun_ic")) + Number(allSelection[i].getValue("custrecord_jul_ic")) + Number(allSelection[i].getValue("custrecord_aug_ic")) + Number(allSelection[i].getValue("custrecord_sep_ic")) + Number(allSelection[i].getValue("custrecord_oct_ic")) + Number(allSelection[i].getValue("custrecord_nov_ic")) + Number(allSelection[i].getValue("custrecord_dec_ic"))
                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        mounth1: dataSplit[0].sumOfHLS,
                        mounth2: dataSplit[1].sumOfHLS,
                        mounth3: dataSplit[2].sumOfHLS,
                        mounth4: dataSplit[3].sumOfHLS,
                        mounth5: dataSplit[4].sumOfHLS,
                        mounth6: dataSplit[5].sumOfHLS,
                        mounth7: dataSplit[6].sumOfHLS,
                        mounth8: dataSplit[7].sumOfHLS,
                        mounth9: dataSplit[8].sumOfHLS,
                        mounth10: dataSplit[9].sumOfHLS,
                        mounth11: dataSplit[10].sumOfHLS,
                        mounth12: dataSplit[11].sumOfHLS,
                        totalmount: formatNumber(totalmount),
                        mounth1sumOfHW: dataSplit[0].sumOfHW,
                        mounth2sumOfHW: dataSplit[1].sumOfHW,
                        mounth3sumOfHW: dataSplit[2].sumOfHW,
                        mounth4sumOfHW: dataSplit[3].sumOfHW,
                        mounth5sumOfHW: dataSplit[4].sumOfHW,
                        mounth6sumOfHW: dataSplit[5].sumOfHW,
                        mounth7sumOfHW: dataSplit[6].sumOfHW,
                        mounth8sumOfHW: dataSplit[7].sumOfHW,
                        mounth9sumOfHW: dataSplit[8].sumOfHW,
                        mounth10sumOfHW: dataSplit[9].sumOfHW,
                        mounth11sumOfHW: dataSplit[10].sumOfHW,
                        mounth12sumOfHW: dataSplit[11].sumOfHW,
                        totalsumOfHW: formatNumber(totalsumOfHW),
                        mounth1sumOfIC: dataSplit[0].sumOfIC,
                        mounth2sumOfIC: dataSplit[1].sumOfIC,
                        mounth3sumOfIC: dataSplit[2].sumOfIC,
                        mounth4sumOfIC: dataSplit[3].sumOfIC,
                        mounth5sumOfIC: dataSplit[4].sumOfIC,
                        mounth6sumOfIC: dataSplit[5].sumOfIC,
                        mounth7sumOfIC: dataSplit[6].sumOfIC,
                        mounth8sumOfIC: dataSplit[7].sumOfIC,
                        mounth9sumOfIC: dataSplit[8].sumOfIC,
                        mounth10sumOfIC: dataSplit[9].sumOfIC,
                        mounth11sumOfIC: dataSplit[10].sumOfIC,
                        mounth12sumOfIC: dataSplit[11].sumOfIC,
                        totalsumOfIC: formatNumber(totalsumOfIC),
                        target1: formatNumber(allSelection[i].getValue("custrecord_gt_jan_rec")),
                        target2: formatNumber(allSelection[i].getValue("custrecord_gt_feb_rec")),
                        target3: formatNumber(allSelection[i].getValue("custrecord_gt_mar_rec")),
                        target4: formatNumber(allSelection[i].getValue("custrecord_gt_apr_rec")),
                        target5: formatNumber(allSelection[i].getValue("custrecord_gt_may_rec")),
                        target6: formatNumber(allSelection[i].getValue("custrecord_gt_jun_rec")),
                        target7: formatNumber(allSelection[i].getValue("custrecord_gt_jul_rec")),
                        target8: formatNumber(allSelection[i].getValue("custrecord_gt_aug_rec")),
                        target9: formatNumber(allSelection[i].getValue("custrecord_gt_sep_rec")),
                        target10: formatNumber(allSelection[i].getValue("custrecord_gt_oct_rec")),
                        target11: formatNumber(allSelection[i].getValue("custrecord_gt_nov_rec")),
                        target12: formatNumber(allSelection[i].getValue("custrecord_gt_dec_rec")),
                        totaltarget: formatNumber(totaltarget),
                        target1sumOfHW: formatNumber(allSelection[i].getValue("custrecord_jan_hw")),
                        target2sumOfHW: formatNumber(allSelection[i].getValue("custrecord_feb_hw")),
                        target3sumOfHW: formatNumber(allSelection[i].getValue("custrecord_mar_hw")),
                        target4sumOfHW: formatNumber(allSelection[i].getValue("custrecord_apr_hw")),
                        target5sumOfHW: formatNumber(allSelection[i].getValue("custrecord_may_hw")),
                        target6sumOfHW: formatNumber(allSelection[i].getValue("custrecord_jun_hw")),
                        target7sumOfHW: formatNumber(allSelection[i].getValue("custrecord_jul_hw")),
                        target8sumOfHW: formatNumber(allSelection[i].getValue("custrecord_aug_hw")),
                        target9sumOfHW: formatNumber(allSelection[i].getValue("custrecord_sep_hw")),
                        target10sumOfHW: formatNumber(allSelection[i].getValue("custrecord_oct_hw")),
                        target11sumOfHW: formatNumber(allSelection[i].getValue("custrecord_nov_hw")),
                        target12sumOfHW: formatNumber(allSelection[i].getValue("custrecord_dec_hw")),
                        totaltargetsumOfHW: formatNumber(totaltargetsumOfHW),
                        target1sumOfIC: formatNumber(allSelection[i].getValue("custrecord_jan_ic")),
                        target2sumOfIC: formatNumber(allSelection[i].getValue("custrecord_feb_ic")),
                        target3sumOfIC: formatNumber(allSelection[i].getValue("custrecord_mar_ic")),
                        target4sumOfIC: formatNumber(allSelection[i].getValue("custrecord_apr_ic")),
                        target5sumOfIC: formatNumber(allSelection[i].getValue("custrecord_may_ic")),
                        target6sumOfIC: formatNumber(allSelection[i].getValue("custrecord_jun_ic")),
                        target7sumOfIC: formatNumber(allSelection[i].getValue("custrecord_jul_ic")),
                        target8sumOfIC: formatNumber(allSelection[i].getValue("custrecord_aug_ic")),
                        target9sumOfIC: formatNumber(allSelection[i].getValue("custrecord_sep_ic")),
                        target10sumOfIC: formatNumber(allSelection[i].getValue("custrecord_oct_ic")),
                        target11sumOfIC: formatNumber(allSelection[i].getValue("custrecord_nov_ic")),
                        target12sumOfIC: formatNumber(allSelection[i].getValue("custrecord_dec_ic")),
                        totaltargetsumOfIC: formatNumber(totaltargetsumOfIC),
                        gap1: formatNumber(dataSplitSecond[0].sumOfHLS - allSelection[i].getValue("custrecord_gt_jan_rec")),
                        gap2: formatNumber(dataSplitSecond[1].sumOfHLS - allSelection[i].getValue("custrecord_gt_feb_rec")),
                        gap3: formatNumber(dataSplitSecond[2].sumOfHLS - allSelection[i].getValue("custrecord_gt_mar_rec")),
                        gap4: formatNumber(dataSplitSecond[3].sumOfHLS - allSelection[i].getValue("custrecord_gt_apr_rec")),
                        gap5: formatNumber(dataSplitSecond[4].sumOfHLS - allSelection[i].getValue("custrecord_gt_may_rec")),
                        gap6: formatNumber(dataSplitSecond[5].sumOfHLS - allSelection[i].getValue("custrecord_gt_jun_rec")),
                        gap7: formatNumber(dataSplitSecond[6].sumOfHLS - allSelection[i].getValue("custrecord_gt_jul_rec")),
                        gap8: formatNumber(dataSplitSecond[7].sumOfHLS - allSelection[i].getValue("custrecord_gt_aug_rec")),
                        gap9: formatNumber(dataSplitSecond[8].sumOfHLS - allSelection[i].getValue("custrecord_gt_sep_rec")),
                        gap10: formatNumber(dataSplitSecond[9].sumOfHLS - allSelection[i].getValue("custrecord_gt_oct_rec")),
                        gap11: formatNumber(dataSplitSecond[10].sumOfHLS - allSelection[i].getValue("custrecord_gt_nov_rec")),
                        gap12: formatNumber(dataSplitSecond[11].sumOfHLS - allSelection[i].getValue("custrecord_gt_dec_rec")),
                        totalgap: formatNumber(totalmount - totaltarget),
                        gap1sumOfHW: formatNumber(dataSplitSecond[0].sumOfHW - allSelection[i].getValue("custrecord_jan_hw")),
                        gap2sumOfHW: formatNumber(dataSplitSecond[1].sumOfHW - allSelection[i].getValue("custrecord_feb_hw")),
                        gap3sumOfHW: formatNumber(dataSplitSecond[2].sumOfHW - allSelection[i].getValue("custrecord_mar_hw")),
                        gap4sumOfHW: formatNumber(dataSplitSecond[3].sumOfHW - allSelection[i].getValue("custrecord_apr_hw")),
                        gap5sumOfHW: formatNumber(dataSplitSecond[4].sumOfHW - allSelection[i].getValue("custrecord_may_hw")),
                        gap6sumOfHW: formatNumber(dataSplitSecond[5].sumOfHW - allSelection[i].getValue("custrecord_jun_hw")),
                        gap7sumOfHW: formatNumber(dataSplitSecond[6].sumOfHW - allSelection[i].getValue("custrecord_jul_hw")),
                        gap8sumOfHW: formatNumber(dataSplitSecond[7].sumOfHW - allSelection[i].getValue("custrecord_aug_hw")),
                        gap9sumOfHW: formatNumber(dataSplitSecond[8].sumOfHW - allSelection[i].getValue("custrecord_sep_hw")),
                        gap10sumOfHW: formatNumber(dataSplitSecond[9].sumOfHW - allSelection[i].getValue("custrecord_oct_hw")),
                        gap11sumOfHW: formatNumber(dataSplitSecond[10].sumOfHW - allSelection[i].getValue("custrecord_nov_hw")),
                        gap12sumOfHW: formatNumber(dataSplitSecond[11].sumOfHW - allSelection[i].getValue("custrecord_dec_hw")),
                        totalgapsumOfHW: formatNumber(totalsumOfHW - totaltargetsumOfHW),
                        gap1sumOfIC: formatNumber(dataSplitSecond[0].sumOfIC - allSelection[i].getValue("custrecord_jan_ic")),
                        gap2sumOfIC: formatNumber(dataSplitSecond[1].sumOfIC - allSelection[i].getValue("custrecord_feb_ic")),
                        gap3sumOfIC: formatNumber(dataSplitSecond[2].sumOfIC - allSelection[i].getValue("custrecord_mar_ic")),
                        gap4sumOfIC: formatNumber(dataSplitSecond[3].sumOfIC - allSelection[i].getValue("custrecord_apr_ic")),
                        gap5sumOfIC: formatNumber(dataSplitSecond[4].sumOfIC - allSelection[i].getValue("custrecord_may_ic")),
                        gap6sumOfIC: formatNumber(dataSplitSecond[5].sumOfIC - allSelection[i].getValue("custrecord_jun_ic")),
                        gap7sumOfIC: formatNumber(dataSplitSecond[6].sumOfIC - allSelection[i].getValue("custrecord_jul_ic")),
                        gap8sumOfIC: formatNumber(dataSplitSecond[7].sumOfIC - allSelection[i].getValue("custrecord_aug_ic")),
                        gap9sumOfIC: formatNumber(dataSplitSecond[8].sumOfIC - allSelection[i].getValue("custrecord_sep_ic")),
                        gap10sumOfIC: formatNumber(dataSplitSecond[9].sumOfIC - allSelection[i].getValue("custrecord_oct_ic")),
                        gap11sumOfIC: formatNumber(dataSplitSecond[10].sumOfIC - allSelection[i].getValue("custrecord_nov_ic")),
                        gap12sumOfIC: formatNumber(dataSplitSecond[11].sumOfIC - allSelection[i].getValue("custrecord_dec_ic")),
                        totalgapsumOfIC: formatNumber(totalsumOfIC - totaltargetsumOfIC),
                        perc1: formatNumber(getPrecenge(dataSplitSecond[0].sumOfHLS, allSelection[i].getValue("custrecord_gt_jan_rec"))) + '%',
                        perc2: formatNumber(getPrecenge(dataSplitSecond[1].sumOfHLS, allSelection[i].getValue("custrecord_gt_feb_rec"))) + '%',
                        perc3: formatNumber(getPrecenge(dataSplitSecond[2].sumOfHLS, allSelection[i].getValue("custrecord_gt_mar_rec"))) + '%',
                        perc4: formatNumber(getPrecenge(dataSplitSecond[3].sumOfHLS, allSelection[i].getValue("custrecord_gt_apr_rec"))) + '%',
                        perc5: formatNumber(getPrecenge(dataSplitSecond[4].sumOfHLS, allSelection[i].getValue("custrecord_gt_may_rec"))) + '%',
                        perc6: formatNumber(getPrecenge(dataSplitSecond[5].sumOfHLS, allSelection[i].getValue("custrecord_gt_jun_rec"))) + '%',
                        perc7: formatNumber(getPrecenge(dataSplitSecond[6].sumOfHLS, allSelection[i].getValue("custrecord_gt_jul_rec"))) + '%',
                        perc8: formatNumber(getPrecenge(dataSplitSecond[7].sumOfHLS, allSelection[i].getValue("custrecord_gt_aug_rec"))) + '%',
                        perc9: formatNumber(getPrecenge(dataSplitSecond[8].sumOfHLS, allSelection[i].getValue("custrecord_gt_sep_rec"))) + '%',
                        perc10: formatNumber(getPrecenge(dataSplitSecond[9].sumOfHLS, allSelection[i].getValue("custrecord_gt_oct_rec"))) + '%',
                        perc11: formatNumber(getPrecenge(dataSplitSecond[10].sumOfHLS, allSelection[i].getValue("custrecord_gt_nov_rec"))) + '%',
                        perc12: formatNumber(getPrecenge(dataSplitSecond[11].sumOfHLS, allSelection[i].getValue("custrecord_gt_dec_rec"))) + '%',
                        totalperc: formatNumber(getPrecenge(totalmount, totaltarget)) + '%',
                        perc1sumOfHW: formatNumber(getPrecenge(dataSplitSecond[0].sumOfHW, allSelection[i].getValue("custrecord_jan_hw"))) + '%',
                        perc2sumOfHW: formatNumber(getPrecenge(dataSplitSecond[1].sumOfHW, allSelection[i].getValue("custrecord_feb_hw"))) + '%',
                        perc3sumOfHW: formatNumber(getPrecenge(dataSplitSecond[2].sumOfHW, allSelection[i].getValue("custrecord_mar_hw"))) + '%',
                        perc4sumOfHW: formatNumber(getPrecenge(dataSplitSecond[3].sumOfHW, allSelection[i].getValue("custrecord_apr_hw"))) + '%',
                        perc5sumOfHW: formatNumber(getPrecenge(dataSplitSecond[4].sumOfHW, allSelection[i].getValue("custrecord_may_hw"))) + '%',
                        perc6sumOfHW: formatNumber(getPrecenge(dataSplitSecond[5].sumOfHW, allSelection[i].getValue("custrecord_jun_hw"))) + '%',
                        perc7sumOfHW: formatNumber(getPrecenge(dataSplitSecond[6].sumOfHW, allSelection[i].getValue("custrecord_jul_hw"))) + '%',
                        perc8sumOfHW: formatNumber(getPrecenge(dataSplitSecond[7].sumOfHW, allSelection[i].getValue("custrecord_aug_hw"))) + '%',
                        perc9sumOfHW: formatNumber(getPrecenge(dataSplitSecond[8].sumOfHW, allSelection[i].getValue("custrecord_sep_hw"))) + '%',
                        perc10sumOfHW: formatNumber(getPrecenge(dataSplitSecond[9].sumOfHW, allSelection[i].getValue("custrecord_oct_hw"))) + '%',
                        perc11sumOfHW: formatNumber(getPrecenge(dataSplitSecond[10].sumOfHW, allSelection[i].getValue("custrecord_nov_hw"))) + '%',
                        perc12sumOfHW: formatNumber(getPrecenge(dataSplitSecond[11].sumOfHW, allSelection[i].getValue("custrecord_dec_hw"))) + '%',
                        totalpercsumOfHW: formatNumber(getPrecenge(totalsumOfHW, totaltargetsumOfHW)) + '%',
                        perc1sumOfIC: formatNumber(getPrecenge(dataSplitSecond[0].sumOfIC, allSelection[i].getValue("custrecord_jan_ic"))) + '%',
                        perc2sumOfIC: formatNumber(getPrecenge(dataSplitSecond[1].sumOfIC, allSelection[i].getValue("custrecord_feb_ic"))) + '%',
                        perc3sumOfIC: formatNumber(getPrecenge(dataSplitSecond[2].sumOfIC, allSelection[i].getValue("custrecord_mar_ic"))) + '%',
                        perc4sumOfIC: formatNumber(getPrecenge(dataSplitSecond[3].sumOfIC, allSelection[i].getValue("custrecord_apr_ic"))) + '%',
                        perc5sumOfIC: formatNumber(getPrecenge(dataSplitSecond[4].sumOfIC, allSelection[i].getValue("custrecord_may_ic"))) + '%',
                        perc6sumOfIC: formatNumber(getPrecenge(dataSplitSecond[5].sumOfIC, allSelection[i].getValue("custrecord_jun_ic"))) + '%',
                        perc7sumOfIC: formatNumber(getPrecenge(dataSplitSecond[6].sumOfIC, allSelection[i].getValue("custrecord_jul_ic"))) + '%',
                        perc8sumOfIC: formatNumber(getPrecenge(dataSplitSecond[7].sumOfIC, allSelection[i].getValue("custrecord_aug_ic"))) + '%',
                        perc9sumOfIC: formatNumber(getPrecenge(dataSplitSecond[8].sumOfIC, allSelection[i].getValue("custrecord_sep_ic"))) + '%',
                        perc10sumOfIC: formatNumber(getPrecenge(dataSplitSecond[9].sumOfIC, allSelection[i].getValue("custrecord_oct_ic"))) + '%',
                        perc11sumOfIC: formatNumber(getPrecenge(dataSplitSecond[10].sumOfIC, allSelection[i].getValue("custrecord_nov_ic"))) + '%',
                        perc12sumOfIC: formatNumber(getPrecenge(dataSplitSecond[11].sumOfIC, allSelection[i].getValue("custrecord_dec_ic"))) + '%',
                        totalpercsumOfIC: formatNumber(getPrecenge(totalsumOfIC, totaltargetsumOfIC)) + '%',

                    });
                }
          

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsClass func', e)
    }
    return Results;
}
function SalesRepTargetsQuoartlyClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }

        var newColumns = new Array();
        newColumns[0] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[1] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[2] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[3] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[4] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[5] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[6] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[7] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[8] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[9] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[10] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[11] = new nlobjSearchColumn('custrecord_gt_dec_rec');
        //
        newColumns[12] = new nlobjSearchColumn('custrecord_target_class_data');
        //
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_hw');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_hw');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_hw');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_hw');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_hw');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_hw');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_hw');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_hw');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_hw');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_hw');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_hw');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_hw');
        //
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_ic');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_ic');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_ic');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_ic');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_ic');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_ic');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_ic');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_ic');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_ic');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_ic');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_ic');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_ic');

        search.addColumns(newColumns);

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

                var data = allSelection[i].getValue("custrecord_target_class_data")
                if (!isNullOrEmpty(data)) {
                    var dataSplitSecond = splitDataAmountSecondClass(data)

                    var quoarterly1 = dataSplitSecond[0].sumOfHLS + dataSplitSecond[1].sumOfHLS + dataSplitSecond[2].sumOfHLS;
                    var quoarterly2 = dataSplitSecond[3].sumOfHLS + dataSplitSecond[4].sumOfHLS + dataSplitSecond[5].sumOfHLS;
                    var quoarterly3 = dataSplitSecond[6].sumOfHLS + dataSplitSecond[7].sumOfHLS + dataSplitSecond[8].sumOfHLS;
                    var quoarterly4 = dataSplitSecond[9].sumOfHLS + dataSplitSecond[10].sumOfHLS + dataSplitSecond[11].sumOfHLS;
                    var totalquoarterly = quoarterly1 + quoarterly2 + quoarterly3 + quoarterly4;

                    var quoarterly1sumOfHW = dataSplitSecond[0].sumOfHW + dataSplitSecond[1].sumOfHW + dataSplitSecond[2].sumOfHW;
                    var quoarterly2sumOfHW = dataSplitSecond[3].sumOfHW + dataSplitSecond[4].sumOfHW + dataSplitSecond[5].sumOfHW;
                    var quoarterly3sumOfHW = dataSplitSecond[6].sumOfHW + dataSplitSecond[7].sumOfHW + dataSplitSecond[8].sumOfHW;
                    var quoarterly4sumOfHW = dataSplitSecond[9].sumOfHW + dataSplitSecond[10].sumOfHW + dataSplitSecond[11].sumOfHW;
                    var totalquoarterlysumOfHW = quoarterly1sumOfHW + quoarterly2sumOfHW + quoarterly3sumOfHW + quoarterly4sumOfHW

                    var quoarterly1sumOfIC = dataSplitSecond[0].sumOfIC + dataSplitSecond[1].sumOfIC + dataSplitSecond[2].sumOfIC;
                    var quoarterly2sumOfIC = dataSplitSecond[3].sumOfIC + dataSplitSecond[4].sumOfIC + dataSplitSecond[5].sumOfIC;
                    var quoarterly3sumOfIC = dataSplitSecond[6].sumOfIC + dataSplitSecond[7].sumOfIC + dataSplitSecond[8].sumOfIC;
                    var quoarterly4sumOfIC = dataSplitSecond[9].sumOfIC + dataSplitSecond[10].sumOfIC + dataSplitSecond[11].sumOfIC;
                    var totalquoarterlysumOfIC = quoarterly1sumOfIC + quoarterly2sumOfIC + quoarterly3sumOfIC + quoarterly4sumOfIC

                    var target1 = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec"));
                    var target2 = Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec"));
                    var target3 = Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec"));
                    var target4 = Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"));
                    var totaltarget = target1 + target2 + target3 + target4;

                    var target1sumOfHW = Number(allSelection[i].getValue("custrecord_jan_hw")) + Number(allSelection[i].getValue("custrecord_feb_hw")) + Number(allSelection[i].getValue("custrecord_mar_hw"));
                    var target2sumOfHW = Number(allSelection[i].getValue("custrecord_apr_hw")) + Number(allSelection[i].getValue("custrecord_may_hw")) + Number(allSelection[i].getValue("custrecord_jun_hw"));
                    var target3sumOfHW = Number(allSelection[i].getValue("custrecord_jul_hw")) + Number(allSelection[i].getValue("custrecord_aug_hw")) + Number(allSelection[i].getValue("custrecord_sep_hw"));
                    var target4sumOfHW = Number(allSelection[i].getValue("custrecord_oct_hw")) + Number(allSelection[i].getValue("custrecord_nov_hw")) + Number(allSelection[i].getValue("custrecord_dec_hw"));
                    var totaltargetsumOfHW = target1sumOfHW + target2sumOfHW + target3sumOfHW + target4sumOfHW;

                    var target1sumOfIC = Number(allSelection[i].getValue("custrecord_jan_ic")) + Number(allSelection[i].getValue("custrecord_feb_ic")) + Number(allSelection[i].getValue("custrecord_mar_ic"));
                    var target2sumOfIC = Number(allSelection[i].getValue("custrecord_apr_ic")) + Number(allSelection[i].getValue("custrecord_may_ic")) + Number(allSelection[i].getValue("custrecord_jun_ic"));
                    var target3sumOfIC = Number(allSelection[i].getValue("custrecord_jul_ic")) + Number(allSelection[i].getValue("custrecord_aug_ic")) + Number(allSelection[i].getValue("custrecord_sep_ic"));
                    var target4sumOfIC = Number(allSelection[i].getValue("custrecord_oct_ic")) + Number(allSelection[i].getValue("custrecord_nov_ic")) + Number(allSelection[i].getValue("custrecord_dec_ic"));
                    var totaltargetsumOfIC = target1sumOfIC + target2sumOfIC + target3sumOfIC + target4sumOfIC;

                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        quoarterly1: formatNumber(quoarterly1),
                        quoarterly2: formatNumber(quoarterly2),
                        quoarterly3: formatNumber(quoarterly3),
                        quoarterly4: formatNumber(quoarterly4),
                        totalquoarterly: formatNumber(totalquoarterly),
                        quoarterly1sumOfHW: formatNumber(quoarterly1sumOfHW),
                        quoarterly2sumOfHW: formatNumber(quoarterly2sumOfHW),
                        quoarterly3sumOfHW: formatNumber(quoarterly3sumOfHW),
                        quoarterly4sumOfHW: formatNumber(quoarterly4sumOfHW),
                        totalquoarterlysumOfHW: formatNumber(totalquoarterlysumOfHW),
                        quoarterly1sumOfIC: formatNumber(quoarterly1sumOfIC),
                        quoarterly2sumOfIC: formatNumber(quoarterly2sumOfIC),
                        quoarterly3sumOfIC: formatNumber(quoarterly3sumOfIC),
                        quoarterly4sumOfIC: formatNumber(quoarterly4sumOfIC),
                        totalquoarterlysumOfIC: formatNumber(totalquoarterlysumOfIC),
                        target1: formatNumber(target1),
                        target2: formatNumber(target2),
                        target3: formatNumber(target3),
                        target4: formatNumber(target4),
                        totaltarget: formatNumber(totaltarget),
                        target1sumOfHW: formatNumber(target1sumOfHW),
                        target2sumOfHW: formatNumber(target2sumOfHW),
                        target3sumOfHW: formatNumber(target3sumOfHW),
                        target4sumOfHW: formatNumber(target4sumOfHW),
                        totaltargetsumOfHW: formatNumber(totaltargetsumOfHW),
                        target1sumOfIC: formatNumber(target1sumOfIC),
                        target2sumOfIC: formatNumber(target2sumOfIC),
                        target3sumOfIC: formatNumber(target3sumOfIC),
                        target4sumOfIC: formatNumber(target4sumOfIC),
                        totaltargetsumOfIC: formatNumber(totaltargetsumOfIC),
                        gap1: formatNumber(quoarterly1 - target1),
                        gap2: formatNumber(quoarterly2 - target2),
                        gap3: formatNumber(quoarterly3 - target3),
                        gap4: formatNumber(quoarterly4 - target4),
                        totalgap: formatNumber(totalquoarterly - totaltarget),
                        gap1sumOfHW: formatNumber(quoarterly1sumOfHW - target1sumOfHW),
                        gap2sumOfHW: formatNumber(quoarterly2sumOfHW - target2sumOfHW),
                        gap3sumOfHW: formatNumber(quoarterly3sumOfHW - target3sumOfHW),
                        gap4sumOfHW: formatNumber(quoarterly4sumOfHW - target4sumOfHW),
                        totalgapsumOfHW: formatNumber(totalquoarterlysumOfHW - totaltargetsumOfHW),
                        gap1sumOfIC: formatNumber(quoarterly1sumOfIC - target1sumOfIC),
                        gap2sumOfIC: formatNumber(quoarterly2sumOfIC - target2sumOfIC),
                        gap3sumOfIC: formatNumber(quoarterly3sumOfIC - target3sumOfIC),
                        gap4sumOfIC: formatNumber(quoarterly4sumOfIC - target4sumOfIC),
                        totalgapsumOfIC: formatNumber(totalquoarterlysumOfIC - totaltargetsumOfIC),
                        perc1: formatNumber(getPrecenge(quoarterly1, target1)) + '%',
                        perc2: formatNumber(getPrecenge(quoarterly2, target2)) + '%',
                        perc3: formatNumber(getPrecenge(quoarterly3, target3)) + '%',
                        perc4: formatNumber(getPrecenge(quoarterly4, target4)) + '%',
                        totalperc: formatNumber(getPrecenge(totalquoarterly, totaltarget)) + '%',
                        perc1sumOfHW: formatNumber(getPrecenge(quoarterly1sumOfHW, target1sumOfHW)) + '%',
                        perc2sumOfHW: formatNumber(getPrecenge(quoarterly2sumOfHW, target2sumOfHW)) + '%',
                        perc3sumOfHW: formatNumber(getPrecenge(quoarterly3sumOfHW, target3sumOfHW)) + '%',
                        perc4sumOfHW: formatNumber(getPrecenge(quoarterly4sumOfHW, target4sumOfHW)) + '%',
                        totalpercsumOfHW: formatNumber(getPrecenge(totalquoarterlysumOfHW, totaltargetsumOfHW)) + '%',
                        perc1sumOfIC: formatNumber(getPrecenge(quoarterly1sumOfIC, target1sumOfIC)) + '%',
                        perc2sumOfIC: formatNumber(getPrecenge(quoarterly2sumOfIC, target2sumOfIC)) + '%',
                        perc3sumOfIC: formatNumber(getPrecenge(quoarterly3sumOfIC, target3sumOfIC)) + '%',
                        perc4sumOfIC: formatNumber(getPrecenge(quoarterly4sumOfIC, target4sumOfIC)) + '%',
                        totalpercsumOfIC: formatNumber(getPrecenge(totalquoarterlysumOfIC, totaltargetsumOfIC)) + '%',

                    });
                }
          

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsQuoartlyClass func', e)
    }
    return Results;
}
function SalesRepTargetsHalfYearlyClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }

        var newColumns = new Array();
        newColumns[0] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[1] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[2] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[3] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[4] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[5] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[6] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[7] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[8] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[9] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[10] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[11] = new nlobjSearchColumn('custrecord_gt_dec_rec');
        //
        newColumns[12] = new nlobjSearchColumn('custrecord_target_class_data');
        //
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_hw');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_hw');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_hw');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_hw');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_hw');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_hw');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_hw');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_hw');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_hw');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_hw');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_hw');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_hw');
        //
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_ic');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_ic');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_ic');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_ic');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_ic');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_ic');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_ic');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_ic');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_ic');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_ic');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_ic');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_ic');

        search.addColumns(newColumns);

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

                var data = allSelection[i].getValue("custrecord_target_class_data")
                if (!isNullOrEmpty(data)) {
                    var dataSplitSecond = splitDataAmountSecondClass(data)

                    var halfYearly1 = dataSplitSecond[0].sumOfHLS + dataSplitSecond[1].sumOfHLS + dataSplitSecond[2].sumOfHLS + dataSplitSecond[3].sumOfHLS + dataSplitSecond[4].sumOfHLS + dataSplitSecond[5].sumOfHLS;
                    var halfYearly2 = dataSplitSecond[6].sumOfHLS + dataSplitSecond[7].sumOfHLS + dataSplitSecond[8].sumOfHLS + dataSplitSecond[9].sumOfHLS + dataSplitSecond[10].sumOfHLS + dataSplitSecond[11].sumOfHLS;
                    var totalhalfYearly = halfYearly1 + halfYearly2;

                    var halfYearly1sumOfHW = dataSplitSecond[0].sumOfHW + dataSplitSecond[1].sumOfHW + dataSplitSecond[2].sumOfHW + dataSplitSecond[3].sumOfHW + dataSplitSecond[4].sumOfHW + dataSplitSecond[5].sumOfHW;
                    var halfYearly2sumOfHW = dataSplitSecond[6].sumOfHW + dataSplitSecond[7].sumOfHW + dataSplitSecond[8].sumOfHW + dataSplitSecond[9].sumOfHW + dataSplitSecond[10].sumOfHW + dataSplitSecond[11].sumOfHW;
                    var totalhalfYearlysumOfHW = halfYearly1sumOfHW + halfYearly2sumOfHW;

                    var halfYearly1sumOfIC = dataSplitSecond[0].sumOfIC + dataSplitSecond[1].sumOfIC + dataSplitSecond[2].sumOfIC + dataSplitSecond[3].sumOfIC + dataSplitSecond[4].sumOfIC + dataSplitSecond[5].sumOfIC;
                    var halfYearly2sumOfIC = dataSplitSecond[6].sumOfIC + dataSplitSecond[7].sumOfIC + dataSplitSecond[8].sumOfIC + dataSplitSecond[9].sumOfIC + dataSplitSecond[10].sumOfIC + dataSplitSecond[11].sumOfIC;
                    var totalhalfYearlysumOfIC = halfYearly1sumOfIC + halfYearly2sumOfIC;

                    var target1 = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec")) + Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec"));
                    var target2 = Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec")) + Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"));
                    var totaltarget = target1 + target2;

                    var target1sumOfHW = Number(allSelection[i].getValue("custrecord_jan_hw")) + Number(allSelection[i].getValue("custrecord_feb_hw")) + Number(allSelection[i].getValue("custrecord_mar_hw")) + Number(allSelection[i].getValue("custrecord_apr_hw")) + Number(allSelection[i].getValue("custrecord_may_hw")) + Number(allSelection[i].getValue("custrecord_jun_hw"));
                    var target2sumOfHW = Number(allSelection[i].getValue("custrecord_jul_hw")) + Number(allSelection[i].getValue("custrecord_aug_hw")) + Number(allSelection[i].getValue("custrecord_sep_hw")) + Number(allSelection[i].getValue("custrecord_nov_hw")) + Number(allSelection[i].getValue("custrecord_dec_hw")) + Number(allSelection[i].getValue("custrecord_oct_hw"));
                    var totaltargetsumOfHW = target1sumOfHW + target2sumOfHW;

                    var target1sumOfIC = Number(allSelection[i].getValue("custrecord_jan_ic")) + Number(allSelection[i].getValue("custrecord_feb_ic")) + Number(allSelection[i].getValue("custrecord_mar_ic")) + Number(allSelection[i].getValue("custrecord_apr_ic")) + Number(allSelection[i].getValue("custrecord_may_ic")) + Number(allSelection[i].getValue("custrecord_jun_ic"));
                    var target2sumOfIC = Number(allSelection[i].getValue("custrecord_jul_ic")) + Number(allSelection[i].getValue("custrecord_aug_ic")) + Number(allSelection[i].getValue("custrecord_sep_ic")) + Number(allSelection[i].getValue("custrecord_oct_ic")) + Number(allSelection[i].getValue("custrecord_nov_ic")) + Number(allSelection[i].getValue("custrecord_dec_ic"));
                    var totaltargetsumOfIC = target1sumOfIC + target2sumOfIC;

                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        halfYearly1: formatNumber(halfYearly1),
                        halfYearly2: formatNumber(halfYearly2),
                        totalhalfYearly: formatNumber(totalhalfYearly),
                        halfYearly1sumOfHW: formatNumber(halfYearly1sumOfHW),
                        halfYearly2sumOfHW: formatNumber(halfYearly2sumOfHW),
                        totalhalfYearlysumOfHW: formatNumber(totalhalfYearlysumOfHW),
                        halfYearly1sumOfIC: formatNumber(halfYearly1sumOfIC),
                        halfYearly2sumOfIC: formatNumber(halfYearly2sumOfIC),
                        totalhalfYearlysumOfIC: formatNumber(totalhalfYearlysumOfIC),
                        target1: formatNumber(target1),
                        target2: formatNumber(target2),
                        totaltarget: formatNumber(totaltarget),
                        target1sumOfHW: formatNumber(target1sumOfHW),
                        target2sumOfHW: formatNumber(target2sumOfHW),
                        totaltargetsumOfHW: formatNumber(totaltargetsumOfHW),
                        target1sumOfIC: formatNumber(target1sumOfIC),
                        target2sumOfIC: formatNumber(target2sumOfIC),
                        totaltargetsumOfIC: formatNumber(totaltargetsumOfIC),
                        gap1: formatNumber(halfYearly1 - target1),
                        gap2: formatNumber(halfYearly2 - target2),
                        totalgap: formatNumber(totalhalfYearly - totaltarget),
                        gap1sumOfHW: formatNumber(halfYearly1sumOfHW - target1sumOfHW),
                        gap2sumOfHW: formatNumber(halfYearly2sumOfHW - target2sumOfHW),
                        totalgapsumOfHW: formatNumber(totalhalfYearlysumOfHW - totaltargetsumOfHW),
                        gap1sumOfIC: formatNumber(halfYearly1sumOfIC - target1sumOfIC),
                        gap2sumOfIC: formatNumber(halfYearly2sumOfIC - target2sumOfIC),
                        totalgapsumOfIC: formatNumber(totalhalfYearlysumOfIC - totaltargetsumOfIC),
                        perc1: formatNumber(getPrecenge(halfYearly1, target1)) + '%',
                        perc2: formatNumber(getPrecenge(halfYearly2, target2)) + '%',
                        totalperc: formatNumber(getPrecenge(totalhalfYearly, totaltarget)) + '%',
                        perc1sumOfHW: formatNumber(getPrecenge(halfYearly1sumOfHW, target1sumOfHW)) + '%',
                        perc2sumOfHW: formatNumber(getPrecenge(halfYearly2sumOfHW, target2sumOfHW)) + '%',
                        totalpercsumOfHW: formatNumber(getPrecenge(totalhalfYearlysumOfHW, totaltargetsumOfHW)) + '%',
                        perc1sumOfIC: formatNumber(getPrecenge(halfYearly1sumOfIC, target1sumOfIC)) + '%',
                        perc2sumOfIC: formatNumber(getPrecenge(halfYearly2sumOfIC, target2sumOfIC)) + '%',
                        totalpercsumOfIC: formatNumber(getPrecenge(totalhalfYearlysumOfIC, totaltargetsumOfIC)) + '%',

                    });
                }
              

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearlyClass func', e)
    }
    return Results;
}
function splitDataAmountClass(data) {

    var ObjData = JSON.parse(data);
    var dataArr = [];
    for (var m = 0; m <= 11; m++) {
        dataArr.push({
            sumOfHLS: formatNumber(ObjData[m].sumOfHLS),
            sumOfHW: formatNumber(ObjData[m].sumOfHW),
            sumOfIC: formatNumber(ObjData[m].sumOfIC),
        });
    }

    return dataArr
}
function splitDataAmountSecondClass(data) {

    var ObjData = JSON.parse(data);
    var dataArr = [];
    for (var m = 0; m <= 11; m++) {
        dataArr.push({
            sumOfHLS: ObjData[m].sumOfHLS,
            sumOfHW: ObjData[m].sumOfHW,
            sumOfIC: ObjData[m].sumOfIC,
        });
    }

    return dataArr
}
function splitDataAmount(data) {

    var ObjData = JSON.parse(data);
    var dataArr = {};
    for (var m = 0; m <= 11; m++) {
        dataArr[m] = formatNumber(ObjData[m].i)
    }

    return dataArr
}
function splitDataAmountSecond(data) {

    var ObjData = JSON.parse(data);
    var dataArr = {};
    for (var m = 0; m <= 11; m++) {
        dataArr[m] = ObjData[m].i
    }

    return dataArr
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
    var len = num.toString().indexOf('.');
    len = len +2;
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
function getPrecenge(num1, num2) { //NUM2 = TARGET
    //nlapiLogExecution('error', 'num2 num2', num2)
    if (num2 != '0') {
        return (num1 / num2) * 100
    }
    else if (num1 != '0' && num2 =='0' ) {
        return '100.00'
    }
    else return '0.00'

}
function SalesRepTargetsPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }

        var newColumns = new Array();
        //Backbone Services
        newColumns[0] = new nlobjSearchColumn('custrecord_jan_bbs');
        newColumns[1] = new nlobjSearchColumn('custrecord_feb_bbs');
        newColumns[2] = new nlobjSearchColumn('custrecord_mar_bbs');
        newColumns[3] = new nlobjSearchColumn('custrecord_apr_bbs');
        newColumns[4] = new nlobjSearchColumn('custrecord_may_bbs');
        newColumns[5] = new nlobjSearchColumn('custrecord_jun_bbs');
        newColumns[6] = new nlobjSearchColumn('custrecord_jul_bbs');
        newColumns[7] = new nlobjSearchColumn('custrecord_aug_bbs');
        newColumns[8] = new nlobjSearchColumn('custrecord_sep_bbs');
        newColumns[9] = new nlobjSearchColumn('custrecord_oct_bbs');
        newColumns[10] = new nlobjSearchColumn('custrecord_nov_bbs');
        newColumns[11] = new nlobjSearchColumn('custrecord_dec_bbs');
        //
        newColumns[12] = new nlobjSearchColumn('custrecord_data_pf');
        //VAS
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_vas');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_vas');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_vas');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_vas');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_vas');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_vas');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_vas');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_vas');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_vas');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_vas');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_vas');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_vas');
        //BOD
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_bod');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_bod');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_bod');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_bod');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_bod');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_bod');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_bod');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_bod');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_bod');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_bod');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_bod');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_bod');
        //CBAND
        newColumns[37] = new nlobjSearchColumn('custrecord_jan_cband');
        newColumns[38] = new nlobjSearchColumn('custrecord_feb_cband');
        newColumns[39] = new nlobjSearchColumn('custrecord_mar_cband');
        newColumns[40] = new nlobjSearchColumn('custrecord_apr_cband');
        newColumns[41] = new nlobjSearchColumn('custrecord_may_cband');
        newColumns[42] = new nlobjSearchColumn('custrecord_jun_cband');
        newColumns[43] = new nlobjSearchColumn('custrecord_jul_cband');
        newColumns[44] = new nlobjSearchColumn('custrecord_aug_cband');
        newColumns[45] = new nlobjSearchColumn('custrecord_sep_cband');
        newColumns[46] = new nlobjSearchColumn('custrecord_oct_cband');
        newColumns[47] = new nlobjSearchColumn('custrecord_nov_cband');
        newColumns[48] = new nlobjSearchColumn('custrecord_dec_cband');
        //DOMESTIC
        newColumns[49] = new nlobjSearchColumn('custrecord_jan_domestic');
        newColumns[50] = new nlobjSearchColumn('custrecord_feb_domestic');
        newColumns[51] = new nlobjSearchColumn('custrecord_mar_domestic');
        newColumns[52] = new nlobjSearchColumn('custrecord_apr_domestic');
        newColumns[53] = new nlobjSearchColumn('custrecord_may_domestic');
        newColumns[54] = new nlobjSearchColumn('custrecord_jun_domestic');
        newColumns[55] = new nlobjSearchColumn('custrecord_jul_domestic');
        newColumns[56] = new nlobjSearchColumn('custrecord_aug_domestic');
        newColumns[57] = new nlobjSearchColumn('custrecord_sep_domestic');
        newColumns[58] = new nlobjSearchColumn('custrecord_oct_domestic');
        newColumns[59] = new nlobjSearchColumn('custrecord_nov_domestic');
        newColumns[60] = new nlobjSearchColumn('custrecord_dec_domestic');
        //IP TRANSIT

        newColumns[61] = new nlobjSearchColumn('custrecord_jan_ip');
        newColumns[62] = new nlobjSearchColumn('custrecord_feb_ip');
        newColumns[63] = new nlobjSearchColumn('custrecord_mar_ip');
        newColumns[64] = new nlobjSearchColumn('custrecord_apr_ip');
        newColumns[65] = new nlobjSearchColumn('custrecord_may_ip');
        newColumns[66] = new nlobjSearchColumn('custrecord_jun_ip');
        newColumns[67] = new nlobjSearchColumn('custrecord_jul_ip');
        newColumns[68] = new nlobjSearchColumn('custrecord_aug_ip');
        newColumns[69] = new nlobjSearchColumn('custrecord_sep_ip');
        newColumns[70] = new nlobjSearchColumn('custrecord_oct_ip');
        newColumns[71] = new nlobjSearchColumn('custrecord_nov_ip');
        newColumns[72] = new nlobjSearchColumn('custrecord_dec_ip');
        //IRU
        newColumns[73] = new nlobjSearchColumn('custrecord_jan_iru');
        newColumns[74] = new nlobjSearchColumn('custrecord_feb_iru');
        newColumns[75] = new nlobjSearchColumn('custrecord_mar_iru');
        newColumns[76] = new nlobjSearchColumn('custrecord_apr_iru');
        newColumns[77] = new nlobjSearchColumn('custrecord_may_iru');
        newColumns[78] = new nlobjSearchColumn('custrecord_jun_iru');
        newColumns[79] = new nlobjSearchColumn('custrecord_jul_iru');
        newColumns[80] = new nlobjSearchColumn('custrecord_aug_iru');
        newColumns[81] = new nlobjSearchColumn('custrecord_sep_iru');
        newColumns[82] = new nlobjSearchColumn('custrecord_oct_iru');
        newColumns[83] = new nlobjSearchColumn('custrecord_nov_iru');
        newColumns[84] = new nlobjSearchColumn('custrecord_dec_iru');
        //CBAND
        newColumns[85] = new nlobjSearchColumn('custrecord_jan_kuband');
        newColumns[86] = new nlobjSearchColumn('custrecord_feb_kuband');
        newColumns[87] = new nlobjSearchColumn('custrecord_mar_kuband');
        newColumns[88] = new nlobjSearchColumn('custrecord_apr_kuband');
        newColumns[89] = new nlobjSearchColumn('custrecord_may_kuband');
        newColumns[90] = new nlobjSearchColumn('custrecord_jun_kuband');
        newColumns[91] = new nlobjSearchColumn('custrecord_jul_kuband');
        newColumns[92] = new nlobjSearchColumn('custrecord_aug_kuband');
        newColumns[93] = new nlobjSearchColumn('custrecord_sep_kuband');
        newColumns[94] = new nlobjSearchColumn('custrecord_oct_kuband');
        newColumns[95] = new nlobjSearchColumn('custrecord_nov_kuband');
        newColumns[96] = new nlobjSearchColumn('custrecord_dec_kuband');
        //vsat
        newColumns[97] = new nlobjSearchColumn('custrecord_jan_mobile_vsat');
        newColumns[98] = new nlobjSearchColumn('custrecord_feb_mobile_vsat');
        newColumns[99] = new nlobjSearchColumn('custrecord_mar_mobile_vsat');
        newColumns[100] = new nlobjSearchColumn('custrecord_apr_mobile_vsat');
        newColumns[101] = new nlobjSearchColumn('custrecord_may_mobile_vsat');
        newColumns[102] = new nlobjSearchColumn('custrecord_jun_mobile_vsat');
        newColumns[103] = new nlobjSearchColumn('custrecord_jul_mobile_vsat');
        newColumns[104] = new nlobjSearchColumn('custrecord_aug_mobile_vsat');
        newColumns[105] = new nlobjSearchColumn('custrecord_sep_mobile_vsat');
        newColumns[106] = new nlobjSearchColumn('custrecord_oct_mobile_vsat');
        newColumns[107] = new nlobjSearchColumn('custrecord_nov_mobile_vsat');
        newColumns[108] = new nlobjSearchColumn('custrecord_dec_mobile_vsat');
        //MPLS & IPLC
        newColumns[109] = new nlobjSearchColumn('custrecord_jan_mpip');
        newColumns[110] = new nlobjSearchColumn('custrecord_feb_mpip');
        newColumns[111] = new nlobjSearchColumn('custrecord_mar_mpip');
        newColumns[112] = new nlobjSearchColumn('custrecord_apr_mpip');
        newColumns[113] = new nlobjSearchColumn('custrecord_may_mpip');
        newColumns[114] = new nlobjSearchColumn('custrecord_jun_mpip');
        newColumns[115] = new nlobjSearchColumn('custrecord_jul_mpip');
        newColumns[116] = new nlobjSearchColumn('custrecord_aug_mpip');
        newColumns[117] = new nlobjSearchColumn('custrecord_sep_mpip');
        newColumns[118] = new nlobjSearchColumn('custrecord_oct_mpip');
        newColumns[119] = new nlobjSearchColumn('custrecord_nov_mpip');
        newColumns[120] = new nlobjSearchColumn('custrecord_dec_mpip');
        //o3b
        newColumns[121] = new nlobjSearchColumn('custrecord_jan_o3b');
        newColumns[122] = new nlobjSearchColumn('custrecord_feb_o3b');
        newColumns[123] = new nlobjSearchColumn('custrecord_mar_o3b');
        newColumns[124] = new nlobjSearchColumn('custrecord_apr_o3b');
        newColumns[125] = new nlobjSearchColumn('custrecord_may_o3b');
        newColumns[126] = new nlobjSearchColumn('custrecord_jun_o3b');
        newColumns[127] = new nlobjSearchColumn('custrecord_jul_o3b');
        newColumns[128] = new nlobjSearchColumn('custrecord_aug_o3b');
        newColumns[129] = new nlobjSearchColumn('custrecord_sep_o3b');
        newColumns[130] = new nlobjSearchColumn('custrecord_oct_o3b');
        newColumns[131] = new nlobjSearchColumn('custrecord_nov_o3b');
        newColumns[132] = new nlobjSearchColumn('custrecord_dec_o3b');
        //PS

        newColumns[133] = new nlobjSearchColumn('custrecord_jan_ps');
        newColumns[134] = new nlobjSearchColumn('custrecord_feb_ps');
        newColumns[135] = new nlobjSearchColumn('custrecord_mar_ps');
        newColumns[136] = new nlobjSearchColumn('custrecord_apr_ps');
        newColumns[137] = new nlobjSearchColumn('custrecord_may_ps');
        newColumns[138] = new nlobjSearchColumn('custrecord_jun_ps');
        newColumns[139] = new nlobjSearchColumn('custrecord_jul_ps');
        newColumns[140] = new nlobjSearchColumn('custrecord_aug_ps');
        newColumns[141] = new nlobjSearchColumn('custrecord_sep_ps');
        newColumns[142] = new nlobjSearchColumn('custrecord_oct_ps');
        newColumns[143] = new nlobjSearchColumn('custrecord_nov_ps');
        newColumns[144] = new nlobjSearchColumn('custrecord_dec_ps');
        // sr
        newColumns[145] = new nlobjSearchColumn('custrecord_jan_sr');
        newColumns[146] = new nlobjSearchColumn('custrecord_feb_sr');
        newColumns[147] = new nlobjSearchColumn('custrecord_mar_sr');
        newColumns[148] = new nlobjSearchColumn('custrecord_apr_sr');
        newColumns[149] = new nlobjSearchColumn('custrecord_may_sr');
        newColumns[150] = new nlobjSearchColumn('custrecord_jun_sr');
        newColumns[151] = new nlobjSearchColumn('custrecord_jul_sr');
        newColumns[152] = new nlobjSearchColumn('custrecord_aug_sr');
        newColumns[153] = new nlobjSearchColumn('custrecord_sep_sr');
        newColumns[154] = new nlobjSearchColumn('custrecord_oct_sr');
        newColumns[155] = new nlobjSearchColumn('custrecord_nov_sr');
        newColumns[156] = new nlobjSearchColumn('custrecord_dec_sr');
        //HW FSS
        newColumns[157] = new nlobjSearchColumn('custrecord_gt_jan_hw');
        newColumns[158] = new nlobjSearchColumn('custrecord_gt_feb_hw');
        newColumns[159] = new nlobjSearchColumn('custrecord_gt_mar_hw');
        newColumns[160] = new nlobjSearchColumn('custrecord_gt_apr_hw');
        newColumns[161] = new nlobjSearchColumn('custrecord_gt_may_hw');
        newColumns[162] = new nlobjSearchColumn('custrecord_gt_jun_hw');
        newColumns[163] = new nlobjSearchColumn('custrecord_gt_jul_hw');
        newColumns[164] = new nlobjSearchColumn('custrecord_gt_aug_hw');
        newColumns[165] = new nlobjSearchColumn('custrecord_gt_sep_hw');
        newColumns[166] = new nlobjSearchColumn('custrecord_gt_oct_hw');
        newColumns[167] = new nlobjSearchColumn('custrecord_gt_nov_hw');
        newColumns[168] = new nlobjSearchColumn('custrecord_gt_dec_hw');
        //D&HLS HW
        newColumns[169] = new nlobjSearchColumn('custrecord_jan_dhls_hw');
        newColumns[170] = new nlobjSearchColumn('custrecord_feb_dhls_hw');
        newColumns[171] = new nlobjSearchColumn('custrecord_mar_dhls_hw');
        newColumns[172] = new nlobjSearchColumn('custrecord_apr_dhls_hw');
        newColumns[173] = new nlobjSearchColumn('custrecord_may_dhls_hw');
        newColumns[174] = new nlobjSearchColumn('custrecord_jun_dhls_hw');
        newColumns[175] = new nlobjSearchColumn('custrecord_jul_dhls_hw');
        newColumns[176] = new nlobjSearchColumn('custrecord_aug_dhls_hw');
        newColumns[177] = new nlobjSearchColumn('custrecord_sep_dhls_hw');
        newColumns[178] = new nlobjSearchColumn('custrecord_oct_dhls_hw');
        newColumns[179] = new nlobjSearchColumn('custrecord_nov_dhls_hw');
        newColumns[180] = new nlobjSearchColumn('custrecord_dec_dhls_hw');
        //D&HLS Service
        newColumns[181] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[182] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[183] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[184] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[185] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[186] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[187] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[188] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[189] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[190] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[191] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[192] = new nlobjSearchColumn('custrecord_gt_dec_rec');


        search.addColumns(newColumns);
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

                var data = allSelection[i].getValue("custrecord_data_pf")
                if (!isNullOrEmpty(data)) {
                    var dataSplit = splitDataAmountPf(data)
                    var dataSplitSecond = splitDataAmountSecondPf(data)

                    var totalbbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs + dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                    var totaltargetbbs = Number(allSelection[i].getValue("custrecord_jan_bbs")) + Number(allSelection[i].getValue("custrecord_feb_bbs")) + Number(allSelection[i].getValue("custrecord_mar_bbs")) + Number(allSelection[i].getValue("custrecord_apr_bbs")) + Number(allSelection[i].getValue("custrecord_may_bbs")) + Number(allSelection[i].getValue("custrecord_jun_bbs")) + Number(allSelection[i].getValue("custrecord_jul_bbs")) + Number(allSelection[i].getValue("custrecord_aug_bbs")) + Number(allSelection[i].getValue("custrecord_sep_bbs")) + Number(allSelection[i].getValue("custrecord_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nov_bbs")) + Number(allSelection[i].getValue("custrecord_dec_bbs"));
                    var totalvas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas + dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                    var totaltargetvas = Number(allSelection[i].getValue("custrecord_jan_vas")) + Number(allSelection[i].getValue("custrecord_feb_vas")) + Number(allSelection[i].getValue("custrecord_mar_vas")) + Number(allSelection[i].getValue("custrecord_apr_vas")) + Number(allSelection[i].getValue("custrecord_may_vas")) + Number(allSelection[i].getValue("custrecord_jun_vas")) + Number(allSelection[i].getValue("custrecord_jul_vas")) + Number(allSelection[i].getValue("custrecord_aug_vas")) + Number(allSelection[i].getValue("custrecord_sep_vas")) + Number(allSelection[i].getValue("custrecord_oct_vas")) + Number(allSelection[i].getValue("custrecord_nov_vas")) + Number(allSelection[i].getValue("custrecord_dec_vas"));
                    var totalbod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod + dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                    var totaltargetbod = Number(allSelection[i].getValue("custrecord_jan_bod")) + Number(allSelection[i].getValue("custrecord_feb_bod")) + Number(allSelection[i].getValue("custrecord_mar_bod")) + Number(allSelection[i].getValue("custrecord_apr_bod")) + Number(allSelection[i].getValue("custrecord_may_bod")) + Number(allSelection[i].getValue("custrecord_jun_bod")) + Number(allSelection[i].getValue("custrecord_jul_bod")) + Number(allSelection[i].getValue("custrecord_aug_bod")) + Number(allSelection[i].getValue("custrecord_sep_bod")) + Number(allSelection[i].getValue("custrecord_oct_bod")) + Number(allSelection[i].getValue("custrecord_nov_bod")) + Number(allSelection[i].getValue("custrecord_dec_bod"));
                    var totalcband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband + dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                    var totaltargetcband = Number(allSelection[i].getValue("custrecord_jan_cband")) + Number(allSelection[i].getValue("custrecord_feb_cband")) + Number(allSelection[i].getValue("custrecord_mar_cband")) + Number(allSelection[i].getValue("custrecord_apr_cband")) + Number(allSelection[i].getValue("custrecord_may_cband")) + Number(allSelection[i].getValue("custrecord_jun_cband")) + Number(allSelection[i].getValue("custrecord_jul_cband")) + Number(allSelection[i].getValue("custrecord_aug_cband")) + Number(allSelection[i].getValue("custrecord_sep_cband")) + Number(allSelection[i].getValue("custrecord_oct_cband")) + Number(allSelection[i].getValue("custrecord_nov_cband")) + Number(allSelection[i].getValue("custrecord_dec_cband"));
                    var totaldomestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic + dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                    var totaltargetdomestic = Number(allSelection[i].getValue("custrecord_jan_domestic")) + Number(allSelection[i].getValue("custrecord_feb_domestic")) + Number(allSelection[i].getValue("custrecord_mar_domestic")) + Number(allSelection[i].getValue("custrecord_apr_domestic")) + Number(allSelection[i].getValue("custrecord_may_domestic")) + Number(allSelection[i].getValue("custrecord_jun_domestic")) + Number(allSelection[i].getValue("custrecord_jul_domestic")) + Number(allSelection[i].getValue("custrecord_aug_domestic")) + Number(allSelection[i].getValue("custrecord_sep_domestic")) + Number(allSelection[i].getValue("custrecord_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nov_domestic")) + Number(allSelection[i].getValue("custrecord_dec_domestic"));
                    var totalip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip + dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                    var totaltargetip = Number(allSelection[i].getValue("custrecord_jan_ip")) + Number(allSelection[i].getValue("custrecord_feb_ip")) + Number(allSelection[i].getValue("custrecord_mar_ip")) + Number(allSelection[i].getValue("custrecord_apr_ip")) + Number(allSelection[i].getValue("custrecord_may_ip")) + Number(allSelection[i].getValue("custrecord_jun_ip")) + Number(allSelection[i].getValue("custrecord_jul_ip")) + Number(allSelection[i].getValue("custrecord_aug_ip")) + Number(allSelection[i].getValue("custrecord_sep_ip")) + Number(allSelection[i].getValue("custrecord_oct_ip")) + Number(allSelection[i].getValue("custrecord_nov_ip")) + Number(allSelection[i].getValue("custrecord_dec_ip"));
                    var totaliru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru + dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                    var totaltargetiru = Number(allSelection[i].getValue("custrecord_jan_iru")) + Number(allSelection[i].getValue("custrecord_feb_iru")) + Number(allSelection[i].getValue("custrecord_mar_iru")) + Number(allSelection[i].getValue("custrecord_apr_iru")) + Number(allSelection[i].getValue("custrecord_may_iru")) + Number(allSelection[i].getValue("custrecord_jun_iru")) + Number(allSelection[i].getValue("custrecord_jul_iru")) + Number(allSelection[i].getValue("custrecord_aug_iru")) + Number(allSelection[i].getValue("custrecord_sep_iru")) + Number(allSelection[i].getValue("custrecord_oct_iru")) + Number(allSelection[i].getValue("custrecord_nov_iru")) + Number(allSelection[i].getValue("custrecord_dec_iru"));
                    var totalkuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband + dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                    var totaltargetkuband = Number(allSelection[i].getValue("custrecord_jan_kuband")) + Number(allSelection[i].getValue("custrecord_feb_kuband")) + Number(allSelection[i].getValue("custrecord_mar_kuband")) + Number(allSelection[i].getValue("custrecord_apr_kuband")) + Number(allSelection[i].getValue("custrecord_may_kuband")) + Number(allSelection[i].getValue("custrecord_jun_kuband")) + Number(allSelection[i].getValue("custrecord_jul_kuband")) + Number(allSelection[i].getValue("custrecord_aug_kuband")) + Number(allSelection[i].getValue("custrecord_sep_kuband")) + Number(allSelection[i].getValue("custrecord_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nov_kuband")) + Number(allSelection[i].getValue("custrecord_dec_kuband"));
                    var totalmobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat + dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                    var totaltargetmobile_vsat = Number(allSelection[i].getValue("custrecord_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_mar_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_jun_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_sep_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_dec_mobile_vsat"));
                    var totalmpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip + dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                    var totaltargetmpip = Number(allSelection[i].getValue("custrecord_jan_mpip")) + Number(allSelection[i].getValue("custrecord_feb_mpip")) + Number(allSelection[i].getValue("custrecord_mar_mpip")) + Number(allSelection[i].getValue("custrecord_apr_mpip")) + Number(allSelection[i].getValue("custrecord_may_mpip")) + Number(allSelection[i].getValue("custrecord_jun_mpip")) + Number(allSelection[i].getValue("custrecord_jul_mpip")) + Number(allSelection[i].getValue("custrecord_aug_mpip")) + Number(allSelection[i].getValue("custrecord_sep_mpip")) + Number(allSelection[i].getValue("custrecord_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nov_mpip")) + Number(allSelection[i].getValue("custrecord_dec_mpip"));
                    var totalo3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b + dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                    var totaltargeto3b = Number(allSelection[i].getValue("custrecord_jan_o3b")) + Number(allSelection[i].getValue("custrecord_feb_o3b")) + Number(allSelection[i].getValue("custrecord_mar_o3b")) + Number(allSelection[i].getValue("custrecord_apr_o3b")) + Number(allSelection[i].getValue("custrecord_may_o3b")) + Number(allSelection[i].getValue("custrecord_jun_o3b")) + Number(allSelection[i].getValue("custrecord_jul_o3b")) + Number(allSelection[i].getValue("custrecord_aug_o3b")) + Number(allSelection[i].getValue("custrecord_sep_o3b")) + Number(allSelection[i].getValue("custrecord_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nov_o3b")) + Number(allSelection[i].getValue("custrecord_dec_o3b"));
                    var totalps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps + dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                    var totaltargetps = Number(allSelection[i].getValue("custrecord_jan_ps")) + Number(allSelection[i].getValue("custrecord_feb_ps")) + Number(allSelection[i].getValue("custrecord_mar_ps")) + Number(allSelection[i].getValue("custrecord_apr_ps")) + Number(allSelection[i].getValue("custrecord_may_ps")) + Number(allSelection[i].getValue("custrecord_jun_ps")) + Number(allSelection[i].getValue("custrecord_jul_ps")) + Number(allSelection[i].getValue("custrecord_aug_ps")) + Number(allSelection[i].getValue("custrecord_sep_ps")) + Number(allSelection[i].getValue("custrecord_oct_ps")) + Number(allSelection[i].getValue("custrecord_nov_ps")) + Number(allSelection[i].getValue("custrecord_dec_ps"));
                    var totalsr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr + dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                    var totaltargetsr = Number(allSelection[i].getValue("custrecord_jan_sr")) + Number(allSelection[i].getValue("custrecord_feb_sr")) + Number(allSelection[i].getValue("custrecord_mar_sr")) + Number(allSelection[i].getValue("custrecord_apr_sr")) + Number(allSelection[i].getValue("custrecord_may_sr")) + Number(allSelection[i].getValue("custrecord_jun_sr")) + Number(allSelection[i].getValue("custrecord_jul_sr")) + Number(allSelection[i].getValue("custrecord_aug_sr")) + Number(allSelection[i].getValue("custrecord_sep_sr")) + Number(allSelection[i].getValue("custrecord_oct_sr")) + Number(allSelection[i].getValue("custrecord_nov_sr")) + Number(allSelection[i].getValue("custrecord_dec_sr"));
                    var totalhw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw + dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                    var totaltargethw = Number(allSelection[i].getValue("custrecord_gt_jan_hw")) + Number(allSelection[i].getValue("custrecord_gt_feb_hw")) + Number(allSelection[i].getValue("custrecord_gt_mar_hw")) + Number(allSelection[i].getValue("custrecord_gt_apr_hw")) + Number(allSelection[i].getValue("custrecord_gt_may_hw")) + Number(allSelection[i].getValue("custrecord_gt_jun_hw")) + Number(allSelection[i].getValue("custrecord_gt_jul_hw")) + Number(allSelection[i].getValue("custrecord_gt_aug_hw")) + Number(allSelection[i].getValue("custrecord_gt_sep_hw")) + Number(allSelection[i].getValue("custrecord_gt_oct_hw")) + Number(allSelection[i].getValue("custrecord_gt_nov_hw")) + Number(allSelection[i].getValue("custrecord_gt_dec_hw"));
                    var totaldhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw + dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                    var totaltargetdhls_hw = Number(allSelection[i].getValue("custrecord_jan_dhls_hw")) + Number(allSelection[i].getValue("custrecord_feb_dhls_hw")) + Number(allSelection[i].getValue("custrecord_mar_dhls_hw")) + Number(allSelection[i].getValue("custrecord_apr_dhls_hw")) + Number(allSelection[i].getValue("custrecord_may_dhls_hw")) + Number(allSelection[i].getValue("custrecord_jun_dhls_hw")) + Number(allSelection[i].getValue("custrecord_jul_dhls_hw")) + Number(allSelection[i].getValue("custrecord_aug_dhls_hw")) + Number(allSelection[i].getValue("custrecord_sep_dhls_hw")) + Number(allSelection[i].getValue("custrecord_oct_dhls_hw")) + Number(allSelection[i].getValue("custrecord_nov_dhls_hw")) + Number(allSelection[i].getValue("custrecord_dec_dhls_hw"));
                    var totalgt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt + dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                    var totaltargetgt = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec")) + Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec")) + Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec")) + Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"));


                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                        mounth1bbs: dataSplit[0].bbs,
                        mounth2bbs: dataSplit[1].bbs,
                        mounth3bbs: dataSplit[2].bbs,
                        mounth4bbs: dataSplit[3].bbs,
                        mounth5bbs: dataSplit[4].bbs,
                        mounth6bbs: dataSplit[5].bbs,
                        mounth7bbs: dataSplit[6].bbs,
                        mounth8bbs: dataSplit[7].bbs,
                        mounth9bbs: dataSplit[8].bbs,
                        mounth10bbs: dataSplit[9].bbs,
                        mounth11bbs: dataSplit[10].bbs,
                        mounth12bbs: dataSplit[11].bbs,
                        totalbbs: formatNumber(totalbbs),
                        target1bbs: formatNumber(allSelection[i].getValue("custrecord_jan_bbs")),
                        target2bbs: formatNumber(allSelection[i].getValue("custrecord_feb_bbs")),
                        target3bbs: formatNumber(allSelection[i].getValue("custrecord_mar_bbs")),
                        target4bbs: formatNumber(allSelection[i].getValue("custrecord_apr_bbs")),
                        target5bbs: formatNumber(allSelection[i].getValue("custrecord_may_bbs")),
                        target6bbs: formatNumber(allSelection[i].getValue("custrecord_jun_bbs")),
                        target7bbs: formatNumber(allSelection[i].getValue("custrecord_jul_bbs")),
                        target8bbs: formatNumber(allSelection[i].getValue("custrecord_aug_bbs")),
                        target9bbs: formatNumber(allSelection[i].getValue("custrecord_sep_bbs")),
                        target10bbs: formatNumber(allSelection[i].getValue("custrecord_oct_bbs")),
                        target11bbs: formatNumber(allSelection[i].getValue("custrecord_nov_bbs")),
                        target12bbs: formatNumber(allSelection[i].getValue("custrecord_dec_bbs")),
                        totaltargetbbs: formatNumber(totaltargetbbs),
                        gap1bbs: formatNumber(dataSplitSecond[0].bbs - allSelection[i].getValue("custrecord_jan_bbs")),
                        gap2bbs: formatNumber(dataSplitSecond[1].bbs - allSelection[i].getValue("custrecord_feb_bbs")),
                        gap3bbs: formatNumber(dataSplitSecond[2].bbs - allSelection[i].getValue("custrecord_mar_bbs")),
                        gap4bbs: formatNumber(dataSplitSecond[3].bbs - allSelection[i].getValue("custrecord_apr_bbs")),
                        gap5bbs: formatNumber(dataSplitSecond[4].bbs - allSelection[i].getValue("custrecord_may_bbs")),
                        gap6bbs: formatNumber(dataSplitSecond[5].bbs - allSelection[i].getValue("custrecord_jun_bbs")),
                        gap7bbs: formatNumber(dataSplitSecond[6].bbs - allSelection[i].getValue("custrecord_jul_bbs")),
                        gap8bbs: formatNumber(dataSplitSecond[7].bbs - allSelection[i].getValue("custrecord_aug_bbs")),
                        gap9bbs: formatNumber(dataSplitSecond[8].bbs - allSelection[i].getValue("custrecord_sep_bbs")),
                        gap10bbs: formatNumber(dataSplitSecond[9].bbs - allSelection[i].getValue("custrecord_oct_bbs")),
                        gap11bbs: formatNumber(dataSplitSecond[10].bbs - allSelection[i].getValue("custrecord_nov_bbs")),
                        gap12bbs: formatNumber(dataSplitSecond[11].bbs - allSelection[i].getValue("custrecord_dec_bbs")),
                        totalgapbbs: formatNumber(totalbbs - totaltargetbbs),
                        perc1bbs: formatNumber(getPrecenge(dataSplitSecond[0].bbs, allSelection[i].getValue("custrecord_jan_bbs"))) + '%',
                        perc2bbs: formatNumber(getPrecenge(dataSplitSecond[1].bbs, allSelection[i].getValue("custrecord_feb_bbs"))) + '%',
                        perc3bbs: formatNumber(getPrecenge(dataSplitSecond[2].bbs, allSelection[i].getValue("custrecord_mar_bbs"))) + '%',
                        perc4bbs: formatNumber(getPrecenge(dataSplitSecond[3].bbs, allSelection[i].getValue("custrecord_apr_bbs"))) + '%',
                        perc5bbs: formatNumber(getPrecenge(dataSplitSecond[4].bbs, allSelection[i].getValue("custrecord_may_bbs"))) + '%',
                        perc6bbs: formatNumber(getPrecenge(dataSplitSecond[5].bbs, allSelection[i].getValue("custrecord_jun_bbs"))) + '%',
                        perc7bbs: formatNumber(getPrecenge(dataSplitSecond[6].bbs, allSelection[i].getValue("custrecord_jul_bbs"))) + '%',
                        perc8bbs: formatNumber(getPrecenge(dataSplitSecond[7].bbs, allSelection[i].getValue("custrecord_aug_bbs"))) + '%',
                        perc9bbs: formatNumber(getPrecenge(dataSplitSecond[8].bbs, allSelection[i].getValue("custrecord_sep_bbs"))) + '%',
                        perc10bbs: formatNumber(getPrecenge(dataSplitSecond[9].bbs, allSelection[i].getValue("custrecord_oct_bbs"))) + '%',
                        perc11bbs: formatNumber(getPrecenge(dataSplitSecond[10].bbs, allSelection[i].getValue("custrecord_nov_bbs"))) + '%',
                        perc12bbs: formatNumber(getPrecenge(dataSplitSecond[11].bbs, allSelection[i].getValue("custrecord_dec_bbs"))) + '%',
                        totalpercbbs: formatNumber(getPrecenge(totalbbs, totaltargetbbs)) + '%',
                        mounth1vas: dataSplit[0].vas,
                        mounth2vas: dataSplit[1].vas,
                        mounth3vas: dataSplit[2].vas,
                        mounth4vas: dataSplit[3].vas,
                        mounth5vas: dataSplit[4].vas,
                        mounth6vas: dataSplit[5].vas,
                        mounth7vas: dataSplit[6].vas,
                        mounth8vas: dataSplit[7].vas,
                        mounth9vas: dataSplit[8].vas,
                        mounth10vas: dataSplit[9].vas,
                        mounth11vas: dataSplit[10].vas,
                        mounth12vas: dataSplit[11].vas,
                        totalvas: formatNumber(totalvas),
                        totaltargetvas: formatNumber(totaltargetvas),
                        totalgapvas: formatNumber(totalvas - totaltargetvas),
                        totalpercvas: formatNumber(getPrecenge(totalvas, totaltargetvas)) + '%',
                        target1vas: formatNumber(allSelection[i].getValue("custrecord_jan_vas")),
                        target2vas: formatNumber(allSelection[i].getValue("custrecord_feb_vas")),
                        target3vas: formatNumber(allSelection[i].getValue("custrecord_mar_vas")),
                        target4vas: formatNumber(allSelection[i].getValue("custrecord_apr_vas")),
                        target5vas: formatNumber(allSelection[i].getValue("custrecord_may_vas")),
                        target6vas: formatNumber(allSelection[i].getValue("custrecord_jun_vas")),
                        target7vas: formatNumber(allSelection[i].getValue("custrecord_jul_vas")),
                        target8vas: formatNumber(allSelection[i].getValue("custrecord_aug_vas")),
                        target9vas: formatNumber(allSelection[i].getValue("custrecord_sep_vas")),
                        target10vas: formatNumber(allSelection[i].getValue("custrecord_oct_vas")),
                        target11vas: formatNumber(allSelection[i].getValue("custrecord_nov_vas")),
                        target12vas: formatNumber(allSelection[i].getValue("custrecord_dec_vas")),
                        gap1vas: formatNumber(dataSplitSecond[0].vas - allSelection[i].getValue("custrecord_jan_vas")),
                        gap2vas: formatNumber(dataSplitSecond[1].vas - allSelection[i].getValue("custrecord_feb_vas")),
                        gap3vas: formatNumber(dataSplitSecond[2].vas - allSelection[i].getValue("custrecord_mar_vas")),
                        gap4vas: formatNumber(dataSplitSecond[3].vas - allSelection[i].getValue("custrecord_apr_vas")),
                        gap5vas: formatNumber(dataSplitSecond[4].vas - allSelection[i].getValue("custrecord_may_vas")),
                        gap6vas: formatNumber(dataSplitSecond[5].vas - allSelection[i].getValue("custrecord_jun_vas")),
                        gap7vas: formatNumber(dataSplitSecond[6].vas - allSelection[i].getValue("custrecord_jul_vas")),
                        gap8vas: formatNumber(dataSplitSecond[7].vas - allSelection[i].getValue("custrecord_aug_vas")),
                        gap9vas: formatNumber(dataSplitSecond[8].vas - allSelection[i].getValue("custrecord_sep_vas")),
                        gap10vas: formatNumber(dataSplitSecond[9].vas - allSelection[i].getValue("custrecord_oct_vas")),
                        gap11vas: formatNumber(dataSplitSecond[10].vas - allSelection[i].getValue("custrecord_nov_vas")),
                        gap12vas: formatNumber(dataSplitSecond[11].vas - allSelection[i].getValue("custrecord_dec_vas")),
                        perc1vas: formatNumber(getPrecenge(dataSplitSecond[0].vas, allSelection[i].getValue("custrecord_jan_vas"))) + '%',
                        perc2vas: formatNumber(getPrecenge(dataSplitSecond[1].vas, allSelection[i].getValue("custrecord_feb_vas"))) + '%',
                        perc3vas: formatNumber(getPrecenge(dataSplitSecond[2].vas, allSelection[i].getValue("custrecord_mar_vas"))) + '%',
                        perc4vas: formatNumber(getPrecenge(dataSplitSecond[3].vas, allSelection[i].getValue("custrecord_apr_vas"))) + '%',
                        perc5vas: formatNumber(getPrecenge(dataSplitSecond[4].vas, allSelection[i].getValue("custrecord_may_vas"))) + '%',
                        perc6vas: formatNumber(getPrecenge(dataSplitSecond[5].vas, allSelection[i].getValue("custrecord_jun_vas"))) + '%',
                        perc7vas: formatNumber(getPrecenge(dataSplitSecond[6].vas, allSelection[i].getValue("custrecord_jul_vas"))) + '%',
                        perc8vas: formatNumber(getPrecenge(dataSplitSecond[7].vas, allSelection[i].getValue("custrecord_aug_vas"))) + '%',
                        perc9vas: formatNumber(getPrecenge(dataSplitSecond[8].vas, allSelection[i].getValue("custrecord_sep_vas"))) + '%',
                        perc10vas: formatNumber(getPrecenge(dataSplitSecond[9].vas, allSelection[i].getValue("custrecord_oct_vas"))) + '%',
                        perc11vas: formatNumber(getPrecenge(dataSplitSecond[10].vas, allSelection[i].getValue("custrecord_nov_vas"))) + '%',
                        perc12vas: formatNumber(getPrecenge(dataSplitSecond[11].vas, allSelection[i].getValue("custrecord_dec_vas"))) + '%',
                        mounth1bod: dataSplit[0].bod,
                        mounth2bod: dataSplit[1].bod,
                        mounth3bod: dataSplit[2].bod,
                        mounth4bod: dataSplit[3].bod,
                        mounth5bod: dataSplit[4].bod,
                        mounth6bod: dataSplit[5].bod,
                        mounth7bod: dataSplit[6].bod,
                        mounth8bod: dataSplit[7].bod,
                        mounth9bod: dataSplit[8].bod,
                        mounth10bod: dataSplit[9].bod,
                        mounth11bod: dataSplit[10].bod,
                        mounth12bod: dataSplit[11].bod,
                        totalbod: formatNumber(totalbod),
                        totaltargetbod: formatNumber(totaltargetbod),
                        totalgapbod: formatNumber(totalbod - totaltargetbod),
                        totalpercbod: formatNumber(getPrecenge(totalbod, totaltargetbod)) + '%',
                        target1bod: formatNumber(allSelection[i].getValue("custrecord_jan_bod")),
                        target2bod: formatNumber(allSelection[i].getValue("custrecord_feb_bod")),
                        target3bod: formatNumber(allSelection[i].getValue("custrecord_mar_bod")),
                        target4bod: formatNumber(allSelection[i].getValue("custrecord_apr_bod")),
                        target5bod: formatNumber(allSelection[i].getValue("custrecord_may_bod")),
                        target6bod: formatNumber(allSelection[i].getValue("custrecord_jun_bod")),
                        target7bod: formatNumber(allSelection[i].getValue("custrecord_jul_bod")),
                        target8bod: formatNumber(allSelection[i].getValue("custrecord_aug_bod")),
                        target9bod: formatNumber(allSelection[i].getValue("custrecord_sep_bod")),
                        target10bod: formatNumber(allSelection[i].getValue("custrecord_oct_bod")),
                        target11bod: formatNumber(allSelection[i].getValue("custrecord_nov_bod")),
                        target12bod: formatNumber(allSelection[i].getValue("custrecord_dec_bod")),
                        gap1bod: formatNumber(dataSplitSecond[0].bod - allSelection[i].getValue("custrecord_jan_bod")),
                        gap2bod: formatNumber(dataSplitSecond[1].bod - allSelection[i].getValue("custrecord_feb_bod")),
                        gap3bod: formatNumber(dataSplitSecond[2].bod - allSelection[i].getValue("custrecord_mar_bod")),
                        gap4bod: formatNumber(dataSplitSecond[3].bod - allSelection[i].getValue("custrecord_apr_bod")),
                        gap5bod: formatNumber(dataSplitSecond[4].bod - allSelection[i].getValue("custrecord_may_bod")),
                        gap6bod: formatNumber(dataSplitSecond[5].bod - allSelection[i].getValue("custrecord_jun_bod")),
                        gap7bod: formatNumber(dataSplitSecond[6].bod - allSelection[i].getValue("custrecord_jul_bod")),
                        gap8bod: formatNumber(dataSplitSecond[7].bod - allSelection[i].getValue("custrecord_aug_bod")),
                        gap9bod: formatNumber(dataSplitSecond[8].bod - allSelection[i].getValue("custrecord_sep_bod")),
                        gap10bod: formatNumber(dataSplitSecond[9].bod - allSelection[i].getValue("custrecord_oct_bod")),
                        gap11bod: formatNumber(dataSplitSecond[10].bod - allSelection[i].getValue("custrecord_nov_bod")),
                        gap12bod: formatNumber(dataSplitSecond[11].bod - allSelection[i].getValue("custrecord_dec_bod")),
                        perc1bod: formatNumber(getPrecenge(dataSplitSecond[0].bod, allSelection[i].getValue("custrecord_jan_bod"))) + '%',
                        perc2bod: formatNumber(getPrecenge(dataSplitSecond[1].bod, allSelection[i].getValue("custrecord_feb_bod"))) + '%',
                        perc3bod: formatNumber(getPrecenge(dataSplitSecond[2].bod, allSelection[i].getValue("custrecord_mar_bod"))) + '%',
                        perc4bod: formatNumber(getPrecenge(dataSplitSecond[3].bod, allSelection[i].getValue("custrecord_apr_bod"))) + '%',
                        perc5bod: formatNumber(getPrecenge(dataSplitSecond[4].bod, allSelection[i].getValue("custrecord_may_bod"))) + '%',
                        perc6bod: formatNumber(getPrecenge(dataSplitSecond[5].bod, allSelection[i].getValue("custrecord_jun_bod"))) + '%',
                        perc7bod: formatNumber(getPrecenge(dataSplitSecond[6].bod, allSelection[i].getValue("custrecord_jul_bod"))) + '%',
                        perc8bod: formatNumber(getPrecenge(dataSplitSecond[7].bod, allSelection[i].getValue("custrecord_aug_bod"))) + '%',
                        perc9bod: formatNumber(getPrecenge(dataSplitSecond[8].bod, allSelection[i].getValue("custrecord_sep_bod"))) + '%',
                        perc10bod: formatNumber(getPrecenge(dataSplitSecond[9].bod, allSelection[i].getValue("custrecord_oct_bod"))) + '%',
                        perc11bod: formatNumber(getPrecenge(dataSplitSecond[10].bod, allSelection[i].getValue("custrecord_nov_bod"))) + '%',
                        perc12bod: formatNumber(getPrecenge(dataSplitSecond[11].bod, allSelection[i].getValue("custrecord_dec_bod"))) + '%',
                        mounth1cband: dataSplit[0].cband,
                        mounth2cband: dataSplit[1].cband,
                        mounth3cband: dataSplit[2].cband,
                        mounth4cband: dataSplit[3].cband,
                        mounth5cband: dataSplit[4].cband,
                        mounth6cband: dataSplit[5].cband,
                        mounth7cband: dataSplit[6].cband,
                        mounth8cband: dataSplit[7].cband,
                        mounth9cband: dataSplit[8].cband,
                        mounth10cband: dataSplit[9].cband,
                        mounth11cband: dataSplit[10].cband,
                        mounth12cband: dataSplit[11].cband,
                        totalcband: formatNumber(totalcband),
                        totaltargetcband: formatNumber(totaltargetcband),
                        totalgapcband: formatNumber(totalcband - totaltargetcband),
                        totalperccband: formatNumber(getPrecenge(totalcband, totaltargetcband)) + '%',
                        target1cband: formatNumber(allSelection[i].getValue("custrecord_jan_cband")),
                        target2cband: formatNumber(allSelection[i].getValue("custrecord_feb_cband")),
                        target3cband: formatNumber(allSelection[i].getValue("custrecord_mar_cband")),
                        target4cband: formatNumber(allSelection[i].getValue("custrecord_apr_cband")),
                        target5cband: formatNumber(allSelection[i].getValue("custrecord_may_cband")),
                        target6cband: formatNumber(allSelection[i].getValue("custrecord_jun_cband")),
                        target7cband: formatNumber(allSelection[i].getValue("custrecord_jul_cband")),
                        target8cband: formatNumber(allSelection[i].getValue("custrecord_aug_cband")),
                        target9cband: formatNumber(allSelection[i].getValue("custrecord_sep_cband")),
                        target10cband: formatNumber(allSelection[i].getValue("custrecord_oct_cband")),
                        target11cband: formatNumber(allSelection[i].getValue("custrecord_nov_cband")),
                        target12cband: formatNumber(allSelection[i].getValue("custrecord_dec_cband")),
                        gap1cband: formatNumber(dataSplitSecond[0].cband - allSelection[i].getValue("custrecord_jan_cband")),
                        gap2cband: formatNumber(dataSplitSecond[1].cband - allSelection[i].getValue("custrecord_feb_cband")),
                        gap3cband: formatNumber(dataSplitSecond[2].cband - allSelection[i].getValue("custrecord_mar_cband")),
                        gap4cband: formatNumber(dataSplitSecond[3].cband - allSelection[i].getValue("custrecord_apr_cband")),
                        gap5cband: formatNumber(dataSplitSecond[4].cband - allSelection[i].getValue("custrecord_may_cband")),
                        gap6cband: formatNumber(dataSplitSecond[5].cband - allSelection[i].getValue("custrecord_jun_cband")),
                        gap7cband: formatNumber(dataSplitSecond[6].cband - allSelection[i].getValue("custrecord_jul_cband")),
                        gap8cband: formatNumber(dataSplitSecond[7].cband - allSelection[i].getValue("custrecord_aug_cband")),
                        gap9cband: formatNumber(dataSplitSecond[8].cband - allSelection[i].getValue("custrecord_sep_cband")),
                        gap10cband: formatNumber(dataSplitSecond[9].cband - allSelection[i].getValue("custrecord_oct_cband")),
                        gap11cband: formatNumber(dataSplitSecond[10].cband - allSelection[i].getValue("custrecord_nov_cband")),
                        gap12cband: formatNumber(dataSplitSecond[11].cband - allSelection[i].getValue("custrecord_dec_cband")),
                        perc1cband: formatNumber(getPrecenge(dataSplitSecond[0].cband, allSelection[i].getValue("custrecord_jan_cband"))) + '%',
                        perc2cband: formatNumber(getPrecenge(dataSplitSecond[1].cband, allSelection[i].getValue("custrecord_feb_cband"))) + '%',
                        perc3cband: formatNumber(getPrecenge(dataSplitSecond[2].cband, allSelection[i].getValue("custrecord_mar_cband"))) + '%',
                        perc4cband: formatNumber(getPrecenge(dataSplitSecond[3].cband, allSelection[i].getValue("custrecord_apr_cband"))) + '%',
                        perc5cband: formatNumber(getPrecenge(dataSplitSecond[4].cband, allSelection[i].getValue("custrecord_may_cband"))) + '%',
                        perc6cband: formatNumber(getPrecenge(dataSplitSecond[5].cband, allSelection[i].getValue("custrecord_jun_cband"))) + '%',
                        perc7cband: formatNumber(getPrecenge(dataSplitSecond[6].cband, allSelection[i].getValue("custrecord_jul_cband"))) + '%',
                        perc8cband: formatNumber(getPrecenge(dataSplitSecond[7].cband, allSelection[i].getValue("custrecord_aug_cband"))) + '%',
                        perc9cband: formatNumber(getPrecenge(dataSplitSecond[8].cband, allSelection[i].getValue("custrecord_sep_cband"))) + '%',
                        perc10cband: formatNumber(getPrecenge(dataSplitSecond[9].cband, allSelection[i].getValue("custrecord_oct_cband"))) + '%',
                        perc11cband: formatNumber(getPrecenge(dataSplitSecond[10].cband, allSelection[i].getValue("custrecord_nov_cband"))) + '%',
                        perc12cband: formatNumber(getPrecenge(dataSplitSecond[11].cband, allSelection[i].getValue("custrecord_dec_cband"))) + '%',
                        mounth1domestic: dataSplit[0].domestic,
                        mounth2domestic: dataSplit[1].domestic,
                        mounth3domestic: dataSplit[2].domestic,
                        mounth4domestic: dataSplit[3].domestic,
                        mounth5domestic: dataSplit[4].domestic,
                        mounth6domestic: dataSplit[5].domestic,
                        mounth7domestic: dataSplit[6].domestic,
                        mounth8domestic: dataSplit[7].domestic,
                        mounth9domestic: dataSplit[8].domestic,
                        mounth10domestic: dataSplit[9].domestic,
                        mounth11domestic: dataSplit[10].domestic,
                        mounth12domestic: dataSplit[11].domestic,
                        totaldomestic: formatNumber(totaldomestic),
                        totaltargetdomestic: formatNumber(totaltargetdomestic),
                        totalgapdomestic: formatNumber(totaldomestic - totaltargetdomestic),
                        totalpercdomestic: formatNumber(getPrecenge(totaldomestic, totaltargetdomestic)) + '%',
                        target1domestic: formatNumber(allSelection[i].getValue("custrecord_jan_domestic")),
                        target2domestic: formatNumber(allSelection[i].getValue("custrecord_feb_domestic")),
                        target3domestic: formatNumber(allSelection[i].getValue("custrecord_mar_domestic")),
                        target4domestic: formatNumber(allSelection[i].getValue("custrecord_apr_domestic")),
                        target5domestic: formatNumber(allSelection[i].getValue("custrecord_may_domestic")),
                        target6domestic: formatNumber(allSelection[i].getValue("custrecord_jun_domestic")),
                        target7domestic: formatNumber(allSelection[i].getValue("custrecord_jul_domestic")),
                        target8domestic: formatNumber(allSelection[i].getValue("custrecord_aug_domestic")),
                        target9domestic: formatNumber(allSelection[i].getValue("custrecord_sep_domestic")),
                        target10domestic: formatNumber(allSelection[i].getValue("custrecord_oct_domestic")),
                        target11domestic: formatNumber(allSelection[i].getValue("custrecord_nov_domestic")),
                        target12domestic: formatNumber(allSelection[i].getValue("custrecord_dec_domestic")),
                        gap1domestic: formatNumber(dataSplitSecond[0].domestic - allSelection[i].getValue("custrecord_jan_domestic")),
                        gap2domestic: formatNumber(dataSplitSecond[1].domestic - allSelection[i].getValue("custrecord_feb_domestic")),
                        gap3domestic: formatNumber(dataSplitSecond[2].domestic - allSelection[i].getValue("custrecord_mar_domestic")),
                        gap4domestic: formatNumber(dataSplitSecond[3].domestic - allSelection[i].getValue("custrecord_apr_domestic")),
                        gap5domestic: formatNumber(dataSplitSecond[4].domestic - allSelection[i].getValue("custrecord_may_domestic")),
                        gap6domestic: formatNumber(dataSplitSecond[5].domestic - allSelection[i].getValue("custrecord_jun_domestic")),
                        gap7domestic: formatNumber(dataSplitSecond[6].domestic - allSelection[i].getValue("custrecord_jul_domestic")),
                        gap8domestic: formatNumber(dataSplitSecond[7].domestic - allSelection[i].getValue("custrecord_aug_domestic")),
                        gap9domestic: formatNumber(dataSplitSecond[8].domestic - allSelection[i].getValue("custrecord_sep_domestic")),
                        gap10domestic: formatNumber(dataSplitSecond[9].domestic - allSelection[i].getValue("custrecord_oct_domestic")),
                        gap11domestic: formatNumber(dataSplitSecond[10].domestic - allSelection[i].getValue("custrecord_nov_domestic")),
                        gap12domestic: formatNumber(dataSplitSecond[11].domestic - allSelection[i].getValue("custrecord_dec_domestic")),
                        perc1domestic: formatNumber(getPrecenge(dataSplitSecond[0].domestic, allSelection[i].getValue("custrecord_jan_domestic"))) + '%',
                        perc2domestic: formatNumber(getPrecenge(dataSplitSecond[1].domestic, allSelection[i].getValue("custrecord_feb_domestic"))) + '%',
                        perc3domestic: formatNumber(getPrecenge(dataSplitSecond[2].domestic, allSelection[i].getValue("custrecord_mar_domestic"))) + '%',
                        perc4domestic: formatNumber(getPrecenge(dataSplitSecond[3].domestic, allSelection[i].getValue("custrecord_apr_domestic"))) + '%',
                        perc5domestic: formatNumber(getPrecenge(dataSplitSecond[4].domestic, allSelection[i].getValue("custrecord_may_domestic"))) + '%',
                        perc6domestic: formatNumber(getPrecenge(dataSplitSecond[5].domestic, allSelection[i].getValue("custrecord_jun_domestic"))) + '%',
                        perc7domestic: formatNumber(getPrecenge(dataSplitSecond[6].domestic, allSelection[i].getValue("custrecord_jul_domestic"))) + '%',
                        perc8domestic: formatNumber(getPrecenge(dataSplitSecond[7].domestic, allSelection[i].getValue("custrecord_aug_domestic"))) + '%',
                        perc9domestic: formatNumber(getPrecenge(dataSplitSecond[8].domestic, allSelection[i].getValue("custrecord_sep_domestic"))) + '%',
                        perc10domestic: formatNumber(getPrecenge(dataSplitSecond[9].domestic, allSelection[i].getValue("custrecord_oct_domestic"))) + '%',
                        perc11domestic: formatNumber(getPrecenge(dataSplitSecond[10].domestic, allSelection[i].getValue("custrecord_nov_domestic"))) + '%',
                        perc12domestic: formatNumber(getPrecenge(dataSplitSecond[11].domestic, allSelection[i].getValue("custrecord_dec_domestic"))) + '%',
                        mounth1ip: dataSplit[0].ip,
                        mounth2ip: dataSplit[1].ip,
                        mounth3ip: dataSplit[2].ip,
                        mounth4ip: dataSplit[3].ip,
                        mounth5ip: dataSplit[4].ip,
                        mounth6ip: dataSplit[5].ip,
                        mounth7ip: dataSplit[6].ip,
                        mounth8ip: dataSplit[7].ip,
                        mounth9ip: dataSplit[8].ip,
                        mounth10ip: dataSplit[9].ip,
                        mounth11ip: dataSplit[10].ip,
                        mounth12ip: dataSplit[11].ip,
                        totalip: formatNumber(totalip),
                        totaltargetip: formatNumber(totaltargetip),
                        totalgapip: formatNumber(totalip - totaltargetip),
                        totalpercip: formatNumber(getPrecenge(totalip, totaltargetip)) + '%',
                        target1ip: formatNumber(allSelection[i].getValue("custrecord_jan_ip")),
                        target2ip: formatNumber(allSelection[i].getValue("custrecord_feb_ip")),
                        target3ip: formatNumber(allSelection[i].getValue("custrecord_mar_ip")),
                        target4ip: formatNumber(allSelection[i].getValue("custrecord_apr_ip")),
                        target5ip: formatNumber(allSelection[i].getValue("custrecord_may_ip")),
                        target6ip: formatNumber(allSelection[i].getValue("custrecord_jun_ip")),
                        target7ip: formatNumber(allSelection[i].getValue("custrecord_jul_ip")),
                        target8ip: formatNumber(allSelection[i].getValue("custrecord_aug_ip")),
                        target9ip: formatNumber(allSelection[i].getValue("custrecord_sep_ip")),
                        target10ip: formatNumber(allSelection[i].getValue("custrecord_oct_ip")),
                        target11ip: formatNumber(allSelection[i].getValue("custrecord_nov_ip")),
                        target12ip: formatNumber(allSelection[i].getValue("custrecord_dec_ip")),
                        gap1ip: formatNumber(dataSplitSecond[0].ip - allSelection[i].getValue("custrecord_jan_ip")),
                        gap2ip: formatNumber(dataSplitSecond[1].ip - allSelection[i].getValue("custrecord_feb_ip")),
                        gap3ip: formatNumber(dataSplitSecond[2].ip - allSelection[i].getValue("custrecord_mar_ip")),
                        gap4ip: formatNumber(dataSplitSecond[3].ip - allSelection[i].getValue("custrecord_apr_ip")),
                        gap5ip: formatNumber(dataSplitSecond[4].ip - allSelection[i].getValue("custrecord_may_ip")),
                        gap6ip: formatNumber(dataSplitSecond[5].ip - allSelection[i].getValue("custrecord_jun_ip")),
                        gap7ip: formatNumber(dataSplitSecond[6].ip - allSelection[i].getValue("custrecord_jul_ip")),
                        gap8ip: formatNumber(dataSplitSecond[7].ip - allSelection[i].getValue("custrecord_aug_ip")),
                        gap9ip: formatNumber(dataSplitSecond[8].ip - allSelection[i].getValue("custrecord_sep_ip")),
                        gap10ip: formatNumber(dataSplitSecond[9].ip - allSelection[i].getValue("custrecord_oct_ip")),
                        gap11ip: formatNumber(dataSplitSecond[10].ip - allSelection[i].getValue("custrecord_nov_ip")),
                        gap12ip: formatNumber(dataSplitSecond[11].ip - allSelection[i].getValue("custrecord_dec_ip")),
                        perc1ip: formatNumber(getPrecenge(dataSplitSecond[0].ip, allSelection[i].getValue("custrecord_jan_ip"))) + '%',
                        perc2ip: formatNumber(getPrecenge(dataSplitSecond[1].ip, allSelection[i].getValue("custrecord_feb_ip"))) + '%',
                        perc3ip: formatNumber(getPrecenge(dataSplitSecond[2].ip, allSelection[i].getValue("custrecord_mar_ip"))) + '%',
                        perc4ip: formatNumber(getPrecenge(dataSplitSecond[3].ip, allSelection[i].getValue("custrecord_apr_ip"))) + '%',
                        perc5ip: formatNumber(getPrecenge(dataSplitSecond[4].ip, allSelection[i].getValue("custrecord_may_ip"))) + '%',
                        perc6ip: formatNumber(getPrecenge(dataSplitSecond[5].ip, allSelection[i].getValue("custrecord_jun_ip"))) + '%',
                        perc7ip: formatNumber(getPrecenge(dataSplitSecond[6].ip, allSelection[i].getValue("custrecord_jul_ip"))) + '%',
                        perc8ip: formatNumber(getPrecenge(dataSplitSecond[7].ip, allSelection[i].getValue("custrecord_aug_ip"))) + '%',
                        perc9ip: formatNumber(getPrecenge(dataSplitSecond[8].ip, allSelection[i].getValue("custrecord_sep_ip"))) + '%',
                        perc10ip: formatNumber(getPrecenge(dataSplitSecond[9].ip, allSelection[i].getValue("custrecord_oct_ip"))) + '%',
                        perc11ip: formatNumber(getPrecenge(dataSplitSecond[10].ip, allSelection[i].getValue("custrecord_nov_ip"))) + '%',
                        perc12ip: formatNumber(getPrecenge(dataSplitSecond[11].ip, allSelection[i].getValue("custrecord_dec_ip"))) + '%',
                        mounth1iru: dataSplit[0].iru,
                        mounth2iru: dataSplit[1].iru,
                        mounth3iru: dataSplit[2].iru,
                        mounth4iru: dataSplit[3].iru,
                        mounth5iru: dataSplit[4].iru,
                        mounth6iru: dataSplit[5].iru,
                        mounth7iru: dataSplit[6].iru,
                        mounth8iru: dataSplit[7].iru,
                        mounth9iru: dataSplit[8].iru,
                        mounth10iru: dataSplit[9].iru,
                        mounth11iru: dataSplit[10].iru,
                        mounth12iru: dataSplit[11].iru,
                        totaliru: formatNumber(totaliru),
                        totaltargetiru: formatNumber(totaltargetiru),
                        totalgapiru: formatNumber(totaliru - totaltargetiru),
                        totalperciru: formatNumber(getPrecenge(totaliru, totaltargetiru)) + '%',
                        target1iru: formatNumber(allSelection[i].getValue("custrecord_jan_iru")),
                        target2iru: formatNumber(allSelection[i].getValue("custrecord_feb_iru")),
                        target3iru: formatNumber(allSelection[i].getValue("custrecord_mar_iru")),
                        target4iru: formatNumber(allSelection[i].getValue("custrecord_apr_iru")),
                        target5iru: formatNumber(allSelection[i].getValue("custrecord_may_iru")),
                        target6iru: formatNumber(allSelection[i].getValue("custrecord_jun_iru")),
                        target7iru: formatNumber(allSelection[i].getValue("custrecord_jul_iru")),
                        target8iru: formatNumber(allSelection[i].getValue("custrecord_aug_iru")),
                        target9iru: formatNumber(allSelection[i].getValue("custrecord_sep_iru")),
                        target10iru: formatNumber(allSelection[i].getValue("custrecord_oct_iru")),
                        target11iru: formatNumber(allSelection[i].getValue("custrecord_nov_iru")),
                        target12iru: formatNumber(allSelection[i].getValue("custrecord_dec_iru")),
                        gap1iru: formatNumber(dataSplitSecond[0].iru - allSelection[i].getValue("custrecord_jan_iru")),
                        gap2iru: formatNumber(dataSplitSecond[1].iru - allSelection[i].getValue("custrecord_feb_iru")),
                        gap3iru: formatNumber(dataSplitSecond[2].iru - allSelection[i].getValue("custrecord_mar_iru")),
                        gap4iru: formatNumber(dataSplitSecond[3].iru - allSelection[i].getValue("custrecord_apr_iru")),
                        gap5iru: formatNumber(dataSplitSecond[4].iru - allSelection[i].getValue("custrecord_may_iru")),
                        gap6iru: formatNumber(dataSplitSecond[5].iru - allSelection[i].getValue("custrecord_jun_iru")),
                        gap7iru: formatNumber(dataSplitSecond[6].iru - allSelection[i].getValue("custrecord_jul_iru")),
                        gap8iru: formatNumber(dataSplitSecond[7].iru - allSelection[i].getValue("custrecord_aug_iru")),
                        gap9iru: formatNumber(dataSplitSecond[8].iru - allSelection[i].getValue("custrecord_sep_iru")),
                        gap10iru: formatNumber(dataSplitSecond[9].iru - allSelection[i].getValue("custrecord_oct_iru")),
                        gap11iru: formatNumber(dataSplitSecond[10].iru - allSelection[i].getValue("custrecord_nov_iru")),
                        gap12iru: formatNumber(dataSplitSecond[11].iru - allSelection[i].getValue("custrecord_dec_iru")),
                        perc1iru: formatNumber(getPrecenge(dataSplitSecond[0].iru, allSelection[i].getValue("custrecord_jan_iru"))) + '%',
                        perc2iru: formatNumber(getPrecenge(dataSplitSecond[1].iru, allSelection[i].getValue("custrecord_feb_iru"))) + '%',
                        perc3iru: formatNumber(getPrecenge(dataSplitSecond[2].iru, allSelection[i].getValue("custrecord_mar_iru"))) + '%',
                        perc4iru: formatNumber(getPrecenge(dataSplitSecond[3].iru, allSelection[i].getValue("custrecord_apr_iru"))) + '%',
                        perc5iru: formatNumber(getPrecenge(dataSplitSecond[4].iru, allSelection[i].getValue("custrecord_may_iru"))) + '%',
                        perc6iru: formatNumber(getPrecenge(dataSplitSecond[5].iru, allSelection[i].getValue("custrecord_jun_iru"))) + '%',
                        perc7iru: formatNumber(getPrecenge(dataSplitSecond[6].iru, allSelection[i].getValue("custrecord_jul_iru"))) + '%',
                        perc8iru: formatNumber(getPrecenge(dataSplitSecond[7].iru, allSelection[i].getValue("custrecord_aug_iru"))) + '%',
                        perc9iru: formatNumber(getPrecenge(dataSplitSecond[8].iru, allSelection[i].getValue("custrecord_sep_iru"))) + '%',
                        perc10iru: formatNumber(getPrecenge(dataSplitSecond[9].iru, allSelection[i].getValue("custrecord_oct_iru"))) + '%',
                        perc11iru: formatNumber(getPrecenge(dataSplitSecond[10].iru, allSelection[i].getValue("custrecord_nov_iru"))) + '%',
                        perc12iru: formatNumber(getPrecenge(dataSplitSecond[11].iru, allSelection[i].getValue("custrecord_dec_iru"))) + '%',
                        mounth1kuband: dataSplit[0].kuband,
                        mounth2kuband: dataSplit[1].kuband,
                        mounth3kuband: dataSplit[2].kuband,
                        mounth4kuband: dataSplit[3].kuband,
                        mounth5kuband: dataSplit[4].kuband,
                        mounth6kuband: dataSplit[5].kuband,
                        mounth7kuband: dataSplit[6].kuband,
                        mounth8kuband: dataSplit[7].kuband,
                        mounth9kuband: dataSplit[8].kuband,
                        mounth10kuband: dataSplit[9].kuband,
                        mounth11kuband: dataSplit[10].kuband,
                        mounth12kuband: dataSplit[11].kuband,
                        totalkuband: formatNumber(totalkuband),
                        totaltargetkuband: formatNumber(totaltargetkuband),
                        totalgapkuband: formatNumber(totalkuband - totaltargetkuband),
                        totalperckuband: formatNumber(getPrecenge(totalkuband, totaltargetkuband)) + '%',
                        target1kuband: formatNumber(allSelection[i].getValue("custrecord_jan_kuband")),
                        target2kuband: formatNumber(allSelection[i].getValue("custrecord_feb_kuband")),
                        target3kuband: formatNumber(allSelection[i].getValue("custrecord_mar_kuband")),
                        target4kuband: formatNumber(allSelection[i].getValue("custrecord_apr_kuband")),
                        target5kuband: formatNumber(allSelection[i].getValue("custrecord_may_kuband")),
                        target6kuband: formatNumber(allSelection[i].getValue("custrecord_jun_kuband")),
                        target7kuband: formatNumber(allSelection[i].getValue("custrecord_jul_kuband")),
                        target8kuband: formatNumber(allSelection[i].getValue("custrecord_aug_kuband")),
                        target9kuband: formatNumber(allSelection[i].getValue("custrecord_sep_kuband")),
                        target10kuband: formatNumber(allSelection[i].getValue("custrecord_oct_kuband")),
                        target11kuband: formatNumber(allSelection[i].getValue("custrecord_nov_kuband")),
                        target12kuband: formatNumber(allSelection[i].getValue("custrecord_dec_kuband")),
                        gap1kuband: formatNumber(dataSplitSecond[0].kuband - allSelection[i].getValue("custrecord_jan_kuband")),
                        gap2kuband: formatNumber(dataSplitSecond[1].kuband - allSelection[i].getValue("custrecord_feb_kuband")),
                        gap3kuband: formatNumber(dataSplitSecond[2].kuband - allSelection[i].getValue("custrecord_mar_kuband")),
                        gap4kuband: formatNumber(dataSplitSecond[3].kuband - allSelection[i].getValue("custrecord_apr_kuband")),
                        gap5kuband: formatNumber(dataSplitSecond[4].kuband - allSelection[i].getValue("custrecord_may_kuband")),
                        gap6kuband: formatNumber(dataSplitSecond[5].kuband - allSelection[i].getValue("custrecord_jun_kuband")),
                        gap7kuband: formatNumber(dataSplitSecond[6].kuband - allSelection[i].getValue("custrecord_jul_kuband")),
                        gap8kuband: formatNumber(dataSplitSecond[7].kuband - allSelection[i].getValue("custrecord_aug_kuband")),
                        gap9kuband: formatNumber(dataSplitSecond[8].kuband - allSelection[i].getValue("custrecord_sep_kuband")),
                        gap10kuband: formatNumber(dataSplitSecond[9].kuband - allSelection[i].getValue("custrecord_oct_kuband")),
                        gap11kuband: formatNumber(dataSplitSecond[10].kuband - allSelection[i].getValue("custrecord_nov_kuband")),
                        gap12kuband: formatNumber(dataSplitSecond[11].kuband - allSelection[i].getValue("custrecord_dec_kuband")),
                        perc1kuband: formatNumber(getPrecenge(dataSplitSecond[0].kuband, allSelection[i].getValue("custrecord_jan_kuband"))) + '%',
                        perc2kuband: formatNumber(getPrecenge(dataSplitSecond[1].kuband, allSelection[i].getValue("custrecord_feb_kuband"))) + '%',
                        perc3kuband: formatNumber(getPrecenge(dataSplitSecond[2].kuband, allSelection[i].getValue("custrecord_mar_kuband"))) + '%',
                        perc4kuband: formatNumber(getPrecenge(dataSplitSecond[3].kuband, allSelection[i].getValue("custrecord_apr_kuband"))) + '%',
                        perc5kuband: formatNumber(getPrecenge(dataSplitSecond[4].kuband, allSelection[i].getValue("custrecord_may_kuband"))) + '%',
                        perc6kuband: formatNumber(getPrecenge(dataSplitSecond[5].kuband, allSelection[i].getValue("custrecord_jun_kuband"))) + '%',
                        perc7kuband: formatNumber(getPrecenge(dataSplitSecond[6].kuband, allSelection[i].getValue("custrecord_jul_kuband"))) + '%',
                        perc8kuband: formatNumber(getPrecenge(dataSplitSecond[7].kuband, allSelection[i].getValue("custrecord_aug_kuband"))) + '%',
                        perc9kuband: formatNumber(getPrecenge(dataSplitSecond[8].kuband, allSelection[i].getValue("custrecord_sep_kuband"))) + '%',
                        perc10kuband: formatNumber(getPrecenge(dataSplitSecond[9].kuband, allSelection[i].getValue("custrecord_oct_kuband"))) + '%',
                        perc11kuband: formatNumber(getPrecenge(dataSplitSecond[10].kuband, allSelection[i].getValue("custrecord_nov_kuband"))) + '%',
                        perc12kuband: formatNumber(getPrecenge(dataSplitSecond[11].kuband, allSelection[i].getValue("custrecord_dec_kuband"))) + '%',
                        mounth1mobile_vsat: dataSplit[0].mobile_vsat,
                        mounth2mobile_vsat: dataSplit[1].mobile_vsat,
                        mounth3mobile_vsat: dataSplit[2].mobile_vsat,
                        mounth4mobile_vsat: dataSplit[3].mobile_vsat,
                        mounth5mobile_vsat: dataSplit[4].mobile_vsat,
                        mounth6mobile_vsat: dataSplit[5].mobile_vsat,
                        mounth7mobile_vsat: dataSplit[6].mobile_vsat,
                        mounth8mobile_vsat: dataSplit[7].mobile_vsat,
                        mounth9mobile_vsat: dataSplit[8].mobile_vsat,
                        mounth10mobile_vsat: dataSplit[9].mobile_vsat,
                        mounth11mobile_vsat: dataSplit[10].mobile_vsat,
                        mounth12mobile_vsat: dataSplit[11].mobile_vsat,
                        totalmobile_vsat: formatNumber(totalmobile_vsat),
                        totaltargetmobile_vsat: formatNumber(totaltargetmobile_vsat),
                        totalgapmobile_vsat: formatNumber(totalmobile_vsat - totaltargetmobile_vsat),
                        totalpercmobile_vsat: formatNumber(getPrecenge(totalmobile_vsat, totaltargetmobile_vsat)) + '%',
                        target1mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_jan_mobile_vsat")),
                        target2mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_feb_mobile_vsat")),
                        target3mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_mar_mobile_vsat")),
                        target4mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_apr_mobile_vsat")),
                        target5mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_may_mobile_vsat")),
                        target6mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_jun_mobile_vsat")),
                        target7mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_jul_mobile_vsat")),
                        target8mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_aug_mobile_vsat")),
                        target9mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_sep_mobile_vsat")),
                        target10mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_oct_mobile_vsat")),
                        target11mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nov_mobile_vsat")),
                        target12mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_dec_mobile_vsat")),
                        gap1mobile_vsat: formatNumber(dataSplitSecond[0].mobile_vsat - allSelection[i].getValue("custrecord_jan_mobile_vsat")),
                        gap2mobile_vsat: formatNumber(dataSplitSecond[1].mobile_vsat - allSelection[i].getValue("custrecord_feb_mobile_vsat")),
                        gap3mobile_vsat: formatNumber(dataSplitSecond[2].mobile_vsat - allSelection[i].getValue("custrecord_mar_mobile_vsat")),
                        gap4mobile_vsat: formatNumber(dataSplitSecond[3].mobile_vsat - allSelection[i].getValue("custrecord_apr_mobile_vsat")),
                        gap5mobile_vsat: formatNumber(dataSplitSecond[4].mobile_vsat - allSelection[i].getValue("custrecord_may_mobile_vsat")),
                        gap6mobile_vsat: formatNumber(dataSplitSecond[5].mobile_vsat - allSelection[i].getValue("custrecord_jun_mobile_vsat")),
                        gap7mobile_vsat: formatNumber(dataSplitSecond[6].mobile_vsat - allSelection[i].getValue("custrecord_jul_mobile_vsat")),
                        gap8mobile_vsat: formatNumber(dataSplitSecond[7].mobile_vsat - allSelection[i].getValue("custrecord_aug_mobile_vsat")),
                        gap9mobile_vsat: formatNumber(dataSplitSecond[8].mobile_vsat - allSelection[i].getValue("custrecord_sep_mobile_vsat")),
                        gap10mobile_vsat: formatNumber(dataSplitSecond[9].mobile_vsat - allSelection[i].getValue("custrecord_oct_mobile_vsat")),
                        gap11mobile_vsat: formatNumber(dataSplitSecond[10].mobile_vsat - allSelection[i].getValue("custrecord_nov_mobile_vsat")),
                        gap12mobile_vsat: formatNumber(dataSplitSecond[11].mobile_vsat - allSelection[i].getValue("custrecord_dec_mobile_vsat")),
                        perc1mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[0].mobile_vsat, allSelection[i].getValue("custrecord_jan_mobile_vsat"))) + '%',
                        perc2mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[1].mobile_vsat, allSelection[i].getValue("custrecord_feb_mobile_vsat"))) + '%',
                        perc3mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[2].mobile_vsat, allSelection[i].getValue("custrecord_mar_mobile_vsat"))) + '%',
                        perc4mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[3].mobile_vsat, allSelection[i].getValue("custrecord_apr_mobile_vsat"))) + '%',
                        perc5mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[4].mobile_vsat, allSelection[i].getValue("custrecord_may_mobile_vsat"))) + '%',
                        perc6mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[5].mobile_vsat, allSelection[i].getValue("custrecord_jun_mobile_vsat"))) + '%',
                        perc7mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[6].mobile_vsat, allSelection[i].getValue("custrecord_jul_mobile_vsat"))) + '%',
                        perc8mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[7].mobile_vsat, allSelection[i].getValue("custrecord_aug_mobile_vsat"))) + '%',
                        perc9mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[8].mobile_vsat, allSelection[i].getValue("custrecord_sep_mobile_vsat"))) + '%',
                        perc10mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[9].mobile_vsat, allSelection[i].getValue("custrecord_oct_mobile_vsat"))) + '%',
                        perc11mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[10].mobile_vsat, allSelection[i].getValue("custrecord_nov_mobile_vsat"))) + '%',
                        perc12mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[11].mobile_vsat, allSelection[i].getValue("custrecord_dec_mobile_vsat"))) + '%',
                        mounth1mpip: dataSplit[0].mpip,
                        mounth2mpip: dataSplit[1].mpip,
                        mounth3mpip: dataSplit[2].mpip,
                        mounth4mpip: dataSplit[3].mpip,
                        mounth5mpip: dataSplit[4].mpip,
                        mounth6mpip: dataSplit[5].mpip,
                        mounth7mpip: dataSplit[6].mpip,
                        mounth8mpip: dataSplit[7].mpip,
                        mounth9mpip: dataSplit[8].mpip,
                        mounth10mpip: dataSplit[9].mpip,
                        mounth11mpip: dataSplit[10].mpip,
                        mounth12mpip: dataSplit[11].mpip,
                        totalmpip: formatNumber(totalmpip),
                        totaltargetmpip: formatNumber(totaltargetmpip),
                        totalgapmpip: formatNumber(totalmpip - totaltargetmpip),
                        totalpercmpip: formatNumber(getPrecenge(totalmpip, totaltargetmpip)) + '%',
                        target1mpip: formatNumber(allSelection[i].getValue("custrecord_jan_mpip")),
                        target2mpip: formatNumber(allSelection[i].getValue("custrecord_feb_mpip")),
                        target3mpip: formatNumber(allSelection[i].getValue("custrecord_mar_mpip")),
                        target4mpip: formatNumber(allSelection[i].getValue("custrecord_apr_mpip")),
                        target5mpip: formatNumber(allSelection[i].getValue("custrecord_may_mpip")),
                        target6mpip: formatNumber(allSelection[i].getValue("custrecord_jun_mpip")),
                        target7mpip: formatNumber(allSelection[i].getValue("custrecord_jul_mpip")),
                        target8mpip: formatNumber(allSelection[i].getValue("custrecord_aug_mpip")),
                        target9mpip: formatNumber(allSelection[i].getValue("custrecord_sep_mpip")),
                        target10mpip: formatNumber(allSelection[i].getValue("custrecord_oct_mpip")),
                        target11mpip: formatNumber(allSelection[i].getValue("custrecord_nov_mpip")),
                        target12mpip: formatNumber(allSelection[i].getValue("custrecord_dec_mpip")),
                        gap1mpip: formatNumber(dataSplitSecond[0].mpip - allSelection[i].getValue("custrecord_jan_mpip")),
                        gap2mpip: formatNumber(dataSplitSecond[1].mpip - allSelection[i].getValue("custrecord_feb_mpip")),
                        gap3mpip: formatNumber(dataSplitSecond[2].mpip - allSelection[i].getValue("custrecord_mar_mpip")),
                        gap4mpip: formatNumber(dataSplitSecond[3].mpip - allSelection[i].getValue("custrecord_apr_mpip")),
                        gap5mpip: formatNumber(dataSplitSecond[4].mpip - allSelection[i].getValue("custrecord_may_mpip")),
                        gap6mpip: formatNumber(dataSplitSecond[5].mpip - allSelection[i].getValue("custrecord_jun_mpip")),
                        gap7mpip: formatNumber(dataSplitSecond[6].mpip - allSelection[i].getValue("custrecord_jul_mpip")),
                        gap8mpip: formatNumber(dataSplitSecond[7].mpip - allSelection[i].getValue("custrecord_aug_mpip")),
                        gap9mpip: formatNumber(dataSplitSecond[8].mpip - allSelection[i].getValue("custrecord_sep_mpip")),
                        gap10mpip: formatNumber(dataSplitSecond[9].mpip - allSelection[i].getValue("custrecord_oct_mpip")),
                        gap11mpip: formatNumber(dataSplitSecond[10].mpip - allSelection[i].getValue("custrecord_nov_mpip")),
                        gap12mpip: formatNumber(dataSplitSecond[11].mpip - allSelection[i].getValue("custrecord_dec_mpip")),
                        perc1mpip: formatNumber(getPrecenge(dataSplitSecond[0].mpip, allSelection[i].getValue("custrecord_jan_mpip"))) + '%',
                        perc2mpip: formatNumber(getPrecenge(dataSplitSecond[1].mpip, allSelection[i].getValue("custrecord_feb_mpip"))) + '%',
                        perc3mpip: formatNumber(getPrecenge(dataSplitSecond[2].mpip, allSelection[i].getValue("custrecord_mar_mpip"))) + '%',
                        perc4mpip: formatNumber(getPrecenge(dataSplitSecond[3].mpip, allSelection[i].getValue("custrecord_apr_mpip"))) + '%',
                        perc5mpip: formatNumber(getPrecenge(dataSplitSecond[4].mpip, allSelection[i].getValue("custrecord_may_mpip"))) + '%',
                        perc6mpip: formatNumber(getPrecenge(dataSplitSecond[5].mpip, allSelection[i].getValue("custrecord_jun_mpip"))) + '%',
                        perc7mpip: formatNumber(getPrecenge(dataSplitSecond[6].mpip, allSelection[i].getValue("custrecord_jul_mpip"))) + '%',
                        perc8mpip: formatNumber(getPrecenge(dataSplitSecond[7].mpip, allSelection[i].getValue("custrecord_aug_mpip"))) + '%',
                        perc9mpip: formatNumber(getPrecenge(dataSplitSecond[8].mpip, allSelection[i].getValue("custrecord_sep_mpip"))) + '%',
                        perc10mpip: formatNumber(getPrecenge(dataSplitSecond[9].mpip, allSelection[i].getValue("custrecord_oct_mpip"))) + '%',
                        perc11mpip: formatNumber(getPrecenge(dataSplitSecond[10].mpip, allSelection[i].getValue("custrecord_nov_mpip"))) + '%',
                        perc12mpip: formatNumber(getPrecenge(dataSplitSecond[11].mpip, allSelection[i].getValue("custrecord_dec_mpip"))) + '%',
                        mounth1o3b: dataSplit[0].o3b,
                        mounth2o3b: dataSplit[1].o3b,
                        mounth3o3b: dataSplit[2].o3b,
                        mounth4o3b: dataSplit[3].o3b,
                        mounth5o3b: dataSplit[4].o3b,
                        mounth6o3b: dataSplit[5].o3b,
                        mounth7o3b: dataSplit[6].o3b,
                        mounth8o3b: dataSplit[7].o3b,
                        mounth9o3b: dataSplit[8].o3b,
                        mounth10o3b: dataSplit[9].o3b,
                        mounth11o3b: dataSplit[10].o3b,
                        mounth12o3b: dataSplit[11].o3b,
                        totalo3b: formatNumber(totalo3b),
                        totaltargeto3b: formatNumber(totaltargeto3b),
                        totalgapo3b: formatNumber(totalo3b - totaltargeto3b),
                        totalperco3b: formatNumber(getPrecenge(totalo3b, totaltargeto3b)) + '%',
                        target1o3b: formatNumber(allSelection[i].getValue("custrecord_jan_o3b")),
                        target2o3b: formatNumber(allSelection[i].getValue("custrecord_feb_o3b")),
                        target3o3b: formatNumber(allSelection[i].getValue("custrecord_mar_o3b")),
                        target4o3b: formatNumber(allSelection[i].getValue("custrecord_apr_o3b")),
                        target5o3b: formatNumber(allSelection[i].getValue("custrecord_may_o3b")),
                        target6o3b: formatNumber(allSelection[i].getValue("custrecord_jun_o3b")),
                        target7o3b: formatNumber(allSelection[i].getValue("custrecord_jul_o3b")),
                        target8o3b: formatNumber(allSelection[i].getValue("custrecord_aug_o3b")),
                        target9o3b: formatNumber(allSelection[i].getValue("custrecord_sep_o3b")),
                        target10o3b: formatNumber(allSelection[i].getValue("custrecord_oct_o3b")),
                        target11o3b: formatNumber(allSelection[i].getValue("custrecord_nov_o3b")),
                        target12o3b: formatNumber(allSelection[i].getValue("custrecord_dec_o3b")),
                        gap1o3b: formatNumber(dataSplitSecond[0].o3b - allSelection[i].getValue("custrecord_jan_o3b")),
                        gap2o3b: formatNumber(dataSplitSecond[1].o3b - allSelection[i].getValue("custrecord_feb_o3b")),
                        gap3o3b: formatNumber(dataSplitSecond[2].o3b - allSelection[i].getValue("custrecord_mar_o3b")),
                        gap4o3b: formatNumber(dataSplitSecond[3].o3b - allSelection[i].getValue("custrecord_apr_o3b")),
                        gap5o3b: formatNumber(dataSplitSecond[4].o3b - allSelection[i].getValue("custrecord_may_o3b")),
                        gap6o3b: formatNumber(dataSplitSecond[5].o3b - allSelection[i].getValue("custrecord_jun_o3b")),
                        gap7o3b: formatNumber(dataSplitSecond[6].o3b - allSelection[i].getValue("custrecord_jul_o3b")),
                        gap8o3b: formatNumber(dataSplitSecond[7].o3b - allSelection[i].getValue("custrecord_aug_o3b")),
                        gap9o3b: formatNumber(dataSplitSecond[8].o3b - allSelection[i].getValue("custrecord_sep_o3b")),
                        gap10o3b: formatNumber(dataSplitSecond[9].o3b - allSelection[i].getValue("custrecord_oct_o3b")),
                        gap11o3b: formatNumber(dataSplitSecond[10].o3b - allSelection[i].getValue("custrecord_nov_o3b")),
                        gap12o3b: formatNumber(dataSplitSecond[11].o3b - allSelection[i].getValue("custrecord_dec_o3b")),
                        perc1o3b: formatNumber(getPrecenge(dataSplitSecond[0].o3b, allSelection[i].getValue("custrecord_jan_o3b"))) + '%',
                        perc2o3b: formatNumber(getPrecenge(dataSplitSecond[1].o3b, allSelection[i].getValue("custrecord_feb_o3b"))) + '%',
                        perc3o3b: formatNumber(getPrecenge(dataSplitSecond[2].o3b, allSelection[i].getValue("custrecord_mar_o3b"))) + '%',
                        perc4o3b: formatNumber(getPrecenge(dataSplitSecond[3].o3b, allSelection[i].getValue("custrecord_apr_o3b"))) + '%',
                        perc5o3b: formatNumber(getPrecenge(dataSplitSecond[4].o3b, allSelection[i].getValue("custrecord_may_o3b"))) + '%',
                        perc6o3b: formatNumber(getPrecenge(dataSplitSecond[5].o3b, allSelection[i].getValue("custrecord_jun_o3b"))) + '%',
                        perc7o3b: formatNumber(getPrecenge(dataSplitSecond[6].o3b, allSelection[i].getValue("custrecord_jul_o3b"))) + '%',
                        perc8o3b: formatNumber(getPrecenge(dataSplitSecond[7].o3b, allSelection[i].getValue("custrecord_aug_o3b"))) + '%',
                        perc9o3b: formatNumber(getPrecenge(dataSplitSecond[8].o3b, allSelection[i].getValue("custrecord_sep_o3b"))) + '%',
                        perc10o3b: formatNumber(getPrecenge(dataSplitSecond[9].o3b, allSelection[i].getValue("custrecord_oct_o3b"))) + '%',
                        perc11o3b: formatNumber(getPrecenge(dataSplitSecond[10].o3b, allSelection[i].getValue("custrecord_nov_o3b"))) + '%',
                        perc12o3b: formatNumber(getPrecenge(dataSplitSecond[11].o3b, allSelection[i].getValue("custrecord_dec_o3b"))) + '%',
                        mounth1ps: dataSplit[0].ps,
                        mounth2ps: dataSplit[1].ps,
                        mounth3ps: dataSplit[2].ps,
                        mounth4ps: dataSplit[3].ps,
                        mounth5ps: dataSplit[4].ps,
                        mounth6ps: dataSplit[5].ps,
                        mounth7ps: dataSplit[6].ps,
                        mounth8ps: dataSplit[7].ps,
                        mounth9ps: dataSplit[8].ps,
                        mounth10ps: dataSplit[9].ps,
                        mounth11ps: dataSplit[10].ps,
                        mounth12ps: dataSplit[11].ps,
                        target1ps: formatNumber(allSelection[i].getValue("custrecord_jan_ps")),
                        target2ps: formatNumber(allSelection[i].getValue("custrecord_feb_ps")),
                        target3ps: formatNumber(allSelection[i].getValue("custrecord_mar_ps")),
                        target4ps: formatNumber(allSelection[i].getValue("custrecord_apr_ps")),
                        target5ps: formatNumber(allSelection[i].getValue("custrecord_may_ps")),
                        target6ps: formatNumber(allSelection[i].getValue("custrecord_jun_ps")),
                        target7ps: formatNumber(allSelection[i].getValue("custrecord_jul_ps")),
                        target8ps: formatNumber(allSelection[i].getValue("custrecord_aug_ps")),
                        target9ps: formatNumber(allSelection[i].getValue("custrecord_sep_ps")),
                        target10ps: formatNumber(allSelection[i].getValue("custrecord_oct_ps")),
                        target11ps: formatNumber(allSelection[i].getValue("custrecord_nov_ps")),
                        target12ps: formatNumber(allSelection[i].getValue("custrecord_dec_ps")),
                        totalps: formatNumber(totalps),
                        totaltargetps: formatNumber(totaltargetps),
                        totalgapps: formatNumber(totalps - totaltargetps),
                        totalpercps: formatNumber(getPrecenge(totalps, totaltargetps)) + '%',
                        gap1ps: formatNumber(dataSplitSecond[0].ps - allSelection[i].getValue("custrecord_jan_ps")),
                        gap2ps: formatNumber(dataSplitSecond[1].ps - allSelection[i].getValue("custrecord_feb_ps")),
                        gap3ps: formatNumber(dataSplitSecond[2].ps - allSelection[i].getValue("custrecord_mar_ps")),
                        gap4ps: formatNumber(dataSplitSecond[3].ps - allSelection[i].getValue("custrecord_apr_ps")),
                        gap5ps: formatNumber(dataSplitSecond[4].ps - allSelection[i].getValue("custrecord_may_ps")),
                        gap6ps: formatNumber(dataSplitSecond[5].ps - allSelection[i].getValue("custrecord_jun_ps")),
                        gap7ps: formatNumber(dataSplitSecond[6].ps - allSelection[i].getValue("custrecord_jul_ps")),
                        gap8ps: formatNumber(dataSplitSecond[7].ps - allSelection[i].getValue("custrecord_aug_ps")),
                        gap9ps: formatNumber(dataSplitSecond[8].ps - allSelection[i].getValue("custrecord_sep_ps")),
                        gap10ps: formatNumber(dataSplitSecond[9].ps - allSelection[i].getValue("custrecord_oct_ps")),
                        gap11ps: formatNumber(dataSplitSecond[10].ps - allSelection[i].getValue("custrecord_nov_ps")),
                        gap12ps: formatNumber(dataSplitSecond[11].ps - allSelection[i].getValue("custrecord_dec_ps")),
                        perc1ps: formatNumber(getPrecenge(dataSplitSecond[0].ps, allSelection[i].getValue("custrecord_jan_ps"))) + '%',
                        perc2ps: formatNumber(getPrecenge(dataSplitSecond[1].ps, allSelection[i].getValue("custrecord_feb_ps"))) + '%',
                        perc3ps: formatNumber(getPrecenge(dataSplitSecond[2].ps, allSelection[i].getValue("custrecord_mar_ps"))) + '%',
                        perc4ps: formatNumber(getPrecenge(dataSplitSecond[3].ps, allSelection[i].getValue("custrecord_apr_ps"))) + '%',
                        perc5ps: formatNumber(getPrecenge(dataSplitSecond[4].ps, allSelection[i].getValue("custrecord_may_ps"))) + '%',
                        perc6ps: formatNumber(getPrecenge(dataSplitSecond[5].ps, allSelection[i].getValue("custrecord_jun_ps"))) + '%',
                        perc7ps: formatNumber(getPrecenge(dataSplitSecond[6].ps, allSelection[i].getValue("custrecord_jul_ps"))) + '%',
                        perc8ps: formatNumber(getPrecenge(dataSplitSecond[7].ps, allSelection[i].getValue("custrecord_aug_ps"))) + '%',
                        perc9ps: formatNumber(getPrecenge(dataSplitSecond[8].ps, allSelection[i].getValue("custrecord_sep_ps"))) + '%',
                        perc10ps: formatNumber(getPrecenge(dataSplitSecond[9].ps, allSelection[i].getValue("custrecord_oct_ps"))) + '%',
                        perc11ps: formatNumber(getPrecenge(dataSplitSecond[10].ps, allSelection[i].getValue("custrecord_nov_ps"))) + '%',
                        perc12ps: formatNumber(getPrecenge(dataSplitSecond[11].ps, allSelection[i].getValue("custrecord_dec_ps"))) + '%',
                        mounth1sr: dataSplit[0].sr,
                        mounth2sr: dataSplit[1].sr,
                        mounth3sr: dataSplit[2].sr,
                        mounth4sr: dataSplit[3].sr,
                        mounth5sr: dataSplit[4].sr,
                        mounth6sr: dataSplit[5].sr,
                        mounth7sr: dataSplit[6].sr,
                        mounth8sr: dataSplit[7].sr,
                        mounth9sr: dataSplit[8].sr,
                        mounth10sr: dataSplit[9].sr,
                        mounth11sr: dataSplit[10].sr,
                        mounth12sr: dataSplit[11].sr,
                        totalsr: formatNumber(totalsr),
                        totaltargetsr: formatNumber(totaltargetsr),
                        totalgapsr: formatNumber(totalsr - totaltargetsr),
                        totalpercsr: formatNumber(getPrecenge(totalsr, totaltargetsr)) + '%',
                        target1sr: formatNumber(allSelection[i].getValue("custrecord_jan_sr")),
                        target2sr: formatNumber(allSelection[i].getValue("custrecord_feb_sr")),
                        target3sr: formatNumber(allSelection[i].getValue("custrecord_mar_sr")),
                        target4sr: formatNumber(allSelection[i].getValue("custrecord_apr_sr")),
                        target5sr: formatNumber(allSelection[i].getValue("custrecord_may_sr")),
                        target6sr: formatNumber(allSelection[i].getValue("custrecord_jun_sr")),
                        target7sr: formatNumber(allSelection[i].getValue("custrecord_jul_sr")),
                        target8sr: formatNumber(allSelection[i].getValue("custrecord_aug_sr")),
                        target9sr: formatNumber(allSelection[i].getValue("custrecord_sep_sr")),
                        target10sr: formatNumber(allSelection[i].getValue("custrecord_oct_sr")),
                        target11sr: formatNumber(allSelection[i].getValue("custrecord_nov_sr")),
                        target12sr: formatNumber(allSelection[i].getValue("custrecord_dec_sr")),
                        gap1sr: formatNumber(dataSplitSecond[0].sr - allSelection[i].getValue("custrecord_jan_sr")),
                        gap2sr: formatNumber(dataSplitSecond[1].sr - allSelection[i].getValue("custrecord_feb_sr")),
                        gap3sr: formatNumber(dataSplitSecond[2].sr - allSelection[i].getValue("custrecord_mar_sr")),
                        gap4sr: formatNumber(dataSplitSecond[3].sr - allSelection[i].getValue("custrecord_apr_sr")),
                        gap5sr: formatNumber(dataSplitSecond[4].sr - allSelection[i].getValue("custrecord_may_sr")),
                        gap6sr: formatNumber(dataSplitSecond[5].sr - allSelection[i].getValue("custrecord_jun_sr")),
                        gap7sr: formatNumber(dataSplitSecond[6].sr - allSelection[i].getValue("custrecord_jul_sr")),
                        gap8sr: formatNumber(dataSplitSecond[7].sr - allSelection[i].getValue("custrecord_aug_sr")),
                        gap9sr: formatNumber(dataSplitSecond[8].sr - allSelection[i].getValue("custrecord_sep_sr")),
                        gap10sr: formatNumber(dataSplitSecond[9].sr - allSelection[i].getValue("custrecord_oct_sr")),
                        gap11sr: formatNumber(dataSplitSecond[10].sr - allSelection[i].getValue("custrecord_nov_sr")),
                        gap12sr: formatNumber(dataSplitSecond[11].sr - allSelection[i].getValue("custrecord_dec_sr")),
                        perc1sr: formatNumber(getPrecenge(dataSplitSecond[0].sr, allSelection[i].getValue("custrecord_jan_sr"))) + '%',
                        perc2sr: formatNumber(getPrecenge(dataSplitSecond[1].sr, allSelection[i].getValue("custrecord_feb_sr"))) + '%',
                        perc3sr: formatNumber(getPrecenge(dataSplitSecond[2].sr, allSelection[i].getValue("custrecord_mar_sr"))) + '%',
                        perc4sr: formatNumber(getPrecenge(dataSplitSecond[3].sr, allSelection[i].getValue("custrecord_apr_sr"))) + '%',
                        perc5sr: formatNumber(getPrecenge(dataSplitSecond[4].sr, allSelection[i].getValue("custrecord_may_sr"))) + '%',
                        perc6sr: formatNumber(getPrecenge(dataSplitSecond[5].sr, allSelection[i].getValue("custrecord_jun_sr"))) + '%',
                        perc7sr: formatNumber(getPrecenge(dataSplitSecond[6].sr, allSelection[i].getValue("custrecord_jul_sr"))) + '%',
                        perc8sr: formatNumber(getPrecenge(dataSplitSecond[7].sr, allSelection[i].getValue("custrecord_aug_sr"))) + '%',
                        perc9sr: formatNumber(getPrecenge(dataSplitSecond[8].sr, allSelection[i].getValue("custrecord_sep_sr"))) + '%',
                        perc10sr: formatNumber(getPrecenge(dataSplitSecond[9].sr, allSelection[i].getValue("custrecord_oct_sr"))) + '%',
                        perc11sr: formatNumber(getPrecenge(dataSplitSecond[10].sr, allSelection[i].getValue("custrecord_nov_sr"))) + '%',
                        perc12sr: formatNumber(getPrecenge(dataSplitSecond[11].sr, allSelection[i].getValue("custrecord_dec_sr"))) + '%',

                        mounth1hw: dataSplit[0].hw,
                        mounth2hw: dataSplit[1].hw,
                        mounth3hw: dataSplit[2].hw,
                        mounth4hw: dataSplit[3].hw,
                        mounth5hw: dataSplit[4].hw,
                        mounth6hw: dataSplit[5].hw,
                        mounth7hw: dataSplit[6].hw,
                        mounth8hw: dataSplit[7].hw,
                        mounth9hw: dataSplit[8].hw,
                        mounth10hw: dataSplit[9].hw,
                        mounth11hw: dataSplit[10].hw,
                        mounth12hw: dataSplit[11].hw,
                        totalhw: formatNumber(totalhw),
                        totaltargethw: formatNumber(totaltargethw),
                        totalgaphw: formatNumber(totalhw - totaltargethw),
                        totalperchw: formatNumber(getPrecenge(totalhw, totaltargethw)) + '%',
                        target1hw: formatNumber(allSelection[i].getValue("custrecord_gt_jan_hw")),
                        target2hw: formatNumber(allSelection[i].getValue("custrecord_gt_feb_hw")),
                        target3hw: formatNumber(allSelection[i].getValue("custrecord_gt_mar_hw")),
                        target4hw: formatNumber(allSelection[i].getValue("custrecord_gt_apr_hw")),
                        target5hw: formatNumber(allSelection[i].getValue("custrecord_gt_may_hw")),
                        target6hw: formatNumber(allSelection[i].getValue("custrecord_gt_jun_hw")),
                        target7hw: formatNumber(allSelection[i].getValue("custrecord_gt_jul_hw")),
                        target8hw: formatNumber(allSelection[i].getValue("custrecord_gt_aug_hw")),
                        target9hw: formatNumber(allSelection[i].getValue("custrecord_gt_sep_hw")),
                        target10hw: formatNumber(allSelection[i].getValue("custrecord_gt_oct_hw")),
                        target11hw: formatNumber(allSelection[i].getValue("custrecord_gt_nov_hw")),
                        target12hw: formatNumber(allSelection[i].getValue("custrecord_gt_dec_hw")),
                        gap1hw: formatNumber(dataSplitSecond[0].hw - allSelection[i].getValue("custrecord_gt_jan_hw")),
                        gap2hw: formatNumber(dataSplitSecond[1].hw - allSelection[i].getValue("custrecord_gt_feb_hw")),
                        gap3hw: formatNumber(dataSplitSecond[2].hw - allSelection[i].getValue("custrecord_gt_mar_hw")),
                        gap4hw: formatNumber(dataSplitSecond[3].hw - allSelection[i].getValue("custrecord_gt_apr_hw")),
                        gap5hw: formatNumber(dataSplitSecond[4].hw - allSelection[i].getValue("custrecord_gt_may_hw")),
                        gap6hw: formatNumber(dataSplitSecond[5].hw - allSelection[i].getValue("custrecord_gt_jun_hw")),
                        gap7hw: formatNumber(dataSplitSecond[6].hw - allSelection[i].getValue("custrecord_gt_jul_hw")),
                        gap8hw: formatNumber(dataSplitSecond[7].hw - allSelection[i].getValue("custrecord_gt_aug_hw")),
                        gap9hw: formatNumber(dataSplitSecond[8].hw - allSelection[i].getValue("custrecord_gt_sep_hw")),
                        gap10hw: formatNumber(dataSplitSecond[9].hw - allSelection[i].getValue("custrecord_gt_oct_hw")),
                        gap11hw: formatNumber(dataSplitSecond[10].hw - allSelection[i].getValue("custrecord_gt_nov_hw")),
                        gap12hw: formatNumber(dataSplitSecond[11].hw - allSelection[i].getValue("custrecord_gt_dec_hw")),
                        perc1hw: formatNumber(getPrecenge(dataSplitSecond[0].hw, allSelection[i].getValue("custrecord_gt_jan_hw"))) + '%',
                        perc2hw: formatNumber(getPrecenge(dataSplitSecond[1].hw, allSelection[i].getValue("custrecord_gt_feb_hw"))) + '%',
                        perc3hw: formatNumber(getPrecenge(dataSplitSecond[2].hw, allSelection[i].getValue("custrecord_gt_mar_hw"))) + '%',
                        perc4hw: formatNumber(getPrecenge(dataSplitSecond[3].hw, allSelection[i].getValue("custrecord_gt_apr_hw"))) + '%',
                        perc5hw: formatNumber(getPrecenge(dataSplitSecond[4].hw, allSelection[i].getValue("custrecord_gt_may_hw"))) + '%',
                        perc6hw: formatNumber(getPrecenge(dataSplitSecond[5].hw, allSelection[i].getValue("custrecord_gt_jun_hw"))) + '%',
                        perc7hw: formatNumber(getPrecenge(dataSplitSecond[6].hw, allSelection[i].getValue("custrecord_gt_jul_hw"))) + '%',
                        perc8hw: formatNumber(getPrecenge(dataSplitSecond[7].hw, allSelection[i].getValue("custrecord_gt_aug_hw"))) + '%',
                        perc9hw: formatNumber(getPrecenge(dataSplitSecond[8].hw, allSelection[i].getValue("custrecord_gt_sep_hw"))) + '%',
                        perc10hw: formatNumber(getPrecenge(dataSplitSecond[9].hw, allSelection[i].getValue("custrecord_gt_oct_hw"))) + '%',
                        perc11hw: formatNumber(getPrecenge(dataSplitSecond[10].hw, allSelection[i].getValue("custrecord_gt_nov_hw"))) + '%',
                        perc12hw: formatNumber(getPrecenge(dataSplitSecond[11].hw, allSelection[i].getValue("custrecord_gt_dec_hw"))) + '%',
                        mounth1dhls_hw: dataSplit[0].dhls_hw,
                        mounth2dhls_hw: dataSplit[1].dhls_hw,
                        mounth3dhls_hw: dataSplit[2].dhls_hw,
                        mounth4dhls_hw: dataSplit[3].dhls_hw,
                        mounth5dhls_hw: dataSplit[4].dhls_hw,
                        mounth6dhls_hw: dataSplit[5].dhls_hw,
                        mounth7dhls_hw: dataSplit[6].dhls_hw,
                        mounth8dhls_hw: dataSplit[7].dhls_hw,
                        mounth9dhls_hw: dataSplit[8].dhls_hw,
                        mounth10dhls_hw: dataSplit[9].dhls_hw,
                        mounth11dhls_hw: dataSplit[10].dhls_hw,
                        mounth12dhls_hw: dataSplit[11].dhls_hw,
                        totaldhls_hw: formatNumber(totaldhls_hw),
                        totaltargetdhls_hw: formatNumber(totaltargetdhls_hw),
                        totalgapdhls_hw: formatNumber(totaldhls_hw - totaltargetdhls_hw),
                        totalpercdhls_hw: formatNumber(getPrecenge(totaldhls_hw, totaltargetdhls_hw)) + '%',
                        target1dhls_hw: formatNumber(allSelection[i].getValue("custrecord_jan_dhls_hw")),
                        target2dhls_hw: formatNumber(allSelection[i].getValue("custrecord_feb_dhls_hw")),
                        target3dhls_hw: formatNumber(allSelection[i].getValue("custrecord_mar_dhls_hw")),
                        target4dhls_hw: formatNumber(allSelection[i].getValue("custrecord_apr_dhls_hw")),
                        target5dhls_hw: formatNumber(allSelection[i].getValue("custrecord_may_dhls_hw")),
                        target6dhls_hw: formatNumber(allSelection[i].getValue("custrecord_jun_dhls_hw")),
                        target7dhls_hw: formatNumber(allSelection[i].getValue("custrecord_jul_dhls_hw")),
                        target8dhls_hw: formatNumber(allSelection[i].getValue("custrecord_aug_dhls_hw")),
                        target9dhls_hw: formatNumber(allSelection[i].getValue("custrecord_sep_dhls_hw")),
                        target10dhls_hw: formatNumber(allSelection[i].getValue("custrecord_oct_dhls_hw")),
                        target11dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nov_dhls_hw")),
                        target12dhls_hw: formatNumber(allSelection[i].getValue("custrecord_dec_dhls_hw")),
                        gap1dhls_hw: formatNumber(dataSplitSecond[0].dhls_hw - allSelection[i].getValue("custrecord_jan_dhls_hw")),
                        gap2dhls_hw: formatNumber(dataSplitSecond[1].dhls_hw - allSelection[i].getValue("custrecord_feb_dhls_hw")),
                        gap3dhls_hw: formatNumber(dataSplitSecond[2].dhls_hw - allSelection[i].getValue("custrecord_mar_dhls_hw")),
                        gap4dhls_hw: formatNumber(dataSplitSecond[3].dhls_hw - allSelection[i].getValue("custrecord_apr_dhls_hw")),
                        gap5dhls_hw: formatNumber(dataSplitSecond[4].dhls_hw - allSelection[i].getValue("custrecord_may_dhls_hw")),
                        gap6dhls_hw: formatNumber(dataSplitSecond[5].dhls_hw - allSelection[i].getValue("custrecord_jun_dhls_hw")),
                        gap7dhls_hw: formatNumber(dataSplitSecond[6].dhls_hw - allSelection[i].getValue("custrecord_jul_dhls_hw")),
                        gap8dhls_hw: formatNumber(dataSplitSecond[7].dhls_hw - allSelection[i].getValue("custrecord_aug_dhls_hw")),
                        gap9dhls_hw: formatNumber(dataSplitSecond[8].dhls_hw - allSelection[i].getValue("custrecord_sep_dhls_hw")),
                        gap10dhls_hw: formatNumber(dataSplitSecond[9].dhls_hw - allSelection[i].getValue("custrecord_oct_dhls_hw")),
                        gap11dhls_hw: formatNumber(dataSplitSecond[10].dhls_hw - allSelection[i].getValue("custrecord_nov_dhls_hw")),
                        gap12dhls_hw: formatNumber(dataSplitSecond[11].dhls_hw - allSelection[i].getValue("custrecord_dec_dhls_hw")),
                        perc1dhls_hw: formatNumber(getPrecenge(dataSplitSecond[0].dhls_hw, allSelection[i].getValue("custrecord_jan_dhls_hw"))) + '%',
                        perc2dhls_hw: formatNumber(getPrecenge(dataSplitSecond[1].dhls_hw, allSelection[i].getValue("custrecord_feb_dhls_hw"))) + '%',
                        perc3dhls_hw: formatNumber(getPrecenge(dataSplitSecond[2].dhls_hw, allSelection[i].getValue("custrecord_mar_dhls_hw"))) + '%',
                        perc4dhls_hw: formatNumber(getPrecenge(dataSplitSecond[3].dhls_hw, allSelection[i].getValue("custrecord_apr_dhls_hw"))) + '%',
                        perc5dhls_hw: formatNumber(getPrecenge(dataSplitSecond[4].dhls_hw, allSelection[i].getValue("custrecord_may_dhls_hw"))) + '%',
                        perc6dhls_hw: formatNumber(getPrecenge(dataSplitSecond[5].dhls_hw, allSelection[i].getValue("custrecord_jun_dhls_hw"))) + '%',
                        perc7dhls_hw: formatNumber(getPrecenge(dataSplitSecond[6].dhls_hw, allSelection[i].getValue("custrecord_jul_dhls_hw"))) + '%',
                        perc8dhls_hw: formatNumber(getPrecenge(dataSplitSecond[7].dhls_hw, allSelection[i].getValue("custrecord_aug_dhls_hw"))) + '%',
                        perc9dhls_hw: formatNumber(getPrecenge(dataSplitSecond[8].dhls_hw, allSelection[i].getValue("custrecord_sep_dhls_hw"))) + '%',
                        perc10dhls_hw: formatNumber(getPrecenge(dataSplitSecond[9].dhls_hw, allSelection[i].getValue("custrecord_oct_dhls_hw"))) + '%',
                        perc11dhls_hw: formatNumber(getPrecenge(dataSplitSecond[10].dhls_hw, allSelection[i].getValue("custrecord_nov_dhls_hw"))) + '%',
                        perc12dhls_hw: formatNumber(getPrecenge(dataSplitSecond[11].dhls_hw, allSelection[i].getValue("custrecord_dec_dhls_hw"))) + '%',
                        mounth1gt: dataSplit[0].gt,
                        mounth2gt: dataSplit[1].gt,
                        mounth3gt: dataSplit[2].gt,
                        mounth4gt: dataSplit[3].gt,
                        mounth5gt: dataSplit[4].gt,
                        mounth6gt: dataSplit[5].gt,
                        mounth7gt: dataSplit[6].gt,
                        mounth8gt: dataSplit[7].gt,
                        mounth9gt: dataSplit[8].gt,
                        mounth10gt: dataSplit[9].gt,
                        mounth11gt: dataSplit[10].gt,
                        mounth12gt: dataSplit[11].gt,
                        totalgt: formatNumber(totalgt),
                        totaltargetgt: formatNumber(totaltargetgt),
                        totalgapgt: formatNumber(totalgt - totaltargetgt),
                        totalpercgt: formatNumber(getPrecenge(totalgt, totaltargetgt)) + '%',
                        target1gt: formatNumber(allSelection[i].getValue("custrecord_gt_jan_rec")),
                        target2gt: formatNumber(allSelection[i].getValue("custrecord_gt_feb_rec")),
                        target3gt: formatNumber(allSelection[i].getValue("custrecord_gt_mar_rec")),
                        target4gt: formatNumber(allSelection[i].getValue("custrecord_gt_apr_rec")),
                        target5gt: formatNumber(allSelection[i].getValue("custrecord_gt_may_rec")),
                        target6gt: formatNumber(allSelection[i].getValue("custrecord_gt_jun_rec")),
                        target7gt: formatNumber(allSelection[i].getValue("custrecord_gt_jul_rec")),
                        target8gt: formatNumber(allSelection[i].getValue("custrecord_gt_aug_rec")),
                        target9gt: formatNumber(allSelection[i].getValue("custrecord_gt_sep_rec")),
                        target10gt: formatNumber(allSelection[i].getValue("custrecord_gt_oct_rec")),
                        target11gt: formatNumber(allSelection[i].getValue("custrecord_gt_nov_rec")),
                        target12gt: formatNumber(allSelection[i].getValue("custrecord_gt_dec_rec")),
                        gap1gt: formatNumber(dataSplitSecond[0].gt - allSelection[i].getValue("custrecord_gt_jan_rec")),
                        gap2gt: formatNumber(dataSplitSecond[1].gt - allSelection[i].getValue("custrecord_gt_feb_rec")),
                        gap3gt: formatNumber(dataSplitSecond[2].gt - allSelection[i].getValue("custrecord_gt_mar_rec")),
                        gap4gt: formatNumber(dataSplitSecond[3].gt - allSelection[i].getValue("custrecord_gt_apr_rec")),
                        gap5gt: formatNumber(dataSplitSecond[4].gt - allSelection[i].getValue("custrecord_gt_may_rec")),
                        gap6gt: formatNumber(dataSplitSecond[5].gt - allSelection[i].getValue("custrecord_gt_jun_rec")),
                        gap7gt: formatNumber(dataSplitSecond[6].gt - allSelection[i].getValue("custrecord_gt_jul_rec")),
                        gap8gt: formatNumber(dataSplitSecond[7].gt - allSelection[i].getValue("custrecord_gt_aug_rec")),
                        gap9gt: formatNumber(dataSplitSecond[8].gt - allSelection[i].getValue("custrecord_gt_sep_rec")),
                        gap10gt: formatNumber(dataSplitSecond[9].gt - allSelection[i].getValue("custrecord_gt_oct_rec")),
                        gap11gt: formatNumber(dataSplitSecond[10].gt - allSelection[i].getValue("custrecord_gt_nov_rec")),
                        gap12gt: formatNumber(dataSplitSecond[11].gt - allSelection[i].getValue("custrecord_gt_dec_rec")),
                        perc1gt: formatNumber(getPrecenge(dataSplitSecond[0].gt, allSelection[i].getValue("custrecord_gt_jan_rec"))) + '%',
                        perc2gt: formatNumber(getPrecenge(dataSplitSecond[1].gt, allSelection[i].getValue("custrecord_gt_feb_rec"))) + '%',
                        perc3gt: formatNumber(getPrecenge(dataSplitSecond[2].gt, allSelection[i].getValue("custrecord_gt_mar_rec"))) + '%',
                        perc4gt: formatNumber(getPrecenge(dataSplitSecond[3].gt, allSelection[i].getValue("custrecord_gt_apr_rec"))) + '%',
                        perc5gt: formatNumber(getPrecenge(dataSplitSecond[4].gt, allSelection[i].getValue("custrecord_gt_may_rec"))) + '%',
                        perc6gt: formatNumber(getPrecenge(dataSplitSecond[5].gt, allSelection[i].getValue("custrecord_gt_jun_rec"))) + '%',
                        perc7gt: formatNumber(getPrecenge(dataSplitSecond[6].gt, allSelection[i].getValue("custrecord_gt_jul_rec"))) + '%',
                        perc8gt: formatNumber(getPrecenge(dataSplitSecond[7].gt, allSelection[i].getValue("custrecord_gt_aug_rec"))) + '%',
                        perc9gt: formatNumber(getPrecenge(dataSplitSecond[8].gt, allSelection[i].getValue("custrecord_gt_sep_rec"))) + '%',
                        perc10gt: formatNumber(getPrecenge(dataSplitSecond[9].gt, allSelection[i].getValue("custrecord_gt_oct_rec"))) + '%',
                        perc11gt: formatNumber(getPrecenge(dataSplitSecond[10].gt, allSelection[i].getValue("custrecord_gt_nov_rec"))) + '%',
                        perc12gt: formatNumber(getPrecenge(dataSplitSecond[11].gt, allSelection[i].getValue("custrecord_gt_dec_rec"))) + '%',
                    });
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
        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var newColumns = new Array();
        newColumns[0] = new nlobjSearchColumn('custrecord_jan_bbs');
        newColumns[1] = new nlobjSearchColumn('custrecord_feb_bbs');
        newColumns[2] = new nlobjSearchColumn('custrecord_mar_bbs');
        newColumns[3] = new nlobjSearchColumn('custrecord_apr_bbs');
        newColumns[4] = new nlobjSearchColumn('custrecord_may_bbs');
        newColumns[5] = new nlobjSearchColumn('custrecord_jun_bbs');
        newColumns[6] = new nlobjSearchColumn('custrecord_jul_bbs');
        newColumns[7] = new nlobjSearchColumn('custrecord_aug_bbs');
        newColumns[8] = new nlobjSearchColumn('custrecord_sep_bbs');
        newColumns[9] = new nlobjSearchColumn('custrecord_oct_bbs');
        newColumns[10] = new nlobjSearchColumn('custrecord_nov_bbs');
        newColumns[11] = new nlobjSearchColumn('custrecord_dec_bbs');
        newColumns[12] = new nlobjSearchColumn('custrecord_data_pf');
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_vas');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_vas');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_vas');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_vas');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_vas');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_vas');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_vas');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_vas');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_vas');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_vas');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_vas');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_vas');
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_bod');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_bod');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_bod');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_bod');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_bod');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_bod');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_bod');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_bod');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_bod');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_bod');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_bod');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_bod');
        newColumns[37] = new nlobjSearchColumn('custrecord_jan_cband');
        newColumns[38] = new nlobjSearchColumn('custrecord_feb_cband');
        newColumns[39] = new nlobjSearchColumn('custrecord_mar_cband');
        newColumns[40] = new nlobjSearchColumn('custrecord_apr_cband');
        newColumns[41] = new nlobjSearchColumn('custrecord_may_cband');
        newColumns[42] = new nlobjSearchColumn('custrecord_jun_cband');
        newColumns[43] = new nlobjSearchColumn('custrecord_jul_cband');
        newColumns[44] = new nlobjSearchColumn('custrecord_aug_cband');
        newColumns[45] = new nlobjSearchColumn('custrecord_sep_cband');
        newColumns[46] = new nlobjSearchColumn('custrecord_oct_cband');
        newColumns[47] = new nlobjSearchColumn('custrecord_nov_cband');
        newColumns[48] = new nlobjSearchColumn('custrecord_dec_cband');
        newColumns[49] = new nlobjSearchColumn('custrecord_jan_domestic');
        newColumns[50] = new nlobjSearchColumn('custrecord_feb_domestic');
        newColumns[51] = new nlobjSearchColumn('custrecord_mar_domestic');
        newColumns[52] = new nlobjSearchColumn('custrecord_apr_domestic');
        newColumns[53] = new nlobjSearchColumn('custrecord_may_domestic');
        newColumns[54] = new nlobjSearchColumn('custrecord_jun_domestic');
        newColumns[55] = new nlobjSearchColumn('custrecord_jul_domestic');
        newColumns[56] = new nlobjSearchColumn('custrecord_aug_domestic');
        newColumns[57] = new nlobjSearchColumn('custrecord_sep_domestic');
        newColumns[58] = new nlobjSearchColumn('custrecord_oct_domestic');
        newColumns[59] = new nlobjSearchColumn('custrecord_nov_domestic');
        newColumns[60] = new nlobjSearchColumn('custrecord_dec_domestic');
        newColumns[61] = new nlobjSearchColumn('custrecord_jan_ip');
        newColumns[62] = new nlobjSearchColumn('custrecord_feb_ip');
        newColumns[63] = new nlobjSearchColumn('custrecord_mar_ip');
        newColumns[64] = new nlobjSearchColumn('custrecord_apr_ip');
        newColumns[65] = new nlobjSearchColumn('custrecord_may_ip');
        newColumns[66] = new nlobjSearchColumn('custrecord_jun_ip');
        newColumns[67] = new nlobjSearchColumn('custrecord_jul_ip');
        newColumns[68] = new nlobjSearchColumn('custrecord_aug_ip');
        newColumns[69] = new nlobjSearchColumn('custrecord_sep_ip');
        newColumns[70] = new nlobjSearchColumn('custrecord_oct_ip');
        newColumns[71] = new nlobjSearchColumn('custrecord_nov_ip');
        newColumns[72] = new nlobjSearchColumn('custrecord_dec_ip');
        newColumns[73] = new nlobjSearchColumn('custrecord_jan_iru');
        newColumns[74] = new nlobjSearchColumn('custrecord_feb_iru');
        newColumns[75] = new nlobjSearchColumn('custrecord_mar_iru');
        newColumns[76] = new nlobjSearchColumn('custrecord_apr_iru');
        newColumns[77] = new nlobjSearchColumn('custrecord_may_iru');
        newColumns[78] = new nlobjSearchColumn('custrecord_jun_iru');
        newColumns[79] = new nlobjSearchColumn('custrecord_jul_iru');
        newColumns[80] = new nlobjSearchColumn('custrecord_aug_iru');
        newColumns[81] = new nlobjSearchColumn('custrecord_sep_iru');
        newColumns[82] = new nlobjSearchColumn('custrecord_oct_iru');
        newColumns[83] = new nlobjSearchColumn('custrecord_nov_iru');
        newColumns[84] = new nlobjSearchColumn('custrecord_dec_iru');
        newColumns[85] = new nlobjSearchColumn('custrecord_jan_kuband');
        newColumns[86] = new nlobjSearchColumn('custrecord_feb_kuband');
        newColumns[87] = new nlobjSearchColumn('custrecord_mar_kuband');
        newColumns[88] = new nlobjSearchColumn('custrecord_apr_kuband');
        newColumns[89] = new nlobjSearchColumn('custrecord_may_kuband');
        newColumns[90] = new nlobjSearchColumn('custrecord_jun_kuband');
        newColumns[91] = new nlobjSearchColumn('custrecord_jul_kuband');
        newColumns[92] = new nlobjSearchColumn('custrecord_aug_kuband');
        newColumns[93] = new nlobjSearchColumn('custrecord_sep_kuband');
        newColumns[94] = new nlobjSearchColumn('custrecord_oct_kuband');
        newColumns[95] = new nlobjSearchColumn('custrecord_nov_kuband');
        newColumns[96] = new nlobjSearchColumn('custrecord_dec_kuband');
        newColumns[97] = new nlobjSearchColumn('custrecord_jan_mobile_vsat');
        newColumns[98] = new nlobjSearchColumn('custrecord_feb_mobile_vsat');
        newColumns[99] = new nlobjSearchColumn('custrecord_mar_mobile_vsat');
        newColumns[100] = new nlobjSearchColumn('custrecord_apr_mobile_vsat');
        newColumns[101] = new nlobjSearchColumn('custrecord_may_mobile_vsat');
        newColumns[102] = new nlobjSearchColumn('custrecord_jun_mobile_vsat');
        newColumns[103] = new nlobjSearchColumn('custrecord_jul_mobile_vsat');
        newColumns[104] = new nlobjSearchColumn('custrecord_aug_mobile_vsat');
        newColumns[105] = new nlobjSearchColumn('custrecord_sep_mobile_vsat');
        newColumns[106] = new nlobjSearchColumn('custrecord_oct_mobile_vsat');
        newColumns[107] = new nlobjSearchColumn('custrecord_nov_mobile_vsat');
        newColumns[108] = new nlobjSearchColumn('custrecord_dec_mobile_vsat');
        newColumns[109] = new nlobjSearchColumn('custrecord_jan_mpip');
        newColumns[110] = new nlobjSearchColumn('custrecord_feb_mpip');
        newColumns[111] = new nlobjSearchColumn('custrecord_mar_mpip');
        newColumns[112] = new nlobjSearchColumn('custrecord_apr_mpip');
        newColumns[113] = new nlobjSearchColumn('custrecord_may_mpip');
        newColumns[114] = new nlobjSearchColumn('custrecord_jun_mpip');
        newColumns[115] = new nlobjSearchColumn('custrecord_jul_mpip');
        newColumns[116] = new nlobjSearchColumn('custrecord_aug_mpip');
        newColumns[117] = new nlobjSearchColumn('custrecord_sep_mpip');
        newColumns[118] = new nlobjSearchColumn('custrecord_oct_mpip');
        newColumns[119] = new nlobjSearchColumn('custrecord_nov_mpip');
        newColumns[120] = new nlobjSearchColumn('custrecord_dec_mpip');
        newColumns[121] = new nlobjSearchColumn('custrecord_jan_o3b');
        newColumns[122] = new nlobjSearchColumn('custrecord_feb_o3b');
        newColumns[123] = new nlobjSearchColumn('custrecord_mar_o3b');
        newColumns[124] = new nlobjSearchColumn('custrecord_apr_o3b');
        newColumns[125] = new nlobjSearchColumn('custrecord_may_o3b');
        newColumns[126] = new nlobjSearchColumn('custrecord_jun_o3b');
        newColumns[127] = new nlobjSearchColumn('custrecord_jul_o3b');
        newColumns[128] = new nlobjSearchColumn('custrecord_aug_o3b');
        newColumns[129] = new nlobjSearchColumn('custrecord_sep_o3b');
        newColumns[130] = new nlobjSearchColumn('custrecord_oct_o3b');
        newColumns[131] = new nlobjSearchColumn('custrecord_nov_o3b');
        newColumns[132] = new nlobjSearchColumn('custrecord_dec_o3b');
        newColumns[133] = new nlobjSearchColumn('custrecord_jan_ps');
        newColumns[134] = new nlobjSearchColumn('custrecord_feb_ps');
        newColumns[135] = new nlobjSearchColumn('custrecord_mar_ps');
        newColumns[136] = new nlobjSearchColumn('custrecord_apr_ps');
        newColumns[137] = new nlobjSearchColumn('custrecord_may_ps');
        newColumns[138] = new nlobjSearchColumn('custrecord_jun_ps');
        newColumns[139] = new nlobjSearchColumn('custrecord_jul_ps');
        newColumns[140] = new nlobjSearchColumn('custrecord_aug_ps');
        newColumns[141] = new nlobjSearchColumn('custrecord_sep_ps');
        newColumns[142] = new nlobjSearchColumn('custrecord_oct_ps');
        newColumns[143] = new nlobjSearchColumn('custrecord_nov_ps');
        newColumns[144] = new nlobjSearchColumn('custrecord_dec_ps');
        newColumns[145] = new nlobjSearchColumn('custrecord_jan_sr');
        newColumns[146] = new nlobjSearchColumn('custrecord_feb_sr');
        newColumns[147] = new nlobjSearchColumn('custrecord_mar_sr');
        newColumns[148] = new nlobjSearchColumn('custrecord_apr_sr');
        newColumns[149] = new nlobjSearchColumn('custrecord_may_sr');
        newColumns[150] = new nlobjSearchColumn('custrecord_jun_sr');
        newColumns[151] = new nlobjSearchColumn('custrecord_jul_sr');
        newColumns[152] = new nlobjSearchColumn('custrecord_aug_sr');
        newColumns[153] = new nlobjSearchColumn('custrecord_sep_sr');
        newColumns[154] = new nlobjSearchColumn('custrecord_oct_sr');
        newColumns[155] = new nlobjSearchColumn('custrecord_nov_sr');
        newColumns[156] = new nlobjSearchColumn('custrecord_dec_sr');
        newColumns[157] = new nlobjSearchColumn('custrecord_gt_jan_hw');
        newColumns[158] = new nlobjSearchColumn('custrecord_gt_feb_hw');
        newColumns[159] = new nlobjSearchColumn('custrecord_gt_mar_hw');
        newColumns[160] = new nlobjSearchColumn('custrecord_gt_apr_hw');
        newColumns[161] = new nlobjSearchColumn('custrecord_gt_may_hw');
        newColumns[162] = new nlobjSearchColumn('custrecord_gt_jun_hw');
        newColumns[163] = new nlobjSearchColumn('custrecord_gt_jul_hw');
        newColumns[164] = new nlobjSearchColumn('custrecord_gt_aug_hw');
        newColumns[165] = new nlobjSearchColumn('custrecord_gt_sep_hw');
        newColumns[166] = new nlobjSearchColumn('custrecord_gt_oct_hw');
        newColumns[167] = new nlobjSearchColumn('custrecord_gt_nov_hw');
        newColumns[168] = new nlobjSearchColumn('custrecord_gt_dec_hw');
        newColumns[169] = new nlobjSearchColumn('custrecord_jan_dhls_hw');
        newColumns[170] = new nlobjSearchColumn('custrecord_feb_dhls_hw');
        newColumns[171] = new nlobjSearchColumn('custrecord_mar_dhls_hw');
        newColumns[172] = new nlobjSearchColumn('custrecord_apr_dhls_hw');
        newColumns[173] = new nlobjSearchColumn('custrecord_may_dhls_hw');
        newColumns[174] = new nlobjSearchColumn('custrecord_jun_dhls_hw');
        newColumns[175] = new nlobjSearchColumn('custrecord_jul_dhls_hw');
        newColumns[176] = new nlobjSearchColumn('custrecord_aug_dhls_hw');
        newColumns[177] = new nlobjSearchColumn('custrecord_sep_dhls_hw');
        newColumns[178] = new nlobjSearchColumn('custrecord_oct_dhls_hw');
        newColumns[179] = new nlobjSearchColumn('custrecord_nov_dhls_hw');
        newColumns[180] = new nlobjSearchColumn('custrecord_dec_dhls_hw');
        //D&HLS Service
        newColumns[181] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[182] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[183] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[184] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[185] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[186] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[187] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[188] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[189] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[190] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[191] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[192] = new nlobjSearchColumn('custrecord_gt_dec_rec');
        search.addColumns(newColumns);
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
                var data = allSelection[i].getValue("custrecord_data_pf")
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var quoarterly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs;
                var quoarterly2bbs = dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var quoarterly3bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs;
                var quoarterly4bbs = dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var quoarterlybbs = quoarterly1bbs + quoarterly2bbs + quoarterly3bbs + quoarterly4bbs;
                var target1bbs = Number(allSelection[i].getValue("custrecord_jan_bbs")) + Number(allSelection[i].getValue("custrecord_feb_bbs")) + Number(allSelection[i].getValue("custrecord_mar_bbs"));
                var target2bbs = Number(allSelection[i].getValue("custrecord_apr_bbs")) + Number(allSelection[i].getValue("custrecord_may_bbs")) + Number(allSelection[i].getValue("custrecord_jun_bbs"));
                var target3bbs = Number(allSelection[i].getValue("custrecord_jul_bbs")) + Number(allSelection[i].getValue("custrecord_aug_bbs")) + Number(allSelection[i].getValue("custrecord_sep_bbs"));
                var target4bbs = Number(allSelection[i].getValue("custrecord_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nov_bbs")) + Number(allSelection[i].getValue("custrecord_dec_bbs"));
                var targetbbs = target1bbs + target2bbs + target3bbs + target4bbs;
                var quoarterly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas;
                var quoarterly2vas = dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var quoarterly3vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas;
                var quoarterly4vas = dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var quoarterlyvas = quoarterly1vas + quoarterly2vas + quoarterly3vas + quoarterly4vas;
                var target1vas = Number(allSelection[i].getValue("custrecord_jan_vas")) + Number(allSelection[i].getValue("custrecord_feb_vas")) + Number(allSelection[i].getValue("custrecord_mar_vas"));
                var target2vas = Number(allSelection[i].getValue("custrecord_apr_vas")) + Number(allSelection[i].getValue("custrecord_may_vas")) + Number(allSelection[i].getValue("custrecord_jun_vas"));
                var target3vas = Number(allSelection[i].getValue("custrecord_jul_vas")) + Number(allSelection[i].getValue("custrecord_aug_vas")) + Number(allSelection[i].getValue("custrecord_sep_vas"));
                var target4vas = Number(allSelection[i].getValue("custrecord_oct_vas")) + Number(allSelection[i].getValue("custrecord_nov_vas")) + Number(allSelection[i].getValue("custrecord_dec_vas"));
                var targetvas = target1vas + target2vas + target3vas + target4vas;
                var quoarterly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod;
                var quoarterly2bod = dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;
                var quoarterly3bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod;
                var quoarterly4bod = dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var quoarterlybod = quoarterly1bod + quoarterly2bod + quoarterly3bod + quoarterly4bod;
                var target1bod = Number(allSelection[i].getValue("custrecord_jan_bod")) + Number(allSelection[i].getValue("custrecord_feb_bod")) + Number(allSelection[i].getValue("custrecord_mar_bod"));
                var target2bod = Number(allSelection[i].getValue("custrecord_apr_bod")) + Number(allSelection[i].getValue("custrecord_may_bod")) + Number(allSelection[i].getValue("custrecord_jun_bod"));
                var target3bod = Number(allSelection[i].getValue("custrecord_jul_bod")) + Number(allSelection[i].getValue("custrecord_aug_bod")) + Number(allSelection[i].getValue("custrecord_sep_bod"));
                var target4bod = Number(allSelection[i].getValue("custrecord_oct_bod")) + Number(allSelection[i].getValue("custrecord_nov_bod")) + Number(allSelection[i].getValue("custrecord_dec_bod"));
                var targetbod = target1bod + target2bod + target3bod + target4bod;
                var quoarterly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband;
                var quoarterly2cband = dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var quoarterly3cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband;
                var quoarterly4cband = dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var quoarterlycband = quoarterly1cband + quoarterly2cband + quoarterly3cband + quoarterly4cband;
                var target1cband = Number(allSelection[i].getValue("custrecord_jan_cband")) + Number(allSelection[i].getValue("custrecord_feb_cband")) + Number(allSelection[i].getValue("custrecord_mar_cband"));
                var target2cband = Number(allSelection[i].getValue("custrecord_apr_cband")) + Number(allSelection[i].getValue("custrecord_may_cband")) + Number(allSelection[i].getValue("custrecord_jun_cband"));
                var target3cband = Number(allSelection[i].getValue("custrecord_jul_cband")) + Number(allSelection[i].getValue("custrecord_aug_cband")) + Number(allSelection[i].getValue("custrecord_sep_cband"));
                var target4cband = Number(allSelection[i].getValue("custrecord_oct_cband")) + Number(allSelection[i].getValue("custrecord_nov_cband")) + Number(allSelection[i].getValue("custrecord_dec_cband"));
                var targetcband = target1cband + target2cband + target3cband + target4cband;
                var quoarterly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic;
                var quoarterly2domestic = dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var quoarterly3domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic;
                var quoarterly4domestic = dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var quoarterlydomestic = quoarterly1domestic + quoarterly2domestic + quoarterly3domestic + quoarterly4domestic;
                var target1domestic = Number(allSelection[i].getValue("custrecord_jan_domestic")) + Number(allSelection[i].getValue("custrecord_feb_domestic")) + Number(allSelection[i].getValue("custrecord_mar_domestic"));
                var target2domestic = Number(allSelection[i].getValue("custrecord_apr_domestic")) + Number(allSelection[i].getValue("custrecord_may_domestic")) + Number(allSelection[i].getValue("custrecord_jun_domestic"));
                var target3domestic = Number(allSelection[i].getValue("custrecord_jul_domestic")) + Number(allSelection[i].getValue("custrecord_aug_domestic")) + Number(allSelection[i].getValue("custrecord_sep_domestic"));
                var target4domestic = Number(allSelection[i].getValue("custrecord_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nov_domestic")) + Number(allSelection[i].getValue("custrecord_dec_domestic"));
                var targetdomestic = target1domestic + target2domestic + target3domestic + target4domestic;
                var quoarterly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip;
                var quoarterly2ip = dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var quoarterly3ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip;
                var quoarterly4ip = dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var quoarterlyip = quoarterly1ip + quoarterly2ip + quoarterly3ip + quoarterly4ip;
                var target1ip = Number(allSelection[i].getValue("custrecord_jan_ip")) + Number(allSelection[i].getValue("custrecord_feb_ip")) + Number(allSelection[i].getValue("custrecord_mar_ip"));
                var target2ip = Number(allSelection[i].getValue("custrecord_apr_ip")) + Number(allSelection[i].getValue("custrecord_may_ip")) + Number(allSelection[i].getValue("custrecord_jun_ip"));
                var target3ip = Number(allSelection[i].getValue("custrecord_jul_ip")) + Number(allSelection[i].getValue("custrecord_aug_ip")) + Number(allSelection[i].getValue("custrecord_sep_ip"));
                var target4ip = Number(allSelection[i].getValue("custrecord_oct_ip")) + Number(allSelection[i].getValue("custrecord_nov_ip")) + Number(allSelection[i].getValue("custrecord_dec_ip"));
                var targetip = target1ip + target2ip + target3ip + target4ip;
                var quoarterly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru;
                var quoarterly2iru = dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var quoarterly3iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru;
                var quoarterly4iru = dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var quoarterlyiru = quoarterly1iru + quoarterly2iru + quoarterly3iru + quoarterly4iru;
                var target1iru = Number(allSelection[i].getValue("custrecord_jan_iru")) + Number(allSelection[i].getValue("custrecord_feb_iru")) + Number(allSelection[i].getValue("custrecord_mar_iru"));
                var target2iru = Number(allSelection[i].getValue("custrecord_apr_iru")) + Number(allSelection[i].getValue("custrecord_may_iru")) + Number(allSelection[i].getValue("custrecord_jun_iru"));
                var target3iru = Number(allSelection[i].getValue("custrecord_jul_iru")) + Number(allSelection[i].getValue("custrecord_aug_iru")) + Number(allSelection[i].getValue("custrecord_sep_iru"));
                var target4iru = Number(allSelection[i].getValue("custrecord_oct_iru")) + Number(allSelection[i].getValue("custrecord_nov_iru")) + Number(allSelection[i].getValue("custrecord_dec_iru"));
                var targetiru = target1iru + target2iru + target3iru + target4iru;
                var quoarterly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband;
                var quoarterly2kuband = dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var quoarterly3kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband;
                var quoarterly4kuband = dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var quoarterlykuband = quoarterly1kuband + quoarterly2kuband + quoarterly3kuband + quoarterly4kuband;
                var target1kuband = Number(allSelection[i].getValue("custrecord_jan_kuband")) + Number(allSelection[i].getValue("custrecord_feb_kuband")) + Number(allSelection[i].getValue("custrecord_mar_kuband"));
                var target2kuband = Number(allSelection[i].getValue("custrecord_apr_kuband")) + Number(allSelection[i].getValue("custrecord_may_kuband")) + Number(allSelection[i].getValue("custrecord_jun_kuband"));
                var target3kuband = Number(allSelection[i].getValue("custrecord_jul_kuband")) + Number(allSelection[i].getValue("custrecord_aug_kuband")) + Number(allSelection[i].getValue("custrecord_sep_kuband"));
                var target4kuband = Number(allSelection[i].getValue("custrecord_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nov_kuband")) + Number(allSelection[i].getValue("custrecord_dec_kuband"));
                var targetkuband = target1kuband + target2kuband + target3kuband + target4kuband;
                var quoarterly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat;
                var quoarterly2mobile_vsat = dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var quoarterly3mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat;
                var quoarterly4mobile_vsat = dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var quoarterlymobile_vsat = quoarterly1mobile_vsat + quoarterly2mobile_vsat + quoarterly3mobile_vsat + quoarterly4mobile_vsat
                var target1mobile_vsat = Number(allSelection[i].getValue("custrecord_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_mar_mobile_vsat"));
                var target2mobile_vsat = Number(allSelection[i].getValue("custrecord_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_jun_mobile_vsat"));
                var target3mobile_vsat = Number(allSelection[i].getValue("custrecord_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_sep_mobile_vsat"));
                var target4mobile_vsat = Number(allSelection[i].getValue("custrecord_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_dec_mobile_vsat"));
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat + target3mobile_vsat + target4mobile_vsat
                var quoarterly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip;
                var quoarterly2mpip = dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var quoarterly3mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip;
                var quoarterly4mpip = dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var quoarterlympip = quoarterly1mpip + quoarterly2mpip + quoarterly3mpip + quoarterly4mpip;
                var target1mpip = Number(allSelection[i].getValue("custrecord_jan_mpip")) + Number(allSelection[i].getValue("custrecord_feb_mpip")) + Number(allSelection[i].getValue("custrecord_mar_mpip"));
                var target2mpip = Number(allSelection[i].getValue("custrecord_apr_mpip")) + Number(allSelection[i].getValue("custrecord_may_mpip")) + Number(allSelection[i].getValue("custrecord_jun_mpip"));
                var target3mpip = Number(allSelection[i].getValue("custrecord_jul_mpip")) + Number(allSelection[i].getValue("custrecord_aug_mpip")) + Number(allSelection[i].getValue("custrecord_sep_mpip"));
                var target4mpip = Number(allSelection[i].getValue("custrecord_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nov_mpip")) + Number(allSelection[i].getValue("custrecord_dec_mpip"));
                var targetmpip = target1mpip + target2mpip + target3mpip + target4mpip
                var quoarterly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b;
                var quoarterly2o3b = dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var quoarterly3o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b;
                var quoarterly4o3b = dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var quoarterlyo3b = quoarterly1o3b + quoarterly2o3b + quoarterly3o3b + quoarterly4o3b
                var target1o3b = Number(allSelection[i].getValue("custrecord_jan_o3b")) + Number(allSelection[i].getValue("custrecord_feb_o3b")) + Number(allSelection[i].getValue("custrecord_mar_o3b"));
                var target2o3b = Number(allSelection[i].getValue("custrecord_apr_o3b")) + Number(allSelection[i].getValue("custrecord_may_o3b")) + Number(allSelection[i].getValue("custrecord_jun_o3b"));
                var target3o3b = Number(allSelection[i].getValue("custrecord_jul_o3b")) + Number(allSelection[i].getValue("custrecord_aug_o3b")) + Number(allSelection[i].getValue("custrecord_sep_o3b"));
                var target4o3b = Number(allSelection[i].getValue("custrecord_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nov_o3b")) + Number(allSelection[i].getValue("custrecord_dec_o3b"));
                var targeto3b = target1o3b + target2o3b + target3o3b + target4o3b;
                var quoarterly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps;
                var quoarterly2ps = dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var quoarterly3ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps;
                var quoarterly4ps = dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var quoarterlyps = quoarterly1ps + quoarterly2ps + quoarterly3ps + quoarterly4ps
                var target1ps = Number(allSelection[i].getValue("custrecord_jan_ps")) + Number(allSelection[i].getValue("custrecord_feb_ps")) + Number(allSelection[i].getValue("custrecord_mar_ps"));
                var target2ps = Number(allSelection[i].getValue("custrecord_apr_ps")) + Number(allSelection[i].getValue("custrecord_may_ps")) + Number(allSelection[i].getValue("custrecord_jun_ps"));
                var target3ps = Number(allSelection[i].getValue("custrecord_jul_ps")) + Number(allSelection[i].getValue("custrecord_aug_ps")) + Number(allSelection[i].getValue("custrecord_sep_ps"));
                var target4ps = Number(allSelection[i].getValue("custrecord_oct_ps")) + Number(allSelection[i].getValue("custrecord_nov_ps")) + Number(allSelection[i].getValue("custrecord_dec_ps"));
                var targetps = target1ps + target2ps + target3ps + target4ps;
                var quoarterly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr;
                var quoarterly2sr = dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var quoarterly3sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr;
                var quoarterly4sr = dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var quoarterlysr = quoarterly1sr + quoarterly2sr + quoarterly3sr + quoarterly4sr
                var target1sr = Number(allSelection[i].getValue("custrecord_jan_sr")) + Number(allSelection[i].getValue("custrecord_feb_sr")) + Number(allSelection[i].getValue("custrecord_mar_sr"));
                var target2sr = Number(allSelection[i].getValue("custrecord_apr_sr")) + Number(allSelection[i].getValue("custrecord_may_sr")) + Number(allSelection[i].getValue("custrecord_jun_sr"));
                var target3sr = Number(allSelection[i].getValue("custrecord_jul_sr")) + Number(allSelection[i].getValue("custrecord_aug_sr")) + Number(allSelection[i].getValue("custrecord_sep_sr"));
                var target4sr = Number(allSelection[i].getValue("custrecord_oct_sr")) + Number(allSelection[i].getValue("custrecord_nov_sr")) + Number(allSelection[i].getValue("custrecord_dec_sr"));
                var targetsr = target1sr + target2sr + target3sr + target4sr;
                var quoarterly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw;
                var quoarterly2hw = dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var quoarterly3hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw;
                var quoarterly4hw = dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var quoarterlyhw = quoarterly1hw + quoarterly2hw + quoarterly3hw + quoarterly4hw;
                var target1hw = Number(allSelection[i].getValue("custrecord_gt_jan_hw")) + Number(allSelection[i].getValue("custrecord_gt_feb_hw")) + Number(allSelection[i].getValue("custrecord_gt_mar_hw"));
                var target2hw = Number(allSelection[i].getValue("custrecord_gt_apr_hw")) + Number(allSelection[i].getValue("custrecord_gt_may_hw")) + Number(allSelection[i].getValue("custrecord_gt_jun_hw"));
                var target3hw = Number(allSelection[i].getValue("custrecord_gt_jul_hw")) + Number(allSelection[i].getValue("custrecord_gt_aug_hw")) + Number(allSelection[i].getValue("custrecord_gt_sep_hw"));
                var target4hw = Number(allSelection[i].getValue("custrecord_gt_oct_hw")) + Number(allSelection[i].getValue("custrecord_gt_nov_hw")) + Number(allSelection[i].getValue("custrecord_gt_dec_hw"));
                var targethw = target1hw + target2hw + target3hw + target4hw;
                var quoarterly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw;
                var quoarterly2dhls_hw = dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var quoarterly3dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw;
                var quoarterly4dhls_hw = dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var quoarterlydhls_hw = quoarterly1dhls_hw + quoarterly2dhls_hw + quoarterly3dhls_hw + quoarterly4dhls_hw;
                var target1dhls_hw = Number(allSelection[i].getValue("custrecord_jan_dhls_hw")) + Number(allSelection[i].getValue("custrecord_feb_dhls_hw")) + Number(allSelection[i].getValue("custrecord_mar_dhls_hw"));
                var target2dhls_hw = Number(allSelection[i].getValue("custrecord_apr_dhls_hw")) + Number(allSelection[i].getValue("custrecord_may_dhls_hw")) + Number(allSelection[i].getValue("custrecord_jun_dhls_hw"));
                var target3dhls_hw = Number(allSelection[i].getValue("custrecord_jul_dhls_hw")) + Number(allSelection[i].getValue("custrecord_aug_dhls_hw")) + Number(allSelection[i].getValue("custrecord_sep_dhls_hw"));
                var target4dhls_hw = Number(allSelection[i].getValue("custrecord_oct_dhls_hw")) + Number(allSelection[i].getValue("custrecord_nov_dhls_hw")) + Number(allSelection[i].getValue("custrecord_dec_dhls_hw"));
                var targetdhls_hw = target1dhls_hw + target2dhls_hw + target3dhls_hw + target4dhls_hw;
                var quoarterly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt;
                var quoarterly2gt = dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var quoarterly3gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt;
                var quoarterly4gt = dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var quoarterlygt = quoarterly1gt + quoarterly2gt + quoarterly3gt + quoarterly4gt;
                var target1gt = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec"));
                var target2gt = Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec"));
                var target3gt = Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec"));
                var target4gt = Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"));
                var targetgt = target1gt + target2gt + target3gt + target4gt;              
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                    quoarterly1bbs: formatNumber(quoarterly1bbs),
                    quoarterly2bbs: formatNumber(quoarterly2bbs),
                    quoarterly3bbs: formatNumber(quoarterly3bbs),
                    quoarterly4bbs: formatNumber(quoarterly4bbs),
                    quoarterlybbs: formatNumber(quoarterlybbs),
                    target1bbs: formatNumber(target1bbs),
                    target2bbs: formatNumber(target2bbs),
                    target3bbs: formatNumber(target3bbs),
                    target4bbs: formatNumber(target4bbs),
                    targetbbs: formatNumber(targetbbs),
                    gap1bbs: formatNumber(quoarterly1bbs - target1bbs),
                    gap2bbs: formatNumber(quoarterly2bbs - target2bbs),
                    gap3bbs: formatNumber(quoarterly3bbs - target3bbs),
                    gap4bbs: formatNumber(quoarterly4bbs - target4bbs),
                    gapbbs: formatNumber(quoarterlybbs - targetbbs),
                    perc1bbs: formatNumber(getPrecenge(quoarterly1bbs, target1bbs)) + '%',
                    perc2bbs: formatNumber(getPrecenge(quoarterly2bbs, target2bbs)) + '%',
                    perc3bbs: formatNumber(getPrecenge(quoarterly3bbs, target3bbs)) + '%',
                    perc4bbs: formatNumber(getPrecenge(quoarterly4bbs, target4bbs)) + '%',
                    percbbs: formatNumber(getPrecenge(quoarterlybbs, targetbbs)) + '%',
                    quoarterly1vas: formatNumber(quoarterly1vas),
                    quoarterly2vas: formatNumber(quoarterly2vas),
                    quoarterly3vas: formatNumber(quoarterly3vas),
                    quoarterly4vas: formatNumber(quoarterly4vas),
                    quoarterlyvas: formatNumber(quoarterlyvas),
                    target1vas: formatNumber(target1vas),
                    target2vas: formatNumber(target2vas),
                    target3vas: formatNumber(target3vas),
                    target4vas: formatNumber(target4vas),
                    targetvas: formatNumber(targetvas),
                    gap1vas: formatNumber(quoarterly1vas - target1vas),
                    gap2vas: formatNumber(quoarterly2vas - target2vas),
                    gap3vas: formatNumber(quoarterly3vas - target3vas),
                    gap4vas: formatNumber(quoarterly4vas - target4vas),
                    gapvas: formatNumber(quoarterly4vas - targetvas),
                    perc1vas: formatNumber(getPrecenge(quoarterly1vas, target1vas)) + '%',
                    perc2vas: formatNumber(getPrecenge(quoarterly2vas, target2vas)) + '%',
                    perc3vas: formatNumber(getPrecenge(quoarterly3vas, target3vas)) + '%',
                    perc4vas: formatNumber(getPrecenge(quoarterly4vas, target4vas)) + '%',
                    percvas: formatNumber(getPrecenge(quoarterlyvas, targetvas)) + '%',
                    quoarterly1bod: formatNumber(quoarterly1bod),
                    quoarterly2bod: formatNumber(quoarterly2bod),
                    quoarterly3bod: formatNumber(quoarterly3bod),
                    quoarterly4bod: formatNumber(quoarterly4bod),
                    quoarterlybod: formatNumber(quoarterlybod),
                    target1bod: formatNumber(target1bod),
                    target2bod: formatNumber(target2bod),
                    target3bod: formatNumber(target3bod),
                    target4bod: formatNumber(target4bod),
                    targetbod: formatNumber(targetbod),
                    gap1bod: formatNumber(quoarterly1bod - target1bod),
                    gap2bod: formatNumber(quoarterly2bod - target2bod),
                    gap3bod: formatNumber(quoarterly3bod - target3bod),
                    gap4bod: formatNumber(quoarterly4bod - target4bod),
                    gapbod: formatNumber(quoarterlybod - targetbod),
                    perc1bod: formatNumber(getPrecenge(quoarterly1bod, target1bod)) + '%',
                    perc2bod: formatNumber(getPrecenge(quoarterly2bod, target2bod)) + '%',
                    perc3bod: formatNumber(getPrecenge(quoarterly3bod, target3bod)) + '%',
                    perc4bod: formatNumber(getPrecenge(quoarterly4bod, target4bod)) + '%',
                    percbod: formatNumber(getPrecenge(quoarterlybod, targetbod)) + '%',
                    quoarterly1cband: formatNumber(quoarterly1cband),
                    quoarterly2cband: formatNumber(quoarterly2cband),
                    quoarterly3cband: formatNumber(quoarterly3cband),
                    quoarterly4cband: formatNumber(quoarterly4cband),
                    quoarterlycband: formatNumber(quoarterlycband),
                    target1cband: formatNumber(target1cband),
                    target2cband: formatNumber(target2cband),
                    target3cband: formatNumber(target3cband),
                    target4cband: formatNumber(target4cband),
                    targetcband: formatNumber(targetcband),
                    gap1cband: formatNumber(quoarterly1cband - target1cband),
                    gap2cband: formatNumber(quoarterly2cband - target2cband),
                    gap3cband: formatNumber(quoarterly3cband - target3cband),
                    gap4cband: formatNumber(quoarterly4cband - target4cband),
                    gapcband: formatNumber(quoarterlycband - targetcband),
                    perc1cband: formatNumber(getPrecenge(quoarterly1cband, target1cband)) + '%',
                    perc2cband: formatNumber(getPrecenge(quoarterly2cband, target2cband)) + '%',
                    perc3cband: formatNumber(getPrecenge(quoarterly3cband, target3cband)) + '%',
                    perc4cband: formatNumber(getPrecenge(quoarterly4cband, target4cband)) + '%',
                    perccband: formatNumber(getPrecenge(quoarterlycband, targetcband)) + '%',
                    quoarterly1domestic: formatNumber(quoarterly1domestic),
                    quoarterly2domestic: formatNumber(quoarterly2domestic),
                    quoarterly3domestic: formatNumber(quoarterly3domestic),
                    quoarterly4domestic: formatNumber(quoarterly4domestic),
                    quoarterlydomestic: formatNumber(quoarterlydomestic),
                    target1domestic: formatNumber(target1domestic),
                    target2domestic: formatNumber(target2domestic),
                    target3domestic: formatNumber(target3domestic),
                    target4domestic: formatNumber(target4domestic),
                    targetdomestic: formatNumber(targetdomestic),
                    gap1domestic: formatNumber(quoarterly1domestic - target1domestic),
                    gap2domestic: formatNumber(quoarterly2domestic - target2domestic),
                    gap3domestic: formatNumber(quoarterly3domestic - target3domestic),
                    gap4domestic: formatNumber(quoarterly4domestic - target4domestic),
                    gapdomestic: formatNumber(quoarterlydomestic - targetdomestic),
                    perc1domestic: formatNumber(getPrecenge(quoarterly1domestic, target1domestic)) + '%',
                    perc2domestic: formatNumber(getPrecenge(quoarterly2domestic, target2domestic)) + '%',
                    perc3domestic: formatNumber(getPrecenge(quoarterly3domestic, target3domestic)) + '%',
                    perc4domestic: formatNumber(getPrecenge(quoarterly4domestic, target4domestic)) + '%',
                    percdomestic: formatNumber(getPrecenge(quoarterlydomestic, targetdomestic)) + '%',
                    quoarterly1ip: formatNumber(quoarterly1ip),
                    quoarterly2ip: formatNumber(quoarterly2ip),
                    quoarterly3ip: formatNumber(quoarterly3ip),
                    quoarterly4ip: formatNumber(quoarterly4ip),
                    quoarterlyip: formatNumber(quoarterlyip),
                    target1ip: formatNumber(target1ip),
                    target2ip: formatNumber(target2ip),
                    target3ip: formatNumber(target3ip),
                    target4ip: formatNumber(target4ip),
                    targetip: formatNumber(targetip),
                    gap1ip: formatNumber(quoarterly1ip - target1ip),
                    gap2ip: formatNumber(quoarterly2ip - target2ip),
                    gap3ip: formatNumber(quoarterly3ip - target3ip),
                    gap4ip: formatNumber(quoarterly4ip - target4ip),
                    gapip: formatNumber(quoarterlyip - targetip),
                    perc1ip: formatNumber(getPrecenge(quoarterly1ip, target1ip)) + '%',
                    perc2ip: formatNumber(getPrecenge(quoarterly2ip, target2ip)) + '%',
                    perc3ip: formatNumber(getPrecenge(quoarterly3ip, target3ip)) + '%',
                    perc4ip: formatNumber(getPrecenge(quoarterly4ip, target4ip)) + '%',
                    percip: formatNumber(getPrecenge(quoarterlyip, targetip)) + '%',
                    quoarterly1iru: formatNumber(quoarterly1iru),
                    quoarterly2iru: formatNumber(quoarterly2iru),
                    quoarterly3iru: formatNumber(quoarterly3iru),
                    quoarterly4iru: formatNumber(quoarterly4iru),
                    quoarterlyiru: formatNumber(quoarterlyiru),
                    target1iru: formatNumber(target1iru),
                    target2iru: formatNumber(target2iru),
                    target3iru: formatNumber(target3iru),
                    target4iru: formatNumber(target4iru),
                    targetiru: formatNumber(targetiru),
                    gap1iru: formatNumber(quoarterly1iru - target1iru),
                    gap2iru: formatNumber(quoarterly2iru - target2iru),
                    gap3iru: formatNumber(quoarterly3iru - target3iru),
                    gap4iru: formatNumber(quoarterly4iru - target4iru),
                    gapiru: formatNumber(quoarterlyiru - targetiru),
                    perc1iru: formatNumber(getPrecenge(quoarterly1iru, target1iru)) + '%',
                    perc2iru: formatNumber(getPrecenge(quoarterly2iru, target2iru)) + '%',
                    perc3iru: formatNumber(getPrecenge(quoarterly3iru, target3iru)) + '%',
                    perc4iru: formatNumber(getPrecenge(quoarterly4iru, target4iru)) + '%',
                    perciru: formatNumber(getPrecenge(quoarterlyiru, targetiru)) + '%',
                    quoarterly1kuband: formatNumber(quoarterly1kuband),
                    quoarterly2kuband: formatNumber(quoarterly2kuband),
                    quoarterly3kuband: formatNumber(quoarterly3kuband),
                    quoarterly4kuband: formatNumber(quoarterly4kuband),
                    quoarterlykuband: formatNumber(quoarterlykuband),
                    target1kuband: formatNumber(target1kuband),
                    target2kuband: formatNumber(target2kuband),
                    target3kuband: formatNumber(target3kuband),
                    target4kuband: formatNumber(target4kuband),
                    targetkuband: formatNumber(targetkuband),
                    gap1kuband: formatNumber(quoarterly1kuband - target1kuband),
                    gap2kuband: formatNumber(quoarterly2kuband - target2kuband),
                    gap3kuband: formatNumber(quoarterly3kuband - target3kuband),
                    gap4kuband: formatNumber(quoarterly4kuband - target4kuband),
                    gapkuband: formatNumber(quoarterlykuband - targetkuband),
                    perc1kuband: formatNumber(getPrecenge(quoarterly1kuband, target1kuband)) + '%',
                    perc2kuband: formatNumber(getPrecenge(quoarterly2kuband, target2kuband)) + '%',
                    perc3kuband: formatNumber(getPrecenge(quoarterly3kuband, target3kuband)) + '%',
                    perc4kuband: formatNumber(getPrecenge(quoarterly4kuband, target4kuband)) + '%',
                    perckuband: formatNumber(getPrecenge(quoarterlykuband, targetkuband)) + '%',
                    quoarterly1mobile_vsat: formatNumber(quoarterly1mobile_vsat),
                    quoarterly2mobile_vsat: formatNumber(quoarterly2mobile_vsat),
                    quoarterly3mobile_vsat: formatNumber(quoarterly3mobile_vsat),
                    quoarterly4mobile_vsat: formatNumber(quoarterly4mobile_vsat),
                    quoarterlymobile_vsat: formatNumber(quoarterlymobile_vsat),
                    target1mobile_vsat: formatNumber(target1mobile_vsat),
                    target2mobile_vsat: formatNumber(target2mobile_vsat),
                    target3mobile_vsat: formatNumber(target3mobile_vsat),
                    target4mobile_vsat: formatNumber(target4mobile_vsat),
                    targetmobile_vsat: formatNumber(targetmobile_vsat),
                    gap1mobile_vsat: formatNumber(quoarterly1mobile_vsat - target1mobile_vsat),
                    gap2mobile_vsat: formatNumber(quoarterly2mobile_vsat - target2mobile_vsat),
                    gap3mobile_vsat: formatNumber(quoarterly3mobile_vsat - target3mobile_vsat),
                    gap4mobile_vsat: formatNumber(quoarterly4mobile_vsat - target4mobile_vsat),
                    gapmobile_vsat: formatNumber(quoarterlymobile_vsat - targetmobile_vsat),
                    perc1mobile_vsat: formatNumber(getPrecenge(quoarterly1mobile_vsat, target1mobile_vsat)) + '%',
                    perc2mobile_vsat: formatNumber(getPrecenge(quoarterly2mobile_vsat, target2mobile_vsat)) + '%',
                    perc3mobile_vsat: formatNumber(getPrecenge(quoarterly3mobile_vsat, target3mobile_vsat)) + '%',
                    perc4mobile_vsat: formatNumber(getPrecenge(quoarterly4mobile_vsat, target4mobile_vsat)) + '%',
                    percmobile_vsat: formatNumber(getPrecenge(quoarterlymobile_vsat, targetmobile_vsat)) + '%',
                    quoarterly1mpip: formatNumber(quoarterly1mpip),
                    quoarterly2mpip: formatNumber(quoarterly2mpip),
                    quoarterly3mpip: formatNumber(quoarterly3mpip),
                    quoarterly4mpip: formatNumber(quoarterly4mpip),
                    quoarterlympip: formatNumber(quoarterlympip),
                    target1mpip: formatNumber(target1mpip),
                    target2mpip: formatNumber(target2mpip),
                    target3mpip: formatNumber(target3mpip),
                    target4mpip: formatNumber(target4mpip),
                    targetmpip: formatNumber(targetmpip),
                    gap1mpip: formatNumber(quoarterly1mpip - target1mpip),
                    gap2mpip: formatNumber(quoarterly2mpip - target2mpip),
                    gap3mpip: formatNumber(quoarterly3mpip - target3mpip),
                    gap4mpip: formatNumber(quoarterly4mpip - target4mpip),
                    gapmpip: formatNumber(quoarterlympip - targetmpip),
                    perc1mpip: formatNumber(getPrecenge(quoarterly1mpip, target1mpip)) + '%',
                    perc2mpip: formatNumber(getPrecenge(quoarterly2mpip, target2mpip)) + '%',
                    perc3mpip: formatNumber(getPrecenge(quoarterly3mpip, target3mpip)) + '%',
                    perc4mpip: formatNumber(getPrecenge(quoarterly4mpip, target4mpip)) + '%',
                    percmpip: formatNumber(getPrecenge(quoarterlympip, targetmpip)) + '%',
                    quoarterly1o3b: formatNumber(quoarterly1o3b),
                    quoarterly2o3b: formatNumber(quoarterly2o3b),
                    quoarterly3o3b: formatNumber(quoarterly3o3b),
                    quoarterly4o3b: formatNumber(quoarterly4o3b),
                    quoarterlyo3b: formatNumber(quoarterlyo3b),
                    target1o3b: formatNumber(target1o3b),
                    target2o3b: formatNumber(target2o3b),
                    target3o3b: formatNumber(target3o3b),
                    target4o3b: formatNumber(target4o3b),
                    targeto3b: formatNumber(targeto3b),
                    gap1o3b: formatNumber(quoarterly1o3b - target1o3b),
                    gap2o3b: formatNumber(quoarterly2o3b - target2o3b),
                    gap3o3b: formatNumber(quoarterly3o3b - target3o3b),
                    gap4o3b: formatNumber(quoarterly4o3b - target4o3b),
                    gapo3b: formatNumber(quoarterlyo3b - targeto3b),
                    perc1o3b: formatNumber(getPrecenge(quoarterly1o3b, target1o3b)) + '%',
                    perc2o3b: formatNumber(getPrecenge(quoarterly2o3b, target2o3b)) + '%',
                    perc3o3b: formatNumber(getPrecenge(quoarterly3o3b, target3o3b)) + '%',
                    perc4o3b: formatNumber(getPrecenge(quoarterly4o3b, target4o3b)) + '%',
                    perco3b: formatNumber(getPrecenge(quoarterlyo3b, targeto3b)) + '%',
                    quoarterly1ps: formatNumber(quoarterly1ps),
                    quoarterly2ps: formatNumber(quoarterly2ps),
                    quoarterly3ps: formatNumber(quoarterly3ps),
                    quoarterly4ps: formatNumber(quoarterly4ps),
                    quoarterlyps: formatNumber(quoarterlyps),
                    target1ps: formatNumber(target1ps),
                    target2ps: formatNumber(target2ps),
                    target3ps: formatNumber(target3ps),
                    target4ps: formatNumber(target4ps),
                    targetps: formatNumber(targetps),
                    gap1ps: formatNumber(quoarterly1ps - target1ps),
                    gap2ps: formatNumber(quoarterly2ps - target2ps),
                    gap3ps: formatNumber(quoarterly3ps - target3ps),
                    gap4ps: formatNumber(quoarterly4ps - target4ps),
                    gapps: formatNumber(quoarterlyps - targetps),
                    perc1ps: formatNumber(getPrecenge(quoarterly1ps, target1ps)) + '%',
                    perc2ps: formatNumber(getPrecenge(quoarterly2ps, target2ps)) + '%',
                    perc3ps: formatNumber(getPrecenge(quoarterly3ps, target3ps)) + '%',
                    perc4ps: formatNumber(getPrecenge(quoarterly4ps, target4ps)) + '%',
                    percps: formatNumber(getPrecenge(quoarterlyps, targetps)) + '%',
                    quoarterly1sr: formatNumber(quoarterly1sr),
                    quoarterly2sr: formatNumber(quoarterly2sr),
                    quoarterly3sr: formatNumber(quoarterly3sr),
                    quoarterly4sr: formatNumber(quoarterly4sr),
                    quoarterlysr: formatNumber(quoarterlysr),
                    target1sr: formatNumber(target1sr),
                    target2sr: formatNumber(target2sr),
                    target3sr: formatNumber(target3sr),
                    target4sr: formatNumber(target4sr),
                    targetsr: formatNumber(targetsr),
                    gap1sr: formatNumber(quoarterly1sr - target1sr),
                    gap2sr: formatNumber(quoarterly2sr - target2sr),
                    gap3sr: formatNumber(quoarterly3sr - target3sr),
                    gap4sr: formatNumber(quoarterly4sr - target4sr),
                    gapsr: formatNumber(quoarterlysr - targetsr),
                    perc1sr: formatNumber(getPrecenge(quoarterly1sr, target1sr)) + '%',
                    perc2sr: formatNumber(getPrecenge(quoarterly2sr, target2sr)) + '%',
                    perc3sr: formatNumber(getPrecenge(quoarterly3sr, target3sr)) + '%',
                    perc4sr: formatNumber(getPrecenge(quoarterly4sr, target4sr)) + '%',
                    percsr: formatNumber(getPrecenge(quoarterlysr, targetsr)) + '%',
                    quoarterly1hw: formatNumber(quoarterly1hw),
                    quoarterly2hw: formatNumber(quoarterly2hw),
                    quoarterly3hw: formatNumber(quoarterly3hw),
                    quoarterly4hw: formatNumber(quoarterly4hw),
                    quoarterlyhw: formatNumber(quoarterlyhw),
                    target1hw: formatNumber(target1hw),
                    target2hw: formatNumber(target2hw),
                    target3hw: formatNumber(target3hw),
                    target4hw: formatNumber(target4hw),
                    targethw: formatNumber(targethw),
                    gap1hw: formatNumber(quoarterly1hw - target1hw),
                    gap2hw: formatNumber(quoarterly2hw - target2hw),
                    gap3hw: formatNumber(quoarterly3hw - target3hw),
                    gap4hw: formatNumber(quoarterly4hw - target4hw),
                    gaphw: formatNumber(quoarterlyhw - targethw),
                    perc1hw: formatNumber(getPrecenge(quoarterly1hw, target1hw)) + '%',
                    perc2hw: formatNumber(getPrecenge(quoarterly2hw, target2hw)) + '%',
                    perc3hw: formatNumber(getPrecenge(quoarterly3hw, target3hw)) + '%',
                    perc4hw: formatNumber(getPrecenge(quoarterly4hw, target4hw)) + '%',
                    perchw: formatNumber(getPrecenge(quoarterlyhw, targethw)) + '%',
                    quoarterly1dhls_hw: formatNumber(quoarterly1dhls_hw),
                    quoarterly2dhls_hw: formatNumber(quoarterly2dhls_hw),
                    quoarterly3dhls_hw: formatNumber(quoarterly3dhls_hw),
                    quoarterly4dhls_hw: formatNumber(quoarterly4dhls_hw),
                    quoarterlydhls_hw: formatNumber(quoarterlydhls_hw),
                    target1dhls_hw: formatNumber(target1dhls_hw),
                    target2dhls_hw: formatNumber(target2dhls_hw),
                    target3dhls_hw: formatNumber(target3dhls_hw),
                    target4dhls_hw: formatNumber(target4dhls_hw),
                    targetdhls_hw: formatNumber(targetdhls_hw),
                    gap1dhls_hw: formatNumber(quoarterly1dhls_hw - target1dhls_hw),
                    gap2dhls_hw: formatNumber(quoarterly2dhls_hw - target2dhls_hw),
                    gap3dhls_hw: formatNumber(quoarterly3dhls_hw - target3dhls_hw),
                    gap4dhls_hw: formatNumber(quoarterly4dhls_hw - target4dhls_hw),
                    gapdhls_hw: formatNumber(quoarterlydhls_hw - targetdhls_hw),
                    perc1dhls_hw: formatNumber(getPrecenge(quoarterly1dhls_hw, target1dhls_hw)) + '%',
                    perc2dhls_hw: formatNumber(getPrecenge(quoarterly2dhls_hw, target2dhls_hw)) + '%',
                    perc3dhls_hw: formatNumber(getPrecenge(quoarterly3dhls_hw, target3dhls_hw)) + '%',
                    perc4dhls_hw: formatNumber(getPrecenge(quoarterly4dhls_hw, target4dhls_hw)) + '%',
                    percdhls_hw: formatNumber(getPrecenge(quoarterlydhls_hw, targetdhls_hw)) + '%',
                    quoarterly1gt: formatNumber(quoarterly1gt),
                    quoarterly2gt: formatNumber(quoarterly2gt),
                    quoarterly3gt: formatNumber(quoarterly3gt),
                    quoarterly4gt: formatNumber(quoarterly4gt),
                    quoarterlygt: formatNumber(quoarterlygt),
                    target1gt: formatNumber(target1gt),
                    target2gt: formatNumber(target2gt),
                    target3gt: formatNumber(target3gt),
                    target4gt: formatNumber(target4gt),
                    targetgt: formatNumber(targetgt),
                    gap1gt: formatNumber(quoarterly1gt - target1gt),
                    gap2gt: formatNumber(quoarterly2gt - target2gt),
                    gap3gt: formatNumber(quoarterly3gt - target3gt),
                    gap4gt: formatNumber(quoarterly4gt - target4gt),
                    gapgt: formatNumber(quoarterlygt - targetgt),
                    perc1gt: formatNumber(getPrecenge(quoarterly1gt, target1gt)) + '%',
                    perc2gt: formatNumber(getPrecenge(quoarterly2gt, target2gt)) + '%',
                    perc3gt: formatNumber(getPrecenge(quoarterly3gt, target3gt)) + '%',
                    perc4gt: formatNumber(getPrecenge(quoarterly4gt, target4gt)) + '%',
                    percgt: formatNumber(getPrecenge(quoarterlygt, targetgt)) + '%',
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsQuoartlyClass func', e)
    }
    return Results;
}
function SalesRepTargetsHalfYearlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_sales_rep_targets');
        search.addFilter(new nlobjSearchFilter('custrecord_target_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addsearch.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_target_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_target_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_target_sales_rep', null, 'anyof', salesData.split("\u0005")));
        }
        var newColumns = new Array();
        newColumns[0] = new nlobjSearchColumn('custrecord_jan_bbs');
        newColumns[1] = new nlobjSearchColumn('custrecord_feb_bbs');
        newColumns[2] = new nlobjSearchColumn('custrecord_mar_bbs');
        newColumns[3] = new nlobjSearchColumn('custrecord_apr_bbs');
        newColumns[4] = new nlobjSearchColumn('custrecord_may_bbs');
        newColumns[5] = new nlobjSearchColumn('custrecord_jun_bbs');
        newColumns[6] = new nlobjSearchColumn('custrecord_jul_bbs');
        newColumns[7] = new nlobjSearchColumn('custrecord_aug_bbs');
        newColumns[8] = new nlobjSearchColumn('custrecord_sep_bbs');
        newColumns[9] = new nlobjSearchColumn('custrecord_oct_bbs');
        newColumns[10] = new nlobjSearchColumn('custrecord_nov_bbs');
        newColumns[11] = new nlobjSearchColumn('custrecord_dec_bbs');
        newColumns[12] = new nlobjSearchColumn('custrecord_data_pf');
        newColumns[13] = new nlobjSearchColumn('custrecord_jan_vas');
        newColumns[14] = new nlobjSearchColumn('custrecord_feb_vas');
        newColumns[15] = new nlobjSearchColumn('custrecord_mar_vas');
        newColumns[16] = new nlobjSearchColumn('custrecord_apr_vas');
        newColumns[17] = new nlobjSearchColumn('custrecord_may_vas');
        newColumns[18] = new nlobjSearchColumn('custrecord_jun_vas');
        newColumns[19] = new nlobjSearchColumn('custrecord_jul_vas');
        newColumns[20] = new nlobjSearchColumn('custrecord_aug_vas');
        newColumns[21] = new nlobjSearchColumn('custrecord_sep_vas');
        newColumns[22] = new nlobjSearchColumn('custrecord_nov_vas');
        newColumns[23] = new nlobjSearchColumn('custrecord_dec_vas');
        newColumns[24] = new nlobjSearchColumn('custrecord_oct_vas');
        newColumns[25] = new nlobjSearchColumn('custrecord_jan_bod');
        newColumns[26] = new nlobjSearchColumn('custrecord_feb_bod');
        newColumns[27] = new nlobjSearchColumn('custrecord_mar_bod');
        newColumns[28] = new nlobjSearchColumn('custrecord_apr_bod');
        newColumns[29] = new nlobjSearchColumn('custrecord_may_bod');
        newColumns[30] = new nlobjSearchColumn('custrecord_jun_bod');
        newColumns[31] = new nlobjSearchColumn('custrecord_jul_bod');
        newColumns[32] = new nlobjSearchColumn('custrecord_aug_bod');
        newColumns[33] = new nlobjSearchColumn('custrecord_sep_bod');
        newColumns[34] = new nlobjSearchColumn('custrecord_oct_bod');
        newColumns[35] = new nlobjSearchColumn('custrecord_nov_bod');
        newColumns[36] = new nlobjSearchColumn('custrecord_dec_bod');
        newColumns[37] = new nlobjSearchColumn('custrecord_jan_cband');
        newColumns[38] = new nlobjSearchColumn('custrecord_feb_cband');
        newColumns[39] = new nlobjSearchColumn('custrecord_mar_cband');
        newColumns[40] = new nlobjSearchColumn('custrecord_apr_cband');
        newColumns[41] = new nlobjSearchColumn('custrecord_may_cband');
        newColumns[42] = new nlobjSearchColumn('custrecord_jun_cband');
        newColumns[43] = new nlobjSearchColumn('custrecord_jul_cband');
        newColumns[44] = new nlobjSearchColumn('custrecord_aug_cband');
        newColumns[45] = new nlobjSearchColumn('custrecord_sep_cband');
        newColumns[46] = new nlobjSearchColumn('custrecord_oct_cband');
        newColumns[47] = new nlobjSearchColumn('custrecord_nov_cband');
        newColumns[48] = new nlobjSearchColumn('custrecord_dec_cband');
        newColumns[49] = new nlobjSearchColumn('custrecord_jan_domestic');
        newColumns[50] = new nlobjSearchColumn('custrecord_feb_domestic');
        newColumns[51] = new nlobjSearchColumn('custrecord_mar_domestic');
        newColumns[52] = new nlobjSearchColumn('custrecord_apr_domestic');
        newColumns[53] = new nlobjSearchColumn('custrecord_may_domestic');
        newColumns[54] = new nlobjSearchColumn('custrecord_jun_domestic');
        newColumns[55] = new nlobjSearchColumn('custrecord_jul_domestic');
        newColumns[56] = new nlobjSearchColumn('custrecord_aug_domestic');
        newColumns[57] = new nlobjSearchColumn('custrecord_sep_domestic');
        newColumns[58] = new nlobjSearchColumn('custrecord_oct_domestic');
        newColumns[59] = new nlobjSearchColumn('custrecord_nov_domestic');
        newColumns[60] = new nlobjSearchColumn('custrecord_dec_domestic');
        newColumns[61] = new nlobjSearchColumn('custrecord_jan_ip');
        newColumns[62] = new nlobjSearchColumn('custrecord_feb_ip');
        newColumns[63] = new nlobjSearchColumn('custrecord_mar_ip');
        newColumns[64] = new nlobjSearchColumn('custrecord_apr_ip');
        newColumns[65] = new nlobjSearchColumn('custrecord_may_ip');
        newColumns[66] = new nlobjSearchColumn('custrecord_jun_ip');
        newColumns[67] = new nlobjSearchColumn('custrecord_jul_ip');
        newColumns[68] = new nlobjSearchColumn('custrecord_aug_ip');
        newColumns[69] = new nlobjSearchColumn('custrecord_sep_ip');
        newColumns[70] = new nlobjSearchColumn('custrecord_oct_ip');
        newColumns[71] = new nlobjSearchColumn('custrecord_nov_ip');
        newColumns[72] = new nlobjSearchColumn('custrecord_dec_ip');
        newColumns[73] = new nlobjSearchColumn('custrecord_jan_iru');
        newColumns[74] = new nlobjSearchColumn('custrecord_feb_iru');
        newColumns[75] = new nlobjSearchColumn('custrecord_mar_iru');
        newColumns[76] = new nlobjSearchColumn('custrecord_apr_iru');
        newColumns[77] = new nlobjSearchColumn('custrecord_may_iru');
        newColumns[78] = new nlobjSearchColumn('custrecord_jun_iru');
        newColumns[79] = new nlobjSearchColumn('custrecord_jul_iru');
        newColumns[80] = new nlobjSearchColumn('custrecord_aug_iru');
        newColumns[81] = new nlobjSearchColumn('custrecord_sep_iru');
        newColumns[82] = new nlobjSearchColumn('custrecord_oct_iru');
        newColumns[83] = new nlobjSearchColumn('custrecord_nov_iru');
        newColumns[84] = new nlobjSearchColumn('custrecord_dec_iru');
        newColumns[85] = new nlobjSearchColumn('custrecord_jan_kuband');
        newColumns[86] = new nlobjSearchColumn('custrecord_feb_kuband');
        newColumns[87] = new nlobjSearchColumn('custrecord_mar_kuband');
        newColumns[88] = new nlobjSearchColumn('custrecord_apr_kuband');
        newColumns[89] = new nlobjSearchColumn('custrecord_may_kuband');
        newColumns[90] = new nlobjSearchColumn('custrecord_jun_kuband');
        newColumns[91] = new nlobjSearchColumn('custrecord_jul_kuband');
        newColumns[92] = new nlobjSearchColumn('custrecord_aug_kuband');
        newColumns[93] = new nlobjSearchColumn('custrecord_sep_kuband');
        newColumns[94] = new nlobjSearchColumn('custrecord_oct_kuband');
        newColumns[95] = new nlobjSearchColumn('custrecord_nov_kuband');
        newColumns[96] = new nlobjSearchColumn('custrecord_dec_kuband');
        newColumns[97] = new nlobjSearchColumn('custrecord_jan_mobile_vsat');
        newColumns[98] = new nlobjSearchColumn('custrecord_feb_mobile_vsat');
        newColumns[99] = new nlobjSearchColumn('custrecord_mar_mobile_vsat');
        newColumns[100] = new nlobjSearchColumn('custrecord_apr_mobile_vsat');
        newColumns[101] = new nlobjSearchColumn('custrecord_may_mobile_vsat');
        newColumns[102] = new nlobjSearchColumn('custrecord_jun_mobile_vsat');
        newColumns[103] = new nlobjSearchColumn('custrecord_jul_mobile_vsat');
        newColumns[104] = new nlobjSearchColumn('custrecord_aug_mobile_vsat');
        newColumns[105] = new nlobjSearchColumn('custrecord_sep_mobile_vsat');
        newColumns[106] = new nlobjSearchColumn('custrecord_oct_mobile_vsat');
        newColumns[107] = new nlobjSearchColumn('custrecord_nov_mobile_vsat');
        newColumns[108] = new nlobjSearchColumn('custrecord_dec_mobile_vsat');
        newColumns[109] = new nlobjSearchColumn('custrecord_jan_mpip');
        newColumns[110] = new nlobjSearchColumn('custrecord_feb_mpip');
        newColumns[111] = new nlobjSearchColumn('custrecord_mar_mpip');
        newColumns[112] = new nlobjSearchColumn('custrecord_apr_mpip');
        newColumns[113] = new nlobjSearchColumn('custrecord_may_mpip');
        newColumns[114] = new nlobjSearchColumn('custrecord_jun_mpip');
        newColumns[115] = new nlobjSearchColumn('custrecord_jul_mpip');
        newColumns[116] = new nlobjSearchColumn('custrecord_aug_mpip');
        newColumns[117] = new nlobjSearchColumn('custrecord_sep_mpip');
        newColumns[118] = new nlobjSearchColumn('custrecord_oct_mpip');
        newColumns[119] = new nlobjSearchColumn('custrecord_nov_mpip');
        newColumns[120] = new nlobjSearchColumn('custrecord_dec_mpip');
        newColumns[121] = new nlobjSearchColumn('custrecord_jan_o3b');
        newColumns[122] = new nlobjSearchColumn('custrecord_feb_o3b');
        newColumns[123] = new nlobjSearchColumn('custrecord_mar_o3b');
        newColumns[124] = new nlobjSearchColumn('custrecord_apr_o3b');
        newColumns[125] = new nlobjSearchColumn('custrecord_may_o3b');
        newColumns[126] = new nlobjSearchColumn('custrecord_jun_o3b');
        newColumns[127] = new nlobjSearchColumn('custrecord_jul_o3b');
        newColumns[128] = new nlobjSearchColumn('custrecord_aug_o3b');
        newColumns[129] = new nlobjSearchColumn('custrecord_sep_o3b');
        newColumns[130] = new nlobjSearchColumn('custrecord_oct_o3b');
        newColumns[131] = new nlobjSearchColumn('custrecord_nov_o3b');
        newColumns[132] = new nlobjSearchColumn('custrecord_dec_o3b');
        newColumns[133] = new nlobjSearchColumn('custrecord_jan_ps');
        newColumns[134] = new nlobjSearchColumn('custrecord_feb_ps');
        newColumns[135] = new nlobjSearchColumn('custrecord_mar_ps');
        newColumns[136] = new nlobjSearchColumn('custrecord_apr_ps');
        newColumns[137] = new nlobjSearchColumn('custrecord_may_ps');
        newColumns[138] = new nlobjSearchColumn('custrecord_jun_ps');
        newColumns[139] = new nlobjSearchColumn('custrecord_jul_ps');
        newColumns[140] = new nlobjSearchColumn('custrecord_aug_ps');
        newColumns[141] = new nlobjSearchColumn('custrecord_sep_ps');
        newColumns[142] = new nlobjSearchColumn('custrecord_oct_ps');
        newColumns[143] = new nlobjSearchColumn('custrecord_nov_ps');
        newColumns[144] = new nlobjSearchColumn('custrecord_dec_ps');
        newColumns[145] = new nlobjSearchColumn('custrecord_jan_sr');
        newColumns[146] = new nlobjSearchColumn('custrecord_feb_sr');
        newColumns[147] = new nlobjSearchColumn('custrecord_mar_sr');
        newColumns[148] = new nlobjSearchColumn('custrecord_apr_sr');
        newColumns[149] = new nlobjSearchColumn('custrecord_may_sr');
        newColumns[150] = new nlobjSearchColumn('custrecord_jun_sr');
        newColumns[151] = new nlobjSearchColumn('custrecord_jul_sr');
        newColumns[152] = new nlobjSearchColumn('custrecord_aug_sr');
        newColumns[153] = new nlobjSearchColumn('custrecord_sep_sr');
        newColumns[154] = new nlobjSearchColumn('custrecord_oct_sr');
        newColumns[155] = new nlobjSearchColumn('custrecord_nov_sr');
        newColumns[156] = new nlobjSearchColumn('custrecord_dec_sr');
        newColumns[157] = new nlobjSearchColumn('custrecord_gt_jan_hw');
        newColumns[158] = new nlobjSearchColumn('custrecord_gt_feb_hw');
        newColumns[159] = new nlobjSearchColumn('custrecord_gt_mar_hw');
        newColumns[160] = new nlobjSearchColumn('custrecord_gt_apr_hw');
        newColumns[161] = new nlobjSearchColumn('custrecord_gt_may_hw');
        newColumns[162] = new nlobjSearchColumn('custrecord_gt_jun_hw');
        newColumns[163] = new nlobjSearchColumn('custrecord_gt_jul_hw');
        newColumns[164] = new nlobjSearchColumn('custrecord_gt_aug_hw');
        newColumns[165] = new nlobjSearchColumn('custrecord_gt_sep_hw');
        newColumns[166] = new nlobjSearchColumn('custrecord_gt_oct_hw');
        newColumns[167] = new nlobjSearchColumn('custrecord_gt_nov_hw');
        newColumns[168] = new nlobjSearchColumn('custrecord_gt_dec_hw');
        newColumns[169] = new nlobjSearchColumn('custrecord_jan_dhls_hw');
        newColumns[170] = new nlobjSearchColumn('custrecord_feb_dhls_hw');
        newColumns[171] = new nlobjSearchColumn('custrecord_mar_dhls_hw');
        newColumns[172] = new nlobjSearchColumn('custrecord_apr_dhls_hw');
        newColumns[173] = new nlobjSearchColumn('custrecord_may_dhls_hw');
        newColumns[174] = new nlobjSearchColumn('custrecord_jun_dhls_hw');
        newColumns[175] = new nlobjSearchColumn('custrecord_jul_dhls_hw');
        newColumns[176] = new nlobjSearchColumn('custrecord_aug_dhls_hw');
        newColumns[177] = new nlobjSearchColumn('custrecord_sep_dhls_hw');
        newColumns[178] = new nlobjSearchColumn('custrecord_oct_dhls_hw');
        newColumns[179] = new nlobjSearchColumn('custrecord_nov_dhls_hw');
        newColumns[180] = new nlobjSearchColumn('custrecord_dec_dhls_hw');
        //D&HLS Service
        newColumns[181] = new nlobjSearchColumn('custrecord_gt_jan_rec');
        newColumns[182] = new nlobjSearchColumn('custrecord_gt_feb_rec');
        newColumns[183] = new nlobjSearchColumn('custrecord_gt_mar_rec');
        newColumns[184] = new nlobjSearchColumn('custrecord_gt_apr_rec');
        newColumns[185] = new nlobjSearchColumn('custrecord_gt_may_rec');
        newColumns[186] = new nlobjSearchColumn('custrecord_gt_jun_rec');
        newColumns[187] = new nlobjSearchColumn('custrecord_gt_jul_rec');
        newColumns[188] = new nlobjSearchColumn('custrecord_gt_aug_rec');
        newColumns[189] = new nlobjSearchColumn('custrecord_gt_sep_rec');
        newColumns[190] = new nlobjSearchColumn('custrecord_gt_oct_rec');
        newColumns[191] = new nlobjSearchColumn('custrecord_gt_nov_rec');
        newColumns[192] = new nlobjSearchColumn('custrecord_gt_dec_rec');
        search.addColumns(newColumns);
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
                var data = allSelection[i].getValue("custrecord_data_pf")
                var dataSplitSecond = splitDataAmountSecondPf(data);

                var halfYearly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var halfYearly2bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var halfYearlybbs = halfYearly1bbs + halfYearly2bbs;
                var target1bbs = Number(allSelection[i].getValue("custrecord_jan_bbs")) + Number(allSelection[i].getValue("custrecord_feb_bbs")) + Number(allSelection[i].getValue("custrecord_mar_bbs")) + Number(allSelection[i].getValue("custrecord_apr_bbs")) + Number(allSelection[i].getValue("custrecord_may_bbs")) + Number(allSelection[i].getValue("custrecord_jun_bbs"));
                var target2bbs = Number(allSelection[i].getValue("custrecord_jul_bbs")) + Number(allSelection[i].getValue("custrecord_aug_bbs")) + Number(allSelection[i].getValue("custrecord_sep_bbs")) + Number(allSelection[i].getValue("custrecord_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nov_bbs")) + Number(allSelection[i].getValue("custrecord_dec_bbs"));
                var targetbbs = target1bbs + target2bbs;
                var halfYearly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var halfYearly2vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var halfYearlyvas = halfYearly1vas + halfYearly2vas;
                var target1vas = Number(allSelection[i].getValue("custrecord_jan_vas")) + Number(allSelection[i].getValue("custrecord_feb_vas")) + Number(allSelection[i].getValue("custrecord_mar_vas")) + Number(allSelection[i].getValue("custrecord_apr_vas")) + Number(allSelection[i].getValue("custrecord_may_vas")) + Number(allSelection[i].getValue("custrecord_jun_vas"));
                var target2vas = Number(allSelection[i].getValue("custrecord_jul_vas")) + Number(allSelection[i].getValue("custrecord_aug_vas")) + Number(allSelection[i].getValue("custrecord_sep_vas")) + Number(allSelection[i].getValue("custrecord_oct_vas")) + Number(allSelection[i].getValue("custrecord_nov_vas")) + Number(allSelection[i].getValue("custrecord_dec_vas"));
                var targetvas = target1vas + target2vas;
                var halfYearly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;      
                var halfYearly2bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var halfYearlybod = halfYearly1bod + halfYearly2bod;
                var target1bod = Number(allSelection[i].getValue("custrecord_jan_bod")) + Number(allSelection[i].getValue("custrecord_feb_bod")) + Number(allSelection[i].getValue("custrecord_mar_bod")) + Number(allSelection[i].getValue("custrecord_apr_bod")) + Number(allSelection[i].getValue("custrecord_may_bod")) + Number(allSelection[i].getValue("custrecord_jun_bod"));
                var target2bod = Number(allSelection[i].getValue("custrecord_jul_bod")) + Number(allSelection[i].getValue("custrecord_aug_bod")) + Number(allSelection[i].getValue("custrecord_sep_bod")) + Number(allSelection[i].getValue("custrecord_oct_bod")) + Number(allSelection[i].getValue("custrecord_nov_bod")) + Number(allSelection[i].getValue("custrecord_dec_bod"));
                var targetbod = target1bod + target2bod;
                var halfYearly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var halfYearly2cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var halfYearlycband = halfYearly1cband + halfYearly2cband
                var target1cband = Number(allSelection[i].getValue("custrecord_jan_cband")) + Number(allSelection[i].getValue("custrecord_feb_cband")) + Number(allSelection[i].getValue("custrecord_mar_cband")) + Number(allSelection[i].getValue("custrecord_apr_cband")) + Number(allSelection[i].getValue("custrecord_may_cband")) + Number(allSelection[i].getValue("custrecord_jun_cband"));
                var target2cband = Number(allSelection[i].getValue("custrecord_jul_cband")) + Number(allSelection[i].getValue("custrecord_aug_cband")) + Number(allSelection[i].getValue("custrecord_sep_cband")) + Number(allSelection[i].getValue("custrecord_oct_cband")) + Number(allSelection[i].getValue("custrecord_nov_cband")) + Number(allSelection[i].getValue("custrecord_dec_cband"));
                var targetcband = target1cband + target2cband;
                var halfYearly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var halfYearly2domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var halfYearlydomestic = halfYearly1domestic + halfYearly2domestic
                var target1domestic = Number(allSelection[i].getValue("custrecord_jan_domestic")) + Number(allSelection[i].getValue("custrecord_feb_domestic")) + Number(allSelection[i].getValue("custrecord_mar_domestic")) + Number(allSelection[i].getValue("custrecord_apr_domestic")) + Number(allSelection[i].getValue("custrecord_may_domestic")) + Number(allSelection[i].getValue("custrecord_jun_domestic"));
                var target2domestic = Number(allSelection[i].getValue("custrecord_jul_domestic")) + Number(allSelection[i].getValue("custrecord_aug_domestic")) + Number(allSelection[i].getValue("custrecord_sep_domestic")) + Number(allSelection[i].getValue("custrecord_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nov_domestic")) + Number(allSelection[i].getValue("custrecord_dec_domestic"));
                var targetdomestic = target1domestic + target2domestic
                var halfYearly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var halfYearly2ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var halfYearlyip = halfYearly1ip + halfYearly2ip
                var target1ip = Number(allSelection[i].getValue("custrecord_jan_ip")) + Number(allSelection[i].getValue("custrecord_feb_ip")) + Number(allSelection[i].getValue("custrecord_mar_ip")) + Number(allSelection[i].getValue("custrecord_apr_ip")) + Number(allSelection[i].getValue("custrecord_may_ip")) + Number(allSelection[i].getValue("custrecord_jun_ip"));
                var target2ip = Number(allSelection[i].getValue("custrecord_jul_ip")) + Number(allSelection[i].getValue("custrecord_aug_ip")) + Number(allSelection[i].getValue("custrecord_sep_ip")) + Number(allSelection[i].getValue("custrecord_oct_ip")) + Number(allSelection[i].getValue("custrecord_nov_ip")) + Number(allSelection[i].getValue("custrecord_dec_ip"));
                var targetip = target1ip + target2ip
                var halfYearly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var halfYearly2iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var halfYearlyiru = halfYearly1iru + halfYearly2iru
                var target1iru = Number(allSelection[i].getValue("custrecord_jan_iru")) + Number(allSelection[i].getValue("custrecord_feb_iru")) + Number(allSelection[i].getValue("custrecord_mar_iru")) + Number(allSelection[i].getValue("custrecord_apr_iru")) + Number(allSelection[i].getValue("custrecord_may_iru")) + Number(allSelection[i].getValue("custrecord_jun_iru"));
                var target2iru = Number(allSelection[i].getValue("custrecord_jul_iru")) + Number(allSelection[i].getValue("custrecord_aug_iru")) + Number(allSelection[i].getValue("custrecord_sep_iru")) + Number(allSelection[i].getValue("custrecord_oct_iru")) + Number(allSelection[i].getValue("custrecord_nov_iru")) + Number(allSelection[i].getValue("custrecord_dec_iru"));
                var targetiru = target1iru + target2iru
                var halfYearly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var halfYearly2kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var halfYearlykuband = halfYearly1kuband + halfYearly2kuband
                var target1kuband = Number(allSelection[i].getValue("custrecord_jan_kuband")) + Number(allSelection[i].getValue("custrecord_feb_kuband")) + Number(allSelection[i].getValue("custrecord_mar_kuband")) + Number(allSelection[i].getValue("custrecord_apr_kuband")) + Number(allSelection[i].getValue("custrecord_may_kuband")) + Number(allSelection[i].getValue("custrecord_jun_kuband"));
                var target2kuband = Number(allSelection[i].getValue("custrecord_jul_kuband")) + Number(allSelection[i].getValue("custrecord_aug_kuband")) + Number(allSelection[i].getValue("custrecord_sep_kuband")) + Number(allSelection[i].getValue("custrecord_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nov_kuband")) + Number(allSelection[i].getValue("custrecord_dec_kuband"));
                var targetkuband = target1kuband + target2kuband
                var halfYearly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var halfYearly2mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var halfYearlymobile_vsat = halfYearly1mobile_vsat + halfYearly2mobile_vsat
                var target1mobile_vsat = Number(allSelection[i].getValue("custrecord_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_mar_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_jun_mobile_vsat"));
                var target2mobile_vsat = Number(allSelection[i].getValue("custrecord_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_sep_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_dec_mobile_vsat"));
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat
                var halfYearly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var halfYearly2mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var halfYearlympip = halfYearly1mpip + halfYearly2mpip
                var target1mpip = Number(allSelection[i].getValue("custrecord_jan_mpip")) + Number(allSelection[i].getValue("custrecord_feb_mpip")) + Number(allSelection[i].getValue("custrecord_mar_mpip")) + Number(allSelection[i].getValue("custrecord_apr_mpip")) + Number(allSelection[i].getValue("custrecord_may_mpip")) + Number(allSelection[i].getValue("custrecord_jun_mpip"));
                var target2mpip = Number(allSelection[i].getValue("custrecord_jul_mpip")) + Number(allSelection[i].getValue("custrecord_aug_mpip")) + Number(allSelection[i].getValue("custrecord_sep_mpip")) + Number(allSelection[i].getValue("custrecord_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nov_mpip")) + Number(allSelection[i].getValue("custrecord_dec_mpip"));
                var targetmpip = target1mpip + target2mpip
                var halfYearly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var halfYearly2o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var halfYearlyo3b = halfYearly1o3b + halfYearly2o3b
                var target1o3b = Number(allSelection[i].getValue("custrecord_jan_o3b")) + Number(allSelection[i].getValue("custrecord_feb_o3b")) + Number(allSelection[i].getValue("custrecord_mar_o3b")) + Number(allSelection[i].getValue("custrecord_apr_o3b")) + Number(allSelection[i].getValue("custrecord_may_o3b")) + Number(allSelection[i].getValue("custrecord_jun_o3b"));
                var target2o3b = Number(allSelection[i].getValue("custrecord_jul_o3b")) + Number(allSelection[i].getValue("custrecord_aug_o3b")) + Number(allSelection[i].getValue("custrecord_sep_o3b")) + Number(allSelection[i].getValue("custrecord_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nov_o3b")) + Number(allSelection[i].getValue("custrecord_dec_o3b"));
                var targeto3b = target1o3b + target2o3b
                var halfYearly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var halfYearly2ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var halfYearlyps = halfYearly1ps + halfYearly2ps
                var target1ps = Number(allSelection[i].getValue("custrecord_jan_ps")) + Number(allSelection[i].getValue("custrecord_feb_ps")) + Number(allSelection[i].getValue("custrecord_mar_ps")) + Number(allSelection[i].getValue("custrecord_apr_ps")) + Number(allSelection[i].getValue("custrecord_may_ps")) + Number(allSelection[i].getValue("custrecord_jun_ps"));
                var target2ps = Number(allSelection[i].getValue("custrecord_jul_ps")) + Number(allSelection[i].getValue("custrecord_aug_ps")) + Number(allSelection[i].getValue("custrecord_sep_ps")) + Number(allSelection[i].getValue("custrecord_oct_ps")) + Number(allSelection[i].getValue("custrecord_nov_ps")) + Number(allSelection[i].getValue("custrecord_dec_ps"));
                var targetps = target1ps + target2ps
                var halfYearly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var halfYearly2sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var halfYearlysr = halfYearly1sr + halfYearly2sr
                var target1sr = Number(allSelection[i].getValue("custrecord_jan_sr")) + Number(allSelection[i].getValue("custrecord_feb_sr")) + Number(allSelection[i].getValue("custrecord_mar_sr")) + Number(allSelection[i].getValue("custrecord_apr_sr")) + Number(allSelection[i].getValue("custrecord_may_sr")) + Number(allSelection[i].getValue("custrecord_jun_sr"));
                var target2sr = Number(allSelection[i].getValue("custrecord_jul_sr")) + Number(allSelection[i].getValue("custrecord_aug_sr")) + Number(allSelection[i].getValue("custrecord_sep_sr")) + Number(allSelection[i].getValue("custrecord_oct_sr")) + Number(allSelection[i].getValue("custrecord_nov_sr")) + Number(allSelection[i].getValue("custrecord_dec_sr"));
                var targetsr = target1sr + target2sr
                var halfYearly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var halfYearly2hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var halfYearlyhw = halfYearly1hw + halfYearly2hw
                var target1hw = Number(allSelection[i].getValue("custrecord_gt_jan_hw")) + Number(allSelection[i].getValue("custrecord_gt_feb_hw")) + Number(allSelection[i].getValue("custrecord_gt_mar_hw")) + Number(allSelection[i].getValue("custrecord_gt_apr_hw")) + Number(allSelection[i].getValue("custrecord_gt_may_hw")) + Number(allSelection[i].getValue("custrecord_gt_jun_hw"));
                var target2hw = Number(allSelection[i].getValue("custrecord_gt_jul_hw")) + Number(allSelection[i].getValue("custrecord_gt_aug_hw")) + Number(allSelection[i].getValue("custrecord_gt_sep_hw")) + Number(allSelection[i].getValue("custrecord_gt_oct_hw")) + Number(allSelection[i].getValue("custrecord_gt_nov_hw")) + Number(allSelection[i].getValue("custrecord_gt_dec_hw"));
                var targethw = target1hw + target2hw
                var halfYearly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var halfYearly2dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var halfYearlydhls_hw = halfYearly1dhls_hw + halfYearly2dhls_hw
                var target1dhls_hw = Number(allSelection[i].getValue("custrecord_jan_dhls_hw")) + Number(allSelection[i].getValue("custrecord_feb_dhls_hw")) + Number(allSelection[i].getValue("custrecord_mar_dhls_hw")) + Number(allSelection[i].getValue("custrecord_apr_dhls_hw")) + Number(allSelection[i].getValue("custrecord_may_dhls_hw")) + Number(allSelection[i].getValue("custrecord_jun_dhls_hw"));
                var target2dhls_hw = Number(allSelection[i].getValue("custrecord_jul_dhls_hw")) + Number(allSelection[i].getValue("custrecord_aug_dhls_hw")) + Number(allSelection[i].getValue("custrecord_sep_dhls_hw")) + Number(allSelection[i].getValue("custrecord_oct_dhls_hw")) + Number(allSelection[i].getValue("custrecord_nov_dhls_hw")) + Number(allSelection[i].getValue("custrecord_dec_dhls_hw"));
                var targetdhls_hw = target1dhls_hw + target2dhls_hw
                var halfYearly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var halfYearly2gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var halfYearlygt = halfYearly1gt + halfYearly2gt
                var target1gt = Number(allSelection[i].getValue("custrecord_gt_jan_rec")) + Number(allSelection[i].getValue("custrecord_gt_feb_rec")) + Number(allSelection[i].getValue("custrecord_gt_mar_rec")) + Number(allSelection[i].getValue("custrecord_gt_apr_rec")) + Number(allSelection[i].getValue("custrecord_gt_may_rec")) + Number(allSelection[i].getValue("custrecord_gt_jun_rec"));
                var target2gt = Number(allSelection[i].getValue("custrecord_gt_jul_rec")) + Number(allSelection[i].getValue("custrecord_gt_aug_rec")) + Number(allSelection[i].getValue("custrecord_gt_sep_rec")) + Number(allSelection[i].getValue("custrecord_gt_oct_rec")) + Number(allSelection[i].getValue("custrecord_gt_nov_rec")) + Number(allSelection[i].getValue("custrecord_gt_dec_rec"));
                var targetgt = target1gt + target2gt

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_target_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_target_sales_rep"),
                    halfYearly1bbs: formatNumber(halfYearly1bbs),
                    halfYearly2bbs: formatNumber(halfYearly2bbs),
                    halfYearlybbs: formatNumber(halfYearlybbs),
                    target1bbs: formatNumber(target1bbs),
                    target2bbs: formatNumber(target2bbs),
                    targetbbs: formatNumber(targetbbs),
                    gap1bbs: formatNumber(halfYearly1bbs - target1bbs),
                    gap2bbs: formatNumber(halfYearly2bbs - target2bbs),
                    gapbbs: formatNumber(halfYearlybbs - targetbbs),
                    perc1bbs: formatNumber(getPrecenge(halfYearly1bbs, target1bbs)) + '%',
                    perc2bbs: formatNumber(getPrecenge(halfYearly2bbs, target2bbs)) + '%',
                    percbbs: formatNumber(getPrecenge(halfYearlybbs, targetbbs)) + '%',
                    halfYearly1vas: formatNumber(halfYearly1vas),
                    halfYearly2vas: formatNumber(halfYearly2vas),
                    halfYearlyvas: formatNumber(halfYearlyvas),
                    target1vas: formatNumber(target1vas),
                    target2vas: formatNumber(target2vas),
                    targetvas: formatNumber(targetvas),
                    gap1vas: formatNumber(halfYearly1vas - target1vas),
                    gap2vas: formatNumber(halfYearly2vas - target2vas),
                    gapvas: formatNumber(halfYearlyvas - targetvas),
                    perc1vas: formatNumber(getPrecenge(halfYearly1vas, target1vas)) + '%',
                    perc2vas: formatNumber(getPrecenge(halfYearly2vas, target2vas)) + '%',
                    percvas: formatNumber(getPrecenge(halfYearlyvas, targetvas)) + '%',
                    halfYearly1bod: formatNumber(halfYearly1bod),
                    halfYearly2bod: formatNumber(halfYearly2bod),
                    halfYearlybod: formatNumber(halfYearlybod),
                    target1bod: formatNumber(target1bod),
                    target2bod: formatNumber(target2bod),
                    targetbod: formatNumber(targetbod),
                    gap1bod: formatNumber(halfYearly1bod - target1bod),
                    gap2bod: formatNumber(halfYearly2bod - target2bod),
                    gapbod: formatNumber(halfYearlybod - targetbod),
                    perc1bod: formatNumber(getPrecenge(halfYearly1bod, target1bod)) + '%',
                    perc2bod: formatNumber(getPrecenge(halfYearly2bod, target2bod)) + '%',
                    percbod: formatNumber(getPrecenge(halfYearlybod, targetbod)) + '%',
                    halfYearly1cband: formatNumber(halfYearly1cband),
                    halfYearly2cband: formatNumber(halfYearly2cband),
                    halfYearlycband: formatNumber(halfYearlycband),
                    target1cband: formatNumber(target1cband),
                    target2cband: formatNumber(target2cband),
                    targetcband: formatNumber(targetcband),
                    gap1cband: formatNumber(halfYearly1cband - target1cband),
                    gap2cband: formatNumber(halfYearly2cband - target2cband),
                    gapcband: formatNumber(halfYearlycband - targetcband),
                    perc1cband: formatNumber(getPrecenge(halfYearly1cband, target1cband)) + '%',
                    perc2cband: formatNumber(getPrecenge(halfYearly2cband, target2cband)) + '%',
                    perccband: formatNumber(getPrecenge(halfYearlycband, targetcband)) + '%',
                    halfYearly1domestic: formatNumber(halfYearly1domestic),
                    halfYearly2domestic: formatNumber(halfYearly2domestic),
                    halfYearlydomestic: formatNumber(halfYearlydomestic),
                    target1domestic: formatNumber(target1domestic),
                    target2domestic: formatNumber(target2domestic),
                    targetdomestic: formatNumber(targetdomestic),
                    gap1domestic: formatNumber(halfYearly1domestic - target1domestic),
                    gap2domestic: formatNumber(halfYearly2domestic - target2domestic),
                    gapdomestic: formatNumber(halfYearlydomestic - targetdomestic),
                    perc1domestic: formatNumber(getPrecenge(halfYearly1domestic, target1domestic)) + '%',
                    perc2domestic: formatNumber(getPrecenge(halfYearly2domestic, target2domestic)) + '%',
                    percdomestic: formatNumber(getPrecenge(halfYearlydomestic, targetdomestic)) + '%',
                    halfYearly1ip: formatNumber(halfYearly1ip),
                    halfYearly2ip: formatNumber(halfYearly2ip),
                    halfYearlyip: formatNumber(halfYearlyip),
                    target1ip: formatNumber(target1ip),
                    target2ip: formatNumber(target2ip),
                    targetip: formatNumber(targetip),
                    gap1ip: formatNumber(halfYearly1ip - target1ip),
                    gap2ip: formatNumber(halfYearly2ip - target2ip),
                    gapip: formatNumber(halfYearlyip - targetip),
                    perc1ip: formatNumber(getPrecenge(halfYearly1ip, target1ip)) + '%',
                    perc2ip: formatNumber(getPrecenge(halfYearly2ip, target2ip)) + '%',
                    percip: formatNumber(getPrecenge(halfYearlyip, targetip)) + '%',
                    halfYearly1iru: formatNumber(halfYearly1iru),
                    halfYearly2iru: formatNumber(halfYearly2iru),
                    halfYearlyiru: formatNumber(halfYearlyiru),
                    target1iru: formatNumber(target1iru),
                    target2iru: formatNumber(target2iru),
                    targetiru: formatNumber(targetiru),
                    gap1iru: formatNumber(halfYearly1iru - target1iru),
                    gap2iru: formatNumber(halfYearly2iru - target2iru),
                    gapiru: formatNumber(halfYearlyiru - targetiru),
                    perc1iru: formatNumber(getPrecenge(halfYearly1iru, target1iru)) + '%',
                    perc2iru: formatNumber(getPrecenge(halfYearly2iru, target2iru)) + '%',
                    perciru: formatNumber(getPrecenge(halfYearlyiru, targetiru)) + '%',
                    halfYearly1kuband: formatNumber(halfYearly1kuband),
                    halfYearly2kuband: formatNumber(halfYearly2kuband),
                    halfYearlykuband: formatNumber(halfYearlykuband),
                    target1kuband: formatNumber(target1kuband),
                    target2kuband: formatNumber(target2kuband),
                    targetkuband: formatNumber(targetkuband),
                    gap1kuband: formatNumber(halfYearly1kuband - target1kuband),
                    gap2kuband: formatNumber(halfYearly2kuband - target2kuband),
                    gapkuband: formatNumber(halfYearlykuband - targetkuband),
                    perc1kuband: formatNumber(getPrecenge(halfYearly1kuband, target1kuband)) + '%',
                    perc2kuband: formatNumber(getPrecenge(halfYearly2kuband, target2kuband)) + '%',
                    perckuband: formatNumber(getPrecenge(halfYearlykuband, targetkuband)) + '%',
                    halfYearly1mobile_vsat: formatNumber(halfYearly1mobile_vsat),
                    halfYearly2mobile_vsat: formatNumber(halfYearly2mobile_vsat),
                    halfYearlymobile_vsat: formatNumber(halfYearlymobile_vsat),
                    target1mobile_vsat: formatNumber(target1mobile_vsat),
                    target2mobile_vsat: formatNumber(target2mobile_vsat),
                    targetmobile_vsat: formatNumber(targetmobile_vsat),
                    gap1mobile_vsat: formatNumber(halfYearly1mobile_vsat - target1mobile_vsat),
                    gap2mobile_vsat: formatNumber(halfYearly2mobile_vsat - target2mobile_vsat),
                    gapmobile_vsat: formatNumber(halfYearlymobile_vsat - targetmobile_vsat),
                    perc1mobile_vsat: formatNumber(getPrecenge(halfYearly1mobile_vsat, target1mobile_vsat)) + '%',
                    perc2mobile_vsat: formatNumber(getPrecenge(halfYearly2mobile_vsat, target2mobile_vsat)) + '%',
                    percmobile_vsat: formatNumber(getPrecenge(halfYearlymobile_vsat, targetmobile_vsat)) + '%',
                    halfYearly1mpip: formatNumber(halfYearly1mpip),
                    halfYearly2mpip: formatNumber(halfYearly2mpip),
                    halfYearlympip: formatNumber(halfYearlympip),
                    target1mpip: formatNumber(target1mpip),
                    target2mpip: formatNumber(target2mpip),
                    targetmpip: formatNumber(targetmpip),
                    gap1mpip: formatNumber(halfYearly1mpip - target1mpip),
                    gap2mpip: formatNumber(halfYearly2mpip - target2mpip),
                    gapmpip: formatNumber(halfYearlympip - targetmpip),
                    perc1mpip: formatNumber(getPrecenge(halfYearly1mpip, target1mpip)) + '%',
                    perc2mpip: formatNumber(getPrecenge(halfYearly2mpip, target2mpip)) + '%',
                    percmpip: formatNumber(getPrecenge(halfYearlympip, targetmpip)) + '%',
                    halfYearly1o3b: formatNumber(halfYearly1o3b),
                    halfYearly2o3b: formatNumber(halfYearly2o3b),
                    halfYearlyo3b: formatNumber(halfYearlyo3b),
                    target1o3b: formatNumber(target1o3b),
                    target2o3b: formatNumber(target2o3b),
                    targeto3b: formatNumber(targeto3b),
                    gap1o3b: formatNumber(halfYearly1o3b - target1o3b),
                    gap2o3b: formatNumber(halfYearly2o3b - target2o3b),
                    gapo3b: formatNumber(halfYearlyo3b - targeto3b),
                    perc1o3b: formatNumber(getPrecenge(halfYearly1o3b, target1o3b)) + '%',
                    perc2o3b: formatNumber(getPrecenge(halfYearly2o3b, target2o3b)) + '%',
                    perco3b: formatNumber(getPrecenge(halfYearlyo3b, targeto3b)) + '%',
                    halfYearly1ps: formatNumber(halfYearly1ps),
                    halfYearly2ps: formatNumber(halfYearly2ps),
                    halfYearlyps: formatNumber(halfYearlyps),
                    target1ps: formatNumber(target1ps),
                    target2ps: formatNumber(target2ps),
                    targetps: formatNumber(targetps),
                    gap1ps: formatNumber(halfYearly1ps - target1ps),
                    gap2ps: formatNumber(halfYearly2ps - target2ps),
                    gapps: formatNumber(halfYearlyps - targetps),
                    perc1ps: formatNumber(getPrecenge(halfYearly1ps, target1ps)) + '%',
                    perc2ps: formatNumber(getPrecenge(halfYearly2ps, target2ps)) + '%',
                    percps: formatNumber(getPrecenge(halfYearlyps, targetps)) + '%',
                    halfYearly1sr: formatNumber(halfYearly1sr),
                    halfYearly2sr: formatNumber(halfYearly2sr),
                    halfYearlysr: formatNumber(halfYearlysr),
                    target1sr: formatNumber(target1sr),
                    target2sr: formatNumber(target2sr),
                    targetsr: formatNumber(targetsr),
                    gap1sr: formatNumber(halfYearly1sr - target1sr),
                    gap2sr: formatNumber(halfYearly2sr - target2sr),
                    gapsr: formatNumber(halfYearlysr - targetsr),
                    perc1sr: formatNumber(getPrecenge(halfYearly1sr, target1sr)) + '%',
                    perc2sr: formatNumber(getPrecenge(halfYearly2sr, target2sr)) + '%',
                    percsr: formatNumber(getPrecenge(halfYearlysr, targetsr)) + '%',
                    halfYearly1hw: formatNumber(halfYearly1hw),
                    halfYearly2hw: formatNumber(halfYearly2hw),
                    halfYearlyhw: formatNumber(halfYearlyhw),
                    target1hw: formatNumber(target1hw),
                    target2hw: formatNumber(target2hw),
                    targethw: formatNumber(targethw),
                    gap1hw: formatNumber(halfYearly1hw - target1hw),
                    gap2hw: formatNumber(halfYearly2hw - target2hw),
                    gaphw: formatNumber(halfYearlyhw - targethw),
                    perc1hw: formatNumber(getPrecenge(halfYearly1hw, target1hw)) + '%',
                    perc2hw: formatNumber(getPrecenge(halfYearly2hw, target2hw)) + '%',
                    perchw: formatNumber(getPrecenge(halfYearlyhw, targethw)) + '%',
                    halfYearly1dhls_hw: formatNumber(halfYearly1dhls_hw),
                    halfYearly2dhls_hw: formatNumber(halfYearly2dhls_hw),
                    halfYearlydhls_hw: formatNumber(halfYearlydhls_hw),
                    target1dhls_hw: formatNumber(target1dhls_hw),
                    target2dhls_hw: formatNumber(target2dhls_hw),
                    targetdhls_hw: formatNumber(targetdhls_hw),
                    gap1dhls_hw: formatNumber(halfYearly1dhls_hw - target1dhls_hw),
                    gap2dhls_hw: formatNumber(halfYearly2dhls_hw - target2dhls_hw),
                    gapdhls_hw: formatNumber(halfYearlydhls_hw - targetdhls_hw),
                    perc1dhls_hw: formatNumber(getPrecenge(halfYearly1dhls_hw, target1dhls_hw)) + '%',
                    perc2dhls_hw: formatNumber(getPrecenge(halfYearly2dhls_hw, target2dhls_hw)) + '%',
                    percdhls_hw: formatNumber(getPrecenge(halfYearlydhls_hw, targetdhls_hw)) + '%',
                    halfYearly1gt: formatNumber(halfYearly1gt),
                    halfYearly2gt: formatNumber(halfYearly2gt),
                    halfYearlygt: formatNumber(halfYearlygt),
                    target1gt: formatNumber(target1gt),
                    target2gt: formatNumber(target2gt),
                    targetgt: formatNumber(targetgt),
                    gap1gt: formatNumber(halfYearly1gt - target1gt),
                    gap2gt: formatNumber(halfYearly2gt - target2gt),
                    gapgt: formatNumber(halfYearlygt - targetgt),
                    perc1gt: formatNumber(getPrecenge(halfYearly1gt, target1gt)) + '%',
                    perc2gt: formatNumber(getPrecenge(halfYearly2gt, target2gt)) + '%',
                    percgt: formatNumber(getPrecenge(halfYearlygt, targetgt)) + '%',
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearlyPf func', e)
    }
    return Results;
}
function splitDataAmountPf(data) {
    var ObjData = JSON.parse(data);
    var dataArr = [];
    for (var m = 0; m <= 11; m++) {
        dataArr.push({
            bbs: formatNumber(ObjData[m].data[8].sum),
            bod: formatNumber(ObjData[m].data[9].sum),
            cband: formatNumber(ObjData[m].data[15].sum),
            domestic: formatNumber(ObjData[m].data[10].sum),
            ip: formatNumber(ObjData[m].data[4].sum),
            iru: formatNumber(ObjData[m].data[5].sum),
            kuband: formatNumber(ObjData[m].data[16].sum),
            mobile_vsat: formatNumber(ObjData[m].data[11].sum),
            mpip: formatNumber(ObjData[m].data[6].sum),
            o3b: formatNumber(ObjData[m].data[12].sum),
            ps: formatNumber(ObjData[m].data[13].sum),
            sr: formatNumber(ObjData[m].data[14].sum),
            vas: formatNumber(ObjData[m].data[7].sum),
            hw: formatNumber(ObjData[m].data[2].sum),
            dhls_hw: formatNumber(ObjData[m].data[0].sum),
            gt: formatNumber(ObjData[m].data[1].sum),
            general: formatNumber(ObjData[m].data[17].sum),
        });
    }
    return dataArr
}
function splitDataAmountSecondPf(data) {

    var ObjData = JSON.parse(data);
    var dataArr = [];
    for (var m = 0; m <= 11; m++) {
        dataArr.push({
            bbs: ObjData[m].data[8].sum,
            bod: ObjData[m].data[9].sum,
            cband: ObjData[m].data[15].sum,
            domestic: ObjData[m].data[10].sum,
            ip: ObjData[m].data[4].sum,
            iru: ObjData[m].data[5].sum,
            kuband: ObjData[m].data[16].sum,
            mobile_vsat: ObjData[m].data[6].sum,
            mpip: ObjData[m].data[11].sum,
            o3b: ObjData[m].data[12].sum,
            ps: ObjData[m].data[13].sum,
            sr: ObjData[m].data[14].sum,
            vas: ObjData[m].data[7].sum,
            hw: ObjData[m].data[2].sum,
            dhls_hw: ObjData[m].data[0].sum,
            gt: ObjData[m].data[1].sum,
            general: ObjData[m].data[17].sum,

        });
    }

    return dataArr
}
function getProductFamilyList() {

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('name');
    columns[1] = new nlobjSearchColumn('internalid');

    //var filters = new Array();
    //filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', id)

    var search = nlapiCreateSearch('customlist_rev_rec_product_family_list', null, columns);

    var resultset = search.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    var res = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (returnSearchResults != null) {
        for (var i = 0; i < returnSearchResults.length; i++) {
            res.push({
                id: returnSearchResults[i].getValue('internalid'),
                name: returnSearchResults[i].getValue('name')
            });
        }
    }

    return res;
}
function NTR(number) {
    if (!isNullOrEmpty(number) && number != 'NaN%' && number != 'NaN') {
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
        if (number <100)
            return "red";
        else return "#2db300"
    } catch (e) {
        return  "black";
    }
}
function GCM(number , m) {
    if (isNullOrEmpty(yearDataName)) {
        yearDataName = nlapiLookupField('customlist358', yearData, 'name');
    }
    if (CurrYear < yearDataName) {
        return "black";
    }
    else if (CurrYear == yearDataName) {   
        if (m > currM) { return "black"; }
    }
    try {
        number = Number(number.substring(0, number.length - 1))
        if (number < 100)
            return "red";
        else return "#2db300"
    } catch (e) {
        return "black";
    }
}
function getGapColor(number, gap) {
    try {
        number = Number(number.substring(0, number.length - 1))
        if (number < 100)
            return "<span style='color: red'>" + gap + "</span>";
        else return "<span style='color: #2db300'>" + gap + "</span>";
    } catch (e) {
        return "<span style='color: black'>" + gap + "</span>";
    }

}
function GGC(number, gap, m) {
    if (isNullOrEmpty(yearDataName)) {
        yearDataName = nlapiLookupField('customlist358', yearData, 'name');
    }
    if (CurrYear < yearDataName) {
        return "<span style='color: black'>" + gap + "</span>";
    }
    else if (CurrYear == yearDataName) {   
        if (m > currM) { return "<span style='color: black'>" + gap + "</span>"; }
    }
    try {
        number = Number(number.substring(0, number.length - 1))
        if (number < 100)
            return "<span style='color: red'>" + gap + "</span>";
        else return "<span style='color: #2db300'>" + gap + "</span>";
    } catch (e) {
        return "<span style='color: black'>" + gap + "</span>";
    }

}
function addTotalLines(resultsSubList, line, ActualTotal, TargetlTotal, GAPTotal) {
    resultsSubList.setLineItemValue('custpage_n', line, 'Total');
    resultsSubList.setLineItemValue('custpage_p', line, 'Actual');
    resultsSubList.setLineItemValue('custpage_total_t', line, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%',formatNumberTotal(parseInt(ActualTotal))))
    resultsSubList.setLineItemValue('custpage_total', line, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%',formatNumberTotal(parseInt(ActualTotal))))
    resultsSubList.setLineItemValue('custpage_m1', line, GGC(formatNumberPrecent(getPrecenge(total1, target1)) + '%', formatNumberTotal(parseInt(total1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line, GGC(formatNumberPrecent(getPrecenge(total2, target2)) + '%', formatNumberTotal(parseInt(total2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line, GGC(formatNumberPrecent(getPrecenge(total3, target3)) + '%', formatNumberTotal(parseInt(total3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line, GGC(formatNumberPrecent(getPrecenge(total4, target4)) + '%', formatNumberTotal(parseInt(total4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line, GGC(formatNumberPrecent(getPrecenge(total5, target5)) + '%', formatNumberTotal(parseInt(total5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line, GGC(formatNumberPrecent(getPrecenge(total6, target6)) + '%', formatNumberTotal(parseInt(total6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line, GGC(formatNumberPrecent(getPrecenge(total7, target7)) + '%', formatNumberTotal(parseInt(total7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line, GGC(formatNumberPrecent(getPrecenge(total8, target8)) + '%', formatNumberTotal(parseInt(total8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line, GGC(formatNumberPrecent(getPrecenge(total9, target9)) + '%', formatNumberTotal(parseInt(total9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line, GGC(formatNumberPrecent(getPrecenge(total10, target10)) + '%', formatNumberTotal(parseInt(total10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line, GGC(formatNumberPrecent(getPrecenge(total11, target11)) + '%', formatNumberTotal(parseInt(total11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line, GGC(formatNumberPrecent(getPrecenge(total12, target12)) + '%', formatNumberTotal(parseInt(total12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly1, totaltargetquoarterly1)) + '%',formatNumberTotal(parseInt(totalquoarterly1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly2, totaltargetquoarterly2)) + '%',formatNumberTotal(parseInt(totalquoarterly2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly3, totaltargetquoarterly3)) + '%',formatNumberTotal(parseInt(totalquoarterly3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly4, totaltargetquoarterly4)) + '%', formatNumberTotal(parseInt(totalquoarterly4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly1, totaltargethalfYearly1)) + '%',formatNumberTotal(parseInt(totalhalfYearly1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly2, totaltargethalfYearly2)) + '%',formatNumberTotal(parseInt(totalhalfYearly2))))

    // line 2 
    resultsSubList.setLineItemValue('custpage_n', line + 1, '');
    resultsSubList.setLineItemValue('custpage_p', line + 1, 'Target');
    resultsSubList.setLineItemValue('custpage_total_t', line + 1, formatNumberTotal(parseInt(TargetlTotal)))
    resultsSubList.setLineItemValue('custpage_total', line + 1, formatNumberTotal(parseInt(TargetlTotal)))
    resultsSubList.setLineItemValue('custpage_m1', line + 1, formatNumberTotal(parseInt(target1)))
    resultsSubList.setLineItemValue('custpage_m2', line + 1, formatNumberTotal(parseInt(target2)))
    resultsSubList.setLineItemValue('custpage_m3', line + 1, formatNumberTotal(parseInt(target3)))
    resultsSubList.setLineItemValue('custpage_m4', line + 1, formatNumberTotal(parseInt(target4)))
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
    resultsSubList.setLineItemValue('custpage_m1', line + 2, formatNumberPrecent(getPrecenge(total1, target1)) + '%')
    resultsSubList.setLineItemValue('custpage_m2', line + 2, formatNumberPrecent(getPrecenge(total2, target2)) + '%')
    resultsSubList.setLineItemValue('custpage_m3', line + 2, formatNumberPrecent(getPrecenge(total3, target3)) + '%')
    resultsSubList.setLineItemValue('custpage_m4', line + 2, formatNumberPrecent(getPrecenge(total4, target4)) + '%')
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
    resultsSubList.setLineItemValue('custpage_total_t', line + 3, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%',formatNumberTotal(parseInt(GAPTotal))))
    resultsSubList.setLineItemValue('custpage_total', line + 3, getGapColor(formatNumberPrecent(getPrecenge(ActualTotal, TargetlTotal)) + '%',formatNumberTotal(parseInt(GAPTotal))))
    resultsSubList.setLineItemValue('custpage_m1', line + 3, GGC(formatNumberPrecent(getPrecenge(total1, target1)) + '%',formatNumberTotal(parseInt(gap1)),1))
    resultsSubList.setLineItemValue('custpage_m2', line + 3, GGC(formatNumberPrecent(getPrecenge(total2, target2)) + '%', formatNumberTotal(parseInt(gap2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line + 3, GGC(formatNumberPrecent(getPrecenge(total3, target3)) + '%', formatNumberTotal(parseInt(gap3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line + 3, GGC(formatNumberPrecent(getPrecenge(total4, target4)) + '%', formatNumberTotal(parseInt(gap4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line + 3, GGC(formatNumberPrecent(getPrecenge(total5, target5)) + '%', formatNumberTotal(parseInt(gap5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line + 3, GGC(formatNumberPrecent(getPrecenge(total6, target6)) + '%', formatNumberTotal(parseInt(gap6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line + 3, GGC(formatNumberPrecent(getPrecenge(total7, target7)) + '%', formatNumberTotal(parseInt(gap7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line + 3, GGC(formatNumberPrecent(getPrecenge(total8, target8)) + '%', formatNumberTotal(parseInt(gap8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line + 3, GGC(formatNumberPrecent(getPrecenge(total9, target9)) + '%', formatNumberTotal(parseInt(gap9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line + 3, GGC(formatNumberPrecent(getPrecenge(total10, target10)) + '%', formatNumberTotal(parseInt(gap10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line + 3, GGC(formatNumberPrecent(getPrecenge(total11, target11)) + '%', formatNumberTotal(parseInt(gap11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line + 3, GGC(formatNumberPrecent(getPrecenge(total12, target12)) + '%', formatNumberTotal(parseInt(gap12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly1, totaltargetquoarterly1)) + '%',formatNumberTotal(parseInt(totalgapquoarterly1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly2, totaltargetquoarterly2)) + '%',formatNumberTotal(parseInt(totalgapquoarterly2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly3, totaltargetquoarterly3)) + '%',formatNumberTotal(parseInt(totalgapquoarterly3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalquoarterly4, totaltargetquoarterly4)) + '%',formatNumberTotal(parseInt(totalgapquoarterly4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly1, totaltargethalfYearly1)) + '%',formatNumberTotal(parseInt(totalgaphalfYearly1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(totalhalfYearly2, totaltargethalfYearly2)) + '%',formatNumberTotal(parseInt(totalgaphalfYearly2))))

    line = line + 3;
}
function getLastDate() {
    try {
        var journalentrySearch = nlapiSearchRecord("journalentry", null,
            [
                ["type", "anyof", "Journal"],
                "AND",
                ["formulanumeric: {line}", "equalto", "0"],
                "AND",
                ["bookspecifictransaction", "is", "T"],
                "AND",
                ["isreversal", "is", "F"],
                "AND",
                ["account", "anyof", "1484"]
            ],
            [
                new nlobjSearchColumn("datecreated", null, "MAX").setSort(true)
            ]
        );
        if (journalentrySearch != null) {
            return journalentrySearch[0].getValue("datecreated", null, "MAX");
        }

        return '';
    } catch (e) {
        return '';
    }

}
function addTotalLinesPF(resultsSubList, line, total, target, gap, type, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12,tar1, tar2, tar3, tar4, tar5, tar6, tar7, tar8, tar9, tar10, tar11, tar12,gap1, gap2, gap3, gap4, gap5, gap6, gap7, gap8, gap9, gap10, gap11, gap12) {
    resultsSubList.setLineItemValue('custpage_n', line, type);
    resultsSubList.setLineItemValue('custpage_p', line, 'Actual');
    resultsSubList.setLineItemValue('custpage_total_t', line, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(total))))
    resultsSubList.setLineItemValue('custpage_total', line, getGapColor(formatNumberPrecent(getPrecenge(total, target)) + '%', formatNumberTotal(parseInt(total))))
    resultsSubList.setLineItemValue('custpage_m1', line, GGC(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(t1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line, GGC(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(t2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line, GGC(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(t3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line, GGC(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(t4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line, GGC(formatNumberPrecent(getPrecenge(t5, tar5)) + '%', formatNumberTotal(parseInt(t5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line, GGC(formatNumberPrecent(getPrecenge(t6, tar6)) + '%', formatNumberTotal(parseInt(t6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line, GGC(formatNumberPrecent(getPrecenge(t7, tar7)) + '%', formatNumberTotal(parseInt(t7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line, GGC(formatNumberPrecent(getPrecenge(t8, tar8)) + '%', formatNumberTotal(parseInt(t8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line, GGC(formatNumberPrecent(getPrecenge(t9, tar9)) + '%', formatNumberTotal(parseInt(t9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line, GGC(formatNumberPrecent(getPrecenge(t10, tar10)) + '%', formatNumberTotal(parseInt(t10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line, GGC(formatNumberPrecent(getPrecenge(t11, tar11)) + '%', formatNumberTotal(parseInt(t11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line, GGC(formatNumberPrecent(getPrecenge(t12, tar12)) + '%', formatNumberTotal(parseInt(t12)), 12))
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
    resultsSubList.setLineItemValue('custpage_m1', line + 3, GGC(formatNumberPrecent(getPrecenge(total1, target1)) + '%', formatNumberTotal(parseInt(gap1)), 1))
    resultsSubList.setLineItemValue('custpage_m2', line + 3, GGC(formatNumberPrecent(getPrecenge(total2, target2)) + '%', formatNumberTotal(parseInt(gap2)), 2))
    resultsSubList.setLineItemValue('custpage_m3', line + 3, GGC(formatNumberPrecent(getPrecenge(total3, target3)) + '%', formatNumberTotal(parseInt(gap3)), 3))
    resultsSubList.setLineItemValue('custpage_m4', line + 3, GGC(formatNumberPrecent(getPrecenge(total4, target4)) + '%', formatNumberTotal(parseInt(gap4)), 4))
    resultsSubList.setLineItemValue('custpage_m5', line + 3, GGC(formatNumberPrecent(getPrecenge(total5, target5)) + '%', formatNumberTotal(parseInt(gap5)), 5))
    resultsSubList.setLineItemValue('custpage_m6', line + 3, GGC(formatNumberPrecent(getPrecenge(total6, target6)) + '%', formatNumberTotal(parseInt(gap6)), 6))
    resultsSubList.setLineItemValue('custpage_m7', line + 3, GGC(formatNumberPrecent(getPrecenge(total7, target7)) + '%', formatNumberTotal(parseInt(gap7)), 7))
    resultsSubList.setLineItemValue('custpage_m8', line + 3, GGC(formatNumberPrecent(getPrecenge(total8, target8)) + '%', formatNumberTotal(parseInt(gap8)), 8))
    resultsSubList.setLineItemValue('custpage_m9', line + 3, GGC(formatNumberPrecent(getPrecenge(total9, target9)) + '%', formatNumberTotal(parseInt(gap9)), 9))
    resultsSubList.setLineItemValue('custpage_m10', line + 3, GGC(formatNumberPrecent(getPrecenge(total10, target10)) + '%', formatNumberTotal(parseInt(gap10)), 10))
    resultsSubList.setLineItemValue('custpage_m11', line + 3, GGC(formatNumberPrecent(getPrecenge(total11, target11)) + '%', formatNumberTotal(parseInt(gap11)), 11))
    resultsSubList.setLineItemValue('custpage_m12', line + 3, GGC(formatNumberPrecent(getPrecenge(total12, target12)) + '%', formatNumberTotal(parseInt(gap12)), 12))
    resultsSubList.setLineItemValue('custpage_quoarterly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(gap1))))
    resultsSubList.setLineItemValue('custpage_quoarterly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(gap2))))
    resultsSubList.setLineItemValue('custpage_quoarterly3', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t3, tar3)) + '%', formatNumberTotal(parseInt(gap3))))
    resultsSubList.setLineItemValue('custpage_quoarterly4', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t4, tar4)) + '%', formatNumberTotal(parseInt(gap4))))
    resultsSubList.setLineItemValue('custpage_half_yearly1', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t1, tar1)) + '%', formatNumberTotal(parseInt(gap1))))
    resultsSubList.setLineItemValue('custpage_half_yearly2', line + 3, getGapColor(formatNumberPrecent(getPrecenge(t2, tar2)) + '%', formatNumberTotal(parseInt(gap2))))


    line = line + 3;

}
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
function createForm() {
    form = nlapiCreateForm('Revenue Target Vs. Actual');
    form.addSubmitButton('Submit');
    form.addFieldGroup('custpage_d', 'Details');
    var date = form.addField("custpage_last_date", "inlinehtml", "", null, 'custpage_d');
    date.setDefaultValue('<font size="3"><p style="color:blue;font-size:3"><b>Last Revenue Recognition : ' + getLastDate() + '<br></b></p>');
    var sales = form.addField('custpage_ilo_multi_sales', 'multiselect', 'SALES REP', 'employee', 'custpage_d');
    salesData = request.getParameter('custpage_ilo_multi_sales');
    sales.setDefaultValue(salesData);
    var type = form.addField('custpage_ilo_type', 'select', 'TYPE', 'customlist_mounth_type', 'custpage_d')
    type.setMandatory(true);
    type.setDefaultValue(request.getParameter('custpage_ilo_type'));
    var year = form.addField('custpage_ilo_year', 'select', 'Year List', 'customlist358', 'custpage_d')
    year.setMandatory(true);
    yearData = request.getParameter('custpage_ilo_year');
    year.setDefaultValue(yearData)
    var fss_mss = form.addField('custpage_fss_mss', 'select', 'SALES DIVISION MANAGER', 'customlist369', 'custpage_d')
    fss_mssData = request.getParameter('custpage_fss_mss');
    fss_mss.setDefaultValue(fss_mssData);
    var sales_dep_man = form.addField('custpage_sales_dep_man', 'select', 'SALES DEPARTMENT MANAGER ', null, 'custpage_d')
    sales_dep_manData = request.getParameter('custpage_sales_dep_man');
    var selectValues = SALESDEPARTMENTMANAGER();
    sales_dep_man.addSelectOption('', '');
    for (var i = 0; i < selectValues.length; i++) {
        if (sales_dep_manData == selectValues[i].id) {
            sales_dep_man.addSelectOption(selectValues[i].id, selectValues[i].name, true);
        } else {
            sales_dep_man.addSelectOption(selectValues[i].id, selectValues[i].name);
        }
    }
    var sales_team_man = form.addField('custpage_sales_team_man', 'select', 'SALES TEAM MANAGER ', null, 'custpage_d')
    sales_team_manData = request.getParameter('custpage_sales_team_man');
    var sales_team_manList = SALESTEAMMANAGER();
    sales_team_man.addSelectOption('', '');
    for (var i = 0; i < sales_team_manList.length; i++) {
        if (sales_team_manData == sales_team_manList[i].id) {
            sales_team_man.addSelectOption(sales_team_manList[i].id, sales_team_manList[i].name, true);
        } else {
            sales_team_man.addSelectOption(sales_team_manList[i].id, sales_team_manList[i].name);
        }
    }
    var dimension = form.addField('custpage_dimension', 'select', 'Dimension', 'customlist_dimension_list', 'custpage_d')
    dimensionData = request.getParameter('custpage_dimension');
    dimension.setDefaultValue(dimensionData)
    var from_mounth = form.addField('custpage_from_mounth', 'select', 'FROM', 'customlistmounth_list', 'custpage_d')
    from_mounthData = request.getParameter('custpage_from_mounth');
    if (isNullOrEmpty(from_mounthData)) { from_mounthData = '1' }
    from_mounth.setDefaultValue(from_mounthData);
    var to_mounth = form.addField('custpage_to_mounth', 'select', 'TO', 'customlistmounth_list', 'custpage_d')
    to_mounthData = request.getParameter('custpage_to_mounth');
    if (isNullOrEmpty(to_mounthData)) { to_mounthData = '12' }
    to_mounth.setDefaultValue(to_mounthData);
    form.setScript('customscript_target_client');
    form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
}
