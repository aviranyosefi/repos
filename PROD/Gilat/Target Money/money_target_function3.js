function LossSalesRepTargets(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargets allSelection ', allSelection.length)

        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {

                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplit = splitDataAmountPf(data)
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var totalmount = dataSplitSecond[0] + dataSplitSecond[1] + dataSplitSecond[2] + dataSplitSecond[3] + dataSplitSecond[4] + dataSplitSecond[5] + dataSplitSecond[6] + dataSplitSecond[7] + dataSplitSecond[8] + dataSplitSecond[9] + dataSplitSecond[10] + dataSplitSecond[11];
                var totaltarget = Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec"));
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
                var target1 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jan_sr"))+Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jan_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlss")))
                var target2 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr"))+Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss")))
                var target3 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_mar_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr"))+Number(allSelection[i].getValue("custrecord_nml_mar_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss")))
                var target4 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_apr_sr"))+Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_apr_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlss")))
                var target5 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_sr"))+Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss")))
                var target6 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_jun_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr"))+Number(allSelection[i].getValue("custrecord_nml_jun_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss")))
                var target7 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jul_sr"))+Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jul_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlss")))
                var target8 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr"))+Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss")))
                var target9 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_sep_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr"))+Number(allSelection[i].getValue("custrecord_nml_sep_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss")))
                var target10 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_oct_sr"))+Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_oct_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlss")))
                var target11 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr"))+Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss")))
                var target12 = formatNumber(Number(allSelection[i].getValue("custrecord_nml_dec_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr"))+Number(allSelection[i].getValue("custrecord_nml_dec_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss")))

                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
                    target1: target1,
                    target2: target2,
                    target3: target3,
                    target4: target4,
                    target5: target5,
                    target6: target6,
                    target7: target7,
                    target8: target8,
                    target9: target9,
                    target10: target10,
                    target11: target11,
                    target12: target12,
                    totaltarget: formatNumber(totaltarget),
                    gap1: formatNumber(NTR(mounth1) - NTR(target1)),
                    gap2: formatNumber(NTR(mounth2) - NTR(target2)),
                    gap3: formatNumber(NTR(mounth3) - NTR(target3)),
                    gap4: formatNumber(NTR(mounth4) - NTR(target4)),
                    gap5: formatNumber(NTR(mounth5) - NTR(target5)),
                    gap6: formatNumber(NTR(mounth6) - NTR(target6)),
                    gap7: formatNumber(NTR(mounth7) - NTR(target7)),
                    gap8: formatNumber(NTR(mounth8) - NTR(target8)),
                    gap9: formatNumber(NTR(mounth9) - NTR(target9)),
                    gap10: formatNumber(NTR(mounth10) - NTR(target10)),
                    gap11: formatNumber(NTR(mounth11) - NTR(target11)),
                    gap12: formatNumber(NTR(mounth12) - NTR(target12)),
                    totalgap: formatNumber(totalmount - totaltarget),
                    perc1: formatNumber(getPrecenge(NTR(mounth1), NTR(target1))) + '%',
                    perc2: formatNumber(getPrecenge(NTR(mounth2), NTR(target2))) + '%',
                    perc3: formatNumber(getPrecenge(NTR(mounth3), NTR(target3))) + '%',
                    perc4: formatNumber(getPrecenge(NTR(mounth4), NTR(target4))) + '%',
                    perc5: formatNumber(getPrecenge(NTR(mounth5), NTR(target5))) + '%',
                    perc6: formatNumber(getPrecenge(NTR(mounth6), NTR(target6))) + '%',
                    perc7: formatNumber(getPrecenge(NTR(mounth7), NTR(target7))) + '%',
                    perc8: formatNumber(getPrecenge(NTR(mounth8), NTR(target8))) + '%',
                    perc9: formatNumber(getPrecenge(NTR(mounth9), NTR(target9))) + '%',
                    perc10: formatNumber(getPrecenge(NTR(mounth10), NTR(target10))) + '%',
                    perc11: formatNumber(getPrecenge(NTR(mounth11), NTR(target11))) + '%',
                    perc12: formatNumber(getPrecenge(NTR(mounth12), NTR(target12))) + '%',
                    totalperc: formatNumber(getPrecenge(totalmount, totaltarget)) + '%',



                });

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'LossSalesRepTargets func', e)
    }
    return Results;
}
function LossSalesRepTargetsQuoartly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargetsQuoartly ', allSelection.length)

        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {

                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplit = splitDataAmountPf(data)
                //var dataSplitSecond = splitDataAmountSecondPf(data)
                mounth1 = (NTR(dataSplit[0].bbs) + NTR(dataSplit[0].sr) + NTR(dataSplit[0].vas) + NTR(dataSplit[0].bod) + NTR(dataSplit[0].cband) + NTR(dataSplit[0].domestic) + NTR(dataSplit[0].ip) + NTR(dataSplit[0].iru) + NTR(dataSplit[0].kuband) + NTR(dataSplit[0].mobile_vsat) + NTR(dataSplit[0].mpip) + NTR(dataSplit[0].o3b) + NTR(dataSplit[0].ps) + NTR(dataSplit[0].hw) + NTR(dataSplit[0].dhls_hw) + NTR(dataSplit[0].gt) + NTR(dataSplit[0].none))
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
                var target1 = Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jan_sr")) + Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jan_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlss"))
                var target2 = Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr")) + Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss"))
                var target3 = Number(allSelection[i].getValue("custrecord_nml_mar_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr")) + Number(allSelection[i].getValue("custrecord_nml_mar_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss"))
                var target4 = Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_apr_sr")) + Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_apr_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlss"))
                var target5 = Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_sr")) + Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss"))
                var target6 = Number(allSelection[i].getValue("custrecord_nml_jun_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr")) + Number(allSelection[i].getValue("custrecord_nml_jun_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss"))
                var target7 = Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jul_sr")) + Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jul_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlss"))
                var target8 = Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr")) + Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss"))
                var target9 = Number(allSelection[i].getValue("custrecord_nml_sep_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr")) + Number(allSelection[i].getValue("custrecord_nml_sep_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss"))
                var target10 = Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_oct_sr")) + Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_oct_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlss"))
                var target11 = Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr")) + Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss"))
                var target12 = Number(allSelection[i].getValue("custrecord_nml_dec_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss"))
                var quoarterly1 = mounth1 + mounth2 + mounth3
                var quoarterly2 = mounth4 + mounth5 + mounth6
                var quoarterly3 = mounth7 + mounth8 + mounth9
                var quoarterly4 = mounth10 + mounth11 + mounth12
                var totalquoarterly = quoarterly1 + quoarterly2 + quoarterly3 + quoarterly4
                var target1 = target1 + target2 + target3
                var target2 = target4 + target5 + target6
                var target3 = target7 + target8 + target9
                var target4 = target10 + target11 + target12
                var totaltarget = target1 + target2 + target3 + target4;
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
    } catch (e) {
        nlapiLogExecution('error', 'LossSalesRepTargetsQuoartly func', e)
    }
    return Results;
}
function LossSalesRepTargetsHalfYearly(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargetsHalfYearly ', allSelection.length)

        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplit = splitDataAmountPf(data)
                //var dataSplitSecond = splitDataAmountSecondPf(data)
                mounth1 = (NTR(dataSplit[0].bbs) + NTR(dataSplit[0].sr) + NTR(dataSplit[0].vas) + NTR(dataSplit[0].bod) + NTR(dataSplit[0].cband) + NTR(dataSplit[0].domestic) + NTR(dataSplit[0].ip) + NTR(dataSplit[0].iru) + NTR(dataSplit[0].kuband) + NTR(dataSplit[0].mobile_vsat) + NTR(dataSplit[0].mpip) + NTR(dataSplit[0].o3b) + NTR(dataSplit[0].ps) + NTR(dataSplit[0].hw) + NTR(dataSplit[0].dhls_hw) + NTR(dataSplit[0].gt) + NTR(dataSplit[0].none))
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
                var target1 = Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jan_sr")) + Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jan_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jan")) + Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_jan_dhlss"))
                var target2 = Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr")) + Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_feb")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss"))
                var target3 = Number(allSelection[i].getValue("custrecord_nml_mar_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr")) + Number(allSelection[i].getValue("custrecord_nml_mar_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_mar")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss"))
                var target4 = Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_apr_sr")) + Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_apr_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_apr")) + Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlss"))
                var target5 = Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_sr")) + Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_may")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss"))
                var target6 = Number(allSelection[i].getValue("custrecord_nml_jun_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr")) + Number(allSelection[i].getValue("custrecord_nml_jun_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jun")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss"))
                var target7 = Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jul_sr")) + Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jul_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_jul")) + Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlss"))
                var target8 = Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr")) + Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_aug")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss"))
                var target9 = Number(allSelection[i].getValue("custrecord_nml_sep_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr")) + Number(allSelection[i].getValue("custrecord_nml_sep_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_sep")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss"))
                var target10 = Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_oct_sr")) + Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_oct_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_oct")) + Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlss"))
                var target11 = Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr")) + Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_nov")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss"))
                var target12 = Number(allSelection[i].getValue("custrecord_nml_dec_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_vsat")) + Number(allSelection[i].getValue("custrecord_target_godel_tik_dec")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss"))
                var quoarterly1 = mounth1 + mounth2 + mounth3
                var quoarterly2 = mounth4 + mounth5 + mounth6
                var quoarterly3 = mounth7 + mounth8 + mounth9
                var quoarterly4 = mounth10 + mounth11 + mounth12
                var totalquoarterly = quoarterly1 + quoarterly2 + quoarterly3 + quoarterly4
                var target1 = target1 + target2 + target3
                var target2 = target4 + target5 + target6
                var target3 = target7 + target8 + target9
                var target4 = target10 + target11 + target12
                var totaltarget = target1 + target2 + target3 + target4;
                var halfYearly1 = quoarterly1 + quoarterly2;
                var halfYearly2 = quoarterly3 + quoarterly4;
                var totalhalfYearly = halfYearly1 + halfYearly2;
                var target1 = target1 + target2
                var target2 = target3 + target4
                var totaltarget = target1 + target2;
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
    } catch (e) {
        nlapiLogExecution('error', 'LossSalesRepTargetsHalfYearly func', e)
    }
    return Results;
}
function LossSalesRepTargetsPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {

        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargetsPf allSelection ', allSelection.length)

        if (allSelection != null) {

            for (var i = 0; i < allSelection.length; i++) {

                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplit = splitDataAmountPf(data)
                var dataSplitSecond = splitDataAmountSecondPf(data)

                var totalbbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs + dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var totaltargetbbs = Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_bbs")) + Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_bbs")) + Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_bbs"));
                var totalvas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas + dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var totaltargetvas = Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas")) + Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_nml_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas")) + Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas")) + Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas"));
                var totalbod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod + dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var totaltargetbod = Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_bod")) + Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_bod")) + Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_bod")) + Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_bod"));
                var totalcband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband + dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var totaltargetcband = Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband")) + Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband")) + Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband")) + Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband"));
                var totaldomestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic + dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var totaltargetdomestic = Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic")) + Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic")) + Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic"));
                var totalip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip + dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var totaltargetip = Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip")) + Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip")) + Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip")) + Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip"));
                var totaliru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru + dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var totaltargetiru = Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru")) + Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru")) + Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru")) + Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru"));
                var totalkuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband + dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var totaltargetkuband = Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband")) + Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband")) + Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband"));
                var totalmobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat + dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var totaltargetmobile_vsat = Number(allSelection[i].getValue("custrecord_nml_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_mar_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_jun_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_sep_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_dec_mobile_vsat"));
                var totalmpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip + dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var totaltargetmpip = Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip")) + Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip")) + Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip"));
                var totalo3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b + dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var totaltargeto3b = Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b")) + Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b")) + Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b"));
                var totalps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps + dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var totaltargetps = Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps")) + Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps")) + Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps")) + Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr"));
                var totalsr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr + dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var totaltargetsr = Number(allSelection[i].getValue("custrecord_nml_jan_sr")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr")) + Number(allSelection[i].getValue("custrecord_nml_apr_sr")) + Number(allSelection[i].getValue("custrecord_nml_may_sr")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr")) + Number(allSelection[i].getValue("custrecord_nml_jul_sr")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr")) + Number(allSelection[i].getValue("custrecord_nml_oct_sr")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr"));
                var totalhw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw + dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var totaltargethw = Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw")) + Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw")) + Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw")) + Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw"));
                var totaldhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw + dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var totaltargetdhls_hw = Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh"));
                var totalgt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt + dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var totaltargetgt = Number(allSelection[i].getValue("custrecord_nml_jan_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_jul_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss"));
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
                    totaltargetbbs: formatNumber(totaltargetbbs),
                    totalgapbbs: formatNumber(totalbbs - totaltargetbbs),
                    totalpercbbs: formatNumber(getPrecenge(totalbbs, totaltargetbbs)) + '%',
                    target1bbs: formatNumber(allSelection[i].getValue("custrecord_nml_jan_bbs")),
                    target2bbs: formatNumber(allSelection[i].getValue("custrecord_nml_feb_bbs")),
                    target3bbs: formatNumber(allSelection[i].getValue("custrecord_nml_mar_bbs")),
                    target4bbs: formatNumber(allSelection[i].getValue("custrecord_nml_apr_bbs")),
                    target5bbs: formatNumber(allSelection[i].getValue("custrecord_nml_may_bbs")),
                    target6bbs: formatNumber(allSelection[i].getValue("custrecord_nml_jun_bbs")),
                    target7bbs: formatNumber(allSelection[i].getValue("custrecord_nml_jul_bbs")),
                    target8bbs: formatNumber(allSelection[i].getValue("custrecord_nml_aug_bbs")),
                    target9bbs: formatNumber(allSelection[i].getValue("custrecord_nml_sep_bbs")),
                    target10bbs: formatNumber(allSelection[i].getValue("custrecord_nml_oct_bbs")),
                    target11bbs: formatNumber(allSelection[i].getValue("custrecord_nml_nov_bbs")),
                    target12bbs: formatNumber(allSelection[i].getValue("custrecord_nml_dec_bbs")),
                    gap1bbs: formatNumber(dataSplitSecond[0].bbs - allSelection[i].getValue("custrecord_nml_jan_bbs")),
                    gap2bbs: formatNumber(dataSplitSecond[1].bbs - allSelection[i].getValue("custrecord_nml_feb_bbs")),
                    gap3bbs: formatNumber(dataSplitSecond[2].bbs - allSelection[i].getValue("custrecord_nml_mar_bbs")),
                    gap4bbs: formatNumber(dataSplitSecond[3].bbs - allSelection[i].getValue("custrecord_nml_apr_bbs")),
                    gap5bbs: formatNumber(dataSplitSecond[4].bbs - allSelection[i].getValue("custrecord_nml_may_bbs")),
                    gap6bbs: formatNumber(dataSplitSecond[5].bbs - allSelection[i].getValue("custrecord_nml_jun_bbs")),
                    gap7bbs: formatNumber(dataSplitSecond[6].bbs - allSelection[i].getValue("custrecord_nml_jul_bbs")),
                    gap8bbs: formatNumber(dataSplitSecond[7].bbs - allSelection[i].getValue("custrecord_nml_aug_bbs")),
                    gap9bbs: formatNumber(dataSplitSecond[8].bbs - allSelection[i].getValue("custrecord_nml_sep_bbs")),
                    gap10bbs: formatNumber(dataSplitSecond[9].bbs - allSelection[i].getValue("custrecord_nml_oct_bbs")),
                    gap11bbs: formatNumber(dataSplitSecond[10].bbs - allSelection[i].getValue("custrecord_nml_nov_bbs")),
                    gap12bbs: formatNumber(dataSplitSecond[11].bbs - allSelection[i].getValue("custrecord_nml_dec_bbs")),
                    perc1bbs: formatNumber(getPrecenge(dataSplitSecond[0].bbs, allSelection[i].getValue("custrecord_nml_jan_bbs"))) + '%',
                    perc2bbs: formatNumber(getPrecenge(dataSplitSecond[1].bbs, allSelection[i].getValue("custrecord_nml_feb_bbs"))) + '%',
                    perc3bbs: formatNumber(getPrecenge(dataSplitSecond[2].bbs, allSelection[i].getValue("custrecord_nml_mar_bbs"))) + '%',
                    perc4bbs: formatNumber(getPrecenge(dataSplitSecond[3].bbs, allSelection[i].getValue("custrecord_nml_apr_bbs"))) + '%',
                    perc5bbs: formatNumber(getPrecenge(dataSplitSecond[4].bbs, allSelection[i].getValue("custrecord_nml_may_bbs"))) + '%',
                    perc6bbs: formatNumber(getPrecenge(dataSplitSecond[5].bbs, allSelection[i].getValue("custrecord_nml_jun_bbs"))) + '%',
                    perc7bbs: formatNumber(getPrecenge(dataSplitSecond[6].bbs, allSelection[i].getValue("custrecord_nml_jul_bbs"))) + '%',
                    perc8bbs: formatNumber(getPrecenge(dataSplitSecond[7].bbs, allSelection[i].getValue("custrecord_nml_aug_bbs"))) + '%',
                    perc9bbs: formatNumber(getPrecenge(dataSplitSecond[8].bbs, allSelection[i].getValue("custrecord_nml_sep_bbs"))) + '%',
                    perc10bbs: formatNumber(getPrecenge(dataSplitSecond[9].bbs, allSelection[i].getValue("custrecord_nml_sep_bbs"))) + '%',
                    perc11bbs: formatNumber(getPrecenge(dataSplitSecond[10].bbs, allSelection[i].getValue("custrecord_nml_nov_bbs"))) + '%',
                    perc12bbs: formatNumber(getPrecenge(dataSplitSecond[11].bbs, allSelection[i].getValue("custrecord_nml_dec_bbs"))) + '%',
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
                    target1sr: formatNumber(allSelection[i].getValue("custrecord_nml_jan_sr")),
                    target2sr: formatNumber(allSelection[i].getValue("custrecord_nml_feb_sr")),
                    target3sr: formatNumber(allSelection[i].getValue("custrecord_nml_mar_sr")),
                    target4sr: formatNumber(allSelection[i].getValue("custrecord_nml_apr_sr")),
                    target5sr: formatNumber(allSelection[i].getValue("custrecord_nml_may_sr")),
                    target6sr: formatNumber(allSelection[i].getValue("custrecord_nml_jun_sr")),
                    target7sr: formatNumber(allSelection[i].getValue("custrecord_nml_jul_sr")),
                    target8sr: formatNumber(allSelection[i].getValue("custrecord_nml_aug_sr")),
                    target9sr: formatNumber(allSelection[i].getValue("custrecord_nml_sep_sr")),
                    target10sr: formatNumber(allSelection[i].getValue("custrecord_nml_oct_sr")),
                    target11sr: formatNumber(allSelection[i].getValue("custrecord_nml_nov_sr")),
                    target12sr: formatNumber(allSelection[i].getValue("custrecord_nml_dec_sr")),
                    gap1sr: formatNumber(dataSplitSecond[0].sr - allSelection[i].getValue("custrecord_nml_jan_sr")),
                    gap2sr: formatNumber(dataSplitSecond[1].sr - allSelection[i].getValue("custrecord_nml_feb_sr")),
                    gap3sr: formatNumber(dataSplitSecond[2].sr - allSelection[i].getValue("custrecord_nml_mar_sr")),
                    gap4sr: formatNumber(dataSplitSecond[3].sr - allSelection[i].getValue("custrecord_nml_apr_sr")),
                    gap5sr: formatNumber(dataSplitSecond[4].sr - allSelection[i].getValue("custrecord_nml_may_sr")),
                    gap6sr: formatNumber(dataSplitSecond[5].sr - allSelection[i].getValue("custrecord_nml_jun_sr")),
                    gap7sr: formatNumber(dataSplitSecond[6].sr - allSelection[i].getValue("custrecord_nml_jul_sr")),
                    gap8sr: formatNumber(dataSplitSecond[7].sr - allSelection[i].getValue("custrecord_nml_aug_sr")),
                    gap9sr: formatNumber(dataSplitSecond[8].sr - allSelection[i].getValue("custrecord_nml_sep_sr")),
                    gap10sr: formatNumber(dataSplitSecond[9].sr - allSelection[i].getValue("custrecord_nml_oct_sr")),
                    gap11sr: formatNumber(dataSplitSecond[10].sr - allSelection[i].getValue("custrecord_nml_nov_sr")),
                    gap12sr: formatNumber(dataSplitSecond[11].sr - allSelection[i].getValue("custrecord_nml_dec_sr")),
                    perc1sr: formatNumber(getPrecenge(dataSplitSecond[0].sr, allSelection[i].getValue("custrecord_nml_jan_sr"))) + '%',
                    perc2sr: formatNumber(getPrecenge(dataSplitSecond[1].sr, allSelection[i].getValue("custrecord_nml_feb_sr"))) + '%',
                    perc3sr: formatNumber(getPrecenge(dataSplitSecond[2].sr, allSelection[i].getValue("custrecord_nml_mar_sr"))) + '%',
                    perc4sr: formatNumber(getPrecenge(dataSplitSecond[3].sr, allSelection[i].getValue("custrecord_nml_apr_sr"))) + '%',
                    perc5sr: formatNumber(getPrecenge(dataSplitSecond[4].sr, allSelection[i].getValue("custrecord_nml_may_sr"))) + '%',
                    perc6sr: formatNumber(getPrecenge(dataSplitSecond[5].sr, allSelection[i].getValue("custrecord_nml_jun_sr"))) + '%',
                    perc7sr: formatNumber(getPrecenge(dataSplitSecond[6].sr, allSelection[i].getValue("custrecord_nml_jul_sr"))) + '%',
                    perc8sr: formatNumber(getPrecenge(dataSplitSecond[7].sr, allSelection[i].getValue("custrecord_nml_aug_sr"))) + '%',
                    perc9sr: formatNumber(getPrecenge(dataSplitSecond[8].sr, allSelection[i].getValue("custrecord_nml_sep_sr"))) + '%',
                    perc10sr: formatNumber(getPrecenge(dataSplitSecond[9].sr, allSelection[i].getValue("custrecord_nml_sep_sr"))) + '%',
                    perc11sr: formatNumber(getPrecenge(dataSplitSecond[10].sr, allSelection[i].getValue("custrecord_nml_nov_sr"))) + '%',
                    perc12sr: formatNumber(getPrecenge(dataSplitSecond[11].sr, allSelection[i].getValue("custrecord_nml_dec_sr"))) + '%',
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
                    target1vas: formatNumber(allSelection[i].getValue("custrecord_nml_jan_vas")),
                    target2vas: formatNumber(allSelection[i].getValue("custrecord_nml_feb_vas")),
                    target3vas: formatNumber(allSelection[i].getValue("custrecord_nml_mar_vas")),
                    target4vas: formatNumber(allSelection[i].getValue("custrecord_nml_apr_vas")),
                    target5vas: formatNumber(allSelection[i].getValue("custrecord_nml_may_vas")),
                    target6vas: formatNumber(allSelection[i].getValue("custrecord_nml_jun_vas")),
                    target7vas: formatNumber(allSelection[i].getValue("custrecord_nml_jul_vas")),
                    target8vas: formatNumber(allSelection[i].getValue("custrecord_nml_aug_vas")),
                    target9vas: formatNumber(allSelection[i].getValue("custrecord_nml_sep_vas")),
                    target10vas: formatNumber(allSelection[i].getValue("custrecord_nml_oct_vas")),
                    target11vas: formatNumber(allSelection[i].getValue("custrecord_nml_nov_vas")),
                    target12vas: formatNumber(allSelection[i].getValue("custrecord_nml_dec_vas")),
                    gap1vas: formatNumber(dataSplitSecond[0].vas - allSelection[i].getValue("custrecord_nml_jan_vas")),
                    gap2vas: formatNumber(dataSplitSecond[1].vas - allSelection[i].getValue("custrecord_nml_feb_vas")),
                    gap3vas: formatNumber(dataSplitSecond[2].vas - allSelection[i].getValue("custrecord_nml_mar_vas")),
                    gap4vas: formatNumber(dataSplitSecond[3].vas - allSelection[i].getValue("custrecord_nml_apr_vas")),
                    gap5vas: formatNumber(dataSplitSecond[4].vas - allSelection[i].getValue("custrecord_nml_may_vas")),
                    gap6vas: formatNumber(dataSplitSecond[5].vas - allSelection[i].getValue("custrecord_nml_jun_vas")),
                    gap7vas: formatNumber(dataSplitSecond[6].vas - allSelection[i].getValue("custrecord_nml_jul_vas")),
                    gap8vas: formatNumber(dataSplitSecond[7].vas - allSelection[i].getValue("custrecord_nml_aug_vas")),
                    gap9vas: formatNumber(dataSplitSecond[8].vas - allSelection[i].getValue("custrecord_nml_sep_vas")),
                    gap10vas: formatNumber(dataSplitSecond[9].vas - allSelection[i].getValue("custrecord_nml_oct_vas")),
                    gap11vas: formatNumber(dataSplitSecond[10].vas - allSelection[i].getValue("custrecord_nml_nov_vas")),
                    gap12vas: formatNumber(dataSplitSecond[11].vas - allSelection[i].getValue("custrecord_nml_dec_vas")),
                    perc1vas: formatNumber(getPrecenge(dataSplitSecond[0].vas, allSelection[i].getValue("custrecord_nml_jan_vas"))) + '%',
                    perc2vas: formatNumber(getPrecenge(dataSplitSecond[1].vas, allSelection[i].getValue("custrecord_nml_feb_vas"))) + '%',
                    perc3vas: formatNumber(getPrecenge(dataSplitSecond[2].vas, allSelection[i].getValue("custrecord_nml_mar_vas"))) + '%',
                    perc4vas: formatNumber(getPrecenge(dataSplitSecond[3].vas, allSelection[i].getValue("custrecord_nml_apr_vas"))) + '%',
                    perc5vas: formatNumber(getPrecenge(dataSplitSecond[4].vas, allSelection[i].getValue("custrecord_nml_may_vas"))) + '%',
                    perc6vas: formatNumber(getPrecenge(dataSplitSecond[5].vas, allSelection[i].getValue("custrecord_nml_jun_vas"))) + '%',
                    perc7vas: formatNumber(getPrecenge(dataSplitSecond[6].vas, allSelection[i].getValue("custrecord_nml_jul_vas"))) + '%',
                    perc8vas: formatNumber(getPrecenge(dataSplitSecond[7].vas, allSelection[i].getValue("custrecord_nml_aug_vas"))) + '%',
                    perc9vas: formatNumber(getPrecenge(dataSplitSecond[8].vas, allSelection[i].getValue("custrecord_nml_sep_vas"))) + '%',
                    perc10vas: formatNumber(getPrecenge(dataSplitSecond[9].vas, allSelection[i].getValue("custrecord_nml_sep_vas"))) + '%',
                    perc11vas: formatNumber(getPrecenge(dataSplitSecond[10].vas, allSelection[i].getValue("custrecord_nml_nov_vas"))) + '%',
                    perc12vas: formatNumber(getPrecenge(dataSplitSecond[11].vas, allSelection[i].getValue("custrecord_nml_dec_vas"))) + '%',
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
                    target1bod: formatNumber(allSelection[i].getValue("custrecord_nml_jan_bod")),
                    target2bod: formatNumber(allSelection[i].getValue("custrecord_nml_feb_bod")),
                    target3bod: formatNumber(allSelection[i].getValue("custrecord_nml_mar_bod")),
                    target4bod: formatNumber(allSelection[i].getValue("custrecord_nml_apr_bod")),
                    target5bod: formatNumber(allSelection[i].getValue("custrecord_nml_may_bod")),
                    target6bod: formatNumber(allSelection[i].getValue("custrecord_nml_jun_bod")),
                    target7bod: formatNumber(allSelection[i].getValue("custrecord_nml_jul_bod")),
                    target8bod: formatNumber(allSelection[i].getValue("custrecord_nml_aug_bod")),
                    target9bod: formatNumber(allSelection[i].getValue("custrecord_nml_sep_bod")),
                    target10bod: formatNumber(allSelection[i].getValue("custrecord_nml_oct_bod")),
                    target11bod: formatNumber(allSelection[i].getValue("custrecord_nml_nov_bod")),
                    target12bod: formatNumber(allSelection[i].getValue("custrecord_nml_dec_bod")),
                    gap1bod: formatNumber(dataSplitSecond[0].bod - allSelection[i].getValue("custrecord_nml_jan_bod")),
                    gap2bod: formatNumber(dataSplitSecond[1].bod - allSelection[i].getValue("custrecord_nml_feb_bod")),
                    gap3bod: formatNumber(dataSplitSecond[2].bod - allSelection[i].getValue("custrecord_nml_mar_bod")),
                    gap4bod: formatNumber(dataSplitSecond[3].bod - allSelection[i].getValue("custrecord_nml_apr_bod")),
                    gap5bod: formatNumber(dataSplitSecond[4].bod - allSelection[i].getValue("custrecord_nml_may_bod")),
                    gap6bod: formatNumber(dataSplitSecond[5].bod - allSelection[i].getValue("custrecord_nml_jun_bod")),
                    gap7bod: formatNumber(dataSplitSecond[6].bod - allSelection[i].getValue("custrecord_nml_jul_bod")),
                    gap8bod: formatNumber(dataSplitSecond[7].bod - allSelection[i].getValue("custrecord_nml_aug_bod")),
                    gap9bod: formatNumber(dataSplitSecond[8].bod - allSelection[i].getValue("custrecord_nml_sep_bod")),
                    gap10bod: formatNumber(dataSplitSecond[9].bod - allSelection[i].getValue("custrecord_nml_oct_bod")),
                    gap11bod: formatNumber(dataSplitSecond[10].bod - allSelection[i].getValue("custrecord_nml_nov_bod")),
                    gap12bod: formatNumber(dataSplitSecond[11].bod - allSelection[i].getValue("custrecord_nml_dec_bod")),
                    perc1bod: formatNumber(getPrecenge(dataSplitSecond[0].bod, allSelection[i].getValue("custrecord_nml_jan_bod"))) + '%',
                    perc2bod: formatNumber(getPrecenge(dataSplitSecond[1].bod, allSelection[i].getValue("custrecord_nml_feb_bod"))) + '%',
                    perc3bod: formatNumber(getPrecenge(dataSplitSecond[2].bod, allSelection[i].getValue("custrecord_nml_mar_bod"))) + '%',
                    perc4bod: formatNumber(getPrecenge(dataSplitSecond[3].bod, allSelection[i].getValue("custrecord_nml_apr_bod"))) + '%',
                    perc5bod: formatNumber(getPrecenge(dataSplitSecond[4].bod, allSelection[i].getValue("custrecord_nml_may_bod"))) + '%',
                    perc6bod: formatNumber(getPrecenge(dataSplitSecond[5].bod, allSelection[i].getValue("custrecord_nml_jun_bod"))) + '%',
                    perc7bod: formatNumber(getPrecenge(dataSplitSecond[6].bod, allSelection[i].getValue("custrecord_nml_jul_bod"))) + '%',
                    perc8bod: formatNumber(getPrecenge(dataSplitSecond[7].bod, allSelection[i].getValue("custrecord_nml_aug_bod"))) + '%',
                    perc9bod: formatNumber(getPrecenge(dataSplitSecond[8].bod, allSelection[i].getValue("custrecord_nml_sep_bod"))) + '%',
                    perc10bod: formatNumber(getPrecenge(dataSplitSecond[9].bod, allSelection[i].getValue("custrecord_nml_oct_bod"))) + '%',
                    perc11bod: formatNumber(getPrecenge(dataSplitSecond[10].bod, allSelection[i].getValue("custrecord_nml_nov_bod"))) + '%',
                    perc12bod: formatNumber(getPrecenge(dataSplitSecond[11].bod, allSelection[i].getValue("custrecord_nml_dec_bod"))) + '%',
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
                    target1cband: formatNumber(allSelection[i].getValue("custrecord_nml_jan_cband")),
                    target2cband: formatNumber(allSelection[i].getValue("custrecord_nml_feb_cband")),
                    target3cband: formatNumber(allSelection[i].getValue("custrecord_nml_mar_cband")),
                    target4cband: formatNumber(allSelection[i].getValue("custrecord_nml_apr_cband")),
                    target5cband: formatNumber(allSelection[i].getValue("custrecord_nml_may_cband")),
                    target6cband: formatNumber(allSelection[i].getValue("custrecord_nml_jun_cband")),
                    target7cband: formatNumber(allSelection[i].getValue("custrecord_nml_jul_cband")),
                    target8cband: formatNumber(allSelection[i].getValue("custrecord_nml_aug_cband")),
                    target9cband: formatNumber(allSelection[i].getValue("custrecord_nml_sep_cband")),
                    target10cband: formatNumber(allSelection[i].getValue("custrecord_nml_oct_cband")),
                    target11cband: formatNumber(allSelection[i].getValue("custrecord_nml_nov_cband")),
                    target12cband: formatNumber(allSelection[i].getValue("custrecord_nml_dec_cband")),
                    gap1cband: formatNumber(dataSplitSecond[0].cband - allSelection[i].getValue("custrecord_nml_jan_cband")),
                    gap2cband: formatNumber(dataSplitSecond[1].cband - allSelection[i].getValue("custrecord_nml_feb_cband")),
                    gap3cband: formatNumber(dataSplitSecond[2].cband - allSelection[i].getValue("custrecord_nml_mar_cband")),
                    gap4cband: formatNumber(dataSplitSecond[3].cband - allSelection[i].getValue("custrecord_nml_apr_cband")),
                    gap5cband: formatNumber(dataSplitSecond[4].cband - allSelection[i].getValue("custrecord_nml_may_cband")),
                    gap6cband: formatNumber(dataSplitSecond[5].cband - allSelection[i].getValue("custrecord_nml_jun_cband")),
                    gap7cband: formatNumber(dataSplitSecond[6].cband - allSelection[i].getValue("custrecord_nml_jul_cband")),
                    gap8cband: formatNumber(dataSplitSecond[7].cband - allSelection[i].getValue("custrecord_nml_aug_cband")),
                    gap9cband: formatNumber(dataSplitSecond[8].cband - allSelection[i].getValue("custrecord_nml_sep_cband")),
                    gap10cband: formatNumber(dataSplitSecond[9].cband - allSelection[i].getValue("custrecord_nml_oct_cband")),
                    gap11cband: formatNumber(dataSplitSecond[10].cband - allSelection[i].getValue("custrecord_nml_nov_cband")),
                    gap12cband: formatNumber(dataSplitSecond[11].cband - allSelection[i].getValue("custrecord_nml_dec_cband")),
                    perc1cband: formatNumber(getPrecenge(dataSplitSecond[0].cband, allSelection[i].getValue("custrecord_nml_jan_cband"))) + '%',
                    perc2cband: formatNumber(getPrecenge(dataSplitSecond[1].cband, allSelection[i].getValue("custrecord_nml_feb_cband"))) + '%',
                    perc3cband: formatNumber(getPrecenge(dataSplitSecond[2].cband, allSelection[i].getValue("custrecord_nml_mar_cband"))) + '%',
                    perc4cband: formatNumber(getPrecenge(dataSplitSecond[3].cband, allSelection[i].getValue("custrecord_nml_apr_cband"))) + '%',
                    perc5cband: formatNumber(getPrecenge(dataSplitSecond[4].cband, allSelection[i].getValue("custrecord_nml_may_cband"))) + '%',
                    perc6cband: formatNumber(getPrecenge(dataSplitSecond[5].cband, allSelection[i].getValue("custrecord_nml_jun_cband"))) + '%',
                    perc7cband: formatNumber(getPrecenge(dataSplitSecond[6].cband, allSelection[i].getValue("custrecord_nml_jul_cband"))) + '%',
                    perc8cband: formatNumber(getPrecenge(dataSplitSecond[7].cband, allSelection[i].getValue("custrecord_nml_aug_cband"))) + '%',
                    perc9cband: formatNumber(getPrecenge(dataSplitSecond[8].cband, allSelection[i].getValue("custrecord_nml_sep_cband"))) + '%',
                    perc10cband: formatNumber(getPrecenge(dataSplitSecond[9].cband, allSelection[i].getValue("custrecord_nml_oct_cband"))) + '%',
                    perc11cband: formatNumber(getPrecenge(dataSplitSecond[10].cband, allSelection[i].getValue("custrecord_nml_nov_cband"))) + '%',
                    perc12cband: formatNumber(getPrecenge(dataSplitSecond[11].cband, allSelection[i].getValue("custrecord_nml_dec_cband"))) + '%',
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
                    target1domestic: formatNumber(allSelection[i].getValue("custrecord_nml_jan_domestic")),
                    target2domestic: formatNumber(allSelection[i].getValue("custrecord_nml_feb_domestic")),
                    target3domestic: formatNumber(allSelection[i].getValue("custrecord_nml_mar_domestic")),
                    target4domestic: formatNumber(allSelection[i].getValue("custrecord_nml_apr_domestic")),
                    target5domestic: formatNumber(allSelection[i].getValue("custrecord_nml_may_domestic")),
                    target6domestic: formatNumber(allSelection[i].getValue("custrecord_nml_jun_domestic")),
                    target7domestic: formatNumber(allSelection[i].getValue("custrecord_nml_jul_domestic")),
                    target8domestic: formatNumber(allSelection[i].getValue("custrecord_nml_aug_domestic")),
                    target9domestic: formatNumber(allSelection[i].getValue("custrecord_nml_sep_domestic")),
                    target10domestic: formatNumber(allSelection[i].getValue("custrecord_nml_oct_domestic")),
                    target11domestic: formatNumber(allSelection[i].getValue("custrecord_nml_nov_domestic")),
                    target12domestic: formatNumber(allSelection[i].getValue("custrecord_nml_dec_domestic")),
                    gap1domestic: formatNumber(dataSplitSecond[0].domestic - allSelection[i].getValue("custrecord_nml_jan_domestic")),
                    gap2domestic: formatNumber(dataSplitSecond[1].domestic - allSelection[i].getValue("custrecord_nml_feb_domestic")),
                    gap3domestic: formatNumber(dataSplitSecond[2].domestic - allSelection[i].getValue("custrecord_nml_mar_domestic")),
                    gap4domestic: formatNumber(dataSplitSecond[3].domestic - allSelection[i].getValue("custrecord_nml_apr_domestic")),
                    gap5domestic: formatNumber(dataSplitSecond[4].domestic - allSelection[i].getValue("custrecord_nml_may_domestic")),
                    gap6domestic: formatNumber(dataSplitSecond[5].domestic - allSelection[i].getValue("custrecord_nml_jun_domestic")),
                    gap7domestic: formatNumber(dataSplitSecond[6].domestic - allSelection[i].getValue("custrecord_nml_jul_domestic")),
                    gap8domestic: formatNumber(dataSplitSecond[7].domestic - allSelection[i].getValue("custrecord_nml_aug_domestic")),
                    gap9domestic: formatNumber(dataSplitSecond[8].domestic - allSelection[i].getValue("custrecord_nml_sep_domestic")),
                    gap10domestic: formatNumber(dataSplitSecond[9].domestic - allSelection[i].getValue("custrecord_nml_oct_domestic")),
                    gap11domestic: formatNumber(dataSplitSecond[10].domestic - allSelection[i].getValue("custrecord_nml_nov_domestic")),
                    gap12domestic: formatNumber(dataSplitSecond[11].domestic - allSelection[i].getValue("custrecord_nml_dec_domestic")),
                    perc1domestic: formatNumber(getPrecenge(dataSplitSecond[0].domestic, allSelection[i].getValue("custrecord_nml_jan_domestic"))) + '%',
                    perc2domestic: formatNumber(getPrecenge(dataSplitSecond[1].domestic, allSelection[i].getValue("custrecord_nml_feb_domestic"))) + '%',
                    perc3domestic: formatNumber(getPrecenge(dataSplitSecond[2].domestic, allSelection[i].getValue("custrecord_nml_mar_domestic"))) + '%',
                    perc4domestic: formatNumber(getPrecenge(dataSplitSecond[3].domestic, allSelection[i].getValue("custrecord_nml_apr_domestic"))) + '%',
                    perc5domestic: formatNumber(getPrecenge(dataSplitSecond[4].domestic, allSelection[i].getValue("custrecord_nml_may_domestic"))) + '%',
                    perc6domestic: formatNumber(getPrecenge(dataSplitSecond[5].domestic, allSelection[i].getValue("custrecord_nml_jun_domestic"))) + '%',
                    perc7domestic: formatNumber(getPrecenge(dataSplitSecond[6].domestic, allSelection[i].getValue("custrecord_nml_jul_domestic"))) + '%',
                    perc8domestic: formatNumber(getPrecenge(dataSplitSecond[7].domestic, allSelection[i].getValue("custrecord_nml_aug_domestic"))) + '%',
                    perc9domestic: formatNumber(getPrecenge(dataSplitSecond[8].domestic, allSelection[i].getValue("custrecord_nml_sep_domestic"))) + '%',
                    perc10domestic: formatNumber(getPrecenge(dataSplitSecond[9].domestic, allSelection[i].getValue("custrecord_nml_oct_domestic"))) + '%',
                    perc11domestic: formatNumber(getPrecenge(dataSplitSecond[10].domestic, allSelection[i].getValue("custrecord_nml_nov_domestic"))) + '%',
                    perc12domestic: formatNumber(getPrecenge(dataSplitSecond[11].domestic, allSelection[i].getValue("custrecord_nml_dec_domestic"))) + '%',
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
                    target1ip: formatNumber(allSelection[i].getValue("custrecord_nml_jan_ip")),
                    target2ip: formatNumber(allSelection[i].getValue("custrecord_nml_feb_ip")),
                    target3ip: formatNumber(allSelection[i].getValue("custrecord_nml_mar_ip")),
                    target4ip: formatNumber(allSelection[i].getValue("custrecord_nml_apr_ip")),
                    target5ip: formatNumber(allSelection[i].getValue("custrecord_nml_may_ip")),
                    target6ip: formatNumber(allSelection[i].getValue("custrecord_nml_jun_ip")),
                    target7ip: formatNumber(allSelection[i].getValue("custrecord_nml_jul_ip")),
                    target8ip: formatNumber(allSelection[i].getValue("custrecord_nml_aug_ip")),
                    target9ip: formatNumber(allSelection[i].getValue("custrecord_nml_sep_ip")),
                    target10ip: formatNumber(allSelection[i].getValue("custrecord_nml_oct_ip")),
                    target11ip: formatNumber(allSelection[i].getValue("custrecord_nml_nov_ip")),
                    target12ip: formatNumber(allSelection[i].getValue("custrecord_nml_dec_ip")),
                    gap1ip: formatNumber(dataSplitSecond[0].ip - allSelection[i].getValue("custrecord_nml_jan_ip")),
                    gap2ip: formatNumber(dataSplitSecond[1].ip - allSelection[i].getValue("custrecord_nml_feb_ip")),
                    gap3ip: formatNumber(dataSplitSecond[2].ip - allSelection[i].getValue("custrecord_nml_mar_ip")),
                    gap4ip: formatNumber(dataSplitSecond[3].ip - allSelection[i].getValue("custrecord_nml_apr_ip")),
                    gap5ip: formatNumber(dataSplitSecond[4].ip - allSelection[i].getValue("custrecord_nml_may_ip")),
                    gap6ip: formatNumber(dataSplitSecond[5].ip - allSelection[i].getValue("custrecord_nml_jun_ip")),
                    gap7ip: formatNumber(dataSplitSecond[6].ip - allSelection[i].getValue("custrecord_nml_jul_ip")),
                    gap8ip: formatNumber(dataSplitSecond[7].ip - allSelection[i].getValue("custrecord_nml_aug_ip")),
                    gap9ip: formatNumber(dataSplitSecond[8].ip - allSelection[i].getValue("custrecord_nml_sep_ip")),
                    gap10ip: formatNumber(dataSplitSecond[9].ip - allSelection[i].getValue("custrecord_nml_oct_ip")),
                    gap11ip: formatNumber(dataSplitSecond[10].ip - allSelection[i].getValue("custrecord_nml_nov_ip")),
                    gap12ip: formatNumber(dataSplitSecond[11].ip - allSelection[i].getValue("custrecord_nml_dec_ip")),
                    perc1ip: formatNumber(getPrecenge(dataSplitSecond[0].ip, allSelection[i].getValue("custrecord_nml_jan_ip"))) + '%',
                    perc2ip: formatNumber(getPrecenge(dataSplitSecond[1].ip, allSelection[i].getValue("custrecord_nml_feb_ip"))) + '%',
                    perc3ip: formatNumber(getPrecenge(dataSplitSecond[2].ip, allSelection[i].getValue("custrecord_nml_mar_ip"))) + '%',
                    perc4ip: formatNumber(getPrecenge(dataSplitSecond[3].ip, allSelection[i].getValue("custrecord_nml_apr_ip"))) + '%',
                    perc5ip: formatNumber(getPrecenge(dataSplitSecond[4].ip, allSelection[i].getValue("custrecord_nml_may_ip"))) + '%',
                    perc6ip: formatNumber(getPrecenge(dataSplitSecond[5].ip, allSelection[i].getValue("custrecord_nml_jun_ip"))) + '%',
                    perc7ip: formatNumber(getPrecenge(dataSplitSecond[6].ip, allSelection[i].getValue("custrecord_nml_jul_ip"))) + '%',
                    perc8ip: formatNumber(getPrecenge(dataSplitSecond[7].ip, allSelection[i].getValue("custrecord_nml_aug_ip"))) + '%',
                    perc9ip: formatNumber(getPrecenge(dataSplitSecond[8].ip, allSelection[i].getValue("custrecord_nml_sep_ip"))) + '%',
                    perc10ip: formatNumber(getPrecenge(dataSplitSecond[9].ip, allSelection[i].getValue("custrecord_nml_oct_ip"))) + '%',
                    perc11ip: formatNumber(getPrecenge(dataSplitSecond[10].ip, allSelection[i].getValue("custrecord_nml_nov_ip"))) + '%',
                    perc12ip: formatNumber(getPrecenge(dataSplitSecond[11].ip, allSelection[i].getValue("custrecord_nml_dec_ip"))) + '%',
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
                    target1iru: formatNumber(allSelection[i].getValue("custrecord_nml_jan_iru")),
                    target2iru: formatNumber(allSelection[i].getValue("custrecord_nml_feb_iru")),
                    target3iru: formatNumber(allSelection[i].getValue("custrecord_nml_mar_iru")),
                    target4iru: formatNumber(allSelection[i].getValue("custrecord_nml_apr_iru")),
                    target5iru: formatNumber(allSelection[i].getValue("custrecord_nml_may_iru")),
                    target6iru: formatNumber(allSelection[i].getValue("custrecord_nml_jun_iru")),
                    target7iru: formatNumber(allSelection[i].getValue("custrecord_nml_jul_iru")),
                    target8iru: formatNumber(allSelection[i].getValue("custrecord_nml_aug_iru")),
                    target9iru: formatNumber(allSelection[i].getValue("custrecord_nml_sep_iru")),
                    target10iru: formatNumber(allSelection[i].getValue("custrecord_nml_oct_iru")),
                    target11iru: formatNumber(allSelection[i].getValue("custrecord_nml_nov_iru")),
                    target12iru: formatNumber(allSelection[i].getValue("custrecord_nml_dec_iru")),
                    gap1iru: formatNumber(dataSplitSecond[0].iru - allSelection[i].getValue("custrecord_nml_jan_iru")),
                    gap2iru: formatNumber(dataSplitSecond[1].iru - allSelection[i].getValue("custrecord_nml_feb_iru")),
                    gap3iru: formatNumber(dataSplitSecond[2].iru - allSelection[i].getValue("custrecord_nml_mar_iru")),
                    gap4iru: formatNumber(dataSplitSecond[3].iru - allSelection[i].getValue("custrecord_nml_apr_iru")),
                    gap5iru: formatNumber(dataSplitSecond[4].iru - allSelection[i].getValue("custrecord_nml_may_iru")),
                    gap6iru: formatNumber(dataSplitSecond[5].iru - allSelection[i].getValue("custrecord_nml_jun_iru")),
                    gap7iru: formatNumber(dataSplitSecond[6].iru - allSelection[i].getValue("custrecord_nml_jul_iru")),
                    gap8iru: formatNumber(dataSplitSecond[7].iru - allSelection[i].getValue("custrecord_nml_aug_iru")),
                    gap9iru: formatNumber(dataSplitSecond[8].iru - allSelection[i].getValue("custrecord_nml_sep_iru")),
                    gap10iru: formatNumber(dataSplitSecond[9].iru - allSelection[i].getValue("custrecord_nml_oct_iru")),
                    gap11iru: formatNumber(dataSplitSecond[10].iru - allSelection[i].getValue("custrecord_nml_nov_iru")),
                    gap12iru: formatNumber(dataSplitSecond[11].iru - allSelection[i].getValue("custrecord_nml_dec_iru")),
                    perc1iru: formatNumber(getPrecenge(dataSplitSecond[0].iru, allSelection[i].getValue("custrecord_nml_jan_iru"))) + '%',
                    perc2iru: formatNumber(getPrecenge(dataSplitSecond[1].iru, allSelection[i].getValue("custrecord_nml_feb_iru"))) + '%',
                    perc3iru: formatNumber(getPrecenge(dataSplitSecond[2].iru, allSelection[i].getValue("custrecord_nml_mar_iru"))) + '%',
                    perc4iru: formatNumber(getPrecenge(dataSplitSecond[3].iru, allSelection[i].getValue("custrecord_nml_apr_iru"))) + '%',
                    perc5iru: formatNumber(getPrecenge(dataSplitSecond[4].iru, allSelection[i].getValue("custrecord_nml_may_iru"))) + '%',
                    perc6iru: formatNumber(getPrecenge(dataSplitSecond[5].iru, allSelection[i].getValue("custrecord_nml_jun_iru"))) + '%',
                    perc7iru: formatNumber(getPrecenge(dataSplitSecond[6].iru, allSelection[i].getValue("custrecord_nml_jul_iru"))) + '%',
                    perc8iru: formatNumber(getPrecenge(dataSplitSecond[7].iru, allSelection[i].getValue("custrecord_nml_aug_iru"))) + '%',
                    perc9iru: formatNumber(getPrecenge(dataSplitSecond[8].iru, allSelection[i].getValue("custrecord_nml_sep_iru"))) + '%',
                    perc10iru: formatNumber(getPrecenge(dataSplitSecond[9].iru, allSelection[i].getValue("custrecord_nml_oct_iru"))) + '%',
                    perc11iru: formatNumber(getPrecenge(dataSplitSecond[10].iru, allSelection[i].getValue("custrecord_nml_nov_iru"))) + '%',
                    perc12iru: formatNumber(getPrecenge(dataSplitSecond[11].iru, allSelection[i].getValue("custrecord_nml_dec_iru"))) + '%',
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
                    target1kuband: formatNumber(allSelection[i].getValue("custrecord_nml_jan_kuband")),
                    target2kuband: formatNumber(allSelection[i].getValue("custrecord_nml_feb_kuband")),
                    target3kuband: formatNumber(allSelection[i].getValue("custrecord_nml_mar_kuband")),
                    target4kuband: formatNumber(allSelection[i].getValue("custrecord_nml_apr_kuband")),
                    target5kuband: formatNumber(allSelection[i].getValue("custrecord_nml_may_kuband")),
                    target6kuband: formatNumber(allSelection[i].getValue("custrecord_nml_jun_kuband")),
                    target7kuband: formatNumber(allSelection[i].getValue("custrecord_nml_jul_kuband")),
                    target8kuband: formatNumber(allSelection[i].getValue("custrecord_nml_aug_kuband")),
                    target9kuband: formatNumber(allSelection[i].getValue("custrecord_nml_sep_kuband")),
                    target10kuband: formatNumber(allSelection[i].getValue("custrecord_nml_oct_kuband")),
                    target11kuband: formatNumber(allSelection[i].getValue("custrecord_nml_nov_kuband")),
                    target12kuband: formatNumber(allSelection[i].getValue("custrecord_nml_dec_kuband")),
                    gap1kuband: formatNumber(dataSplitSecond[0].kuband - allSelection[i].getValue("custrecord_nml_jan_kuband")),
                    gap2kuband: formatNumber(dataSplitSecond[1].kuband - allSelection[i].getValue("custrecord_nml_feb_kuband")),
                    gap3kuband: formatNumber(dataSplitSecond[2].kuband - allSelection[i].getValue("custrecord_nml_mar_kuband")),
                    gap4kuband: formatNumber(dataSplitSecond[3].kuband - allSelection[i].getValue("custrecord_nml_apr_kuband")),
                    gap5kuband: formatNumber(dataSplitSecond[4].kuband - allSelection[i].getValue("custrecord_nml_may_kuband")),
                    gap6kuband: formatNumber(dataSplitSecond[5].kuband - allSelection[i].getValue("custrecord_nml_jun_kuband")),
                    gap7kuband: formatNumber(dataSplitSecond[6].kuband - allSelection[i].getValue("custrecord_nml_jul_kuband")),
                    gap8kuband: formatNumber(dataSplitSecond[7].kuband - allSelection[i].getValue("custrecord_nml_aug_kuband")),
                    gap9kuband: formatNumber(dataSplitSecond[8].kuband - allSelection[i].getValue("custrecord_nml_sep_kuband")),
                    gap10kuband: formatNumber(dataSplitSecond[9].kuband - allSelection[i].getValue("custrecord_nml_oct_kuband")),
                    gap11kuband: formatNumber(dataSplitSecond[10].kuband - allSelection[i].getValue("custrecord_nml_nov_kuband")),
                    gap12kuband: formatNumber(dataSplitSecond[11].kuband - allSelection[i].getValue("custrecord_nml_dec_kuband")),
                    perc1kuband: formatNumber(getPrecenge(dataSplitSecond[0].kuband, allSelection[i].getValue("custrecord_nml_jan_kuband"))) + '%',
                    perc2kuband: formatNumber(getPrecenge(dataSplitSecond[1].kuband, allSelection[i].getValue("custrecord_nml_feb_kuband"))) + '%',
                    perc3kuband: formatNumber(getPrecenge(dataSplitSecond[2].kuband, allSelection[i].getValue("custrecord_nml_mar_kuband"))) + '%',
                    perc4kuband: formatNumber(getPrecenge(dataSplitSecond[3].kuband, allSelection[i].getValue("custrecord_nml_apr_kuband"))) + '%',
                    perc5kuband: formatNumber(getPrecenge(dataSplitSecond[4].kuband, allSelection[i].getValue("custrecord_nml_may_kuband"))) + '%',
                    perc6kuband: formatNumber(getPrecenge(dataSplitSecond[5].kuband, allSelection[i].getValue("custrecord_nml_jun_kuband"))) + '%',
                    perc7kuband: formatNumber(getPrecenge(dataSplitSecond[6].kuband, allSelection[i].getValue("custrecord_nml_jul_kuband"))) + '%',
                    perc8kuband: formatNumber(getPrecenge(dataSplitSecond[7].kuband, allSelection[i].getValue("custrecord_nml_aug_kuband"))) + '%',
                    perc9kuband: formatNumber(getPrecenge(dataSplitSecond[8].kuband, allSelection[i].getValue("custrecord_nml_sep_kuband"))) + '%',
                    perc10kuband: formatNumber(getPrecenge(dataSplitSecond[9].kuband, allSelection[i].getValue("custrecord_nml_oct_kuband"))) + '%',
                    perc11kuband: formatNumber(getPrecenge(dataSplitSecond[10].kuband, allSelection[i].getValue("custrecord_nml_nov_kuband"))) + '%',
                    perc12kuband: formatNumber(getPrecenge(dataSplitSecond[11].kuband, allSelection[i].getValue("custrecord_nml_dec_kuband"))) + '%',
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
                    target1mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_jan_mobile_vsat")),
                    target2mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_feb_mobile_vsat")),
                    target3mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_mar_mobile_vsat")),
                    target4mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_apr_mobile_vsat")),
                    target5mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_may_mobile_vsat")),
                    target6mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_jun_mobile_vsat")),
                    target7mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_jul_mobile_vsat")),
                    target8mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_aug_mobile_vsat")),
                    target9mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_sep_mobile_vsat")),
                    target10mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_oct_mobile_vsat")),
                    target11mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_nov_mobile_vsat")),
                    target12mobile_vsat: formatNumber(allSelection[i].getValue("custrecord_nml_dec_mobile_vsat")),
                    gap1mobile_vsat: formatNumber(dataSplitSecond[0].mobile_vsat - allSelection[i].getValue("custrecord_nml_jan_mobile_vsat")),
                    gap2mobile_vsat: formatNumber(dataSplitSecond[1].mobile_vsat - allSelection[i].getValue("custrecord_nml_feb_mobile_vsat")),
                    gap3mobile_vsat: formatNumber(dataSplitSecond[2].mobile_vsat - allSelection[i].getValue("custrecord_nml_mar_mobile_vsat")),
                    gap4mobile_vsat: formatNumber(dataSplitSecond[3].mobile_vsat - allSelection[i].getValue("custrecord_nml_apr_mobile_vsat")),
                    gap5mobile_vsat: formatNumber(dataSplitSecond[4].mobile_vsat - allSelection[i].getValue("custrecord_nml_may_mobile_vsat")),
                    gap6mobile_vsat: formatNumber(dataSplitSecond[5].mobile_vsat - allSelection[i].getValue("custrecord_nml_jun_mobile_vsat")),
                    gap7mobile_vsat: formatNumber(dataSplitSecond[6].mobile_vsat - allSelection[i].getValue("custrecord_nml_jul_mobile_vsat")),
                    gap8mobile_vsat: formatNumber(dataSplitSecond[7].mobile_vsat - allSelection[i].getValue("custrecord_nml_aug_mobile_vsat")),
                    gap9mobile_vsat: formatNumber(dataSplitSecond[8].mobile_vsat - allSelection[i].getValue("custrecord_nml_sep_mobile_vsat")),
                    gap10mobile_vsat: formatNumber(dataSplitSecond[9].mobile_vsat - allSelection[i].getValue("custrecord_nml_oct_mobile_vsat")),
                    gap11mobile_vsat: formatNumber(dataSplitSecond[10].mobile_vsat - allSelection[i].getValue("custrecord_nml_nov_mobile_vsat")),
                    gap12mobile_vsat: formatNumber(dataSplitSecond[11].mobile_vsat - allSelection[i].getValue("custrecord_nml_dec_mobile_vsat")),
                    perc1mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[0].mobile_vsat, allSelection[i].getValue("custrecord_nml_jan_mobile_vsat"))) + '%',
                    perc2mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[1].mobile_vsat, allSelection[i].getValue("custrecord_nml_feb_mobile_vsat"))) + '%',
                    perc3mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[2].mobile_vsat, allSelection[i].getValue("custrecord_nml_mar_mobile_vsat"))) + '%',
                    perc4mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[3].mobile_vsat, allSelection[i].getValue("custrecord_nml_apr_mobile_vsat"))) + '%',
                    perc5mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[4].mobile_vsat, allSelection[i].getValue("custrecord_nml_may_mobile_vsat"))) + '%',
                    perc6mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[5].mobile_vsat, allSelection[i].getValue("custrecord_nml_jun_mobile_vsat"))) + '%',
                    perc7mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[6].mobile_vsat, allSelection[i].getValue("custrecord_nml_jul_mobile_vsat"))) + '%',
                    perc8mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[7].mobile_vsat, allSelection[i].getValue("custrecord_nml_aug_mobile_vsat"))) + '%',
                    perc9mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[8].mobile_vsat, allSelection[i].getValue("custrecord_nml_sep_mobile_vsat"))) + '%',
                    perc10mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[9].mobile_vsat, allSelection[i].getValue("custrecord_nml_oct_mobile_vsat"))) + '%',
                    perc11mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[10].mobile_vsat, allSelection[i].getValue("custrecord_nml_nov_mobile_vsat"))) + '%',
                    perc12mobile_vsat: formatNumber(getPrecenge(dataSplitSecond[11].mobile_vsat, allSelection[i].getValue("custrecord_nml_dec_mobile_vsat"))) + '%',
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
                    target1mpip: formatNumber(allSelection[i].getValue("custrecord_nml_jan_mpip")),
                    target2mpip: formatNumber(allSelection[i].getValue("custrecord_nml_feb_mpip")),
                    target3mpip: formatNumber(allSelection[i].getValue("custrecord_nml_mar_mpip")),
                    target4mpip: formatNumber(allSelection[i].getValue("custrecord_nml_apr_mpip")),
                    target5mpip: formatNumber(allSelection[i].getValue("custrecord_nml_may_mpip")),
                    target6mpip: formatNumber(allSelection[i].getValue("custrecord_nml_jun_mpip")),
                    target7mpip: formatNumber(allSelection[i].getValue("custrecord_nml_jul_mpip")),
                    target8mpip: formatNumber(allSelection[i].getValue("custrecord_nml_aug_mpip")),
                    target9mpip: formatNumber(allSelection[i].getValue("custrecord_nml_sep_mpip")),
                    target10mpip: formatNumber(allSelection[i].getValue("custrecord_nml_oct_mpip")),
                    target11mpip: formatNumber(allSelection[i].getValue("custrecord_nml_nov_mpip")),
                    target12mpip: formatNumber(allSelection[i].getValue("custrecord_nml_dec_mpip")),
                    gap1mpip: formatNumber(dataSplitSecond[0].mpip - allSelection[i].getValue("custrecord_nml_jan_mpip")),
                    gap2mpip: formatNumber(dataSplitSecond[1].mpip - allSelection[i].getValue("custrecord_nml_feb_mpip")),
                    gap3mpip: formatNumber(dataSplitSecond[2].mpip - allSelection[i].getValue("custrecord_nml_mar_mpip")),
                    gap4mpip: formatNumber(dataSplitSecond[3].mpip - allSelection[i].getValue("custrecord_nml_apr_mpip")),
                    gap5mpip: formatNumber(dataSplitSecond[4].mpip - allSelection[i].getValue("custrecord_nml_may_mpip")),
                    gap6mpip: formatNumber(dataSplitSecond[5].mpip - allSelection[i].getValue("custrecord_nml_jun_mpip")),
                    gap7mpip: formatNumber(dataSplitSecond[6].mpip - allSelection[i].getValue("custrecord_nml_jul_mpip")),
                    gap8mpip: formatNumber(dataSplitSecond[7].mpip - allSelection[i].getValue("custrecord_nml_aug_mpip")),
                    gap9mpip: formatNumber(dataSplitSecond[8].mpip - allSelection[i].getValue("custrecord_nml_sep_mpip")),
                    gap10mpip: formatNumber(dataSplitSecond[9].mpip - allSelection[i].getValue("custrecord_nml_oct_mpip")),
                    gap11mpip: formatNumber(dataSplitSecond[10].mpip - allSelection[i].getValue("custrecord_nml_nov_mpip")),
                    gap12mpip: formatNumber(dataSplitSecond[11].mpip - allSelection[i].getValue("custrecord_nml_dec_mpip")),
                    perc1mpip: formatNumber(getPrecenge(dataSplitSecond[0].mpip, allSelection[i].getValue("custrecord_nml_jan_mpip"))) + '%',
                    perc2mpip: formatNumber(getPrecenge(dataSplitSecond[1].mpip, allSelection[i].getValue("custrecord_nml_feb_mpip"))) + '%',
                    perc3mpip: formatNumber(getPrecenge(dataSplitSecond[2].mpip, allSelection[i].getValue("custrecord_nml_mar_mpip"))) + '%',
                    perc4mpip: formatNumber(getPrecenge(dataSplitSecond[3].mpip, allSelection[i].getValue("custrecord_nml_apr_mpip"))) + '%',
                    perc5mpip: formatNumber(getPrecenge(dataSplitSecond[4].mpip, allSelection[i].getValue("custrecord_nml_may_mpip"))) + '%',
                    perc6mpip: formatNumber(getPrecenge(dataSplitSecond[5].mpip, allSelection[i].getValue("custrecord_nml_jun_mpip"))) + '%',
                    perc7mpip: formatNumber(getPrecenge(dataSplitSecond[6].mpip, allSelection[i].getValue("custrecord_nml_jul_mpip"))) + '%',
                    perc8mpip: formatNumber(getPrecenge(dataSplitSecond[7].mpip, allSelection[i].getValue("custrecord_nml_aug_mpip"))) + '%',
                    perc9mpip: formatNumber(getPrecenge(dataSplitSecond[8].mpip, allSelection[i].getValue("custrecord_nml_sep_mpip"))) + '%',
                    perc10mpip: formatNumber(getPrecenge(dataSplitSecond[9].mpip, allSelection[i].getValue("custrecord_nml_oct_mpip"))) + '%',
                    perc11mpip: formatNumber(getPrecenge(dataSplitSecond[10].mpip, allSelection[i].getValue("custrecord_nml_nov_mpip"))) + '%',
                    perc12mpip: formatNumber(getPrecenge(dataSplitSecond[11].mpip, allSelection[i].getValue("custrecord_nml_dec_mpip"))) + '%',
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
                    target1o3b: formatNumber(allSelection[i].getValue("custrecord_nml_jan_o3b")),
                    target2o3b: formatNumber(allSelection[i].getValue("custrecord_nml_feb_o3b")),
                    target3o3b: formatNumber(allSelection[i].getValue("custrecord_nml_mar_o3b")),
                    target4o3b: formatNumber(allSelection[i].getValue("custrecord_nml_apr_o3b")),
                    target5o3b: formatNumber(allSelection[i].getValue("custrecord_nml_may_o3b")),
                    target6o3b: formatNumber(allSelection[i].getValue("custrecord_nml_jun_o3b")),
                    target7o3b: formatNumber(allSelection[i].getValue("custrecord_nml_jul_o3b")),
                    target8o3b: formatNumber(allSelection[i].getValue("custrecord_nml_aug_o3b")),
                    target9o3b: formatNumber(allSelection[i].getValue("custrecord_nml_sep_o3b")),
                    target10o3b: formatNumber(allSelection[i].getValue("custrecord_nml_oct_o3b")),
                    target11o3b: formatNumber(allSelection[i].getValue("custrecord_nml_nov_o3b")),
                    target12o3b: formatNumber(allSelection[i].getValue("custrecord_nml_dec_o3b")),
                    gap1o3b: formatNumber(dataSplitSecond[0].o3b - allSelection[i].getValue("custrecord_nml_jan_o3b")),
                    gap2o3b: formatNumber(dataSplitSecond[1].o3b - allSelection[i].getValue("custrecord_nml_feb_o3b")),
                    gap3o3b: formatNumber(dataSplitSecond[2].o3b - allSelection[i].getValue("custrecord_nml_mar_o3b")),
                    gap4o3b: formatNumber(dataSplitSecond[3].o3b - allSelection[i].getValue("custrecord_nml_apr_o3b")),
                    gap5o3b: formatNumber(dataSplitSecond[4].o3b - allSelection[i].getValue("custrecord_nml_may_o3b")),
                    gap6o3b: formatNumber(dataSplitSecond[5].o3b - allSelection[i].getValue("custrecord_nml_jun_o3b")),
                    gap7o3b: formatNumber(dataSplitSecond[6].o3b - allSelection[i].getValue("custrecord_nml_jul_o3b")),
                    gap8o3b: formatNumber(dataSplitSecond[7].o3b - allSelection[i].getValue("custrecord_nml_aug_o3b")),
                    gap9o3b: formatNumber(dataSplitSecond[8].o3b - allSelection[i].getValue("custrecord_nml_sep_o3b")),
                    gap10o3b: formatNumber(dataSplitSecond[9].o3b - allSelection[i].getValue("custrecord_nml_oct_o3b")),
                    gap11o3b: formatNumber(dataSplitSecond[10].o3b - allSelection[i].getValue("custrecord_nml_nov_o3b")),
                    gap12o3b: formatNumber(dataSplitSecond[11].o3b - allSelection[i].getValue("custrecord_nml_dec_o3b")),
                    perc1o3b: formatNumber(getPrecenge(dataSplitSecond[0].o3b, allSelection[i].getValue("custrecord_nml_jan_o3b"))) + '%',
                    perc2o3b: formatNumber(getPrecenge(dataSplitSecond[1].o3b, allSelection[i].getValue("custrecord_nml_feb_o3b"))) + '%',
                    perc3o3b: formatNumber(getPrecenge(dataSplitSecond[2].o3b, allSelection[i].getValue("custrecord_nml_mar_o3b"))) + '%',
                    perc4o3b: formatNumber(getPrecenge(dataSplitSecond[3].o3b, allSelection[i].getValue("custrecord_nml_apr_o3b"))) + '%',
                    perc5o3b: formatNumber(getPrecenge(dataSplitSecond[4].o3b, allSelection[i].getValue("custrecord_nml_may_o3b"))) + '%',
                    perc6o3b: formatNumber(getPrecenge(dataSplitSecond[5].o3b, allSelection[i].getValue("custrecord_nml_jun_o3b"))) + '%',
                    perc7o3b: formatNumber(getPrecenge(dataSplitSecond[6].o3b, allSelection[i].getValue("custrecord_nml_jul_o3b"))) + '%',
                    perc8o3b: formatNumber(getPrecenge(dataSplitSecond[7].o3b, allSelection[i].getValue("custrecord_nml_aug_o3b"))) + '%',
                    perc9o3b: formatNumber(getPrecenge(dataSplitSecond[8].o3b, allSelection[i].getValue("custrecord_nml_sep_o3b"))) + '%',
                    perc10o3b: formatNumber(getPrecenge(dataSplitSecond[9].o3b, allSelection[i].getValue("custrecord_nml_oct_o3b"))) + '%',
                    perc11o3b: formatNumber(getPrecenge(dataSplitSecond[10].o3b, allSelection[i].getValue("custrecord_nml_nov_o3b"))) + '%',
                    perc12o3b: formatNumber(getPrecenge(dataSplitSecond[11].o3b, allSelection[i].getValue("custrecord_nml_dec_o3b"))) + '%',
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
                    target1ps: formatNumber(allSelection[i].getValue("custrecord_nml_jan_ps")),
                    target2ps: formatNumber(allSelection[i].getValue("custrecord_nml_feb_ps")),
                    target3ps: formatNumber(allSelection[i].getValue("custrecord_nml_mar_ps")),
                    target4ps: formatNumber(allSelection[i].getValue("custrecord_nml_apr_ps")),
                    target5ps: formatNumber(allSelection[i].getValue("custrecord_nml_may_ps")),
                    target6ps: formatNumber(allSelection[i].getValue("custrecord_nml_jun_ps")),
                    target7ps: formatNumber(allSelection[i].getValue("custrecord_nml_jul_ps")),
                    target8ps: formatNumber(allSelection[i].getValue("custrecord_nml_aug_ps")),
                    target9ps: formatNumber(allSelection[i].getValue("custrecord_nml_sep_ps")),
                    target10ps: formatNumber(allSelection[i].getValue("custrecord_nml_oct_ps")),
                    target11ps: formatNumber(allSelection[i].getValue("custrecord_nml_nov_ps")),
                    target12ps: formatNumber(allSelection[i].getValue("custrecord_nml_dec_sr")),
                    totalps: formatNumber(totalps),
                    totaltargetps: formatNumber(totaltargetps),
                    totalgapps: formatNumber(totalps - totaltargetps),
                    totalpercps: formatNumber(getPrecenge(totalps, totaltargetps)) + '%',
                    gap1ps: formatNumber(dataSplitSecond[0].ps - allSelection[i].getValue("custrecord_nml_jan_ps")),
                    gap2ps: formatNumber(dataSplitSecond[1].ps - allSelection[i].getValue("custrecord_nml_feb_ps")),
                    gap3ps: formatNumber(dataSplitSecond[2].ps - allSelection[i].getValue("custrecord_nml_mar_ps")),
                    gap4ps: formatNumber(dataSplitSecond[3].ps - allSelection[i].getValue("custrecord_nml_apr_ps")),
                    gap5ps: formatNumber(dataSplitSecond[4].ps - allSelection[i].getValue("custrecord_nml_may_ps")),
                    gap6ps: formatNumber(dataSplitSecond[5].ps - allSelection[i].getValue("custrecord_nml_jun_ps")),
                    gap7ps: formatNumber(dataSplitSecond[6].ps - allSelection[i].getValue("custrecord_nml_jul_ps")),
                    gap8ps: formatNumber(dataSplitSecond[7].ps - allSelection[i].getValue("custrecord_nml_aug_ps")),
                    gap9ps: formatNumber(dataSplitSecond[8].ps - allSelection[i].getValue("custrecord_nml_sep_ps")),
                    gap10ps: formatNumber(dataSplitSecond[9].ps - allSelection[i].getValue("custrecord_nml_oct_ps")),
                    gap11ps: formatNumber(dataSplitSecond[10].ps - allSelection[i].getValue("custrecord_nml_nov_ps")),
                    gap12ps: formatNumber(dataSplitSecond[11].ps - allSelection[i].getValue("custrecord_nml_dec_sr")),
                    perc1ps: formatNumber(getPrecenge(dataSplitSecond[0].ps, allSelection[i].getValue("custrecord_nml_jan_ps"))) + '%',
                    perc2ps: formatNumber(getPrecenge(dataSplitSecond[1].ps, allSelection[i].getValue("custrecord_nml_feb_ps"))) + '%',
                    perc3ps: formatNumber(getPrecenge(dataSplitSecond[2].ps, allSelection[i].getValue("custrecord_nml_mar_ps"))) + '%',
                    perc4ps: formatNumber(getPrecenge(dataSplitSecond[3].ps, allSelection[i].getValue("custrecord_nml_apr_ps"))) + '%',
                    perc5ps: formatNumber(getPrecenge(dataSplitSecond[4].ps, allSelection[i].getValue("custrecord_nml_may_ps"))) + '%',
                    perc6ps: formatNumber(getPrecenge(dataSplitSecond[5].ps, allSelection[i].getValue("custrecord_nml_jun_ps"))) + '%',
                    perc7ps: formatNumber(getPrecenge(dataSplitSecond[6].ps, allSelection[i].getValue("custrecord_nml_jul_ps"))) + '%',
                    perc8ps: formatNumber(getPrecenge(dataSplitSecond[7].ps, allSelection[i].getValue("custrecord_nml_aug_ps"))) + '%',
                    perc9ps: formatNumber(getPrecenge(dataSplitSecond[8].ps, allSelection[i].getValue("custrecord_nml_sep_ps"))) + '%',
                    perc10ps: formatNumber(getPrecenge(dataSplitSecond[9].ps, allSelection[i].getValue("custrecord_nml_oct_ps"))) + '%',
                    perc11ps: formatNumber(getPrecenge(dataSplitSecond[10].ps, allSelection[i].getValue("custrecord_nml_nov_ps"))) + '%',
                    perc12ps: formatNumber(getPrecenge(dataSplitSecond[11].ps, allSelection[i].getValue("custrecord_nml_dec_sr"))) + '%',
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
                    target1hw: formatNumber(allSelection[i].getValue("custrecord_nml_jan_hw")),
                    target2hw: formatNumber(allSelection[i].getValue("custrecord_nml_feb_hw")),
                    target3hw: formatNumber(allSelection[i].getValue("custrecord_nml_mar_hw")),
                    target4hw: formatNumber(allSelection[i].getValue("custrecord_nml_apr_hw")),
                    target5hw: formatNumber(allSelection[i].getValue("custrecord_nml_may_hw")),
                    target6hw: formatNumber(allSelection[i].getValue("custrecord_nml_jun_hw")),
                    target7hw: formatNumber(allSelection[i].getValue("custrecord_nml_jul_hw")),
                    target8hw: formatNumber(allSelection[i].getValue("custrecord_nml_aug_hw")),
                    target9hw: formatNumber(allSelection[i].getValue("custrecord_nml_sep_hw")),
                    target10hw: formatNumber(allSelection[i].getValue("custrecord_nml_oct_hw")),
                    target11hw: formatNumber(allSelection[i].getValue("custrecord_nml_nov_hw")),
                    target12hw: formatNumber(allSelection[i].getValue("custrecord_nml_dec_hw")),
                    gap1hw: formatNumber(dataSplitSecond[0].hw - allSelection[i].getValue("custrecord_nml_jan_hw")),
                    gap2hw: formatNumber(dataSplitSecond[1].hw - allSelection[i].getValue("custrecord_nml_feb_hw")),
                    gap3hw: formatNumber(dataSplitSecond[2].hw - allSelection[i].getValue("custrecord_nml_mar_hw")),
                    gap4hw: formatNumber(dataSplitSecond[3].hw - allSelection[i].getValue("custrecord_nml_apr_hw")),
                    gap5hw: formatNumber(dataSplitSecond[4].hw - allSelection[i].getValue("custrecord_nml_may_hw")),
                    gap6hw: formatNumber(dataSplitSecond[5].hw - allSelection[i].getValue("custrecord_nml_jun_hw")),
                    gap7hw: formatNumber(dataSplitSecond[6].hw - allSelection[i].getValue("custrecord_nml_jul_hw")),
                    gap8hw: formatNumber(dataSplitSecond[7].hw - allSelection[i].getValue("custrecord_nml_aug_hw")),
                    gap9hw: formatNumber(dataSplitSecond[8].hw - allSelection[i].getValue("custrecord_nml_sep_hw")),
                    gap10hw: formatNumber(dataSplitSecond[9].hw - allSelection[i].getValue("custrecord_nml_oct_hw")),
                    gap11hw: formatNumber(dataSplitSecond[10].hw - allSelection[i].getValue("custrecord_nml_nov_hw")),
                    gap12hw: formatNumber(dataSplitSecond[11].hw - allSelection[i].getValue("custrecord_nml_dec_hw")),
                    perc1hw: formatNumber(getPrecenge(dataSplitSecond[0].hw, allSelection[i].getValue("custrecord_nml_jan_hw"))) + '%',
                    perc2hw: formatNumber(getPrecenge(dataSplitSecond[1].hw, allSelection[i].getValue("custrecord_nml_feb_hw"))) + '%',
                    perc3hw: formatNumber(getPrecenge(dataSplitSecond[2].hw, allSelection[i].getValue("custrecord_nml_mar_hw"))) + '%',
                    perc4hw: formatNumber(getPrecenge(dataSplitSecond[3].hw, allSelection[i].getValue("custrecord_nml_apr_hw"))) + '%',
                    perc5hw: formatNumber(getPrecenge(dataSplitSecond[4].hw, allSelection[i].getValue("custrecord_nml_may_hw"))) + '%',
                    perc6hw: formatNumber(getPrecenge(dataSplitSecond[5].hw, allSelection[i].getValue("custrecord_nml_jun_hw"))) + '%',
                    perc7hw: formatNumber(getPrecenge(dataSplitSecond[6].hw, allSelection[i].getValue("custrecord_nml_jul_hw"))) + '%',
                    perc8hw: formatNumber(getPrecenge(dataSplitSecond[7].hw, allSelection[i].getValue("custrecord_nml_aug_hw"))) + '%',
                    perc9hw: formatNumber(getPrecenge(dataSplitSecond[8].hw, allSelection[i].getValue("custrecord_nml_sep_hw"))) + '%',
                    perc10hw: formatNumber(getPrecenge(dataSplitSecond[9].hw, allSelection[i].getValue("custrecord_nml_oct_hw"))) + '%',
                    perc11hw: formatNumber(getPrecenge(dataSplitSecond[10].hw, allSelection[i].getValue("custrecord_nml_nov_hw"))) + '%',
                    perc12hw: formatNumber(getPrecenge(dataSplitSecond[11].hw, allSelection[i].getValue("custrecord_nml_dec_hw"))) + '%',
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
                    target1dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_jan_dhlsh")),
                    target2dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_feb_dhlsh")),
                    target3dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_mar_dhlsh")),
                    target4dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_apr_dhlsh")),
                    target5dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_may_dhlsh")),
                    target6dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_jun_dhlsh")),
                    target7dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_jul_dhlsh")),
                    target8dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_aug_dhlsh")),
                    target9dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_sep_dhlsh")),
                    target10dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_oct_dhlsh")),
                    target11dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_nov_dhlsh")),
                    target12dhls_hw: formatNumber(allSelection[i].getValue("custrecord_nml_dec_dhlsh")),
                    gap1dhls_hw: formatNumber(dataSplitSecond[0].dhls_hw - allSelection[i].getValue("custrecord_nml_jan_dhlsh")),
                    gap2dhls_hw: formatNumber(dataSplitSecond[1].dhls_hw - allSelection[i].getValue("custrecord_nml_feb_dhlsh")),
                    gap3dhls_hw: formatNumber(dataSplitSecond[2].dhls_hw - allSelection[i].getValue("custrecord_nml_mar_dhlsh")),
                    gap4dhls_hw: formatNumber(dataSplitSecond[3].dhls_hw - allSelection[i].getValue("custrecord_nml_apr_dhlsh")),
                    gap5dhls_hw: formatNumber(dataSplitSecond[4].dhls_hw - allSelection[i].getValue("custrecord_nml_may_dhlsh")),
                    gap6dhls_hw: formatNumber(dataSplitSecond[5].dhls_hw - allSelection[i].getValue("custrecord_nml_jun_dhlsh")),
                    gap7dhls_hw: formatNumber(dataSplitSecond[6].dhls_hw - allSelection[i].getValue("custrecord_nml_jul_dhlsh")),
                    gap8dhls_hw: formatNumber(dataSplitSecond[7].dhls_hw - allSelection[i].getValue("custrecord_nml_aug_dhlsh")),
                    gap9dhls_hw: formatNumber(dataSplitSecond[8].dhls_hw - allSelection[i].getValue("custrecord_nml_sep_dhlsh")),
                    gap10dhls_hw: formatNumber(dataSplitSecond[9].dhls_hw - allSelection[i].getValue("custrecord_nml_oct_dhlsh")),
                    gap11dhls_hw: formatNumber(dataSplitSecond[10].dhls_hw - allSelection[i].getValue("custrecord_nml_nov_dhlsh")),
                    gap12dhls_hw: formatNumber(dataSplitSecond[11].dhls_hw - allSelection[i].getValue("custrecord_nml_dec_dhlsh")),
                    perc1dhls_hw: formatNumber(getPrecenge(dataSplitSecond[0].dhls_hw, allSelection[i].getValue("custrecord_nml_jan_dhlsh"))) + '%',
                    perc2dhls_hw: formatNumber(getPrecenge(dataSplitSecond[1].dhls_hw, allSelection[i].getValue("custrecord_nml_feb_dhlsh"))) + '%',
                    perc3dhls_hw: formatNumber(getPrecenge(dataSplitSecond[2].dhls_hw, allSelection[i].getValue("custrecord_nml_mar_dhlsh"))) + '%',
                    perc4dhls_hw: formatNumber(getPrecenge(dataSplitSecond[3].dhls_hw, allSelection[i].getValue("custrecord_nml_apr_dhlsh"))) + '%',
                    perc5dhls_hw: formatNumber(getPrecenge(dataSplitSecond[4].dhls_hw, allSelection[i].getValue("custrecord_nml_may_dhlsh"))) + '%',
                    perc6dhls_hw: formatNumber(getPrecenge(dataSplitSecond[5].dhls_hw, allSelection[i].getValue("custrecord_nml_jun_dhlsh"))) + '%',
                    perc7dhls_hw: formatNumber(getPrecenge(dataSplitSecond[6].dhls_hw, allSelection[i].getValue("custrecord_nml_jul_dhlsh"))) + '%',
                    perc8dhls_hw: formatNumber(getPrecenge(dataSplitSecond[7].dhls_hw, allSelection[i].getValue("custrecord_nml_aug_dhlsh"))) + '%',
                    perc9dhls_hw: formatNumber(getPrecenge(dataSplitSecond[8].dhls_hw, allSelection[i].getValue("custrecord_nml_sep_dhlsh"))) + '%',
                    perc10dhls_hw: formatNumber(getPrecenge(dataSplitSecond[9].dhls_hw, allSelection[i].getValue("custrecord_nml_nov_dhlsh"))) + '%',
                    perc11dhls_hw: formatNumber(getPrecenge(dataSplitSecond[10].dhls_hw, allSelection[i].getValue("custrecord_nml_nov_dhlsh"))) + '%',
                    perc12dhls_hw: formatNumber(getPrecenge(dataSplitSecond[11].dhls_hw, allSelection[i].getValue("custrecord_nml_dec_dhlsh"))) + '%',
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
                    target1gt: formatNumber(allSelection[i].getValue("custrecord_nml_jan_dhlss")),
                    target2gt: formatNumber(allSelection[i].getValue("custrecord_nml_feb_dhlss")),
                    target3gt: formatNumber(allSelection[i].getValue("custrecord_nml_mar_dhlss")),
                    target4gt: formatNumber(allSelection[i].getValue("custrecord_nml_apr_dhlss")),
                    target5gt: formatNumber(allSelection[i].getValue("custrecord_nml_may_dhlss")),
                    target6gt: formatNumber(allSelection[i].getValue("custrecord_nml_jun_dhlss")),
                    target7gt: formatNumber(allSelection[i].getValue("custrecord_nml_jul_dhlss")),
                    target8gt: formatNumber(allSelection[i].getValue("custrecord_nml_aug_dhlss")),
                    target9gt: formatNumber(allSelection[i].getValue("custrecord_nml_sep_dhlss")),
                    target10gt: formatNumber(allSelection[i].getValue("custrecord_nml_oct_dhlss")),
                    target11gt: formatNumber(allSelection[i].getValue("custrecord_nml_nov_dhlss")),
                    target12gt: formatNumber(allSelection[i].getValue("custrecord_nml_dec_dhlss")),
                    gap1gt: formatNumber(dataSplitSecond[0].gt - allSelection[i].getValue("custrecord_nml_jan_dhlss")),
                    gap2gt: formatNumber(dataSplitSecond[1].gt - allSelection[i].getValue("custrecord_nml_feb_dhlss")),
                    gap3gt: formatNumber(dataSplitSecond[2].gt - allSelection[i].getValue("custrecord_nml_mar_dhlss")),
                    gap4gt: formatNumber(dataSplitSecond[3].gt - allSelection[i].getValue("custrecord_nml_apr_dhlss")),
                    gap5gt: formatNumber(dataSplitSecond[4].gt - allSelection[i].getValue("custrecord_nml_may_dhlss")),
                    gap6gt: formatNumber(dataSplitSecond[5].gt - allSelection[i].getValue("custrecord_nml_jun_dhlss")),
                    gap7gt: formatNumber(dataSplitSecond[6].gt - allSelection[i].getValue("custrecord_nml_jul_dhlss")),
                    gap8gt: formatNumber(dataSplitSecond[7].gt - allSelection[i].getValue("custrecord_nml_aug_dhlss")),
                    gap9gt: formatNumber(dataSplitSecond[8].gt - allSelection[i].getValue("custrecord_nml_sep_dhlss")),
                    gap10gt: formatNumber(dataSplitSecond[9].gt - allSelection[i].getValue("custrecord_nml_oct_dhlss")),
                    gap11gt: formatNumber(dataSplitSecond[10].gt - allSelection[i].getValue("custrecord_nml_nov_dhlss")),
                    gap12gt: formatNumber(dataSplitSecond[11].gt - allSelection[i].getValue("custrecord_nml_dec_dhlss")),
                    perc1gt: formatNumber(getPrecenge(dataSplitSecond[0].gt, allSelection[i].getValue("custrecord_nml_jan_dhlss"))) + '%',
                    perc2gt: formatNumber(getPrecenge(dataSplitSecond[1].gt, allSelection[i].getValue("custrecord_nml_feb_dhlss"))) + '%',
                    perc3gt: formatNumber(getPrecenge(dataSplitSecond[2].gt, allSelection[i].getValue("custrecord_nml_mar_dhlss"))) + '%',
                    perc4gt: formatNumber(getPrecenge(dataSplitSecond[3].gt, allSelection[i].getValue("custrecord_nml_apr_dhlss"))) + '%',
                    perc5gt: formatNumber(getPrecenge(dataSplitSecond[4].gt, allSelection[i].getValue("custrecord_nml_may_dhlss"))) + '%',
                    perc6gt: formatNumber(getPrecenge(dataSplitSecond[5].gt, allSelection[i].getValue("custrecord_nml_jun_dhlss"))) + '%',
                    perc7gt: formatNumber(getPrecenge(dataSplitSecond[6].gt, allSelection[i].getValue("custrecord_nml_jul_dhlss"))) + '%',
                    perc8gt: formatNumber(getPrecenge(dataSplitSecond[7].gt, allSelection[i].getValue("custrecord_nml_aug_dhlss"))) + '%',
                    perc9gt: formatNumber(getPrecenge(dataSplitSecond[8].gt, allSelection[i].getValue("custrecord_nml_sep_dhlss"))) + '%',
                    perc10gt: formatNumber(getPrecenge(dataSplitSecond[9].gt, allSelection[i].getValue("custrecord_nml_oct_dhlss"))) + '%',
                    perc11gt: formatNumber(getPrecenge(dataSplitSecond[10].gt, allSelection[i].getValue("custrecord_nml_nov_dhlss"))) + '%',
                    perc12gt: formatNumber(getPrecenge(dataSplitSecond[11].gt, allSelection[i].getValue("custrecord_nml_dec_dhlss"))) + '%',
                });

            }
        }
    } catch (e) {
        nlapiLogExecution('error', 'LossSalesRepTargetsPf func', e)
    }
    return Results;
}
function LossSalesRepTargetsQuoartlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargetsQuoartlyPf allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplitSecond = splitDataAmountSecondPf(data)
                var quoarterly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs;
                var quoarterly2bbs = dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var quoarterly3bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs;
                var quoarterly4bbs = dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var quoarterlybbs = quoarterly1bbs + quoarterly2bbs + quoarterly3bbs + quoarterly4bbs;
                var target1bbs = Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_bbs"));
                var target2bbs = Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_bbs"));
                var target3bbs = Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_bbs"));
                var target4bbs = Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_bbs"));
                var targetbbs = target1bbs + target2bbs + target3bbs + target4bbs;
                var quoarterly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas;
                var quoarterly2vas = dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var quoarterly3vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas;
                var quoarterly4vas = dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var quoarterlyvas = quoarterly1vas + quoarterly2vas + quoarterly3vas + quoarterly4vas;
                var target1vas = Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas"));
                var target2vas = Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas"));
                var target3vas = Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas"));
                var target4vas = Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas"));
                var targetvas = target1vas + target2vas + target3vas + target4vas;
                var quoarterly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod;
                var quoarterly2bod = dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;
                var quoarterly3bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod;
                var quoarterly4bod = dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var quoarterlybod = quoarterly1bod + quoarterly2bod + quoarterly3bod + quoarterly4bod;
                var target1bod = Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_bod"));
                var target2bod = Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_bod"));
                var target3bod = Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_bod"));
                var target4bod = Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_bod"));
                var targetbod = target1bod + target2bod + target3bod + target4bod;
                var quoarterly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband;
                var quoarterly2cband = dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var quoarterly3cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband;
                var quoarterly4cband = dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var quoarterlycband = quoarterly1cband + quoarterly2cband + quoarterly3cband + quoarterly4cband;
                var target1cband = Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband"));
                var target2cband = Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband"));
                var target3cband = Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband"));
                var target4cband = Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband"));
                var targetcband = target1cband + target2cband + target3cband + target4cband;
                var quoarterly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic;
                var quoarterly2domestic = dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var quoarterly3domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic;
                var quoarterly4domestic = dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var quoarterlydomestic = quoarterly1domestic + quoarterly2domestic + quoarterly3domestic + quoarterly4domestic;
                var target1domestic = Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic"));
                var target2domestic = Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic"));
                var target3domestic = Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic"));
                var target4domestic = Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic"));
                var targetdomestic = target1domestic + target2domestic + target3domestic + target4domestic;
                var quoarterly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip;
                var quoarterly2ip = dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var quoarterly3ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip;
                var quoarterly4ip = dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var quoarterlyip = quoarterly1ip + quoarterly2ip + quoarterly3ip + quoarterly4ip;
                var target1ip = Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip"));
                var target2ip = Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip"));
                var target3ip = Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip"));
                var target4ip = Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip"));
                var targetip = target1ip + target2ip + target3ip + target4ip;
                var quoarterly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru;
                var quoarterly2iru = dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var quoarterly3iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru;
                var quoarterly4iru = dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var quoarterlyiru = quoarterly1iru + quoarterly2iru + quoarterly3iru + quoarterly4iru;
                var target1iru = Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru"));
                var target2iru = Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru"));
                var target3iru = Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru"));
                var target4iru = Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru"));
                var targetiru = target1iru + target2iru + target3iru + target4iru;
                var quoarterly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband;
                var quoarterly2kuband = dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var quoarterly3kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband;
                var quoarterly4kuband = dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var quoarterlykuband = quoarterly1kuband + quoarterly2kuband + quoarterly3kuband + quoarterly4kuband;
                var target1kuband = Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband"));
                var target2kuband = Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband"));
                var target3kuband = Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband"));
                var target4kuband = Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband"));
                var targetkuband = target1kuband + target2kuband + target3kuband + target4kuband;
                var quoarterly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat;
                var quoarterly2mobile_vsat = dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var quoarterly3mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat;
                var quoarterly4mobile_vsat = dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var quoarterlymobile_vsat = quoarterly1mobile_vsat + quoarterly2mobile_vsat + quoarterly3mobile_vsat + quoarterly4mobile_vsat
                var target1mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_mar_mobile_vsat"));
                var target2mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_jun_mobile_vsat"));
                var target3mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_sep_mobile_vsat"));
                var target4mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_dec_mobile_vsat"));
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat + target3mobile_vsat + target4mobile_vsat
                var quoarterly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip;
                var quoarterly2mpip = dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var quoarterly3mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip;
                var quoarterly4mpip = dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var quoarterlympip = quoarterly1mpip + quoarterly2mpip + quoarterly3mpip + quoarterly4mpip;
                var target1mpip = Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip"));
                var target2mpip = Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip"));
                var target3mpip = Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip"));
                var target4mpip = Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip"));
                var targetmpip = target1mpip + target2mpip + target3mpip + target4mpip
                var quoarterly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b;
                var quoarterly2o3b = dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var quoarterly3o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b;
                var quoarterly4o3b = dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var quoarterlyo3b = quoarterly1o3b + quoarterly2o3b + quoarterly3o3b + quoarterly4o3b
                var target1o3b = Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b"));
                var target2o3b = Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b"));
                var target3o3b = Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b"));
                var target4o3b = Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b"));
                var targeto3b = target1o3b + target2o3b + target3o3b + target4o3b;
                var quoarterly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps;
                var quoarterly2ps = dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var quoarterly3ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps;
                var quoarterly4ps = dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var quoarterlyps = quoarterly1ps + quoarterly2ps + quoarterly3ps + quoarterly4ps
                var target1ps = Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps"));
                var target2ps = Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps"));
                var target3ps = Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps"));
                var target4ps = Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_dec_ps"));
                var targetps = target1ps + target2ps + target3ps + target4ps;
                var quoarterly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr;
                var quoarterly2sr = dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var quoarterly3sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr;
                var quoarterly4sr = dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var quoarterlysr = quoarterly1sr + quoarterly2sr + quoarterly3sr + quoarterly4sr
                var target1sr = Number(allSelection[i].getValue("custrecord_nml_jan_sr")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr"));
                var target2sr = Number(allSelection[i].getValue("custrecord_nml_apr_sr")) + Number(allSelection[i].getValue("custrecord_nml_may_sr")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr"));
                var target3sr = Number(allSelection[i].getValue("custrecord_nml_jul_sr")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr"));
                var target4sr = Number(allSelection[i].getValue("custrecord_nml_oct_sr")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr"));
                var targetsr = target1sr + target2sr + target3sr + target4sr;
                var quoarterly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw;
                var quoarterly2hw = dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var quoarterly3hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw;
                var quoarterly4hw = dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var quoarterlyhw = quoarterly1hw + quoarterly2hw + quoarterly3hw + quoarterly4hw;
                var target1hw = Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw"));
                var target2hw = Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw"));
                var target3hw = Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw"));
                var target4hw = Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw"));
                var targethw = target1hw + target2hw + target3hw + target4hw;
                var quoarterly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw;
                var quoarterly2dhls_hw = dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var quoarterly3dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw;
                var quoarterly4dhls_hw = dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var quoarterlydhls_hw = quoarterly1dhls_hw + quoarterly2dhls_hw + quoarterly3dhls_hw + quoarterly4dhls_hw;
                var target1dhls_hw = Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh"));
                var target2dhls_hw = Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh"));
                var target3dhls_hw = Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh"));
                var target4dhls_hw = Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh"));
                var targetdhls_hw = target1dhls_hw + target2dhls_hw + target3dhls_hw + target4dhls_hw;
                var quoarterly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt;
                var quoarterly2gt = dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var quoarterly3gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt;
                var quoarterly4gt = dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var quoarterlygt = quoarterly1gt + quoarterly2gt + quoarterly3gt + quoarterly4gt;
                var target1gt = Number(allSelection[i].getValue("custrecord_nml_jan_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss"));
                var target2gt = Number(allSelection[i].getValue("custrecord_nml_apr_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss"));
                var target3gt = Number(allSelection[i].getValue("custrecord_nml_jul_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss"));
                var target4gt = Number(allSelection[i].getValue("custrecord_nml_oct_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss"));
                var targetgt = target1gt + target2gt + target3gt + target4gt;
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
                    gapbbs: formatNumber(quoarterly4bbs - targetbbs),
                    perc1bbs: formatNumber(getPrecenge(quoarterly1bbs, target1bbs)) + '%',
                    perc2bbs: formatNumber(getPrecenge(quoarterly2bbs, target2bbs)) + '%',
                    perc3bbs: formatNumber(getPrecenge(quoarterly3bbs, target3bbs)) + '%',
                    perc4bbs: formatNumber(getPrecenge(quoarterly4bbs, target4bbs)) + '%',
                    percbbs: formatNumber(getPrecenge(quoarterlybbs, targetbbs)) + '%',
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
                    gapsr: formatNumber(quoarterly4sr - targetsr),
                    perc1sr: formatNumber(getPrecenge(quoarterly1sr, target1sr)) + '%',
                    perc2sr: formatNumber(getPrecenge(quoarterly2sr, target2sr)) + '%',
                    perc3sr: formatNumber(getPrecenge(quoarterly3sr, target3sr)) + '%',
                    perc4sr: formatNumber(getPrecenge(quoarterly4sr, target4sr)) + '%',
                    percsr: formatNumber(getPrecenge(quoarterlysr, targetsr)) + '%',
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
        nlapiLogExecution('error', 'LossSalesRepTargetsQuoartlyPf func', e)
    }
    return Results;
}
function LossSalesRepTargetsHalfYearlyPf(salesData, yearData, fss_mssData, sales_dep_manData, sales_team_manData) {
    try {
        var search = nlapiLoadSearch(null, 'customsearch_target_new_money_loss');
        search.addFilter(new nlobjSearchFilter('custrecord_nml_year', null, 'anyof', yearData));
        if (!isNullOrEmpty(fss_mssData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_department', 'custrecord_nml_sales_rep', 'anyof', fss_mssData));
        }
        if (!isNullOrEmpty(sales_dep_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_dept_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_dep_manData));
        }
        if (!isNullOrEmpty(sales_team_manData)) {
            search.addFilter(new nlobjSearchFilter('custentity_sales_team_manager', 'custrecord_nml_sales_rep', 'anyof', sales_team_manData));
        }
        if (!isNullOrEmpty(salesData)) {
            search.addFilter(new nlobjSearchFilter('custrecord_nml_sales_rep', null, 'anyof', salesData.split("\u0005")));
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
        nlapiLogExecution('debug', 'LossSalesRepTargetsHalfYearlyPf allSelection ', allSelection.length)
        if (allSelection != null) {
            for (var i = 0; i < allSelection.length; i++) {
                var data = allSelection[i].getValue("custrecord_nml_data_pf")
                var dataSplitSecond = splitDataAmountSecondPf(data);

                var halfYearly1bbs = dataSplitSecond[0].bbs + dataSplitSecond[1].bbs + dataSplitSecond[2].bbs + dataSplitSecond[3].bbs + dataSplitSecond[4].bbs + dataSplitSecond[5].bbs;
                var halfYearly2bbs = dataSplitSecond[6].bbs + dataSplitSecond[7].bbs + dataSplitSecond[8].bbs + dataSplitSecond[9].bbs + dataSplitSecond[10].bbs + dataSplitSecond[11].bbs;
                var halfYearlybbs = halfYearly1bbs + halfYearly2bbs;
                var target1bbs = Number(allSelection[i].getValue("custrecord_nml_jan_bbs")) + Number(allSelection[i].getValue("custrecord_nml_feb_bbs")) + Number(allSelection[i].getValue("custrecord_nml_mar_bbs")) + Number(allSelection[i].getValue("custrecord_nml_apr_bbs")) + Number(allSelection[i].getValue("custrecord_nml_may_bbs")) + Number(allSelection[i].getValue("custrecord_nml_jun_bbs"));
                var target2bbs = Number(allSelection[i].getValue("custrecord_nml_jul_bbs")) + Number(allSelection[i].getValue("custrecord_nml_aug_bbs")) + Number(allSelection[i].getValue("custrecord_nml_sep_bbs")) + Number(allSelection[i].getValue("custrecord_nml_oct_bbs")) + Number(allSelection[i].getValue("custrecord_nml_nov_bbs")) + Number(allSelection[i].getValue("custrecord_nml_dec_bbs"));
                var targetbbs = target1bbs + target2bbs;
                var halfYearly1vas = dataSplitSecond[0].vas + dataSplitSecond[1].vas + dataSplitSecond[2].vas + dataSplitSecond[3].vas + dataSplitSecond[4].vas + dataSplitSecond[5].vas;
                var halfYearly2vas = dataSplitSecond[6].vas + dataSplitSecond[7].vas + dataSplitSecond[8].vas + dataSplitSecond[9].vas + dataSplitSecond[10].vas + dataSplitSecond[11].vas;
                var halfYearlyvas = halfYearly1vas + halfYearly2vas;
                var target1vas = Number(allSelection[i].getValue("custrecord_nml_jan_vas")) + Number(allSelection[i].getValue("custrecord_nml_feb_vas")) + Number(allSelection[i].getValue("custrecord_nml_mar_vas")) + Number(allSelection[i].getValue("custrecord_nml_apr_vas")) + Number(allSelection[i].getValue("custrecord_may_vas")) + Number(allSelection[i].getValue("custrecord_nml_jun_vas"));
                var target2vas = Number(allSelection[i].getValue("custrecord_nml_jul_vas")) + Number(allSelection[i].getValue("custrecord_nml_aug_vas")) + Number(allSelection[i].getValue("custrecord_nml_sep_vas")) + Number(allSelection[i].getValue("custrecord_nml_oct_vas")) + Number(allSelection[i].getValue("custrecord_nml_nov_vas")) + Number(allSelection[i].getValue("custrecord_nml_dec_vas"));
                var targetvas = target1vas + target2vas;
                var halfYearly1bod = dataSplitSecond[0].bod + dataSplitSecond[1].bod + dataSplitSecond[2].bod + dataSplitSecond[3].bod + dataSplitSecond[4].bod + dataSplitSecond[5].bod;
                var halfYearly2bod = dataSplitSecond[6].bod + dataSplitSecond[7].bod + dataSplitSecond[8].bod + dataSplitSecond[9].bod + dataSplitSecond[10].bod + dataSplitSecond[11].bod;
                var halfYearlybod = halfYearly1bod + halfYearly2bod;
                var target1bod = Number(allSelection[i].getValue("custrecord_nml_jan_bod")) + Number(allSelection[i].getValue("custrecord_nml_feb_bod")) + Number(allSelection[i].getValue("custrecord_nml_mar_bod")) + Number(allSelection[i].getValue("custrecord_nml_apr_bod")) + Number(allSelection[i].getValue("custrecord_nml_may_bod")) + Number(allSelection[i].getValue("custrecord_nml_jun_bod"));
                var target2bod = Number(allSelection[i].getValue("custrecord_nml_jul_bod")) + Number(allSelection[i].getValue("custrecord_nml_aug_bod")) + Number(allSelection[i].getValue("custrecord_nml_sep_bod")) + Number(allSelection[i].getValue("custrecord_nml_oct_bod")) + Number(allSelection[i].getValue("custrecord_nml_nov_bod")) + Number(allSelection[i].getValue("custrecord_nml_dec_bod"));
                var targetbod = target1bod + target2bod;
                var halfYearly1cband = dataSplitSecond[0].cband + dataSplitSecond[1].cband + dataSplitSecond[2].cband + dataSplitSecond[3].cband + dataSplitSecond[4].cband + dataSplitSecond[5].cband;
                var halfYearly2cband = dataSplitSecond[6].cband + dataSplitSecond[7].cband + dataSplitSecond[8].cband + dataSplitSecond[9].cband + dataSplitSecond[10].cband + dataSplitSecond[11].cband;
                var halfYearlycband = halfYearly1cband + halfYearly2cband
                var target1cband = Number(allSelection[i].getValue("custrecord_nml_jan_cband")) + Number(allSelection[i].getValue("custrecord_nml_feb_cband")) + Number(allSelection[i].getValue("custrecord_nml_mar_cband")) + Number(allSelection[i].getValue("custrecord_nml_apr_cband")) + Number(allSelection[i].getValue("custrecord_nml_may_cband")) + Number(allSelection[i].getValue("custrecord_nml_jun_cband"));
                var target2cband = Number(allSelection[i].getValue("custrecord_nml_jul_cband")) + Number(allSelection[i].getValue("custrecord_nml_aug_cband")) + Number(allSelection[i].getValue("custrecord_nml_sep_cband")) + Number(allSelection[i].getValue("custrecord_nml_oct_cband")) + Number(allSelection[i].getValue("custrecord_nml_nov_cband")) + Number(allSelection[i].getValue("custrecord_nml_dec_cband"));
                var targetcband = target1cband + target2cband;
                var halfYearly1domestic = dataSplitSecond[0].domestic + dataSplitSecond[1].domestic + dataSplitSecond[2].domestic + dataSplitSecond[3].domestic + dataSplitSecond[4].domestic + dataSplitSecond[5].domestic;
                var halfYearly2domestic = dataSplitSecond[6].domestic + dataSplitSecond[7].domestic + dataSplitSecond[8].domestic + dataSplitSecond[9].domestic + dataSplitSecond[10].domestic + dataSplitSecond[11].domestic;
                var halfYearlydomestic = halfYearly1domestic + halfYearly2domestic
                var target1domestic = Number(allSelection[i].getValue("custrecord_nml_jan_domestic")) + Number(allSelection[i].getValue("custrecord_nml_feb_domestic")) + Number(allSelection[i].getValue("custrecord_nml_mar_domestic")) + Number(allSelection[i].getValue("custrecord_nml_apr_domestic")) + Number(allSelection[i].getValue("custrecord_nml_may_domestic")) + Number(allSelection[i].getValue("custrecord_nml_jun_domestic"));
                var target2domestic = Number(allSelection[i].getValue("custrecord_nml_jul_domestic")) + Number(allSelection[i].getValue("custrecord_nml_aug_domestic")) + Number(allSelection[i].getValue("custrecord_nml_sep_domestic")) + Number(allSelection[i].getValue("custrecord_nml_oct_domestic")) + Number(allSelection[i].getValue("custrecord_nml_nov_domestic")) + Number(allSelection[i].getValue("custrecord_nml_dec_domestic"));
                var targetdomestic = target1domestic + target2domestic
                var halfYearly1ip = dataSplitSecond[0].ip + dataSplitSecond[1].ip + dataSplitSecond[2].ip + dataSplitSecond[3].ip + dataSplitSecond[4].ip + dataSplitSecond[5].ip;
                var halfYearly2ip = dataSplitSecond[6].ip + dataSplitSecond[7].ip + dataSplitSecond[8].ip + dataSplitSecond[9].ip + dataSplitSecond[10].ip + dataSplitSecond[11].ip;
                var halfYearlyip = halfYearly1ip + halfYearly2ip
                var target1ip = Number(allSelection[i].getValue("custrecord_nml_jan_ip")) + Number(allSelection[i].getValue("custrecord_nml_feb_ip")) + Number(allSelection[i].getValue("custrecord_nml_mar_ip")) + Number(allSelection[i].getValue("custrecord_nml_apr_ip")) + Number(allSelection[i].getValue("custrecord_nml_may_ip")) + Number(allSelection[i].getValue("custrecord_nml_jun_ip"));
                var target2ip = Number(allSelection[i].getValue("custrecord_nml_jul_ip")) + Number(allSelection[i].getValue("custrecord_nml_aug_ip")) + Number(allSelection[i].getValue("custrecord_nml_sep_ip")) + Number(allSelection[i].getValue("custrecord_nml_oct_ip")) + Number(allSelection[i].getValue("custrecord_nml_nov_ip")) + Number(allSelection[i].getValue("custrecord_nml_dec_ip"));
                var targetip = target1ip + target2ip
                var halfYearly1iru = dataSplitSecond[0].iru + dataSplitSecond[1].iru + dataSplitSecond[2].iru + dataSplitSecond[3].iru + dataSplitSecond[4].iru + dataSplitSecond[5].iru;
                var halfYearly2iru = dataSplitSecond[6].iru + dataSplitSecond[7].iru + dataSplitSecond[8].iru + dataSplitSecond[9].iru + dataSplitSecond[10].iru + dataSplitSecond[11].iru;
                var halfYearlyiru = halfYearly1iru + halfYearly2iru
                var target1iru = Number(allSelection[i].getValue("custrecord_nml_jan_iru")) + Number(allSelection[i].getValue("custrecord_nml_feb_iru")) + Number(allSelection[i].getValue("custrecord_nml_mar_iru")) + Number(allSelection[i].getValue("custrecord_nml_apr_iru")) + Number(allSelection[i].getValue("custrecord_nml_may_iru")) + Number(allSelection[i].getValue("custrecord_nml_jun_iru"));
                var target2iru = Number(allSelection[i].getValue("custrecord_nml_jul_iru")) + Number(allSelection[i].getValue("custrecord_nml_aug_iru")) + Number(allSelection[i].getValue("custrecord_nml_sep_iru")) + Number(allSelection[i].getValue("custrecord_nml_oct_iru")) + Number(allSelection[i].getValue("custrecord_nml_nov_iru")) + Number(allSelection[i].getValue("custrecord_nml_dec_iru"));
                var targetiru = target1iru + target2iru
                var halfYearly1kuband = dataSplitSecond[0].kuband + dataSplitSecond[1].kuband + dataSplitSecond[2].kuband + dataSplitSecond[3].kuband + dataSplitSecond[4].kuband + dataSplitSecond[5].kuband;
                var halfYearly2kuband = dataSplitSecond[6].kuband + dataSplitSecond[7].kuband + dataSplitSecond[8].kuband + dataSplitSecond[9].kuband + dataSplitSecond[10].kuband + dataSplitSecond[11].kuband;
                var halfYearlykuband = halfYearly1kuband + halfYearly2kuband
                var target1kuband = Number(allSelection[i].getValue("custrecord_nml_jan_kuband")) + Number(allSelection[i].getValue("custrecord_nml_feb_kuband")) + Number(allSelection[i].getValue("custrecord_nml_mar_kuband")) + Number(allSelection[i].getValue("custrecord_nml_apr_kuband")) + Number(allSelection[i].getValue("custrecord_nml_may_kuband")) + Number(allSelection[i].getValue("custrecord_nml_jun_kuband"));
                var target2kuband = Number(allSelection[i].getValue("custrecord_nml_jul_kuband")) + Number(allSelection[i].getValue("custrecord_nml_aug_kuband")) + Number(allSelection[i].getValue("custrecord_nml_sep_kuband")) + Number(allSelection[i].getValue("custrecord_nml_oct_kuband")) + Number(allSelection[i].getValue("custrecord_nml_nov_kuband")) + Number(allSelection[i].getValue("custrecord_nml_dec_kuband"));
                var targetkuband = target1kuband + target2kuband
                var halfYearly1mobile_vsat = dataSplitSecond[0].mobile_vsat + dataSplitSecond[1].mobile_vsat + dataSplitSecond[2].mobile_vsat + dataSplitSecond[3].mobile_vsat + dataSplitSecond[4].mobile_vsat + dataSplitSecond[5].mobile_vsat;
                var halfYearly2mobile_vsat = dataSplitSecond[6].mobile_vsat + dataSplitSecond[7].mobile_vsat + dataSplitSecond[8].mobile_vsat + dataSplitSecond[9].mobile_vsat + dataSplitSecond[10].mobile_vsat + dataSplitSecond[11].mobile_vsat;
                var halfYearlymobile_vsat = halfYearly1mobile_vsat + halfYearly2mobile_vsat
                var target1mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_jan_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_feb_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_mar_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_apr_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_may_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_jun_mobile_vsat"));
                var target2mobile_vsat = Number(allSelection[i].getValue("custrecord_nml_jul_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_aug_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_sep_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_oct_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_nov_mobile_vsat")) + Number(allSelection[i].getValue("custrecord_nml_dec_mobile_vsat"));
                var targetmobile_vsat = target1mobile_vsat + target2mobile_vsat
                var halfYearly1mpip = dataSplitSecond[0].mpip + dataSplitSecond[1].mpip + dataSplitSecond[2].mpip + dataSplitSecond[3].mpip + dataSplitSecond[4].mpip + dataSplitSecond[5].mpip;
                var halfYearly2mpip = dataSplitSecond[6].mpip + dataSplitSecond[7].mpip + dataSplitSecond[8].mpip + dataSplitSecond[9].mpip + dataSplitSecond[10].mpip + dataSplitSecond[11].mpip;
                var halfYearlympip = halfYearly1mpip + halfYearly2mpip
                var target1mpip = Number(allSelection[i].getValue("custrecord_nml_jan_mpip")) + Number(allSelection[i].getValue("custrecord_nml_feb_mpip")) + Number(allSelection[i].getValue("custrecord_nml_mar_mpip")) + Number(allSelection[i].getValue("custrecord_nml_apr_mpip")) + Number(allSelection[i].getValue("custrecord_nml_may_mpip")) + Number(allSelection[i].getValue("custrecord_nml_jun_mpip"));
                var target2mpip = Number(allSelection[i].getValue("custrecord_nml_jul_mpip")) + Number(allSelection[i].getValue("custrecord_nml_aug_mpip")) + Number(allSelection[i].getValue("custrecord_nml_sep_mpip")) + Number(allSelection[i].getValue("custrecord_nml_oct_mpip")) + Number(allSelection[i].getValue("custrecord_nml_nov_mpip")) + Number(allSelection[i].getValue("custrecord_nml_dec_mpip"));
                var targetmpip = target1mpip + target2mpip
                var halfYearly1o3b = dataSplitSecond[0].o3b + dataSplitSecond[1].o3b + dataSplitSecond[2].o3b + dataSplitSecond[3].o3b + dataSplitSecond[4].o3b + dataSplitSecond[5].o3b;
                var halfYearly2o3b = dataSplitSecond[6].o3b + dataSplitSecond[7].o3b + dataSplitSecond[8].o3b + dataSplitSecond[9].o3b + dataSplitSecond[10].o3b + dataSplitSecond[11].o3b;
                var halfYearlyo3b = halfYearly1o3b + halfYearly2o3b
                var target1o3b = Number(allSelection[i].getValue("custrecord_nml_jan_o3b")) + Number(allSelection[i].getValue("custrecord_nml_feb_o3b")) + Number(allSelection[i].getValue("custrecord_nml_mar_o3b")) + Number(allSelection[i].getValue("custrecord_nml_apr_o3b")) + Number(allSelection[i].getValue("custrecord_nml_may_o3b")) + Number(allSelection[i].getValue("custrecord_nml_jun_o3b"));
                var target2o3b = Number(allSelection[i].getValue("custrecord_nml_jul_o3b")) + Number(allSelection[i].getValue("custrecord_nml_aug_o3b")) + Number(allSelection[i].getValue("custrecord_nml_sep_o3b")) + Number(allSelection[i].getValue("custrecord_nml_oct_o3b")) + Number(allSelection[i].getValue("custrecord_nml_nov_o3b")) + Number(allSelection[i].getValue("custrecord_nml_dec_o3b"));
                var targeto3b = target1o3b + target2o3b
                var halfYearly1ps = dataSplitSecond[0].ps + dataSplitSecond[1].ps + dataSplitSecond[2].ps + dataSplitSecond[3].ps + dataSplitSecond[4].ps + dataSplitSecond[5].ps;
                var halfYearly2ps = dataSplitSecond[6].ps + dataSplitSecond[7].ps + dataSplitSecond[8].ps + dataSplitSecond[9].ps + dataSplitSecond[10].ps + dataSplitSecond[11].ps;
                var halfYearlyps = halfYearly1ps + halfYearly2ps
                var target1ps = Number(allSelection[i].getValue("custrecord_nml_jan_ps")) + Number(allSelection[i].getValue("custrecord_nml_feb_ps")) + Number(allSelection[i].getValue("custrecord_nml_mar_ps")) + Number(allSelection[i].getValue("custrecord_nml_apr_ps")) + Number(allSelection[i].getValue("custrecord_nml_may_ps")) + Number(allSelection[i].getValue("custrecord_nml_jun_ps"));
                var target2ps = Number(allSelection[i].getValue("custrecord_nml_jul_ps")) + Number(allSelection[i].getValue("custrecord_nml_aug_ps")) + Number(allSelection[i].getValue("custrecord_nml_sep_ps")) + Number(allSelection[i].getValue("custrecord_nml_oct_ps")) + Number(allSelection[i].getValue("custrecord_nml_nov_ps")) + Number(allSelection[i].getValue("custrecord_dec_ps"));
                var targetps = target1ps + target2ps
                var halfYearly1sr = dataSplitSecond[0].sr + dataSplitSecond[1].sr + dataSplitSecond[2].sr + dataSplitSecond[3].sr + dataSplitSecond[4].sr + dataSplitSecond[5].sr;
                var halfYearly2sr = dataSplitSecond[6].sr + dataSplitSecond[7].sr + dataSplitSecond[8].sr + dataSplitSecond[9].sr + dataSplitSecond[10].sr + dataSplitSecond[11].sr;
                var halfYearlysr = halfYearly1sr + halfYearly2sr
                var target1sr = Number(allSelection[i].getValue("custrecord_nml_jan_sr")) + Number(allSelection[i].getValue("custrecord_nml_feb_sr")) + Number(allSelection[i].getValue("custrecord_nml_mar_sr")) + Number(allSelection[i].getValue("custrecord_nml_apr_sr")) + Number(allSelection[i].getValue("custrecord_nml_may_sr")) + Number(allSelection[i].getValue("custrecord_nml_jun_sr"));
                var target2sr = Number(allSelection[i].getValue("custrecord_nml_jul_sr")) + Number(allSelection[i].getValue("custrecord_nml_aug_sr")) + Number(allSelection[i].getValue("custrecord_nml_sep_sr")) + Number(allSelection[i].getValue("custrecord_nml_oct_sr")) + Number(allSelection[i].getValue("custrecord_nml_nov_sr")) + Number(allSelection[i].getValue("custrecord_nml_dec_sr"));
                var targetsr = target1sr + target2sr
                var halfYearly1hw = dataSplitSecond[0].hw + dataSplitSecond[1].hw + dataSplitSecond[2].hw + dataSplitSecond[3].hw + dataSplitSecond[4].hw + dataSplitSecond[5].hw;
                var halfYearly2hw = dataSplitSecond[6].hw + dataSplitSecond[7].hw + dataSplitSecond[8].hw + dataSplitSecond[9].hw + dataSplitSecond[10].hw + dataSplitSecond[11].hw;
                var halfYearlyhw = halfYearly1hw + halfYearly2hw
                var target1hw = Number(allSelection[i].getValue("custrecord_nml_jan_hw")) + Number(allSelection[i].getValue("custrecord_nml_feb_hw")) + Number(allSelection[i].getValue("custrecord_nml_mar_hw")) + Number(allSelection[i].getValue("custrecord_nml_apr_hw")) + Number(allSelection[i].getValue("custrecord_nml_may_hw")) + Number(allSelection[i].getValue("custrecord_nml_jun_hw"));
                var target2hw = Number(allSelection[i].getValue("custrecord_nml_jul_hw")) + Number(allSelection[i].getValue("custrecord_nml_aug_hw")) + Number(allSelection[i].getValue("custrecord_nml_sep_hw")) + Number(allSelection[i].getValue("custrecord_nml_oct_hw")) + Number(allSelection[i].getValue("custrecord_nml_nov_hw")) + Number(allSelection[i].getValue("custrecord_nml_dec_hw"));
                var targethw = target1hw + target2hw
                var halfYearly1dhls_hw = dataSplitSecond[0].dhls_hw + dataSplitSecond[1].dhls_hw + dataSplitSecond[2].dhls_hw + dataSplitSecond[3].dhls_hw + dataSplitSecond[4].dhls_hw + dataSplitSecond[5].dhls_hw;
                var halfYearly2dhls_hw = dataSplitSecond[6].dhls_hw + dataSplitSecond[7].dhls_hw + dataSplitSecond[8].dhls_hw + dataSplitSecond[9].dhls_hw + dataSplitSecond[10].dhls_hw + dataSplitSecond[11].dhls_hw;
                var halfYearlydhls_hw = halfYearly1dhls_hw + halfYearly2dhls_hw
                var target1dhls_hw = Number(allSelection[i].getValue("custrecord_nml_jan_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlsh"));
                var target2dhls_hw = Number(allSelection[i].getValue("custrecord_nml_jul_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlsh")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlsh"));
                var targetdhls_hw = target1dhls_hw + target2dhls_hw
                var halfYearly1gt = dataSplitSecond[0].gt + dataSplitSecond[1].gt + dataSplitSecond[2].gt + dataSplitSecond[3].gt + dataSplitSecond[4].gt + dataSplitSecond[5].gt;
                var halfYearly2gt = dataSplitSecond[6].gt + dataSplitSecond[7].gt + dataSplitSecond[8].gt + dataSplitSecond[9].gt + dataSplitSecond[10].gt + dataSplitSecond[11].gt;
                var halfYearlygt = halfYearly1gt + halfYearly2gt
                var target1gt = Number(allSelection[i].getValue("custrecord_nml_jan_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_feb_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_mar_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_apr_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_may_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_jun_dhlss"));
                var target2gt = Number(allSelection[i].getValue("custrecord_nml_jul_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_aug_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_sep_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_oct_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_nov_dhlss")) + Number(allSelection[i].getValue("custrecord_nml_dec_dhlss"));
                var targetgt = target1gt + target2gt               
                Results.push({
                    id: allSelection[i].id,
                    sales_rep: allSelection[i].getText("custrecord_nml_sales_rep"),
                    sales_rep_id: allSelection[i].getValue("custrecord_nml_sales_rep"),
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
        nlapiLogExecution('error', 'LossSalesRepTargetsHalfYearlyPf func', e)
    }
    return Results;
}


