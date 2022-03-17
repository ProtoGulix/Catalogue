<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//include 'Config.php';
//$bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);

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

                    if (empty($test_page->fetch(PDO::FETCH_ASSOC))) {
                        $page_query = "INSERT INTO page(id_catalogue, numero, image) VALUES (?, ?, ?)";
                        $page = $bdd->prepare($page_query);
                        $image = $path . '/' . $folder . '-' . $p . '.jpg';
                        $page->execute([$catalogue, $p, $image]);
                    } else {
                        echo 'Page déjà crée !';
                    }
                    // Hydratation du CSV
                    $liste_block = new CATA\Document\CSV($path . '/csv/' . $folder . '-' . $p . '.csv');
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

                                $test_bloc = $bdd->query('SELECT * FROM bloc WHERE catalogue=' . $catalogue . ' AND page=' . $p . ' AND block_num=' . $b['block_num']);

                                if (empty($test_bloc->fetch(PDO::FETCH_ASSOC))) {
                                    echo '</br> Création du bloc';

                                    $bloc_query = "INSERT INTO bloc(catalogue, page, block_num, `left`, top, width, height, conf, text) VALUES (:catalogue, :page, :block_num, :left, :top, :width, :height, :conf, :text)";
                                    $bloc = $bdd->prepare($bloc_query);

                                    $bloc->execute($b);
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

            # code...
            break;

        case 'catalogue':

            $catalogue = intval($value['CatalogueValid']);
            $name = htmlspecialchars($value['NomCatalogue']);

            if ($catalogue > 0) {
                var_dump($value);
                $modif = $bdd->prepare("UPDATE catalogue SET name=? WHERE id=?");
                $modif->execute([$name, $catalogue]);
                echo 'modif catalogue';
            } elseif ($catalogue <= 0 && !isset($name)) {
                $create = $bdd->prepare("INSERT INTO catalogue(name) VALUES (?);");
                $create->execute([$name]);
                echo 'creation catalogue';
            } else {
                $e = new \CATA\View\Alerte(
                    [
                        'text' => 'Erreur lors de la création du catalogue.',
                        'type' => 'danger'
                    ]
                );
                $GLOBALS['affi_erreur'] .= $e->View();
            }


            // Code ...
            break;

        default:
            $e = new \CATA\View\Alerte(
                [
                    'text' => 'La requette ne peux pas étre traiter.',
                    'type' => 'danger'
                ]
            );
            $GLOBALS['affi_erreur'] = $e->View();

            # code...
            break;
    }
}
