document.addEventListener('DOMContentLoaded', function() {
  // Simular carregamento
  setTimeout(function() {
    document.getElementById('loader').classList.add('fade-out');
    setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
    }, 500);
  }, 1500);

  // Dark Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  });

  // Validação do formulário
  const form = document.querySelector('.auth-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const meterNumber = document.getElementById('meterNumber').value;
    const ownership = document.getElementById('ownership').checked;
    
    if (!meterNumber || !ownership) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Simular envio bem-sucedido
    alert('Hidrômetro vinculado com sucesso! Redirecionando para o dashboard...');
    // window.location.href = 'dashboard.html';
  });

  // Simular leitor de QR Code
  const qrButton = document.querySelector('.secondary-btn');
  if (qrButton) {
    qrButton.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Abrindo leitor de QR Code... Posicione a câmera sobre o código do hidrômetro.');
    });
  }
});