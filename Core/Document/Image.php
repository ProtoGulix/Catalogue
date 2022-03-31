<?php

namespace CATA\Document;

use CATA\File;

/**
 * Description of Image
 *
 * @author Quentin CELLE
 * 
 * MàJ
 * [2022-03-25] Ajout des fonction Resize / GetMethodGD et correction bug mineur sur View et Resize
 */
class Image extends File
{

    protected $_width;
    protected $_height;

    public function __construct($d)
    {
        parent::__construct($d);

        if ($this->_existe && $this->_type == 'jpeg') {
            $size = getimagesize($this->_dir);

            $this->_width = $size[0];
            $this->_height = $size[1];
        }
    }

    public function With()
    {
        return $this->_width;
    }

    public function Height()
    {
        return $this->_height;
    }

    /**
     * RESIZE - Redimentionnement des images
     * @param String $path_d Chemin de destination du fichier image
     * @param type $w Largeur en pixel du fichier de destination
     * @param type $h Hauteur en pixel du fichie de destination
     */
    public function Resize($path_d, $w = 200, $h = 200)
    {

        // Calcule du ratio d'origine
        $ratio_orig = $this->_width / $this->_height;

        // Calcul des nouvelles dimentions de l'image en fonction du ratio d'origine
        if ($w / $h > $ratio_orig) {
            $w = $h * $ratio_orig;
        } else {
            $h = $w / $ratio_orig;
        }

        // Selection de la méthode 
        $methode = $this->GetMethodeGD($this->Type());
        $image_o = $methode($this->_dir);

        // Création de l'image de destination
        $image_d = imagecreatetruecolor($w, $h);
        // Redimentionnement
        imagecopyresampled($image_d, $image_o, 0, 0, 0, 0, $w, $h, $this->_width, $this->_height);
        // Sauvegarde
        imagejpeg($image_d, $path_d);
    }

    /**
     * GetMethodeGD - Retourne la méthode GD pour la création d'une image
     * @param string $t
     * @return string
     */
    public function GetMethodeGD(string $t)
    {
        // Création d'une image en fonction du type
        switch ($t) {
            case 'png': // PNG
                $image_o = 'imagecreatefrompng';
                break;
            case 'gif': // GIF
                $image_o = 'imagecreatefromgif';
                break;
            case 'x-ms-bmp': // type MIME pour le le BMP
                $image_o = 'imagecreatefrombmp';
                break;
            default:
                /**
                 * JPEG étant le format le plus courant pour les photo c'est celui par defaut
                 * Si toute fois le fichier n'est pas dans la séléction une image noir sera crée
                 */
                $image_o = 'imagecreatefromjpeg';
                break;
        }

        return $image_o;
    }

    public function View($s)
    {

        if (!empty($s)) {
            $width = 'width="' . $s . '"';
            $height = NULL;
        } else {
            $width = NULL;
            $height = NULL;
        }


        $balise = '<img id="illustration" class="ui fluid image" ' . $width . $height . ' src="' . $this->_dir . '"/>';

        return $balise;
    }

    //put your code here
}
