// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

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
  updateChart(document.querySelector('.filter-buttons button.active').id);
});

// Loading Screen
window.addEventListener('load', function() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      document.querySelectorAll('.animated').forEach(el => el.style.opacity = 1);
    }, 500);
  }, 1500);
});

// Gráfico
const ctx = document.getElementById('consumoChart').getContext('2d');
let chart;
const residents = 4;

// Formatação
function formatConsumption(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' m³';
  return value + ' L';
}

const baseValues = {
  diario: { media: 185, maximo: 320, minimo: 90, porMorador: 46 },
  semanal: { media: 2450, maximo: 3800, minimo: 1900, porMorador: 612 },
  mensal: { media: 9800, maximo: 12500, minimo: 8200, porMorador: 2450 }
};

function generateRealisticData(base, count, variation) {
  return Array.from({ length: count }, () =>
    Math.round(base * (1 + (Math.random() * variation - variation / 2)))
  );
}

const data = {
  diario: generateRealisticData(180, 24, 0.4),
  semanal: generateRealisticData(2400, 7, 0.3),
  mensal: generateRealisticData(9500, 4, 0.2)
};

function calculateStatistics(values, type) {
  const base = baseValues[type];
  const variation = 0.05;
  const media = Math.round(base.media * (1 + (Math.random() * variation - variation / 2)));
  const maximo = Math.round(base.maximo * (1 + (Math.random() * variation - variation / 2)));
  const minimo = Math.round(base.minimo * (1 + (Math.random() * variation - variation / 2)));
  const porMorador = Math.round(base.porMorador * (1 + (Math.random() * variation - variation / 2)));

  document.getElementById('media').textContent = formatConsumption(media);
  document.getElementById('maximo').textContent = formatConsumption(maximo);
  document.getElementById('minimo').textContent = formatConsumption(minimo);
  document.getElementById('porMorador').textContent = formatConsumption(porMorador);
}

function updateChart(type) {
  let labels, values;
  if (type === 'diario') {
    labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    values = data.diario;
  } else if (type === 'semanal') {
    labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    values = data.semanal;
  } else {
    labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    values = data.mensal;
  }

  const isDarkMode = document.body.classList.contains('dark-mode');
  const bgColor = isDarkMode ? 'rgba(58, 107, 200, 0.2)' : 'rgba(42, 79, 149, 0.2)';
  const borderColor = isDarkMode ? '#3a6bc8' : '#2a4f95';
  const textColor = isDarkMode ? '#f1f1f1' : '#666';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consumo de Água',
        data: values,
        borderColor: borderColor,
        backgroundColor: bgColor,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: borderColor,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
          titleColor: isDarkMode ? '#fff' : '#333',
          bodyColor: isDarkMode ? '#fff' : '#666',
          borderColor: borderColor,
          borderWidth: 1,
          callbacks: {
            label: context => formatConsumption(context.parsed.y)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: type === 'diario' ? 50 : type === 'semanal' ? 1500 : 7000,
          suggestedMax: type === 'diario' ? 350 : type === 'semanal' ? 4000 : 13000,
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: value => formatConsumption(value)
          },
          title: { display: true, text: 'Consumo (L/m³)', color: textColor }
        },
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });

  calculateStatistics(values, type);
}

document.querySelectorAll('.filter-buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-buttons button.active').classList.remove('active');
    btn.classList.add('active');
    updateChart(btn.id);
  });
});

updateChart('diario');

window.addEventListener('resize', () => chart?.resize());

// Card hover delays
document.querySelectorAll('.stat-card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.05}s`;
});
