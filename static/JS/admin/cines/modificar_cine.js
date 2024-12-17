import { recibirData, enviarData, mostrarMensaje} from "/static/JS/shared_modules/apiFeedbackHandler.js";
import { fillArray, findCine} from "../../shared_modules/utils.js";
// Variables de estado para controlar la visibilidad y los datos del formulario
let mostrarDatos = false;
let codigo = "";
let nombre_cine = "";
let direccion = "";
let cant_salas = "";
let msgError = "Error al obtener el cine";
let msgExito = "Cine modificado correctamente";
let listaCines = [];


function obtenerCines(){
    fillArray("cine")
    .then((cinesObtenidos) => {
        listaCines = cinesObtenidos
        console.log(listaCines)
    });
}


function buscarCine(event){
    event.preventDefault()
    let codigo_cine = document.getElementById("codigo").value
    let cineEncontrado = findCine(listaCines, codigo_cine)
    if(cineEncontrado){
        nombre_cine = cineEncontrado.nombre_cine;
        direccion = cineEncontrado.direccion;
        cant_salas = cineEncontrado.cant_salas;
        mostrarDatos = true; 
        console.log("Cine encontrado")
    } else {
        console.log("No se encontro el cine")
        mostrarDatos = false
    }
    console.log("Flag MostrarFormulario: ", mostrarDatos)
    mostrarFormulario();
}

function mostrarFormulario(){
   if(mostrarDatos){
       document.getElementById("nombre_cine").value = nombre_cine;
       document.getElementById("direccion").value = direccion;
       document.getElementById("cant_salas").value = cant_salas;
       document.getElementById("datos-cine").style.display = "block";
    } else {
        document.getElementById("datos-cine").style.display = "none";
        mostrarMensaje("Cine no encontrado", "red")
    }
}

function guardarCambios(event){
    event.preventDefault();
    const formData = new FormData();
    formData.append("codigo", codigo);
    formData.append("nombre_cine", document.getElementById("nombre_cine").value);
    formData.append("direccion", document.getElementById("direccion").value);
    formData.append("cant_salas", document.getElementById("cant_salas").value);
    enviarData("cine/" + codigo, "PUT", formData, msgError, msgExito)
    .then(() => {
        limpiarFormulario();
    })
    .catch(error => {
        console.error("Error al guardar cambios", error);
    });
}

function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("nombre_cine").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("cant_salas").value = "";
    
    codigo = "";
    mostrarDatos = false;
    nombre_cine = "";
    direccion = "";
    cant_salas = "";
    
    document.getElementById("datos-cine").style.display = "none";
}
            
            
document.addEventListener("DOMContentLoaded", obtenerCines);
document.getElementById("form-obtener-cine").addEventListener("submit", buscarCine);
document.getElementById("form-guardar-cambios").addEventListener("submit", guardarCambios);
            