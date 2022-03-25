<?php

$home = $GLOBALS['dir_temp']; // Racine du dossier d'importation
$col1 = NULL;

$select_catalogue = [
    'Table' => 'Selects',
    'Label' => 'Catalogue',
    'Name' => 'CatalogueValid',
    'Value' => array_merge(['-1' => '-- Selectionnez un catalogue --'], ListCatalogue($bdd))
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
} else {
}
