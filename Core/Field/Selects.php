<?php

namespace CATA\Field;

/**
 * Description of Selects
 * 
 * --> Herite de d'ENTITE pour la fonction d'hydratation
 * --> Herite de Field pour les paramétre standatd LABEL, NAME, VALUE, ERRORMESSAGE,
 * 
 * @author Quentin CELLE
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
class Selects extends Field {
    
    protected $_multi;
    
    public function setMulti($multi){
        $this->_multi = $multi;
    }
    
    public function buildHTML(){
        
        $html = '';
        $html .='<select name="'. $this->_name .'"';
        
        if ($this->_multi == TRUE) { $html .=' multiple'; } // Indique si il y a mutli-selection
        
        $html .=' class="form-control">';
        
        foreach ( $this->_value as $v) { $html .='<option value"'. $v .'">'. $v .'</option>'; } // Vide le tabelau des options

        $html .='</select>';
        
        return $html;
    }
    //put your code here
}

?>
