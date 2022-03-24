<?php

namespace CATA\Form;

use CATA\Entite;

/**
 * Description of Form-View 
 * 
 * Hydraté par un tableau la class permet d'instancier les class de champs correspont.
 * 
 * --> Herite de ENTITE pour les fonction d'hydration dynamique
 * 
 * @author Quentin CELLE
 * 
 * MàJ:
 * [2022-03-17] Simplification du code de View()
 * 
 * _______________
 * 
 * Fields => Tableau d'instance de Champ
 * Legend => Legend du fomulaire
 * Titre => Titre du Formulaire
 * Bouton => Texte du Bouton
 * Cible => cible du fromulaire 
 * 
 */

class View extends Entite
{

    protected $_fields = []; // Tableau de tout les Champ instancié pour le formulaire
    protected $_legend;
    protected $_titre;
    protected $_bouton;
    protected $_cible;
    protected $_name;

    public function setTitre($titre)
    {
        $this->_titre = '<h1>' . $titre . '</h1>'; // Titre du Formulaire
    }

    public function setLegend($legend)
    {
        $this->_legend = '<p>' . $legend . '</p>'; // Legende du Formulaire
    }

    public function setName($n)
    {
        $this->_name = $n;
    }
    public function setFields(array $field)
    {
        foreach ($field as $d) {

            if (!is_null($d['Table'])) {
                $class = $d['Table']; // On Charge la valeur de Table qui nous indique le type de Champ

                if (!is_null($this->_name)) {
                    $d['Name'] = $this->_name . '[' . $d['Name'] . ']';
                }

                if (is_file('Core/Field/' . $class . '.php')) {
                    $namespace = '\\CATA\Field\\' . $class; // Association avec le NameSpace absolue du Champ
                    $instance =  new $namespace($d); // Instanciation dynamque de la Class corspondant au Champ
                    $this->_fields[] = $instance; // On ajoute le champ a la liste des champs
                } else {
                    $this->_erreur = true;
                    $this->_erreur_msg = 'le champ <b>' . $class . '</b> n\'existe pas!';
                }
            }
        }
    }

    public function setBouton($bouton)
    {
        $this->_bouton = '<button type="submit" class="btn btn-primary" >' . $bouton . '</button>';
    }

    public function setCible($cible)
    {
        $this->_cible = 'action="' . $cible . '"';
    }

    public function View()
    {

        if (isset($_COOKIE['authenticity_token'])) {
            // Ajout du Token de sécurité
            $secu = new \CATA\Field\Hidden(['Name' => 'authenticity_token', 'Value' => htmlspecialchars($_COOKIE['authenticity_token']), 'Type' => 'hidden']);
            $secu_token = $secu->buildHTML();
        } else {
            $secu_token = NULL;
        }

        $f_html = NULL;

        foreach ($this->_fields as $field) { // On assemble les vues HTML de champ instancié
            //$f_html .= '<div class="form-group">' . $field->buildHTML() . '</div>'; // Génération du HTML de Champ
            $f_html .=  $field->buildHTML(); // Génération du HTML de Champ
        }

        return '<form ' . $this->_cible . ' method="POST">' . $this->_titre . $this->_legend . $f_html . $secu_token . $this->_bouton . '</form>'; // Renvois le HTML assemblé des Champs du Formulaire
    }

    //put your code here
}
