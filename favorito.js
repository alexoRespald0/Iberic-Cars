// Configuración de Supabase
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", cargarFavoritos);

async function cargarFavoritos() {
  const lista = document.querySelector('.lista-favoritos');
  const vacio = document.querySelector('.vacio');
  const errorBox = document.querySelector('.error');
  lista.innerHTML = "";
  errorBox.style.display = "none";
  vacio.style.display = "none";
  lista.style.display = "flex";

  // 1. Autenticación
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    lista.innerHTML = `<p>Debes iniciar sesión para ver tus favoritos.</p>`;
    vacio.style.display = "none";
    return;
  }
  const userId = user.id;

  // 2. Obtener favoritos del usuario
  let favoritos;
  try {
    const { data, error } = await supabaseClient
      .from('Favoritos')
      .select('id_coche')
      .eq('id_usuario_uuid', userId);

    if (error) throw error;
    favoritos = data;
  } catch (err) {
    errorBox.textContent = `Error al cargar favoritos: ${err.message}`;
    errorBox.style.display = "block";
    return;
  }
  if (!favoritos || favoritos.length === 0) {
    lista.style.display = "none";
    vacio.style.display = "block";
    return;
  }

  // 3. Obtener los coches favoritos
  const ids = favoritos.map(f => f.id_coche).filter(Boolean);
  if (!ids.length) {
    lista.style.display = "none";
    vacio.style.display = "block";
    return;
  }

  let coches;
  try {
    const { data, error } = await supabaseClient
      .from('coches')
      .select('*')
      .in('id_coche', ids);

    if (error) throw error;
    coches = data;
  } catch (err) {
    errorBox.textContent = `Error al cargar coches: ${err.message}`;
    errorBox.style.display = "block";
    return;
  }

  // 4. Mostrar los favoritos
  lista.innerHTML = "";
  coches.forEach((coche) => {
    const card = document.createElement("article");
    card.className = "favorito-card";
    card.innerHTML = `
      <img src="${coche.imagenprincipal || 'Imagenes/default-car.png'}" alt="${coche.marca || ""} ${coche.modelo || ""}" />
      <div class="info">
        <h3>${coche.marca || ""} ${coche.modelo || ""}</h3>
        <p>${coche.año || ""} · ${coche.combustible || ""} ${coche.kilometros ? `· ${coche.kilometros} km` : ""}</p>
        <p class="precio">${coche.precio ? coche.precio + " €" : ""}</p>
        <div class="acciones">
          <button class="btn-detalles" data-id="${coche.id_coche}">Ver más</button>
          <button class="btn-eliminar" data-id="${coche.id_coche}">Eliminar</button>
        </div>
      </div>
    `;
    lista.appendChild(card);
  });

  // Botón "Ver más"
  lista.querySelectorAll(".btn-detalles").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      window.location.href = `anuncio.html?id_coche=${id}`;
    });
  });

  // Botón "Eliminar favorito"
  lista.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      eliminarFavorito(userId, id);
    });
  });
}

async function eliminarFavorito(userId, idCoche) {
  const errorBox = document.querySelector('.error');
  errorBox.style.display = "none";
  try {
    const { error } = await supabaseClient
      .from('Favoritos')
      .delete()
      .eq('id_usuario_uuid', userId)
      .eq('id_coche', idCoche);
    if (error) throw error;
    cargarFavoritos();
  } catch (err) {
    errorBox.textContent = `Error al eliminar favorito: ${err.message}`;
    errorBox.style.display = "block";
  }
}