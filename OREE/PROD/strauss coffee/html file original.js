// JavaScript source code
function sethtml() {
    try {
        document.getElementById("custevent_customer_list").onchange = setclient;
        document.getElementById('main_form').style.margin = "50px";
        document.getElementById('main_form').dir = "rtl"
        document.getElementById('main_form').style.float = "right";
        document.getElementById('div__header').style.padding = "10px 30% 20px 30%";
        document.getElementById('__enclosingtable').style.padding = "10px 27% 20px 10%";
        document.getElementsByClassName('table_fields')[0].cellSpacing = "7px";
        document.getElementsByClassName('pt_title')[0].style.padding = "7px"
        document.getElementById("email").value = "general@gmail.com";
        document.getElementById("email").style.visibility = "hidden";
        document.getElementById("email_fs_lbl").style.visibility = "hidden";

        var titles = document.getElementsByClassName('smalltextnolink');
        for (i = 0; i < titles.length; i++)
            titles[i].align = "left";
    }
    catch (e) { }

}

function setclient() {
    document.getElementById("companyname").value = document.getElementById("custevent_customer_list").options[document.getElementById("custevent_customer_list").selectedIndex].text;
}