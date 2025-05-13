// Reemplaza estos valores con los de tu proyecto
const supabaseUrl = 'https://yhcivepnywbvskalfqfd.supabase.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w'; // clave "anon" pública
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mensaje = document.getElementById('mensaje');

// LOGIN
document.getElementById('login-btn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  mensaje.textContent = error
    ? 'Error al iniciar sesión: ' + error.message
    : 'Inicio de sesión exitoso ✅';
});
