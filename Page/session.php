<?php

$session = new CATA\Session();
if (isset($_GET['id'])) {
    $session->Open(htmlspecialchars($_GET['id']));
}

if ($session->Check()) {
    $container .= 'Bonjour ' . htmlspecialchars($_COOKIE['authenticity_token']) . '!</br>';
    $container .= $session->Time() / 60 . 'minutes';
} else {
    $container .= 'Aucune session active trouvé ! <a href="?page=session&id=quentin">Connexion</a>';
}
