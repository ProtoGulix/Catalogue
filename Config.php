<?php

namespace CATA;

// Decalaration de L'Autoloader
include 'Core/Autoloader.php';
Autoloader::register();

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$dsn = 'mysql:host=localhost;dbname=catalogue;charset=utf8';
$username = 'root';

$racine = 'https://localhost/Catalogue/';

$dir_page = 'Page';
$dir_temp = 'temps';
$dir_image = 'Image';
$dir_image_page = 'Image/page';

$type_page = ['Inconue', 'Couverture', 'Index',];

/**
 * BootStrap Value
 */

$bs_colorval = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
