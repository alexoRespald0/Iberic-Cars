// Inicializa EmailJS
  (function(){
    emailjs.init("UyQIM9Aox3_DlbSNO"); 
  })();

  // Envío del formulario de contacto
  document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Evita recargar la página

    emailjs.sendForm("service_xq57o1c", "template_2hampk2", this)
      .then(function(response) {
        document.getElementById("respuesta-formulario").textContent = 
          "✅ El mensaje se ha enviado correctamente, le responderemos en el menor tiempo posible.";
      }, function(error) {
        document.getElementById("respuesta-formulario").textContent = 
          "❌ Ha ocurrido un error, por favor inténtalo de nuevo.";
        console.error("EmailJS Error:", error);
      });

    this.reset(); // Limpia el formulario
  });

  // --- Supabase: Mostrar favoritos solo si el usuario está logueado ---
  const supabaseUrl = 'https://yhcivepnywbvskalfqfd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  window.addEventListener('DOMContentLoaded', async () => {
    const { data: userData } = await supabase.auth.getUser();
    const favoritosItem = document.getElementById('favoritos-item');

    if (userData?.user) {
      favoritosItem.style.display = 'list-item'; // Mostrar <li> si está en un <ul>
    } else {
      favoritosItem.style.display = 'none';
    }
  });