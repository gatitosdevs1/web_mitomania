<?php
session_start();
require_once __DIR__ . '/config.php';

define('SESSION_TIMEOUT', 1800);

// Verificar si el usuario está autenticado
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Location: /php/login.php');
    exit;
}

// Verificar si la sesión ha expirado
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > SESSION_TIMEOUT) {
    session_unset();
    session_destroy();
    header('Location: /php/login.php?message=session_expired');
    exit;
}

// Actualizar actividad de la sesión
$_SESSION['last_activity'] = time();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Administrador</title>
  <link rel="stylesheet" href="/assets/css/admin.css">
</head>
<body>
  <header>
    <h1>Panel de Administración</h1>
    <a href="/php/logout.php" style="position: absolute; top: 10px; right: 20px; color: #ff4dff; text-decoration: none;">Cerrar sesión</a>
  </header>
  <main>
    <div class="form-container">
      <h2>Subir Canciones</h2>
      <form action="admin_upload.php" method="POST" enctype="multipart/form-data">
        <label for="title">Título de la Canción:</label>
        <input type="text" id="title" name="title" placeholder="Título de la canción" required>

        <label for="song_file">Archivo MP3:</label>
        <input type="file" id="song_file" name="song_file" accept="audio/mp3" required>

        <button type="submit" class="submit-btn">Subir Canción</button>
      </form>
    </div>
  </main>
  <footer>
    &copy; 2024 Mitomanía. Todos los derechos reservados.
  </footer>
</body>
</html>
