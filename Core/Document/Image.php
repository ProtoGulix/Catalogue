<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace CATA\Document;

use CATA\File;

/**
 * Description of Image
 *
 * @author Quentin
 */
class Image extends File {

    protected $_width;
    protected $_height;

    public function __construct($d) {
        parent::__construct($d);

        if ($this->_existe && $this->_type == 'jpeg') {
            $size = getimagesize($this->_dir);

            $this->_width = $size[0];
            $this->_height = $size[1];
        }
    }

    public function View(float $s) {

        $width = 'width="' . $this->_width . '"';
        $height = 'height="' . $this->_height . '"';

        if ($s > 0) {
            $width = 'width="' . $this->_width * floatval($s) . '"';
            $height = 'height="' . $this->_height * floatval($s) . '"';;
        }

        $balise = '<img ' . $width . $height . ' src="' . $this->_dir . '"/>';

        return $balise;
    }

    //put your code here
}
