var additionalParams = {
    includeImages: false
};

var printHandler = url.resolveScript({
    scriptId: 'customscript_be_sl_proxy_adm',
    deploymentId: 'customdeploy_be_sl_proxy_printer',
    returnExternalUrl: false,
    params: { isInline: 'T', printType: recType + '_printkittinglist', recId: rec.id, additionalParams: JSON.stringify(additionalParams) }
});

form.addButton({
    id: 'custpage_print_kitting_list_btn',
    label: 'Print Kitting List',
    functionName: "(function() {" +
        "window.open('" + printHandler + "')" +
        "})"
});