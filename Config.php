<?php

namespace CATA;

// Decalaration de L'Autoloader
include 'Core/Autoloader.php';
Autoloader::register();

echo '<link rel="stylesheet" href="vendor/bootstrap/4.0.0/css/bootstrap.min.css">';
echo '<script src="vendor/bootstrap/5.0.2/js/bootstrap.min.js"></script>';
echo '<script src="vendor/jquery/jquery.min.js"></script>';
echo '<script src="vendor/jquery.imagemapster.min.js"></script>';
echo '<link rel="stylesheet" href="vendor/style.css">';


/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$dsn = 'mysql:host=localhost;dbname=catalogue;charset=utf8';
$username = 'root';

$pays = ['France', 'Allemagne', 'Protugal', 'Japon', 'Corée', 'Irland'];
/*
$Dat[0] = ['Table' => 'TextLong', 'Label' => 'Message', 'Name' => 'msg', 'Value' => 'Ecrie ici ton message', 'Cols' => 60, 'Rows' => 6];
$Dat[1] = ['Table' => 'Text', 'Label' => 'Titre', 'Name' => 'titre', 'Value' => 'Donne un titre a ton message', 'Type' => 'text', 'Size' => 60];
$Dat[2] = ['Table' => 'Check', 'Label' => 'J\'aime la banane au chocolat !', 'Name' => 'aime', 'Value' => 'J\'aime la banane au chocolat !', 'Type' => 'checkbox', 'Checked' => FALSE, 'Protected' => FALSE];
$Dat[3] = ['Table' => 'Selects', 'Label' => 'Langue', 'Name' => 'langue', 'Value' => $pays, 'Multi' => FALSE];

$Data = ['Titre' => 'Formulaire de Test', 'Legend' => 'Teste des fonctionnalité du formualaire. Ce texte vous permet de donnée des informations suplémentaire sur les fonction de celui ci.', 'Cible' => 'comments.php', 'Bouton' => 'Envoyer', 'Fields' => $Dat];

$Pseudo = ['Table' => 'Text', 'Label' => 'Pseudo', 'Name' => 'identif', 'Value' => '', 'Type' => 'text'];
$MDP = ['Table' => 'Text', 'Label' => 'Mot de passe', 'Name' => 'password', 'Value' => '', 'Type' => 'password'];

$Login = [];
$Login [] = $Pseudo;
$Login [] = $MDP;

$Connection = ['Titre' => 'Connection', 'Legend' => 'Connection a l\'espace membre', 'Cible' => 'index.php', 'Bouton' => 'Connexion', 'Fields' => $Login];
*/