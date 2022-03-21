var sort = -1;
function approve_tran(request, response) {
    var form = nlapiCreateForm('Budget Owner Report Columns');
    var fieldsubsidiary = form.addField('custpage_subsidiary', 'select', 'Subsidiary', 'SUBSIDIARY');
    var fieldvendor = form.addField('custpage_vendor', 'select', 'Vendor', 'Vendor');
    var fielddep = form.addField('custpage_dep', 'select', 'Department', 'department');
    var fieldtran = form.addField('custpage_tranid', 'text', 'Document Number')
    fielddep.setLayoutType('normal', 'startcol');
    //fieldtran.setLayoutType('normal', 'startcol');

    var fieldsort = form.addField('custpage_sortby', 'select', 'Sort By', 'custom');
    fieldsort.addSelectOption("5", "Date");
    fieldsort.addSelectOption("0", "Transction Type");
    fieldsort.addSelectOption("1", "Amount (low to high)");
    fieldsort.addSelectOption("2", "Amount (high to low)");
    fieldsort.addSelectOption("3", "Foreign Amount (low to high)");
    fieldsort.addSelectOption("4", "Foreign Amount (high to low)");

    if (request.getMethod() == 'GET') {
        form.addSubmitButton('Load Report');
        response.writePage(form);
    }
    else {
        var filters = new Array();
        var search = nlapiLoadSearch(null, 'customsearch_budget_control');
        var searchdue = nlapiLoadSearch(null, 'customsearch_budget_control');
        var oldfilters = search.getFilters();

        var department = request.getParameter("custpage_dep");
        if (department != null && department > 0) {
            //search.setFilterExpression([ [ ['department', 'is', department], 'or', ['mainline', 'is', 'T'] ] ]);
            //search.addFilters(oldfilters);
            search.addFilter(new nlobjSearchFilter('department', null, 'anyof', department));
            //searchdue.addFilter(new nlobjSearchFilter('department', null, 'anyof', department));
        }
        var subsidiary = request.getParameter("custpage_subsidiary");
        if (subsidiary != null && subsidiary > 0) {
            search.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiary));
            searchdue.addFilter(new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiary));
        }
        var vendor = request.getParameter("custpage_vendor");
        var tranid = request.getParameter("custpage_tranid");
        fieldsubsidiary.setDefaultValue(subsidiary);
        fieldvendor.setDefaultValue(vendor);
        fielddep.setDefaultValue(department);
       // fieldtran.setDefaultValue(tranid);
        if (tranid != "") {
            search.addFilter(new nlobjSearchFilter('tranid', null, 'is', tranid));
            searchdue.addFilter(new nlobjSearchFilter('tranid', null, 'is', tranid));
        }

        sort = request.getParameter("custpage_sortby");
        fieldsort.setDefaultValue(sort);

        if (vendor != null && vendor > 0) {
            search.addFilter(new nlobjSearchFilter('entity', null, 'is', vendor));
            searchdue.addFilter(new nlobjSearchFilter('entity', null, 'is', vendor));
        }
        nlapiLogExecution('debug', 'filters', JSON.stringify(search.getFilterExpression(), null, 2))

        var searchid = 0;
        var columns = search.getColumns();

        var arrRes = [];
        var theResults = [];
        var allResults = [];
        var resultSelection = [];

        var function_status_changed = "function status_changed(e){console.log(e.id); to_update.push(e.id); if (e.selectedOptions[0].label == 'Rejected') {var commentobj = document.getElementById('comments_' + e.id);commentobj.value='Reject Reason'; commentobj.focus();  commentobj.select();}}";

        var htmlHeader = form.addField('custpage_header', 'inlinehtml');
        var cols_to_ignore = ['memomain', 'accounttype', 'internalid', 'linesequencenumber', 'symbol', 'item'];
        var htmlLines = "";
        var table = "<style>.green{color:green} .red{color:red} .red-border{border: 1px solid red;} table.tya_table {border-collapse: collapse; border: 1px solid black;}th.tya_header {color:#fff;background-color:#607799;text-align:center; font-weight: bold;border: 1px solid black; padding: 5px;} td.tya_cell {text-align:center; border: 1px solid black; padding: 5px;} tr.mouse_over {text-align:center; border: 2px solid black; background-color: yellow; font-size: 15px; padding: 5px;} td.tya_cell_total {text-align:center; border: 1px solid black; padding: 5px;}</style>";
        table += "<script>var to_update=[];" + function_status_changed + "</script>" +
        "<br><br>" +
        "<table class='tya_table' style='width:100%'> ";
        htmlLines += "<tr>";
        for (var colind in columns) {
            if (columns.hasOwnProperty(colind) && cols_to_ignore.indexOf(columns[colind].name) == -1) {
                htmlLines +=
                "<th class='tya_header' style='width:150px'>" + columns[colind].label.replace("/Receive By", "") + "</th>";
            }
        }
        htmlLines +=
       "<th class='tya_header' style='width:150px'>Status</th>";
        htmlLines += "</tr>";
        //search.addFilter(new nlobjSearchFilter('mainline', null, 'is', 'F'));
        search.addFilter(new nlobjSearchFilter('duedate', null, 'isempty')); //main line F drop all journal entry lines

        var resultset = search.runSearch();
        searchdue.addFilter(new nlobjSearchFilter('mainline', null, 'is', 'T'));
        searchdue.addFilter(new nlobjSearchFilter('duedate', null, 'isnotempty'));
        var arrtranDuedate = [];
        var resultsetduedate = searchdue.runSearch();
        do {
            var resultslice = resultsetduedate.getResults(searchid, searchid + 1000);
            for (rs in resultslice) {
                var duedate = resultslice[rs].getValue("duedate");
                arrtranDuedate[resultslice[rs].id] = duedate;
                searchid++;
            }
        } while (resultslice.length >= 1000);

        searchid = 0;
        var rs;

        //nlapiLogExecution('debug', 'cols', JSON.stringify(cols, null, 2))

        //do {// Limit to 50
        var limit = 40;
        if (department != null || vendor != null)
            limit = 200;

        var resultslice = resultset.getResults(0, limit);
            for (rs in resultslice) {
                arrRes.push(resultslice[rs]);
                searchid++;
            }
        //} while (resultslice.length >= 20 && searchid < 21);
            //nlapiLogExecution('debug', 'arrRes', resultslice.length)

        //here we create the form
        arrResSorted = arrRes.sort(Sortarr);
        var htmlLine = "";
        for (var rowindex in arrResSorted) {
            htmlLine = "";
            //htmlLine += "<tr><td><input type='text' value='ggg'/></td></tr>";
            //if (arrtranDuedate[arrResSorted[rowindex].id] == 'undefined')
            //    continue;
            htmlLine += "<tr>";
            var line = parseInt(arrResSorted[rowindex].getValue("linesequencenumber"));
            var accounttype = (arrResSorted[rowindex].getValue("item") == '') ? "expense" : "item";
            var type = arrResSorted[rowindex].getRecordType();

            if (type == 'vendorcredit' && line == 0)
                continue;

            if (type == 'journalentry')
                line = line + 1;



            for (var colind in columns) {
                if (cols_to_ignore.indexOf(columns[colind].name) >= 0)
                    continue;
                if (columns[colind].name == "custcol_budget_comments")
                    htmlLine += "<td class='tya_cell'><input  id='comments_slcstatus_" + arrResSorted[rowindex].id + '_' + type + '_' + line + '_' + accounttype + "' +  type='text' value='" + arrResSorted[rowindex].getValue(columns[colind]) + "'/></td>";
                else if (columns[colind].name == "custcol_budget_approval_status") {
                    htmlLine += '<td class="tya_cell"><div class="uir-field-wrapper">' +
                         '<span class="uir-field">' +
                         '<select id="slcstatus_' + arrResSorted[rowindex].id + '_' + type + '_' + line + '_' + accounttype + '" onchange=\"status_changed(this)\"> <option value="1">Pending Approval</option><option value="2">Approved</option><option value="3">Rejected</option>' +
                         '</select>' +
                         '</span>' +
                     '</div></td>';
                }
                else if (columns[colind].name == "fxamount") {
                    htmlLine += "<td class='tya_cell'>" + arrResSorted[rowindex].getValue(columns[colind]) + ' ' + arrResSorted[rowindex].getValue('symbol', 'currency') + "</td>";
                }
                else if (columns[colind].name == "department") {
                    htmlLine += "<td class='tya_cell'>" + arrResSorted[rowindex].getText(columns[colind]) + "</td>";
                }
                else if (columns[colind].type == "select") {
                    htmlLine += "<td class='tya_cell'>" + arrResSorted[rowindex].getText(columns[colind]) + "</td>";
                }
                else if (columns[colind].name == "duedate") {
                    var due = arrtranDuedate[arrResSorted[rowindex].id];
                    if (due == undefined)
                        due = "";
                    htmlLine += "<td class='tya_cell'>" + due + "</td>";
                }
                else if (columns[colind].name == "url") {
                    var link = arrResSorted[rowindex].getValue(columns[colind]);
                    if (link != null && link != "")
                        htmlLine += "<td class='tya_cell'><a href='" + link + "'>Click To Download</a></td>";
                    else
                        htmlLine += "<td class='tya_cell'></td>";
                } else {
                    htmlLine += "<td class='tya_cell'>" + arrResSorted[rowindex].getValue(columns[colind]) + "</td>";
                }
            }
            htmlLine += "<td class='tya_cell'><div  id='status_slcstatus_" + arrResSorted[rowindex].id + '_' + type + '_' + line + '_' + accounttype + "' style='padding:3px' >Pending Update</div></td>";
            htmlLine += "</tr>";
            htmlLines += htmlLine;
        }
        htmlLines += "</table>";

        var updatediv = "<div class=green><b>UPDATED</b></div>";

        var htmlTable = form.addField('custpage_table', 'inlinehtml', null, 'custpage_table_group');
        htmlTable.setDefaultValue(table + htmlLines);
        htmlTable.setLayoutType('outsidebelow', 'startcol');
        var function_save = "debugger;for(var i=0; i<to_update.length;  i++)";
        function_save += "{try{var obj=document.getElementById('status_' + to_update[i]); var idtype= to_update[i].replace('slcstatus_','');var id=idtype.split('_')[0]; "
        function_save += "var type=idtype.split('_')[1];var linenum=idtype.split('_')[2]; var accounttype=idtype.split('_')[3]; var tranobj=nlapiLoadRecord(type,id);var approval_status=document.getElementById(to_update[i]).value;console.log('app:' + approval_status);"
        function_save += " var comments=document.getElementById('comments_' + to_update[i]).value; var linetype='';console.log('coments' + comments); "
        function_save += "linetype=accounttype;if (type.indexOf('journal') >= 0) {linetype='line'};console.log('linetype' + linetype);  ;tranobj.setLineItemValue(linetype,'custcol_budget_comments',linenum,comments);"
        function_save += "tranobj.setLineItemValue(linetype,'custcol_budget_approval_status',linenum,approval_status);nlapiSubmitRecord(tranobj);  obj.innerHTML='<div class=green><b>UPDATED</b></div>';}";
        function_save += "catch(e){obj.innerHTML='<div class=red><b>ERROR: </b><br/>' + e.message + '</div>';}}";
        var addButton = form.addButton('custpage_addButton', 'Save', function_save);
        form.addSubmitButton('Load Again');
        response.writePage(form);
    }
}

function Sortarr(a, b) {
    var boolres = false;
    var fieldtocompare = "trandate";
    if (sort == -1)
        fieldtocompare = "trandate";
    if (sort == 0)
        fieldtocompare = "type";
    if (sort == 1)
        fieldtocompare = "amount";
    if (sort == 2)
        fieldtocompare = "amount";
    if (sort == 3)
        fieldtocompare = "fxamount";
    if (sort == 4)
        fieldtocompare = "fxamount";
    if (sort == 5)
        fieldtocompare = "trantype";


    if (a.getValue(fieldtocompare) == b.getValue(fieldtocompare))
        return 0;
    boolres = (a.getValue(fieldtocompare) > b.getValue(fieldtocompare));
    if (sort == 2 || sort == 4 || sort == 5) // desc
        boolres = (parseFloat(a.getValue(fieldtocompare)) < parseFloat(b.getValue(fieldtocompare)));
    if (sort == 1 || sort == 3)
        boolres = (parseFloat(a.getValue(fieldtocompare)) > parseFloat(b.getValue(fieldtocompare)));
    return boolres ? 1 : -1;
}
