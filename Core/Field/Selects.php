<?php

namespace CATA\Field;

/**
 * Description of Selects
 * 
 * --> Herite de d'ENTITE pour la fonction d'hydratation
 * --> Herite de Field pour les paramétre standatd LABEL, NAME, VALUE, ERRORMESSAGE,
 * 
 * @author Quentin CELLE
 * 
 * Màj:
 * [2022-03-16] : Simplification du code dans BuilHTML
 * _______________
 * 
 * $buildHTML => 
 * _______________
 * 
 * Label => Label du Champ HTML,
 * Name => Nom du champ de formualire pour POST
 * Value => Valeurs dans le champ SELECTS. !!! TABLEAU ARRAY !!!
 * ErrorMessage => Retour de la valuer erreur apres control
 * Multi => Determine le type SIMPLE OU MULTIPLE selection
 * 
 */
class Selects extends Field
{

    protected $_multi;
    protected $_class = 'class="ui dropdown"';

    public function setMulti($multi)
    {
        if ($multi == TRUE) {
            $this->_multi = 'multiple="multiple"';
            $this->_name .= rtrim($this->_name, '"') . '[]"';
        } // Indique si il y a mutli-selection

    }

    public function buildHTML()
    {

        $option = NULL;

        foreach ($this->_value as $k => $v) {
            $option .= '<option value="' . $k . '">' . $v . '</option>';
        } // Vide le tabelau des options

        return '<div class="field">' . $this->_label . '<select ' . $this->_name . $this->_class . $this->_multi . '>' . $option . '</select></div>';
    }
    //put your code here
}
