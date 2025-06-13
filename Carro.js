// Configuración de Supabase
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", cargarCarro);

async function cargarCarro() {
  const lista = document.querySelector('.lista-carro');
  const vacio = document.querySelector('.vacio');
  const errorBox = document.querySelector('.error');
  lista.innerHTML = "";
  errorBox.style.display = "none";
  vacio.style.display = "none";
  lista.style.display = "flex";

  // 1. Autenticación
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    lista.innerHTML = `<p>Debes iniciar sesión para ver tu Carro.</p>`;
    vacio.style.display = "none";
    return;
  }
  const userId = user.id;

  // 2. Obtener Carro del usuario
  let carro;
  try {
    const { data, error } = await supabaseClient
      .from('carro')
      .select('id_coche')
      .eq('id_usuario_uuid', userId);

    if (error) throw error;
    Carro = data;
  } catch (err) {
    errorBox.textContent = `Error al cargar Carro: ${err.message}`;
    errorBox.style.display = "block";
    return;
  }
  if (!Carro || Carro.length === 0) {
    lista.style.display = "none";
    vacio.style.display = "block";
    return;
  }

  // 3. Obtener los coches Carro
  const ids = Carro.map(f => f.id_coche).filter(Boolean);
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

  // 4. Mostrar el Carro
  lista.innerHTML = "";
  coches.forEach((coche) => {
    const card = document.createElement("article");
    card.className = "carro-card";
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
  const totalCarrito = coches.reduce((acc, coche) => acc + (parseFloat(coche.precio) || 0), 0);

  // Exponerlo globalmente para el script PayPal
  window.totalCarrito = totalCarrito.toFixed(2);

  // Botón "Ver más"
  lista.querySelectorAll(".btn-detalles").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      window.location.href = `anuncio.html?id_coche=${id}`;
    });
  });

  // Botón "Eliminar carro"
  lista.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      eliminarcarro(userId, id);
    });
  });
}

async function eliminarcarro(userId, idCoche) {
  const errorBox = document.querySelector('.error');
  errorBox.style.display = "none";
  try {
    const { error } = await supabaseClient
      .from('carro')
      .delete()
      .eq('id_usuario_uuid', userId)
      .eq('id_coche', idCoche);
    if (error) throw error;
    cargarCarro();
  } catch (err) {
    errorBox.textContent = `Error al eliminar del carrito: ${err.message}`;
    errorBox.style.display = "block";
  }
}
