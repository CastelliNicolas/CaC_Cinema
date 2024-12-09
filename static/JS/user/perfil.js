import { recibirData, enviarData } from "../shared_modules/apiFeedbackHandler.js";

// V
let btnGuardar = document.getElementById("btn-perfil-save");
let nombreInput = document.getElementById("nombre-perfil");
let correoInput = document.getElementById("correo-perfil");
let celularInput = document.getElementById("cel-perfil");
let formPerfil = document.getElementById("perfilForm");
let perfilGuardado = {};

function obtenerUsuario(){
    recibirData("perfil", "GET", "Error al obtener el perfil de usuario", "Usuario obtenido correctamente", true)
        .then((data) =>{
            
            perfilGuardado = {
                nombre: data.nombre_usuario,
                email: data.email,
                celular: data.celular
            };

            nombreInput.value = data.nombre_usuario;
            correoInput.value = data.email;
            celularInput.value = data.celular;
        })
        .catch(function(error){
            console.error("Error al obtener datos:", error);
        })
}

document.addEventListener("DOMContentLoaded", obtenerUsuario)

// Función para verificar cambios
function verificarCambios() {
    const nombreModificado = nombreInput.value !== perfilGuardado.nombre;
    const correoModificado = correoInput.value !== perfilGuardado.email;
    const celularModificado = String(celularInput.value) !== String(perfilGuardado.celular);

    // Si hubo algún cambio, habilitamos el botón
    if((nombreModificado || correoModificado || celularModificado)){
        btnGuardar.disabled = false;
        btnGuardar.classList.remove("disable");
    }
}


//
nombreInput.addEventListener("input", verificarCambios);
correoInput.addEventListener("input", verificarCambios);
celularInput.addEventListener("input", verificarCambios);


// PUT
function guardarCambiosPerfil(event){
    event.preventDefault();

    let user_id =  localStorage.getItem("userID");
    console.log(user_id)

    const formData = new FormData();
    formData.append("id", user_id)
    formData.append("nombre_usuario", document.getElementById("nombre-perfil").value);
    formData.append("email", document.getElementById("correo-perfil").value);
    formData.append("celular", document.getElementById("cel-perfil").value);

    // Accede a los datos
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    
    enviarData("usuario/" + user_id, "PUT", formData, "Error al guardar cambios de usuario", "Cambios guardados correctamente")
    .then((data)=> {
        window.location.reload();
        console.log("Perfil actualizado correctamente:", data);
    })
    .catch(error => {
        console.error("Error al actualizar el perfil:", error);
    });
}

formPerfil.addEventListener("submit", guardarCambiosPerfil)


// Buttons
let nombreBtn = document.getElementById("btn-perfil-edit-nm");
let emailBtn = document.getElementById("btn-perfil-edit-em");
let celularBtn = document.getElementById("btn-perfil-edit-tl");

function enableInput(inputId){
    let input = document.getElementById(inputId); 
    input.removeAttribute("disabled");
    input.focus();
}

nombreBtn.addEventListener("click", function() {
    enableInput("nombre-perfil");
});
emailBtn.addEventListener("click", function() {
    enableInput("correo-perfil");
});
celularBtn.addEventListener("click", function() {
    enableInput("cel-perfil");
});