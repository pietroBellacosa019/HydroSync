 // Tela de Carregamento
    window.addEventListener('load', function() {
      setTimeout(function() {
        const loader = document.getElementById('loader');
        loader.classList.add('fade-out');
        
        setTimeout(function() {
          loader.style.display = 'none';
          document.querySelectorAll('.animated').forEach(el => {
            el.style.opacity = 1;
          });
        }, 500);
      }, 1500);
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
      // Limitar o índice aos slides disponíveis
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }
      
      // Atualizar carrossel
      carousel.style.transform = `translateX(-${index * 100}%)`;
      
      // Atualizar dots
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      
      currentIndex = index;
      
      // Reiniciar o auto slide
      resetAutoSlide();
    }

    // Navegação
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

    // Iniciar auto slide
    startAutoSlide();

    // Pausar auto slide quando o mouse estiver sobre o carrossel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Swipe para dispositivos móveis
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
      if (difference > 50) { // Swipe para a esquerda
        goToSlide(currentIndex + 1);
      } else if (difference < -50) { // Swipe para a direita
        goToSlide(currentIndex - 1);
      }
    }

    // Efeito de hover nos cards com delay
    const cards = document.querySelectorAll('.card, .feature-card');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.05}s`;
    });