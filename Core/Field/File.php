<?php

namespace CATA\Field;

/**
 * Description of File
 * 
 * --> Herite d'ENTITE pour ces fonction d'hydratation
 * --> Herite de FIELD
 *
 * @author quentin
 * _______________
 * 
 * $setExtention =>  SET la liste des extention
 * $setSize => SET la taille MAX des fichiers
 * _______________
 * 
 * Extention (array) => Contitne la liste (array) des extention autorisé
 * Size (int) => Taille MAX des fichiers
 * 
 */
class File extends Field{
    
    protected $_extention = [];
    protected $_size;

    public function setExtention($ext){
        $this->_extention = (array) $ext;
    }
    
    public function setSize($size){
        $this->_size = (int) $size;
    }

    public function buildHTML(){
        $html = '';
        
        return $html;
    }

    //put your code here
}

?>
