<?php

namespace CATA\Field;

/**
 * Description of Text
 * 
 * --> Herite d'ENTITE pour ces fonction d'hydratation
 * --> Herite de FIELD
 *
 * @author quentin
 * 
 * MàJ:
 * [2022-03-17] Simplification de la fonction BuildHTML
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
class Text extends Field
{

    protected $_size;
    protected $_type;
    protected $_placeholder;

    public function setSize($size)
    { // Controle et convertion de nombre de colonne
        $size = (int) $size;
        if ($size > 0) { //si superieur a zéro
            $this->_size = 'size="' . $size . '"';
        } else { // Dans le cas ou il n'y aurais pas de valleur en definit 30 par defaut
            $this->_size = 'size="' .  30 . '"';
        }
    }

    public function setType($type)
    {
        $this->_type = 'type="' . $type . '"';
    }

    public function setPlaceholder($p)
    {
        $this->_placeholder = 'placeholder = "' . $p . '"';
    }

    public function buildHTML()
    {
        $value = NULL;
        $lock = NULL;

        if (!empty($this->_value)) {

            $value = ' value="' . $this->_value . '"';
        }

        if ($this->_lock) {
            $lock = ' readonly';
        }

        $input = '<input ' . $this->_placeholder . $this->_type . $this->_name  . $this->_size . $value . $lock . '>';

        return  '<div class="field">' . $this->_label . $input . '</div>';
    }

    //put your code here
}
