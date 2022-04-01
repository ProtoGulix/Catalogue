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
    protected $_class = 'class="ui checkbox"';


    public function setType($type)
    {
        $this->_type = 'type="' . $type . '"';
        if ($type == 'radio') {
            $this->_class = 'class="ui radio checkbox"';
        }
    }

    public function setId($id)
    {
        $this->_id = 'id="' . $id . '"';
    }

    public function setChecked($ck)
    {
        if ($ck == TRUE) {
            $this->_checked = 'checked';
        }
    }

    public function setProtected($protect)
    {
        if ($protect == TRUE) {
            $this->_protected = 'disabled';
        }
    }


    public function buildHTML()
    {

        $check = '<input class="hidden" ' . $this->_type . $this->_name . $this->_id . 'value="' . $this->_value . '"' . $this->_checked . $this->_protected . '>'; // Ajoute le statut de protection 

        return '<div class="field"><div ' . $this->_class . '>' . $this->_label . $check . '</div></div>';
    }


    //put your code here
}
