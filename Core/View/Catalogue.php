<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Description of Catalgue
 *
 * @author Quentin CELLE
 *
 * MàJ
 * [2022-03-15] Création
 *
 */
class Catalogue extends Entite
{

  protected $_catalogue; // Texte du lien

  protected function SetCatalogue($b)
  {
    $this->_catalogue = $b;
  }

  public function View()
  {

    if (count($this->_catalogue->Page()) <= 0) {
      $page = 'Aucune page trouvé !';
    } else {
      $page = NULL;
      foreach ($this->_catalogue->Page() as $value) {

        $query = ['page' => 'page', 'catalogue' => $this->_catalogue->Id(), 'no' => $value->Numero()];
        $link = new \CATA\View\Link(['text' => $value->ViewThumb(), 'query' => $query]);
        $page .= $link->View();
        // code...
      }
    }

    $title = '<h4 class="card-title">' . $this->_catalogue->Name() . '</h4>';
    $nbp = '<div class="card-subtitle mb-2 text-muted">' . $this->_catalogue->NbPage() . ' pages(s)</div>';
    $card = new \CATA\View\Card(['content' => $title . $nbp . $page]);
    return $card->View();

    //return '<div class="card mt-3"><div class="card-body">' . $title . $nbp . $page . '</div></div>';
  }
}
