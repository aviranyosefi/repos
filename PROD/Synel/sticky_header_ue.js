/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope Public
 */
define(['N/ui/serverWidget'],

    function (serverWidget) {
        function beforeLoad(context) {
            context.form.addField({
                id: 'custpage_stickyheaders_script',
                label: 'Hidden',
                type: serverWidget.FieldType.INLINEHTML
            }).defaultValue = '<script>(function($){$(function($, undefined){$(".uir-machine-table-container").css("max-height", "70vh").bind("scroll", (event) => {$(event.target).find(".uir-machine-headerrow > td,.uir-list-headerrow > td").css({"transform": `translate(0, ${event.target.scrollTop}px)`,"z-index": "9999","position": "relative"});}).bind("scroll", (event) => {$(".machineButtonRow > table").css("transform", `translate(${event.target.scrollLeft}px)`);});});})(jQuery);</script>';
        }
        return {
            beforeLoad: beforeLoad
        };
    });