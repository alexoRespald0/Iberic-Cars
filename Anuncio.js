// Configuración de Supabase
const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let idCocheActual = null;

function cambiarImagenPrincipal(src) {
  const img = document.getElementById('imagen-principal');
  img.src = src;
}

async function cargarCochePorID(id) {
  const { data, error } = await supabaseClient
    .from('coches')
    .select('*')
    .eq('id_coche', id)
    .single();

  if (error) {
    console.error('Error al cargar datos:', error);
    return;
  }

  // Imagen principal
  document.getElementById('imagen-principal').src = data.imagenprincipal || 'Imagenes/default-car.png';

  // Miniaturas (hasta 5 imágenes)
  const miniaturas = document.querySelectorAll('.miniaturas img');
  const imagenes = [data.foto1, data.foto2, data.foto3, data.foto4, data.imagenprincipal];
  miniaturas.forEach((img, index) => {
    img.src = imagenes[index] || 'Imagenes/default-car.png';
    img.onclick = () => cambiarImagenPrincipal(img.src);
  });

  // Título: marca + modelo
  document.querySelector('.detalles-coche h1').textContent = `${data.marca} ${data.modelo}`;

  // Detalles
  const detalles = document.querySelectorAll('.detalles-item');
  detalles[0].innerHTML = `<strong>Año</strong> ${data.año}`;
  detalles[1].innerHTML = `<strong>Combustible</strong> ${data.combustible}`;
  detalles[2].innerHTML = `<strong>Transmisión</strong> ${data.transmision}`;
  detalles[3].innerHTML = `<strong>Puertas</strong> ${data.puertas}`;
  detalles[4].innerHTML = `<strong>Carrocería</strong> ${data.carroceria}`;
  detalles[5].innerHTML = `<strong>Color</strong> ${data.color}`;
  detalles[6].innerHTML = `<strong>Precio</strong> ${data.precio} €`;
  detalles[7] && (detalles[7].innerHTML = `<strong>ID</strong> ${data.id_coche}`);

  // Guarda el id para añadir a favoritos
  idCocheActual = data.id_coche;
}

async function anadirAFavorito() {
  // idCocheActual ya es global
  if (!idCocheActual) {
    alert("¡El coche no está cargado aún!");
    return;
  }
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (!user) {
    alert("Debes iniciar sesión para añadir favoritos.");
    return;
  }
  const userId = user.id;
  console.log("Insertando favorito: usuario", userId, "coche", idCocheActual);

  const { error } = await supabaseClient
    .from('Favoritos')
    .insert([{ id_usuario_uuid: userId, id_coche: idCocheActual }]);

  if (error) {
    if (error.code === "23505") {
      alert("¡Este coche ya está en tus favoritos!");
    } else {
      alert('Error al guardar favorito: ' + error.message);
    }
    return;
  }
  document.getElementById('favorito-msg').style.display = 'inline';
  setTimeout(() => {
    document.getElementById('favorito-msg').style.display = 'none';
  }, 2000);
}

async function anadirAcarro() {
  // idCocheActual ya es global
  if (!idCocheActual) {
    alert("¡El coche no está cargado aún!");
    return;
  }
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (!user) {
    alert("Debes iniciar sesión para añadir al carro.");
    return;
  }
  const userId = user.id;
  console.log("Insertando coche al carro: usuario", userId, "coche", idCocheActual);

  const { error } = await supabaseClient
    .from('carro')
    .insert([{ id_usuario_uuid: userId, id_coche: idCocheActual }]);

  if (error) {
    if (error.code === "23505") {
      alert("¡Este coche ya está en tu carrito!");
    } else {
      alert('Error al guardar en el carro: ' + error.message);
    }
    return;
  }
  document.getElementById('carro-msg').style.display = 'inline';
  setTimeout(() => {
    document.getElementById('carro-msg').style.display = 'none';
  }, 2000);
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idCoche = params.get('id_coche');
  if (idCoche) {
    cargarCochePorID(idCoche);
  } else {
    console.warn("No se proporcionó un ID de coche en la URL.");
    // Aquí podrías mostrar un mensaje o redirigir a otra página
  }
});