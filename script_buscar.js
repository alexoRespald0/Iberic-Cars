// Supabase config
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const modelosPorMarca = {
  seat: ["Leon", "Ibiza"],
  audi: ["A1", "A3", "A4", "Q5"],
  bmw: ["Serie 1", "Serie 3", "X1", "X5"],
  cupra: ["Formentor", "Leon", "Born"],
  toyota: ["Corolla", "Yaris", "RAV4"],
  volkswagen: ["Golf", "Polo", "Tiguan"],
};

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
    precio: params.get("precio") || "",
  };
}

function llenarModelos(marcaSeleccionada, modeloSeleccionado = "") {
  const selectModelo = document.getElementById("modelo");
  selectModelo.innerHTML = '<option value="">Selecciona modelo</option>';

  if (!marcaSeleccionada || !modelosPorMarca[marcaSeleccionada]) {
    selectModelo.disabled = true;
    return;
  }

  modelosPorMarca[marcaSeleccionada].forEach((modelo) => {
    const option = document.createElement("option");
    option.value = modelo.toLowerCase();
    option.textContent = modelo;
    if (modelo.toLowerCase() === modeloSeleccionado.toLowerCase()) {
      option.selected = true;
    }
    selectModelo.appendChild(option);
  });
  selectModelo.disabled = false;
}

function aplicarFiltrosDesdeURL() {
  const filtros = obtenerParametros();
  document.getElementById("marca").value = filtros.marca;
  llenarModelos(filtros.marca, filtros.modelo);
  document.getElementById("transmision").value = filtros.transmision;
  document.getElementById("combustible").value = filtros.combustible;
  document.getElementById("año").value = filtros.año;
  document.getElementById("color").value = filtros.color;
  document.getElementById("puertas").value = filtros.puertas;
  document.getElementById("precio").value = filtros.precio || 1000;
  const etiquetaPrecio = document.querySelector(".precio-valor");
  if (etiquetaPrecio) etiquetaPrecio.textContent = `${filtros.precio || 1000}€`;
}

async function cargarCoches(pagina = 1) {
  const filtros = obtenerParametros();
  const desde = (pagina - 1) * cochesPorPagina;
  const hasta = desde + cochesPorPagina - 1;

  let query = supabaseClient.from("coches").select("*", { count: "exact" });

  if (filtros.marca) query = query.ilike("marca", `%${filtros.marca}%`);
  if (filtros.modelo) query = query.ilike("modelo", `%${filtros.modelo}%`);
  if (filtros.transmision) query = query.eq("transmision", filtros.transmision);
  if (filtros.combustible) query = query.eq("combustible", filtros.combustible);
  if (filtros.año) query = query.eq("anio", filtros.año);
  if (filtros.color) query = query.ilike("color", `%${filtros.color}%`);
  if (filtros.puertas) query = query.eq("puertas", parseInt(filtros.puertas));
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
          <div class="spec-item">Puertas: ${coche.num_puertas || "No especificado"}</div>
          <div class="spec-item">Carrocería: ${coche.carroceria || "No especificado"}</div>
          <div class="spec-item">Transmisión: ${coche.trasmision || "No especificado"}</div>
          <div class="spec-item">Color: ${coche.color || "No especificado"}</div>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });

  totalPaginas = Math.ceil(count / cochesPorPagina);
  paginaActual = pagina;

  actualizarPaginacion();
  // Desplazarse al inicio de los resultados
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

window.addEventListener("DOMContentLoaded", () => {
  aplicarFiltrosDesdeURL();

  document.getElementById("marca").addEventListener("change", (e) => {
    llenarModelos(e.target.value);
  });

  const rango = document.getElementById("precio");
  const etiqueta = document.querySelector(".precio-valor");
  if (rango && etiqueta) {
    rango.addEventListener("input", () => {
      etiqueta.textContent = `${rango.value}€`;
    });
  }

  document.querySelector(".prev").addEventListener("click", () => {
    if (paginaActual > 1) {
      cargarCoches(paginaActual - 1);
    }
  });

  document.querySelector(".next").addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      cargarCoches(paginaActual + 1);
    }
  });

  cargarCoches(); // Página inicial
});
