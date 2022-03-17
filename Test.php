<?php

if (isset($_GET['no'])) {
    $no = $_GET['no'];

    $dir = 'Data/series-3-part-manual-1';
    $path = $dir . '/' . 'series-3-part-manual-1' . '-' . $no;
    $image = $path . '.jpg';

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
            if (!is_null($bloc) and $bloc['conf'] > 50) {
                $bloc['text'] = $bloc['text'];
                $data[] = $bloc;
                $bloc = NULL; // Initialisation de la variable
            }
        }
    }

    $test_page = $bdd->prepare('SELECT * FROM `page` WHERE id_catalogue=:id_catalogue AND numero=:numero');
    $test_page->execute(array(':id_catalogue' => $catalogue, ':numero' => $no));

    if (empty($test_page->fetch(PDO::FETCH_ASSOC))) {
        $page = $bdd->prepare("INSERT INTO `page`(`id_catalogue`, `numero`, `image`) VALUES (:id_catalogue, :numero, :image)");

        $page->bindParam(':id_catalogue', $catalogue);
        $page->bindParam(':numero', $no);
        $page->bindParam(':image', $image);

        $page->execute();
    } else {
        $container .= 'Page déjà crée !';
    }

    foreach ($data as $value) {
        try {

            $bdd = new PDO($dsn, $username);
            $test_bloc = $bdd->prepare('SELECT * FROM `bloc` WHERE catalogue=:catalogue AND page=:page AND block_num=:block_num');
            $test_bloc->execute(array(':catalogue' => $catalogue, ':page' => $no, ':block_num' => $value['block_num']));

            if (empty($test_bloc->fetch(PDO::FETCH_ASSOC))) {

                $bloc = $bdd->prepare("INSERT INTO `bloc`(`catalogue`, `page`, `block_num`, `left`, `top`, `width`, `height`, `conf`, `text`) VALUES (:catalogue, :page, :block, :left, :top, :width, :height, :conf, :text);");

                $bloc->bindParam(':catalogue', $catalogue);
                $bloc->bindParam(':page', $no);
                $bloc->bindParam(':block', $value['block_num']);
                $bloc->bindParam(':left', $value['left']);
                $bloc->bindParam(':top', $value['top']);
                $bloc->bindParam(':width', $value['width']);
                $bloc->bindParam(':height', $value['height']);
                $bloc->bindParam(':conf', $value['conf']);
                $bloc->bindParam(':text', $value['text']);

                $bloc->execute();
            } else {
                $container .= '</br> bloc :' . $value['block_num'];
            }
        } catch (Exception $ex) {

            die('Erreur : ' . $ex->getMessage());
        }
    }
}
