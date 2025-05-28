const precioInput = document.getElementById("precio");
const precioValor = document.querySelector(".precio-valor");

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

// Mostrar el valor seleccionado y actualizar el fondo de la barra
precioInput.addEventListener("input", function () {
    // Mostrar el valor actual del precio
    precioValor.textContent = `${precioInput.value}€`;

    // Calcular el porcentaje del valor actual respecto al máximo
    const porcentaje = (precioInput.value / precioInput.max) * 100;

    // Actualizar el fondo de la barra de precio
    precioInput.style.background = `linear-gradient(to right, #333 ${porcentaje}%, #ccc ${porcentaje}%)`;
});