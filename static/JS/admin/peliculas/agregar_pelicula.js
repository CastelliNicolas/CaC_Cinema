import { enviarData } from "../apiFeedbackHandler.js";

// Capturamos el evento de envío del formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault(); // Evitamos que se envie el form

  var formData = new FormData(this);

  enviarData("pelicula", "POST", formData, "Error al agregar pelicula", "Pelicula agregada correctamente")
    //Respuesta OK, muestra una alerta informando que la pelicula se agregó correctamente y limpia los campos del formulario para que puedan ser utilizados para un nuevo producto.
    .then(function (data) {
      console.log("Agregado.");
    })
    // Limpiar el formulario en ambos casos (éxito o error)
    .finally(function () {
      document.getElementById("nombre").value = "";
      document.getElementById("genero").value = "";
      document.getElementById("director").value = "";
      document.getElementById("duracion").value = "";
      document.getElementById("imagen").value = "";
      document.getElementById("trailer").value = "";
      document.getElementById("clasificacion").value = "";
      document.getElementById("sinopsis").value = "";
    });
});
