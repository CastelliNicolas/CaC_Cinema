const URL = "http://127.0.0.1:5000/"
//const URL = "https://sinost.pythonanywhere.com/";
//Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"

// Manejo de metodo GET
export function recibirData(endpoint, method= "GET", msgError, msgExito, needCredentials=false){
    const options = {method: method};
    if(needCredentials){
        options.credentials = "include";
    }
    return fetch(URL + endpoint, options)
    .then((response) =>{
        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Exito:", msgExito)
        return data;
    })
    .catch((error) => {
        mostrarMensaje(msgError, "red")
        console.error("Error", error)
    })
}
// Manejo de metodo POST y PUT
export function enviarData(endpoint, method, body, msgError, msgExito, needCredentials=false, isBodyJSON=false){
    const defaultOptions = {
        method: method,
        body: body
    }
    
    if(needCredentials){
        defaultOptions.credentials = "include";
    }

    if(isBodyJSON){
        defaultOptions.headers = { 'Content-Type': 'application/json' }
    }
    
    return fetch(URL + endpoint, defaultOptions)
    .then((response) => {
        if(response.ok){
            return response.json();
        } else {
            return response.json().then(errorData => {
                mostrarMensaje(msgError, "red");
                throw new Error(errorData.error || "Error al cargar");
            });
        }
    })
    .then((data) => {
        mostrarMensaje(msgExito, "green");
        return data
    })
}

//Manejo de metodo DELETE
export function borrarData(endpoint, method, msgError, msgExito){
    if(confirm("¿Esta seguro que desea eliminar este elemento?")){
        return fetch(URL + endpoint, {
            method: method
        })
        .then((response) => {
            if(response.ok){
                mostrarMensaje(msgExito, "green")
                return response.json()
            } else{
                throw new Error("Error en la solicitud", response.statusText);
            }
            
        })
        .catch((error) => {
            mostrarMensaje(msgError, "red")
            console.error("Error:", error)
        })

    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, color) {
    let mensajeErrorElemento = document.getElementById("mensajeError");
    if (mensajeErrorElemento) {
      mensajeErrorElemento.style.display = "block";
      mensajeErrorElemento.textContent = mensaje;
      mensajeErrorElemento.style.color = color;
      mensajeErrorElemento.style.textAlign = "center";
      setTimeout(ocultarMensaje, 3000)
    } else{
        console.error("Elemento con id 'mensajeError' no encontrado en el DOM.")
        console.log(mensaje)
    }
  }

function ocultarMensaje(){
    let mensajeErrorElemento = document.getElementById("mensajeError");
    mensajeErrorElemento.style.display = "none";
}