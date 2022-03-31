<?php

/**
 * Page Catalogue
 */

if (isset($_GET['id'])) {
    $id_catalogue = htmlspecialchars($_GET['id']);

    $q = $bdd->query('SELECT * FROM catalogue WHERE id =' . $id_catalogue);
    $data_catalogue = $q->fetch(PDO::FETCH_ASSOC);
    $p = $bdd->query('SELECT * FROM page WHERE id_catalogue =' . $id_catalogue . ' ORDER BY numero');
    while ($data_page = $p->fetch(PDO::FETCH_ASSOC)) {
        $data_catalogue['page'][] = new \CATA\Catalogue\Page($data_page);
    }
    $catalogue = new \CATA\Catalogue\Catalogue($data_catalogue);

    $container .= '<h1>' . $catalogue->Name() . '</h1>';
    $container .= $catalogue->View();
}
