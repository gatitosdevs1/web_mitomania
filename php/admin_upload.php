<?php
require_once __DIR__ . '/config.php';

$message = ''; // Variable para el mensaje

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['song_file'])) {
    $title = $_POST['title'];
    $file = $_FILES['song_file'];
    $upload_dir = __DIR__ . '/../uploads/';
    $allowed_extensions = ['mp3'];

    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, $allowed_extensions)) {
        $message = "Error: Solo se permiten archivos MP3.";
    } elseif ($file['size'] > 5 * 1024 * 1024) {
        $message = "Error: El archivo es demasiado grande (máximo 5 MB).";
    } else {
        $file_name = uniqid() . '-' . basename($file['name']);
        $file_path = $upload_dir . $file_name;

        if (!move_uploaded_file($file['tmp_name'], $file_path)) {
            $message = "Error: No se pudo subir el archivo.";
        } else {
            $stmt = $mysqli->prepare("INSERT INTO songs (title, file_path) VALUES (?, ?)");
            $stmt->bind_param('ss', $title, $file_name);
            if ($stmt->execute()) {
                $message = "Canción subida exitosamente.";
            } else {
                $message = "Error al guardar en la base de datos: " . $stmt->error;
            }
            $stmt->close();
        }
    }
}
$mysqli->close();
