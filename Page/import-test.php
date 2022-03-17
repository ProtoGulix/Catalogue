<?php

include 'Config.php';

$catalogue = $_POST['CatalogueValid']; // ID Catalogue dans la BDD
$folder = $_POST['FolderValid']; // Nom du dossier dans dans le repertoire temporaire
$page = $_POST['PageValid']; // !!! ARRAY !!! Numéro pages à importé

$path = 'temps/' . $folder . '/';

echo $path;

if (is_dir($path)) {
    foreach ($page as $value) {
        $liste_block = new CATA\Document\CSV($path . '/csv/' . $folder . '-' . $value . '.csv');
        var_dump($liste_block);
    }
} else {
    echo 'echec';
}
