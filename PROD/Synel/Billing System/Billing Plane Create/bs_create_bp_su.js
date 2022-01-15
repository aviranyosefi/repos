function CreateBillingPlan(request, response) {

    var id = request.getParameter('id');  
    nlapiScheduleScript('customscript_bs_create_bl_ss', null, { custscript_agr_line_id: id }) 
    response.write('');
}

