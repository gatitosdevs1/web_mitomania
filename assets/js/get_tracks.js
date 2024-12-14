let tracksData = []; // Variable global para almacenar las canciones

// Petición AJAX para obtener los datos
$.ajax({
    url: "/php/get_tracks.php", // Ruta al archivo PHP
    method: "GET",
    dataType: "json",
    success: (response) => {
        console.log("Respuesta AJAX recibida:", response); // Debug
        if (response.tracks && response.tracks.length > 0) {
            tracksData = response.tracks; // Guardar los datos en la variable global
            populateMusicBars(tracksData); // Generar los reproductores
        } else {
            console.error("No se encontraron canciones en la respuesta.");
        }
    },
    error: (xhr, status, error) => {
        console.error("Error en la petición AJAX:", status, error);
        console.error("Detalles del error:", xhr.responseText);
    },
});

// Función para llenar las barras de música
function populateMusicBars(tracks) {
    const bars = document.querySelectorAll(".player-bar"); // Contenedores de los reproductores

    tracks.slice(0, bars.length).forEach((track, index) => {
        const { name, file_path, album_image, spotify_url } = track; // Extraer datos relevantes
        const audioPath = file_path; // Usar directamente la ruta proporcionada por PHP

        const bar = bars[index];
        while (bar.firstChild) {
            bar.removeChild(bar.firstChild); // Limpiar contenido previo
        }

        // Botón de reproducción
        const playButton = document.createElement("button");
        playButton.classList.add("play-pause-button");
        if (audioPath) {
            playButton.setAttribute("onclick", `playPreview('${audioPath}', '${album_image}', ${index})`);
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playButton.disabled = true;
            playButton.innerHTML = '<i class="fas fa-ban"></i>';
        }
        bar.appendChild(playButton);

        // Botón de Spotify
        if (spotify_url) {
            const spotifyButton = document.createElement("a");
            spotifyButton.classList.add("spotify-button");
            spotifyButton.href = spotify_url;
            spotifyButton.target = "_blank"; // Abrir en una nueva pestaña
            spotifyButton.innerHTML = '<i class="fab fa-spotify"></i>';
            bar.appendChild(spotifyButton);
        }

        // Nombre de la canción
        const trackName = document.createElement("span");
        trackName.textContent = name;
        trackName.classList.add("track-name");
        bar.appendChild(trackName);

        // Barra de progreso
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressBar.id = `progress-bar-${index}`;

        const progressFill = document.createElement("div");
        progressFill.classList.add("progress-fill");
        progressBar.appendChild(progressFill);

        bar.appendChild(progressBar);
    });
}


// Control de reproducción de pistas
let currentAudio = null,
    progressInterval = null,
    isPlaying = false,
    currentTrackIndex = null;

function playPreview(audioPath, albumImage, index) {
    console.log(`Intentando reproducir: ${audioPath}`);
    const playButton = $(`.play-pause-button`).eq(index);
    const progressBar = $(`#progress-bar-${index} .progress-fill`);

    updateAlbumImage(albumImage);

    if (currentTrackIndex === index && currentAudio) {
        isPlaying ? pauseAudio(playButton) : resumeAudio(playButton, progressBar);
    } else {
        if (currentAudio) resetPreviousAudio();
        startNewAudio(audioPath, index, playButton, progressBar);
    }
}

function startNewAudio(audioPath, index, playButton, progressBar) {
    currentAudio = new Audio(audioPath);

    currentAudio.addEventListener("loadedmetadata", () => {
        console.log(`Metadata cargada para: ${audioPath}`);
        currentAudio.play();
        isPlaying = true;
        currentTrackIndex = index;
        playButton.html('<i class="fas fa-pause"></i>');
        startProgressBar(progressBar, currentAudio.duration);

        currentAudio.addEventListener("ended", () => {
            resetTrack();
        });
    });

    currentAudio.addEventListener("error", (e) => {
        console.error("Error al cargar el archivo de audio:", audioPath);
        console.error("Detalles del error:", e);
        alert("No se pudo reproducir esta canción.");
        resetAlbumImage();
    });
}

function pauseAudio(playButton) {
    currentAudio.pause();
    isPlaying = false;
    playButton.html('<i class="fas fa-play"></i>');
    clearInterval(progressInterval);
}

function resumeAudio(playButton, progressBar) {
    currentAudio.play();
    isPlaying = true;
    playButton.html('<i class="fas fa-pause"></i>');
    startProgressBar(progressBar, currentAudio.duration);
}

function resetPreviousAudio() {
    currentAudio.pause();
    clearInterval(progressInterval);
    $(`.play-pause-button`).eq(currentTrackIndex).html('<i class="fas fa-play"></i>');
    $(`#progress-bar-${currentTrackIndex} .progress-fill`).css("width", "0%");
    resetAlbumImage();
}

function resetTrack() {
    clearInterval(progressInterval);
    isPlaying = false;
    currentAudio = null;
    $(`#progress-bar-${currentTrackIndex} .progress-fill`).css("width", "0%");
    $(`.play-pause-button`).eq(currentTrackIndex).html('<i class="fas fa-play"></i>');
    resetAlbumImage();
}

function startProgressBar(progressBar, duration) {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        const progress = (currentAudio.currentTime / duration) * 100;
        if (progress <= 100) {
            progressBar.css("width", `${progress}%`);
        } else {
            clearInterval(progressInterval);
        }
    }, 100);
}

function updateAlbumImage(albumImage) {
    const imageElement = document.querySelector(".music-lyrics-image");
    imageElement.src = albumImage || "./assets/img/default_musica.png";
}

function resetAlbumImage() {
    const imageElement = document.querySelector(".music-lyrics-image");
    imageElement.src = "./assets/img/default_musica.png";
}
