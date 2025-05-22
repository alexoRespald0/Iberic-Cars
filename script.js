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

  const rangoPrecio = document.getElementById('rangoPrecio');
  const valorPrecio = document.getElementById('valorPrecio');

  // Actualiza texto y fondo del slider
  function actualizarPrecio() {
    const valor = parseInt(rangoPrecio.value);
    valorPrecio.textContent = `${valor.toLocaleString('es-ES')}€`;

    const min = parseInt(rangoPrecio.min);
    const max = parseInt(rangoPrecio.max);
    const porcentaje = ((valor - min) / (max - min)) * 100;

    // Fondo con progreso visual manteniendo estilo fino
    rangoPrecio.style.background = `linear-gradient(to right, #333 ${porcentaje}%, #ccc ${porcentaje}%)`;
  }

  rangoPrecio.addEventListener('input', actualizarPrecio);
  actualizarPrecio(); // Inicializa al cargar

  // -------------------------------
  // Código para selects Marca/Modelo
  // -------------------------------

  const modelosPorMarca = {
    audi: ["A3", "A4", "Q5", "Q7"],
    bmw: ["Serie 1", "Serie 3", "X5", "X6"],
    cupra: ["Leon", "Ateca", "Formentor", "Terramar"],
    toyota: ["Corolla", "Yaris", "RAV4", "C-HR"],
    volkswagen: ["Golf", "Polo", "T-roc", "Passat"],
  };

  const marcaSelect = document.getElementById('marca');
  const modeloSelect = document.getElementById('modelo');

  marcaSelect.addEventListener('change', function () {
    const marcaSeleccionada = this.value;
    modeloSelect.innerHTML = '';

    if (marcaSeleccionada && modelosPorMarca[marcaSeleccionada]) {
      modeloSelect.disabled = false;

      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Modelo';
      modeloSelect.appendChild(placeholder);

      modelosPorMarca[marcaSeleccionada].forEach(function (modelo) {
        const option = document.createElement('option');
        option.value = modelo.toLowerCase().replace(/\s+/g, '-');
        option.textContent = modelo;
        modeloSelect.appendChild(option);
      });
    } else {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Selecciona marca';
      modeloSelect.appendChild(option);
      modeloSelect.disabled = true;
    }
  });
});
