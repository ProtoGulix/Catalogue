<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$container = NULL;
$catalogue = NULL;

$page = 'Page/';
$page_folder = array_slice(scandir($page), 2);

$bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

$query['page'] = 'accueil';
$query['index'] = 1;
$query['ordre'] = NULL;
$query['selection'] = NULL;
$query['id'] = NULL;

foreach ($_GET as $query_string_variable => $value) {
    switch ($query_string_variable) {
        case 'page':
            $query['page'] = strval($value);
        case 'index':
            if ($value == 0) {
                $value++;
            }
            $query['index'] = intval($value);
            break;
        case 'ordre':
            $query['ordre'] = intval($value);
            break;
        case 'selection':
            $query['selection'] = $value;
            break;
        case 'id':
            $query['id'] = intval($value);
            break;
    }
}

// La variable $page existe-elle dans l'url ?
if (!empty($_GET['page'])) {
    if (in_array($_GET['page'] . '.php', $page_folder, True)) {
        // Oui, alors on l'importe
        include($page . $_GET['page'] . '.php');
    } else {
        // Non, alors on importe un fichier par défaut
        include($page . 'error-404.php');
    }
} else {
    // Non, on affiche la page d'accueil par défaut
    include($page . 'accueil.php');
}
