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

    protected function setBloc($b_array)
    {
        $this->_bloc = $b_array;
    }

    protected function setImage($i)
    {
        $i_dir = $GLOBALS['dir_image_page'] . '/' . $i;
        $image = new \CATA\Document\Image($i_dir);

        if ($image->Existe() && $image->Type() == 'jpeg') {
            $this->_image = $image;
        } else {
            $this->_erreur = true;
            $this->_erreur_msg = 'Erreur: l\'illustration séléctionné n\'est pas valide.';
        }
    }

    protected function setThumb($i)
    {
        $i_dir = $GLOBALS['dir_image_page'] . '/' . $i;
        $image = new \CATA\Document\Image($i_dir);

        if ($image->Existe() && $image->Type() == 'jpeg') {
            $this->_thumb = $image;
        } else {
            $this->_erreur = true;
            $this->_erreur_msg = 'Erreur: l\'illustration séléctionné n\'est pas valide.';
        }
    }

    protected function SetRatio($r)
    {
        $this->_ratio = floatval($r);
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
        $bloc = NULL;
        $w_ratio = round($this->_image->With() * $this->_ratio);

        foreach ($this->_bloc as $b) {
            $box = new \CATA\View\Box(['Bloc' => new \CATA\Catalogue\Bloc($b), 'Ratio' => $this->_ratio]);
            $bloc .= $box->View();
        }

        return '<div class="card border p-3 rounded bg-dark text-center" id="page-image"><div class="position-relative m-auto" width="' . $w_ratio . '">' . $this->_image->View($this->_ratio) . $bloc . '</div></div>';
    }

    public function ViewTableau()
    {
        $link =  NULL;
        foreach ($this->_bloc as $bloc) {
            $b = new \CATA\Catalogue\Bloc($bloc);
            $t[] = [
                'block_num' => $b->BlockNum(),
                $b->BlockNum(), $b->Text()
            ];
        }

        $table = new \CATA\View\Tableau(['Header' => ['ID', 'Bloc'], 'Content' => $t, 'id' => 'page-image']);

        return $table->View();
    }

    //put your code here
}
