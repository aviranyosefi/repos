/**
*@NApiVersion 2.0
*@NScriptType scheduledscript
*/
define(['N/record', 'N/runtime'],
    function (record,  runtime) {
        function execute(scriptContext) {
            var sites = runtime.getCurrentScript().getParameter('custscript_sites');
            var updateVal = runtime.getCurrentScript().getParameter('custscript_update_val');
            log.debug('sites id:', sites);
            sites = JSON.parse(sites);
            try {
                for (var i = 0; i < sites.length; i++) {
                    var otherId = record.submitFields({
                        type: 'customrecord_site',
                        id: sites[i],
                        values: {
                            'custrecord_site_mce_issue': updateVal
                        }
                    });
                }
            } catch (e) {
                log.error(e.message);
            }
        }
        return {
            execute: execute
        };
    });
