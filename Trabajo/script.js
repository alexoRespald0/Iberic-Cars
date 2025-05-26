// script.js

const supabaseUrl = 'https://yhcivepnywbvskalfqfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w'; // tu clave pública real

// Aquí usamos la variable global "window.supabase"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
   const btnSesion = document.getElementById('btn-sesion');
   const loginButton = btnSesion.querySelector('button');

   const { data, error } = await supabase.auth.getUser();

   if (data.user) {
     // Si hay un usuario logueado
     loginButton.textContent = 'Cerrar sesión';
     btnSesion.removeAttribute('href'); // Evita que redirija
     btnSesion.addEventListener('click', async () => {
       await supabase.auth.signOut();
       window.location.reload();
     });
   } else {
     // Si no hay sesión
     loginButton.textContent = 'Acceder';
     btnSesion.setAttribute('href', 'login.html');
   }
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
  

   
  // Ejecutar al cargar

});
