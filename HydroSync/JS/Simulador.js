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

// Tabela de Tarifas
const tarifasPorM3 = {
  0: 13.61, 1: 13.61, 2: 13.61, 3: 13.61, 4: 13.61, 5: 13.61, 6: 13.61,
  7: 2.35, 8: 2.41, 9: 2.48, 10: 2.50, 11: 2.56, 12: 2.61, 13: 2.68, 14: 2.72, 15: 2.78,
  16: 2.83, 17: 2.91, 18: 2.98, 19: 3.01, 20: 3.05, 21: 3.12, 22: 3.20, 23: 3.24, 24: 3.29,
  25: 3.32, 26: 3.42, 27: 3.50, 28: 3.56, 29: 3.63, 30: 3.70, 31: 3.82, 32: 3.95, 33: 4.05,
  34: 4.15, 35: 4.26, 36: 4.35, 37: 4.45, 38: 4.53, 39: 4.63, 40: 4.71, 41: 4.78, 42: 4.84,
  43: 4.90, 44: 4.97, 45: 5.03, 46: 5.16, 47: 5.22, 48: 5.31, 49: 5.43, 50: 5.52,
  51: 5.61, 52: 5.69, 53: 5.77, 54: 5.85, 55: 5.92, 56: 5.99, 57: 6.04, 58: 6.11,
  59: 6.19, 60: 6.25, 61: 6.35, 62: 6.44, 63: 6.54, 64: 6.63, 65: 6.71, 66: 6.80,
  67: 6.86, 68: 6.95, 69: 7.02, 70: 7.12, 71: 7.17, 72: 7.24, 73: 7.31, 74: 7.37,
  75: 7.44, 76: 7.50, 77: 7.57, 78: 7.63, 79: 7.70, 80: 7.76, 81: 7.81, 82: 7.88,
  83: 7.95, 84: 8.00, 85: 8.08, 86: 8.14, 87: 8.20, 88: 8.27, 89: 8.33, 90: 8.40,
  91: 8.45, 92: 8.49, 93: 8.53, 94: 8.59, 95: 8.61, 96: 8.67, 97: 8.71, 98: 8.74,
  99: 8.80, 100: 8.84, 101: 8.90, 102: 8.94, 103: 9.02, 104: 9.09, 105: 9.14, 106: 9.23,
  107: 9.29, 108: 9.35, 109: 9.42, 110: 9.47, 111: 9.54, 112: 9.57, 113: 9.62, 114: 9.66,
  115: 9.70, 116: 9.74, 117: 9.78, 118: 9.82, 119: 9.86, 120: 9.93, 121: 9.96, 122: 10.01,
  123: 10.06, 124: 10.08, 125: 10.14, 126: 10.18, 127: 10.23, 128: 10.26, 129: 10.31,
  130: 10.37, 131: 10.40, 132: 10.45, 133: 10.49, 134: 10.55, 135: 10.57, 136: 10.61,
  137: 10.68, 138: 10.71, 139: 10.76, 140: 10.78, 141: 10.80, 142: 10.82, 143: 10.84,
  144: 10.87, 145: 10.89, 146: 10.90, 147: 10.93, 148: 10.95, 149: 10.97, 150: 10.99,
  151: 11.01, 152: 11.03, 153: 11.08, 154: 11.09, 155: 11.10, 156: 11.13, 157: 11.16,
  158: 11.18, 159: 11.20, 160: 11.21, 161: 11.23, 162: 11.27, 163: 11.28, 164: 11.31,
  165: 11.32, 166: 11.33, 167: 11.38, 168: 11.40, 169: 11.42, 170: 11.44, 171: 11.47,
  172: 11.48, 173: 11.51, 174: 11.52, 175: 11.54, 176: 11.58, 177: 11.59, 178: 11.61,
  179: 11.63, 180: 11.65, 181: 11.69, 182: 11.70, 183: 11.72, 184: 11.73, 185: 11.76,
  186: 11.80, 187: 11.82, 188: 11.84, 189: 11.85, 190: 11.89, 191: 11.91, 192: 11.92,
  193: 11.95, 194: 11.96, 195: 11.99, 196: 12.01, 197: 12.03, 198: 12.04, 199: 12.07,
  200: 12.10
};

const tarifaFixa = 13.61;

