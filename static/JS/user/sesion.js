const URL = "http://127.0.0.1:5000/";

let errorAlertPass = document.getElementById("formulario-error-pass");
let errorAlertEmail = document.getElementById("formulario-error-email");

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    if (errorAlertEmail.className == "formulario-error" || errorAlertPass.className == "formulario-error"){
        errorAlertEmail.classList.add("formulario-error")
        errorAlertPass.classList.add("formulario-error")
    }
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(URL + "login",
        {method : "POST",
        credentials: "include",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, password: password})
    })
    .then(function(response){
        if (response.ok){
            return response.json();
        } else{
            return response.json().then(error => {
                if(error.error == "Correo incorrecto")
                    errorAlertEmail.classList.remove("formulario-error");
                if(error.error == "Contraseña incorrecta"){
                    errorAlertPass.classList.remove("formulario-error")
                }
                throw new Error(error.error); // Para manejar el error si es necesario
            });
        }
    })
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
    .catch(function (error) {
        // Código para manejar errores
        console.error("Error al iniciar sesion.", error);
    });
});