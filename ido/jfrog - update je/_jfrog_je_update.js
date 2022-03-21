var currentContext = nlapiGetContext();

function scheduled(type) {
	
	var errors = []
	
	var dstart = new Date();

for(var i = 0; i<arr.length; i++) {

	
    var dnow = new Date();
    var timeexe = (dnow - dstart) / 1000 / 3600;
    if (currentContext.getRemainingUsage() < 800 || timeexe >= 0.2) {
        var state = nlapiYieldScript();
        if (state.status == 'FAILURE') {
            nlapiLogExecution('ERROR', 'Error', ' Failed to yield script _jfrog_travel_po_scheduled');
        }
        else if (state.status == 'RESUME') {
            nlapiLogExecution("AUDIT", '_jfrog_travel_po_scheduled', "Resuming script due to: " + state.reason + ",  " + state.size);
        }
    }

    try{
    	
    	if(arr[i].reversal === 'No') {
    		
    	
        nlapiLogExecution('debug', 'current index', i.toString())
    	
    	var rec = nlapiLoadRecord('journalentry', arr[i].internalid);
    	
    	rec.setLineItemValue('line', 'department', arr[i].line + 1, arr[i].dept)
    	
    	nlapiSubmitRecord(rec)
    	}
    }catch(err) {
    	
    	errors.push(arr[i])
    	nlapiLogExecution('debug', 'error on this rec', arr[i].docNum)
    	nlapiLogExecution('debug', 'error on this rec', err)
    	continue;
    	
    }

	
}

nlapiLogExecution('debug', 'errors', JSON.stringify(errors.length))

}

