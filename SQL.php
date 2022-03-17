<?php

include 'Config.php';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$dsn = 'mysql:host=localhost;dbname=catalogue;charset=utf8';
$username = 'root';

$catalogue = 'series-3-part-manual-1';
$page = '10';


$dir = 'Data/series-3-part-manual-1';
$path = $dir . '/' . $catalogue . '-' . $page;

$liste = new CATA\Document\CSV($path . '.csv');
$bloc = NULL;

foreach ($liste->Data() as $value) {

    if (intval($value['level']) == 4) {

        $bloc['block_num'] = $value['block_num']; // Indice de confiance du bloc
        $bloc['left'] = $value['left']; // Position a gauche
        $bloc['top'] = $value['top']; // Position par rapport au haut
        $bloc['width'] = $value['width']; // Largeur
        $bloc['height'] = $value['height']; // Hauteur
        $bloc['conf'] = NULL; // Coéfficient
        $bloc['text'] = NULL; // Texte
    } elseif (intval($value['level']) == 5) {
        if ($bloc['conf'] < $value['conf']) {
            $bloc['conf'] = $value['conf'];
        }
        $bloc['text'] .= $value['text'] . ' ';
    } else {
        if (!is_null($bloc) AND $bloc['conf'] > 50) {
            $bloc['text'] =  $bloc['text'];
            $data[] = $bloc;
            $bloc = NULL;
        }
    }

}

foreach ($data as $value) {
    try {

        $bdd = new PDO($dsn, $username);

        $cmd = $bdd->prepare("INSERT INTO `bloc`(`catalogue`, `page`, `block_num`, `left`, `top`, `width`, `height`, `conf`, `text`) VALUES (:catalogue, :page, :block, :left, :top, :width, :height, :conf, :text);");

        $cmd->bindParam(':catalogue', $catalogue);
        $cmd->bindParam(':page', $page);
        $cmd->bindParam(':block', $value['block_num']);
        $cmd->bindParam(':left', $value['left']);
        $cmd->bindParam(':top', $value['top']);
        $cmd->bindParam(':width', $value['width']);
        $cmd->bindParam(':height', $value['height']);
        $cmd->bindParam(':conf', $value['conf']);
        $cmd->bindParam(':text', $value['text']);

        $cmd->execute();
    } catch (Exception $ex) {

        die('Erreur : ' . $ex->getMessage());
    }
}
