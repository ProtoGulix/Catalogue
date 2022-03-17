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

    public function setMulti($multi)
    {
        $this->_multi = $multi;
    }

    public function buildHTML()
    {

        $multi = NULL;
        $option = NULL;
        $label = '<label>' . $this->_label . '</label>';
        $name = $this->_name;

        if ($this->_multi == TRUE) {
            $multi = ' multiple="multiple"';
            $name .= '[]';
        } // Indique si il y a mutli-selection

        foreach ($this->_value as $k => $v) {
            $option .= '<option value="' . $k . '">' . $v . '</option>';
        } // Vide le tabelau des options

        return $label . '<select name="' . $name . '" class="form-select"' . $multi . '>' . $option . '</select>';
    }
    //put your code here
}
