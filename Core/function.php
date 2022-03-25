<?php

/**
 * Function
 */

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

function ControleDataPage($path)
/**
 * Recherche les paires Image (jpg) <-> Data (csv) en fonction de leurs nom
 * Retour la liste des nom qui sont en paire
 * 
 * $Path
 * |-- image-1.jpg
 * |-- image-2.jpg
 * |-- CSV Folder
 *      |-- image-1.csv
 *      |-- image-2.csv
 *
 */
{
    $rep = opendir($path) or die('Erreur'); // Ouverture du repertoire
    while ($entry = @readdir($rep)) {

        $e_abs = $path . '/' . $entry; // Chemin absolut de l'image

        if (is_file($e_abs) && $entry != '..' && $entry != '.') {
            //Controle du type d'entre
            $path_entry = $e_abs . '/' . $entry; // Chemin de l'entre scanné
            $base = basename($path_entry, '.jpg'); // Nom de fichier image
            $data_base = $path . '/' . 'csv' . '/' . $base . '.csv'; // Reconstitution du chemin du fichier Data

            if (is_file($data_base)) {
                // Controle du fichier Data
                $id = substr($base, strrpos($base, '-') + 1); // ID = numéro de la page valide
                $value[$id] = $base; // [NumPageValid] => NomPageValid
            }
        }
    }
    if (empty($value)) {
        // Si pas de valeur trouvé on retourne FALSE     
        return FALSE;
    } else {
        // Si il y a des valeurs on retour un tableau
        return $value;
    }
}

function ListCatalogue($bdd)
{
    try {
        $data = $bdd->query('SELECT * FROM catalogue');
        while ($r = $data->fetch(PDO::FETCH_ASSOC)) {
            $option_catalogue[$r['id']] = $r['name'];
        }
        return $option_catalogue;
    } catch (Exception $e) {
        die('Erreur de lecture de la base de donnée');
    }
}
