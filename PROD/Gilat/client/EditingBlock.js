// JavaScript source code
function editingBlock() {
    var res = confirm("This record can not be edited ! ");
    if (res == true) {
        window.history.back();
        window.close();
    } 
}
