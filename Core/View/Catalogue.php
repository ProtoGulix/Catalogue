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
class Catalogue extends Entite {

    protected $_catalogue; // Texte du lien

    protected function SetCatalogue($b){
        $this->_catalogue = $b;
    }

    public function View(){

        if($this->_catalogue->NbPage() <= 0){
            $page = 'Aucune page trouvé !';
        }else{
          $page = NULL;
          foreach ($this->_catalogue->Page() as $value) {

            $nom_c = 'series-3-part-manual-1';
            $query = ['page' => 'page', 'catalogue' => $nom_c, 'no' => $value->Numero()];

            $link = new \CATA\View\Link(['text' => $value->ViewThumb(), 'query' => $query]);
            $page .= $link->View();
            // code...
          }
        }

        $title = '<h4 class="card-title">' . $this->_catalogue->Name() . '</h4>';
        $nbp = '<div class="card-subtitle mb-2 text-muted">' . $this->_catalogue->NbPage() . ' pages(s)</div>';
        return '<div class="card mt-3"><div class="card-body">' . $title . $nbp . $page . '</div></div>';
    }

}
