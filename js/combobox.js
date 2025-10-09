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

  const optionHTML = (v) => `<option value="${v}">${LABELS[v] || v}</option>`;

  function preencherSelects() {
    const tipo = tipoEl.value;
    const lista = UNITS[tipo] || [];

    deEl.innerHTML = lista.map(optionHTML).join("");
    paraEl.innerHTML = lista.map(optionHTML).join("");

    if(lista.length > 1 && deEl.value === paraEl.value) {
      paraEl.selectedIndex = 1;
    }
  }

  tipoEl.addEventListener("change", preencherSelects);

  preencherSelects();
});
