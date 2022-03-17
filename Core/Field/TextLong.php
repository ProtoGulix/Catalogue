<?php

namespace CATA\Field;

/**
 * Description of TextField
 * 
 * --> Namespace FIELD
 * --> Herite de FIELD 
 *
 * @author Quentin CELLE
 * _______________
 * 
 * $setRows => 
 * $setCols =>
 * $buildHTML =>
 * _______________
 * 
 * Cols (int) =>
 * Rows (int) =>
 * 
 */

class TextLong extends Field
{
    protected $_cols; // Nbr colonne de la zone de texte
    protected $_rows; // Nbr de ligne de la zone de texte
    
    public function setCols($cols) // Controle et convertion de nombre de colonne
    {
        $cols = (int) $cols;
        if ( $cols > 0) {
            $this->_cols = $cols;
        }
    }
    
    public function setRows($rows) // Controle et convertion du nombre de ligne
    {
        $rows = (int) $rows;
        if ($rows > 0){
            $this->_rows = $rows;
        }
    }
    
    public function buildHTML() // Construction et assemblage du code HTML
    {
        $html ='';
        
        if (!empty($this->_errorMessage)) // Affichage du message d'erreur
        {
            $html .= $this->_errorMessage .'</br>';
        }
        
        $html .= '<label>'. $this->_label .'</label><textarea class="form-control" name="'. $this->_name .'"';
        
        if (!empty($this->_cols)) // Nombre de colonnes
        {
            $html .= 'cols="'. $this->_cols .'"';
        }
        
        if (!empty($this->_rows)) // Nombre de lignes
        {
            $html .= 'rows="'. $this->_rows .'"';
        }
        
        $html .= '>';
        
        if (!empty($this->_value)) // Ajoute la valeur de la zone de texte
        {
            $html .= htmlspecialchars($this->_value);
        }
        
        return $html.'</textarea>';
    }
    
    //put your code here
}

?>
