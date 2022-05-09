/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([
        'N/email',
        'N/error',
        'N/file',
        'N/https',
        'N/log',
        'N/redirect',
        'N/render',
        'N/search',
        'N/record',
],
/**
 * @param {email} email
 * @param {error} error
 * @param {file} file
 * @param {https} https
 * @param {log} log
 * @param {redirect} redirect
 * @param {render} render
 * @param {search} search
 */
function (email, error, file, https, logger, redirect, render, search, record) {

    function onRequest(context) {
        var request = context.request;
        try {
            if (request.method == "GET") {
            }
            else {
                var fileContent = request.body;

                var tranid = request.parameters['tranid'];
                /*
        		context.response.write(params.folderName);
        		return;
        		*/
                var folderId = 3120;
                //PNGfile
                var SIGNfILE = file.create({
                    name: 'signed_' + tranid + '.png',
                    fileType: file.Type.PNGIMAGE,
                    contents: fileContent,
                    folder: folderId,
                    isOnline: true
                });
                var fileId = SIGNfILE.save();
                record.submitFields({
                    "type": record.Type.SUPPORT_CASE,
                    "id": tranid,
                    "values": {
                        "custevent_img_sign": fileId
                    }
                });
            }
        }
        catch (err) {
            context.response.write(err);
        }
        //context.response.write("Signiture was saved");
    }

    return {
        onRequest: onRequest
    };

});
