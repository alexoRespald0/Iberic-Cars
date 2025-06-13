
(function(){
  // Inicializa EmailJS con tu User ID público (lo obtienes desde tu cuenta EmailJS)
  emailjs.init("UyQIM9Aox3_DlbSNO"); 
})();

// Añade un listener para cuando se envíe el formulario con id "contact-form"
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault(); // Previene que el formulario recargue la página al enviarse

 
  emailjs.sendForm("service_xq57o1c", "template_2hampk2", this)
    .then(function(response) {
		
      // Si el envío fue exitoso, muestra un mensaje de éxito al usuario
      document.getElementById("respuesta-formulario").textContent = 
        "✅ El mensaje se ha enviado correctamente, le responderemos en el menor tiempo posible.";
    }
	
	,function(error) {
      // Si ocurre un error, muestra un mensaje de error y lo imprime en consola
      document.getElementById("respuesta-formulario").textContent = 
        "❌ ha ocurrido un error, por favor intentalo de nuevo.";
      console.error("EmailJS Error:", error);
    });

  // Limpia los campos del formulario después de enviar
  this.reset();
});