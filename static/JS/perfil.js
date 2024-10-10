const URL = "http://127.0.0.1:5000/"

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
        let nombre_usuario = document.getElementById("nombre-perfil");
        let correo_usuario = document.getElementById("correo-perfil");
        let celular_usuario = document.getElementById("cel-perfil");
        
        nombre_usuario.value = data.nombre;
        correo_usuario.value = data.email;
        celular_usuario.value = data.celular;

    })
    .catch(function(error){
        console.error("Error al obtener datos:", error);
    })