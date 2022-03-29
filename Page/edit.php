<?php

/**
 * Page EDIT
 */

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
        foreach ($data_p as $key => $value) {
            switch ($key) {
                case 'id':
                    $container .= '[' . $key . '] ' . $value . '</br>';
                    # code...
                    break;
                case 'id_catalogue':
                    $container .= '[' . $key . '] ' . $value . '</br>';
                    # code...
                    break;
                case 'numero':
                    $container .= '[' . $key . '] ' . $value . '</br>';
                    # code...
                    break;
                case 'id':
                    $container .= '[' . $key . '] ' . $value . '</br>';
                    # code...
                    break;
                case 'image':
                    $i = new \CATA\Document\Image($GLOBALS['dir_image_page'] . '/' . $value);
                    $badge['text'] = 'Image';

                    if ($i->Existe()) {
                        $badge['type'] = 'success';
                    } else {
                        $badge['type'] = 'warning';
                    }

                    $b = new \CATA\View\Badge($badge);
                    $container .= $b->View();
                    # code...
                    break;
                case 'thumb':
                    $i = new \CATA\Document\Image($GLOBALS['dir_image_page'] . '/' . $value);
                    $badge['text'] = 'Thumb';

                    if ($i->Existe()) {
                        $badge['type'] = 'success';
                    } else {
                        $badge['type'] = 'warning';
                    }

                    $b = new \CATA\View\Badge($badge);
                    $container .= $b->View();
                    # code...
                    break;
            }
        }
    }
}
