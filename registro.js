const supabaseUrl = "https://yhcivepnywbvskalfqfd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloY2l2ZXBueXdidnNrYWxmcWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODA5ODgsImV4cCI6MjA2MjY1Njk4OH0.Nl2_D3j5MHTuGnIaelVrREqLqQSPE-Z8ciVnaJGVa-w";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {


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

  // 1. Verificar que el usuario no exista en la tabla
  const { data: existingUser, error: userError } = await supabaseClient
    .from('usuario')
    .select('usuario')
    .eq('usuario', usuario)
    .single();

  if (password.includes(' ')) {
  mensaje.textContent = ' La contraseña no puede contener espacios.';
  mensaje.style.color = 'red';
  return; // detiene el envío
}

  if (existingUser) {
    mensaje.textContent = ' Este  nombre de usuario ya está en uso, por favor introduce otro.';
    return;
  }
  if (userError && userError.code !== 'PGRST116') { 
    // PGRST116 significa "no encontrado", que está OK
    mensaje.textContent = 'Error al comprobar nombre de usuario: ' + userError.message;
    return;
  }

  // 2. Intentar registrar con email en Auth
  const { data, error: signupError } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (signupError) {
    if (signupError.message.includes('already registered')) {
      mensaje.textContent = ' Este correo ya está registrado, pulsa en el link e inicia sesión.';
       mensaje.style.color = 'red';
    } else {
      mensaje.textContent = 'Error al registrarse: ' + signupError.message;
    }
    return;
  }

  // 3. Insertar datos en tabla usuario
  const { error: insertError } = await supabaseClient.from('usuario').insert([{
    usuario: usuario,
    email: email,
    password: password // Idealmente cifrar antes
  }]);

  mensaje.textContent = insertError
    ? 'Error al guardar en tabla usuario: ' + insertError.message
    : ' Registro exitoso, redirigiendote a la página de inicio';
    mensaje.style.color = 'green';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
})
});
