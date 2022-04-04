/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 mar 2022  Maya Katz Libhaber
 */
define(['N/search', 'N/runtime', 'N/log', 'N/record', 'N/xml'], function (search, runtimeModule, logModule, recordModule, xmlMod) {

    function execute(context) {
        var results = searchInterfaceData();
        log.debug('results', JSON.stringify(results));

        if (!isNullOrEmpty(results)) {
            for (var i = 0; i < results.length; i++) {

                var xmlObj = xmlMod.Parser.fromString({
                    text: results[i]
                });

                var oneRequestInJson = xmlToJson(xmlObj.documentElement);
                log.debug('oneRequestInJson', JSON.stringify(oneRequestInJson));
            }
		}
    }
    function xmlToJson(xmlNode) {

        //log.debug('xmlNode', JSON.stringify(xmlNode));

        // Create the return object
        var obj = Object.create(null);

        if (xmlNode.nodeType == xmlMod.NodeType.ELEMENT_NODE) { // element
            // do attributes
            if (xmlNode.hasAttributes()) {
                obj['@attributes'] = Object.create(null);
                for (var j in xmlNode.attributes) {
                    if (xmlNode.hasAttribute({ name: j })) {
                        obj['@attributes'][j] = xmlNode.getAttribute({
                            name: j
                        });
                    }
                }
            }
        } else if (xmlNode.nodeType == xmlMod.NodeType.TEXT_NODE) { // text
            obj = xmlNode.nodeValue;
        }

        // do children
        if (xmlNode.hasChildNodes()) {
            xmlNode.childNodes.forEach(function (childNode) {

            });
            for (var i = 0 ; i < xmlNode.childNodes.length ; i++) {
                var childItem = xmlNode.childNodes[i];
                var nodeName = childItem.nodeName;
                if (nodeName in obj) {
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [
                            obj[nodeName]
                        ];
                    }
                    obj[nodeName].push(xmlToJson(childItem));
                } else {
                    obj[nodeName] = xmlToJson(childItem);
                }
            }
        }

        return obj;
    }

    function searchInterfaceData() {
        var resObj = search.create({
            type: "customrecord_storenext_interface",
            filters:
                [
                    ["custrecord_isparsed", "is", "F"]
                ],
            columns:
                [
                    search.createColumn({ name: "custrecord_interface_data", label: "interface data" })
                ]
        });

        var results = resObj.run();
        //var searchResults = [];
        var searchid = 0;
        do {

            var resultslice = results.getRange({ start: searchid, end: searchid + 1000 });
            log.debug('resultslice :', resultslice);
            log.debug('resultslice type is array?', Array.isArray(resultslice));
            resultslice.forEach(function (entry) {
                processResultEntry(entry.getValue("custrecord_interface_data"));
            });

            searchid += 1000;
        } while (resultslice.length >= 1000);

        //log.debug('searchResults :', searchResults);   

  //      if (!isNullOrEmpty(AllSearchResults)) {
  //          for (var rs in AllSearchResults) {
  //              results.push(AllSearchResults[rs.getValue('custrecord_interface_data')]);
  //          }
		//}
    }
    function processResultEntry(resultEntry) {
        log.debug("processResultEntry before clean", JSON.stringify(resultEntry));
        var cleanedResultEntry = JSON.stringify(resultEntry).replace(/(\r\n)+|(\r)+|(\n)+/g, "$$$-REPLACED-$$$");
        log.debug("processResultEntry after clean", cleanedResultEntry);

        var xmlObj = xmlMod.Parser.fromString({
            text: cleanedResultEntry
        });

        log.debug("xmlObj ", xmlObj);

        var entryAsJson = xmlToJson(xmlObj);
        log.debug('processResultEntry - entryAsJson :', JSON.stringify(entryAsJson));
        // TODO: process the json (create transaction and mark as processed)
	}  
    function isNullOrEmpty(val) {

        if (typeof (val) == 'undefined' || val == null || (typeof (val) == 'string' && val.length == 0)) {
            return true;
        }
        return false;
    }
    return {
        execute: execute
    };
});
