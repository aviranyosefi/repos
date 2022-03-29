function uncompletedReport(request, response) {

    var form = nlapiCreateForm('Managers with uncompleted Capacity Review');
    var ForcastList = getForcastList();
    var ActualList = getActualList();
    nlapiLogExecution('debug', 'ForcastList', JSON.stringify(ForcastList));
    var body = buildTable(ActualList, ForcastList)
    var html = '<html lang="en">'
        + '<head>'
        + '<meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'
        + '<!-- Bootstrap CSS -->'
        + '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'
        + '<link rel="stylesheet" href="https://cdn.datatables.net/1.11.3/css/jquery.dataTables.min.css">'
        + '</head>'
        + '<body>'
        + '<div><canvas id="myChart"></canvas></div>'
        + '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>'
        + '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>'
        + '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>'
        + '<script src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>'
        + '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
        + '<script>$(document).ready(function() {$("#example1").DataTable();});</script>'
        + '<script>' + CHART() + '</script>'
        + body
        + '</body>'
        + '</html>';

    var htmlHeader = form.addField('custpage_header', 'inlinehtml').setLayoutType('outsideabove', 'startrow');
    htmlHeader.setDefaultValue(html);


    response.writePage(form)
}

function getAllReports() {

    var results = [];

    var columns = new Array();
    columns[0] = new nlobjSearchColumn('firstname');
    columns[1] = new nlobjSearchColumn('lastname');

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('custentity_ct_employee_type', null, 'anyof', 2)

    var search = nlapiCreateSearch('employee', filters, columns);

    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var results = [];

    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);

    if (s != null) {

        for (var i = 0; i < s.length; i++) {

            results.push({

                id: s[i].id,
                name: s[i].getValue('firstname') + ' ' + s[i].getValue('lastname')
            });

        }
        return results;
    }
}
function getActualList() {
    var search = nlapiLoadSearch(null, 'customsearch_missing_actual');
    var cols = search.getColumns();
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var res = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        for (var i = 0; i < s.length; i++) {
            res[s[i].getValue(cols[0])] = {
                name: s[i].getText(cols[0]),
                count: s[i].getValue(cols[1])
            }
        }
    }
    return res;
}
function getForcastList() {
    var search = nlapiLoadSearch(null, 'customsearch_missing_forcast');
    var cols = search.getColumns();
    var resultset = search.runSearch();
    var s = [];
    var searchid = 0;
    var res = [];
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for (var rs in resultslice) {
            s.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice != null && resultslice.length >= 1000);
    if (s != null) {
        debugger;
        for (var i = 0; i < s.length; i++) {
            var reporter = s[i].getValue(cols[0]);
            var reportern = s[i].getText(cols[0]);
            var employee = s[i].getValue(cols[1]);
            var current = s[i].getValue(cols[2]);
            var current1 = s[i].getValue(cols[3]);
            var current2 = s[i].getValue(cols[4]);
            var current3 = s[i].getValue(cols[5]);
            var current4 = s[i].getValue(cols[6]);
            var current5 = s[i].getValue(cols[7]);
            var current6 = s[i].getValue(cols[8]);
            if (res[reporter] == undefined) {
                res[reporter] = {
                    name: s[i].getText(cols[0]),
                    reportern: reportern,
                    current: 0,
                    m1: 0,
                    m2: 0,
                    m3: 0,
                    m4: 0,
                    m5: 0,
                    m6: 0,
                }
            }
            if (current == 0) { var count = res[reporter].current; count++; res[reporter].current = count }
            if (current1 == 0) { var count = res[reporter].m1; count++; res[reporter].m1 = count }
            if (current2 == 0) { var count = res[reporter].m2; count++; res[reporter].m2 = count }
            if (current3 == 0) { var count = res[reporter].m3; count++; res[reporter].m3 = count }
            if (current4 == 0) { var count = res[reporter].m4; count++; res[reporter].m4 = count }
            if (current5 == 0) { var count = res[reporter].m5; count++; res[reporter].m5 = count }
            if (current6 == 0) { var count = res[reporter].m6; count++; res[reporter].m6 = count }
        }
    }
    return res;
}
function buildTable(ActualList, ForcastList) {
    var emp = getAllReports();

    var date = new Date()
    var previous_period = getPeriod(date, 'previous');
    var periods = getPeriod(date, '1');
    var body = "<div style='width:100%' class='container-fluid'> " +
        " <div  class='container theme-showcase' role='main'><div class='col-md-12'>"
    var table = "<table class='table table-bordered table-hover'  style='text-align:center'><thead><tr><th>Reporter</th><th>Missed Actual<br> Employee’s Assessments<br> Missed Forecast<br> Employee’s Assessments</th><th colspan='7'>Missed Forecast<br>Employee’s Assessments</th></tr></thead> ";
    table += "<tr><td></td><td>" + previous_period + "</td><td>" + periods[0] + "</td><td>" + periods[1] + "</td><td>" + periods[2] + "</td><td>" + periods[3] + "</td><td>" + periods[4] + "</td><td>" + periods[5] + "</td><td>" + periods[6] + "</td></tr>";
    for (var i = 0; i < emp.length; i++) {
        name = emp[i].name
        count = 0; current = 0; m1 = 0; m2 = 0; m3 = 0; m4 = 0; m5 = 0; m6 = 0;
        if (ActualList[emp[i].id] != undefined || ForcastList[emp[i].id] != undefined) {
            if (ActualList[emp[i].id] != undefined) {
                name = ActualList[emp[i].id].name
                count = ActualList[emp[i].id].count
            }
            if (ForcastList[emp[i].id] != undefined) {
                current = ForcastList[emp[i].id].current
                m1 = ForcastList[emp[i].id].m1
                m2 = ForcastList[emp[i].id].m2
                m3 = ForcastList[emp[i].id].m3
                m4 = ForcastList[emp[i].id].m4
                m5 = ForcastList[emp[i].id].m5
                m6 = ForcastList[emp[i].id].m6
            }
            table += "<tr><td>" + name + "</td><td>" + count + "</td><td>" + current + "</td><td>" + m1 + "</td><td>" + m2 + "</td><td>" + m3 + "</td><td>" + m4 + "</td><td>" + m5 + "</td><td>" + m6 + "</td></tr>";
        }
    }
    table += "</table>"
    body += table;
    //< table class='table table-striped' > <thead> <tr> <th>#</th> <th>First Name</th> <th>Last Name</th> <th>Username</th> </tr></thead> <tbody> <tr> <td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr> <td>2</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr> <td>3</td><td>Larry</td><td>the Bird</td><td>@twitter</td></tr></tbody> </table > </div ></div > "
    body += "</div>";
    return body

}
function getPeriod(date, type) {
    if (type == 'previous') {
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);
    }
    else if (type == '1') {
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 7, 0);
    }

    var filters = new Array();
    filters[0] = new nlobjSearchFilter('startdate', null, 'onorafter', nlapiDateToString(firstDay));
    filters[1] = new nlobjSearchFilter('isyear', null, 'is', 'F');
    filters[2] = new nlobjSearchFilter('isquarter', null, 'is', 'F');
    filters[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', nlapiDateToString(lastDay));


    var columns = new Array();
    columns[0] = new nlobjSearchColumn('periodname')
    columns[1] = new nlobjSearchColumn('internalid').setSort(false);

    var s = nlapiSearchRecord('accountingperiod', null, filters, columns);

    if (type == 'previous') {
        if (s != null && s.length > 0) {
            return s[0].getValue('periodname');
        }
    }
    else {
        var res = [];
        if (s != null && s.length > 0) {
            for (var i = 0; i < s.length; i++) {
                res.push(s[i].getValue('periodname'))
            }
            return res;
        }
    }
    return '';
}
function CHART() {
    return 'var char = document.getElementById("myChart");'
        + 'var config = {'
        + 'type :"bar",'
        + 'data:{'
        + ' labels: [' + emp + '], '
        + 'datasets: [{ ' + datas+' }],}, '
        + '}; '
        + 'var cook = new Chart(char,config )'
}
var emp = '"bill","jef"';
var datas = 'label: "number", data: [5, 2]';

function c() {
    return 'var char = document.getElementById("myChart");'
        + 'var config = {'
        + 'type :"doughnut",'
        + 'data:{'
        + ' labels: [' + empp + '], '
        + 'datasets: [{ ' + data + ' }],}, '
        + '}; '
        + 'var cook = new Chart(char,config )'
}

var empp = '"Red","Blue","Yellow"';
var data = 'label: "My First Dataset", data: [300, 50,100],backgroundColor:["rgb(255, 99, 132)","rgb(54, 162, 235)" , "rgb(255, 205, 86)"] ,hoverOffset:4';

