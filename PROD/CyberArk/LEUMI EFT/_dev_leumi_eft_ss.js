
var itemsData =[];

function updateTreadOnFields() {
    try { 

        var context = nlapiGetContext();
        var custscript_treadon_data = context.getSetting('SCRIPT', 'custscript_treadon_data');		
        var approve_type = context.getSetting('SCRIPT', 'custscript_approve_type');	
		itemsData = JSON.parse(custscript_treadon_data);
	
		for (var i = 0; i < itemsData.length; i++) {
            try {
                if (approve_type == '1') {
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_trans_type', itemsData[i].type)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_reason', itemsData[i].reason)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_reason_comments', itemsData[i].reason_comments)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_tax', itemsData[i].tax)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_calc_type', itemsData[i].calc_type)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_exe_cert_num', itemsData[i].cer_num)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_exe_cert_date', itemsData[i].cer_date)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_account_goods', itemsData[i].account_goods)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_acc_goods_curr', itemsData[i].currency_goods)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_acc_commission', itemsData[i].account_commission)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_acc_curr_commi', itemsData[i].currency_commission)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_charge_fees', itemsData[i].charge_fee)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_pay_date', itemsData[i].payment_date)
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_comments', itemsData[i].comments)

                }
                else {
                    nlapiSubmitField('vendorpayment', itemsData[i].id, 'custbody_cbr_tradeon_eft_created', 'T')
                }

				
				
				/*
					id: id,
						amount: amount.replace('.' ,''),
						currency:currency,
						type : type,
						reason:reason,
						reason_comments :reason_comments,
						tax:tax,
						calc_type:calc_type,
						cer_num : cer_num,
						cer_date :cer_date,
						account_goods :account_goods,
						currency_goods :currency_goods,
						account_commission :account_commission,
						currency_commission :currency_commission,
						charge_fee :charge_fee,
						payment_date :payment_date,
						treadon_code:treadon_code,
				
				*/
                          
				
            } catch (err) {
                nlapiLogExecution('DEBUG', 'updateTreadOnFields -  SUBMIT FIELDS', err);
            }
        }
      

       
		

           
             
    } catch (err) {
        nlapiLogExecution('error', 'updateTreadOnFields()', err)
    }
    
}
     
