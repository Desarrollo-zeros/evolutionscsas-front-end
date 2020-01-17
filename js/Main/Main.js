var url; //= 'http://142.93.117.217:44344/';


function  auth(path) {
    var user = JSON.parse(localStorage.user);

    $.ajax({
        url : url+"api/user",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type : 'get',
        headers: {'Authorization': 'Bearer '+user.token},
        success :function () {
            if(path === "login"){
                window.location.href = "./panel.php";
            }
            $.notify("Bienvenido: "+user.username,"success");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(path !== "login"){
                window.location.href = "./index.php";
            }

        }
    });
}


function logout() {
    delete localStorage.user;
    localStorage.clear();
    window.location.href = "./index.php";
}


