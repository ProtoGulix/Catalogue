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
<!DOCTYPE html>
<html lang='fr'>

<head>
    <!-- Standard Meta -->
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <!-- Local Meta -->
    <script src="template/jquery/jquery.js"></script>
    <link rel="stylesheet" type="text/css" href="semantic/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/reset.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/site.css">

    <link rel="stylesheet" type="text/css" href="semantic/components/container.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/grid.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/header.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/image.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/menu.css">

    <link rel="stylesheet" type="text/css" href="semantic/components/divider.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/dropdown.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/segment.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/button.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/list.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/icon.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/sidebar.css">
    <link rel="stylesheet" type="text/css" href="semantic/components/transition.css">
    <script src="semantic/semantic.min.js"></script>
    <script src="semantic/components/visibility.js"></script>
    <script src="semantic/components/sidebar.js"></script>
    <script src="semantic/components/transition.js"></script>
    <link rel="stylesheet" href="template/style.css">


    <link rel="apple-touch-icon" sizes="180x180" href="image/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="image/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="image/favicon-16x16.png">
    <link rel="manifest" href="image/site.webmanifest">
    <link rel="mask-icon" href="image/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">



    <style type="text/css">
        body {
            background-color: #FFFFFF;
        }

        .ui.menu .item img.logo {
            margin-right: 1.5em;
        }

        .main.container {
            padding-top: 5em;
        }

        .wireframe {
            margin-top: 2em;
        }

        .ui.footer.segment {
            margin: 5em 0em 0em;
            padding: 5em 0em;
        }

        #page-image {
            overflow: auto;
            max-height: 400px;
        }

        .box {
            position: absolute;
            visibility: visible;
            border: solid blue 2px;
        }
    </style>
    <title><?php echo $GLOBALS['site_name']; ?></title>

</head>

<body>

    <div class="ui fixed inverted menu">
        <div class="ui container">
            <a href="<?php echo $GLOBALS['racine']; ?>" class="header item">
                <img class="logo" src="image/logo_small_icon_only_inverted.png" />
                <?php echo $GLOBALS['site_name']; ?>
            </a>
            <!--<a href="#" class="item">Home</a>-->
            <a href="?page=import" class="item">Importation</a>
            <div class="ui simple dropdown item">
                Dropdown <i class="dropdown icon"></i>
                <div class="menu">
                    <a class="item" href="#">Link Item</a>
                    <a class="item" href="#">Link Item</a>
                    <div class="divider"></div>
                    <div class="header">Header Item</div>
                    <div class="item">
                        <i class="dropdown icon"></i>
                        Sub Menu
                        <div class="menu">
                            <a class="item" href="#">Link Item</a>
                            <a class="item" href="#">Link Item</a>
                        </div>
                    </div>
                    <a class="item" href="#">Link Item</a>
                </div>
            </div>
        </div>
    </div>

    <div class="ui main container">
        <?php echo $container; ?>
    </div>

    <div class="ui inverted vertical footer segment">
        <div class="ui center aligned container">
            <div class="ui stackable inverted divided grid">
                <div class="three wide column">
                    <h4 class="ui inverted header">Group 1</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">Link One</a>
                        <a href="#" class="item">Link Two</a>
                        <a href="#" class="item">Link Three</a>
                        <a href="#" class="item">Link Four</a>
                    </div>
                </div>
                <div class="three wide column">
                    <h4 class="ui inverted header">Group 2</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">Link One</a>
                        <a href="#" class="item">Link Two</a>
                        <a href="#" class="item">Link Three</a>
                        <a href="#" class="item">Link Four</a>
                    </div>
                </div>
                <div class="three wide column">
                    <h4 class="ui inverted header">Group 3</h4>
                    <div class="ui inverted link list">
                        <a href="#" class="item">Link One</a>
                        <a href="#" class="item">Link Two</a>
                        <a href="#" class="item">Link Three</a>
                        <a href="#" class="item">Link Four</a>
                    </div>
                </div>
                <div class="seven wide column">
                    <h4 class="ui inverted header">Footer Header</h4>
                    <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                </div>
            </div>
            <div class="ui inverted section divider"></div>
            <img src="image/logo_small.png" class="ui centered image">
            <div class="ui horizontal inverted small divided link list">
                <a class="item" href="#">Site Map</a>
                <a class="item" href="#">Contact Us</a>
                <a class="item" href="#">Terms and Conditions</a>
                <a class="item" href="#">Privacy Policy</a>
            </div>
        </div>
    </div>

</body>
<script>
    function repositionDiagramLabels(ratio) {
        $(".box").each(function() {
            var img = document.getElementById('illustration');
            var ratio = img.width / img.naturalWidth;
            var e = $(this),
                t = e.data("originleft") * ratio - 2,
                n = e.data("origintop") * ratio - 2,
                r = e.data("originwidth") * ratio + 4,
                i = e.data("originheight") * ratio + 4;
            e.css("left", t + "px").css("top", n + "px").css("width", r + "px").css("height", i + "px")
        })
    }

    $(window).on("load", function() {
        repositionDiagramLabels();
    });

    $(window).resize(function() {
        repositionDiagramLabels();
    });

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

    $('.ui.radio.checkbox').checkbox();
    $('.ui.checkbox').checkbox();
    $('select.dropdown').dropdown();
</script>

</html>