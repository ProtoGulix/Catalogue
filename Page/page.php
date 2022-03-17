<?php

$catalogue = htmlspecialchars($_GET['catalogue']);
$page = htmlspecialchars($_GET['no']);

$image_h = NULL;
$image_w = NULL;

$path = $dir . '/' . $catalogue . '/' . $catalogue . '-' . $page;

if (is_file($path . '.jpg')) {
    $size = getimagesize($path . '.jpg');
    $image_w = $size[0];
    $image_h = $size[1];
} else {
    $alerte = new \CATA\View\Alerte(['text' => 'Image introuvable', 'type' => 'danger']);
    $container .= $alerte->View();
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
    $b .= $box->View();

    $edit_query = ['page' => 'edit', 'id' => $bloc->Id()];
    $edit_data = ['text' => 'Edition', 'query' => $edit_query, 'class' => 'btn btn-outline-primary btn-sm'];
    $edit = new CATA\View\Link($edit_data);

    $supr_query = ['page' => 'supp', 'id' => $bloc->Id()];
    $supr_data = ['text' => 'Suppression', 'query' => $supr_query, 'class' => 'btn btn-danger btn-sm'];
    $supr = new CATA\View\Link($supr_data);

    $link = '<div class="btn-group">' . $edit->View() . $supr->View() . '</div>';

    $d[] = ['block_num' => $bloc->BlockNum(), 'text' => $bloc->Text() . $link];
}

$donnees['Header'] = ['Texte'];
$donnees['Content'] = $d;


/**
 * Contrôle de l'importation des données
 */
$a = NULL;
if (empty($d) && is_file($path . '.csv')) {
    // Fichier d'importation présent mais pas de valeur dans la base de donnée
    $import_query = ['page' => 'import', 'catalogue' => $catalogue, 'no' => $page];
    $import_data = ['text' => 'Importer', 'query' => $import_query, 'class' => 'btn btn-outline-primary btn-sm ms-auto'];
    $alerte = new \CATA\View\Alerte(['text' => 'Fichier d\'importation disponible', 'type' => 'primary', 'button' => new CATA\View\Link($import_data)]);
    $a = $alerte->View();
} elseif (!empty($d) && is_file($path . '.csv')) {
    // Fichier d'importation présent mais donnée présent
    $supr_query = ['page' => 'import', 'catalogue' => $catalogue, 'no' => $page];
    $supr_data = ['text' => 'Suppression', 'query' => $supr_query, 'class' => 'btn btn-outline-danger btn-sm'];
    $supr = new CATA\View\Link($supr_data);
    $alerte = new \CATA\View\Alerte(['text' => 'Fichier d\'importation présent', 'type' => 'danger', 'button' => $supr]);
    $a = $alerte->View();
}

$table = new CATA\View\Tableau($donnees);

$container .= '<div class="row"><div class="col">' . $table->View() . '</div>';
$container .= '<div class="col-6"><div class="card border mt-3 rounded sticky-top bg-danger"  width="' . round($image_w * $ratio) . 'px" height="' . round($image_h * $ratio) . 'px" >' . $a . '<img style="position: relative;" width="' . round($image_w * $ratio) . '" height="' . round($image_h * $ratio) . '" src="' . $path . '.jpg"/>' . $b . '</div></div>';
