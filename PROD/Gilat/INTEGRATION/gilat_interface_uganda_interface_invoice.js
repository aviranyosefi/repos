/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *
 *
 */
define(['N/record', 'N/http', 'N/format', 'N/search', 'N/encode', 'N/runtime'],
  function (record, http, format, search, encode, runtime) {
    function afterSubmit(context) {

      var newRecord = context.newRecord;
      var prevRecord = context.oldRecord;
      if (prevRecord == null)
        prevRecord = newRecord;

      var jsonSellerDetails = {};
      var jsonBasicInformation = {};
      var jsonBuyerDetails = {};
      var jsonGoodsDetails = [];
      var jsonitem = {};
      var jsonTaxDetails = [];
      var jsonTaxitem = {};
      var jsonsummary = {};
      var jsonpayWay = [];
      var jsonpayWayitems = {};
      var jsonextend = {};
      var jsontosend = {};

 
      if ((newRecord.getValue('subsidiary') == '26') && (newRecord.getValue('custbody_ura_invoice_number') == '')) {//if(subsidiary == Gilat Uganda Ltd.) && URA INVOICE NUMBER ==""
        log.debug('Script', 'Run');
        try {
          var custRercord = record.load({
            type: record.Type.CUSTOMER,
            id: newRecord.getValue("entity"),
          });
          var discountflag = 0;
          var orderNumber = 0;
          var RoundingLine = 0;
          var summarynetAmount = 0;
          var summarytaxAmount = 0;
          var summarygrossAmount = 0;
          var roundingcategory = '96010101'; //service - 0.0

          var invoicetype = 1;
          var type = newRecord.type;
          if (type == 'creditmemo')
            invoicetype = 4;

          //********************************************* SellerDetails **************************************************************

          jsonSellerDetails['tin'] = '1008972943';
          jsonSellerDetails['ninBrn'] = null;
          jsonSellerDetails['legalName'] = 'Gilat Telecom Uganda Limited'
          jsonSellerDetails['businessName'] = 'Gilat Telecom Uganda Limited'
          jsonSellerDetails['address'] = 'Plot 6 Acacia Avenue, Acacia Place, Upper Ground floor, Kampala Uganda';
          jsonSellerDetails['mobilePhone'] = null;
          jsonSellerDetails['linePhone'] = null;
          jsonSellerDetails['emailAddress'] = 'asafl@gilat.net';
          jsonSellerDetails['placeOfBusiness'] = 'Kampala';
          jsonSellerDetails['referenceNo'] = newRecord.getValue({ fieldId: 'tranid' });

          //********************************************* Basic Information **************************************************************

          jsonBasicInformation['invoiceNo'] = newRecord.getValue({ fieldId: 'tranid' }); //Fiscal Document Number from URA. This should be left empty in the request.
          jsonBasicInformation['antifakeCode'] = null;
          jsonBasicInformation['deviceNo'] = newRecord.getValue({ fieldId: 'id' });//invoice internal id


          var d = new Date();
          d = newRecord.getValue({ fieldId: 'trandate' });
          d.setHours(d.getHours());
          var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
          var formatdate = [year, month, day].join('-') + ' ' + d.toTimeString().substring(0, 8)



          jsonBasicInformation['issuedDate'] = formatdate; //'2020-12-10 00:00:00'; //issueddate;


          jsonBasicInformation['operator'] = 'Web Services';//operatorName.firstname;

          var currency = newRecord.getValue({ fieldId: 'currency' });//getText
          var currency1 = search.lookupFields({
            type: search.Type.CURRENCY,
            id: currency,
            columns: ['name']
          });


          jsonBasicInformation['currency'] = currency1.name;
          var oriInvoiceId = "";
          if (invoicetype == 4)
            oriInvoiceId = newRecord.getValue({ fieldId: 'tranid' });

          jsonBasicInformation['oriInvoiceId'] = oriInvoiceId;//newRecord.getValue({ fieldId: 'tranid'}); //Leave empty if raising an invoice/receipt. For debit notes, populate the invoiceId that was returned against the original invoice/receipt.
          jsonBasicInformation['invoiceType'] = invoicetype;
          jsonBasicInformation['invoiceKind'] = 1;
          jsonBasicInformation['dataSource'] = 103;//webService
          jsonBasicInformation['invoiceIndustryCode'] = 101;//null
          jsonBasicInformation['isBatch'] = null;

          log.debug('jsonBasicInformation : ', jsonBasicInformation);

          //********************************************* Buyer Details **************************************************************

          var custtype = custRercord.getValue({ fieldId: 'isperson' });

          jsonBuyerDetails['buyerTin'] = custRercord.getValue({ fieldId: 'vatregnumber' });
          jsonBuyerDetails['buyerNinBrn'] = null;
          jsonBuyerDetails['buyerPassportNum'] = null;
          jsonBuyerDetails['buyerLegalName'] = custRercord.getValue({ fieldId: 'companyname' });//custentity_legal_name
          jsonBuyerDetails['buyerBusinessName'] = custRercord.getValue({ fieldId: 'companyname' });

          if (custtype == 'T') {//individual
            jsonBuyerDetails['buyerLegalName'] = custRercord.getValue({ fieldId: 'salutation' }) + ' ' + custRercord.getValue({ fieldId: 'firstname' }) + ' ' + custRercord.getValue({ fieldId: 'lastname' });
            jsonBuyerDetails['buyerBusinessName'] = custRercord.getValue({ fieldId: 'salutation' }) + ' ' + custRercord.getValue({ fieldId: 'firstname' }) + ' ' + custRercord.getValue({ fieldId: 'lastname' });
          }
          jsonBuyerDetails['buyerAddress'] = custRercord.getValue("billcity"); //custRercord.getSublistValue({ sublistId: 'addressbook', fieldId: 'city', line: 0 });
          jsonBuyerDetails['buyerEmail'] = custRercord.getValue({ fieldId: 'email' });
          jsonBuyerDetails['buyerMobilePhone'] = custRercord.getValue({ fieldId: 'phone' });
          jsonBuyerDetails['buyerLinePhone'] = null;
          jsonBuyerDetails['buyerPlaceOfBusi'] = null;


          var cust_shipto = custRercord.getValue({ fieldId: 'shipcountry' });

          jsonBuyerDetails['buyerType'] = 2;//customer.ship to != Uganda )
          if (cust_shipto == 'UG') {
            if (custtype == 'F')//company
              jsonBuyerDetails['buyerType'] = 0;
            if (custtype == 'T')//individual
              jsonBuyerDetails['buyerType'] = 1;
          }
          jsonBuyerDetails['buyerCitizenship'] = null;
          jsonBuyerDetails['buyerSector'] = null;
          jsonBuyerDetails['buyerReferenceNo'] = null;

          log.debug('jsonBuyerDetails : ', jsonBuyerDetails);

          var item_count = newRecord.getLineCount({ sublistId: 'item' });
          log.debug('Item Lines: ', item_count);


          var taxgroup = search.lookupFields({
            type: 'customrecord_cst_tax_item',
            id: '1',
            columns: ['custrecord_ug_internet_services_tax']
          });

          log.debug('taxgroup.custrecord_ug_internet_services_tax:  ', taxgroup.custrecord_ug_internet_services_tax[0].value);//7517


          //******************************************************items - GoodsDetails *****************************************************
          var maxRateItem = 0;
          var maxitemLine = item_count;

          for (var Line = 0; Line < item_count; Line++) {
            var jsonitem = {};
            var jsonTaxitem = {};

            var iteminternalid = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'item', line: Line });
            var itemname = search.lookupFields({
              type: search.Type.ITEM,
              id: iteminternalid,
              columns: ['displayname', 'itemid']
            });
            jsonitem["item"] = itemname.displayname;//itemid
            var itemCode = itemname.itemid;
            jsonitem["itemCode"] = itemCode;
            var quantity = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: Line });
            jsonitem["qty"] = quantity;
            jsonitem["unitOfMeasure"] = '101'; //'103';//newRecord.getSublistValue({ sublistId: 'item', fieldId: 'units', line: Line });
            var itemrate = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: Line });
            var taxrate1 = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxrate1', line: Line });//18
            log.debug('taxrate1: ', taxrate1);


            var taxrate = (taxrate1 / 100);//0.18
            var taxrate180 = (1 + taxrate) * 100;//118
            log.debug('taxrate: ', taxrate);
            log.debug('taxrate180: ', taxrate180);

            var amount = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line });
            var unitPrice = (itemrate * (taxrate + 1)).toFixed(2);



            if (unitPrice == 0 || unitPrice == '' || unitPrice == null) {
              continue;
              //unitPrice=0.01;
            }

            jsonitem["unitPrice"] = unitPrice;

            //log.debug('before Tofix_noround quantity*unitPrice : '+ Line, quantity*unitPrice);

            var total = (quantity * unitPrice).toFixed(2); //amount*(1+taxrate);

            //log.debug('after Tofix_noround total : '+Line, total);


            jsonitem["total"] = total; //total.toFixed(2);
            jsonitem["taxRate"] = taxrate.toFixed(2);
            var itemtax = (total / (1 + taxrate) * taxrate).toFixed(2);//  toFixed(2)
            jsonitem["tax"] = itemtax;
            jsonitem["discountTotal"] = null;
            jsonitem["discountTaxRate"] = null;
            jsonitem["orderNumber"] = orderNumber; // newRecord.getSublistValue({ sublistId: 'item', fieldId: 'line', line: Line });
            jsonitem["discountFlag"] = 2;
            jsonitem["deemedFlag"] = 2;
            jsonitem["exciseFlag"] = 2;
            jsonitem["categoryId"] = null;
            jsonitem["categoryName"] = null;
            jsonitem["goodsCategoryId"] = '81112101'; //'43201550';//hardcoded - service -  0.18

            // if(itemCode=='3525')//Interface Rounding
            if (itemname.itemid == 'Interface Rounding') {
              jsonitem["goodsCategoryId"] = roundingcategory;
              RoundingLine = Line;
            }

            if (taxrate == 0)//itemname.itemid=='Non Taxable Item')
            {
              jsonitem["item"] = 'Non Taxable Item';
              jsonitem["itemCode"] = 'Non Taxable Item';//item internal id SB 5515 | PR 6866
              jsonitem["taxRate"] = '-';
              jsonitem["goodsCategoryId"] = roundingcategory;

            }

            if (unitPrice > maxRateItem) {
              var maxitemName = itemname.itemid;
              var maxitemCode = itemCode;
              var maxtaxrate = taxrate;
              var maxitemtax = itemtax;
              maxitemLine = orderNumber;// Line;
              maxRateItem = unitPrice;

            }


            //log.debug('newRecord.getSublistValue({ sublistId: item, fieldId: taxcode, line: Line }):  ', newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line }));

            if (newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line }) == taxgroup.custrecord_ug_internet_services_tax[0].value) {//VAT_UG:VAT (18%) UG on sales (data 12%)


              var PercentField = search.lookupFields({
                type: 'customrecord_cst_tax_item',  //search.Type.TAXCODE,
                id: 1,
                columns: ['custrecord_cst_percent', 'custrecord_vat_percent']
              });
              var cstPercent = PercentField.custrecord_cst_percent / 100;
              var vatPercent = PercentField.custrecord_vat_percent / 100;
              log.debug('cstPercent: ', cstPercent);//0.12
              log.debug('vatPercent: ', vatPercent);//0.18


              jsonitem["item"] = 'Excise Item';
              jsonitem["itemCode"] = 'Excise Item';
              jsonitem["exciseFlag"] = '1';


              jsonitem["exciseRate"] = cstPercent;
              jsonitem["exciseRule"] = '1';
              jsonitem["exciseTax"] = (cstPercent * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })).toFixed(2);
              jsonitem["exciseRateName"] = '12%';
              jsonitem["taxRate"] = vatPercent; //'0.18';
              jsonitem["tax"] = (total / (1 + vatPercent) * vatPercent).toFixed(2);
              jsonitem["categoryId"] = 'LED160400'; // 41- Internet data
              jsonitem["categoryName"] = 'Internet data';
              //jsonitem["unitPrice"] = (newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line }) * (1 + cstPercent)).toFixed(2);
            }




            jsonitem["goodsCategoryName"] = null;
            jsonitem["pack"] = null;
            jsonitem["stick"] = null;
            jsonitem["exciseUnit"] = null;
            jsonitem["exciseCurrency"] = null;



            jsonGoodsDetails.push(jsonitem);


            //****************************************************** items - TaxDetails *****************************************************
            var taxAmount = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'tax1amt', line: Line });
            var grossamountline = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'grossamt', line: Line });

              var netAmount = parseFloat(total / (1 + taxrate)).toFixed(2);
              if (newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line }) == taxgroup.custrecord_ug_internet_services_tax[0].value) {

                  var netAmountToSend = (netAmount * (1 + cstPercent)).toFixed(2);
                  var taxAmountField = ((1 + cstPercent) * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })) * vatPercent;
                  log.debug('aviran taxAmountField', taxAmountField.toFixed(2))
                  summarynetAmount = summarynetAmount + newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line });
                  summarytaxAmount = summarytaxAmount + Number(taxAmountField).toFixed(2);
                  summarygrossAmount = (summarygrossAmount +Number(netAmountToSend) + Number(taxAmountField)).toFixed(2);
              }
                else {
                  summarynetAmount = summarynetAmount + parseFloat(netAmount);
                  summarytaxAmount = summarytaxAmount + parseFloat(itemtax);
                  summarygrossAmount = summarygrossAmount + (parseFloat(netAmount) + parseFloat(itemtax));
              }
    

            jsonTaxitem["taxCategory"] = 'Standard';
            jsonTaxitem["netAmount"] = netAmount;
            jsonTaxitem["taxRate"] = taxrate.toFixed(2); //0.18
            jsonTaxitem["taxAmount"] = itemtax;
            var exchangerate = newRecord.getValue({ fieldId: 'exchangerate' });
            jsonTaxitem["grossAmount"] = (parseFloat(netAmount) + parseFloat(itemtax)).toFixed(2);
            jsonTaxitem["exciseUnit"] = null;
            jsonTaxitem["exciseCurrency"] = null;
            var taxRateid = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line });//getSublistText-->getSublistValue

            log.debug('taxRateNameid: ', taxRateid);

            var taxRateName = search.lookupFields({
              type: 'salestaxitem',  //search.Type.TAXCODE,
              id: taxRateid,
              columns: ['name']
            });
            if (taxRateName.length < 1)
              var taxRateName = search.lookupFields({
                type: 'taxgroup',
                id: taxRateid,
                columns: ['name']
              });

            log.debug('taxRateName1: ', taxRateName);
            log.debug('taxRateName1.name: ', taxRateName.name);
            jsonTaxitem["taxRateName"] = taxRateName.name;//taxRateName1->taxRateName





            if (newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line }) == taxgroup.custrecord_ug_internet_services_tax[0].value) {//VAT_UG:VAT (18%) UG on sales (data 12%)



                var netAmountToSend = (netAmount * (1 + cstPercent)).toFixed(2);
                jsonTaxitem["netAmount"] = netAmountToSend
              jsonTaxitem["taxRate"] = vatPercent;//'0.18';
              var taxAmountField = ((1 + cstPercent) * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })) * vatPercent;
              jsonTaxitem["taxAmount"] = (taxAmountField).toFixed(2); //*0.18;
                jsonTaxitem["taxRateName"] = PercentField.custrecord_vat_percent + '%'; //18%';
                jsonTaxitem["grossAmount"] = (Number(netAmountToSend) + Number(taxAmountField)).toFixed(2)


                var ExciseTaxAmount = (cstPercent * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })).toFixed(2);
                var gapjsonTaxDetails = { "taxCategory": "Excise Duty", "netAmount": newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line }), "taxRate": cstPercent, "taxAmount": ExciseTaxAmount, "grossAmount": ((1 + cstPercent) * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })).toFixed(2), "exciseUnit": null, "exciseCurrency": null, "taxRateName": "12%" };


            }


            jsonTaxDetails.push(jsonTaxitem);
            if (newRecord.getSublistValue({ sublistId: 'item', fieldId: 'taxcode', line: Line }) == taxgroup.custrecord_ug_internet_services_tax[0].value)
              jsonTaxDetails.push(gapjsonTaxDetails);

            orderNumber++;

          }// end of for(var Line = 0; Line < item_count; Line++)

          //***********************************************************************************************************GAP ROUNDING****************************************************************************************************************************

          var nstotal = newRecord.getValue({ fieldId: 'total' });
          log.debug('GAP: summarygrossAmount', summarygrossAmount);
          log.debug('GAP:nstotal', nstotal);
          var gap = 0;


          if (summarygrossAmount < nstotal) {
            gap = (nstotal - summarygrossAmount).toFixed(2);
            if (gap > 0.00) {
              log.debug('GAP: summarygrossAmount != NS total', summarygrossAmount + ' < ' + nstotal);
              var gapjsonGoodsDetails = { "item": "Interface Rounding", "itemCode": "Interface Rounding", "qty": "1", "unitOfMeasure": "101", "unitPrice": gap, "total": gap, "taxRate": "-", "tax": 0, "discountTotal": null, "discountTaxRate": null, "orderNumber": orderNumber, "discountFlag": 2, "deemedFlag": 2, "exciseFlag": 2, "categoryId": null, "categoryName": null, "goodsCategoryId": roundingcategory, "goodsCategoryName": null, "exciseRate": null, "exciseRule": null, "exciseTax": null, "pack": null, "stick": null, "exciseUnit": null, "exciseCurrency": null, "exciseRateName": null };

              var gapjsonTaxDetails = { "taxCategory": "Standard", "netAmount": gap, "taxRate": "-", "taxAmount": 0, "grossAmount": gap, "exciseUnit": null, "exciseCurrency": null, "taxRateName": "nontaxable" };

              jsonGoodsDetails.push(gapjsonGoodsDetails);
              jsonTaxDetails.push(gapjsonTaxDetails);

              orderNumber++;
            }
          }
          log.debug('GAP:gapjsonGoodsDetails', gapjsonGoodsDetails);
          log.debug('GAP:gapjsonTaxDetails', gapjsonTaxDetails);




          if (summarygrossAmount > nstotal) {
            discountflag = 1;
            log.debug('maxitemName + maxitemCode + maxRateItem + maxtaxrate: ', maxitemName + ' & ' + maxitemCode + ' & ' + maxRateItem + ' & ' + maxtaxrate);
            gap = (nstotal - summarygrossAmount).toFixed(2);
            if (gap < 0.00) {
              log.debug('GAP: summarygrossAmount != NS total', summarygrossAmount + ' > ' + nstotal);

              log.debug('GAP:[maxitemLine]: ', maxitemLine);
              log.debug('GAP: jsonGoodsDetails: ', jsonGoodsDetails);
              log.debug('GAP: jsonTaxDetails: ', jsonTaxDetails);
              log.debug('GAP: jsonGoodsDetails[maxitemLine]: ', jsonGoodsDetails[maxitemLine]);
              log.debug('GAP: jsonTaxDetails[maxitemLine]: ', jsonTaxDetails[maxitemLine]);



              jsonGoodsDetails[orderNumber - 1].discountTotal = gap;
              jsonGoodsDetails[orderNumber - 1].discountFlag = "1";


              jsonTaxDetails[orderNumber - 1].netAmount = (parseFloat(jsonTaxDetails[orderNumber - 1].netAmount) + parseFloat((gap / taxrate180) * 100)).toFixed(2);
              jsonTaxDetails[orderNumber - 1].taxAmount = (parseFloat(jsonTaxDetails[orderNumber - 1].taxAmount) + parseFloat((gap / taxrate180) * taxrate1)).toFixed(2);
              jsonTaxDetails[orderNumber - 1].grossAmount = (parseFloat(jsonTaxDetails[orderNumber - 1].grossAmount) + parseFloat(gap)).toFixed(2);




              var gapjsonGoodsDetails = { "item": jsonGoodsDetails[orderNumber - 1].item + ' (Discount)', "itemCode": jsonGoodsDetails[orderNumber - 1].itemCode, "qty": null, "unitOfMeasure": "101", "unitPrice": null, "total": gap, "taxRate": jsonGoodsDetails[orderNumber - 1].taxRate, "tax": (gap / taxrate180 * taxrate1).toFixed(2), "discountTotal": null, "discountTaxRate": null, "orderNumber": orderNumber, "discountFlag": 0, "deemedFlag": 2, "exciseFlag": 2, "categoryId": null, "categoryName": null, "goodsCategoryId": "81112101", "goodsCategoryName": null, "exciseRate": null, "exciseRule": null, "exciseTax": null, "pack": null, "stick": null, "exciseUnit": null, "exciseCurrency": null, "exciseRateName": null };
              if (jsonGoodsDetails[orderNumber - 1].item == 'Excise Item') {
                gapjsonGoodsDetails["exciseRate"] = cstPercent;
                gapjsonGoodsDetails["exciseTax"] = 0//(cstPercent * newRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: Line })).toFixed(2);
                //gapjsonGoodsDetails["exciseRateName"] = '12%';
                gapjsonGoodsDetails["exciseRule"] = '1';
                gapjsonGoodsDetails['exciseFlag'] = 1;
                gapjsonGoodsDetails["categoryId"] = 'LED160400'; // 41- Internet data
                gapjsonGoodsDetails["categoryName"] = 'Internet data';
              }

              //var gapjsonTaxDetails={"taxCategory":"Standard","netAmount":Math.abs((gap/taxrate180)*100).toFixed(2),"taxRate":maxtaxrate,"taxAmount":Math.abs(gap/taxrate180*taxrate1).toFixed(2),"grossAmount":Math.abs(gap),"exciseUnit":null,"exciseCurrency":null,"taxRateName":"nontaxable"};

              jsonGoodsDetails.push(gapjsonGoodsDetails);
              //jsonTaxDetails.push(gapjsonTaxDetails);


            }
          }


          //*********************************************summary**************************************************************
          log.debug('GAP ', gap);
          log.debug('summarytaxAmount before', summarytaxAmount);
          if (discountflag == 1)
            summarytaxAmount = (Number(summarytaxAmount) + parseFloat((gap / taxrate180) * taxrate1)).toFixed(2);
          log.debug('summarytaxAmount after', summarytaxAmount);
            log.debug('discountflag ', discountflag);
            if (discountflag == 0)
                summarynetAmount = (parseFloat(summarynetAmount) + parseFloat(gap)).toFixed(2);
            else if (discountflag == 1) {
                summarygrossAmount = (Number(summarygrossAmountט) + Number(gap)).toFixed(2);
                //summarynetAmount = (Number(summarynetAmount) + Number((gap / taxrate180) * 100)).toFixed(2);
            }
          
                
          

          //if(discountflag==0)
          //summarygrossAmount = (parseFloat(summarynetAmount) + parseFloat(summarytaxAmount)).toFixed(2);//+parseFloat(gap)
          /* else if(discountflag==1)
            summarygrossAmount=(parseFloat(summarynetAmount)+parseFloat(summarytaxAmount)+parseFloat(gap/taxrate180*taxrate1)).toFixed(2);
        */


          jsonsummary['netAmount'] = summarynetAmount;
          jsonsummary['taxAmount'] = (Number(summarytaxAmount) + Number(ExciseTaxAmount)).toFixed(2);
          jsonsummary['grossAmount'] = summarygrossAmount;//parseFloat(summarygrossAmount);
          jsonsummary['itemCount'] = orderNumber;
          jsonsummary['modeCode'] = 1; //0 Offline || 1 Online
          jsonsummary['remarks'] = newRecord.getValue({ fieldId: 'memo' });
          jsonsummary['qrCode'] = null;

          log.debug('jsonsummary', JSON.stringify(jsonsummary));

          //*********************************************payWay - array**************************************************************

          jsonpayWayitems['paymentMode'] = 110;//Swift transfer
          jsonpayWayitems['paymentAmount'] = parseFloat(summarygrossAmount);
          jsonpayWayitems['orderNumber'] = 'a'; //a b c d

          jsonpayWay.push(jsonpayWayitems);

          //*********************************************extend**************************************************************
          jsonextend['reason'] = null;
          jsonextend['reasonCode'] = null;
          //***********************************************************************************************************





          jsontosend["sellerDetails"] = jsonSellerDetails;
          jsontosend["basicInformation"] = jsonBasicInformation;
          jsontosend["buyerDetails"] = jsonBuyerDetails;
          jsontosend["goodsDetails"] = jsonGoodsDetails;
          jsontosend["taxDetails"] = jsonTaxDetails;
          jsontosend["summary"] = jsonsummary;
          jsontosend["payWay"] = jsonpayWay;
          jsontosend["extend"] = jsonextend;


          log.debug('jsontosend', JSON.stringify(jsontosend));
          log.debug('jsonGoodsDetails.length', jsonGoodsDetails.length);
          log.debug('jsonTaxDetails.length', jsonTaxDetails.length);



          var stringInput = JSON.stringify(jsontosend);
          var base64EncodedString = encode.convert({
            string: stringInput,
            inputEncoding: encode.Encoding.UTF_8,
            outputEncoding: encode.Encoding.BASE_64
          });







          var headerObj = { 'Content-Type': 'application/json;charset=UTF-8', 'Accept': '*/*' };


          var method = http.Method.POST;
          log.debug('headerObj method', method);

          //*********************************************************************************************************


          var content = base64EncodedString;
          var requestTime = URA_Time();
          log.debug('requestTime', requestTime);
          var interfaceCode = 'T109';
          var jsontest = "{'data': {'content': '" + content + "','signature': '','dataDescription': {'codeType': '0','encryptCode': '0','zipCode': '0'}},'globalInfo': {'appId': 'AP04','dataExchangeId': '1','deviceMAC': '1','deviceNo': '202002271756','longitude': '0','latitude':'0','interfaceCode':'" + interfaceCode + "','requestCode': 'TP','requestTime': '" + requestTime + "','responseCode': 'TA','taxpayerID': '1008972943','tin': '1008972943','userName': 'admin','version': '1.1.20191201','extendField': {'responseDateFormat':'dd/MM/yyyy','responseTimeFormat': 'dd/MM/yyyy HH:mm:ss'}},'returnStateInfo': {'returnCode': '','returnMessage': ''}}";


          //var jsontest ={};
          log.debug('jsontest POST', jsontest);

          //**************************************************************************************************************
          var environment = runtime.envType;

          var url;
          if (environment == 'SANDBOX')
            url = 'http://81.199.137.238:9880/efristcs/ws/tcsapp/getInformation';
          else if (environment == 'PRODUCTION')
            url = 'http://81.199.137.237:9880/efristcs/ws/tcsapp/getInformation';//prod

          log.debug('environment and url', environment + ' & url : ' + url);

          var response = http.request({
            method: method,
            url: url,
            body: jsontest, //JSON.stringify(jsontosend),
            headers: headerObj
          });
          log.debug('response', response);
          var body = JSON.parse(response.body);
          log.debug('body POST', body);
          log.debug('body.content POST', body.data.content);
          var returnStateInfo = body.returnStateInfo;
          log.debug('returnStateInfo POST', returnStateInfo);


          var stringInput = body.data.content;
          var utf8EncodedString = encode.convert({
            string: stringInput,
            inputEncoding: encode.Encoding.BASE_64,
            outputEncoding: encode.Encoding.UTF_8
          });

          utf8EncodedString = JSON.parse(utf8EncodedString);
          log.debug('body utf8EncodedString', utf8EncodedString);
          var returnedURANumber = utf8EncodedString.basicInformation.invoiceNo;
          var returnedURAid = utf8EncodedString.basicInformation.invoiceId;
          var returnedQRCode = utf8EncodedString.summary.qrCode;
          var returnURAVerificationCode = utf8EncodedString.basicInformation.antifakeCode;


          log.debug('body returnedURANumber', returnedURANumber);
          log.debug('body returnedURAid', returnedURAid);
          log.debug('body returnedQRCode', returnedQRCode);
          if (invoicetype == 1) {
            var rec = record.load({
              type: 'invoice',
              id: newRecord.id,
            });

            rec.setValue({ fieldId: 'custbody_ura_invoice_number', value: returnedURANumber });
            rec.setValue({ fieldId: 'custbody_ura_invoice_id', value: returnedURAid });
            rec.setValue({ fieldId: 'custbody_ura_invoice_qr_code', value: returnedQRCode });
            rec.setValue({ fieldId: 'custbody_ura_verification_code', value: returnURAVerificationCode });
            rec.setValue({ fieldId: 'custbody_ura_message', value: JSON.stringify(returnStateInfo.returnMessage) });
            rec.save();
          }

        } catch (e) {
          log.error('Error e: ', e);
          log.error('Error e.message: ', e.message);

          var rec = record.load({
            type: 'invoice',
            id: newRecord.id,
          });
          rec.setValue({ fieldId: 'custbody_ura_message', value: JSON.stringify(returnStateInfo.returnMessage) });
          rec.save();
        }
      }//if(subsidiary == Gilat Uganda Ltd.)
    }
    //*******************************************************************************URA_Time********************************************************************************

    function URA_Time() {
      var d = new Date();
      d.setHours(d.getHours() + 10)
      var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();



      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      var formatdate = [year, month, day].join('-') + ' ' + d.toTimeString().substring(0, 8)
      return formatdate;
    }


    return {
      afterSubmit: afterSubmit
    };
  });

function Tofix_noround(num) {
  num = num.toString();
  var temp = num;
  if (num.indexOf('.') != 0 && num.substring(num.indexOf('.'), num.length).length > 2) {
    var temp = num.substring(0, num.indexOf('.') + 3);
    return parseFloat(temp);
  }
  return parseFloat(temp);
}



