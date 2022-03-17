<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace INTRA\View;

use INTRA\Entite;

/**
 * Description of Pagination
 *
 * @author Quentin CELLE
 * 
 * MàJ :
 *  [2020-10-05] Création
 *  [2020-10-12] Implémentation de la Class Link
 */
class Pagination Extends Entite {

    protected $_parPage; // Nombre d'éléments à afficher dans chaque page.
    protected $_delta; // Nombre de numéros de pages à afficher avant et après celui en cours.
    protected $_totalItems; // Table des éléments à répartir
    protected $_query;
    protected $_n_page;

    public function __construct($donnees) {
        parent::__construct($donnees);

        if (!is_null($this->_totalItems)) {
            $this->_n_page = ceil($this->_totalItems / $this->_parPage); // Calcul du nombre de page
        }

        if ($this->_query['index'] == 0) {
            $this->_query['index'] = 1;
        }
    }

    /**
     * SetParPage - Determination du nombre de Film par page
     * @param int $p 
     */
    protected function SetParPage($p) {
        $this->_parPage = intval($p);
    }

    /**
     * SetDelta - Determine le nombre d'index a affiché autour de la position actuel
     * @param int $d
     */
    protected function SetDelta($d) {
        $this->_delta = intval($d);
    }

    /**
     * SetTotalItems - Dertermine le nombre total d'items
     * @param type $i
     */
    protected function SetTotalItems($i) {
        $this->_totalItems = $i;
    }

    /**
     * SetQuery - Propagation de la recquette HTTP
     * @param type $q
     */
    protected function SetQuery($q) {
        $this->_query = $q;
    }

    protected function Precedent() {
        $this->_query['index'] = $this->_query['index'] - 1;

        $data = ['Text' => '<i class="fas fa-angle-double-left"></i>', 'Class' => 'page-link', 'Query' => $this->_query];
        $link = new \INTRA\View\Link($data);

        return '<li class="page-item">' . $link->View() . '</li>';
    }

    protected function Suivant() {
        $this->_query['index'] = $this->_query['index'] + 2;

        if ($this->_query['index'] > $this->_n_page) {
            $this->_query['index'] = $this->_n_page;
        }

        $data = ['Text' => '<i class="fas fa-angle-double-right"></i>', 'Class' => 'page-link', 'Query' => $this->_query];
        $link = new \INTRA\View\Link($data);

        return '<li class="page-item">' . $link->View() . '</li>';
    }

    protected function Premier() {

        $query = $this->_query;
        $query['index'] = 1;

        $active = NULL;
        if ($this->_query['index'] == $query['index']) {
            $active = ' active';
        }

        $data = ['Text' => '1', 'Class' => 'page-link', 'Query' => $query];
        $link = new \INTRA\View\Link($data);

        return '<li class="page-item' . $active . '">' . $link->View() . '</li>';
    }

    protected function Dernier() {

        $query = $this->_query;
        $query['index'] = $this->_n_page;

        $active = NULL;
        if ($this->_query['index'] == $query['index']) {
            $active = ' active';
        }

        $data = ['Text' => $this->_n_page, 'Class' => 'page-link', 'Query' => $query];
        $link = new \INTRA\View\Link($data);

        return '<li class="page-item' . $active . '">' . $link->View() . '</li>';
    }

    /**
     * 
     * @return type
     */
    public function View() {

        $i_now = intval($this->_query['index']); // Index actuelle de la page
        // Si la valeur de $index Actuelle (le numéro de la page) est plus grande que $nombreDePages...
        if ($i_now > $this->_n_page) {
            $i_now = $this->_n_page;
        }

        if ($i_now <= $this->_delta) {
            $delta_gauche = $i_now - 1;
            $delta_droite = ($this->_delta * 2) - $delta_gauche;
        } elseif (($this->_n_page - 1) - $i_now < $this->_delta) {
            $delta_gauche = $this->_delta + ($this->_delta - ($this->_n_page - $i_now));
            $delta_droite = $this->_n_page - $i_now;
        } else {
            $delta_gauche = $this->_delta;
            $delta_droite = $this->_delta;
        }

        $gauche = $i_now - $delta_gauche;
        $droite = $i_now + $delta_droite;

        $li = ''; // Initialisation de la variable
        // Boucle d'instattion de tout les Films dispo dans la bibliothéque
        for ($i = 2; $i <= $this->_n_page - 1; $i++) {
            $delta = NULL;

            $active = '';
            if ($i == $i_now) { //S'il s'agit de la page actuelle...
                $active = 'active'; // Passe le lien en "ACTIVE"
            }

            if ($i >= $gauche AND $i <= $droite) {
                //if ($i >= $gauche AND $i <= $droite OR $i == 1 OR $i == $this->_n_page) {

                $new_query = $this->_query;
                $new_query['index'] = $i;

                $data = ['Text' => $i, 'Class' => 'page-link', 'Query' => $new_query];
                $link = new \INTRA\View\Link($data);

                $li .= '<li class="page-item ' . $active . '">' . $link->View() . '</li>';
                $delta = TRUE;
            } else {
                if ($delta) {
                    //$li .= '<li class="page-item "><p class="page-link">...</p></li>';
                    $delta = FALSE;
                }
            }
        }

        return '<nav aria-label="Page navigation"><ul class="pagination justify-content-end">' . $this->Precedent() . $this->Premier() . $li . $this->Dernier() . $this->Suivant() . '</ul></nav>';
    }

    //put your code here
}
