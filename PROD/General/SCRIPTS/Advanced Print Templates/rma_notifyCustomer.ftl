<#-- ***********************************************
@Template:	RMA Notify Customer Print
@Author: 	Nadav Julius (BE Suite)
************************************************ -->
<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>

<#function removeLeadingNumbers text>
	<#return text?replace("^([0-9 ])+[ ]", "", "rg")>
</#function>

<#function parseJSON (val)>
	<#local retValue = {}>
	<#if val?? && val?has_content>
		<#local strVal = val?replace(":null", ":\"\"", "ri")?replace("\\\\u[0-9]{4}", "", "ri")>
		<#if strVal?? && strVal?has_content>
			<#local retValue = strVal?eval>
		</#if>
	</#if>
	<#return retValue>
</#function>

<head>
    <link name="sans-serif" type="font" subtype="truetype" src="https://system.eu2.netsuite.com/c.4855789/suitebundle149431/Heb-Regular.ttf" />
    <link name="arial" type="font" subtype="truetype" 
        src="https://5463879-sb1.app.netsuite.com/core/media/media.nl?id=67946&amp;c=5463879_SB1&amp;h=X1vRzUXzpUczAB7C3uJJw6pzP5BE2sBfln5pqPaXX-OWS_cP&amp;_xt=.ttf" 
        src-bold="https://5463879-sb1.app.netsuite.com/core/media/media.nl?id=67947&amp;c=5463879_SB1&amp;h=2ZBYB5t60YaiXjIGJ9uXekUZ0y7MSVPhIhtA51pSMIvSTgVJ&amp;_xt=.ttf"
    />

    <style>
        * {
            font-family: arial, Helvetica, sans-serif;                
        }
        body {
            font-family: arial, Helvetica, sans-serif; 
            font-size: 9pt;
        }
        p {
            padding: 0;
            margin: 5px 0;
        }
        .h1 {
            width: 100%;
            text-align: center;
            font-weight: 800;
            font-size: 18px;
        }
        .h2 {
            width: 100%;
            font-weight: 800;
            color: #0070c0;
            font-size: 11pt;
        }
        .h3 {
            width: 100%;
            font-weight: 800;
            font-size: 10pt;
            text-align: left;
        }
        .standard-table {
            width: 100%;
        }
        .standard-table p {
            width: 100%;
        }
        .grid-table {
            width: 100%;
            border-collapse: collapse;
            border: .5px solid black;
        }
        .grid-table td {
            border: .5px solid black;
        }
        .grid-table td p {
            padding: 2px;
        }
        .red {
            color: red;
            font-size: 8pt;
            font-weight: 800;
        }
        .item-table th {
            font-weight: 800;
            border: .5px solid black;
        }
        .item-table th p {
            padding: 2px;
        }
        .item-total-table {
            width: 100%;
            border-collapse: collapse;
            padding-top: 0;
            margin-top: 0;
        }
        .item-total-table td p {
            padding: 2px;
        }
        .total-cell-first {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            border-left: 1px solid black;
            border-right: 0px solid black;
            background-color: #f1f1f1;
        }
        .total-cell-last {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            border-left: 0px solid black;
            border-right: 1px solid black;
            background-color: #f1f1f1;
        }
        .nine-em-bold {
            font-size: 0.9em; 
            font-weight: bold;
        }
        .total-row {
            width: 100%;
        }
        .total-row td p {
            width: 100%;
            text-align: center;
        }
    </style>
</head>


