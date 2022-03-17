<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Desciption de Card
 * 
 * @author Quentin CELLE
 * 
 */
class Card extends Entite
{

    protected $_id; // ID HTML pour l'utilisation du Script DataTable
    protected $_icone; // Icone
    protected $_header; // Header
    protected $_footer; // Footer
    protected $_content; // Contenue

    /**
     * SetHeader - Hydradation de l'Icone
     * @param string $i 
     */
    protected function setIcone($i)
    {
        // Si l'icone est présent
        if (!empty($i)) {
            $this->_icone = '<i class="fas fa-' . $i . '"></i> ';
        }
    }

    /**
     * SetHeader - Hydradation de l'Entete
     * @param string $h 
     */
    protected function setHeader($h)
    {
        $this->_header = $h;
    }

    /**
     * SetFooter - Hydradation du Footer
     * @param string $f 
     */
    protected function setFooter($f)
    {
        $this->_footer = $f;
    }

    /**
     * SetContent - Hydradation du Contenue
     * @param string $c 
     */
    protected function setContent($c)
    {
        $this->_content = $c;
    }

    public function View()
    {

        $header = NULL; // Initialisation du Header
        $footer = NULL; // Initialisation du Footer

        // Si pas d'erreur
        if (!$this->_erreur) {

            // Si le Header est présent
            if (!empty($this->_header)) {
                $header = '<div class="card-header">' . $this->_icone . $this->_header . '</div>';
            }

            // Si le Footer et présent
            if (!empty($this->_footer)) {
                $footer = '<div class="card-footer small text-muted">' . $this->_footer . '</div>';
            }

            // Génération du code HTML
            $html = '<div class="card mb-3">' . $header . '<div class="card-body">' . $this->_content . '</div>' . $footer . '</div>';
            return $html;
        } else {
            return $this->_erreur_msg;
        }
    }
}
