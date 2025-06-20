document.addEventListener('DOMContentLoaded', () => {
  const supabaseClient = supabase.createClient(
    'https://yhcivepnywbvskalfqfd.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w'
  );

  const form = document.getElementById('reset-form');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nueva = document.getElementById('new-password').value;
    const repetir = document.getElementById('confirm-password').value;

    mensaje.textContent = '';

    if (nueva.length < 6) {
      mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      mensaje.style.color = 'orange';
      return;
    }

    if (nueva !== repetir) {
      mensaje.textContent = 'Las contraseñas no coinciden.';
      mensaje.style.color = 'red';
      return;
    }

    const { error } = await supabaseClient.auth.updateUser({ password: nueva });

    if (error) {
      mensaje.textContent = '❌ Error al cambiar contraseña: ' + error.message;
      mensaje.style.color = 'red';
    } else {
      mensaje.textContent = '✅ Contraseña cambiada correctamente. Puedes iniciar sesión.';
      mensaje.style.color = 'green';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    }
  });
});
