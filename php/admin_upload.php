<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['song_file'])) {
    $title = $_POST['title'];
    $file = $_FILES['song_file'];
    $upload_dir = __DIR__ . '/../uploads/';
    $allowed_extensions = ['mp3'];

    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, $allowed_extensions)) {
        die("Error: Solo se permiten archivos MP3.");
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        die("Error: El archivo es demasiado grande.");
    }

    $file_name = uniqid() . '-' . basename($file['name']);
    $file_path = $upload_dir . $file_name;

    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        die("Error al subir el archivo.");
    }

    $stmt = $mysqli->prepare("INSERT INTO songs (title, file_path) VALUES (?, ?)");
    $stmt->bind_param('ss', $title, $file_name);
    $stmt->execute();
    $stmt->close();

    echo "Canción subida exitosamente.";
}
?>
