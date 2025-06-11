
// Utilidad para generar un número de pedido aleatorio y único
function generarNumeroPedido() {
  const now = Date.now();
  return 'PED' + now + '-' + Math.floor(Math.random() * 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  const pedidoForm = document.getElementById('pedido-form');
  if (!pedidoForm) return;

  pedidoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('pedido-mensaje');
    mensaje.textContent = '';
    mensaje.style.color = 'red';

    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const cp = document.getElementById('cp').value.trim();
    const iban = document.getElementById('iban').value.trim();

    // Validación básica
    if (!nombre || !direccion || !cp || !iban) {
      mensaje.textContent = 'Por favor rellena todos los campos correctamente.';
      return;
    }
    if (!/^[0-9]{5}$/.test(cp)) {
      mensaje.textContent = 'El código postal debe tener 5 dígitos.';
      return;
    }
    if (!/^[A-Z]{2}[0-9]{22}$/.test(iban)) {
      mensaje.textContent = 'El IBAN debe tener 2 letras y 22 números.';
      return;
    }

    // Obtener usuario autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      mensaje.textContent = 'Debes iniciar sesión para tramitar tu pedido.';
      return;
    }
    const userId = user.id;

    // Obtener coches en el carrito del usuario
    let Carro;
    try {
      const { data, error } = await supabaseClient
        .from('carro')
        .select('id_coche')
        .eq('id_usuario_uuid', userId);

      if (error) throw error;
      Carro = data;
    } catch (err) {
      mensaje.textContent = `Error al consultar el carrito: ${err.message}`;
      return;
    }

    if (!Carro || Carro.length === 0) {
      mensaje.textContent = 'No tienes coches en el carrito para tramitar el pedido.';
      return;
    }

    // Obtener detalles de los coches
    const ids = Carro.map(f => f.id_coche).filter(Boolean);
    let coches = [];
    if (ids.length) {
      try {
        const { data, error } = await supabaseClient
          .from('coches')
          .select('*')
          .in('id_coche', ids);

        if (error) throw error;
        coches = data;
      } catch (err) {
        mensaje.textContent = `Error al obtener coches: ${err.message}`;
        return;
      }
    }

    // Generar número de pedido
    const numeroPedido = generarNumeroPedido();

    // Preparar detalles del pedido (puedes guardar en una tabla 'pedidos' si existe)
    const detallesPedido = {
      numero_pedido: numeroPedido,
      id_usuario_uuid: userId,
      nombre,
      direccion,
      cp,
      iban,
      fecha: new Date().toISOString(),
      coches: coches.map(coche => ({
        id_coche: coche.id_coche,
        marca: coche.marca,
        modelo: coche.modelo,
        año: coche.año,
        precio: coche.precio
      }))
    };

    // Guardar el pedido en la tabla 'pedidos'
    try {
      const { error: pedidoError } = await supabaseClient
        .from('pedidos')
        .insert([detallesPedido]);
      if (pedidoError) throw pedidoError;
    } catch (err) {
      mensaje.textContent = `Error al guardar el pedido: ${err.message}`;
      return;
    }

    // Eliminar los coches del carrito del usuario
    try {
      const { error: deleteError } = await supabaseClient
        .from('carro')
        .delete()
        .eq('id_usuario_uuid', userId);
      if (deleteError) throw deleteError;
    } catch (err) {
      mensaje.textContent = `El pedido se guardó pero no se pudo vaciar el carrito: ${err.message}`;
      mensaje.style.color = 'orange';
      return;
    }

    // Mostrar confirmación con número de pedido y detalles
    mensaje.style.color = 'green';
    mensaje.innerHTML = `
      <strong>¡Pedido realizado con éxito!</strong><br>
      Número de pedido: <b>${numeroPedido}</b><br>
      Nombre: ${nombre}<br>
      Dirección: ${direccion}<br>
      Código Postal: ${cp}<br>
      IBAN: ${iban}<br>
      Coches pedidos:<br>
      <ul>${coches.map(coche => `<li>${coche.marca} ${coche.modelo} (${coche.año}) - ${coche.precio} €</li>`).join('')}</ul>
    `;

    // Opcional: limpiar formulario
    pedidoForm.reset();

    // Opcional: recargar el carro visualmente
    if (typeof cargarCarro === 'function') {
      cargarCarro();
    }
  });
});