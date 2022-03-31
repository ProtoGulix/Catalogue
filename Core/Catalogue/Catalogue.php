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
    protected $_date_modif;
    protected $_date_creation;

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

    protected function SetDateCreation($dc)
    {
        $this->_date_creation = $dc;
    }

    protected function SetDateModif($dm)
    {
        $this->_date_modif = $dm;
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

        if (empty($this->_page)) {
            $page = 'Aucune page trouvé !';
        } else {
            $page = NULL;
            foreach ($this->_page as $value) {

                $page .= $value->ViewMini();
                //$page .=  $card->View();

                // code...
            }
        }

        return '<div class="ui grid">' . $page . '</div>';
        //return '<div class="ui cards">' . $page . '</div>';
    }

    public function Info()
    {

        $titre = '<h1>' . $this->_name . '</h1>';
    }
    //put your code here
}
