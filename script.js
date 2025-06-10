// Supabase config
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


  

document.addEventListener("DOMContentLoaded", async () => {
	
	const btnSesion = document.getElementById('btn-sesion');
	  const loginButton = btnSesion.querySelector('button');

	  const { data, error } = await supabaseClient.auth.getUser();

	  if (data.user) {
	    // Si hay un usuario logueado
	    loginButton.textContent = 'Cerrar sesión';
	    btnSesion.removeAttribute('href'); // Evita que redirija
	    btnSesion.addEventListener('click', async () => {
	      await supabaseClient.auth.signOut();
	      window.location.reload();
	    });
	  } else {
	    // Si no hay sesión
	    loginButton.textContent = 'Acceder';
	    btnSesion.setAttribute('href', 'login.html');
	  };
	
	
	
  const marcaSelect = document.getElementById("marca");
  const modeloSelect = document.getElementById("modelo");
  const añoSelect = document.querySelector("select[name='año']");

  async function cargarFiltrosDesdeBD() {
    const { data, error } = await supabaseClient.from("coches").select("marca, modelo, año");

    if (error || !data) {
      console.error("Error cargando filtros:", error);
      return;
    }

    const marcas = [...new Set(data.map(c => c.marca).filter(Boolean))].sort();
    const modelos = [...new Set(data.map(c => c.modelo).filter(Boolean))].sort();
    const años = [...new Set(data.map(c => c.año).filter(Boolean))].sort((a, b) => b - a);

    marcaSelect.innerHTML = '<option value="">Marca</option>';
    marcas.forEach(m => {
      const option = document.createElement("option");
      option.value = m.toLowerCase();
      option.textContent = m;
      marcaSelect.appendChild(option);
    });

    añoSelect.innerHTML = '<option value="">Año</option>';
    años.forEach(a => {
      const option = document.createElement("option");
      option.value = a;
      option.textContent = a;
      añoSelect.appendChild(option);
    });

    marcaSelect.addEventListener("change", () => {
      const marcaSeleccionada = marcaSelect.value;
      const modelosFiltrados = data.filter(c => c.marca.toLowerCase() === marcaSeleccionada)
                                   .map(c => c.modelo)
                                   .filter(Boolean);
      const modelosUnicos = [...new Set(modelosFiltrados)].sort();

      modeloSelect.innerHTML = "";
      if (modelosUnicos.length) {
        modeloSelect.disabled = false;
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Modelo";
        modeloSelect.appendChild(placeholder);

        modelosUnicos.forEach(m => {
          const option = document.createElement("option");
          option.value = m.toLowerCase().replace(/\s+/g, '-');
          option.textContent = m;
          modeloSelect.appendChild(option);
        });
      } else {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Selecciona marca";
        modeloSelect.appendChild(option);
        modeloSelect.disabled = true;
      }
    });
  }

  await cargarFiltrosDesdeBD();

  // Precio
  const rangoPrecio = document.getElementById('rangoPrecio');
  const valorPrecio = document.getElementById('valorPrecio');
  if (rangoPrecio && valorPrecio) {
    function actualizarPrecio() {
      const valor = parseInt(rangoPrecio.value);
      valorPrecio.textContent = `${valor.toLocaleString('es-ES')}€`;
      const min = parseInt(rangoPrecio.min);
      const max = parseInt(rangoPrecio.max);
      const porcentaje = ((valor - min) / (max - min)) * 100;
      rangoPrecio.style.background = `linear-gradient(to right, #333 ${porcentaje}%, #ccc ${porcentaje}%)`;
    }

    // Establece el valor al máximo y actualiza visualmente
    rangoPrecio.value = rangoPrecio.max;
    actualizarPrecio();

    rangoPrecio.addEventListener('input', actualizarPrecio);
  }

  // Formulario
  const formulario = document.querySelector(".busqueda form");
  formulario?.addEventListener("submit", function (e) {
    e.preventDefault();
    const marca = marcaSelect.value;
    const modelo = modeloSelect.value;
    const año = añoSelect?.value;
    const precio = rangoPrecio?.value;

    const params = new URLSearchParams();
    if (marca) params.append("marca", marca);
    if (modelo) params.append("modelo", modelo);
    if (año) params.append("año", año);
    if (precio) params.append("precio", precio);

    window.location.href = `buscar.html?${params.toString()}`;
  });

  // Carrocería
  document.querySelectorAll(".tipo").forEach(tipo => {
    tipo.addEventListener("click", () => {
      const carroceria = tipo.getAttribute("data-carroceria");
      if (carroceria) {
        window.location.href = `buscar.html?carroceria=${encodeURIComponent(carroceria)}`;
      }
    });
  });
});