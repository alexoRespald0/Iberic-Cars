// Supabase config
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

window.addEventListener("DOMContentLoaded", async () => {
  const btnSesion = document.getElementById('btn-sesion');
  const loginButton = btnSesion.querySelector('button');

  const { data, error } = await supabaseClient.auth.getUser();
  const favoritosItem = document.getElementById('favoritos-item');

if (data.user) {
  // Usuario logueado
  loginButton.textContent = 'Cerrar sesión';
  btnSesion.removeAttribute('href');
  btnSesion.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  });

  // Mostrar menú de Favoritos
  if (favoritosItem) {
    favoritosItem.style.display = 'inline-block';
  }

} else {
  // Usuario NO logueado
  loginButton.textContent = 'Acceder';
  btnSesion.setAttribute('href', 'login.html');
  if (favoritosItem) {
    favoritosItem.style.display = 'none';
  }
}

    // Si es una recarga (F5), reseteamos el formulario y limpiamos la URL
  if (performance.navigation.type === 1) {
    document.getElementById("filtros").reset();
    history.replaceState({}, document.title, window.location.pathname);
  }

  await cargarOpcionesFiltro();
  aplicarFiltrosDesdeURL();
  cargarCoches();
});

let paginaActual = 1;
const cochesPorPagina = 5;
let totalPaginas = 1;

function obtenerParametros() {
  const params = new URLSearchParams(window.location.search);
  return {
    marca: params.get("marca") || "",
    modelo: params.get("modelo") || "",
    transmision: params.get("transmision") || "",
    combustible: params.get("combustible") || "",
    año: params.get("año") || "",
    color: params.get("color") || "",
    puertas: params.get("puertas") || "",
    carroceria: params.get("carroceria") || "",
    precio: params.get("precio") || "",
  };
}

function llenarSelect(id, opciones) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = `<option value="">Selecciona ${id}</option>`;
  opciones.sort().forEach((op) => {
    const option = document.createElement("option");
    option.value = op;
    option.textContent = op;
    select.appendChild(option);
  });
}

async function cargarOpcionesFiltro() {
  const { data, error } = await supabaseClient.from("coches").select(`
    marca,
    modelo,
    transmision,
    combustible,
    año,
    color,
    puertas,
    carroceria
  `);

  if (error) {
    console.error("Error cargando filtros:", error);
    return;
  }

  window.cochesRaw = data;
  const marcas = [...new Set(data.map(c => c.marca).filter(Boolean))];
  const transmisiones = [...new Set(data.map(c => c.transmision).filter(Boolean))];
  const combustibles = [...new Set(data.map(c => c.combustible).filter(Boolean))];
  const años = [...new Set(data.map(c => c.año).filter(Boolean))].sort((a, b) => b - a);
  const colores = [...new Set(data.map(c => c.color).filter(Boolean))];
  const puertas = [...new Set(data.map(c => c.puertas).filter(Boolean))];
  const carrocerias = [...new Set(data.map(c => c.carroceria).filter(Boolean))];

  llenarSelect("marca", marcas);
  llenarSelect("transmision", transmisiones);
  llenarSelect("combustible", combustibles);
  llenarSelect("año", años);
  llenarSelect("color", colores);
  llenarSelect("puertas", puertas);
  llenarSelect("carroceria", carrocerias);
}

function actualizarPrecio(valor) {
  const precioInput = document.getElementById('precio');
  const precioValor = document.querySelector('.precio-valor');
  const min = +precioInput.min;
  const max = +precioInput.max;
  const porcentaje = ((valor - min) / (max - min)) * 100;
  if (precioValor) precioValor.textContent = `${valor}€`;
  if (precioInput) precioInput.style.background = `linear-gradient(to right, black 0%, black ${porcentaje}%, #ddd ${porcentaje}%, #ddd 100%)`;
}

function aplicarFiltrosDesdeURL() {
  const filtros = obtenerParametros();
  document.getElementById("marca").value = filtros.marca;
  document.getElementById("transmision").value = filtros.transmision;
  document.getElementById("combustible").value = filtros.combustible;
  document.getElementById("año").value = filtros.año;
  document.getElementById("color").value = filtros.color;
  document.getElementById("puertas").value = filtros.puertas;
  const carroceriaSelect = document.getElementById("carroceria");
	[...carroceriaSelect.options].forEach(opt => {
  if (opt.value.toLowerCase() === filtros.carroceria.toLowerCase()) {
    carroceriaSelect.value = opt.value;
  }
	});

  const precioRange = document.getElementById("precio");
  const etiquetaPrecio = document.querySelector(".precio-valor");
  if (filtros.precio) {
    precioRange.value = filtros.precio;
  } else {
    precioRange.value = precioRange.max;
  }

  actualizarPrecio(precioRange.value);

  if (filtros.marca) {
    const modelos = [...new Set(window.cochesRaw
      .filter(c => c.marca.toLowerCase() === filtros.marca.toLowerCase())
      .map(c => c.modelo).filter(Boolean))];
    llenarSelect("modelo", modelos);
    document.getElementById("modelo").value = filtros.modelo;
    document.getElementById("modelo").disabled = modelos.length === 0;
  }
}

