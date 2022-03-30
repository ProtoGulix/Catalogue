<?php

// SI une session est ouverte 
if ($session->Check()) {

    foreach ($_POST as $k => $v) {

        $k = htmlspecialchars($k);

        switch ($k) {
            case 'bloc_delete':
                for ($i = 0; $i < count($v); $i++) {
                    $id = htmlspecialchars($v[$i]);
                    $bdd->query('DELETE FROM bloc WHERE id =' . $id);
                }
                # code...
                break;
            case 'bloc_fusion':

                $left = NULL;
                $top = NULL;
                $right = 0;
                $bottom = 0;
                $max_right = 0;
                $max_bottom = 0;
                $text = NULL;

                for ($i = 0; $i < count($v); $i++) {

                    $id = htmlspecialchars($v[$i]);
                    $query = $bdd->query('SELECT * FROM bloc WHERE id = ' . $id);

                    while ($bloc = $query->fetch(PDO::FETCH_ASSOC)) {

                        $left = $bloc['left'];

                        $top = $bloc['top'];

                        if ($right < intval($bloc['left']) + intval($bloc['width'])) {
                            $right = intval($bloc['left']) + intval($bloc['width']);
                        }

                        if ($bottom < intval($bloc['top']) + intval($bloc['height'])) {
                            $bottom = intval($bloc['top']) + intval($bloc['height']);
                        }

                        $text .= $bloc['text'];
                    }
                    # code...
                }

                echo $left . ' ' . $top . ' ' . $right - $left . ' ' . $bottom - $top . ' ' . $text;

            default:
                # code...
                break;
        }
    }
}
