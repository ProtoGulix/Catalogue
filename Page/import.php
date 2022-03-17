<?php

/**
 * Script d'importation des scanne de fichier PDF
 * Recherche dans le dossier DATA
 * 
 * 
 */

function Agregateur($path)
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
    // Scan du repertoire
    $rep = opendir($path) or die('Erreur');
    while ($entry = @readdir($rep)) {

        // Chemin absolut de l'image
        $e_abs = $path . '/' . $entry;

        if (is_file($e_abs) && $entry != '..' && $entry != '.') {

            
            $path_entry = $e_abs . '/' . $entry; // Chemin de l'entre scanné
            $base = basename($path_entry, '.jpg'); // Nom de fichier image
            $data_base = $path . '/' . 'csv' . '/' . $base . '.csv'; // Reconstitution du chemin du fichier Data

            if (is_file($data_base)) {
                $id = substr($base, strrpos($base, '-') + 1);
                $option[$id] = $base;
            }
        }
    }
    if (empty($option)) {
        return FALSE;
    } else {
        return [
            'Table' => 'Selects',
            'Label' => 'Pages à importé',
            'Name' => 'PageValid',
            'Value' => $option,
            'Multi' => TRUE
        ];
    }
}


$home = 'temps'; // Racine du dossier d'importation


$data = $bdd->query('SELECT * FROM catalogue');
while ($r = $data->fetch(PDO::FETCH_ASSOC)) {
    $option_catalogue[$r['id']] = $r['name'];
}
$select_catalogue = [
    'Table' => 'Selects',
    'Label' => 'Catalogue',
    'Name' => 'CatalogueValid',
    'Value' => $option_catalogue
];


// Controle du dossier d'importation
if (is_dir($home)) {

    $i_dir = 0; // Compte des dossier trouvé
    $dir = array_slice(scandir($home), 2); // Scan

    foreach ($dir as $value) {
        $sub_dir = $home . '/' . $value; // Chemin asbolut du repertoire
        $content = NULL; // Initialisation du contenu

        if (is_dir($sub_dir)) {
            $i_dir = $i_dir + 1;

            $content = Agregateur($sub_dir);

            if ($content) {
                $hidden = [
                    'Table' => 'Hidden',
                    'Name' => 'FolderValid',
                    'Value' => $value
                ];
                $Data = ['Cible' => 'POST.php', 'Bouton' => 'Importer', 'Fields' => [$select_catalogue, $content, $hidden]];
                $form = new CATA\Form\View($Data);
                $content_form = $form->HTML();
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
            'text' => '<b>' . $i_dir . '</b> dossier d\'importation trouvé',
            'type' => 'info'
        ]
    );
    $container .= $info->View();
    foreach ($card as $value) {
        $container .= $value->View();
    }
} else {
    $warning = new \CATA\View\Alerte(
        [
            'text' => 'Erreur le fichier <b>' . $home . '</b> n\'existe pas',
            'type' => 'danger'
        ]
    );
    $container .= $warning->View();
}
