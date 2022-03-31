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

                        var_dump($bloc);

                        if ($left == 0 or $left < $bloc['left']) {
                            $left = $bloc['left'];
                        }

                        if ($top == 0) {
                            $top = $bloc['top'];
                        }
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

                $data = [
                    'left' => $left,
                    'top' => $top,
                    'width' => $right - $left,
                    'height' => $bottom - $top,
                    'text' => trim($text),
                    'id' => $id,
                ];
                $sql = 'UPDATE `bloc` SET `left`=:left, `top`=:top, `width`=:width, `height`=:height, `text`=:text WHERE `id`=:id';
                $stmt = $bdd->prepare($sql);
                $stmt->execute($data);
                //echo 'left: ' . $left . ' </br>top: ' . $top . '</br>width: ' . $right - $left . '</br>height: ' . $bottom - $top . '</br>texte: ' . trim($text);

            default:
                # code...
                break;
        }
    }
}
