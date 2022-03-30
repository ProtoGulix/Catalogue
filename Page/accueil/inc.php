<?php
$c = $bdd->query('SELECT * FROM `catalogue`');

while ($data_c = $c->fetch(PDO::FETCH_ASSOC)) {

    $list_page = [];
    $p = $bdd->query('SELECT * FROM page WHERE id_catalogue = ' . $data_c['id'] . ' ORDER BY numero');

    while ($data_p = $p->fetch(PDO::FETCH_ASSOC)) {
        $list_page[] = new \CATA\Catalogue\Page($data_p);
    }

    $catalogue = new \CATA\Catalogue\Catalogue(['Id' => $data_c['id'], 'Name' => $data_c['name'], 'Page' => $list_page, 'NbPage' => $data_c['nb_page']]);
    $container .= $catalogue->View();
}
