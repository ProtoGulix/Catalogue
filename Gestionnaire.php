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

include 'Core/Langue/local.php';

$container = NULL;

try {
    $bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

    include 'Core/function.php';  // 
    include 'POST.php';

    $query['page'] = 'accueil';
    $query['catalogue'] = 0;
    $query['no'] = 1;
    $query['ordre'] = NULL;
    $query['selection'] = NULL;
    $query['id'] = NULL;

    foreach ($_GET as $query_string_variable => $value) {
        switch ($query_string_variable) {
            case 'page':
                $query['page'] = strval($value);
            case 'catalogue':
                if ($value == 0) {
                    $value++;
                }
                $query['catalogue'] = intval($value);
                break;
            case 'no':
                if ($value == 0) {
                    $value++;
                }
                $query['no'] = intval($value);
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


    $page_folder = array_slice(scandir($GLOBALS['dir_page'] . '/'), 2);

    // La variable $GLOBALS['dir_page] existe-elle dans l'url ?
    if (!empty($_GET['page'])) {
        if (in_array($_GET['page'] . '.php', $page_folder, True)) {
            // Oui, alors on l'importe
            include($GLOBALS['dir_page'] . '/' . $_GET['page'] . '.php');
        } else {
            // Non, alors on importe un fichier par défaut
            include($GLOBALS['dir_page'] . '/' . 'error-404.php');
        }
    } else {
        // Non, on affiche la page d'accueil par défaut
        include($GLOBALS['dir_page'] . '/' . 'accueil.php');
    }


    //code...
} catch (Exception $e) {
    include($GLOBALS['dir_page'] . '/' . 'error-500.php');
    $container .= $e;
}
