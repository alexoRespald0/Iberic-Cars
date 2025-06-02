const chatBody = document.getElementById("chat-body");

const respuestas = [
  { claves: ["suv"], respuesta: "Tenemos Audi Q5, Hyundai Tucson, BMW X3, entre otros SUV." },
  { claves: ["eléctrico"], respuesta: "Contamos con Tesla Model 3, Kia EV6, Nissan Leaf, etc." },
  { claves: ["deportivo"], respuesta: "Modelos deportivos: Ford Mustang, BMW M3, Audi S3..." },
  { claves: ["opciones", "financiación"], respuesta: "Ofrecemos hasta 60 meses con o sin entrada." },
  { claves: ["entrada"], respuesta: "Sí, puedes financiar sin entrada. ¡Te asesoramos!" },
  { claves: ["meses", "plazos"], respuesta: "Puedes financiar entre 12 y 60 meses." },
  { claves: ["garantía"], respuesta: "2 años en coches nuevos y 1 año en seminuevos." },
  { claves: ["mantenimiento"], respuesta: "Ofrecemos servicio oficial de mantenimiento y revisiones." },
  { claves: ["seguro"], respuesta: "Tenemos seguros a buen precio con aseguradoras aliadas." },
  { claves: ["ubicación", "dirección"], respuesta: "Estamos en Calle Gran Vía 123, Madrid." },
  { claves: ["horario"], respuesta: "Abrimos de lunes a viernes de 9:00 a 18:00 y sábados hasta las 14:00." },
  { claves: ["contactar", "correo", "teléfono"], respuesta: "Llámanos al 912 345 678 o escribe a info@autogalaxy.com" }
];

function responderRapido(mensaje) {
  chatBody.innerHTML += `<div class="user-msg">${mensaje}</div>`;
  const mensajeLimpio = mensaje.toLowerCase();
  const respuesta = buscarRespuesta(mensajeLimpio);
  setTimeout(() => {
    chatBody.innerHTML += `<div class="bot-msg">${respuesta}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 300);
}

function buscarRespuesta(mensaje) {
  for (const item of respuestas) {
    if (item.claves.some(p => mensaje.includes(p))) {
      return item.respuesta;
    }
  }
  return "No tengo esa información aún 🤖. ¡Pero seguimos mejorando!";
}

function mostrarMenu(menuId) {
  document.querySelectorAll(".submenu").forEach(m => m.style.display = "none");
  document.getElementById("menu-principal").style.display = "none";
  document.getElementById(`menu-${menuId}`).style.display = "flex";
}

function volverMenu() {
  document.querySelectorAll(".submenu").forEach(m => m.style.display = "none");
  document.getElementById("menu-principal").style.display = "flex";
}

const toggleButton = document.getElementById("toggle-chat");
const chatWindow = document.getElementById("chatbot");
const closeButton = document.getElementById("close-chat");

toggleButton.addEventListener("click", () => {
  chatWindow.classList.toggle("open");
  toggleButton.textContent = chatWindow.classList.contains("open") ? "❌" : "💬";
});

closeButton.addEventListener("click", () => {
  chatWindow.classList.remove("open");
  toggleButton.textContent = "💬";
});
