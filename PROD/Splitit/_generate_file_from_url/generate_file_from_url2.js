/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define(['N/record', 'N/https', 'N/file'],
    function (record, https, file ) {
        function createPhoneCall(context)
      
        {
            var url = "https://splitit-systememails-archive.s3.amazonaws.com/MonthlyStatement_%20DONT%20USE%20Famous%20Design_1_2020.xlsx?AWSAccessKeyId=AKIA5RGSP3TMNAB5AWYG&Expires=1583057995&Signature=2eBr7bHolmBXNAHVVgx9aSFDido%3D";
            var csvContent = https.get({ url: url });
            var actualContent = csvContent.body;

            var fileObj = file.create({
                name: "UploadCSVImport.csv",
                fileType: file.Type.CSV,
                contents: actualContent,
                folder: 6560, // your folder id on file cabinet
                isOnline: false
            });
            var id = fileObj.save();
        }
        return {
            afterSubmit: createPhoneCall
        };
    });