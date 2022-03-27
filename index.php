<?php
header('X-Content-Type-Options: nosniff');
header('X-Powered-By: miladz.eu');
include 'Config.php';
include 'Gestionnaire.php';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


?>
<html>

<head>
    <link rel="stylesheet" href="template/bootstrap/5.0.2/css/bootstrap.min.css">
    <script src="template/bootstrap/5.0.2/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="template/style.css">
    <title>Catalogue</title>

    <style>
        #page-image {
            overflow: auto;
            max-height: 400px;
        }
    </style>


</head>

<body class="bg-light">


    <div class="container-fluid">
        <div class="row justify-content-center h-100">
            <nav class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
                <div class="sticky-top pt-3">
                    <a href="/Catalogue/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <img src="Image/logo.svg" height="40px" width="40px" />
                        <span class="fs-4">Catalogue</span>
                    </a>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item">
                            <a href="http://localhost/Catalogue" class="nav-link active" aria-current="page">
                                <?php echo MENU_HOME ?>
                            </a>
                        </li>
                        <li>
                            <a href="?page=import" class="nav-link text-white">
                                <?php echo MENU_IMPORT ?>
                            </a>
                        </li>
                        <li>
                            <a href="?page=session" class="nav-link text-white">
                                <?php echo MENU_SESSION ?>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="col-md-9 ms-sm-auto col-lg-10 px-md-3 mt-3">
                <?php echo $container; ?>
            </div>
        </div>
    </div>

</body>
<script>
    $("tbody tr").hover(
        function() {
            nom = 'block-';
            num_block = nom.concat($(this).attr('id'));
            console.log(num_block);

            $('#' + num_block).addClass('border-secondary');

        },
        function() {
            $('#' + num_block).removeClass('border-secondary');

        }
    );


    $(document).ready(function() {

        var img = $("#sky");
        // Create dummy image to get real width and height
        $("<img>").attr("src", $(img).attr("src")).load(function() {
            var realWidth = this.width;
            var realHeight = this.height;
            alert("Original width=" + realWidth + ", " + "Original height=" + realHeight);
        });

    });

    window.addEventListener("load", function() {
        function sendData() {
            var XHR = new XMLHttpRequest();

            // Liez l'objet FormData et l'élément form
            var FD = new FormData(form);

            // Définissez ce qui se passe si la soumission s'est opérée avec succès
            XHR.addEventListener("load", function(event) {
                alert(event.target.responseText);
            });

            // Definissez ce qui se passe en cas d'erreur
            XHR.addEventListener("error", function(event) {
                alert('Oups! Quelque chose s\'est mal passé.');
            });

            // Configurez la requête
            XHR.open("POST", "POST.php");

            // Les données envoyées sont ce que l'utilisateur a mis dans le formulaire
            XHR.send(FD);
        }

        // Accédez à l'élément form …
        var form = document.getElementById("myForm");

        // … et prenez en charge l'événement submit.
        form.addEventListener("submit", function(event) {
            event.preventDefault();

            sendData();
        });
    });
</script>

</html>