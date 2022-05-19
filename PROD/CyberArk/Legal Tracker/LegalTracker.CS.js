/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/url", "N/https", 'N/currentRecord'], function (url, https, currentRecord) {
    function pageInit(context) { }

    function redirect(recId) {
        var rec = currentRecord.get();
        recId = rec.id
        var output = url.resolveScript({
            scriptId: "customscript_legaltrackersu",
            deploymentId: "customdeploy_legaltrackersu"
        });
        output += '&errorLodId=' + recId;
        log.debug('url', output);

        var response = https.get({
            url: output
        });

        log.debug('response', response);
    }

    return {
        pageInit: pageInit,
        redirect: redirect
    };
});