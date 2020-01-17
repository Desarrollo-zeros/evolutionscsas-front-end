<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Prueba</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="fonts/fontawesome-all.min.css">
    <link rel="stylesheet" type="text/css"
          href="http://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="https://js.arcgis.com/4.14/esri/themes/light/main.css">
    <link rel="stylesheet" href="css/custom.css">
    <style>
    </style>
</head>
<body class="claro">

<button class="Close btn btn-sm" onclick="return logout()"><img src="img/logout.png" width="50"></button>


<div id="loading" class="loading">Loading&#8230;</div>

<div id="viewDiv">
    <button type="button" id="btnUser">Listar Usuario</button>
    <button type="button" id="btnDept">Cargar Departamento</button>
    <button type="button" id="btnVeredas">Cargar Veredas</button>
    <button type="button" id="btnList">istar Veredas</button>

</div>


</body>
</html>


<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
<script src="vendor/jquery/jquery.min.js"></script>
<script src="js/Main/Main.js"></script>
<script src="js/notify.js"></script>
<script src="js/dojo.js"></script>
<script src="js/Main/Panel.js"></script>
<script>

    url = "http://"+"<?php echo $_SERVER['SERVER_ADDR']; ?>"+":44344/";

    var position = 0;

    if(localStorage.user != null) {
        auth("veredas");
    }
    else{
        window.location.href = "./index.php";
    }


    $(document).ready(function () {
        getPersons();
    });


</script>
