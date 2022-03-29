<?php

namespace CATA\Catalogue;

use CATA\Entite;

/**
 * Description of Page
 *
 * @author Quentin CELLE
 *
 * MàJ:
 * [2021-09-21] Création
 * [2022-03-24] Amélioratin des fonction ViewImage, ViewTableau, SetBloc
 * [2022-03-29] Ajout de la fonction ViewInfo et Changement de l'affichage de la fonction ViewTableau
 * 
 * @param array $data
 * ['id' => int, 'id_catalogue' => int, 'numero' => int, 'ratio' => int, 'bloc' => array Objet Bloc, 'image' =>]
 */
class Page extends Entite
{

    private $_id; // ID de la page dans la base de donnée
    private $_id_catalogue; // ID du catalogue
    private $_numero; // Numéro ou nom de la page
    private $_ratio = 1; // Ratio d'affichage
    private $_bloc; // Liste des blocs sous forme d'objet \CATA\Catalogue\Bloc
    private $_image; // Objet \CATA\Document\Image
    private $_thumb; // Objet \CATA\Document\Image
    private $_type; // Type de la page Index, Page de garde, ...
    private $_titre; // Titre de la page via bloc
    private $_supp; // Supplément d'information sur les bloc

    /**
     * Set ID
     * Determine l'ID du bloc
     * @param int $n
     */
    protected function setId($i)
    {
        $this->_id = $i;
    }

    /**
     * Set ID CATALOGUE
     * Determine l'ID du catalogue dans lequel ce trouve le bloc
     * @param int $i
     */
    protected function setId_catalogue($i)
    {
        $this->_id_catalogue = $i;
    }

    /**
     * Set NUMERO
     * Determine le numéro du bloc dans la page
     * @param int $n
     */
    protected function setNumero($n)
    {
        $this->_numero = $n;
    }

    /**
     * Set BLOC
     * Tableau des bloc de la page
     * @param array $n_array
     */
    protected function setBloc($b_array)
    {
        $this->_bloc = $b_array;
    }

    /**
     * Set IMAGE
     * Affecte le chemin absolu du fichier image
     * @param string $i Nom du fichier image
     */
    protected function setImage($i)
    {
        $i_dir = $GLOBALS['dir_image_page'] . '/' . $i;
        $image = new \CATA\Document\Image($i_dir);

        if ($image->Existe() && $image->Type() == 'jpeg') {
            $this->_image = $image;
        }
    }

    /**
     * Set THUMB
     * Affecte le chemin absolu de la miniature
     * @param string $t Nom du fichier Miniature
     */
    protected function setThumb($i)
    {
        $i_dir = $GLOBALS['dir_image_page'] . '/' . $i;
        $image = new \CATA\Document\Image($i_dir);

        if ($image->Existe() && $image->Type() == 'jpeg') {
            $this->_thumb = $image;
        }
    }

    protected function setSupp($s_array)
    {
        $this->_supp = $s_array;
    }

    protected function SetRatio($r)
    {
        $this->_ratio = floatval($r);
    }

    protected function SetType(int $t)
    {
        $this->_type = $t;
    }

    protected function SetTitre($t)
    {
        $this->_titre = $t;
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
        return $this->_thumb->View();
    }

    /**
     * ViewImage
     * Retourne une l'illustration de la page avec les bloc affecter à leur position
     * @return string HTML
     */
    public function ViewImage()
    {
        $bloc = NULL; // Initialisation
        $w_ratio = round($this->_image->With() * $this->_ratio); // Calcul du ratio en hauteur

        /** Hydratation des bloc */
        foreach ($this->_bloc as $b) {
            $box = new \CATA\View\Box(['Bloc' => new \CATA\Catalogue\Bloc($b), 'Ratio' => $this->_ratio]);
            $bloc .= $box->View();
        }

        return '<div class="card border p-3 rounded bg-dark text-center h-100"><div class="position-relative m-auto" width="' . $w_ratio . '">' . $this->_image->View($this->_ratio) . $bloc . '</div></div>';
    }

    /**
     * ViewTableau
     * Retourne un tableau des bloc assigé a cette page
     * @return string HTML
     */
    public function ViewTableau()
    {

        for ($i = 0; $i < count($this->_bloc); $i++) {
            $b = new \CATA\Catalogue\Bloc($this->_bloc[$i]);
            if (!empty($this->_supp[$i])) {
                $c = $this->_supp[$i];
            } else {
                $c = NULL;
            }
            $l[] = ['id' => $b->BlockNum(), 'title' => $b->Text(), 'content' => $c];
            # code...
        }

        $line = new \CATA\View\Accordion(['Line' => $l]);
        return $line->View();
    }

    /**
     * ViewInfo
     */
    public function ViewInfo()
    {
        $t_titre = F_PAGE_TITRE_EMPTY;
        foreach ($this->_bloc as $v) {
            if ($v['block_num'] == $this->_titre) {
                $t_titre = $v['text'];
            }
        }

        $titre = '<li class="list-group-item"><h1>' . $t_titre . '</h1></li>';
        $type = '<li class="list-group-item"><b>' . F_PAGE_TYPE . ' : </b>' . T_PAGE_TYPE[$this->_type] . '</li>';
        $nb_bloc = '<li class="list-group-item"><b>' . F_PAGE_NBBLOC . ' : </b>' . count($this->_bloc) . '</li>';

        $list = '<ul class="list-group list-group-flush">' . $titre . $type . $nb_bloc . '</ul>';

        $card = new \CATA\View\Card(['Content' => $list]);
        return $card->View();
    }

    //put your code here
}
