
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

// Efeito de máquina de escrever no subtítulo
const authSubtitles = document.querySelectorAll('.auth-subtitle');
if (authSubtitles.length > 0) {
  authSubtitles.forEach(subtitle => {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 30);
  });
}

// Alternar visibilidade da senha
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const input = this.previousElementSibling;
    const isPassword = input.type === 'password';
    
    input.type = isPassword ? 'text' : 'password';
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
  });
});

// Validação de força da senha (apenas na página de cadastro)
if (document.getElementById('signupPassword')) {
  const passwordInput = document.getElementById('signupPassword');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text span');
  
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Verificar comprimento
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Verificar caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // Verificar números
    if (/\d/.test(password)) strength += 1;
    
    // Verificar maiúsculas e minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // Atualizar barra e texto
    let width = '20%';
    let color = '#e74c3c';
    let text = 'Fraca';
    
    if (strength >= 4) {
      width = '100%';
      color = '#2ecc71';
      text = 'Forte';
    } else if (strength >= 2) {
      width = '60%';
      color = '#f39c12';
      text = 'Média';
    }
    
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
  });
}

// Efeito de parallax no side panel
const sidePanel = document.querySelector('.auth-side-panel');
if (sidePanel) {
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    sidePanel.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  });
}

// Validação de formulário
document.querySelectorAll('.auth-form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Verificar se é a página de cadastro e se as senhas coincidem
    if (this.querySelector('#signupPassword') && this.querySelector('#confirmPassword')) {
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
    }
    
    // Simular envio do formulário
    setTimeout(() => {
      if (window.location.pathname.includes('signin')) {
        // Redirecionar para a página de login após cadastro
        window.location.href = 'Login.html';
      } else {
        // Redirecionar para a página inicial após login
        window.location.href = 'Home.html';
      }
    }, 1000);
  });
});