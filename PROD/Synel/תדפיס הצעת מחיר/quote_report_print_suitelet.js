var context = nlapiGetContext();

function suitelet_print(request, response) {
  try {
    if (request.getMethod() == "GET") {

      var id = request.getParameter('recid');
      var type = request.getParameter('type');
      var custid = request.getParameter('custid');
      var buttype = request.getParameter('buttype');
      var mail = request.getParameter('mail');

      nlapiLogExecution('DEBUG', 'type: ' + type + ' - suitelet', 'id: ' + id + ' custid: ' + custid + ' buttype: ' + buttype);

      /*var params = {
          'custscript_rec_id': id,
          'custscript_rectype': type,
          'custscript_custid': custid,
          'custscript_buttype': buttype
      }
  
      var status = nlapiScheduleScript('customscript_soprintouts_sceduled', 'customdeploy1', params);//, params
      nlapiLogExecution('DEBUG', 'status', status);*/

      nlapiLogExecution('DEBUG', 'stage one', 'stage one');
      var form = nlapiCreateForm("אנא בחר פעולה רצויה");



      if (nlapiLookupField('estimate', id, 'custbody_trx_approval_status') == 2)//approved
        form.addField('orgtype', 'radio', 'שליחת מייל להצעה הארוכה', 'long_m');

      form.addField('orgtype', 'radio', 'הצגת תדפיס הצעה הארוכה', 'long_temp');
      if (nlapiLookupField('estimate', id, 'custbody_trx_approval_status') == 2)//approved
        form.addField('orgtype', 'radio', 'שליחת מייל להצעה הקצרה', 'short_m');

      form.addField('orgtype', 'radio', 'הצגת תדפיס הצעה הקצרה', 'short_temp');
      form.getField('orgtype', 'long_temp').setDefaultValue('long_temp');



      var rec_idfield = form.addField('custpage_rec_id', 'text', 'recid');
      rec_idfield.setDefaultValue(id);
      rec_idfield.setDisplayType('hidden');

      var typefield = form.addField('custpage_type', 'text', 'type');
      typefield.setDefaultValue(type);
      typefield.setDisplayType('hidden');

      var custidfield = form.addField('custpage_custid', 'text', 'custid');
      custidfield.setDefaultValue(custid);
      custidfield.setDisplayType('hidden');

      var buttypefield = form.addField('custpage_buttype', 'text', 'buttype');
      buttypefield.setDefaultValue(buttype);
      buttypefield.setDisplayType('hidden');

      if (nlapiLookupField('estimate', id, 'custbody_trx_approval_status') == 2) {//approved

        var mailfield = form.addField('custpage_mail', 'text', 'sent to email');
        mailfield.setDefaultValue(mail);
        //mailfield.setDisplayType('hidden');

        var mailbody = form.addField('custpage_mailbody', 'text', 'mail body');
        mailbody.setMandatory(true);
        mailbody.setDefaultValue('לקוח יקר, בהמשך לפנייתך מצורפת הצעת מחיר לעיונך');
      }

      form.addSubmitButton('Submit');
      response.writePage(form);

    }
    else {
      var form = nlapiCreateForm("prints");

      var htmlfield = form.addField('custpage_html', 'inlinehtml', '', null, null);


      var orgtype = request.getParameter('orgtype');
      var id = request.getParameter('custpage_rec_id');
      var mail = request.getParameter('custpage_mail');
      var customer = request.getParameter('custpage_custid');
      nlapiLogExecution('debug', id, mail);

      var quoteRec = nlapiLoadRecord('estimate', id);



      if (orgtype == 'long_temp' || orgtype == 'long_m') {

        //var emp_phone = nlapiLookupField('employee', quoteRec.getFieldValue('assigned'), 'phone');
        var cust_name = nlapiLookupField('customer', customer, 'companyname');
        nlapiLogExecution('debug', 'cust_name', cust_name);
        //var mdLotId = woRec.getFieldValue('custbody_medicane_sub_lot')
        nlapiLogExecution('DEBUG', 'id: ', id);
        var record = nlapiLoadRecord('estimate', id);
        var renderer = nlapiCreateTemplateRenderer();
        //var template = nlapiLoadFile(14872);   // sendbox
        var template = nlapiLoadFile(4088);   // prod
        renderer.setTemplate(template.getValue());
        renderer.addRecord('record', record);
        var xml = renderer.renderToString();
        /*xml = xml.replace('TECH_PHONE', emp_phone);
        xml = xml.replace('CUSTOMER_NAME', cust_name);*/
        nlapiLogExecution('DEBUG', 'xml: ', xml);
        var pdf = nlapiXMLToPDF(xml);
        if (mail != -1 && mail != null && mail != '' && orgtype == 'long_m') {
          var sbj = quoteRec.getFieldValue('tranid') + ' סינאל - הצעת מחיר מספר';

          var bodymail = '<p align="right" style="text-align:right;">';
          bodymail += request.getParameter('custpage_mailbody');
          bodymail += '</p>';
          bodymail += '<br/>';
          var signature = context.getPreference('MESSAGE_SIGNATURE')
          if (!isEmpty(signature))
            bodymail += context.getPreference('MESSAGE_SIGNATURE');

          var status = nlapiSendEmail(context.user, mail, sbj, bodymail, null, null, null, pdf);

          var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', 'המייל נשלח בהצלחה ', NLAlertDialog.TYPE_LOWEST_PRIORITY); setTimeout('window.history.go(-2)', 1500);</script>";
          htmlfield.setDefaultValue(html);
          response.writePage(form);

        }
        response.setContentType('PDF', quoteRec.getFieldValue('tranid') + '.pdf' /*,'inline'*/);
        response.write(pdf.getValue());
      }

      if (orgtype == 'short_m' || orgtype == 'short_temp') {
        nlapiLogExecution('DEBUG', 'id: ', id);
        var record = nlapiLoadRecord('estimate', id);
        var renderer = nlapiCreateTemplateRenderer();
        //var template = nlapiLoadFile(21253);   // sendbox
        var template = nlapiLoadFile(4301);   // prod
        renderer.setTemplate(template.getValue());
        nlapiLogExecution('DEBUG', 'template: ', template);

        renderer.addRecord('record', record);
        var xml = renderer.renderToString();
        nlapiLogExecution('DEBUG', 'xml before: ', xml);

        var count = record.getLineItemCount('item');
        nlapiLogExecution('DEBUG', 'count: ', count);
        for (var i = 1; i <= count; i++) {
          var itemid = record.getLineItemValue('item', 'item', i);
          nlapiLogExecution('DEBUG', 'itemid: ', itemid);

          var imgid = nlapiLookupField('item', itemid, 'custitem_item_image');
          nlapiLogExecution('DEBUG', 'imgid: ', imgid);
          if (!isEmpty(imgid)) {
            var fileObj = nlapiLoadFile(imgid);

            var imgURLForPDF = '<p align="right" style="text-align:right;"> <img src="https://';
            imgURLForPDF += context.company;
            imgURLForPDF = imgURLForPDF.replace('_', '-');
            imgURLForPDF += '.app.netsuite.com';
            imgURLForPDF += fileObj.getURL();
            //imgURLForPDF += '" style="margin: 7px;width:70px; height:55px;" /> </p>'
            imgURLForPDF += '" style="text-align:right; float: right; width:70px; height:55px;  display: block; margin-right: auto; margin-right: auto" /> </p>';
            imgURLForPDF = imgURLForPDF.replace(/&/gi, '&amp;');

            nlapiLogExecution('DEBUG', 'after imgURLForPDF', imgURLForPDF);

            xml = xml.replace('/IMG ' + i + '/', imgURLForPDF);
          }
          else
            xml = xml.replace('/IMG ' + i + '/', '');


          var itemtype = record.getLineItemValue('item', 'itemtype', i);
          nlapiLogExecution('DEBUG', 'itemid', itemid);
          nlapiLogExecution('DEBUG', 'itemtype', itemtype);

          var recordtype = '';

          switch (itemtype) {   // Compare item type to its record type counterpart
            case 'InvtPart':
              recordtype = 'inventoryitem';
              break;
            case 'NonInvtPart':
              recordtype = 'noninventoryitem';
              break;
            case 'Service':
              recordtype = 'serviceitem';
              break;
            case 'Assembly':
              recordtype = 'assemblyitem';
              break;
            case 'GiftCert':
              recordtype = 'giftcertificateitem';
              break;
            default:
          }
          nlapiLogExecution('DEBUG', 'recordtype', recordtype);

          //var url = 'https://system.eu2.netsuite.com/app/common/item/item.nl?itemtype=InvtPart&isserialitem=T&itemusesbins=F&id=' + itemid + '&e=F&q=mediaitemrange&si=undefined&si_mediaitemsortfld=&si_mediaitemsortdir=&si_mediaitemsortfld2=&si_mediaitemsortdir2=&f=T&machine=mediaitem'
          //var fileurl = nlapiRequestURL(url);

          //form.setScript('customscript_quote_report_print_cs');
          //var files = getItemFile(itemid);


          //var files = window.localStorage.getItem('user');


          //var body = fileurl.getBody();



          //nlapiLogExecution('debug', i + ' - files - ' + itemid, files);
          //var link = document.getElementById('download1href')
          //nlapiLogExecution('debug', 'link',link);



          //var item = nlapiLoadRecord(recordtype, itemid);
          //var file_count = item.getLineItemCount('mediaitem');
          //nlapiLogExecution('DEBUG', 'file_count', file_count);

          var json_files = record.getFieldValue('custbody_json_files');
          var add_attachments = record.getFieldValue('custbody_add_attachments');


          if (add_attachments == 'T' && !isEmpty(json_files)) {
            json_files = JSON.parse(json_files);
            var jsoncount = json_files.length;
            var fileURLForPDF = '<p style="text-align:right;color: blue;" dir="rtl">';

            for (var j = 0; j < jsoncount; j++) {
              var json_item = json_files[j].item;
              var file_url = json_files[j].fileurl;
              var file_name = json_files[j].filename;
              //nlapiLogExecution('debug', 'file_url', file_url);

              if (itemid == json_item) {
                if (j == -1) {
                  var ff = '<a class="testa" href="https://6398307.app.netsuite.com/core/media/media.nl?id=7745&amp;c=6398307_SB2&amp;h=TUUDZOSV9rNCl1zDTmMJg1Ss3zjs87vHDQtXtwfkszO_-98z&amp;_xd=T&amp;_xt=.pdf"'
                  ff += '>' + '' + '</a>';
                  //fileURLForPDF = fileURLForPDF.replace(/&/g, '&amp;');
                  fileURLForPDF += ff
                  fileURLForPDF += '<br/>';
                  nlapiLogExecution('DEBUG', 'TEST', fileURLForPDF);

                } else {
                  var ff = '<a href="https://';
                  ff += context.company.replace('_', '-');
                  ff += '.app.netsuite.com';
                  var furl = file_url.substring(file_url.indexOf('/core/media/'), file_url.indexOf('" '));
                  ff += furl;
                  var fname = file_name.substring(file_name.indexOf(":-2px;'>") + 8);
                  var num = j + 1;
                  ff += '">' + fname + '</a>';
                  ff = ff.replace(/&/g, '&amp;');
                  fileURLForPDF += ff
                  fileURLForPDF += '<br/>';
                  nlapiLogExecution('DEBUG', 'FILE ' + i + ' fileURLForPDF', fileURLForPDF);
                  //break;
                }



                //nlapiLogExecution('debug', 'final fileURLForPDF', fileURLForPDF)
              }
              

            }
            fileURLForPDF += '</p>';
            nlapiLogExecution('DEBUG', 'FILE ' + i + ' fileURLForPDF', fileURLForPDF);
            xml = xml.replace('/FILE ' + i + '/', fileURLForPDF);
          }
          else
            xml = xml.replace('/FILE ' + i + '/', '');

        }
        /*xml = xml.replace('TECH_PHONE', emp_phone);
        xml = xml.replace('CUSTOMER_NAME', cust_name);*/
        nlapiLogExecution('DEBUG', 'xml: ', xml);
        var pdf = nlapiXMLToPDF(xml);
        if (mail != -1 && mail != null && mail != '' && orgtype == 'short_m') {
          var sbj = quoteRec.getFieldValue('tranid') + ' סינאל - הצעת מחיר מספר';

          var bodymail = '<p align="right" style="text-align:right;">';
          bodymail += request.getParameter('custpage_mailbody');
          bodymail += '</p>';
          bodymail += '<br/>';
          var signature = context.getPreference('MESSAGE_SIGNATURE')
          if (!isEmpty(signature))
            bodymail += context.getPreference('MESSAGE_SIGNATURE');
          var status = nlapiSendEmail(context.user, mail, sbj, bodymail, null, null, null, pdf);

          var html = "<script>showAlertBox('alert_No_relevant', 'Confirmed', 'המייל נשלח בהצלחה ', NLAlertDialog.TYPE_LOWEST_PRIORITY); setTimeout('window.history.go(-2)', 1500);</script>";
          htmlfield.setDefaultValue(html);
          response.writePage(form);

        }
        response.setContentType('PDF', quoteRec.getFieldValue('tranid') + '.pdf'/*, 'inline'*/);
        response.write(pdf.getValue());

      }
    }
  } catch (e) {

    nlapiLogExecution('ERROR', 'error: ', e);
    throw nlapiCreateError('Error', e, true);
  }
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement)
}

function isEmpty(val) {
  return (val == undefined || val == null || val == '');
}