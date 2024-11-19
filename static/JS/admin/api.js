const URL = "http://127.0.0.1:5000/"

// Manejo de metodo GET
export function recibirData(endpoint, method= "GET", msgError, msgExito){
    let metodo = {method}
    return fetch(URL + endpoint, metodo)
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
export function enviarData(endpoint, method, formData, msgError, msgExito){
    return fetch(URL + endpoint, {
        method: method,
        body: formData
    } )
    .then((response) => {
        if(response.ok){
            return response.json();
        } else {
            throw new Error("Error al cargar");
        }
    })
    .then((data) => {
        mostrarMensaje(msgExito, "green");
    })
    .catch((error) => {
        console.error("Error:", error);
        mostrarMensaje(msgError, "red");
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
    }
  }

function ocultarMensaje(){
    let mensajeErrorElemento = document.getElementById("mensajeError");
    mensajeErrorElemento.style.display = "none";
}