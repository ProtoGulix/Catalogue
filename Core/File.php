<?php

namespace CATA;

/**
 * Description de File
 * 
 * @author Quentin CELLE TA68
 * 
 * MàJ :
 * [2019-12-27] Suppression d'un bug mineur sur la fonction SetExiste
 * [2020-01-10] Ajout de la fonction Copy. 
 * 
 */
class File {

    protected $_dir; // RACINE FICHIER
    protected $_existe = FALSE; // Bool TRUE: Existe FALSE: Absent
    protected $_type; // Type MIME du fichier
    protected $_date_modif; // Date de modification du Fichier

    /**
     * CONSTRUCTEUR
     * @param string $d Chemin du Fichier
     */

    public function __construct($d) {
        $this->setDir($d); // Chemin du fichier
        $this->setExiste(); // Controle de l'existance du fichier
        $this->setDateModif(); // Date de modification du fichier
        $this->setType(); // TYpe du fichier
    }

    /**
     * SetDIR - Hydrate le chemin d'acces du fichier
     * @param string $d Implemente le chemin du fichier
     */
    protected function setDir($d) {
        $this->_dir = $d;
    }

    /**
     * DIR - Retourne le chemin du fichier
     * @return string Chemin du fichier
     */
    public function Dir() {
        return $this->_dir;
    }

    /**
     * SetExiste - Hydrate et controle la présence du fichier
     * Controle l'existance du fichier. Si vrais la variable _existe = TRUE
     */
    protected function setExiste() {

        // Si le chemin n'a pas été renseigné et que ce n'est pas un Object
        if (!empty($this->_dir) AND ! is_object($this->_dir)) {
            // Contrôle de l'existance du fichier
            $this->_existe = file_exists($this->_dir);
        }
    }

    /**
     * Existe - Retourne un Bool 
     * @return bool TRUE si le fichier existe
     */
    public function Existe() {
        return $this->_existe;
    }

    /**
     * SetDATEMODIF - Récupére la date de modification du fichier
     * Récupére la date de modification du fichier "AAAA-MM-JJ HH:MM:SS"
     */
    public function setDateModif() {
        // Si le fichier existe
        if ($this->_existe) {
            // récupération de la date de modification du fichier mise au format AAAA-MM-JJ hh:mm:ss
            $this->_date_modif = date("Y-m-d H:i:s", filemtime($this->_dir));
        } else {
            $this->_date_modif = 'n/a';
        }
    }

    /**
     * DATEMODIF - Retourne la date de modification du fichier
     * @return string Date de modification du fichier
     */
    public function DateModif() {
        return 'Mise à jour : ' . $this->_date_modif;
    }

    /**
     * TYPE - Determination du type de fichier
     * @return string type MIME du fichier séléctionné
     */
    protected function setType() {
        // Si le fichier existe
        if ($this->_existe) {
            $mime = mime_content_type($this->_dir); // Récupération du Type MIME
            $t = substr($mime, strpos($mime, '/') + 1, strlen($mime)); // Extraction du type
            $this->_type = $t; // Hydratation de la variable
        }
    }
    
    public function Type(){
        return $this->_type;
    }

    public function Copier($dest) {
        if (!copy($this->_dir, $dest)) {
            echo "La copie du fichier $this->_dir vers $dest a échoué...\n";
        }
    }

    //put your code here
}
