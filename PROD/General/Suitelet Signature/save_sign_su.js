/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/email','N/error','N/file','N/https','N/log','N/redirect','N/render','N/search','N/record','N/ui/serverWidget'],
    function (email, error, file, https, logger, redirect, render, search, record, serverWidget) {

    function onRequest(context) {
        var request = context.request;
        try {
            if (request.method == "GET") {
                var form = serverWidget.createForm({
                    title: 'New Vendor Form - Login'
                });

                var xmlTmplFile = file.load('Templates/PDF Templates/signaturepad.html');
                var html = xmlTmplFile.getContents()
                form.addField({
                    id: 'custpage_html',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'html',
                    container: 'general'
                }).defaultValue = html;

                context.response.writePage(form);
            
            }
            else {
                var fileContent = request.body;

                var tranid = 'asdfsdf' //request.parameters['tranid'];
                /*
        		context.response.write(params.folderName);
        		return;
        		*/
                var folderId = -12;
                //PNGfile
                var SIGNfILE = file.create({
                    name: 'signed_' + tranid + '.png',
                    fileType: file.Type.PNGIMAGE,
                    contents: fileContent,
                    folder: folderId,
                    isOnline: true
                });
                var fileId = SIGNfILE.save();
                //record.submitFields({
                //    "type": record.Type.SUPPORT_CASE,
                //    "id": tranid,
                //    "values": {
                //        "custevent_img_sign": fileId
                //    }
                //});
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
