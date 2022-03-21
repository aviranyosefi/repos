function run() {
	
 
	var strRows = '';
    var iRows = 0;

    	var Currency = 6;
        var Subsidiary = 21;
        
        	var subRec = nlapiLoadRecord('subsidiary', Subsidiary, null);
        	var Subsidiary_VAT_Reg_No = subRec.getFieldValue('federalidnumber'); //VAT Registration Number for Subsidiary chosen
        	console.log(Subsidiary_VAT_Reg_No);
        

        //create Shaam file for sending Israel Shaam Authorities
        //2. Rows: T511303737201510310000000123518000002462+0000014483000000000

        // AP Invoices
        // list of AP items ordered by invoice, tax code 
        var results = nlapiSearchRecord('vendor', null, [new nlobjSearchFilter('currency', null, 'is', Currency), new nlobjSearchFilter('subsidiary', null, 'is', Subsidiary)], [new nlobjSearchColumn('custentity_il_tax_payer_id'), new nlobjSearchColumn('vatregnumber'), new nlobjSearchColumn('legalname')]);

            for (var i = 0; i < results.length; i++) {
                var item = results[i];

                
                var vendor_number = PadLeftWithZero(item.id, 13);
                var vendor_payerid = PadLeftWithZero(item.rawValues[0].value, 9);
                var vendor_regnumber = PadLeftWithZero(item.rawValues[1].value, 9);
                var vendor_legalname = PadLeftWithZero(item.rawValues[2].value, 34);
                
                console.log(item);
                

                var row = '';
                row += 'B';
                row += vendor_number;
                row += vendor_payerid;
                row += vendor_regnumber;
                row += vendor_legalname;
                strRows += row + "\r\n";
                iRows++;
                
                console.log(row);

            };
            
            
            
            function PadWithZero(data, maxlength) {
                if (data == undefined)
                    data = '0';
                data = data.toString();
                var res = data;
                for (var i = data.length; i < maxlength; i++) {
                    res += '0';
                }
                return res;
            }

            function PadLeftWithZero(data, maxlength) {
                if (data == undefined)
                    data = '0';
                data = data.toString();
                var res = data;
                for (var i = data.length; i < maxlength; i++) {
                    res = '0' + res;
                }
                return res;
            };
}  ; 
            