<?php

include 'Page/editpage/post.php';

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

        $field[] = ['Table' => 'Text', 'type' => 'text', 'name' => 'page_title', 'value' => $page->Titre()];
        $form_page = new \CATA\Form\View(['Fields' => $field, 'cible' => '?page=editpage&id=' . $id, 'bouton' => 'Envoyer']);

        $table_bloc = new \CATA\View\Tableau(['header' => $table_header, 'content' => $table_row]);
        $row = '<div class="ui column grid"><div class="column five wide">' . $page->ViewInfo() . $form_page->View() . '</div><div class="column eleven wide">' . $page->ViewImage() . '</div></div>';


        $form = new \CATA\Form\View(['Legend' => $table_bloc->View(), 'cible' => '?page=editpage&id=' . $id, 'bouton' => 'Envoyer']);
        $container .= $row . '<h4 class="ui horizontal divider header"><i class="bar chart icon"></i>Specifications</h4>' . $form->View();
    }
}
