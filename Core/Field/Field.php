<?php

namespace CATA\Field;

use CATA\Entite; // Force l'heritage d'Entite

/**
 * Paramétre des champs d'un formulaire
 * 
 * --> Herite de d'ENTITE pour la fonction d'hydratation
 *
 * @author Quentin CELLE
 * _______________
 * 
 * Label => Label du Champ HTML,
 * Name => Nom du champ de formualire pour POST
 * Value => Valeur par defaut (si precharge si non NULL),
 * Lock => (BOOL) Vérouillage du champ
 * ErrorMessage => Retour de la valuer erreur apres control
 * 
 * MàJ:
 * [2021-09-17] Ajout de la fonction lock pour vérouillé les champs
 * 
 */
abstract class Field extends Entite
{

    protected $_label; // Label du Champ
    protected $_name; // Nom du champ qui correspond a la ligne sur la table SQL
    protected $_value; // Valeur du champ
    protected $_lock = false; // Blocage de la valeur du champ
    protected $_errorMessage; // Message d'erreur si format incorrect 

    public function label()
    {
        return $this->_label;
    }

    public function name()
    {
        return $this->_name;
    }

    public function value()
    {
        return $this->_value;
    }

    public function isValid()
    {
        //Methode qui retourne si le champ est valide
    }

    public function setLabel($label)
    {
        $this->_label = (string) $label;
    }

    public function setName($name)
    {
        $this->_name = (string) $name;
    }

    public function setValue($value)
    {
        $this->_value = $value;
    }

    public function setLock(bool $l)
    {
        $this->_lock = $l;
    }

    //put your code here
}