var arr = [
           {
        	    "internalid": 1172894,
        	    "line": 0,
        	    "docNum": "JEIL1715232",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1172894,
        	    "line": 1,
        	    "docNum": "JEIL1715232",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1172894,
        	    "line": 2,
        	    "docNum": "JEIL1715232",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173153,
        	    "line": 0,
        	    "docNum": "JEIL1715238",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173153,
        	    "line": 1,
        	    "docNum": "JEIL1715238",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173153,
        	    "line": 2,
        	    "docNum": "JEIL1715238",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173153,
        	    "line": 3,
        	    "docNum": "JEIL1715238",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173155,
        	    "line": 0,
        	    "docNum": "JEIL1715240",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173155,
        	    "line": 1,
        	    "docNum": "JEIL1715240",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173155,
        	    "line": 2,
        	    "docNum": "JEIL1715240",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173259,
        	    "line": 0,
        	    "docNum": "JEIL1715242",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173259,
        	    "line": 1,
        	    "docNum": "JEIL1715242",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173259,
        	    "line": 2,
        	    "docNum": "JEIL1715242",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173261,
        	    "line": 0,
        	    "docNum": "JEIL1715244",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173261,
        	    "line": 1,
        	    "docNum": "JEIL1715244",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173261,
        	    "line": 2,
        	    "docNum": "JEIL1715244",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303255,
        	    "line": 0,
        	    "docNum": "JEIL1715553",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303255,
        	    "line": 1,
        	    "docNum": "JEIL1715553",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303255,
        	    "line": 2,
        	    "docNum": "JEIL1715553",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 2,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 3,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 5,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 9,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 12,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 13,
        	    "docNum": "JEIL1714983",
        	    "dept": 169,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 14,
        	    "docNum": "JEIL1714983",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 15,
        	    "docNum": "JEIL1714983",
        	    "dept": 165,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 38,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 53,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 54,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 64,
        	    "docNum": "JEIL1714983",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1080226,
        	    "line": 117,
        	    "docNum": "JEIL1714983",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1087564,
        	    "line": 0,
        	    "docNum": "JEIN171507",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1087599,
        	    "line": 0,
        	    "docNum": "JEIN171513",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1105127,
        	    "line": 0,
        	    "docNum": "JEIN171516",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1105127,
        	    "line": 3,
        	    "docNum": "JEIN171516",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1112341,
        	    "line": 4,
        	    "docNum": "JEUS1711826",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1119856,
        	    "line": 1,
        	    "docNum": "JEIL1715084",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 11,
        	    "docNum": "JEUS1711841",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 12,
        	    "docNum": "JEUS1711841",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 19,
        	    "docNum": "JEUS1711841",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 20,
        	    "docNum": "JEUS1711841",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 22,
        	    "docNum": "JEUS1711841",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 23,
        	    "docNum": "JEUS1711841",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 24,
        	    "docNum": "JEUS1711841",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1120319,
        	    "line": 26,
        	    "docNum": "JEUS1711841",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1203304,
        	    "line": 0,
        	    "docNum": "JEIN171582",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1203304,
        	    "line": 1,
        	    "docNum": "JEIN171582",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 88,
        	    "docNum": "JEUS1711858",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 94,
        	    "docNum": "JEUS1711858",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 104,
        	    "docNum": "JEUS1711858",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 135,
        	    "docNum": "JEUS1711858",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 141,
        	    "docNum": "JEUS1711858",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1132047,
        	    "line": 151,
        	    "docNum": "JEUS1711858",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 88,
        	    "docNum": "JEUS1711883",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 94,
        	    "docNum": "JEUS1711883",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 104,
        	    "docNum": "JEUS1711883",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 135,
        	    "docNum": "JEUS1711883",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 141,
        	    "docNum": "JEUS1711883",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161215,
        	    "line": 151,
        	    "docNum": "JEUS1711883",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 88,
        	    "docNum": "JEUS1711884",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 94,
        	    "docNum": "JEUS1711884",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 104,
        	    "docNum": "JEUS1711884",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 135,
        	    "docNum": "JEUS1711884",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 141,
        	    "docNum": "JEUS1711884",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1161216,
        	    "line": 151,
        	    "docNum": "JEUS1711884",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 88,
        	    "docNum": "JEUS1712038",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 94,
        	    "docNum": "JEUS1712038",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 104,
        	    "docNum": "JEUS1712038",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 135,
        	    "docNum": "JEUS1712038",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 141,
        	    "docNum": "JEUS1712038",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370990,
        	    "line": 151,
        	    "docNum": "JEUS1712038",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1173264,
        	    "line": 0,
        	    "docNum": "JEIL1715246",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173264,
        	    "line": 1,
        	    "docNum": "JEIL1715246",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173268,
        	    "line": 0,
        	    "docNum": "JEIL1715250",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173268,
        	    "line": 1,
        	    "docNum": "JEIL1715250",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173268,
        	    "line": 2,
        	    "docNum": "JEIL1715250",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1173268,
        	    "line": 3,
        	    "docNum": "JEIL1715250",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 90,
        	    "docNum": "JEUS1711911",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 96,
        	    "docNum": "JEUS1711911",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 106,
        	    "docNum": "JEUS1711911",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 137,
        	    "docNum": "JEUS1711911",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 143,
        	    "docNum": "JEUS1711911",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1194060,
        	    "line": 153,
        	    "docNum": "JEUS1711911",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1197560,
        	    "line": 0,
        	    "docNum": "JEIL1715339",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 314,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 315,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 316,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 317,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 318,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 319,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 320,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 321,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 322,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1199132,
        	    "line": 323,
        	    "docNum": "JEIL1715349",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 16,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 17,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 18,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 19,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 20,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 21,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 22,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 23,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 24,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 25,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 26,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 27,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 28,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 29,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 30,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 31,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 32,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 33,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 45,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 46,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 47,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 48,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 53,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 54,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 55,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 56,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 57,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 58,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 59,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 60,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 61,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 62,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 64,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 65,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 66,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 67,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 68,
        	    "docNum": "JEUS1711915",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 111,
        	    "docNum": "JEUS1711915",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 112,
        	    "docNum": "JEUS1711915",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 113,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 114,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 115,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 116,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 117,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 118,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 119,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 120,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 121,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 122,
        	    "docNum": "JEUS1711915",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 130,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 131,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 220,
        	    "docNum": "JEUS1711915",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 228,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 243,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 244,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 245,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 246,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 247,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 248,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 249,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 250,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 251,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 252,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 253,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 254,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 255,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 256,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 257,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 258,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 259,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 260,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 261,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 262,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 263,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 264,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 265,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 266,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 267,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 268,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 269,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 270,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 271,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 272,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 273,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 274,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 275,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 276,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 277,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 278,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 279,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1200965,
        	    "line": 280,
        	    "docNum": "JEUS1711915",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 32,
        	    "docNum": "JEUS1711918",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 33,
        	    "docNum": "JEUS1711918",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 34,
        	    "docNum": "JEUS1711918",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 35,
        	    "docNum": "JEUS1711918",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 40,
        	    "docNum": "JEUS1711918",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 41,
        	    "docNum": "JEUS1711918",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 42,
        	    "docNum": "JEUS1711918",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 43,
        	    "docNum": "JEUS1711918",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1202997,
        	    "line": 44,
        	    "docNum": "JEUS1711918",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1221649,
        	    "line": 0,
        	    "docNum": "JEIN171610",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 20,
        	    "docNum": "JEUS1711923",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 41,
        	    "docNum": "JEUS1711923",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 44,
        	    "docNum": "JEUS1711923",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 45,
        	    "docNum": "JEUS1711923",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 46,
        	    "docNum": "JEUS1711923",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 50,
        	    "docNum": "JEUS1711923",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 51,
        	    "docNum": "JEUS1711923",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 57,
        	    "docNum": "JEUS1711923",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 60,
        	    "docNum": "JEUS1711923",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 61,
        	    "docNum": "JEUS1711923",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 159,
        	    "docNum": "JEUS1711923",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 161,
        	    "docNum": "JEUS1711923",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223474,
        	    "line": 162,
        	    "docNum": "JEUS1711923",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 23,
        	    "docNum": "JEUS1711924",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 24,
        	    "docNum": "JEUS1711924",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 4,
        	    "docNum": "JEUS1711924",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 5,
        	    "docNum": "JEUS1711924",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 8,
        	    "docNum": "JEUS1711924",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223578,
        	    "line": 9,
        	    "docNum": "JEUS1711924",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 58,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 59,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 60,
        	    "docNum": "JEIL1715378",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 61,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 62,
        	    "docNum": "JEIL1715378",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 63,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 64,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 65,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 66,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 67,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 68,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 69,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 70,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 71,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 84,
        	    "docNum": "JEIL1715378",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 91,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 92,
        	    "docNum": "JEIL1715378",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 93,
        	    "docNum": "JEIL1715378",
        	    "dept": 169,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 94,
        	    "docNum": "JEIL1715378",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 101,
        	    "docNum": "JEIL1715378",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 106,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 107,
        	    "docNum": "JEIL1715378",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1223980,
        	    "line": 108,
        	    "docNum": "JEIL1715378",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227413,
        	    "line": 4,
        	    "docNum": "JEUS1711926",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 0,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 1,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 2,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 3,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 4,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 5,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 6,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 7,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 8,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 9,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 10,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 11,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 12,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 13,
        	    "docNum": "JEUS1711929",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 14,
        	    "docNum": "JEUS1711929",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1227715,
        	    "line": 20,
        	    "docNum": "JEUS1711929",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1228224,
        	    "line": 1,
        	    "docNum": "JEUS1711940",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1228224,
        	    "line": 2,
        	    "docNum": "JEUS1711940",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1270139,
        	    "line": 1,
        	    "docNum": "JEIL1715472",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302122,
        	    "line": 0,
        	    "docNum": "JEIL1715527",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302122,
        	    "line": 1,
        	    "docNum": "JEIL1715527",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302426,
        	    "line": 0,
        	    "docNum": "JEIL1715531",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302426,
        	    "line": 1,
        	    "docNum": "JEIL1715531",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302426,
        	    "line": 2,
        	    "docNum": "JEIL1715531",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302434,
        	    "line": 0,
        	    "docNum": "JEIL1715539",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302434,
        	    "line": 1,
        	    "docNum": "JEIL1715539",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1302434,
        	    "line": 2,
        	    "docNum": "JEIL1715539",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303053,
        	    "line": 0,
        	    "docNum": "JEIL1715551",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303053,
        	    "line": 1,
        	    "docNum": "JEIL1715551",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1303053,
        	    "line": 2,
        	    "docNum": "JEIL1715551",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 314,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 315,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 316,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 317,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 318,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 319,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 320,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 321,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 322,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370988,
        	    "line": 323,
        	    "docNum": "JEIL1715717",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 90,
        	    "docNum": "JEUS1712039",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 96,
        	    "docNum": "JEUS1712039",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 106,
        	    "docNum": "JEUS1712039",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 137,
        	    "docNum": "JEUS1712039",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 143,
        	    "docNum": "JEUS1712039",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370991,
        	    "line": 153,
        	    "docNum": "JEUS1712039",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1221650,
        	    "line": 0,
        	    "docNum": "JEIN171611",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 0,
        	    "docNum": "JEUS1711925",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 1,
        	    "docNum": "JEUS1711925",
        	    "dept": 165,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 6,
        	    "docNum": "JEUS1711925",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 7,
        	    "docNum": "JEUS1711925",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 10,
        	    "docNum": "JEUS1711925",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223579,
        	    "line": 11,
        	    "docNum": "JEUS1711925",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 56,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 57,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 58,
        	    "docNum": "JEIL1715379",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 59,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 60,
        	    "docNum": "JEIL1715379",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 61,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 62,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 63,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 64,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 65,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 66,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 67,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 68,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 69,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 82,
        	    "docNum": "JEIL1715379",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 88,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 89,
        	    "docNum": "JEIL1715379",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 90,
        	    "docNum": "JEIL1715379",
        	    "dept": 169,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 91,
        	    "docNum": "JEIL1715379",
        	    "dept": 165,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 98,
        	    "docNum": "JEIL1715379",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 103,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 104,
        	    "docNum": "JEIL1715379",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1223981,
        	    "line": 105,
        	    "docNum": "JEIL1715379",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1227414,
        	    "line": 4,
        	    "docNum": "JEUS1711927",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1228225,
        	    "line": 1,
        	    "docNum": "JEUS1711941",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1228225,
        	    "line": 2,
        	    "docNum": "JEUS1711941",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 92,
        	    "docNum": "JEUS1711975",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 98,
        	    "docNum": "JEUS1711975",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 108,
        	    "docNum": "JEUS1711975",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 139,
        	    "docNum": "JEUS1711975",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 145,
        	    "docNum": "JEUS1711975",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1269021,
        	    "line": 155,
        	    "docNum": "JEUS1711975",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 92,
        	    "docNum": "JEUS1712040",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 98,
        	    "docNum": "JEUS1712040",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 108,
        	    "docNum": "JEUS1712040",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 139,
        	    "docNum": "JEUS1712040",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 145,
        	    "docNum": "JEUS1712040",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371094,
        	    "line": 155,
        	    "docNum": "JEUS1712040",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 91,
        	    "docNum": "JEUS1711992",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 97,
        	    "docNum": "JEUS1711992",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 107,
        	    "docNum": "JEUS1711992",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 138,
        	    "docNum": "JEUS1711992",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 144,
        	    "docNum": "JEUS1711992",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1299584,
        	    "line": 154,
        	    "docNum": "JEUS1711992",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1309802,
        	    "line": 10,
        	    "docNum": "JEUS1712002",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 317,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 318,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 319,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 320,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 321,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1310007,
        	    "line": 322,
        	    "docNum": "JEIL1715557",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332226,
        	    "line": 2,
        	    "docNum": "JEIN171657",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332228,
        	    "line": 0,
        	    "docNum": "JEIN171659",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332540,
        	    "line": 54,
        	    "docNum": "JEUS1712005",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332540,
        	    "line": 55,
        	    "docNum": "JEUS1712005",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332540,
        	    "line": 132,
        	    "docNum": "JEUS1712005",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332540,
        	    "line": 134,
        	    "docNum": "JEUS1712005",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332540,
        	    "line": 137,
        	    "docNum": "JEUS1712005",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 50,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 51,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 52,
        	    "docNum": "JEIL1715626",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 53,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 54,
        	    "docNum": "JEIL1715626",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 55,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 56,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 57,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 58,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 59,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 60,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 61,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 62,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 63,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 77,
        	    "docNum": "JEIL1715626",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 83,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 84,
        	    "docNum": "JEIL1715626",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 85,
        	    "docNum": "JEIL1715626",
        	    "dept": 169,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 86,
        	    "docNum": "JEIL1715626",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 93,
        	    "docNum": "JEIL1715626",
        	    "dept": 166,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 98,
        	    "docNum": "JEIL1715626",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1332643,
        	    "line": 99,
        	    "docNum": "JEIL1715626",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 45,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 46,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 47,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 48,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 49,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1337701,
        	    "line": 50,
        	    "docNum": "JEUS1712016",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 0,
        	    "docNum": "JEUS1712019",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 1,
        	    "docNum": "JEUS1712019",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 2,
        	    "docNum": "JEUS1712019",
        	    "dept": 165,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 6,
        	    "docNum": "JEUS1712019",
        	    "dept": 170,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 7,
        	    "docNum": "JEUS1712019",
        	    "dept": 31,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 10,
        	    "docNum": "JEUS1712019",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 21,
        	    "docNum": "JEUS1712019",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 22,
        	    "docNum": "JEUS1712019",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1340571,
        	    "line": 26,
        	    "docNum": "JEUS1712019",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1341881,
        	    "line": 0,
        	    "docNum": "JEIN171670",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1341885,
        	    "line": 0,
        	    "docNum": "JEIN171674",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1341893,
        	    "line": 0,
        	    "docNum": "JEIN171682",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 317,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 318,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 319,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 320,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 321,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1370989,
        	    "line": 322,
        	    "docNum": "JEIL1715718",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 91,
        	    "docNum": "JEUS1712041",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 97,
        	    "docNum": "JEUS1712041",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 107,
        	    "docNum": "JEUS1712041",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 138,
        	    "docNum": "JEUS1712041",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 144,
        	    "docNum": "JEUS1712041",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1371095,
        	    "line": 154,
        	    "docNum": "JEUS1712041",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1119554,
        	    "line": 1,
        	    "docNum": "JEIL1715082",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1332227,
        	    "line": 2,
        	    "docNum": "JEIN171658",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333248,
        	    "line": 0,
        	    "docNum": "JEIN171665",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 50,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 51,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 52,
        	    "docNum": "JEIL1715630",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 53,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 54,
        	    "docNum": "JEIL1715630",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 55,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 56,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 57,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 58,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 59,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 60,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 61,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 62,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 63,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 77,
        	    "docNum": "JEIL1715630",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 83,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 84,
        	    "docNum": "JEIL1715630",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 85,
        	    "docNum": "JEIL1715630",
        	    "dept": 169,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 86,
        	    "docNum": "JEIL1715630",
        	    "dept": 165,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 93,
        	    "docNum": "JEIL1715630",
        	    "dept": 166,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 98,
        	    "docNum": "JEIL1715630",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1333350,
        	    "line": 99,
        	    "docNum": "JEIL1715630",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 0,
        	    "docNum": "JEUS1712020",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 1,
        	    "docNum": "JEUS1712020",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 2,
        	    "docNum": "JEUS1712020",
        	    "dept": 165,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 6,
        	    "docNum": "JEUS1712020",
        	    "dept": 170,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 7,
        	    "docNum": "JEUS1712020",
        	    "dept": 31,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 10,
        	    "docNum": "JEUS1712020",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 21,
        	    "docNum": "JEUS1712020",
        	    "dept": 167,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 22,
        	    "docNum": "JEUS1712020",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1340671,
        	    "line": 26,
        	    "docNum": "JEUS1712020",
        	    "dept": 164,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1341882,
        	    "line": 0,
        	    "docNum": "JEIN171671",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1341886,
        	    "line": 0,
        	    "docNum": "JEIN171675",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1341894,
        	    "line": 0,
        	    "docNum": "JEIN171683",
        	    "dept": 168,
        	    "reversal": "Yes"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 89,
        	    "docNum": "JEUS1712036",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 95,
        	    "docNum": "JEUS1712036",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 105,
        	    "docNum": "JEUS1712036",
        	    "dept": 164,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 136,
        	    "docNum": "JEUS1712036",
        	    "dept": 167,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 142,
        	    "docNum": "JEUS1712036",
        	    "dept": 168,
        	    "reversal": "No"
        	  },
        	  {
        	    "internalid": 1366306,
        	    "line": 152,
        	    "docNum": "JEUS1712036",
        	    "dept": 164,
        	    "reversal": "No"
        	  }
        	]