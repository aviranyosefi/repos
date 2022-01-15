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
        nlapiLogExecution('debug', 'SalesRepTargets allSelection ', allSelection.length)

        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                //
                var data = allSelection[i].getValue("custrecord_sr_amounts")
                var dataSplit = splitDataAmountPf(data)
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var target_dataSplit = splitTargetAmountPf(data)
                var target_dataSplitSecond = splitTargetAmountSecondPf(data)
                var totalmount = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5] + dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                //var totaltarget = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
                var totaltarget = target_dataSplitSecond[0] + target_dataSplitSecond[1] + target_dataSplitSecond[2] + target_dataSplitSecond[3] + target_dataSplitSecond[4] + target_dataSplitSecond[5] + target_dataSplitSecond[6] + target_dataSplitSecond[7] + target_dataSplitSecond[8] + target_dataSplitSecond[9] + target_dataSplitSecond[10] + target_dataSplitSecond[11];

                mounth1 = formatNumber(NTR(dataSplit[0].bbs) + NTR(dataSplit[0].sr) + NTR(dataSplit[0].vas) + NTR(dataSplit[0].bod) + NTR(dataSplit[0].cband) + NTR(dataSplit[0].domestic) + NTR(dataSplit[0].ip) + NTR(dataSplit[0].iru) + NTR(dataSplit[0].kuband) + NTR(dataSplit[0].mobile_vsat) + NTR(dataSplit[0].mpip) + NTR(dataSplit[0].o3b) + NTR(dataSplit[0].ps) + NTR(dataSplit[0].hw) + NTR(dataSplit[0].dhls_hw) + NTR(dataSplit[0].gt) + NTR(dataSplit[0].none))
                mounth2 = formatNumber(NTR(dataSplit[1].bbs) + NTR(dataSplit[1].sr) + NTR(dataSplit[1].vas) + NTR(dataSplit[1].bod) + NTR(dataSplit[1].cband) + NTR(dataSplit[1].domestic) + NTR(dataSplit[1].ip) + NTR(dataSplit[1].iru) + NTR(dataSplit[1].kuband) + NTR(dataSplit[1].mobile_vsat) + NTR(dataSplit[1].mpip) + NTR(dataSplit[1].o3b) + NTR(dataSplit[1].ps) + NTR(dataSplit[1].hw) + NTR(dataSplit[1].dhls_hw) + NTR(dataSplit[1].gt) + NTR(dataSplit[1].none))
                mounth3 = formatNumber(NTR(dataSplit[2].bbs) + NTR(dataSplit[2].sr) + NTR(dataSplit[2].vas) + NTR(dataSplit[2].bod) + NTR(dataSplit[2].cband) + NTR(dataSplit[2].domestic) + NTR(dataSplit[2].ip) + NTR(dataSplit[2].iru) + NTR(dataSplit[2].kuband) + NTR(dataSplit[2].mobile_vsat) + NTR(dataSplit[2].mpip) + NTR(dataSplit[2].o3b) + NTR(dataSplit[2].ps) + NTR(dataSplit[2].hw) + NTR(dataSplit[2].dhls_hw) + NTR(dataSplit[2].gt) + NTR(dataSplit[2].none))
                mounth4 = formatNumber(NTR(dataSplit[3].bbs) + NTR(dataSplit[3].sr) + NTR(dataSplit[3].vas) + NTR(dataSplit[3].bod) + NTR(dataSplit[3].cband) + NTR(dataSplit[3].domestic) + NTR(dataSplit[3].ip) + NTR(dataSplit[3].iru) + NTR(dataSplit[3].kuband) + NTR(dataSplit[3].mobile_vsat) + NTR(dataSplit[3].mpip) + NTR(dataSplit[3].o3b) + NTR(dataSplit[3].ps) + NTR(dataSplit[3].hw) + NTR(dataSplit[3].dhls_hw) + NTR(dataSplit[3].gt) + NTR(dataSplit[3].none))
                mounth5 = formatNumber(NTR(dataSplit[4].bbs) + NTR(dataSplit[4].sr) + NTR(dataSplit[4].vas) + NTR(dataSplit[4].bod) + NTR(dataSplit[4].cband) + NTR(dataSplit[4].domestic) + NTR(dataSplit[4].ip) + NTR(dataSplit[4].iru) + NTR(dataSplit[4].kuband) + NTR(dataSplit[4].mobile_vsat) + NTR(dataSplit[4].mpip) + NTR(dataSplit[4].o3b) + NTR(dataSplit[4].ps) + NTR(dataSplit[4].hw) + NTR(dataSplit[4].dhls_hw) + NTR(dataSplit[4].gt) + NTR(dataSplit[4].none))
                mounth6 = formatNumber(NTR(dataSplit[5].bbs) + NTR(dataSplit[5].sr) + NTR(dataSplit[5].vas) + NTR(dataSplit[5].bod) + NTR(dataSplit[5].cband) + NTR(dataSplit[5].domestic) + NTR(dataSplit[5].ip) + NTR(dataSplit[5].iru) + NTR(dataSplit[5].kuband) + NTR(dataSplit[5].mobile_vsat) + NTR(dataSplit[5].mpip) + NTR(dataSplit[5].o3b) + NTR(dataSplit[5].ps) + NTR(dataSplit[5].hw) + NTR(dataSplit[5].dhls_hw) + NTR(dataSplit[5].gt) + NTR(dataSplit[5].none))
                mounth7 = formatNumber(NTR(dataSplit[6].bbs) + NTR(dataSplit[6].sr) + NTR(dataSplit[6].vas) + NTR(dataSplit[6].bod) + NTR(dataSplit[6].cband) + NTR(dataSplit[6].domestic) + NTR(dataSplit[6].ip) + NTR(dataSplit[6].iru) + NTR(dataSplit[6].kuband) + NTR(dataSplit[6].mobile_vsat) + NTR(dataSplit[6].mpip) + NTR(dataSplit[6].o3b) + NTR(dataSplit[6].ps) + NTR(dataSplit[6].hw) + NTR(dataSplit[6].dhls_hw) + NTR(dataSplit[6].gt) + NTR(dataSplit[6].none))
                mounth8 = formatNumber(NTR(dataSplit[7].bbs) + NTR(dataSplit[7].sr) + NTR(dataSplit[7].vas) + NTR(dataSplit[7].bod) + NTR(dataSplit[7].cband) + NTR(dataSplit[7].domestic) + NTR(dataSplit[7].ip) + NTR(dataSplit[7].iru) + NTR(dataSplit[7].kuband) + NTR(dataSplit[7].mobile_vsat) + NTR(dataSplit[7].mpip) + NTR(dataSplit[7].o3b) + NTR(dataSplit[7].ps) + NTR(dataSplit[7].hw) + NTR(dataSplit[7].dhls_hw) + NTR(dataSplit[7].gt) + NTR(dataSplit[7].none))
                mounth9 = formatNumber(NTR(dataSplit[8].bbs) + NTR(dataSplit[8].sr) + NTR(dataSplit[8].vas) + NTR(dataSplit[8].bod) + NTR(dataSplit[8].cband) + NTR(dataSplit[8].domestic) + NTR(dataSplit[8].ip) + NTR(dataSplit[8].iru) + NTR(dataSplit[8].kuband) + NTR(dataSplit[8].mobile_vsat) + NTR(dataSplit[8].mpip) + NTR(dataSplit[8].o3b) + NTR(dataSplit[8].ps) + NTR(dataSplit[8].hw) + NTR(dataSplit[8].dhls_hw) + NTR(dataSplit[8].gt) + NTR(dataSplit[8].none))
                mounth10 = formatNumber(NTR(dataSplit[9].bbs) + NTR(dataSplit[9].sr) + NTR(dataSplit[9].vas) + NTR(dataSplit[9].bod) + NTR(dataSplit[9].cband) + NTR(dataSplit[9].domestic) + NTR(dataSplit[9].ip) + NTR(dataSplit[9].iru) + NTR(dataSplit[9].kuband) + NTR(dataSplit[9].mobile_vsat) + NTR(dataSplit[9].mpip) + NTR(dataSplit[9].o3b) + NTR(dataSplit[9].ps) + NTR(dataSplit[9].hw) + NTR(dataSplit[9].dhls_hw) + NTR(dataSplit[9].gt) + NTR(dataSplit[9].none))
                mounth11 = formatNumber(NTR(dataSplit[10].bbs) + NTR(dataSplit[10].sr) + NTR(dataSplit[10].vas) + NTR(dataSplit[10].bod) + NTR(dataSplit[10].cband) + NTR(dataSplit[10].domestic) + NTR(dataSplit[10].ip) + NTR(dataSplit[10].iru) + NTR(dataSplit[10].kuband) + NTR(dataSplit[10].mobile_vsat) + NTR(dataSplit[10].mpip) + NTR(dataSplit[10].o3b) + NTR(dataSplit[10].ps) + NTR(dataSplit[10].hw) + NTR(dataSplit[10].dhls_hw) + NTR(dataSplit[10].gt) + NTR(dataSplit[10].none))
                mounth12 = formatNumber(NTR(dataSplit[11].bbs) + NTR(dataSplit[11].sr) + NTR(dataSplit[11].vas) + NTR(dataSplit[11].bod) + NTR(dataSplit[11].cband) + NTR(dataSplit[11].domestic) + NTR(dataSplit[11].ip) + NTR(dataSplit[11].iru) + NTR(dataSplit[11].kuband) + NTR(dataSplit[11].mobile_vsat) + NTR(dataSplit[11].mpip) + NTR(dataSplit[11].o3b) + NTR(dataSplit[11].ps) + NTR(dataSplit[11].hw) + NTR(dataSplit[11].dhls_hw) + NTR(dataSplit[11].gt) + NTR(dataSplit[11].none))

                Ftarget1 = formatNumber(NTR(target_dataSplit[0].bbs) + NTR(target_dataSplit[0].sr) + NTR(target_dataSplit[0].vas) + NTR(target_dataSplit[0].bod) + NTR(target_dataSplit[0].cband) + NTR(target_dataSplit[0].domestic) + NTR(target_dataSplit[0].ip) + NTR(target_dataSplit[0].iru) + NTR(target_dataSplit[0].kuband) + NTR(target_dataSplit[0].mobile_vsat) + NTR(target_dataSplit[0].mpip) + NTR(target_dataSplit[0].o3b) + NTR(target_dataSplit[0].ps) + NTR(target_dataSplit[0].hw) + NTR(target_dataSplit[0].dhls_hw) + NTR(target_dataSplit[0].gt))
                Ftarget2 = formatNumber(NTR(target_dataSplit[1].bbs) + NTR(target_dataSplit[1].sr) + NTR(target_dataSplit[1].vas) + NTR(target_dataSplit[1].bod) + NTR(target_dataSplit[1].cband) + NTR(target_dataSplit[1].domestic) + NTR(target_dataSplit[1].ip) + NTR(target_dataSplit[1].iru) + NTR(target_dataSplit[1].kuband) + NTR(target_dataSplit[1].mobile_vsat) + NTR(target_dataSplit[1].mpip) + NTR(target_dataSplit[1].o3b) + NTR(target_dataSplit[1].ps) + NTR(target_dataSplit[1].hw) + NTR(target_dataSplit[1].dhls_hw) + NTR(target_dataSplit[1].gt))
                Ftarget3 = formatNumber(NTR(target_dataSplit[2].bbs) + NTR(target_dataSplit[2].sr) + NTR(target_dataSplit[2].vas) + NTR(target_dataSplit[2].bod) + NTR(target_dataSplit[2].cband) + NTR(target_dataSplit[2].domestic) + NTR(target_dataSplit[2].ip) + NTR(target_dataSplit[2].iru) + NTR(target_dataSplit[2].kuband) + NTR(target_dataSplit[2].mobile_vsat) + NTR(target_dataSplit[2].mpip) + NTR(target_dataSplit[2].o3b) + NTR(target_dataSplit[2].ps) + NTR(target_dataSplit[2].hw) + NTR(target_dataSplit[2].dhls_hw) + NTR(target_dataSplit[2].gt))
                Ftarget4 = formatNumber(NTR(target_dataSplit[3].bbs) + NTR(target_dataSplit[3].sr) + NTR(target_dataSplit[3].vas) + NTR(target_dataSplit[3].bod) + NTR(target_dataSplit[3].cband) + NTR(target_dataSplit[3].domestic) + NTR(target_dataSplit[3].ip) + NTR(target_dataSplit[3].iru) + NTR(target_dataSplit[3].kuband) + NTR(target_dataSplit[3].mobile_vsat) + NTR(target_dataSplit[3].mpip) + NTR(target_dataSplit[3].o3b) + NTR(target_dataSplit[3].ps) + NTR(target_dataSplit[3].hw) + NTR(target_dataSplit[3].dhls_hw) + NTR(target_dataSplit[3].gt))
                Ftarget5 = formatNumber(NTR(target_dataSplit[4].bbs) + NTR(target_dataSplit[4].sr) + NTR(target_dataSplit[4].vas) + NTR(target_dataSplit[4].bod) + NTR(target_dataSplit[4].cband) + NTR(target_dataSplit[4].domestic) + NTR(target_dataSplit[4].ip) + NTR(target_dataSplit[4].iru) + NTR(target_dataSplit[4].kuband) + NTR(target_dataSplit[4].mobile_vsat) + NTR(target_dataSplit[4].mpip) + NTR(target_dataSplit[4].o3b) + NTR(target_dataSplit[4].ps) + NTR(target_dataSplit[4].hw) + NTR(target_dataSplit[4].dhls_hw) + NTR(target_dataSplit[4].gt))
                Ftarget6 = formatNumber(NTR(target_dataSplit[5].bbs) + NTR(target_dataSplit[5].sr) + NTR(target_dataSplit[5].vas) + NTR(target_dataSplit[5].bod) + NTR(target_dataSplit[5].cband) + NTR(target_dataSplit[5].domestic) + NTR(target_dataSplit[5].ip) + NTR(target_dataSplit[5].iru) + NTR(target_dataSplit[5].kuband) + NTR(target_dataSplit[5].mobile_vsat) + NTR(target_dataSplit[5].mpip) + NTR(target_dataSplit[5].o3b) + NTR(target_dataSplit[5].ps) + NTR(target_dataSplit[5].hw) + NTR(target_dataSplit[5].dhls_hw) + NTR(target_dataSplit[5].gt))
                Ftarget7 = formatNumber(NTR(target_dataSplit[6].bbs) + NTR(target_dataSplit[6].sr) + NTR(target_dataSplit[6].vas) + NTR(target_dataSplit[6].bod) + NTR(target_dataSplit[6].cband) + NTR(target_dataSplit[6].domestic) + NTR(target_dataSplit[6].ip) + NTR(target_dataSplit[6].iru) + NTR(target_dataSplit[6].kuband) + NTR(target_dataSplit[6].mobile_vsat) + NTR(target_dataSplit[6].mpip) + NTR(target_dataSplit[6].o3b) + NTR(target_dataSplit[6].ps) + NTR(target_dataSplit[6].hw) + NTR(target_dataSplit[6].dhls_hw) + NTR(target_dataSplit[6].gt))
                Ftarget8 = formatNumber(NTR(target_dataSplit[7].bbs) + NTR(target_dataSplit[7].sr) + NTR(target_dataSplit[7].vas) + NTR(target_dataSplit[7].bod) + NTR(target_dataSplit[7].cband) + NTR(target_dataSplit[7].domestic) + NTR(target_dataSplit[7].ip) + NTR(target_dataSplit[7].iru) + NTR(target_dataSplit[7].kuband) + NTR(target_dataSplit[7].mobile_vsat) + NTR(target_dataSplit[7].mpip) + NTR(target_dataSplit[7].o3b) + NTR(target_dataSplit[7].ps) + NTR(target_dataSplit[7].hw) + NTR(target_dataSplit[7].dhls_hw) + NTR(target_dataSplit[7].gt))
                Ftarget9 = formatNumber(NTR(target_dataSplit[8].bbs) + NTR(target_dataSplit[8].sr) + NTR(target_dataSplit[8].vas) + NTR(target_dataSplit[8].bod) + NTR(target_dataSplit[8].cband) + NTR(target_dataSplit[8].domestic) + NTR(target_dataSplit[8].ip) + NTR(target_dataSplit[8].iru) + NTR(target_dataSplit[8].kuband) + NTR(target_dataSplit[8].mobile_vsat) + NTR(target_dataSplit[8].mpip) + NTR(target_dataSplit[8].o3b) + NTR(target_dataSplit[8].ps) + NTR(target_dataSplit[8].hw) + NTR(target_dataSplit[8].dhls_hw) + NTR(target_dataSplit[8].gt))
                Ftarget10 = formatNumber(NTR(target_dataSplit[9].bbs) + NTR(target_dataSplit[9].sr) + NTR(target_dataSplit[9].vas) + NTR(target_dataSplit[9].bod) + NTR(target_dataSplit[9].cband) + NTR(target_dataSplit[9].domestic) + NTR(target_dataSplit[9].ip) + NTR(target_dataSplit[9].iru) + NTR(target_dataSplit[9].kuband) + NTR(target_dataSplit[9].mobile_vsat) + NTR(target_dataSplit[9].mpip) + NTR(target_dataSplit[9].o3b) + NTR(target_dataSplit[9].ps) + NTR(target_dataSplit[9].hw) + NTR(target_dataSplit[9].dhls_hw) + NTR(target_dataSplit[9].gt))
                Ftarget11 = formatNumber(NTR(target_dataSplit[10].bbs) + NTR(target_dataSplit[10].sr) + NTR(target_dataSplit[10].vas) + NTR(target_dataSplit[10].bod) + NTR(target_dataSplit[10].cband) + NTR(target_dataSplit[10].domestic) + NTR(target_dataSplit[10].ip) + NTR(target_dataSplit[10].iru) + NTR(target_dataSplit[10].kuband) + NTR(target_dataSplit[10].mobile_vsat) + NTR(target_dataSplit[10].mpip) + NTR(target_dataSplit[10].o3b) + NTR(target_dataSplit[10].ps) + NTR(target_dataSplit[10].hw) + NTR(target_dataSplit[10].dhls_hw) + NTR(target_dataSplit[10].gt))
                Ftarget12 = formatNumber(NTR(target_dataSplit[11].bbs) + NTR(target_dataSplit[11].sr) + NTR(target_dataSplit[11].vas) + NTR(target_dataSplit[11].bod) + NTR(target_dataSplit[11].cband) + NTR(target_dataSplit[11].domestic) + NTR(target_dataSplit[11].ip) + NTR(target_dataSplit[11].iru) + NTR(target_dataSplit[11].kuband) + NTR(target_dataSplit[11].mobile_vsat) + NTR(target_dataSplit[11].mpip) + NTR(target_dataSplit[11].o3b) + NTR(target_dataSplit[11].ps) + NTR(target_dataSplit[11].hw) + NTR(target_dataSplit[11].dhls_hw) + NTR(target_dataSplit[11].gt))

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
                    mounth1: mounth1,
                    mounth2: mounth2,
                    mounth3: mounth3,
                    mounth4: mounth4,
                    mounth5: mounth5,
                    mounth6: mounth6,
                    mounth7: mounth7,
                    mounth8: mounth8,
                    mounth9: mounth9,
                    mounth10: mounth10,
                    mounth11: mounth11,
                    mounth12: mounth12,
                    totalmount: formatNumber(totalmount),
                    target1: Ftarget1,
                    target2: Ftarget2,
                    target3: Ftarget3,
                    target4: Ftarget4,
                    target5: Ftarget5,
                    target6: Ftarget6,
                    target7: Ftarget7,
                    target8: Ftarget8,
                    target9: Ftarget9,
                    target10: Ftarget10,
                    target11: Ftarget11,
                    target12: Ftarget12,
                    totaltarget: formatNumber(totaltarget),
                    gap1: formatNumber(NTR(mounth1) - NTR(Ftarget1)),
                    gap2: formatNumber(NTR(mounth2) - NTR(Ftarget2)),
                    gap3: formatNumber(NTR(mounth3) - NTR(Ftarget3)),
                    gap4: formatNumber(NTR(mounth4) - NTR(Ftarget4)),
                    gap5: formatNumber(NTR(mounth5) - NTR(Ftarget5)),
                    gap6: formatNumber(NTR(mounth6) - NTR(Ftarget6)),
                    gap7: formatNumber(NTR(mounth7) - NTR(Ftarget7)),
                    gap8: formatNumber(NTR(mounth8) - NTR(Ftarget8)),
                    gap9: formatNumber(NTR(mounth9) - NTR(Ftarget9)),
                    gap10: formatNumber(NTR(mounth10) - NTR(Ftarget10)),
                    gap11: formatNumber(NTR(mounth11) - NTR(Ftarget11)),
                    gap12: formatNumber(NTR(mounth12) - NTR(Ftarget12)),
                    totalgap: formatNumber(totalmount - totaltarget),
                    perc1: formatNumber(getPrecenge(NTR(mounth1), NTR(Ftarget1))) + '%',
                    perc2: formatNumber(getPrecenge(NTR(mounth2), NTR(Ftarget2))) + '%',
                    perc3: formatNumber(getPrecenge(NTR(mounth3), NTR(Ftarget3))) + '%',
                    perc4: formatNumber(getPrecenge(NTR(mounth4), NTR(Ftarget4))) + '%',
                    perc5: formatNumber(getPrecenge(NTR(mounth5), NTR(Ftarget5))) + '%',
                    perc6: formatNumber(getPrecenge(NTR(mounth6), NTR(Ftarget6))) + '%',
                    perc7: formatNumber(getPrecenge(NTR(mounth7), NTR(Ftarget7))) + '%',
                    perc8: formatNumber(getPrecenge(NTR(mounth8), NTR(Ftarget8))) + '%',
                    perc9: formatNumber(getPrecenge(NTR(mounth9), NTR(Ftarget9))) + '%',
                    perc10: formatNumber(getPrecenge(NTR(mounth10), NTR(Ftarget10))) + '%',
                    perc11: formatNumber(getPrecenge(NTR(mounth11), NTR(Ftarget11))) + '%',
                    perc12: formatNumber(getPrecenge(NTR(mounth12), NTR(Ftarget12))) + '%',
                    totalperc: formatNumber(getPrecenge(totalmount, totaltarget)) + '%',
                    //
                });
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
                allSelection
                    .push(resultslice[rs]);
                searchid++;
            }
        } while (resultslice != null && resultslice.length >= 1000);
        nlapiLogExecution('debug', 'allSelection ', allSelection.length)

        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                //
                var data = allSelection[i].getValue("custrecord_sr_amounts")
                var dataSplit = splitDataAmountPf(data)
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var target_dataSplit = splitTargetAmountPf(data)
                var target_dataSplitSecond = splitTargetAmountSecondPf(data)
                var totalmount = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5] + dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                //var totaltarget = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
                var totaltarget = target_dataSplitSecond[0] + target_dataSplitSecond[1] + target_dataSplitSecond[2] + target_dataSplitSecond[3] + target_dataSplitSecond[4] + target_dataSplitSecond[5] + target_dataSplitSecond[6] + target_dataSplitSecond[7] + target_dataSplitSecond[8] + target_dataSplitSecond[9] + target_dataSplitSecond[10] + target_dataSplitSecond[11];
                nlapiLogExecution('debug', 'mounth1 ', 'mounth1')
                mounth1 = NTR(dataSplit[0].bbs) + NTR(dataSplit[0].sr) + NTR(dataSplit[0].vas) + NTR(dataSplit[0].bod) + NTR(dataSplit[0].cband) + NTR(dataSplit[0].domestic) + NTR(dataSplit[0].ip) + NTR(dataSplit[0].iru) + NTR(dataSplit[0].kuband) + NTR(dataSplit[0].mobile_vsat) + NTR(dataSplit[0].mpip) + NTR(dataSplit[0].o3b) + NTR(dataSplit[0].ps) + NTR(dataSplit[0].hw) + NTR(dataSplit[0].dhls_hw) + NTR(dataSplit[0].gt) + NTR(dataSplit[0].none)
                mounth2 = (NTR(dataSplit[1].bbs) + NTR(dataSplit[1].sr) + NTR(dataSplit[1].vas) + NTR(dataSplit[1].bod) + NTR(dataSplit[1].cband) + NTR(dataSplit[1].domestic) + NTR(dataSplit[1].ip) + NTR(dataSplit[1].iru) + NTR(dataSplit[1].kuband) + NTR(dataSplit[1].mobile_vsat) + NTR(dataSplit[1].mpip) + NTR(dataSplit[1].o3b) + NTR(dataSplit[1].ps) + NTR(dataSplit[1].hw) + NTR(dataSplit[1].dhls_hw) + NTR(dataSplit[1].gt) + NTR(dataSplit[1].none))
                mounth3 = (NTR(dataSplit[2].bbs) + NTR(dataSplit[2].sr) + NTR(dataSplit[2].vas) + NTR(dataSplit[2].bod) + NTR(dataSplit[2].cband) + NTR(dataSplit[2].domestic) + NTR(dataSplit[2].ip) + NTR(dataSplit[2].iru) + NTR(dataSplit[2].kuband) + NTR(dataSplit[2].mobile_vsat) + NTR(dataSplit[2].mpip) + NTR(dataSplit[2].o3b) + NTR(dataSplit[2].ps) + NTR(dataSplit[2].hw) + NTR(dataSplit[2].dhls_hw) + NTR(dataSplit[2].gt) + NTR(dataSplit[2].none))
                mounth4 = (NTR(dataSplit[3].bbs) + NTR(dataSplit[3].sr) + NTR(dataSplit[3].vas) + NTR(dataSplit[3].bod) + NTR(dataSplit[3].cband) + NTR(dataSplit[3].domestic) + NTR(dataSplit[3].ip) + NTR(dataSplit[3].iru) + NTR(dataSplit[3].kuband) + NTR(dataSplit[3].mobile_vsat) + NTR(dataSplit[3].mpip) + NTR(dataSplit[3].o3b) + NTR(dataSplit[3].ps) + NTR(dataSplit[3].hw) + NTR(dataSplit[3].dhls_hw) + NTR(dataSplit[3].gt) + NTR(dataSplit[3].none))
                mounth5 = (NTR(dataSplit[4].bbs) + NTR(dataSplit[4].sr) + NTR(dataSplit[4].vas) + NTR(dataSplit[4].bod) + NTR(dataSplit[4].cband) + NTR(dataSplit[4].domestic) + NTR(dataSplit[4].ip) + NTR(dataSplit[4].iru) + NTR(dataSplit[4].kuband) + NTR(dataSplit[4].mobile_vsat) + NTR(dataSplit[4].mpip) + NTR(dataSplit[4].o3b) + NTR(dataSplit[4].ps) + NTR(dataSplit[4].hw) + NTR(dataSplit[4].dhls_hw) + NTR(dataSplit[4].gt) + NTR(dataSplit[4].none))
                mounth6 = (NTR(dataSplit[5].bbs) + NTR(dataSplit[5].sr) + NTR(dataSplit[5].vas) + NTR(dataSplit[5].bod) + NTR(dataSplit[5].cband) + NTR(dataSplit[5].domestic) + NTR(dataSplit[5].ip) + NTR(dataSplit[5].iru) + NTR(dataSplit[5].kuband) + NTR(dataSplit[5].mobile_vsat) + NTR(dataSplit[5].mpip) + NTR(dataSplit[5].o3b) + NTR(dataSplit[5].ps) + NTR(dataSplit[5].hw) + NTR(dataSplit[5].dhls_hw) + NTR(dataSplit[5].gt) + NTR(dataSplit[5].none))
                mounth7 = (NTR(dataSplit[6].bbs) + NTR(dataSplit[6].sr) + NTR(dataSplit[6].vas) + NTR(dataSplit[6].bod) + NTR(dataSplit[6].cband) + NTR(dataSplit[6].domestic) + NTR(dataSplit[6].ip) + NTR(dataSplit[6].iru) + NTR(dataSplit[6].kuband) + NTR(dataSplit[6].mobile_vsat) + NTR(dataSplit[6].mpip) + NTR(dataSplit[6].o3b) + NTR(dataSplit[6].ps) + NTR(dataSplit[6].hw) + NTR(dataSplit[6].dhls_hw) + NTR(dataSplit[6].gt) + NTR(dataSplit[6].none))
                mounth8 = (NTR(dataSplit[7].bbs) + NTR(dataSplit[7].sr) + NTR(dataSplit[7].vas) + NTR(dataSplit[7].bod) + NTR(dataSplit[7].cband) + NTR(dataSplit[7].domestic) + NTR(dataSplit[7].ip) + NTR(dataSplit[7].iru) + NTR(dataSplit[7].kuband) + NTR(dataSplit[7].mobile_vsat) + NTR(dataSplit[7].mpip) + NTR(dataSplit[7].o3b) + NTR(dataSplit[7].ps) + NTR(dataSplit[7].hw) + NTR(dataSplit[7].dhls_hw) + NTR(dataSplit[7].gt) + NTR(dataSplit[7].none))
                mounth9 = (NTR(dataSplit[8].bbs) + NTR(dataSplit[8].sr) + NTR(dataSplit[8].vas) + NTR(dataSplit[8].bod) + NTR(dataSplit[8].cband) + NTR(dataSplit[8].domestic) + NTR(dataSplit[8].ip) + NTR(dataSplit[8].iru) + NTR(dataSplit[8].kuband) + NTR(dataSplit[8].mobile_vsat) + NTR(dataSplit[8].mpip) + NTR(dataSplit[8].o3b) + NTR(dataSplit[8].ps) + NTR(dataSplit[8].hw) + NTR(dataSplit[8].dhls_hw) + NTR(dataSplit[8].gt) + NTR(dataSplit[8].none))
                mounth10 = (NTR(dataSplit[9].bbs) + NTR(dataSplit[9].sr) + NTR(dataSplit[9].vas) + NTR(dataSplit[9].bod) + NTR(dataSplit[9].cband) + NTR(dataSplit[9].domestic) + NTR(dataSplit[9].ip) + NTR(dataSplit[9].iru) + NTR(dataSplit[9].kuband) + NTR(dataSplit[9].mobile_vsat) + NTR(dataSplit[9].mpip) + NTR(dataSplit[9].o3b) + NTR(dataSplit[9].ps) + NTR(dataSplit[9].hw) + NTR(dataSplit[9].dhls_hw) + NTR(dataSplit[9].gt) + NTR(dataSplit[9].none))
                mounth11 = (NTR(dataSplit[10].bbs) + NTR(dataSplit[10].sr) + NTR(dataSplit[10].vas) + NTR(dataSplit[10].bod) + NTR(dataSplit[10].cband) + NTR(dataSplit[10].domestic) + NTR(dataSplit[10].ip) + NTR(dataSplit[10].iru) + NTR(dataSplit[10].kuband) + NTR(dataSplit[10].mobile_vsat) + NTR(dataSplit[10].mpip) + NTR(dataSplit[10].o3b) + NTR(dataSplit[10].ps) + NTR(dataSplit[10].hw) + NTR(dataSplit[10].dhls_hw) + NTR(dataSplit[10].gt) + NTR(dataSplit[10].none))
                mounth12 = (NTR(dataSplit[11].bbs) + NTR(dataSplit[11].sr) + NTR(dataSplit[11].vas) + NTR(dataSplit[11].bod) + NTR(dataSplit[11].cband) + NTR(dataSplit[11].domestic) + NTR(dataSplit[11].ip) + NTR(dataSplit[11].iru) + NTR(dataSplit[11].kuband) + NTR(dataSplit[11].mobile_vsat) + NTR(dataSplit[11].mpip) + NTR(dataSplit[11].o3b) + NTR(dataSplit[11].ps) + NTR(dataSplit[11].hw) + NTR(dataSplit[11].dhls_hw) + NTR(dataSplit[11].gt) + NTR(dataSplit[11].none))
                nlapiLogExecution('debug', 'quoarterly1 ', 'quoarterly1')
                var quoarterly1 = mounth1 + mounth2 + mounth3;
                var quoarterly2 = mounth4 + mounth5 + mounth6;
                var quoarterly3 = mounth7 + mounth8 + mounth9;
                var quoarterly4 = mounth10 + mounth11 + mounth12;
                var totalquoarterly = quoarterly1 + quoarterly2 + quoarterly3 + quoarterly4


                Ftarget1 = (NTR(target_dataSplit[0].bbs) + NTR(target_dataSplit[0].sr) + NTR(target_dataSplit[0].vas) + NTR(target_dataSplit[0].bod) + NTR(target_dataSplit[0].cband) + NTR(target_dataSplit[0].domestic) + NTR(target_dataSplit[0].ip) + NTR(target_dataSplit[0].iru) + NTR(target_dataSplit[0].kuband) + NTR(target_dataSplit[0].mobile_vsat) + NTR(target_dataSplit[0].mpip) + NTR(target_dataSplit[0].o3b) + NTR(target_dataSplit[0].ps) + NTR(target_dataSplit[0].hw) + NTR(target_dataSplit[0].dhls_hw) + NTR(target_dataSplit[0].gt))
                Ftarget2 = (NTR(target_dataSplit[1].bbs) + NTR(target_dataSplit[1].sr) + NTR(target_dataSplit[1].vas) + NTR(target_dataSplit[1].bod) + NTR(target_dataSplit[1].cband) + NTR(target_dataSplit[1].domestic) + NTR(target_dataSplit[1].ip) + NTR(target_dataSplit[1].iru) + NTR(target_dataSplit[1].kuband) + NTR(target_dataSplit[1].mobile_vsat) + NTR(target_dataSplit[1].mpip) + NTR(target_dataSplit[1].o3b) + NTR(target_dataSplit[1].ps) + NTR(target_dataSplit[1].hw) + NTR(target_dataSplit[1].dhls_hw) + NTR(target_dataSplit[1].gt))
                Ftarget3 = (NTR(target_dataSplit[2].bbs) + NTR(target_dataSplit[2].sr) + NTR(target_dataSplit[2].vas) + NTR(target_dataSplit[2].bod) + NTR(target_dataSplit[2].cband) + NTR(target_dataSplit[2].domestic) + NTR(target_dataSplit[2].ip) + NTR(target_dataSplit[2].iru) + NTR(target_dataSplit[2].kuband) + NTR(target_dataSplit[2].mobile_vsat) + NTR(target_dataSplit[2].mpip) + NTR(target_dataSplit[2].o3b) + NTR(target_dataSplit[2].ps) + NTR(target_dataSplit[2].hw) + NTR(target_dataSplit[2].dhls_hw) + NTR(target_dataSplit[2].gt))
                Ftarget4 = (NTR(target_dataSplit[3].bbs) + NTR(target_dataSplit[3].sr) + NTR(target_dataSplit[3].vas) + NTR(target_dataSplit[3].bod) + NTR(target_dataSplit[3].cband) + NTR(target_dataSplit[3].domestic) + NTR(target_dataSplit[3].ip) + NTR(target_dataSplit[3].iru) + NTR(target_dataSplit[3].kuband) + NTR(target_dataSplit[3].mobile_vsat) + NTR(target_dataSplit[3].mpip) + NTR(target_dataSplit[3].o3b) + NTR(target_dataSplit[3].ps) + NTR(target_dataSplit[3].hw) + NTR(target_dataSplit[3].dhls_hw) + NTR(target_dataSplit[3].gt))
                Ftarget5 = (NTR(target_dataSplit[4].bbs) + NTR(target_dataSplit[4].sr) + NTR(target_dataSplit[4].vas) + NTR(target_dataSplit[4].bod) + NTR(target_dataSplit[4].cband) + NTR(target_dataSplit[4].domestic) + NTR(target_dataSplit[4].ip) + NTR(target_dataSplit[4].iru) + NTR(target_dataSplit[4].kuband) + NTR(target_dataSplit[4].mobile_vsat) + NTR(target_dataSplit[4].mpip) + NTR(target_dataSplit[4].o3b) + NTR(target_dataSplit[4].ps) + NTR(target_dataSplit[4].hw) + NTR(target_dataSplit[4].dhls_hw) + NTR(target_dataSplit[4].gt))
                Ftarget6 = (NTR(target_dataSplit[5].bbs) + NTR(target_dataSplit[5].sr) + NTR(target_dataSplit[5].vas) + NTR(target_dataSplit[5].bod) + NTR(target_dataSplit[5].cband) + NTR(target_dataSplit[5].domestic) + NTR(target_dataSplit[5].ip) + NTR(target_dataSplit[5].iru) + NTR(target_dataSplit[5].kuband) + NTR(target_dataSplit[5].mobile_vsat) + NTR(target_dataSplit[5].mpip) + NTR(target_dataSplit[5].o3b) + NTR(target_dataSplit[5].ps) + NTR(target_dataSplit[5].hw) + NTR(target_dataSplit[5].dhls_hw) + NTR(target_dataSplit[5].gt))
                Ftarget7 = (NTR(target_dataSplit[6].bbs) + NTR(target_dataSplit[6].sr) + NTR(target_dataSplit[6].vas) + NTR(target_dataSplit[6].bod) + NTR(target_dataSplit[6].cband) + NTR(target_dataSplit[6].domestic) + NTR(target_dataSplit[6].ip) + NTR(target_dataSplit[6].iru) + NTR(target_dataSplit[6].kuband) + NTR(target_dataSplit[6].mobile_vsat) + NTR(target_dataSplit[6].mpip) + NTR(target_dataSplit[6].o3b) + NTR(target_dataSplit[6].ps) + NTR(target_dataSplit[6].hw) + NTR(target_dataSplit[6].dhls_hw) + NTR(target_dataSplit[6].gt))
                Ftarget8 = (NTR(target_dataSplit[7].bbs) + NTR(target_dataSplit[7].sr) + NTR(target_dataSplit[7].vas) + NTR(target_dataSplit[7].bod) + NTR(target_dataSplit[7].cband) + NTR(target_dataSplit[7].domestic) + NTR(target_dataSplit[7].ip) + NTR(target_dataSplit[7].iru) + NTR(target_dataSplit[7].kuband) + NTR(target_dataSplit[7].mobile_vsat) + NTR(target_dataSplit[7].mpip) + NTR(target_dataSplit[7].o3b) + NTR(target_dataSplit[7].ps) + NTR(target_dataSplit[7].hw) + NTR(target_dataSplit[7].dhls_hw) + NTR(target_dataSplit[7].gt))
                Ftarget9 = (NTR(target_dataSplit[8].bbs) + NTR(target_dataSplit[8].sr) + NTR(target_dataSplit[8].vas) + NTR(target_dataSplit[8].bod) + NTR(target_dataSplit[8].cband) + NTR(target_dataSplit[8].domestic) + NTR(target_dataSplit[8].ip) + NTR(target_dataSplit[8].iru) + NTR(target_dataSplit[8].kuband) + NTR(target_dataSplit[8].mobile_vsat) + NTR(target_dataSplit[8].mpip) + NTR(target_dataSplit[8].o3b) + NTR(target_dataSplit[8].ps) + NTR(target_dataSplit[8].hw) + NTR(target_dataSplit[8].dhls_hw) + NTR(target_dataSplit[8].gt))
                Ftarget10 = (NTR(target_dataSplit[9].bbs) + NTR(target_dataSplit[9].sr) + NTR(target_dataSplit[9].vas) + NTR(target_dataSplit[9].bod) + NTR(target_dataSplit[9].cband) + NTR(target_dataSplit[9].domestic) + NTR(target_dataSplit[9].ip) + NTR(target_dataSplit[9].iru) + NTR(target_dataSplit[9].kuband) + NTR(target_dataSplit[9].mobile_vsat) + NTR(target_dataSplit[9].mpip) + NTR(target_dataSplit[9].o3b) + NTR(target_dataSplit[9].ps) + NTR(target_dataSplit[9].hw) + NTR(target_dataSplit[9].dhls_hw) + NTR(target_dataSplit[9].gt))
                Ftarget11 = (NTR(target_dataSplit[10].bbs) + NTR(target_dataSplit[10].sr) + NTR(target_dataSplit[10].vas) + NTR(target_dataSplit[10].bod) + NTR(target_dataSplit[10].cband) + NTR(target_dataSplit[10].domestic) + NTR(target_dataSplit[10].ip) + NTR(target_dataSplit[10].iru) + NTR(target_dataSplit[10].kuband) + NTR(target_dataSplit[10].mobile_vsat) + NTR(target_dataSplit[10].mpip) + NTR(target_dataSplit[10].o3b) + NTR(target_dataSplit[10].ps) + NTR(target_dataSplit[10].hw) + NTR(target_dataSplit[10].dhls_hw) + NTR(target_dataSplit[10].gt))
                Ftarget12 = (NTR(target_dataSplit[11].bbs) + NTR(target_dataSplit[11].sr) + NTR(target_dataSplit[11].vas) + NTR(target_dataSplit[11].bod) + NTR(target_dataSplit[11].cband) + NTR(target_dataSplit[11].domestic) + NTR(target_dataSplit[11].ip) + NTR(target_dataSplit[11].iru) + NTR(target_dataSplit[11].kuband) + NTR(target_dataSplit[11].mobile_vsat) + NTR(target_dataSplit[11].mpip) + NTR(target_dataSplit[11].o3b) + NTR(target_dataSplit[11].ps) + NTR(target_dataSplit[11].hw) + NTR(target_dataSplit[11].dhls_hw) + NTR(target_dataSplit[11].gt))

                var Qtarget1 = Ftarget1 + Ftarget2 + Ftarget3
                var Qtarget2 = Ftarget4 + Ftarget5 + Ftarget6
                var Qtarget3 = Ftarget7 + Ftarget8 + Ftarget9
                var Qtarget4 = Ftarget10 + Ftarget11 + Ftarget12
                var totaltarget = Qtarget1 + Qtarget2 + Qtarget3 + Qtarget4;

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
                    quoarterly1: formatNumber(quoarterly1),
                    quoarterly2: formatNumber(quoarterly2),
                    quoarterly3: formatNumber(quoarterly3),
                    quoarterly4: formatNumber(quoarterly4),
                    totalquoarterly: formatNumber(totalquoarterly),
                    target1: formatNumber(Qtarget1),
                    target2: formatNumber(Qtarget2),
                    target3: formatNumber(Qtarget3),
                    target4: formatNumber(Qtarget4),
                    totaltarget: formatNumber(totaltarget),
                    gap1: formatNumber(quoarterly1 - Qtarget1),
                    gap2: formatNumber(quoarterly2 - Qtarget2),
                    gap3: formatNumber(quoarterly3 - Qtarget3),
                    gap4: formatNumber(quoarterly4 - Qtarget4),
                    totalgap: formatNumber(totalquoarterly - totaltarget),
                    perc1: formatNumber(getPrecenge(quoarterly1, Qtarget1)) + '%',
                    perc2: formatNumber(getPrecenge(quoarterly2, Qtarget2)) + '%',
                    perc3: formatNumber(getPrecenge(quoarterly3, Qtarget3)) + '%',
                    perc4: formatNumber(getPrecenge(quoarterly4, Qtarget4)) + '%',
                    totalperc: formatNumber(getPrecenge(totalquoarterly, totaltarget)) + '%',
                    //
                });
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
                //
                var data = allSelection[i].getValue("custrecord_sr_amounts")
                var dataSplit = splitDataAmountPf(data)
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var target_dataSplit = splitTargetAmountPf(data)
                var target_dataSplitSecond = splitTargetAmountSecondPf(data)
                var totalmount = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5] + dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                //var totaltarget = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
                var totaltarget = target_dataSplitSecond[0] + target_dataSplitSecond[1] + target_dataSplitSecond[2] + target_dataSplitSecond[3] + target_dataSplitSecond[4] + target_dataSplitSecond[5] + target_dataSplitSecond[6] + target_dataSplitSecond[7] + target_dataSplitSecond[8] + target_dataSplitSecond[9] + target_dataSplitSecond[10] + target_dataSplitSecond[11];
                nlapiLogExecution('debug', 'mounth1 ', 'mounth1')
                mounth1 = NTR(dataSplit[0].bbs) + NTR(dataSplit[0].sr) + NTR(dataSplit[0].vas) + NTR(dataSplit[0].bod) + NTR(dataSplit[0].cband) + NTR(dataSplit[0].domestic) + NTR(dataSplit[0].ip) + NTR(dataSplit[0].iru) + NTR(dataSplit[0].kuband) + NTR(dataSplit[0].mobile_vsat) + NTR(dataSplit[0].mpip) + NTR(dataSplit[0].o3b) + NTR(dataSplit[0].ps) + NTR(dataSplit[0].hw) + NTR(dataSplit[0].dhls_hw) + NTR(dataSplit[0].gt) + NTR(dataSplit[0].none)
                mounth2 = (NTR(dataSplit[1].bbs) + NTR(dataSplit[1].sr) + NTR(dataSplit[1].vas) + NTR(dataSplit[1].bod) + NTR(dataSplit[1].cband) + NTR(dataSplit[1].domestic) + NTR(dataSplit[1].ip) + NTR(dataSplit[1].iru) + NTR(dataSplit[1].kuband) + NTR(dataSplit[1].mobile_vsat) + NTR(dataSplit[1].mpip) + NTR(dataSplit[1].o3b) + NTR(dataSplit[1].ps) + NTR(dataSplit[1].hw) + NTR(dataSplit[1].dhls_hw) + NTR(dataSplit[1].gt) + NTR(dataSplit[1].none))
                mounth3 = (NTR(dataSplit[2].bbs) + NTR(dataSplit[2].sr) + NTR(dataSplit[2].vas) + NTR(dataSplit[2].bod) + NTR(dataSplit[2].cband) + NTR(dataSplit[2].domestic) + NTR(dataSplit[2].ip) + NTR(dataSplit[2].iru) + NTR(dataSplit[2].kuband) + NTR(dataSplit[2].mobile_vsat) + NTR(dataSplit[2].mpip) + NTR(dataSplit[2].o3b) + NTR(dataSplit[2].ps) + NTR(dataSplit[2].hw) + NTR(dataSplit[2].dhls_hw) + NTR(dataSplit[2].gt) + NTR(dataSplit[2].none))
                mounth4 = (NTR(dataSplit[3].bbs) + NTR(dataSplit[3].sr) + NTR(dataSplit[3].vas) + NTR(dataSplit[3].bod) + NTR(dataSplit[3].cband) + NTR(dataSplit[3].domestic) + NTR(dataSplit[3].ip) + NTR(dataSplit[3].iru) + NTR(dataSplit[3].kuband) + NTR(dataSplit[3].mobile_vsat) + NTR(dataSplit[3].mpip) + NTR(dataSplit[3].o3b) + NTR(dataSplit[3].ps) + NTR(dataSplit[3].hw) + NTR(dataSplit[3].dhls_hw) + NTR(dataSplit[3].gt) + NTR(dataSplit[3].none))
                mounth5 = (NTR(dataSplit[4].bbs) + NTR(dataSplit[4].sr) + NTR(dataSplit[4].vas) + NTR(dataSplit[4].bod) + NTR(dataSplit[4].cband) + NTR(dataSplit[4].domestic) + NTR(dataSplit[4].ip) + NTR(dataSplit[4].iru) + NTR(dataSplit[4].kuband) + NTR(dataSplit[4].mobile_vsat) + NTR(dataSplit[4].mpip) + NTR(dataSplit[4].o3b) + NTR(dataSplit[4].ps) + NTR(dataSplit[4].hw) + NTR(dataSplit[4].dhls_hw) + NTR(dataSplit[4].gt) + NTR(dataSplit[4].none))
                mounth6 = (NTR(dataSplit[5].bbs) + NTR(dataSplit[5].sr) + NTR(dataSplit[5].vas) + NTR(dataSplit[5].bod) + NTR(dataSplit[5].cband) + NTR(dataSplit[5].domestic) + NTR(dataSplit[5].ip) + NTR(dataSplit[5].iru) + NTR(dataSplit[5].kuband) + NTR(dataSplit[5].mobile_vsat) + NTR(dataSplit[5].mpip) + NTR(dataSplit[5].o3b) + NTR(dataSplit[5].ps) + NTR(dataSplit[5].hw) + NTR(dataSplit[5].dhls_hw) + NTR(dataSplit[5].gt) + NTR(dataSplit[5].none))
                mounth7 = (NTR(dataSplit[6].bbs) + NTR(dataSplit[6].sr) + NTR(dataSplit[6].vas) + NTR(dataSplit[6].bod) + NTR(dataSplit[6].cband) + NTR(dataSplit[6].domestic) + NTR(dataSplit[6].ip) + NTR(dataSplit[6].iru) + NTR(dataSplit[6].kuband) + NTR(dataSplit[6].mobile_vsat) + NTR(dataSplit[6].mpip) + NTR(dataSplit[6].o3b) + NTR(dataSplit[6].ps) + NTR(dataSplit[6].hw) + NTR(dataSplit[6].dhls_hw) + NTR(dataSplit[6].gt) + NTR(dataSplit[6].none))
                mounth8 = (NTR(dataSplit[7].bbs) + NTR(dataSplit[7].sr) + NTR(dataSplit[7].vas) + NTR(dataSplit[7].bod) + NTR(dataSplit[7].cband) + NTR(dataSplit[7].domestic) + NTR(dataSplit[7].ip) + NTR(dataSplit[7].iru) + NTR(dataSplit[7].kuband) + NTR(dataSplit[7].mobile_vsat) + NTR(dataSplit[7].mpip) + NTR(dataSplit[7].o3b) + NTR(dataSplit[7].ps) + NTR(dataSplit[7].hw) + NTR(dataSplit[7].dhls_hw) + NTR(dataSplit[7].gt) + NTR(dataSplit[7].none))
                mounth9 = (NTR(dataSplit[8].bbs) + NTR(dataSplit[8].sr) + NTR(dataSplit[8].vas) + NTR(dataSplit[8].bod) + NTR(dataSplit[8].cband) + NTR(dataSplit[8].domestic) + NTR(dataSplit[8].ip) + NTR(dataSplit[8].iru) + NTR(dataSplit[8].kuband) + NTR(dataSplit[8].mobile_vsat) + NTR(dataSplit[8].mpip) + NTR(dataSplit[8].o3b) + NTR(dataSplit[8].ps) + NTR(dataSplit[8].hw) + NTR(dataSplit[8].dhls_hw) + NTR(dataSplit[8].gt) + NTR(dataSplit[8].none))
                mounth10 = (NTR(dataSplit[9].bbs) + NTR(dataSplit[9].sr) + NTR(dataSplit[9].vas) + NTR(dataSplit[9].bod) + NTR(dataSplit[9].cband) + NTR(dataSplit[9].domestic) + NTR(dataSplit[9].ip) + NTR(dataSplit[9].iru) + NTR(dataSplit[9].kuband) + NTR(dataSplit[9].mobile_vsat) + NTR(dataSplit[9].mpip) + NTR(dataSplit[9].o3b) + NTR(dataSplit[9].ps) + NTR(dataSplit[9].hw) + NTR(dataSplit[9].dhls_hw) + NTR(dataSplit[9].gt) + NTR(dataSplit[9].none))
                mounth11 = (NTR(dataSplit[10].bbs) + NTR(dataSplit[10].sr) + NTR(dataSplit[10].vas) + NTR(dataSplit[10].bod) + NTR(dataSplit[10].cband) + NTR(dataSplit[10].domestic) + NTR(dataSplit[10].ip) + NTR(dataSplit[10].iru) + NTR(dataSplit[10].kuband) + NTR(dataSplit[10].mobile_vsat) + NTR(dataSplit[10].mpip) + NTR(dataSplit[10].o3b) + NTR(dataSplit[10].ps) + NTR(dataSplit[10].hw) + NTR(dataSplit[10].dhls_hw) + NTR(dataSplit[10].gt) + NTR(dataSplit[10].none))
                mounth12 = (NTR(dataSplit[11].bbs) + NTR(dataSplit[11].sr) + NTR(dataSplit[11].vas) + NTR(dataSplit[11].bod) + NTR(dataSplit[11].cband) + NTR(dataSplit[11].domestic) + NTR(dataSplit[11].ip) + NTR(dataSplit[11].iru) + NTR(dataSplit[11].kuband) + NTR(dataSplit[11].mobile_vsat) + NTR(dataSplit[11].mpip) + NTR(dataSplit[11].o3b) + NTR(dataSplit[11].ps) + NTR(dataSplit[11].hw) + NTR(dataSplit[11].dhls_hw) + NTR(dataSplit[11].gt) + NTR(dataSplit[11].none))
                nlapiLogExecution('debug', 'quoarterly1 ', 'quoarterly1')
                var quoarterly1 = mounth1 + mounth2 + mounth3;
                var quoarterly2 = mounth4 + mounth5 + mounth6;
                var quoarterly3 = mounth7 + mounth8 + mounth9;
                var quoarterly4 = mounth10 + mounth11 + mounth12;
                halfYearly1 = quoarterly1 + quoarterly2
                halfYearly2 = quoarterly3 + quoarterly4
                totalhalfYearly = halfYearly1 + halfYearly2

                Ftarget1 = (NTR(target_dataSplit[0].bbs) + NTR(target_dataSplit[0].sr) + NTR(target_dataSplit[0].vas) + NTR(target_dataSplit[0].bod) + NTR(target_dataSplit[0].cband) + NTR(target_dataSplit[0].domestic) + NTR(target_dataSplit[0].ip) + NTR(target_dataSplit[0].iru) + NTR(target_dataSplit[0].kuband) + NTR(target_dataSplit[0].mobile_vsat) + NTR(target_dataSplit[0].mpip) + NTR(target_dataSplit[0].o3b) + NTR(target_dataSplit[0].ps) + NTR(target_dataSplit[0].hw) + NTR(target_dataSplit[0].dhls_hw) + NTR(target_dataSplit[0].gt))
                Ftarget2 = (NTR(target_dataSplit[1].bbs) + NTR(target_dataSplit[1].sr) + NTR(target_dataSplit[1].vas) + NTR(target_dataSplit[1].bod) + NTR(target_dataSplit[1].cband) + NTR(target_dataSplit[1].domestic) + NTR(target_dataSplit[1].ip) + NTR(target_dataSplit[1].iru) + NTR(target_dataSplit[1].kuband) + NTR(target_dataSplit[1].mobile_vsat) + NTR(target_dataSplit[1].mpip) + NTR(target_dataSplit[1].o3b) + NTR(target_dataSplit[1].ps) + NTR(target_dataSplit[1].hw) + NTR(target_dataSplit[1].dhls_hw) + NTR(target_dataSplit[1].gt))
                Ftarget3 = (NTR(target_dataSplit[2].bbs) + NTR(target_dataSplit[2].sr) + NTR(target_dataSplit[2].vas) + NTR(target_dataSplit[2].bod) + NTR(target_dataSplit[2].cband) + NTR(target_dataSplit[2].domestic) + NTR(target_dataSplit[2].ip) + NTR(target_dataSplit[2].iru) + NTR(target_dataSplit[2].kuband) + NTR(target_dataSplit[2].mobile_vsat) + NTR(target_dataSplit[2].mpip) + NTR(target_dataSplit[2].o3b) + NTR(target_dataSplit[2].ps) + NTR(target_dataSplit[2].hw) + NTR(target_dataSplit[2].dhls_hw) + NTR(target_dataSplit[2].gt))
                Ftarget4 = (NTR(target_dataSplit[3].bbs) + NTR(target_dataSplit[3].sr) + NTR(target_dataSplit[3].vas) + NTR(target_dataSplit[3].bod) + NTR(target_dataSplit[3].cband) + NTR(target_dataSplit[3].domestic) + NTR(target_dataSplit[3].ip) + NTR(target_dataSplit[3].iru) + NTR(target_dataSplit[3].kuband) + NTR(target_dataSplit[3].mobile_vsat) + NTR(target_dataSplit[3].mpip) + NTR(target_dataSplit[3].o3b) + NTR(target_dataSplit[3].ps) + NTR(target_dataSplit[3].hw) + NTR(target_dataSplit[3].dhls_hw) + NTR(target_dataSplit[3].gt))
                Ftarget5 = (NTR(target_dataSplit[4].bbs) + NTR(target_dataSplit[4].sr) + NTR(target_dataSplit[4].vas) + NTR(target_dataSplit[4].bod) + NTR(target_dataSplit[4].cband) + NTR(target_dataSplit[4].domestic) + NTR(target_dataSplit[4].ip) + NTR(target_dataSplit[4].iru) + NTR(target_dataSplit[4].kuband) + NTR(target_dataSplit[4].mobile_vsat) + NTR(target_dataSplit[4].mpip) + NTR(target_dataSplit[4].o3b) + NTR(target_dataSplit[4].ps) + NTR(target_dataSplit[4].hw) + NTR(target_dataSplit[4].dhls_hw) + NTR(target_dataSplit[4].gt))
                Ftarget6 = (NTR(target_dataSplit[5].bbs) + NTR(target_dataSplit[5].sr) + NTR(target_dataSplit[5].vas) + NTR(target_dataSplit[5].bod) + NTR(target_dataSplit[5].cband) + NTR(target_dataSplit[5].domestic) + NTR(target_dataSplit[5].ip) + NTR(target_dataSplit[5].iru) + NTR(target_dataSplit[5].kuband) + NTR(target_dataSplit[5].mobile_vsat) + NTR(target_dataSplit[5].mpip) + NTR(target_dataSplit[5].o3b) + NTR(target_dataSplit[5].ps) + NTR(target_dataSplit[5].hw) + NTR(target_dataSplit[5].dhls_hw) + NTR(target_dataSplit[5].gt))
                Ftarget7 = (NTR(target_dataSplit[6].bbs) + NTR(target_dataSplit[6].sr) + NTR(target_dataSplit[6].vas) + NTR(target_dataSplit[6].bod) + NTR(target_dataSplit[6].cband) + NTR(target_dataSplit[6].domestic) + NTR(target_dataSplit[6].ip) + NTR(target_dataSplit[6].iru) + NTR(target_dataSplit[6].kuband) + NTR(target_dataSplit[6].mobile_vsat) + NTR(target_dataSplit[6].mpip) + NTR(target_dataSplit[6].o3b) + NTR(target_dataSplit[6].ps) + NTR(target_dataSplit[6].hw) + NTR(target_dataSplit[6].dhls_hw) + NTR(target_dataSplit[6].gt))
                Ftarget8 = (NTR(target_dataSplit[7].bbs) + NTR(target_dataSplit[7].sr) + NTR(target_dataSplit[7].vas) + NTR(target_dataSplit[7].bod) + NTR(target_dataSplit[7].cband) + NTR(target_dataSplit[7].domestic) + NTR(target_dataSplit[7].ip) + NTR(target_dataSplit[7].iru) + NTR(target_dataSplit[7].kuband) + NTR(target_dataSplit[7].mobile_vsat) + NTR(target_dataSplit[7].mpip) + NTR(target_dataSplit[7].o3b) + NTR(target_dataSplit[7].ps) + NTR(target_dataSplit[7].hw) + NTR(target_dataSplit[7].dhls_hw) + NTR(target_dataSplit[7].gt))
                Ftarget9 = (NTR(target_dataSplit[8].bbs) + NTR(target_dataSplit[8].sr) + NTR(target_dataSplit[8].vas) + NTR(target_dataSplit[8].bod) + NTR(target_dataSplit[8].cband) + NTR(target_dataSplit[8].domestic) + NTR(target_dataSplit[8].ip) + NTR(target_dataSplit[8].iru) + NTR(target_dataSplit[8].kuband) + NTR(target_dataSplit[8].mobile_vsat) + NTR(target_dataSplit[8].mpip) + NTR(target_dataSplit[8].o3b) + NTR(target_dataSplit[8].ps) + NTR(target_dataSplit[8].hw) + NTR(target_dataSplit[8].dhls_hw) + NTR(target_dataSplit[8].gt))
                Ftarget10 = (NTR(target_dataSplit[9].bbs) + NTR(target_dataSplit[9].sr) + NTR(target_dataSplit[9].vas) + NTR(target_dataSplit[9].bod) + NTR(target_dataSplit[9].cband) + NTR(target_dataSplit[9].domestic) + NTR(target_dataSplit[9].ip) + NTR(target_dataSplit[9].iru) + NTR(target_dataSplit[9].kuband) + NTR(target_dataSplit[9].mobile_vsat) + NTR(target_dataSplit[9].mpip) + NTR(target_dataSplit[9].o3b) + NTR(target_dataSplit[9].ps) + NTR(target_dataSplit[9].hw) + NTR(target_dataSplit[9].dhls_hw) + NTR(target_dataSplit[9].gt))
                Ftarget11 = (NTR(target_dataSplit[10].bbs) + NTR(target_dataSplit[10].sr) + NTR(target_dataSplit[10].vas) + NTR(target_dataSplit[10].bod) + NTR(target_dataSplit[10].cband) + NTR(target_dataSplit[10].domestic) + NTR(target_dataSplit[10].ip) + NTR(target_dataSplit[10].iru) + NTR(target_dataSplit[10].kuband) + NTR(target_dataSplit[10].mobile_vsat) + NTR(target_dataSplit[10].mpip) + NTR(target_dataSplit[10].o3b) + NTR(target_dataSplit[10].ps) + NTR(target_dataSplit[10].hw) + NTR(target_dataSplit[10].dhls_hw) + NTR(target_dataSplit[10].gt))
                Ftarget12 = (NTR(target_dataSplit[11].bbs) + NTR(target_dataSplit[11].sr) + NTR(target_dataSplit[11].vas) + NTR(target_dataSplit[11].bod) + NTR(target_dataSplit[11].cband) + NTR(target_dataSplit[11].domestic) + NTR(target_dataSplit[11].ip) + NTR(target_dataSplit[11].iru) + NTR(target_dataSplit[11].kuband) + NTR(target_dataSplit[11].mobile_vsat) + NTR(target_dataSplit[11].mpip) + NTR(target_dataSplit[11].o3b) + NTR(target_dataSplit[11].ps) + NTR(target_dataSplit[11].hw) + NTR(target_dataSplit[11].dhls_hw) + NTR(target_dataSplit[11].gt))

                var Qtarget1 = Ftarget1 + Ftarget2 + Ftarget3
                var Qtarget2 = Ftarget4 + Ftarget5 + Ftarget6
                var Qtarget3 = Ftarget7 + Ftarget8 + Ftarget9
                var Qtarget4 = Ftarget10 + Ftarget11 + Ftarget12
                Ytarget1 = Qtarget1 + Qtarget2
                Ytarget2 = Qtarget3 + Qtarget4
                var totaltarget = Qtarget1 + Qtarget2 + Qtarget3 + Qtarget4;

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
                    halfYearly1: formatNumber(halfYearly1),
                    halfYearly2: formatNumber(halfYearly2),
                    totalhalfYearly: formatNumber(totalhalfYearly),
                    target1: formatNumber(Ytarget1),
                    target2: formatNumber(Ytarget2),
                    totaltarget: formatNumber(totaltarget),
                    gap1: formatNumber(halfYearly1 - target1),
                    gap2: formatNumber(halfYearly2 - target2),
                    totalgap: formatNumber(totalhalfYearly - totaltarget),
                    perc1: formatNumber(getPrecenge(halfYearly1, Ytarget1)) + '%',
                    perc2: formatNumber(getPrecenge(halfYearly2, Ytarget2)) + '%',
                    totalperc: formatNumber(getPrecenge(totalhalfYearly, totaltarget)) + '%',
                    //
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearly func', e)
    }
    return Results;
}
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

                var data = allSelection[i].getValue("custrecord_sr_amounts")
                if (!isNullOrEmpty(data)) {
                    var dataSplit = splitDataAmountSecondPf(data)
                    var dataSplitSecond = splitDataAmountSecondPf(data)
                    var target_dataSplitSecond = splitTargetAmountSecondPf(data)

                    var totalbbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs + dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                    var totaltargetbbs = target_dataSplitSecond[0].bbs + target_dataSplitSecond[1].bbs + target_dataSplitSecond[2].bbs + target_dataSplitSecond[3].bbs + target_dataSplitSecond[4].bbs + target_dataSplitSecond[5].bbs + target_dataSplitSecond[6].bbs + target_dataSplitSecond[7].bbs + target_dataSplitSecond[8].bbs + target_dataSplitSecond[9].bbs + target_dataSplitSecond[10].bbs + target_dataSplitSecond[11].bbs;
                    var totalvas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas + dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                    var totaltargetvas = target_dataSplitSecond[0].vas + target_dataSplitSecond[1].vas + target_dataSplitSecond[2].vas + target_dataSplitSecond[3].vas + target_dataSplitSecond[4].vas + target_dataSplitSecond[5].vas + target_dataSplitSecond[6].vas + target_dataSplitSecond[7].vas + target_dataSplitSecond[8].vas + target_dataSplitSecond[9].vas + target_dataSplitSecond[10].vas + target_dataSplitSecond[11].vas;
                    var totalbod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod + dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                    var totaltargetbod = target_dataSplitSecond[0].bod + target_dataSplitSecond[1].bod + target_dataSplitSecond[2].bod + target_dataSplitSecond[3].bod + target_dataSplitSecond[4].bod + target_dataSplitSecond[5].bod + target_dataSplitSecond[6].bod + target_dataSplitSecond[7].bod + target_dataSplitSecond[8].bod + target_dataSplitSecond[9].bod + target_dataSplitSecond[10].bod + target_dataSplitSecond[11].bod;
                    var totalcband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband + dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                    var totaltargetcband = target_dataSplitSecond[0].cband + target_dataSplitSecond[1].cband + target_dataSplitSecond[2].cband + target_dataSplitSecond[3].cband + target_dataSplitSecond[4].cband + target_dataSplitSecond[5].cband + target_dataSplitSecond[6].cband + target_dataSplitSecond[7].cband + target_dataSplitSecond[8].cband + target_dataSplitSecond[9].cband + target_dataSplitSecond[10].cband + target_dataSplitSecond[11].cband;
                    var totaldomestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic + dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                    var totaltargetdomestic = target_dataSplitSecond[0].domestic + target_dataSplitSecond[1].domestic + target_dataSplitSecond[2].domestic + target_dataSplitSecond[3].domestic + target_dataSplitSecond[4].domestic + target_dataSplitSecond[5].domestic + target_dataSplitSecond[6].domestic + target_dataSplitSecond[7].domestic + target_dataSplitSecond[8].domestic + target_dataSplitSecond[9].domestic + target_dataSplitSecond[10].domestic + target_dataSplitSecond[11].domestic;
                    var totalip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip + dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                    var totaltargetip = target_dataSplitSecond[0].ip + target_dataSplitSecond[1].ip + target_dataSplitSecond[2].ip + target_dataSplitSecond[3].ip + target_dataSplitSecond[4].ip + target_dataSplitSecond[5].ip + target_dataSplitSecond[6].ip + target_dataSplitSecond[7].ip + target_dataSplitSecond[8].ip + target_dataSplitSecond[9].ip + target_dataSplitSecond[10].ip + target_dataSplitSecond[11].ip;
                    var totaliru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru + dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                    var totaltargetiru = target_dataSplitSecond[0].iru + target_dataSplitSecond[1].iru + target_dataSplitSecond[2].iru + target_dataSplitSecond[3].iru + target_dataSplitSecond[4].iru + target_dataSplitSecond[5].iru + target_dataSplitSecond[6].iru + target_dataSplitSecond[7].iru + target_dataSplitSecond[8].iru + target_dataSplitSecond[9].iru + target_dataSplitSecond[10].iru + target_dataSplitSecond[11].iru;
                    var totalkuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband + dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                    var totaltargetkuband = target_dataSplitSecond[0].kuband + target_dataSplitSecond[1].kuband + target_dataSplitSecond[2].kuband + target_dataSplitSecond[3].kuband + target_dataSplitSecond[4].kuband + target_dataSplitSecond[5].kuband + target_dataSplitSecond[6].kuband + target_dataSplitSecond[7].kuband + target_dataSplitSecond[8].kuband + target_dataSplitSecond[9].kuband + target_dataSplitSecond[10].kuband + target_dataSplitSecond[11].kuband;
                    var totalmobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat + dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                    var totaltargetmobile_vsat = target_dataSplitSecond[0].mobile_vsat + target_dataSplitSecond[1].mobile_vsat + target_dataSplitSecond[2].mobile_vsat + target_dataSplitSecond[3].mobile_vsat + target_dataSplitSecond[4].mobile_vsat + target_dataSplitSecond[5].mobile_vsat + target_dataSplitSecond[6].mobile_vsat + target_dataSplitSecond[7].mobile_vsat + target_dataSplitSecond[8].mobile_vsat + target_dataSplitSecond[9].mobile_vsat + target_dataSplitSecond[10].mobile_vsat + target_dataSplitSecond[11].mobile_vsat;
                    var totalmpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip + dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                    var totaltargetmpip = target_dataSplitSecond[0].mpip + target_dataSplitSecond[1].mpip + target_dataSplitSecond[2].mpip + target_dataSplitSecond[3].mpip + target_dataSplitSecond[4].mpip + target_dataSplitSecond[5].mpip + target_dataSplitSecond[6].mpip + target_dataSplitSecond[7].mpip + target_dataSplitSecond[8].mpip + target_dataSplitSecond[9].mpip + target_dataSplitSecond[10].mpip + target_dataSplitSecond[11].mpip;
                    var totalo3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b + dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                    var totaltargeto3b = target_dataSplitSecond[0].o3b + target_dataSplitSecond[1].o3b + target_dataSplitSecond[2].o3b + target_dataSplitSecond[3].o3b + target_dataSplitSecond[4].o3b + target_dataSplitSecond[5].o3b + target_dataSplitSecond[6].o3b + target_dataSplitSecond[7].o3b + target_dataSplitSecond[8].o3b + target_dataSplitSecond[9].o3b + target_dataSplitSecond[10].o3b + target_dataSplitSecond[11].o3b;
                    var totalps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps + dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                    var totaltargetps = target_dataSplitSecond[0].ps + target_dataSplitSecond[1].ps + target_dataSplitSecond[2].ps + target_dataSplitSecond[3].ps + target_dataSplitSecond[4].ps + target_dataSplitSecond[5].ps + target_dataSplitSecond[6].ps + target_dataSplitSecond[7].ps + target_dataSplitSecond[8].ps + target_dataSplitSecond[9].ps + target_dataSplitSecond[10].ps + target_dataSplitSecond[11].ps;
                    var totalsr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr + dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                    var totaltargetsr = target_dataSplitSecond[0].sr + target_dataSplitSecond[1].sr + target_dataSplitSecond[2].sr + target_dataSplitSecond[3].sr + target_dataSplitSecond[4].sr + target_dataSplitSecond[5].sr + target_dataSplitSecond[6].sr + target_dataSplitSecond[7].sr + target_dataSplitSecond[8].sr + target_dataSplitSecond[9].sr + target_dataSplitSecond[10].sr + target_dataSplitSecond[11].sr;
                    var totalhw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw + dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                    var totaltargethw = target_dataSplitSecond[0].hw + target_dataSplitSecond[1].hw + target_dataSplitSecond[2].hw + target_dataSplitSecond[3].hw + target_dataSplitSecond[4].hw + target_dataSplitSecond[5].hw + target_dataSplitSecond[6].hw + target_dataSplitSecond[7].hw + target_dataSplitSecond[8].hw + target_dataSplitSecond[9].hw + target_dataSplitSecond[10].hw + target_dataSplitSecond[11].hw;
                    var totaldhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw + dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                    var totaltargetdhls_hw = target_dataSplitSecond[0].dhls_hw + target_dataSplitSecond[1].dhls_hw + target_dataSplitSecond[2].dhls_hw + target_dataSplitSecond[3].dhls_hw + target_dataSplitSecond[4].dhls_hw + target_dataSplitSecond[5].dhls_hw + target_dataSplitSecond[6].dhls_hw + target_dataSplitSecond[7].dhls_hw + target_dataSplitSecond[8].dhls_hw + target_dataSplitSecond[9].dhls_hw + target_dataSplitSecond[10].dhls_hw + target_dataSplitSecond[11].dhls_hw;
                    var totalgt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt + dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                    var totaltargetgt = target_dataSplitSecond[0].gt + target_dataSplitSecond[1].gt + target_dataSplitSecond[2].gt + target_dataSplitSecond[3].gt + target_dataSplitSecond[4].gt + target_dataSplitSecond[5].gt + target_dataSplitSecond[6].gt + target_dataSplitSecond[7].gt + target_dataSplitSecond[8].gt + target_dataSplitSecond[9].gt + target_dataSplitSecond[10].gt + target_dataSplitSecond[11].gt;
                    var totalgeneral = dataSplitSecond[0].general + dataSplitSecond[1].general + dataSplitSecond[2].general + dataSplitSecond[3].general + dataSplitSecond[4].general + dataSplitSecond[5].general + dataSplitSecond[6].general + dataSplitSecond[7].general + dataSplitSecond[8].general + dataSplitSecond[9].general + dataSplitSecond[10].general + dataSplitSecond[11].general;
                    var totaltargetgeneral = target_dataSplitSecond[0].general + target_dataSplitSecond[1].general + target_dataSplitSecond[2].general + target_dataSplitSecond[3].general + target_dataSplitSecond[4].general + target_dataSplitSecond[5].general + target_dataSplitSecond[6].general + target_dataSplitSecond[7].general + target_dataSplitSecond[8].general + target_dataSplitSecond[9].general + target_dataSplitSecond[10].general + target_dataSplitSecond[11].general;


                    Results.push({
                        id: allSelection[i].id,
                        sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                        sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
                        mounth1bbs: formatNumber(dataSplit[0].bbs),
                        mounth2bbs: formatNumber(dataSplit[1].bbs),
                        mounth3bbs: formatNumber(dataSplit[2].bbs),
                        mounth4bbs: formatNumber(dataSplit[3].bbs),
                        mounth5bbs: formatNumber(dataSplit[4].bbs),
                        mounth6bbs: formatNumber(dataSplit[5].bbs),
                        mounth7bbs: formatNumber(dataSplit[6].bbs),
                        mounth8bbs: formatNumber(dataSplit[7].bbs),
                        mounth9bbs: formatNumber(dataSplit[8].bbs),
                        mounth10bbs: formatNumber(dataSplit[9].bbs),
                        mounth11bbs: formatNumber(dataSplit[10].bbs),
                        mounth12bbs: formatNumber(dataSplit[11].bbs),
                        totalbbs: formatNumber(totalbbs),
                        target1bbs: formatNumber(target_dataSplitSecond[0].bbs),
                        target2bbs: formatNumber(target_dataSplitSecond[1].bbs),
                        target3bbs: formatNumber(target_dataSplitSecond[2].bbs),
                        target4bbs: formatNumber(target_dataSplitSecond[3].bbs),
                        target5bbs: formatNumber(target_dataSplitSecond[4].bbs),
                        target6bbs: formatNumber(target_dataSplitSecond[5].bbs),
                        target7bbs: formatNumber(target_dataSplitSecond[6].bbs),
                        target8bbs: formatNumber(target_dataSplitSecond[7].bbs),
                        target9bbs: formatNumber(target_dataSplitSecond[8].bbs),
                        target10bbs: formatNumber(target_dataSplitSecond[9].bbs),
                        target11bbs: formatNumber(target_dataSplitSecond[10].bbs),
                        target12bbs: formatNumber(target_dataSplitSecond[11].bbs),
                        totaltargetbbs: formatNumber(totaltargetbbs),
                        gap1bbs: formatNumber(dataSplitSecond[0].bbs - target_dataSplitSecond[0].bbs),
                        gap2bbs: formatNumber(dataSplitSecond[1].bbs - target_dataSplitSecond[1].bbs),
                        gap3bbs: formatNumber(dataSplitSecond[2].bbs - target_dataSplitSecond[2].bbs),
                        gap4bbs: formatNumber(dataSplitSecond[3].bbs - target_dataSplitSecond[3].bbs),
                        gap5bbs: formatNumber(dataSplitSecond[4].bbs - target_dataSplitSecond[4].bbs),
                        gap6bbs: formatNumber(dataSplitSecond[5].bbs - target_dataSplitSecond[5].bbs),
                        gap7bbs: formatNumber(dataSplitSecond[6].bbs - target_dataSplitSecond[6].bbs),
                        gap8bbs: formatNumber(dataSplitSecond[7].bbs - target_dataSplitSecond[7].bbs),
                        gap9bbs: formatNumber(dataSplitSecond[8].bbs - target_dataSplitSecond[8].bbs),
                        gap10bbs: formatNumber(dataSplitSecond[9].bbs - target_dataSplitSecond[9].bbs),
                        gap11bbs: formatNumber(dataSplitSecond[10].bbs - target_dataSplitSecond[10].bbs),
                        gap12bbs: formatNumber(dataSplitSecond[11].bbs - target_dataSplitSecond[11].bbs),
                        totalgapbbs: formatNumber(totalbbs - totaltargetbbs),
                        perc1bbs: formatNumber(getPrecenge(dataSplitSecond[0].bbs, target_dataSplitSecond[0].bbs)) + '%',
                        perc2bbs: formatNumber(getPrecenge(dataSplitSecond[1].bbs, target_dataSplitSecond[1].bbs)) + '%',
                        perc3bbs: formatNumber(getPrecenge(dataSplitSecond[2].bbs, target_dataSplitSecond[2].bbs)) + '%',
                        perc4bbs: formatNumber(getPrecenge(dataSplitSecond[3].bbs, target_dataSplitSecond[3].bbs)) + '%',
                        perc5bbs: formatNumber(getPrecenge(dataSplitSecond[4].bbs, target_dataSplitSecond[4].bbs)) + '%',
                        perc6bbs: formatNumber(getPrecenge(dataSplitSecond[5].bbs, target_dataSplitSecond[5].bbs)) + '%',
                        perc7bbs: formatNumber(getPrecenge(dataSplitSecond[6].bbs, target_dataSplitSecond[6].bbs)) + '%',
                        perc8bbs: formatNumber(getPrecenge(dataSplitSecond[7].bbs, target_dataSplitSecond[7].bbs)) + '%',
                        perc9bbs: formatNumber(getPrecenge(dataSplitSecond[8].bbs, target_dataSplitSecond[8].bbs)) + '%',
                        perc10bbs: formatNumber(getPrecenge(dataSplitSecond[9].bbs, target_dataSplitSecond[9].bbs)) + '%',
                        perc11bbs: formatNumber(getPrecenge(dataSplitSecond[10].bbs, target_dataSplitSecond[10].bbs)) + '%',
                        perc12bbs: formatNumber(getPrecenge(dataSplitSecond[11].bbs, target_dataSplitSecond[11].bbs)) + '%',
                        totalpercbbs: formatNumber(getPrecenge(totalbbs, totaltargetbbs)) + '%',
                        mounth1vas: formatNumber(dataSplit[0].vas),
                        mounth2vas: formatNumber(dataSplit[1].vas),
                        mounth3vas: formatNumber(dataSplit[2].vas),
                        mounth4vas: formatNumber(dataSplit[3].vas),
                        mounth5vas: formatNumber(dataSplit[4].vas),
                        mounth6vas: formatNumber(dataSplit[5].vas),
                        mounth7vas: formatNumber(dataSplit[6].vas),
                        mounth8vas: formatNumber(dataSplit[7].vas),
                        mounth9vas: formatNumber(dataSplit[8].vas),
                        mounth10vas: formatNumber(dataSplit[9].vas),
                        mounth11vas: formatNumber(dataSplit[10].vas),
                        mounth12vas: formatNumber(dataSplit[11].vas),
                        target1vas: formatNumber(target_dataSplitSecond[0].vas),
                        target2vas: formatNumber(target_dataSplitSecond[1].vas),
                        target3vas: formatNumber(target_dataSplitSecond[2].vas),
                        target4vas: formatNumber(target_dataSplitSecond[3].vas),
                        target5vas: formatNumber(target_dataSplitSecond[4].vas),
                        target6vas: formatNumber(target_dataSplitSecond[5].vas),
                        target7vas: formatNumber(target_dataSplitSecond[6].vas),
                        target8vas: formatNumber(target_dataSplitSecond[7].vas),
                        target9vas: formatNumber(target_dataSplitSecond[8].vas),
                        target10vas: formatNumber(target_dataSplitSecond[9].vas),
                        target11vas: formatNumber(target_dataSplitSecond[10].vas),
                        target12vas: formatNumber(target_dataSplitSecond[11].vas),
                        totaltargetvas: formatNumber(totaltargetvas),
                        gap1vas: formatNumber(dataSplitSecond[0].vas - target_dataSplitSecond[0].vas),
                        gap2vas: formatNumber(dataSplitSecond[1].vas - target_dataSplitSecond[1].vas),
                        gap3vas: formatNumber(dataSplitSecond[2].vas - target_dataSplitSecond[2].vas),
                        gap4vas: formatNumber(dataSplitSecond[3].vas - target_dataSplitSecond[3].vas),
                        gap5vas: formatNumber(dataSplitSecond[4].vas - target_dataSplitSecond[4].vas),
                        gap6vas: formatNumber(dataSplitSecond[5].vas - target_dataSplitSecond[5].vas),
                        gap7vas: formatNumber(dataSplitSecond[6].vas - target_dataSplitSecond[6].vas),
                        gap8vas: formatNumber(dataSplitSecond[7].vas - target_dataSplitSecond[7].vas),
                        gap9vas: formatNumber(dataSplitSecond[8].vas - target_dataSplitSecond[8].vas),
                        gap10vas: formatNumber(dataSplitSecond[9].vas - target_dataSplitSecond[9].vas),
                        gap11vas: formatNumber(dataSplitSecond[10].vas - target_dataSplitSecond[10].vas),
                        gap12vas: formatNumber(dataSplitSecond[11].vas - target_dataSplitSecond[11].vas),
                        totalgapvas: formatNumber(totalvas - totaltargetvas),
                        perc1vas: formatNumber(getPrecenge(dataSplitSecond[0].vas, target_dataSplitSecond[0].vas)) + '%',
                        perc2vas: formatNumber(getPrecenge(dataSplitSecond[1].vas, target_dataSplitSecond[1].vas)) + '%',
                        perc3vas: formatNumber(getPrecenge(dataSplitSecond[2].vas, target_dataSplitSecond[2].vas)) + '%',
                        perc4vas: formatNumber(getPrecenge(dataSplitSecond[3].vas, target_dataSplitSecond[3].vas)) + '%',
                        perc5vas: formatNumber(getPrecenge(dataSplitSecond[4].vas, target_dataSplitSecond[4].vas)) + '%',
                        perc6vas: formatNumber(getPrecenge(dataSplitSecond[5].vas, target_dataSplitSecond[5].vas)) + '%',
                        perc7vas: formatNumber(getPrecenge(dataSplitSecond[6].vas, target_dataSplitSecond[6].vas)) + '%',
                        perc8vas: formatNumber(getPrecenge(dataSplitSecond[7].vas, target_dataSplitSecond[7].vas)) + '%',
                        perc9vas: formatNumber(getPrecenge(dataSplitSecond[8].vas, target_dataSplitSecond[8].vas)) + '%',
                        perc10vas: formatNumber(getPrecenge(dataSplitSecond[9].vas, target_dataSplitSecond[9].vas)) + '%',
                        perc11vas: formatNumber(getPrecenge(dataSplitSecond[10].vas, target_dataSplitSecond[10].vas)) + '%',
                        perc12vas: formatNumber(getPrecenge(dataSplitSecond[11].vas, target_dataSplitSecond[11].vas)) + '%',
                        totalpercvas: formatNumber(getPrecenge(totalvas, totaltargetvas)) + '%',
                        mounth1bod: formatNumber(dataSplit[0].bod),
                        mounth2bod: formatNumber(dataSplit[1].bod),
                        mounth3bod: formatNumber(dataSplit[2].bod),
                        mounth4bod: formatNumber(dataSplit[3].bod),
                        mounth5bod: formatNumber(dataSplit[4].bod),
                        mounth6bod: formatNumber(dataSplit[5].bod),
                        mounth7bod: formatNumber(dataSplit[6].bod),
                        mounth8bod: formatNumber(dataSplit[7].bod),
                        mounth9bod: formatNumber(dataSplit[8].bod),
                        mounth10bod: formatNumber(dataSplit[9].bod),
                        mounth11bod: formatNumber(dataSplit[10].bod),
                        mounth12bod: formatNumber(dataSplit[11].bod),
                        totalbod: formatNumber(totalbod),
                        totaltargetbod: formatNumber(totaltargetbod),
                        totalgapbod: formatNumber(totalbod - totaltargetbod),
                        totalpercbod: formatNumber(getPrecenge(totalbod, totaltargetbod)) + '%',
                        target1bod: formatNumber(target_dataSplitSecond[0].bod),
                        target2bod: formatNumber(target_dataSplitSecond[1].bod),
                        target3bod: formatNumber(target_dataSplitSecond[2].bod),
                        target4bod: formatNumber(target_dataSplitSecond[3].bod),
                        target5bod: formatNumber(target_dataSplitSecond[4].bod),
                        target6bod: formatNumber(target_dataSplitSecond[5].bod),
                        target7bod: formatNumber(target_dataSplitSecond[6].bod),
                        target8bod: formatNumber(target_dataSplitSecond[7].bod),
                        target9bod: formatNumber(target_dataSplitSecond[8].bod),
                        target10bod: formatNumber(target_dataSplitSecond[9].bod),
                        target11bod: formatNumber(target_dataSplitSecond[10].bod),
                        target12bod: formatNumber(target_dataSplitSecond[11].bod),
                        totaltargetbod: formatNumber(totaltargetbod),
                        gap1bod: formatNumber(dataSplitSecond[0].bod - target_dataSplitSecond[0].bod),
                        gap2bod: formatNumber(dataSplitSecond[1].bod - target_dataSplitSecond[1].bod),
                        gap3bod: formatNumber(dataSplitSecond[2].bod - target_dataSplitSecond[2].bod),
                        gap4bod: formatNumber(dataSplitSecond[3].bod - target_dataSplitSecond[3].bod),
                        gap5bod: formatNumber(dataSplitSecond[4].bod - target_dataSplitSecond[4].bod),
                        gap6bod: formatNumber(dataSplitSecond[5].bod - target_dataSplitSecond[5].bod),
                        gap7bod: formatNumber(dataSplitSecond[6].bod - target_dataSplitSecond[6].bod),
                        gap8bod: formatNumber(dataSplitSecond[7].bod - target_dataSplitSecond[7].bod),
                        gap9bod: formatNumber(dataSplitSecond[8].bod - target_dataSplitSecond[8].bod),
                        gap10bod: formatNumber(dataSplitSecond[9].bod - target_dataSplitSecond[9].bod),
                        gap11bod: formatNumber(dataSplitSecond[10].bod - target_dataSplitSecond[10].bod),
                        gap12bod: formatNumber(dataSplitSecond[11].bod - target_dataSplitSecond[11].bod),
                        totalgapbod: formatNumber(totalbod - totaltargetbod),
                        perc1bod: formatNumber(getPrecenge(dataSplitSecond[0].bod, target_dataSplitSecond[0].bod)) + '%',
                        perc2bod: formatNumber(getPrecenge(dataSplitSecond[1].bod, target_dataSplitSecond[1].bod)) + '%',
                        perc3bod: formatNumber(getPrecenge(dataSplitSecond[2].bod, target_dataSplitSecond[2].bod)) + '%',
                        perc4bod: formatNumber(getPrecenge(dataSplitSecond[3].bod, target_dataSplitSecond[3].bod)) + '%',
                        perc5bod: formatNumber(getPrecenge(dataSplitSecond[4].bod, target_dataSplitSecond[4].bod)) + '%',
                        perc6bod: formatNumber(getPrecenge(dataSplitSecond[5].bod, target_dataSplitSecond[5].bod)) + '%',
                        perc7bod: formatNumber(getPrecenge(dataSplitSecond[6].bod, target_dataSplitSecond[6].bod)) + '%',
                        perc8bod: formatNumber(getPrecenge(dataSplitSecond[7].bod, target_dataSplitSecond[7].bod)) + '%',
                        perc9bod: formatNumber(getPrecenge(dataSplitSecond[8].bod, target_dataSplitSecond[8].bod)) + '%',
                        perc10bod: formatNumber(getPrecenge(dataSplitSecond[9].bod, target_dataSplitSecond[9].bod)) + '%',
                        perc11bod: formatNumber(getPrecenge(dataSplitSecond[10].bod, target_dataSplitSecond[10].bod)) + '%',
                        perc12bod: formatNumber(getPrecenge(dataSplitSecond[11].bod, target_dataSplitSecond[11].bod)) + '%',
                        totalpercbod: formatNumber(getPrecenge(totalbod, totaltargetbod)) + '%',
                        mounth1cband: formatNumber(dataSplit[0].cband),
                        mounth2cband: formatNumber(dataSplit[1].cband),
                        mounth3cband: formatNumber(dataSplit[2].cband),
                        mounth4cband: formatNumber(dataSplit[3].cband),
                        mounth5cband: formatNumber(dataSplit[4].cband),
                        mounth6cband: formatNumber(dataSplit[5].cband),
                        mounth7cband: formatNumber(dataSplit[6].cband),
                        mounth8cband: formatNumber(dataSplit[7].cband),
                        mounth9cband: formatNumber(dataSplit[8].cband),
                        mounth10cband: formatNumber(dataSplit[9].cband),
                        mounth11cband: formatNumber(dataSplit[10].cband),
                        mounth12cband: formatNumber(dataSplit[11].cband),
                        totalcband: formatNumber(totalcband),
                        totaltargetcband: formatNumber(totaltargetcband),
                        totalgapcband: formatNumber(totalcband - totaltargetcband),
                        totalperccband: formatNumber(getPrecenge(totalcband, totaltargetcband)) + '%',
                        target1cband: formatNumber(target_dataSplitSecond[0].cband),
                        target2cband: formatNumber(target_dataSplitSecond[1].cband),
                        target3cband: formatNumber(target_dataSplitSecond[2].cband),
                        target4cband: formatNumber(target_dataSplitSecond[3].cband),
                        target5cband: formatNumber(target_dataSplitSecond[4].cband),
                        target6cband: formatNumber(target_dataSplitSecond[5].cband),
                        target7cband: formatNumber(target_dataSplitSecond[6].cband),
                        target8cband: formatNumber(target_dataSplitSecond[7].cband),
                        target9cband: formatNumber(target_dataSplitSecond[8].cband),
                        target10cband: formatNumber(target_dataSplitSecond[9].cband),
                        target11cband: formatNumber(target_dataSplitSecond[10].cband),
                        target12cband: formatNumber(target_dataSplitSecond[11].cband),
                        totaltargetcband: formatNumber(totaltargetcband),
                        gap1cband: formatNumber(dataSplitSecond[0].cband - target_dataSplitSecond[0].cband),
                        gap2cband: formatNumber(dataSplitSecond[1].cband - target_dataSplitSecond[1].cband),
                        gap3cband: formatNumber(dataSplitSecond[2].cband - target_dataSplitSecond[2].cband),
                        gap4cband: formatNumber(dataSplitSecond[3].cband - target_dataSplitSecond[3].cband),
                        gap5cband: formatNumber(dataSplitSecond[4].cband - target_dataSplitSecond[4].cband),
                        gap6cband: formatNumber(dataSplitSecond[5].cband - target_dataSplitSecond[5].cband),
                        gap7cband: formatNumber(dataSplitSecond[6].cband - target_dataSplitSecond[6].cband),
                        gap8cband: formatNumber(dataSplitSecond[7].cband - target_dataSplitSecond[7].cband),
                        gap9cband: formatNumber(dataSplitSecond[8].cband - target_dataSplitSecond[8].cband),
                        gap10cband: formatNumber(dataSplitSecond[9].cband - target_dataSplitSecond[9].cband),
                        gap11cband: formatNumber(dataSplitSecond[10].cband - target_dataSplitSecond[10].cband),
                        gap12cband: formatNumber(dataSplitSecond[11].cband - target_dataSplitSecond[11].cband),
                        totalgapcband: formatNumber(totalcband - totaltargetcband),
                        perc1cband: formatNumber(getPrecenge(dataSplitSecond[0].cband, target_dataSplitSecond[0].cband)) + '%',
                        perc2cband: formatNumber(getPrecenge(dataSplitSecond[1].cband, target_dataSplitSecond[1].cband)) + '%',
                        perc3cband: formatNumber(getPrecenge(dataSplitSecond[2].cband, target_dataSplitSecond[2].cband)) + '%',
                        perc4cband: formatNumber(getPrecenge(dataSplitSecond[3].cband, target_dataSplitSecond[3].cband)) + '%',
                        perc5cband: formatNumber(getPrecenge(dataSplitSecond[4].cband, target_dataSplitSecond[4].cband)) + '%',
                        perc6cband: formatNumber(getPrecenge(dataSplitSecond[5].cband, target_dataSplitSecond[5].cband)) + '%',
                        perc7cband: formatNumber(getPrecenge(dataSplitSecond[6].cband, target_dataSplitSecond[6].cband)) + '%',
                        perc8cband: formatNumber(getPrecenge(dataSplitSecond[7].cband, target_dataSplitSecond[7].cband)) + '%',
                        perc9cband: formatNumber(getPrecenge(dataSplitSecond[8].cband, target_dataSplitSecond[8].cband)) + '%',
                        perc10cband: formatNumber(getPrecenge(dataSplitSecond[9].cband, target_dataSplitSecond[9].cband)) + '%',
                        perc11cband: formatNumber(getPrecenge(dataSplitSecond[10].cband, target_dataSplitSecond[10].cband)) + '%',
                        perc12cband: formatNumber(getPrecenge(dataSplitSecond[11].cband, target_dataSplitSecond[11].cband)) + '%',
                        totalperccband: formatNumber(getPrecenge(totalcband, totaltargetcband)) + '%',
                        mounth1domestic: formatNumber(dataSplit[0].domestic),
                        mounth2domestic: formatNumber(dataSplit[1].domestic),
                        mounth3domestic: formatNumber(dataSplit[2].domestic),
                        mounth4domestic: formatNumber(dataSplit[3].domestic),
                        mounth5domestic: formatNumber(dataSplit[4].domestic),
                        mounth6domestic: formatNumber(dataSplit[5].domestic),
                        mounth7domestic: formatNumber(dataSplit[6].domestic),
                        mounth8domestic: formatNumber(dataSplit[7].domestic),
                        mounth9domestic: formatNumber(dataSplit[8].domestic),
                        mounth10domestic: formatNumber(dataSplit[9].domestic),
                        mounth11domestic: formatNumber(dataSplit[10].domestic),
                        mounth12domestic: formatNumber(dataSplit[11].domestic),
                        totaldomestic: formatNumber(totaldomestic),
                        totaltargetdomestic: formatNumber(totaltargetdomestic),
                        totalgapdomestic: formatNumber(totaldomestic - totaltargetdomestic),
                        totalpercdomestic: formatNumber(getPrecenge(totaldomestic, totaltargetdomestic)) + '%',
                        target1domestic: formatNumber(target_dataSplitSecond[0].domestic),
                        target2domestic: formatNumber(target_dataSplitSecond[1].domestic),
                        target3domestic: formatNumber(target_dataSplitSecond[2].domestic),
                        target4domestic: formatNumber(target_dataSplitSecond[3].domestic),
                        target5domestic: formatNumber(target_dataSplitSecond[4].domestic),
                        target6domestic: formatNumber(target_dataSplitSecond[5].domestic),
                        target7domestic: formatNumber(target_dataSplitSecond[6].domestic),
                        target8domestic: formatNumber(target_dataSplitSecond[7].domestic),
                        target9domestic: formatNumber(target_dataSplitSecond[8].domestic),
                        target10domestic: formatNumber(target_dataSplitSecond[9].domestic),
                        target11domestic: formatNumber(target_dataSplitSecond[10].domestic),
                        target12domestic: formatNumber(target_dataSplitSecond[11].domestic),
                        totaltargetdomestic: formatNumber(totaltargetdomestic),
                        gap1domestic: formatNumber(dataSplitSecond[0].domestic - target_dataSplitSecond[0].domestic),
                        gap2domestic: formatNumber(dataSplitSecond[1].domestic - target_dataSplitSecond[1].domestic),
                        gap3domestic: formatNumber(dataSplitSecond[2].domestic - target_dataSplitSecond[2].domestic),
                        gap4domestic: formatNumber(dataSplitSecond[3].domestic - target_dataSplitSecond[3].domestic),
                        gap5domestic: formatNumber(dataSplitSecond[4].domestic - target_dataSplitSecond[4].domestic),
                        gap6domestic: formatNumber(dataSplitSecond[5].domestic - target_dataSplitSecond[5].domestic),
                        gap7domestic: formatNumber(dataSplitSecond[6].domestic - target_dataSplitSecond[6].domestic),
                        gap8domestic: formatNumber(dataSplitSecond[7].domestic - target_dataSplitSecond[7].domestic),
                        gap9domestic: formatNumber(dataSplitSecond[8].domestic - target_dataSplitSecond[8].domestic),
                        gap10domestic: formatNumber(dataSplitSecond[9].domestic - target_dataSplitSecond[9].domestic),
                        gap11domestic: formatNumber(dataSplitSecond[10].domestic - target_dataSplitSecond[10].domestic),
                        gap12domestic: formatNumber(dataSplitSecond[11].domestic - target_dataSplitSecond[11].domestic),
                        totalgapdomestic: formatNumber(totaldomestic - totaltargetdomestic),
                        perc1domestic: formatNumber(getPrecenge(dataSplitSecond[0].domestic, target_dataSplitSecond[0].domestic)) + '%',
                        perc2domestic: formatNumber(getPrecenge(dataSplitSecond[1].domestic, target_dataSplitSecond[1].domestic)) + '%',
                        perc3domestic: formatNumber(getPrecenge(dataSplitSecond[2].domestic, target_dataSplitSecond[2].domestic)) + '%',
                        perc4domestic: formatNumber(getPrecenge(dataSplitSecond[3].domestic, target_dataSplitSecond[3].domestic)) + '%',
                        perc5domestic: formatNumber(getPrecenge(dataSplitSecond[4].domestic, target_dataSplitSecond[4].domestic)) + '%',
                        perc6domestic: formatNumber(getPrecenge(dataSplitSecond[5].domestic, target_dataSplitSecond[5].domestic)) + '%',
                        perc7domestic: formatNumber(getPrecenge(dataSplitSecond[6].domestic, target_dataSplitSecond[6].domestic)) + '%',
                        perc8domestic: formatNumber(getPrecenge(dataSplitSecond[7].domestic, target_dataSplitSecond[7].domestic)) + '%',
                        perc9domestic: formatNumber(getPrecenge(dataSplitSecond[8].domestic, target_dataSplitSecond[8].domestic)) + '%',
                        perc10domestic: formatNumber(getPrecenge(dataSplitSecond[9].domestic, target_dataSplitSecond[9].domestic)) + '%',
                        perc11domestic: formatNumber(getPrecenge(dataSplitSecond[10].domestic, target_dataSplitSecond[10].domestic)) + '%',
                        perc12domestic: formatNumber(getPrecenge(dataSplitSecond[11].domestic, target_dataSplitSecond[11].domestic)) + '%',
                        totalpercdomestic: formatNumber(getPrecenge(totaldomestic, totaltargetdomestic)) + '%',
                        mounth1ip: formatNumber(dataSplit[0].ip),
                        mounth2ip: formatNumber(dataSplit[1].ip),
                        mounth3ip: formatNumber(dataSplit[2].ip),
                        mounth4ip: formatNumber(dataSplit[3].ip),
                        mounth5ip: formatNumber(dataSplit[4].ip),
                        mounth6ip: formatNumber(dataSplit[5].ip),
                        mounth7ip: formatNumber(dataSplit[6].ip),
                        mounth8ip: formatNumber(dataSplit[7].ip),
                        mounth9ip: formatNumber(dataSplit[8].ip),
                        mounth10ip: formatNumber(dataSplit[9].ip),
                        mounth11ip: formatNumber(dataSplit[10].ip),
                        mounth12ip: formatNumber(dataSplit[11].ip),
                        totalip: formatNumber(totalip),
                        totaltargetip: formatNumber(totaltargetip),
                        totalgapip: formatNumber(totalip - totaltargetip),
                        totalpercip: formatNumber(getPrecenge(totalip, totaltargetip)) + '%',
                        target1ip: formatNumber(target_dataSplitSecond[0].ip),
                        target2ip: formatNumber(target_dataSplitSecond[1].ip),
                        target3ip: formatNumber(target_dataSplitSecond[2].ip),
                        target4ip: formatNumber(target_dataSplitSecond[3].ip),
                        target5ip: formatNumber(target_dataSplitSecond[4].ip),
                        target6ip: formatNumber(target_dataSplitSecond[5].ip),
                        target7ip: formatNumber(target_dataSplitSecond[6].ip),
                        target8ip: formatNumber(target_dataSplitSecond[7].ip),
                        target9ip: formatNumber(target_dataSplitSecond[8].ip),
                        target10ip: formatNumber(target_dataSplitSecond[9].ip),
                        target11ip: formatNumber(target_dataSplitSecond[10].ip),
                        target12ip: formatNumber(target_dataSplitSecond[11].ip),
                        totaltargetip: formatNumber(totaltargetip),
                        gap1ip: formatNumber(dataSplitSecond[0].ip - target_dataSplitSecond[0].ip),
                        gap2ip: formatNumber(dataSplitSecond[1].ip - target_dataSplitSecond[1].ip),
                        gap3ip: formatNumber(dataSplitSecond[2].ip - target_dataSplitSecond[2].ip),
                        gap4ip: formatNumber(dataSplitSecond[3].ip - target_dataSplitSecond[3].ip),
                        gap5ip: formatNumber(dataSplitSecond[4].ip - target_dataSplitSecond[4].ip),
                        gap6ip: formatNumber(dataSplitSecond[5].ip - target_dataSplitSecond[5].ip),
                        gap7ip: formatNumber(dataSplitSecond[6].ip - target_dataSplitSecond[6].ip),
                        gap8ip: formatNumber(dataSplitSecond[7].ip - target_dataSplitSecond[7].ip),
                        gap9ip: formatNumber(dataSplitSecond[8].ip - target_dataSplitSecond[8].ip),
                        gap10ip: formatNumber(dataSplitSecond[9].ip - target_dataSplitSecond[9].ip),
                        gap11ip: formatNumber(dataSplitSecond[10].ip - target_dataSplitSecond[10].ip),
                        gap12ip: formatNumber(dataSplitSecond[11].ip - target_dataSplitSecond[11].ip),
                        totalgapip: formatNumber(totalip - totaltargetip),
                        perc1ip: formatNumber(getPrecenge(dataSplitSecond[0].ip, target_dataSplitSecond[0].ip)) + '%',
                        perc2ip: formatNumber(getPrecenge(dataSplitSecond[1].ip, target_dataSplitSecond[1].ip)) + '%',
                        perc3ip: formatNumber(getPrecenge(dataSplitSecond[2].ip, target_dataSplitSecond[2].ip)) + '%',
                        perc4ip: formatNumber(getPrecenge(dataSplitSecond[3].ip, target_dataSplitSecond[3].ip)) + '%',
                        perc5ip: formatNumber(getPrecenge(dataSplitSecond[4].ip, target_dataSplitSecond[4].ip)) + '%',
                        perc6ip: formatNumber(getPrecenge(dataSplitSecond[5].ip, target_dataSplitSecond[5].ip)) + '%',
                        perc7ip: formatNumber(getPrecenge(dataSplitSecond[6].ip, target_dataSplitSecond[6].ip)) + '%',
                        perc8ip: formatNumber(getPrecenge(dataSplitSecond[7].ip, target_dataSplitSecond[7].ip)) + '%',
                        perc9ip: formatNumber(getPrecenge(dataSplitSecond[8].ip, target_dataSplitSecond[8].ip)) + '%',
                        perc10ip: formatNumber(getPrecenge(dataSplitSecond[9].ip, target_dataSplitSecond[9].ip)) + '%',
                        perc11ip: formatNumber(getPrecenge(dataSplitSecond[10].ip, target_dataSplitSecond[10].ip)) + '%',
                        perc12ip: formatNumber(getPrecenge(dataSplitSecond[11].ip, target_dataSplitSecond[11].ip)) + '%',
                        totalpercip: formatNumber(getPrecenge(totalip, totaltargetip)) + '%',
                        mounth1iru: formatNumber(dataSplit[0].iru),
                        mounth2iru: formatNumber(dataSplit[1].iru),
                        mounth3iru: formatNumber(dataSplit[2].iru),
                        mounth4iru: formatNumber(dataSplit[3].iru),
                        mounth5iru: formatNumber(dataSplit[4].iru),
                        mounth6iru: formatNumber(dataSplit[5].iru),
                        mounth7iru: formatNumber(dataSplit[6].iru),
                        mounth8iru: formatNumber(dataSplit[7].iru),
                        mounth9iru: formatNumber(dataSplit[8].iru),
                        mounth10iru: formatNumber(dataSplit[9].iru),
                        mounth11iru: formatNumber(dataSplit[10].iru),
                        mounth12iru: formatNumber(dataSplit[11].iru),
                        totaliru: formatNumber(totaliru),
                        totaltargetiru: formatNumber(totaltargetiru),
                        totalgapiru: formatNumber(totaliru - totaltargetiru),
                        totalperciru: formatNumber(getPrecenge(totaliru, totaltargetiru)) + '%',
                        target1iru: formatNumber(target_dataSplitSecond[0].iru),
                        target2iru: formatNumber(target_dataSplitSecond[1].iru),
                        target3iru: formatNumber(target_dataSplitSecond[2].iru),
                        target4iru: formatNumber(target_dataSplitSecond[3].iru),
                        target5iru: formatNumber(target_dataSplitSecond[4].iru),
                        target6iru: formatNumber(target_dataSplitSecond[5].iru),
                        target7iru: formatNumber(target_dataSplitSecond[6].iru),
                        target8iru: formatNumber(target_dataSplitSecond[7].iru),
                        target9iru: formatNumber(target_dataSplitSecond[8].iru),
                        target10iru: formatNumber(target_dataSplitSecond[9].iru),
                        target11iru: formatNumber(target_dataSplitSecond[10].iru),
                        target12iru: formatNumber(target_dataSplitSecond[11].iru),
                        totaltargetiru: formatNumber(totaltargetiru),
                        gap1iru: formatNumber(dataSplitSecond[0].iru - target_dataSplitSecond[0].iru),
                        gap2iru: formatNumber(dataSplitSecond[1].iru - target_dataSplitSecond[1].iru),
                        gap3iru: formatNumber(dataSplitSecond[2].iru - target_dataSplitSecond[2].iru),
                        gap4iru: formatNumber(dataSplitSecond[3].iru - target_dataSplitSecond[3].iru),
                        gap5iru: formatNumber(dataSplitSecond[4].iru - target_dataSplitSecond[4].iru),
                        gap6iru: formatNumber(dataSplitSecond[5].iru - target_dataSplitSecond[5].iru),
                        gap7iru: formatNumber(dataSplitSecond[6].iru - target_dataSplitSecond[6].iru),
                        gap8iru: formatNumber(dataSplitSecond[7].iru - target_dataSplitSecond[7].iru),
                        gap9iru: formatNumber(dataSplitSecond[8].iru - target_dataSplitSecond[8].iru),
                        gap10iru: formatNumber(dataSplitSecond[9].iru - target_dataSplitSecond[9].iru),
                        gap11iru: formatNumber(dataSplitSecond[10].iru - target_dataSplitSecond[10].iru),
                        gap12iru: formatNumber(dataSplitSecond[11].iru - target_dataSplitSecond[11].iru),
                        totalgapiru: formatNumber(totaliru - totaltargetiru),
                        perc1iru: formatNumber(getPrecenge(dataSplitSecond[0].iru, target_dataSplitSecond[0].iru)) + '%',
                        perc2iru: formatNumber(getPrecenge(dataSplitSecond[1].iru, target_dataSplitSecond[1].iru)) + '%',
                        perc3iru: formatNumber(getPrecenge(dataSplitSecond[2].iru, target_dataSplitSecond[2].iru)) + '%',
                        perc4iru: formatNumber(getPrecenge(dataSplitSecond[3].iru, target_dataSplitSecond[3].iru)) + '%',
                        perc5iru: formatNumber(getPrecenge(dataSplitSecond[4].iru, target_dataSplitSecond[4].iru)) + '%',
                        perc6iru: formatNumber(getPrecenge(dataSplitSecond[5].iru, target_dataSplitSecond[5].iru)) + '%',
                        perc7iru: formatNumber(getPrecenge(dataSplitSecond[6].iru, target_dataSplitSecond[6].iru)) + '%',
                        perc8iru: formatNumber(getPrecenge(dataSplitSecond[7].iru, target_dataSplitSecond[7].iru)) + '%',
                        perc9iru: formatNumber(getPrecenge(dataSplitSecond[8].iru, target_dataSplitSecond[8].iru)) + '%',
                        perc10iru: formatNumber(getPrecenge(dataSplitSecond[9].iru, target_dataSplitSecond[9].iru)) + '%',
                        perc11iru: formatNumber(getPrecenge(dataSplitSecond[10].iru, target_dataSplitSecond[10].iru)) + '%',
                        perc12iru: formatNumber(getPrecenge(dataSplitSecond[11].iru, target_dataSplitSecond[11].iru)) + '%',
                        totalperciru: formatNumber(getPrecenge(totaliru, totaltargetiru)) + '%',
                        mounth1kuband: formatNumber(dataSplit[0].kuband),
                        mounth2kuband: formatNumber(dataSplit[1].kuband),
                        mounth3kuband: formatNumber(dataSplit[2].kuband),
                        mounth4kuband: formatNumber(dataSplit[3].kuband),
                        mounth5kuband: formatNumber(dataSplit[4].kuband),
                        mounth6kuband: formatNumber(dataSplit[5].kuband),
                        mounth7kuband: formatNumber(dataSplit[6].kuband),
                        mounth8kuband: formatNumber(dataSplit[7].kuband),
                        mounth9kuband: formatNumber(dataSplit[8].kuband),
                        mounth10kuband: formatNumber(dataSplit[9].kuband),
                        mounth11kuband: formatNumber(dataSplit[10].kuband),
                        mounth12kuband: formatNumber(dataSplit[11].kuband),
                        totalkuband: formatNumber(totalkuband),
                        totaltargetkuband: formatNumber(totaltargetkuband),
                        totalgapkuband: formatNumber(totalkuband - totaltargetkuband),
                        totalperckuband: formatNumber(getPrecenge(totalkuband, totaltargetkuband)) + '%',
                        target1kuband: formatNumber(target_dataSplitSecond[0].kuband),
                        target2kuband: formatNumber(target_dataSplitSecond[1].kuband),
                        target3kuband: formatNumber(target_dataSplitSecond[2].kuband),
                        target4kuband: formatNumber(target_dataSplitSecond[3].kuband),
                        target5kuband: formatNumber(target_dataSplitSecond[4].kuband),
                        target6kuband: formatNumber(target_dataSplitSecond[5].kuband),
                        target7kuband: formatNumber(target_dataSplitSecond[6].kuband),
                        target8kuband: formatNumber(target_dataSplitSecond[7].kuband),
                        target9kuband: formatNumber(target_dataSplitSecond[8].kuband),
                        target10kuband: formatNumber(target_dataSplitSecond[9].kuband),
                        target11kuband: formatNumber(target_dataSplitSecond[10].kuband),
                        target12kuband: formatNumber(target_dataSplitSecond[11].kuband),
                        totaltargetkuband: formatNumber(totaltargetkuband),
                        gap1kuband: formatNumber(dataSplitSecond[0].kuband - target_dataSplitSecond[0].kuband),
                        gap2kuband: formatNumber(dataSplitSecond[1].kuband - target_dataSplitSecond[1].kuband),
                        gap3kuband: formatNumber(dataSplitSecond[2].kuband - target_dataSplitSecond[2].kuband),
                        gap4kuband: formatNumber(dataSplitSecond[3].kuband - target_dataSplitSecond[3].kuband),
                        gap5kuband: formatNumber(dataSplitSecond[4].kuband - target_dataSplitSecond[4].kuband),
                        gap6kuband: formatNumber(dataSplitSecond[5].kuband - target_dataSplitSecond[5].kuband),
                        gap7kuband: formatNumber(dataSplitSecond[6].kuband - target_dataSplitSecond[6].kuband),
                        gap8kuband: formatNumber(dataSplitSecond[7].kuband - target_dataSplitSecond[7].kuband),
                        gap9kuband: formatNumber(dataSplitSecond[8].kuband - target_dataSplitSecond[8].kuband),
                        gap10kuband: formatNumber(dataSplitSecond[9].kuband - target_dataSplitSecond[9].kuband),
                        gap11kuband: formatNumber(dataSplitSecond[10].kuband - target_dataSplitSecond[10].kuband),
                        gap12kuband: formatNumber(dataSplitSecond[11].kuband - target_dataSplitSecond[11].kuband),
                        totalgapkuband: formatNumber(totalkuband - totaltargetkuband),
                        perc1kuband: formatNumber(getPrecenge(dataSplitSecond[0].kuband, target_dataSplitSecond[0].kuband)) + '%',
                        perc2kuband: formatNumber(getPrecenge(dataSplitSecond[1].kuband, target_dataSplitSecond[1].kuband)) + '%',
                        perc3kuband: formatNumber(getPrecenge(dataSplitSecond[2].kuband, target_dataSplitSecond[2].kuband)) + '%',
                        perc4kuband: formatNumber(getPrecenge(dataSplitSecond[3].kuband, target_dataSplitSecond[3].kuband)) + '%',
                        perc5kuband: formatNumber(getPrecenge(dataSplitSecond[4].kuband, target_dataSplitSecond[4].kuband)) + '%',
                        perc6kuband: formatNumber(getPrecenge(dataSplitSecond[5].kuband, target_dataSplitSecond[5].kuband)) + '%',
                        perc7kuband: formatNumber(getPrecenge(dataSplitSecond[6].kuband, target_dataSplitSecond[6].kuband)) + '%',
                        perc8kuband: formatNumber(getPrecenge(dataSplitSecond[7].kuband, target_dataSplitSecond[7].kuband)) + '%',
                        perc9kuband: formatNumber(getPrecenge(dataSplitSecond[8].kuband, target_dataSplitSecond[8].kuband)) + '%',
                        perc10kuband: formatNumber(getPrecenge(dataSplitSecond[9].kuband, target_dataSplitSecond[9].kuband)) + '%',
                        perc11kuband: formatNumber(getPrecenge(dataSplitSecond[10].kuband, target_dataSplitSecond[10].kuband)) + '%',
                        perc12kuband: formatNumber(getPrecenge(dataSplitSecond[11].kuband, target_dataSplitSecond[11].kuband)) + '%',
                        totalperckuband: formatNumber(getPrecenge(totalkuband, totaltargetkuband)) + '%',
                        mounth1mobile_vsat: formatNumber(dataSplit[0].mobile_vsat),
                        mounth2mobile_vsat: formatNumber(dataSplit[1].mobile_vsat),
                        mounth3mobile_vsat: formatNumber(dataSplit[2].mobile_vsat),
                        mounth4mobile_vsat: formatNumber(dataSplit[3].mobile_vsat),
                        mounth5mobile_vsat: formatNumber(dataSplit[4].mobile_vsat),
                        mounth6mobile_vsat: formatNumber(dataSplit[5].mobile_vsat),
                        mounth7mobile_vsat: formatNumber(dataSplit[6].mobile_vsat),
                        mounth8mobile_vsat: formatNumber(dataSplit[7].mobile_vsat),
                        mounth9mobile_vsat: formatNumber(dataSplit[8].mobile_vsat),
                        mounth10mobile_vsat: formatNumber(dataSplit[9].mobile_vsat),
                        mounth11mobile_vsat: formatNumber(dataSplit[10].mobile_vsat),
                        mounth12mobile_vsat: formatNumber(dataSplit[11].mobile_vsat),
                        totalmobile_vsat: formatNumber(totalmobile_vsat),
                        totaltargetmobile_vsat: formatNumber(totaltargetmobile_vsat),
                        totalgapmobile_vsat: formatNumber(totalmobile_vsat - totaltargetmobile_vsat),
                        totalpercmobile_vsat: formatNumber(getPrecenge(totalmobile_vsat, totaltargetmobile_vsat)) + '%',
                        target1mobile_vsat: formatNumber(target_dataSplitSecond[0].mobile_vsat),
                        target2mobile_vsat: formatNumber(target_dataSplitSecond[1].mobile_vsat),
                        target3mobile_vsat: formatNumber(target_dataSplitSecond[2].mobile_vsat),
                        target4mobile_vsat: formatNumber(target_dataSplitSecond[3].mobile_vsat),
                        target5mobile_vsat: formatNumber(target_dataSplitSecond[4].mobile_vsat),
                        target6mobile_vsat: formatNumber(target_dataSplitSecond[5].mobile_vsat),
                        target7mobile_vsat: formatNumber(target_dataSplitSecond[6].mobile_vsat),
                        target8mobile_vsat: formatNumber(target_dataSplitSecond[7].mobile_vsat),
                        target9mobile_vsat: formatNumber(target_dataSplitSecond[8].mobile_vsat),
                        target10mobile_vsat: formatNumber(target_dataSplitSecond[9].mobile_vsat),
                        target11mobile_vsat: formatNumber(target_dataSplitSecond[10].mobile_vsat),
                        target12mobile_vsat: formatNumber(target_dataSplitSecond[11].mobile_vsat),
                        totaltargetmobile_vsat: formatNumber(totaltargetmobile_vsat),
                        gap1mobile_vsat: formatNumber(dataSplitSecond[0].mobile_vsat - target_dataSplitSecond[0].mobile_vsat),
                        gap2mobile_vsat: formatNumber(dataSplitSecond[1].mobile_vsat - target_dataSplitSecond[1].mobile_vsat),
                        gap3mobile_vsat: formatNumber(dataSplitSecond[2].mobile_vsat - target_dataSplitSecond[2].mobile_vsat),
                        gap4mobile_vsat: formatNumber(dataSplitSecond[3].mobile_vsat - target_dataSplitSecond[3].mobile_vsat),
                        gap5mobile_vsat: formatNumber(dataSplitSecond[4].mobile_vsat - target_dataSplitSecond[4].mobile_vsat),
                        gap6mobile_vsat: formatNumber(dataSplitSecond[5].mobile_vsat - target_dataSplitSecond[5].mobile_vsat),
                        gap7mobile_vsat: formatNumber(dataSplitSecond[6].mobile_vsat - target_dataSplitSecond[6].mobile_vsat),
                        gap8mobile_vsat: formatNumber(dataSplitSecond[7].mobile_vsat - target_dataSplitSecond[7].mobile_vsat),
                        gap9mobile_vsat: formatNumber(dataSplitSecond[8].mobile_vsat - target_dataSplitSecond[8].mobile_vsat),
                        gap10mobile_vsat: formatNumber(dataSplitSecond[9].mobile_vsat - target_dataSplitSecond[9].mobile_vsat),
                        gap11mobile_vsat: formatNumber(dataSplitSecond[10].mobile_vsat - target_dataSplitSecond[10].mobile_vsat),
                        gap12mobile_vsat: formatNumber(dataSplitSecond[11].mobile_vsat - target_dataSplitSecond[11].mobile_vsat),
                        totalgapmobile_vsat: formatNumber(totalmobile_vsat - totaltargetmobile_vsat),
                        perc1mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[0].mobile_vsat, target_dataSplitSecond[0].mobile_vsat)) + '%',
                        perc2mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[1].mobile_vsat, target_dataSplitSecond[1].mobile_vsat)) + '%',
                        perc3mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[2].mobile_vsat, target_dataSplitSecond[2].mobile_vsat)) + '%',
                        perc4mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[3].mobile_vsat, target_dataSplitSecond[3].mobile_vsat)) + '%',
                        perc5mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[4].mobile_vsat, target_dataSplitSecond[4].mobile_vsat)) + '%',
                        perc6mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[5].mobile_vsat, target_dataSplitSecond[5].mobile_vsat)) + '%',
                        perc7mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[6].mobile_vsat, target_dataSplitSecond[6].mobile_vsat)) + '%',
                        perc8mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[7].mobile_vsat, target_dataSplitSecond[7].mobile_vsat)) + '%',
                        perc9mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[8].mobile_vsat, target_dataSplitSecond[8].mobile_vsat)) + '%',
                        perc10mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[9].mobile_vsat, target_dataSplitSecond[9].mobile_vsat)) + '%',
                        perc11mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[10].mobile_vsat, target_dataSplitSecond[10].mobile_vsat)) + '%',
                        perc12mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[11].mobile_vsat, target_dataSplitSecond[11].mobile_vsat)) + '%',
                        totalpercmobile_vsat: formatNumber(getPrecenge(totalmobile_vsat, totaltargetmobile_vsat)) + '%',
                        mounth1mpip: formatNumber(dataSplit[0].mpip),
                        mounth2mpip: formatNumber(dataSplit[1].mpip),
                        mounth3mpip: formatNumber(dataSplit[2].mpip),
                        mounth4mpip: formatNumber(dataSplit[3].mpip),
                        mounth5mpip: formatNumber(dataSplit[4].mpip),
                        mounth6mpip: formatNumber(dataSplit[5].mpip),
                        mounth7mpip: formatNumber(dataSplit[6].mpip),
                        mounth8mpip: formatNumber(dataSplit[7].mpip),
                        mounth9mpip: formatNumber(dataSplit[8].mpip),
                        mounth10mpip: formatNumber(dataSplit[9].mpip),
                        mounth11mpip: formatNumber(dataSplit[10].mpip),
                        mounth12mpip: formatNumber(dataSplit[11].mpip),
                        totalmpip: formatNumber(totalmpip),
                        totaltargetmpip: formatNumber(totaltargetmpip),
                        totalgapmpip: formatNumber(totalmpip - totaltargetmpip),
                        totalpercmpip: formatNumber(getPrecenge(totalmpip, totaltargetmpip)) + '%',
                        target1mpip: formatNumber(target_dataSplitSecond[0].mpip),
                        target2mpip: formatNumber(target_dataSplitSecond[1].mpip),
                        target3mpip: formatNumber(target_dataSplitSecond[2].mpip),
                        target4mpip: formatNumber(target_dataSplitSecond[3].mpip),
                        target5mpip: formatNumber(target_dataSplitSecond[4].mpip),
                        target6mpip: formatNumber(target_dataSplitSecond[5].mpip),
                        target7mpip: formatNumber(target_dataSplitSecond[6].mpip),
                        target8mpip: formatNumber(target_dataSplitSecond[7].mpip),
                        target9mpip: formatNumber(target_dataSplitSecond[8].mpip),
                        target10mpip: formatNumber(target_dataSplitSecond[9].mpip),
                        target11mpip: formatNumber(target_dataSplitSecond[10].mpip),
                        target12mpip: formatNumber(target_dataSplitSecond[11].mpip),
                        totaltargetmpip: formatNumber(totaltargetmpip),
                        gap1mpip: formatNumber(dataSplitSecond[0].mpip - target_dataSplitSecond[0].mpip),
                        gap2mpip: formatNumber(dataSplitSecond[1].mpip - target_dataSplitSecond[1].mpip),
                        gap3mpip: formatNumber(dataSplitSecond[2].mpip - target_dataSplitSecond[2].mpip),
                        gap4mpip: formatNumber(dataSplitSecond[3].mpip - target_dataSplitSecond[3].mpip),
                        gap5mpip: formatNumber(dataSplitSecond[4].mpip - target_dataSplitSecond[4].mpip),
                        gap6mpip: formatNumber(dataSplitSecond[5].mpip - target_dataSplitSecond[5].mpip),
                        gap7mpip: formatNumber(dataSplitSecond[6].mpip - target_dataSplitSecond[6].mpip),
                        gap8mpip: formatNumber(dataSplitSecond[7].mpip - target_dataSplitSecond[7].mpip),
                        gap9mpip: formatNumber(dataSplitSecond[8].mpip - target_dataSplitSecond[8].mpip),
                        gap10mpip: formatNumber(dataSplitSecond[9].mpip - target_dataSplitSecond[9].mpip),
                        gap11mpip: formatNumber(dataSplitSecond[10].mpip - target_dataSplitSecond[10].mpip),
                        gap12mpip: formatNumber(dataSplitSecond[11].mpip - target_dataSplitSecond[11].mpip),
                        totalgapmpip: formatNumber(totalmpip - totaltargetmpip),
                        perc1mpip: formatNumber(getPrecenge(dataSplitSecond[0].mpip, target_dataSplitSecond[0].mpip)) + '%',
                        perc2mpip: formatNumber(getPrecenge(dataSplitSecond[1].mpip, target_dataSplitSecond[1].mpip)) + '%',
                        perc3mpip: formatNumber(getPrecenge(dataSplitSecond[2].mpip, target_dataSplitSecond[2].mpip)) + '%',
                        perc4mpip: formatNumber(getPrecenge(dataSplitSecond[3].mpip, target_dataSplitSecond[3].mpip)) + '%',
                        perc5mpip: formatNumber(getPrecenge(dataSplitSecond[4].mpip, target_dataSplitSecond[4].mpip)) + '%',
                        perc6mpip: formatNumber(getPrecenge(dataSplitSecond[5].mpip, target_dataSplitSecond[5].mpip)) + '%',
                        perc7mpip: formatNumber(getPrecenge(dataSplitSecond[6].mpip, target_dataSplitSecond[6].mpip)) + '%',
                        perc8mpip: formatNumber(getPrecenge(dataSplitSecond[7].mpip, target_dataSplitSecond[7].mpip)) + '%',
                        perc9mpip: formatNumber(getPrecenge(dataSplitSecond[8].mpip, target_dataSplitSecond[8].mpip)) + '%',
                        perc10mpip: formatNumber(getPrecenge(dataSplitSecond[9].mpip, target_dataSplitSecond[9].mpip)) + '%',
                        perc11mpip: formatNumber(getPrecenge(dataSplitSecond[10].mpip, target_dataSplitSecond[10].mpip)) + '%',
                        perc12mpip: formatNumber(getPrecenge(dataSplitSecond[11].mpip, target_dataSplitSecond[11].mpip)) + '%',
                        totalpercmpip: formatNumber(getPrecenge(totalmpip, totaltargetmpip)) + '%',
                        mounth1o3b: formatNumber(dataSplit[0].o3b),
                        mounth2o3b: formatNumber(dataSplit[1].o3b),
                        mounth3o3b: formatNumber(dataSplit[2].o3b),
                        mounth4o3b: formatNumber(dataSplit[3].o3b),
                        mounth5o3b: formatNumber(dataSplit[4].o3b),
                        mounth6o3b: formatNumber(dataSplit[5].o3b),
                        mounth7o3b: formatNumber(dataSplit[6].o3b),
                        mounth8o3b: formatNumber(dataSplit[7].o3b),
                        mounth9o3b: formatNumber(dataSplit[8].o3b),
                        mounth10o3b: formatNumber(dataSplit[9].o3b),
                        mounth11o3b: formatNumber(dataSplit[10].o3b),
                        mounth12o3b: formatNumber(dataSplit[11].o3b),
                        totalo3b: formatNumber(totalo3b),
                        totaltargeto3b: formatNumber(totaltargeto3b),
                        totalgapo3b: formatNumber(totalo3b - totaltargeto3b),
                        totalperco3b: formatNumber(getPrecenge(totalo3b, totaltargeto3b)) + '%',
                        target1o3b: formatNumber(target_dataSplitSecond[0].o3b),
                        target2o3b: formatNumber(target_dataSplitSecond[1].o3b),
                        target3o3b: formatNumber(target_dataSplitSecond[2].o3b),
                        target4o3b: formatNumber(target_dataSplitSecond[3].o3b),
                        target5o3b: formatNumber(target_dataSplitSecond[4].o3b),
                        target6o3b: formatNumber(target_dataSplitSecond[5].o3b),
                        target7o3b: formatNumber(target_dataSplitSecond[6].o3b),
                        target8o3b: formatNumber(target_dataSplitSecond[7].o3b),
                        target9o3b: formatNumber(target_dataSplitSecond[8].o3b),
                        target10o3b: formatNumber(target_dataSplitSecond[9].o3b),
                        target11o3b: formatNumber(target_dataSplitSecond[10].o3b),
                        target12o3b: formatNumber(target_dataSplitSecond[11].o3b),
                        totaltargeto3b: formatNumber(totaltargeto3b),
                        gap1o3b: formatNumber(dataSplitSecond[0].o3b - target_dataSplitSecond[0].o3b),
                        gap2o3b: formatNumber(dataSplitSecond[1].o3b - target_dataSplitSecond[1].o3b),
                        gap3o3b: formatNumber(dataSplitSecond[2].o3b - target_dataSplitSecond[2].o3b),
                        gap4o3b: formatNumber(dataSplitSecond[3].o3b - target_dataSplitSecond[3].o3b),
                        gap5o3b: formatNumber(dataSplitSecond[4].o3b - target_dataSplitSecond[4].o3b),
                        gap6o3b: formatNumber(dataSplitSecond[5].o3b - target_dataSplitSecond[5].o3b),
                        gap7o3b: formatNumber(dataSplitSecond[6].o3b - target_dataSplitSecond[6].o3b),
                        gap8o3b: formatNumber(dataSplitSecond[7].o3b - target_dataSplitSecond[7].o3b),
                        gap9o3b: formatNumber(dataSplitSecond[8].o3b - target_dataSplitSecond[8].o3b),
                        gap10o3b: formatNumber(dataSplitSecond[9].o3b - target_dataSplitSecond[9].o3b),
                        gap11o3b: formatNumber(dataSplitSecond[10].o3b - target_dataSplitSecond[10].o3b),
                        gap12o3b: formatNumber(dataSplitSecond[11].o3b - target_dataSplitSecond[11].o3b),
                        totalgapo3b: formatNumber(totalo3b - totaltargeto3b),
                        perc1o3b: formatNumber(getPrecenge(dataSplitSecond[0].o3b, target_dataSplitSecond[0].o3b)) + '%',
                        perc2o3b: formatNumber(getPrecenge(dataSplitSecond[1].o3b, target_dataSplitSecond[1].o3b)) + '%',
                        perc3o3b: formatNumber(getPrecenge(dataSplitSecond[2].o3b, target_dataSplitSecond[2].o3b)) + '%',
                        perc4o3b: formatNumber(getPrecenge(dataSplitSecond[3].o3b, target_dataSplitSecond[3].o3b)) + '%',
                        perc5o3b: formatNumber(getPrecenge(dataSplitSecond[4].o3b, target_dataSplitSecond[4].o3b)) + '%',
                        perc6o3b: formatNumber(getPrecenge(dataSplitSecond[5].o3b, target_dataSplitSecond[5].o3b)) + '%',
                        perc7o3b: formatNumber(getPrecenge(dataSplitSecond[6].o3b, target_dataSplitSecond[6].o3b)) + '%',
                        perc8o3b: formatNumber(getPrecenge(dataSplitSecond[7].o3b, target_dataSplitSecond[7].o3b)) + '%',
                        perc9o3b: formatNumber(getPrecenge(dataSplitSecond[8].o3b, target_dataSplitSecond[8].o3b)) + '%',
                        perc10o3b: formatNumber(getPrecenge(dataSplitSecond[9].o3b, target_dataSplitSecond[9].o3b)) + '%',
                        perc11o3b: formatNumber(getPrecenge(dataSplitSecond[10].o3b, target_dataSplitSecond[10].o3b)) + '%',
                        perc12o3b: formatNumber(getPrecenge(dataSplitSecond[11].o3b, target_dataSplitSecond[11].o3b)) + '%',
                        totalperco3b: formatNumber(getPrecenge(totalo3b, totaltargeto3b)) + '%',
                        mounth1ps: formatNumber(dataSplit[0].ps),
                        mounth2ps: formatNumber(dataSplit[1].ps),
                        mounth3ps: formatNumber(dataSplit[2].ps),
                        mounth4ps: formatNumber(dataSplit[3].ps),
                        mounth5ps: formatNumber(dataSplit[4].ps),
                        mounth6ps: formatNumber(dataSplit[5].ps),
                        mounth7ps: formatNumber(dataSplit[6].ps),
                        mounth8ps: formatNumber(dataSplit[7].ps),
                        mounth9ps: formatNumber(dataSplit[8].ps),
                        mounth10ps: formatNumber(dataSplit[9].ps),
                        mounth11ps: formatNumber(dataSplit[10].ps),
                        mounth12ps: formatNumber(dataSplit[11].ps),
                        target1ps: formatNumber(target_dataSplitSecond[0].ps),
                        target2ps: formatNumber(target_dataSplitSecond[1].ps),
                        target3ps: formatNumber(target_dataSplitSecond[2].ps),
                        target4ps: formatNumber(target_dataSplitSecond[3].ps),
                        target5ps: formatNumber(target_dataSplitSecond[4].ps),
                        target6ps: formatNumber(target_dataSplitSecond[5].ps),
                        target7ps: formatNumber(target_dataSplitSecond[6].ps),
                        target8ps: formatNumber(target_dataSplitSecond[7].ps),
                        target9ps: formatNumber(target_dataSplitSecond[8].ps),
                        target10ps: formatNumber(target_dataSplitSecond[9].ps),
                        target11ps: formatNumber(target_dataSplitSecond[10].ps),
                        target12ps: formatNumber(target_dataSplitSecond[11].ps),
                        totaltargetps: formatNumber(totaltargetps),
                        gap1ps: formatNumber(dataSplitSecond[0].ps - target_dataSplitSecond[0].ps),
                        gap2ps: formatNumber(dataSplitSecond[1].ps - target_dataSplitSecond[1].ps),
                        gap3ps: formatNumber(dataSplitSecond[2].ps - target_dataSplitSecond[2].ps),
                        gap4ps: formatNumber(dataSplitSecond[3].ps - target_dataSplitSecond[3].ps),
                        gap5ps: formatNumber(dataSplitSecond[4].ps - target_dataSplitSecond[4].ps),
                        gap6ps: formatNumber(dataSplitSecond[5].ps - target_dataSplitSecond[5].ps),
                        gap7ps: formatNumber(dataSplitSecond[6].ps - target_dataSplitSecond[6].ps),
                        gap8ps: formatNumber(dataSplitSecond[7].ps - target_dataSplitSecond[7].ps),
                        gap9ps: formatNumber(dataSplitSecond[8].ps - target_dataSplitSecond[8].ps),
                        gap10ps: formatNumber(dataSplitSecond[9].ps - target_dataSplitSecond[9].ps),
                        gap11ps: formatNumber(dataSplitSecond[10].ps - target_dataSplitSecond[10].ps),
                        gap12ps: formatNumber(dataSplitSecond[11].ps - target_dataSplitSecond[11].ps),
                        totalgapps: formatNumber(totalps - totaltargetps),
                        perc1ps: formatNumber(getPrecenge(dataSplitSecond[0].ps, target_dataSplitSecond[0].ps)) + '%',
                        perc2ps: formatNumber(getPrecenge(dataSplitSecond[1].ps, target_dataSplitSecond[1].ps)) + '%',
                        perc3ps: formatNumber(getPrecenge(dataSplitSecond[2].ps, target_dataSplitSecond[2].ps)) + '%',
                        perc4ps: formatNumber(getPrecenge(dataSplitSecond[3].ps, target_dataSplitSecond[3].ps)) + '%',
                        perc5ps: formatNumber(getPrecenge(dataSplitSecond[4].ps, target_dataSplitSecond[4].ps)) + '%',
                        perc6ps: formatNumber(getPrecenge(dataSplitSecond[5].ps, target_dataSplitSecond[5].ps)) + '%',
                        perc7ps: formatNumber(getPrecenge(dataSplitSecond[6].ps, target_dataSplitSecond[6].ps)) + '%',
                        perc8ps: formatNumber(getPrecenge(dataSplitSecond[7].ps, target_dataSplitSecond[7].ps)) + '%',
                        perc9ps: formatNumber(getPrecenge(dataSplitSecond[8].ps, target_dataSplitSecond[8].ps)) + '%',
                        perc10ps: formatNumber(getPrecenge(dataSplitSecond[9].ps, target_dataSplitSecond[9].ps)) + '%',
                        perc11ps: formatNumber(getPrecenge(dataSplitSecond[10].ps, target_dataSplitSecond[10].ps)) + '%',
                        perc12ps: formatNumber(getPrecenge(dataSplitSecond[11].ps, target_dataSplitSecond[11].ps)) + '%',
                        totalpercps: formatNumber(getPrecenge(totalps, totaltargetps)) + '%',
                        mounth1sr: formatNumber(dataSplit[0].sr),
                        mounth2sr: formatNumber(dataSplit[1].sr),
                        mounth3sr: formatNumber(dataSplit[2].sr),
                        mounth4sr: formatNumber(dataSplit[3].sr),
                        mounth5sr: formatNumber(dataSplit[4].sr),
                        mounth6sr: formatNumber(dataSplit[5].sr),
                        mounth7sr: formatNumber(dataSplit[6].sr),
                        mounth8sr: formatNumber(dataSplit[7].sr),
                        mounth9sr: formatNumber(dataSplit[8].sr),
                        mounth10sr: formatNumber(dataSplit[9].sr),
                        mounth11sr: formatNumber(dataSplit[10].sr),
                        mounth12sr: formatNumber(dataSplit[11].sr),
                        totalsr: formatNumber(totalsr),
                        totaltargetsr: formatNumber(totaltargetsr),
                        totalgapsr: formatNumber(totalsr - totaltargetsr),
                        totalpercsr: formatNumber(getPrecenge(totalsr, totaltargetsr)) + '%',
                        target1sr: formatNumber(target_dataSplitSecond[0].sr),
                        target2sr: formatNumber(target_dataSplitSecond[1].sr),
                        target3sr: formatNumber(target_dataSplitSecond[2].sr),
                        target4sr: formatNumber(target_dataSplitSecond[3].sr),
                        target5sr: formatNumber(target_dataSplitSecond[4].sr),
                        target6sr: formatNumber(target_dataSplitSecond[5].sr),
                        target7sr: formatNumber(target_dataSplitSecond[6].sr),
                        target8sr: formatNumber(target_dataSplitSecond[7].sr),
                        target9sr: formatNumber(target_dataSplitSecond[8].sr),
                        target10sr: formatNumber(target_dataSplitSecond[9].sr),
                        target11sr: formatNumber(target_dataSplitSecond[10].sr),
                        target12sr: formatNumber(target_dataSplitSecond[11].sr),
                        totaltargetsr: formatNumber(totaltargetsr),
                        gap1sr: formatNumber(dataSplitSecond[0].sr - target_dataSplitSecond[0].sr),
                        gap2sr: formatNumber(dataSplitSecond[1].sr - target_dataSplitSecond[1].sr),
                        gap3sr: formatNumber(dataSplitSecond[2].sr - target_dataSplitSecond[2].sr),
                        gap4sr: formatNumber(dataSplitSecond[3].sr - target_dataSplitSecond[3].sr),
                        gap5sr: formatNumber(dataSplitSecond[4].sr - target_dataSplitSecond[4].sr),
                        gap6sr: formatNumber(dataSplitSecond[5].sr - target_dataSplitSecond[5].sr),
                        gap7sr: formatNumber(dataSplitSecond[6].sr - target_dataSplitSecond[6].sr),
                        gap8sr: formatNumber(dataSplitSecond[7].sr - target_dataSplitSecond[7].sr),
                        gap9sr: formatNumber(dataSplitSecond[8].sr - target_dataSplitSecond[8].sr),
                        gap10sr: formatNumber(dataSplitSecond[9].sr - target_dataSplitSecond[9].sr),
                        gap11sr: formatNumber(dataSplitSecond[10].sr - target_dataSplitSecond[10].sr),
                        gap12sr: formatNumber(dataSplitSecond[11].sr - target_dataSplitSecond[11].sr),
                        totalgapsr: formatNumber(totalsr - totaltargetsr),
                        perc1sr: formatNumber(getPrecenge(dataSplitSecond[0].sr, target_dataSplitSecond[0].sr)) + '%',
                        perc2sr: formatNumber(getPrecenge(dataSplitSecond[1].sr, target_dataSplitSecond[1].sr)) + '%',
                        perc3sr: formatNumber(getPrecenge(dataSplitSecond[2].sr, target_dataSplitSecond[2].sr)) + '%',
                        perc4sr: formatNumber(getPrecenge(dataSplitSecond[3].sr, target_dataSplitSecond[3].sr)) + '%',
                        perc5sr: formatNumber(getPrecenge(dataSplitSecond[4].sr, target_dataSplitSecond[4].sr)) + '%',
                        perc6sr: formatNumber(getPrecenge(dataSplitSecond[5].sr, target_dataSplitSecond[5].sr)) + '%',
                        perc7sr: formatNumber(getPrecenge(dataSplitSecond[6].sr, target_dataSplitSecond[6].sr)) + '%',
                        perc8sr: formatNumber(getPrecenge(dataSplitSecond[7].sr, target_dataSplitSecond[7].sr)) + '%',
                        perc9sr: formatNumber(getPrecenge(dataSplitSecond[8].sr, target_dataSplitSecond[8].sr)) + '%',
                        perc10sr: formatNumber(getPrecenge(dataSplitSecond[9].sr, target_dataSplitSecond[9].sr)) + '%',
                        perc11sr: formatNumber(getPrecenge(dataSplitSecond[10].sr, target_dataSplitSecond[10].sr)) + '%',
                        perc12sr: formatNumber(getPrecenge(dataSplitSecond[11].sr, target_dataSplitSecond[11].sr)) + '%',
                        totalpercsr: formatNumber(getPrecenge(totalsr, totaltargetsr)) + '%',
                        mounth1hw: formatNumber(dataSplit[0].hw),
                        mounth2hw: formatNumber(dataSplit[1].hw),
                        mounth3hw: formatNumber(dataSplit[2].hw),
                        mounth4hw: formatNumber(dataSplit[3].hw),
                        mounth5hw: formatNumber(dataSplit[4].hw),
                        mounth6hw: formatNumber(dataSplit[5].hw),
                        mounth7hw: formatNumber(dataSplit[6].hw),
                        mounth8hw: formatNumber(dataSplit[7].hw),
                        mounth9hw: formatNumber(dataSplit[8].hw),
                        mounth10hw: formatNumber(dataSplit[9].hw),
                        mounth11hw: formatNumber(dataSplit[10].hw),
                        mounth12hw: formatNumber(dataSplit[11].hw),
                        totalhw: formatNumber(totalhw),
                        totaltargethw: formatNumber(totaltargethw),
                        totalgaphw: formatNumber(totalhw - totaltargethw),
                        totalperchw: formatNumber(getPrecenge(totalhw, totaltargethw)) + '%',
                        target1hw: formatNumber(target_dataSplitSecond[0].hw),
                        target2hw: formatNumber(target_dataSplitSecond[1].hw),
                        target3hw: formatNumber(target_dataSplitSecond[2].hw),
                        target4hw: formatNumber(target_dataSplitSecond[3].hw),
                        target5hw: formatNumber(target_dataSplitSecond[4].hw),
                        target6hw: formatNumber(target_dataSplitSecond[5].hw),
                        target7hw: formatNumber(target_dataSplitSecond[6].hw),
                        target8hw: formatNumber(target_dataSplitSecond[7].hw),
                        target9hw: formatNumber(target_dataSplitSecond[8].hw),
                        target10hw: formatNumber(target_dataSplitSecond[9].hw),
                        target11hw: formatNumber(target_dataSplitSecond[10].hw),
                        target12hw: formatNumber(target_dataSplitSecond[11].hw),
                        totaltargethw: formatNumber(totaltargethw),
                        gap1hw: formatNumber(dataSplitSecond[0].hw - target_dataSplitSecond[0].hw),
                        gap2hw: formatNumber(dataSplitSecond[1].hw - target_dataSplitSecond[1].hw),
                        gap3hw: formatNumber(dataSplitSecond[2].hw - target_dataSplitSecond[2].hw),
                        gap4hw: formatNumber(dataSplitSecond[3].hw - target_dataSplitSecond[3].hw),
                        gap5hw: formatNumber(dataSplitSecond[4].hw - target_dataSplitSecond[4].hw),
                        gap6hw: formatNumber(dataSplitSecond[5].hw - target_dataSplitSecond[5].hw),
                        gap7hw: formatNumber(dataSplitSecond[6].hw - target_dataSplitSecond[6].hw),
                        gap8hw: formatNumber(dataSplitSecond[7].hw - target_dataSplitSecond[7].hw),
                        gap9hw: formatNumber(dataSplitSecond[8].hw - target_dataSplitSecond[8].hw),
                        gap10hw: formatNumber(dataSplitSecond[9].hw - target_dataSplitSecond[9].hw),
                        gap11hw: formatNumber(dataSplitSecond[10].hw - target_dataSplitSecond[10].hw),
                        gap12hw: formatNumber(dataSplitSecond[11].hw - target_dataSplitSecond[11].hw),
                        totalgaphw: formatNumber(totalhw - totaltargethw),
                        perc1hw: formatNumber(getPrecenge(dataSplitSecond[0].hw, target_dataSplitSecond[0].hw)) + '%',
                        perc2hw: formatNumber(getPrecenge(dataSplitSecond[1].hw, target_dataSplitSecond[1].hw)) + '%',
                        perc3hw: formatNumber(getPrecenge(dataSplitSecond[2].hw, target_dataSplitSecond[2].hw)) + '%',
                        perc4hw: formatNumber(getPrecenge(dataSplitSecond[3].hw, target_dataSplitSecond[3].hw)) + '%',
                        perc5hw: formatNumber(getPrecenge(dataSplitSecond[4].hw, target_dataSplitSecond[4].hw)) + '%',
                        perc6hw: formatNumber(getPrecenge(dataSplitSecond[5].hw, target_dataSplitSecond[5].hw)) + '%',
                        perc7hw: formatNumber(getPrecenge(dataSplitSecond[6].hw, target_dataSplitSecond[6].hw)) + '%',
                        perc8hw: formatNumber(getPrecenge(dataSplitSecond[7].hw, target_dataSplitSecond[7].hw)) + '%',
                        perc9hw: formatNumber(getPrecenge(dataSplitSecond[8].hw, target_dataSplitSecond[8].hw)) + '%',
                        perc10hw: formatNumber(getPrecenge(dataSplitSecond[9].hw, target_dataSplitSecond[9].hw)) + '%',
                        perc11hw: formatNumber(getPrecenge(dataSplitSecond[10].hw, target_dataSplitSecond[10].hw)) + '%',
                        perc12hw: formatNumber(getPrecenge(dataSplitSecond[11].hw, target_dataSplitSecond[11].hw)) + '%',
                        totalperchw: formatNumber(getPrecenge(totalhw, totaltargethw)) + '%',
                        mounth1dhls_hw: formatNumber(dataSplit[0].dhls_hw),
                        mounth2dhls_hw: formatNumber(dataSplit[1].dhls_hw),
                        mounth3dhls_hw: formatNumber(dataSplit[2].dhls_hw),
                        mounth4dhls_hw: formatNumber(dataSplit[3].dhls_hw),
                        mounth5dhls_hw: formatNumber(dataSplit[4].dhls_hw),
                        mounth6dhls_hw: formatNumber(dataSplit[5].dhls_hw),
                        mounth7dhls_hw: formatNumber(dataSplit[6].dhls_hw),
                        mounth8dhls_hw: formatNumber(dataSplit[7].dhls_hw),
                        mounth9dhls_hw: formatNumber(dataSplit[8].dhls_hw),
                        mounth10dhls_hw: formatNumber(dataSplit[9].dhls_hw),
                        mounth11dhls_hw: formatNumber(dataSplit[10].dhls_hw),
                        mounth12dhls_hw: formatNumber(dataSplit[11].dhls_hw),
                        totaldhls_hw: formatNumber(totaldhls_hw),
                        totaltargetdhls_hw: formatNumber(totaltargetdhls_hw),
                        totalgapdhls_hw: formatNumber(totaldhls_hw - totaltargetdhls_hw),
                        totalpercdhls_hw: formatNumber(getPrecenge(totaldhls_hw, totaltargetdhls_hw)) + '%',
                        target1dhls_hw: formatNumber(target_dataSplitSecond[0].dhls_hw),
                        target2dhls_hw: formatNumber(target_dataSplitSecond[1].dhls_hw),
                        target3dhls_hw: formatNumber(target_dataSplitSecond[2].dhls_hw),
                        target4dhls_hw: formatNumber(target_dataSplitSecond[3].dhls_hw),
                        target5dhls_hw: formatNumber(target_dataSplitSecond[4].dhls_hw),
                        target6dhls_hw: formatNumber(target_dataSplitSecond[5].dhls_hw),
                        target7dhls_hw: formatNumber(target_dataSplitSecond[6].dhls_hw),
                        target8dhls_hw: formatNumber(target_dataSplitSecond[7].dhls_hw),
                        target9dhls_hw: formatNumber(target_dataSplitSecond[8].dhls_hw),
                        target10dhls_hw: formatNumber(target_dataSplitSecond[9].dhls_hw),
                        target11dhls_hw: formatNumber(target_dataSplitSecond[10].dhls_hw),
                        target12dhls_hw: formatNumber(target_dataSplitSecond[11].dhls_hw),
                        totaltargetdhls_hw: formatNumber(totaltargetdhls_hw),
                        gap1dhls_hw: formatNumber(dataSplitSecond[0].dhls_hw - target_dataSplitSecond[0].dhls_hw),
                        gap2dhls_hw: formatNumber(dataSplitSecond[1].dhls_hw - target_dataSplitSecond[1].dhls_hw),
                        gap3dhls_hw: formatNumber(dataSplitSecond[2].dhls_hw - target_dataSplitSecond[2].dhls_hw),
                        gap4dhls_hw: formatNumber(dataSplitSecond[3].dhls_hw - target_dataSplitSecond[3].dhls_hw),
                        gap5dhls_hw: formatNumber(dataSplitSecond[4].dhls_hw - target_dataSplitSecond[4].dhls_hw),
                        gap6dhls_hw: formatNumber(dataSplitSecond[5].dhls_hw - target_dataSplitSecond[5].dhls_hw),
                        gap7dhls_hw: formatNumber(dataSplitSecond[6].dhls_hw - target_dataSplitSecond[6].dhls_hw),
                        gap8dhls_hw: formatNumber(dataSplitSecond[7].dhls_hw - target_dataSplitSecond[7].dhls_hw),
                        gap9dhls_hw: formatNumber(dataSplitSecond[8].dhls_hw - target_dataSplitSecond[8].dhls_hw),
                        gap10dhls_hw: formatNumber(dataSplitSecond[9].dhls_hw - target_dataSplitSecond[9].dhls_hw),
                        gap11dhls_hw: formatNumber(dataSplitSecond[10].dhls_hw - target_dataSplitSecond[10].dhls_hw),
                        gap12dhls_hw: formatNumber(dataSplitSecond[11].dhls_hw - target_dataSplitSecond[11].dhls_hw),
                        totalgapdhls_hw: formatNumber(totaldhls_hw - totaltargetdhls_hw),
                        perc1dhls_hw: formatNumber(getPrecenge(dataSplitSecond[0].dhls_hw, target_dataSplitSecond[0].dhls_hw)) + '%',
                        perc2dhls_hw: formatNumber(getPrecenge(dataSplitSecond[1].dhls_hw, target_dataSplitSecond[1].dhls_hw)) + '%',
                        perc3dhls_hw: formatNumber(getPrecenge(dataSplitSecond[2].dhls_hw, target_dataSplitSecond[2].dhls_hw)) + '%',
                        perc4dhls_hw: formatNumber(getPrecenge(dataSplitSecond[3].dhls_hw, target_dataSplitSecond[3].dhls_hw)) + '%',
                        perc5dhls_hw: formatNumber(getPrecenge(dataSplitSecond[4].dhls_hw, target_dataSplitSecond[4].dhls_hw)) + '%',
                        perc6dhls_hw: formatNumber(getPrecenge(dataSplitSecond[5].dhls_hw, target_dataSplitSecond[5].dhls_hw)) + '%',
                        perc7dhls_hw: formatNumber(getPrecenge(dataSplitSecond[6].dhls_hw, target_dataSplitSecond[6].dhls_hw)) + '%',
                        perc8dhls_hw: formatNumber(getPrecenge(dataSplitSecond[7].dhls_hw, target_dataSplitSecond[7].dhls_hw)) + '%',
                        perc9dhls_hw: formatNumber(getPrecenge(dataSplitSecond[8].dhls_hw, target_dataSplitSecond[8].dhls_hw)) + '%',
                        perc10dhls_hw: formatNumber(getPrecenge(dataSplitSecond[9].dhls_hw, target_dataSplitSecond[9].dhls_hw)) + '%',
                        perc11dhls_hw: formatNumber(getPrecenge(dataSplitSecond[10].dhls_hw, target_dataSplitSecond[10].dhls_hw)) + '%',
                        perc12dhls_hw: formatNumber(getPrecenge(dataSplitSecond[11].dhls_hw, target_dataSplitSecond[11].dhls_hw)) + '%',
                        totalpercdhls_hw: formatNumber(getPrecenge(totaldhls_hw, totaltargetdhls_hw)) + '%',
                        mounth1gt: formatNumber(dataSplit[0].gt),
                        mounth2gt: formatNumber(dataSplit[1].gt),
                        mounth3gt: formatNumber(dataSplit[2].gt),
                        mounth4gt: formatNumber(dataSplit[3].gt),
                        mounth5gt: formatNumber(dataSplit[4].gt),
                        mounth6gt: formatNumber(dataSplit[5].gt),
                        mounth7gt: formatNumber(dataSplit[6].gt),
                        mounth8gt: formatNumber(dataSplit[7].gt),
                        mounth9gt: formatNumber(dataSplit[8].gt),
                        mounth10gt: formatNumber(dataSplit[9].gt),
                        mounth11gt: formatNumber(dataSplit[10].gt),
                        mounth12gt: formatNumber(dataSplit[11].gt),
                        totalgt: formatNumber(totalgt),
                        totaltargetgt: formatNumber(totaltargetgt),
                        totalgapgt: formatNumber(totalgt - totaltargetgt),
                        totalpercgt: formatNumber(getPrecenge(totalgt, totaltargetgt)) + '%',
                        target1gt: formatNumber(target_dataSplitSecond[0].gt),
                        target2gt: formatNumber(target_dataSplitSecond[1].gt),
                        target3gt: formatNumber(target_dataSplitSecond[2].gt),
                        target4gt: formatNumber(target_dataSplitSecond[3].gt),
                        target5gt: formatNumber(target_dataSplitSecond[4].gt),
                        target6gt: formatNumber(target_dataSplitSecond[5].gt),
                        target7gt: formatNumber(target_dataSplitSecond[6].gt),
                        target8gt: formatNumber(target_dataSplitSecond[7].gt),
                        target9gt: formatNumber(target_dataSplitSecond[8].gt),
                        target10gt: formatNumber(target_dataSplitSecond[9].gt),
                        target11gt: formatNumber(target_dataSplitSecond[10].gt),
                        target12gt: formatNumber(target_dataSplitSecond[11].gt),
                        totaltargetgt: formatNumber(totaltargetgt),
                        gap1gt: formatNumber(dataSplitSecond[0].gt - target_dataSplitSecond[0].gt),
                        gap2gt: formatNumber(dataSplitSecond[1].gt - target_dataSplitSecond[1].gt),
                        gap3gt: formatNumber(dataSplitSecond[2].gt - target_dataSplitSecond[2].gt),
                        gap4gt: formatNumber(dataSplitSecond[3].gt - target_dataSplitSecond[3].gt),
                        gap5gt: formatNumber(dataSplitSecond[4].gt - target_dataSplitSecond[4].gt),
                        gap6gt: formatNumber(dataSplitSecond[5].gt - target_dataSplitSecond[5].gt),
                        gap7gt: formatNumber(dataSplitSecond[6].gt - target_dataSplitSecond[6].gt),
                        gap8gt: formatNumber(dataSplitSecond[7].gt - target_dataSplitSecond[7].gt),
                        gap9gt: formatNumber(dataSplitSecond[8].gt - target_dataSplitSecond[8].gt),
                        gap10gt: formatNumber(dataSplitSecond[9].gt - target_dataSplitSecond[9].gt),
                        gap11gt: formatNumber(dataSplitSecond[10].gt - target_dataSplitSecond[10].gt),
                        gap12gt: formatNumber(dataSplitSecond[11].gt - target_dataSplitSecond[11].gt),
                        totalgapgt: formatNumber(totalgt - totaltargetgt),
                        perc1gt: formatNumber(getPrecenge(dataSplitSecond[0].gt, target_dataSplitSecond[0].gt)) + '%',
                        perc2gt: formatNumber(getPrecenge(dataSplitSecond[1].gt, target_dataSplitSecond[1].gt)) + '%',
                        perc3gt: formatNumber(getPrecenge(dataSplitSecond[2].gt, target_dataSplitSecond[2].gt)) + '%',
                        perc4gt: formatNumber(getPrecenge(dataSplitSecond[3].gt, target_dataSplitSecond[3].gt)) + '%',
                        perc5gt: formatNumber(getPrecenge(dataSplitSecond[4].gt, target_dataSplitSecond[4].gt)) + '%',
                        perc6gt: formatNumber(getPrecenge(dataSplitSecond[5].gt, target_dataSplitSecond[5].gt)) + '%',
                        perc7gt: formatNumber(getPrecenge(dataSplitSecond[6].gt, target_dataSplitSecond[6].gt)) + '%',
                        perc8gt: formatNumber(getPrecenge(dataSplitSecond[7].gt, target_dataSplitSecond[7].gt)) + '%',
                        perc9gt: formatNumber(getPrecenge(dataSplitSecond[8].gt, target_dataSplitSecond[8].gt)) + '%',
                        perc10gt: formatNumber(getPrecenge(dataSplitSecond[9].gt, target_dataSplitSecond[9].gt)) + '%',
                        perc11gt: formatNumber(getPrecenge(dataSplitSecond[10].gt, target_dataSplitSecond[10].gt)) + '%',
                        perc12gt: formatNumber(getPrecenge(dataSplitSecond[11].gt, target_dataSplitSecond[11].gt)) + '%',
                        totalpercgt: formatNumber(getPrecenge(totalgt, totaltargetgt)) + '%',
                        mounth1general: formatNumber(dataSplit[0].general),
                        mounth2general: formatNumber(dataSplit[1].general),
                        mounth3general: formatNumber(dataSplit[2].general),
                        mounth4general: formatNumber(dataSplit[3].general),
                        mounth5general: formatNumber(dataSplit[4].general),
                        mounth6general: formatNumber(dataSplit[5].general),
                        mounth7general: formatNumber(dataSplit[6].general),
                        mounth8general: formatNumber(dataSplit[7].general),
                        mounth9general: formatNumber(dataSplit[8].general),
                        mounth10general: formatNumber(dataSplit[9].general),
                        mounth11general: formatNumber(dataSplit[10].general),
                        mounth12general: formatNumber(dataSplit[11].general),
                        target1general: formatNumber(target_dataSplitSecond[0].general),
                        target2general: formatNumber(target_dataSplitSecond[1].general),
                        target3general: formatNumber(target_dataSplitSecond[2].general),
                        target4general: formatNumber(target_dataSplitSecond[3].general),
                        target5general: formatNumber(target_dataSplitSecond[4].general),
                        target6general: formatNumber(target_dataSplitSecond[5].general),
                        target7general: formatNumber(target_dataSplitSecond[6].general),
                        target8general: formatNumber(target_dataSplitSecond[7].general),
                        target9general: formatNumber(target_dataSplitSecond[8].general),
                        target10general: formatNumber(target_dataSplitSecond[9].general),
                        target11general: formatNumber(target_dataSplitSecond[10].general),
                        target12general: formatNumber(target_dataSplitSecond[11].general),
                        totaltargetgeneral: formatNumber(totaltargetgeneral),
                        gap1general: formatNumber(dataSplitSecond[0].general - target_dataSplitSecond[0].general),
                        gap2general: formatNumber(dataSplitSecond[1].general - target_dataSplitSecond[1].general),
                        gap3general: formatNumber(dataSplitSecond[2].general - target_dataSplitSecond[2].general),
                        gap4general: formatNumber(dataSplitSecond[3].general - target_dataSplitSecond[3].general),
                        gap5general: formatNumber(dataSplitSecond[4].general - target_dataSplitSecond[4].general),
                        gap6general: formatNumber(dataSplitSecond[5].general - target_dataSplitSecond[5].general),
                        gap7general: formatNumber(dataSplitSecond[6].general - target_dataSplitSecond[6].general),
                        gap8general: formatNumber(dataSplitSecond[7].general - target_dataSplitSecond[7].general),
                        gap9general: formatNumber(dataSplitSecond[8].general - target_dataSplitSecond[8].general),
                        gap10general: formatNumber(dataSplitSecond[9].general - target_dataSplitSecond[9].general),
                        gap11general: formatNumber(dataSplitSecond[10].general - target_dataSplitSecond[10].general),
                        gap12general: formatNumber(dataSplitSecond[11].general - target_dataSplitSecond[11].general),
                        totalgapgeneral: formatNumber(totalgeneral - totaltargetgeneral),
                        perc1general: formatNumber(getPrecenge(dataSplitSecond[0].general, target_dataSplitSecond[0].general)) + '%',
                        perc2general: formatNumber(getPrecenge(dataSplitSecond[1].general, target_dataSplitSecond[1].general)) + '%',
                        perc3general: formatNumber(getPrecenge(dataSplitSecond[2].general, target_dataSplitSecond[2].general)) + '%',
                        perc4general: formatNumber(getPrecenge(dataSplitSecond[3].general, target_dataSplitSecond[3].general)) + '%',
                        perc5general: formatNumber(getPrecenge(dataSplitSecond[4].general, target_dataSplitSecond[4].general)) + '%',
                        perc6general: formatNumber(getPrecenge(dataSplitSecond[5].general, target_dataSplitSecond[5].general)) + '%',
                        perc7general: formatNumber(getPrecenge(dataSplitSecond[6].general, target_dataSplitSecond[6].general)) + '%',
                        perc8general: formatNumber(getPrecenge(dataSplitSecond[7].general, target_dataSplitSecond[7].general)) + '%',
                        perc9general: formatNumber(getPrecenge(dataSplitSecond[8].general, target_dataSplitSecond[8].general)) + '%',
                        perc10general: formatNumber(getPrecenge(dataSplitSecond[9].general, target_dataSplitSecond[9].general)) + '%',
                        perc11general: formatNumber(getPrecenge(dataSplitSecond[10].general, target_dataSplitSecond[10].general)) + '%',
                        perc12general: formatNumber(getPrecenge(dataSplitSecond[11].general, target_dataSplitSecond[11].general)) + '%',
                        totalpercgeneral: formatNumber(getPrecenge(totalgeneral, totaltargetgeneral)) + '%',
                    });
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
                var data = allSelection[i].getValue("custrecord_sr_amounts")
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var target_dataSplitSecond = splitTargetAmountSecondPf(data)

                var quoarterly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs;
                var quoarterly2bbs = dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var quoarterly3bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs;
                var quoarterly4bbs = dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var quoarterlybbs = quoarterly1bbs + quoarterly2bbs + quoarterly3bbs + quoarterly4bbs;
                var target1bbs = target_dataSplitSecond[0].bbs + target_dataSplitSecond[1].bbs + target_dataSplitSecond[2].bbs;
                var target2bbs = target_dataSplitSecond[3].bbs + target_dataSplitSecond[4].bbs + target_dataSplitSecond[5].bbs;
                var target3bbs = target_dataSplitSecond[6].bbs + target_dataSplitSecond[7].bbs + target_dataSplitSecond[8].bbs;
                var target4bbs = target_dataSplitSecond[9].bbs + target_dataSplitSecond[10].bbs + target_dataSplitSecond[11].bbs;
                var targetbbs = target1bbs + target2bbs + target3bbs + target4bbs;

                var quoarterly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas;
                var quoarterly2vas = dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var quoarterly3vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas;
                var quoarterly4vas = dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var quoarterlyvas = quoarterly1vas + quoarterly2vas + quoarterly3vas + quoarterly4vas;
                var target1vas = target_dataSplitSecond[0].vas + target_dataSplitSecond[1].vas + target_dataSplitSecond[2].vas;
                var target2vas = target_dataSplitSecond[3].vas + target_dataSplitSecond[4].vas + target_dataSplitSecond[5].vas;
                var target3vas = target_dataSplitSecond[6].vas + target_dataSplitSecond[7].vas + target_dataSplitSecond[8].vas;
                var target4vas = target_dataSplitSecond[9].vas + target_dataSplitSecond[10].vas + target_dataSplitSecond[11].vas;
                var targetvas = target1vas + target2vas + target3vas + target4vas;

                var quoarterly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod;
                var quoarterly2bod = dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;
                var quoarterly3bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod;
                var quoarterly4bod = dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var quoarterlybod = quoarterly1bod + quoarterly2bod + quoarterly3bod + quoarterly4bod;
                var target1bod = target_dataSplitSecond[0].bod + target_dataSplitSecond[1].bod + target_dataSplitSecond[2].bod;
                var target2bod = target_dataSplitSecond[3].bod + target_dataSplitSecond[4].bod + target_dataSplitSecond[5].bod;
                var target3bod = target_dataSplitSecond[6].bod + target_dataSplitSecond[7].bod + target_dataSplitSecond[8].bod;
                var target4bod = target_dataSplitSecond[9].bod + target_dataSplitSecond[10].bod + target_dataSplitSecond[11].bod;
                var targetbod = target1bod + target2bod + target3bod + target4bod;

                var quoarterly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband;
                var quoarterly2cband = dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var quoarterly3cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband;
                var quoarterly4cband = dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var quoarterlycband = quoarterly1cband + quoarterly2cband + quoarterly3cband + quoarterly4cband;
                var target1cband = target_dataSplitSecond[0].cband + target_dataSplitSecond[1].cband + target_dataSplitSecond[2].cband;
                var target2cband = target_dataSplitSecond[3].cband + target_dataSplitSecond[4].cband + target_dataSplitSecond[5].cband;
                var target3cband = target_dataSplitSecond[6].cband + target_dataSplitSecond[7].cband + target_dataSplitSecond[8].cband;
                var target4cband = target_dataSplitSecond[9].cband + target_dataSplitSecond[10].cband + target_dataSplitSecond[11].cband;
                var targetcband = target1cband + target2cband + target3cband + target4cband;

                var quoarterly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic;
                var quoarterly2domestic = dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var quoarterly3domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic;
                var quoarterly4domestic = dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var quoarterlydomestic = quoarterly1domestic + quoarterly2domestic + quoarterly3domestic + quoarterly4domestic;
                var target1domestic = target_dataSplitSecond[0].domestic + target_dataSplitSecond[1].domestic + target_dataSplitSecond[2].domestic;
                var target2domestic = target_dataSplitSecond[3].domestic + target_dataSplitSecond[4].domestic + target_dataSplitSecond[5].domestic;
                var target3domestic = target_dataSplitSecond[6].domestic + target_dataSplitSecond[7].domestic + target_dataSplitSecond[8].domestic;
                var target4domestic = target_dataSplitSecond[9].domestic + target_dataSplitSecond[10].domestic + target_dataSplitSecond[11].domestic;
                var targetdomestic = target1domestic + target2domestic + target3domestic + target4domestic;

                var quoarterly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip;
                var quoarterly2ip = dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var quoarterly3ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip;
                var quoarterly4ip = dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var quoarterlyip = quoarterly1ip + quoarterly2ip + quoarterly3ip + quoarterly4ip;
                var target1ip = target_dataSplitSecond[0].ip + target_dataSplitSecond[1].ip + target_dataSplitSecond[2].ip;
                var target2ip = target_dataSplitSecond[3].ip + target_dataSplitSecond[4].ip + target_dataSplitSecond[5].ip;
                var target3ip = target_dataSplitSecond[6].ip + target_dataSplitSecond[7].ip + target_dataSplitSecond[8].ip;
                var target4ip = target_dataSplitSecond[9].ip + target_dataSplitSecond[10].ip + target_dataSplitSecond[11].ip;
                var targetip = target1ip + target2ip + target3ip + target4ip;

                var quoarterly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru;
                var quoarterly2iru = dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var quoarterly3iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru;
                var quoarterly4iru = dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var quoarterlyiru = quoarterly1iru + quoarterly2iru + quoarterly3iru + quoarterly4iru;
                var target1iru = target_dataSplitSecond[0].iru + target_dataSplitSecond[1].iru + target_dataSplitSecond[2].iru;
                var target2iru = target_dataSplitSecond[3].iru + target_dataSplitSecond[4].iru + target_dataSplitSecond[5].iru;
                var target3iru = target_dataSplitSecond[6].iru + target_dataSplitSecond[7].iru + target_dataSplitSecond[8].iru;
                var target4iru = target_dataSplitSecond[9].iru + target_dataSplitSecond[10].iru + target_dataSplitSecond[11].iru;
                var targetiru = target1iru + target2iru + target3iru + target4iru;

                var quoarterly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband;
                var quoarterly2kuband = dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var quoarterly3kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband;
                var quoarterly4kuband = dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var quoarterlykuband = quoarterly1kuband + quoarterly2kuband + quoarterly3kuband + quoarterly4kuband;
                var target1kuband = target_dataSplitSecond[0].kuband + target_dataSplitSecond[1].kuband + target_dataSplitSecond[2].kuband;
                var target2kuband = target_dataSplitSecond[3].kuband + target_dataSplitSecond[4].kuband + target_dataSplitSecond[5].kuband;
                var target3kuband = target_dataSplitSecond[6].kuband + target_dataSplitSecond[7].kuband + target_dataSplitSecond[8].kuband;
                var target4kuband = target_dataSplitSecond[9].kuband + target_dataSplitSecond[10].kuband + target_dataSplitSecond[11].kuband;
                var targetkuband = target1kuband + target2kuband + target3kuband + target4kuband;

                var quoarterly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat;
                var quoarterly2mobile_vsat = dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var quoarterly3mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat;
                var quoarterly4mobile_vsat = dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var quoarterlymobile_vsat = quoarterly1mobile_vsat + quoarterly2mobile_vsat + quoarterly3mobile_vsat + quoarterly4mobile_vsat
                var target1mobile_vsat = target_dataSplitSecond[0].mobile_vsat + target_dataSplitSecond[1].mobile_vsat + target_dataSplitSecond[2].mobile_vsat;
                var target2mobile_vsat = target_dataSplitSecond[3].mobile_vsat + target_dataSplitSecond[4].mobile_vsat + target_dataSplitSecond[5].mobile_vsat;
                var target3mobile_vsat = target_dataSplitSecond[6].mobile_vsat + target_dataSplitSecond[7].mobile_vsat + target_dataSplitSecond[8].mobile_vsat;
                var target4mobile_vsat = target_dataSplitSecond[9].mobile_vsat + target_dataSplitSecond[10].mobile_vsat + target_dataSplitSecond[11].mobile_vsat;
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat + target3mobile_vsat + target4mobile_vsat

                var quoarterly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip;
                var quoarterly2mpip = dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var quoarterly3mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip;
                var quoarterly4mpip = dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var quoarterlympip = quoarterly1mpip + quoarterly2mpip + quoarterly3mpip + quoarterly4mpip;
                var target1mpip = target_dataSplitSecond[0].mpip + target_dataSplitSecond[1].mpip + target_dataSplitSecond[2].mpip;
                var target2mpip = target_dataSplitSecond[3].mpip + target_dataSplitSecond[4].mpip + target_dataSplitSecond[5].mpip;
                var target3mpip = target_dataSplitSecond[6].mpip + target_dataSplitSecond[7].mpip + target_dataSplitSecond[8].mpip;
                var target4mpip = target_dataSplitSecond[9].mpip + target_dataSplitSecond[10].mpip + target_dataSplitSecond[11].mpip;
                var targetmpip = target1mpip + target2mpip + target3mpip + target4mpip

                var quoarterly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b;
                var quoarterly2o3b = dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var quoarterly3o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b;
                var quoarterly4o3b = dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var quoarterlyo3b = quoarterly1o3b + quoarterly2o3b + quoarterly3o3b + quoarterly4o3b
                var target1o3b = target_dataSplitSecond[0].o3b + target_dataSplitSecond[1].o3b + target_dataSplitSecond[2].o3b;
                var target2o3b = target_dataSplitSecond[3].o3b + target_dataSplitSecond[4].o3b + target_dataSplitSecond[5].o3b;
                var target3o3b = target_dataSplitSecond[6].o3b + target_dataSplitSecond[7].o3b + target_dataSplitSecond[8].o3b;
                var target4o3b = target_dataSplitSecond[9].o3b + target_dataSplitSecond[10].o3b + target_dataSplitSecond[11].o3b;
                var targeto3b = target1o3b + target2o3b + target3o3b + target4o3b;

                var quoarterly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps;
                var quoarterly2ps = dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var quoarterly3ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps;
                var quoarterly4ps = dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var quoarterlyps = quoarterly1ps + quoarterly2ps + quoarterly3ps + quoarterly4ps
                var target1ps = target_dataSplitSecond[0].ps + target_dataSplitSecond[1].ps + target_dataSplitSecond[2].ps;
                var target2ps = target_dataSplitSecond[3].ps + target_dataSplitSecond[4].ps + target_dataSplitSecond[5].ps;
                var target3ps = target_dataSplitSecond[6].ps + target_dataSplitSecond[7].ps + target_dataSplitSecond[8].ps;
                var target4ps = target_dataSplitSecond[9].ps + target_dataSplitSecond[10].ps + target_dataSplitSecond[11].ps;
                var targetps = target1ps + target2ps + target3ps + target4ps;

                var quoarterly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr;
                var quoarterly2sr = dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var quoarterly3sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr;
                var quoarterly4sr = dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var quoarterlysr = quoarterly1sr + quoarterly2sr + quoarterly3sr + quoarterly4sr
                var target1sr = target_dataSplitSecond[0].sr + target_dataSplitSecond[1].sr + target_dataSplitSecond[2].sr;
                var target2sr = target_dataSplitSecond[3].sr + target_dataSplitSecond[4].sr + target_dataSplitSecond[5].sr;
                var target3sr = target_dataSplitSecond[6].sr + target_dataSplitSecond[7].sr + target_dataSplitSecond[8].sr;
                var target4sr = target_dataSplitSecond[9].sr + target_dataSplitSecond[10].sr + target_dataSplitSecond[11].sr;
                var targetsr = target1sr + target2sr + target3sr + target4sr;

                var quoarterly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw;
                var quoarterly2hw = dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var quoarterly3hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw;
                var quoarterly4hw = dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var quoarterlyhw = quoarterly1hw + quoarterly2hw + quoarterly3hw + quoarterly4hw;
                var target1hw = target_dataSplitSecond[0].hw + target_dataSplitSecond[1].hw + target_dataSplitSecond[2].hw;
                var target2hw = target_dataSplitSecond[3].hw + target_dataSplitSecond[4].hw + target_dataSplitSecond[5].hw;
                var target3hw = target_dataSplitSecond[6].hw + target_dataSplitSecond[7].hw + target_dataSplitSecond[8].hw;
                var target4hw = target_dataSplitSecond[9].hw + target_dataSplitSecond[10].hw + target_dataSplitSecond[11].hw;
                var targethw = target1hw + target2hw + target3hw + target4hw;

                var quoarterly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw;
                var quoarterly2dhls_hw = dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var quoarterly3dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw;
                var quoarterly4dhls_hw = dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var quoarterlydhls_hw = quoarterly1dhls_hw + quoarterly2dhls_hw + quoarterly3dhls_hw + quoarterly4dhls_hw;
                var target1dhls_hw = target_dataSplitSecond[0].dhls_hw + target_dataSplitSecond[1].dhls_hw + target_dataSplitSecond[2].dhls_hw;
                var target2dhls_hw = target_dataSplitSecond[3].dhls_hw + target_dataSplitSecond[4].dhls_hw + target_dataSplitSecond[5].dhls_hw;
                var target3dhls_hw = target_dataSplitSecond[6].dhls_hw + target_dataSplitSecond[7].dhls_hw + target_dataSplitSecond[8].dhls_hw;
                var target4dhls_hw = target_dataSplitSecond[9].dhls_hw + target_dataSplitSecond[10].dhls_hw + target_dataSplitSecond[11].dhls_hw;
                var targetdhls_hw = target1dhls_hw + target2dhls_hw + target3dhls_hw + target4dhls_hw;

                var quoarterly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt;
                var quoarterly2gt = dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var quoarterly3gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt;
                var quoarterly4gt = dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var quoarterlygt = quoarterly1gt + quoarterly2gt + quoarterly3gt + quoarterly4gt;
                var target1gt = target_dataSplitSecond[0].gt + target_dataSplitSecond[1].gt + target_dataSplitSecond[2].gt;
                var target2gt = target_dataSplitSecond[3].gt + target_dataSplitSecond[4].gt + target_dataSplitSecond[5].gt;
                var target3gt = target_dataSplitSecond[6].gt + target_dataSplitSecond[7].gt + target_dataSplitSecond[8].gt;
                var target4gt = target_dataSplitSecond[9].gt + target_dataSplitSecond[10].gt + target_dataSplitSecond[11].gt;
                var targetgt = target1gt + target2gt + target3gt + target4gt;

                var quoarterly1general = dataSplitSecond[0].general + dataSplitSecond[1].general + dataSplitSecond[2].general;
                var quoarterly2general = dataSplitSecond[3].general + dataSplitSecond[4].general + dataSplitSecond[5].general;
                var quoarterly3general = dataSplitSecond[6].general + dataSplitSecond[7].general + dataSplitSecond[8].general;
                var quoarterly4general = dataSplitSecond[9].general + dataSplitSecond[10].general + dataSplitSecond[11].general;
                var quoarterlygeneral = quoarterly1general + quoarterly2general + quoarterly3general + quoarterly4general;
                var target1general = target_dataSplitSecond[0].general + target_dataSplitSecond[1].general + target_dataSplitSecond[2].general;
                var target2general = target_dataSplitSecond[3].general + target_dataSplitSecond[4].general + target_dataSplitSecond[5].general;
                var target3general = target_dataSplitSecond[6].general + target_dataSplitSecond[7].general + target_dataSplitSecond[8].general;
                var target4general = target_dataSplitSecond[9].general + target_dataSplitSecond[10].general + target_dataSplitSecond[11].general;
                var targetgeneral = target1general + target2general + target3general + target4general;

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
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
                    quoarterly1general: formatNumber(quoarterly1general),
                    quoarterly2general: formatNumber(quoarterly2general),
                    quoarterly3general: formatNumber(quoarterly3general),
                    quoarterly4general: formatNumber(quoarterly4general),
                    quoarterlygeneral: formatNumber(quoarterlygeneral),
                    target1general: formatNumber(target1general),
                    target2general: formatNumber(target2general),
                    target3general: formatNumber(target3general),
                    target4general: formatNumber(target4general),
                    targetgeneral: formatNumber(targetgeneral),
                    gap1general: formatNumber(quoarterly1general - target1general),
                    gap2general: formatNumber(quoarterly2general - target2general),
                    gap3general: formatNumber(quoarterly3general - target3general),
                    gap4general: formatNumber(quoarterly4general - target4general),
                    gapgeneral: formatNumber(quoarterly4general - targetgeneral),
                    perc1general: formatNumber(getPrecenge(quoarterly1general, target1general)) + '%',
                    perc2general: formatNumber(getPrecenge(quoarterly2general, target2general)) + '%',
                    perc3general: formatNumber(getPrecenge(quoarterly3general, target3general)) + '%',
                    perc4general: formatNumber(getPrecenge(quoarterly4general, target4general)) + '%',
                    percgeneral: formatNumber(getPrecenge(quoarterlygeneral, targetgeneral)) + '%',
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsQuoartlyClass func', e)
    }
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
                var data = allSelection[i].getValue("custrecord_sr_amounts")
                var dataSplitSecond = splitDataAmountSecondPf(data);
                var target_dataSplitSecond = splitTargetAmountSecondPf(data)
                ////////////////

                var halfYearly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var halfYearly2bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var halfYearlybbs = halfYearly1bbs + halfYearly2bbs;
                var target1bbs = target_dataSplitSecond[0].bbs + target_dataSplitSecond[1].bbs + target_dataSplitSecond[2].bbs + target_dataSplitSecond[3].bbs + target_dataSplitSecond[4].bbs + target_dataSplitSecond[5].bbs;
                var target2bbs = target_dataSplitSecond[6].bbs + target_dataSplitSecond[7].bbs + target_dataSplitSecond[8].bbs + target_dataSplitSecond[9].bbs + target_dataSplitSecond[10].bbs + target_dataSplitSecond[11].bbs;
                var targetbbs = target1bbs + target2bbs;

                var halfYearly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var halfYearly2vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var halfYearlyvas = halfYearly1vas + halfYearly2vas;
                var target1vas = target_dataSplitSecond[0].vas + target_dataSplitSecond[1].vas + target_dataSplitSecond[2].vas + target_dataSplitSecond[3].vas + target_dataSplitSecond[4].vas + target_dataSplitSecond[5].vas;
                var target2vas = target_dataSplitSecond[6].vas + target_dataSplitSecond[7].vas + target_dataSplitSecond[8].vas + target_dataSplitSecond[9].vas + target_dataSplitSecond[10].vas + target_dataSplitSecond[11].vas;
                var targetvas = target1vas + target2vas;

                var halfYearly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;
                var halfYearly2bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var halfYearlybod = halfYearly1bod + halfYearly2bod;
                var target1bod = target_dataSplitSecond[0].bod + target_dataSplitSecond[1].bod + target_dataSplitSecond[2].bod + target_dataSplitSecond[3].bod + target_dataSplitSecond[4].bod + target_dataSplitSecond[5].bod;
                var target2bod = target_dataSplitSecond[6].bod + target_dataSplitSecond[7].bod + target_dataSplitSecond[8].bod + target_dataSplitSecond[9].bod + target_dataSplitSecond[10].bod + target_dataSplitSecond[11].bod;
                var targetbod = target1bod + target2bod;

                var halfYearly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var halfYearly2cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var halfYearlycband = halfYearly1cband + halfYearly2cband
                var target1cband = target_dataSplitSecond[0].cband + target_dataSplitSecond[1].cband + target_dataSplitSecond[2].cband + target_dataSplitSecond[3].cband + target_dataSplitSecond[4].cband + target_dataSplitSecond[5].cband;
                var target2cband = target_dataSplitSecond[6].cband + target_dataSplitSecond[7].cband + target_dataSplitSecond[8].cband + target_dataSplitSecond[9].cband + target_dataSplitSecond[10].cband + target_dataSplitSecond[11].cband;
                var targetcband = target1cband + target2cband;

                var halfYearly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var halfYearly2domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var halfYearlydomestic = halfYearly1domestic + halfYearly2domestic
                var target1domestic = target_dataSplitSecond[0].domestic + target_dataSplitSecond[1].domestic + target_dataSplitSecond[2].domestic + target_dataSplitSecond[3].domestic + target_dataSplitSecond[4].domestic + target_dataSplitSecond[5].domestic;
                var target1domestic = target_dataSplitSecond[6].domestic + target_dataSplitSecond[7].domestic + target_dataSplitSecond[8].domestic + target_dataSplitSecond[9].domestic + target_dataSplitSecond[10].domestic + target_dataSplitSecond[11].domestic;
                var targetdomestic = target1domestic + target2domestic

                var halfYearly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var halfYearly2ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var halfYearlyip = halfYearly1ip + halfYearly2ip
                var target1ip = target_dataSplitSecond[0].ip + target_dataSplitSecond[1].ip + target_dataSplitSecond[2].ip + target_dataSplitSecond[3].ip + target_dataSplitSecond[4].ip + target_dataSplitSecond[5].ip;
                var target1ip = target_dataSplitSecond[6].ip + target_dataSplitSecond[7].ip + target_dataSplitSecond[8].ip + target_dataSplitSecond[9].ip + target_dataSplitSecond[10].ip + target_dataSplitSecond[11].ip;
                var targetip = target1ip + target2ip

                var halfYearly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var halfYearly2iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var halfYearlyiru = halfYearly1iru + halfYearly2iru
                var target1iru = target_dataSplitSecond[0].iru + target_dataSplitSecond[1].iru + target_dataSplitSecond[2].iru + target_dataSplitSecond[3].iru + target_dataSplitSecond[4].iru + target_dataSplitSecond[5].iru;
                var target2iru = target_dataSplitSecond[6].iru + target_dataSplitSecond[7].iru + target_dataSplitSecond[8].iru + target_dataSplitSecond[9].iru + target_dataSplitSecond[10].iru + target_dataSplitSecond[11].iru;
                var targetiru = target1iru + target2iru

                var halfYearly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var halfYearly2kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var halfYearlykuband = halfYearly1kuband + halfYearly2kuband
                var target1kuband = target_dataSplitSecond[0].kuband + target_dataSplitSecond[1].kuband + target_dataSplitSecond[2].kuband + target_dataSplitSecond[3].kuband + target_dataSplitSecond[4].kuband + target_dataSplitSecond[5].kuband;
                var target2kuband = target_dataSplitSecond[6].kuband + target_dataSplitSecond[7].kuband + target_dataSplitSecond[8].kuband + target_dataSplitSecond[9].kuband + target_dataSplitSecond[10].kuband + target_dataSplitSecond[11].kuband;
                var targetkuband = target1kuband + target2kuband

                var halfYearly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var halfYearly2mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var halfYearlymobile_vsat = halfYearly1mobile_vsat + halfYearly2mobile_vsat
                var target1mobile_vsat = target_dataSplitSecond[0].mobile_vsat + target_dataSplitSecond[1].mobile_vsat + target_dataSplitSecond[2].mobile_vsat + target_dataSplitSecond[3].mobile_vsat + target_dataSplitSecond[4].mobile_vsat + target_dataSplitSecond[5].mobile_vsat;
                var target2mobile_vsat = target_dataSplitSecond[6].mobile_vsat + target_dataSplitSecond[7].mobile_vsat + target_dataSplitSecond[8].mobile_vsat + target_dataSplitSecond[9].mobile_vsat + target_dataSplitSecond[10].mobile_vsat + target_dataSplitSecond[11].mobile_vsat
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat

                var halfYearly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var halfYearly2mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var halfYearlympip = halfYearly1mpip + halfYearly2mpip
                var target1mpip = target_dataSplitSecond[0].mpip + target_dataSplitSecond[1].mpip + target_dataSplitSecond[2].mpip + target_dataSplitSecond[3].mpip + target_dataSplitSecond[4].mpip + target_dataSplitSecond[5].mpip;
                var target2mpip = target_dataSplitSecond[6].mpip + target_dataSplitSecond[7].mpip + target_dataSplitSecond[8].mpip + target_dataSplitSecond[9].mpip + target_dataSplitSecond[10].mpip + target_dataSplitSecond[11].mpip;
                var targetmpip = target1mpip + target2mpip

                var halfYearly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var halfYearly2o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var halfYearlyo3b = halfYearly1o3b + halfYearly2o3b
                var target1o3b = target_dataSplitSecond[0].o3b + target_dataSplitSecond[1].o3b + target_dataSplitSecond[2].o3b + target_dataSplitSecond[3].o3b + target_dataSplitSecond[4].o3b + target_dataSplitSecond[5].o3b;
                var target2o3b = target_dataSplitSecond[6].o3b + target_dataSplitSecond[7].o3b + target_dataSplitSecond[8].o3b + target_dataSplitSecond[9].o3b + target_dataSplitSecond[10].o3b + target_dataSplitSecond[11].o3b;
                var targeto3b = target1o3b + target2o3b

                var halfYearly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var halfYearly2ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var halfYearlyps = halfYearly1ps + halfYearly2ps
                var target1ps = target_dataSplitSecond[0].ps + target_dataSplitSecond[1].ps + target_dataSplitSecond[2].ps + target_dataSplitSecond[3].ps + target_dataSplitSecond[4].ps + target_dataSplitSecond[5].ps;
                var target2ps = target_dataSplitSecond[6].ps + target_dataSplitSecond[7].ps + target_dataSplitSecond[8].ps + target_dataSplitSecond[9].ps + target_dataSplitSecond[10].ps + target_dataSplitSecond[11].ps
                var targetps = target1ps + target2ps

                var halfYearly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var halfYearly2sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var halfYearlysr = halfYearly1sr + halfYearly2sr
                var target1sr = target_dataSplitSecond[0].sr + target_dataSplitSecond[1].sr + target_dataSplitSecond[2].sr + target_dataSplitSecond[3].sr + target_dataSplitSecond[4].sr + target_dataSplitSecond[5].sr;
                var target2sr = target_dataSplitSecond[6].sr + target_dataSplitSecond[7].sr + target_dataSplitSecond[8].sr + target_dataSplitSecond[9].sr + target_dataSplitSecond[10].sr + target_dataSplitSecond[11].sr;
                var targetsr = target1sr + target2sr

                var halfYearly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var halfYearly2hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var halfYearlyhw = halfYearly1hw + halfYearly2hw
                var target1hw = target_dataSplitSecond[0].hw + target_dataSplitSecond[1].hw + target_dataSplitSecond[2].hw + target_dataSplitSecond[3].hw + target_dataSplitSecond[4].hw + target_dataSplitSecond[5].hw;
                var target2hw = target_dataSplitSecond[6].hw + target_dataSplitSecond[7].hw + target_dataSplitSecond[8].hw + target_dataSplitSecond[9].hw + target_dataSplitSecond[10].hw + target_dataSplitSecond[11].hw;
                var targethw = target1hw + target2hw

                var halfYearly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var halfYearly2dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var halfYearlydhls_hw = halfYearly1dhls_hw + halfYearly2dhls_hw
                var target1dhls_hw = target_dataSplitSecond[0].dhls_hw + target_dataSplitSecond[1].dhls_hw + target_dataSplitSecond[2].dhls_hw + target_dataSplitSecond[3].dhls_hw + target_dataSplitSecond[4].dhls_hw + target_dataSplitSecond[5].dhls_hw;
                var target2dhls_hw = target_dataSplitSecond[6].dhls_hw + target_dataSplitSecond[7].dhls_hw + target_dataSplitSecond[8].dhls_hw + target_dataSplitSecond[9].dhls_hw + target_dataSplitSecond[10].dhls_hw + target_dataSplitSecond[11].dhls_hw;
                var targetdhls_hw = target1dhls_hw + target2dhls_hw

                var halfYearly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var halfYearly2gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var halfYearlygt = halfYearly1gt + halfYearly2gt
                var target1gt = target_dataSplitSecond[0].gt + target_dataSplitSecond[1].gt + target_dataSplitSecond[2].gt + target_dataSplitSecond[3].gt + target_dataSplitSecond[4].gt + target_dataSplitSecond[5].gt;
                var target2gt = target_dataSplitSecond[6].gt + target_dataSplitSecond[7].gt + target_dataSplitSecond[8].gt + target_dataSplitSecond[9].gt + target_dataSplitSecond[10].gt + target_dataSplitSecond[11].gt;
                var targetgt = target1gt + target2gt

                var halfYearly1general = dataSplitSecond[0].general + dataSplitSecond[1].general + dataSplitSecond[2].general + dataSplitSecond[3].general + dataSplitSecond[4].general + dataSplitSecond[5].general;
                var halfYearly2general = dataSplitSecond[6].general + dataSplitSecond[7].general + dataSplitSecond[8].general + dataSplitSecond[9].general + dataSplitSecond[10].general + dataSplitSecond[11].general;
                var halfYearlygeneral = halfYearly1general + halfYearly2general;
                var target1general = target_dataSplitSecond[0].general + target_dataSplitSecond[1].general + target_dataSplitSecond[2].general + target_dataSplitSecond[3].general + target_dataSplitSecond[4].general + target_dataSplitSecond[5].general;
                var target2general = target_dataSplitSecond[6].general + target_dataSplitSecond[7].general + target_dataSplitSecond[8].general + target_dataSplitSecond[9].general + target_dataSplitSecond[10].general + target_dataSplitSecond[11].general;
                var targetgeneral = target1general + target2general;

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: getName(allSelection[i].getText("custrecord_sr_sales_rep")),
                    sales_rep_id: allSelection[i].getValue("custrecord_sr_sales_rep"),
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
                    halfYearly1general: formatNumber(halfYearly1general),
                    halfYearly2general: formatNumber(halfYearly2general),
                    halfYearlygeneral: formatNumber(halfYearlygeneral),
                    target1general: formatNumber(target1general),
                    target2general: formatNumber(target2general),
                    targetgeneral: formatNumber(targetgeneral),
                    gap1general: formatNumber(halfYearly1general - target1general),
                    gap2general: formatNumber(halfYearly2general - target2general),
                    gapgeneral: formatNumber(halfYearlygeneral - targetgeneral),
                    perc1general: formatNumber(getPrecenge(halfYearly1general, target1general)) + '%',
                    perc2general: formatNumber(getPrecenge(halfYearly2general, target2general)) + '%',
                    percgeneral: formatNumber(getPrecenge(halfYearlygeneral, targetgeneral)) + '%',
                });
            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'SalesRepTargetsHalfYearlyPf func', e)
    }
    return Results;
}


