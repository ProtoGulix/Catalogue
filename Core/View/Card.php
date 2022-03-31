<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Desciption de Card
 * 
 * @author Quentin CELLE
 * 
 * MàJ:
 * [2022-03-18] Ajout des Function et variable Class et ID
 * 
 */
class Card extends Entite
{

    protected $_id; // ID HTML pour l'utilisation du Script DataTable
    protected $_class; // Class HTML
    protected $_icone; // Icone
    protected $_header; // Header
    protected $_footer; // Footer
    protected $_content; // Contenue
    protected $_image; // Image

    protected function SetId($i)
    {
        $this->_id = 'id="' . $i . '"';
    }

    protected function SetClass($c)
    {
        $this->_class = $c;
    }

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
        $this->_header = '<div class="header">' . $h . '</div>';
    }

    /**
     * SetFooter - Hydradation du Footer
     * @param string $f 
     */
    protected function setFooter($f)
    {
        $this->_footer = '<div class="extra content">' . $f . '</div>';
    }

    /**
     * SetContent - Hydradation du Contenue
     * @param string $c 
     */
    protected function setContent($c)
    {
        $this->_content = $c;
    }

    protected function setImage($i)
    {
        $this->_image = '<div class="image">' . $i . '</div>';
    }

    public function View()
    {

        $header = NULL; // Initialisation du Header
        $footer = NULL; // Initialisation du Footer
        $content = NULL;

        // Si pas d'erreur
        if (!$this->_erreur) {

            // Génération du code HTML
            $html = '<div class="ui card ' . $this->_class . '" ' . $this->_id . '>' . $this->_image . '<div class="content">' . $this->_header . $this->_content . '</div>' .  $this->_footer . '</div>';
            return $html;
        } else {
            return $this->_erreur_msg;
        }
    }
}
