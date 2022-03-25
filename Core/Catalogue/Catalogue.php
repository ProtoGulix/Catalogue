<?php

namespace CATA\Catalogue;

use CATA\Entite;

/**
 * Description of Catalogue
 *
 * @author Quentin CELLE
 * 
 * MàJ
 * [2022-03-25] Fusion des class /View/Catalogue et /Catalogue/Catalogue
 * 
 */
class Catalogue extends Entite
{

    protected $_id; // ID du catalogue
    protected $_name; // Nom du catalogue
    protected $_page; // 
    protected $_nb_page;

    protected function SetId($i)
    {
        $this->_id = $i;
    }

    protected function SetName($n)
    {
        $this->_name = $n;
    }

    protected function SetPage($p)
    {
        $this->_page = $p;
    }

    protected function SetNbPage($n)
    {
        $this->_nb_page = $n;
    }

    public function Id()
    {
        return $this->_id;
    }

    public function Name()
    {
        return $this->_name;
    }

    public function Page()
    {
        return $this->_page;
    }

    public function NbPage()
    {
        return $this->_nb_page;
    }

    public function View()
    {

        if (count($this->_page) <= 0) {
            $page = 'Aucune page trouvé !';
        } else {
            $page = NULL;
            foreach ($this->_page as $value) {

                $query = ['page' => 'page', 'catalogue' => $this->_id, 'no' => $value->Numero()];
                $link = new \CATA\View\Link(['text' => $value->ViewThumb(), 'query' => $query]);
                $page .= $link->View();
                // code...
            }
        }

        $title = '<h4 class="card-title">' . $this->_name . '</h4>';
        $nbp = '<div class="card-subtitle mb-2 text-muted">' . $this->_nb_page . ' pages(s)</div>';
        $card = new \CATA\View\Card(['content' => $title . $nbp . $page]);
        return $card->View();
    }
    //put your code here
}
