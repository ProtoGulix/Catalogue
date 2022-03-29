<?php

namespace CATA\View;

use CATA\Entite;

class Accordion extends Entite
{
    protected $_line;

    public function SetLine($l)
    {
        $this->_line = $l;
    }

    public function View()
    {

        $line = NULL;
        foreach ($this->_line as $l) {
            $i = $l['id'];
            $title = '<h2 class="accordion-header" id="panels-' . $i . '">
            <button class="accordion-button  collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panels-c' . $i . '" aria-expanded="false" aria-controls="panels-c' . $i . '">
            ' . $l['title'] . '</button></h2>';
            $content = '<div id="panels-c' . $i . '" class="accordion-collapse collapse" aria-labelledby="panels-' . $i . '">
      <div class="accordion-body">' . $l['content'] . '</div></div>';
            $line .= '<div class="accordion-item">' . $title . $content . '</div>';
        }

        $card = new \CATA\View\Card(['content' => '<div class="accordion" id="accordionPanelsStayOpenExample">' . $line . '</div>', 'Id' => 'page-image', 'Class' => 'p-0']);

        return $card->View();
    }
}
