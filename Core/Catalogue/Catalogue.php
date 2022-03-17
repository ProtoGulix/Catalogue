<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace CATA\Catalogue;

use CATA\Entite;

/**
 * Description of Catalogue
 *
 * @author Quentin
 */
class Catalogue extends Entite {

    protected $_id;
    protected $_name;
    protected $_page;
    protected $_nb_page;

    protected function SetId($i){
        $this->_id = $i;
    }

    protected function SetName($n) {
        $this->_name = $n;
    }

    protected function Setpage($p) {
        $this->_page = $p;
        $this->_nb_page = count($p);
    }

    public function Id(){
        return $this->_id;
    }

    public function Name(){
        return $this->_name;
    }

    public function Page(){
      return $this->_page;
    }

    public function NbPage(){
        return $this->_nb_page;
    }
    //put your code here
}