async function cargarCoches(pagina = 1) {
  const filtros = obtenerParametros();
  const desde = (pagina - 1) * cochesPorPagina;
  const hasta = desde + cochesPorPagina - 1;

  let query = supabaseClient.from("coches").select("*", { count: "exact" });

  if (filtros.marca) query = query.ilike("marca", `%${filtros.marca}%`);
  if (filtros.modelo) query = query.ilike("modelo", `%${filtros.modelo}%`);
  if (filtros.transmision) query = query.ilike("transmision", `%${filtros.transmision}%`);
  if (filtros.combustible) query = query.ilike("combustible", `%${filtros.combustible}%`);
  if (filtros.año) query = query.eq("año", filtros.año);
  if (filtros.color) query = query.ilike("color", `%${filtros.color}%`);
  if (filtros.puertas) query = query.eq("puertas", parseInt(filtros.puertas));
  if (filtros.carroceria) query = query.ilike("carroceria", `%${filtros.carroceria}%`);
  if (filtros.precio) query = query.lte("precio", parseInt(filtros.precio));

  query = query.range(desde, hasta);

  const { data: coches, count, error } = await query;
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";

  if (error) {
    contenedor.innerHTML = `<p>Error al cargar coches: ${error.message}</p>`;
    console.error(error);
    return;
  }

  if (!coches || coches.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron coches con esos filtros.</p>";
    totalPaginas = 1;
    paginaActual = 1;
    actualizarPaginacion();
    return;
  }

  coches.forEach((coche) => {
    const card = document.createElement("div");
    card.className = "coche-card";
    card.innerHTML = `
      
      <img src="${coche.imagenprincipal || 'Imagenes/default-car.png'}" alt="${coche.marca} ${coche.modelo}" />
      <div class="coche-info">
        <h3 class="titulo-coche">${coche.marca} ${coche.modelo}</h3>
        <div class="especificaciones-grid">
          <div class="spec-item">Marca: ${coche.marca || "No especificado"}</div>
          <div class="spec-item">Modelo: ${coche.modelo || "No especificado"}</div>
          <div class="spec-item">Año: ${coche.año || "No especificado"}</div>
          <div class="spec-item">Precio: ${coche.precio ? coche.precio + " €" : "No disponible"}</div>
          <div class="spec-item">Combustible: ${coche.combustible || "No especificado"}</div>
          <div class="spec-item">Puertas: ${coche.puertas || "No especificado"}</div>
          <div class="spec-item">Carrocería: ${coche.carroceria || "No especificado"}</div>
          <div class="spec-item">Transmisión: ${coche.transmision || "No especificado"}</div>
          <div class="spec-item">Color: ${coche.color || "No especificado"}</div>
        </div>
      </div>
	  
    `;
	
	card.addEventListener("click", () => {
	  // Redirigir a anuncio.html pasando el id como parámetro en la URL
	  window.location.href = `anuncio.html?id=${coche.id_coche}`;
	});
	
    contenedor.appendChild(card);
  });

  totalPaginas = Math.ceil(count / cochesPorPagina);
  paginaActual = pagina;
  actualizarPaginacion();
  document.querySelector(".resultados").scrollIntoView({ behavior: "smooth" });
}

function actualizarPaginacion() {
  const span = document.querySelector(".pagina-actual");
  const btnPrev = document.querySelector(".prev");
  const btnNext = document.querySelector(".next");

  span.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  btnPrev.disabled = paginaActual === 1;
  btnNext.disabled = paginaActual === totalPaginas;
}

document.getElementById("marca").addEventListener("change", (e) => {
  const marcaSeleccionada = e.target.value.toLowerCase();
  const modelos = [...new Set(window.cochesRaw
    .filter(c => c.marca.toLowerCase() === marcaSeleccionada)
    .map(c => c.modelo).filter(Boolean))];
  llenarSelect("modelo", modelos);
  document.getElementById("modelo").disabled = modelos.length === 0;
});

document.querySelector(".prev").addEventListener("click", () => {
  if (paginaActual > 1) cargarCoches(paginaActual - 1);
});

document.querySelector(".next").addEventListener("click", () => {
  if (paginaActual < totalPaginas) cargarCoches(paginaActual + 1);
});
