<?php

namespace CATA\Field;

/**
 * Description of HiddenField
 * 
 * Gestion affichage des champs invisible
 * 
 * Herite des valeurs : Label, Name, Value, ErrorMessage
 *
 * @author quentin
 */
class Hidden extends Field
{

    public function buildHTML()
    {

        $value = NULL;
        if (!empty($this->_value)) {
            $value .= ' value="' . $this->_value . '"';
        }

        return '<input type="hidden" ' . $this->_name . '" ' . $value . '>';
    }
    //put your code here
}
