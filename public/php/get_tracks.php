<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include(__DIR__ . '/spotify_auth.php');

// ID del artista en Spotify
$artist_id = '5xKK5hFACprzALHQzfbRHs'; // Ajusta según la banda que quieras consultar

// Obtener el Access Token
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
        'method' => 'GET'
    ]
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

// Formatear la salida
$formattedTracks = [];
foreach ($topTracks as $track) {
    $formattedTracks[] = [
        'name' => $track['name'], // Nombre de la canción
        'spotify_url' => $track['external_urls']['spotify'], // URL de Spotify
        'preview_url' => $track['preview_url'] ?? null, // Vista previa (opcional)
        'album_image' => $track['album']['images'][0]['url'] ?? null // Imagen del álbum
    ];
}

// Devolver el JSON al frontend
header('Content-Type: application/json');
echo json_encode(['tracks' => $formattedTracks]);
?>
