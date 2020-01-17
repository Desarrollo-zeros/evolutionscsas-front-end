<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Prueba</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="robots" content="all,follow">
    <!-- Bootstrap CSS-->
    <link rel="stylesheet" href="vendor/bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome CSS-->
    <link rel="stylesheet" href="vendor/font-awesome/css/font-awesome.min.css">
    <!-- Fontastic Custom icon font-->
    <link rel="stylesheet" href="css/fontastic.css">
    <!-- Google fonts - Poppins -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,700">
    <!-- theme stylesheet-->
    <link rel="stylesheet" href="css/style.default.css" id="theme-stylesheet">
    <!-- Custom stylesheet - for your changes-->
    <link rel="stylesheet" href="css/custom.css">
    <!-- Favicon-->
    <link rel="shortcut icon" href="img/favicon.ico">
    <!-- Tweaks for older IEs--><!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script><![endif]-->
  </head>
  <body>
    <div class="page login-page">
      <div class="container d-flex align-items-center">
        <div class="form-holder has-shadow">
          <div class="row">
            <!-- Logo & Information Panel-->
            <div class="col-lg-6">
              <div class="info d-flex align-items-center">
                <div class="content">
                  <div class="logo">
                    <h1>Login</h1>
                  </div>
                  <p>Prueba rev 0.1</p>
                </div>
              </div>
            </div>
            <!-- Form Panel    -->
            <div class="col-lg-6 bg-white">
              <div class="form d-flex align-items-center">
                <div class="content">
                  <form method="post" id="formLogin" name="formLogin" class="form-validate">
                    <div class="form-group">
                      <input  type="text" id="username" name="username" required data-msg="Please enter your username" class="input-material" maxlength="20" minlength="4">
                      <label for="username" class="label-material">User Name</label>
                    </div>
                    <div class="form-group">
                      <input  type="password" id="password" name="password" required data-msg="Please enter your password" class="input-material" maxlength="20" minlength="4">
                      <label for="password" class="label-material">Password</label>
                    </div>

                    <div class="form-group">
                      <input type="submit" value="Login" class="btn btn-primary">
                    </div>



                    <!-- This should be submit button but I replaced it with <a> for demo purposes-->
                  </form><a href="#" class="forgot-pass">Forgot Password?</a><br><small>Do not have an account? </small><a href="register.html" class="signup">Signup</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="copyrights text-center">
        <p>Design by <a href="https://bootstrapious.com/p/admin-template" class="external">Bootstrapious</a>
          <!-- Please do not remove the backlink to us unless you support further theme's development at https://bootstrapious.com/donate. It is part of the license conditions. Thank you for understanding :)-->
        </p>
      </div>
    </div>
    <!-- JavaScript files-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/popper.js/umd/popper.min.js"> </script>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="vendor/jquery.cookie/jquery.cookie.js"> </script>
    <script src="vendor/chart.js/Chart.min.js"></script>
    <script src="vendor/jquery-validation/jquery.validate.min.js"></script>
    <!-- Main File-->
    <script src="js/front.js"></script>
    <script src="js/Main/Main.js"></script>
    <script src="js/notify.js"></script>


    <script>


        url = "http://"+"<?php echo $_SERVER['SERVER_ADDR']; ?>"+":44344/";

       $(document).ready(function () {

         if(localStorage.user != null){
            auth("login");
         }
       });

       $("#formLogin").on("submit",function (form) {
          form.preventDefault();

          if($("#username").val().length > 20 || $("#username").val().length  < 3){
              $.notify("Username length min 3 and max 20");
              return false;
          }

          if($("#password").val().length > 20 || $("#password").val().length  < 3){
             $.notify("password length min 3 and max 20");
             return false;
          }
          var obj = {username : $("#username").val(), password : $("#password").val()};
          $.ajax({
            url : url+"api/user/authenticate",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type : 'post',
            data : JSON.stringify(obj),
            success :function (data) {
              if(data == null){
                $.notify("User y/o Password invalid");
                return false;
              }
              localStorage.user = JSON.stringify(data);
              window.location.href = "./panel.php";
            },
            error: function(jqXHR, textStatus, errorThrown) {
              $.notify("User y/o Password invalid");
            }
          });
       });
    </script>
  </body>
</html>