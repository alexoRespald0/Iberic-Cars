// ... (config supabaseClient igual que en carro.js)
// ¡NO vuelvas a declarar supabaseClient si ya está declarado!

document.addEventListener('DOMContentLoaded', () => {
  const pedidoForm = document.getElementById('pedido-form');
  if (!pedidoForm) return;

  pedidoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('pedido-mensaje');
    mensaje.textContent = '';
    mensaje.style.color = 'red';

    // Validación de campos igual que antes...
    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const cp = document.getElementById('cp').value.trim();
    

    if (!nombre || !direccion || !cp  ) {
      mensaje.textContent = 'Por favor rellena todos los campos correctamente.';
      return;
    }
    if (!/^[0-9]{5}$/.test(cp)) {
      mensaje.textContent = 'El código postal debe tener 5 dígitos.';
      return;
    }
  
    // Obtener usuario autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      mensaje.textContent = 'Debes iniciar sesión para tramitar tu pedido.';
      return;
    }
    const userId = user.id;

    // Obtener coches en el carrito
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

    // Lanzar Checkout de Stripe
    try {
      mensaje.textContent = "Redirigiendo al pago seguro...";
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coches, nombre, direccion, cp, iban, userId
        })
      });
      const result = await response.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        mensaje.textContent = 'No se pudo iniciar el pago: ' + (result.error || 'Error desconocido');
      }
    } catch (err) {
      mensaje.textContent = `Error al iniciar el pago: ${err.message}`;
    }
  });
});