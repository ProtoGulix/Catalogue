<?php

namespace INTRA\Document;

use INTRA\File;

/**
 * Description de Log
 *
 * @author Quentin CELLE <quentin.celle@les2paluches.org>
 * 
 * MàJ:
 * [2020-01-08] Création
 * 
 */
class Log extends File {

    protected $_data;
    protected $_nb_ligne;

    public function __construct($d) {
        parent::__construct($d);

        // Calcule du nombre de ligne
        //$this->_nb_ligne = (int) count($this->_data);
    }


    /**
     * Write - Ecriture dans le fichier Log spécifier
     * @param string $d 
     * @param string $c
     */
    public function Write( string $d, string $c) {

        $content = "[$d] $c\n";
        $erreur = NULL;

        // Assurons nous que le fichier est accessible en écriture
        if (is_writable($this->_dir)) {

            // Dans notre exemple, nous ouvrons le fichier $filename en mode d'ajout
            // Le pointeur de fichier est placé à la fin du fichier
            // c'est là que $somecontent sera placé
            if (!$handle = fopen($this->_dir, 'a')) {
                $erreur = "Impossible d'ouvrir le fichier ($this->_dir)";
                exit;
            }

            // Ecrivons quelque chose dans notre fichier.
            if (fwrite($handle, $content) === FALSE) {
                $erreur = "Impossible d'écrire dans le fichier ($this->_dir)";
                exit;
            }
            fclose($handle);
        } else {
            $erreur = "Le fichier $this->_dir n'est pas accessible en écriture.";
        }

        // Si il y a des erreurs on les affiches
        echo $erreur;
    }

    /**
     * Read - Lecture du fichier Log
     * @return array [Date] => Ligne
     */
    public function Read() {

        // Récupération du fichier
        $data = (array) file($this->_dir);

        foreach ($data as $value) {

            $date = substr(strstr($value, ']', true), 1); // Récupération de la date
            $ligne = trim(substr($value, strpos($value, ']') + 2)); // Récupération de la ligne
            $this->_data[$date] = $ligne; // HYdratation du Tableau
        }

        return $this->_data;
    }

    // put your code here
}
