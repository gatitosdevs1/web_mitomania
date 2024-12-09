<?php

require_once __DIR__ . '/config.php';

// Consulta para obtener las canciones más escuchadas
$query = "SELECT title, file_path FROM songs ORDER BY id DESC LIMIT 4";
$result = $mysqli->query($query);

if (!$result) {
    die("Error al realizar la consulta: " . $mysqli->error);
}

// Extraer las canciones en un arreglo
$tracks = [];
while ($row = $result->fetch_assoc()) {
    $tracks[] = [
        'name' => $row['title'],
        'file_path' => $row['file_path']
    ];
}

// Imprimir el JSON
header('Content-Type: application/json');
echo json_encode(['tracks' => $tracks]);

// Para debug:
var_dump($tracks);
exit;

?>



<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/spotify_auth.php';

// ID del artista en Spotify
$artist_id = '5xKK5hFACprzALHQzfbRHs';

// Obtener el Access Token de Spotify
$access_token = getAccessToken();
if (!$access_token) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unable to fetch Spotify access token']);
    exit;
}

// URL de la API de Spotify para las canciones más escuchadas
$url = "https://api.spotify.com/v1/artists/$artist_id/top-tracks?market=CL";
$options = [
    'http' => [
        'header' => "Authorization: Bearer $access_token",
        'method' => 'GET',
    ],
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Unable to fetch data from Spotify API']);
    exit;
}

$decodedResponse = json_decode($response, true);
if (!isset($decodedResponse['tracks']) || empty($decodedResponse['tracks'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No tracks data returned from Spotify API']);
    exit;
}

// Seleccionar las 4 canciones más populares
$topTracks = array_slice($decodedResponse['tracks'], 0, 4);

// Conectar con la base de datos
$mysqli = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD'],
    $_ENV['DB_NAME']
);

if ($mysqli->connect_error) {
    die('Error de conexión: ' . $mysqli->connect_error);
}

// Buscar las canciones en la base de datos
$tracksWithFiles = [];
foreach ($topTracks as $track) {
    $name = $track['name'];

    $stmt = $mysqli->prepare("SELECT file_path FROM songs WHERE title = ?");
    $stmt->bind_param('s', $name);
    $stmt->execute();
    $stmt->bind_result($file_path);
    if ($stmt->fetch()) {
        $tracksWithFiles[] = [
            'name' => $name,
            'file_path' => '/uploads/' . $file_path, // Ruta del archivo en el servidor
            'album_image' => $track['album']['images'][0]['url'] ?? null, // Imagen del álbum
        ];
    }
    $stmt->close();
}

// Cerrar la conexión a la base de datos
$mysqli->close();

// Devolver el JSON al frontend
header('Content-Type: application/json');
echo json_encode(['tracks' => $tracksWithFiles]);
?>
