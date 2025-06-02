
document.addEventListener('DOMContentLoaded', () => {
  // Reemplaza con los valores de tu proyecto Supabase
const supabaseUrl = 'https://yhcivepnywbvskalfqfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w'; // tu clave pública real

// Aquí usamos la variable global "window.supabase"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // Elementos del DOM
  const usuarioInput = document.getElementById('usuario');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const mensaje = document.getElementById('mensaje');
  const registroForm = document.getElementById('registro-form');

  // Manejo del envío del formulario
  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = usuarioInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    

    if (!email || !password || !usuario) {
      mensaje.textContent = '⚠️ Todos los campos son obligatorios.';
      return;
    }

    // Paso 1: Registro en Supabase Auth
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signupError) {
      mensaje.textContent = 'Error al registrarse: ' + signupError.message;
      return;
    }

    // Paso 2: Insertar en la tabla "usuario"
    const { error: insertError } = await supabase.from('usuario').insert([{
      usuario: usuario,
      email: email,
      password: password // ⚠️ Idealmente debería cifrarse antes
    }]);

    mensaje.textContent = insertError
      ? 'Error al guardar en tabla usuario: ' + insertError.message
      : '✅ Registro exitoso. Revisa tu email.';
  });
});
