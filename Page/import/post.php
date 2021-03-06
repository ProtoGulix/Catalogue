<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// SI une session est ouverte 
if ($session->Check()) {

    foreach ($_POST as $key => $value) {

        switch ($key) {
                /**
             * Case Page
             * 
             * Traitement des donnée du formulaire d'ajout d'une page
             */
            case 'page':

                $catalogue = intval($value['CatalogueValid']); // ID Catalogue dans la BDD
                $folder = htmlspecialchars($value['FolderValid']); // Nom du dossier dans dans le repertoire temporaire

                if (isset($value['PageValid'])) {
                    $page = $value['PageValid']; // !!! ARRAY !!! Numéro pages à importé
                } else {
                    $page = NULL;
                }

                $path = $GLOBALS['dir_temp'] . '/' . $folder; // Chemin du repertoire

                /**
                 * Si le repertoire existe
                 * Si l'ID du catalogue existe > 0
                 * 
                 */
                if (is_dir($path) && $catalogue > 0 && !is_null($page)) {

                    foreach ($page as $page_no) {

                        $test_page = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $page_no);
                        $data_page = $test_page->fetch(PDO::FETCH_ASSOC);

                        if (empty($data_page)) {
                            // Création de la page
                            try {
                                $page_query = "INSERT INTO page(id_catalogue, numero, image, thumb) VALUES (?, ?, ?, ?)";
                                $page = $bdd->prepare($page_query); // Préparation de la requéte
                                $image_full = ChaineAleatoire(60) . '.jpg'; // Nouveau nom du fichier
                                $image_origine = $path . '/' . $folder . '-' . $page_no . '.jpg';
                                $i = new \CATA\Document\Image($image_origine); // Hydratation Image

                                // Si le fichier est deplacer on execute la requete
                                if ($i->Existe() && $i->Move($GLOBALS['dir_image_page'] . '/' .  $image_full)) {
                                    $image_thumb = ChaineAleatoire(60) . '.jpg';
                                    $i->Resize($GLOBALS['dir_image_page'] . '/' . $image_thumb, 400, 400);
                                    $page->execute([$catalogue, $page_no, $image_full, $image_thumb]);
                                    $test_page = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $page_no);
                                    $data_page = $test_page->fetch(PDO::FETCH_ASSOC);
                                } else {
                                    echo 'erreur deplacement fichier image';
                                }
                            } catch (Exception $e) {
                                die('ERREUR : ' . $e);
                            }
                        } else {
                            // Page déjà crée !
                        }
                        // Hydratation du CSV
                        $liste_block = new CATA\Document\CSV($path . '/csv/' . $folder . '-' . $page_no . '.csv');
                        $b = NULL;

                        foreach ($liste_block->Data() as $value) {

                            if (intval($value['level']) == 4) {

                                $b['id_page'] = $data_page['id'];
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
                                    $b['text'] = trim($b['text']);

                                    $test_bloc = $bdd->query('SELECT * FROM bloc WHERE id_catalogue=' . $catalogue . ' AND page=' . $page_no . ' AND block_num=' . $b['block_num']);

                                    if (empty($test_bloc->fetch(PDO::FETCH_ASSOC))) {
                                        // Création du bloc

                                        $bloc_query = "INSERT INTO bloc(block_num, `left`, top, width, height, conf, text, id_page) VALUES (:block_num, :left, :top, :width, :height, :conf, :text, :id_page)";
                                        $bloc = $bdd->prepare($bloc_query);

                                        $bloc->execute($b);
                                    } else {
                                        // Bloc déjà présent
                                    }

                                    $b = NULL; // Initialisation de la variable
                                }
                            }
                        }
                        if (!unlink($liste_block->Dir())) {
                            $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Impossible de supprimer <b>' . $liste_block->Dir() . '</b>', 'type' => 'danger'];
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
                        $modif = $bdd->prepare("UPDATE catalogue SET name=?, date_modif=? WHERE id=?");
                        $modif->execute([$name, time(), $catalogue]);
                    } catch (Exception $e) {
                        die('Erreur : ' . $e);
                    }
                    // SUCCESS
                    $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Le nom du catalogue à bien été modifier', 'type' => 'success'];
                } elseif ($catalogue == 0 && !empty($name)) {
                    $create = $bdd->prepare("INSERT INTO catalogue(name, date_creation) VALUES (?,?)");
                    $create->execute([$name, time()]);
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