// Preencher tabela de tarifas
function preencherTabelaTarifas() {
  const tableBody = document.getElementById('tariffTableBody');
  tableBody.innerHTML = '';
  
  // Adicionar faixa fixa (0-6)
  const row1 = document.createElement('tr');
  row1.innerHTML = `
    <td>0 - 6</td>
    <td>R$ ${tarifaFixa.toFixed(2)}</td>
    <td>R$ ${tarifaFixa.toFixed(2)}</td>
  `;
  tableBody.appendChild(row1);
  
  // Adicionar faixas variáveis (7-200)
  for (let i = 7; i <= 200; i += 10) {
    const end = Math.min(i + 9, 200);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i} - ${end}</td>
      <td>R$ ${tarifasPorM3[i].toFixed(2)} - R$ ${tarifasPorM3[end].toFixed(2)}</td>
      <td>R$ ${tarifasPorM3[i].toFixed(2)} - R$ ${tarifasPorM3[end].toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  }
  
  // Adicionar faixa acima de 200
  const lastRow = document.createElement('tr');
  lastRow.innerHTML = `
    <td>200+</td>
    <td>R$ 12,11 por m³</td>
    <td>R$ 12,11 por m³</td>
  `;
  tableBody.appendChild(lastRow);
}

// Função para calcular a conta de água
function calcularContaAgua(consumo) {
  let totalAgua = tarifaFixa;

  for (let m3 = 7; m3 <= consumo; m3++) {
    if (m3 > 200) {
      totalAgua += 12.11;
    } else {
      totalAgua += tarifasPorM3[m3] || 0;
    }
  }

  const totalEsgoto = totalAgua; // 100% da água
  const totalGeral = totalAgua + totalEsgoto;

  return {
    agua: totalAgua.toFixed(2),
    esgoto: totalEsgoto.toFixed(2),
    total: totalGeral.toFixed(2)
  };
}

// Função para formatar valor em reais
function formatarMoeda(valor) {
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Função para determinar a faixa tarifária
function determinarFaixaTarifaria(consumo) {
  if (consumo <= 6) return "Faixa Fixa (até 6 m³)";
  if (consumo <= 20) return "Baixo Consumo (7-20 m³)";
  if (consumo <= 50) return "Consumo Moderado (21-50 m³)";
  if (consumo <= 100) return "Consumo Elevado (51-100 m³)";
  return "Alto Consumo (101+ m³)";
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  preencherTabelaTarifas();
  
  const consumoInput = document.getElementById('consumo');
  const consumoRange = document.getElementById('consumoRange');
  const moradoresInput = document.getElementById('moradores');
  const calcularBtn = document.getElementById('calcularBtn');
  const resultadosDiv = document.getElementById('resultados');
  
  // Sincronizar inputs de consumo
  consumoInput.addEventListener('input', function() {
    const value = Math.min(parseInt(this.value) || 0, 500);
    this.value = value;
    consumoRange.value = Math.min(value, 200);
  });
  
  consumoRange.addEventListener('input', function() {
    consumoInput.value = this.value;
  });
  
  // Calcular ao clicar no botão
  calcularBtn.addEventListener('click', function() {
    const consumo = parseInt(consumoInput.value) || 0;
    const moradores = parseInt(moradoresInput.value) || 1;
    
    if (consumo < 0) {
      alert('Por favor, insira um valor de consumo válido (maior ou igual a zero)');
      return;
    }
    
    const resultado = calcularContaAgua(consumo);
    const consumoPorPessoa = (consumo / moradores).toFixed(1);
    
    // Atualizar resultados
    document.getElementById('valorAgua').textContent = formatarMoeda(resultado.agua);
    document.getElementById('valorEsgoto').textContent = formatarMoeda(resultado.esgoto);
    document.getElementById('valorTotal').textContent = formatarMoeda(resultado.total);
    document.getElementById('consumoPessoa').textContent = `${consumoPorPessoa} m³/pessoa`;
    document.getElementById('faixaTarifaria').textContent = determinarFaixaTarifaria(consumo);
    
    // Mostrar resultados
    resultadosDiv.style.display = 'block';
    
    // Destacar faixa na tabela
    const rows = document.querySelectorAll('.tariff-table tbody tr');
    rows.forEach(row => row.classList.remove('highlight-row'));
    
    if (consumo <= 6) {
      rows[0].classList.add('highlight-row');
    } else {
      const faixa = Math.floor((consumo - 7) / 10) + 1;
      if (faixa < rows.length) {
        rows[faixa].classList.add('highlight-row');
      } else {
        rows[rows.length - 1].classList.add('highlight-row');
      }
    }
    
    // Scroll para resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  
  // Calcular ao pressionar Enter no campo de consumo
  consumoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calcularBtn.click();
    }
  });
});
