<?php

namespace CATA\Field;

/**
 * Description of HiddenField
 * 
 * Gestion affichage des champs invisible
 * 
 * Herite des valeurs : Label, Name, Value, ErrorMessage
 *
  
  CREATE TABLE IF NOT EXISTS `hiddenfield` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formid` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `idUsr` int(11) NOT NULL,
  `msg` text NOT NULL,
  PRIMARY KEY (`id`)
  );
 
 * @author quentin
 */
class Hidden extends Field{
    
    public function buildHTML()
    {
        $html ="";
        
        if (!empty($this->_errorMessage)) // Affichage du message d'erreur
        {
            $html .= $this->_errorMessage .'</br>';
        }
        
        $html .= '<input type="hidden" name="'. $this->_name .'"';
        
        if (!empty($this->_value)){
            $html .= ' value="'. $this->_value .'"';
        }
        
        return $html .'>';
    }
    //put your code here
}

?>
