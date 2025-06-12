const supabaseUrl = 'https://yhcivepnywbvskalfqfd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  let idCocheActual = null;
  let imagenes = [];
  let indiceActual = 0;

  function actualizarImagen() {
    const principal = document.getElementById('imagen-principal');
    principal.src = imagenes[indiceActual] || 'Imagenes/default-car.png';

    const miniaturas = document.querySelectorAll('.miniaturas img');
    miniaturas.forEach((img, index) => {
      img.src = imagenes[index] || 'Imagenes/default-car.png';
      img.classList.toggle('seleccionada', index === indiceActual);
      img.onclick = () => seleccionarImagen(index);
    });
  }

  function cambiarImagen(direccion) {
    if (imagenes.length === 0) return;
    indiceActual = (indiceActual + direccion + imagenes.length) % imagenes.length;
    actualizarImagen();
  }

  function seleccionarImagen(indice) {
    indiceActual = indice;
    actualizarImagen();
  }

  async function cargarCochePorID(id) {
    const { data, error } = await supabase
      .from('coches')
      .select('*')
      .eq('id_coche', id)
      .single();

    if (error) {
      console.error('Error al cargar datos:', error);
      return;
    }

    idCocheActual = data.id_coche;

    imagenes = [
      data.imagenprincipal,
      data.foto1,
      data.foto2,
      data.foto3,
      data.foto4
    ].filter(Boolean);

    indiceActual = 0;
    actualizarImagen();

    // Título
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
  }

  async function anadirAFavorito() {
    if (!idCocheActual) {
      alert("¡El coche no está cargado aún!");
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes iniciar sesión para añadir favoritos.");
      return;
    }

    const { error: insertError } = await supabase
      .from('Favoritos')
      .insert([{ id_usuario_uuid: user.id, id_coche: idCocheActual }]);

    if (insertError) {
      if (insertError.code === "23505") {
        alert("¡Este coche ya está en tus favoritos!");
      } else {
        alert('Error al guardar favorito: ' + insertError.message);
      }
      return;
    }

    document.getElementById('favorito-msg').style.display = 'inline';
    setTimeout(() => {
      document.getElementById('favorito-msg').style.display = 'none';
    }, 2000);
  }

  async function anadirAcarro() {
    if (!idCocheActual) {
      alert("¡El coche no está cargado aún!");
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user) {
      alert("Debes iniciar sesión para añadir al carro.");
      return;
    }

    const { error: insertError } = await supabase
      .from('carro')
      .insert([{ id_usuario_uuid: user.id, id_coche: idCocheActual }]);

    if (insertError) {
      if (insertError.code === "23505") {
        alert("¡Este coche ya está en tu carrito!");
      } else {
        alert('Error al guardar en el carro: ' + insertError.message);
      }
      return;
    }

    document.getElementById('carro-msg').style.display = 'inline';
    setTimeout(() => {
      document.getElementById('carro-msg').style.display = 'none';
    }, 2000);
  }

  window.addEventListener('DOMContentLoaded', async () => {
    // Control de sesión
    const btnSesion = document.getElementById('btn-sesion');
    const loginButton = btnSesion?.querySelector('button');

    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      // Usuario logueado
      if (loginButton) loginButton.textContent = 'Cerrar sesión';
      btnSesion?.removeAttribute('href');
      btnSesion?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.reload();
      });

      const navFavoritos = document.getElementById('nav-favoritos');
      if (navFavoritos) {
        navFavoritos.style.display = 'inline-block';
      }
    } else {
      if (loginButton) loginButton.textContent = 'Acceder';
      btnSesion?.setAttribute('href', 'login.html');
    }

    // Cargar coche por ID
    const params = new URLSearchParams(window.location.search);
    const idCoche = params.get('id') || params.get('id_coche');
    if (idCoche) {
      await cargarCochePorID(idCoche);
    } else {
      console.warn('No se proporcionó un ID de coche en la URL.');
    }
  });