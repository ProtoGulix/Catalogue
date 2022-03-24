<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Securité
 */
//On démarre les sessions
session_start();

$container = NULL;
$catalogue = NULL;
$affi_erreur = NULL;

$page_dir = 'Page/';
$page_folder = array_slice(scandir($page_dir), 2);

$bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

function ChaineAleatoire($longueur = 10)
{
    $caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $longueurMax = strlen($caracteres);
    $chaineAleatoire = '';
    for ($i = 0; $i < $longueur; $i++) {
        $chaineAleatoire .= $caracteres[rand(0, $longueurMax - 1)];
    }
    return $chaineAleatoire;
}

include 'POST.php';

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

$e = [
    'text' => 'Erreur 1',
    'type' => 'danger'
];
$e2 = [
    'text' => 'Erreur 2',
    'type' => 'success'
];


if (!empty($GLOBALS['affi_erreur'])) {
    $e = new \CATA\View\Alerte($GLOBALS['affi_erreur']);
    $container .= $e->View();
}

// La variable $page_dir existe-elle dans l'url ?
if (!empty($_GET['page'])) {
    if (in_array($_GET['page'] . '.php', $page_folder, True)) {
        // Oui, alors on l'importe
        include($page_dir . $_GET['page'] . '.php');
    } else {
        // Non, alors on importe un fichier par défaut
        include($page_dir . 'error-404.php');
    }
} else {
    // Non, on affiche la page d'accueil par défaut
    include($page_dir . 'accueil.php');
}
