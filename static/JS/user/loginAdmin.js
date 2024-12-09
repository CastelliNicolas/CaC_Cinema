// Escuchar el evento de envío del formulario
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el envío del formulario por defecto

  // Obtener los valores de los campos de entrada
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // Validar si el correo y la contraseña son correctos
  if (email === "admin@gmail.com" && password === "admin") {
    // Redirigir a la página admin.html
    window.location.href = "admin.html";
  } else {
    // Mostrar el mensaje de error si los datos son incorrectos
    //var errorMessage = document.getElementById("error-message");
    //errorMessage.style.display = "block";
  }
});
