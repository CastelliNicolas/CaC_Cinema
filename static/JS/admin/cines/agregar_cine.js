import { enviarData } from "../apiFeedbackHandler.js";

document.getElementById("formulario_cine").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitamos que se envie el form
    let msgError = "Error al agregar cine.";
    let msgExito = "Se agrego el cine correctamente.";
    var formData = new FormData(this);

    enviarData("cine", "POST", formData, msgError, msgExito)
      // Limpiar el formulario en ambos casos (éxito o error)
      .finally(function () {
        document.getElementById("nombre_cine").value = "";
        document.getElementById("direccion").value = "";
        document.getElementById("cant_salas").value = "";
      });
});