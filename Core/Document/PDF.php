<?php

namespace INTRA\Document;

use INTRA\File;

/**
 * Description de PDF
 *
 * @author Quentin CELLE
 * 
 * 
 */
class PDF extends File {

    protected $_zoom = 'page-fit'; // Réglage du zoom de viewer
    
    /**
     * 
     * @param string $z Valeur de Zoom uu Viewer (page-fit, page-width, ... )
     */
    public function Zoom($z){
        $this->_zoom = $z;
    }

    /**
     * 
     * @return string HTML du Viewer
     */
    public function Viewer() {

		// INITIALISATION de la visionneuse
        $v = '<center><b>Pas de PDF à afficher</b><center>';
		// Si le fichier existe
        if ($this->_existe) {
            $v = '<object class="embed-responsive-item" data="'
            	. $GLOBALS['d_viewer'] // Emplacement du la visionneuse Config.php->
            	. '?file=/../../' . $this->_dir . '#zoom=' . $this->_zoom . '" type="text/html"></object>';
        }

        $html = '<div class="card mb-3">
                   <div class="embed-responsive embed-responsive-16by9">' . $v . '</div>
                   <div class="card-footer small text-muted">' . $this->DateModif() . '</div>
                 </div>';

        return $html;
    }

}
