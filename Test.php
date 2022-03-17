switch ($query['page']) {
    case 'accueil':


        $catalogue = 'series-3-part-manual-1';
        $folder = array_slice(scandir($dir . '/' . $catalogue), 2);
        natsort($folder);

        $i = 1;

        foreach ($folder as $value) {
            $path = $dir . '/' . $catalogue . '/' . $value;
            $image = new \CATA\Document\Image($path);

            if ($image->Existe() && $image->Type() == 'jpeg') {

                $query = ['page' => 'page', 'catalogue' => $catalogue, 'no' => $i];

                $link = new CATA\View\Link(['text' => $image->View('200'), 'query' => $query]);
                $container .= $link->View();
                $i++;
            }
        }

        break;
    case 'page':

        $catalogue = htmlspecialchars($_GET['catalogue']);
        $page = htmlspecialchars($_GET['no']);

        $image_h = NULL;
        $image_w = NULL;

        $path = $dir . '/' . $catalogue . '/' . $catalogue . '-' . $page;

        if (is_file($path . '.jpg')) {
            $size = getimagesize($path . '.jpg');
            $image_w = $size[0];
            $image_h = $size[1];
        }

        $ratio = 0.35;

        $d = NULL;
        $b = NULL;
        $box = NULL;

        $bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);
        $data = $bdd->prepare('SELECT `id`, `block_num`, `left`, `top`, `width`, `height`, `conf`, `text` FROM `bloc` WHERE page=:page');
        $data->execute(array(':page' => $page));

        while ($r = $data->fetch(PDO::FETCH_ASSOC)) {

            $bloc = new \CATA\Catalogue\Bloc($r);

            $b_data = ['Bloc' => $bloc, 'Ratio' => $ratio];
            $box = new \CATA\View\Box($b_data);
            $b .= $box->HTML();

            $edit_query = ['page' => 'edit', 'id' => $bloc->Id()];
            $edit_data = ['text' => 'Edition', 'query' => $edit_query, 'class' => 'btn btn-outline-primary btn-sm'];
            $edit = new CATA\View\Link($edit_data);

            $supr_query = ['page' => 'supp', 'id' => $bloc->Id()];
            $supr_data = ['text' => 'Suppression', 'query' => $supr_query, 'class' => 'btn btn-danger btn-sm'];
            $supr = new CATA\View\Link($supr_data);

            $link = '<div class="btn-group">' . $edit->View() . $supr->View() . '</div>';

            $d [] = ['block_num' => $bloc->BlockNum(), 'text' => $bloc->Text() . $link];
        }

        $donnees['Header'] = ['Texte'];
        $donnees['Content'] = $d;
        $table = new CATA\View\Tableau($donnees);

        $container .= '<div class="row"><div class="col-6">' . $table->View() . '</div>';
        $container .= '<div class="col-6"><div class="card border mt-3 rounded sticky-top"  width="' . round($image_w * $ratio) . 'px" height="' . round($image_h * $ratio) . 'px" ><img style="position: relative;" width="' . round($image_w * $ratio) . '" height="' . round($image_h * $ratio) . '" src="' . $path . '.jpg"/>' . $b . '</div></div>';

        break;

    case 'edit':
        foreach ($_GET as $query_string_variable => $value) {
            switch ($query_string_variable) {
                case 'id':
                    $edit['id'] = strval($value);
                    break;
            }
        }

        $bloc = NULL;
        $bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);
        $data = $bdd->prepare('SELECT `id`, `catalogue`,`page`, `block_num`, `left`, `top`, `width`, `height`, `conf`, `text` FROM `bloc` WHERE id=:id');
        $data->execute(array(':id' => $edit['id']));


        while ($r = $data->fetch(PDO::FETCH_ASSOC)) {
            $bloc_edit = new CATA\Catalogue\Bloc($r);
            $bloc_method = get_class_methods($bloc_edit);
            if ($bloc_edit->Erreur()) {
                $container .= $bloc_edit->ErreurMsg();
            }
            $i = 0;
            foreach ($bloc_method as $value) {
                if ($i < 10) {
                    switch (strtolower($value)) {
                        case 'text':
                            $Dat[$i] = ['Table' => 'TextLong', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Cols' => 60, 'Rows' => 6];
                            break;
                        case 'id':
                            $Dat[$i] = ['Table' => 'Text', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Size' => 60, 'lock' => true];
                            break;
                        case 'blocknum':
                            $Dat[$i] = ['Table' => 'Text', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Size' => 60, 'lock' => true];
                            break;
                        case 'catalogue':
                            $Dat[$i] = ['Table' => 'Text', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Size' => 60, 'lock' => true];
                            break;
                        case 'page':
                            $Dat[$i] = ['Table' => 'Text', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Size' => 60, 'lock' => true];
                            break;
                        default:
                            $Dat[$i] = ['Table' => 'Text', 'Label' => $value, 'Name' => $value, 'Value' => $bloc_edit->{$value}(), 'Type' => 'text', 'Size' => 60];
                            break;
                    }
                }
                $i++;
            }
        }

        $h_image = 500;
        $w_image = 700;

        /* Réglage de la marge Haute */
        if ($bloc_edit->Top() >= $h_image / 2) {
            $i_top = - $bloc_edit->Top() + ($h_image / 2);
            $b_top = $h_image / 2;
        } else {
            $b_top = $bloc_edit->Top();
            $i_top = 0;
        }

        /* Réglage de la marge gauche */
        if ($bloc_edit->Left() >= $w_image / 4) {
            $i_left = - ($bloc_edit->Left() - 20);
            $b_left = 20;
        } else {
            $b_left = 20;
            $i_left = - ($bloc_edit->Left() - 20);
        }

        $b_data = ['Bloc' => $bloc_edit, 'Ratio' => 0.75];
        $box = new CATA\View\Box($b_data);

        $w = 1653 * 0.75;

        //$box = '<div class="border border-primary rounded border-5" id="block-' . $bloc_edit->BlockNum() . '" style="position: absolute; left: ' . $b_left . 'px; margin-top: ' . $b_top . 'px; width: ' . $bloc_edit->Width() . 'px; height: ' . $bloc_edit->Height() . 'px;"></div>';
        $img = '<div class="border mt-3 rounded" style="position: relative; overflow: hidden;">' . $box->HTML() . '<img style="width: ' . $w . 'px" src="Data/' . $bloc_edit->Catalogue() . '/' . $bloc_edit->Catalogue() . '-' . $bloc_edit->Page() . '.jpg"></div>';

        $Data = ['Titre' => 'Formulaire de Test', 'Legend' => 'Teste des fonctionnalité du formualaire. Ce texte vous permet de donnée des informations suplémentaire sur les fonction de celui ci.', 'Cible' => 'POST.php', 'Bouton' => 'Envoyer', 'Fields' => $Dat];


        $form = new CATA\Form\View($Data);


        $container .= '<div class="row"><div class="col">' . $img . '</div>';
        $container .= '<div class="col">' . $form->HTML() . '</div></div>';

        break;

    case 'supp':

        foreach ($_GET as $query_string_variable => $value) {
            switch ($query_string_variable) {
                case 'id':
                    $supp['id'] = intval($value);
                    break;
            }
        }

        try {
            $bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);
            $data = $bdd->prepare('DELETE FROM `bloc` WHERE id=:id');
            $data->execute(array(':id' => $supp['id']));

            header("Refresh:5; url=?page=page&catalogue=series-3-part-manual-1&no=29");
        } catch (Exception $ex) {
            die('Erreur : ' . $ex->getMessage());
        }

        $container .= $supp['id'];

        break;


    default :
        $container .= '<div class="jumbotron">
  <h1 class="display-4">Hello, world!</h1>
  <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
  <hr class="my-4">
  <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
  <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
</div>';
        break;
}
