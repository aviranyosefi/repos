/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/ui/serverWidget'],
    function (record, serverWidget) {
        function beforeLoad(context) {
            var form = context.form;
            var fieldToHide = 'printoncheckas,emailpreference,taxidnum,url,image,custentity29,taxrounding,taxfractionunit';
            var tabToHide = 'relrecordstxt,financialtxt' //customtxt
            hiddenField(fieldToHide, form)
            var tabHtml = '<SCRIPT language="JavaScript" type="text/javascript">';
            tabHtml += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
            tabHtml += 'bindEvent(window, "load", function(){';
            tabHtml += 'function hideTab(){try{' + hiddenTabs(tabToHide) + '}catch(t){console.log(t)}}hideTab();';
            tabHtml += '});';
            tabHtml += '</SCRIPT>';
            form.addField({ id: 'custpage_hidden_tab', label: 'custpage_hidden_tab', type: serverWidget.FieldType.INLINEHTML });
            form.updateDefaultValues({ custpage_hidden_tab: tabHtml });
        }
        function afterSubmit(context) {
            try {
                if (context.type != context.UserEventType.DELETE) {
                    var newRec = context.newRecord;
                    related_customer = newRec.getValue('custentity_related_customer');
                    if (!isNullOrEmpty(related_customer)) {
                        customer_address_id = newRec.getValue('custentity_customer_address_id');
                        if (isNullOrEmpty(customer_address_id)) {
                            var trnType = newRec.type;
                            var trnID = newRec.id;  
                            var rec = record.load({ type: trnType, id: trnID, isDynamic: true, });
                            createAddress(rec, related_customer)
                        }
                    }    
                }
            } catch (e) { }
        }
        function createAddress(rec, related_customer) {
            rec.selectLine({ sublistId: 'addressbook', line: 0 });    
            var addrRec = rec.getCurrentSublistSubrecord({ sublistId: 'addressbook', fieldId: 'addressbookaddress' });
            
            var entityRec = record.load({ type: record.Type.CUSTOMER, id: related_customer, isDynamic: true });       
            entityRec.selectNewLine({ sublistId: 'addressbook' })
            var myAddressSubRecord = entityRec.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            })    
            myAddressSubRecord.setValue({
                fieldId: 'addressee',
                value: addrRec.getValue({ fieldId: 'addressee' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'country',
                value: addrRec.getValue({ fieldId: 'country' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'addr1',
                value: addrRec.getValue({ fieldId: 'addr1' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'addr2',
                value: addrRec.getValue({ fieldId: 'addr2' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'city',
                value: addrRec.getValue({ fieldId: 'city' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'state',
                value: addrRec.getValue({ fieldId: 'state' }),
            })
            myAddressSubRecord.setValue({
                fieldId: 'zip',
                value: addrRec.getValue({ fieldId: 'zip' }),
            })
            var companyname = rec.getValue('companyname')
            entityRec.setCurrentSublistValue({ sublistId: 'addressbook', fieldId: 'label', value: companyname, })
            entityRec.commitLine({
                sublistId: 'addressbook'
            })               
            entityRec.save({ enableSourcing: true, ignoreMandatoryFields: true });
            var entityRec = record.load({ type: record.Type.CUSTOMER, id: related_customer, isDynamic: true });       
            var count = entityRec.getLineCount('addressbook')
            count = count - 1        
            var id = entityRec.getSublistValue('addressbook', 'internalid', count)
            log.debug('custentity_customer_address_id', id);
            rec.setValue('custentity_customer_address_id', id)
            rec.save({ enableSourcing: true, ignoreMandatoryFields: true });
        }
        function isNullOrEmpty(val) {

            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        function hiddenField(list, form) {
            var scriptData = '';
            list = list.split(',');
            for (var i = 0; i < list.length; i++) {
                var field = form.getField({
                    id: list[i]
                });
                if (!isNullOrEmpty(field))
                    //field.setDisplayType('hidden');
                field.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
            }
            var field = form.getField({
                id: 'category'
            }).isMandatory = true
            //name.isMandatory = true;
            return scriptData
        }
        function hiddenTabs(tabToHide) {
            var scriptData = '';
            tabToHide = tabToHide.split(',');
            for (var i = 0; i < tabToHide.length; i++) {
                scriptData += 'document.getElementById("' + tabToHide[i] + '").style.display = "none"; '

            }
            return scriptData
        }
        return {
            beforeLoad: beforeLoad,
            afterSubmit: afterSubmit,
        };
    });