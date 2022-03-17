<?php

namespace CATA\Field;

/**
 * Description of Text
 * 
 * --> Herite d'ENTITE pour ces fonction d'hydratation
 * --> Herite de FIELD
 *
 * @author quentin
 * _______________
 * 
 * $setType =>  SET le Type du Champ (text, password, ... )
 * $setSize => SET la taille MAX du champ
 * _______________
 * 
 * Type (string) => Paramétre du type de champ
 * Size (int) => Taille MAX des fichiers
 * 
 */
class Text extends Field {

    protected $_size;
    protected $_type;

    public function setSize($size) { // Controle et convertion de nombre de colonne
        $size = (int) $size;
        if ($size > 0) { //si superieur a zéro
            $this->_size = $size;
        } else { // Dans le cas ou il n'y aurais pas de valleur en definit 30 par defaut
            $this->_size = 30;
        }
    }

    public function setType($type) {
        $this->_type = $type;
    }

    public function buildHTML() {
        $html = '';
        $size = NULL;
        $value = NULL;
        $lock = NULL;

        if (!empty($this->_errorMessage)) { // Affichage du message d'erreur
            $html .= $this->_errorMessage . '</br>';
        }

        $label = '<label class="col-sm-2 col-form-label">' . $this->_label . '</label>';

        if (!empty($this->_size)) {

            $size = 'size="' . $this->_size . '"';
        }

        if (!empty($this->_value)) {

            $value = ' value="' . $this->_value . '"';
        }

        if ($this->_lock) {
            $lock = ' readonly';
        }

        $input = '<div class="col-sm-10"><input type="' . $this->_type . '" class="form-control form-control-sm" name="' . $this->_name . '"' . $size . $value . $lock . '></div>';

        return '<div class="form-group row">' . $label . $input . '</div>';
    }

    //put your code here
}

?>
