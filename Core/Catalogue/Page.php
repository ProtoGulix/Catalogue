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

        $this->_image = $image;
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

        $this->_thumb = $image;
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

    public function Titre()
    {
        return $this->_titre;
    }

    public function Type()
    {
        return $this->_type;
    }

    public function ViewThumb()
    {
        return $this->_thumb->View('100px');
    }

    public function Image()
    {
        return $this->_image;
    }

    public function Thumb()
    {
        return $this->_thumb;
    }

    public function Bloc()
    {
        return $this->_bloc;
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

        if (!is_null($this->_bloc)) {
            /** Hydratation des bloc */
            foreach ($this->_bloc as $b) {
                $box = new \CATA\View\Box(['Bloc' => new \CATA\Catalogue\Bloc($b)]);
                $bloc .= $box->View();
            }
        }
        return '<div style="position: relative;">' . $this->_image->View('100%') . $bloc . '</div>';
    }

    /**
     * ViewTableau
     * Retourne un tableau des bloc assigé a cette page
     * @return string HTML
     */
    public function ViewTableau()
    {

        if (!is_null($this->_bloc)) {
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
    }

    /**
     * ViewInfo
     */
    public function ViewInfo()
    {
        $t_titre = F_PAGE_TITRE_EMPTY;
        if (!is_null($this->_bloc)) {
            foreach ($this->_bloc as $v) {
                if ($v['block_num'] == $this->_titre) {
                    $t_titre = $v['text'];
                }
            }
            $nb = count($this->_bloc);
        } else {
            $nb = 0;
            $t_titre = NULL;
        }

        $titre = '<h2>' . $t_titre . '</h2>';
        $type = '<p><b>' . F_PAGE_TYPE . ' : </b>' . T_PAGE_TYPE[$this->_type] . '</p>';
        $nb_bloc = '<p"><b>' . F_PAGE_NBBLOC . ' : </b>' . $nb  . '</p>';

        return '<div class="ui segment">' . $titre . $type . $nb_bloc . '</div>';
    }

    public function ViewMini()
    {
        $query = ['page' => 'page', 'catalogue' => $this->_id_catalogue, 'no' => $this->_numero];
        $link = new \CATA\View\Link(['text' => $this->_titre . ' Titre', 'query' => $query]);
        $image = '<div class="ui segment"><img src="' . $this->_thumb->Dir() . '" width="100%" height="275px" style="object-fit: cover;"/></div>';
        $titre = '<div class="ui segment orange message">' . $link->View() . '</div>';
        $card = new \CATA\View\Card(['header' => $link->View(), 'image' =>  $this->ViewThumb(), 'content' => 'toto', 'Footer' => $this->_numero]);
        return '<div class="column four wide"><div class="ui raised segments center aligned">' . $titre . $image . '</div></div>';
    }

    //put your code here
}
