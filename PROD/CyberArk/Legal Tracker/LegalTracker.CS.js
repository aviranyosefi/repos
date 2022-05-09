/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/url", "N/https"], function (url, https) {
    function pageInit(context) { }

    function redirect() {
        var output = url.resolveScript({
            scriptId: "customscript_legaltrackersu",
            deploymentId: "customdeploy_legaltrackersu"
        });

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