<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Desciption de Tableau
 * 
 * Affichage et uniformisation des tableau en HTML
 * 
 * @author Quentin CELLE TA68
 * 
 */
class Tableau extends Entite
{

    protected $_id; // ID HTML pour l'utilisation du Script DataTable
    protected $_class; // Class CSS
    protected $_header; // Header du tableau
    protected $_content; // Contenue

    /**
     * SetID - Renseigement de l'id HTML du tableau pour l'utilisation de script JS
     * @param string $i Id du tableau
     */
    protected function setId($i)
    {
        // Si un icone est definit on filtre le HTML
        if (is_string($i)) {
            $this->_id = htmlentities($i);
        } else { // Si non on definie une valeur par défaut 
            $this->_id = '#';
        }
    }

    protected function setClass($c)
    {
        $this->_class = $c;
    }

    /**
     * SetHeader - Hydradation des Entete de Colonne du tableau
     * @param array $h Tableau des entete !!! LE NOMBRE D'ENTETE DOIT CORRESPONDRE AU NOMBRE DE COLONNE DU TABLEAU !!!
     */
    protected function setHeader(array $h)
    {

        // Controle du type de valeur
        if (is_array($h)) {

            $t = NULL; // INITIALISATION
            $nombre = count($h); // Comptage du nombre de colonne
            // Purge du tableau
            for ($index = 0; $index < $nombre; $index++) {
                $t .= '<th>' . $h[$index] . '</th>';
            }
            // Ajout des balise de ligne
            $t = '<tr>' . $t . '</tr>';
        }

        $this->_header = $t;
    }

    /**
     * SetContent - Hydratation des lignes du contenu du tableau
     * @param array $c Tableau a deux dimention Array[Array,Array,Array]
     */
    protected function setContent($c)
    {

        if (!empty($c)) {
            foreach ($c as $key) {
                $ligne = NULL; // INITIALISATION de la ligne
                // Si la ligne est bien au tableau
                if (array_key_exists('block_num', $key)) {
                    $block_num = 'id="' . $key['block_num'] . '"';
                    unset($key['block_num']);
                } else {
                    $block_num = NULL;
                    // Purge du tableau
                }
                if (is_array($key)) {

                    // Purge du tableau
                    foreach ($key as $value) {
                        $ligne .= '<td>' . $value . '</td>';
                    }
                }

                $this->_content .= '<tr  ' . $block_num . '">' . $ligne . '</tr>';
            }
        }
    }

    /**
     * View - Génération du code HTML pour l'affichage du tableau
     * @return string HTML du tableau
     */
    public function View()
    {

        $body = '<tr><td>Une erreur est survenue !<td></tr>'; // Message d'erreur
        $header = NULL; // INITIALISATION du header
        $footer = NULL; // INITIALISATION du footer
        // Si pas d'erreur
        if (!$this->_erreur) {
            // Si un Header à été renseigné
            if (!empty($this->_header)) {
                $header = '<thead>' . $this->_header . '</thead>';
                $footer = '<tfoot>' . $this->_header . '</tfoot>';
            }
            // Si un Footer a été renseigné
            if (!empty($this->_content)) {
                $body = '<tbody>' . $this->_content . '</tbody>';
            }
            // Hydration du tableau avec les valeur généré
            $tableau = '<div class="table-responsive">'
                . '<table class="table table-hover" ' . $this->_id . ' width="100%" cellspacing="0" id="TableauHover">'
                . $header . $body . $footer
                . '</table>'
                . '</div>';
        }

        $card = new \CATA\View\Card(['content' => $tableau, 'id' => $this->_id, 'class' => $this->_class]);

        // ID pagee-image
        return $card->View();
    }
}
