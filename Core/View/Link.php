<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace CATA\View;

use CATA\Entite;

/**
 * Description of Link
 *
 * @author Quentin CELLE
 * 
 * MàJ
 * [2020-10-13] Création
 * [2020-10-20] Mise à jour de la fonction SetClass. Ajout d'un controle de NULL
 * 
 */
class Link extends Entite {

    protected $_text; // Texte du lien
    protected $_class; // Class CSS
    protected $_dest; // Destination du lien
    protected $_query; // Query GET

    protected function SetText($t) {
        $this->_text = $t;
    }

    protected function SetClass($c) {
        if (!is_null($c)) {
            $this->_class = 'class="' . $c . '"';
        }
    }

    protected function SetDestination($d) {
        $this->_dest = $d;
    }

    protected function SetQuery($q) {

        if (!is_null($q)) {
            foreach ($q as $key => $value) {

                if (!is_null($value)) {
                    $this->_query .= $key . '=' . $value . '&';
                }
            }

            $this->_query = '?' . substr($this->_query, 0, -1);
        }
    }

    public function View() {

        return '<a ' . $this->_class . ' href="' . $this->_dest . $this->_query . '" id="load">' . $this->_text . '</a>';
    }

    //put your code here
}
