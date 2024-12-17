import { enviarData } from "../shared_modules/apiFeedbackHandler.js";

let formulario = document.getElementById("formulario_user")
let difuminado = document.getElementById("difuminado")
let msgLogon = document.getElementById("msgLogon")
let parrafoLogon = document.getElementById("msgSuccesfull")


formulario
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitamos que se envíe el formulario

    const formData = new FormData(this);
    enviarData(
      "usuario",
      "POST",
      formData,
      "Error al registrar el usuario",
      "Usuario registrado correctamente"
    )
      .then(() => {
        formulario.style.display = "none"
        difuminado.textContent = ""
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
        const rutaPosteriorLogin = localStorage.getItem("rutaPosteriorLogin");
        if(rutaPosteriorLogin){
          parrafoLogon.textContent ="¡Bienvenido! Inicia sesión para acceder a tu cuenta y seguir tu compra."
        } else{
          parrafoLogon.textContent ="¡Bienvenido! Inicia sesión para acceder a tu cuenta."
        }
        msgLogon.style.display = "flex"
        setTimeout(() => {
            window.location.href = "sesion.html";
        }, 7000)
      })
      .catch((error) => {
        console.error(error);
      });
  });
