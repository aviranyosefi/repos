<?xml version="1.0" ?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <link name="sans-serif" type="font" subtype="truetype" src="https://system.eu2.netsuite.com/c.4855789/suitebundle149431/Heb-Regular.ttf" />
        <style type="text/css">

            *{
                font-family: sans-serif;
            }
            p.title {
                color: #026f8e;
                width: 100%;
                text-align: center;
                font-size: 24px;
            }
            table {
                font-size: 9pt;
                table-layout: fixed;
                font-family: sans-serif;
            }
            th {
                font-weight: bold;
                font-size: 8pt;
                vertical-align: middle;
                padding: 5px 6px 3px;
                background-color: #e3e3e3;
                color: #333333;
            }
            td {
                padding: 4px 6px;
            }
            td p {
                text-align: left
            }
            hr {
                border-top: 1px dashed #d3d3d3;
                width: 100%;
                color: #ffffff;
                background-color: #ffffff;
                height: 1px;
            }
            .info {
                font-size: 14px;
            }
            div.coc-main-text {
                width: 100%;
                height: 200px;
            }
            .coc-main-text img {
                z-index: 0; 
                position: absolute;
                left: 12%;
                width: 500px;
                height: 159px;
                opacity: 0.7;
            }
            .coc-main-text p {
                width: 100%;
                text-align: left;
                font-size: 14px;             
            }
        </style>
    </head>

    <body padding="0.5in 0.5in 0.5in 0.5in" size="Letter">

        <table class="info">
            <tr><td> Date: ${record.trandate}</td></tr>
            <tr><td> Packing List: #${record.tranid}  </td></tr>
        </table>

        <br/><br/>

        <p class="title"> <b>Certificate Of Conformity</b> </p>

        <br/>

        <div class="coc-main-text">
            <#if printData.watermarkUrl != ''>
                <img src="${printData.watermarkUrl}" style="margin-bottom: 10px;" />
            </#if> 
            <br/><br/>
            <p> ${record.custbody_df_coc_pdf_body} </p>
        </div>

        <br/><br/>

        <table class="info">
            <tr><td> Certified by: ${cocEmployee.entitytitle}<#if cocEmployee.title?has_content>, ${cocEmployee.title} </#if></td></tr>
            <tr><td> 
                <p style="display: inline; vertical-align: top;">Signature:</p> <#if printData.signatureUrl != ''> 
                <img src="${printData.signatureUrl}" style="margin-bottom: 10px; display: inline;"/> <#else> ______________________ </#if> 
            </td></tr>
        </table>

    </body>
</pdf>