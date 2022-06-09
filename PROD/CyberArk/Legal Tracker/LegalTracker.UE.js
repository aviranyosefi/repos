/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define([],
    function () {
        function beforeLoad(context) {
            var rec = context.newRecord;
            var bill = rec.getValue('custrecord_lt_bill')
            if (isNullOrEmpty(bill)) {
                context.form.clientScriptModulePath = 'SuiteScripts/CyberArk/Dev/LegalTracker.CS.js';
                var divhtml = "<div><b>Processing.....</b></div>";
                var style = "left: 25%; top: 25%; z-index: 10001; position:absolute;width:620px;height:40px;line-height:1.5em;cursor:pointer;margin:5px;list-style-type: none;font-size:12px; padding:5px; background-color:#FFF; border: 2px solid gray;border-radius:10px;";
                var stylebg = "position: absolute; z-index: 10000; top: 0px; left: 0px; height: 100%; width: 100%; margin: 5px 0px; background-color: rgb(204, 204, 204); opacity: 0.6;";
                var function_click = "debuuger; var bgdiv=document.createElement('div'); bgdiv.id='bgdiv'; bgdiv.onclick=bgdiv.style.display = 'none'; bgdiv.style.cssText='" + stylebg + "';var loadingdiv=document.createElement('div');loadingdiv.id='loadingdiv'; loadingdiv.innerHTML='" + divhtml + "'; loadingdiv.style.cssText='" + style + "'; document.body.appendChild(loadingdiv);document.body.appendChild(bgdiv);setTimeout(mod.redirectr(),200)";
              
                context.form.addButton({
                    id: "custpage_setTask",
                    label: "Genarate Bill",
                    functionName: function_click
                });
            }
         
        }
        function isNullOrEmpty(val) {
            if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
                return true;
            }
            return false;
        }
        return {
            beforeLoad: beforeLoad,

        };
    });
