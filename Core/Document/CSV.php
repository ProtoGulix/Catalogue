<?php

namespace CATA\Document;

use CATA\File;

/**
 * Description de CSV
 * Lécture d'un fichier CSV avec la correction automatique des ';' généré par EXCEL remplacé par des ','
 *
 * @author Quentin CELLE TA68
 * 
 */
class CSV extends File {

    private $_title;
    private $_data;

    public function __construct($d) {
        parent::__construct($d);

        $row = 0;
        $handle = fopen($this->_dir, "r");
        while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
            $num = count($data);
            $a = NULL;
            if ($row == 0) {
                $key = $data;
                $this->_title = $data;
            } else {
                for ($c = 0; $c < $num; $c++) {
                    $a[$key[$c]] = $data[$c];
                }
                $this->_data[$row - 1] = $a;
            }

            $row++;
        }
        fclose($handle);
    }

    public function Title() {
        return $this->_title;
    }

    public function Data() {
        return $this->_data;
    }

    //put your code here
}
