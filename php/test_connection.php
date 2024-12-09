<?php
require_once __DIR__ . '/config.php';

if ($mysqli->connect_error) {
    die('Error de conexión: ' . $mysqli->connect_error);
} else {
    echo 'Conexión exitosa a la base de datos: ' . $_ENV['DB_NAME'];
}
?>
