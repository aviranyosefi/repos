var ActualTotal = 0;
var TargetlTotal = 0;
var GAPTotal = 0;
var pfToHidde = [];
var ProductFamilyList;
var ProductFamilyList2;

var line = 0;
var TotalPerPf = [];
function target_screen(request, response) {
    createForm();
    nlapiLogExecution('DEBUG', 'salesData: ' + salesData + ', Type: ' + request.getParameter('custpage_ilo_type'), 'yearData: ' + yearData + ', fss_mssData: ' + fss_mssData + ', dimensionData: ' + dimensionData);
    if (request.getParameter('custpage_dimension') == '') {
        pfToHidde = getPFLIST(yearData)
        nlapiLogExecution('DEBUG', 'pfToHidde ' + pfToHidde.length, JSON.stringify(pfToHidde))
        ProductFamilyList2 = getProductFamilyList(pfToHidde);
        //ProductFamilyList2 = getProductFamilyList2();
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_p', 'text', '')
            for (var h = from_mounthData - 1; h < to_mounthData; h++) {
                s.addField('custpage_m' + parseInt((h + 1)), 'text', months[h]);
            }
            s.addField('custpage_total_t', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargets(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                var total = 0;
                var totaltarget = 0;
                var gaptotal = 0;
                line = (i * 4) + 1;
                for (var m = 0; m < 4; m++) {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var m1 = "<a style='color:" + GCM(re[i].perc1 , 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + "'" + 'target="_blank" >' + re[i].mounth1 + "</a>";
                        var m2 = "<a style='color:" + GCM(re[i].perc2, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth2 + "</a>";
                        var m3 = "<a style='color:" + GCM(re[i].perc3, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth3 + "</a>";
                        var m4 = "<a style='color:" + GCM(re[i].perc4, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth4 + "</a>";
                        var m5 = "<a style='color:" + GCM(re[i].perc5, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth5 + "</a>";
                        var m6 = "<a style='color:" + GCM(re[i].perc6, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth6 + "</a>";
                        var m7 = "<a style='color:" + GCM(re[i].perc7, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth7 + "</a>";
                        var m8 = "<a style='color:" + GCM(re[i].perc8, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth8 + "</a>";
                        var m9 = "<a style='color:" + GCM(re[i].perc9, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth9 + "</a>";
                        var m10 = "<a style='color:" + GCM(re[i].perc10, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth10 + "</a>";
                        var m11 = "<a style='color:" + GCM(re[i].perc11, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth11 + "</a>";
                        var m12 = "<a style='color:" + GCM(re[i].perc12, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].mounth12 + "</a>";             
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h])
                            totaltarget += NTR(re[i]["target" + h])
                            gaptotal += NTR(re[i]["gap" + h])
                        }
                        s.setLineItemValue('custpage_m1', line, m1)
                        s.setLineItemValue('custpage_m2', line, m2)
                        s.setLineItemValue('custpage_m3', line, m3)
                        s.setLineItemValue('custpage_m4', line, m4)
                        s.setLineItemValue('custpage_m5', line, m5)
                        s.setLineItemValue('custpage_m6', line, m6)
                        s.setLineItemValue('custpage_m7', line, m7)
                        s.setLineItemValue('custpage_m8', line, m8)
                        s.setLineItemValue('custpage_m9', line, m9)
                        s.setLineItemValue('custpage_m10', line, m10)
                        s.setLineItemValue('custpage_m11', line, m11)
                        s.setLineItemValue('custpage_m12', line, m12)               
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1); total7 += NTR(re[i].mounth7);
                        total2 += NTR(re[i].mounth2); total8 += NTR(re[i].mounth8);
                        total3 += NTR(re[i].mounth3); total9 += NTR(re[i].mounth9);
                        total4 += NTR(re[i].mounth4); total10 += NTR(re[i].mounth10);
                        total5 += NTR(re[i].mounth5); total11 += NTR(re[i].mounth11);
                        total6 += NTR(re[i].mounth6); total12 += NTR(re[i].mounth12);                   
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))

                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            //nlapiLogExecution('DEBUG', 'from_mounthData: ' + from_mounthData + ', to_mounthData: ' + to_mounthData,'' );              
                           
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1)
                            s.setLineItemValue('custpage_m2', line, re[i].target2)
                            s.setLineItemValue('custpage_m3', line, re[i].target3)
                            s.setLineItemValue('custpage_m4', line, re[i].target4)
                            s.setLineItemValue('custpage_m5', line, re[i].target5)
                            s.setLineItemValue('custpage_m6', line, re[i].target6)
                            s.setLineItemValue('custpage_m7', line, re[i].target7)
                            s.setLineItemValue('custpage_m8', line, re[i].target8)
                            s.setLineItemValue('custpage_m9', line, re[i].target9)
                            s.setLineItemValue('custpage_m10', line, re[i].target10)
                            s.setLineItemValue('custpage_m11', line, re[i].target11)
                            s.setLineItemValue('custpage_m12', line, re[i].target12)
                            //s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1T += NTR(re[i].target1); target7 += NTR(re[i].target7);
                            target2T += NTR(re[i].target2); target8 += NTR(re[i].target8);
                            target3T += NTR(re[i].target3); target9 += NTR(re[i].target9);
                            target4T += NTR(re[i].target4); target10 += NTR(re[i].target10);
                            target5 += NTR(re[i].target5); target11 += NTR(re[i].target11);
                            target6 += NTR(re[i].target6); target12 += NTR(re[i].target12);

                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12)
                            //s.setLineItemValue('custpage_total', line, re[i].totalperc)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                        }
                        else {
                         
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1, re[i].gap1 ,1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2, re[i].gap2, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3, re[i].gap3, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4, re[i].gap4, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5, re[i].gap5, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6, re[i].gap6, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7, re[i].gap7, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8, re[i].gap8, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9, re[i].gap9, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10, re[i].gap10, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11, re[i].gap11, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12, re[i].gap12, 12))
                            //s.setLineItemValue('custpage_total', line, re[i].totalgap)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1); gap7 += NTR(re[i].gap7);
                            gap2 += NTR(re[i].gap2); gap8 += NTR(re[i].gap8);
                            gap3 += NTR(re[i].gap3); gap9 += NTR(re[i].gap9);
                            gap4 += NTR(re[i].gap4); gap10 += NTR(re[i].gap10);
                            gap5 += NTR(re[i].gap5); gap11 += NTR(re[i].gap11);
                            gap6 += NTR(re[i].gap6); gap12 += NTR(re[i].gap12);

                        }
                    }
                    line = line + 1;
                }
            }
        } //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_quoarterly1', 'text', 'Q1');
            s.addField('custpage_quoarterly2', 'text', 'Q2');
            s.addField('custpage_quoarterly3', 'text', 'Q3');
            s.addField('custpage_quoarterly4', 'text', 'Q4');
            s.addField('custpage_total', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargetsQuoartly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * 4) + 1;
                for (var m = 0; m < 4; m++) {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var quoarterly1 = "<a style='color:" + getColor(re[i].perc1) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].quoarterly1 + "</a>";
                        var quoarterly2 = "<a style='color:" + getColor(re[i].perc2) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].quoarterly2 + "</a>";
                        var quoarterly3 = "<a style='color:" + getColor(re[i].perc3) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].quoarterly3 + "</a>";
                        var quoarterly4 = "<a style='color:" + getColor(re[i].perc4) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].quoarterly4 + "</a>";
                        s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                        s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                        s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                        s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                        s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc, re[i].totalquoarterly))
                        ActualTotal += NTR(re[i].totalquoarterly);
                        totalquoarterly1 += NTR(re[i].quoarterly1); totalquoarterly2 += NTR(re[i].quoarterly2);
                        totalquoarterly3 += NTR(re[i].quoarterly3); totalquoarterly4 += NTR(re[i].quoarterly4);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_quoarterly1', line, re[i].target1)
                            s.setLineItemValue('custpage_quoarterly2', line, re[i].target2)
                            s.setLineItemValue('custpage_quoarterly3', line, re[i].target3)
                            s.setLineItemValue('custpage_quoarterly4', line, re[i].target4)
                            s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                            TargetlTotal += NTR(re[i].totaltarget);
                            totaltargetquoarterly1 += NTR(re[i].target1); totaltargetquoarterly2 += NTR(re[i].target2);
                            totaltargetquoarterly3 += NTR(re[i].target3); totaltargetquoarterly4 += NTR(re[i].target4);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1)
                            s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2)
                            s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3)
                            s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4)
                            s.setLineItemValue('custpage_total', line, re[i].totalperc)
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1,re[i].gap1))
                            s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2,re[i].gap2))
                            s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3 ,re[i].gap3))
                            s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4,re[i].gap4))
                            s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc, re[i].totalgap))
                            GAPTotal += NTR(re[i].totalgap);
                            totalgapquoarterly1 += NTR(re[i].gap1); totalgapquoarterly2 += NTR(re[i].gap2);
                            totalgapquoarterly3 += NTR(re[i].gap3); totalgapquoarterly4 += NTR(re[i].gap4);
                        }
                    }
                    line = line + 1;
                }
            }
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_half_yearly1', 'text', 'H1');
            s.addField('custpage_half_yearly2', 'text', 'H2');
            s.addField('custpage_total', 'text', 'TOTAL');

            var line = 0;
            var re = SalesRepTargetsHalfYearly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * 4) + 1;
                for (var m = 0; m < 4; m++) {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var half_yearly1 = "<a style='color:" + getColor(re[i].perc1) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].halfYearly1 + "</a>";
                        var half_yearly2 = "<a style='color:" + getColor(re[i].perc2) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + "'" + 'target="_blank">' + re[i].halfYearly2 + "</a>";

                        s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                        s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                        s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc, re[i].totalhalfYearly))
                        ActualTotal += NTR(re[i].totalhalfYearly);
                        totalhalfYearly1 += NTR(re[i].halfYearly1)
                        totalhalfYearly2 += NTR(re[i].halfYearly2)


                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_half_yearly1', line, re[i].target1)
                            s.setLineItemValue('custpage_half_yearly2', line, re[i].target2)
                            s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                            TargetlTotal += NTR(re[i].totaltarget);
                            totaltargethalfYearly1 += NTR(re[i].target1)
                            totaltargethalfYearly2 += NTR(re[i].target2)

                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1)
                            s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2)
                            s.setLineItemValue('custpage_total', line, re[i].totalperc)

                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1, re[i].gap1))
                            s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2 ,re[i].gap2))
                            s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc , re[i].totalgap))
                            GAPTotal += NTR(re[i].totalgap);
                            totalgaphalfYearly1 += NTR(re[i].gap1)
                            totalgaphalfYearly2 += NTR(re[i].gap2)

                        }
                    }
                    line = line + 1;
                }
            }
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
    }
    else if (request.getParameter('custpage_dimension') == '1') {
        var classes = ['D&HLS Service', 'HW (D&HLS &FSS)', 'Internet Connectivity']
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_c', 'text', '')
            s.addField('custpage_p', 'text', '')
            for (var h = from_mounthData - 1; h < to_mounthData; h++) {
                s.addField('custpage_m' + parseInt((h + 1)), 'text', months[h]);
            }
            s.addField('custpage_total', 'text', 'TOTAL').setDisplayType('hidden');
            s.addField('custpage_total_t', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargetsClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {

                line = (i * 12) + 1;
                for (z = 0; z < classes.length; z++) {
                    var total = 0;
                    var totaltarget = 0;
                    var gaptotal = 0;
                    for (var m = 0; m < 4; m++) {
                        if (z == 0) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var mounth1 = "<a style='color:" + GCM(re[i].perc1,1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth1 + "</a>";
                                var mounth2 = "<a style='color:" + GCM(re[i].perc2, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth2 + "</a>";
                                var mounth3 = "<a style='color:" + GCM(re[i].perc3, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth3 + "</a>";
                                var mounth4 = "<a style='color:" + GCM(re[i].perc4, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&dim=2' + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth4 + "</a>";
                                var mounth5 = "<a style='color:" + GCM(re[i].perc5, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth5 + "</a>";
                                var mounth6 = "<a style='color:" + GCM(re[i].perc6, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth6 + "</a>";
                                var mounth7 = "<a style='color:" + GCM(re[i].perc7, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth7 + "</a>";
                                var mounth8 = "<a style='color:" + GCM(re[i].perc8, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth8 + "</a>";
                                var mounth9 = "<a style='color:" + GCM(re[i].perc9, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth9 + "</a>";
                                var mounth10 = "<a style='color:" + GCM(re[i].perc10, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&dim=2' + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth10 + "</a>";
                                var mounth11 = "<a style='color:" + GCM(re[i].perc11, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth11 + "</a>";
                                var mounth12 = "<a style='color:" + GCM(re[i].perc12, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth12 + "</a>";

                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                    total += NTR(re[i]["mounth" + h])
                                    totaltarget += NTR(re[i]["target" + h])
                                    gaptotal += NTR(re[i]["gap" + h]);
                                    var sumHLS = NTR(re[i]["mounth" + h])
                                    var targetHLS = NTR(re[i]["target" + h])
                                }

                                s.setLineItemValue('custpage_m1', line, mounth1)
                                s.setLineItemValue('custpage_m2', line, mounth2)
                                s.setLineItemValue('custpage_m3', line, mounth3)
                                s.setLineItemValue('custpage_m4', line, mounth4)
                                s.setLineItemValue('custpage_m5', line, mounth5)
                                s.setLineItemValue('custpage_m6', line, mounth6)
                                s.setLineItemValue('custpage_m7', line, mounth7)
                                s.setLineItemValue('custpage_m8', line, mounth8)
                                s.setLineItemValue('custpage_m9', line, mounth9)
                                s.setLineItemValue('custpage_m10', line, mounth10)
                                s.setLineItemValue('custpage_m11', line, mounth11)
                                s.setLineItemValue('custpage_m12', line, mounth12)
                                //s.setLineItemValue('custpage_total', line, re[i].totalmount)
                                s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%',formatNumber(total.toFixed(2))))
                                ActualTotal += total;
                                total1 += NTR(re[i].mounth1); total7 += NTR(re[i].mounth7);
                                total2 += NTR(re[i].mounth2); total8 += NTR(re[i].mounth8);
                                total3 += NTR(re[i].mounth3); total9 += NTR(re[i].mounth9);
                                total4 += NTR(re[i].mounth4); total10 += NTR(re[i].mounth10);
                                total5 += NTR(re[i].mounth5); total11 += NTR(re[i].mounth11);
                                total6 += NTR(re[i].mounth6); total12 += NTR(re[i].mounth12);

                            } else {
                                if (m == 1) {
                                    s.setLineItemValue('custpage_n', line, '');
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].target1)
                                    s.setLineItemValue('custpage_m2', line, re[i].target2)
                                    s.setLineItemValue('custpage_m3', line, re[i].target3)
                                    s.setLineItemValue('custpage_m4', line, re[i].target4)
                                    s.setLineItemValue('custpage_m5', line, re[i].target5)
                                    s.setLineItemValue('custpage_m6', line, re[i].target6)
                                    s.setLineItemValue('custpage_m7', line, re[i].target7)
                                    s.setLineItemValue('custpage_m8', line, re[i].target8)
                                    s.setLineItemValue('custpage_m9', line, re[i].target9)
                                    s.setLineItemValue('custpage_m10', line, re[i].target10)
                                    s.setLineItemValue('custpage_m11', line, re[i].target11)
                                    s.setLineItemValue('custpage_m12', line, re[i].target12)
                                    //s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                                    TargetlTotal += totaltarget;
                                    target1T += NTR(re[i].target1); target7 += NTR(re[i].target7);
                                    target2T += NTR(re[i].target2); target8 += NTR(re[i].target8);
                                    target3T += NTR(re[i].target3); target9 += NTR(re[i].target9);
                                    target4T += NTR(re[i].target4); target10 += NTR(re[i].target10);
                                    target5 += NTR(re[i].target5); target11 += NTR(re[i].target11);
                                    target6 += NTR(re[i].target6); target12 += NTR(re[i].target12);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].perc1)
                                    s.setLineItemValue('custpage_m2', line, re[i].perc2)
                                    s.setLineItemValue('custpage_m3', line, re[i].perc3)
                                    s.setLineItemValue('custpage_m4', line, re[i].perc4)
                                    s.setLineItemValue('custpage_m5', line, re[i].perc5)
                                    s.setLineItemValue('custpage_m6', line, re[i].perc6)
                                    s.setLineItemValue('custpage_m7', line, re[i].perc7)
                                    s.setLineItemValue('custpage_m8', line, re[i].perc8)
                                    s.setLineItemValue('custpage_m9', line, re[i].perc9)
                                    s.setLineItemValue('custpage_m10', line, re[i].perc10)
                                    s.setLineItemValue('custpage_m11', line, re[i].perc11)
                                    s.setLineItemValue('custpage_m12', line, re[i].perc12)
                                    //s.setLineItemValue('custpage_total', line, re[i].totalperc)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1,re[i].gap1,1))
                                    s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2, re[i].gap2, 2))
                                    s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3, re[i].gap3, 3))
                                    s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4, re[i].gap4, 4))
                                    s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5, re[i].gap5, 5))
                                    s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6, re[i].gap6, 6))
                                    s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7, re[i].gap7, 7))
                                    s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8, re[i].gap8, 8))
                                    s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9, re[i].gap9, 9))
                                    s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10, re[i].gap10, 10))
                                    s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11, re[i].gap11, 11))
                                    s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12, re[i].gap12, 12))
                                    s.setLineItemValue('custpage_total', line, re[i].totalgap)
                                    s.setLineItemValue('custpage_total_t', line, getGapColor(re[i].totalperc,formatNumber(gaptotal.toFixed(2))))
                                    GAPTotal += gaptotal;
                                    gap1 += NTR(re[i].gap1); gap7 += NTR(re[i].gap7);
                                    gap2 += NTR(re[i].gap2); gap8 += NTR(re[i].gap8);
                                    gap3 += NTR(re[i].gap3); gap9 += NTR(re[i].gap9);
                                    gap4 += NTR(re[i].gap4); gap10 += NTR(re[i].gap10);
                                    gap5 += NTR(re[i].gap5); gap11 += NTR(re[i].gap11);
                                    gap6 += NTR(re[i].gap6); gap12 += NTR(re[i].gap12);

                                }
                            }
                            line = line + 1;
                        } // z==0
                        else if (z == 1) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var mounth1 = "<a style='color:" + GCM(re[i].perc1sumOfHW,1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth1sumOfHW + "</a>";
                                var mounth2 = "<a style='color:" + GCM(re[i].perc2sumOfHW,2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth2sumOfHW + "</a>";
                                var mounth3 = "<a style='color:" + GCM(re[i].perc3sumOfHW,3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth3sumOfHW + "</a>";
                                var mounth4 = "<a style='color:" + GCM(re[i].perc4sumOfHW,4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth4sumOfHW + "</a>";
                                var mounth5 = "<a style='color:" + GCM(re[i].perc5sumOfHW, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth5sumOfHW + "</a>";
                                var mounth6 = "<a style='color:" + GCM(re[i].perc6sumOfHW, 6) + "'" + "  href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth6sumOfHW + "</a>";
                                var mounth7 = "<a style='color:" + GCM(re[i].perc7sumOfHW, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth7sumOfHW + "</a>";
                                var mounth8 = "<a style='color:" + GCM(re[i].perc8sumOfHW, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth8sumOfHW + "</a>";
                                var mounth9 = "<a style='color:" + GCM(re[i].perc9sumOfHW, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth9sumOfHW + "</a>";
                                var mounth10 = "<a style='color:" + GCM(re[i].perc10sumOfHW, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth10sumOfHW + "</a>";
                                var mounth11 = "<a style='color:" + GCM(re[i].perc11sumOfHW, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth11sumOfHW + "</a>";
                                var mounth12 = "<a style='color:" + GCM(re[i].perc12sumOfHW, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].mounth12sumOfHW + "</a>";

                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                    total += NTR(re[i]["mounth" + h + "sumOfHW"])
                                    totaltarget += NTR(re[i]["target" + h + "sumOfHW"])
                                    gaptotal += NTR(re[i]["gap" + h + "sumOfHW"])
                                }   
                                s.setLineItemValue('custpage_m1', line, mounth1)
                                s.setLineItemValue('custpage_m2', line, mounth2)
                                s.setLineItemValue('custpage_m3', line, mounth3)
                                s.setLineItemValue('custpage_m4', line, mounth4)
                                s.setLineItemValue('custpage_m5', line, mounth5)
                                s.setLineItemValue('custpage_m6', line, mounth6)
                                s.setLineItemValue('custpage_m7', line, mounth7)
                                s.setLineItemValue('custpage_m8', line, mounth8)
                                s.setLineItemValue('custpage_m9', line, mounth9)
                                s.setLineItemValue('custpage_m10', line, mounth10)
                                s.setLineItemValue('custpage_m11', line, mounth11)
                                s.setLineItemValue('custpage_m12', line, mounth12)
                                s.setLineItemValue('custpage_total', line, re[i].totalsumOfHW)
                                s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%',formatNumber(total.toFixed(2))))
                                ActualTotal += total;
                                total1 += NTR(re[i].mounth1sumOfHW); total7 += NTR(re[i].mounth7sumOfHW);
                                total2 += NTR(re[i].mounth2sumOfHW); total8 += NTR(re[i].mounth8sumOfHW);
                                total3 += NTR(re[i].mounth3sumOfHW); total9 += NTR(re[i].mounth9sumOfHW);
                                total4 += NTR(re[i].mounth4sumOfHW); total10 += NTR(re[i].mounth10sumOfHW);
                                total5 += NTR(re[i].mounth5sumOfHW); total11 += NTR(re[i].mounth11sumOfHW);
                                total6 += NTR(re[i].mounth6sumOfHW); total12 += NTR(re[i].mounth12sumOfHW);


                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                 
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].target1sumOfHW)
                                    s.setLineItemValue('custpage_m2', line, re[i].target2sumOfHW)
                                    s.setLineItemValue('custpage_m3', line, re[i].target3sumOfHW)
                                    s.setLineItemValue('custpage_m4', line, re[i].target4sumOfHW)
                                    s.setLineItemValue('custpage_m5', line, re[i].target5sumOfHW)
                                    s.setLineItemValue('custpage_m6', line, re[i].target6sumOfHW)
                                    s.setLineItemValue('custpage_m7', line, re[i].target7sumOfHW)
                                    s.setLineItemValue('custpage_m8', line, re[i].target8sumOfHW)
                                    s.setLineItemValue('custpage_m9', line, re[i].target9sumOfHW)
                                    s.setLineItemValue('custpage_m10', line, re[i].target10sumOfHW)
                                    s.setLineItemValue('custpage_m11', line, re[i].target11sumOfHW)
                                    s.setLineItemValue('custpage_m12', line, re[i].target12sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfHW)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                                    TargetlTotal += totaltarget;
                                    target1 += NTR(re[i].target1sumOfHW); target7 += NTR(re[i].target7sumOfHW);
                                    target2 += NTR(re[i].target2sumOfHW); target8 += NTR(re[i].target8sumOfHW);
                                    target3 += NTR(re[i].target3sumOfHW); target9 += NTR(re[i].target9sumOfHW);
                                    target4 += NTR(re[i].target4sumOfHW); target10 += NTR(re[i].target10sumOfHW);
                                    target5 += NTR(re[i].target5sumOfHW); target11 += NTR(re[i].target11sumOfHW);
                                    target6 += NTR(re[i].target6sumOfHW); target12 += NTR(re[i].target12sumOfHW);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].perc1sumOfHW)
                                    s.setLineItemValue('custpage_m2', line, re[i].perc2sumOfHW)
                                    s.setLineItemValue('custpage_m3', line, re[i].perc3sumOfHW)
                                    s.setLineItemValue('custpage_m4', line, re[i].perc4sumOfHW)
                                    s.setLineItemValue('custpage_m5', line, re[i].perc5sumOfHW)
                                    s.setLineItemValue('custpage_m6', line, re[i].perc6sumOfHW)
                                    s.setLineItemValue('custpage_m7', line, re[i].perc7sumOfHW)
                                    s.setLineItemValue('custpage_m8', line, re[i].perc8sumOfHW)
                                    s.setLineItemValue('custpage_m9', line, re[i].perc9sumOfHW)
                                    s.setLineItemValue('custpage_m10', line, re[i].perc10sumOfHW)
                                    s.setLineItemValue('custpage_m11', line, re[i].perc11sumOfHW)
                                    s.setLineItemValue('custpage_m12', line, re[i].perc12sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totalpercsumOfHW)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                                }
                                else {                              
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1sumOfHW,re[i].gap1sumOfHW,1))
                                    s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2sumOfHW, re[i].gap2sumOfHW, 2))
                                    s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3sumOfHW, re[i].gap3sumOfHW, 3))
                                    s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4sumOfHW, re[i].gap4sumOfHW, 4))
                                    s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5sumOfHW, re[i].gap5sumOfHW, 5))
                                    s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6sumOfHW, re[i].gap6sumOfHW, 6))
                                    s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7sumOfHW, re[i].gap7sumOfHW, 7))
                                    s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8sumOfHW, re[i].gap8sumOfHW, 8))
                                    s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9sumOfHW, re[i].gap9sumOfHW, 9))
                                    s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10sumOfHW, re[i].gap10sumOfHW, 10))
                                    s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11sumOfHW, re[i].gap11sumOfHW, 11))
                                    s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12sumOfHW, re[i].gap12sumOfHW, 12))
                                    s.setLineItemValue('custpage_total', line, re[i].totalgapsumOfHW)
                                    s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%',formatNumber(gaptotal.toFixed(2))))
                                    GAPTotal += gaptotal;
                                    gap1 += NTR(re[i].gap1sumOfHW); gap7 += NTR(re[i].gap7sumOfHW);
                                    gap2 += NTR(re[i].gap2sumOfHW); gap8 += NTR(re[i].gap8sumOfHW);
                                    gap3 += NTR(re[i].gap3sumOfHW); gap9 += NTR(re[i].gap9sumOfHW);
                                    gap4 += NTR(re[i].gap4sumOfHW); gap10 += NTR(re[i].gap10sumOfHW);
                                    gap5 += NTR(re[i].gap5sumOfHW); gap11 += NTR(re[i].gap11sumOfHW);
                                    gap6 += NTR(re[i].gap6sumOfHW); gap12 += NTR(re[i].gap12sumOfHW);

                                }
                            }
                            line = line + 1;

                        }
                        else { // z==3
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var mounth1 = "<a style='color:" + GCM(re[i].perc1sumOfIC, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth1sumOfIC + "</a>";
                                var mounth2 = "<a style='color:" + GCM(re[i].perc2sumOfIC, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth2sumOfIC + "</a>";
                                var mounth3 = "<a style='color:" + GCM(re[i].perc3sumOfIC, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth3sumOfIC + "</a>";
                                var mounth4 = "<a style='color:" + GCM(re[i].perc4sumOfIC, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth4sumOfIC + "</a>";
                                var mounth5 = "<a style='color:" + GCM(re[i].perc5sumOfIC, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth5sumOfIC + "</a>";
                                var mounth6 = "<a style='color:" + GCM(re[i].perc6sumOfIC, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth6sumOfIC + "</a>";
                                var mounth7 = "<a style='color:" + GCM(re[i].perc7sumOfIC, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth7sumOfIC + "</a>";
                                var mounth8 = "<a style='color:" + GCM(re[i].perc8sumOfIC, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth8sumOfIC + "</a>";
                                var mounth9 = "<a style='color:" + GCM(re[i].perc9sumOfIC, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth9sumOfIC + "</a>";
                                var mounth10 = "<a style='color:" + GCM(re[i].perc10sumOfIC, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&dim=3' + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth10sumOfIC + "</a>";
                                var mounth11 = "<a style='color:" + GCM(re[i].perc11sumOfIC, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&dim=3' + '&dim=2' + "'" + 'target="_blank">' + re[i].mounth11sumOfIC + "</a>";
                                var mounth12 = "<a style='color:" + GCM(re[i].perc12sumOfIC, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].mounth12sumOfIC + "</a>";

                                s.setLineItemValue('custpage_m1', line, mounth1)
                                s.setLineItemValue('custpage_m2', line, mounth2)
                                s.setLineItemValue('custpage_m3', line, mounth3)
                                s.setLineItemValue('custpage_m4', line, mounth4)
                                s.setLineItemValue('custpage_m5', line, mounth5)
                                s.setLineItemValue('custpage_m6', line, mounth6)
                                s.setLineItemValue('custpage_m7', line, mounth7)
                                s.setLineItemValue('custpage_m8', line, mounth8)
                                s.setLineItemValue('custpage_m9', line, mounth9)
                                s.setLineItemValue('custpage_m10', line, mounth10)
                                s.setLineItemValue('custpage_m11', line, mounth11)
                                s.setLineItemValue('custpage_m12', line, mounth12)
                                s.setLineItemValue('custpage_total', line, re[i].totalsumOfIC)
                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                    total += NTR(re[i]["mounth" + h + "sumOfIC"])
                                    totaltarget += NTR(re[i]["target" + h + "sumOfIC"])
                                    gaptotal += NTR(re[i]["gap" + h + "sumOfIC"])
                                }
                                s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%',formatNumber(total.toFixed(2))))
                                ActualTotal += total;
                                total1 += NTR(re[i].mounth1sumOfIC); total7 += NTR(re[i].mounth7sumOfIC);
                                total2 += NTR(re[i].mounth2sumOfIC); total8 += NTR(re[i].mounth8sumOfIC);
                                total3 += NTR(re[i].mounth3sumOfIC); total9 += NTR(re[i].mounth9sumOfIC);
                                total4 += NTR(re[i].mounth4sumOfIC); total10 += NTR(re[i].mounth10sumOfIC);
                                total5 += NTR(re[i].mounth5sumOfIC); total11 += NTR(re[i].mounth11sumOfIC);
                                total6 += NTR(re[i].mounth6sumOfIC); total12 += NTR(re[i].mounth12sumOfIC);

                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].target1sumOfIC)
                                    s.setLineItemValue('custpage_m2', line, re[i].target2sumOfIC)
                                    s.setLineItemValue('custpage_m3', line, re[i].target3sumOfIC)
                                    s.setLineItemValue('custpage_m4', line, re[i].target4sumOfIC)
                                    s.setLineItemValue('custpage_m5', line, re[i].target5sumOfIC)
                                    s.setLineItemValue('custpage_m6', line, re[i].target6sumOfIC)
                                    s.setLineItemValue('custpage_m7', line, re[i].target7sumOfIC)
                                    s.setLineItemValue('custpage_m8', line, re[i].target8sumOfIC)
                                    s.setLineItemValue('custpage_m9', line, re[i].target9sumOfIC)
                                    s.setLineItemValue('custpage_m10', line, re[i].target10sumOfIC)
                                    s.setLineItemValue('custpage_m11', line, re[i].target11sumOfIC)
                                    s.setLineItemValue('custpage_m12', line, re[i].target12sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfIC)
                                  
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                                    TargetlTotal += totaltarget;
                                    target1 += NTR(re[i].target1sumOfIC); target7 += NTR(re[i].target7sumOfIC);
                                    target2 += NTR(re[i].target2sumOfIC); target8 += NTR(re[i].target8sumOfIC);
                                    target3 += NTR(re[i].target3sumOfIC); target9 += NTR(re[i].target9sumOfIC);
                                    target4 += NTR(re[i].target4sumOfIC); target10 += NTR(re[i].target10sumOfIC);
                                    target5 += NTR(re[i].target5sumOfIC); target11 += NTR(re[i].target11sumOfIC);
                                    target6 += NTR(re[i].target6sumOfIC); target12 += NTR(re[i].target12sumOfIC);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_m1', line, re[i].perc1sumOfIC)
                                    s.setLineItemValue('custpage_m2', line, re[i].perc2sumOfIC)
                                    s.setLineItemValue('custpage_m3', line, re[i].perc3sumOfIC)
                                    s.setLineItemValue('custpage_m4', line, re[i].perc4sumOfIC)
                                    s.setLineItemValue('custpage_m5', line, re[i].perc5sumOfIC)
                                    s.setLineItemValue('custpage_m6', line, re[i].perc6sumOfIC)
                                    s.setLineItemValue('custpage_m7', line, re[i].perc7sumOfIC)
                                    s.setLineItemValue('custpage_m8', line, re[i].perc8sumOfIC)
                                    s.setLineItemValue('custpage_m9', line, re[i].perc9sumOfIC)
                                    s.setLineItemValue('custpage_m10', line, re[i].perc10sumOfIC)
                                    s.setLineItemValue('custpage_m11', line, re[i].perc11sumOfIC)
                                    s.setLineItemValue('custpage_m12', line, re[i].perc12sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totalgapsumOfIC)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1sumOfIC, re[i].gap1sumOfIC, 1))
                                    s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2sumOfIC, re[i].gap2sumOfIC, 2))
                                    s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3sumOfIC, re[i].gap3sumOfIC, 3))
                                    s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4sumOfIC, re[i].gap4sumOfIC, 4))
                                    s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5sumOfIC, re[i].gap5sumOfIC, 5))
                                    s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6sumOfIC, re[i].gap6sumOfIC, 6))
                                    s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7sumOfIC, re[i].gap7sumOfIC, 7))
                                    s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8sumOfIC, re[i].gap8sumOfIC, 8))
                                    s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9sumOfIC, re[i].gap9sumOfIC, 9))
                                    s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10sumOfIC, re[i].gap10sumOfIC, 10))
                                    s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11sumOfIC, re[i].gap11sumOfIC, 11))
                                    s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12sumOfIC, re[i].gap12sumOfIC, 12))
                                    s.setLineItemValue('custpage_total', line, re[i].totalgapsumOfIC)           
                                    s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%',formatNumber(gaptotal.toFixed(2))))
                                    GAPTotal += gaptotal;
                                    gap1 += NTR(re[i].gap1sumOfIC); gap7 += NTR(re[i].gap7sumOfIC);
                                    gap2 += NTR(re[i].gap2sumOfIC); gap8 += NTR(re[i].gap8sumOfIC);
                                    gap3 += NTR(re[i].gap3sumOfIC); gap9 += NTR(re[i].gap9sumOfIC);
                                    gap4 += NTR(re[i].gap4sumOfIC); gap10 += NTR(re[i].gap10sumOfIC);
                                    gap5 += NTR(re[i].gap5sumOfIC); gap11 += NTR(re[i].gap11sumOfIC);
                                    gap6 += NTR(re[i].gap6sumOfIC); gap12 += NTR(re[i].gap12sumOfIC);

                                }
                            }
                            line = line + 1;

                        }

                    }//  for (var m = 0; m < 4; m++)

                }
            }
        } //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_c', 'text', '')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_quoarterly1', 'text', 'Q1');
            s.addField('custpage_quoarterly2', 'text', 'Q2');
            s.addField('custpage_quoarterly3', 'text', 'Q3');
            s.addField('custpage_quoarterly4', 'text', 'Q4');
            s.addField('custpage_total', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargetsQuoartlyClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * 12) + 1;
                for (z = 0; z < classes.length; z++) {
                    for (var m = 0; m < 4; m++) {
                        if (z == 0) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].quoarterly1 + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].quoarterly2 + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].quoarterly3 + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].quoarterly4 + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc,re[i].totalquoarterly))
                                ActualTotal += NTR(re[i].totalquoarterly)
                                totalquoarterly1 += NTR(re[i].quoarterly1); totalquoarterly2 += NTR(re[i].quoarterly2);
                                totalquoarterly3 += NTR(re[i].quoarterly3); totalquoarterly4 += NTR(re[i].quoarterly4);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                                    TargetlTotal += NTR(re[i].totaltarget)
                                    totaltargetquoarterly1 += NTR(re[i].target1); totaltargetquoarterly2 += NTR(re[i].target2);
                                    totaltargetquoarterly3 += NTR(re[i].target3); totaltargetquoarterly4 += NTR(re[i].target4);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4)
                                    s.setLineItemValue('custpage_total', line, re[i].totalperc)

                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1,re[i].gap1))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2,re[i].gap2))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3,re[i].gap3))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4,re[i].gap4))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc, re[i].totalgap))
                                    GAPTotal += NTR(re[i].totalgap)
                                    totalgapquoarterly1 += NTR(re[i].gap1); totalgapquoarterly2 += NTR(re[i].gap2);
                                    totalgapquoarterly3 += NTR(re[i].gap3); totalgapquoarterly4 += NTR(re[i].gap4);
                                }
                            }
                            line = line + 1;
                        } // z==0
                        else if (z == 1) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly1sumOfHW + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly2sumOfHW + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly3sumOfHW + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly4sumOfHW + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalpercsumOfHW,re[i].totalquoarterlysumOfHW))
                                ActualTotal += NTR(re[i].totalquoarterlysumOfHW)
                                totalquoarterly1 += NTR(re[i].quoarterly1sumOfHW); totalquoarterly2 += NTR(re[i].quoarterly2sumOfHW);
                                totalquoarterly3 += NTR(re[i].quoarterly3sumOfHW); totalquoarterly4 += NTR(re[i].quoarterly4sumOfHW);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfHW)
                                    TargetlTotal += NTR(re[i].totaltargetsumOfHW)
                                    totaltargetquoarterly1 += NTR(re[i].target1sumOfHW); totaltargetquoarterly2 += NTR(re[i].target2sumOfHW);
                                    totaltargetquoarterly3 += NTR(re[i].target3sumOfHW); totaltargetquoarterly4 += NTR(re[i].target4sumOfHW);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3sumOfHW)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totalpercsumOfHW)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1sumOfHW,re[i].gap1sumOfHW))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2sumOfHW,re[i].gap2sumOfHW))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3sumOfHW,re[i].gap3sumOfHW))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4sumOfHW,re[i].gap4sumOfHW))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalpercsumOfHW,re[i].totalgapsumOfHW))
                                    GAPTotal += NTR(re[i].totalgapsumOfHW)
                                    totalgapquoarterly1 += NTR(re[i].gap1sumOfHW); totalgapquoarterly2 += NTR(re[i].gap2sumOfHW);
                                    totalgapquoarterly3 += NTR(re[i].gap3sumOfHW); totalgapquoarterly4 += NTR(re[i].gap4sumOfHW);
                                }
                            }
                            line = line + 1;
                        }
                        else {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly1sumOfIC + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc1sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly2sumOfIC + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc1sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly3sumOfIC + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc1sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].quoarterly4sumOfIC + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalpercsumOfIC,re[i].totalquoarterlysumOfIC))
                                ActualTotal += NTR(re[i].totalquoarterlysumOfIC)
                                totalquoarterly1 += NTR(re[i].quoarterly1sumOfIC); totalquoarterly2 += NTR(re[i].quoarterly2sumOfIC);
                                totalquoarterly3 += NTR(re[i].quoarterly1sumOfIC); totalquoarterly4 += NTR(re[i].quoarterly4sumOfIC);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfIC)
                                    TargetlTotal += NTR(re[i].totaltargetsumOfIC)
                                    totaltargetquoarterly1 += NTR(re[i].target1sumOfIC); totaltargetquoarterly2 += NTR(re[i].target2sumOfIC);
                                    totaltargetquoarterly3 += NTR(re[i].target3sumOfIC); totaltargetquoarterly4 += NTR(re[i].target4sumOfIC);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3sumOfIC)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totalpercsumOfIC)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1sumOfIC,re[i].gap1sumOfIC))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2sumOfIC,re[i].gap2sumOfIC))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3sumOfIC,re[i].gap3sumOfIC))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4sumOfIC,re[i].gap4sumOfIC))
                                    s.setLineItemValue('custpage_total', line,  getGapColor(re[i].totalpercsumOfIC,re[i].totalgapsumOfIC))
                                    GAPTotal += NTR(re[i].totalgapsumOfIC)
                                    totalgapquoarterly1 += NTR(re[i].gap1sumOfIC); totalgapquoarterly2 += NTR(re[i].gap2sumOfIC);
                                    totalgapquoarterly3 += NTR(re[i].gap3sumOfIC); totalgapquoarterly4 += NTR(re[i].gap4sumOfIC);
                                }
                            }
                            line = line + 1;

                        }
                    }
                }
            }
        }   //   if (request.getParameter('custpage_ilo_type') == '2')
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_c', 'text', '')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_half_yearly1', 'text', 'H1');
            s.addField('custpage_half_yearly2', 'text', 'H2');
            s.addField('custpage_total', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargetsHalfYearlyClass(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * 12) + 1;
                for (z = 0; z < classes.length; z++) {
                    for (var m = 0; m < 4; m++) {
                        if (z == 0) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1) + "'" + "  href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].halfYearly1 + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2) + "'" + "  href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&dim=2' + "'" + 'target="_blank">' + re[i].halfYearly2 + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc,re[i].totalhalfYearly))
                                ActualTotal += NTR(re[i].totalhalfYearly);
                                totalhalfYearly1 += NTR(re[i].halfYearly1)
                                totalhalfYearly2 += NTR(re[i].halfYearly2)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                                    TargetlTotal += NTR(re[i].totaltarget);
                                    totaltargethalfYearly1 += NTR(re[i].target1)
                                    totaltargethalfYearly2 += NTR(re[i].target2)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2)
                                    s.setLineItemValue('custpage_total', line, re[i].totalperc)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1,re[i].gap1))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2,re[i].gap2))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalperc,re[i].totalgap))
                                    GAPTotal += NTR(re[i].totalgap);
                                    totalgaphalfYearly1 += NTR(re[i].gap1)
                                    totalgaphalfYearly2 += NTR(re[i].gap2)
                                }
                            }
                            line = line + 1;
                        }
                        else if (z == 1) {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].halfYearly1sumOfHW + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2sumOfHW) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&dim=1' + "'" + 'target="_blank">' + re[i].halfYearly2sumOfHW + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totaltargetsumOfHW,re[i].totalhalfYearlysumOfHW))
                                ActualTotal += NTR(re[i].totalhalfYearlysumOfHW);
                                totalhalfYearly1 += NTR(re[i].halfYearly1sumOfHW)
                                totalhalfYearly2 += NTR(re[i].halfYearly2sumOfHW)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1sumOfHW)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfHW)
                                    TargetlTotal += NTR(re[i].totaltargetsumOfHW);
                                    totaltargethalfYearly1 += NTR(re[i].target1sumOfHW)
                                    totaltargethalfYearly2 += NTR(re[i].target2sumOfHW)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1sumOfHW)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2sumOfHW)
                                    s.setLineItemValue('custpage_total', line, re[i].totalpercsumOfHW)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1sumOfHW,re[i].gap1sumOfHW))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2sumOfHW,re[i].gap2sumOfHW))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].totaltargetsumOfHW,re[i].totalgapsumOfHW))
                                    GAPTotal += NTR(re[i].totalgapsumOfHW);
                                    totalgaphalfYearly1 += NTR(re[i].gap1sumOfHW)
                                    totalgaphalfYearly2 += NTR(re[i].gap2sumOfHW)
                                }
                            }
                            line = line + 1;
                        }
                        else {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, classes[z]);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].halfYearly1sumOfIC + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2sumOfIC) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&dim=3' + "'" + 'target="_blank">' + re[i].halfYearly2sumOfIC + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalpercsumOfIC,re[i].totalhalfYearlysumOfIC))
                                ActualTotal += NTR(re[i].totalhalfYearlysumOfIC);
                                totalhalfYearly1 += NTR(re[i].halfYearly1sumOfIC)
                                totalhalfYearly2 += NTR(re[i].halfYearly2sumOfIC)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1sumOfIC)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totaltargetsumOfIC)
                                    TargetlTotal += NTR(re[i].totaltargetsumOfIC);
                                    totaltargethalfYearly1 += NTR(re[i].target1sumOfIC)
                                    totaltargethalfYearly2 += NTR(re[i].target2sumOfIC)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1sumOfIC)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2sumOfIC)
                                    s.setLineItemValue('custpage_total', line, re[i].totalpercsumOfIC)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1sumOfIC,re[i].gap1sumOfIC))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2sumOfIC,re[i].gap2sumOfIC))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].totalpercsumOfIC,re[i].totalgapsumOfIC))
                                    GAPTotal += NTR(re[i].totalgapsumOfIC);
                                    totalgaphalfYearly1 += NTR(re[i].gap1sumOfIC)
                                    totalgaphalfYearly2 += NTR(re[i].gap2sumOfIC)
                                }
                            }
                            line = line + 1;
                        }
                    }
                }
            }
        }   //   if (request.getParameter('custpage_ilo_type') == '3')
    }
    else if (request.getParameter('custpage_dimension') == '2') {
        pfToHidde = getPFLIST(yearData)
        nlapiLogExecution('DEBUG', 'pfToHidde ' + pfToHidde.length, JSON.stringify(pfToHidde))
        ProductFamilyList = getProductFamilyList(pfToHidde);
        nlapiLogExecution('DEBUG', 'ProductFamilyList ' + ProductFamilyList.length, JSON.stringify(ProductFamilyList))
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_pf', 'text', '')
            s.addField('custpage_p', 'text', '')
            for (var h = from_mounthData - 1; h < to_mounthData; h++) {
                s.addField('custpage_m' + parseInt((h + 1)), 'text', months[h]);
            }
            s.addField('custpage_total', 'text', 'TOTAL').setDisplayType('hidden');
            s.addField('custpage_total_t', 'text', 'TOTAL');
            re = SalesRepTargetsPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);           
            for (var i = 0; i < re.length; i++) {
                line = (i * ProductFamilyList.length * 4) + 1;
                for (z = 0; z < ProductFamilyList.length; z++) {
                    var pftotal = 0, pftarget = 0, pfgap = 0;
                    var pftotal1 = 0, pftotal2 = 0, pftotal3 = 0, pftotal4 = 0, pftotal5 = 0, pftotal6 = 0, pftotal7 = 0, pftotal8 = 0, pftotal9 = 0, pftotal10 = 0, pftotal11 = 0, pftotal12 = 0;
                    var pftarget1 = 0, pftarget2 = 0, pftarget3 = 0, pftarget4 = 0, pftarget5 = 0, pftarget6 = 0, pftarget7 = 0, pftarget8 = 0, pftarget9 = 0, pftarget10 = 0, pftarget11 = 0, pftarget12 = 0;
                    var pfgap1 = 0, pfgap2 = 0, pfgap3 = 0, pfgap4 = 0, pfgap5 = 0, pfgap6 = 0, pfgap7 = 0, pfgap8 = 0, pfgap9 = 0, pfgap10 = 0, pfgap11 = 0, pfgap12 = 0;
                    var item = {};
                    var total = 0;
                    var totaltarget = 0;
                    var gaptotal = 0;
                    for (var m = 0; m < 4; m++) {
                        if (m == 0) {
                            s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                            s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                            s.setLineItemValue('custpage_p', line, 'Actual');
                            var mounth1 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc1'], 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth1'] + "</a>";
                            var mounth2 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc2'], 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth2'] + "</a>";
                            var mounth3 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc3'], 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth3'] + "</a>";
                            var mounth4 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc4'], 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth4'] + "</a>";
                            var mounth5 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc5'], 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth5'] + "</a>";
                            var mounth6 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc6'], 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth6'] + "</a>";
                            var mounth7 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc7'], 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth7'] + "</a>";
                            var mounth8 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc8'], 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth8'] + "</a>";
                            var mounth9 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc9'], 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth9'] + "</a>";
                            var mounth10 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc10'], 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth10'] + "</a>";
                            var mounth11 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perch11'], 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth11'] + "</a>";
                            var mounth12 = "<a style='color:" + GCM(re[i][ProductFamilyList[z].id + 'perc12'], 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i][ProductFamilyList[z].id + 'mounth12'] + "</a>";
                            for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                total += NTR(re[i][ProductFamilyList[z].id + 'mounth' + h])
                                totaltarget += NTR(re[i][ProductFamilyList[z].id + 'target' + h])
                                gaptotal += NTR(re[i][ProductFamilyList[z].id + 'gap' + h])
                                pftotal += NTR(re[i][ProductFamilyList[z].id + 'mounth' + h])
                                pftarget += NTR(re[i][ProductFamilyList[z].id + 'target' + h])
                                pfgap += NTR(re[i][ProductFamilyList[z].id + 'gap' + h]);
                            }
                     
                            item['total'] = total + getNumber(TotalPerPf[ProductFamilyList[z].id], 'total')  ;
                            item['totaltarget'] = totaltarget + getNumber(TotalPerPf[ProductFamilyList[z].id], 'totaltarget');
                            item['gaptotal'] = gaptotal + getNumber(TotalPerPf[ProductFamilyList[z].id], 'gaptotal');
                            s.setLineItemValue('custpage_m1', line, mounth1)
                            s.setLineItemValue('custpage_m2', line, mounth2)
                            s.setLineItemValue('custpage_m3', line, mounth3)
                            s.setLineItemValue('custpage_m4', line, mounth4)
                            s.setLineItemValue('custpage_m5', line, mounth5)
                            s.setLineItemValue('custpage_m6', line, mounth6)
                            s.setLineItemValue('custpage_m7', line, mounth7)
                            s.setLineItemValue('custpage_m8', line, mounth8)
                            s.setLineItemValue('custpage_m9', line, mounth9)
                            s.setLineItemValue('custpage_m10', line, mounth10)
                            s.setLineItemValue('custpage_m11', line, mounth11)
                            s.setLineItemValue('custpage_m12', line, mounth12)
                            //s.setLineItemValue('custpage_total', line, re[i].totalbbs)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                            ActualTotal += total;
                            total1 += NTR(re[i][ProductFamilyList[z].id + 'mounth1']); total7 += NTR(re[i][ProductFamilyList[z].id + 'mounth7']);
                            total2 += NTR(re[i][ProductFamilyList[z].id + 'mounth2']); total8 += NTR(re[i][ProductFamilyList[z].id + 'mounth8']);
                            total3 += NTR(re[i][ProductFamilyList[z].id + 'mounth3']); total9 += NTR(re[i][ProductFamilyList[z].id + 'mounth9']);
                            total4 += NTR(re[i][ProductFamilyList[z].id + 'mounth4']); total10 += NTR(re[i][ProductFamilyList[z].id + 'mounth10']);
                            total5 += NTR(re[i][ProductFamilyList[z].id + 'mounth5']); total11 += NTR(re[i][ProductFamilyList[z].id + 'mounth11']);
                            total6 += NTR(re[i][ProductFamilyList[z].id + 'mounth6']); total12 += NTR(re[i][ProductFamilyList[z].id + 'mounth12']);
                            ///
                            pftotal1 = NTR(re[i][ProductFamilyList[z].id + 'mounth1']); pftotal7 = NTR(re[i][ProductFamilyList[z].id + 'mounth7'])
                            pftotal2 = NTR(re[i][ProductFamilyList[z].id + 'mounth2']); pftotal8 = NTR(re[i][ProductFamilyList[z].id + 'mounth8'])
                            pftotal3 = NTR(re[i][ProductFamilyList[z].id + 'mounth3']); pftotal9 = NTR(re[i][ProductFamilyList[z].id + 'mounth9'])
                            pftotal4 = NTR(re[i][ProductFamilyList[z].id + 'mounth4']); pftotal10 = NTR(re[i][ProductFamilyList[z].id + 'mounth11'])
                            pftotal5 = NTR(re[i][ProductFamilyList[z].id + 'mounth5']); pftotal11 = NTR(re[i][ProductFamilyList[z].id + 'mounth11'])
                            pftotal6 = NTR(re[i][ProductFamilyList[z].id + 'mounth6']); pftotal12 = NTR(re[i][ProductFamilyList[z].id + 'mounth12'])
                            item['pftotal1'] = pftotal1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal1'); item['pftotal7'] = pftotal7 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal7');
                            item['pftotal2'] = pftotal2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal2'); item['pftotal8'] = pftotal8 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal8');
                            item['pftotal3'] = pftotal3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal3'); item['pftotal9'] = pftotal9 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal9');
                            item['pftotal4'] = pftotal4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal4'); item['pftotal10'] = pftotal10 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal10');
                            item['pftotal5'] = pftotal5 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal5'); item['pftotal11'] = pftotal11 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal11');
                            item['pftotal6'] = pftotal6 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal6'); item['pftotal12'] = pftotal12 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal12');
                        } else {
                            s.setLineItemValue('custpage_n', line, '');
                            if (m == 1) {
                                s.setLineItemValue('custpage_p', line, 'Target')
                                s.setLineItemValue('custpage_m1', line, re[i][ProductFamilyList[z].id + 'target1'])
                                s.setLineItemValue('custpage_m2', line, re[i][ProductFamilyList[z].id + 'target2'])
                                s.setLineItemValue('custpage_m3', line, re[i][ProductFamilyList[z].id + 'target3'])
                                s.setLineItemValue('custpage_m4', line, re[i][ProductFamilyList[z].id + 'target4'])
                                s.setLineItemValue('custpage_m5', line, re[i][ProductFamilyList[z].id + 'target5'])
                                s.setLineItemValue('custpage_m6', line, re[i][ProductFamilyList[z].id + 'target6'])
                                s.setLineItemValue('custpage_m7', line, re[i][ProductFamilyList[z].id + 'target7'])
                                s.setLineItemValue('custpage_m8', line, re[i][ProductFamilyList[z].id + 'target8'])
                                s.setLineItemValue('custpage_m9', line, re[i][ProductFamilyList[z].id + 'target9'])
                                s.setLineItemValue('custpage_m10', line, re[i][ProductFamilyList[z].id + 'target10'])
                                s.setLineItemValue('custpage_m11', line, re[i][ProductFamilyList[z].id + 'target11'])
                                s.setLineItemValue('custpage_m12', line, re[i][ProductFamilyList[z].id + 'target12'])
                                //s.setLineItemValue('custpage_total', line, re[i].totaltargetbbs)
                                s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                                TargetlTotal += totaltarget;
                                target1T += NTR(re[i][ProductFamilyList[z].id + 'target1']); target7 += NTR(re[i][ProductFamilyList[z].id + 'target7']);
                                target2T += NTR(re[i][ProductFamilyList[z].id + 'target2']); target8 += NTR(re[i][ProductFamilyList[z].id + 'target8']);
                                target3T += NTR(re[i][ProductFamilyList[z].id + 'target3']); target9 += NTR(re[i][ProductFamilyList[z].id + 'target9']);
                                target4T += NTR(re[i][ProductFamilyList[z].id + 'target4']); target10 += NTR(re[i][ProductFamilyList[z].id + 'target10']);
                                target5 += NTR(re[i][ProductFamilyList[z].id + 'target5']); target11 += NTR(re[i][ProductFamilyList[z].id + 'target11']);
                                target6 += NTR(re[i][ProductFamilyList[z].id + 'target6']); target12 += NTR(re[i][ProductFamilyList[z].id + 'target12']);
                                //
                                pftarget1 += NTR(re[i][ProductFamilyList[z].id + 'target1']); pftarget7 += NTR(re[i][ProductFamilyList[z].id + 'target7'])
                                pftarget2 += NTR(re[i][ProductFamilyList[z].id + 'target2']); pftarget8 += NTR(re[i][ProductFamilyList[z].id + 'target8'])
                                pftarget3 += NTR(re[i][ProductFamilyList[z].id + 'target3']); pftarget9 += NTR(re[i][ProductFamilyList[z].id + 'target9'])
                                pftarget4 += NTR(re[i][ProductFamilyList[z].id + 'target4']); pftarget10 += NTR(re[i][ProductFamilyList[z].id + 'target11'])
                                pftarget5 += NTR(re[i][ProductFamilyList[z].id + 'target5']); pftarget11 += NTR(re[i][ProductFamilyList[z].id + 'target11'])
                                pftarget6 += NTR(re[i][ProductFamilyList[z].id + 'target6']); pftarget12 += NTR(re[i][ProductFamilyList[z].id + 'target12'])
                                item['pftarget1'] = pftarget1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget1'); item['pftarget7'] = pftarget7 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget7');
                                item['pftarget2'] = pftarget2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget2'); item['pftarget8'] = pftarget8 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget8');
                                item['pftarget3'] = pftarget3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget3'); item['pftarget9'] = pftarget9 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget9');
                                item['pftarget4'] = pftarget4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget4'); item['pftarget10'] = pftarget10 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget10');
                                item['pftarget5'] = pftarget5 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget5'); item['pftarget11'] = pftarget11 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget11');
                                item['pftarget6'] = pftarget6 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget6'); item['pftarget12'] = pftarget12 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget12');
                            }
                            else if (m == 2) {
                                s.setLineItemValue('custpage_p', line, '% of Target')
                                for (var o = 1; o <= 12; o++) {
                                    s.setLineItemValue('custpage_m' + o, line, re[i][ProductFamilyList[z].id + 'perc' + o])
                                }
                                s.setLineItemValue('custpage_total', line, re[i].totalpercbbs)
                                s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                            }
                            else {
                                s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                for (var o = 1; o <= 12; o++) {
                                    s.setLineItemValue('custpage_m' + o, line, GGC(re[i][ProductFamilyList[z].id + 'perc' + o], re[i][ProductFamilyList[z].id + 'gap' + o], 1))
                                }
                                s.setLineItemValue('custpage_total', line, re[i].totalgapbbs)
                                s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                                GAPTotal += gaptotal;
                                gap1 += NTR(re[i][ProductFamilyList[z].id + 'gap1']); gap7 += NTR(re[i][ProductFamilyList[z].id + 'gap7']);
                                gap2 += NTR(re[i][ProductFamilyList[z].id + 'gap2']); gap8 += NTR(re[i][ProductFamilyList[z].id + 'gap8']);
                                gap3 += NTR(re[i][ProductFamilyList[z].id + 'gap3']); gap9 += NTR(re[i][ProductFamilyList[z].id + 'gap9']);
                                gap4 += NTR(re[i][ProductFamilyList[z].id + 'gap4']); gap10 += NTR(re[i][ProductFamilyList[z].id + 'gap10']);
                                gap5 += NTR(re[i][ProductFamilyList[z].id + 'gap5']); gap11 += NTR(re[i][ProductFamilyList[z].id + 'gap11']);
                                gap6 += NTR(re[i][ProductFamilyList[z].id + 'gap6']); gap12 += NTR(re[i][ProductFamilyList[z].id + 'gap12']);
                                //
                                pfgap1 += NTR(re[i][ProductFamilyList[z].id + 'gap1']); pfgap7 += NTR(re[i][ProductFamilyList[z].id + 'gap7'])
                                pfgap2 += NTR(re[i][ProductFamilyList[z].id + 'gap2']); pfgap8 += NTR(re[i][ProductFamilyList[z].id + 'gap8'])
                                pfgap3 += NTR(re[i][ProductFamilyList[z].id + 'gap3']); pfgap9 += NTR(re[i][ProductFamilyList[z].id + 'gap9'])
                                pfgap4 += NTR(re[i][ProductFamilyList[z].id + 'gap4']); pfgap10 += NTR(re[i][ProductFamilyList[z].id + 'gap11'])
                                pfgap5 += NTR(re[i][ProductFamilyList[z].id + 'gap5']); pfgap11 += NTR(re[i][ProductFamilyList[z].id + 'gap11'])
                                pfgap6 += NTR(re[i][ProductFamilyList[z].id + 'gap6']); pfgap12 += NTR(re[i][ProductFamilyList[z].id + 'gap12'])
                                item['pfgap1'] = pfgap1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap1'); item['pfgap7'] = pfgap7 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap7');
                                item['pfgap2'] = pfgap2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap2'); item['pfgap8'] = pfgap8 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap8');
                                item['pfgap3'] = pfgap3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap3'); item['pfgap9'] = pfgap9 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap9');
                                item['pfgap4'] = pfgap4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap4'); item['pfgap10'] = pfgap10 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap10');
                                item['pfgap5'] = pfgap5 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap5'); item['pfgap11'] = pfgap11 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap11');
                                item['pfgap6'] = pfgap6 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap6'); item['pfgap12'] = pfgap12 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap12');
                            }
                        }
                        line = line + 1;
                    }//  for (var m = 0; m < 4; m++)
                    TotalPerPf[ProductFamilyList[z].id] = item
                }
            }
        }
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
    
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_pf', 'text', '')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_quoarterly1', 'text', 'Q1');
            s.addField('custpage_quoarterly2', 'text', 'Q2');
            s.addField('custpage_quoarterly3', 'text', 'Q3');
            s.addField('custpage_quoarterly4', 'text', 'Q4');
            s.addField('custpage_total', 'text', 'TOTAL');            
            var re = SalesRepTargetsQuoartlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * ProductFamilyList.length * 4) + 1;
                for (z = 0; z < ProductFamilyList.length; z++) {
                    var item = {};
                    var pftotal = 0, pftarget = 0, pfgap = 0;
                    var pftotal1 = 0, pftotal2 = 0, pftotal3 = 0, pftotal4 = 0, pftotal5 = 0, pftotal6 = 0, pftotal7 = 0, pftotal8 = 0, pftotal9 = 0, pftotal10 = 0, pftotal11 = 0, pftotal12 = 0;
                    var pftarget1 = 0, pftarget2 = 0, pftarget3 = 0, pftarget4 = 0, pftarget5 = 0, pftarget6 = 0, pftarget7 = 0, pftarget8 = 0, pftarget9 = 0, pftarget10 = 0, pftarget11 = 0, pftarget12 = 0;
                    var pfgap1 = 0, pfgap2 = 0, pfgap3 = 0, pfgap4 = 0, pfgap5 = 0, pfgap6 = 0, pfgap7 = 0, pfgap8 = 0, pfgap9 = 0, pfgap10 = 0, pfgap11 = 0, pfgap12 = 0;
                    var total = 0;
                    var totaltarget = 0;
                    var gaptotal = 0;
                    for (var m = 0; m < 4; m++) {
                        if (m == 0) {
                            s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                            s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                            s.setLineItemValue('custpage_p', line, 'Actual');
                            var amount1 = re[i][ProductFamilyList[z].id + 'quoarterly1']
                            var amount2 = re[i][ProductFamilyList[z].id + 'quoarterly2']
                            var amount3 = re[i][ProductFamilyList[z].id + 'quoarterly3']
                            var amount4 = re[i][ProductFamilyList[z].id + 'quoarterly4']
                            var total = NTR(amount1) + NTR(amount2) + NTR(amount3) + NTR(amount4)
                            var target1 = re[i][ProductFamilyList[z].id + 'target1']
                            var target2 = re[i][ProductFamilyList[z].id + 'target2']
                            var target3 = re[i][ProductFamilyList[z].id + 'target3']
                            var target4 = re[i][ProductFamilyList[z].id + 'target4']
                            var totaltarget = NTR(target1) + NTR(target2) + NTR(target3) + NTR(target4)
                            var perc1 = re[i][ProductFamilyList[z].id + 'perc1']
                            var perc2 = re[i][ProductFamilyList[z].id + 'perc2']
                            var perc3 = re[i][ProductFamilyList[z].id + 'perc3']
                            var perc4 = re[i][ProductFamilyList[z].id + 'perc4']                          
                            var gap1 = re[i][ProductFamilyList[z].id + 'gap1']
                            var gap2 = re[i][ProductFamilyList[z].id + 'gap2']
                            var gap3 = re[i][ProductFamilyList[z].id + 'gap3']
                            var gap4 = re[i][ProductFamilyList[z].id + 'gap4']
                            var gaptotal = NTR(gap1) + NTR(gap2) + NTR(gap3) + NTR(gap4)
                            var quoarterly1 = "<a style='color:" + getColor(re[i][ProductFamilyList[z].id + 'perc1']) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount1 + "</a>";
                            var quoarterly2 = "<a style='color:" + getColor(re[i][ProductFamilyList[z].id + 'perc2']) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount2 + "</a>";
                            var quoarterly3 = "<a style='color:" + getColor(re[i][ProductFamilyList[z].id + 'perc3']) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount3 + "</a>";
                            var quoarterly4 = "<a style='color:" + getColor(re[i][ProductFamilyList[z].id + 'perc4']) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount4 + "</a>";
                            s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                            s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                            s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                            s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                            s.setLineItemValue('custpage_total', line, getGapColor(getPrecenge(total, totaltarget) + '%', formatNumber(total)))
                            ActualTotal += total    
                            TargetlTotal += totaltarget
                            GAPTotal += total - totaltarget
                            totalquoarterly1 += NTR(amount1); totalquoarterly2 += NTR(amount2);
                            totalquoarterly3 += NTR(amount3); totalquoarterly4 += NTR(amount4);               
                            pftotal1 += NTR(amount1); pftotal2 += NTR(amount2);
                            pftotal3 += NTR(amount3); pftotal4 += NTR(amount4);
                            item['total'] = total + getNumber(TotalPerPf[ProductFamilyList[z].id], 'total');
                            item['totaltarget'] = totaltarget + getNumber(TotalPerPf[ProductFamilyList[z].id], 'totaltarget');
                            item['gaptotal'] = gaptotal + getNumber(TotalPerPf[ProductFamilyList[z].id], 'gaptotal');
                            item['pftotal1'] = pftotal1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal1'); item['pftotal3'] = pftotal3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal3');
                            item['pftotal2'] = pftotal2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal2'); item['pftotal4'] = pftotal4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal4');
                        } else {
                            s.setLineItemValue('custpage_n', line, '');
                            if (m == 1) {                        
                                s.setLineItemValue('custpage_p', line, 'Target')
                                s.setLineItemValue('custpage_quoarterly1', line, target1)
                                s.setLineItemValue('custpage_quoarterly2', line, target2)
                                s.setLineItemValue('custpage_quoarterly3', line, target3)
                                s.setLineItemValue('custpage_quoarterly4', line, target4)
                                s.setLineItemValue('custpage_total', line, formatNumber(totaltarget))
                                //totaltarget += NTR(re[i].targetbbs)
                                //targetbbs += NTR(re[i].targetbbs)
                                totaltargetquoarterly1 += NTR(target1); totaltargetquoarterly2 += NTR(target2);
                                totaltargetquoarterly3 += NTR(target3); totaltargetquoarterly4 += NTR(target4);
                                pftarget1 += NTR(target1); pftarget3 += NTR(target2);
                                pftarget2 += NTR(target3); pftarget4 += NTR(target4);
                                item['pftarget1'] = pftarget1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget1'); item['pftarget3'] = pftarget3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget3');
                                item['pftarget2'] = pftarget2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget2'); item['pftarget4'] = pftarget4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget4');
                            }
                            else if (m == 2) {
                                s.setLineItemValue('custpage_p', line, '% of Target')
                                s.setLineItemValue('custpage_quoarterly1', line, perc1)
                                s.setLineItemValue('custpage_quoarterly2', line, perc2)
                                s.setLineItemValue('custpage_quoarterly3', line, perc3)
                                s.setLineItemValue('custpage_quoarterly4', line, perc4)
                                s.setLineItemValue('custpage_total', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                            }
                            else {
                                s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                s.setLineItemValue('custpage_quoarterly1', line, getGapColor(perc1, gap1))
                                s.setLineItemValue('custpage_quoarterly2', line, getGapColor(perc2, gap2))
                                s.setLineItemValue('custpage_quoarterly3', line, getGapColor(perc3, gap3))
                                s.setLineItemValue('custpage_quoarterly4', line, getGapColor(perc4, gap4))
                                s.setLineItemValue('custpage_total', line, getGapColor(getPrecenge(total, totaltarget) + '%', formatNumber(gaptotal)))

                                totalgapquoarterly1 += NTR(gap1); totalgapquoarterly2 += NTR(gap2);
                                totalgapquoarterly3 += NTR(gap3); totalgapquoarterly4 += NTR(gap4);

                                pfgap1 += NTR(gap1); pfgap3 += NTR(gap3)
                                pfgap2 += NTR(gap2); pfgap4 += NTR(gap4)
                                item['pfgap1'] = pfgap1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap1'); item['pfgap3'] = pfgap3 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap3');
                                item['pfgap2'] = pfgap2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap2'); item['pfgap4'] = pfgap4 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap4');
                           
                            }
                        }
                        line = line + 1;                                      
                    }
                    TotalPerPf[ProductFamilyList[z].id] = item
                }
            }
        }
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            var s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
            s.addField('custpage_n', 'text', 'Sales Manager / Period')
            s.addField('custpage_c', 'text', '')
            s.addField('custpage_p', 'text', '')
            s.addField('custpage_half_yearly1', 'text', 'H1');
            s.addField('custpage_half_yearly2', 'text', 'H2');
            s.addField('custpage_total', 'text', 'TOTAL');
            var line = 0;
            var re = SalesRepTargetsHalfYearlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData);
            for (var i = 0; i < re.length; i++) {
                line = (i * ProductFamilyList.length * 4) + 1;
                for (z = 0; z < ProductFamilyList.length; z++) {
                    var item = {};
                    var pftotal = 0, pftarget = 0, pfgap = 0;
                    var pftotal1 = 0, pftotal2 = 0, pftotal3 = 0, pftotal4 = 0, pftotal5 = 0, pftotal6 = 0, pftotal7 = 0, pftotal8 = 0, pftotal9 = 0, pftotal10 = 0, pftotal11 = 0, pftotal12 = 0;
                    var pftarget1 = 0, pftarget2 = 0, pftarget3 = 0, pftarget4 = 0, pftarget5 = 0, pftarget6 = 0, pftarget7 = 0, pftarget8 = 0, pftarget9 = 0, pftarget10 = 0, pftarget11 = 0, pftarget12 = 0;
                    var pfgap1 = 0, pfgap2 = 0, pfgap3 = 0, pfgap4 = 0, pfgap5 = 0, pfgap6 = 0, pfgap7 = 0, pfgap8 = 0, pfgap9 = 0, pfgap10 = 0, pfgap11 = 0, pfgap12 = 0;
                    var total = 0;
                    var totaltarget = 0;
                    var gaptotal = 0;
                    for (var m = 0; m < 4; m++) {
                        if (m == 0) {
                            var amount1 = re[i][ProductFamilyList[z].id + 'halfYearly1']
                            var amount2 = re[i][ProductFamilyList[z].id + 'halfYearly2']
                            var total = NTR(amount1) + NTR(amount2)
                            var target1 = re[i][ProductFamilyList[z].id + 'target1']
                            var target2 = re[i][ProductFamilyList[z].id + 'target2']
                            var totaltarget = NTR(target1) + NTR(target2)
                            var perc1 = re[i][ProductFamilyList[z].id + 'perc1']
                            var perc2 = re[i][ProductFamilyList[z].id + 'perc2']
                            var gap1 = re[i][ProductFamilyList[z].id + 'gap1']
                            var gap2 = re[i][ProductFamilyList[z].id + 'gap2']
                            var gaptotal = NTR(gap1) + NTR(gap2)
                            s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                            s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                            s.setLineItemValue('custpage_p', line, 'Actual');
                            var half_yearly1 = "<a style='color:" + getColor(perc1) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount1 + "</a>";
                            var half_yearly2 = "<a style='color:" + getColor(perc2) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + amount2 + "</a>";
                            s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                            s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                            s.setLineItemValue('custpage_total', line, getGapColor(getPrecenge(total, totaltarget) + '%', formatNumber(total)))
                            ActualTotal += total
                            TargetlTotal += totaltarget
                            GAPTotal += total - totaltarget
                            totalhalfYearly1 += NTR(amount1); totalhalfYearly2 += NTR(amount2);                 
                            pftotal1 += NTR(amount1);
                            pftotal2 += NTR(amount2);                  
                            item['total'] = total + getNumber(TotalPerPf[ProductFamilyList[z].id], 'total');
                            item['totaltarget'] = totaltarget + getNumber(TotalPerPf[ProductFamilyList[z].id], 'totaltarget');
                            item['gaptotal'] = gaptotal + getNumber(TotalPerPf[ProductFamilyList[z].id], 'gaptotal');
                            item['pftotal1'] = pftotal1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal1');
                            item['pftotal2'] = pftotal2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftotal2');
                        }
                        else {
                            s.setLineItemValue('custpage_n', line, '');
                            if (m == 1) {
                                s.setLineItemValue('custpage_p', line, 'Target')
                                s.setLineItemValue('custpage_half_yearly1', line, target1)
                                s.setLineItemValue('custpage_half_yearly2', line, target2)
                                s.setLineItemValue('custpage_total', line, formatNumber(totaltarget))
                                totaltargethalfYearly1 += NTR(target1); totaltargethalfYearly2 += NTR(target2);
                                pftarget1 += NTR(target1);
                                pftarget2 += NTR(target2);                             
                                item['pftarget1'] = pftarget1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget1');
                                item['pftarget2'] = pftarget2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pftarget2');
                            }
                            else if (m == 2) {
                                s.setLineItemValue('custpage_p', line, '% of Target')
                                s.setLineItemValue('custpage_half_yearly1', line,perc1)
                                s.setLineItemValue('custpage_half_yearly2', line, perc2)
                                s.setLineItemValue('custpage_total', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                            }
                            else {
                                s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                s.setLineItemValue('custpage_half_yearly1', line, getGapColor(perc1, gap1))
                                s.setLineItemValue('custpage_half_yearly2', line, getGapColor(perc2, gap2))
                                s.setLineItemValue('custpage_total', line, getGapColor(getPrecenge(total, totaltarget) + '%', formatNumber(gaptotal)))                                                       
                                totalgaphalfYearly1 += NTR(gap1);
                                totalgaphalfYearly2 += NTR(gap2)
                                pfgap1 += NTR(gap1);
                                pfgap2 += NTR(gap2)                      
                                item['pfgap1'] = pfgap1 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap1');
                                item['pfgap2'] = pfgap2 + getNumber(TotalPerPf[ProductFamilyList[z].id], 'pfgap2');
                              
                            }
                        }
                        line = line + 1;                                       
                    }
                    TotalPerPf[ProductFamilyList[z].id] = item
                }
            }
        }
    }
    if (s != null && re.length > 0) {
        addTotalLines(s, line, ActualTotal, TargetlTotal, GAPTotal);
        if (request.getParameter('custpage_dimension') == '2') {
            for (z = 0; z < ProductFamilyList.length; z++) {
                line = line + 4;
                addTotalLinesPF(s, line, TotalPerPf[ProductFamilyList[z].id]['total'], TotalPerPf[ProductFamilyList[z].id]['totaltarget'], TotalPerPf[ProductFamilyList[z].id]['gaptotal'], 'Total – ' + ProductFamilyList[z].name,
                    TotalPerPf[ProductFamilyList[z].id]['pftotal1'], TotalPerPf[ProductFamilyList[z].id]['pftotal2'], TotalPerPf[ProductFamilyList[z].id]['pftotal3'], TotalPerPf[ProductFamilyList[z].id]['pftotal4'], TotalPerPf[ProductFamilyList[z].id]['pftotal5'], TotalPerPf[ProductFamilyList[z].id]['pftotal6'], TotalPerPf[ProductFamilyList[z].id]['pftotal7'], TotalPerPf[ProductFamilyList[z].id]['pftotal8'], TotalPerPf[ProductFamilyList[z].id]['pftotal9'], TotalPerPf[ProductFamilyList[z].id]['pftotal10'], TotalPerPf[ProductFamilyList[z].id]['pftotal11'], TotalPerPf[ProductFamilyList[z].id]['pftotal12'],
                    TotalPerPf[ProductFamilyList[z].id]['pftarget1'], TotalPerPf[ProductFamilyList[z].id]['pftarget2'], TotalPerPf[ProductFamilyList[z].id]['pftarget3'], TotalPerPf[ProductFamilyList[z].id]['pftarget4'], TotalPerPf[ProductFamilyList[z].id]['pftarget5'], TotalPerPf[ProductFamilyList[z].id]['pftarget6'], TotalPerPf[ProductFamilyList[z].id]['pftarget7'], TotalPerPf[ProductFamilyList[z].id]['pftarget8'], TotalPerPf[ProductFamilyList[z].id]['pftarget9'], TotalPerPf[ProductFamilyList[z].id]['pftarget10'], TotalPerPf[ProductFamilyList[z].id]['pftarget11'], TotalPerPf[ProductFamilyList[z].id]['pftarget12'],
                    TotalPerPf[ProductFamilyList[z].id]['pfgap1'], TotalPerPf[ProductFamilyList[z].id]['pfgap2'], TotalPerPf[ProductFamilyList[z].id]['pfgap3'], TotalPerPf[ProductFamilyList[z].id]['pfgap4'], TotalPerPf[ProductFamilyList[z].id]['pfgap5'], TotalPerPf[ProductFamilyList[z].id]['pfgap6'], TotalPerPf[ProductFamilyList[z].id]['pfgap7'], TotalPerPf[ProductFamilyList[z].id]['pfgap8'], TotalPerPf[ProductFamilyList[z].id]['pfgap9'], TotalPerPf[ProductFamilyList[z].id]['pfgap10'], TotalPerPf[ProductFamilyList[z].id]['pfgap11'], TotalPerPf[ProductFamilyList[z].id]['pfgap12'])
            }
            
           
        }   
    }
    response.writePage(form);
}
function getNumber(line, field) {
    var number = line;
    if (number != undefined) { number = Number(number[field]) }
    else { number = 0 }
    return number;

}

