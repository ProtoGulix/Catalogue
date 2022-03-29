<?php

/**
 * Page PAGE
 */

if (isset($_GET['no']) && isset($_GET['catalogue'])) {

    $session = new \CATA\Session(); // Controle de la Session
    $catalogue = intval($_GET['catalogue']);
    $page = intval($_GET['no']);

    if ($catalogue > 0 && $page > 0) {

        $col1 = NULL; // Initialisation de colonne
        $col2 = NULL; // Initialisation de colonne

        $p = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $page);
        if ($data_p = $p->fetch(PDO::FETCH_ASSOC)) {
            $data_p['Ratio'] = 0.35; // Ratio de l'illustration de la page

            // Recherche des bloc correspondant
            $data = $bdd->query('SELECT * FROM `bloc` WHERE id_catalogue=' . $catalogue . ' AND page=' . $page);
            while ($r = $data->fetch(PDO::FETCH_ASSOC)) {
                $field = NULL;
                $b = new \CATA\Catalogue\Bloc($r);

                if ($session->Check()) {
                    $field[] = ['Table' => 'Hidden', 'Name' => 'block_num', 'Value' => $b->BlockNum()];
                    $field[] = ['Table' => 'Text', 'Label' => 'Texte', 'Name' => 'text', 'Value' => $b->Text(), 'Type' => 'text', 'Size' => 60];
                    $b_form = new \CATA\Form\View([
                        'Header' => 'Modification',
                        'Cible' => '?page=import',
                        'Bouton' => 'Modifier',
                        'Name' => 'page',
                        'Fields' => $field
                    ]);

                    $data_p['Supp'][] = $b_form->View();
                }

                $data_p['Bloc'][] = $r; // Ajout du bloc trouvé dans la variable

            }

            $link_edit = new \CATA\View\Link(['text' => L_PAGE_EDITION, 'query' => ['page' => 'edit', 'id' => $data_p['id']]]);

            $o_page = new \CATA\Catalogue\Page($data_p); // Hydratation de la page

            $col1 .= $o_page->ViewImage(); // Affichage de l'image avec les bloc
            $pagination = new \CATA\View\Pagination(['TotalItems' => 60, 'ParPage' => 1, 'Delta' => 2, 'Query' => $query]);
            $text = $link_edit->View() . '<p>Liste des blocs:</p>';
            $col2 = $pagination->View() . $o_page->ViewInfo() . $text . $o_page->ViewTableau();

            $container .= '<div class="row h-100 pb-3"><div class="col h-100">' . $col1 . '</div><div class="col-4">' . $col2 . '</div>';
        } else {
            include($GLOBALS['dir_page'] . '/' . 'error-404.php');
        }
    } else {
        include($GLOBALS['dir_page'] . '/' . 'error-404.php');
    }
} else {
    $container .= 'Erreur';
}
