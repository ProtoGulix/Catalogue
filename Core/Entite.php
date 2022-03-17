<?php

namespace CATA;

/**
 * Description of Entites
 *
 * @author Quentin CELLE TA68
 * 
 * MàJ:
 * [2020-01-09] Mise a jour des commentaire de Code
 * 
 */
abstract class Entite {

    protected $_erreur = FALSE; // Classe en erreur = TRUE
    protected $_erreur_msg; // Message d'erreur de la Classe

    public function __construct($donnees) {
        if (!is_null($donnees)) {
            foreach ($donnees as $key => $value) {
                // On récupère le nom du setter correspondant à l'attribut.
                $method = 'set' . ucfirst($key);

                // Si le setter correspondant existe.
                if (method_exists($this, $method)) {
                    // On appelle le setter.
                    $this->$method($value);
                } else {
                    // Si une erreur c'est produit on la reporte
                    $this->_erreur = TRUE;
                    $this->_erreur_msg .= 'la méthode <b>' . $method . '</b> n\'existe pas !</br>';
                }
            }
        } else {
            // Si l'erreur est plus grave ?!
            $this->_erreur = TRUE;
            $this->_erreur_msg = 'Erreur de construction de l\'object';
        }
    }
    
    protected function SetErreur(){
        $this->_erreur = true;
    }

    protected function setErreurMsg($m) {
        $this->_erreur_msg = $m;
    }

    /**
     * ErreurMsg - Retourne le message d'erreur courant
     * @return string
     */
    public function ErreurMsg(){
        return $this->_erreur_msg;
    }

    /**
     * Erreur - Retourne si la classe est en Erreur
     * @return bool
     */
    public function Erreur() {
        return $this->_erreur;
    }

    //put your code here
}
