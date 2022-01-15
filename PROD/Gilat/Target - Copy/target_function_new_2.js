
function Build1(s, re) {    
    s = form.addSubList('custpage_re_sublist', 'list', 'results', null);
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
        line = (i * 64) + 1;
        for (z = 0; z < ProductFamilyList.length; z++) {
            var total = 0;
            var totaltarget = 0;
            var gaptotal = 0;
            for (var m = 0; m < 4; m++) {
                if (ProductFamilyList[z].name == 'Backbone Services') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, re[i].sales_rep);
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1bbs, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1bbs + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2bbs, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2bbs + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3bbs, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3bbs + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4bbs, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4bbs + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5bbs, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5bbs + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6bbs, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6bbs + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7bbs, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7bbs + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8bbs, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8bbs + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9bbs, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9bbs + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10bbs, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10bbs + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11bbs, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11bbs + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12bbs, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12bbs + "</a>";
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "bbs"])
                            totaltarget += NTR(re[i]["target" + h + "bbs"])
                            gaptotal += NTR(re[i]["gap" + h + "bbs"])
                            Totalbbs += NTR(re[i]["mounth" + h + "bbs"])
                            targetbbs += NTR(re[i]["target" + h + "bbs"])
                            gapbbs += NTR(re[i]["gap" + h + "bbs"])
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
                        s.setLineItemValue('custpage_total', line, re[i].totalbbs)
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1bbs); total7 += NTR(re[i].mounth7bbs);
                        total2 += NTR(re[i].mounth2bbs); total8 += NTR(re[i].mounth8bbs);
                        total3 += NTR(re[i].mounth3bbs); total9 += NTR(re[i].mounth9bbs);
                        total4 += NTR(re[i].mounth4bbs); total10 += NTR(re[i].mounth10bbs);
                        total5 += NTR(re[i].mounth5bbs); total11 += NTR(re[i].mounth11bbs);
                        total6 += NTR(re[i].mounth6bbs); total12 += NTR(re[i].mounth12bbs);
                        total1bbs += NTR(re[i].mounth1bbs); total7bbs += NTR(re[i].mounth7bbs);
                        total2bbs += NTR(re[i].mounth2bbs); total8bbs += NTR(re[i].mounth8bbs);
                        total3bbs += NTR(re[i].mounth3bbs); total9bbs += NTR(re[i].mounth9bbs);
                        total4bbs += NTR(re[i].mounth4bbs); total10bbs += NTR(re[i].mounth10bbs);
                        total5bbs += NTR(re[i].mounth5bbs); total11bbs += NTR(re[i].mounth11bbs);
                        total6bbs += NTR(re[i].mounth6bbs); total12bbs += NTR(re[i].mounth12bbs);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1bbs)
                            s.setLineItemValue('custpage_m2', line, re[i].target2bbs)
                            s.setLineItemValue('custpage_m3', line, re[i].target3bbs)
                            s.setLineItemValue('custpage_m4', line, re[i].target4bbs)
                            s.setLineItemValue('custpage_m5', line, re[i].target5bbs)
                            s.setLineItemValue('custpage_m6', line, re[i].target6bbs)
                            s.setLineItemValue('custpage_m7', line, re[i].target7bbs)
                            s.setLineItemValue('custpage_m8', line, re[i].target8bbs)
                            s.setLineItemValue('custpage_m9', line, re[i].target9bbs)
                            s.setLineItemValue('custpage_m10', line, re[i].target10bbs)
                            s.setLineItemValue('custpage_m11', line, re[i].target11bbs)
                            s.setLineItemValue('custpage_m12', line, re[i].target12bbs)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetbbs)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1bbs); target7 += NTR(re[i].target7bbs);
                            target2 += NTR(re[i].target2bbs); target8 += NTR(re[i].target8bbs);
                            target3 += NTR(re[i].target3bbs); target9 += NTR(re[i].target9bbs);
                            target4 += NTR(re[i].target4bbs); target10 += NTR(re[i].target10bbs);
                            target5 += NTR(re[i].target5bbs); target11 += NTR(re[i].target11bbs);
                            target6 += NTR(re[i].target6bbs); target12 += NTR(re[i].target12bbs);
                            target1bbs += NTR(re[i].target1bbs); target7bbs += NTR(re[i].target7bbs);
                            target2bbs += NTR(re[i].target2bbs); target8bbs += NTR(re[i].target8abbs);
                            target3bbs += NTR(re[i].target3bbs); target9bbs += NTR(re[i].target9bbs);
                            target4bbs += NTR(re[i].target4bbs); target10bbs += NTR(re[i].target10bbs);
                            target5bbs += NTR(re[i].target5bbs); target11bbs += NTR(re[i].target11bbs);
                            target6bbs += NTR(re[i].target6bbs); target12bbs += NTR(re[i].target12bbs);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1bbs)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2bbs)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3bbs)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4bbs)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5bbs)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6bbs)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7bbs)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8bbs)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9bbs)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10bbs)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11bbs)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12bbs)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercbbs)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1bbs, re[i].gap1bbs, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2bbs, re[i].gap2bbs, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3bbs, re[i].gap3bbs, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4bbs, re[i].gap4bbs, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5bbs, re[i].gap5bbs, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6bbs, re[i].gap6bbs, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7bbs, re[i].gap7bbs, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8bbs, re[i].gap8bbs, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9bbs, re[i].gap9bbs, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10bbs, re[i].gap10bbs, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11bbs, re[i].gap11bbs, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12bbs, re[i].gap12bbs, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapbbs)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1bbs); gap7 += NTR(re[i].gap7bbs);
                            gap2 += NTR(re[i].gap2bbs); gap8 += NTR(re[i].gap8bbs);
                            gap3 += NTR(re[i].gap3bbs); gap9 += NTR(re[i].gap9bbs);
                            gap4 += NTR(re[i].gap4bbs); gap10 += NTR(re[i].gap10bbs);
                            gap5 += NTR(re[i].gap5bbs); gap11 += NTR(re[i].gap11bbs);
                            gap6 += NTR(re[i].gap6bbs); gap12 += NTR(re[i].gap12bbs);
                            gap1bbs += NTR(re[i].gap1bbs); gap7bbs += NTR(re[i].gap7bbs);
                            gap2bbs += NTR(re[i].gap2bbs); gap8bbs += NTR(re[i].gap8bbs);
                            gap3bbs += NTR(re[i].gap3bbs); gap9bbs += NTR(re[i].gap9bbs);
                            gap4bbs += NTR(re[i].gap4bbs); gap10bbs += NTR(re[i].gap10bbs);
                            gap5bbs += NTR(re[i].gap5bbs); gap11bbs += NTR(re[i].gap11bbs);
                            gap6bbs += NTR(re[i].gap6bbs); gap12bbs += NTR(re[i].gap12bbs);
                        }
                    }
                    line = line + 1;
                } // z==0
                else if (ProductFamilyList[z].name == 'VAS') {
                    if (m == 0) {
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "vas"])
                            totaltarget += NTR(re[i]["target" + h + "vas"])
                            gaptotal += NTR(re[i]["gap" + h + "vas"])
                            Totalvas += NTR(re[i]["mounth" + h + "vas"])
                            targetvas += NTR(re[i]["target" + h + "vas"])
                            gapvas += NTR(re[i]["gap" + h + "vas"])
                        }
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1vas, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1vas + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2vas, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2vas + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3vas, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3vas + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4vas, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4vas + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5vas, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5vas + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6vas, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6vas + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7vas, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7vas + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8vas, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8vas + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9vas, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9vas + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10vas, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10vas + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11vas, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11vas + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12vas, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12vas + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalvas)
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1vas); total7 += NTR(re[i].mounth7vas);
                        total2 += NTR(re[i].mounth2vas); total8 += NTR(re[i].mounth8vas);
                        total3 += NTR(re[i].mounth3vas); total9 += NTR(re[i].mounth9vas);
                        total4 += NTR(re[i].mounth4vas); total10 += NTR(re[i].mounth10vas);
                        total5 += NTR(re[i].mounth5vas); total11 += NTR(re[i].mounth11vas);
                        total6 += NTR(re[i].mounth6vas); total12 += NTR(re[i].mounth12vas);
                        total1vas += NTR(re[i].mounth1vas); total7vas += NTR(re[i].mounth7vas);
                        total2vas += NTR(re[i].mounth2vas); total8vas += NTR(re[i].mounth8vas);
                        total3vas += NTR(re[i].mounth3vas); total9vas += NTR(re[i].mounth9vas);
                        total4vas += NTR(re[i].mounth4vas); total10vas += NTR(re[i].mounth10vas);
                        total5vas += NTR(re[i].mounth5vas); total11vas += NTR(re[i].mounth11vas);
                        total6vas += NTR(re[i].mounth6vas); total12vas += NTR(re[i].mounth12vas);


                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1vas)
                            s.setLineItemValue('custpage_m2', line, re[i].target2vas)
                            s.setLineItemValue('custpage_m3', line, re[i].target3vas)
                            s.setLineItemValue('custpage_m4', line, re[i].target4vas)
                            s.setLineItemValue('custpage_m5', line, re[i].target5vas)
                            s.setLineItemValue('custpage_m6', line, re[i].target6vas)
                            s.setLineItemValue('custpage_m7', line, re[i].target7vas)
                            s.setLineItemValue('custpage_m8', line, re[i].target8vas)
                            s.setLineItemValue('custpage_m9', line, re[i].target9vas)
                            s.setLineItemValue('custpage_m10', line, re[i].target10vas)
                            s.setLineItemValue('custpage_m11', line, re[i].target11vas)
                            s.setLineItemValue('custpage_m12', line, re[i].target12vas)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetvas)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1vas); target7 += NTR(re[i].target7vas);
                            target2 += NTR(re[i].target2vas); target8 += NTR(re[i].target8vas);
                            target3 += NTR(re[i].target3vas); target9 += NTR(re[i].target9vas);
                            target4 += NTR(re[i].target4vas); target10 += NTR(re[i].target10vas);
                            target5 += NTR(re[i].target5vas); target11 += NTR(re[i].target11vas);
                            target6 += NTR(re[i].target6vas); target12 += NTR(re[i].target12vas);
                            target1vas += NTR(re[i].target1vas); target7vas += NTR(re[i].target7vas);
                            target2vas += NTR(re[i].target2vas); target8vas += NTR(re[i].target8avas);
                            target3vas += NTR(re[i].target3vas); target9vas += NTR(re[i].target9vas);
                            target4vas += NTR(re[i].target4vas); target10vas += NTR(re[i].target10vas);
                            target5vas += NTR(re[i].target5vas); target11vas += NTR(re[i].target11vas);
                            target6vas += NTR(re[i].target6vas); target12vas += NTR(re[i].target12vas);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1vas)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2vas)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3vas)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4vas)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5vas)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6vas)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7vas)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8vas)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9vas)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10vas)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11vas)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12vas)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercvas)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1vas, re[i].gap1vas, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2vas, re[i].gap2vas, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3vas, re[i].gap3vas, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4vas, re[i].gap4vas, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5vas, re[i].gap5vas, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6vas, re[i].gap6vas, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7vas, re[i].gap7vas, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8vas, re[i].gap8vas, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9vas, re[i].gap9vas, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10vas, re[i].gap10vas, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11vas, re[i].gap11vas, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12vas, re[i].gap12vas, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapvas)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1vas); gap7 += NTR(re[i].gap7vas);
                            gap2 += NTR(re[i].gap2vas); gap8 += NTR(re[i].gap8vas);
                            gap3 += NTR(re[i].gap3vas); gap9 += NTR(re[i].gap9vas);
                            gap4 += NTR(re[i].gap4vas); gap10 += NTR(re[i].gap10vas);
                            gap5 += NTR(re[i].gap5vas); gap11 += NTR(re[i].gap11vas);
                            gap6 += NTR(re[i].gap6vas); gap12 += NTR(re[i].gap12vas);
                            gap1vas += NTR(re[i].gap1vas); gap7vas += NTR(re[i].gap7vas);
                            gap2vas += NTR(re[i].gap2vas); gap8vas += NTR(re[i].gap8vas);
                            gap3vas += NTR(re[i].gap3vas); gap9vas += NTR(re[i].gap9vas);
                            gap4vas += NTR(re[i].gap4vas); gap10vas += NTR(re[i].gap10vas);
                            gap5vas += NTR(re[i].gap5vas); gap11vas += NTR(re[i].gap11vas);
                            gap6vas += NTR(re[i].gap6vas); gap12vas += NTR(re[i].gap12vas);
                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'BOD') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1bod, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1bod + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2bod, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2bod + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3bod, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3bod + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4bod, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4bod + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5bod, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5bod + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6bod, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6bod + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7bod, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7bod + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8bod, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8bod + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9bod, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9bod + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10bod, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10bod + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11bod, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11bod + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12bod, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12bod + "</a>";
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "bod"])
                            totaltarget += NTR(re[i]["target" + h + "bod"])
                            gaptotal += NTR(re[i]["gap" + h + "bod"])
                            Totalbod += NTR(re[i]["mounth" + h + "bod"])
                            targetbod += NTR(re[i]["target" + h + "bod"])
                            gapbod += NTR(re[i]["gap" + h + "bod"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
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
                        s.setLineItemValue('custpage_total', line, re[i].totalbod)
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1bod); total7 += NTR(re[i].mounth7bod);
                        total2 += NTR(re[i].mounth2bod); total8 += NTR(re[i].mounth8bod);
                        total3 += NTR(re[i].mounth3bod); total9 += NTR(re[i].mounth9bod);
                        total4 += NTR(re[i].mounth4bod); total10 += NTR(re[i].mounth10bod);
                        total5 += NTR(re[i].mounth5bod); total11 += NTR(re[i].mounth11bod);
                        total6 += NTR(re[i].mounth6bod); total12 += NTR(re[i].mounth12bod);
                        total1bod += NTR(re[i].mounth1bod); total7bod += NTR(re[i].mounth7bod);
                        total2bod += NTR(re[i].mounth2bod); total8bod += NTR(re[i].mounth8bod);
                        total3bod += NTR(re[i].mounth3bod); total9bod += NTR(re[i].mounth9bod);
                        total4bod += NTR(re[i].mounth4bod); total10bod += NTR(re[i].mounth10bod);
                        total5bod += NTR(re[i].mounth5bod); total11bod += NTR(re[i].mounth11bod);
                        total6bod += NTR(re[i].mounth6bod); total12bod += NTR(re[i].mounth12bod);

                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1bod)
                            s.setLineItemValue('custpage_m2', line, re[i].target2bod)
                            s.setLineItemValue('custpage_m3', line, re[i].target3bod)
                            s.setLineItemValue('custpage_m4', line, re[i].target4bod)
                            s.setLineItemValue('custpage_m5', line, re[i].target5bod)
                            s.setLineItemValue('custpage_m6', line, re[i].target6bod)
                            s.setLineItemValue('custpage_m7', line, re[i].target7bod)
                            s.setLineItemValue('custpage_m8', line, re[i].target8bod)
                            s.setLineItemValue('custpage_m9', line, re[i].target9bod)
                            s.setLineItemValue('custpage_m10', line, re[i].target10bod)
                            s.setLineItemValue('custpage_m11', line, re[i].target11bod)
                            s.setLineItemValue('custpage_m12', line, re[i].target12bod)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetbod)
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1bod); target7 += NTR(re[i].target7bod);
                            target2 += NTR(re[i].target2bod); target8 += NTR(re[i].target8bod);
                            target3 += NTR(re[i].target3bod); target9 += NTR(re[i].target9bod);
                            target4 += NTR(re[i].target4bod); target10 += NTR(re[i].target10bod);
                            target5 += NTR(re[i].target5bod); target11 += NTR(re[i].target11bod);
                            target6 += NTR(re[i].target6bod); target12 += NTR(re[i].target12bod);
                            target1bod += NTR(re[i].target1bod); target7bod += NTR(re[i].target7bod);
                            target2bod += NTR(re[i].target2bod); target8bod += NTR(re[i].target8abod);
                            target3bod += NTR(re[i].target3bod); target9bod += NTR(re[i].target9bod);
                            target4bod += NTR(re[i].target4bod); target10bod += NTR(re[i].target10bod);
                            target5bod += NTR(re[i].target5bod); target11bod += NTR(re[i].target11bod);
                            target6bod += NTR(re[i].target6bod); target12bod += NTR(re[i].target12bod);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1bod)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2bod)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3bod)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4bod)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5bod)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6bod)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7bod)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8bod)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9bod)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10bod)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11bod)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12bod)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercbod)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1bod, re[i].gap1bod, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2bod, re[i].gap2bod, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3bod, re[i].gap3bod, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4bod, re[i].gap4bod, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5bod, re[i].gap5bod, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6bod, re[i].gap6bod, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7bod, re[i].gap7bod, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8bod, re[i].gap8bod, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9bod, re[i].gap9bod, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10bod, re[i].gap10bod, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11bod, re[i].gap11bod, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12bod, re[i].gap12bod, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapbod)
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1bod); gap7 += NTR(re[i].gap7bod);
                            gap2 += NTR(re[i].gap2bod); gap8 += NTR(re[i].gap8bod);
                            gap3 += NTR(re[i].gap3bod); gap9 += NTR(re[i].gap9bod);
                            gap4 += NTR(re[i].gap4bod); gap10 += NTR(re[i].gap10bod);
                            gap5 += NTR(re[i].gap5bod); gap11 += NTR(re[i].gap11bod);
                            gap6 += NTR(re[i].gap6bod); gap12 += NTR(re[i].gap12bod);
                            gap1bod += NTR(re[i].gap1bod); gap7bod += NTR(re[i].gap7bod);
                            gap2bod += NTR(re[i].gap2bod); gap8bod += NTR(re[i].gap8bod);
                            gap3bod += NTR(re[i].gap3bod); gap9bod += NTR(re[i].gap9bod);
                            gap4bod += NTR(re[i].gap4bod); gap10bod += NTR(re[i].gap10bod);
                            gap5bod += NTR(re[i].gap5bod); gap11bod += NTR(re[i].gap11bod);
                            gap6bod += NTR(re[i].gap6bod); gap12bod += NTR(re[i].gap12bod);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'VSAT C Band Services') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1cband, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1cband + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2cband, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2cband + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3cband, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3cband + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4cband, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4cband + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5cband, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5cband + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6cband, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6cband + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7cband, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7cband + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8cband, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8cband + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9cband, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9cband + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10cband, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10cband + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11cband, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11cband + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12cband, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12cband + "</a>";
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "cband"])
                            totaltarget += NTR(re[i]["target" + h + "cband"])
                            gaptotal += NTR(re[i]["gap" + h + "cband"])
                            Totalcband += NTR(re[i]["mounth" + h + "cband"])
                            targetcband += NTR(re[i]["target" + h + "cband"])
                            gapcband += NTR(re[i]["gap" + h + "cband"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
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
                        s.setLineItemValue('custpage_total', line, re[i].totalcband)
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1cband); total7 += NTR(re[i].mounth7cband);
                        total2 += NTR(re[i].mounth2cband); total8 += NTR(re[i].mounth8cband);
                        total3 += NTR(re[i].mounth3cband); total9 += NTR(re[i].mounth9cband);
                        total4 += NTR(re[i].mounth4cband); total10 += NTR(re[i].mounth10cband);
                        total5 += NTR(re[i].mounth5cband); total11 += NTR(re[i].mounth11cband);
                        total6 += NTR(re[i].mounth6cband); total12 += NTR(re[i].mounth12cband);
                        total1cband += NTR(re[i].mounth1cband); total7cband += NTR(re[i].mounth7cband);
                        total2cband += NTR(re[i].mounth2cband); total8cband += NTR(re[i].mounth8cband);
                        total3cband += NTR(re[i].mounth3cband); total9cband += NTR(re[i].mounth9cband);
                        total4cband += NTR(re[i].mounth4cband); total10cband += NTR(re[i].mounth10cband);
                        total5cband += NTR(re[i].mounth5cband); total11cband += NTR(re[i].mounth11cband);
                        total6cband += NTR(re[i].mounth6cband); total12cband += NTR(re[i].mounth12cband);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1cband)
                            s.setLineItemValue('custpage_m2', line, re[i].target2cband)
                            s.setLineItemValue('custpage_m3', line, re[i].target3cband)
                            s.setLineItemValue('custpage_m4', line, re[i].target4cband)
                            s.setLineItemValue('custpage_m5', line, re[i].target5cband)
                            s.setLineItemValue('custpage_m6', line, re[i].target6cband)
                            s.setLineItemValue('custpage_m7', line, re[i].target7cband)
                            s.setLineItemValue('custpage_m8', line, re[i].target8cband)
                            s.setLineItemValue('custpage_m9', line, re[i].target9cband)
                            s.setLineItemValue('custpage_m10', line, re[i].target10cband)
                            s.setLineItemValue('custpage_m11', line, re[i].target11cband)
                            s.setLineItemValue('custpage_m12', line, re[i].target12cband)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetcband)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1cband); target7 += NTR(re[i].target7cband);
                            target2 += NTR(re[i].target2cband); target8 += NTR(re[i].target8cband);
                            target3 += NTR(re[i].target3cband); target9 += NTR(re[i].target9cband);
                            target4 += NTR(re[i].target4cband); target10 += NTR(re[i].target10cband);
                            target5 += NTR(re[i].target5cband); target11 += NTR(re[i].target11cband);
                            target6 += NTR(re[i].target6cband); target12 += NTR(re[i].target12cband);
                            target1cband += NTR(re[i].target1cband); target7cband += NTR(re[i].target7cband);
                            target2cband += NTR(re[i].target2cband); target8cband += NTR(re[i].target8acband);
                            target3cband += NTR(re[i].target3cband); target9cband += NTR(re[i].target9cband);
                            target4cband += NTR(re[i].target4cband); target10cband += NTR(re[i].target10cband);
                            target5cband += NTR(re[i].target5cband); target11cband += NTR(re[i].target11cband);
                            target6cband += NTR(re[i].target6cband); target12cband += NTR(re[i].target12cband);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1cband)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2cband)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3cband)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4cband)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5cband)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6cband)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7cband)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8cband)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9cband)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10cband)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11cband)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12cband)
                            s.setLineItemValue('custpage_total', line, re[i].totalperccband)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')

                        }
                        else {
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1cband, re[i].gap1cband, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2cband, re[i].gap2cband, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3cband, re[i].gap3cband, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4cband, re[i].gap4cband, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5cband, re[i].gap5cband, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6cband, re[i].gap6cband, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7cband, re[i].gap7cband, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8cband, re[i].gap8cband, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9cband, re[i].gap9cband, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10cband, re[i].gap10cband, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11cband, re[i].gap11cband, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12cband, re[i].gap12cband, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapcband)
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1cband); gap7 += NTR(re[i].gap7cband);
                            gap2 += NTR(re[i].gap2cband); gap8 += NTR(re[i].gap8cband);
                            gap3 += NTR(re[i].gap3cband); gap9 += NTR(re[i].gap9cband);
                            gap4 += NTR(re[i].gap4cband); gap10 += NTR(re[i].gap10cband);
                            gap5 += NTR(re[i].gap5cband); gap11 += NTR(re[i].gap11cband);
                            gap6 += NTR(re[i].gap6cband); gap12 += NTR(re[i].gap12cband);
                            gap1cband += NTR(re[i].gap1cband); gap7cband += NTR(re[i].gap7cband);
                            gap2cband += NTR(re[i].gap2cband); gap8cband += NTR(re[i].gap8cband);
                            gap3cband += NTR(re[i].gap3cband); gap9cband += NTR(re[i].gap9cband);
                            gap4cband += NTR(re[i].gap4cband); gap10cband += NTR(re[i].gap10cband);
                            gap5cband += NTR(re[i].gap5cband); gap11cband += NTR(re[i].gap11cband);
                            gap6cband += NTR(re[i].gap6cband); gap12cband += NTR(re[i].gap12cband);
                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'Domestic') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1domestic, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1domestic + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2domestic, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2domestic + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3domestic, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3domestic + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4domestic, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4domestic + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5domestic, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5domestic + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6domestic, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6domestic + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7domestic, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7domestic + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8domestic, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8domestic + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9domestic, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9domestic + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10domestic, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10domestic + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11domestic, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11domestic + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12domestic, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12domestic + "</a>";
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "domestic"])
                            totaltarget += NTR(re[i]["target" + h + "domestic"])
                            gaptotal += NTR(re[i]["gap" + h + "domestic"])
                            Totaldomestic += NTR(re[i]["mounth" + h + "domestic"])
                            targetdomestic += NTR(re[i]["target" + h + "domestic"])
                            gapdomestic += NTR(re[i]["gap" + h + "domestic"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
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
                        s.setLineItemValue('custpage_total', line, re[i].totaldomestic)
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1domestic); total7 += NTR(re[i].mounth7domestic);
                        total2 += NTR(re[i].mounth2domestic); total8 += NTR(re[i].mounth8domestic);
                        total3 += NTR(re[i].mounth3domestic); total9 += NTR(re[i].mounth9domestic);
                        total4 += NTR(re[i].mounth4domestic); total10 += NTR(re[i].mounth10domestic);
                        total5 += NTR(re[i].mounth5domestic); total11 += NTR(re[i].mounth11domestic);
                        total6 += NTR(re[i].mounth6domestic); total12 += NTR(re[i].mounth12domestic);
                        total1domestic += NTR(re[i].mounth1domestic); total7domestic += NTR(re[i].mounth7domestic);
                        total2domestic += NTR(re[i].mounth2domestic); total8domestic += NTR(re[i].mounth8domestic);
                        total3domestic += NTR(re[i].mounth3domestic); total9domestic += NTR(re[i].mounth9domestic);
                        total4domestic += NTR(re[i].mounth4domestic); total10domestic += NTR(re[i].mounth10domestic);
                        total5domestic += NTR(re[i].mounth5domestic); total11domestic += NTR(re[i].mounth11domestic);
                        total6domestic += NTR(re[i].mounth6domestic); total12domestic += NTR(re[i].mounth12domestic);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1domestic)
                            s.setLineItemValue('custpage_m2', line, re[i].target2domestic)
                            s.setLineItemValue('custpage_m3', line, re[i].target3domestic)
                            s.setLineItemValue('custpage_m4', line, re[i].target4domestic)
                            s.setLineItemValue('custpage_m5', line, re[i].target5domestic)
                            s.setLineItemValue('custpage_m6', line, re[i].target6domestic)
                            s.setLineItemValue('custpage_m7', line, re[i].target7domestic)
                            s.setLineItemValue('custpage_m8', line, re[i].target8domestic)
                            s.setLineItemValue('custpage_m9', line, re[i].target9domestic)
                            s.setLineItemValue('custpage_m10', line, re[i].target10domestic)
                            s.setLineItemValue('custpage_m11', line, re[i].target11domestic)
                            s.setLineItemValue('custpage_m12', line, re[i].target12domestic)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetdomestic)
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1domestic); target7 += NTR(re[i].target7domestic);
                            target2 += NTR(re[i].target2domestic); target8 += NTR(re[i].target8domestic);
                            target3 += NTR(re[i].target3domestic); target9 += NTR(re[i].target9domestic);
                            target4 += NTR(re[i].target4domestic); target10 += NTR(re[i].target10domestic);
                            target5 += NTR(re[i].target5domestic); target11 += NTR(re[i].target11domestic);
                            target6 += NTR(re[i].target6domestic); target12 += NTR(re[i].target12domestic);
                            target1domestic += NTR(re[i].target1domestic); target7domestic += NTR(re[i].target7domestic);
                            target2domestic += NTR(re[i].target2domestic); target8domestic += NTR(re[i].target8adomestic);
                            target3domestic += NTR(re[i].target3domestic); target9domestic += NTR(re[i].target9domestic);
                            target4domestic += NTR(re[i].target4domestic); target10domestic += NTR(re[i].target10domestic);
                            target5domestic += NTR(re[i].target5domestic); target11domestic += NTR(re[i].target11domestic);
                            target6domestic += NTR(re[i].target6domestic); target12domestic += NTR(re[i].target12domestic);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1domestic)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2domestic)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3domestic)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4domestic)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5domestic)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6domestic)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7domestic)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8domestic)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9domestic)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10domestic)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11domestic)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12domestic)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercdomestic)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1domestic, re[i].gap1domestic, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2domestic, re[i].gap2domestic, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3domestic, re[i].gap3domestic, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4domestic, re[i].gap4domestic, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5domestic, re[i].gap5domestic, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6domestic, re[i].gap6domestic, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7domestic, re[i].gap7domestic, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8domestic, re[i].gap8domestic, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9domestic, re[i].gap9domestic, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10domestic, re[i].gap10domestic, 11))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11domestic, re[i].gap11domestic, 10))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12domestic, re[i].gap12domestic, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapdomestic)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1domestic); gap7 += NTR(re[i].gap7domestic);
                            gap2 += NTR(re[i].gap2domestic); gap8 += NTR(re[i].gap8domestic);
                            gap3 += NTR(re[i].gap3domestic); gap9 += NTR(re[i].gap9domestic);
                            gap4 += NTR(re[i].gap4domestic); gap10 += NTR(re[i].gap10domestic);
                            gap5 += NTR(re[i].gap5domestic); gap11 += NTR(re[i].gap11domestic);
                            gap6 += NTR(re[i].gap6domestic); gap12 += NTR(re[i].gap12domestic);
                            gap1domestic += NTR(re[i].gap1domestic); gap7domestic += NTR(re[i].gap7domestic);
                            gap2domestic += NTR(re[i].gap2domestic); gap8domestic += NTR(re[i].gap8domestic);
                            gap3domestic += NTR(re[i].gap3domestic); gap9domestic += NTR(re[i].gap9domestic);
                            gap4domestic += NTR(re[i].gap4domestic); gap10domestic += NTR(re[i].gap10domestic);
                            gap5domestic += NTR(re[i].gap5domestic); gap11domestic += NTR(re[i].gap11domestic);
                            gap6domestic += NTR(re[i].gap6domestic); gap12domestic += NTR(re[i].gap12domestic);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'IP Transit') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1ip, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1ip + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2ip, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2ip + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3ip, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3ip + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4ip, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4ip + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5ip, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5ip + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6ip, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6ip + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7ip, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7ip + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8ip, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8ip + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9ip, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9ip + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10ip, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10ip + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11ip, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11ip + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12ip, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12ip + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalip)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "ip"])
                            totaltarget += NTR(re[i]["target" + h + "ip"])
                            gaptotal += NTR(re[i]["gap" + h + "ip"])
                            Totalip += NTR(re[i]["mounth" + h + "ip"])
                            targetip += NTR(re[i]["target" + h + "ip"])
                            gapip += NTR(re[i]["gap" + h + "ip"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1ip); total7 += NTR(re[i].mounth7ip);
                        total2 += NTR(re[i].mounth2ip); total8 += NTR(re[i].mounth8ip);
                        total3 += NTR(re[i].mounth3ip); total9 += NTR(re[i].mounth9ip);
                        total4 += NTR(re[i].mounth4ip); total10 += NTR(re[i].mounth10ip);
                        total5 += NTR(re[i].mounth5ip); total11 += NTR(re[i].mounth11ip);
                        total6 += NTR(re[i].mounth6ip); total12 += NTR(re[i].mounth12ip);
                        total1ip += NTR(re[i].mounth1ip); total7ip += NTR(re[i].mounth7ip);
                        total2ip += NTR(re[i].mounth2ip); total8ip += NTR(re[i].mounth8ip);
                        total3ip += NTR(re[i].mounth3ip); total9ip += NTR(re[i].mounth9ip);
                        total4ip += NTR(re[i].mounth4ip); total10ip += NTR(re[i].mounth10ip);
                        total5ip += NTR(re[i].mounth5ip); total11ip += NTR(re[i].mounth11ip);
                        total6ip += NTR(re[i].mounth6ip); total12ip += NTR(re[i].mounth12ip);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1ip)
                            s.setLineItemValue('custpage_m2', line, re[i].target2ip)
                            s.setLineItemValue('custpage_m3', line, re[i].target3ip)
                            s.setLineItemValue('custpage_m4', line, re[i].target4ip)
                            s.setLineItemValue('custpage_m5', line, re[i].target5ip)
                            s.setLineItemValue('custpage_m6', line, re[i].target6ip)
                            s.setLineItemValue('custpage_m7', line, re[i].target7ip)
                            s.setLineItemValue('custpage_m8', line, re[i].target8ip)
                            s.setLineItemValue('custpage_m9', line, re[i].target9ip)
                            s.setLineItemValue('custpage_m10', line, re[i].target10ip)
                            s.setLineItemValue('custpage_m11', line, re[i].target11ip)
                            s.setLineItemValue('custpage_m12', line, re[i].target12ip)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetip)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1ip); target7 += NTR(re[i].target7ip);
                            target2 += NTR(re[i].target2ip); target8 += NTR(re[i].target8ip);
                            target3 += NTR(re[i].target3ip); target9 += NTR(re[i].target9ip);
                            target4 += NTR(re[i].target4ip); target10 += NTR(re[i].target10ip);
                            target5 += NTR(re[i].target5ip); target11 += NTR(re[i].target11ip);
                            target6 += NTR(re[i].target6ip); target12 += NTR(re[i].target12ip);
                            target1ip += NTR(re[i].target1ip); target7ip += NTR(re[i].target7ip);
                            target2ip += NTR(re[i].target2ip); target8ip += NTR(re[i].target8aip);
                            target3ip += NTR(re[i].target3ip); target9ip += NTR(re[i].target9ip);
                            target4ip += NTR(re[i].target4ip); target10ip += NTR(re[i].target10ip);
                            target5ip += NTR(re[i].target5ip); target11ip += NTR(re[i].target11ip);
                            target6ip += NTR(re[i].target6ip); target12ip += NTR(re[i].target12ip);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1ip)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2ip)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3ip)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4ip)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5ip)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6ip)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7ip)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8ip)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9ip)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10ip)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11ip)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12ip)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercip)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1ip, re[i].gap1ip, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2ip, re[i].gap2ip, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3ip, re[i].gap3ip, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4ip, re[i].gap4ip, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5ip, re[i].gap5ip, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6ip, re[i].gap6ip, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7ip, re[i].gap7ip, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8ip, re[i].gap8ip, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9ip, re[i].gap9ip, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10ip, re[i].gap10ip, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11ip, re[i].gap11ip, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12ip, re[i].gap12ip, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapip)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1ip); gap7 += NTR(re[i].gap7ip);
                            gap2 += NTR(re[i].gap2ip); gap8 += NTR(re[i].gap8ip);
                            gap3 += NTR(re[i].gap3ip); gap9 += NTR(re[i].gap9ip);
                            gap4 += NTR(re[i].gap4ip); gap10 += NTR(re[i].gap10ip);
                            gap5 += NTR(re[i].gap5ip); gap11 += NTR(re[i].gap11ip);
                            gap6 += NTR(re[i].gap6ip); gap12 += NTR(re[i].gap12ip);
                            gap1ip += NTR(re[i].gap1ip); gap7ip += NTR(re[i].gap7ip);
                            gap2ip += NTR(re[i].gap2ip); gap8ip += NTR(re[i].gap8ip);
                            gap3ip += NTR(re[i].gap3ip); gap9ip += NTR(re[i].gap9ip);
                            gap4ip += NTR(re[i].gap4ip); gap10ip += NTR(re[i].gap10ip);
                            gap5ip += NTR(re[i].gap5ip); gap11ip += NTR(re[i].gap11ip);
                            gap6ip += NTR(re[i].gap6ip); gap12ip += NTR(re[i].gap12ip);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'IRU') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1iru, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1iru + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2iru, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2iru + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3iru, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3iru + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4iru, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4iru + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5iru, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5iru + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6iru, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6iru + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7iru, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7iru + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8iru, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8iru + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9iru, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9iru + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10iru, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10iru + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11iru, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11iru + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12iru, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12iru + "</a>";

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
                        s.setLineItemValue('custpage_total', line, re[i].totaliru)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "iru"])
                            totaltarget += NTR(re[i]["target" + h + "iru"])
                            gaptotal += NTR(re[i]["gap" + h + "iru"])
                            Totaliru += NTR(re[i]["mounth" + h + "iru"])
                            targetiru += NTR(re[i]["target" + h + "iru"])
                            gapiru += NTR(re[i]["gap" + h + "iru"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1iru); total7 += NTR(re[i].mounth7iru);
                        total2 += NTR(re[i].mounth2iru); total8 += NTR(re[i].mounth8iru);
                        total3 += NTR(re[i].mounth3iru); total9 += NTR(re[i].mounth9iru);
                        total4 += NTR(re[i].mounth4iru); total10 += NTR(re[i].mounth10iru);
                        total5 += NTR(re[i].mounth5iru); total11 += NTR(re[i].mounth11iru);
                        total6 += NTR(re[i].mounth6iru); total12 += NTR(re[i].mounth12iru);
                        total1iru += NTR(re[i].mounth1iru); total7iru += NTR(re[i].mounth7iru);
                        total2iru += NTR(re[i].mounth2iru); total8iru += NTR(re[i].mounth8iru);
                        total3iru += NTR(re[i].mounth3iru); total9iru += NTR(re[i].mounth9iru);
                        total4iru += NTR(re[i].mounth4iru); total10iru += NTR(re[i].mounth10iru);
                        total5iru += NTR(re[i].mounth5iru); total11iru += NTR(re[i].mounth11iru);
                        total6iru += NTR(re[i].mounth6iru); total12iru += NTR(re[i].mounth12iru);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1iru)
                            s.setLineItemValue('custpage_m2', line, re[i].target2iru)
                            s.setLineItemValue('custpage_m3', line, re[i].target3iru)
                            s.setLineItemValue('custpage_m4', line, re[i].target4iru)
                            s.setLineItemValue('custpage_m5', line, re[i].target5iru)
                            s.setLineItemValue('custpage_m6', line, re[i].target6iru)
                            s.setLineItemValue('custpage_m7', line, re[i].target7iru)
                            s.setLineItemValue('custpage_m8', line, re[i].target8iru)
                            s.setLineItemValue('custpage_m9', line, re[i].target9iru)
                            s.setLineItemValue('custpage_m10', line, re[i].target10iru)
                            s.setLineItemValue('custpage_m11', line, re[i].target11iru)
                            s.setLineItemValue('custpage_m12', line, re[i].target12iru)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetiru)
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1iru); target7 += NTR(re[i].target7iru);
                            target2 += NTR(re[i].target2iru); target8 += NTR(re[i].target8iru);
                            target3 += NTR(re[i].target3iru); target9 += NTR(re[i].target9iru);
                            target4 += NTR(re[i].target4iru); target10 += NTR(re[i].target10iru);
                            target5 += NTR(re[i].target5iru); target11 += NTR(re[i].target11iru);
                            target6 += NTR(re[i].target6iru); target12 += NTR(re[i].target12iru);
                            target1iru += NTR(re[i].target1iru); target7iru += NTR(re[i].target7iru);
                            target2iru += NTR(re[i].target2iru); target8iru += NTR(re[i].target8airu);
                            target3iru += NTR(re[i].target3iru); target9iru += NTR(re[i].target9iru);
                            target4iru += NTR(re[i].target4iru); target10iru += NTR(re[i].target10iru);
                            target5iru += NTR(re[i].target5iru); target11iru += NTR(re[i].target11iru);
                            target6iru += NTR(re[i].target6iru); target12iru += NTR(re[i].target12iru);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1iru)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2iru)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3iru)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4iru)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5iru)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6iru)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7iru)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8iru)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9iru)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10iru)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11iru)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12iru)
                            s.setLineItemValue('custpage_total', line, re[i].totalperciru)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1iru, re[i].gap1iru, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2iru, re[i].gap2iru, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3iru, re[i].gap3iru, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4iru, re[i].gap4iru, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5iru, re[i].gap5iru, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6iru, re[i].gap6iru, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7iru, re[i].gap7iru, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8iru, re[i].gap8iru, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9iru, re[i].gap9iru, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10iru, re[i].gap10iru, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11iru, re[i].gap11iru, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12iru, re[i].gap12iru, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapiru)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1iru); gap7 += NTR(re[i].gap7iru);
                            gap2 += NTR(re[i].gap2iru); gap8 += NTR(re[i].gap8iru);
                            gap3 += NTR(re[i].gap3iru); gap9 += NTR(re[i].gap9iru);
                            gap4 += NTR(re[i].gap4iru); gap10 += NTR(re[i].gap10iru);
                            gap5 += NTR(re[i].gap5iru); gap11 += NTR(re[i].gap11iru);
                            gap6 += NTR(re[i].gap6iru); gap12 += NTR(re[i].gap12iru);
                            gap1iru += NTR(re[i].gap1iru); gap7iru += NTR(re[i].gap7iru);
                            gap2iru += NTR(re[i].gap2iru); gap8iru += NTR(re[i].gap8iru);
                            gap3iru += NTR(re[i].gap3iru); gap9iru += NTR(re[i].gap9iru);
                            gap4iru += NTR(re[i].gap4iru); gap10iru += NTR(re[i].gap10iru);
                            gap5iru += NTR(re[i].gap5iru); gap11iru += NTR(re[i].gap11iru);
                            gap6iru += NTR(re[i].gap6iru); gap12iru += NTR(re[i].gap12iru);
                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'VSAT KU Band Services') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1kuband, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1kuband + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc1kuband, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2kuband + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc1kuband, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3kuband + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc1kuband, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4kuband + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc1kuband, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5kuband + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc1kuband, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6kuband + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc1kuband, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7kuband + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc1kuband, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8kuband + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc1kuband, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9kuband + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc1kuband, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10kuband + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc1kuband, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11kuband + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc1kuband, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12kuband + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalkuband)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "kuband"])
                            totaltarget += NTR(re[i]["target" + h + "kuband"])
                            gaptotal += NTR(re[i]["gap" + h + "kuband"])
                            Totalkuband += NTR(re[i]["mounth" + h + "kuband"])
                            targetkuband += NTR(re[i]["target" + h + "kuband"])
                            gapkuband += NTR(re[i]["gap" + h + "kuband"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1kuband); total7 += NTR(re[i].mounth7kuband);
                        total2 += NTR(re[i].mounth2kuband); total8 += NTR(re[i].mounth8kuband);
                        total3 += NTR(re[i].mounth3kuband); total9 += NTR(re[i].mounth9kuband);
                        total4 += NTR(re[i].mounth4kuband); total10 += NTR(re[i].mounth10kuband);
                        total5 += NTR(re[i].mounth5kuband); total11 += NTR(re[i].mounth11kuband);
                        total6 += NTR(re[i].mounth6kuband); total12 += NTR(re[i].mounth12kuband);
                        total1kuband += NTR(re[i].mounth1kuband); total7kuband += NTR(re[i].mounth7kuband);
                        total2kuband += NTR(re[i].mounth2kuband); total8kuband += NTR(re[i].mounth8kuband);
                        total3kuband += NTR(re[i].mounth3kuband); total9kuband += NTR(re[i].mounth9kuband);
                        total4kuband += NTR(re[i].mounth4kuband); total10kuband += NTR(re[i].mounth10kuband);
                        total5kuband += NTR(re[i].mounth5kuband); total11kuband += NTR(re[i].mounth11kuband);
                        total6kuband += NTR(re[i].mounth6kuband); total12kuband += NTR(re[i].mounth12kuband);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1kuband)
                            s.setLineItemValue('custpage_m2', line, re[i].target2kuband)
                            s.setLineItemValue('custpage_m3', line, re[i].target3kuband)
                            s.setLineItemValue('custpage_m4', line, re[i].target4kuband)
                            s.setLineItemValue('custpage_m5', line, re[i].target5kuband)
                            s.setLineItemValue('custpage_m6', line, re[i].target6kuband)
                            s.setLineItemValue('custpage_m7', line, re[i].target7kuband)
                            s.setLineItemValue('custpage_m8', line, re[i].target8kuband)
                            s.setLineItemValue('custpage_m9', line, re[i].target9kuband)
                            s.setLineItemValue('custpage_m10', line, re[i].target10kuband)
                            s.setLineItemValue('custpage_m11', line, re[i].target11kuband)
                            s.setLineItemValue('custpage_m12', line, re[i].target12kuband)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetkuband)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1kuband); target7 += NTR(re[i].target7kuband);
                            target2 += NTR(re[i].target2kuband); target8 += NTR(re[i].target8kuband);
                            target3 += NTR(re[i].target3kuband); target9 += NTR(re[i].target9kuband);
                            target4 += NTR(re[i].target4kuband); target10 += NTR(re[i].target10kuband);
                            target5 += NTR(re[i].target5kuband); target11 += NTR(re[i].target11kuband);
                            target6 += NTR(re[i].target6kuband); target12 += NTR(re[i].target12kuband);
                            target1kuband += NTR(re[i].target1kuband); target7kuband += NTR(re[i].target7kuband);
                            target2kuband += NTR(re[i].target2kuband); target8kuband += NTR(re[i].target8akuband);
                            target3kuband += NTR(re[i].target3kuband); target9kuband += NTR(re[i].target9kuband);
                            target4kuband += NTR(re[i].target4kuband); target10kuband += NTR(re[i].target10kuband);
                            target5kuband += NTR(re[i].target5kuband); target11kuband += NTR(re[i].target11kuband);
                            target6kuband += NTR(re[i].target6kuband); target12kuband += NTR(re[i].target12kuband);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1kuband)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2kuband)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3kuband)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4kuband)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5kuband)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6kuband)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7kuband)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8kuband)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9kuband)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10kuband)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11kuband)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12kuband)
                            s.setLineItemValue('custpage_total', line, re[i].totalperckuband)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1kuband, re[i].gap1kuband, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2kuband, re[i].gap2kuband, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3kuband, re[i].gap3kuband, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4kuband, re[i].gap4kuband, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5kuband, re[i].gap5kuband, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6kuband, re[i].gap6kuband, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7kuband, re[i].gap7kuband, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8kuband, re[i].gap8kuband, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9kuband, re[i].gap9kuband, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10kuband, re[i].gap10kuband, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11kuband, re[i].gap11kuband, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12kuband, re[i].gap12kuband, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapkuband)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1kuband); gap7 += NTR(re[i].gap7kuband);
                            gap2 += NTR(re[i].gap2kuband); gap8 += NTR(re[i].gap8kuband);
                            gap3 += NTR(re[i].gap3kuband); gap9 += NTR(re[i].gap9kuband);
                            gap4 += NTR(re[i].gap4kuband); gap10 += NTR(re[i].gap10kuband);
                            gap5 += NTR(re[i].gap5kuband); gap11 += NTR(re[i].gap11kuband);
                            gap6 += NTR(re[i].gap6kuband); gap12 += NTR(re[i].gap12kuband);
                            gap1kuband += NTR(re[i].gap1kuband); gap7kuband += NTR(re[i].gap7kuband);
                            gap2kuband += NTR(re[i].gap2kuband); gap8kuband += NTR(re[i].gap8kuband);
                            gap3kuband += NTR(re[i].gap3kuband); gap9kuband += NTR(re[i].gap9kuband);
                            gap4kuband += NTR(re[i].gap4kuband); gap10kuband += NTR(re[i].gap10kuband);
                            gap5kuband += NTR(re[i].gap5kuband); gap11kuband += NTR(re[i].gap11kuband);
                            gap6kuband += NTR(re[i].gap6kuband); gap12kuband += NTR(re[i].gap12kuband);
                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'Mobile VSAT') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1mobile_vsat, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1mobile_vsat + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2mobile_vsat, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2mobile_vsat + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3mobile_vsat, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3mobile_vsat + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4mobile_vsat, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4mobile_vsat + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5mobile_vsat, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5mobile_vsat + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6mobile_vsat, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6mobile_vsat + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7mobile_vsat, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7mobile_vsat + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8mobile_vsat, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8mobile_vsat + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9mobile_vsat, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9mobile_vsat + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10mobile_vsat, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10mobile_vsat + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11mobile_vsat, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11mobile_vsat + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12mobile_vsat, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12mobile_vsat + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalmobile_vsat)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "mobile_vsat"])
                            totaltarget += NTR(re[i]["target" + h + "mobile_vsat"])
                            gaptotal += NTR(re[i]["gap" + h + "mobile_vsat"])
                            Totalmobile_vsat += NTR(re[i]["mounth" + h + "mobile_vsat"])
                            targetmobile_vsat += NTR(re[i]["target" + h + "mobile_vsat"])
                            gapmobile_vsat += NTR(re[i]["gap" + h + "mobile_vsat"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1mobile_vsat); total7 += NTR(re[i].mounth7mobile_vsat);
                        total2 += NTR(re[i].mounth2mobile_vsat); total8 += NTR(re[i].mounth8mobile_vsat);
                        total3 += NTR(re[i].mounth3mobile_vsat); total9 += NTR(re[i].mounth9mobile_vsat);
                        total4 += NTR(re[i].mounth4mobile_vsat); total10 += NTR(re[i].mounth10mobile_vsat);
                        total5 += NTR(re[i].mounth5mobile_vsat); total11 += NTR(re[i].mounth11mobile_vsat);
                        total6 += NTR(re[i].mounth6mobile_vsat); total12 += NTR(re[i].mounth12mobile_vsat);
                        total1mobile_vsat += NTR(re[i].mounth1mobile_vsat); total7mobile_vsat += NTR(re[i].mounth7mobile_vsat);
                        total2mobile_vsat += NTR(re[i].mounth2mobile_vsat); total8mobile_vsat += NTR(re[i].mounth8mobile_vsat);
                        total3mobile_vsat += NTR(re[i].mounth3mobile_vsat); total9mobile_vsat += NTR(re[i].mounth9mobile_vsat);
                        total4mobile_vsat += NTR(re[i].mounth4mobile_vsat); total10mobile_vsat += NTR(re[i].mounth10mobile_vsat);
                        total5mobile_vsat += NTR(re[i].mounth5mobile_vsat); total11mobile_vsat += NTR(re[i].mounth11mobile_vsat);
                        total6mobile_vsat += NTR(re[i].mounth6mobile_vsat); total12mobile_vsat += NTR(re[i].mounth12mobile_vsat);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1mobile_vsat)
                            s.setLineItemValue('custpage_m2', line, re[i].target2mobile_vsat)
                            s.setLineItemValue('custpage_m3', line, re[i].target3mobile_vsat)
                            s.setLineItemValue('custpage_m4', line, re[i].target4mobile_vsat)
                            s.setLineItemValue('custpage_m5', line, re[i].target5mobile_vsat)
                            s.setLineItemValue('custpage_m6', line, re[i].target6mobile_vsat)
                            s.setLineItemValue('custpage_m7', line, re[i].target7mobile_vsat)
                            s.setLineItemValue('custpage_m8', line, re[i].target8mobile_vsat)
                            s.setLineItemValue('custpage_m9', line, re[i].target9mobile_vsat)
                            s.setLineItemValue('custpage_m10', line, re[i].target10mobile_vsat)
                            s.setLineItemValue('custpage_m11', line, re[i].target11mobile_vsat)
                            s.setLineItemValue('custpage_m12', line, re[i].target12mobile_vsat)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetmobile_vsat)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1mobile_vsat); target7 += NTR(re[i].target7mobile_vsat);
                            target2 += NTR(re[i].target2mobile_vsat); target8 += NTR(re[i].target8mobile_vsat);
                            target3 += NTR(re[i].target3mobile_vsat); target9 += NTR(re[i].target9mobile_vsat);
                            target4 += NTR(re[i].target4mobile_vsat); target10 += NTR(re[i].target10mobile_vsat);
                            target5 += NTR(re[i].target5mobile_vsat); target11 += NTR(re[i].target11mobile_vsat);
                            target6 += NTR(re[i].target6mobile_vsat); target12 += NTR(re[i].target12mobile_vsat);
                            target1mobile_vsat += NTR(re[i].target1mobile_vsat); target7mobile_vsat += NTR(re[i].target7mobile_vsat);
                            target2mobile_vsat += NTR(re[i].target2mobile_vsat); target8mobile_vsat += NTR(re[i].target8amobile_vsat);
                            target3mobile_vsat += NTR(re[i].target3mobile_vsat); target9mobile_vsat += NTR(re[i].target9mobile_vsat);
                            target4mobile_vsat += NTR(re[i].target4mobile_vsat); target10mobile_vsat += NTR(re[i].target10mobile_vsat);
                            target5mobile_vsat += NTR(re[i].target5mobile_vsat); target11mobile_vsat += NTR(re[i].target11mobile_vsat);
                            target6mobile_vsat += NTR(re[i].target6mobile_vsat); target12mobile_vsat += NTR(re[i].target12mobile_vsat);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1mobile_vsat)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2mobile_vsat)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3mobile_vsat)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4mobile_vsat)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5mobile_vsat)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6mobile_vsat)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7mobile_vsat)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8mobile_vsat)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9mobile_vsat)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10mobile_vsat)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11mobile_vsat)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12mobile_vsat)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercmobile_vsat)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1mobile_vsat, re[i].gap1mobile_vsat, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2mobile_vsat, re[i].gap2mobile_vsat, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3mobile_vsat, re[i].gap3mobile_vsat, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4mobile_vsat, re[i].gap4mobile_vsat, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5mobile_vsat, re[i].gap5mobile_vsat, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6mobile_vsat, re[i].gap6mobile_vsat, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7mobile_vsat, re[i].gap7mobile_vsat, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8mobile_vsat, re[i].gap8mobile_vsat, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9mobile_vsat, re[i].gap9mobile_vsat, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10mobile_vsat, re[i].gap10mobile_vsat, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11mobile_vsat, re[i].gap11mobile_vsat, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12mobile_vsat, re[i].gap12mobile_vsat, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapmobile_vsat)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1mobile_vsat); gap7 += NTR(re[i].gap7mobile_vsat);
                            gap2 += NTR(re[i].gap2mobile_vsat); gap8 += NTR(re[i].gap8mobile_vsat);
                            gap3 += NTR(re[i].gap3mobile_vsat); gap9 += NTR(re[i].gap9mobile_vsat);
                            gap4 += NTR(re[i].gap4mobile_vsat); gap10 += NTR(re[i].gap10mobile_vsat);
                            gap5 += NTR(re[i].gap5mobile_vsat); gap11 += NTR(re[i].gap11mobile_vsat);
                            gap6 += NTR(re[i].gap6mobile_vsat); gap12 += NTR(re[i].gap12mobile_vsat);
                            gap1mobile_vsat += NTR(re[i].gap1mobile_vsat); gap7mobile_vsat += NTR(re[i].gap7mobile_vsat);
                            gap2mobile_vsat += NTR(re[i].gap2mobile_vsat); gap8mobile_vsat += NTR(re[i].gap8mobile_vsat);
                            gap3mobile_vsat += NTR(re[i].gap3mobile_vsat); gap9mobile_vsat += NTR(re[i].gap9mobile_vsat);
                            gap4mobile_vsat += NTR(re[i].gap4mobile_vsat); gap10mobile_vsat += NTR(re[i].gap10mobile_vsat);
                            gap5mobile_vsat += NTR(re[i].gap5mobile_vsat); gap11mobile_vsat += NTR(re[i].gap11mobile_vsat);
                            gap6mobile_vsat += NTR(re[i].gap6mobile_vsat); gap12mobile_vsat += NTR(re[i].gap12mobile_vsat);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'MPLS & IPLC') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1mpip, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1mpip + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2mpip, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2mpip + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3mpip, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3mpip + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4mpip, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4mpip + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5mpip, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5mpip + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6mpip, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6mpip + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7mpip, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7mpip + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8mpip, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8mpip + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9mpip, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9mpip + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10mpip, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10mpip + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11mpip, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11mpip + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12mpip, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12mpip + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalmpip)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "mpip"])
                            totaltarget += NTR(re[i]["target" + h + "mpip"])
                            gaptotal += NTR(re[i]["gap" + h + "mpip"])
                            Totalmpip += NTR(re[i]["mounth" + h + "mpip"])
                            targetmpip += NTR(re[i]["target" + h + "mpip"])
                            gapmpip += NTR(re[i]["gap" + h + "mpip"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1mpip); total7 += NTR(re[i].mounth7mpip);
                        total2 += NTR(re[i].mounth2mpip); total8 += NTR(re[i].mounth8mpip);
                        total3 += NTR(re[i].mounth3mpip); total9 += NTR(re[i].mounth9mpip);
                        total4 += NTR(re[i].mounth4mpip); total10 += NTR(re[i].mounth10mpip);
                        total5 += NTR(re[i].mounth5mpip); total11 += NTR(re[i].mounth11mpip);
                        total6 += NTR(re[i].mounth6mpip); total12 += NTR(re[i].mounth12mpip);
                        total1mpip += NTR(re[i].mounth1mpip); total7mpip += NTR(re[i].mounth7mpip);
                        total2mpip += NTR(re[i].mounth2mpip); total8mpip += NTR(re[i].mounth8mpip);
                        total3mpip += NTR(re[i].mounth3mpip); total9mpip += NTR(re[i].mounth9mpip);
                        total4mpip += NTR(re[i].mounth4mpip); total10mpip += NTR(re[i].mounth10mpip);
                        total5mpip += NTR(re[i].mounth5mpip); total11mpip += NTR(re[i].mounth11mpip);
                        total6mpip += NTR(re[i].mounth6mpip); total12mpip += NTR(re[i].mounth12mpip);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1mpip)
                            s.setLineItemValue('custpage_m2', line, re[i].target2mpip)
                            s.setLineItemValue('custpage_m3', line, re[i].target3mpip)
                            s.setLineItemValue('custpage_m4', line, re[i].target4mpip)
                            s.setLineItemValue('custpage_m5', line, re[i].target5mpip)
                            s.setLineItemValue('custpage_m6', line, re[i].target6mpip)
                            s.setLineItemValue('custpage_m7', line, re[i].target7mpip)
                            s.setLineItemValue('custpage_m8', line, re[i].target8mpip)
                            s.setLineItemValue('custpage_m9', line, re[i].target9mpip)
                            s.setLineItemValue('custpage_m10', line, re[i].target10mpip)
                            s.setLineItemValue('custpage_m11', line, re[i].target11mpip)
                            s.setLineItemValue('custpage_m12', line, re[i].target12mpip)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetmpip)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1mpip); target7 += NTR(re[i].target7mpip);
                            target2 += NTR(re[i].target2mpip); target8 += NTR(re[i].target8ampip);
                            target3 += NTR(re[i].target3mpip); target9 += NTR(re[i].target9mpip);
                            target4 += NTR(re[i].target4mpip); target10 += NTR(re[i].target10mpip);
                            target5 += NTR(re[i].target5mpip); target11 += NTR(re[i].target11mpip);
                            target6 += NTR(re[i].target6mpip); target12 += NTR(re[i].target12mpip);
                            target1mpip += NTR(re[i].target1mpip); target7mpip += NTR(re[i].target7mpip);
                            target2mpip += NTR(re[i].target2mpip); target8mpip += NTR(re[i].target8ampip);
                            target3mpip += NTR(re[i].target3mpip); target9mpip += NTR(re[i].target9mpip);
                            target4mpip += NTR(re[i].target4mpip); target10mpip += NTR(re[i].target10mpip);
                            target5mpip += NTR(re[i].target5mpip); target11mpip += NTR(re[i].target11mpip);
                            target6mpip += NTR(re[i].target6mpip); target12mpip += NTR(re[i].target12mpip);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1mpip)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2mpip)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3mpip)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4mpip)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5mpip)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6mpip)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7mpip)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8mpip)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9mpip)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10mpip)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11mpip)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12mpip)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercmpip)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1mpip, re[i].gap1mpip, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2mpip, re[i].gap2mpip, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3mpip, re[i].gap3mpip, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4mpip, re[i].gap4mpip, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5mpip, re[i].gap5mpip, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6mpip, re[i].gap6mpip, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7mpip, re[i].gap7mpip, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8mpip, re[i].gap8mpip, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9mpip, re[i].gap9mpip, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10mpip, re[i].gap10mpip, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11mpip, re[i].gap11mpip, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12mpip, re[i].gap12mpip, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapmpip)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1mpip); gap7 += NTR(re[i].gap7mpip);
                            gap2 += NTR(re[i].gap2mpip); gap8 += NTR(re[i].gap8mpip);
                            gap3 += NTR(re[i].gap3mpip); gap9 += NTR(re[i].gap9mpip);
                            gap4 += NTR(re[i].gap4mpip); gap10 += NTR(re[i].gap10mpip);
                            gap5 += NTR(re[i].gap5mpip); gap11 += NTR(re[i].gap11mpip);
                            gap6 += NTR(re[i].gap6mpip); gap12 += NTR(re[i].gap12mpip);
                            gap1mpip += NTR(re[i].gap1mpip); gap7mpip += NTR(re[i].gap7mpip);
                            gap2mpip += NTR(re[i].gap2mpip); gap8mpip += NTR(re[i].gap8mpip);
                            gap3mpip += NTR(re[i].gap3mpip); gap9mpip += NTR(re[i].gap9mpip);
                            gap4mpip += NTR(re[i].gap4mpip); gap10mpip += NTR(re[i].gap10mpip);
                            gap5mpip += NTR(re[i].gap5mpip); gap11mpip += NTR(re[i].gap11mpip);
                            gap6mpip += NTR(re[i].gap6mpip); gap12mpip += NTR(re[i].gap12mpip);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'O3B') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1o3b, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1o3b + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2o3b, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2o3b + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3o3b, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3o3b + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4o3b, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4o3b + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5o3b, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5o3b + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6o3b, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6o3b + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7o3b, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7o3b + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8o3b, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8o3b + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9o3b, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9o3b + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10o3b, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10o3b + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11o3b, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11o3b + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12o3b, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12o3b + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalo3b)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "o3b"])
                            totaltarget += NTR(re[i]["target" + h + "o3b"])
                            gaptotal += NTR(re[i]["gap" + h + "o3b"])
                            Totalo3b += NTR(re[i]["mounth" + h + "o3b"])
                            targeto3b += NTR(re[i]["target" + h + "o3b"])
                            gapo3b += NTR(re[i]["gap" + h + "o3b"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1o3b); total7 += NTR(re[i].mounth7o3b);
                        total2 += NTR(re[i].mounth2o3b); total8 += NTR(re[i].mounth8o3b);
                        total3 += NTR(re[i].mounth3o3b); total9 += NTR(re[i].mounth9o3b);
                        total4 += NTR(re[i].mounth4o3b); total10 += NTR(re[i].mounth10o3b);
                        total5 += NTR(re[i].mounth5o3b); total11 += NTR(re[i].mounth11o3b);
                        total6 += NTR(re[i].mounth6o3b); total12 += NTR(re[i].mounth12o3b);
                        total1o3b += NTR(re[i].mounth1o3b); total7o3b += NTR(re[i].mounth7o3b);
                        total2o3b += NTR(re[i].mounth2o3b); total8o3b += NTR(re[i].mounth8o3b);
                        total3o3b += NTR(re[i].mounth3o3b); total9o3b += NTR(re[i].mounth9o3b);
                        total4o3b += NTR(re[i].mounth4o3b); total10o3b += NTR(re[i].mounth10o3b);
                        total5o3b += NTR(re[i].mounth5o3b); total11o3b += NTR(re[i].mounth11o3b);
                        total6o3b += NTR(re[i].mounth6o3b); total12o3b += NTR(re[i].mounth12o3b);

                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1o3b)
                            s.setLineItemValue('custpage_m2', line, re[i].target2o3b)
                            s.setLineItemValue('custpage_m3', line, re[i].target3o3b)
                            s.setLineItemValue('custpage_m4', line, re[i].target4o3b)
                            s.setLineItemValue('custpage_m5', line, re[i].target5o3b)
                            s.setLineItemValue('custpage_m6', line, re[i].target6o3b)
                            s.setLineItemValue('custpage_m7', line, re[i].target7o3b)
                            s.setLineItemValue('custpage_m8', line, re[i].target8o3b)
                            s.setLineItemValue('custpage_m9', line, re[i].target9o3b)
                            s.setLineItemValue('custpage_m10', line, re[i].target10o3b)
                            s.setLineItemValue('custpage_m11', line, re[i].target11o3b)
                            s.setLineItemValue('custpage_m12', line, re[i].target12o3b)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargeto3b)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1o3b); target7 += NTR(re[i].target7o3b);
                            target2 += NTR(re[i].target2o3b); target8 += NTR(re[i].target8ao3b);
                            target3 += NTR(re[i].target3o3b); target9 += NTR(re[i].target9o3b);
                            target4 += NTR(re[i].target4o3b); target10 += NTR(re[i].target10o3b);
                            target5 += NTR(re[i].target5o3b); target11 += NTR(re[i].target11o3b);
                            target6 += NTR(re[i].target6o3b); target12 += NTR(re[i].target12o3b);
                            target1o3b += NTR(re[i].target1o3b); target7o3b += NTR(re[i].target7o3b);
                            target2o3b += NTR(re[i].target2o3b); target8o3b += NTR(re[i].target8ao3b);
                            target3o3b += NTR(re[i].target3o3b); target9o3b += NTR(re[i].target9o3b);
                            target4o3b += NTR(re[i].target4o3b); target10o3b += NTR(re[i].target10o3b);
                            target5o3b += NTR(re[i].target5o3b); target11o3b += NTR(re[i].target11o3b);
                            target6o3b += NTR(re[i].target6o3b); target12o3b += NTR(re[i].target12o3b);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1o3b)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2o3b)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3o3b)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4o3b)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5o3b)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6o3b)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7o3b)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8o3b)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9o3b)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10o3b)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11o3b)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12o3b)
                            s.setLineItemValue('custpage_total', line, re[i].totalperco3b)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1o3b, re[i].gap1o3b, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2o3b, re[i].gap2o3b, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3o3b, re[i].gap3o3b, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4o3b, re[i].gap4o3b, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5o3b, re[i].gap5o3b, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6o3b, re[i].gap6o3b, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7o3b, re[i].gap7o3b, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8o3b, re[i].gap8o3b, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9o3b, re[i].gap9o3b, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10o3b, re[i].gap10o3b, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11o3b, re[i].gap11o3b, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12o3b, re[i].gap12o3b, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapo3b)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1o3b); gap7 += NTR(re[i].gap7o3b);
                            gap2 += NTR(re[i].gap2o3b); gap8 += NTR(re[i].gap8o3b);
                            gap3 += NTR(re[i].gap3o3b); gap9 += NTR(re[i].gap9o3b);
                            gap4 += NTR(re[i].gap4o3b); gap10 += NTR(re[i].gap10o3b);
                            gap5 += NTR(re[i].gap5o3b); gap11 += NTR(re[i].gap11o3b);
                            gap6 += NTR(re[i].gap6o3b); gap12 += NTR(re[i].gap12o3b);
                            gap1o3b += NTR(re[i].gap1o3b); gap7o3b += NTR(re[i].gap7o3b);
                            gap2o3b += NTR(re[i].gap2o3b); gap8o3b += NTR(re[i].gap8o3b);
                            gap3o3b += NTR(re[i].gap3o3b); gap9o3b += NTR(re[i].gap9o3b);
                            gap4o3b += NTR(re[i].gap4o3b); gap10o3b += NTR(re[i].gap10o3b);
                            gap5o3b += NTR(re[i].gap5o3b); gap11o3b += NTR(re[i].gap11o3b);
                            gap6o3b += NTR(re[i].gap6o3b); gap12o3b += NTR(re[i].gap12o3b);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'Professional Services') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1ps, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1ps + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2ps, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2ps + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3ps, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3ps + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4ps, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4ps + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5ps, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5ps + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6ps, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6ps + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7ps, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7ps + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8ps, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8ps + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9ps, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9ps + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10ps, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10ps + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11ps, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11ps + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12ps, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12ps + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalps)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "ps"])
                            totaltarget += NTR(re[i]["target" + h + "ps"])
                            gaptotal += NTR(re[i]["gap" + h + "ps"])
                            Totalps += NTR(re[i]["mounth" + h + "ps"])
                            targetps += NTR(re[i]["target" + h + "ps"])
                            gapps += NTR(re[i]["gap" + h + "ps"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1ps); total7 += NTR(re[i].mounth7ps);
                        total2 += NTR(re[i].mounth2ps); total8 += NTR(re[i].mounth8ps);
                        total3 += NTR(re[i].mounth3ps); total9 += NTR(re[i].mounth9ps);
                        total4 += NTR(re[i].mounth4ps); total10 += NTR(re[i].mounth10ps);
                        total5 += NTR(re[i].mounth5ps); total11 += NTR(re[i].mounth11ps);
                        total6 += NTR(re[i].mounth6ps); total12 += NTR(re[i].mounth12ps);
                        total1ps += NTR(re[i].mounth1ps); total7ps += NTR(re[i].mounth7ps);
                        total2ps += NTR(re[i].mounth2ps); total8ps += NTR(re[i].mounth8ps);
                        total3ps += NTR(re[i].mounth3ps); total9ps += NTR(re[i].mounth9ps);
                        total4ps += NTR(re[i].mounth4ps); total10ps += NTR(re[i].mounth10ps);
                        total5ps += NTR(re[i].mounth5ps); total11ps += NTR(re[i].mounth11ps);
                        total6ps += NTR(re[i].mounth6ps); total12ps += NTR(re[i].mounth12ps);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1ps)
                            s.setLineItemValue('custpage_m2', line, re[i].target2ps)
                            s.setLineItemValue('custpage_m3', line, re[i].target3ps)
                            s.setLineItemValue('custpage_m4', line, re[i].target4ps)
                            s.setLineItemValue('custpage_m5', line, re[i].target5ps)
                            s.setLineItemValue('custpage_m6', line, re[i].target6ps)
                            s.setLineItemValue('custpage_m7', line, re[i].target7ps)
                            s.setLineItemValue('custpage_m8', line, re[i].target8ps)
                            s.setLineItemValue('custpage_m9', line, re[i].target9ps)
                            s.setLineItemValue('custpage_m10', line, re[i].target10ps)
                            s.setLineItemValue('custpage_m11', line, re[i].target11ps)
                            s.setLineItemValue('custpage_m12', line, re[i].target12ps)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetps)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1ps); target7 += NTR(re[i].target7ps);
                            target2 += NTR(re[i].target2ps); target8 += NTR(re[i].target8aps);
                            target3 += NTR(re[i].target3ps); target9 += NTR(re[i].target9ps);
                            target4 += NTR(re[i].target4ps); target10 += NTR(re[i].target10ps);
                            target5 += NTR(re[i].target5ps); target11 += NTR(re[i].target11ps);
                            target6 += NTR(re[i].target6ps); target12 += NTR(re[i].target12ps);
                            target1ps += NTR(re[i].target1ps); target7ps += NTR(re[i].target7ps);
                            target2ps += NTR(re[i].target2ps); target8ps += NTR(re[i].target8aps);
                            target3ps += NTR(re[i].target3ps); target9ps += NTR(re[i].target9ps);
                            target4ps += NTR(re[i].target4ps); target10ps += NTR(re[i].target10ps);
                            target5ps += NTR(re[i].target5ps); target11ps += NTR(re[i].target11ps);
                            target6ps += NTR(re[i].target6ps); target12ps += NTR(re[i].target12ps);

                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1ps)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2ps)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3ps)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4ps)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5ps)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6ps)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7ps)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8ps)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9ps)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10ps)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11ps)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12ps)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercps)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1ps, re[i].gap1ps, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2ps, re[i].gap2ps, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3ps, re[i].gap3ps, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4ps, re[i].gap4ps, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5ps, re[i].gap5ps, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6ps, re[i].gap6ps, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7ps, re[i].gap7ps, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8ps, re[i].gap8ps, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9ps, re[i].gap9ps, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10ps, re[i].gap10ps, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11ps, re[i].gap11ps, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12ps, re[i].gap12ps, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapps)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1ps); gap7 += NTR(re[i].gap7ps);
                            gap2 += NTR(re[i].gap2ps); gap8 += NTR(re[i].gap8ps);
                            gap3 += NTR(re[i].gap3ps); gap9 += NTR(re[i].gap9ps);
                            gap4 += NTR(re[i].gap4ps); gap10 += NTR(re[i].gap10ps);
                            gap5 += NTR(re[i].gap5ps); gap11 += NTR(re[i].gap11ps);
                            gap6 += NTR(re[i].gap6ps); gap12 += NTR(re[i].gap12ps);
                            gap1ps += NTR(re[i].gap1ps); gap7ps += NTR(re[i].gap7ps);
                            gap2ps += NTR(re[i].gap2ps); gap8ps += NTR(re[i].gap8ps);
                            gap3ps += NTR(re[i].gap3ps); gap9ps += NTR(re[i].gap9ps);
                            gap4ps += NTR(re[i].gap4ps); gap10ps += NTR(re[i].gap10ps);
                            gap5ps += NTR(re[i].gap5ps); gap11ps += NTR(re[i].gap11ps);
                            gap6ps += NTR(re[i].gap6ps); gap12ps += NTR(re[i].gap12ps);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'Satellite Raw') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1sr, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1sr + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2sr, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2sr + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3sr, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3sr + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4sr, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4sr + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5sr, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5sr + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6sr, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6sr + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7sr, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7sr + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8sr, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8sr + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9sr, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9sr + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10sr, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10sr + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11sr, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11sr + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12sr, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12sr + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalsr)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "sr"])
                            totaltarget += NTR(re[i]["target" + h + "sr"])
                            gaptotal += NTR(re[i]["gap" + h + "sr"])
                            Totalsr += NTR(re[i]["mounth" + h + "sr"])
                            targetsr += NTR(re[i]["target" + h + "sr"])
                            gapsr += NTR(re[i]["gap" + h + "sr"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1sr); total7 += NTR(re[i].mounth7sr);
                        total2 += NTR(re[i].mounth2sr); total8 += NTR(re[i].mounth8sr);
                        total3 += NTR(re[i].mounth3sr); total9 += NTR(re[i].mounth9sr);
                        total4 += NTR(re[i].mounth4sr); total10 += NTR(re[i].mounth10sr);
                        total5 += NTR(re[i].mounth5sr); total11 += NTR(re[i].mounth11sr);
                        total6 += NTR(re[i].mounth6sr); total12 += NTR(re[i].mounth12sr);
                        total1sr += NTR(re[i].mounth1sr); total7sr += NTR(re[i].mounth7sr);
                        total2sr += NTR(re[i].mounth2sr); total8sr += NTR(re[i].mounth8sr);
                        total3sr += NTR(re[i].mounth3sr); total9sr += NTR(re[i].mounth9sr);
                        total4sr += NTR(re[i].mounth4sr); total10sr += NTR(re[i].mounth10sr);
                        total5sr += NTR(re[i].mounth5sr); total11sr += NTR(re[i].mounth11sr);
                        total6sr += NTR(re[i].mounth6sr); total12sr += NTR(re[i].mounth12sr);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1sr)
                            s.setLineItemValue('custpage_m2', line, re[i].target2sr)
                            s.setLineItemValue('custpage_m3', line, re[i].target3sr)
                            s.setLineItemValue('custpage_m4', line, re[i].target4sr)
                            s.setLineItemValue('custpage_m5', line, re[i].target5sr)
                            s.setLineItemValue('custpage_m6', line, re[i].target6sr)
                            s.setLineItemValue('custpage_m7', line, re[i].target7sr)
                            s.setLineItemValue('custpage_m8', line, re[i].target8sr)
                            s.setLineItemValue('custpage_m9', line, re[i].target9sr)
                            s.setLineItemValue('custpage_m10', line, re[i].target10sr)
                            s.setLineItemValue('custpage_m11', line, re[i].target11sr)
                            s.setLineItemValue('custpage_m12', line, re[i].target12sr)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetsr)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1sr); target7 += NTR(re[i].target7sr);
                            target2 += NTR(re[i].target2sr); target8 += NTR(re[i].target8asr);
                            target3 += NTR(re[i].target3sr); target9 += NTR(re[i].target9sr);
                            target4 += NTR(re[i].target4sr); target10 += NTR(re[i].target10sr);
                            target5 += NTR(re[i].target5sr); target11 += NTR(re[i].target11sr);
                            target6 += NTR(re[i].target6sr); target12 += NTR(re[i].target12sr);
                            target1sr += NTR(re[i].target1sr); target7sr += NTR(re[i].target7sr);
                            target2sr += NTR(re[i].target2sr); target8sr += NTR(re[i].target8asr);
                            target3sr += NTR(re[i].target3sr); target9sr += NTR(re[i].target9sr);
                            target4sr += NTR(re[i].target4sr); target10sr += NTR(re[i].target10sr);
                            target5sr += NTR(re[i].target5sr); target11sr += NTR(re[i].target11sr);
                            target6sr += NTR(re[i].target6sr); target12sr += NTR(re[i].target12sr);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1sr)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2sr)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3sr)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4sr)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5sr)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6sr)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7sr)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8sr)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9sr)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10sr)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11sr)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12sr)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercsr)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1sr, re[i].gap1sr, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2sr, re[i].gap2sr, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3sr, re[i].gap3sr, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4sr, re[i].gap4sr, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5sr, re[i].gap5sr, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6sr, re[i].gap6sr, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7sr, re[i].gap7sr, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8sr, re[i].gap8sr, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9sr, re[i].gap9sr, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10sr, re[i].gap10sr, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11sr, re[i].gap11sr, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12sr, re[i].gap12sr, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapsr)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1sr); gap7 += NTR(re[i].gap7sr);
                            gap2 += NTR(re[i].gap2sr); gap8 += NTR(re[i].gap8sr);
                            gap3 += NTR(re[i].gap3sr); gap9 += NTR(re[i].gap9sr);
                            gap4 += NTR(re[i].gap4sr); gap10 += NTR(re[i].gap10sr);
                            gap5 += NTR(re[i].gap5sr); gap11 += NTR(re[i].gap11sr);
                            gap6 += NTR(re[i].gap6sr); gap12 += NTR(re[i].gap12sr);
                            gap1sr += NTR(re[i].gap1sr); gap7sr += NTR(re[i].gap7sr);
                            gap2sr += NTR(re[i].gap2sr); gap8sr += NTR(re[i].gap8sr);
                            gap3sr += NTR(re[i].gap3sr); gap9sr += NTR(re[i].gap9sr);
                            gap4sr += NTR(re[i].gap4sr); gap10sr += NTR(re[i].gap10sr);
                            gap5sr += NTR(re[i].gap5sr); gap11sr += NTR(re[i].gap11sr);
                            gap6sr += NTR(re[i].gap6sr); gap12sr += NTR(re[i].gap12sr);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'HW FSS') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1hw, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1hw + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2hw, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2hw + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3hw, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3hw + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4hw, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4hw + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5hw, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5hw + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6hw, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6hw + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7hw, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7hw + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8hw, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8hw + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9hw, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9hw + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10hw, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10hw + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11hw, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11hw + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12hw, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12hw + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalhw)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "hw"])
                            totaltarget += NTR(re[i]["target" + h + "hw"])
                            gaptotal += NTR(re[i]["gap" + h + "hw"])
                            Totalhw += NTR(re[i]["mounth" + h + "hw"])
                            targethw += NTR(re[i]["target" + h + "hw"])
                            gaphw += NTR(re[i]["gap" + h + "hw"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1hw); total7 += NTR(re[i].mounth7hw);
                        total2 += NTR(re[i].mounth2hw); total8 += NTR(re[i].mounth8hw);
                        total3 += NTR(re[i].mounth3hw); total9 += NTR(re[i].mounth9hw);
                        total4 += NTR(re[i].mounth4hw); total10 += NTR(re[i].mounth10hw);
                        total5 += NTR(re[i].mounth5hw); total11 += NTR(re[i].mounth11hw);
                        total6 += NTR(re[i].mounth6hw); total12 += NTR(re[i].mounth12hw);
                        total1hw += NTR(re[i].mounth1hw); total7hw += NTR(re[i].mounth7hw);
                        total2hw += NTR(re[i].mounth2hw); total8hw += NTR(re[i].mounth8hw);
                        total3hw += NTR(re[i].mounth3hw); total9hw += NTR(re[i].mounth9hw);
                        total4hw += NTR(re[i].mounth4hw); total10hw += NTR(re[i].mounth10hw);
                        total5hw += NTR(re[i].mounth5hw); total11hw += NTR(re[i].mounth11hw);
                        total6hw += NTR(re[i].mounth6hw); total12hw += NTR(re[i].mounth12hw);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1hw)
                            s.setLineItemValue('custpage_m2', line, re[i].target2hw)
                            s.setLineItemValue('custpage_m3', line, re[i].target3hw)
                            s.setLineItemValue('custpage_m4', line, re[i].target4hw)
                            s.setLineItemValue('custpage_m5', line, re[i].target5hw)
                            s.setLineItemValue('custpage_m6', line, re[i].target6hw)
                            s.setLineItemValue('custpage_m7', line, re[i].target7hw)
                            s.setLineItemValue('custpage_m8', line, re[i].target8hw)
                            s.setLineItemValue('custpage_m9', line, re[i].target9hw)
                            s.setLineItemValue('custpage_m10', line, re[i].target10hw)
                            s.setLineItemValue('custpage_m11', line, re[i].target11hw)
                            s.setLineItemValue('custpage_m12', line, re[i].target12hw)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargethw)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1hw); target7 += NTR(re[i].target7hw);
                            target2 += NTR(re[i].target2hw); target8 += NTR(re[i].target8ahw);
                            target3 += NTR(re[i].target3hw); target9 += NTR(re[i].target9hw);
                            target4 += NTR(re[i].target4hw); target10 += NTR(re[i].target10hw);
                            target5 += NTR(re[i].target5hw); target11 += NTR(re[i].target11hw);
                            target6 += NTR(re[i].target6hw); target12 += NTR(re[i].target12hw);
                            target1hw += NTR(re[i].target1hw); target7hw += NTR(re[i].target7hw);
                            target2hw += NTR(re[i].target2hw); target8hw += NTR(re[i].target8ahw);
                            target3hw += NTR(re[i].target3hw); target9hw += NTR(re[i].target9hw);
                            target4hw += NTR(re[i].target4hw); target10hw += NTR(re[i].target10hw);
                            target5hw += NTR(re[i].target5hw); target11hw += NTR(re[i].target11hw);
                            target6hw += NTR(re[i].target6hw); target12hw += NTR(re[i].target12hw);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1hw)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2hw)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3hw)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4hw)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5hw)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6hw)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7hw)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8hw)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9hw)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10hw)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11hw)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12hw)
                            s.setLineItemValue('custpage_total', line, re[i].totalperchw)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1hw, re[i].gap1hw, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2hw, re[i].gap2hw, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3hw, re[i].gap3hw, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4hw, re[i].gap4hw, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5hw, re[i].gap5hw, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6hw, re[i].gap6hw, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7hw, re[i].gap7hw, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8hw, re[i].gap8hw, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9hw, re[i].gap9hw, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10hw, re[i].gap10hw, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11hw, re[i].gap11hw, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12hw, re[i].gap12hw, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgaphw)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1hw); gap7 += NTR(re[i].gap7hw);
                            gap2 += NTR(re[i].gap2hw); gap8 += NTR(re[i].gap8hw);
                            gap3 += NTR(re[i].gap3hw); gap9 += NTR(re[i].gap9hw);
                            gap4 += NTR(re[i].gap4hw); gap10 += NTR(re[i].gap10hw);
                            gap5 += NTR(re[i].gap5hw); gap11 += NTR(re[i].gap11hw);
                            gap6 += NTR(re[i].gap6hw); gap12 += NTR(re[i].gap12hw);
                            gap1hw += NTR(re[i].gap1hw); gap7hw += NTR(re[i].gap7hw);
                            gap2hw += NTR(re[i].gap2hw); gap8hw += NTR(re[i].gap8hw);
                            gap3hw += NTR(re[i].gap3hw); gap9hw += NTR(re[i].gap9hw);
                            gap4hw += NTR(re[i].gap4hw); gap10hw += NTR(re[i].gap10hw);
                            gap5hw += NTR(re[i].gap5hw); gap11hw += NTR(re[i].gap11hw);
                            gap6hw += NTR(re[i].gap6hw); gap12hw += NTR(re[i].gap12hw);
                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'D&HLS HW') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1dhls_hw, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1dhls_hw + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2dhls_hw, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2dhls_hw + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3dhls_hw, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3dhls_hw + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4dhls_hw, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4dhls_hw + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5dhls_hw, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5dhls_hw + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6dhls_hw, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6dhls_hw + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7dhls_hw, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7dhls_hw + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8dhls_hw, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8dhls_hw + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9dhls_hw, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9dhls_hw + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10dhls_hw, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10dhls_hw + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11dhls_hw, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11dhls_hw + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12dhls_hw, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12dhls_hw + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totaldhls_hw)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "dhls_hw"])
                            totaltarget += NTR(re[i]["target" + h + "dhls_hw"])
                            gaptotal += NTR(re[i]["gap" + h + "dhls_hw"])
                            Totaldhls_hw += NTR(re[i]["mounth" + h + "dhls_hw"])
                            targetdhls_hw += NTR(re[i]["target" + h + "dhls_hw"])
                            gapdhls_hw += NTR(re[i]["gap" + h + "dhls_hw"])
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1dhls_hw); total7 += NTR(re[i].mounth7dhls_hw);
                        total2 += NTR(re[i].mounth2dhls_hw); total8 += NTR(re[i].mounth8dhls_hw);
                        total3 += NTR(re[i].mounth3dhls_hw); total9 += NTR(re[i].mounth9dhls_hw);
                        total4 += NTR(re[i].mounth4dhls_hw); total10 += NTR(re[i].mounth10dhls_hw);
                        total5 += NTR(re[i].mounth5dhls_hw); total11 += NTR(re[i].mounth11dhls_hw);
                        total6 += NTR(re[i].mounth6dhls_hw); total12 += NTR(re[i].mounth12dhls_hw);
                        total1dhls_hw += NTR(re[i].mounth1dhls_hw); total7dhls_hw += NTR(re[i].mounth7dhls_hw);
                        total2dhls_hw += NTR(re[i].mounth2dhls_hw); total8dhls_hw += NTR(re[i].mounth8dhls_hw);
                        total3dhls_hw += NTR(re[i].mounth3dhls_hw); total9dhls_hw += NTR(re[i].mounth9dhls_hw);
                        total4dhls_hw += NTR(re[i].mounth4dhls_hw); total10dhls_hw += NTR(re[i].mounth10dhls_hw);
                        total5dhls_hw += NTR(re[i].mounth5dhls_hw); total11dhls_hw += NTR(re[i].mounth11dhls_hw);
                        total6dhls_hw += NTR(re[i].mounth6dhls_hw); total12dhls_hw += NTR(re[i].mounth12dhls_hw);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1dhls_hw)
                            s.setLineItemValue('custpage_m2', line, re[i].target2dhls_hw)
                            s.setLineItemValue('custpage_m3', line, re[i].target3dhls_hw)
                            s.setLineItemValue('custpage_m4', line, re[i].target4dhls_hw)
                            s.setLineItemValue('custpage_m5', line, re[i].target5dhls_hw)
                            s.setLineItemValue('custpage_m6', line, re[i].target6dhls_hw)
                            s.setLineItemValue('custpage_m7', line, re[i].target7dhls_hw)
                            s.setLineItemValue('custpage_m8', line, re[i].target8dhls_hw)
                            s.setLineItemValue('custpage_m9', line, re[i].target9dhls_hw)
                            s.setLineItemValue('custpage_m10', line, re[i].target10dhls_hw)
                            s.setLineItemValue('custpage_m11', line, re[i].target11dhls_hw)
                            s.setLineItemValue('custpage_m12', line, re[i].target12dhls_hw)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetdhls_hw)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1dhls_hw); target7 += NTR(re[i].target7dhls_hw);
                            target2 += NTR(re[i].target2dhls_hw); target8 += NTR(re[i].target8adhls_hw);
                            target3 += NTR(re[i].target3dhls_hw); target9 += NTR(re[i].target9dhls_hw);
                            target4 += NTR(re[i].target4dhls_hw); target10 += NTR(re[i].target10dhls_hw);
                            target5 += NTR(re[i].target5dhls_hw); target11 += NTR(re[i].target11dhls_hw);
                            target6 += NTR(re[i].target6dhls_hw); target12 += NTR(re[i].target12dhls_hw);
                            target1dhls_hw += NTR(re[i].target1dhls_hw); target7dhls_hw += NTR(re[i].target7dhls_hw);
                            target2dhls_hw += NTR(re[i].target2dhls_hw); target8dhls_hw += NTR(re[i].target8adhls_hw);
                            target3dhls_hw += NTR(re[i].target3dhls_hw); target9dhls_hw += NTR(re[i].target9dhls_hw);
                            target4dhls_hw += NTR(re[i].target4dhls_hw); target10dhls_hw += NTR(re[i].target10dhls_hw);
                            target5dhls_hw += NTR(re[i].target5dhls_hw); target11dhls_hw += NTR(re[i].target11dhls_hw);
                            target6dhls_hw += NTR(re[i].target6dhls_hw); target12dhls_hw += NTR(re[i].target12dhls_hw);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1dhls_hw)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2dhls_hw)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3dhls_hw)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4dhls_hw)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5dhls_hw)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6dhls_hw)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7dhls_hw)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8dhls_hw)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9dhls_hw)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10dhls_hw)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11dhls_hw)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12dhls_hw)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercdhls_hw)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1dhls_hw, re[i].gap1dhls_hw, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2dhls_hw, re[i].gap2dhls_hw, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3dhls_hw, re[i].gap3dhls_hw, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4dhls_hw, re[i].gap4dhls_hw, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5dhls_hw, re[i].gap5dhls_hw, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6dhls_hw, re[i].gap6dhls_hw, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7dhls_hw, re[i].gap7dhls_hw, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8dhls_hw, re[i].gap8dhls_hw, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9dhls_hw, re[i].gap9dhls_hw, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10dhls_hw, re[i].gap10dhls_hw, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11dhls_hw, re[i].gap11dhls_hw, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12dhls_hw, re[i].gap12dhls_hw, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapdhls_hw)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1dhls_hw); gap7 += NTR(re[i].gap7dhls_hw);
                            gap2 += NTR(re[i].gap2dhls_hw); gap8 += NTR(re[i].gap8dhls_hw);
                            gap3 += NTR(re[i].gap3dhls_hw); gap9 += NTR(re[i].gap9dhls_hw);
                            gap4 += NTR(re[i].gap4dhls_hw); gap10 += NTR(re[i].gap10dhls_hw);
                            gap5 += NTR(re[i].gap5dhls_hw); gap11 += NTR(re[i].gap11dhls_hw);
                            gap6 += NTR(re[i].gap6dhls_hw); gap12 += NTR(re[i].gap12dhls_hw);
                            gap1dhls_hw += NTR(re[i].gap1dhls_hw); gap7dhls_hw += NTR(re[i].gap7dhls_hw);
                            gap2dhls_hw += NTR(re[i].gap2dhls_hw); gap8dhls_hw += NTR(re[i].gap8dhls_hw);
                            gap3dhls_hw += NTR(re[i].gap3dhls_hw); gap9dhls_hw += NTR(re[i].gap9dhls_hw);
                            gap4dhls_hw += NTR(re[i].gap4dhls_hw); gap10dhls_hw += NTR(re[i].gap10dhls_hw);
                            gap5dhls_hw += NTR(re[i].gap5dhls_hw); gap11dhls_hw += NTR(re[i].gap11dhls_hw);
                            gap6dhls_hw += NTR(re[i].gap6dhls_hw); gap12dhls_hw += NTR(re[i].gap12dhls_hw);

                        }
                    }
                    line = line + 1;

                }
                else if (ProductFamilyList[z].name == 'D&HLS Service') {
                    if (m == 0) {
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1gt, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1gt + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2gt, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2gt + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3gt, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3gt + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4gt, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4gt + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5gt, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5gt + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6gt, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6gt + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7gt, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7gt + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8gt, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8gt + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9gt, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9gt + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10gt, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10gt + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11gt, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11gt + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12gt, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12gt + "</a>";
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
                        //s.setLineItemValue('custpage_total', line, re[i].totalgt)
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "gt"])
                            totaltarget += NTR(re[i]["target" + h + "gt"])
                            gaptotal += NTR(re[i]["gap" + h + "gt"])
                            Totalgt += NTR(re[i]["mounth" + h + "gt"])
                            targetgt += NTR(re[i]["target" + h + "gt"])
                            gapgt += NTR(re[i]["gap" + h + "gt"]);
                        }
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1gt); total7 += NTR(re[i].mounth7gt);
                        total2 += NTR(re[i].mounth2gt); total8 += NTR(re[i].mounth8gt);
                        total3 += NTR(re[i].mounth3gt); total9 += NTR(re[i].mounth9gt);
                        total4 += NTR(re[i].mounth4gt); total10 += NTR(re[i].mounth10gt);
                        total5 += NTR(re[i].mounth5gt); total11 += NTR(re[i].mounth11gt);
                        total6 += NTR(re[i].mounth6gt); total12 += NTR(re[i].mounth12gt);
                        total1gt += NTR(re[i].mounth1gt); total7gt += NTR(re[i].mounth7gt);
                        total2gt += NTR(re[i].mounth2gt); total8gt += NTR(re[i].mounth8gt);
                        total3gt += NTR(re[i].mounth3gt); total9gt += NTR(re[i].mounth9gt);
                        total4gt += NTR(re[i].mounth4gt); total10gt += NTR(re[i].mounth10gt);
                        total5gt += NTR(re[i].mounth5gt); total11gt += NTR(re[i].mounth11gt);
                        total6gt += NTR(re[i].mounth6gt); total12gt += NTR(re[i].mounth12gt);
                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1gt)
                            s.setLineItemValue('custpage_m2', line, re[i].target2gt)
                            s.setLineItemValue('custpage_m3', line, re[i].target3gt)
                            s.setLineItemValue('custpage_m4', line, re[i].target4gt)
                            s.setLineItemValue('custpage_m5', line, re[i].target5gt)
                            s.setLineItemValue('custpage_m6', line, re[i].target6gt)
                            s.setLineItemValue('custpage_m7', line, re[i].target7gt)
                            s.setLineItemValue('custpage_m8', line, re[i].target8gt)
                            s.setLineItemValue('custpage_m9', line, re[i].target9gt)
                            s.setLineItemValue('custpage_m10', line, re[i].target10gt)
                            s.setLineItemValue('custpage_m11', line, re[i].target11gt)
                            s.setLineItemValue('custpage_m12', line, re[i].target12gt)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1gt); target7 += NTR(re[i].target7gt);
                            target2 += NTR(re[i].target2gt); target8 += NTR(re[i].target8agt);
                            target3 += NTR(re[i].target3gt); target9 += NTR(re[i].target9gt);
                            target4 += NTR(re[i].target4gt); target10 += NTR(re[i].target10gt);
                            target5 += NTR(re[i].target5gt); target11 += NTR(re[i].target11gt);
                            target6 += NTR(re[i].target6gt); target12 += NTR(re[i].target12gt);
                            target1gt += NTR(re[i].target1gt); target7gt += NTR(re[i].target7gt);
                            target2gt += NTR(re[i].target2gt); target8gt += NTR(re[i].target8agt);
                            target3gt += NTR(re[i].target3gt); target9gt += NTR(re[i].target9gt);
                            target4gt += NTR(re[i].target4gt); target10gt += NTR(re[i].target10gt);
                            target5gt += NTR(re[i].target5gt); target11gt += NTR(re[i].target11gt);
                            target6gt += NTR(re[i].target6gt); target12gt += NTR(re[i].target12gt);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1gt)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2gt)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3gt)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4gt)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5gt)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6gt)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7gt)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8gt)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9gt)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10gt)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11gt)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12gt)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1gt, re[i].gap1gt, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2gt, re[i].gap2gt, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3gt, re[i].gap3gt, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4gt, re[i].gap4gt, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5gt, re[i].gap5gt, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6gt, re[i].gap6gt, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7gt, re[i].gap7gt, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8gt, re[i].gap8gt, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9gt, re[i].gap9gt, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10gt, re[i].gap10gt, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11gt, re[i].gap11gt, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12gt, re[i].gap12gt, 12))
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1gt); gap7 += NTR(re[i].gap7gt);
                            gap2 += NTR(re[i].gap2gt); gap8 += NTR(re[i].gap8gt);
                            gap3 += NTR(re[i].gap3gt); gap9 += NTR(re[i].gap9gt);
                            gap4 += NTR(re[i].gap4gt); gap10 += NTR(re[i].gap10gt);
                            gap5 += NTR(re[i].gap5gt); gap11 += NTR(re[i].gap11gt);
                            gap6 += NTR(re[i].gap6gt); gap12 += NTR(re[i].gap12gt);
                            gap1gt += NTR(re[i].gap1gt); gap7gt += NTR(re[i].gap7gt);
                            gap2gt += NTR(re[i].gap2gt); gap8gt += NTR(re[i].gap8gt);
                            gap3gt += NTR(re[i].gap3gt); gap9gt += NTR(re[i].gap9gt);
                            gap4gt += NTR(re[i].gap4gt); gap10gt += NTR(re[i].gap10gt);
                            gap5gt += NTR(re[i].gap5gt); gap11gt += NTR(re[i].gap11gt);
                            gap6gt += NTR(re[i].gap6gt); gap12gt += NTR(re[i].gap12gt);
                        }
                    }
                    line = line + 1;
                }
                else if (ProductFamilyList[z].name == 'General') {
                    if (m == 0) {
                        for (var h = Number(from_mounthData); h <= Number(to_mounthData); h++) {
                            total += NTR(re[i]["mounth" + h + "general"])
                            totaltarget += NTR(re[i]["target" + h + "general"])
                            gaptotal += NTR(re[i]["gap" + h + "general"])
                            Totalgeneral += NTR(re[i]["mounth" + h + "general"])
                            targetgeneral += NTR(re[i]["target" + h + "general"])
                            gapgeneral += NTR(re[i]["gap" + h + "general"])
                        }
                        s.setLineItemValue('custpage_n', line, '');
                        s.setLineItemValue('custpage_pf', line, ProductFamilyList[z].name);
                        s.setLineItemValue('custpage_p', line, 'Actual');
                        var mounth1 = "<a style='color:" + GCM(re[i].perc1general, 1) + "'" + " href='" + link + re[i].sales_rep_id + '&m=1&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth1general + "</a>";
                        var mounth2 = "<a style='color:" + GCM(re[i].perc2general, 2) + "'" + " href='" + link + re[i].sales_rep_id + '&m=2&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth2general + "</a>";
                        var mounth3 = "<a style='color:" + GCM(re[i].perc3general, 3) + "'" + " href='" + link + re[i].sales_rep_id + '&m=3&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth3general + "</a>";
                        var mounth4 = "<a style='color:" + GCM(re[i].perc4general, 4) + "'" + " href='" + link + re[i].sales_rep_id + '&m=4&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth4general + "</a>";
                        var mounth5 = "<a style='color:" + GCM(re[i].perc5general, 5) + "'" + " href='" + link + re[i].sales_rep_id + '&m=5&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth5general + "</a>";
                        var mounth6 = "<a style='color:" + GCM(re[i].perc6general, 6) + "'" + " href='" + link + re[i].sales_rep_id + '&m=6&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth6general + "</a>";
                        var mounth7 = "<a style='color:" + GCM(re[i].perc7general, 7) + "'" + " href='" + link + re[i].sales_rep_id + '&m=7&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth7general + "</a>";
                        var mounth8 = "<a style='color:" + GCM(re[i].perc8general, 8) + "'" + " href='" + link + re[i].sales_rep_id + '&m=8&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth8general + "</a>";
                        var mounth9 = "<a style='color:" + GCM(re[i].perc9general, 9) + "'" + " href='" + link + re[i].sales_rep_id + '&m=9&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth9general + "</a>";
                        var mounth10 = "<a style='color:" + GCM(re[i].perc10general, 10) + "'" + " href='" + link + re[i].sales_rep_id + '&m=10&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth10general + "</a>";
                        var mounth11 = "<a style='color:" + GCM(re[i].perc11general, 11) + "'" + " href='" + link + re[i].sales_rep_id + '&m=11&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth11general + "</a>";
                        var mounth12 = "<a style='color:" + GCM(re[i].perc12general, 12) + "'" + " href='" + link + re[i].sales_rep_id + '&m=12&type=1' + '&year=' + yearData + '&pf=' + ProductFamilyList[z].id + "'" + 'target="_blank">' + re[i].mounth12general + "</a>";
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
                        s.setLineItemValue('custpage_total', line, re[i].totalgeneral)
                        s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(total.toFixed(2))))
                        ActualTotal += total;
                        total1 += NTR(re[i].mounth1general); total7 += NTR(re[i].mounth7general);
                        total2 += NTR(re[i].mounth2general); total8 += NTR(re[i].mounth8general);
                        total3 += NTR(re[i].mounth3general); total9 += NTR(re[i].mounth9general);
                        total4 += NTR(re[i].mounth4general); total10 += NTR(re[i].mounth10general);
                        total5 += NTR(re[i].mounth5general); total11 += NTR(re[i].mounth11general);
                        total6 += NTR(re[i].mounth6general); total12 += NTR(re[i].mounth12general);
                        total1general += NTR(re[i].mounth1general); total7general += NTR(re[i].mounth7general);
                        total2general += NTR(re[i].mounth2general); total8general += NTR(re[i].mounth8general);
                        total3general += NTR(re[i].mounth3general); total9general += NTR(re[i].mounth9general);
                        total4general += NTR(re[i].mounth4general); total10general += NTR(re[i].mounth10general);
                        total5general += NTR(re[i].mounth5general); total11general += NTR(re[i].mounth11general);
                        total6general += NTR(re[i].mounth6general); total12general += NTR(re[i].mounth12general);


                    } else {
                        s.setLineItemValue('custpage_n', line, '');
                        if (m == 1) {
                            s.setLineItemValue('custpage_p', line, 'Target')
                            s.setLineItemValue('custpage_m1', line, re[i].target1general)
                            s.setLineItemValue('custpage_m2', line, re[i].target2general)
                            s.setLineItemValue('custpage_m3', line, re[i].target3general)
                            s.setLineItemValue('custpage_m4', line, re[i].target4general)
                            s.setLineItemValue('custpage_m5', line, re[i].target5general)
                            s.setLineItemValue('custpage_m6', line, re[i].target6general)
                            s.setLineItemValue('custpage_m7', line, re[i].target7general)
                            s.setLineItemValue('custpage_m8', line, re[i].target8general)
                            s.setLineItemValue('custpage_m9', line, re[i].target9general)
                            s.setLineItemValue('custpage_m10', line, re[i].target10general)
                            s.setLineItemValue('custpage_m11', line, re[i].target11general)
                            s.setLineItemValue('custpage_m12', line, re[i].target12general)
                            s.setLineItemValue('custpage_total', line, re[i].totaltargetgeneral)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(totaltarget.toFixed(2)))
                            TargetlTotal += totaltarget;
                            target1 += NTR(re[i].target1general); target7 += NTR(re[i].target7general);
                            target2 += NTR(re[i].target2general); target8 += NTR(re[i].target8general);
                            target3 += NTR(re[i].target3general); target9 += NTR(re[i].target9general);
                            target4 += NTR(re[i].target4general); target10 += NTR(re[i].target10general);
                            target5 += NTR(re[i].target5general); target11 += NTR(re[i].target11general);
                            target6 += NTR(re[i].target6general); target12 += NTR(re[i].target12general);
                            target1general += NTR(re[i].target1general); target7general += NTR(re[i].target7general);
                            target2general += NTR(re[i].target2general); target8general += NTR(re[i].target8ageneral);
                            target3general += NTR(re[i].target3general); target9general += NTR(re[i].target9general);
                            target4general += NTR(re[i].target4general); target10general += NTR(re[i].target10general);
                            target5general += NTR(re[i].target5general); target11general += NTR(re[i].target11general);
                            target6general += NTR(re[i].target6general); target12general += NTR(re[i].target12general);
                        }
                        else if (m == 2) {
                            s.setLineItemValue('custpage_p', line, '% of Target')
                            s.setLineItemValue('custpage_m1', line, re[i].perc1general)
                            s.setLineItemValue('custpage_m2', line, re[i].perc2general)
                            s.setLineItemValue('custpage_m3', line, re[i].perc3general)
                            s.setLineItemValue('custpage_m4', line, re[i].perc4general)
                            s.setLineItemValue('custpage_m5', line, re[i].perc5general)
                            s.setLineItemValue('custpage_m6', line, re[i].perc6general)
                            s.setLineItemValue('custpage_m7', line, re[i].perc7general)
                            s.setLineItemValue('custpage_m8', line, re[i].perc8general)
                            s.setLineItemValue('custpage_m9', line, re[i].perc9general)
                            s.setLineItemValue('custpage_m10', line, re[i].perc10general)
                            s.setLineItemValue('custpage_m11', line, re[i].perc11general)
                            s.setLineItemValue('custpage_m12', line, re[i].perc12general)
                            s.setLineItemValue('custpage_total', line, re[i].totalpercgeneral)
                            s.setLineItemValue('custpage_total_t', line, formatNumber(getPrecenge(total, totaltarget)) + '%')
                        }
                        else {
                            s.setLineItemValue('custpage_p', line, 'GAP (Amount)')
                            s.setLineItemValue('custpage_m1', line, GGC(re[i].perc1general, re[i].gap1general, 1))
                            s.setLineItemValue('custpage_m2', line, GGC(re[i].perc2general, re[i].gap2general, 2))
                            s.setLineItemValue('custpage_m3', line, GGC(re[i].perc3general, re[i].gap3general, 3))
                            s.setLineItemValue('custpage_m4', line, GGC(re[i].perc4general, re[i].gap4general, 4))
                            s.setLineItemValue('custpage_m5', line, GGC(re[i].perc5general, re[i].gap5general, 5))
                            s.setLineItemValue('custpage_m6', line, GGC(re[i].perc6general, re[i].gap6general, 6))
                            s.setLineItemValue('custpage_m7', line, GGC(re[i].perc7general, re[i].gap7general, 7))
                            s.setLineItemValue('custpage_m8', line, GGC(re[i].perc8general, re[i].gap8general, 8))
                            s.setLineItemValue('custpage_m9', line, GGC(re[i].perc9general, re[i].gap9general, 9))
                            s.setLineItemValue('custpage_m10', line, GGC(re[i].perc10general, re[i].gap10general, 10))
                            s.setLineItemValue('custpage_m11', line, GGC(re[i].perc11general, re[i].gap11general, 11))
                            s.setLineItemValue('custpage_m12', line, GGC(re[i].perc12general, re[i].gap12general, 12))
                            s.setLineItemValue('custpage_total', line, re[i].totalgapgeneral)
                            s.setLineItemValue('custpage_total_t', line, getGapColor(formatNumber(getPrecenge(total, totaltarget)) + '%', formatNumber(gaptotal.toFixed(2))))
                            GAPTotal += gaptotal;
                            gap1 += NTR(re[i].gap1general); gap7 += NTR(re[i].gap7general);
                            gap2 += NTR(re[i].gap2general); gap8 += NTR(re[i].gap8general);
                            gap3 += NTR(re[i].gap3general); gap9 += NTR(re[i].gap9general);
                            gap4 += NTR(re[i].gap4general); gap10 += NTR(re[i].gap10general);
                            gap5 += NTR(re[i].gap5general); gap11 += NTR(re[i].gap11general);
                            gap6 += NTR(re[i].gap6general); gap12 += NTR(re[i].gap12general);
                            gap1general += NTR(re[i].gap1general); gap7general += NTR(re[i].gap7general);
                            gap2general += NTR(re[i].gap2general); gap8general += NTR(re[i].gap8general);
                            gap3general += NTR(re[i].gap3general); gap9general += NTR(re[i].gap9general);
                            gap4general += NTR(re[i].gap4general); gap10general += NTR(re[i].gap10general);
                            gap5general += NTR(re[i].gap5general); gap11general += NTR(re[i].gap11general);
                            gap6general += NTR(re[i].gap6general); gap12general += NTR(re[i].gap12general);
                        }
                    }
                    line = line + 1;

                }
            }//  for (var m = 0; m < 4; m++)
        }
    }
    res = [re  ,s , line]
    return res;
}