<?php

namespace CATA\View;

use CATA\Entite;


/**
 * Description de BADGE
 * 
 * @author Quentin CELLE
 * 
 * MàJ
 * [2022-03-30] Création
 * 
 */

class Badge extends Entite
{

    protected $_content; // Texte
    protected $_type; //  Primary Secondary Success Danger Warning Info Light Dark 

    public function SetContent($t)
    {
        $this->_content = htmlspecialchars($t);
    }

    public function SetType($t)
    {
        if (in_array($t, $GLOBALS['bs_colorval'])) {
            $this->_type = $t;
        }
    }

    public function View()
    {
        return '<span class="badge bg-' . $this->_type . '">' . $this->_content . '</span>';
    }
}
