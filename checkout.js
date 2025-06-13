// Stripe public key
const stripe = Stripe("pk_test_51RZS04QT2UtnpFYA40C4zOFXATHG3vrN0w63QfcYgn5cpPc8Ya3IObynIeVWkcTeG0LAned5IRQzd9mXXrfEjCzL00nb2sYSyG");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}