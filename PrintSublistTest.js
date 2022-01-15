
// JavaScript source code
function sublistTest() {

    var divToPrint = document.getElementById("custpage_sublist_id_splits");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();

}