<?php
session_start();
require_once __DIR__ . '/config.php'; // Configuración en la misma carpeta

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $stmt = $mysqli->prepare("SELECT password_hash FROM admin_users WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($password_hash);
    $stmt->fetch();

    if ($password_hash && password_verify($password, $password_hash)) {
        $_SESSION['authenticated'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['last_activity'] = time();
        header('Location: admin.php');
        exit;
    } else {
        $error = 'Usuario o contraseña incorrectos.';
    }

    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Administración</title>
    <link rel="stylesheet" href="../public/assets/css/login.css">

</head>
<body>
    <div class="login-container">
        <h1>Login</h1>
        <?php if (isset($error)): ?>
            <p class="error"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Usuario" required>
            <input type="password" name="password" placeholder="Contraseña" required>
            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>
