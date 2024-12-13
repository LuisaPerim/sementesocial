const avatarLink = document.getElementById('avatar-link');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-btn');

avatarLink.addEventListener('click', function() {
console.log('Cliquei no avatar!');
  sidebar.classList.add('open');
  sidebar.classList.remove('closed');
});

closeBtn.addEventListener('click', function() {
  sidebar.classList.add('closed');
  sidebar.classList.remove('open');
});

// Adiciona um evento para fechar a barra lateral quando clicar fora dela
document.addEventListener('click', function(event) {
  if (!sidebar.contains(event.target) && !avatarLink.contains(event.target)) {
    sidebar.classList.add('closed');
    sidebar.classList.remove('open');
  }
});