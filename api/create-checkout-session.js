const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    // Correcto: responde con JSON
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { coches, nombre, direccion, cp, userId } = req.body;

  if (!coches || coches.length === 0) {
    // Correcto: responde con JSON
    res.status(400).json({ error: 'No hay coches en el pedido' });
    return;
  }

  try {
    // ... código para crear la sesión ...
    const session = await stripe.checkout.sessions.create({
      // ...
    });
    // Correcto: responde con JSON
    res.status(200).json({ url: session.url });
  } catch (err) {
    // Correcto: responde con JSON
    res.status(500).json({ error: err.message });
  }
};