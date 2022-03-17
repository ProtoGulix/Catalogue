<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace INTRA\View;

/**
 * Description of MenuDeroulant
 *
 * @author Quentin CELLE
 * 
 * MàJ
 *  [2020-10-22] Création
 *  [2020-10-24] Ajout de commentaire dans le Code
 */
class MenuDeroulant {

    protected $_titre;
    protected $_data; // Liste de genres
    protected $_query; // Contenue de la requet GET

    /**
     * Extration de la liste des genres disponible dans un fichier JSON
     * 
     * @param type $path Chemin d'accÃ©s au fichier JSON
     * @param array $query Tableau de requette contenent la ligne ['Genres']
     */
    public function __construct($titre, $data, $query) {

        $this->_titre = ucwords($titre); // Titre du menu déroulant
        $this->_query = $query; // Propagateur Query
        $this->_data = $data; // Liste des éléments du Menu déroulant
    }

    /**
     * ButtomView - Retourne le code du bonton principale  
     * @return string HTML
     */
    private Function ButtonView() {

        // Affichage du Nom de la séléction si ID trouvé dans le Propagateur
        foreach ($this->_data as $value) {
            if ($this->_query['id'] == $value['id']) {
                $genre = ' : ' . $value['name'];
                break;
            }else{
                $genre = NULL;
            }
        }
        
        // On retroune le code du Bouton avec le Nom de de l'ID correspondant
        $html = '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'. $this->_titre . $genre . ' </button>';
        return $html;
    }

    /**
     * ListView - Retourne le code des éléments du déroulant du menu
     * @return string HTML
     */
    private function ListView() {
        
        $html = NULL; // Initialisation de la Variable

        // Boucle d'appele des éléments de la liste
        foreach ($this->_data as $key) {

            // Class CSS
            $class = 'dropdown-item';
            if ($this->_query['id'] == $key['id']) {
                $class .= ' active';
            }

            // Hydratation des éléments de la Class Link
            $link_data['text'] = $key['name'];
            $link_data['Query'] = ['page' => $this->_query['page'],'selection' => 'genre', 'id' => $key['id']];
            $link_data['class'] = $class;
            // Appel du Link
            $a_link = new \INTRA\View\Link($link_data);

            // Ajout aux éléments déjà appeler
            $html .= $a_link->View();
        }

        // On retourne tout les éléments en HTML
        return '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' . $html . '</div>';
    }

    /**
     * View - Viewer de la class
     * @return string HTML
     */
    public function View() {

        // Appel des Fonction Bouton et List
        $html = '<div class="dropdown">' . $this->ButtonView() . $this->ListView() . '</div>';

        return $html;
    }

    //put your code here
}

