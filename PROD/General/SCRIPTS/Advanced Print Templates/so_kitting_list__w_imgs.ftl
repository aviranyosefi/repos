<!--?xml version="1.0" ?-->
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <!-- Function -->
    <#function isTrue val>
        <#local stringBoolValue = "F">
        <#if val?has_content && (val?string == "Yes" || val?string == "T")>
            <#local stringBoolValue = "T">
        </#if>
        <#return stringBoolValue == "T">
    </#function>

    <#function resolveXmlAmpersand val>
    	<#return val?replace("&", "&amp;", "r")>
    </#function>

    <#function toNumber val>
    	<#if val?? && val?has_content>
    		<#if val?is_number>
    			<#return val>
    		</#if>
    		<#return (val?replace("[^0-9.]", "", "r"))?number>
    	</#if>
    	<#return 0>
    </#function>

    <#function replaceSyntax text>
    	<#local 
    		foundList = text?matches("\\{@[a-z0-9_.]*\\}", "r")
    		retValue = text
    	>
    
    	<#list foundList as x>
    		<#local 
    			expr = x?replace("\\{|\\}|@", "", "r")
    			replaceVal = expr?eval
    			retValue = retValue?replace("\\{@"+expr +"\\}", replaceVal, "r")
    		>
    	</#list>
    	<#return retValue>
    </#function>

    <#function isHtmlLongText text>
    	<#local htmlTags = text?matches("(<[/ ]*table>)|(<[/ ]*tr>)|(<[/ ]*td>)", "ri")>
    	<#return (htmlTags?size > 0)>
    </#function>

    <#function resolveHtmlTags text>
    	<#local	retValue = text?replace("<"?html, "<", "ri")?replace(">"?html, ">", "r")>
    	<#if isHtmlLongText(retValue)>
    		<#local	retValue = retValue?replace("<br[/ ]*>", "", "r")>
    	</#if>
    	<#return retValue>
    </#function>

    <#function removeLeadingNumbers text>
    	<#return text?replace("^([0-9 ])+[ ]", "", "rg")>
    </#function>
    <!-- End Functions -->
    <head>
        <link name="sans-serif" type="font" subtype="truetype" src="https://system.eu2.netsuite.com/c.4855789/suitebundle149431/Heb-Regular.ttf" />
        <link name="arial" type="font" subtype="truetype" 
            src="https://5463879-sb1.app.netsuite.com/core/media/media.nl?id=67946&amp;c=5463879_SB1&amp;h=X1vRzUXzpUczAB7C3uJJw6pzP5BE2sBfln5pqPaXX-OWS_cP&amp;_xt=.ttf" 
            src-bold="https://5463879-sb1.app.netsuite.com/core/media/media.nl?id=67947&amp;c=5463879_SB1&amp;h=2ZBYB5t60YaiXjIGJ9uXekUZ0y7MSVPhIhtA51pSMIvSTgVJ&amp;_xt=.ttf"
        />
        <style type="text/css">
            * {
                font-family: arial, Helvetica, sans-serif;                
            }

            p {
                font-size: 9pt;
                padding: 2px;
                margin: 0px;
            }

            table {
                margin-top: 10px;
                font-size: 9pt;
                table-layout: fixed;
                width: 100%;
            }

            th {
                font-size: 9pt;
                vertical-align: middle;
                text-align: center;
                padding-top: 5px;
                padding-right: 6px;
                padding-left: 6px;
                padding-bottom: 3px;
                color: #333333;
            }

            td {
                padding-bottom: 4px;
                padding-top: 4px;
                padding-right: 6px;
                padding-left: 6px;
                text-overflow: ellipsis;
                word-wrap: break-word;
                vertical-align: middle;
            }

            table.headertable th {
                background-color: #d3d3d3;
                color: #555;
                white-space: nowrap;
                border: 1px solid #686666;
                font-size: 9pt;
                padding-left: 5px;
            }

            table.headertable td {
                background-color: #fff;
                color: #555;
                white-space: nowrap;
                border: 1px solid #686666;
                font-size: 9pt;
                padding-left: 5px;
            }

            table.body td {
                padding-top: 2px;
            }

            table.linetb {
                border: 1px solid #bdd1e2;
                table-layout: fixed;
                border-collapse: collapse;
            }

            table.header td {
                font-size: 9pt;
                padding: 0px;
            }
			
            td.header_content {
            	padding-left : 15px;
            }
          
            table.header {
                color: #333;
                padding: 3px;
                /*background-color: #eeeeee;*/ /*#deedfa;*/
                width: 100%;
            }

            table.footer td {
                font-size: 9pt;
                padding: 0px;
            }

            table.linetb th {
                background-color: #6080b9;
                border: 1px solid #bdd1e2;
                color: #fff;
                padding-bottom: 10px;
                padding-top: 10px;
                font-weight:bold;
                font-size: 10pt;
            }

            table.linetb td {
                border: 1px solid #bdd1e2;
                background-color: #eeeeee;
                text-overflow: ellipsis;
                word-wrap: break-word;
            }

            table.linetb tr:nth-child(even) td {
                background-color: #eeeeee;
            }

            table.linetb tr:nth-child(odd) td {
                background-color: #eeeeee; /*#deedfa;*/
            }

            td.default {
                font-size: 9pt;
                padding-top: 0px;
                padding-bottom: 0px;
            }

            hr {
                height: 1px;
                width: 100%;
                color: #d3d3d3;
                background-color: #d3d3d3;
            }
        </style>

        <macrolist>
            <macro id="nlheader">

                <table border="0" cellpadding="0" class="header">                   
                    <tr>
                        <td width="40%" align="left">
                            <#if companyInformation.logoUrl?length !=0><img src="${companyInformation.logoUrl}" style="margin-bottom: 10px;" /> </#if>
                            <p style="color:#00aaff;">
                                13th Zarhin st., Bldg. A, 6th floor <br />
                                Raanana 4366241 <br />
                                PO box: 2619 <br />
                                Israel <br />
                                Tax Reg No : ${companyInformation.employerid}
                            </p>
                        </td>
                        <td width="5%"></td>
                        <td width="55%">
                            <h1 align="center" > <p style="font-size: 30px;">Kitting List</p> </h1>
                            <table class="headertable">
                                <tr><th> SO No. </th><td> ${record.tranid} </td></tr>
                                <tr><th> Delivery # </th><td> ${record.custbody_df_delivery_num_for_print_txt} </td></tr>
                                <tr><th> Date </th><td> ${printData.committedDate} </td></tr>
                                <tr><th> Customer </th><td> ${record.entityname} </td></tr>
                            </table>
                        </td>
                    </tr>
                </table>

            </macro>
        </macrolist>

        <macrolist>
            <macro id="nlfooter">
                <p align="center" style="height: 100%; vertical-align: middle;"> <pagenumber/> of <totalpages/> </p>
            </macro>
        </macrolist>

    </head>

    <body padding="0.2in 0.5in 0.1in 0.5in" size="A4" header="nlheader" header-height="20%" footer="nlfooter" footer-height="3%">

        <table class="linetb">
            
            <thead>
                <tr>
                    <th width="7%"> # </th>
                    <th width="18%"> P/N </th>
                    <th width="40%"> Description </th>
                    <th width="7%"> QTY </th>
                    <th width="15%" align="center"> Part of Kit </th>
                    <th width="13%"> Comments </th>
                </tr>
            </thead>

            <#assign lineIdx = 1>
                
            <#list printData.kittingList as item>
                
                <tr>
                    <td width="7%"> ${lineIdx} </td>
                    <td width="18%"> <p style="font-weight: 700;"> ${item.name} </p> </td>
                    <td width="40%"> <p>${item.description}</p> </td>
                    <td width="7%"> <p>${item.qty}</p> </td>
                    <td width="15%" align="center"> </td>
                    <td width="13%"> </td>
                </tr>

                <#assign lineIdx++>

                <#list item.members as member>          

                    <tr>
                        <td width="7%"> ${lineIdx} </td>
                        <td width="18%"> <p>${member.name}</p> </td>
                        <td width="40%"> <p>${member.description}</p> </td>
                        <td width="7%"> <p> ${member.qty?number * item.qty?number} </p> </td>
                        <td width="15%" align="center"> <p>${item.name}</p> </td>
                        <td width="13%"> </td>
                    </tr>

                    <#assign lineIdx++>

                </#list> 

            </#list> 
            
        </table>


        <#if printData.hasImgs == 'true'>
            <pbr/>
            <p style="font-size: 22px; width: 100%; text-align: center;"><b>Image Apendix</b></p>
            <hr/>
            <table> 
                <tr>
                <#list printData.imgData as itemImg>
                    <#if (itemImg_index % 3) == 0 && itemImg_index != 0>
                        </tr>
                        <tr>
                            <td style="margin: 5px;"> 
                                <p style="font-size: 14px;"><b>Item: ${itemImg.itemid}</b></p> 
                                <img src="${itemImg.imgUrl}" height="175px" width="175px" style="border: 1.5px solid black;" />
                            </td>
                    <#else>
                            <td style="margin: 5px;"> 
                                <p style="font-size: 14px;"><b>Item: ${itemImg.itemid}</b></p> 
                                <img src="${itemImg.imgUrl}" height="175px" width="175px" style="border: 1.5px solid black;" />
                            </td>
                    </#if>
                </#list>
                </tr>
            </table>
        </#if>

    </body>
</pdf>
