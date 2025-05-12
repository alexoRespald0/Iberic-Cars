// script.js

// Mostrar menú desplegable al hacer clic en 'Cuenta'
document.addEventListener("DOMContentLoaded", () => {
  const cuenta = document.querySelector(".cuenta");
  const dropdown = document.querySelector(".dropdown-menu");

  cuenta.addEventListener("mouseenter", () => {
    dropdown.style.display = "flex";
  });

  cuenta.addEventListener("mouseleave", () => {
    dropdown.style.display = "none";
  });

  dropdown.addEventListener("mouseenter", () => {
    dropdown.style.display = "flex";
  });

  dropdown.addEventListener("mouseleave", () => {
    dropdown.style.display = "none";
  });

  // Lógica para mostrar valores de rango de precios (mínimo y máximo)
  const precioMin = document.getElementById('precioMin');
  const precioMax = document.getElementById('precioMax');
  const valoresPrecio = document.getElementById('valoresPrecio');

  function actualizarValoresPrecio() {
    const min = parseInt(precioMin.value);
    const max = parseInt(precioMax.value);

    // Evitar que el mínimo supere el máximo
    if (min > max) {
      precioMin.value = max;
    }

    // Evitar que el máximo sea menor que el mínimo
    if (max < min) {
      precioMax.value = min;
    }

    valoresPrecio.textContent = `${parseInt(precioMin.value).toLocaleString('es-ES')}€ - ${parseInt(precioMax.value).toLocaleString('es-ES')}€`;

    actualizarBarra();
  }

  function actualizarBarra() {
    const min = parseInt(precioMin.min);
    const max = parseInt(precioMin.max);
    const valorMin = parseInt(precioMin.value);
    const valorMax = parseInt(precioMax.value);

    const porcentajeMin = ((valorMin - min) / (max - min)) * 100;
    const porcentajeMax = ((valorMax - min) / (max - min)) * 100;

    precioMin.style.background = `linear-gradient(to right, #333 ${porcentajeMin}%, #ccc ${porcentajeMin}%)`;
    precioMax.style.background = `linear-gradient(to right, #333 ${porcentajeMax}%, #ccc ${porcentajeMax}%)`;
  }

  precioMin.addEventListener('input', actualizarValoresPrecio);
  precioMax.addEventListener('input', actualizarValoresPrecio);

  actualizarValoresPrecio(); // Inicializar al cargar
});

// Diccionario de marcas y modelos
const modelosPorMarca = {
  audi: ["A3", "A4", "Q5", "Q7"],
  bmw: ["Serie 1", "Serie 3", "X5", "X6"],
  cupra: ["Leon", "Ateca", "Formentor", "Terramar"],
  toyota: ["Corolla", "Yaris", "RAV4", "C-HR"],
  volkswagen: ["Golf", "Polo", "T-roc", "Passat"],
};

// Obtener los selects
const marcaSelect = document.getElementById('marca');
const modeloSelect = document.getElementById('modelo');

// Escuchar cambios en la marca
marcaSelect.addEventListener('change', function() {
  const marcaSeleccionada = this.value;

  // Limpiar los modelos anteriores
  modeloSelect.innerHTML = '';

  if (marcaSeleccionada && modelosPorMarca[marcaSeleccionada]) {
    // Habilitar el select de modelo
    modeloSelect.disabled = false;

    // Añadir un placeholder
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Modelo';
    modeloSelect.appendChild(placeholder);

    // Rellenar modelos correspondientes
    modelosPorMarca[marcaSeleccionada].forEach(function(modelo) {
      const option = document.createElement('option');
      option.value = modelo.toLowerCase().replace(/\s+/g, '-');
      option.textContent = modelo;
      modeloSelect.appendChild(option);
    });
  } else {
    // Si no hay marca seleccionada
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Selecciona marca';
    modeloSelect.appendChild(option);
    modeloSelect.disabled = true;
  }
});
