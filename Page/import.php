<?php

$home = $GLOBALS['dir_temp']; // Racine du dossier d'importation
$col1 = NULL;
$content_form = NULL;

$list_catalogue[0] = F_IMPOR_CATA_SELECT_NEW;
$list_catalogue = ListCatalogue($bdd);

$select_catalogue = [
    'Table' => 'Selects',
    'Label' => F_IMPOR_CATA_SELECT_LABEL,
    'Name' => 'CatalogueValid',
    'Value' => $list_catalogue
];

$session = new \CATA\Session();
if ($session->Check()) {
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
                        'Label' => F_IMPOR_PAGE_IMPORT,
                        'Value' => $value
                    ];
                    $option = [
                        'Table' => 'Selects',
                        'Label' => 'Pages à importé',
                        'Name' => 'PageValid',
                        'Value' => $option_valid,
                        'Multi' => TRUE
                    ];
                    $form = new CATA\Form\View(
                        [
                            'header' => $sub_dir,
                            'Cible' => '?page=import',
                            'Bouton' => 'Importer',
                            'Name' => 'page',
                            'Fields' => [$select_catalogue, $option, $hidden]
                        ]
                    );
                    $content_form .= $form->View();
                }
            }
        }

        $col1 .= $content_form;
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
    $Data = ['Header' => 'Edit Catalogue', 'Cible' => '?page=import', 'Bouton' => 'Crée', 'Name' => 'catalogue', 'Fields' => [$select_catalogue, $text]];
    $catalogue_form = new CATA\Form\View($Data);

    $container .= '<div class="row"><div class="col-8">' . $col1 . '</div><div class="col-4">' . $catalogue_form->View() . '</div></div>';
} else {
    header('Status: 301 Moved Permanently', false, 301);
    header('Location: ' . $racine . '?page=session');
    exit();
}
