<?php
include 'Config.php';
include 'Gestionnaire.php';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function SupExt($file_name) {
    // met le point '.' dans la variable $trouve_moi
    $trouve_moi = ".";

    // cherche la postion du '.'
    $position = strpos($file_name, $trouve_moi);

    // enleve l'extention, tout ce qui se trouve apres le '.'
    return substr($file_name, 0, $position);
}
?>
<html>

    <head>
        <link rel="stylesheet" href="vendor/bootstrap/5.0.2/css/bootstrap.min.css">
        <script src="vendor/bootstrap/5.0.2/js/bootstrap.min.js"></script>
        <script src="vendor/jquery/jquery.min.js"></script>
        <link rel="stylesheet" href="vendor/style.css">

    </head>

    <body class="bg-light">
        <header class="p-3 bg-dark text-white">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
                    </a>

                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="/Catalogue" class="nav-link px-2 text-white">Home</a></li>
                        <li><a href="/Catalogue/?page=import" class="nav-link px-2 text-white">Import</a></li>
                        <li><a href="#" class="nav-link px-2 text-white">Pricing</a></li>
                        <li><a href="#" class="nav-link px-2 text-white">FAQs</a></li>
                        <li><a href="#" class="nav-link px-2 text-white">About</a></li>
                    </ul>

                    <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                        <input type="search" class="form-control form-control-dark" placeholder="Search..." aria-label="Search">
                    </form>

                    <div class="text-end">
                        <button type="button" class="btn btn-outline-light me-2">Login</button>
                        <button type="button" class="btn btn-warning">Sign-up</button>
                    </div>
                </div>
            </div>
        </header>

        <div class="container-lg">
            <?php echo $container; ?>
        </div>

    </body>
    <script>
        $("tbody tr").hover(
                function () {
                    nom = 'block-';
                    num_block = nom.concat($(this).attr('id'));
                    console.log(num_block);

                    $('#' + num_block).addClass('border-secondary');

                }, function () {
            $('#' + num_block).removeClass('border-secondary');

        }
        );


        $(document).ready(function () {

                var img = $("#sky");
                // Create dummy image to get real width and height
                $("<img>").attr("src", $(img).attr("src")).load(function () {
                    var realWidth = this.width;
                    var realHeight = this.height;
                    alert("Original width=" + realWidth + ", " + "Original height=" + realHeight);
                });

        });

    </script>
</html>
