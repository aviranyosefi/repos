/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/error', 'N/runtime'],
    function (record, search, error, runtime) {

        function afterSubmit(context) {
            //===========add you after submit logic here ======

            /*if (context.type !== context.UserEventType.CREATE)
                return;*/

            var newRecord = context.newRecord;
            var prevRecord = context.oldRecord;
            if (prevRecord == null)
                prevRecord = newRecord;

            var Rtype = newRecord.type
            log.debug('Rtype', Rtype)
            if (Rtype !== 'employee')
                return;



            log.debug('custentity_po_requester', newRecord.getValue('custentity_po_requester'))
            var empid = newRecord.id;
     
            var new_po_requester = newRecord.getValue('custentity_po_requester')
            var pre_po_requester = prevRecord.getValue('custentity_po_requester')

            var new_purchase_approval_flo = newRecord.getValue('custentity_default_purchase_approval_flo')
            var pre_purchase_approval_flo = prevRecord.getValue('custentity_default_purchase_approval_flo')

            var new_purchaseorderapprover = newRecord.getValue('purchaseorderapprover');
            var pre_purchaseorderapprover = prevRecord.getValue('purchaseorderapprover');

            if (((new_po_requester != pre_po_requester) || (new_purchase_approval_flo != pre_purchase_approval_flo) || (new_purchaseorderapprover != pre_purchaseorderapprover)) && newRecord.getValue('custentity_po_requester') == true && newRecord.getValue('custentity_default_purchase_approval_flo') != '') {

                try {

                    var purchase_approval_flow = newRecord.getValue('custentity_default_purchase_approval_flo');
                    var purchase_approval_flow_name = newRecord.getText('custentity_default_purchase_approval_flo');
                    log.debug('purchase_approval_flow', purchase_approval_flow);
                    if (purchase_approval_flow == '') {
                        throw error.create({
                            name: 'MISSING_REQ_ARG',
                            message: 'Missing a required argument: [custentity_purchase_approval_flow] must be filled'
                        });
                    }


                    var firstname = prevRecord.getValue('firstname')
                    var lastname = prevRecord.getValue('lastname')
                 
                    var altname = firstname + ' ' + lastname;
                    log.debug(altname, empid);

                    //************* customrecord_po_requester creation ************** */

                    var req_exist = check_exist('customrecord_po_requester', empid);
                    log.debug('req_exist', req_exist);

                    if (req_exist == -1) {
                        log.debug('in req_exist', '');
                        req_rec = record.create({
                            type: 'customrecord_po_requester'
                        });
                    } else {
                        var req_rec = record.load({
                            type: 'customrecord_po_requester',
                            id: req_exist
                        });
                        req_rec.setValue('isinactive', false);
                    }

                    req_rec.setValue('name', altname);
                    req_rec.setValue('custrecord_requester', empid);                   
                    req_rec.setValue('custrecord_purchase_approver', new_purchaseorderapprover);
                    
                                     
                    var req_rec_id = req_rec.save();
                    log.debug('req_recid saved', req_rec_id);
                    //*************************** */

                    //************* customrecord_po_requester_approval_flow creation ************** */

                    var flow_exist = check_exist('customrecord_po_requester_approval_flow', req_rec_id, purchase_approval_flow);
                    log.debug('flow_exist', flow_exist);

                    if (flow_exist == -1) {
                        log.debug('in flow_exist', '');
                        flow_rec = record.create({
                            type: 'customrecord_po_requester_approval_flow'
                        });
                    } else {
                        var flow_rec = record.load({
                            type: 'customrecord_po_requester_approval_flow',
                            id: flow_exist
                        });
                        flow_rec.setValue('isinactive', false);
                    }

                    flow_rec.setValue('name', purchase_approval_flow_name);
                    flow_rec.setValue('custrecord_raf_requester', req_rec_id);//req
                    flow_rec.setValue('custrecord_raf_approval_flow', purchase_approval_flow);//approval flow
                    flow_rec.setValue('custrecord_raf_is_default', true);//is default


                    uncheck_defaults(req_rec_id, purchase_approval_flow)

                    var flow_rec_id = flow_rec.save();
                    log.debug('flow_rec_id saved', flow_rec_id);

                    //*************************** */

                    log.debug('script', 'end');

                } catch (e) {
                    log.error(e);
                    throw e
                }
            }

            if (newRecord.getValue('isinactive') != prevRecord.getValue('isinactive')) {
                var inactive = newRecord.getValue('isinactive');
                log.debug('inactive', inactive);

                //inactive_app_flow()
                inactive_po_req(empid, inactive);
                //inactive_po_req('customrecord_po_requester_approval_flow',reqid,inactive_val);

            }

        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }

        function inactive_po_req(reqid, inactive_val) {

            var poresid = -1;
            //if (search_type == 'customrecord_po_requester')
            var myFilters = ['custrecord_requester', 'anyof', reqid];
            /*else if (search_type == 'customrecord_po_requester_approval_flow')
                var myFilters = [['custrecord_raf_requester', 'anyof', reqid], 'and', ['custrecord_raf_approval_flow', 'anyof', purchase_approval_flow]];
*/
            var myColumns = ['internalid'];
            var srch = search.create({ type: 'customrecord_po_requester', filters: myFilters, columns: myColumns });
            var srchResults = srch.run();
            srchResults.each(function (result) {
                poresid = result.getValue({ name: "internalid" })

                var id = record.submitFields({
                    type: 'customrecord_po_requester',
                    id: poresid,
                    values: {
                        isinactive: inactive_val
                    }
                });
                log.debug('id inactive', id);

                //return true
            });
            //************************* */

            var resid = -1;
            //if (search_type == 'customrecord_po_requester')
            var myFilters = ['custrecord_raf_requester', 'anyof', poresid];
            /*else if (search_type == 'customrecord_po_requester_approval_flow')
                var myFilters = [['custrecord_raf_requester', 'anyof', reqid], 'and', ['custrecord_raf_approval_flow', 'anyof', purchase_approval_flow]];
*/
            var myColumns = ['internalid'];
            var srch = search.create({ type: 'customrecord_po_requester_approval_flow', filters: myFilters, columns: myColumns });
            var srchResults = srch.run();
            srchResults.each(function (result) {
                resid = result.getValue({ name: "internalid" })

                var id = record.submitFields({
                    type: 'customrecord_po_requester_approval_flow',
                    id: resid,
                    values: {
                        isinactive: inactive_val
                    }
                });
                log.debug('id inactive', id);

                return true
            });




            return


        }

        function uncheck_defaults(req_rec_id, purchase_approval_flow) {
            var res = -1;
            var myFilters = [['custrecord_raf_requester', 'anyof', req_rec_id], 'and', ['custrecord_raf_approval_flow', 'noneof', purchase_approval_flow]];
            var myColumns = ['internalid'];
            var srch = search.create({ type: 'customrecord_po_requester_approval_flow', filters: myFilters, columns: myColumns });
            var srchResults = srch.run();
            srchResults.each(function (result) {

                resid = result.getValue({ name: "internalid" })
                var id = record.submitFields({
                    type: 'customrecord_po_requester_approval_flow',
                    id: resid,
                    values: {
                        custrecord_raf_is_default: false,//is default
                        isinactive: true//is inactive
                    }
                });
                log.debug('id updated', id);
                return true
            });

            return
        }


        function check_exist(search_type, id, purchase_approval_flow) {
            try {
                var res = -1;
                if (search_type == 'customrecord_po_requester')
                    var myFilters = ['custrecord_requester', 'anyof', id];
                else if (search_type == 'customrecord_po_requester_approval_flow')
                    var myFilters = [['custrecord_raf_requester', 'anyof', id], 'and', ['custrecord_raf_approval_flow', 'anyof', purchase_approval_flow]];
                var myColumns = ['internalid'];
                var srch = search.create({ type: search_type, filters: myFilters, columns: myColumns });
                var srchResults = srch.run();
                srchResults.each(function (result) {
                    res = result.getValue({ name: "internalid" })
                });

                return res
            } catch (e) {
                log.error('error check', e)
            }
        }

        function beforeLoad(context) {
            //========add your before load logic here ==========

            //Sample allow only create type

            if (context.type !== context.UserEventType.CREATE)
                return;

            var record = context.newRecord;
            var Rtype = record.type

            if (Rtype !== 'purchaseorder')
                return;

            var userid = runtime.getCurrentUser().id
            var reqid = check_exist('customrecord_po_requester', userid);

            log.debug(reqid, userid)
            if (reqid != -1) {
                record.setValue('custbody_po_requester', reqid);

                var flowid = getapproval_flow(reqid)
                record.setValue('custbody_po_approval_flow', flowid);
            }
        }


        function getapproval_flow(req) {


            var id = -1;
            var myFilters = [['custrecord_raf_requester', 'is', req], 'and', ['custrecord_raf_is_default', 'is', 'T']];
            var myColumns = ['internalid'];
            var srch = search.create({ type: 'customrecord_po_requester_approval_flow', filters: myFilters, columns: myColumns });
            var srchResults = srch.run();

            srchResults.each(function (result) {
                id = result.getValue({ name: "internalid" })
            });
            return id


        }


        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit
        };
    });