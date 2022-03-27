<?php

namespace CATA\View;

use CATA\Entite;

/**
 * Description de Image
 *
 * @author Quentin CELLE
 * 
 * MàJ :
 *  [2020-01-07] Ajout d'un retour d'erreur
 *  [2020-10-22] Mise à jour des Fonction View et ViewCard pour l'intégration à la Class Catalogue 
 * 
 */
class Media extends Entite
{

    protected $_image; // Object Image
    protected $_footer; // Footer
    protected $_zoom = FALSE; // Activation du zoom
    protected $_alt; // Texte alernatif
    protected $_link; // Lien en haut de l'image
    protected $_icone; // Titre de l'image

    /**
     * SetImage - Recupération de l'objet
     * @param object $i Object de type image
     */
    protected function SetImage($i)
    {
        // Si c'est une class Image
        if (get_class($i) == 'CATA\Photo\Image') {
            $this->_image = $i;
            // Si il y a un titre a affiché
            if (!is_null($i->Titre())) {
                $this->_titre = $i->Titre();
            }
        } else {
            $this->SetErreurMsg('Erreur Objet Image');
        }
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
     * SetZoom - Activation de la fonction zoom pour les images en haute definition
     * @param bool $z Description
     */
    protected function SetZoom($z)
    {
        if (is_bool($z)) {
            $this->_zoom = $z;
        } else {
            $this->setErreurMsg('Erreur Zoom');
        }
    }

    protected function SetLink($l)
    {
        $this->_link = NULL;
        if (!empty($l)) {
            $this->_link = $l;
        }
    }

    protected function SetIcone(bool $i)
    {
        if (is_bool($i) && $i) {
            $this->_icone = $i;
        }
    }

    /**
     * View - Génération du code HTML pour l'affichage du Bloc Image
     * @return string
     */
    public function ViewCard()
    {

        $i = $this->_image; // Object Image
        $class = NULL; // Initialisation de la class CSS
        $script = NULL; // Initialisation du Script JS
        // Gestion de l'erreur
        if (!$this->_erreur) {

            if ($this->_zoom) {
                // Script JS pour le Zoom
                $script = '<script>$(document).ready(
                            function () {
                                $("img.zoom").lightzoom({
                                    zoomPower   : 2.5,    //Default
                                    glassSize   : 360,  //Default
                                });
                            });</script>';
                // Ajout la class CSS
                $class = 'zoom';
            }

            // HTML
            $image = '<img class="card-img-top ' . $class . '" alt="' . $this->_titre . '" width="100%" src="' . $i->Dir() . '"/>';
            $footer = '<div class="card-footer small text-muted">' . $i->DateModif() . $this->_footer . '</div>';

            $html = '<div class="card mb-3">' . $image . $footer . '</div>';
            return $html . $script;
        } else {
            return $this->ErreurMsg();
        }
    }

    public function ViewJour()
    {

        $i = $this->_image; // Object Image  
        $icone = NULL;
        $titre = NULL;

        if (!$this->_erreur) {

            $titre = $i->Titre();

            if ($this->_icone) {
                $icone = '<i class="fas fa-camera mr-2"></i>';
            }
            if (!empty($i->Titre())) {
                $titre = $i->Titre();
            }

            $html = '<div class="card-header bg-white row m-0 p-0 mt-2 pb-2">'
                . '<div class="col-sm-10 p-0">' . $icone . '<i id="title">' . $titre . '</i></div>'
                . '<div class="col-sm-2 p-0"><a href="?page=archive" class="btn btn-info btn-sm ml-auto float-right">Archive</a></div>'
                . '</div>'
                . '<div class="card bg-secondary text-white mb-3 border-0">'
                . '<img class="photo-jour-bg" id="jour" src="' . $i->Thumb() . '" alt="' . $i->Dir() . '">'
                . '<div class="col-md-auto p-0 text-center" >'
                . '<img class="photo-jour rounded" id="jour" src="' . $i->Dir() . '" alt="' . $i->Dir() . '">'
                . '</div>'
                . '</div>';

            return $html;
        } else {
            return $this->_erreur_msg;
        }
    }

    public function View()
    {

        $i = $this->_image; // Object Image  
        $icone = NULL;
        $titre = NULL;

        if (!$this->_erreur) {

            $titre = $i->Titre();

            if ($this->_icone) {
                $icone = '<i class="fas fa-camera mr-2"></i>';
            }
            if (!empty($i->Titre())) {
                $titre = $i->Titre();
            }

            $html = '<a href="' . $i->Dir() . '" data-lightbox="example-set" data-title="' . $titre . '">'
                . '<div class="card ml-1 mr-1 bg-dark text-white border-0">'
                . '<img class ="card-img" style="height: 200px;" src="' . $i->Thumb() . '" alt="' . $i->Dir() . '">'
                . '<div class="card-img-overlay">'
                . $this->_link
                . '<div class="card-title" style="text-shadow: 0 0 10px black;"><p class="titre">' . $icone . $titre . '</p></div></div>'
                . '</div>'
                . '</a>';

            return $html;
        } else {
            return $this->_erreur_msg;
        }
    }

    //put your code here
}
