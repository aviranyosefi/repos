$(".txtb input").on("focus", function () { 
    $(this).addClass("focus");
});

$(".txtb input").on("blur", function () {
    if ($(this).val() == "")
        $(this).removeClass("focus");
});


function Login() {
    var user_name = document.getElementById("inpUserName").value;
    var user_password = document.getElementById("inpPassword").value;
    if (user_name != '' && user_name != null && user_name != undefined
        && user_password != '' && user_password != null && user_password != undefined) {

        location.href = 'Main.html';

    }
    else {
        alert('שגיאה- שם משתמש או ססמא לא נכונים')
    }

}
    ////main.html

    var numbers_of_players;
    var numbers_of_groups;
    var numbers_of_players_each_gruop;

    
    function addFields() {
        numbers_of_groups = parseInt(document.getElementById("numbers_of_groups").value);
        numbers_of_players_each_gruop = parseInt(document.getElementById("numbers_of_players_each_gruop").value);
        numbers_of_players = numbers_of_groups * numbers_of_players_each_gruop;
        var div_before_sort = document.getElementById("div_before_sort");
        if (div_before_sort.style.display === "none") {
            div_before_sort.style.display = "block";
        } else {
            div_before_sort.style.display = "none";
        }
        while (div_before_sort.hasChildNodes()) {
            div_before_sort.removeChild(div_before_sort.lastChild);
        }


        for (var i = 1; i <= numbers_of_players; i++) {
       
           div_before_sort.appendChild(document.createTextNode("Player " + (i) + " :  "));
            
            
            var input = document.createElement("input");

            input.type = "text";
            input.name = "player";
          
            input.validity.valid;
            //input.required = true;
            div_before_sort.appendChild(input);

            var value = document.createElement("input");
            value.type = "number";
            value.name = "level";
            value.min = "1";
            value.max = "5";
            value.value = "1"
            div_before_sort.appendChild(value);

            div_before_sort.appendChild(document.createElement("br"));
        }

        div_before_sort.appendChild(document.createElement("br"));

        var sort_button = document.createElement("button");
        sort_button.onclick = sort;
        sort_button.innerHTML = "To Sort";
        sort_button.setAttribute("class", "logbtn");
        div_before_sort.appendChild(sort_button);

        div_before_sort.appendChild(document.createElement("br"));

        var go_back_button = document.createElement("button");
        go_back_button.onclick = goBack;
        go_back_button.innerHTML = "Go Back";
        go_back_button.setAttribute("class", "logbtn");
        div_before_sort.appendChild(go_back_button);

    }

    function sort() {



        var players = [];
        for (var i = 0; i < numbers_of_players; i++) {
            players.push({
                name: document.getElementsByName("player")[i].value,
                value: parseInt(document.getElementsByName("level")[i].value)
            });
        }

        console.log(players);

        players.sort(function (a, b) { return b.value - a.value });

        var groups = [];
        for (var i = 1; i <= numbers_of_groups; i++) {
            groups.push([]);
        }
        players.forEach(val => {

            var counts = groups.map(group => group.reduce((acc, val) => acc + val.value, 0));
            groups[counts.indexOf(Math.min(...counts))].push(val);
        });

        console.log(groups);





        var div_before_sort = document.getElementById("div_before_sort");
        div_before_sort.style.display = "none";
        var div_after_sort = document.getElementById("div_after_sort");
        if (div_after_sort.style.display === "none") {
            div_after_sort.style.display = "block";
        } else {
            div_after_sort.style.display = "none";
        }
        while (div_after_sort.hasChildNodes()) {
            div_after_sort.removeChild(div_after_sort.lastChild);
        }

        for (var i = 0; i < numbers_of_groups; i++) {

            var text_group = document.createElement("p");
            text_group.innerHTML = '<u>Group  ' + (i + 1) + '</u>';

            div_after_sort.appendChild(text_group);

            var p = document.createElement("p");
            p.name = "member";
            var ff = function () {
                var fff = '';
                for (var j = 0; j < numbers_of_players_each_gruop; j++) {
                    fff += groups[i][j].name + '<br>';
                }

                return fff;
            };

            p.innerHTML = ff();
            div_after_sort.appendChild(p);
            div_after_sort.appendChild(document.createElement("br"));
        }
        var button = document.createElement("button");
        button.onclick = goBack;
        button.innerHTML = "Go Back";
        button.setAttribute("class", "logbtn");
        div_after_sort.appendChild(button);

        var Sort_again = document.createElement("button");
        Sort_again.onclick = goBack;
        Sort_again.innerHTML = "Sort Again";
        Sort_again.setAttribute("class", "logbtn");
        div_after_sort.appendChild(Sort_again);
    }

function goBack() {
    location.href = 'Main.html';
}