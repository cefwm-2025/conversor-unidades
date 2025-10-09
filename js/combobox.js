// ===== Mapas de unidades por tipo ====
const UNITS = {
  peso: ["g", "kg", "lb", "oz"],
  comprimento: ["mm", "cm", "m", "km", "in", "mi"],
  temperatura: ["C", "F", "K"],
};

//Rótulos exibidos no <option>

const LABELS = {
  g: "Grama (g)",
  kg: "Quilo (kg)",
  lb: "Libra (lb)",
  oz: "Onça (oz)",
  mm: "Milímetro (mm)",
  cm: "Centímetro (cm)",
  m: "Metro (m)",
  km: "Quilômetro (km)",
  in: "Polegada (in)",
  mi: "Milha (mi)",
  C: "Celsius (°C)",
  F: "Farenheit (°F)",
  K: "Kelvin (°K)",
};

document.addEventListener("DOMContentLoaded", () => {
  // ===== pega elementos do HTML =====
  const tipoEl = document.getElementById("tipoConversao");
  const deEl = document.getElementById("deUnidade");
  const paraEl = document.getElementById("paraUnidade");
  const valorEl = document.getElementById("valor");
  const btnConverter = document.getElementById("btnConverter");
  const resultadoEl = document.getElementById("resultado");

  // ==== Função de notificação (Bootstrap Toast) ====
  function showToast(message, type = "warning") {
  const toastEl = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");

  // garante que começa “hidden” e com a classe de cor correta
  toastEl.className = `toast hide align-items-center text-bg-${type} border-0`;
  toastMsg.textContent = message;

  const toast = new bootstrap.Toast(toastEl); // usa delay/autohide do HTML
  toast.show();
}


  // ==== Habilitar/desabilitar botão Converter ====
  function validarCampos() {
    const temValor = valorEl.value.trim() !== "";
    const temTipo = !!tipoEl.value;
    const temDe = !!deEl.value;
    const temPara = !!paraEl.value;
    btnConverter.disabled = !(temValor && temTipo && temDe && temPara);
  }

  [valorEl, tipoEl, deEl, paraEl].forEach((el) => {
    el.addEventListener("input", validarCampos);
    el.addEventListener("change", validarCampos);
  });
  validarCampos();

  const optionHTML = (v) => `<option value="${v}">${LABELS[v] || v}</option>`;

  function preencherSelects() {
    const tipo = tipoEl.value;
    const lista = UNITS[tipo] || [];

    deEl.innerHTML = lista.map(optionHTML).join("");
    paraEl.innerHTML = lista.map(optionHTML).join("");

    if(lista.length > 1 && deEl.value === paraEl.value) {
      paraEl.selectedIndex = 1;
    }

    // Limpa campo "Resultado" ao alterar o valor do campo "Tipo"
     resultadoEl.value = "";
  }

  tipoEl.addEventListener("change", preencherSelects);

  preencherSelects();


  // Função de conversão das unidades
  function converter(tipo, valor, de, para) {

    let base; // valor convertido para unidade base antes de converter para a desejada

    switch (tipo) {
      case "peso":
        // converte tudo para gramas como base
        const fatorPeso = {
          g: 1,
          kg: 1000,
          lb: 453.59237,
          oz: 28.3495231,
        };
        base = valor * fatorPeso[de];
        return base / fatorPeso[para];

      case "comprimento":
        // converte tudo para metros como base
        const fatorComp = {
          mm: 0.001,
          cm: 0.01,
          m: 1,
          km: 1000,
          in: 0.0254,
          mi: 1609.34,
        };
        base = valor * fatorComp[de];
        return base / fatorComp[para];

      case "temperatura":
        let celsius;

        // converte para Celsius primeiro
        if (de === "C") celsius = valor;
        else if (de === "F") celsius = (valor - 32) * (5 / 9);
        else if (de === "K") celsius = valor - 273.15;

        // converte de Celsius para destino
        if (para === "C") return celsius;
        if (para === "F") return celsius * (9 / 5) + 32;
        if (para === "K") return celsius + 273.15;
        break;

      default:
        return NaN;
    }
  }

  // ===== evento de clique no botão converter =====
    btnConverter.addEventListener("click", () => {
    const tipo = tipoEl.value;
    const de = deEl.value;
    const para = paraEl.value;
    const raw = valorEl.value.trim();

    if (!raw) {
      showToast("Informe um valor para converter!", "warning");
      return;
    }

    const valor = parseFloat(raw.replace(",", "."));
    if (isNaN(valor)) {
      showToast("Digite um número válido (ex: 10,5 ou 10.5).", "danger");
      return;
    }

    if (de === para) {
      showToast("Escolha unidades diferentes para converter.", "info");
      return;
    }

    const resultado = converter(tipo, valor, de, para);
    resultadoEl.value = resultado.toFixed(4);
    showToast("Conversão realizada com sucesso!", "success");
  });


    const btnLimpar = document.getElementById("btnLimpar");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      valorEl.value = "";
      resultadoEl.value = "";
      btnConverter.disabled = true;
      valorEl.focus();
      showToast("Campos limpos.", "secondary");
    });
  }

});
