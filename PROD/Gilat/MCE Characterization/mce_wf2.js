/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define(['N/ui/serverWidget', ' N/ui/message', 'N/search', 'N/task', 'N/runtime', 'N/email'],
    function (serverWidget, mess, search, task, runtime, email) {
        var contacts = [];
        function onAction (context) {
            var rec = context.newRecord;
            var recTYPE = rec.type;
            if (recTYPE == 'supportcase') {
                var message = rec.getValue('custevent_mce_outcoming_message');
                var sites = rec.getValue('custevent_related_issued_sites');
                for (var i = 0; i < sites.length; i++) {
                    var tranId = search.lookupFields({
                        type: 'customrecord_site',
                        id: sites[i],
                        columns: ['custrecord_site_customer']
                    });             
                    var company = tranId.custrecord_site_customer

                    //var signature = '';
                    //var assigned = rec.getValue('assigned');
                    //if (!isNullOrEmpty(assigned)) {
                    //    var tranId = search.lookupFields({
                    //        type: 'employee',
                    //        id: assigned,
                    //        columns: ['custentity_related_case_profile']
                    //    });
                    //    var related_case_profile = tranId.custentity_related_case_profile
                    //    related_case_profile = related_case_profile[0].value
                    //    if (related_case_profile == 1) {
                    //        signature = 'TAC DATA TEAM'
                    //    }
                    //    else if (related_case_profile == 2) {
                    //        signature = 'TAC TEAM'
                    //    }
                    //}
                    getContacts(company[0].value)
                    getEmp(company[0].value)
                }
                sendEmail(message, rec, contacts)
            }                     
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function sendEmail(message, rec, contacts) {
            try {     
                var keys = Object.keys(contacts);
                keys.push('mceandpremiumgroup@gilat.net');
                log.debug('contacts ' + keys.length, JSON.stringify(keys))
                var emailSubject = rec.getValue('casenumber') + ' - Multi Customer Event -';
                var fiber = rec.getText('custevent_issued_fiber');
                var satellite = rec.getText('custevent_issued_satellite');
                var dvb_carrie = rec.getText('custevent_issued_dvb_carrier');
                var transponder = rec.getText('custevent_issued_transponder');
                var teleport_or_pop = rec.getText('custevent_issued_teleport_or_pop');
                if (!isNullOrEmpty(fiber)) {
                    emailSubject += ' ' + fiber
                }
                if (!isNullOrEmpty(satellite)) {
                    emailSubject += ' ' + satellite
                }
                if (!isNullOrEmpty(dvb_carrie)) {
                    emailSubject += ' ' + dvb_carrie
                }
                if (!isNullOrEmpty(transponder)) {
                    emailSubject += ' ' + transponder
                }
                if (!isNullOrEmpty(teleport_or_pop)) {
                    emailSubject += ' ' + teleport_or_pop
                }
                var emailBody = message;
                //emailBody += '<br><br>' + '<img src="https://4998343-sb2.app.netsuite.com/core/media/media.nl?id=108030&c=4998343_SB2&h=2PIOuerg_lrdOdIG5V0Mki7GnH3oaIIHyoBr5SvhmRZQe3Ab" >' 
                log.debug('user', runtime.getCurrentUser().id)
                for (var i = 0; i < keys.length; i++) {
                    log.debug('keys[i].email ', keys[i]);
                    try {                  
                        email.send({
                            author: runtime.getCurrentUser().id,
                            recipients: keys[i],
                            subject: emailSubject,
                            body: emailBody,
                            relatedRecords: {
                                activityId: rec.id
                            }
                        });
                    } catch (e) {
                        log.error('error email.send line: '+ i  , e);
                    }
                }                  
            } catch (e) {
                log.error('error sendEmail :', e);
            }
        }
        function getContacts(company) {
            var objSearch = search.load({
                id: 'customsearch_mce_notification_contacts'
            });
            var Filters = objSearch.filters;

            var Filters = [];
            if (!isNullOrEmpty(company)) {
                Filters.push("AND");
                Filters.push(['company', 'anyof', company]);
            }      
            if (Filters.length > 0) {
                objSearch.filterExpression = objSearch.filterExpression.concat(Filters);
                var resultSet = objSearch.run();
                var results = resultSet.getRange({ start: 0, end: 1000 });
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var email = result.getValue({ name: 'email' })
                    contacts[email] = { email: email };      
                }
            }
        }
        function getEmp(company) {
            var objSearch = search.load({
                id: 'customsearch_mce_customer_gilat_emails'
            });
            var Filters = objSearch.filters;

            var Filters = [];
            if (!isNullOrEmpty(company)) {
                Filters.push("AND");
                Filters.push(['internalid', 'anyof', company]);
            }
            if (Filters.length > 0) {
                objSearch.filterExpression = objSearch.filterExpression.concat(Filters);
                var resultSet = objSearch.run();
                var results = resultSet.getRange({ start: 0, end: 1000 });
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var salesrep = result.getValue({ name: 'email', join:'salesRep'})
                    contacts[salesrep] = { email: salesrep };
                    var account_manager = result.getValue({ name: 'email', join: "CUSTENTITY_ACCOUNT_MANAGER"})
                    contacts[account_manager] = { email: account_manager };
                    var collector = result.getValue({ name: 'email', label:"CUSTENTITY_COLLECTOR" })
                    contacts[collector] = { email: collector };
                }
            }
        }
        return {
            onAction: onAction ,
        };
    });

