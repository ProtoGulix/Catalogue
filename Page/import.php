<?php

/**
 * Script d'importation des scanne de fichier PDF
 * Recherche dans le dossier DATA
 * 
 * 
 */

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
    $data = $bdd->query('SELECT * FROM catalogue');
    while ($r = $data->fetch(PDO::FETCH_ASSOC)) {
        $option_catalogue[$r['id']] = $r['name'];
    }
    return $option_catalogue;
}

$home = 'temps'; // Racine du dossier d'importation
$col1 = NULL;

$select_catalogue = [
    'Table' => 'Selects',
    'Label' => 'Catalogue',
    'Name' => 'CatalogueValid',
    'Value' => array_merge(['-1' => '-- Selectionnez un catalogue --'], ListCatalogue($bdd))
];

// Controle du dossier d'importation
if (is_dir($home)) {

    $i_dir = 0; // Compte des dossier trouvé
    $dir = array_slice(scandir($home), 2); // Scan

    foreach ($dir as $value) {
        $sub_dir = $home . '/' . $value; // Chemin asbolut du repertoire
        $option_valid = NULL; // Initialisation du contenu

        if (is_dir($sub_dir)) {
            $i_dir = $i_dir + 1;

            $option_valid = ControleDataPage($sub_dir);

            if ($option_valid) {
                $hidden = [
                    'Table' => 'Hidden',
                    'Name' => 'FolderValid',
                    'Value' => $value
                ];
                $option = [
                    'Table' => 'Selects',
                    'Label' => 'Pages à importé',
                    'Name' => 'PageValid',
                    'Value' => $option_valid,
                    'Multi' => TRUE
                ];
                $Data = ['Cible' => '?page=import', 'Bouton' => 'Importer', 'Name' => 'page', 'Fields' => [$select_catalogue, $option, $hidden]];
                $form = new CATA\Form\View($Data);
                $content_form = $form->View();
            } else {
                $content_form = 'Ce dossier est vide !';
            }

            $card[] = new CATA\View\Card(
                [
                    'header' => $sub_dir,
                    'content' => $content_form
                ]
            );
        }
    }

    $info = new \CATA\View\Alerte(
        [
            'text' => '<b>' . $i_dir . '</b> dossiers d\'importation trouvé',
            'type' => 'info'
        ]
    );
    $col1 .= $info->View();
    foreach ($card as $value) {
        $col1 .= $value->View();
    }
} else {
    $warning = new \CATA\View\Alerte(
        [
            'text' => 'Erreur le fichier <b>' . $home . '</b> n\'existe pas',
            'type' => 'danger'
        ]
    );
    $col1 .= $warning->View();
}



$text = [
    'Table' => 'Text',
    'Name' => 'NomCatalogue',
    'Placeholder' => 'Nom du catalogue'
];
$Data = ['Cible' => '?page=import', 'Bouton' => 'Crée', 'Name' => 'catalogue', 'Fields' => [$select_catalogue, $text]];
$form = new CATA\Form\View($Data);
$catalogue_form = $form->View();

$new_catalog = new CATA\View\Card(
    [
        'header' => 'Catalogue',
        'content' => $catalogue_form
    ]
);



$container .= '<div class="row"><div class="col-8">' . $col1 . '</div><div class="col-4">' . $new_catalog->View() . '</div></div>';
