<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Description of Alerte
 *
 * @author Quentin CELLE
 *
 * MàJ
 * [2022-03-15] Création
 *
 */
class Alerte extends Entite
{

    protected $_text; // Texte du lien
    protected $_type; // Type d'alerte
    protected $_button; // Bonton d'action sur l'alerte;

    protected function SetText($t)
    {
        $this->_text = $t;
    }

    protected function SetType($t)
    {
        $this->_type = $t;
    }

    protected function SetButton($b)
    {
        $this->_button = $b;
    }

    public function View()
    {
        $content = '<div class="p2">' . $this->_text . '</div>';
        if (!empty($this->_button)) {
            $button = '<div class="ms-auto">' . $this->_button->View() . '</div>';
        } else {
            $button = False;
        }

        return '<div class="alert alert-' . $this->_type . ' d-flex align-items-center mt-3" role="alert">' . $content . $button . '</div>';
    }
}
