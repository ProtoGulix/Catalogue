<?php

namespace CATA\Catalogue;

use CATA\Entite;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Page
 *
 * @author Quentin
 *
 * MàJ:
 * [2021-09-21] Création
 */
class Page extends Entite
{

    private $_id; // ID de la page dans la base de donnée
    private $_id_catalogue; // ID du catalogue
    private $_numero; // Numéro ou nom de la page
    private $_bloc; // Liste des blocs sous forme d'objet \CATA\Catalogue\Bloc
    private $_image; // Objet \CATA\Document\Image

    /**
     *
     * @param type $n
     */
    protected function setId($i)
    {
        $this->_id = $i;
    }

    protected function setId_catalogue($i)
    {
        $this->_id_catalogue = $i;
    }

    protected function setNumero($n)
    {
        $this->_numero = $n;
    }

    protected function setBloc($b)
    {
        $this->_bloc = $b;
    }

    protected function setImage($i)
    {

        $image = new \CATA\Document\Image($i);

        if ($image->Existe() && $image->Type() == 'jpeg') {
            $this->_image = $image;
        } else {
            $this->_erreur = true;
            $this->_erreur_msg = 'Erreur: l\'illustration séléctionné n\'est pas valide.';
        }
    }

    public function Id()
    {
        return $this->_id;
    }

    public function IdCatalogue()
    {
        return $this->_id_catalogue;
    }

    public function Numero()
    {
        return $this->_numero;
    }

    public function ViewThumb()
    {
        return $this->_image->View(0.1);
    }

    public function ViewImage($r)
    {

        $b = NULL;
        $ratio = floatval($r);

        foreach ($this->_bloc as $bloc) {
            $b_data = ['Bloc' => $bloc, 'Ratio' => $ratio];
            $box = new \CATA\View\Box($b_data);
            $b .= $box->HTML();
        }

        return '<div style="position: relative;">' . $this->_illustration->View($ratio) . $b . '</div>';
    }

    public function ViewTableau()
    {
        foreach ($this->_bloc as $bloc) {
        }
    }

    //put your code here
}
