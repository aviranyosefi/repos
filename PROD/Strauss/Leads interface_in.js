/**
 * @NApiVersion 2.x
 * @NScriptType restlet
 */

define(['N/record', 'N/error', 'N/search', 'N/format', 'N/file'],
  function (record, error, search, format, file) {
    function doValidation(args, argNames, methodName) {
      for (var i = 0; i < args.length; i++)
        if (!args[i] && args[i] !== 0)
          throw error.create({
            name: 'MISSING_REQ_ARG',
            message: 'Missing a required argument: [' + argNames[i] + '] for method: ' + methodName
          });
    }

    //define(['N/record'],function(record) {
    function post(context) {
      log.debug('status', 'run');
      /* var theRecord = record.load({
           type: 'lead',
           id: '255',
       });
log.debug('theRecord:', JSON.stringify(theRecord));*/
      /*{
         "custentity_leader_id":"3570683",
         "firstname":"ליד לבדיקה",
         "lastname":"בדיקה 1",
         "phone":"0525618728",
         "email":"kirilg@one1.co.il",
         "companyname":"one1",
         "custentity_territory":"מרכז",
         "custentity_number_of_employess":100,
         "custentity_cups":"100",
         "custentity_leader_lead_source":"facebook",
         "custentity_utm_campaign":"מבצע_חורף",
         "category":"בית מלון",
         "custentity_lead_message":"12345",
         "custentity_machine_type":"מקצועית",
         "custentity_accepting_mailing":true
      }
      */

      try {
        doValidation(['lead'], ['recordtype'], 'POST');
        log.debug('json:', JSON.stringify(context));
        var rec = record.create({
          type: 'lead',
          isDynamic: true
        });
        log.debug('creation', 'creation');

        var subsidiary = 2; //שטראוס קפה (AFH)

        rec.setValue('subsidiary', subsidiary);

        if (context.companyname == "")
          rec.setValue('companyname', 'ללא שם');
        else
          rec.setValue('companyname', context.companyname);

        for (var fldName in context)
          if (context.hasOwnProperty(fldName)) {
            var val = context[fldName];
            if (val == null || val == "")
              continue;
            var type = "";
            var field = rec.getField(fldName);
            if (field == null)
              continue;
            type = rec.getField(fldName).type;
      
            try {
              rec.setText(fldName, val);
            }
            catch (e) {
              continue;
            }

          }

        if (rec.getValue("custentity_leader_lead_source") == 'google_ads')
          rec.setValue('leadsource', -2);//גוגל
        else if (rec.getValue("custentity_leader_lead_source") == 'facebook')
          rec.setValue('leadsource', 2);//פייסבוק
        else if (rec.getValue("custentity_leader_lead_source") == 'linkedin')
          rec.setValue('leadsource', 3);//לינקדאין
        else if (rec.getValue("custentity_leader_lead_source") == 'taboola')
          rec.setValue('leadsource', -6);//טבולה
        else if (rec.getValue("custentity_leader_lead_source") == 'יזום-פנימי')
          rec.setValue('leadsource', 4);//יזום-פנימי
        else if (rec.getValue("custentity_leader_lead_source") == 'direct')
          rec.setValue('leadsource', -4);//אורגני
        else if (rec.getValue("custentity_leader_lead_source") == 'תערוכה')
          rec.setValue('leadsource', -5);//תערוכה
        else if (rec.getValue("custentity_leader_lead_source") == 'kishrei_asakim')
          rec.setValue('leadsource', 132681);//קשרי עסקים
        else if (rec.getValue("custentity_leader_lead_source") == 'beanz_form')
          rec.setValue('leadsource', 175159);//טופס בינז	
        else
          rec.setValue('leadsource', -3)//אחר

        var recid = rec.save();

        log.debug('lead Saved: ', recid);

        //***************************setting contact *****************************************************
        if (context.firstname != '' || context.lastname != '') {
          doValidation(['contact'], ['recordtype'], 'POST');
          log.debug('Contact creation', 'run');
          var contactrec = record.create({
            type: 'contact',
            isDynamic: true
          });
          contactrec.setValue('subsidiary', subsidiary);
          //***********************connecting with lead****************************
          contactrec.setValue('company', recid);

          for (var fldName in context)
            if (context.hasOwnProperty(fldName)) {
              var val = context[fldName];
              if (val == null || val == "" || fldName == "category")
                continue;
              var type = "";
              var field = contactrec.getField(fldName);
              if (field == null)
                continue;
              type = contactrec.getField(fldName).type;
              //log.debug("Contact : " + fldName ,type);

              try {
                if (type === "select") {
                  contactrec.setValue(fldName, val);
                }
                else
                  contactrec.setText(fldName, val);
              } catch (e) {
                continue;
              }
            }

          contactrec.setValue('category', 1);//מכירות

          var conid = contactrec.save();

          log.debug('Contact Saved: ', conid);

          record.submitFields({
            type: 'contact',
            id: conid,
            values: {
              'contactrole': '-10' //Primary Contact	
            }
          });
        }

        return JSON.stringify({ "status": "OK", "Id:": recid });
      }
      catch (e) {
        log.error('Error:', e);
        return e.message;
      }
    }
    return {
      post: post
    };
  }
);