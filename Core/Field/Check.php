<?php

namespace CATA\Field;

/**
 * Description of Check
 *
 * --> Herite de d'ENTITE pour la fonction d'hydratation
 * --> Herite de Field pour les paramétre standatd LABEL, NAME, VALUE, ERRORMESSAGE,
 * 
 * @author Quentin CELLE
 * _______________
 * 
 * $buildHTML => Genere le code HTML du champ
 * _______________
 * 
 * Label => Label du Champ HTML,
 * Name => Nom du champ de formualire pour POST
 * Value => Valeur par defaut (si precharge si non NULL),
 * ErrorMessage => Retour de la valuer erreur apres control
 * Type => Determine le type RADIO OU CHECKBOX
 * ID => 
 * Checked => Autocoche le Champ
 * Disable => 
 * 
 */

class Check extends Field
{

    protected $_type;
    protected $_id;
    protected $_checked;
    protected $_protected;


    public function setType($type)
    {
        $this->_type = $type;
    }

    public function setId($id)
    {
        $this->_id = $id;
    }

    public function setChecked($ck)
    {
        $this->_checked = $ck;
    }

    public function setProtected($protect)
    {
        $this->_protected = $protect;
    }


    public function buildHTML()
    {

        $protected = '';
        $checked = '';

        if ($this->_protected == TRUE) {
            $protected = 'disabled';
        } //Bloque l'utilisation de champ
        if ($this->_checked == TRUE) {
            $checked = 'checked';
        } // Ajoute la fonction de coche par defaut

        $html = '';
        $html .= '<div class="form-check">'; // Determine le Type CSS
        $html .= '<input class="form-check-input" type="' . $this->_type . '" name="' . $this->_name . '"'; // Nom ET Type du Champ
        $html .= 'id="' . $this->_id . '"'; // ID du Champ
        $html .= 'value="' . $this->_value . '"'; // Valeur pour les FORMS
        $html .= '\n' . $checked . $protected . '>'; // Ajoute le statut de protection 
        $html .= '<label class="class="form-check-label">' . $this->_label . '</label></div>'; // Cloture du champ

        return $html;
    }


    //put your code here
}
