import { enviarData } from "../shared_modules/apiFeedbackHandler.js";

let errorAlertPass = document.getElementById("formulario-error-pass");
let errorAlertEmail = document.getElementById("formulario-error-email");

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    if (errorAlertEmail.className == "formulario-error" || errorAlertPass.className == "formulario-error"){
        errorAlertEmail.classList.add("formulario-error")
        errorAlertPass.classList.add("formulario-error")
    }
    var formData = new FormData(this);

    enviarData("login", "POST", formData, "Error al iniciar Sesion", "Sesion iniciada", true)
    .then(function (data) {
        // Aquí puedes manejar los datos JSON recibidos del servidor
        console.log("Success:", data);
        localStorage.setItem("userID", data.id);
        const rutaPosteriorLogin = localStorage.getItem("rutaPosteriorLogin");
        if (rutaPosteriorLogin) {
            // Redirigimos a la página de pago u otra
            window.location.href = rutaPosteriorLogin;
            // Borramos la ruta y los datos de compra del Local Storage
            localStorage.removeItem("rutaPosteriorLogin");
        }else{
            window.location.href = "index.html";
        }
    })
    .catch(error => {
        if (error.message === "Correo incorrecto") {
            errorAlertEmail.classList.remove("formulario-error");
        }
        if (error.message === "Contraseña incorrecta") {
            errorAlertPass.classList.remove("formulario-error");
        }
        // Código para manejar errores
        console.error("Error inesperado:", error);
        
    });
});