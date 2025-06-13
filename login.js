const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mensaje = document.getElementById('mensaje');
const togglePassword = document.getElementById('togglePassword');


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase(); // normalizamos
  const password = passwordInput.value.trim();

  if (!email || !password) {
    mensaje.textContent = ' Debes completar ambos campos.';
    mensaje.style.color = 'orange';
    return;
  }

  // ✅ Verificar si el usuario existe usando la función RPC
  const { data: exists, error: userError } = await supabaseClient.rpc('user_exists', {
    email_input: email
  });

  if (userError) {
    console.error('Error al verificar correo:', userError.message);
    mensaje.textContent = ' Error al verificar el correo.';
    mensaje.style.color = 'red';
    return;
  }

  if (!exists) {
    mensaje.textContent = ' El correo no está registrado.';
    mensaje.style.color = 'red';
    return;
  }

  // 🔐 Si existe, intentar iniciar sesión
  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    mensaje.textContent = ' Contraseña incorrecta.';
    mensaje.style.color = 'red';
    return;
  }

  mensaje.textContent = ' Inicio de sesión exitoso. Redirigiendo...';
  mensaje.style.color = 'green';

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
});

const olvidastePassword = document.getElementById('olvidaste-password');
const resetContainer = document.getElementById('reset-password-container');
const resetBtn = document.getElementById('reset-btn');
const resetInput = document.getElementById('reset-email');
const resetMensaje = document.getElementById('reset-mensaje');

olvidastePassword.addEventListener('click', (e) => {
  e.preventDefault();
  resetContainer.style.display = 'block'; // Mostrar formulario de recuperación
});

resetBtn.addEventListener('click', async () => {
  const email = resetInput.value.trim().toLowerCase();
  resetMensaje.textContent = '';

  if (!email) {
    resetMensaje.textContent = 'Por favor, introduce tu correo.';
    resetMensaje.style.color = 'orange';
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://iberic-cars.vercel.app/reset-contraseña.html' // 🔁 Cambia esto por tu URL real
  });

  if (error) {
    resetMensaje.textContent = '❌ Error: ' + error.message;
    resetMensaje.style.color = 'red';
  } else {
    resetMensaje.textContent = '✅ Se ha enviado un correo para restablecer la contraseña.';
    resetMensaje.style.color = 'green';
  }
});


