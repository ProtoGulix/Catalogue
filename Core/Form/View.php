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
 * _______________
 * 
 * $setTitre =>
 * $setLegend =>
 * $setBouton =>
 * $setCilbe =>
 * $setField => Assemble les champ de formulaire correspondant en appelant automatiquement les builder HTML
 * $buildHTML => Appel toute les BUILDER des Class de champ instancier des FIELD
 * _______________
 * 
 * Fields => Tableau d'instance de Champ
 * Legend => Legend du fomulaire
 * Titre => Titre du Formulaire
 * Bouton => Texte du Bouton
 * Cible => cible du fromulaire 
 * 
 */

class View extends Entite {
    
    protected $_fields = []; // Tableau de tout les Champ instancié pour le formulaire
    protected $_legend;
    protected $_titre;
    protected $_bouton;
    protected $_cible;

    public function setTitre($titre){
        $this->_titre = $titre;
    }
    
    public function setLegend($legend){
        $this->_legend = $legend;
    }

    public function setFields(array $field){
        
        foreach ($field as $d ){
            $class = $d['Table']; // On Charge la valeur de Table qui nous indique le type de Champ
            $namespace = '\\CATA\Field\\'. $class; // Association avec le NameSpace absolue du Champ
            $instance =  new $namespace($d); // Instanciation dynamque de la Class corspondant au Champ
        
            $this->_fields [] = $instance; // On ajoute le champ a la liste des champs
        }
        
    }
    
    public function setBouton($bouton){
        $this->_bouton = '<button type="submit" class="btn btn-primary">'. $bouton .'</button>';
    }
    
    public function setCible($cible){
        $this->_cible = $cible;
    }

    public function HTML() {
        
        $html ='<h1>'. $this->_titre .'</h1>'; //Titre du Formulaire
        
        if (!empty($this->_legend)){ // Si le champ est renseigner
            $html .='<p>'. $this->_legend .'</p>'; //Legende du formulaire
        }
        
        $html .='<form action="'. $this->_cible .'" method="post">'; // Zome du formulaire
        
        foreach ($this->_fields as $field){ // On assemble les vues HTML de champ instancié
            $html .= '<div class="form-group">'. $field->buildHTML() .'</div>'; // Génération du HTML de Champ
        }
        
        $html .= $this->_bouton;
        return $html .='</form>'; // Renvois le HTML assemblé des Champs du Formulaire
    }
    
    //put your code here
}
