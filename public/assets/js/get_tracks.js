// Fetch and display top tracks on page load
$.ajax({
  url: "../php/get_tracks.php",
  method: "GET",
  dataType: "json",
  success: (response) => {
    console.log("AJAX Success Response:", response);
    if (response.tracks) {
      populateMusicBars(response.tracks);
    } else {
      console.error("No tracks found in the response");
    }
  },
  error: (err) => {
    console.error("AJAX request failed:", err);
  },
});

function populateMusicBars(tracks) {
  const bars = document.querySelectorAll(".player-bar");

  tracks.slice(0, bars.length).forEach((track, index) => {
    const { name, preview_url, spotify_url } = track;

    const bar = bars[index];

    // Limpia completamente la barra antigua (remueve todo su contenido)
    while (bar.firstChild) {
      bar.removeChild(bar.firstChild);
    }

    // Botón de reproducción
    const playButton = document.createElement("button");
    playButton.classList.add("play-pause-button");
    playButton.setAttribute("onclick", `playPreview('${preview_url}', ${index})`);
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    bar.appendChild(playButton);

    // Ícono de Spotify
    const spotifyIcon = document.createElement("a");
    spotifyIcon.classList.add("spotify-icon");
    spotifyIcon.href = spotify_url;
    spotifyIcon.target = "_blank"; // Abre en nueva pestaña
    spotifyIcon.innerHTML = '<i class="fab fa-spotify"></i>';
    bar.appendChild(spotifyIcon);

    // Nombre de la canción
    const trackName = document.createElement("span");
    trackName.textContent = name;
    trackName.classList.add("track-name");
    bar.appendChild(trackName);

    // Barra de progreso funcional
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.id = `progress-bar-${index}`;

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");
    progressBar.appendChild(progressFill);

    bar.appendChild(progressBar);
  });
}



let currentAudio = null,
  progressInterval = null,
  isPlaying = false,
  currentTrackIndex = null,
  tracksData = []; // Variable global para almacenar las canciones

// Fetch and display top tracks on page load
$.ajax({
  url: "../php/get_tracks.php",
  method: "GET",
  dataType: "json",
  success: (response) => {
    console.log("AJAX Success Response:", response);
    if (response.tracks) {
      tracksData = response.tracks; // Guardar las canciones en la variable global
      populateMusicBars(response.tracks);
    } else {
      console.error("No tracks found in the response");
    }
  },
  error: (err) => {
    console.error("AJAX request failed:", err);
  },
});

function populateMusicBars(tracks) {
  const bars = document.querySelectorAll(".player-bar");

  tracks.slice(0, bars.length).forEach((track, index) => {
    const { name, preview_url, spotify_url } = track;

    const bar = bars[index];

    // Limpia completamente la barra antigua (remueve todo su contenido)
    while (bar.firstChild) {
      bar.removeChild(bar.firstChild);
    }

    // Botón de reproducción
    const playButton = document.createElement("button");
    playButton.classList.add("play-pause-button");
    playButton.setAttribute("onclick", `playPreview('${preview_url}', ${index})`);
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    bar.appendChild(playButton);

    // Ícono de Spotify
    const spotifyIcon = document.createElement("a");
    spotifyIcon.classList.add("spotify-icon");
    spotifyIcon.href = spotify_url;
    spotifyIcon.target = "_blank"; // Abre en nueva pestaña
    spotifyIcon.innerHTML = '<i class="fab fa-spotify"></i>';
    bar.appendChild(spotifyIcon);

    // Nombre de la canción
    const trackName = document.createElement("span");
    trackName.textContent = name;
    trackName.classList.add("track-name");
    bar.appendChild(trackName);

    // Barra de progreso funcional
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.id = `progress-bar-${index}`;

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");
    progressBar.appendChild(progressFill);

    bar.appendChild(progressBar);
  });
}

function playPreview(previewUrl, index) {
  const playButton = $(`.play-pause-button`).eq(index);
  const progressBar = $(`#progress-bar-${index} .progress-fill`);
  const albumImage = tracksData[index].album_image; // Usar tracksData global para obtener la imagen

  if (currentTrackIndex === index && currentAudio) {
    isPlaying ? pauseAudio(playButton) : resumeAudio(playButton, progressBar);
  } else {
    if (currentAudio) resetPreviousAudio();
    startNewAudio(previewUrl, index, playButton, progressBar, albumImage);
  }
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
}

function startNewAudio(previewUrl, index, playButton, progressBar, albumImage) {
  currentAudio = new Audio(previewUrl);

  // Actualiza la carátula de la canción en el cuadro
  updateAlbumImage(albumImage);

  currentAudio.addEventListener("loadedmetadata", () => {
    const duration = currentAudio.duration;

    currentAudio.play();
    isPlaying = true;
    currentTrackIndex = index;
    playButton.html('<i class="fas fa-pause"></i>');
    startProgressBar(progressBar, duration);

    currentAudio.addEventListener("ended", () => {
      resetTrack();
      resetAlbumImage(); // Restablece la imagen predeterminada al terminar la reproducción
    });
  });
}

function resetTrack() {
  clearInterval(progressInterval);
  isPlaying = false;
  currentAudio = null;
  $(`#progress-bar-${currentTrackIndex} .progress-fill`).css("width", "0%");
  $(`.play-pause-button`).eq(currentTrackIndex).html('<i class="fas fa-play"></i>');
  resetAlbumImage(); // Restablece la imagen predeterminada
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

// Actualiza la carátula de la canción
function updateAlbumImage(albumImage) {
  const imageElement = document.querySelector(".music-lyrics-image");
  imageElement.src = albumImage || "./assets/img/default_musica.png";
}

// Restablece la imagen predeterminada
function resetAlbumImage() {
  const imageElement = document.querySelector(".music-lyrics-image");
  imageElement.src = "./assets/img/default_musica.png";
}
