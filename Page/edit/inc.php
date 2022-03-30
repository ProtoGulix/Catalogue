<?php

include 'Page/edit/post.php';

/**
 * Page EDIT
 */

/** Initialisation des variable */
$card_c = NULL;

/** Controle du GET  */
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
}

/** Controle de la session */
$session = new \CATA\Session();
// Si valide
if ($session->Check()) {


    $p = $bdd->query('SELECT * FROM page WHERE id=' . $id);
    if ($data_p = $p->fetch(PDO::FETCH_ASSOC)) {

        $b = $bdd->query('SELECT * FROM bloc WHERE id_page=' . $id);
        while ($data_b = $b->fetch(PDO::FETCH_ASSOC)) {
            $data_p['Bloc'][] = $data_b;
        }
        $page = new \CATA\Catalogue\Page($data_p);
        $card_c .= CheckBadge($page->Image()->Existe(), 'Image');
        $card_c .= CheckBadge($page->Thumb()->Existe(), 'Miniature');
        $card_c .= '<p>ID ' . $page->Id() . '</p>';
        $card_c .= '<p>ID CATALOGUE' . $page->IdCatalogue() . '</p>';
        $card_c .= '<p>NUMERO ' . $page->Numero() . '</p>';
        $card_c .= '<p>TYPE ' . $page->Type() . '</p>';
        $card_c .= '<p>TITRE ' . $page->Titre() . '</p>';

        $card = new \CATA\View\Card(['Header' => 'Info Page', 'Content' => $card_c]);
        $table_header = ['id', 'content', 'title', 'fusion', 'delete'];

        if (!empty($page->Bloc())) {
            foreach ($page->Bloc() as $v) {
                $b =  new \CATA\Catalogue\Bloc($v);
                $f_title = new \CATA\Field\Check(['type' => 'radio', 'name' => 'bloc_title', 'value' => $b->Id()]);
                $f_fusion = new \CATA\Field\Check(['type' => 'checkbox', 'name' => 'bloc_fusion[]', 'value' => $b->Id()]);
                $f_delete = new \CATA\Field\Check(['type' => 'checkbox', 'name' => 'bloc_delete[]', 'value' => $b->Id()]);
                $table_row[] = [$b->Id(), $b->Text(), $f_title->buildHTML(), $f_fusion->buildHTML(), $f_delete->buildHTML()];
            }
        } else {
            $table_row = NULL;
        }

        $table_bloc = new \CATA\View\Tableau(['header' => $table_header, 'content' => $table_row]);
        $form = new \CATA\Form\View(['Legend' => $table_bloc->View(), 'cible' => '?page=edit&id=' . $id, 'bouton' => 'Envoyer']);
        $card2 = new \CATA\View\Card(['Header' => 'Info Bloc', 'Content' => $page->ViewTableau()]);
        $container .= $card->View() . $form->View();
    }
}
