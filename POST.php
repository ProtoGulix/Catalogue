<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


include 'Config.php';

$bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

$catalogue = intval($_POST['CatalogueValid']); // ID Catalogue dans la BDD
$folder = $_POST['FolderValid']; // Nom du dossier dans dans le repertoire temporaire
$page = $_POST['PageValid']; // !!! ARRAY !!! Numéro pages à importé

$path = 'temps/' . $folder; // Chemin du repertoire


/**
 * Si le repertoire existe
 */
if (is_dir($path)) {

    foreach ($page as $p) {

        $test_page = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $p);

        if (empty($test_page->fetch(PDO::FETCH_ASSOC))) {
            $page = $bdd->prepare("INSERT INTO `page`(`id_catalogue`, `numero`, `image`) VALUES (:id_catalogue, :numero, :image)");

            $page->bindParam(':id_catalogue', $catalogue);
            $page->bindParam(':numero', $p);
            $image = $path . '/' . $folder . '-' . $p . '.jpg';
            $page->bindParam(':image', $image);

            $page->execute();
        } else {
            echo 'Page déjà crée !';
        }
        // Hydratation du CSV
        $liste_block = new CATA\Document\CSV($path . '/csv/' . $folder . '-' . $p . '.csv');
        $b = NULL;

        foreach ($liste_block->Data() as $value) {

            if (intval($value['level']) == 4) {

                $b['block_num'] = $value['block_num']; // Indice de confiance du bloc
                $b['left'] = $value['left']; // Position a gauche
                $b['top'] = $value['top']; // Position par rapport au haut
                $b['width'] = $value['width']; // Largeur
                $b['height'] = $value['height']; // Hauteur
                $b['conf'] = NULL; // Coéfficient
                $b['text'] = NULL; // Texte
            } elseif (intval($value['level']) == 5) {
                if ($b['conf'] < $value['conf']) {
                    $b['conf'] = $value['conf'];
                }
                $b['text'] .= $value['text'] . ' '; // Texte
            } else {
                if (!is_null($b) and $b['conf'] > 50) {
                    $b['text'] = $b['text'];

                    $test_bloc = $bdd->query('SELECT * FROM bloc WHERE catalogue=' . $catalogue . ' AND page=' . $p . ' AND block_num=' . $b['block_num']);

                    if (empty($test_bloc->fetch(PDO::FETCH_ASSOC))) {
                        echo '</br> Création du bloc';
                        $bloc = $bdd->prepare("INSERT INTO `bloc`(`catalogue`, `page`, `block_num`, `left`, `top`, `width`, `height`, `conf`, `text`) VALUES (:catalogue, :page, :block, :left, :top, :width, :height, :conf, :text);");

                        $bloc->bindParam(':catalogue', $catalogue);
                        $bloc->bindParam(':page', $p);
                        $bloc->bindParam(':block', $b['block_num']);
                        $bloc->bindParam(':left', $b['left']);
                        $bloc->bindParam(':top', $b['top']);
                        $bloc->bindParam(':width', $b['width']);
                        $bloc->bindParam(':height', $b['height']);
                        $bloc->bindParam(':conf', $b['conf']);
                        $bloc->bindParam(':text', $b['text']);

                        $bloc->execute();
                    } else {
                        echo '</br> Bloc déjà présent';
                    }

                    $b = NULL; // Initialisation de la variable
                }
            }
        }
    }
} else {
    echo 'echec';
}
