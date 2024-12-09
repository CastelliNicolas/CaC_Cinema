import { enviarData } from "../shared_modules/apiFeedbackHandler.js";

document.getElementById("formulario_user").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitamos que se envíe el formulario

    const formData = new FormData(this);
    enviarData("usuario", "POST", formData, "Error al registrar el usuario", "Usuario registrado correctamente")
    .then(function (data) {
        // Aquí puedes manejar los datos JSON recibidos del servidor
        console.log("Success:", data);
    })
});
