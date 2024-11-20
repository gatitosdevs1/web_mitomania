// Selecciona el contenedor del álbum
const album = document.querySelector('.album-container');

// Alterna la rotación al hacer clic
album.addEventListener('click', () => {
  album.style.transform = album.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
});
