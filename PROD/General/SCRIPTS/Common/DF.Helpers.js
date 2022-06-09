/**
 * Helpers
 * @NApiVersion 2.x
 * @NModuleScope public
 */
define([
  "require",
  "N/log",
  "N/runtime",
  "N/record",
  "N/error",
  "N/search",
  "N/render",
  "N/format",
  "N/file",
  "N/email",
  "./BE.Lib.Common",
], function (
  require,
  logger,
  runtime,
  record,
  error,
  search,
  render,
  format,
  file,
  email,
  common
) {
  "use strict";

  function sapir() { }

  function validateAccDeptCombination(accountId, departmentId) {
    var res = {
      isUnique: true,
      usrMsg: "",
    };

    search
      .create({
        type: "customrecord_df_account_mapping",
        filters: [
          ["custrecord_df_mapping_account", "anyof", accountId],
          "AND",
          ["custrecord_df_mapping_department", "anyof", departmentId],
        ],
        columns: [
          "custrecord_df_mapping_account",
          "custrecord_df_mapping_department",
          "custrecord_df_mapping_category",
          "internalid",
        ],
      })
      .run()
      .each(function (result) {
        res.isUnique = false;

        res.usrMsg =
          "This account and department combination already exists on a Account Mapping record with a internal ID of " +
          result.getValue({ name: "internalid" }) +
          " and a Category of " +
          result.getText({ name: "custrecord_df_mapping_category" });

        return true;
      });

    return res;
  }

  function getPlugTypesFromCountry(geoCountry, pageMode, recId) {
    var plugTypes = null;

    var filters = [["custrecord_ptpc_country", "anyof", geoCountry]];

    if (pageMode == "edit") {
      filters.push("AND");
      filters.push(["internalid", "noneof", recId]);
    }

    search
      .create({
        type: "customrecord_plug_type_per_country",
        filters: filters,
        columns: ["custrecord_ptpc_plug_type"],
      })
      .run()
      .each(function (result) {
        plugTypes = result.getValue({ name: "custrecord_ptpc_plug_type" });

        return true;
      });

    return plugTypes;
  }

  function validateCountry(country, pageMode, recId) {
    var res = {
      dialogTitle: "",
      dialogDescription: "",
      isValid: false,
      plugTypes: [],
    };

    var filters = [["custrecord_ptpc_country", "anyof", country]];

    if (pageMode == "edit") {
      filters.push("AND");
      filters.push(["internalid", "noneof", recId]);
    }

    var plugTypesSearch = search.create({
      type: "customrecord_plug_type_per_country",
      filters: filters,
      columns: ["custrecord_ptpc_plug_type"],
    });

    var plugTypesSearchCount = plugTypesSearch.runPaged().count;
    if (plugTypesSearchCount == 0) {
      res.isValid = true;
    } else if (plugTypesSearchCount == 1) {
      res.dialogTitle = "Country already exists";
      res.dialogDescription =
        "The country you are trying to add is already has a record! Each country can only have one refrance.";
      res.isValid = false;
    } else {
      logger.error({
        title: "ERROR!",
        details:
          "The country " +
          country +
          " has more then one result! pleas check it before trying again",
      });
      res.dialogTitle = "Country already exists";
      res.dialogDescription =
        "The country you are trying to add is already has a record! Each country can only have one refrance";
      res.isValid = false;
    }

    return res;
  }

  function notifyCustomerRMA(recId) {
    var xmlTmplFile = file.load(
      "../Advanced Print Templates/rma_notifyCustomer.ftl"
    );
    var renderer = render.create();
    renderer.templateContent = xmlTmplFile
      .getContents()
      .replace(/html/g, "pdf"); //hacky replace;

    var rmaRec = record.load({
      type: record.Type.RETURN_AUTHORIZATION,
      id: recId,
    });

    var itemToSerialsMap = {};

    var lineCount = rmaRec.getLineCount({ sublistId: "item" });

    for (var i = 0; i < lineCount; i++) {
      var itemId = rmaRec.getSublistValue({
        sublistId: "item",
        fieldId: "item",
        line: i,
      });
      // var itemNumber = rmaRec.getSublistValue({ sublistId: 'item', fieldId: 'custcol_item_number', line: i })

      var invDetSubRec = rmaRec.getSublistSubrecord({
        sublistId: "item",
        fieldId: "inventorydetail",
        line: i,
      });
      var invDetLineCount = 0;
      if (!common.isNullOrEmpty(invDetSubRec)) {
        invDetLineCount = invDetSubRec.getLineCount({
          sublistId: "inventoryassignment",
        });
      }

      if (invDetLineCount > 0) {
        itemToSerialsMap["match" + i] = [];

        for (var j = 0; j < invDetLineCount; j++) {
          itemToSerialsMap["match" + i].push(
            invDetSubRec.getSublistValue({
              sublistId: "inventoryassignment",
              fieldId: "receiptinventorynumber",
              line: j,
            }) ||
            invDetSubRec.getSublistValue({
              sublistId: "inventoryassignment",
              fieldId: "issueinventorynumber",
              line: j,
            })
          );
        }
        itemToSerialsMap["match" + i] =
          itemToSerialsMap["match" + i].join(", ");
      }
    }

    if (!_objIsEmpty(itemToSerialsMap)) {
      renderer.addCustomDataSource({
        format: render.DataSource.JSON,
        alias: "itemToSerialsMap",
        data: JSON.stringify(itemToSerialsMap),
      });
    }

    var caseId = rmaRec.getValue({ fieldId: "custbody9" });
    if (!common.isNullOrEmpty(caseId)) {
      var caseRec = record.load({
        type: record.Type.SUPPORT_CASE,
        id: caseId,
      });
      renderer.addRecord("case", caseRec);
    }

    var locationId = rmaRec.getValue({ fieldId: "location" });
    if (!common.isNullOrEmpty(locationId)) {
      var locationRec = record.load({
        type: record.Type.LOCATION,
        id: locationId,
      });
      renderer.addRecord("location", locationRec);
    }

    renderer.addRecord("record", rmaRec);

    var notifyCustomerForm = render.xmlToPdf({
      xmlString: _resolveXmlAmpersand(renderer.renderAsString()),
    });

    var pdfFile = file.load("../Advanced Print Templates/rmaFormFirstPage.pdf");

    var rma_notify_customer_content = [
      '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">',
      "<pdfset>",
      '<pdf src="data:application/pdf;base64,' + pdfFile.getContents() + '" />',
      '<pdf src="data:application/pdf;base64,' +
      notifyCustomerForm.getContents() +
      '" />',
      "</pdfset>",
    ].join("");
    var renderedFile = render.xmlToPdf({
      xmlString: _resolveXmlAmpersand(rma_notify_customer_content),
    });

    var contactEmail = rmaRec.getValue({ fieldId: "custbody_contact_address" });
    var contactId = rmaRec.getValue({ fieldId: "custbody_contact_customer" });
    var emailSubject = rmaRec.getValue({
      fieldId: "custbody_df_nc_email_subject",
    });
    var emailBody = rmaRec.getValue({ fieldId: "custbody_df_nc_email_body" });

    email.send({
      author: "153784",
      recipients: contactEmail,
      subject: emailSubject,
      body: emailBody,
      attachments: [renderedFile],
      isInternalOnly: false,
      relatedRecords: {
        entityId: contactId,
        transactionId: recId,
      },
    });
    return true;
  }

  /*Date:'20/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1203', Desc: ''*/
  function checkRmaQuantityVsReturned(itemsData, createdFrom, rmaId) {
    var createdFromType = search.lookupFields({
      type: "transaction",
      id: createdFrom,
      columns: ["recordtype"],
    }).recordtype;

    if (createdFromType == "salesorder") {
      var approvedAdvReplacementSO = search.lookupFields({
        type: "transaction",
        id: createdFrom,
        columns: ["custbody_df_approve_advance_replacemen"],
      }).custbody_df_approve_advance_replacemen;

      var enableAdvReplacementRMA = search.lookupFields({
        type: "transaction",
        id: rmaId,
        columns: ["custbody_enable_advance_replacement"],
      }).custbody_enable_advance_replacement;

      if (!approvedAdvReplacementSO && enableAdvReplacementRMA[0].value == 1) {
        var rmaLineData = {};
        search
          .create({
            type: "returnauthorization",
            filters: [
              ["type", "anyof", "RtnAuth"],
              "AND",
              ["internalid", "anyof", rmaId],
              "AND",
              ["mainline", "is", "F"],
              "AND",
              ["taxline", "is", "F"],
            ],
            columns: ["lineuniquekey", "item", "quantityshiprecv"],
          })
          .run()
          .each(function (result) {
            var lineUniqueKey = result.getValue({ name: "lineuniquekey" });
            var item = result.getValue({ name: "item" });
            var quantityShiprecv = result.getValue({
              name: "quantityshiprecv",
            });
            rmaLineData[lineUniqueKey] = {
              item: item,
              returned: quantityShiprecv,
            };
            return true;
          });

        for (var lineKey in rmaLineData) {
          if (itemsData.hasOwnProperty(lineKey)) {
            if (itemsData[lineKey].quantity > rmaLineData[lineKey].returned) {
              return false;
            }
          }
        }
      }
      return true;
    }
  }

  /*Date:'31/3/2022' ,Editor: 'Stav Shlomovich', Task: 'DR1203', Desc: ''*/
  function setWarrantyAndSerialNumInIF(createdFrom) {
    var createdFromType = search.lookupFields({
      type: "transaction",
      id: createdFrom,
      columns: ["recordtype"],
    }).recordtype;

    if (createdFromType == "salesorder") {
      var soLineData = {};
      search
        .create({
          type: "salesorder",
          filters: [
            ["type", "anyof", "SalesOrd"],
            "AND",
            ["internalid", "anyof", createdFrom],
            "AND",
            ["mainline", "is", "F"],
            "AND",
            ["taxline", "is", "F"],
          ],
          columns: [
            "custcol_df_serial_number",
            "custcol_warranty_expiration_date",
            "custcol_df_rma_line_unique_key",
          ],
        })
        .run()
        .each(function (result) {
          var rmaLineUniqueKey = result.getValue({
            name: "custcol_df_rma_line_unique_key",
          });
          var sn = result.getValue({ name: "custcol_df_serial_number" });
          var warrantyExpDate = result.getValue({
            name: "custcol_warranty_expiration_date",
          });
          soLineData[rmaLineUniqueKey] = {
            sn: sn,
            warrantyExpDate: warrantyExpDate,
          };
          return true;
        });

      return soLineData;
    }
  }

  function getWarranttyExpirationDate(itemId, sn) {
    var warranttyExpirationDate = "";
    search
      .create({
        type: "customrecord_serial_detail_information",
        filters: [
          ["custrecord_sd_serial_number", "is", sn],
          "AND",
          ["custrecord_sd_item", "anyof", itemId],
        ],
        columns: ["custrecord_warranty_expiration_date"],
      })
      .run()
      .each(function (result) {
        warranttyExpirationDate = result.getValue({
          name: "custrecord_warranty_expiration_date",
        });
        return true;
      });

    return warranttyExpirationDate;
  }

  function getItemReceiptsQuantitySum(itemId, poInternalId, orderLine, ibrIds) {
    /*** Date:'01-05-2022', Editor: 'Nadav Julius', Task: 'DR1228', Desc: '' ***/
    var ibrIdsArr = ibrIds.split("\u0005");

    var outgoingObj = {
      status: "success",
      data: 0,
      msg: "no receipts were selected",
    };

    if (
      !common.isNullOrEmpty(itemId) &&
      !common.isNullOrEmpty(poInternalId) &&
      !common.isNullOrEmpty(orderLine) &&
      !common.isNullOrEmpty(ibrIds)
    ) {
      var transactionSearchObj = search.create({
        type: "transaction",
        filters: [
          ["applyingtransaction.internalid", "anyof", ibrIdsArr],
          "AND",
          ["internalid", "anyof", poInternalId],
          "AND",
          ["mainline", "is", "F"],
          "AND",
          ["applyingtransaction.type", "anyof", "ItemRcpt"],
          "AND",
          ["line", "equalto", orderLine],
          "AND",
          ["applyingtransaction.item", "anyof", itemId],
        ],
        columns: [
          search.createColumn({
            name: "quantity",
            join: "applyingTransaction",
          }),
        ],
      });

      var searchResultCount = transactionSearchObj.runPaged().count;

      if (searchResultCount == 0) {
        outgoingObj.status = "failed";
        outgoingObj.msg = "No receipts found when searching for " + rcptIdArr;
      } else {
        transactionSearchObj.run().each(function (result) {
          outgoingObj.data += Number(
            result.getValue({ name: "quantity", join: "applyingTransaction" })
          );

          return true;
        });

        if (outgoingObj.status == "success") {
          outgoingObj.msg =
            "Selected receipts quantity count has been successfully counted";
        } else if (outgoingObj.status == "failed") {
          outgoingObj.msg = "ERROR: " + outgoingObj.msg;
        }
      }
    }

    return outgoingObj;
  }

  /*** Date:'19-05-2022', Editor: 'Nadav Julius', Task: 'DR1241', Desc: 'Prevent "Do Not Purchase" Items' ***/
  function checkForDontPurchaseFlag(itemId) {
    var dontPurchase = false;

    search
      .create({
        type: "item",
        filters: [["internalid", "anyof", itemId]],
        columns: ["custitem_df_item_do_not_purchase"],
      })
      .run()
      .each(function (result) {
        var itemDontPurchaseTxt = result.getText({
          name: "custitem_df_item_do_not_purchase",
        });
        if (
          !common.isNullOrEmpty(itemDontPurchaseTxt) &&
          itemDontPurchaseTxt.toLowerCase() == "yes"
        ) {
          dontPurchase = true;
        }
        return true;
      });

    return dontPurchase;
  }

  function _resolveXmlAmpersand(content) {
    return content
      ? content.replace(
        new RegExp(/&(?!(?:apos|quot|[gl]t|amp|nbsp);|\\#)/g),
        "&amp;"
      )
      : "";
  }

  function _objIsEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
  }

  /*** Date:'31-05-2022', Editor: 'Sapir Heletz', Task: 'DR1253', Desc: '' ***/
  function checkItemType(itemId) {
    var outgoingType = null;

    var itemSearchObj = search.create({
      type: "item",
      filters: [["internalid", "anyof", itemId]],
      columns: ["type"],
    });

    itemSearchObj.run().each(function (result) {
      var currType = result.getValue({ name: "type" }); // Extract value from search
      //var currTypeTxt = result.getText({ name: "type" }); // Extract textual value from search
      if (true) {
        outgoingType = currType;
      }
      return true;
    });

    return outgoingType;
  }

  function avgCostByLocation(itemId, location) {
    var outgoingAvgCost = null;

    var itemSearchObj = search.create({
      type: "item",
      filters: [
        ["internalid", "anyof", itemId],
        "AND",
        ["inventorylocation", "anyof", location],
      ],
      columns: [
        "type",
        "averagecost",
        "locationaveragecost",
        "inventorylocation",
      ],
    });

    itemSearchObj.run().each(function (result) {
      var currAvgCost = result.getValue({ name: "locationaveragecost" });
      if (!common.isNullOrEmpty(currAvgCost)) {
        outgoingAvgCost = currAvgCost;
      }
      return true;
    });

    return outgoingAvgCost;
  }

  function memberItemsCost(itemId) {
    var kitAvgCost = 0;
    var kitQty = 0;

    var kititemSearchObj = search.create({
      type: "kititem",
      filters: [
        ["type", "anyof", "Kit"],
        "AND",
        ["internalid", "anyof", itemId],
      ],
      columns: [
        search.createColumn({
          name: "itemid",
          sort: search.Sort.ASC,
        }),
        "memberitem",
        search.createColumn({
          name: "averagecost",
          join: "memberItem",
        }),
        "memberquantity",
        search.createColumn({
          name: "formulanumeric",
          formula: "{memberitem.averagecost}*{memberquantity}",
        }),
      ],
    });

    kititemSearchObj.run().each(function (result) {
      var currAvgCost = result.getValue({
        name: "formulanumeric",
        formula: "{memberitem.averagecost}*{memberquantity}",
      });
      var currQty = result.getValue({ name: "memberquantity" });

      if (!common.isNullOrEmpty(currAvgCost)) {
        kitAvgCost += Number(currAvgCost);
        kitQty += Number(currQty);
      } else {
        // need to ask itay
      }
      return true;
    });

    return (kitAvgCost == 0 || kitQty == 0) ? null : kitAvgCost / kitQty;
  }

  function calculationCustomPrice(itemId, location) {
    var itemAvgCost = 0;
    var itemType = null;

    //  check the item type
    var findType = search.lookupFields({
      type: 'item',
      id: itemId,
      columns: ['type']
    }).type;

    itemType = findType[0].value;

    if (itemType == "Kit") {
      //  If the item type is kit so get the avg cost of all the componenets
      itemAvgCost = memberItemsCost(itemId);
    } else {
      //  If the item type is NOT kit so get the avg cost
      itemAvgCost = avgCostByLocation(itemId, location);
    }
    logger.error({ title: 'itemAvgCost', details: itemAvgCost });

    return itemAvgCost;
  }

  return {
    validateAccDeptCombination: validateAccDeptCombination,
    getPlugTypesFromCountry: getPlugTypesFromCountry,
    validateCountry: validateCountry,
    notifyCustomerRMA: notifyCustomerRMA,
    checkRmaQuantityVsReturned: checkRmaQuantityVsReturned,
    setWarrantyAndSerialNumInIF: setWarrantyAndSerialNumInIF,
    getWarranttyExpirationDate: getWarranttyExpirationDate,
    getItemReceiptsQuantitySum: getItemReceiptsQuantitySum,
    checkForDontPurchaseFlag: checkForDontPurchaseFlag,
    calculationCustomPrice: calculationCustomPrice,
  };
});
