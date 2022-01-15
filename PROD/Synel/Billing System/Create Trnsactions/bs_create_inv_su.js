function CreateTran(request, response) {  
    nlapiLogExecution('debug', 'request.getParameter ', request.getParameter('custpage_page'))
    if (request.getParameter('custpage_type') == '1' || request.getParameter('custpage_type') == '2') {
        var page = request.getParameter('custpage_type');  
        var fromdate = request.getParameter('custpage_select_fromdate');  
        var todate = request.getParameter('custpage_select_todate');  
        var agr = request.getParameter('custpage_agr');  
        var agr_line = request.getParameter('custpage_agr_line');  
        var employee = request.getParameter('custpage_employee');
        var customer = request.getParameter('custpage_customer');
        var invoice_date = request.getParameter('custpage_invoice_date');

        var today = new Date();
        var todayStr = nlapiDateToString(today);
        var form = nlapiCreateForm('');

        var data = [];
        data.push({
            fromdate: fromdate,
            todate: todate,
            agr: agr,
            agr_line: agr_line,
            employee: employee,
            customer: customer,
        })
        data = JSON.stringify(data);
        nlapiLogExecution('debug', 'data: ', data)
        try {          
            var params = {
                custscript_manage_inv_log: data,
                custscript_type: page,
                custscript_invoice_date: invoice_date
            };
            nlapiScheduleScript('customscript_bs_create_invoice_ss', null, params);
            var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
            htmlHeader.setDefaultValue("<p style='font-size:20px'>The Invoice transactions are currently being created.</p><br><br>Please click <a href='https://system.eu1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&datefrom=" + todayStr + "&dateto=" + todayStr + "&scripttype=523&primarykey=' target='_blank' >here</a> in order to be redirected to the status page.");
        }
        catch (e) {
            nlapiLogExecution('ERROR', 'ERROR: ', e)
        }     
        response.writePage(form)
    }
    else {
        var form = nlapiCreateForm('Manage Invoice');
        form.addSubmitButton('Execute');
      
        form.addFieldGroup('custpage_batch_group', 'Select Details');

        var type = form.addField('custpage_type', 'select', 'Type', 'customlist_agr_type', 'custpage_batch_group').setLayoutType('midrow');
        var type_data = request.getParameter('custpage_type');
        type.setDefaultValue(type_data)
        type.setMandatory(true);
        
        var selectFromDate = form.addField('custpage_select_fromdate', 'date', 'From Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var from_date_data = request.getParameter('custpage_select_fromdate')
        selectFromDate.setDefaultValue(from_date_data)
        var selectToDate = form.addField('custpage_select_todate', 'date', 'To Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var to_date_data = request.getParameter('custpage_select_todate');
        selectToDate.setDefaultValue(to_date_data)
        selectToDate.setMandatory(true);

        var selectInvoiceDate = form.addField('custpage_invoice_date', 'date', 'Invoice Date', null, 'custpage_batch_group').setLayoutType('midrow');
        var invoice_date_data = request.getParameter('custpage_invoice_date');
        selectInvoiceDate.setDefaultValue(invoice_date_data)
        selectInvoiceDate.setMandatory(true);

        var agr = form.addField('custpage_agr', 'select', 'Agreement', 'customrecord_agreement', 'custpage_batch_group').setLayoutType('outside');
        var agr_data = request.getParameter('custpage_agr');
        agr.setDefaultValue(agr_data);        

        var agr_line = form.addField('custpage_agr_line', 'select', 'Agreement Line', 'customrecord_agr_line', 'custpage_batch_group').setLayoutType('outside');
        var agr_line_data = request.getParameter('custpage_agr_line');
        agr_line.setDefaultValue(agr_line_data)
   
        var employee = form.addField('custpage_employee', 'select', 'employee', 'employee', 'custpage_batch_group').setLayoutType('outside');
        var employee_line_data = request.getParameter('custpage_employee');
        employee.setDefaultValue(employee_line_data)

        var customer = form.addField('custpage_customer', 'select', 'customer', 'customer', 'custpage_batch_group').setLayoutType('outside');
        var customer_data = request.getParameter('custpage_customer');
        customer.setDefaultValue(customer_data)

        //form.addField('custpage_page', 'text', 'Next Page', null, null).setDisplayType('hidden');
        form.setScript('customscript_bs_create_inv_cs');
        form.addButton('customscript_exclude', 'EXCLUDE FROM INVOICE SCREEN', 'EXCLUDE()');
                        
        response.writePage(form);
    }
}//end of suitlet

function isNullOrEmpty(val) {

    if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
        return true;
    }
    return false;
}
function GetLink(name, id, type) {
    var link = "<a href='https://system.netsuite.com"+ nlapiResolveURL('RECORD', type,id) + "'" + ' target="_blank">' + name + "</a>";
    return link;
    //"https://system.netsuite.com" + nlapiResolveURL('RECORD', 'customrecord_billing_plan', s[i].id)
}

