<?php
require_once __DIR__ . '/config.php';

$mysqli = new mysqli(
    $_ENV['DB_HOST'], 
    $_ENV['DB_USER'], 
    $_ENV['DB_PASSWORD'], 
    $_ENV['DB_NAME']
);

if ($mysqli->connect_error) {
    die('Error de conexión: ' . $mysqli->connect_error);
}

// Manejar la subida de archivos
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['song_file'])) {
    $title = $_POST['title'];
    $file = $_FILES['song_file'];
    $upload_dir = __DIR__ . '/public/uploads/'; // Directorio para los archivos subidos
    $allowed_extensions = ['mp3']; // Solo archivos .mp3

    // Validar extensión del archivo
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, $allowed_extensions)) {
        die("Error: Solo se permiten archivos MP3.");
    }

    // Validar tamaño del archivo (máximo 5 MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        die("Error: El archivo es demasiado grande (máximo 5 MB).");
    }

    // Generar un nombre único para el archivo
    $file_name = uniqid() . '-' . basename($file['name']);
    $file_path = $upload_dir . $file_name;

    // Mover el archivo al directorio de uploads
    if (!move_uploaded_file($file['tmp_name'], $file_path)) {
        die("Error: No se pudo subir el archivo.");
    }

    // Guardar información en la base de datos
    $stmt = $mysqli->prepare("INSERT INTO songs (title, file_path) VALUES (?, ?)");
    $stmt->bind_param('ss', $title, $file_path);
    if ($stmt->execute()) {
        echo "Canción subida exitosamente.";
    } else {
        echo "Error al guardar en la base de datos: " . $stmt->error;
    }

    $stmt->close();
}
$mysqli->close();
?>
