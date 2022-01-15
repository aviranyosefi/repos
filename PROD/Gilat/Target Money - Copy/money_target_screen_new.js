var line = 0;
function target_screen(request, response) {

    createForm();
    nlapiLogExecution('DEBUG', 'salesData: ' + salesData + ', Type: ' + request.getParameter('custpage_ilo_type'), 'yearData: ' + yearData + ', fss_mssData: ' + fss_mssData + ', dimensionData: ' + dimensionData + ' ,measureData: ' + measureData);
    if (request.getParameter('custpage_dimension') == '' && measureData == '1') {
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            Build1()
        } //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            Build2()
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            Build3()
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
    }
    else if (request.getParameter('custpage_dimension') == '2' && measureData == '1' ) {      
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            Build4();
        }
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            Build5();
        }
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            Build6();
        }
    } 
    else if (request.getParameter('custpage_dimension') == '' && measureData == '2') {
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            Build7()
        } //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            Build8()
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            Build9()
        }   //   if (request.getParameter('custpage_ilo_type') == '1')
    }
    else if (request.getParameter('custpage_dimension') == '2' && measureData == '2') {
        if (request.getParameter('custpage_ilo_type') == '1') { // Monthly
            Build10();
        }
        else if (request.getParameter('custpage_ilo_type') == '2') { // Quoarterly
            Build11();
        }
        else if (request.getParameter('custpage_ilo_type') == '3') { // Half Yearly
            Build12();
        }
    } 
    if (s != null && re.length > 0) {
        nlapiLogExecution('debug', 'gap2', gap2)     
        addTotalLines(s, line, ActualTotal, TargetlTotal, GAPTotal);
        if (request.getParameter('custpage_dimension') == '2') { 
            line = line + 4;
            addTotalLinesPF(s, line, Totalbbs, targetbbs, gapbbs, 'Total – Backbone Services',
                total1bbs, total2bbs, total3bbs, total4bbs, total5bbs, total6bbs, total7bbs, total8bbs, total9bbs, total10bbs, total11bbs, total12bbs,
                target1bbs, target2bbs, target3bbs, target4bbs, target5bbs, target6bbs, target7bbs, target8bbs, target9bbs, target10bbs, target11bbs, target12bbs,
                gap1bbs, gap2bbs, gap3bbs, gap4bbs, gap5bbs, gap6bbs, gap7bbs, gap8bbs, gap9bbs, gap10bbs, gap11bbs, gap12bbs)
            line = line + 4;
            addTotalLinesPF(s, line, Totalsr, targetsr, gapsr, 'Total – Satellite Raw',
                total1sr, total2sr, total3sr, total4sr, total5sr, total6sr, total7sr, total8sr, total9sr, total10sr, total11sr, total12sr,
                target1sr, target2sr, target3sr, target4sr, target5sr, target6sr, target7sr, target8sr, target9sr, target10sr, target11sr, target12sr,
                gap1sr, gap2sr, gap3sr, gap4sr, gap5sr, gap6sr, gap7sr, gap8sr, gap9sr, gap10sr, gap11sr, gap12sr)
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
function createForm() {
    form = nlapiCreateForm('**NEW** Money Target Vs. Actual **NEW** ');
    form.addSubmitButton('Submit');
    form.addFieldGroup('custpage_d', 'Details');
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
    var dimension = form.addField('custpage_dimension', 'select', 'Dimension', 'customlist_dimension_money_list', 'custpage_d')//.setDisplayType('disabled');
    dimensionData = request.getParameter('custpage_dimension');
    dimension.setDefaultValue(dimensionData);
    var from_mounth = form.addField('custpage_from_mounth', 'select', 'FROM', 'customlistmounth_list', 'custpage_d')
    from_mounthData = request.getParameter('custpage_from_mounth');
    if (isNullOrEmpty(from_mounthData)) { from_mounthData = '1' }
    from_mounth.setDefaultValue(from_mounthData);
    var to_mounth = form.addField('custpage_to_mounth', 'select', 'TO', 'customlistmounth_list', 'custpage_d')
    to_mounthData = request.getParameter('custpage_to_mounth');
    if (isNullOrEmpty(to_mounthData)) { to_mounthData = '12' }
    to_mounth.setDefaultValue(to_mounthData);
    var measure = form.addField('custpage_measure', 'multiselect', 'Measure ', null, 'custpage_d')
    measureData = request.getParameter('custpage_measure');
    measure.setMandatory(true);
    //nlapiLogExecution('debug', 'measureData', isNullOrEmpty(measureData))
    if (measureData == '1') {
        measure.addSelectOption('1', 'New Money', true);
        measure.addSelectOption('2', 'Money Loss');
    }
    else if (measureData == '2') {
        measure.addSelectOption('1', 'New Money');
        measure.addSelectOption('2', 'Money Loss', true);
    }
    else if (!isNullOrEmpty(measureData)) {
        measure.addSelectOption('1', 'New Money', true);
        measure.addSelectOption('2', 'Money Loss', true);
    }
    else {
        measure.addSelectOption('1', 'New Money');
        measure.addSelectOption('2', 'Money Loss');
    }

    form.setScript('customscript_money_target_client');
    form.addButton('customscript_marlk_all', 'Export to Excel', 'fnExcelReport()');
}

