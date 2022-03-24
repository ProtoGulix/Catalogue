<?php

namespace CATA;

/**
 * Desciption de Control
 * 
 * Controle des session utilisateur
 * 
 * @author Quentin CELLE
 * 
 */
class Session
{

    protected $s_token_name = 'token';
    protected $c_token_name = 'authenticity_token';

    public function Open($data)
    {
        if (ini_get('register_globals') == '1') {
            echo 'Vous devriez mettre <b>register_globals</b> à <b>Off</b><br/>';
        }

        if (!isset($_COOKIE['authenticity_token'])) {
            $login = htmlspecialchars($data);
            $token = uniqid(rand(), true);

            $_SESSION['login'] = $login;
            $_SESSION[$this->s_token_name] = $token;
            $_SESSION['token_time'] = time();

            $this->SetCookie($this->c_token_name, $token);
            $this->SetCookie('login', $login);
        }
    }

    protected function SetCookie($name, $data)
    {
        setcookie(
            $name,
            $data,
            [
                'expires' => time() + 365 * 24 * 3600,
                'secure' => true,
                'httponly' => true,
            ]
        );
    }

    public function Close()
    {
        foreach ($_COOKIE as $key => $value) {
            $GLOBALS['affi_erreur'] = ['button' => TRUE, 'text' => 'Vous avez été deconnécter', 'type' => 'danger'];
            setcookie($key, NULL, -1); // Suppression du cookie client
            unset($_COOKIE[$key]); // Suppression de la valeur dans COOKIE
        }
    }

    public function Time()
    {
        return time() - $_SESSION['token_time'];
    }

    public function Check()
    {
        // Si le coookie et la session sont cree
        if (isset($_COOKIE[$this->c_token_name]) && isset($_SESSION[$this->s_token_name])) {
            // Si le jeton du cookie et de la session sont bien les méme
            if ($_COOKIE[$this->c_token_name] == $_SESSION[$this->s_token_name]) {

                if ($this->Time() <= (15 * 60)) {
                    return TRUE;
                } else {
                    $this->Close();
                }
            }
        }
    }
}
