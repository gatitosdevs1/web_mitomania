document.querySelectorAll('.play-pause-button').forEach((button) => {
    button.addEventListener('click', () => {
      const icon = button.querySelector('i');
      const isPlaying = icon.classList.contains('fa-pause');
  
      // Alternar ícono
      if (isPlaying) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      } else {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      }
  
      // Lógica de reproducción: Aquí iría la funcionalidad del audio
    });
  });
  