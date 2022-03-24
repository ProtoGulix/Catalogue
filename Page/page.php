<?php

if (isset($_GET['no']) && isset($_GET['catalogue'])) {

    $session = new \CATA\Session();
    $catalogue = intval($_GET['catalogue']);
    $page = intval($_GET['no']);

    if ($catalogue > 0 && $page > 0) {

        $image_h = NULL;
        $image_w = NULL;
        $col1 = NULL;
        $col2 = NULL;

        $p = $bdd->query('SELECT * FROM page WHERE id_catalogue=' . $catalogue . ' AND numero=' . $page);
        $data_p = $p->fetch(PDO::FETCH_ASSOC);

        $path = $data_p['image'];

        if (is_file($path)) {
            $size = getimagesize($path);
            $image_w = $size[0];
            $image_h = $size[1];
        } else {
            $alerte = new \CATA\View\Alerte(['text' => 'Image introuvable', 'type' => 'danger']);
            $container .= $alerte->View();
        }

        $ratio = 0.5;

        $d = NULL;
        $b = NULL;
        $box = NULL;

        $data = $bdd->query('SELECT * FROM `bloc` WHERE id_catalogue=' . $catalogue . ' AND page=' . $page);

        while ($r = $data->fetch(PDO::FETCH_ASSOC)) {

            $bloc = new \CATA\Catalogue\Bloc($r);

            $b_data = ['Bloc' => $bloc, 'Ratio' => $ratio];
            $box = new \CATA\View\Box($b_data);
            $b .= $box->View();

            if ($session->Check()) {
                $edit_query = ['page' => 'edit', 'id' => $bloc->Id()];
                $edit_data = ['text' => 'Edition', 'query' => $edit_query, 'class' => 'btn btn-outline-primary btn-sm'];
                $edit = new CATA\View\Link($edit_data);

                $supr_query = ['page' => 'supp', 'id' => $bloc->Id()];
                $supr_data = ['text' => 'Suppression', 'query' => $supr_query, 'class' => 'btn btn-danger btn-sm'];
                $supr = new CATA\View\Link($supr_data);

                $link = '<div class="btn-group">' . $edit->View() . $supr->View() . '</div>';
            } else {
                $link = NULL;
            }

            $d[] = ['block_num' => $bloc->BlockNum(), 'text' => $bloc->Text() . $link];
        }

        $donnees['Header'] = ['Texte'];
        $donnees['Content'] = $d;


        $table = new CATA\View\Tableau(['Header' => ['Texte'], 'Content' => $d, 'id' => 'page-image']);

        $card_image = new \CATA\View\Card(['content' => '']);

        $col1 .= '<div class="card border p-3 rounded bg-dark text-center" id="page-image"><div class="position-relative m-auto" width="' . round($image_w * $ratio) . '"><img width="' . round($image_w * $ratio) . '" height="' . round($image_h * $ratio) . '" src="' . $path . '"/>' . $b . '</div></div>';
        $col1 .= $table->View();

        $card_info = new \CATA\View\Card(['content' => 'Test']);
        $col2 = $card_info->View();

        $container .= '<div class="row"><div class="col-9">' . $col1 . '</div><div class="col">' . $col2 . '</div>';
    } else {
        include($page_dir . 'error-404.php');
    }
}
