

function ip_allocation_screen(request, response) {
    var form = nlapiCreateForm('IP Allocation For Site');
    form.addFieldGroup('custpage_ilo_searchdetails', 'Details');
    var customer = form.addField('custpage_ilo_customer', 'select', 'Customer ', 'customer', 'custpage_ilo_searchdetails');
    customer.setMandatory(true);
    customer.setDefaultValue(request.getParameter('c'));
    var site = form.addField('custpage_ilo_site', 'select', 'Site', 'customrecord_site', 'custpage_ilo_searchdetails');
    site.setMandatory(true);
    site.setDefaultValue(request.getParameter('si'));
    var pop = form.addField('custpage_ilo_pop', 'select', 'POP', 'customrecord_teleport_pop', 'custpage_ilo_searchdetails');
    pop.setMandatory(true);
    var type = form.addField('custpage_ilo_iptype', 'select', 'IP TYPE', 'customlist_ipa_type', 'custpage_ilo_searchdetails');
    type.setMandatory(true);
    var system = form.addField('custpage_ilo_system', 'select', 'system', null, 'custpage_ilo_searchdetails');
    system.setMandatory(true);
    var range = form.addField('custpage_ilo_range', 'select', 'range', 'customlist_ip_range', 'custpage_ilo_searchdetails');
    range.setMandatory(true);
    var qty = form.addField('custpage_ilo_qty', 'select', 'Quantity', null, 'custpage_ilo_searchdetails');
    qty.setMandatory(true);
    qty.addSelectOption('2', '2');
    qty.addSelectOption('4', '4');
    qty.addSelectOption('8', '8');
    qty.addSelectOption('16', '16');
    qty.addSelectOption('32', '32');
    qty.addSelectOption('64', '64');
    qty.addSelectOption('128', '128');
    qty.addSelectOption('256', '256');
    qty.setMandatory(true);
    //var checkStage = form.addField('custpage_ilo_check_stage', 'text', 'check', null, 'custpage_ilo_searchdetails');
    //checkStage.setDisplayType('hidden');
    form.setScript('customscript_gilat_cs_ip_allocation');

    if (request.getMethod() == 'GET') {
        nlapiLogExecution('DEBUG', 'stage one', 'stage one');
        if (request.getParameter('si') == null || request.getParameter('c') == null) {
            throw nlapiCreateError('Value Missing', 'This screen can be opened from the site record only', true);
        }
        form.addSubmitButton('Allocate');
        //checkStage.setDefaultValue('site_details');

        response.writePage(form);

    }
    else  {
        nlapiLogExecution('DEBUG', 'ip allocate', 'ip allocate');
        var vsite = request.getParameter('custpage_ilo_site');
        var vcustomer = request.getParameter('custpage_ilo_customer');
        var vpop = request.getParameter('custpage_ilo_pop');
        var vrange = request.getParameter('custpage_ilo_range');
        var vqty = request.getParameter('custpage_ilo_qty');
        var vsystem = request.getParameter('custpage_ilo_system');
        var vtype = request.getParameter('custpage_ilo_iptype');

        customer.setDefaultValue(vcustomer);
        site.setDefaultValue(vsite);
        range.setDefaultValue(vrange);
        pop.setDefaultValue(vpop);
        qty.setDefaultValue(vqty);
        system.setDefaultValue(vsystem);
        type.setDefaultValue(vtype);
        
        var new_allocation = serach_ip_range(vsite, vpop, vtype, vrange, vqty, vsystem);

        var htmlfield = form.addField('g63', 'inlinehtml', '', null, null);
        if (new_allocation == -1) {
            var html = "<script>showAlertBox('alert_No_relevant', 'No Free IP range was found for the requested parameters', 'Check the free IP range list to verify there are free range for your request', NLAlertDialog.TYPE_HIGH_PRIORITY)</script>";
            htmlfield.setDefaultValue(html);
        }
        else
        {
            var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', 'Ip allocaiton succeeded - new range: " + new_allocation + "', NLAlertDialog.TYPE_LOWEST_PRIORITY)</script>";
            htmlfield.setDefaultValue(html);
            nlapiSetRedirectURL('record', 'customrecord_site', vsite , null, null)

        }
    }

    response.writePage(form);

}


//functions


function serach_ip_range(site, pop, type, range, qty,system) {
    try
    {
        var filters = new Array();

        filters.push(new nlobjSearchFilter('custrecord_ip_status', null, 'anyof', '2')); //free
        if (type != '' && type != null) { filters.push(new nlobjSearchFilter('custrecord_ipa_site', null, 'noneof', site)) };
        if (pop != '' && pop != null) { filters.push(new nlobjSearchFilter('custrecord_ipa_teleport_pop', null, 'anyof', pop)) };
        if (range != '' && range != null) { filters.push(new nlobjSearchFilter('custrecord_ipa_access_type', null, 'is', range)) };
        if (qty != '' && qty != null) { filters.push(new nlobjSearchFilter('custrecord_no_of_ip', null, 'is', qty)) };
        if (system != '' && system != null) { filters.push(new nlobjSearchFilter('custrecord_ipa_system', null, 'is', system)) };
                

        var search = nlapiCreateSearch('customrecord_ip_address', filters, null);
        var runSearch = search.runSearch();
        var ipfound = runSearch.getResults(0, 1)[0].id;
        var iprangerec = nlapiLoadRecord('customrecord_ip_address',ipfound);

        var ip_start = iprangerec.getFieldValue('custrecord_start_ip');
        var ip_end = iprangerec.getFieldValue('custrecord_end_ip');
        var range = ip_start + ' - ' + ip_end;

        iprangerec.setFieldValue('custrecord_ipa_site', site);
        iprangerec.setFieldValue('custrecord_ip_status', 3); //used
        

        nlapiSubmitRecord(iprangerec);

        nlapiLogExecution('audit', 'ip found', range);


        return range;
    }
    catch (e) {
        nlapiLogExecution('ERROR', 'Error',e);
    }

    return -1;


}
