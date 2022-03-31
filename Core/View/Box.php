<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace CATA\View;

use CATA\Entite;

/**
 * Description of Box
 *
 * @author Quentin
 */
class Box extends Entite
{

    protected $_bloc;
    protected $_ratio;

    protected function SetBloc(object $b)
    {
        if (is_object($b)) {
            $this->_bloc = $b;
        } else {
            $this->setErreur();
            $this->setErreurMsg('Erreur: l\'objet Bloc et nessesaire a la création d\'une Box !');
        }
    }

    protected function SetRatio($r)
    {
        if (!is_null($r) or $r < 1) {
            $this->_ratio = $r;
        } else {
            $this->SetErreur();
            $this->SetErreurMsg('Erreur: le ratio doit étre inférieur à 1 ou supérieur 0 !');
        }
    }

    public function View()
    {

        $l = round(intval($this->_bloc->Left()) * $this->_ratio) - 5;
        $t = round(intval($this->_bloc->Top()) * $this->_ratio) - 5;
        $w = round(intval($this->_bloc->Width()) * $this->_ratio) + 10;
        $h = round(intval($this->_bloc->Height()) * $this->_ratio) + 10;

        $style = NULL;
        //$style = ' style="position: absolute; left: ' . $l . 'px; top: ' . $t . 'px; width: ' . $w . 'px; height: ' . $h . 'px;"';
        $js = 'data-originleft="' . $this->_bloc->Left() . '" data-origintop="' . $this->_bloc->Top() . '" data-originwidth="' . $this->_bloc->Width() . '" data-originheight="' . $this->_bloc->height() . '"';
        $div = '<div class="box border border-primary rounded border-2" id="block-' . $this->_bloc->BlockNum() . '"' . $style . $js . '></div>';

        return '<a href="#panels-c' .  $this->_bloc->BlockNum() . '" data-bs-toggle="collapse" aria-controls="panels-c' .  $this->_bloc->BlockNum() . '">' . $div . '</a>';
    }

    //put your code here
}
