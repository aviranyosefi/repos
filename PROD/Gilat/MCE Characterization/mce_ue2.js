/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/ui/serverWidget', 'N/ui/message', 'N/search', 'N/task'],
    function (serverWidget, mess, search, task) {
        var sites = [];
        function beforeLoad(context) {
            if (context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT) {
                var rec = context.newRecord;
                var recTYPE = rec.type;
                if (recTYPE == 'customrecord_site') {
                    var cb = rec.getValue('custrecord_site_mce_issue');
                    if (cb == true) {
                        var form = context.form;
                        //var html = "<html><body><script type='text/javascript'>window.alert('MCE')</script></body></html>";                      
                        //form.addField({ id: 'custpage_alertmode', type: serverWidget.FieldType.INLINEHTML, label: 'T' }).defaultValue=html;
                        var myMsg = mess.create({
                            title: "MCE",
                            message: getCase(rec.id),
                            type: mess.Type.INFORMATION,
                            duration: 50000
                        });
                        context.form.addPageInitMessage({ message: myMsg });
                    }
                }           
            }
        }
        function beforeSubmit(context) {
            var rec = context.newRecord;
            var recTYPE = rec.type;
            if (recTYPE == 'supportcase') {
                var status  = rec.getValue('status');
                if (status != '5') {
                    var fiber = rec.getValue('custevent_issued_fiber');
                    var satellite = rec.getValue('custevent_issued_satellite');
                    var dvb_carrie = rec.getValue('custevent_issued_dvb_carrier');
                    var transponder = rec.getValue('custevent_issued_transponder');
                    var teleport_or_pop = rec.getValue('custevent_issued_teleport_or_pop');
                    getSites(fiber, satellite, dvb_carrie, transponder, teleport_or_pop);
                    log.debug({ title: '1 sites - ' + sites.length, details: JSON.stringify(sites) });
                    if (!isNullOrEmpty(satellite)) {
                        var transponders = getTransponders(satellite );
                        for (var y = 0; y < transponders.length; y++) {
                            getSites(null, null, null, transponders[y], null);
                        }
                        var dvbs = getDVB(satellite, 'custrecord_dvb_satellite');
                        for (var y = 0; y < dvbs.length; y++) {
                            getSites(null, null, dvbs[y], null, null);
                        }
                    }
                    log.debug({ title: '2 sites - ' + sites.length, details: JSON.stringify(sites) });
                    if (!isNullOrEmpty(transponder)) {
                        var dvbs = getDVB(transponder, 'custrecord_dvb_transponder');
                        for (var y = 0; y < dvbs.length; y++) {
                            getSites(null, null, dvbs[y], null, null);
                        }
                    }
                    log.debug({ title: '3 sites - ' + sites.length, details: JSON.stringify(sites) });
                    if (sites.length > 0) {
                        var updateVal = 'T'
                    }
                    rec.setValue({
                        fieldId: 'custevent_related_issued_sites',
                        value: sites
                    });
                }
                else { // STATUS CLOSE
                    sites = rec.getValue('custevent_related_issued_sites')
                    var updateVal = 'F'
                    
                }
                var scheduledScriptTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 666,
                    deploymentId: null,
                    params: {
                        'custscript_sites': JSON.stringify(sites),
                        'custscript_update_val': updateVal
                    }
                });
                scheduledScriptTask.submit();
            
            } 
            
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function getSites(fiber, satellite, dvb_carrie, transponder, teleport_or_pop) {
            var objSearch = search.load({
                id: 'customsearch_resource_fields_at_sites'
            });
            var Filters = objSearch.filters;

            var Filters = [];
            if (!isNullOrEmpty(fiber)) {
                Filters.push("AND");
                Filters.push(['custrecord_fragment_site.custrecord_fragment_fiber',  'anyof', fiber]);
            }
            if (!isNullOrEmpty(satellite)) {
                Filters.push("AND");
                Filters.push(['custrecord_site_satellite', 'anyof', satellite]);
            }
            if (!isNullOrEmpty(dvb_carrie)) {
                Filters.push("AND");
                Filters.push(['custrecord_site_dvb_carrier', 'anyof', dvb_carrie]);
            }
            if (!isNullOrEmpty(transponder)) {
                Filters.push("AND");
                Filters.push(['custrecord_site_uplink_transponder', 'anyof', transponder]);
            }
            if (!isNullOrEmpty(teleport_or_pop)) {
                Filters.push("AND");
                Filters.push(['custrecord_site_teleport', 'anyof', teleport_or_pop]);
            }
            if (Filters.length > 0) {               
                objSearch.filterExpression = objSearch.filterExpression.concat(Filters);
                var resultSet = objSearch.run();
                var results = resultSet.getRange({ start: 0, end: 1000 });
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    sites.push(result.getValue({ name: 'internalid' }))
                } 
            }             
        }
        function getTransponders(satellite) {
            var SearchObj = search.create({
                type: 'customrecord_transponder',
                filters:
                    [
                        ["custrecord_tran_satellite", "anyof", satellite]
                    ],
                columns:
                    [
                       "internalid"
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push(result.getValue({ name: "internalid" }))
                return true;
            });
            return res;
        }
        function getDVB(satellite , field) {
            var SearchObj = search.create({
                type: 'customrecord_dvb_carrier',
                filters:
                    [
                        [field, "anyof", satellite]
                    ],
                columns:
                    [
                        "internalid"
                    ]
            });
            var res = [];
            SearchObj.run().each(function (result) {
                res.push(result.getValue({ name: "internalid" }))
                return true;
            });
            return res;
        }
        function getCase( id) {
            var SearchObj = search.create({
                type: 'supportcase',
                filters:
                    [
                        ["custevent_related_issued_sites", "anyof", [id]]
                    ],
                columns:
                    [
                        "casenumber",
                    ]
            });
            var res = '';
            //for (var i = 0; i < SearchObj.length; i++) {
            //    res = result[i].getValue({ name: "casenumber" });
            //}

            SearchObj.run().each(function (result) {
                res = result.getValue({ name: "casenumber" });
                return true;
            });
            return res;
        }
        return {
            beforeLoad: beforeLoad,
            beforeSubmit: beforeSubmit,
        };
    });

