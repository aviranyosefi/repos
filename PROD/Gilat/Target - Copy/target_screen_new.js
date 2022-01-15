var ActualTotal = 0;
var TargetlTotal = 0;
var GAPTotal = 0;
var ProductFamilyList = getProductFamilyList();
var line = 0;

function target_screen(request, response) {
    createForm();
    nlapiLogExecution('DEBUG', 'salesData: ' + salesData + ', Type: ' + request.getParameter('custpage_ilo_type'), 'yearData: ' + yearData + ', fss_mssData: ' + fss_mssData + ', dimensionData: ' + dimensionData);
    if (request.getParameter('custpage_dimension') == '') {
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

                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            totaltarget += NTR(re[i]["target" + h])
                        }
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            gaptotal += NTR(re[i]["gap" + h])
                        }
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
                            target1 += NTR(re[i].target1); target7 += NTR(re[i].target7);
                            target2 += NTR(re[i].target2); target8 += NTR(re[i].target8);
                            target3 += NTR(re[i].target3); target9 += NTR(re[i].target9);
                            target4 += NTR(re[i].target4); target10 += NTR(re[i].target10);
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
                                s.setLineItemValue('custpage_total', line, re[i].totalmount)
                                s.setLineItemValue('custpage_total_t', line, getGapColor(re[i].totalperc,formatNumber(total.toFixed(2))))
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
                                    for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                        totaltarget += NTR(re[i]["target" + h])
                                    }
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
                                    s.setLineItemValue('custpage_total', line, re[i].totaltarget)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                                    TargetlTotal += totaltarget;
                                    target1 += NTR(re[i].target1); target7 += NTR(re[i].target7);
                                    target2 += NTR(re[i].target2); target8 += NTR(re[i].target8);
                                    target3 += NTR(re[i].target3); target9 += NTR(re[i].target9);
                                    target4 += NTR(re[i].target4); target10 += NTR(re[i].target10);
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
                                    s.setLineItemValue('custpage_total', line, re[i].totalperc)
                                    s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                                }
                                else {
                                    for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                        gaptotal += NTR(re[i]["gap" + h])
                                    }
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
                                }
                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                    totaltarget += NTR(re[i]["target" + h + "sumOfHW"])
                                }
                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
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
                                }
                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                                    totaltarget += NTR(re[i]["target" + h + "sumOfIC"])
                                }
                                for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
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
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            var s = null; var re = []
            res = Build1(s, re)
            re =res[0]
            s = res[1]
            line = res[2]
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
                line = (i * 64) + 1;
                for (z = 0; z < ProductFamilyList.length; z++) {
                    for (var m = 0; m < 4; m++) {
                        if (ProductFamilyList[z].name == 'Backbone Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1bbs + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2bbs + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3bbs + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4bbs + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbbs, re[i].quoarterlybbs))
                                ActualTotal += NTR(re[i].quoarterlybbs)
                                Totalbbs += NTR(re[i].quoarterlybbs)
                                totalquoarterly1 += NTR(re[i].quoarterly1bbs); totalquoarterly2 += NTR(re[i].quoarterly2bbs);
                                totalquoarterly3 += NTR(re[i].quoarterly3bbs); totalquoarterly4 += NTR(re[i].quoarterly4bbs);
                                total1bbs += NTR(re[i].quoarterly1bbs); total2bbs += NTR(re[i].quoarterly2bbs);
                                total3bbs += NTR(re[i].quoarterly3bbs); total4bbs += NTR(re[i].quoarterly4bbs);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1bbs)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2bbs)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3bbs)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4bbs)
                                    s.setLineItemValue('custpage_total', line, re[i].targetbbs)
                                    totaltarget += NTR(re[i].targetbbs)
                                    targetbbs += NTR(re[i].targetbbs)
                                    totaltargetquoarterly1 += NTR(re[i].target1bbs); totaltargetquoarterly2 += NTR(re[i].target2bbs);
                                    totaltargetquoarterly3 += NTR(re[i].target3bbs); totaltargetquoarterly4 += NTR(re[i].target4bbs);
                                    target1bbs += NTR(re[i].target1bbs); target2bbs += NTR(re[i].target2bbs);
                                    target3bbs += NTR(re[i].target3bbs); target4bbs += NTR(re[i].target4bbs);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1bbs)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2bbs)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3bbs)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4bbs)
                                    s.setLineItemValue('custpage_total', line, re[i].percbbs)

                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1bbs, re[i].gap1bbs))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2bbs, re[i].gap2bbs))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3bbs, re[i].gap3bbs))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4bbs,re[i].gap4bbs))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbbs,re[i].gapbbs))
                                    GAPTotal += NTR(re[i].gapbbs)
                                    gapbbs += NTR(re[i].gapbbs)
                                    totalgapquoarterly1 += NTR(re[i].gap1bbs); totalgapquoarterly2 += NTR(re[i].gap2bbs);
                                    totalgapquoarterly3 += NTR(re[i].gap3bbs); totalgapquoarterly4 += NTR(re[i].gap4bbs);
                                    gap1bbs += NTR(re[i].gap1bbs); gap2bbs += NTR(re[i].gap2bbs);
                                    gap3bbs += NTR(re[i].gap3bbs); gap4bbs += NTR(re[i].gap4bbs);
                                }
                            }
                            line = line + 1;
                        } // z==0
                        else if (ProductFamilyList[z].name == 'VAS') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1vas) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1vas + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2vas) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2vas + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3vas) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3vas + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4vas) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4vas + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percvas, re[i].quoarterlyvas))
                                ActualTotal += NTR(re[i].quoarterlyvas)
                                Totalvas += NTR(re[i].quoarterlyvas)
                                totalquoarterly1 += NTR(re[i].quoarterly1vas); totalquoarterly2 += NTR(re[i].quoarterly2vas);
                                totalquoarterly3 += NTR(re[i].quoarterly3vas); totalquoarterly4 += NTR(re[i].quoarterly4vas);
                                total1vas += NTR(re[i].quoarterly1vas); total2vas += NTR(re[i].quoarterly2vas);
                                total3vas += NTR(re[i].quoarterly3vas); total4vas += NTR(re[i].quoarterly4vas);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1vas)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2vas)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3vas)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4vas)
                                    s.setLineItemValue('custpage_total', line, re[i].targetvas)
                                    TargetlTotal += NTR(re[i].targetvas)
                                    targetvas += NTR(re[i].targetvas)
                                    totaltargetquoarterly1 += NTR(re[i].target1vas); totaltargetquoarterly2 += NTR(re[i].target2vas);
                                    totaltargetquoarterly3 += NTR(re[i].target3vas); totaltargetquoarterly4 += NTR(re[i].target4vas);
                                    target1vas += NTR(re[i].target1vas); target2vas += NTR(re[i].target2vas);
                                    target3vas += NTR(re[i].target3vas); target4vas += NTR(re[i].target4vas);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1vas)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2vas)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3vas)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4vas)
                                    s.setLineItemValue('custpage_total', line, re[i].percvas)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1vas, re[i].gap1vas))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2vas,re[i].gap2vas))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3vas, re[i].gap3vas))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4vas,re[i].gap4vas))
                                    s.setLineItemValue('custpage_total', line,getGapColor(re[i].percvas, re[i].gapvas))
                                    GAPTotal += NTR(re[i].gapvas)
                                    gapvas += NTR(re[i].gapvas)
                                    totalgapquoarterly1 += NTR(re[i].gap1vas); totalgapquoarterly2 += NTR(re[i].gap2vas);
                                    totalgapquoarterly3 += NTR(re[i].gap3vas); totalgapquoarterly4 += NTR(re[i].gap4vas);
                                    gap1vas += NTR(re[i].gap1vas); gap2vas += NTR(re[i].gap2vas);
                                    gap3vas += NTR(re[i].gap3vas); gap4vas += NTR(re[i].gap4vas);
                                }
                            }
                            line = line + 1;
                        } // z==0
                        else if (ProductFamilyList[z].name == 'BOD') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1bod) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1bod + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2bod) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2bod + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3bod) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3bod + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4bod) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4bod + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbod, re[i].quoarterlybod))
                                ActualTotal += NTR(re[i].quoarterlybod)
                                Totalbod += NTR(re[i].quoarterlybod)
                                totalquoarterly1 += NTR(re[i].quoarterly1bod); totalquoarterly2 += NTR(re[i].quoarterly2bod);
                                totalquoarterly3 += NTR(re[i].quoarterly3bod); totalquoarterly4 += NTR(re[i].quoarterly4bod);
                                total1bod += NTR(re[i].quoarterly1bod); total2bod += NTR(re[i].quoarterly2bod);
                                total3bod += NTR(re[i].quoarterly3bod); total4bod += NTR(re[i].quoarterly4bod);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1bod)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2bod)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3bod)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4bod)
                                    s.setLineItemValue('custpage_total', line, re[i].targetbod)
                                    TargetlTotal += NTR(re[i].targetbod)
                                    targetbod += NTR(re[i].targetbod)
                                    totaltargetquoarterly1 += NTR(re[i].target1bod); totaltargetquoarterly2 += NTR(re[i].target2bod);
                                    totaltargetquoarterly3 += NTR(re[i].target3bod); totaltargetquoarterly4 += NTR(re[i].target4bod);
                                    target1bod += NTR(re[i].target1bod); target2bod += NTR(re[i].target2bod);
                                    target1bod += NTR(re[i].target3bod); target4bod += NTR(re[i].target4bod);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1bod)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2bod)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3bod)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4bod)
                                    s.setLineItemValue('custpage_total', line, re[i].percbod)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1bod, re[i].gap1bod))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2bod, re[i].gap2bod))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3bod, re[i].gap3bod))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4bod, re[i].gap4bod))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbod, re[i].gapbod))
                                    GAPTotal += NTR(re[i].gapbod)
                                    gapbod += NTR(re[i].gapbod)
                                    totalgapquoarterly1 += NTR(re[i].gap1bod); totalgapquoarterly2 += NTR(re[i].gap2bod);
                                    totalgapquoarterly3 += NTR(re[i].gap3bod); totalgapquoarterly4 += NTR(re[i].gap4bod);
                                    gap1bod += NTR(re[i].gap1bod); gap2bod += NTR(re[i].gap2bod);
                                    gap3bod += NTR(re[i].gap3bod); gap4bod += NTR(re[i].gap4bod);
                                }
                            }
                            line = line + 1;
                        } 
                        else if (ProductFamilyList[z].name == 'VSAT C Band Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1cband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1cband + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2cband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2cband + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3cband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3cband + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4cband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4cband + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perccband, re[i].quoarterlycband))
                                ActualTotal += NTR(re[i].quoarterlycband)
                                Totalcband += NTR(re[i].quoarterlycband)
                                totalquoarterly1 += NTR(re[i].quoarterly1cband); totalquoarterly2 += NTR(re[i].quoarterly2cband);
                                totalquoarterly3 += NTR(re[i].quoarterly3cband); totalquoarterly4 += NTR(re[i].quoarterly4cband);
                                total1cband += NTR(re[i].quoarterly1cband); total2cband += NTR(re[i].quoarterly2cband);
                                total3cband += NTR(re[i].quoarterly3cband); total4cband += NTR(re[i].quoarterly4cband);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1cband)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2cband)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3cband)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4cband)
                                    s.setLineItemValue('custpage_total', line, re[i].targetcband)
                                    TargetlTotal += NTR(re[i].targetcband)
                                    targetcband += NTR(re[i].targetcband)
                                    totaltargetquoarterly1 += NTR(re[i].target1cband); totaltargetquoarterly2 += NTR(re[i].target2cband);
                                    totaltargetquoarterly3 += NTR(re[i].target3cband); totaltargetquoarterly4 += NTR(re[i].target4cband);
                                    target1cband += NTR(re[i].target1cband); target2cband += NTR(re[i].target2cband);
                                    target3cband += NTR(re[i].target3cband); target4cband += NTR(re[i].target4cband);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1cband)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2cband)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3cband)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4cband)
                                    s.setLineItemValue('custpage_total', line, re[i].perccband)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line,getGapColor(re[i].perc1cband,re[i].gap1cband))
                                    s.setLineItemValue('custpage_quoarterly2', line,getGapColor(re[i].perc2cband,re[i].gap2cband))
                                    s.setLineItemValue('custpage_quoarterly3', line,getGapColor(re[i].perc3cband, re[i].gap3cband))
                                    s.setLineItemValue('custpage_quoarterly4', line,getGapColor(re[i].perc4cband, re[i].gap4cband))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perccband,re[i].gapcband))
                                    GAPTotal += NTR(re[i].gapcband)
                                    gapcband += NTR(re[i].gapcband)
                                    totalgapquoarterly1 += NTR(re[i].gap1cband); totalgapquoarterly2 += NTR(re[i].gap2cband);
                                    totalgapquoarterly3 += NTR(re[i].gap3cband); totalgapquoarterly4 += NTR(re[i].gap4cband);
                                    gap1cband += NTR(re[i].gap1cband); gap2cband += NTR(re[i].gap2cband);
                                    gap3cband += NTR(re[i].gap3cband); gap4cband += NTR(re[i].gap4cband);
                                }
                            }
                            line = line + 1;
                        } 
                        else if (ProductFamilyList[z].name == 'Domestic') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1domestic + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2domestic + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3domestic + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4domestic + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdomestic, re[i].quoarterlydomestic))
                                ActualTotal += NTR(re[i].quoarterlydomestic)
                                Totaldomestic += NTR(re[i].quoarterlydomestic)
                                totalquoarterly1 += NTR(re[i].quoarterly1domestic); totalquoarterly2 += NTR(re[i].quoarterly2domestic);
                                totalquoarterly3 += NTR(re[i].quoarterly3domestic); totalquoarterly4 += NTR(re[i].quoarterly4domestic);
                                total1domestic += NTR(re[i].quoarterly1domestic); total2domestic += NTR(re[i].quoarterly2domestic);
                                total3domestic += NTR(re[i].quoarterly3domestic); total4domestic += NTR(re[i].quoarterly4domestic);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1domestic)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2domestic)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3domestic)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4domestic)
                                    s.setLineItemValue('custpage_total', line, re[i].targetdomestic)
                                    TargetlTotal += NTR(re[i].targetdomestic)
                                    targetdomestic += NTR(re[i].targetdomestic)
                                    totaltargetquoarterly1 += NTR(re[i].target1domestic); totaltargetquoarterly2 += NTR(re[i].target2domestic);
                                    totaltargetquoarterly3 += NTR(re[i].target3domestic); totaltargetquoarterly4 += NTR(re[i].target4domestic);
                                    target1domestic += NTR(re[i].target1domestic); target2domestic += NTR(re[i].target2domestic);
                                    target3domestic += NTR(re[i].target3domestic); target4domestic += NTR(re[i].target4domestic);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1domestic)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2domestic)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3domestic)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4domestic)
                                    s.setLineItemValue('custpage_total', line, re[i].percdomestic)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1domestic,re[i].gap1domestic))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2domestic,re[i].gap2domestic))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3domestic,re[i].gap3domestic))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4domestic,re[i].gap4domestic))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdomestic,re[i].gapdomestic))
                                    GAPTotal += NTR(re[i].gapdomestic)
                                    gapdomestic += NTR(re[i].gapdomestic)
                                    totalgapquoarterly1 += NTR(re[i].gap1domestic); totalgapquoarterly2 += NTR(re[i].gap2domestic);
                                    totalgapquoarterly3 += NTR(re[i].gap3domestic); totalgapquoarterly4 += NTR(re[i].gap4domestic);
                                    gap1domestic += NTR(re[i].gap1domestic); gap2domestic += NTR(re[i].gap2domestic);
                                    gap3domestic += NTR(re[i].gap3domestic); gap4domestic += NTR(re[i].gap4domestic);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'IP Transit') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1ip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1ip + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2ip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2ip + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3ip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3ip + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4ip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4ip + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percip,re[i].quoarterlyip))
                                ActualTotal += NTR(re[i].quoarterlyip)
                                Totalip += NTR(re[i].quoarterlyip)
                                totalquoarterly1 += NTR(re[i].quoarterly1ip); totalquoarterly2 += NTR(re[i].quoarterly2ip);
                                totalquoarterly3 += NTR(re[i].quoarterly3ip); totalquoarterly4 += NTR(re[i].quoarterly4ip);
                                total1ip += NTR(re[i].quoarterly1ip); total2ip += NTR(re[i].quoarterly2ip);
                                total3ip += NTR(re[i].quoarterly3ip); total4ip += NTR(re[i].quoarterly4ip);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1ip)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2ip)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3ip)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4ip)
                                    s.setLineItemValue('custpage_total', line, re[i].targetip)
                                    TargetlTotal += NTR(re[i].targetip)
                                    targetip += NTR(re[i].targetip)
                                    totaltargetquoarterly1 += NTR(re[i].target1ip); totaltargetquoarterly2 += NTR(re[i].target2ip);
                                    totaltargetquoarterly3 += NTR(re[i].target3ip); totaltargetquoarterly4 += NTR(re[i].target4ip);
                                    target1ip += NTR(re[i].target1ip); target2ip += NTR(re[i].target2ip);
                                    target3ip += NTR(re[i].target3ip); target4ip += NTR(re[i].target4ip);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1ip)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2ip)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3ip)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4ip)
                                    s.setLineItemValue('custpage_total', line, re[i].percip)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1ip, re[i].gap1ip))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2ip, re[i].gap2ip))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3ip, re[i].gap3ip))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4ip, re[i].gap4ip))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percip, re[i].gapip))
                                    s.setLineItemValue('custpage_total', line, re[i].gapip)
                                    GAPTotal += NTR(re[i].gapip)
                                    gapip += NTR(re[i].gapip)
                                    totalgapquoarterly1 += NTR(re[i].gap1ip); totalgapquoarterly2 += NTR(re[i].gap2ip);
                                    totalgapquoarterly3 += NTR(re[i].gap3ip); totalgapquoarterly4 += NTR(re[i].gap4ip);
                                    gap1ip += NTR(re[i].gap1ip); gap2ip += NTR(re[i].gap2ip);
                                    gap3ip += NTR(re[i].gap3ip); gap4ip += NTR(re[i].gap4ip);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'IRU') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1iru) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1iru + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc1iru) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2iru + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc1iru) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3iru + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc1iru) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4iru + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line,getGapColor(re[i].perciru, re[i].quoarterlyiru))
                                ActualTotal += NTR(re[i].quoarterlyiru)
                                Totaliru += NTR(re[i].quoarterlyiru)
                                totalquoarterly1 += NTR(re[i].quoarterly1iru); totalquoarterly2 += NTR(re[i].quoarterly2iru);
                                totalquoarterly3 += NTR(re[i].quoarterly3iru); totalquoarterly4 += NTR(re[i].quoarterly4iru);
                                total1iru += NTR(re[i].quoarterly1iru); total2iru += NTR(re[i].quoarterly2iru);
                                total3iru += NTR(re[i].quoarterly3iru); total4iru += NTR(re[i].quoarterly4iru);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1iru)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2iru)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3iru)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4iru)
                                    s.setLineItemValue('custpage_total', line, re[i].targetiru)
                                    TargetlTotal += NTR(re[i].targetiru)
                                    targetiru += NTR(re[i].targetiru)
                                    totaltargetquoarterly1 += NTR(re[i].target1iru); totaltargetquoarterly2 += NTR(re[i].target2iru);
                                    totaltargetquoarterly3 += NTR(re[i].target3iru); totaltargetquoarterly4 += NTR(re[i].target4iru);
                                    target1iru += NTR(re[i].target1iru); target2iru += NTR(re[i].target2iru);
                                    target3iru += NTR(re[i].target3iru); target4iru += NTR(re[i].target4iru);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1iru)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2iru)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3iru)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4iru)
                                    s.setLineItemValue('custpage_total', line, re[i].perciru)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1iru, re[i].gap1iru))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2iru, re[i].gap2iru))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3iru, re[i].gap3iru))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4iru, re[i].gap4iru))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perciru, re[i].gapiru))
                                    GAPTotal += NTR(re[i].gapiru)
                                    gapiru += NTR(re[i].gapiru)
                                    totalgapquoarterly1 += NTR(re[i].gap1iru); totalgapquoarterly2 += NTR(re[i].gap2iru);
                                    totalgapquoarterly3 += NTR(re[i].gap3iru); totalgapquoarterly4 += NTR(re[i].gap4iru);
                                    gap1iru += NTR(re[i].gap1iru); gap2iru += NTR(re[i].gap2iru);
                                    gap3iru += NTR(re[i].gap3iru); gap4iru += NTR(re[i].gap4iru);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'VSAT KU Band Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1kuband + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2kuband + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3kuband + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4kuband + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perckuband,re[i].quoarterlykuband))
                                ActualTotal += NTR(re[i].quoarterlykuband)
                                Totalkuband += NTR(re[i].quoarterlykuband)
                                totalquoarterly1 += NTR(re[i].quoarterly1kuband); totalquoarterly2 += NTR(re[i].quoarterly2kuband);
                                totalquoarterly3 += NTR(re[i].quoarterly3kuband); totalquoarterly4 += NTR(re[i].quoarterly4kuband);
                                total1kuband += NTR(re[i].quoarterly1kuband); total2kuband += NTR(re[i].quoarterly2kuband);
                                total3kuband += NTR(re[i].quoarterly3kuband); total4kuband += NTR(re[i].quoarterly4kuband);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1kuband)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2kuband)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3kuband)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4kuband)
                                    s.setLineItemValue('custpage_total', line, re[i].targetkuband)
                                    TargetlTotal += NTR(re[i].targetkuband)
                                    targetkuband += NTR(re[i].targetkuband)
                                    totaltargetquoarterly1 += NTR(re[i].target1kuband); totaltargetquoarterly2 += NTR(re[i].target2kuband);
                                    totaltargetquoarterly3 += NTR(re[i].target3kuband); totaltargetquoarterly4 += NTR(re[i].target4kuband);
                                    target1kuband += NTR(re[i].target1kuband); target2kuband += NTR(re[i].target2kuband);
                                    target3kuband += NTR(re[i].target3kuband); target4kuband += NTR(re[i].target4kuband);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1kuband)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2kuband)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3kuband)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4kuband)
                                    s.setLineItemValue('custpage_total', line, re[i].perckuband)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1kuband, re[i].gap1kuband))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2kuband, re[i].gap2kuband))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3kuband, re[i].gap3kuband))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4kuband, re[i].gap4kuband))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perckuband, re[i].gapkuband))
                                    GAPTotal += NTR(re[i].gapkuband)
                                    gapkuband += NTR(re[i].gapkuband)
                                    totalgapquoarterly1 += NTR(re[i].gap1kuband); totalgapquoarterly2 += NTR(re[i].gap2kuband);
                                    totalgapquoarterly3 += NTR(re[i].gap3kuband); totalgapquoarterly4 += NTR(re[i].gap4kuband);
                                    gap1kuband += NTR(re[i].gap1kuband); gap2kuband += NTR(re[i].gap2kuband);
                                    gap3kuband += NTR(re[i].gap3kuband); gap4kuband += NTR(re[i].gap4kuband);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Mobile VSAT') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1mobile_vsat + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2mobile_vsat + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3mobile_vsat + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4mobile_vsat + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line,getGapColor(re[i].percmobile_vsat, re[i].quoarterlymobile_vsat))
                                ActualTotal += NTR(re[i].quoarterlymobile_vsat)
                                Totalmobile_vsat += NTR(re[i].quoarterlymobile_vsat)
                                totalquoarterly1 += NTR(re[i].quoarterly1mobile_vsat); totalquoarterly2 += NTR(re[i].quoarterly2mobile_vsat);
                                totalquoarterly3 += NTR(re[i].quoarterly3mobile_vsat); totalquoarterly4 += NTR(re[i].quoarterly4mobile_vsat);
                                total1mobile_vsat += NTR(re[i].quoarterly1mobile_vsat); total2mobile_vsat += NTR(re[i].quoarterly2mobile_vsat);
                                total3mobile_vsat += NTR(re[i].quoarterly3mobile_vsat); total3mobile_vsat += NTR(re[i].quoarterly4mobile_vsat);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4mobile_vsat)
                                    s.setLineItemValue('custpage_total', line, re[i].targetmobile_vsat)
                                    TargetlTotal += NTR(re[i].targetmobile_vsat)
                                    targetmobile_vsat += NTR(re[i].targetmobile_vsat)
                                    totaltargetquoarterly1 += NTR(re[i].target1mobile_vsat); totaltargetquoarterly2 += NTR(re[i].target2mobile_vsat);
                                    totaltargetquoarterly3 += NTR(re[i].target3mobile_vsat); totaltargetquoarterly4 += NTR(re[i].target4mobile_vsat);
                                    target1mobile_vsat += NTR(re[i].target1mobile_vsat); target2mobile_vsat += NTR(re[i].target2mobile_vsat);
                                    target3mobile_vsat += NTR(re[i].target3mobile_vsat); target4mobile_vsat += NTR(re[i].target4mobile_vsat);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3mobile_vsat)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4mobile_vsat)
                                    s.setLineItemValue('custpage_total', line, re[i].percmobile_vsat)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1mobile_vsat, re[i].gap1mobile_vsat))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2mobile_vsat, re[i].gap2mobile_vsat))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3mobile_vsat, re[i].gap3mobile_vsat))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4mobile_vsat, re[i].gap4mobile_vsat))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmobile_vsat, re[i].gapmobile_vsat))
                                    GAPTotal += NTR(re[i].gapmobile_vsat)
                                    gapmobile_vsat += NTR(re[i].gapmobile_vsat)
                                    totalgapquoarterly1 += NTR(re[i].gap1mobile_vsat); totalgapquoarterly2 += NTR(re[i].gap2mobile_vsat);
                                    totalgapquoarterly3 += NTR(re[i].gap3mobile_vsat); totalgapquoarterly4 += NTR(re[i].gap4mobile_vsat);
                                    gap1mobile_vsat += NTR(re[i].gap1mobile_vsat); gap2mobile_vsat += NTR(re[i].gap2mobile_vsat);
                                    gap3mobile_vsat += NTR(re[i].gap3mobile_vsat); gap4mobile_vsat += NTR(re[i].gap4mobile_vsat);
                                }
                            }
                            line = line + 1;
                        } 
                        else if (ProductFamilyList[z].name == 'MPLS & IPLC') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1mpip + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2mpip + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3mpip + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4mpip + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line,  getGapColor(re[i].percmpip,re[i].quoarterlympip))
                                ActualTotal += NTR(re[i].quoarterlympip)
                                Totalmpip += NTR(re[i].quoarterlympip)
                                totalquoarterly1 += NTR(re[i].quoarterly1mpip); totalquoarterly2 += NTR(re[i].quoarterly2mpip);
                                totalquoarterly3 += NTR(re[i].quoarterly3mpip); totalquoarterly4 += NTR(re[i].quoarterly4mpip);
                                total1mpip += NTR(re[i].quoarterly1mpip); total2mpip += NTR(re[i].quoarterly2mpip);
                                total3mpip += NTR(re[i].quoarterly3mpip); total4mpip += NTR(re[i].quoarterly4mpip);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1mpip)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2mpip)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3mpip)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4mpip)
                                    s.setLineItemValue('custpage_total', line, re[i].targetmpip)
                                    TargetlTotal += NTR(re[i].targetmpip)
                                    targetmpip += NTR(re[i].targetmpip)
                                    totaltargetquoarterly1 += NTR(re[i].target1mpip); totaltargetquoarterly2 += NTR(re[i].target2mpip);
                                    totaltargetquoarterly3 += NTR(re[i].target3mpip); totaltargetquoarterly4 += NTR(re[i].target4mpip);
                                    target1mpip += NTR(re[i].target1mpip); target2mpip += NTR(re[i].target2mpip);
                                    target3mpip += NTR(re[i].target3mpip); target4mpip += NTR(re[i].target4mpip);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1mpip)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2mpip)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3mpip)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4mpip)
                                    s.setLineItemValue('custpage_total', line, re[i].percmpip)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1mpip, re[i].gap1mpip))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2mpip, re[i].gap2mpip))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3mpip, re[i].gap3mpip))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4mpip, re[i].gap4mpip))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmpip, re[i].gapmpip))
                                    GAPTotal += NTR(re[i].gapmpip)
                                    gapmpip += NTR(re[i].gapmpip)
                                    totalgapquoarterly1 += NTR(re[i].gap1mpip); totalgapquoarterly2 += NTR(re[i].gap2mpip);
                                    totalgapquoarterly3 += NTR(re[i].gap3mpip); totalgapquoarterly4 += NTR(re[i].gap4mpip);
                                    gap1mpip += NTR(re[i].gap1mpip); gap2mpip += NTR(re[i].gap2mpip);
                                    gap3mpip += NTR(re[i].gap3mpip); gap4mpip += NTR(re[i].gap4mpip);
                                }
                            }
                            line = line + 1;
                        } // z==0
                        else if (ProductFamilyList[z].name == 'O3B') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1o3b) + "'" + "  href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1o3b + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2o3b) + "'" + "  href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2o3b + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3o3b) + "'" + "  href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3o3b + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4o3b) + "'" + "  href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4o3b + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perco3b,re[i].quoarterlyo3b))
                                ActualTotal += NTR(re[i].quoarterlyo3b)
                                Totalo3b += NTR(re[i].quoarterlyo3b)
                                totalquoarterly1 += NTR(re[i].quoarterly1o3b); totalquoarterly2 += NTR(re[i].quoarterly2o3b);
                                totalquoarterly3 += NTR(re[i].quoarterly3o3b); totalquoarterly4 += NTR(re[i].quoarterly4o3b);
                                total1o3b += NTR(re[i].quoarterly1o3b); total2o3b += NTR(re[i].quoarterly2o3b);
                                total3o3b += NTR(re[i].quoarterly3o3b); total4o3b += NTR(re[i].quoarterly4o3b);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1o3b)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2o3b)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3o3b)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4o3b)
                                    s.setLineItemValue('custpage_total', line, re[i].targeto3b)
                                    TargetlTotal += NTR(re[i].targeto3b)
                                    targeto3b += NTR(re[i].targeto3b)
                                    totaltargetquoarterly1 += NTR(re[i].target1o3b); totaltargetquoarterly2 += NTR(re[i].target2o3b);
                                    totaltargetquoarterly3 += NTR(re[i].target3o3b); totaltargetquoarterly4 += NTR(re[i].target4o3b);
                                    target1o3b += NTR(re[i].target1o3b); target2o3b += NTR(re[i].target2o3b);
                                    target3o3b += NTR(re[i].target3o3b); target4o3b += NTR(re[i].target4o3b);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1o3b)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2o3b)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3o3b)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4o3b)
                                    s.setLineItemValue('custpage_total', line, re[i].perco3b)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1o3b, re[i].gap1o3b))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2o3b, re[i].gap2o3b))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3o3b, re[i].gap3o3b))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4o3b, re[i].gap4o3b))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perco3b, re[i].gapo3b))
                                    GAPTotal += NTR(re[i].gapo3b)
                                    gapo3b += NTR(re[i].gapo3b)
                                    totalgapquoarterly1 += NTR(re[i].gap1o3b); totalgapquoarterly2 += NTR(re[i].gap2o3b);
                                    totalgapquoarterly3 += NTR(re[i].gap3o3b); totalgapquoarterly4 += NTR(re[i].gap4o3b);
                                    gap1o3b += NTR(re[i].gap1o3b); gap2o3b += NTR(re[i].gap2o3b);
                                    gap3o3b += NTR(re[i].gap3o3b); gap4o3b += NTR(re[i].gap4o3b);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Professional Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1ps) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1ps + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2ps) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2ps + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3ps) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3ps + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4ps) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4ps + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percps,re[i].quoarterlyps))
                                ActualTotal += NTR(re[i].quoarterlyps)
                                Totalps += NTR(re[i].quoarterlyps)
                                totalquoarterly1 += NTR(re[i].quoarterly1ps); totalquoarterly2 += NTR(re[i].quoarterly2ps);
                                totalquoarterly3 += NTR(re[i].quoarterly3ps); totalquoarterly4 += NTR(re[i].quoarterly4ps);
                                total1ps += NTR(re[i].quoarterly1ps); total2ps += NTR(re[i].quoarterly2ps);
                                total3ps += NTR(re[i].quoarterly3ps); total4ps += NTR(re[i].quoarterly4ps);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1ps)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2ps)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3ps)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4ps)
                                    s.setLineItemValue('custpage_total', line, re[i].targetps)
                                    TargetlTotal += NTR(re[i].targetps)
                                    targetps += NTR(re[i].targetps)
                                    totaltargetquoarterly1 += NTR(re[i].target1ps); totaltargetquoarterly2 += NTR(re[i].target2ps);
                                    totaltargetquoarterly3 += NTR(re[i].target3ps); totaltargetquoarterly4 += NTR(re[i].target4ps);
                                    target1ps += NTR(re[i].target1ps); target2ps += NTR(re[i].target2ps);
                                    target3ps += NTR(re[i].target3ps); target4ps += NTR(re[i].target4ps);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1ps)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2ps)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3ps)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4ps)
                                    s.setLineItemValue('custpage_total', line, re[i].percps)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1ps, re[i].gap1ps))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2ps, re[i].gap2ps))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3ps, re[i].gap3ps))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4ps, re[i].gap4ps))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percps, re[i].gapps))
                                    GAPTotal += NTR(re[i].gapps)
                                    gapps += NTR(re[i].gapps)
                                    totalgapquoarterly1 += NTR(re[i].gap1ps); totalgapquoarterly2 += NTR(re[i].gap2ps);
                                    totalgapquoarterly3 += NTR(re[i].gap3ps); totalgapquoarterly4 += NTR(re[i].gap4ps);
                                    gap1ps += NTR(re[i].gap1ps); gap2ps += NTR(re[i].gap2ps);
                                    gap3ps += NTR(re[i].gap3ps); gap4ps += NTR(re[i].gap4ps);
                                }
                            }
                            line = line + 1;
                        } 
                        else if (ProductFamilyList[z].name == 'Satellite Raw') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1sr) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1sr + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2sr) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2sr + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3sr) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3sr + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4sr) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4sr + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percsr,re[i].quoarterlysr))
                                ActualTotal += NTR(re[i].quoarterlysr)
                                Totalsr += NTR(re[i].quoarterlysr)
                                totalquoarterly1 += NTR(re[i].quoarterly1sr); totalquoarterly2 += NTR(re[i].quoarterly2sr);
                                totalquoarterly3 += NTR(re[i].quoarterly3sr); totalquoarterly4 += NTR(re[i].quoarterly4sr);
                                total1sr += NTR(re[i].quoarterly1sr); total2sr += NTR(re[i].quoarterly2sr);
                                total3sr += NTR(re[i].quoarterly3sr); total4sr += NTR(re[i].quoarterly4sr);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1sr)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2sr)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3sr)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4sr)
                                    s.setLineItemValue('custpage_total', line, re[i].targetsr)
                                    TargetlTotal += NTR(re[i].targetsr)
                                    targetsr += NTR(re[i].targetsr)
                                    totaltargetquoarterly1 += NTR(re[i].target1sr); totaltargetquoarterly2 += NTR(re[i].target2sr);
                                    totaltargetquoarterly3 += NTR(re[i].target3sr); totaltargetquoarterly4 += NTR(re[i].target4sr);
                                    target1sr += NTR(re[i].target1sr); target2sr += NTR(re[i].target2sr);
                                    target3sr += NTR(re[i].target3sr); target4sr += NTR(re[i].target4sr);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1sr)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2sr)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3sr)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4sr)
                                    s.setLineItemValue('custpage_total', line, re[i].percps)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1sr, re[i].gap1sr))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2sr, re[i].gap2sr))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3sr, re[i].gap3sr))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4sr, re[i].gap4sr))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percsr, re[i].gapsr))
                                    GAPTotal += NTR(re[i].gapsr)
                                    gapsr += NTR(re[i].gapsr)
                                    totalgapquoarterly1 += NTR(re[i].gap1sr); totalgapquoarterly2 += NTR(re[i].gap2sr);
                                    totalgapquoarterly3 += NTR(re[i].gap3sr); totalgapquoarterly4 += NTR(re[i].gap4sr);
                                    gap1sr += NTR(re[i].gap1sr); gap2sr += NTR(re[i].gap2sr);
                                    gap3sr += NTR(re[i].gap3sr); gap4sr += NTR(re[i].gap4sr);
                                }
                            }
                            line = line + 1;
                        } 
                        else if (ProductFamilyList[z].name == 'HW FSS') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1hw + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2hw + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc2hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3hw + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4hw + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line,getGapColor(re[i].perchw, re[i].quoarterlyhw))
                                ActualTotal += NTR(re[i].quoarterlyhw)
                                Totalhw += NTR(re[i].quoarterlyhw)
                                totalquoarterly1 += NTR(re[i].quoarterly1hw); totalquoarterly2 += NTR(re[i].quoarterly2hw);
                                totalquoarterly3 += NTR(re[i].quoarterly3hw); totalquoarterly4 += NTR(re[i].quoarterly4hw);
                                total1hw += NTR(re[i].quoarterly1hw); total2hw += NTR(re[i].quoarterly2hw);
                                total3hw += NTR(re[i].quoarterly3hw); total4hw += NTR(re[i].quoarterly4hw);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1hw)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2hw)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3hw)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4hw)
                                    s.setLineItemValue('custpage_total', line, re[i].targethw)
                                    TargetlTotal += NTR(re[i].targethw)
                                    targethw += NTR(re[i].targethw)
                                    totaltargetquoarterly1 += NTR(re[i].target1hw); totaltargetquoarterly2 += NTR(re[i].target2hw);
                                    totaltargetquoarterly3 += NTR(re[i].target3hw); totaltargetquoarterly4 += NTR(re[i].target4hw);
                                    target1hw += NTR(re[i].target1hw); target2hw += NTR(re[i].target2hw);
                                    target3hw += NTR(re[i].target3hw); target4hw += NTR(re[i].target4hw);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1hw)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2hw)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3hw)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4hw)
                                    s.setLineItemValue('custpage_total', line, re[i].perchw)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1hw, re[i].gap1hw))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2hw, re[i].gap2hw))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3hw, re[i].gap3hw))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4hw, re[i].gap4hw))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perchw, re[i].gaphw))
                                    GAPTotal += NTR(re[i].gaphw)
                                    gaphw += NTR(re[i].gaphw)
                                    totalgapquoarterly1 += NTR(re[i].gap1hw); totalgapquoarterly2 += NTR(re[i].gap2hw);
                                    totalgapquoarterly3 += NTR(re[i].gap3hw); totalgapquoarterly4 += NTR(re[i].gap4hw);
                                    gap1hw += NTR(re[i].gap1hw); gap2hw += NTR(re[i].gap2hw);
                                    gap3hw += NTR(re[i].gap3hw); gap4hw += NTR(re[i].gap4hw);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'D&HLS HW') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1dhls_hw + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2dhls_hw + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3dhls_hw + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4dhls_hw + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdhls_hw,re[i].quoarterlydhls_hw))
                                ActualTotal += NTR(re[i].quoarterlydhls_hw)
                                Totaldhls_hw += NTR(re[i].quoarterlydhls_hw)
                                totalquoarterly1 += NTR(re[i].quoarterly1dhls_hw); totalquoarterly2 += NTR(re[i].quoarterly2dhls_hw);
                                totalquoarterly3 += NTR(re[i].quoarterly3dhls_hw); totalquoarterly4 += NTR(re[i].quoarterly4dhls_hw);
                                total1dhls_hw += NTR(re[i].quoarterly1dhls_hw); total2dhls_hw += NTR(re[i].quoarterly2dhls_hw);
                                total3dhls_hw += NTR(re[i].quoarterly3dhls_hw); total4dhls_hw += NTR(re[i].quoarterly4dhls_hw);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4dhls_hw)
                                    s.setLineItemValue('custpage_total', line, re[i].targetdhls_hw)
                                    TargetlTotal += NTR(re[i].targetdhls_hw)
                                    targetdhls_hw += NTR(re[i].targetdhls_hw)
                                    totaltargetquoarterly1 += NTR(re[i].target1dhls_hw); totaltargetquoarterly2 += NTR(re[i].target2dhls_hw);
                                    totaltargetquoarterly3 += NTR(re[i].target3dhls_hw); totaltargetquoarterly4 += NTR(re[i].target4dhls_hw);
                                    target1dhls_hw += NTR(re[i].target1dhls_hw); target2dhls_hw += NTR(re[i].target2dhls_hw);
                                    target3dhls_hw += NTR(re[i].target3dhls_hw); target4dhls_hw += NTR(re[i].target4dhls_hw);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3dhls_hw)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4dhls_hw)
                                    s.setLineItemValue('custpage_total', line, re[i].percdhls_hw)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1dhls_hw, re[i].gap1dhls_hw))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2dhls_hw, re[i].gap2dhls_hw))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3dhls_hw, re[i].gap3dhls_hw))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4dhls_hw, re[i].gap4dhls_hw))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdhls_hw, re[i].gapdhls_hw))
                                    GAPTotal += NTR(re[i].gapdhls_hw)
                                    gapdhls_hw += NTR(re[i].gapdhls_hw)
                                    totalgapquoarterly1 += NTR(re[i].gap1dhls_hw); totalgapquoarterly2 += NTR(re[i].gap2dhls_hw);
                                    totalgapquoarterly3 += NTR(re[i].gap3dhls_hw); totalgapquoarterly4 += NTR(re[i].gap4dhls_hw);
                                    gap1dhls_hw += NTR(re[i].gap1dhls_hw); gap2dhls_hw += NTR(re[i].gap2dhls_hw);
                                    gap3dhls_hw += NTR(re[i].gap3dhls_hw); gap4dhls_hw += NTR(re[i].gap4dhls_hw);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'D&HLS Service') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1gt) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1gt + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2gt) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2gt + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3gt) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3gt + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4gt) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4gt + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgt,re[i].quoarterlygt))
                                ActualTotal += NTR(re[i].quoarterlygt)
                                Totalgt += NTR(re[i].quoarterlygt)
                                totalquoarterly1 += NTR(re[i].quoarterly1gt); totalquoarterly2 += NTR(re[i].quoarterly2gt);
                                totalquoarterly3 += NTR(re[i].quoarterly3gt); totalquoarterly4 += NTR(re[i].quoarterly4gt);
                                total1gt += NTR(re[i].quoarterly1gt); total2gt += NTR(re[i].quoarterly2gt);
                                total3gt += NTR(re[i].quoarterly3gt); total4gt += NTR(re[i].quoarterly4gt);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1gt)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2gt)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3gt)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4gt)
                                    s.setLineItemValue('custpage_total', line, re[i].targetgt)
                                    TargetlTotal += NTR(re[i].targetgt)
                                    targetgt += NTR(re[i].targetgt)
                                    totaltargetquoarterly1 += NTR(re[i].target1gt); totaltargetquoarterly2 += NTR(re[i].target2gt);
                                    totaltargetquoarterly3 += NTR(re[i].target3gt); totaltargetquoarterly4 += NTR(re[i].target4gt);
                                    target1gt += NTR(re[i].target1gt); target2gt += NTR(re[i].target2gt);
                                    target3gt += NTR(re[i].target3gt); target4gt += NTR(re[i].target4gt);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1gt)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2gt)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3gt)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4gt)
                                    s.setLineItemValue('custpage_total', line, re[i].percgt)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1gt, re[i].gap1gt))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2gt, re[i].gap2gt))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3gt, re[i].gap3gt))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4gt, re[i].gap4gt))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgt, re[i].gapgt))
                                    GAPTotal += NTR(re[i].gapgt)
                                    gapgt += NTR(re[i].gapgt)
                                    totalgapquoarterly1 += NTR(re[i].gap1gt); totalgapquoarterly2 += NTR(re[i].gap2gt);
                                    totalgapquoarterly3 += NTR(re[i].gap3gt); totalgapquoarterly4 += NTR(re[i].gap4gt);
                                    gap1gt += NTR(re[i].gap1gt); gap2gt += NTR(re[i].gap2gt);
                                    gap3gt += NTR(re[i].gap3gt); gap4gt += NTR(re[i].gap4gt);
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'General') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var quoarterly1 = "<a style='color:" + getColor(re[i].perc1general) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=1&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly1general + "</a>";
                                var quoarterly2 = "<a style='color:" + getColor(re[i].perc2general) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=2&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly2general + "</a>";
                                var quoarterly3 = "<a style='color:" + getColor(re[i].perc3general) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=3&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly3general + "</a>";
                                var quoarterly4 = "<a style='color:" + getColor(re[i].perc4general) + "'" + " href='" + link + re[i].sales_rep_id + '&qu=4&type=2' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].quoarterly4general + "</a>";
                                s.setLineItemValue('custpage_quoarterly1', line, quoarterly1)
                                s.setLineItemValue('custpage_quoarterly2', line, quoarterly2)
                                s.setLineItemValue('custpage_quoarterly3', line, quoarterly3)
                                s.setLineItemValue('custpage_quoarterly4', line, quoarterly4)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgeneral, re[i].quoarterlygeneral))
                                ActualTotal += NTR(re[i].quoarterlygeneral)
                                Totalgeneral += NTR(re[i].quoarterlygeneral)
                                totalquoarterly1 += NTR(re[i].quoarterly1general); totalquoarterly2 += NTR(re[i].quoarterly2general);
                                totalquoarterly3 += NTR(re[i].quoarterly3general); totalquoarterly4 += NTR(re[i].quoarterly4general);
                                total1general += NTR(re[i].quoarterly1general); total2general += NTR(re[i].quoarterly2general);
                                total3general += NTR(re[i].quoarterly3general); total4general += NTR(re[i].quoarterly4general);
                            } else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].target1general)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].target2general)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].target3general)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].target4general)
                                    s.setLineItemValue('custpage_total', line, re[i].targetgeneral)
                                    TargetlTotal += NTR(re[i].targetgeneral)
                                    targetgeneral += NTR(re[i].targetgeneral)
                                    totaltargetquoarterly1 += NTR(re[i].target1general); totaltargetquoarterly2 += NTR(re[i].target2general);
                                    totaltargetquoarterly3 += NTR(re[i].target3general); totaltargetquoarterly4 += NTR(re[i].target4general);
                                    target1general += NTR(re[i].target1general); target2general += NTR(re[i].target2general);
                                    target3general += NTR(re[i].target3general); target4general += NTR(re[i].target4general);
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_quoarterly1', line, re[i].perc1general)
                                    s.setLineItemValue('custpage_quoarterly2', line, re[i].perc2general)
                                    s.setLineItemValue('custpage_quoarterly3', line, re[i].perc3general)
                                    s.setLineItemValue('custpage_quoarterly4', line, re[i].perc4general)
                                    s.setLineItemValue('custpage_total', line, re[i].percgeneral)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_quoarterly1', line, getGapColor(re[i].perc1general, re[i].gap1general))
                                    s.setLineItemValue('custpage_quoarterly2', line, getGapColor(re[i].perc2general, re[i].gap2general))
                                    s.setLineItemValue('custpage_quoarterly3', line, getGapColor(re[i].perc3general, re[i].gap3general))
                                    s.setLineItemValue('custpage_quoarterly4', line, getGapColor(re[i].perc4general, re[i].gap4general))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgeneral, re[i].gapgeneral))
                                    GAPTotal += NTR(re[i].gapgeneral)
                                    gapgeneral += NTR(re[i].gapgeneral)
                                    totalgapquoarterly1 += NTR(re[i].gap1general); totalgapquoarterly2 += NTR(re[i].gap2general);
                                    totalgapquoarterly3 += NTR(re[i].gap3general); totalgapquoarterly4 += NTR(re[i].gap4general);
                                    gap1general += NTR(re[i].gap1general); gap2general += NTR(re[i].gap2general);
                                    gap3general += NTR(re[i].gap3general); gap4general += NTR(re[i].gap4general);
                                }
                            }
                            line = line + 1;
                        }
                    }
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
                line = (i * 64) + 1;
                for (z = 0; z < ProductFamilyList.length; z++) {
                    for (var m = 0; m < 4; m++) {
                        if (ProductFamilyList[z].name == 'Backbone Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1bbs + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2bbs) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2bbs + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbbs ,  re[i].halfYearlybbs))
                                ActualTotal += NTR(re[i].halfYearlybbs)
                                Totalbbs += NTR(re[i].halfYearlybbs)
                                totalhalfYearly1 += NTR(re[i].halfYearly1bbs)
                                totalhalfYearly2 += NTR(re[i].halfYearly2bbs)
                                total1bbs += NTR(re[i].halfYearly1bbs)
                                total2bbs += NTR(re[i].halfYearly2bbs)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1bbs)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2bbs)
                                    s.setLineItemValue('custpage_total', line, re[i].targetbbs)
                                    ActualTotal += NTR(re[i].halfYearlybbs)
                                    targetbbs += NTR(re[i].halfYearlybbs)
                                    totaltargethalfYearly1 += NTR(re[i].target1bbs)
                                    totaltargethalfYearly2 += NTR(re[i].target2bbs)
                                    target1bbs += NTR(re[i].target1bbs)
                                    target2bbs += NTR(re[i].target2bbs)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1bbs)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2bbs)
                                    s.setLineItemValue('custpage_total', line, re[i].percbbs)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1bbs,re[i].gap1bbs))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2bbs,re[i].gap2bbs))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbbs,re[i].gapbbs))
                                    GAPTotal += NTR(re[i].gapbbs)
                                    gapbbs += NTR(re[i].gapbbs)
                                    totalgaphalfYearly1 += NTR(re[i].gap1bbs)
                                    totalgaphalfYearly2 += NTR(re[i].gap2bbs)
                                    gap1bbs += NTR(re[i].gap1bbs)
                                    gap2bbs += NTR(re[i].gap2bbs)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'VAS') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1vas) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1vas + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2vas) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2vas + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percvas,re[i].halfYearlyvas))
                                ActualTotal += NTR(re[i].halfYearlyvas)
                                Totalvas += NTR(re[i].halfYearlyvas)
                                totalhalfYearly1 += NTR(re[i].halfYearly1vas)
                                totalhalfYearly2 += NTR(re[i].halfYearly2vas)
                                total1vas += NTR(re[i].halfYearly1vas)
                                total2vas += NTR(re[i].halfYearly2vas)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1vas)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2vas)
                                    s.setLineItemValue('custpage_total', line, re[i].targetvas)
                                    TargetlTotal += NTR(re[i].targetvas)
                                    targetvas += NTR(re[i].targetvas)
                                    totaltargethalfYearly1 += NTR(re[i].target1vas)
                                    totaltargethalfYearly2 += NTR(re[i].target2vas)
                                    target1vas += NTR(re[i].target1vas)
                                    target2vas += NTR(re[i].target2vas)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1vas)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2vas)
                                    s.setLineItemValue('custpage_total', line, re[i].percvas)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1vas, re[i].gap1vas))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2vas, re[i].gap2vas))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percvas, re[i].gapvas))
                                    GAPTotal += NTR(re[i].gapvas)
                                    gapvas += NTR(re[i].gapvas)
                                    totalgaphalfYearly1 += NTR(re[i].gap1vas)
                                    totalgaphalfYearly2 += NTR(re[i].gap2vas)
                                    gap1vas += NTR(re[i].gap1vas)
                                    gap2vas += NTR(re[i].gap2vas)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'BOD') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1bod) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1bod + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2bod) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2bod + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line,  getGapColor(re[i].percbod,re[i].halfYearlybod))
                                ActualTotal += NTR(re[i].halfYearlybod)
                                Totalbod += NTR(re[i].halfYearlybod)
                                totalhalfYearly1 += NTR(re[i].halfYearly1bod)
                                totalhalfYearly2 += NTR(re[i].halfYearly2bod)
                                total1bod += NTR(re[i].halfYearly1bod)
                                total2bod += NTR(re[i].halfYearly2bod)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1bod)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2bod)
                                    s.setLineItemValue('custpage_total', line, re[i].targetbod)
                                    TargetlTotal += NTR(re[i].targetbod)
                                    targetbod += NTR(re[i].targetbod)
                                    totaltargethalfYearly1 += NTR(re[i].target1bod)
                                    totaltargethalfYearly2 += NTR(re[i].target2bod)
                                    target1bod += NTR(re[i].target1bod)
                                    target2bod += NTR(re[i].target2bod)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1bod)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2bod)
                                    s.setLineItemValue('custpage_total', line, re[i].percbod)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1bod, re[i].gap1bod))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2bod, re[i].gap2bod))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percbod, re[i].gapbod))
                                    GAPTotal += NTR(re[i].gapbod)
                                    gapbod += NTR(re[i].gapbod)
                                    totalgaphalfYearly1 += NTR(re[i].gap1bod)
                                    totalgaphalfYearly2 += NTR(re[i].gap2bod)
                                    gap1bod += NTR(re[i].gap1bod)
                                    gap2bod += NTR(re[i].gap2bod)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'VSAT C Band Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1cband) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1cband + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2cband) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2cband + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perccband,re[i].halfYearlycband))
                                ActualTotal += NTR(re[i].halfYearlycband)
                                Totalcband += NTR(re[i].halfYearlycband)
                                totalhalfYearly1 += NTR(re[i].halfYearly1cband)
                                totalhalfYearly2 += NTR(re[i].halfYearly2cband)
                                total1cband += NTR(re[i].halfYearly1cband)
                                total2cband += NTR(re[i].halfYearly2cband)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1cband)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2cband)
                                    s.setLineItemValue('custpage_total', line, re[i].targetcband)
                                    TargetlTotal += NTR(re[i].targetcband)
                                    targetcband += NTR(re[i].targetcband)
                                    totaltargethalfYearly1 += NTR(re[i].target1cband)
                                    totaltargethalfYearly2 += NTR(re[i].target2cband)
                                    target1cband += NTR(re[i].target1cband)
                                    target2cband += NTR(re[i].target2cband)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1cband)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2cband)
                                    s.setLineItemValue('custpage_total', line, re[i].perccband)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1cband, re[i].gap1cband))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2cband, re[i].gap2cband))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perccband, re[i].gapcband))
                                    GAPTotal += NTR(re[i].gapcband)
                                    gapcband += NTR(re[i].gapcband)
                                    totalgaphalfYearly1 += NTR(re[i].gap1cband)
                                    totalgaphalfYearly2 += NTR(re[i].gap2cband)
                                    gap1cband += NTR(re[i].gap1cband)
                                    gap2cband += NTR(re[i].gap2cband)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Domestic') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1domestic + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2domestic) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2domestic + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdomestic, re[i].halfYearlydomestic))
                                ActualTotal += NTR(re[i].halfYearlydomestic)
                                Totaldomestic += NTR(re[i].halfYearlydomestic)
                                totalhalfYearly1 += NTR(re[i].halfYearly1domestic)
                                totalhalfYearly2 += NTR(re[i].halfYearly2domestic)
                                total1domestic += NTR(re[i].halfYearly1domestic)
                                total2domestic += NTR(re[i].halfYearly2domestic)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1domestic)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2domestic)
                                    s.setLineItemValue('custpage_total', line, re[i].targetdomestic)
                                    TargetlTotal += NTR(re[i].targetdomestic)
                                    targetdomestic += NTR(re[i].targetdomestic)
                                    totaltargethalfYearly1 += NTR(re[i].target1domestic)
                                    totaltargethalfYearly2 += NTR(re[i].target2domestic)
                                    target1domestic += NTR(re[i].target1domestic)
                                    target2domestic += NTR(re[i].target2domestic)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1domestic)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2domestic)
                                    s.setLineItemValue('custpage_total', line, re[i].percdomestic)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1domestic, re[i].gap1domestic))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2domestic, re[i].gap2domestic))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdomestic, re[i].gapdomestic))
                                    GAPTotal += NTR(re[i].gapdomestic)
                                    gapdomestic += NTR(re[i].gapdomestic)
                                    totalgaphalfYearly1 += NTR(re[i].gap1domestic)
                                    totalgaphalfYearly2 += NTR(re[i].gap2domestic)
                                    gap1domestic += NTR(re[i].gap1domestic)
                                    gap2domestic += NTR(re[i].gap2domestic)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'IP Transit') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '')
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1ip) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1ip + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2ip) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2ip + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percip,re[i].halfYearlyip))
                                ActualTotal += NTR(re[i].halfYearlyip)
                                Totalip += NTR(re[i].halfYearlyip)
                                totalhalfYearly1 += NTR(re[i].halfYearly1ip)
                                totalhalfYearly2 += NTR(re[i].halfYearly2ip)
                                total1ip += NTR(re[i].halfYearly1ip)
                                total2ip += NTR(re[i].halfYearly2ip)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1ip)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2ip)
                                    s.setLineItemValue('custpage_total', line, re[i].targetip)
                                    TargetlTotal += NTR(re[i].targetip)
                                    targetip += NTR(re[i].targetip)
                                    totaltargethalfYearly1 += NTR(re[i].target1ip)
                                    totaltargethalfYearly2 += NTR(re[i].target2ip)
                                    target1ip += NTR(re[i].target1ip)
                                    target2ip += NTR(re[i].target2ip)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1ip)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2ip)
                                    s.setLineItemValue('custpage_total', line, re[i].percip)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1ip, re[i].gap1ip))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2ip, re[i].gap2ip))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percip, re[i].gapip))
                                    GAPTotal += NTR(re[i].gapip)
                                    gapip += NTR(re[i].gapip)
                                    totalgaphalfYearly1 += NTR(re[i].gap1ip)
                                    totalgaphalfYearly2 += NTR(re[i].gap2ip)
                                    gap1ip += NTR(re[i].gap1ip)
                                    gap2ip += NTR(re[i].gap2ip)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'IRU') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1iru) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1iru + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2iru) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2iru + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perciru,re[i].halfYearlyiru))
                                ActualTotal += NTR(re[i].halfYearlyiru)
                                Totaliru += NTR(re[i].halfYearlyiru)
                                totalhalfYearly1 += NTR(re[i].halfYearly1iru)
                                totalhalfYearly2 += NTR(re[i].halfYearly2iru)
                                total1iru += NTR(re[i].halfYearly1iru)
                                total2iru += NTR(re[i].halfYearly2iru)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1iru)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2iru)
                                    s.setLineItemValue('custpage_total', line, re[i].targetiru)
                                    TargetlTotal += NTR(re[i].targetiru)
                                    targetiru += NTR(re[i].targetiru)
                                    totaltargethalfYearly1 += NTR(re[i].target1iru)
                                    totaltargethalfYearly2 += NTR(re[i].target2iru)
                                    target1iru += NTR(re[i].target1iru)
                                    target2iru += NTR(re[i].target2iru)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1iru)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2iru)
                                    s.setLineItemValue('custpage_total', line, re[i].perciru)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1iru, re[i].gap1iru))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2iru, re[i].gap2iru))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perciru, re[i].gapiru))
                                    GAPTotal += NTR(re[i].gapiru)
                                    gapiru += NTR(re[i].gapiru)
                                    totalgaphalfYearly1 += NTR(re[i].gap1iru)
                                    totalgaphalfYearly2 += NTR(re[i].gap2iru)
                                    gap1iru += NTR(re[i].gap1iru)
                                    gap2iru += NTR(re[i].gap2iru)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'VSAT KU Band Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1kuband + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2kuband) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2kuband + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perckuband,re[i].halfYearlykuband))
                                ActualTotal += NTR(re[i].halfYearlykuband)
                                Totalkuband += NTR(re[i].halfYearlykuband)
                                totalhalfYearly1 += NTR(re[i].halfYearly1kuband)
                                totalhalfYearly2 += NTR(re[i].halfYearly2kuband)
                                total1kuband += NTR(re[i].halfYearly1kuband)
                                total2kuband += NTR(re[i].halfYearly2kuband)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1kuband)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2kuband)
                                    s.setLineItemValue('custpage_total', line, re[i].targetkuband)
                                    TargetlTotal += NTR(re[i].targetkuband)
                                    targetkuband += NTR(re[i].targetkuband)
                                    totaltargethalfYearly1 += NTR(re[i].target1kuband)
                                    totaltargethalfYearly2 += NTR(re[i].target2kuband)
                                    target1kuband += NTR(re[i].target1kuband)
                                    target2kuband += NTR(re[i].target2kuband)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1kuband)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2kuband)
                                    s.setLineItemValue('custpage_total', line, re[i].perckuband)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1kuband, re[i].gap1kuband))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2kuband, re[i].gap2kuband))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perckuband, re[i].gapkuband))
                                    GAPTotal += NTR(re[i].gapkuband)
                                    gapkuband += NTR(re[i].gapkuband)
                                    totalgaphalfYearly1 += NTR(re[i].gap1kuband)
                                    totalgaphalfYearly2 += NTR(re[i].gap2kuband)
                                    gap1kuband += NTR(re[i].gap1kuband)
                                    gap2kuband += NTR(re[i].gap2kuband)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Mobile VSAT') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1mobile_vsat + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2mobile_vsat) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2mobile_vsat + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmobile_vsat,re[i].halfYearlymobile_vsat))
                                ActualTotal += NTR(re[i].halfYearlymobile_vsat)
                                Totalmobile_vsat += NTR(re[i].halfYearlymobile_vsat)
                                totalhalfYearly1 += NTR(re[i].halfYearly1mobile_vsat)
                                totalhalfYearly2 += NTR(re[i].halfYearly2mobile_vsat)
                                total1mobile_vsat += NTR(re[i].halfYearly1mobile_vsat)
                                total2mobile_vsat += NTR(re[i].halfYearly2mobile_vsat)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1mobile_vsat)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2mobile_vsat)
                                    s.setLineItemValue('custpage_total', line, re[i].targetmobile_vsat)
                                    TargetlTotal += NTR(re[i].targetmobile_vsat)
                                    targetmobile_vsat += NTR(re[i].targetmobile_vsat)
                                    totaltargethalfYearly1 += NTR(re[i].target1mobile_vsat)
                                    totaltargethalfYearly2 += NTR(re[i].target2mobile_vsat)
                                    target1mobile_vsat += NTR(re[i].target1mobile_vsat)
                                    target2mobile_vsat += NTR(re[i].target2mobile_vsat)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1mobile_vsat)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2mobile_vsat)
                                    s.setLineItemValue('custpage_total', line, re[i].percmobile_vsat)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1mobile_vsat, re[i].gap1mobile_vsat))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2mobile_vsat, re[i].gap2mobile_vsat))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmobile_vsat, re[i].gapmobile_vsat))
                                    GAPTotal += NTR(re[i].gapmobile_vsat)
                                    gapmobile_vsat += NTR(re[i].gapmobile_vsat)
                                    totalgaphalfYearly1 += NTR(re[i].gap1mobile_vsat)
                                    totalgaphalfYearly2 += NTR(re[i].gap2mobile_vsat)
                                    gap1mobile_vsat += NTR(re[i].gap1mobile_vsat)
                                    gap2mobile_vsat += NTR(re[i].gap2mobile_vsat)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'MPLS & IPLC') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1mpip + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2mpip) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2mpip + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmpip,re[i].halfYearlympip))
                                ActualTotal += NTR(re[i].halfYearlympip)
                                Totalmpip += NTR(re[i].halfYearlympip)
                                totalhalfYearly1 += NTR(re[i].halfYearly1mpip)
                                totalhalfYearly2 += NTR(re[i].halfYearly2mpip)
                                total1mpip += NTR(re[i].halfYearly1mpip)
                                total2mpip += NTR(re[i].halfYearly2mpip)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1mpip)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2mpip)
                                    s.setLineItemValue('custpage_total', line, re[i].targetmpip)
                                    TargetlTotal += NTR(re[i].targetmpip)
                                    targetmpip += NTR(re[i].targetmpip)
                                    totaltargethalfYearly1 += NTR(re[i].target1mpip)
                                    totaltargethalfYearly2 += NTR(re[i].target2mpip)
                                    target1mpip += NTR(re[i].target1mpip)
                                    target2mpip += NTR(re[i].target2mpip)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1mpip)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2mpip)
                                    s.setLineItemValue('custpage_total', line, re[i].percmpip)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1mpip, re[i].gap1mpip))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2mpip, re[i].gap2mpip))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percmpip, re[i].gapmpip))
                                    GAPTotal += NTR(re[i].gapmpip)
                                    gapmpip += NTR(re[i].gapmpip)
                                    totalgaphalfYearly1 += NTR(re[i].gap1mpip)
                                    totalgaphalfYearly2 += NTR(re[i].gap2mpip)
                                    gap1mpip += NTR(re[i].gap1mpip)
                                    gap2mpip += NTR(re[i].gap2mpip)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'O3B') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1o3b) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1o3b + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2o3b) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2o3b + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line,getGapColor(re[i].perco3b, re[i].halfYearlyo3b))
                                ActualTotal += NTR(re[i].halfYearlyo3b)
                                Totalo3b += NTR(re[i].halfYearlyo3b)
                                totalhalfYearly1 += NTR(re[i].halfYearly1o3b)
                                totalhalfYearly2 += NTR(re[i].halfYearly2o3b)
                                total1o3b += NTR(re[i].halfYearly1o3b)
                                total2o3b += NTR(re[i].halfYearly2o3b)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1o3b)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2o3b)
                                    s.setLineItemValue('custpage_total', line, re[i].targeto3b)
                                    TargetlTotal += NTR(re[i].targeto3b)
                                    targeto3b += NTR(re[i].targeto3b)
                                    totaltargethalfYearly1 += NTR(re[i].target1o3b)
                                    totaltargethalfYearly2 += NTR(re[i].target2o3b)
                                    target1o3b += NTR(re[i].target1o3b)
                                    target2o3b += NTR(re[i].target2o3b)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1o3b)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2o3b)
                                    s.setLineItemValue('custpage_total', line, re[i].perco3b)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1o3b, re[i].gap1o3b))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2o3b, re[i].gap2o3b))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perco3b, re[i].gapo3b))
                                    GAPTotal += NTR(re[i].gapo3b)
                                    gapo3b += NTR(re[i].gapo3b)
                                    totalgaphalfYearly1 += NTR(re[i].gap1o3b)
                                    totalgaphalfYearly2 += NTR(re[i].gap2o3b)
                                    gap1o3b += NTR(re[i].gap1o3b)
                                    gap2o3b += NTR(re[i].gap2o3b)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Professional Services') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1ps) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1ps + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2ps) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2ps + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percps,re[i].halfYearlyps))
                                ActualTotal += NTR(re[i].halfYearlyps)
                                Totalps += NTR(re[i].halfYearlyps)
                                totalhalfYearly1 += NTR(re[i].halfYearly1ps)
                                totalhalfYearly2 += NTR(re[i].halfYearly2ps)
                               total1ps += NTR(re[i].halfYearly1ps)
                               total2ps += NTR(re[i].halfYearly2ps)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1ps)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2ps)
                                    s.setLineItemValue('custpage_total', line, re[i].targetps)
                                    TargetlTotal += NTR(re[i].targetps)
                                    targetps += NTR(re[i].targetps)
                                    totaltargethalfYearly1 += NTR(re[i].target1ps)
                                    totaltargethalfYearly2 += NTR(re[i].target2ps)
                                    target1ps += NTR(re[i].target1ps)
                                    target2ps += NTR(re[i].target2ps)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1ps)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2ps)
                                    s.setLineItemValue('custpage_total', line, re[i].percps)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1ps, re[i].gap1ps))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2ps, re[i].gap2ps))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percps, re[i].gapps))
                                    GAPTotal += NTR(re[i].gapps)
                                    gapps += NTR(re[i].gapps)
                                    totalgaphalfYearly1 += NTR(re[i].gap1ps)
                                    totalgaphalfYearly2 += NTR(re[i].gap2ps)
                                    gap1ps += NTR(re[i].gap1ps)
                                    gap2ps += NTR(re[i].gap2ps)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'Satellite Raw') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1sr) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1sr + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2sr) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2sr + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line,  getGapColor(re[i].percsr,re[i].halfYearlysr))
                                ActualTotal += NTR(re[i].halfYearlysr)
                                Totalsr += NTR(re[i].halfYearlysr)
                                totalhalfYearly1 += NTR(re[i].halfYearly1sr)
                                totalhalfYearly2 += NTR(re[i].halfYearly2sr)
                                total1sr += NTR(re[i].halfYearly1sr)
                                total2sr += NTR(re[i].halfYearly2sr)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1sr)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2sr)
                                    s.setLineItemValue('custpage_total', line, re[i].targetsr)
                                    TargetlTotal += NTR(re[i].targetsr)
                                    targetsr += NTR(re[i].targetsr)
                                    totaltargethalfYearly1 += NTR(re[i].target1sr)
                                    totaltargethalfYearly2 += NTR(re[i].target2sr)
                                    target1sr += NTR(re[i].target1sr)
                                    target2sr += NTR(re[i].target2sr)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1sr)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2sr)
                                    s.setLineItemValue('custpage_total', line, re[i].percsr)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1sr, re[i].gap1sr))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2sr, re[i].gap2sr))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percsr, re[i].gapsr))
                                    GAPTotal += NTR(re[i].gapsr)
                                    gapsr += NTR(re[i].gapsr)
                                    totalgaphalfYearly1 += NTR(re[i].gap1sr)
                                    totalgaphalfYearly2 += NTR(re[i].gap2sr)
                                    gap1sr += NTR(re[i].gap1sr)
                                    gap2sr += NTR(re[i].gap2sr)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'HW FSS') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1hw) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1hw + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2hw) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2hw + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].perchw,re[i].halfYearlyhw))
                                ActualTotal += NTR(re[i].halfYearlyhw)
                                Totalhw += NTR(re[i].halfYearlyhw)
                                totalhalfYearly1 += NTR(re[i].halfYearly1hw)
                                totalhalfYearly2 += NTR(re[i].halfYearly2hw)
                                total1hw += NTR(re[i].halfYearly1hw)
                                total2hw+= NTR(re[i].halfYearly2hw)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1hw)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2hw)
                                    s.setLineItemValue('custpage_total', line, re[i].targethw)
                                    TargetlTotal += NTR(re[i].targethw)
                                    targethw += NTR(re[i].targethw)
                                    totaltargethalfYearly1 += NTR(re[i].target1hw)
                                    totaltargethalfYearly2 += NTR(re[i].target2hw)
                                    target1hw += NTR(re[i].target1hw)
                                    target2hw += NTR(re[i].target2hw)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1hw)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2hw)
                                    s.setLineItemValue('custpage_total', line, re[i].perchw)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1hw, re[i].gap1hw))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2hw, re[i].gap2hw))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].perchw, re[i].gaphw))
                                    GAPTotal += NTR(re[i].gaphw)
                                    gaphw += NTR(re[i].gaphw)
                                    totalgaphalfYearly1 += NTR(re[i].gap1hw)
                                    totalgaphalfYearly2 += NTR(re[i].gap2hw)
                                    gap1hw += NTR(re[i].gap1hw)
                                    gap2hw += NTR(re[i].gap2hw)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'D&HLS HW') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1dhls_hw + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2dhls_hw) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2dhls_hw + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdhls_hw,re[i].halfYearlydhls_hw))
                                ActualTotal += NTR(re[i].halfYearlydhls_hw)
                                Totaldhls_hw += NTR(re[i].halfYearlydhls_hw)
                                totalhalfYearly1 += NTR(re[i].halfYearly1dhls_hw)
                                totalhalfYearly2 += NTR(re[i].halfYearly2dhls_hw)
                                total1dhls_hw += NTR(re[i].halfYearly1dhls_hw)
                                total2dhls_hw += NTR(re[i].halfYearly2dhls_hw)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1dhls_hw)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2dhls_hw)
                                    s.setLineItemValue('custpage_total', line, re[i].targetdhls_hw)
                                    TargetlTotal += NTR(re[i].targetdhls_hw)
                                    targetdhls_hw += NTR(re[i].targetdhls_hw)
                                    totaltargethalfYearly1 += NTR(re[i].target1dhls_hw)
                                    totaltargethalfYearly2 += NTR(re[i].target2dhls_hw)
                                    target1dhls_hw += NTR(re[i].target1dhls_hw)
                                    target2dhls_hw += NTR(re[i].target2dhls_hw)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1dhls_hw)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2dhls_hw)
                                    s.setLineItemValue('custpage_total', line, re[i].percdhls_hw)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1dhls_hw, re[i].gap1dhls_hw))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2dhls_hw, re[i].gap2dhls_hw))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percdhls_hw, re[i].gapdhls_hw))
                                    GAPTotal += NTR(re[i].gapdhls_hw)
                                    gapdhls_hw += NTR(re[i].gapdhls_hw)
                                    totalgaphalfYearly1 += NTR(re[i].gap1dhls_hw)
                                    totalgaphalfYearly2 += NTR(re[i].gap2dhls_hw)
                                    gap1dhls_hw += NTR(re[i].gap1dhls_hw)
                                    gap2dhls_hw += NTR(re[i].gap2dhls_hw)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'D&HLS Service') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1gt) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1gt + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2gt) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2gt + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgt,re[i].halfYearlygt))
                                ActualTotal += NTR(re[i].halfYearlygt)
                                Totalgt += NTR(re[i].halfYearlygt)
                                totalhalfYearly1 += NTR(re[i].halfYearly1gt)
                                totalhalfYearly2 += NTR(re[i].halfYearly2gt)
                                total1gt += NTR(re[i].halfYearly1gt)
                                total2gt += NTR(re[i].halfYearly2gt)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1gt)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2gt)
                                    s.setLineItemValue('custpage_total', line, re[i].targetgt)
                                    TargetlTotal += NTR(re[i].targetgt)
                                    targetgt += NTR(re[i].targetgt)
                                    totaltargethalfYearly1 += NTR(re[i].target1gt)
                                    totaltargethalfYearly2 += NTR(re[i].target2gt)
                                    target1gt += NTR(re[i].target1gt)
                                    target2gt += NTR(re[i].target2gt)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1gt)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2gt)
                                    s.setLineItemValue('custpage_total', line, re[i].percgt)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1gt, re[i].gap1gt))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2gt, re[i].gap2gt))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgt, re[i].gapgt))
                                    GAPTotal += NTR(re[i].gapgt)
                                    gapgt += NTR(re[i].gapgt)
                                    totalgaphalfYearly1 += NTR(re[i].gap1gt)
                                    totalgaphalfYearly2 += NTR(re[i].gap2gt)
                                    gap1gt += NTR(re[i].gap1gt)
                                    gap2gt += NTR(re[i].gap2gt)
                                }
                            }
                            line = line + 1;
                        }
                        else if (ProductFamilyList[z].name == 'General') {
                            if (m == 0) {
                                s.setLineItemValue('custpage_n', line, '');
                                s.setLineItemValue('custpage_c', line, ProductFamilyList[z].name);
                                s.setLineItemValue('custpage_p', line, 'Actual');
                                var half_yearly1 = "<a style='color:" + getColor(re[i].perc1general) + "'" + " href='" + link + re[i].sales_rep_id + '&h=1&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly1general + "</a>";
                                var half_yearly2 = "<a style='color:" + getColor(re[i].perc2general) + "'" + " href='" + link + re[i].sales_rep_id + '&h=2&type=3' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].halfYearly2general + "</a>";
                                s.setLineItemValue('custpage_half_yearly1', line, half_yearly1)
                                s.setLineItemValue('custpage_half_yearly2', line, half_yearly2)
                                s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgeneral, re[i].halfYearlygeneral))
                                ActualTotal += NTR(re[i].halfYearlygeneral)
                                Totalgeneral += NTR(re[i].halfYearlygeneral)
                                totalhalfYearly1 += NTR(re[i].halfYearly1general)
                                totalhalfYearly2 += NTR(re[i].halfYearly2general)
                                total1general += NTR(re[i].halfYearly1general)
                                total2general += NTR(re[i].halfYearly2general)
                            }
                            else {
                                s.setLineItemValue('custpage_n', line, '');
                                if (m == 1) {
                                    s.setLineItemValue('custpage_p', line, 'Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].target1general)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].target2general)
                                    s.setLineItemValue('custpage_total', line, re[i].targetgeneral)
                                    TargetlTotal += NTR(re[i].targetgeneral)
                                    targetgeneral += NTR(re[i].targetgeneral)
                                    totaltargethalfYearly1 += NTR(re[i].target1general)
                                    totaltargethalfYearly2 += NTR(re[i].target2general)
                                    target1general += NTR(re[i].target1general)
                                    target2general += NTR(re[i].target2general)
                                }
                                else if (m == 2) {
                                    s.setLineItemValue('custpage_p', line, '% of Target')
                                    s.setLineItemValue('custpage_half_yearly1', line, re[i].perc1general)
                                    s.setLineItemValue('custpage_half_yearly2', line, re[i].perc2general)
                                    s.setLineItemValue('custpage_total', line, re[i].percgeneral)
                                }
                                else {
                                    s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                                    s.setLineItemValue('custpage_half_yearly1', line, getGapColor(re[i].perc1general, re[i].gap1general))
                                    s.setLineItemValue('custpage_half_yearly2', line, getGapColor(re[i].perc2general, re[i].gap2general))
                                    s.setLineItemValue('custpage_total', line, getGapColor(re[i].percgeneral, re[i].gapgeneral))
                                    GAPTotal += NTR(re[i].gapgeneral)
                                    gapgeneral += NTR(re[i].gapgeneral)
                                    totalgaphalfYearly1 += NTR(re[i].gap1general)
                                    totalgaphalfYearly2 += NTR(re[i].gap2general)
                                    gap1general += NTR(re[i].gap1general)
                                    gap2general += NTR(re[i].gap2general)
                                }
                            }
                            line = line + 1;
                        }
                    }
                }
            }
        }
    }   
    if ( s!= null && re.length>0) {
        addTotalLines(s, line, ActualTotal, TargetlTotal, GAPTotal);
        if (request.getParameter('custpage_dimension') == '2') {
            line = line + 4;
            addTotalLinesPF(s, line, Totalbbs, targetbbs, gapbbs, 'Total – Backbone Services',
                total1bbs, total2bbs, total3bbs, total4bbs, total5bbs, total6bbs, total7bbs, total8bbs, total9bbs, total10bbs, total11bbs, total12bbs,
                target1bbs, target2bbs, target3bbs, target4bbs, target5bbs, target6bbs, target7bbs, target8bbs, target9bbs, target10bbs, target11bbs, target12bbs,
                gap1bbs, gap2bbs, gap3bbs, gap4bbs, gap5bbs, gap6bbs, gap7bbs, gap8bbs, gap9bbs, gap10bbs, gap11bbs, gap12bbs)
            line = line + 4;
            addTotalLinesPF(s, line, Totalbod, targetbod, gapbod, 'Total – BOD',
                total1bod, total2bod, total3bod, total4bod, total5bod, total6bod, total7bod, total8bod, total9bod, total10bod, total11bod, total12bod,
                target1bod, target2bod, target3bod, target4bod, target5bod, target6bod, target7bod, target8bod, target9bod, target10bod, target11bod, target12bod,
                gap1bod, gap2bod, gap3bod, gap4bod, gap5bod, gap6bod, gap7bod, gap8bod, gap9bod, gap10bod, gap11bod, gap12bod)
            line = line + 4;
            addTotalLinesPF(s, line, Totaldhls_hw, targetdhls_hw, gapdhls_hw, 'Total – D&HLS HW',
                total1dhls_hw, total2dhls_hw, total3dhls_hw, total4dhls_hw, total5dhls_hw, total6dhls_hw, total7dhls_hw, total8dhls_hw, total9dhls_hw, total10dhls_hw, total11dhls_hw, total12dhls_hw,
                target1dhls_hw, target2dhls_hw, target3dhls_hw, target4dhls_hw, target5dhls_hw, target6dhls_hw, target7dhls_hw, target8dhls_hw, target9dhls_hw, target10dhls_hw, target11dhls_hw, target12dhls_hw,
                gap1dhls_hw, gap2dhls_hw, gap3dhls_hw, gap4dhls_hw, gap5dhls_hw, gap6dhls_hw, gap7dhls_hw, gap8dhls_hw, gap9dhls_hw, gap10dhls_hw, gap11dhls_hw, gap12dhls_hw)
            line = line + 4;
            addTotalLinesPF(s, line, Totalgt, targetgt, gapgt, 'Total – D&HLS Service',
                total1gt, total2gt, total3gt, total4gt, total5gt, total6gt, total7gt, total8gt, total9gt, total10gt, total11gt, total12gt,
                target1gt, target2gt, target3gt, target4gt, target5gt, target6gt, target7gt, target8gt, target9gt, target10gt, target11gt, target12gt,
                gap1gt, gap2gt, gap3gt, gap4gt, gap5gt, gap6gt, gap7gt, gap8gt, gap9gt, gap10gt, gap11gt, gap12gt)
            line = line + 4;
            addTotalLinesPF(s, line, Totaldomestic, targetdomestic, gapdomestic, 'Total – Domestic',
                total1domestic, total2domestic, total3domestic, total4domestic, total5domestic, total6domestic, total7domestic, total8domestic, total9domestic, total10domestic, total11domestic, total12domestic,
                target1domestic, target2domestic, target3domestic, target4domestic, target5domestic, target6domestic, target7domestic, target8domestic, target9domestic, target10domestic, target11domestic, target12domestic,
                gap1domestic, gap2domestic, gap3domestic, gap4domestic, gap5domestic, gap6domestic, gap7domestic, gap8domestic, gap9domestic, gap10domestic, gap11domestic, gap12domestic)
            line = line + 4;
            addTotalLinesPF(s, line, Totalhw, targethw, gaphw, 'Total – HW FSS',
                total1hw, total2hw, total3hw, total4hw, total5hw, total6hw, total7hw, total8hw, total9hw, total10hw, total11hw, total12hw,
                target1hw, target2hw, target3hw, target4hw, target5hw, target6hw, target7hw, target8hw, target9hw, target10hw, target11hw, target12hw,
                gap1hw, gap2hw, gap3hw, gap4hw, gap5hw, gap6hw, gap7hw, gap8hw, gap9hw, gap10hw, gap11hw, gap12hw)
            line = line + 4;
            addTotalLinesPF(s, line, Totalip, targetip, gapip, 'Total – IP Transit',
                total1ip, total2ip, total3ip, total4ip, total5ip, total6ip, total7ip, total8ip, total9ip, total10ip, total11ip, total12ip,
                target1ip, target2ip, target3ip, target4ip, target5ip, target6ip, target7ip, target8ip, target9ip, target10ip, target11ip, target12ip,
                gap1ip, gap2ip, gap3ip, gap4ip, gap5ip, gap6ip, gap7ip, gap8ip, gap9ip, gap10ip, gap11ip, gap12ip)
            line = line + 4;
            addTotalLinesPF(s, line, Totaliru, targetiru, gapiru, 'Total – IRU',
                total1iru, total2iru, total3iru, total4iru, total5iru, total6iru, total7iru, total8iru, total9iru, total10iru, total11iru, total12iru,
                target1iru, target2iru, target3iru, target4iru, target5iru, target6iru, target7iru, target8iru, target9iru, target10iru, target11iru, target12iru,
                gap1iru, gap2iru, gap3iru, gap4iru, gap5iru, gap6iru, gap7iru, gap8iru, gap9iru, gap10iru, gap11iru, gap12iru)
            line = line + 4;
            addTotalLinesPF(s, line, Totalmobile_vsat, targetmobile_vsat, gapmobile_vsat, 'Total – Mobile VSAT',
                total1mobile_vsat, total2mobile_vsat, total3mobile_vsat, total4mobile_vsat, total5mobile_vsat, total6mobile_vsat, total7mobile_vsat, total8mobile_vsat, total9mobile_vsat, total10mobile_vsat, total11mobile_vsat, total12mobile_vsat,
                target1mobile_vsat, target2mobile_vsat, target3mobile_vsat, target4mobile_vsat, target5mobile_vsat, target6mobile_vsat, target7mobile_vsat, target8mobile_vsat, target9mobile_vsat, target10mobile_vsat, target11mobile_vsat, target12mobile_vsat,
                gap1mobile_vsat, gap2mobile_vsat, gap3mobile_vsat, gap4mobile_vsat, gap5mobile_vsat, gap6mobile_vsat, gap7mobile_vsat, gap8mobile_vsat, gap9mobile_vsat, gap10mobile_vsat, gap11mobile_vsat, gap12mobile_vsat)
            line = line + 4;
            addTotalLinesPF(s, line, Totalmpip, targetmpip, gapmpip, 'Total – MPLS & IPLC',
                total1mpip, total2mpip, total3mpip, total4mpip, total5mpip, total6mpip, total7mpip, total8mpip, total9mpip, total10mpip, total11mpip, total12mpip,
                target1mpip, target2mpip, target3mpip, target4mpip, target5mpip, target6mpip, target7mpip, target8mpip, target9mpip, target10mpip, target11mpip, target12mpip,
                gap1mpip, gap2mpip, gap3mpip, gap4mpip, gap5mpip, gap6mpip, gap7mpip, gap8mpip, gap9mpip, gap10mpip, gap11mpip, gap12mpip)
            line = line + 4;
            addTotalLinesPF(s, line, Totalo3b, targeto3b, gapo3b, 'Total – O3B',
                total1o3b, total2o3b, total3o3b, total4o3b, total5o3b, total6o3b, total7o3b, total8o3b, total9o3b, total10o3b, total11o3b, total12o3b,
                target1o3b, target2o3b, target3o3b, target4o3b, target5o3b, target6o3b, target7o3b, target8o3b, target9o3b, target10o3b, target11o3b, target12o3b,
                gap1o3b, gap2o3b, gap3o3b, gap4o3b, gap5o3b, gap6o3b, gap7o3b, gap8o3b, gap9o3b, gap10o3b, gap11o3b, gap12o3b)
            line = line + 4;
            addTotalLinesPF(s, line, Totalps, targetps, gapps, 'Total – Professional Services',
                total1ps, total2ps, total3ps, total4ps, total5ps, total6ps, total7ps, total8ps, total9ps, total10ps, total11ps, total12ps,
                target1ps, target2ps, target3ps, target4ps, target5ps, target6ps, target7ps, target8ps, target9ps, target10ps, target11ps, target12ps,
                gap1ps, gap2ps, gap3ps, gap4ps, gap5ps, gap6ps, gap7ps, gap8ps, gap9ps, gap10ps, gap11ps, gap12ps)
            line = line + 4;
            addTotalLinesPF(s, line, Totalsr, targetsr, gapsr, 'Total – Satellite Raw',
                total1sr, total2sr, total3sr, total4sr, total5sr, total6sr, total7sr, total8sr, total9sr, total10sr, total11sr, total12sr,
                target1sr, target2sr, target3sr, target4sr, target5sr, target6sr, target7sr, target8sr, target9sr, target10sr, target11sr, target12sr,
                gap1sr, gap2sr, gap3sr, gap4sr, gap5sr, gap6sr, gap7sr, gap8sr, gap9sr, gap10sr, gap11sr, gap12sr)
            line = line + 4;
            addTotalLinesPF(s, line, Totalvas, targetvas, gapvas, 'Total – VAS',
                total1vas, total2vas, total3vas, total4vas, total5vas, total6vas, total7vas, total8vas, total9vas, total10vas, total11vas, total12vas,
                target1vas, target2vas, target3vas, target4vas, target5vas, target6vas, target7vas, target8vas, target9vas, target10vas, target11vas, target12vas,
                gap1vas, gap2vas, gap3vas, gap4vas, gap5vas, gap6vas, gap7vas, gap8vas, gap9vas, gap10vas, gap11vas, gap12vas)
            line = line + 4;
            addTotalLinesPF(s, line, Totalkuband, targetkuband, gapkuband, 'Total – VSAT C Band Services',
                total1cband, total2cband, total3cband, total4cband, total5cband, total6cband, total7cband, total8cband, total9cband, total10cband, total11cband, total12cband,
                target1cband, target2cband, target3cband, target4cband, target5cband, target6cband, target7cband, target8cband, target9cband, target10cband, target11cband, target12cband,
                gap1cband, gap2cband, gap3cband, gap4cband, gap5cband, gap6cband, gap7cband, gap8cband, gap9cband, gap10cband, gap11cband, gap12cband)
            line = line + 4;
                 addTotalLinesPF(s, line, Totalgeneral, targetgeneral, gapgeneral, 'Total – General',
                total1general, total2general, total3general, total4general, total5general, total6general, total7general, total8general, total9general, total10general, total11general, total12general,
                target1general, target2general, target3general, target4general, target5general, target6general, target7general, target8general, target9general, target10general, target11general, target12general,
                gap1general, gap2general, gap3general, gap4general, gap5general, gap6general, gap7general, gap8general, gap9general, gap10general, gap11general, gap12general)
            line = line + 4;
            addTotalLinesPF(s, line, Totalkuband, targetkuband, gapkuband, 'Total – VSAT KU Band Services',
                total1kuband, total2kuband, total3kuband, total4kuband, total5kuband, total6kuband, total7kuband, total8kuband, total9kuband, total10kuband, total11kuband, total12kuband,
                target1kuband, target2kuband, target3kuband, target4kuband, target5kuband, target6kuband, target7kuband, target8kuband, target9kuband, target10kuband, target11kuband, target12kuband,
                gap1kuband, gap2kuband, gap3kuband, gap4kuband, gap5kuband, gap6kuband, gap7kuband, gap8kuband, gap9kuband, gap10kuband, gap11kuband, gap12kuband)
        }   
    }
    response.writePage(form);
}

