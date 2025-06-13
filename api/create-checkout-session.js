const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { coches, nombre, direccion, cp, iban, userId } = req.body;

  if (!coches || coches.length === 0) {
    res.status(400).json({ error: 'No hay coches en el pedido' });
    return;
  }

  const line_items = coches.map(coche => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: `${coche.marca} ${coche.modelo} ${coche.año || ''}`,
      },
      unit_amount: Math.round(Number(coche.precio) * 100),
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/pedido-exito.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/pedido-cancelado.html`,
      metadata: {
        nombre, direccion, cp, iban, userId,
        coches: JSON.stringify(coches)
      }
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};