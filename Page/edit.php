<?php

/**
 * 
 */
foreach ($_GET as $query_string_variable => $value) {
    switch ($query_string_variable) {
        case 'id':
            $edit['id'] = strval($value);
            break;
    }
}

$bloc = NULL;
$data = $bdd->query('SELECT * FROM `bloc` WHERE id=' . $edit['id']);

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
    $i_top = -$bloc_edit->Top() + ($h_image / 2);
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
$img = '<div class="border mt-3 rounded" style="position: relative; overflow: hidden;">' . $box->View() . '<img style="width: ' . $w . 'px" src="Data/' . $bloc_edit->Catalogue() . '/' . $bloc_edit->Catalogue() . '-' . $bloc_edit->Page() . '.jpg"></div>';

$Data = ['Titre' => 'Formulaire de Test', 'Legend' => 'Teste des fonctionnalité du formualaire. Ce texte vous permet de donnée des informations suplémentaire sur les fonction de celui ci.', 'Cible' => 'POST.php', 'Bouton' => 'Envoyer', 'Fields' => $Dat];

$form = new CATA\Form\View($Data);

$container .= '<div class="row"><div class="col">' . $img . '</div>';
$container .= '<div class="col">' . $form->View() . '</div></div>';