<body padding="50px 50px 20px 50px" size="A4">

    <#--  <img src="https://5463879-sb2.app.netsuite.com/core/media/media.nl?id=149903&c=5463879_SB2&h=iscxxXTOpqOU24eETw0SXhwhI3xhY3K80BI2ONfXB7aDPIfw" height="531px" width="687px" style="margin: auto;" />

    <pbr/>  -->

    <#if record.custbody_df_nc_custome_instructions != ''>
        <br/>
        <table class="standard-table">
            <tr>
                <td style="width: 100%">
                    <p class="h2">Customer Instruction</p>
                </td>
            </tr>
            <tr>
                <td style="width: 100%"> <p>${record.custbody_df_nc_custome_instructions}</p> </td>
            </tr>
        </table>
    </#if>

    <br/>
    <table class="standard-table">
        <tr>
            <td style="width: 100%">
                <p class="h2">Customer Contact Information</p>
            </td>
        </tr>
    </table>

    <table class="grid-table">
        <tr>
            <td style="width: 50%"><p>RMA Number</p></td>
            <td style="width: 50%"><p>${record.tranid}</p></td>
        </tr>
        <tr>
            <td style="width: 50%"><p>Case Number</p></td>
            <td style="width: 50%"><p>${record.custbody9.casenumber}</p></td>
        </tr>
        <tr>
            <td style="width: 50%"><p>Customer Name</p></td>
            <td style="width: 50%"><p>${removeLeadingNumbers(record.entity?string)}</p></td>
        </tr>
        <tr>
            <td style="width: 50%"><p>Contact Name</p></td>
            <td style="width: 50%"><p>${record.custbody_contact_customer.entityid}</p></td>
        </tr>
        <tr>
            <td style="width: 50%"><p>Contant Phone Number</p></td>
            <td style="width: 50%"><p>${record.custbody_contact_phone_number}</p></td>
        </tr>
        <tr>
            <td style="width: 50%"><p>Contact Email Address</p></td>
            <td style="width: 50%"><p>${record.custbody_contact_address}</p></td>
        </tr>
    </table>

    <br/>
    <#assign total = 0>
    <table class="standard-table">
        <tr>
            <td style="width: 100%">
                <p class="h2">Product Return Information</p>
            </td>
        </tr>
    </table>

    <table class="grid-table item-table">
        <thead>
            <tr>
                <th style="width:  5%"> <p> # </p> </th>
                <th style="width: 15%"> <p> P/N </p> </th>
                <th style="width: 30%"> <p> Description </p> </th>
                <th style="width: 20%"> <p> Serial Number </p> </th>
                <th style="width: 10%"> <p> Quantity </p> </th>
                <th style="width: 10%"> <p> Rate </p> </th>
                <th style="width: 10%"> <p> Amount </p> </th>
            </tr>
        </thead>

        <#list record.item as item>
            <#assign snMap = 'match' + item_index>
            <#assign total = total + item.amount?string("#,##0.00")?number>
            <tr>
                <td style="width:  5%"> <p> ${item_index + 1} </p> </td>
                <td style="width: 15%"> <p> ${item.custcol_item_number} </p> </td>
                <td style="width: 30%"> <p>${item.description}</p> </td>
                <td style="width: 20%"> <p>${itemToSerialsMap[snMap]}</p></td>
                <td style="width: 10%"> <p>${item.quantity}</p> </td>
                <td style="width: 10%"> <p>${item.rate}</p> </td>
                <td style="width: 10%"> <p>${item.amount}</p> </td>
            </tr>
        </#list>
    </table>

    <br/>
    <table class="item-total-table">
        <tr class="total-row" style="margin-bottom: 8px;">
            <td style="width:  5%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 15%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 30%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 20%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 2%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 14%" class="total-cell-first"> <p class="nine-em-bold">Total Value:</p> </td>
            <td style="width: 14%" class="total-cell-last"> <p class="nine-em-bold"> ${total?string("#,##0.00")} </p> </td>
        </tr>
        <tr class="total-row">
            <td style="width:  5%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 15%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 30%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 20%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 2%"> <p>&nbsp;&nbsp;</p> </td>
            <td style="width: 14%" class="total-cell-first"> <p class="nine-em-bold">Total Price:</p> </td>
            <td style="width: 14%" class="total-cell-last"> <p class="nine-em-bold"> <#if record.custbody_to_be_charged == 'Yes'> ${total?string("#,##0.00")} <#else> 0.00 </#if> </p> </td>
        </tr>
    </table>

    <#--  <#if record.custbody_to_be_charged != '1'> <p class='red'>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ??? legally needs to be defined</p> </#if>  -->

    <br/>
    <table class="standard-table">
        <tr>
            <td style="width: 100%">
                <p class="h2">Reason for RMA</p>
            </td>
        </tr>
        <tr>
            <td style="width: 100%">
                <#if case.custevent_reason_for_rma != 'Other'> <#-- case.custevent_reason_for_rma != '' &&  -->
                    <p>${case.custevent_reason_for_rma}</p>
                <#else>
                    <p>${case.custevent_reason_for_rma_comment}</p>
                </#if>
            </td>
        </tr>
        <#--  <tr>
            <td style="width: 100%" class="red">
                <p>Please verify you provide the entire information. Missing information might delay processing of your RMA.</p>
                <p>Please provide the commercial invoice BEFORE shipping the unit back</p>
            </td>
        </tr>  -->
    </table>

    <br/>
    <table class="standard-table">
        <tr>
            <td style="width: 100%">
                <p class="h2">Delivery Information</p>
            </td>
        </tr>
        <tr>
            <td style="width: 100%">
                <p>${location.mainaddress_text}</p>
                <p>support@d-fendsolutions.com</p>
            </td>
        </tr>
    </table>
    
    <br/>
    <ul>
        <li><p class="h3">Please provide the commercial invoice BEFORE shipping the unit back.</p></li>
        <#if record.custbody_enable_advance_replacement == 'Yes'>
            <li><p class="h3">You are required to ship back the defective unit within 5 business days of receiving the advanced replacement unit.</p></li>
        <#else>
            <li><p class="h3">The RMA will remain open for 30 business days upon this email in which you should ship back the defective unit to D-fend Hardware repair center. If the defective unit will not be shipped within 30 business days, RMA will be cancelled.</p></li>
        </#if>
        <li><p class="h3">D-fend will not be responsible for any delays related to flights schedules.</p></li>
        <li><p class="h3">Equipment should be packed in its Original Packaging or any other suitable packaging for shipment </p></li>
    </ul>

</body>
</pdf>