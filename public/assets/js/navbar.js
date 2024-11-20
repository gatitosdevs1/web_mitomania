// Referencias al navbar y al modal
const navbar = document.getElementById('navbar');
const modal = document.getElementById('menu-modal');

// Mostrar el modal al hacer clic en el navbar
navbar.addEventListener('click', () => {
  modal.style.display = 'flex';
});

// Cerrar el modal al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
