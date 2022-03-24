<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//include 'Config.php';
//$bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

$session = new \CATA\Session();

if ($session->Check()) {

    foreach ($_POST as $key => $value) {

        switch ($key) {
            case 'page':

                $catalogue = intval($value['CatalogueValid']); // ID Catalogue dans la BDD
                $folder = htmlspecialchars($value['FolderValid']); // Nom du dossier dans dans le repertoire temporaire

                if (isset($value['PageValid'])) {
                    $page = $value['PageValid']; // !!! ARRAY !!! Numéro pages à importé
                } else {
                    $page = NULL;
                }

                $path = 'temps/' . $folder; // Chemin du repertoire

                /**
                 * Si le repertoire existe
                 */
                if (is_dir($path) && $catalogue > 0 && !is_null($page)) {

                    foreach ($page as $p) {

                        $test_page = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $p);

                        if (empty($test_page->fetch())) {
                            // Création de la page
                            try {
                                $page_query = "INSERT INTO page(id_catalogue, numero, image) VALUES (?, ?, ?)";
                                $page = $bdd->prepare($page_query);
                                $image = $path . '/' . $folder . '-' . $p . '.jpg';
                                $page->execute([$catalogue, $p, $image]);
                            } catch (Exception $e) {
                                die('ERREUR : ' . $e);
                            }

                            $compte_page .= +1;
                        } else {
                            // Page déjà crée !
                        }
                        // Hydratation du CSV
                        $path_csv = $path . '/csv/' . $folder . '-' . $p . '.csv';
                        $liste_block = new CATA\Document\CSV($path_csv);
                        $b = NULL;

                        foreach ($liste_block->Data() as $value) {

                            if (intval($value['level']) == 4) {

                                $b['catalogue'] = $catalogue;
                                $b['page'] = $p;
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

                                    $test_bloc = $bdd->query('SELECT * FROM bloc WHERE id_catalogue=' . $catalogue . ' AND page=' . $p . ' AND block_num=' . $b['block_num']);

                                    if (empty($test_bloc->fetch(PDO::FETCH_ASSOC))) {
                                        // Création du bloc

                                        $bloc_query = "INSERT INTO bloc(id_catalogue, page, block_num, `left`, top, width, height, conf, text) VALUES (:catalogue, :page, :block_num, :left, :top, :width, :height, :conf, :text)";
                                        $bloc = $bdd->prepare($bloc_query);

                                        $bloc->execute($b);
                                    } else {
                                        // Bloc déjà présent
                                    }

                                    $b = NULL; // Initialisation de la variable
                                }
                            }
                        }
                        if (!unlink($path_csv)) {
                            $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Impossible de supprimer <b>' . $path_csv . '</b>', 'type' => 'danger'];
                        }
                    }
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'La page à bien été importé', 'type' => 'success'];
                } else {
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Une erreur c\'est produit', 'type' => 'danger'];
                }

                # code...
                break;

            case 'catalogue':

                $catalogue = intval($value['CatalogueValid']);
                $name = htmlspecialchars($value['NomCatalogue']);

                if ($catalogue > 0) {
                    try {
                        $modif = $bdd->prepare("UPDATE catalogue SET name=? WHERE id=?");
                        $modif->execute([$name, $catalogue]);
                    } catch (Exception $e) {
                        die('Erreur : ' . $e);
                    }
                    // SUCCESS
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Le nom du catalogue à bien été modifier', 'type' => 'success'];
                } elseif ($catalogue == 0 && !empty($name)) {
                    $create = $bdd->prepare("INSERT INTO catalogue(name) VALUES (?)");
                    $create->execute([$name]);
                    // SUCCESS
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Le catalogue <b>' . $name . '</b> à bien été crée.', 'type' => 'success'];
                } else {
                    // ERREUR
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Erreur lors de la création du catalogue.', 'type' => 'danger'];
                }

                // Code ...
                break;

            default:
                //$GLOBALS['affi_erreur'] = ['text' => 'La requette ne peux pas étre traiter.', 'type' => 'danger'];
                break;
        }
    }
} else {
}
