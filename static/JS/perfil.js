const URL = "http://127.0.0.1:5000/"

// V
let nombre = "";
let correo = "";
let celular = "";


fetch(URL + "perfil",{
    method: "GET",
    credentials: "include"
})
    .then((response) =>{
        if (response.ok){
            return response.json();
        } else{
            throw new Error("Error al obtener datos de usuario")
        }
    })
    .then((data) =>{
        
        nombre = data.nombre;
        correo = data.email;
        celular = data.celular;
        
        document.getElementById("nombre-perfil").value = nombre;
        document.getElementById("correo-perfil").value = correo;
        document.getElementById("cel-perfil").value = celular;
    })
    .catch(function(error){
        console.error("Error al obtener datos:", error);
    })


// PUT
document.getElementById("btn-perfil-save").addEventListener("click", function(){
    let user_id =  localStorage.getItem("userID");
    console.log(user_id)
    console.log(nombre, correo, celular)
    const nuevo_nombre = document.getElementById("nombre-perfil").value;
    const nuevo_correo = document.getElementById("correo-perfil").value;
    const nuevo_celular = document.getElementById("cel-perfil").value;
    let cambiosPerfil = {email: nuevo_correo};
    console.log(`correo_nuevo: ${nuevo_correo}`);
    console.log(`correo: ${correo}`);
    console.log(`Son iguales: ${correo === nuevo_correo}`);
    console.log(`cel viejo: ${celular}`);
    console.log(`cel nuevo: ${nuevo_celular}`);
    console.log(`Son iguales: ${celular === nuevo_celular}`);
    
    if (nuevo_nombre && nuevo_nombre !== nombre) {
        cambiosPerfil.nombre = nuevo_nombre;
        console.log("nombre true")
    }
    if (nuevo_celular && String(nuevo_celular) !== String(celular)) {
        cambiosPerfil.celular = nuevo_celular;
        console.log("cel true")
    }

    if (Object.keys(cambiosPerfil).length === 1 && nuevo_correo === correo) {
        console.log("No se han realizado cambios.");
        return
    }

    fetch(URL + "usuario/" + user_id,
        {method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },    
        credentials: "include",
        body: JSON.stringify(cambiosPerfil)
    })
    .then((response) =>{
        if (response.ok){
            return response.json();
        } else {
            throw new Error("Error al guardar los cambios de usuario.");
        }
    })
    .then((data)=> {
        window.location.reload();
        console.log("Perfil actualizado correctamente:", data);
    })
    .catch(error => {
        console.error("Error al actualizar el perfil:", error);
    });
})









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