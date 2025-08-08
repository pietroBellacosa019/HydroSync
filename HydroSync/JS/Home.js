// Remover tela de carregamento
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
  }, 3000); // 3 segundo de delay 
});

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

// Verificar preferência do usuário
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});

// Carrossel Aprimorado
const carousel = document.getElementById('carousel');
const slides = Array.from(carousel.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let slideInterval;

// Criar dots de navegação
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.dataset.index = index;
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotContainer.appendChild(dot);
});

const dots = Array.from(dotContainer.children);

// Função para ir para um slide específico
function goToSlide(index) {
  if (index < 0) {
    index = slides.length - 1;
  } else if (index >= slides.length) {
    index = 0;
  }

  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
  currentIndex = index;
  resetAutoSlide();
}

// Navegação manual
prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

// Auto slide
function startAutoSlide() {
  slideInterval = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

startAutoSlide();

// Pausar auto slide no hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
carouselContainer.addEventListener('mouseleave', startAutoSlide);

// Swipe Mobile
let touchStartX = 0;
let touchEndX = 0;

carouselContainer.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  clearInterval(slideInterval);
}, {passive: true});

carouselContainer.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startAutoSlide();
}, {passive: true});

function handleSwipe() {
  const difference = touchStartX - touchEndX;
  if (difference > 50) {
    goToSlide(currentIndex + 1);
  } else if (difference < -50) {
    goToSlide(currentIndex - 1);
  }
}

// Efeito de hover nos cards
const cards = document.querySelectorAll('.card, .feature-card');
cards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.05}s`;
});

// Atualizar badge de notificações não lidas
function updateNotificationBadge() {
  // Na implementação real, você buscaria esse valor do localStorage ou de uma API
  const unreadCount = localStorage.getItem('unreadNotifications') || 3;
  
  const notificationFeature = document.querySelector('a[href="Notificações.html"]');
  
  if (notificationFeature && unreadCount > 0) {
    // Remove o badge existente se houver
    const existingBadge = notificationFeature.querySelector('.notification-badge');
    if (existingBadge) {
      existingBadge.remove();
    }
    
    // Cria o novo badge
    const notificationBadge = document.createElement('span');
    notificationBadge.className = 'notification-badge';
    notificationBadge.textContent = unreadCount;
    
    notificationFeature.appendChild(notificationBadge);
  }
}

// Chame a função quando a página carregar
window.addEventListener('load', function() {
  updateNotificationBadge();
});