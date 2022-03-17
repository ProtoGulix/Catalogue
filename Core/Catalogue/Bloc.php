<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace CATA\Catalogue;

use CATA\Entite;

/**
 * Description of Bloc
 *
 * @author Quentin
 */
class Bloc extends Entite {

    protected int $_id; // ID du block dans la base de donnée
    protected $_catalogue; // Nom du Catalogue
    protected $_page; //page
    protected int $_block_num; // Numéro du block sur la page
    protected int $_left; // Position a gauche sur la page
    protected int $_top; // Postion par rapport au haut de la page
    protected int $_width; // Largeur
    protected int $_height; // Hauteur
    protected int $_conf; // Coeficient de confience 
    protected $_text; // Valeur du Block

    protected function SetId($i) {
        $this->_id = $i;
    }
    
    protected function SetCatalogue($c) {
        $this->_catalogue = $c;
    }
    
    protected function SetPage($p){
        $this->_page = $p;
    }

    protected function SetBlock_Num($bn) {
        $this->_block_num = $bn;
    }

    protected function Setleft($l) {
        $this->_left = $l;
    }

    protected function SetTop($t) {
        $this->_top = $t;
    }

    protected function SetWidth($w) {
        $this->_width = $w;
    }

    protected function SetHeight($h) {
        $this->_height = $h;
    }

    protected function SetConf($c) {
        $this->_conf = $c;
    }

    protected function SetText($t) {
        $this->_text = $t;
    }
    
    public function Id() {
        return $this->_id;
    }
    
    public function Catalogue(){
        return $this->_catalogue;
    }
    
    public function Page(){
        return intval($this->_page);
    }

    public function BlockNum(){
        return $this->_block_num;
    }
    
    public function Left(){
        return intval($this->_left);
    }
    
    public function Top(){
        return intval($this->_top);
    }
    
    public function Width(){
        return intval($this->_width);
    }
    
    public function Height(){
        return intval($this->_height);
    }
    
    public function Conf(){
        return intval($this->_conf);
    }
    
    public function Text(){
        return $this->_text;
    }
    //put your code here
}
