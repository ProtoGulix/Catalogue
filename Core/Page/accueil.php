<?php
$c = $bdd->query('SELECT * FROM `catalogue`');

while ($data_c = $c->fetch(PDO::FETCH_ASSOC)) {

  $list_page = [];
  $p = $bdd->query('SELECT * FROM page WHERE id_catalogue = '. $data_c['id'] . ' ORDER BY numero');

  while($data_p = $p->fetch(PDO::FETCH_ASSOC)){
    $page = new \CATA\Catalogue\Page($data_p);
    $list_page[] = $page;
  }

  $data_c['page'] = $list_page;
  $catalogue = new \CATA\Catalogue\Catalogue($data_c);
  $view_c = new \CATA\View\Catalogue(['catalogue' => $catalogue]);
  $container .= $view_c->View();
}
