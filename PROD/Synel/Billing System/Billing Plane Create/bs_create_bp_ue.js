function beforeLoad_addButton(type, form) {
   
    if (type == 'view') {          
        form.setScript('customscript_bs_create_bl_cs');
        form.addButton('custpage_button_ic', 'Re Create Billing Plan', 'CreateBillingPlan()');     
        } 
}










