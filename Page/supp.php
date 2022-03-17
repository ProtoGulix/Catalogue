<?php

foreach ($_GET as $query_string_variable => $value) {
    switch ($query_string_variable) {
        case 'id':
            $supp['id'] = intval($value);
            break;
    }
}

try {
    $bdd = new PDO($GLOBALS['dsn'], $GLOBALS['username']);
    $data = $bdd->prepare('DELETE FROM `bloc` WHERE id=:id');
    $data->execute(array(':id' => $supp['id']));

    header("Refresh:5; url=?page=page&catalogue=series-3-part-manual-1&no=29");
} catch (Exception $ex) {
    die('Erreur : ' . $ex->getMessage());
}

$container .= $supp['id'];
