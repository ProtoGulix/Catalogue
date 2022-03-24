<?php

if (isset($_GET['no']) && isset($_GET['catalogue'])) {

    $session = new \CATA\Session(); // Controle de la Session
    $catalogue = intval($_GET['catalogue']);
    $page = intval($_GET['no']);

    if ($catalogue > 0 && $page > 0) {

        $col1 = NULL; // Initialisation de colonne
        $col2 = NULL; // Initialisation de colonne

        $p = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $page);
        $data_p = $p->fetch(PDO::FETCH_ASSOC);
        $data_p['Ratio'] = 0.5; // Ratio de l'illustration de la page

        // Recherche des bloc correspondant
        $data = $bdd->query('SELECT * FROM `bloc` WHERE id_catalogue=' . $catalogue . ' AND page=' . $page);
        while ($r = $data->fetch(PDO::FETCH_ASSOC)) {

            $data_p['Bloc'][] = $r; // Ajout du bloc trouvé dans la variable
        }

        $o_page = new \CATA\Catalogue\Page($data_p); // Hydratation de la page

        $col1 .= $o_page->ViewImage(); // Affichage de l'image avec les bloc
        $col1 .= $o_page->ViewTableau(); // Affichage du tableau correspondant 

        $card_info = new \CATA\View\Card(['content' => 'Test']);
        $col2 = $card_info->View();

        $container .= '<div class="row"><div class="col-9">' . $col1 . '</div><div class="col">' . $col2 . '</div>';
    } else {
        include($page_dir . 'error-404.php');
    }
} else {
    $container .= 'Erreur';
}
